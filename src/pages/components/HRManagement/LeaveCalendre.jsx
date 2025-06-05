import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { getAuth } from 'firebase/auth';
import { ChevronLeft, ChevronRight, Calendar, Users, Clock, MapPin } from 'lucide-react';

const TeamLeaveCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 1)); // Default to June 2025
  const [viewMode, setViewMode] = useState('monthly');
  const [selectedDate, setSelectedDate] = useState(null);
  const [userData, setUserData] = useState(null);
  const [leaveData, setLeaveData] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser;

  const APPROVED_COLOR = '#4CAF50'; // Vibrant green

  // Fetch data from Firestore
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

        const userDocRef = doc(db, 'Users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
          setSelectedUser({ id: user.uid, ...userDoc.data() });
        } else {
          setError('User data not found');
          return;
        }

        const leaveTypesCollectionRef = collection(db, 'LeaveType');
        const leaveTypesSnapshot = await getDocs(leaveTypesCollectionRef);
        const leaveTypesList = leaveTypesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLeaveTypes(leaveTypesList);

        const usersCollectionRef = collection(db, 'Users');
        const usersSnapshot = await getDocs(usersCollectionRef);
        const usersList = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const leaveApplicationsCollectionRef = collection(db, 'LeaveApplication');
        const snapshot = await getDocs(leaveApplicationsCollectionRef);
        const leaveApplications = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Expand multi-day leaves (only Approved leaves)
        const expandedLeaveData = [];
        leaveApplications.forEach((app) => {
          if (app.status !== 'Approved') return;

          const leaveType = leaveTypesList.find((lt) => lt.id === app.leaveTypeId) || {};
          const employee = usersList.find((u) => u.id === app.User_id) || {};
          const start = new Date(app.startDate);
          const end = new Date(app.endDate);

          if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            console.warn(`Invalid dates for application ${app.id}:`, app.startDate, app.endDate);
            return;
          }

          const leaveTypeName = leaveType.LeaveTypeName || app.leaveType || 'Unknown';
          const cellColor = APPROVED_COLOR;

          let currentDate = new Date(start);
          while (currentDate <= end) {
            const dateStr = currentDate.toISOString().split('T')[0];
            expandedLeaveData.push({
              id: app.id + '-' + dateStr,
              date: dateStr,
              employeeName: employee.displayName || 'Unknown',
              leaveType: leaveTypeName,
              status: app.status,
              center: employee.center || 'Unknown',
              department: employee.department || 'Unknown',
              colorCode: APPROVED_COLOR,
              cellColor: APPROVED_COLOR,
              userId: app.User_id,
            });
            currentDate.setDate(currentDate.getDate() + 1);
          }
        });

        setLeaveData(expandedLeaveData);
      } catch (err) {
        setError('Failed to fetch data: ' + err.message);
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    } else {
      setError('No user is signed in');
      setLoading(false);
    }
  }, [user]);

  const leaveTypeColors = (colorCode, leaveType) => {
    const cleanColor = colorCode?.startsWith('#') ? colorCode : `#${colorCode || APPROVED_COLOR}`;
    return `bg-[${cleanColor}99] border-2 border-[${cleanColor}] text-[${cleanColor}] hover:shadow-md`;
  };

  const statusColors = {
    Approved: 'bg-green-100 text-green-800',
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  };

  const getLeaveForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return leaveData.filter((leave) => leave.date === dateStr);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getTodayLeaves = () => {
    const dateStr = new Date().toISOString().split('T')[0];
    return leaveData.filter((leave) => leave.date === dateStr);
  };

  const getWeekDates = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  const getUserLeaveStats = () => {
    if (!selectedUser) return { totalDays: 0, totalWeeks: 0, leaveDates: [] };

    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const leaveDates = leaveData
      .filter(
        (leave) =>
          leave.userId === selectedUser.id &&
          new Date(leave.date).getMonth() === currentMonth &&
          new Date(leave.date).getFullYear() === currentYear &&
          leave.status === 'Approved'
      )
      .map((leave) => leave.date)
      .sort(); // Sort dates for consistent display

    const totalDays = leaveDates.length;
    const totalWeeks = Math.ceil(totalDays / 7);

    return { totalDays, totalWeeks, leaveDates };
  };

  const renderDailyView = () => {
    const todayLeaves = getTodayLeaves();

    return (
      <div>
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-indigo-900">
            Today's Leaves - {new Date().toLocaleDateString()}
          </h3>
        </div>

        {todayLeaves.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="mx-auto mb-2" size={48} />
            <p>No approved leaves scheduled for today</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {todayLeaves.map((leave) => (
              <div
                key={leave.id}
                className="bg-white rounded-lg shadow-md p-4 border-l-4 border-indigo-500 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedUser({ id: leave.userId, displayName: leave.employeeName })}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900">{leave.employeeName}</h4>
                    <p className="text-sm text-gray-600">
                      {leave.department} • {leave.center}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${leaveTypeColors(
                        leave.colorCode,
                        leave.leaveType
                      )}`}
                    >
                      {leave.leaveType}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderWeeklyView = () => {
    const weekDates = getWeekDates();

    return (
      <div>
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-semibold text-indigo-900 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDates.map((date, index) => {
            const leaves = getLeaveForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();
            const cellColor = leaves.length > 0 ? leaves[0].cellColor + 'CC' : null;

            return (
              <div
                key={index}
                className={`min-h-32 p-2 border rounded-lg ${
                  isToday
                    ? 'bg-indigo-50 border-indigo-300'
                    : cellColor
                    ? `bg-[${cellColor}] border-gray-200 hover:bg-gray-50`
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div
                  className={`text-sm font-medium mb-2 ${
                    isToday ? 'text-indigo-900' : 'text-gray-900'
                  }`}
                >
                  {date.getDate()}
                </div>

                <div className="space-y-1">
                  {leaves.map((leave) => (
                    <div
                      key={leave.id}
                      className={`text-xs p-1 rounded border-2 font-semibold ${leaveTypeColors(
                        leave.colorCode,
                        leave.leaveType
                      )} cursor-pointer hover:shadow-sm transition-shadow`}
                      onClick={() => setSelectedUser({ id: leave.userId, displayName: leave.employeeName })}
                    >
                      <div className="font-bold truncate">{leave.employeeName}</div>
                      <div className="truncate">{leave.leaveType}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthlyView = () => {
    const days = getDaysInMonth(currentDate);

    return (
      <div>
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-semibold text-indigo-900 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            if (!day) {
              return <div key={index} className="h-24"></div>;
            }

            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const leaves = getLeaveForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();
            const cellColor = leaves.length > 0 ? leaves[0].cellColor + '80' : null;

            return (
              <div
                key={index}
                className={`h-24 p-1 border rounded-lg cursor-pointer ${
                  isToday
                    ? 'bg-indigo-50 border-indigo-300'
                    : cellColor
                    ? `bg-[${cellColor}] border-gray-200 hover:bg-gray-50`
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedDate(date)}
              >
                <div
                  className={`text-sm font-medium mb-1 ${
                    isToday ? 'text-indigo-900' : 'text-gray-900'
                  }`}
                >
                  {day}
                </div>

                <div className="space-y-1">
                  {leaves.slice(0, 2).map((leave) => (
                    <div
                      key={leave.id}
                      className={`text-xs p-1 rounded border-2 font-semibold ${leaveTypeColors(
                        leave.colorCode,
                        leave.leaveType
                      )} cursor-pointer hover:shadow-sm transition-shadow`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedUser({ id: leave.userId, displayName: leave.employeeName });
                      }}
                    >
                      <div className="font-bold truncate">{leave.employeeName}</div>
                      <div className="truncate">{leave.leaveType}</div>
                    </div>
                  ))}
                  {leaves.length > 2 && (
                    <div className="text-xs text-gray-500">+{leaves.length - 2} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  const { totalDays, totalWeeks, leaveDates } = getUserLeaveStats();

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex gap-6">
      {/* Main Content (Left Card) */}
      <div className="flex-1 min-h-[calc(100vh-3rem)] bg-white rounded-xl shadow-lg p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-indigo-900 flex items-center gap-2">
                <Users className="text-indigo-600" />
                Team Leave Calendar
              </h1>
              <p className="text-gray-600 mt-1">View all team approved leave requests</p>
            </div>

            <div className="flex bg-gray-100 rounded-lg p-1">
              {['daily', 'weekly', 'monthly'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
                    viewMode === mode
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        {viewMode !== 'daily' && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 rounded-lg hover:bg-gray-200 text-gray-600 hover:text-indigo-600"
              >
                <ChevronLeft size={20} />
              </button>

              <h2 className="text-xl font-semibold text-indigo-900">{formatDate(currentDate)}</h2>

              <button
                onClick={() => navigateMonth(1)}
                className="p-2 rounded-lg hover:bg-gray-200 text-gray-600 hover:text-indigo-600"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Calendar View */}
        <div className="min-h-[calc(100vh-12rem)]">
          {viewMode === 'daily' && renderDailyView()}
          {viewMode === 'weekly' && renderWeeklyView()}
          {viewMode === 'monthly' && renderMonthlyView()}
        </div>
      </div>

      {/* Right Sidebar Card */}
      <div className="w-96 bg-white rounded-xl shadow-lg p-6 h-fit sticky top-6">
        <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center gap-2">
          <Users size={20} />
          Leave Summary
        </h3>

        {/* User Leave Details */}
        <div className="mb-6 border-b pb-4">
          {selectedUser ? (
            <>
              <h4 className="font-semibold text-gray-900 text-lg mb-1">{selectedUser.displayName}</h4>
              <p className="text-sm text-gray-600 mb-3">{formatDate(currentDate)}</p>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Total Leave Days: <span className="font-semibold text-gray-900">{totalDays}</span>
                </p>
                <p className="text-sm font-medium text-gray-700">
                  Total Leave Weeks: <span className="font-semibold text-gray-900">{totalWeeks}</span>
                </p>
                <p className="text-sm font-medium text-gray-700">Leave Dates:</p>
                {leaveDates.length > 0 ? (
                  <ul className="text-sm text-gray-600 list-disc list-inside max-h-32 overflow-y-auto pl-2">
                    {leaveDates.map((date, index) => (
                      <li key={index} className="truncate">
                        {new Date(date).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'numeric',
                          year: 'numeric',
                        })}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 italic">No approved leaves this month</p>
                )}
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500 italic">Select a user to view leave summary</p>
          )}
        </div>

        {/* Legend */}
        <div className="border-b pb-4 mb-4">
          <h4 className="font-medium text-gray-900 mb-3 text-base">Legend</h4>
          <div className="space-y-4">
            <div>
              <h5 className="text-sm font-semibold text-gray-700 mb-2">Leave Types</h5>
              <div className="flex flex-wrap gap-2">
                {leaveTypes.map((type) => (
                  <span
                    key={type.id}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${leaveTypeColors(
                      APPROVED_COLOR,
                      type.LeaveTypeName
                    )} transition-colors hover:bg-[${APPROVED_COLOR}CC]`}
                  >
                    {type.LeaveTypeName}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-sm font-semibold text-gray-700 mb-2">Status</h5>
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors.Approved}`}>
                  Approved
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3 text-base">Statistics</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-full">
                <Clock className="text-indigo-600" size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-600">Pending Requests</p>
                <p className="text-base font-semibold text-indigo-900">
                  {leaveData.filter((l) => l.status === 'Pending').length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <Users className="text-green-600" size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-600">On Leave Today</p>
                <p className="text-base font-semibold text-green-900">{getTodayLeaves().length}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <MapPin className="text-purple-600" size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-600">Active Centers</p>
                <p className="text-base font-semibold text-purple-900">
                  {new Set(leaveData.map((l) => l.center)).size}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamLeaveCalendar;