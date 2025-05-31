import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, MoreHorizontal } from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from "../../../../config/firebase";

const ShiftScheduler = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [viewMode, setViewMode] = useState('Weekly');
  const [users, setUsers] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [isShiftDropdownOpen, setIsShiftDropdownOpen] = useState(false);

  const selectedUser = users.find(user => user.id === selectedEmployee);

  // Firestore collection reference for shifts
  const shiftsCollectionRef = collection(db, 'Shifts');

  // Fetch shifts and users from Firestore
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const q = query(shiftsCollectionRef, orderBy("shiftName", "asc"));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setShifts(list);
      } catch (err) {
        console.error("Error fetching shifts:", err);
      }
    };

    const fetchUsers = async () => {
      try {
        const usersCollectionRef = collection(db, 'Users');
        const snapshot = await getDocs(usersCollectionRef);
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(list);

        // Optionally preselect the first user
        if (list.length > 0) {
          setSelectedEmployee(list[0].id || '');
        }
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchShifts();
    fetchUsers();
  }, []);

  const getWeekDates = (date) => {
    const week = [];
    const startDate = new Date(date);
    const day = startDate.getDay();
    const diff = startDate.getDate() - day;

    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startDate);
      weekDate.setDate(diff + i);
      week.push(new Date(weekDate));
    }
    return week;
  };

  const weekDates = getWeekDates(currentDate);
  const weekStart = weekDates[0];
  const weekEnd = weekDates[6];

  const formatDateRange = () => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return `${weekStart.toLocaleDateString('en-GB', options)} - ${weekEnd.toLocaleDateString('en-GB', options)}`;
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const timeSlots = [
    '06 AM', '07 AM', '08 AM', '09 AM', '10 AM', '11 AM',
    '12 PM', '01 PM', '02 PM', '03 PM', '04 PM', '05 PM',
    '06 PM', '07 PM', '08 PM'
  ];

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-md" onClick={() => navigateWeek(-1)}>
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-md" onClick={() => navigateWeek(1)}>
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
            <span className="font-medium text-gray-900">{formatDateRange()}</span>
          </div>

          <div className="flex items-center space-x-2 relative">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  viewMode === 'Weekly' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setViewMode('Weekly')}
              >
                Weekly
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  viewMode === 'Monthly' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setViewMode('Monthly')}
              >
                Monthly
              </button>
            </div>

            <button
              onClick={() => setIsShiftDropdownOpen(!isShiftDropdownOpen)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center space-x-2 relative"
            >
              <Plus className="w-4 h-4" />
              <span>Assign shift</span>

              {/* Dropdown */}
              {isShiftDropdownOpen && (
                <div className="absolute z-10 mt-2 w-60 bg-white border border-gray-300 rounded-md shadow-lg right-0">
                  {shifts.length > 0 ? (
                    shifts.map((shift) => (
                      <div
                        key={shift.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                        onClick={() => {
                          console.log("Selected Shift:", shift);
                          setIsShiftDropdownOpen(false);
                          // You can add logic here to assign the shift or update state
                        }}
                      >
                        <div className="font-medium">{shift.shiftName}</div>
                        <div className="text-xs text-gray-500">{shift.shiftTime}</div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">No shifts available</div>
                  )}
                </div>
              )}
            </button>

            <button className="p-2 hover:bg-gray-100 rounded-md">
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Select Employee Section */}
        <div className="mt-4 flex items-center justify-between space-x-8">
          <div className="flex-1">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Select Employee
            </label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Choose an employee...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.displayName || user.email || "Unknown User"}
                </option>
              ))}
            </select>
          </div>

          {/* Show Selected Employee Name */}
          {selectedEmployee && (
            <div className="flex-1 text-right">
              <p className="text-sm text-gray-700 font-medium">Selected Employee:</p>
              <p className="text-lg text-gray-900 font-semibold mt-1">
                {selectedUser?.displayName || selectedUser?.email || "Unknown"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="px-6 overflow-x-auto">
        {/* Time Header */}
        <div className="grid grid-cols-[64px_repeat(15,1fr)] border-b border-gray-200">
          <div className="h-12 flex items-center justify-center text-sm font-medium text-gray-600">Day</div>
          {timeSlots.map((time, index) => (
            <div key={index} className="h-12 flex items-center justify-center text-xs text-gray-500 border-l border-gray-100">
              {time}
            </div>
          ))}
        </div>

        {/* Calendar Rows */}
        {weekDates.map((date, dayIndex) => {
          const isToday = date.toDateString() === new Date().toDateString();

          // You can modify this filter logic to match shifts to days if needed
          const dayShifts = shifts.filter(shift => shift.day === dayIndex);

          return (
            <div key={dayIndex} className="grid grid-cols-[64px_repeat(15,1fr)] border-b border-gray-100 relative min-h-[80px]">
              {/* Day Column */}
              <div className="flex flex-col items-center justify-center p-2 text-sm">
                <span className="text-gray-500">{dayNames[dayIndex]}</span>
                <span className={`text-base font-medium ${isToday ? 'text-blue-600 bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center' : 'text-gray-900'}`}>
                  {date.getDate()}
                </span>
              </div>

              {/* Time slots */}
              {timeSlots.map((_, timeIndex) => {
                const shift = dayShifts.find(shift => shift.timeSlotIndex === timeIndex);

                return (
                  <div
                    key={timeIndex}
                    className={`border-l border-gray-100 cursor-pointer relative`}
                    title={shift ? shift.shiftName : ''}
                  >
                    {shift && (
                      <div className="absolute inset-1 bg-blue-100 text-blue-800 rounded-md px-1 text-xs font-semibold flex items-center justify-center">
                        {shift.shiftName}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShiftScheduler;
