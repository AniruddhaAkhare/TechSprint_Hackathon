// import React, { useState, useEffect } from "react";
// import { db } from "../../../../config/firebase";
// import { collection, getDocs } from "firebase/firestore";
// import { useAuth } from "../../../../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// const EmployeeAttendance = () => {
//   const { user } = useAuth();
//   const [users, setUsers] = useState([]);
//   const [holidays, setHolidays] = useState([]);
//   const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const usersSnapshot = await getDocs(collection(db, "Users"));
//         const usersData = usersSnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setUsers(usersData);

//         const holidaysSnapshot = await getDocs(collection(db, "Holidays"));
//         const holidaysData = holidaysSnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setHolidays(holidaysData);
//       } catch (err) {
//         //console.error("Error fetching data:", err);
//         setError("Failed to load data.");
//       }
//       setLoading(false);
//     };

//     if (user) {
//       fetchData();
//     }
//   }, [user]);

//   const getDaysInMonth = (year, month) => {
//     return new Date(year, month, 0).getDate();
//   };

//   const isWeekend = (date) => {
//     const day = new Date(date).getDay();
//     return day === 0;
//   };

//   const getWeekendsInMonth = (year, month) => {
//     let weekends = 0;
//     const daysInMonth = getDaysInMonth(year, month);
//     for (let day = 1; day <= daysInMonth; day++) {
//       const date = new Date(year, month - 1, day).toISOString().split("T")[0];
//       if (isWeekend(date)) {
//         weekends++;
//       }
//     }
//     return weekends;
//   };

//   const getHolidaysInMonth = (year, month) => {
//     return holidays.filter((holiday) => {
//       const holidayDate = new Date(holiday.date);
//       return holidayDate.getFullYear() === year && holidayDate.getMonth() === month - 1;
//     }).length;
//   };

//   const calculateUserMetrics = (user, year, month) => {
//     const dailyDurations = user.dailyDurations || [];
//     const daysInMonth = getDaysInMonth(year, month);
//     let workingDays = 0;
//     let totalHours = 0;
//     let leaves = 0;

//     const monthDurations = dailyDurations.filter((entry) => {
//       const entryDate = new Date(entry.date);
//       return entryDate.getFullYear() === year && entryDate.getMonth() === month - 1;
//     });

//     monthDurations.forEach((entry) => {
//       workingDays++;
//       totalHours += parseFloat(entry.totalDuration || 0);
//     });

//     for (let day = 1; day <= daysInMonth - getWeekendsInMonth(year, month) - getHolidaysInMonth(year, month); day++) {
//       const dateStr = new Date(year, month - 1, day).toISOString().split("T")[0];
//       const hasActivity = dailyDurations.some((entry) => entry.date === dateStr);
//       if (!hasActivity) {
//         leaves++;
//       }
//     }

//     return {
//       workingDays,
//       leaves,
//       weekends: getWeekendsInMonth(year, month),
//       holidays: getHolidaysInMonth(year, month),
//       totalHours: totalHours.toFixed(2),
//     };
//   };

//   const handleMonthChange = (e) => {
//     setSelectedMonth(e.target.value);
//   };

//   const [year, month] = selectedMonth.split("-").map(Number);

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 fixed inset-0 left-[300px]">
//       <div className="max-w-7xl mx-auto">
//         <div className="bg-white rounded-lg shadow-lg p-6">
//           <h3 className="text-2xl font-semibold text-gray-800 mb-6">HR Dashboard - Employee Attendance</h3>
//           {error && (
//             <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
//               {error}
//             </div>
//           )}
//           <div className="mb-6 flex items-center gap-4">
//             <label htmlFor="month" className="text-sm font-medium text-gray-700">
//               Select Month:
//             </label>
//             <input
//               type="month"
//               id="month"
//               value={selectedMonth}
//               onChange={handleMonthChange}
//               className="border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
//           {loading ? (
//             <div className="flex justify-center items-center h-64">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-left border-separate border-spacing-0">
//                 <thead className="bg-gray-50 text-black-800">
//                   <tr>
//                     <th className="px-6 py-4 text-sm font-semibold border-b border-gray-200">User Name</th>
//                     <th className="px-6 py-4 text-sm font-semibold border-b border-gray-200">Working Days</th>
//                     <th className="px-6 py-4 text-sm font-semibold border-b border-gray-200">Leaves</th>
//                     <th className="px-6 py-4 text-sm font-semibold border-b border-gray-200">Weekends</th>
//                     <th className="px-6 py-4 text-sm font-semibold border-b border-gray-200">Holidays</th>
//                     <th className="px-6 py-4 text-sm font-semibold border-b border-gray-200">Total Hours</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {users.map((user, index) => {
//                     const metrics = calculateUserMetrics(user, year, month);
//                     return (
//                       <tr
//                         key={user.id}
//                         className={"hover:bg-gray-50 transition-colors duration-200 bg-white"
//                         } onClick={()=>{navigate(`./${user?.id}`)}}
//                       >
//                         {/* bg-gray-50 */}
//                         <td className="px-6 py-4 border-b border-gray-200 text-gray-700">{user?.displayName || "Unknown"}</td>
//                         <td className="px-6 py-4 border-b border-gray-200 text-gray-700">{metrics.workingDays}</td>
//                         <td className="px-6 py-4 border-b border-gray-200 text-gray-700">{metrics.leaves}</td>
//                         <td className="px-6 py-4 border-b border-gray-200 text-gray-700">{metrics.weekends}</td>
//                         <td className="px-6 py-4 border-b border-gray-200 text-gray-700">{metrics.holidays}</td>
//                         <td className="px-6 py-4 border-b border-gray-200 text-gray-700">{metrics.totalHours}</td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeeAttendance;



import React, { useState, useEffect } from "react";
import { db } from "../../../../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "../../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const EmployeeAttendance = () => {
  const { user, rolePermissions } = useAuth();
  const [users, setUsers] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Define permissions
  const canView = rolePermissions?.Users?.display || false;
  // const canCreate = rolePermissions?.employeeAttendance?.create || false; // Reserved for future use
  // const canUpdate = rolePermissions?.employeeAttendance?.update || false; // Reserved for future use
  // const canDelete = rolePermissions?.employeeAttendance?.delete || false; // Reserved for future use

  useEffect(() => {
    const fetchData = async () => {
      if (!canView) {
        setError("You do not have permission to view employee attendance data.");
        setLoading(false);
        return;
      }
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
        // //console.error("Error fetching data:", err);
        setError("Failed to load data.");
      }
      setLoading(false);
    };

    if (user && canView) {
      fetchData();
    } else if (!canView) {
      setError("You do not have permission to view employee attendance data.");
      setLoading(false);
    }
  }, [user, canView]);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  const isWeekend = (date) => {
    const day = new Date(date).getDay();
    return day === 0; // Sunday
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
    if (!canView) {
      alert("You do not have permission to change the month filter.");
      return;
    }
    setSelectedMonth(e.target.value);
  };

  const handleRowClick = (userId) => {
    if (!canView) {
      alert("You do not have permission to view user attendance details.");
      return;
    }
    navigate(`./${userId}`);
  };

  const [year, month] = selectedMonth.split("-").map(Number);

  if (!canView) {
    return (
      <div className="p-4 text-red-600 text-center">
        Access Denied: You do not have permission to view employee attendance data.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-100 min-h-screen fixed inset-0 left-[300px] overflow-y-auto">
  <div className="max-w-7xl mx-auto">
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h1 className="text-2xl font-bold text-[#333333] font-sans mb-8">
        Employee Attendance Dashboard
      </h1>

      {error && (
        <div className="bg-red-50 p-4 rounded-xl border border-red-200 mb-6 text-sm text-red-600 font-medium">
          {error}
        </div>
      )}

      <div className="mb-8 flex items-center gap-4">
        <label htmlFor="month" className="text-sm font-semibold text-gray-700">
          Select Month
        </label>
        <input
          type="month"
          id="month"
          value={selectedMonth}
          onChange={handleMonthChange}
          className="w-full sm:w-48 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg shadow-sm text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
          disabled={!canView}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-solid"></div>
        </div>
      ) : (
        <div className="overflow-x-auto h-[70vh] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  User Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Working Days
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Leaves
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Weekends
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Holidays
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Total Hours
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user, index) => {
                const metrics = calculateUserMetrics(user, year, month);
                return (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                    onClick={() => handleRowClick(user.id)}
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {user?.displayName || "Unknown"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{metrics.workingDays}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{metrics.leaves}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{metrics.weekends}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{metrics.holidays}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{metrics.totalHours}</td>
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