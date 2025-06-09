import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, User, Clock, Search, Filter, Download } from 'lucide-react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';

const OvertimeShiftDashboard = () => {
  const [activeTab, setActiveTab] = useState('overtime');
  const [currentDate, setCurrentDate] = useState('01-Jun-2025 - 07-Jun-2025');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedEmployeeName, setSelectedEmployeeName] = useState('');
  const [dailyDurations, setDailyDurations] = useState([]);

  const sessionColors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-yellow-500',
  ];

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
        console.log('Fetched users:', userList);
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

  useEffect(() => {
    const fetchDailyDurations = async () => {
      if (!selectedEmployee) {
        setDailyDurations([]);
        setError(null);
        return;
      }
      try {
        setIsLoading(true);
        setError(null);
        const userDocRef = doc(db, 'Users', selectedEmployee);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          console.log('User document data:', data);
          if (data.dailyDurations && Array.isArray(data.dailyDurations)) {
            const formattedDurations = data.dailyDurations.map((day) => ({
              date: day.date,
              totalDuration: day.totalDuration,
              sessions: day.sessions.map((session, index) => ({
                sessionNumber: index + 1,
                checkIn: formatTime(session.checkIn),
                checkOut: formatTime(session.checkOut),
                duration: session.duration,
                branchName: session.branchName || 'N/A',
              })),
            }));
            console.log('Formatted dailyDurations:', JSON.stringify(formattedDurations, null, 2));
            setDailyDurations(data.dailyDurations);
          } else {
            console.warn('No dailyDurations field or not an array in user document');
            setDailyDurations([]);
            setError('No attendance data available for this employee');
          }
        } else {
          console.warn('User document does not exist for ID:', selectedEmployee);
          setDailyDurations([]);
          setError('No data found for selected employee');
        }
      } catch (err) {
        console.error('Error fetching daily durations:', err);
        setError('Failed to load attendance data: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDailyDurations();
  }, [selectedEmployee]);

  const handleEmployeeChange = (e) => {
    const selectedId = e.target.value;
    const selectedUser = users.find((user) => user.id === selectedId);
    setSelectedEmployee(selectedId);
    setSelectedEmployeeName(selectedUser ? selectedUser.displayName : '');
  };

  const getHoursFromTimestamp = (timestamp) => {
    if (!timestamp) return 0;
    const date = new Date(timestamp);
    return date.getHours() + date.getMinutes() / 60;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toUpperCase();
  };

  const formatHourLabel = (hour) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour} ${period}`;
  };

  const getTimeRangeForDay = (sessions) => {
    if (!sessions || sessions.length === 0) {
      return { startHour: 0, endHour: 24, timeSlots: ['12 AM', '6 AM', '12 PM', '6 PM', '12 AM'] };
    }

    const hours = sessions.flatMap((session) => [
      getHoursFromTimestamp(session.checkIn),
      getHoursFromTimestamp(session.checkOut),
    ]);
    const minHour = Math.floor(Math.min(...hours)) - 1;
    const maxHour = Math.ceil(Math.max(...hours)) + 1;
    const startHour = Math.max(0, minHour);
    const endHour = Math.min(24, maxHour);
    const totalHours = endHour - startHour;

    const timeSlots = [];
    for (let hour = startHour; hour <= endHour; hour++) {
      timeSlots.push(formatHourLabel(hour));
    }

    return { startHour, endHour, timeSlots };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Shift Tracking</h1>
                <p className="text-sm text-gray-500">Monitor employee work hours and overtime</p>
              </div>
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
                  <option value="">
                    {isLoading ? 'Loading employees...' : 'Select an employee'}
                  </option>
                  {users.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.displayName}
                    </option>
                  ))}
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
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
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

        {/* Dashboard Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Work Hour Timeline</h2>
              <p className="text-sm text-gray-500">Visual representation of employee shifts and overtime</p>
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

          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : !selectedEmployee ? (
              <div className="text-center py-12">
                <User className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No employee selected</h3>
                <p className="mt-1 text-sm text-gray-500">Please select an employee to view their work hours</p>
              </div>
            ) : dailyDurations.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No attendance data</h3>
                <p className="mt-1 text-sm text-gray-500">No work hour records found for the selected employee</p>
              </div>
            ) : (
              <div className="space-y-8">
                {dailyDurations.map((day, index) => {
                  const { startHour, endHour, timeSlots } = getTimeRangeForDay(day.sessions);
                  const totalHours = endHour - startHour;

                  return (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-32 flex-shrink-0">
                          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                            <div className="text-sm font-medium text-gray-900 text-center">{day.date}</div>
                            <div className="text-xs text-gray-500 text-center mt-1">Total: {day.totalDuration} hrs</div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="mb-4">
                            <div className="flex justify-between text-xs text-gray-500 mb-2">
                              {timeSlots.map((time, idx) => (
                                <span key={idx} className="w-16 text-center">{time}</span>
                              ))}
                            </div>
                            <div className="h-px bg-gray-200"></div>
                          </div>
                          <div className="h-10 bg-gray-100 rounded-lg relative overflow-hidden">
                            {timeSlots.map((_, i) => (
                              <div
                                key={i}
                                className="absolute top-0 bottom-0 w-px bg-gray-200"
                                style={{ left: `${(i / (timeSlots.length - 1)) * 100}%` }}
                              />
                            ))}
                            {day.sessions.map((session, sessionIndex) => {
                              const start = getHoursFromTimestamp(session.checkIn) - startHour;
                              const end = getHoursFromTimestamp(session.checkOut) - startHour;
                              const width = ((end - start) / totalHours) * 100;
                              const minWidth = width < 2 ? 2 : width;
                              return (
                                <div
                                  key={sessionIndex}
                                  className={`absolute top-1 bottom-1 rounded-md shadow-sm ${sessionColors[sessionIndex % sessionColors.length]}`}
                                  style={{
                                    left: `${(start / totalHours) * 100}%`,
                                    width: `${minWidth}%`,
                                  }}
                                  title={`Branch: ${session.branchName || 'N/A'}, ${formatTime(session.checkIn)} - ${formatTime(session.checkOut)}, Duration: ${session.duration} hrs`}
                                />
                              );
                            })}
                          </div>
                          <div className="relative mt-2">
                            {day.sessions.map((session, sessionIndex) => {
                              const start = getHoursFromTimestamp(session.checkIn) - startHour;
                              const end = getHoursFromTimestamp(session.checkOut) - startHour;
                              const width = ((end - start) / totalHours) * 100;
                              const minWidth = width < 2 ? 2 : width;
                              return (
                                <div key={sessionIndex}>
                                  <div
                                    className="absolute text-[10px] text-gray-600"
                                    style={{ left: `${(start / totalHours) * 100}%`, transform: 'translateX(-50%)' }}
                                  >
                                    {formatTime(session.checkIn)}
                                  </div>
                                  <div
                                    className="absolute text-[10px] text-gray-600"
                                    style={{ left: `${(start / totalHours) * 100 + minWidth}%`, transform: 'translateX(-50%)' }}
                                  >
                                    {formatTime(session.checkOut)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Sessions Table */}
                      <div className="mt-6">
                        <div className="overflow-hidden border border-gray-200 rounded-lg">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Session
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Check-In
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Check-Out
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Duration
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Branch
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {day.sessions.map((session, sessionIndex) => (
                                <tr key={sessionIndex}>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <span
                                        className={`inline-block w-3 h-3 mr-2 rounded-full ${sessionColors[sessionIndex % sessionColors.length]}`}
                                      ></span>
                                      <span className="text-sm text-gray-900">Session {sessionIndex + 1}</span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                    {formatTime(session.checkIn)}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                    {formatTime(session.checkOut)}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                    {session.duration} hrs
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                    {session.branchName || 'N/A'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Summary Section */}
        {dailyDurations.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Total Work Hours</h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {dailyDurations.reduce((sum, day) => sum + (parseFloat(day.totalDuration) || 0), 0).toFixed(2)} hours
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-green-50 p-3 rounded-lg">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-right">
                  <h3 className="text-sm font-medium text-gray-700">Employee</h3>
                  <p className="text-lg font-semibold text-gray-900">{selectedEmployeeName}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default OvertimeShiftDashboard;