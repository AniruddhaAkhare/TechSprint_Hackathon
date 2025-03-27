import { useState, useEffect } from "react";
import { db } from '../../../../config/firebase.js';
import { getDocs, collection, deleteDoc, doc, query, orderBy, updateDoc } from 'firebase/firestore';
import CreateSession from "./CreateSession.jsx";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";
import { Select, MenuItem, FormControl } from '@mui/material';

export default function Sessions() {
    const [currentSession, setCurrentSession] = useState(null);
    const [session, setSession] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [statusFilter, setStatusFilter] = useState('Active'); 

    const SessionCollectionRef = collection(db, "Sessions");

    const toggleSidebar = () => {
        setIsOpen(prev => !prev);
    };

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }
        const results = session.filter(s =>
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
    }, [searchTerm]);

    const calculateSessionStatus = (session) => {
        const sessionDateTime = new Date(`${session.date} ${session.endTime}`);
        const currentDateTime = new Date();
        return sessionDateTime < currentDateTime ? "Inactive" : "Active";
    };

    const fetchSessions = async () => {
        try {
            const q = query(SessionCollectionRef, orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            const sessionData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Update status for each session if necessary
            const updatedSessions = await Promise.all(sessionData.map(async (s) => {
                const calculatedStatus = calculateSessionStatus(s);
                if (s.status !== calculatedStatus) {
                    await updateDoc(doc(db, "Sessions", s.id), { status: calculatedStatus });
                    return { ...s, status: calculatedStatus };
                }
                return s;
            }));

            setSession(updatedSessions);
        } catch (error) {
            console.error("Error fetching sessions:", error);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const handleCreateSessionClick = () => {
        setCurrentSession(null);
        toggleSidebar();
    };

    const handleEditClick = (session) => {
        setCurrentSession(session);
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        setCurrentSession(null);
        fetchSessions();
    };

    const deleteSession = async () => {
        if (!deleteId) return;
        try {
            const sessionDoc = doc(db, "Sessions", deleteId);
            await deleteDoc(sessionDoc);
            alert("Session deleted successfully");
            setOpenDelete(false);
            fetchSessions();
        } catch (error) {
            console.error("Error deleting session:", error);
        }
    };

    // Filter sessions based on statusFilter
    const filteredSessions = () => {
        const baseSessions = searchResults.length > 0 ? searchResults : session;
        if (statusFilter === 'All') return baseSessions;
        return baseSessions.filter(s => s.status === statusFilter);
    };

    return (
        <div className="flex flex-col w-full min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6">
            {/* Header */}
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
                    <button
                        onClick={handleCreateSessionClick}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition duration-200 w-full sm:w-auto"
                    >
                        + Create Session
                    </button>
                </div>
            </div>

            {/* Search Bar and Table Container */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-6">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search sessions by name..."
                        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Sessions Table */}
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
                                        <FormControl size="small">
                                            <Select
                                                value=""
                                                onChange={(e) => {
                                                    const action = e.target.value;
                                                    if (action === 'edit') {
                                                        handleEditClick(s);
                                                    } else if (action === 'delete') {
                                                        setDeleteId(s.id);
                                                        setOpenDelete(true);
                                                    }
                                                }}
                                                displayEmpty
                                                renderValue={() => "Actions"}
                                                className="text-sm"
                                            >
                                                <MenuItem value="" disabled>Actions</MenuItem>
                                                <MenuItem value="edit">Edit</MenuItem>
                                                <MenuItem value="delete">Delete</MenuItem>
                                            </Select>
                                        </FormControl>
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

            {/* Backdrop for Sidebar */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={handleClose}
                />
            )}

            {/* Sidebar (CreateSession) */}
            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-3/4 md:w-2/5 bg-white shadow-lg transform transition-transform duration-300 ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                } z-50 overflow-y-auto`}
            >
                <CreateSession
                    isOpen={isOpen}
                    toggleSidebar={handleClose}
                    sessionToEdit={currentSession}
                />
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={openDelete}
                handler={() => setOpenDelete(false)}
                className="rounded-lg shadow-lg"
            >
                <DialogHeader className="text-gray-800 font-semibold">Confirm Deletion</DialogHeader>
                <DialogBody className="text-gray-600">
                    Are you sure you want to delete this session? This action cannot be undone.
                </DialogBody>
                <DialogFooter className="space-x-4">
                    <Button
                        variant="text"
                        color="gray"
                        onClick={() => setOpenDelete(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="filled"
                        color="red"
                        onClick={deleteSession}
                    >
                        Yes, Delete
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
}