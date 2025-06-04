import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { db } from "../../../config/firebase";
import { getAuth } from 'firebase/auth';

const EmployeeShift = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [shiftAssignments, setShiftAssignments] = useState([]);
  const [viewMode, setViewMode] = useState('week');

  const auth = getAuth();
  const user = auth.currentUser;

  const shiftsCollectionRef = collection(db, 'Shifts');
  const shiftAssignmentsRef = collection(db, 'ShiftAssignments');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setError('No user is signed in');
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, 'Users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          setError('User data not found');
        }
      } catch (err) {
        setError('Failed to fetch user data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

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

    const fetchShiftAssignments = async () => {
      try {
        const q = query(shiftAssignmentsRef, where("userID", "==", user.uid));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setShiftAssignments(list);
      } catch (err) {
        console.error('Error fetching shift assignments:', err);
      }
    };

    fetchUserData();
    fetchShifts();
    fetchShiftAssignments();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const getCombinedDateRange = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (viewMode === 'week') {
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + 6);
      return { start: today, end: endDate };
    } else {
      const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return { start: startDate, end: endDate };
    }
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

  const splitIntoWeeks = (dates) => {
    const weeks = [];
    let week = [];
    const firstDay = new Date(dates[0]);
    const startDay = firstDay.getDay(); // Get the day of the week (0 = Sunday, 6 = Saturday)

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDay; i++) {
      week.push(null);
    }

    dates.forEach((date) => {
      week.push(date);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    });

    // Pad the last week with nulls if necessary
    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null);
      }
      weeks.push(week);
    }

    return weeks;
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

  const formatMonthTitle = (date) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatDateForHeader = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    return `${dayName}, ${month} ${day}`;
  };

  const getShiftColor = (shiftName) => {
    if (shiftName.toLowerCase().includes('morning')) return 'bg-blue-500 text-white';
    if (shiftName.toLowerCase().includes('evening')) return 'bg-purple-500 text-white';
    if (shiftName.toLowerCase().includes('third shift')) return 'bg-pink-200 text-gray-800';
    if (shiftName.toLowerCase().includes('general')) return 'bg-gray-200 text-gray-800';
    return 'bg-gray-200 text-gray-800';
  };

  const getShiftForEmployeeAndDate = (date, assignment) => {
    if (!date || date.getDay() === 0) {
      return null; // Leave Sunday blank or handle null dates
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
      <div className={`p-1 rounded ${getShiftColor(shift.shiftName)}`}>
        <div className="font-medium text-xs">{shift.shiftName}</div>
        <div className="text-xs">{formattedTime}</div>
      </div>
    );
  };

  const renderMonthView = (weekGroups, startDate) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
          <span className="text-sm font-semibold text-gray-700">
            {formatMonthTitle(startDate)}
          </span>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-gray-700 py-2">
                {day}
              </div>
            ))}
            {weekGroups.map((week, weekIndex) => (
              <React.Fragment key={weekIndex}>
                {week.map((date, dateIndex) => (
                  <div
                    key={`${weekIndex}-${dateIndex}`}
                    className={`min-h-[100px] p-2 border border-gray-200 ${
                      date ? 'bg-white' : 'bg-gray-100'
                    } flex flex-col`}
                  >
                    {date && (
                      <>
                        <div className="text-xs font-medium text-gray-700 mb-1">
                          {date.getDate()}
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                          {shiftAssignments.map((assignment) =>
                            getShiftForEmployeeAndDate(date, assignment)
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderWeekView = (weekDates) => {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-auto">
          <table className="w-full border-collapse" style={{ tableLayout: 'auto' }}>
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th
                  className="border-r border-gray-200 px-4 py-3 text-left sticky left-0 bg-gray-50 z-30 whitespace-nowrap"
                  style={{ width: '250px' }}
                >
                  <span className="text-sm font-semibold text-gray-700">My Shifts</span>
                </th>
                {weekDates.map((date) => (
                  <th
                    key={date.toISOString()}
                    className="border-r border-gray-200 px-4 py-3 text-center"
                    style={{ width: `${100 / (weekDates.length + 1)}%` }}
                  >
                    <div className="text-sm font-semibold text-gray-700">{formatDateForHeader(date)}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shiftAssignments.map((assignment) => (
                <tr key={assignment.id} className="hover:bg-gray-50 transition-colors">
                  <td
                    className="border-r border-gray-200 px-4 py-3 text-sm font-medium sticky left-0 bg-white z-20 whitespace-nowrap"
                    style={{ width: '250px' }}
                  >
                    <div className="flex items-center gap-2 text-gray-900">
                      <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-medium">
                        {(userData?.displayName || userData?.email || "U").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-semibold block">{userData?.displayName || userData?.email || "Unknown User"}</span>
                        <span className="text-xs text-gray-500">
                          {formatDateRange(assignment.fromDate, assignment.toDate)}
                        </span>
                      </div>
                    </div>
                  </td>
                  {weekDates.map((date) => (
                    <td
                      key={`${assignment.id}-${date.toISOString()}`}
                      className="border-r border-gray-200 px-3 py-3 text-xs"
                      style={{ width: `${100 / (weekDates.length + 1)}%` }}
                    >
                      {getShiftForEmployeeAndDate(date, assignment)}
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

  const { start, end } = getCombinedDateRange();
  const allDates = getDatesInRange(start, end);
  const weekGroups = viewMode === 'month' ? splitIntoWeeks(allDates) : [allDates];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-2 fixed inset-0 left-[300px] overflow-auto">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Calendar className="w-6 h-6 mr-3 text-indigo-600" />
              My Schedule
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('week')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  viewMode === 'week' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
                } hover:bg-indigo-500 hover:text-white transition-colors`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  viewMode === 'month' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
                } hover:bg-indigo-500 hover:text-white transition-colors`}
              >
                Month
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {shiftAssignments.length === 0 ? (
          <div className="p-6 text-gray-600">No shifts assigned for this {viewMode}.</div>
        ) : (
          <div className="flex flex-col gap-6">
            {viewMode === 'month' ? renderMonthView(weekGroups, start) : renderWeekView(allDates)}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeShift;