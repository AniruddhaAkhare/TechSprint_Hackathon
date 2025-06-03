import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from "../../../../config/firebase";

const EmployeeShift = () => {
  const [users, setUsers] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [shiftAssignments, setShiftAssignments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const shiftAssignmentsRef = collection(db, 'ShiftAssignments');
  const shiftsCollectionRef = collection(db, 'Shifts');

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
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    const fetchShiftAssignments = async () => {
      try {
        const snapshot = await getDocs(shiftAssignmentsRef);
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const filteredList = list.filter(assignment => {
          const toDate = new Date(assignment.toDate);
          return toDate >= today;
        });
        setShiftAssignments(filteredList);
      } catch (err) {
        console.error('Error fetching shift assignments:', err);
      }
    };

    fetchShifts();
    fetchUsers();
    fetchShiftAssignments();
  }, []);

  const getCombinedDateRange = (assignments) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (assignments.length === 0) {
      const endDate = new Date();
      endDate.setDate(today.getDate() + 6);
      return { start: today, end: endDate };
    }

    const dates = assignments.reduce((acc, assignment) => {
      const from = new Date(assignment.fromDate);
      const to = new Date(assignment.toDate);
      return {
        start: acc.start ? (from < acc.start ? from : acc.start) : from,
        end: acc.end ? (to > acc.end ? to : acc.end) : to,
      };
    }, {});

    dates.start = dates.start < today ? today : dates.start;
    return dates;
  };

  const getDatesInRange = (start, end) => {
    const dates = [];
    const currentDate = new Date(start);
    while (currentDate <= end) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const formatDateRange = (from, to) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const fromMonth = months[fromDate.getMonth()];
    const toMonth = months[toDate.getMonth()];
    const fromDay = fromDate.getDate();
    const toDay = toDate.getDate();
    const fromYear = fromDate.getFullYear();
    const toYear = toDate.getFullYear();

    if (fromYear === toYear) {
      if (fromMonth === toMonth) {
        return `${fromMonth} ${fromDay} - ${toDay}, ${fromYear}`;
      }
      return `${fromMonth} ${fromDay} - ${toMonth} ${toDay}, ${fromYear}`;
    }
    return `${fromMonth} ${fromDay}, ${fromYear} - ${toMonth} ${toDay}, ${toYear}`;
  };

  const formatDateForHeader = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    return `${dayName}, ${month} ${day}`;
  };

  const filteredUsers = users.filter(user =>
    (user.displayName || user.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredShiftAssignments = shiftAssignments.filter(assignment =>
    filteredUsers.some(user => user.id === assignment.userID)
  );

  const { start, end } = getCombinedDateRange(filteredShiftAssignments);
  const weekDates = getDatesInRange(start, end);

  const getShiftColor = (shiftName) => {
    if (shiftName.toLowerCase().includes('morning')) return 'bg-blue-500 text-white';
    if (shiftName.toLowerCase().includes('evening')) return 'bg-purple-500 text-white';
    if (shiftName.toLowerCase().includes('third shift')) return 'bg-pink-200 text-gray-800';
    if (shiftName.toLowerCase().includes('general')) return 'bg-gray-200 text-gray-800';
    return 'bg-gray-200 text-gray-800';
  };

  const getShiftForEmployeeAndDate = (employee, date, assignment) => {
    if (date.getDay() === 0) {
      return null;
    }

    const dateStr = date.toISOString().slice(0, 10);
    if (dateStr < assignment.fromDate || dateStr > assignment.toDate) return null;

    const shift = shifts.find((s) => s.id === assignment.shiftID) || {
      shiftName: assignment.shiftName || 'Unknown',
      fromTime: assignment.fromTime || 'Unknown',
      toTime: assignment.toTime || 'Unknown',
      fromAmPm: assignment.fromAmPm || '',
      toAmPm: assignment.toAmPm || ''
    };

    if (!shift.fromTime || !shift.toTime || shift.fromTime === 'Unknown' || shift.toTime === 'Unknown') return null;

    const formattedTime = `${shift.fromTime} ${shift.fromAmPm} - ${shift.toTime} ${shift.toAmPm}`;
    return (
      <div className={`p-2 rounded ${getShiftColor(shift.shiftName)}`}>
        <div className="font-medium text-sm">{shift.shiftName}</div>
        <div className="text-xs">{formattedTime}</div>
      </div>
    );
  };

  const groupedAssignments = filteredShiftAssignments.reduce((acc, assignment) => {
    if (!acc[assignment.userID]) {
      acc[assignment.userID] = [];
    }
    acc[assignment.userID].push(assignment);
    return acc;
  }, {});

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Calendar className="w-6 h-6 mr-3 text-indigo-600" />
              Schedule Manager
            </h1>
          </div>
          <div className="flex items-center justify-between">
            <input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 h-10 px-4 py-2 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
        </div>
      </div>

      <div className="p-3">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-auto max-h-[700px]">
            <table className="w-full border-collapse table-fixed" style={{ tableLayout: 'fixed' }}>
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th
                    className="border-r border-gray-200 px-4 py-3 text-left sticky left-0 bg-gray-50 z-30 whitespace-nowrap"
                    style={{ minWidth: '300px', width: '300px' }}
                  >
                    <span className="text-sm font-semibold text-gray-700">Employee & Shift Period</span>
                  </th>
                  {weekDates.map((date, index) => (
                    <th
                      key={date.toISOString()}
                      className="border-r border-gray-200 px-4 py-3 text-center"
                      style={{ minWidth: '150px', width: '150px' }}
                    >
                      <div className="text-sm font-semibold text-gray-700">{formatDateForHeader(date)}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((employee) => {
                  const employeeAssignments = groupedAssignments[employee.id] || [];
                  return employeeAssignments.map((assignment, index) => (
                    <tr key={`${employee.id}-${assignment.id}`} className="hover:bg-gray-50 transition-colors">
                      <td
                        className="border-r border-gray-200 px-4 py-3 text-sm font-medium sticky left-0 bg-white z-20 whitespace-nowrap"
                        style={{ minWidth: '300px', width: '300px' }}
                      >
                        <div className="flex items-center gap-2 text-gray-900">
                          <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-medium">
                            {(employee.displayName || employee.email || "U").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold block">{employee.displayName || employee.email || "Unknown User"}</span>
                            <span className="text-xs text-gray-500">
                              {formatDateRange(assignment.fromDate, assignment.toDate)}
                            </span>
                          </div>
                        </div>
                      </td>
                      {weekDates.map((date) => (
                        <td
                          key={`${employee.id}-${assignment.id}-${date.toISOString()}`}
                          className="border-r border-gray-200 px-3 py-3 text-xs"
                          style={{ minWidth: '150px', width: '150px' }}
                        >
                          {getShiftForEmployeeAndDate(employee, date, assignment)}
                        </td>
                      ))}
                    </tr>
                  ));
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeShift;