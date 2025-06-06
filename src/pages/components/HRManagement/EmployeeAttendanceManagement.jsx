import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, Users, BarChart3, Filter, Search, Download } from 'lucide-react';
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { useNavigate } from 'react-router-dom';

const AttendanceDashboard = () => {
  const [activeTab, setActiveTab] = useState('summary');
  const [currentDate, setCurrentDate] = useState('01-Jun-2025 - 07-Jun-2025');
  const [users, setUsers] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const navigate = useNavigate();

  const [selectedEmployeeName, setSelectedEmployeeName] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to format time from ISO string to "HH:MM AM/PM" in IST
  const formatTime = (isoString) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    });
  };

  // Helper function to format date from "YYYY-MM-DD" to "Day, DD-MMM-YYYY"
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Helper function to calculate status
  const calculateStatus = (sessions) => {
    if (!sessions || sessions.length === 0) return 'Absent';
    const hasValidSession = sessions.some((session) => session.checkIn && session.checkOut);
    return hasValidSession ? 'Present' : 'Checked-in only';
  };

  // Fetch users for dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const usersCollectionRef = collection(db, 'Users');
        const snapshot = await getDocs(usersCollectionRef);
        const userList = snapshot.docs.map((doc) => ({
          id: doc.id,
          displayName: doc.data().displayName || 'Unknown',
        }));
        setUsers(userList);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetch attendance and shift data when selectedEmployee changes
  useEffect(() => {
    if (!selectedEmployee) {
      setAttendanceData([]);
      return;
    }

    const fetchAttendanceAndShiftData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const userDocRef = doc(db, 'Users', selectedEmployee);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          setAttendanceData([]);
          return;
        }

        const userData = userDoc.data();
        const dailyDurations = userData.dailyDurations || [];

        const shiftAssignmentsQuery = query(
          collection(db, 'ShiftAssignments'),
          where('userID', '==', selectedEmployee)
        );
        const shiftAssignmentsSnapshot = await getDocs(shiftAssignmentsQuery);
        const shiftAssignments = shiftAssignmentsSnapshot.docs.map((doc) => doc.data());

        const shiftDetails = {};
        for (const assignment of shiftAssignments) {
          const shiftDocRef = doc(db, 'Shifts', assignment.shiftID);
          const shiftDoc = await getDoc(shiftDocRef);
          if (shiftDoc.exists()) {
            shiftDetails[assignment.shiftID] = shiftDoc.data();
          }
        }

        const processedData = dailyDurations.map((entry) => {
          const sessions = entry.sessions || [];
          const earliestCheckIn = sessions.reduce((earliest, session) => {
            if (!session.checkIn) return earliest;
            return !earliest || new Date(session.checkIn) < new Date(earliest)
              ? session.checkIn
              : earliest;
          }, null);

          const latestCheckOut = sessions.reduce((latest, session) => {
            if (!session.checkOut) return latest;
            return !latest || new Date(session.checkOut) > new Date(latest)
              ? session.checkOut
              : latest;
          }, null);

          const totalDuration = parseFloat(entry.totalDuration) || 0;
          let shiftName = '-';
          if (shiftAssignments.length > 0) {
            const latestAssignment = shiftAssignments.reduce((latest, assignment) => {
              const assignedAt = new Date(assignment.assignedAt || '1970-01-01');
              return !latest || assignedAt > new Date(latest.assignedAt || '1970-01-01')
                ? assignment
                : latest;
            }, null);
            shiftName = shiftDetails[latestAssignment.shiftID]?.shiftName || latestAssignment.shiftName || '-';
          }

          return {
            date: formatDate(entry.date),
            firstIn: formatTime(earliestCheckIn),
            lastOut: formatTime(latestCheckOut),
            totalHours: totalDuration ? totalDuration.toFixed(2) : '-',
            paidBreak: '00:00',
            payableHours: totalDuration ? totalDuration.toFixed(2) : '-',
            status: calculateStatus(sessions),
            statusColor:
              calculateStatus(sessions) === 'Present'
                ? 'bg-green-100 text-green-800'
                : calculateStatus(sessions) === 'Checked-in only'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800',
            shift: shiftName,
          };
        });

        setAttendanceData(processedData);
      } catch (err) {
        console.error('Error fetching attendance or shift data:', err);
        setError('Failed to load attendance or shift data');
        setAttendanceData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendanceAndShiftData();
  }, [selectedEmployee]);

  const handleEmployeeChange = (e) => {
    const selectedId = e.target.value;
    setSelectedEmployee(selectedId);
    const selectedUser = users.find((user) => user.id === selectedId);
    setSelectedEmployeeName(selectedUser ? selectedUser.displayName : '');
  };

  const summaryStats = [
    { label: 'Days', value: '7', subtext: 'Payable Days', count: '1 Days', color: 'bg-blue-50 border-blue-200', icon: '📅' },
    { label: 'Hours', value: '52', subtext: 'Present', count: '1 Days', color: 'bg-green-50 border-green-200', icon: '⏱️' },
    { label: 'On Duty', value: '0', subtext: 'Days', count: '0 Days', color: 'bg-purple-50 border-purple-200', icon: '👨‍💼' },
    { label: 'Paid leave', value: '0', subtext: 'Days', count: '0 Days', color: 'bg-orange-50 border-orange-200', icon: '🏖️' },
    { label: 'Holidays', value: '0', subtext: 'Days', count: '0 Days', color: 'bg-pink-50 border-pink-200', icon: '🎉' },
    { label: 'Weekend', value: '2', subtext: 'Days', count: '1 Days', color: 'bg-yellow-50 border-yellow-200', icon: '🌞' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Employee Attendance</h1>
                <p className="text-sm text-gray-500">Track and manage employee attendance records</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="w-full md:w-auto">
              <label htmlFor="employee-select" className="block text-sm font-medium text-gray-700 mb-1">
                Select Employee
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  id="employee-select"
                  value={selectedEmployee}
                  onChange={handleEmployeeChange}
                  className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                >
                  <option value="" disabled>
                    Select an employee
                  </option>
                  {users.length === 0 && !isLoading ? (
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
                <div className="relative flex-grow">
                  <input
                    type="text"
                    value={selectedEmployeeName}
                    readOnly
                    className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm text-gray-700"
                    placeholder="Selected employee"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <div className="flex items-center">
                <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center mx-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-300">
                  <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="font-medium text-gray-900">{currentDate}</span>
                </div>
                <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          {summaryStats.map((stat, index) => (
            <div key={index} className={`p-4 rounded-xl border ${stat.color} transition-all hover:shadow-md`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                  <p className="text-xs text-gray-500 mt-1">{stat.subtext}</p>
                </div>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="text-xs font-medium text-gray-700">{stat.count}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Attendance Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Attendance Records</h2>
              <p className="text-sm text-gray-500">Detailed view of employee attendance</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search records..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 border border-gray-300">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Date', 'First In', 'Last Out', 'Total Hours', 'Paid Break', 'Payable Hours', 'Status', 'Shift(s)'].map((head, idx) => (
                    <th
                      key={idx}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div className="flex items-center">
                        {head}
                        {idx < 3 && (
                          <svg className="ml-1 h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceData.length === 0 && !isLoading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Users className="w-12 h-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          {selectedEmployee ? 'No attendance records found' : 'Select an employee to view records'}
                        </h3>
                        <p className="text-sm text-gray-500 max-w-md text-center">
                          {selectedEmployee 
                            ? 'There are no attendance records available for the selected employee and date range.'
                            : 'Please choose an employee from the dropdown to display their attendance data.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  attendanceData.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{row.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {row.firstIn !== '-' ? (
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-700">{row.firstIn}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {row.lastOut !== '-' ? (
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-700">{row.lastOut}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">
                        {row.totalHours}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">
                        {row.paidBreak}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">
                        {row.payableHours}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold leading-4 ${row.statusColor}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {row.shift}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{attendanceData.length}</span> of{' '}
                <span className="font-medium">{attendanceData.length}</span> results
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                  Previous
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Footer */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Weekly Summary</h3>
                <p className="text-sm text-gray-500">
                  {attendanceData.filter((row) => row.status === 'Present').length} Present •{' '}
                  {attendanceData.filter((row) => row.status === 'Absent').length} Absent •{' '}
                  {attendanceData.filter((row) => row.status === 'Weekend').length} Weekend
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-right">
                <h3 className="text-sm font-medium text-gray-700">Total Payable Hours</h3>
                <p className="text-lg font-semibold text-gray-900">
                  {attendanceData
                    .reduce((sum, row) => sum + (parseFloat(row.payableHours) || 0), 0)
                    .toFixed(2)} hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AttendanceDashboard;