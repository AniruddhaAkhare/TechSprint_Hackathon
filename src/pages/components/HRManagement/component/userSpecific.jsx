import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, MoreHorizontal } from 'lucide-react';
import { collection, getDocs, query, orderBy, addDoc } from 'firebase/firestore'; 
import { db } from "../../../../config/firebase";

const ShiftScheduler = () => {
  // States
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7); // default from 7 days ago
    return d.toISOString().slice(0, 10);
  });
  const [toDate, setToDate] = useState(() => new Date().toISOString().slice(0, 10)); // default to today

  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [viewMode, setViewMode] = useState('Weekly');
  const [users, setUsers] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [isShiftDropdownOpen, setIsShiftDropdownOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState('');
  
const shiftAssignmentsRef = collection(db, 'ShiftAssignments');
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
      shiftName: selectedShift,
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
    setSelectedEmployee('');   // or you can keep default user if preferred
    setSelectedShift('');
  } catch (err) {
    console.error('Error assigning shift:', err);
    alert('Failed to assign shift, please try again.');
  }
};


  // Firestore refs
  const shiftsCollectionRef = collection(db, 'Shifts');

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

  // Calculate week dates based on fromDate (used for display grid)
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

  const selectedUser = users.find(user => user.id === selectedEmployee);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              className="p-2 hover:bg-gray-100 rounded-md"
              onClick={() => navigateWeek(-1)}
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            {/* From Date Picker */}
            <input
              type="date"
              value={fromDate}
              max={toDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border p-1 rounded"
            />

            <span>to</span>

            {/* To Date Picker */}
            <input
              type="date"
              value={toDate}
              min={fromDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border p-1 rounded"
            />

            <button
              className="p-2 hover:bg-gray-100 rounded-md"
              onClick={() => navigateWeek(1)}
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
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
                          setSelectedShift(shift.shiftName);
                          setIsShiftDropdownOpen(false);
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
        <div className="mt-4 flex items-center justify-between space-x-4">
          {/* Select Employee dropdown */}
          <div className="flex-1 min-w-[200px]">
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

          {/* Two inputs: Employee and Shift */}
          <div className="flex space-x-3 flex-1 min-w-[300px]">
            <div className="flex flex-col flex-1">
              <label className="text-gray-700 text-sm font-medium mb-2">Employee</label>
              <input
                type="text"
                placeholder="Employee"
                value={selectedUser ? (selectedUser.displayName || selectedUser.email || "") : ""}
                readOnly
                className="p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col flex-1">
              <label className="text-gray-700 text-sm font-medium mb-2">Shift</label>
              <input
                type="text"
                placeholder="Shift"
                value={selectedShift}
                readOnly
                className="p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Assign button */}
          <div>
           <button
  className="bg-blue-600 text-white px-4 py-3 rounded-md text-sm font-medium hover:bg-blue-700"
  onClick={handleAssignShift}
>
  Assign
</button>
          </div>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="overflow-x-auto mt-6 px-6">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Time</th>
              {weekDates.map((date) => (
                <th key={date.toISOString()} className="border border-gray-300 px-4 py-2">
                  <div className="text-sm font-semibold">
                    {dayNames[date.getDay()]}
                  </div>
                  <div className="text-xs text-gray-600">
                    {date.toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time) => (
              <tr key={time} className="even:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 font-mono text-sm">{time}</td>
                {weekDates.map((date) => (
                  <td key={date.toISOString() + time} className="border border-gray-300 px-4 py-2 h-12">
                    {/* You can insert shift assignment UI here */}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShiftScheduler;
