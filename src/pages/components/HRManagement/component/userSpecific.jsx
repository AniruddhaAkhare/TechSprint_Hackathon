import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, MoreHorizontal, Calendar, Users, Clock, Check } from 'lucide-react';
import { collection, getDocs, query, orderBy, addDoc } from 'firebase/firestore'; 
import { db } from "../../../../config/firebase";

const ModernScheduleInterface = () => {
  // States - Updated with your backend logic
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7); // default from 7 days ago
    return d.toISOString().slice(0, 10);
  });
  const [toDate, setToDate] = useState(() => new Date().toISOString().slice(0, 10)); // default to today
  
  const [viewMode, setViewMode] = useState('Weekly');
  const [isShiftDropdownOpen, setIsShiftDropdownOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedShift, setSelectedShift] = useState(null); // store full shift object
  const [users, setUsers] = useState([]);
  const [shifts, setShifts] = useState([]);

  // Firebase references
  const shiftAssignmentsRef = collection(db, 'ShiftAssignments');
  const shiftsCollectionRef = collection(db, 'Shifts');

  // Handle shift assignment with Firebase
  const handleAssignShift = async () => {
    if (!fromDate || !toDate || !selectedEmployee || !selectedShift) {
      alert('Please select From date, To date, Employee, and Shift before assigning.');
      return;
    }

    const employee = users.find(u => u.id === selectedEmployee);
    if (!employee) {
      alert('Selected employee not found!');
      return;
    }

    try {
      await addDoc(shiftAssignmentsRef, {
        fromDate,
        toDate,
        employeeName: employee.displayName || employee.email || "Unknown",
        userID: employee.id,
        shiftName: selectedShift.shiftName,
        shiftID: selectedShift.id,
        assignedAt: new Date().toISOString()
      });
      alert('Shift assigned successfully!');

      // Reset inputs to default values after successful assignment
      const defaultFromDate = (() => {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        return d.toISOString().slice(0, 10);
      })();

      setFromDate(defaultFromDate);
      setToDate(new Date().toISOString().slice(0, 10));
      setSelectedEmployee('');
      setSelectedShift(null);
    } catch (err) {
      console.error('Error assigning shift:', err);
      alert('Failed to assign shift, please try again.');
    }
  };

  // Fetch shifts and users on mount
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const q = query(shiftsCollectionRef, orderBy("shiftName", "asc"));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setShifts(list);
      } catch (err) {
        console.error("Error fetching shifts:", err);
      }
    };

    const fetchUsers = async () => {
      try {
        const usersCollectionRef = collection(db, 'Users');
        const snapshot = await getDocs(usersCollectionRef);
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(list);
        if (list.length > 0) setSelectedEmployee(list[0].id || '');
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchShifts();
    fetchUsers();
  }, []);

  const selectedUser = users.find(user => user.id === selectedEmployee);

  // Calculate week dates based on fromDate and toDate range
  const getWeekDatesFromRange = () => {
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const dates = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    return dates;
  };

  const weekDates = getWeekDatesFromRange();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Time slots
  const timeSlots = [
    '06 AM', '07 AM', '08 AM', '09 AM', '10 AM', '11 AM',
    '12 PM', '01 PM', '02 PM', '03 PM', '04 PM', '05 PM',
    '06 PM', '07 PM', '08 PM'
  ];

  // Navigate week range by shifting fromDate and toDate by 7 days
  const navigateWeek = (direction) => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    from.setDate(from.getDate() + 7 * direction);
    to.setDate(to.getDate() + 7 * direction);

    setFromDate(from.toISOString().slice(0, 10));
    setToDate(to.toISOString().slice(0, 10));
  };

  const formatDateRange = () => {
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const options = { month: 'short', day: 'numeric' };
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}, ${start.getFullYear()}`;
  };

  // Generate shift colors dynamically
  const getShiftColor = (index) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500', 'bg-indigo-500'];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Modern Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          {/* Top Header Section */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Calendar className="w-6 h-6 mr-3 text-indigo-600" />
                Schedule Manager
              </h1>
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {formatDateRange()}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    viewMode === 'Weekly' 
                      ? 'bg-white shadow-sm text-gray-900' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setViewMode('Weekly')}
                >
                  Weekly
                </button>
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    viewMode === 'Monthly' 
                      ? 'bg-white shadow-sm text-gray-900' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setViewMode('Monthly')}
                >
                  Monthly
                </button>
              </div>

              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreHorizontal className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Navigation and Date Selection */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => navigateWeek(-1)}
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>

              <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-2">
                <input
                  type="date"
                  value={fromDate}
                  max={toDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="border-0 bg-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-gray-500 text-sm">to</span>
                <input
                  type="date"
                  value={toDate}
                  min={fromDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="border-0 bg-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => navigateWeek(1)}
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() => setIsShiftDropdownOpen(!isShiftDropdownOpen)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center space-x-2 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Quick Assign</span>
              </button>

              {isShiftDropdownOpen && (
                <div className="absolute z-20 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl right-0 overflow-hidden">
                  <div className="p-2">
                    {shifts.length > 0 ? (
                      shifts.map((shift, index) => (
                        <div
                          key={shift.id}
                          className="flex items-center p-3 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors"
                          onClick={() => {
                            setSelectedShift(shift);
                            setIsShiftDropdownOpen(false);
                          }}
                        >
                          <div className={`w-3 h-3 rounded-full ${getShiftColor(index)} mr-3`}></div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{shift.shiftName}</div>
                            <div className="text-xs text-gray-500">{shift.shiftTime}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-sm text-gray-500 text-center">No shifts available</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Assignment Section */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-end space-x-4 max-w-6xl">
            {/* Employee Selection */}
            <div className="flex-1 min-w-[250px]">
              <label className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
                <Users className="w-4 h-4 mr-2 text-gray-500" />
                Select Employee
              </label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                <option value="">Choose an employee...</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.displayName || user.email || "Unknown User"}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Employee Display */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Employee
              </label>
              <div className="w-full p-3 border border-gray-300 rounded-lg bg-white text-sm flex items-center">
                {selectedUser ? (
                  <>
                    <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                      {(selectedUser.displayName || selectedUser.email || "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{selectedUser.displayName || "Unknown User"}</div>
                      <div className="text-xs text-gray-500">{selectedUser.email}</div>
                    </div>
                  </>
                ) : (
                  <span className="text-gray-400">No employee selected</span>
                )}
              </div>
            </div>

            {/* Selected Shift Display */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                <Clock className="w-4 h-4 mr-2 text-gray-500 inline" />
                Shift
              </label>
              <div className="w-full p-3 border border-gray-300 rounded-lg bg-white text-sm flex items-center cursor-pointer hover:bg-gray-50"
                   onClick={() => setIsShiftDropdownOpen(!isShiftDropdownOpen)}>
                {selectedShift ? (
                  <>
                    <div className={`w-3 h-3 rounded-full ${getShiftColor(shifts.findIndex(s => s.id === selectedShift.id))} mr-3`}></div>
                    <div className="flex-1">
                      <div className="font-medium">{selectedShift.shiftName}</div>
                      <div className="text-xs text-gray-500">{selectedShift.shiftTime}</div>
                    </div>
                  </>
                ) : (
                  <span className="text-gray-400">Select a shift</span>
                )}
              </div>
            </div>

            {/* Assign Button */}
            <div>
              <button
                onClick={handleAssignShift}
                disabled={!selectedEmployee || !selectedShift}
                className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all flex items-center space-x-2 ${
                  selectedEmployee && selectedShift
                    ? 'bg-green-600 text-white hover:bg-green-700 shadow-sm'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>Assign</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Schedule Grid */}
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-auto max-h-[600px]">
            <table className="w-full border-collapse table-fixed">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="border-r border-gray-200 px-4 py-3 text-left min-w-[100px] sticky left-0 bg-gray-50 z-20">
                    <span className="text-sm font-semibold text-gray-700">Time</span>
                  </th>
                  {weekDates.map((date) => {
                    const isToday = date.toDateString() === new Date().toDateString();
                    return (
                      <th
                        key={date.toISOString()}
                        className={`border-r border-gray-200 px-4 py-3 min-w-[140px] text-center ${
                          isToday ? 'bg-indigo-50' : ''
                        }`}
                      >
                        <div className={`font-semibold text-lg ${isToday ? 'text-indigo-600' : 'text-gray-900'}`}>
                          {date.getDate()}
                        </div>
                        <div className={`text-sm ${isToday ? 'text-indigo-500' : 'text-gray-500'}`}>
                          {dayNames[date.getDay()]}
                        </div>
                        {isToday && (
                          <div className="w-2 h-2 bg-indigo-500 rounded-full mx-auto mt-1"></div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((slot, index) => (
                  <tr key={slot} className="hover:bg-gray-50 transition-colors">
                    <td className="border-r border-gray-200 px-4 py-3 text-sm font-medium sticky left-0 bg-white z-10">
                      <div className={`${index % 2 === 0 ? 'text-gray-900' : 'text-gray-600'}`}>
                        {slot}
                      </div>
                    </td>
                    {weekDates.map((date) => {
                      const isToday = date.toDateString() === new Date().toDateString();
                      return (
                        <td
                          key={`${date.toISOString()}-${slot}`}
                          className={`border-r border-gray-200 px-3 py-3 text-xs relative hover:bg-indigo-50 cursor-pointer transition-colors ${
                            isToday ? 'bg-indigo-25' : ''
                          }`}
                        >
                          {/* Placeholder for shift assignments */}
                          <div className="min-h-[40px] flex items-center justify-center">
                            <div className="w-full h-8 rounded-md border-2 border-dashed border-gray-200 hover:border-indigo-300 transition-colors"></div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernScheduleInterface;