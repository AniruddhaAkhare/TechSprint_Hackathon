import React, { useState, useEffect } from "react";
import { db } from "../../../../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "../../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const EmployeeAttendance = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const usersSnapshot = await getDocs(collection(db, "Users"));
        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);

        const holidaysSnapshot = await getDocs(collection(db, "Holidays"));
        const holidaysData = holidaysSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHolidays(holidaysData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
      }
      setLoading(false);
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  const isWeekend = (date) => {
    const day = new Date(date).getDay();
    return day === 0;
  };

  const getWeekendsInMonth = (year, month) => {
    let weekends = 0;
    const daysInMonth = getDaysInMonth(year, month);
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day).toISOString().split("T")[0];
      if (isWeekend(date)) {
        weekends++;
      }
    }
    return weekends;
  };

  const getHolidaysInMonth = (year, month) => {
    return holidays.filter((holiday) => {
      const holidayDate = new Date(holiday.date);
      return holidayDate.getFullYear() === year && holidayDate.getMonth() === month - 1;
    }).length;
  };

  const calculateUserMetrics = (user, year, month) => {
    const dailyDurations = user.dailyDurations || [];
    const daysInMonth = getDaysInMonth(year, month);
    let workingDays = 0;
    let totalHours = 0;
    let leaves = 0;

    const monthDurations = dailyDurations.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate.getFullYear() === year && entryDate.getMonth() === month - 1;
    });

    monthDurations.forEach((entry) => {
      workingDays++;
      totalHours += parseFloat(entry.totalDuration || 0);
    });

    for (let day = 1; day <= daysInMonth - getWeekendsInMonth(year, month) - getHolidaysInMonth(year, month); day++) {
      const dateStr = new Date(year, month - 1, day).toISOString().split("T")[0];
      const hasActivity = dailyDurations.some((entry) => entry.date === dateStr);
      if (!hasActivity) {
        leaves++;
      }
    }

    return {
      workingDays,
      leaves,
      weekends: getWeekendsInMonth(year, month),
      holidays: getHolidaysInMonth(year, month),
      totalHours: totalHours.toFixed(2),
    };
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const [year, month] = selectedMonth.split("-").map(Number);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">HR Dashboard - Employee Attendance</h3>
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
          <div className="mb-6 flex items-center gap-4">
            <label htmlFor="month" className="text-sm font-medium text-gray-700">
              Select Month:
            </label>
            <input
              type="month"
              id="month"
              value={selectedMonth}
              onChange={handleMonthChange}
              className="border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead className="bg-gray-50 text-black-800">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold border-b border-gray-200">User Name</th>
                    <th className="px-6 py-4 text-sm font-semibold border-b border-gray-200">Working Days</th>
                    <th className="px-6 py-4 text-sm font-semibold border-b border-gray-200">Leaves</th>
                    <th className="px-6 py-4 text-sm font-semibold border-b border-gray-200">Weekends</th>
                    <th className="px-6 py-4 text-sm font-semibold border-b border-gray-200">Holidays</th>
                    <th className="px-6 py-4 text-sm font-semibold border-b border-gray-200">Total Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => {
                    const metrics = calculateUserMetrics(user, year, month);
                    return (
                      <tr
                        key={user.id}
                        className={"hover:bg-gray-50 transition-colors duration-200 bg-white"
                        } onClick={()=>{navigate(`./${user?.id}`)}}
                      >
                        {/* bg-gray-50 */}
                        <td className="px-6 py-4 border-b border-gray-200 text-gray-700">{user?.displayName || "Unknown"}</td>
                        <td className="px-6 py-4 border-b border-gray-200 text-gray-700">{metrics.workingDays}</td>
                        <td className="px-6 py-4 border-b border-gray-200 text-gray-700">{metrics.leaves}</td>
                        <td className="px-6 py-4 border-b border-gray-200 text-gray-700">{metrics.weekends}</td>
                        <td className="px-6 py-4 border-b border-gray-200 text-gray-700">{metrics.holidays}</td>
                        <td className="px-6 py-4 border-b border-gray-200 text-gray-700">{metrics.totalHours}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeAttendance;