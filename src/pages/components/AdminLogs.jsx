import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import Select from 'react-select';

const AdminLogs = () => {
  // const [logs, setLogs] = useState([]);
  // const [filteredLogs, setFilteredLogs] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [timeFilter, setTimeFilter] = useState('all');
  // const [userFilter, setUserFilter] = useState('');
  // const [activityFilter, setActivityFilter] = useState(null);
  // const [uniqueUsers, setUniqueUsers] = useState([]);
  // const [uniqueActions, setUniqueActions] = useState([]);

  // const getUserRole = async (uid) => {
  //   try {
  //     const userDoc = await getDoc(doc(db, 'Users', uid));
  //     if (userDoc.exists()) {
  //       const userData = userDoc.data();
  //       const roleDoc = await getDoc(doc(db, 'roles', userData.role));
  //       return roleDoc.exists() ? roleDoc.data().name : null;
  //     }
  //     console.warn(`User document for UID ${uid} does not exist`);
  //     return null;
  //   } catch (error) {
  //     console.error('Error fetching user role:', error);
  //     return null;
  //   }
  // };

  // const fetchUserData = async (userId) => {
  //   try {
  //     if (!userId) {
  //       console.warn('No userId provided for fetching user data');
  //       return { displayName: 'Unknown', email: 'Unknown' };
  //     }
  //     const userDoc = await getDoc(doc(db, 'Users', userId));
  //     if (userDoc.exists()) {
  //       const { displayName, email } = userDoc.data();
  //       return {
  //         displayName: displayName || 'Unknown',
  //         email: email || 'Unknown',
  //       };
  //     }
  //     console.warn(`User document for userId ${userId} does not exist`);
  //     return { displayName: 'Unknown', email: 'Unknown' };
  //   } catch (error) {
  //     console.error('Error fetching user data for userId:', userId, error);
  //     return { displayName: 'Unknown', email: 'Unknown' };
  //   }
  // };

  // const formatTimestamp = (timestamp) => {
  //   if (!timestamp) return 'N/A';
  //   try {
  //     if (timestamp.toDate && typeof timestamp.toDate === 'function') {
  //       return new Date(timestamp.toDate()).toLocaleString();
  //     }
  //     const date = new Date(timestamp);
  //     return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
  //   } catch (error) {
  //     console.error('Error formatting timestamp:', error, timestamp);
  //     return 'Invalid Date';
  //   }
  // };

  // const formatDetails = (details) => {
  //   if (!details || typeof details !== 'object') {
  //     return <p className="text-gray-600">No additional details available.</p>;
  //   }

  //   if (details.before && details.after) {
  //     const before = details.before;
  //     const after = details.after;
  //     const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])];

  //     return (
  //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //         <div>
  //           <h4 className="font-semibold text-gray-700 mb-2">Before</h4>
  //           <ul className="list-disc pl-5 text-gray-600">
  //             {keys.map((key) => (
  //               <li key={`before-${key}`}>
  //                 <span className="font-medium">{key}:</span>{' '}
  //                 {before[key] !== undefined ? String(before[key]) : 'Not set'}
  //               </li>
  //             ))}
  //           </ul>
  //         </div>
  //         <div>
  //           <h4 className="font-semibold text-gray-700 mb-2">After</h4>
  //           <ul className="list-disc pl-5 text-gray-600">
  //             {keys.map((key) => (
  //               <li key={`after-${key}`}>
  //                 <span className="font-medium">{key}:</span>{' '}
  //                 {after[key] !== undefined ? String(after[key]) : 'Not set'}
  //               </li>
  //             ))}
  //           </ul>
  //         </div>
  //       </div>
  //     );
  //   }

  //   return (
  //     <ul className="list-disc pl-5 text-gray-600">
  //       {Object.entries(details).map(([key, value]) => (
  //         <li key={key}>
  //           <span className="font-medium">{key}:</span>{' '}
  //           {typeof value === 'object' ? JSON.stringify(value) : String(value)}
  //         </li>
  //       ))}
  //     </ul>
  //   );
  // };

  // const applyFilters = (logsData) => {
  //   let filtered = [...logsData];
  
  //   // Apply time filter
  //   if (timeFilter !== 'all') {
  //     const now = new Date();
  //     filtered = filtered.filter((log) => {
  //       const logDate = log.timestamp?.toDate ? log.timestamp.toDate() : new Date(log.timestamp);
  //       switch (timeFilter) {
  //         case '24h':
  //           return now - logDate <= 24 * 60 * 60 * 1000;
  //         case '7d':
  //           return now - logDate <= 7 * 24 * 60 * 60 * 1000;
  //         case '30d':
  //           return now - logDate <= 30 * 24 * 60 * 60 * 1000;
  //         default:
  //           return true;
  //       }
  //     });
  //   }
  
  //   // Apply user filter
  //   if (userFilter.trim()) {
  //     const searchTerm = userFilter.trim().toLowerCase();
  //     filtered = filtered.filter((log) => {
  //       const nameMatch = log.displayName?.toLowerCase().includes(searchTerm);
  //       const emailMatch = log.userEmail?.toLowerCase().includes(searchTerm);
  //       return nameMatch || emailMatch;
  //     });
  //   }
  
  //   // Apply activity filter
  //   if (activityFilter) {
  //     filtered = filtered.filter((log) =>
  //       log.action?.toLowerCase() === activityFilter.value.toLowerCase()
  //     );
  //   }
  
  //   // Explicitly sort by timestamp (descending, most recent first)
  //   filtered.sort((a, b) => {
  //     const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
  //     const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
  //     return dateB - dateA; // Descending order
  //   });
  
  //   setFilteredLogs(filtered);
  // };

  // useEffect(() => {
  //   const user = auth.currentUser;
  //   if (!user) {
  //     setLoading(false);
  //     return;
  //   }

  //   const checkAdminAndFetchLogs = async () => {
  //     const userRole = await getUserRole(user.uid);
  //     if (userRole !== 'Admin') {
  //       alert('You are not authorized to view logs');
  //       setLoading(false);
  //       return;
  //     }

  //     const logsQuery = query(collection(db, 'activityLogs'), orderBy('timestamp', 'desc'));

  //     const unsubscribe = onSnapshot(
  //       logsQuery,
  //       async (snapshot) => {
  //         const logsData = await Promise.all(
  //           snapshot.docs.map(async (doc) => {
  //             const logData = doc.data();
  //             // Ensure userId exists in activityLogs
  //             if (!logData.userId) {
  //               console.warn(`No userId found in activity log: ${doc.id}`);
  //               return {
  //                 id: doc.id,
  //                 ...logData,
  //                 displayName: 'Unknown',
  //                 userEmail: logData.userEmail || 'Unknown',
  //               };
  //             }
  //             // Fetch displayName and email from Users collection
  //             const { displayName, email } = await fetchUserData(logData.userId);
  //             return {
  //               id: doc.id,
  //               ...logData,
  //               displayName,
  //               userEmail: logData.userEmail || email, // Prefer userEmail from activityLogs, fallback to Users
  //             };
  //           })
  //         );

  //         setLogs(logsData);
  //         const users = [...new Set(logsData.map((log) => log.displayName))];
  //         const actions = [...new Set(logsData.map((log) => log.action))];
  //         setUniqueUsers(users);
  //         setUniqueActions(actions);
  //         applyFilters(logsData);
  //         setLoading(false);
  //       },
  //       (error) => {
  //         console.error('Error listening to logs:', error);
  //         setLoading(false);
  //       }
  //     );

  //     return () => unsubscribe();
  //   };

  //   checkAdminAndFetchLogs();
  // }, []);

  // useEffect(() => {
  //   applyFilters(logs);
  // }, [timeFilter, userFilter, activityFilter]);

  // const activityOptions = [
  //   { value: '', label: 'All Activities' },
  //   ...uniqueActions.map((action) => ({ value: action, label: action })),
  // ];

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <p className="text-gray-600 text-lg">Loading logs...</p>
  //     </div>
  //   );
  // }

  // return (
  //   <div className="min-h-screen bg-gray-50 p-6">
  //     <div className="max-w-6xl mx-auto">
  //       <h2 className="text-2xl font-bold text-gray-800 mb-6">Activity Logs</h2>

  //       <div className="mb-6 bg-white p-4 rounded-lg shadow-md flex flex-wrap gap-4">
  //         <div className="flex-1 min-w-[200px]">
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
  //           <select
  //             value={timeFilter}
  //             onChange={(e) => setTimeFilter(e.target.value)}
  //             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  //           >
  //             <option value="all">All Time</option>
  //             <option value="24h">Last 24 Hours</option>
  //             <option value="7d">Last 7 Days</option>
  //             <option value="30d">Last 30 Days</option>
  //           </select>
  //         </div>

  //         <div className="flex-1 min-w-[200px]">
  //           <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
  //           <input
  //             type="text"
  //             value={userFilter}
  //             onChange={(e) => setUserFilter(e.target.value)}
  //             placeholder="Search by name or email..."
  //             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  //           />
  //         </div>

  //         <div className="flex-1 min-w-[200px]">
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Activity Type</label>
  //           <Select
  //             options={activityOptions}
  //             value={activityFilter}
  //             onChange={(selectedOption) => setActivityFilter(selectedOption)}
  //             placeholder="Select or search activity..."
  //             isClearable
  //             className="text-sm"
  //             styles={{
  //               control: (base) => ({
  //                 ...base,
  //                 borderColor: '#d1d5db',
  //                 '&:hover': { borderColor: '#2563eb' },
  //                 boxShadow: 'none',
  //               }),
  //               option: (base, { isFocused }) => ({
  //                 ...base,
  //                 backgroundColor: isFocused ? '#dbeafe' : 'white',
  //                 color: '#1f2937',
  //               }),
  //             }}
  //           />
  //         </div>
  //       </div>

  //       {filteredLogs.length === 0 ? (
  //         <p className="text-gray-500 text-center py-4">No logs match the current filters.</p>
  //       ) : (
  //         <div className="overflow-x-auto bg-white rounded-lg shadow-md">
  //           <table className="min-w-full divide-y divide-gray-200">
  //             <thead className="bg-gray-100">
  //               <tr>
  //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                   Timestamp
  //                 </th>
  //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                   User
  //                 </th>
  //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                   Email
  //                 </th>
  //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                   Action
  //                 </th>
  //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                   Details
  //                 </th>
  //               </tr>
  //             </thead>
  //             <tbody className="bg-white divide-y divide-gray-200">
  //               {filteredLogs.map((log) => (
  //                 <tr key={log.id} className="hover:bg-gray-50 transition duration-150">
  //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
  //                     {formatTimestamp(log.timestamp)}
  //                   </td>
  //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
  //                     {log.displayName}
  //                   </td>
  //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
  //                     {log.userEmail}
  //                   </td>
  //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{log.action}</td>
  //                   <td className="px-6 py-4 text-sm text-gray-600">
  //                     <Disclosure>
  //                       {({ open }) => (
  //                         <>
  //                           <Disclosure.Button className="flex items-center text-blue-600 hover:text-blue-800 focus:outline-none">
  //                             <span>View Details</span>
  //                             <ChevronDownIcon
  //                               className={`ml-2 h-5 w-5 transform ${open ? 'rotate-180' : ''}`}
  //                             />
  //                           </Disclosure.Button>
  //                           <Disclosure.Panel className="mt-2 p-4 bg-gray-50 rounded-md">
  //                             {formatDetails(log.details)}
  //                           </Disclosure.Panel>
  //                         </>
  //                       )}
  //                     </Disclosure>
  //                   </td>
  //                 </tr>
  //               ))}
  //             </tbody>
  //           </table>
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );
};

export default AdminLogs;