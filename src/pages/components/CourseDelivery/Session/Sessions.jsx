

import { useState, useEffect } from "react";
import { db } from '../../../../config/firebase.js';
import { getDocs, collection, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import CreateSession from "./CreateSession.jsx";
import SearchBar from '../../../../pages/components/SearchBar.jsx';
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";

export default function Sessions() {
    const [currentSession, setCurrentSession] = useState(null);
    const [session, setSession] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const SessionCollectionRef = collection(db, "Sessions");

    const toggleSidebar = () => {
        setIsOpen(prev => {
            const newValue = !prev;
            console.log("isOpen toggled to:", newValue);
            return newValue;
        });
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

    const fetchSessions = async () => {
        try {
            const q = query(SessionCollectionRef, orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            const sessionData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setSession(sessionData);
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
        console.log("create session closed.");
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

    return (
        <div className="p-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 mb-4 gap-4">
                <h1 className="text-xl sm:text-2xl font-bold">Sessions</h1>
                <button
                    onClick={handleCreateSessionClick}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 w-full sm:w-auto"
                >
                    Create Session
                </button>
            </div>

            {/* Search Bar */}
            <div className="p-4">
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>

            {/* Sessions Table */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse mt-4">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2 text-left text-sm font-medium">Session Name</th>
                            <th className="border p-2 text-left text-sm font-medium">Date</th>
                            <th className="border p-2 text-left text-sm font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(searchResults.length > 0 ? searchResults : session).map(s => (
                            <tr key={s.id} className="border-b">
                                <td className="border p-2 text-sm">{s.name}</td>
                                <td className="border p-2 text-sm">{s.date}</td>
                                <td className="border p-2">
                                    <div className="flex items-center space-x-2 flex-wrap gap-2">
                                        <button
                                            onClick={() => handleEditClick(s)}
                                            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 text-sm"
                                        >
                                            Edit
                                        </button>
                                        
                                        <button
                                            onClick={() => {
                                                setDeleteId(s.id);
                                                setOpenDelete(true);
                                            }}
                                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create/Edit Session Sidebar */}
            <CreateSession
                isOpen={isOpen}
                toggleSidebar={handleClose}
                sessionToEdit={currentSession}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDelete} handler={() => setOpenDelete(false)} size="sm">
                <DialogHeader>Confirm Deletion</DialogHeader>
                <DialogBody>Are you sure you want to delete this session?</DialogBody>
                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                    <Button
                        color="red"
                        onClick={() => setOpenDelete(false)}
                        className="w-full sm:w-auto"
                    >
                        Cancel
                    </Button>
                    <Button
                        color="green"
                        onClick={deleteSession}
                        className="w-full sm:w-auto"
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
}
