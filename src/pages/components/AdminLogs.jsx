import React, { useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState({
    canCreate: false,
    canUpdate: false,
    canDelete: false,
    canDisplay: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [sectionFilter, setSectionFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const recordsPerPage = 10;

  const getUserRoleAndPermissions = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'Users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const roleDoc = await getDoc(doc(db, 'roles', userData.role));
        if (roleDoc.exists()) {
          const roleData = roleDoc.data();
          const rolePermissions = roleData.permissions || {};
          return {
            role: roleData.name,
            permissions: {
              canCreate: rolePermissions?.activityLogs?.create || false,
              canUpdate: rolePermissions?.activityLogs?.update || false,
              canDelete: rolePermissions?.activityLogs?.delete || false,
              canDisplay: rolePermissions?.activityLogs?.display || false,
            },
          };
        }
        console.warn(`Role document for role ${userData.role} does not exist`);
        return { role: null, permissions: { canCreate: false, canUpdate: false, canDelete: false, canDisplay: false } };
      }
      console.warn(`User document for UID ${uid} does not exist`);
      return { role: null, permissions: { canCreate: false, canUpdate: false, canDelete: false, canDisplay: false } };
    } catch (error) {
      console.error('Error fetching user role and permissions:', error);
      return { role: null, permissions: { canCreate: false, canUpdate: false, canDelete: false, canDisplay: false } };
    }
  };

  const fetchUserData = async (userId) => {
    try {
      if (!userId) {
        console.warn('No userId provided for fetching user data');
        return { displayName: 'Unknown', email: 'Unknown' };
      }
      const userDoc = await getDoc(doc(db, 'Users', userId));
      if (userDoc.exists()) {
        const { displayName, email } = userDoc.data();
        return {
          displayName: displayName || 'Unknown',
          email: email || 'Unknown',
        };
      }
      console.warn(`User document for userId ${userId} does not exist`);
      return { displayName: 'Unknown', email: 'Unknown' };
    } catch (error) {
      console.error('Error fetching user data:', error);
      return { displayName: 'Unknown', email: 'Unknown' };
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      const date = new Date(timestamp);
      return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'Invalid Date';
    }
  };

  const formatDetails = (details) => {
    if (!details || typeof details !== 'object') {
      return <p className="text-gray-600">No additional details available.</p>;
    }

    if (details.before && details.after) {
      const before = details.before;
      const after = details.after;
      const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])];

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Before</h4>
            <ul className="list-disc pl-5 text-gray-600">
              {keys.map((key) => (
                <li key={`before-${key}`}>
                  <span className="font-medium">{key}:</span>{' '}
                  {before[key] !== undefined ? String(before[key]) : 'Not set'}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">After</h4>
            <ul className="list-disc pl-5 text-gray-600">
              {keys.map((key) => (
                <li key={`after-${key}`}>
                  <span className="font-medium">{key}:</span>{' '}
                  {after[key] !== undefined ? String(after[key]) : 'Not set'}
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    return (
      <ul className="list-disc pl-5 text-gray-600">
        {Object.entries(details).map(([key, value]) => (
          <li key={key}>
            <span className="font-medium">{key}:</span>{' '}
            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
          </li>
        ))}
      </ul>
    );
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      setPermissions({ canCreate: false, canUpdate: false, canDelete: false, canDisplay: false });
      return;
    }

    const fetchLogsWithPermissions = async () => {
      const { permissions } = await getUserRoleAndPermissions(user.uid);
      setPermissions(permissions);

      if (!permissions.canDisplay) {
        setLoading(false);
        return;
      }

      const logDocRef = doc(db, 'activityLogs', 'logDocument');

      const unsubscribe = onSnapshot(
        logDocRef,
        async (snap) => {
          if (!snap.exists()) {
            console.warn('Log document activityLogs/logDocument does not exist');
            setLogs([]);
            setLoading(false);
            return;
          }

          const logData = snap.data();
          const logsArray = logData.logs || [];

          const logsData = await Promise.all(
            logsArray
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .map(async (logData, index) => {
                if (!logData.userId) {
                  console.warn(`No userId found in activity log entry: ${index}`);
                  return {
                    id: `log-${index}`,
                    ...logData,
                    displayName: 'Unknown',
                    userEmail: logData.userEmail || 'Unknown',
                  };
                }
                const { displayName, email } = await fetchUserData(logData.userId);
                return {
                  id: `log-${index}`,
                  ...logData,
                  displayName,
                  userEmail: logData.userEmail || email,
                };
              })
          );

          setLogs(logsData);
          setCurrentPage(1); // Reset to first page on new data
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching logs:', error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    };

    fetchLogsWithPermissions();
  }, []);

  // Filter logs based on section, user, and date range
  const filteredLogs = logs.filter((log) => {
    const sectionMatch = !sectionFilter || log.action === sectionFilter;
    const userMatch = !userFilter || log.displayName === userFilter || (log.userId === userFilter && log.displayName === 'Unknown');
    const dateMatch = !dateRange.start && !dateRange.end
      ? true
      : (() => {
          const logDate = new Date(log.timestamp);
          if (isNaN(logDate.getTime())) return false;
          const start = dateRange.start ? new Date(dateRange.start) : null;
          const end = dateRange.end ? new Date(dateRange.end) : null;
          if (start) start.setHours(0, 0, 0, 0);
          if (end) end.setHours(23, 59, 59, 999);
          return (!start || logDate >= start) && (!end || logDate <= end);
        })();
    return sectionMatch && userMatch && dateMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredLogs.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, endIndex);

  // Get unique sections and users for filter options
  const sections = [...new Set(logs.map((log) => log.action).filter(Boolean))].sort();
  const users = [...new Set(
    logs.map((log) => log.displayName !== 'Unknown' ? log.displayName : log.userId ? `${log.displayName} (${log.userId})` : null).filter(Boolean)
  )].sort();

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleDateChange = (field) => (e) => {
    setDateRange((prev) => ({ ...prev, [field]: e.target.value }));
    setCurrentPage(1); // Reset to first page on date change
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Loading logs...</p>
      </div>
    );
  }

  if (!permissions.canDisplay) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600 text-lg">You are not authorized to view activity logs.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 fixed inset-0 left-[300px] overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Activity Logs</h2>
        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="sectionFilter" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Section
            </label>
            <select
              id="sectionFilter"
              value={sectionFilter}
              onChange={handleFilterChange(setSectionFilter)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">All Sections</option>
              {sections.map((section) => (
                <option key={section} value={section}>{section}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="userFilter" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by User
            </label>
            <select
              id="userFilter"
              value={userFilter}
              onChange={handleFilterChange(setUserFilter)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">All Users</option>
              {users.map((user) => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Date Range</label>
            <div className="flex space-x-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={handleDateChange('start')}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={handleDateChange('end')}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
        {filteredLogs.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No logs match the selected filters.</p>
        ) : (
          <>
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatTimestamp(log.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {log.displayName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {log.userEmail}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{log.action}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDetails(log.details)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md text-white ${
                  currentPage === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                } transition duration-200`}
              >
                Previous
              </button>
              <span className="text-gray-600">
                Page {currentPage} of {totalPages} ({filteredLogs.length} total logs)
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md text-white ${
                  currentPage === totalPages ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                } transition duration-200`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminLogs;