import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { getAuth } from 'firebase/auth';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  Award, 
  TrendingUp, 
  AlertCircle,
  User,
  BarChart3,
  RefreshCw
} from 'lucide-react';

const LeaveBalanceCards = () => {
  const [userData, setUserData] = useState(null);
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser;

  // Fetch user data and leave-related data
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setError('No user is signed in');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch user data
        const userDocRef = doc(db, 'Users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          setError('User data not found');
        }

        // Fetch LeaveType
        const leaveTypesCollectionRef = collection(db, 'LeaveType');
        const leaveTypesSnapshot = await getDocs(leaveTypesCollectionRef);
        const leaveTypes = leaveTypesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch LeavePolicy
        const leavePoliciesCollectionRef = collection(db, 'LeavePolicy');
        const leavePoliciesSnapshot = await getDocs(leavePoliciesCollectionRef);
        const leavePolicies = leavePoliciesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch LeaveApplication for the current user
        const leaveApplicationsCollectionRef = collection(db, 'LeaveApplication');
        const q = query(leaveApplicationsCollectionRef, where('User_id', '==', user.uid));
        const leaveApplicationsSnapshot = await getDocs(q);
        const leaveApplications = leaveApplicationsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Calculate leave balances
        const calculatedBalances = leaveTypes
          .filter((leaveType) => leaveType.ActiveStatus)
          .map((leaveType) => {
            const policy = leavePolicies.find((p) =>
              p.LinkedLeaveTypes?.includes(leaveType.id)
            ) || {};
            const applications = leaveApplications.filter(
              (app) => app.leaveTypeId === leaveType.id && app.status === 'Approved'
            );

            // Calculate booked days
            const bookedBalance = applications.reduce((sum, app) => {
              const start = new Date(app.startDate);
              const end = new Date(app.endDate);
              const days = (end - start) / (1000 * 60 * 60 * 24) + 1;
              return sum + (app.duration === 'Full Day' ? days : days * 0.5);
            }, 0);

            const totalAnnualEntitlement = policy.MonthlyOrYearlyQuota || 0;
            const availableBalance = Math.max(0, totalAnnualEntitlement - bookedBalance);
            const carryForwardBalance = policy.CarryForwardLimit || 0;

            // Map ColorCode to existing color scheme
            const colorMap = {
              '#292a5b': 'indigo',
              '#0000FF': 'blue',
              '#008000': 'green',
              '#800080': 'purple',
              '#FF0000': 'red',
              '#FFC1CC': 'pink',
            };
            const color = colorMap[leaveType.ColorCode] || 'indigo';

            return {
              LeaveType: leaveType.Code || leaveType.id,
              LeaveTypeName: leaveType.LeaveTypeName,
              AvailableBalance: availableBalance,
              BookedBalance: bookedBalance,
              TotalAnnualEntitlement: totalAnnualEntitlement,
              CarryForwardBalance: carryForwardBalance,
              ValidityStart: '2025-01-01',
              ValidityEnd: '2025-12-31',
              color,
            };
          });

        setLeaveBalances(calculatedBalances);
      } catch (err) {
        setError('Failed to fetch data: ' + err.message);
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getColorClasses = (color) => {
    const colorMap = {
      indigo: {
        bg: 'bg-indigo-600',
        light: 'bg-indigo-50',
        text: 'text-indigo-600',
        border: 'border-indigo-200',
      },
      blue: {
        bg: 'bg-blue-600',
        light: 'bg-blue-50',
        text: 'text-blue-600',
        border: 'border-blue-200',
      },
      green: {
        bg: 'bg-green-600',
        light: 'bg-green-50',
        text: 'text-green-600',
        border: 'border-green-200',
      },
      purple: {
        bg: 'bg-purple-600',
        light: 'bg-purple-50',
        text: 'text-purple-600',
        border: 'border-purple-200',
      },
      red: {
        bg: 'bg-red-600',
        light: 'bg-red-50',
        text: 'text-red-600',
        border: 'border-red-200',
      },
      pink: {
        bg: 'bg-pink-600',
        light: 'bg-pink-50',
        text: 'text-pink-600',
        border: 'border-pink-200',
      },
    };
    return colorMap[color] || colorMap.indigo;
  };

  const getUsagePercentage = (booked, total) => {
    return total ? Math.round((booked / total) * 100) : 0;
  };

  const getAvailabilityStatus = (available, total) => {
    const percentage = total ? (available / total) * 100 : 0;
    if (percentage > 70) return { status: 'High', color: 'text-green-600' };
    if (percentage > 30) return { status: 'Medium', color: 'text-yellow-600' };
    return { status: 'Low', color: 'text-red-600' };
  };

  const totalStats = {
    totalEntitlement: leaveBalances.reduce((sum, balance) => sum + balance.TotalAnnualEntitlement, 0),
    totalBooked: leaveBalances.reduce((sum, balance) => sum + balance.BookedBalance, 0),
    totalAvailable: leaveBalances.reduce((sum, balance) => sum + balance.AvailableBalance, 0),
    totalCarryForward: leaveBalances.reduce((sum, balance) => sum + balance.CarryForwardBalance, 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 ml-[300px] flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 ml-[300px] flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 ml-[300px] overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              {userData?.displayName || 'User'}'s Leave Balance Dashboard
            </h1>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200">
            <RefreshCw className="h-5 w-5" />
            Refresh
          </button>
        </div>
        <p className="text-gray-600">Monitor your leave balances across different leave types</p>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Entitlement</p>
              <p className="text-3xl font-bold text-gray-900">{totalStats.totalEntitlement}</p>
            </div>
            <Award className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Booked</p>
              <p className="text-3xl font-bold text-gray-900">{totalStats.totalBooked}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Available</p>
              <p className="text-3xl font-bold text-gray-900">{totalStats.totalAvailable}</p>
            </div>
            <Clock className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Carry Forward</p>
              <p className="text-3xl font-bold text-gray-900">{totalStats.totalCarryForward}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {leaveBalances.length === 0 ? (
          <div className="text-center text-gray-600 col-span-3">
            No leave balances available.
          </div>
        ) : (
          leaveBalances.map((balance, index) => {
            const colors = getColorClasses(balance.color);
            const usagePercentage = getUsagePercentage(balance.BookedBalance, balance.TotalAnnualEntitlement);
            const availabilityStatus = getAvailabilityStatus(balance.AvailableBalance, balance.TotalAnnualEntitlement);
            
            return (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Card Header */}
                <div className={`${colors.bg} px-6 py-4`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">{balance.LeaveType}</h3>
                      <p className="text-indigo-100 text-sm">{balance.LeaveTypeName}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{balance.AvailableBalance}</div>
                      <div className="text-indigo-100 text-xs">Available</div>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {/* Balance Overview */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className={`${colors.light} rounded-lg p-4 text-center`}>
                      <div className={`text-2xl font-bold ${colors.text}`}>
                        {balance.BookedBalance}
                      </div>
                      <div className="text-sm text-gray-600">Booked Balance</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-gray-700">
                        {balance.TotalAnnualEntitlement}
                      </div>
                      <div className="text-sm text-gray-600">Total Entitlement</div>
                    </div>
                  </div>

                  {/* Usage Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Usage Progress</span>
                      <span>{usagePercentage}% used</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`${colors.bg} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${usagePercentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0</span>
                      <span>{balance.TotalAnnualEntitlement}</span>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-4">
                    {/* Carry Forward Balance */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <TrendingUp className={`h-4 w-4 ${colors.text}`} />
                        <span className="text-sm font-medium text-gray-700">Carry Forward</span>
                      </div>
                      <span className="text-lg font-semibold text-gray-900">
                        {balance.CarryForwardBalance} days
                      </span>
                    </div>

                    {/* Availability Status */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertCircle className={`h-4 w-4 ${availabilityStatus.color}`} />
                        <span className="text-sm font-medium text-gray-700">Availability</span>
                      </div>
                      <span className={`text-sm font-semibold ${availabilityStatus.color}`}>
                        {availabilityStatus.status}
                      </span>
                    </div>

                    {/* Validity Period */}
                    <div className={`border-t border-gray-200 pt-4`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className={`h-4 w-4 ${colors.text}`} />
                        <span className="text-sm font-medium text-gray-700">Validity Period</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>{formatDate(balance.ValidityStart)} - {formatDate(balance.ValidityEnd)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className={`${colors.light} px-6 py-3 ${colors.border} border-t`}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Last Updated</span>
                    <span className={`font-medium ${colors.text}`}>
                      {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Action Buttons */}
     
    </div>
  );
};

export default LeaveBalanceCards;