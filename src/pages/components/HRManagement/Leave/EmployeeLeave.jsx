import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle, User, Award, Users } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../../config/firebase';

const EmployeeLeaveBalances = () => {
  const [users, setUsers] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedEmployeeName, setSelectedEmployeeName] = useState('');
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leavePolicies, setLeavePolicies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const usersCollectionRef = collection(db, 'Users');
        const snapshot = await getDocs(usersCollectionRef);
        const userList = snapshot.docs.map((doc) => ({
          id: doc.id,
          displayName: doc.data().displayName || 'Unknown',
        }));
        setUsers(userList);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetch leave types and policies
  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch LeaveType
        const leaveTypesCollectionRef = collection(db, 'LeaveType');
        const leaveTypesSnapshot = await getDocs(leaveTypesCollectionRef);
        const leaveTypesList = leaveTypesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLeaveTypes(leaveTypesList);

        // Fetch LeavePolicy
        const leavePoliciesCollectionRef = collection(db, 'LeavePolicy');
        const leavePoliciesSnapshot = await getDocs(leavePoliciesCollectionRef);
        const leavePoliciesList = leavePoliciesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLeavePolicies(leavePoliciesList);
      } catch (err) {
        console.error('Error fetching leave data:', err);
        setError('Failed to load leave data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaveData();
  }, []);

  // Fetch leave applications when employee is selected
  useEffect(() => {
    if (!selectedEmployee) {
      setLeaveApplications([]);
      return;
    }

    const fetchLeaveApplications = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const leaveApplicationsCollectionRef = collection(db, 'LeaveApplication');
        const q = query(leaveApplicationsCollectionRef, where('User_id', '==', selectedEmployee));
        const snapshot = await getDocs(q);
        const applicationsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLeaveApplications(applicationsList);
      } catch (err) {
        console.error('Error fetching leave applications:', err);
        setError('Failed to load leave applications. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaveApplications();
  }, [selectedEmployee]);

  const handleEmployeeChange = (e) => {
    const employeeId = e.target.value;
    setSelectedEmployee(employeeId);
    const selectedUser = users.find((user) => user.id === employeeId);
    setSelectedEmployeeName(selectedUser ? selectedUser.displayName : '');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getAvailabilityColor = (available, total) => {
    const percentage = total ? (available / total) * 100 : 0;
    if (percentage > 70) return 'text-green-600';
    if (percentage > 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (available, total) => {
    const percentage = total ? (available / total) * 100 : 0;
    if (percentage > 70) return 'bg-green-500';
    if (percentage > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Calculate leave balances dynamically
  const calculateLeaveBalances = () => {
    return leaveTypes.map((leaveType) => {
      const policy = leavePolicies.find((p) => p.LinkedLeaveTypes.includes(leaveType.id)) || {};
      const applications = leaveApplications.filter((app) => app.leaveTypeId === leaveType.id && app.status === 'Approved');
      const booked = applications.reduce((sum, app) => {
        const start = new Date(app.startDate);
        const end = new Date(app.endDate);
        const days = (end - start) / (1000 * 60 * 60 * 24) + 1;
        return sum + (app.duration === 'Full Day' ? days : days * 0.5);
      }, 0);
      const totalEntitlement = policy.MonthlyOrYearlyQuota || 0;
      const available = Math.max(0, totalEntitlement - booked);
      const carryForwarded = applications.reduce((sum, app) => sum + (app.balanceAfterApplication || 0), 0);

      return {
        employee_id: selectedEmployee,
        leave_type_id: leaveType.Code || leaveType.id,
        leave_type_name: leaveType.LeaveTypeName,
        total_entitlement: totalEntitlement,
        booked,
        available,
        carry_forwarded: policy.CarryForwardLimit || carryForwarded,
        validity_start: '2025-01-01',
        validity_end: '2025-12-31',
      };
    });
  };

  const filteredLeaveBalances = selectedEmployee ? calculateLeaveBalances() : [];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <User className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">My Leave Balances</h1>
        </div>
        <p className="text-gray-600">Track your available and booked leave days across different leave types</p>
      </div>

 <div className="w-full md:w-auto mb-6">
  <label htmlFor="employee-select" className="block text-sm font-medium text-gray-700 mb-2 transition-colors duration-200">
    Select Employee
  </label>
  <div className="relative group">
    <select
      id="employee-select"
      value={selectedEmployee}
      onChange={handleEmployeeChange}
      className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 appearance-none cursor-pointer"
      disabled={isLoading}
    >
      <option value="" disabled>
        Select an employee
      </option>
      {isLoading ? (
        <option value="" disabled>
          Loading employees...
        </option>
      ) : users.length === 0 ? (
        <option value="" disabled>
          No employees found
        </option>
      ) : (
        users.map((employee) => (
          <option key={employee.id} value={employee.id}>
            {employee.displayName}
          </option>
        ))
      )}
    </select>
    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
      <svg 
        className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path 
          fillRule="evenodd" 
          d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" 
          clipRule="evenodd" 
        />
      </svg>
    </div>
  </div>
  {error && (
    <p className="text-red-500 text-sm mt-2 flex items-center">
      <svg 
        className="w-4 h-4 mr-1" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path 
          fillRule="evenodd" 
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
          clipRule="evenodd" 
        />
      </svg>
      {error}
    </p>
  )}
</div>

      {isLoading ? (
        <div className="text-center text-gray-600">Loading leave balances...</div>
      ) : filteredLeaveBalances.length === 0 ? (
        <div className="text-center text-gray-600">No leave balances found for selected employee.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredLeaveBalances.map((balance, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="bg-indigo-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">{balance.leave_type_name}</h3>
                  <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {balance.leave_type_id}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Award className="h-5 w-5 text-indigo-600 mr-1" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{balance.total_entitlement}</p>
                    <p className="text-sm text-gray-600">Total Entitlement</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <CheckCircle className="h-5 w-5 text-red-500 mr-1" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{balance.booked}</p>
                    <p className="text-sm text-gray-600">Booked</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Clock
                        className={`h-5 w-5 mr-1 ${getAvailabilityColor(
                          balance.available,
                          balance.total_entitlement
                        )}`}
                      />
                    </div>
                    <p
                      className={`text-2xl font-bold ${getAvailabilityColor(
                        balance.available,
                        balance.total_entitlement
                      )}`}
                    >
                      {balance.available}
                    </p>
                    <p className="text-sm text-gray-600">Available</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Usage Progress</span>
                    <span>
                      {Math.round(
                        balance.total_entitlement
                          ? (balance.booked / balance.total_entitlement) * 100
                          : 0
                      )}
                      % used
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          balance.total_entitlement
                            ? (balance.booked / balance.total_entitlement) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0 days</span>
                    <span>{balance.total_entitlement} days</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-indigo-600" />
                        <span className="text-sm font-medium text-gray-700">Carry Forward</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">{balance.carry_forwarded} days</p>
                      <p className="text-xs text-gray-500">From previous year</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-indigo-600" />
                        <span className="text-sm font-medium text-gray-700">Validity Period</span>
                      </div>
                      <p className="text-sm text-gray-900">{formatDate(balance.validity_start)}</p>
                      <p className="text-sm text-gray-900">to {formatDate(balance.validity_end)}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400">Employee ID: {balance.employee_id}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredLeaveBalances.length > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Leave Balance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-indigo-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-indigo-600">
                {filteredLeaveBalances.reduce((sum, balance) => sum + balance.total_entitlement, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Entitlements</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-red-600">
                {filteredLeaveBalances.reduce((sum, balance) => sum + balance.booked, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Booked</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {filteredLeaveBalances.reduce((sum, balance) => sum + balance.available, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Available</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {filteredLeaveBalances.reduce((sum, balance) => sum + balance.carry_forwarded, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Carry Forward</p>
            </div>
          </div>
        </div>
      )}

      {selectedEmployee && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Leave Applications</h2>
          {isLoading ? (
            <div className="text-center text-gray-600">Loading leave applications...</div>
          ) : leaveApplications.length === 0 ? (
            <div className="text-center text-gray-600">No leave applications found for selected employee.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {leaveApplications.map((application, index) => {
                const leaveType = leaveTypes.find((lt) => lt.id === application.leaveTypeId) || {};
                return (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden w-full max-w-[200px] mx-auto"
                  >
                    <div
                      className="px-3 py-1.5"
                      style={{ backgroundColor: leaveType.ColorCode || '#292a5b' }}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-white truncate">{application.leaveType}</h3>
                        <span
                          className={`text-white px-1.5 py-0.5 rounded-full text-xs font-medium ${
                            application.status === 'Approved'
                              ? 'bg-green-500'
                              : application.status === 'Pending'
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                        >
                          {application.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="grid grid-cols-1 gap-2">
                        <div>
                          <p className="text-xs font-medium text-gray-700">Start Date</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatDate(application.startDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-700">End Date</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatDate(application.endDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeeLeaveBalances;