// import { useState, useEffect } from "react";
// import { db } from '../../../../config/firebase.js';
// import { getDocs, collection, deleteDoc, doc, query, orderBy, updateDoc } from 'firebase/firestore';
// import CreateSession from "./CreateSession.jsx";
// import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";
// import { Select, MenuItem, FormControl } from '@mui/material';
// import { useAuth } from "../../../../context/AuthContext.jsx";

// export default function Sessions() {
//     const { rolePermissions } = useAuth();

//     // Permission checks (already present, renamed to match previous examples)
//     const canCreate = rolePermissions.Sessions?.create || false;
//     const canUpdate = rolePermissions.Sessions?.update || false;
//     const canDelete = rolePermissions.Sessions?.delete || false;
//     const canDisplay = rolePermissions.Sessions?.display || false;

//     const [currentSession, setCurrentSession] = useState(null);
//     const [sessions, setSessions] = useState([]); // Renamed 'session' to 'sessions' for clarity
//     const [searchTerm, setSearchTerm] = useState('');
//     const [searchResults, setSearchResults] = useState([]);
//     const [isOpen, setIsOpen] = useState(false);
//     const [openDelete, setOpenDelete] = useState(false);
//     const [deleteId, setDeleteId] = useState(null);
//     const [statusFilter, setStatusFilter] = useState('Active');
//     const [deleteMessage, setDeleteMessage] = useState("Are you sure you want to delete this session? This action cannot be undone."); // Added for consistency

//     const SessionCollectionRef = collection(db, "Sessions");

//     const toggleSidebar = () => setIsOpen(prev => !prev);

//     const handleSearch = (e) => {
//         if (e) e.preventDefault();
//         if (!searchTerm.trim()) {
//             setSearchResults([]);
//             return;
//         }
//         const results = sessions.filter(s =>
//             s.name.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//         setSearchResults(results);
//     };

//     useEffect(() => {
//         if (searchTerm) {
//             handleSearch();
//         } else {
//             setSearchResults([]);
//         }
//     }, [searchTerm, sessions]); // Added 'sessions' dependency for real-time updates

//     const calculateSessionStatus = (session) => {
//         const sessionDateTime = new Date(`${session.date} ${session.endTime}`);
//         const currentDateTime = new Date();
//         return sessionDateTime < currentDateTime ? "Inactive" : "Active";
//     };

//     const fetchSessions = async () => {
//         if (!canDisplay) return;
//         try {
//             const q = query(SessionCollectionRef, orderBy('createdAt', 'desc'));
//             const snapshot = await getDocs(q);
//             const sessionData = snapshot.docs.map(doc => ({
//                 id: doc.id,
//                 ...doc.data(),
//             }));

//             const updatedSessions = await Promise.all(sessionData.map(async (s) => {
//                 const calculatedStatus = calculateSessionStatus(s);
//                 if (s.status !== calculatedStatus && canUpdate) {
//                     await updateDoc(doc(db, "Sessions", s.id), { status: calculatedStatus });
//                     return { ...s, status: calculatedStatus };
//                 }
//                 return s;
//             }));

//             setSessions(updatedSessions);
//         } catch (error) {
//             console.error("Error fetching sessions:", error);
//         }
//     };

//     useEffect(() => {
//         fetchSessions();
//     }, [canDisplay, canUpdate]);

//     const handleCreateSessionClick = () => {
//         if (!canCreate) {
//             alert("You do not have permission to create sessions.");
//             return;
//         }
//         setCurrentSession(null);
//         toggleSidebar();
//     };

//     const handleEditClick = (session) => {
//         if (!canUpdate) {
//             alert("You do not have permission to update sessions.");
//             return;
//         }
//         setCurrentSession(session);
//         setIsOpen(true);
//     };

//     const handleClose = () => {
//         setIsOpen(false);
//         setCurrentSession(null);
//         fetchSessions();
//     };

//     const deleteSession = async () => {
//         if (!deleteId || !canDelete) {
//             if (!canDelete) alert("You do not have permission to delete sessions.");
//             return;
//         }
//         try {
//             await deleteDoc(doc(db, "Sessions", deleteId));
//             setOpenDelete(false);
//             setDeleteMessage("Are you sure you want to delete this session? This action cannot be undone.");
//             fetchSessions();
//         } catch (error) {
//             console.error("Error deleting session:", error);
//             setDeleteMessage("Failed to delete session. Please try again.");
//         }
//     };

//     const filteredSessions = () => {
//         const baseSessions = searchResults.length > 0 ? searchResults : sessions;
//         if (statusFilter === 'All') return baseSessions;
//         return baseSessions.filter(s => s.status === statusFilter);
//     };

//     if (!canDisplay) {
//         return (
//             <div className="p-4 text-red-600 text-center">
//                 Access Denied: You do not have permission to view sessions.
//             </div>
//         );
//     }

//     return (
//         <div className="flex flex-col w-full min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//                 <h1 className="text-2xl font-semibold text-gray-800">Sessions</h1>
//                 <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
//                     <FormControl size="small" className="w-full sm:w-40">
//                         <Select
//                             value={statusFilter}
//                             onChange={(e) => setStatusFilter(e.target.value)}
//                             className="bg-white border border-gray-300 rounded-md"
//                         >
//                             <MenuItem value="All">All</MenuItem>
//                             <MenuItem value="Active">Active</MenuItem>
//                             <MenuItem value="Inactive">Inactive</MenuItem>
//                         </Select>
//                     </FormControl>
//                     {canCreate && (
//                         <button
//                             onClick={handleCreateSessionClick}
//                             className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition duration-200 w-full sm:w-auto"
//                         >
//                             + Create Session
//                         </button>
//                     )}
//                 </div>
//             </div>

//             <div className="bg-white p-6 rounded-lg shadow-md">
//                 <div className="mb-6">
//                     <input
//                         type="text"
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         placeholder="Search sessions by name..."
//                         className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                 </div>

//                 <div className="rounded-lg shadow-md overflow-x-auto">
//                     <table className="w-full table-auto">
//                         <thead className="bg-gray-100">
//                             <tr>
//                                 <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Sr No</th>
//                                 <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Session Name</th>
//                                 <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Date</th>
//                                 <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Start Time</th>
//                                 <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">End Time</th>
//                                 <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Mode</th>
//                                 <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Status</th>
//                                 <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Action</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {filteredSessions().map((s, index) => (
//                                 <tr key={s.id} className="border-b hover:bg-gray-50">
//                                     <td className="px-4 py-3 text-gray-600">{index + 1}</td>
//                                     <td className="px-4 py-3 text-gray-800">{s.name || 'N/A'}</td>
//                                     <td className="px-4 py-3 text-gray-600">{s.date || 'N/A'}</td>
//                                     <td className="px-4 py-3 text-gray-600">{s.startTime || 'N/A'}</td>
//                                     <td className="px-4 py-3 text-gray-600">{s.endTime || 'N/A'}</td>
//                                     <td className="px-4 py-3 text-gray-600">{s.sessionMode || 'N/A'}</td>
//                                     <td className="px-4 py-3 text-gray-600">
//                                         <span className={`px-2 py-1 rounded-full text-sm ${s.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//                                             {s.status}
//                                         </span>
//                                     </td>
//                                     <td className="px-4 py-3">
//                                         {(canUpdate || canDelete) && (
//                                             <FormControl size="small">
//                                                 <Select
//                                                     value=""
//                                                     onChange={(e) => {
//                                                         const action = e.target.value;
//                                                         if (action === 'edit' && canUpdate) {
//                                                             handleEditClick(s);
//                                                         } else if (action === 'delete' && canDelete) {
//                                                             setDeleteId(s.id);
//                                                             setOpenDelete(true);
//                                                             setDeleteMessage("Are you sure you want to delete this session? This action cannot be undone.");
//                                                         }
//                                                     }}
//                                                     displayEmpty
//                                                     renderValue={() => "Actions"}
//                                                     className="text-sm"
//                                                     disabled={!canUpdate && !canDelete}
//                                                 >
//                                                     <MenuItem value="" disabled>Actions</MenuItem>
//                                                     {canUpdate && <MenuItem value="edit">Edit</MenuItem>}
//                                                     {canDelete && <MenuItem value="delete">Delete</MenuItem>}
//                                                 </Select>
//                                             </FormControl>
//                                         )}
//                                     </td>
//                                 </tr>
//                             ))}
//                             {filteredSessions().length === 0 && (
//                                 <tr>
//                                     <td colSpan="8" className="px-4 py-3 text-center text-gray-500">
//                                         No sessions found
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//             {isOpen && canCreate && (
//                 <div
//                     className="fixed inset-0 bg-black bg-opacity-50 z-40"
//                     onClick={handleClose}
//                 />
//             )}

//             {canCreate && (
//                 <div
//                     className={`fixed top-0 right-0 h-full w-full sm:w-3/4 md:w-2/5 bg-white shadow-lg transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"} z-50 overflow-y-auto`}
//                 >
//                     <CreateSession
//                         isOpen={isOpen}
//                         toggleSidebar={handleClose}
//                         sessionToEdit={currentSession}
//                     />
//                 </div>
//             )}

//             {canDelete && (
//                 <Dialog
//                     open={openDelete}
//                     handler={() => setOpenDelete(false)}
//                     className="rounded-lg shadow-lg"
//                 >
//                     <DialogHeader className="text-gray-800 font-semibold">Confirm Deletion</DialogHeader>
//                     <DialogBody className="text-gray-600">{deleteMessage}</DialogBody>
//                     <DialogFooter className="space-x-4">
//                         <Button
//                             variant="text"
//                             color="gray"
//                             onClick={() => setOpenDelete(false)}
//                         >
//                             Cancel
//                         </Button>
//                         {deleteMessage === "Are you sure you want to delete this session? This action cannot be undone." && (
//                             <Button
//                                 variant="filled"
//                                 color="red"
//                                 onClick={deleteSession}
//                             >
//                                 Yes, Delete
//                             </Button>
//                         )}
//                     </DialogFooter>
//                 </Dialog>
//             )}
//         </div>
//     );
// }




import { useState, useEffect } from "react";
import { db } from '../../../../config/firebase.js';
import { getDocs, collection, deleteDoc, doc, query, orderBy, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import CreateSession from "./CreateSession.jsx";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";
import { Select, MenuItem, FormControl } from '@mui/material';
import { useAuth } from "../../../../context/AuthContext.jsx";

export default function Sessions() {
    const { rolePermissions, user } = useAuth();

    // Permission checks
    const canCreate = rolePermissions.Sessions?.create || false;
    const canUpdate = rolePermissions.Sessions?.update || false;
    const canDelete = rolePermissions.Sessions?.delete || false;
    const canDisplay = rolePermissions.Sessions?.display || false;

    const [currentSession, setCurrentSession] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [statusFilter, setStatusFilter] = useState('Active');
    const [dateFilter, setDateFilter] = useState('All');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [deleteMessage, setDeleteMessage] = useState("Are you sure you want to delete this session? This action cannot be undone.");

    const SessionCollectionRef = collection(db, "Sessions");

    const toggleSidebar = () => setIsOpen(prev => !prev);

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }
        const results = sessions.filter(s =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results);
    };

    useEffect(() => {
        if (searchTerm) {
            handleSearch();
        } else {
            setSearchResults([]);
        }
    }, [searchTerm, sessions]);

    const calculateSessionStatus = (session) => {
        const sessionDateTime = new Date(`${session.date} ${session.endTime}`);
        const currentDateTime = new Date();
        return sessionDateTime < currentDateTime ? "Inactive" : "Active";
    };

    const fetchSessions = async () => {
        if (!canDisplay) return;
        try {
            const q = query(SessionCollectionRef, orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            const sessionData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            const updatedSessions = await Promise.all(sessionData.map(async (s) => {
                const calculatedStatus = calculateSessionStatus(s);
                if (s.status !== calculatedStatus && canUpdate) {
                    await updateDoc(doc(db, "Sessions", s.id), { status: calculatedStatus });
                    return { ...s, status: calculatedStatus };
                }
                return s;
            }));

            setSessions(updatedSessions);
        } catch (error) {
            console.error("Error fetching sessions:", error);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, [canDisplay, canUpdate]);

    // Handle predefined date filters
    const handleDateFilterChange = (value) => {
        setDateFilter(value);
        const today = new Date('2025-04-18'); // Current date as per system context
        let start, end;

        switch (value) {
            case 'Today':
                start = end = today.toISOString().split('T')[0]; // 2025-04-18
                break;
            case 'Last Week':
                start = new Date(today);
                start.setDate(today.getDate() - 7); // 2025-04-11
                end = new Date(today);
                end.setDate(today.getDate() - 1); // 2025-04-17
                start = start.toISOString().split('T')[0];
                end = end.toISOString().split('T')[0];
                break;
            case 'Last Month':
                start = new Date(today);
                start.setMonth(today.getMonth() - 1); // 2025-03-18
                end = new Date(today);
                end.setDate(today.getDate() - 1); // 2025-04-17
                start = start.toISOString().split('T')[0];
                end = end.toISOString().split('T')[0];
                break;
            case 'Next Week':
                start = new Date(today);
                start.setDate(today.getDate() + 1); // 2025-04-19
                end = new Date(today);
                end.setDate(today.getDate() + 7); // 2025-04-25
                start = start.toISOString().split('T')[0];
                end = end.toISOString().split('T')[0];
                break;
            case 'Next Month':
                start = new Date(today);
                start.setDate(today.getDate() + 1); // 2025-04-19
                end = new Date(today);
                end.setMonth(today.getMonth() + 1); // 2025-05-18
                end = end.toISOString().split('T')[0];
                start = start.toISOString().split('T')[0];
                break;
            case 'All':
            default:
                start = '';
                end = '';
                break;
        }

        setStartDate(start);
        setEndDate(end);
    };

    const handleCreateSessionClick = () => {
        if (!canCreate) {
            alert("You do not have permission to create sessions.");
            return;
        }
        setCurrentSession(null);
        toggleSidebar();
    };

    const handleEditClick = (session) => {
        if (!canUpdate) {
            alert("You do not have permission to update sessions.");
            return;
        }
        setCurrentSession(session);
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        setCurrentSession(null);
        fetchSessions();
    };

    const logActivity = async (action, details) => {
        try {
            await addDoc(collection(db, "activityLogs"), {
                userId: user.uid,
                userEmail: user.email,
                action,
                details,
                timestamp: serverTimestamp(),
            });
        } catch (error) {
            console.error("Error logging activity:", error);
        }
    };

    const deleteSession = async () => {
        if (!deleteId || !canDelete) {
            if (!canDelete) alert("You do not have permission to delete sessions.");
            return;
        }
        try {
            const sessionToDelete = sessions.find(s => s.id === deleteId);
            await deleteDoc(doc(db, "Sessions", deleteId));
            await logActivity("Deleted session", {
                sessionId: deleteId,
                name: sessionToDelete?.name || "Unknown",
            });
            setOpenDelete(false);
            setDeleteMessage("Are you sure you want to delete this session? This action cannot be undone.");
            fetchSessions();
            alert("Session deleted successfully!");
        } catch (error) {
            console.error("Error deleting session:", error);
            setDeleteMessage("Failed to delete session. Please try again.");
        }
    };

    const handleSessionSubmit = (sessionData) => {
        fetchSessions(); // Refresh the session list after create/update
    };

    const filteredSessions = () => {
        let baseSessions = searchResults.length > 0 ? searchResults : sessions;

        // Apply status filter
        if (statusFilter !== 'All') {
            baseSessions = baseSessions.filter(s => s.status === statusFilter);
        }

        // Apply date filter
        if (startDate && endDate) {
            baseSessions = baseSessions.filter(s => {
                const sessionDate = new Date(s.date);
                const start = new Date(startDate);
                const end = new Date(endDate);
                return sessionDate >= start && sessionDate <= end;
            });
        }

        return baseSessions;
    };

    if (!canDisplay) {
        return (
            <div className="p-4 text-red-600 text-center">
                Access Denied: You do not have permission to view sessions.
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl font-semibold text-gray-800">Sessions</h1>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <FormControl size="small" className="w-full sm:w-40">
                        <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-white border border-gray-300 rounded-md"
                        >
                            <MenuItem value="All">All</MenuItem>
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="Inactive">Inactive</MenuItem>
                        </Select>
                    </FormControl>
                    {canCreate && (
                        <button
                            onClick={handleCreateSessionClick}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition duration-200 w-full sm:w-auto"
                        >
                            + Create Session
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-6 flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full sm:w-40 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full sm:w-40 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <FormControl size="small" className="w-full sm:w-40">
                            <Select
                                value={dateFilter}
                                onChange={(e) => handleDateFilterChange(e.target.value)}
                                className="bg-white border border-gray-300 rounded-md"
                            >
                                <MenuItem value="All">All Dates</MenuItem>
                                <MenuItem value="Today">Today</MenuItem>
                                <MenuItem value="Last Week">Last Week</MenuItem>
                                <MenuItem value="Last Month">Last Month</MenuItem>
                                <MenuItem value="Next Week">Next Week</MenuItem>
                                <MenuItem value="Next Month">Next Month</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search sessions by name..."
                        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="rounded-lg shadow-md overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Sr No</th>
                                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Session Name</th>
                                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Date</th>
                                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Start Time</th>
                                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">End Time</th>
                                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Mode</th>
                                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Status</th>
                                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSessions().map((s, index) => (
                                <tr key={s.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 text-gray-600">{index + 1}</td>
                                    <td className="px-4 py-3 text-gray-800">{s.name || 'N/A'}</td>
                                    <td className="px-4 py-3 text-gray-600">{s.date || 'N/A'}</td>
                                    <td className="px-4 py-3 text-gray-600">{s.startTime || 'N/A'}</td>
                                    <td className="px-4 py-3 text-gray-600">{s.endTime || 'N/A'}</td>
                                    <td className="px-4 py-3 text-gray-600">{s.sessionMode || 'N/A'}</td>
                                    <td className="px-4 py-3 text-gray-600">
                                        <span className={`px-2 py-1 rounded-full text-sm ${s.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {s.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {(canUpdate || canDelete) && (
                                            <FormControl size="small">
                                                <Select
                                                    value=""
                                                    onChange={(e) => {
                                                        const action = e.target.value;
                                                        if (action === 'edit' && canUpdate) {
                                                            handleEditClick(s);
                                                        } else if (action === 'delete' && canDelete) {
                                                            setDeleteId(s.id);
                                                            setOpenDelete(true);
                                                            setDeleteMessage("Are you sure you want to delete this session? This action cannot be undone.");
                                                        }
                                                    }}
                                                    displayEmpty
                                                    renderValue={() => "Actions"}
                                                    className="text-sm"
                                                    disabled={!canUpdate && !canDelete}
                                                >
                                                    <MenuItem value="" disabled>Actions</MenuItem>
                                                    {canUpdate && <MenuItem value="edit">Edit</MenuItem>}
                                                    {canDelete && <MenuItem value="delete">Delete</MenuItem>}
                                                </Select>
                                            </FormControl>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredSessions().length === 0 && (
                                <tr>
                                    <td colSpan="8" className="px-4 py-3 text-center text-gray-500">
                                        No sessions found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isOpen && canCreate && (
                <div
                    className={`fixed top-0 right-0 h-full w-full sm:w-3/4 md:w-2/5 bg-white shadow-lg transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"} z-50 overflow-y-auto`}
                    onClick={handleClose}
                />
            )}

            {canCreate && (
                <CreateSession
                    isOpen={isOpen}
                    toggleSidebar={handleClose}
                    sessionToEdit={currentSession}
                    onSubmit={handleSessionSubmit}
                    logActivity={logActivity}
                />
            )}

            {canDelete && (
                <Dialog
                    open={openDelete}
                    handler={() => setOpenDelete(false)}
                    className="rounded-lg shadow-lg"
                >
                    <DialogHeader className="text-gray-800 font-semibold">Confirm Deletion</DialogHeader>
                    <DialogBody className="text-gray-600">{deleteMessage}</DialogBody>
                    <DialogFooter className="space-x-4">
                        <Button
                            variant="text"
                            color="gray"
                            onClick={() => setOpenDelete(false)}
                        >
                            Cancel
                        </Button>
                        {deleteMessage === "Are you sure you want to delete this session? This action cannot be undone." && (
                            <Button
                                variant="filled"
                                color="red"
                                onClick={deleteSession}
                            >
                                Yes, Delete
                            </Button>
                        )}
                    </DialogFooter>
                </Dialog>
            )}
        </div>
    );
}