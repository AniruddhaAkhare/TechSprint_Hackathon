import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
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
      if (timestamp.toDate && typeof timestamp.toDate === 'function') {
        return new Date(timestamp.toDate()).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
      }
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

      const logsQuery = query(collection(db, 'activityLogs'), orderBy('timestamp', 'desc'));

      const unsubscribe = onSnapshot(
        logsQuery,
        async (snapshot) => {
          const logsData = await Promise.all(
            snapshot.docs.map(async (doc) => {
              const logData = doc.data();
              if (!logData.userId) {
                console.warn(`No userId found in activity log: ${doc.id}`);
                return {
                  id: doc.id,
                  ...logData,
                  displayName: 'Unknown',
                  userEmail: logData.userEmail || 'Unknown',
                };
              }
              const { displayName, email } = await fetchUserData(logData.userId);
              return {
                id: doc.id,
                ...logData,
                displayName,
                userEmail: logData.userEmail || email,
              };
            })
          );

          setLogs(logsData);
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
    <div className="min-h-screen bg-gray-50 p-6 ml-400">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Activity Logs</h2>

        <div className="mb-6 flex justify-between items-center">
          <div>
            {permissions.canCreate && (
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mr-2"
                disabled
                title="Create functionality not implemented"
              >
                Create Log
              </button>
            )}
            {permissions.canUpdate && (
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mr-2"
                disabled
                title="Update functionality not implemented"
              >
                Update Log
              </button>
            )}
            {permissions.canDelete && (
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                disabled
                title="Delete functionality not implemented"
              >
                Delete Log
              </button>
            )}
          </div>
        </div>

        {logs.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No logs available.</p>
        ) : (
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
                {logs.map((log) => (
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
        )}
      </div>
    </div>
  );
};

export default AdminLogs;