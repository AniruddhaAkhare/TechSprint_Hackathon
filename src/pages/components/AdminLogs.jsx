import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch user role (adjusted for your DB structure)
  const getUserRole = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'Users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const roleDoc = await getDoc(doc(db, 'roles', userData.role));
        return roleDoc.exists() ? roleDoc.data().name : null;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user role:", error);
      return null;
    }
  };

  // Function to fetch displayName from Users collection
  const fetchUserDisplayName = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'Users', userId));
      return userDoc.exists() ? userDoc.data().displayName || 'Unknown' : 'Unknown';
    } catch (error) {
      console.error("Error fetching display name:", error);
      return 'Unknown';
    }
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    const checkAdminAndFetchLogs = async () => {
      const userRole = await getUserRole(user.uid);
      if (userRole !== 'Admin') {
        alert('You are not authorized to view logs');
        setLoading(false);
        return;
      }

      const logsQuery = query(
        collection(db, 'activityLogs'),
        orderBy('timestamp', 'desc')
      );

      const unsubscribe = onSnapshot(logsQuery, async (snapshot) => {
        const logsData = await Promise.all(snapshot.docs.map(async (doc) => {
          const logData = doc.data();
          const displayName = await fetchUserDisplayName(logData.userId);
          return {
            id: doc.id,
            ...logData,
            displayName
          };
        }));
        setLogs(logsData);
        setLoading(false);
      }, (error) => {
        console.error("Error listening to logs:", error);
        setLoading(false);
      });

      return () => unsubscribe();
    };

    checkAdminAndFetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Loading logs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Activity Logs</h2>
        {logs.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No logs available.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {log.timestamp ? new Date(log.timestamp.toDate()).toLocaleString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{log.displayName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{log.userEmail}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{log.action}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 break-all">{JSON.stringify(log.details)}</td>
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