// // import { useState, useEffect } from "react";
// // import { db } from '../../../../config/firebase.js'
// // import { getDocs, collection, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
// // import CreateSession from "./CreateSession.jsx";
// // import SearchBar from '../../../../pages/components/SearchBar.jsx'
// // import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input } from "@material-tailwind/react";

// // export default function Sessions() {
// //     const [currentSession, setCurrentSession] = useState(null);
// //     const [session, setSession] = useState([]);
// //     const [searchTerm, setSearchTerm] = useState('');
// //     const [searchResults, setSearchResults] = useState([]);
// //     const SessionCollectionRef = collection(db, "Sessions");
// //     const [isOpen, setIsOpen] = useState(false);


// //     const [openDelete, setOpenDelete] = useState(false);
// //     const [deleteId, setDeleteId] = useState(null);

// //     const toggleSidebar = () => {
// //         setIsOpen(prev => !prev);
// //     };

// //     const handleSearch = (e) => {
// //         if (e) e.preventDefault();
// //         if (!searchTerm.trim()) {
// //             setSearchResults([]);
// //             return;
// //         }
// //         const results = session.filter(session =>
// //             session.name.toLowerCase().includes(searchTerm.toLowerCase())
// //         );
// //         setSearchResults(results);
// //     };

// //     useEffect(() => {
// //         if (searchTerm) {
// //             handleSearch();
// //         } else {
// //             setSearchResults([]);
// //         }
// //     }, [searchTerm]);

// //     const fetchSessions = async () => {
// //         const q = query(BatchCollectionRef, orderBy('createdAt', 'desc')); // Add order by createdAt
// //         const snapshot = await getDocs(SessionCollectionRef);
// //         const sessionData = snapshot.docs.map(doc => ({
// //             id: doc.id,
// //             ...doc.data(),
// //         }));
// //         setSession(sessionData);
// //     };

// //     useEffect(() => {
// //         fetchSessions();
// //     }, []);

// //     const handleCreateSessionClick = () => {
// //         setCurrentSession(null);
// //         toggleSidebar();
// //     };

// //     const handleEditClick = (session) => {
// //         setCurrentSession(session);
// //         setIsOpen(true);
// //     };

// //     const handleClose = () => {
// //         setIsOpen(false);
// //         setCurrentSession(null);
// //         fetchSessions();
// //     };

// //     // const deleteSession = async (id) => {
// //     //     const sessionDoc = doc(db, "Sessions", id);
// //     //     await deleteDoc(sessionDoc);
// //     //     alert("Session deleted successfully");
// //     //     fetchSessions();  
// //     // };

// //     const deleteSession = async () => {
// //         // console.log("delete ");
// //         if (deleteId) {
// //             try {
// //                 await deleteDoc(doc(db, "Sessions", deleteId));
// //                 fetchSessions();
// //             } catch (err) {
// //                 console.error("Error deleting Sessions:", err);
// //             }
// //         }
// //         setOpenDelete(false);
// //     };

// //     return (
// //         <div className="flex-col w-screen ml-80 p-4">
// //             <div className="justify-between items-center p-4 mb-4">
// //                 <div className="flex-1">
// //                     <h1 className="text-2xl font-semibold">Sessions</h1>
// //                 </div>
// //                 <div>
// //                     <button type="button"
// //                         className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
// //                         onClick={handleCreateSessionClick}>
// //                         + Create Session
// //                     </button>
// //                 </div>
// //             </div>

// //             <CreateSession isOpen={isOpen} toggleSidebar={handleClose} session={currentSession} />

// //             <div className="justify-between items-center p-4 mt-4">
// //                 <SearchBar
// //                     searchTerm={searchTerm}
// //                     setSearchTerm={setSearchTerm}
// //                     handleSearch={handleSearch}
// //                 />
// //             </div>

// //             <div className="sec-3">
// //                 <table className="data-table table">
// //                     <thead className="table-secondary">
// //                         <tr>
// //                             <th>Sr No</th>
// //                             <th>Session Name</th>
// //                             <th>Action</th>
// //                         </tr>
// //                     </thead>
// //                     <tbody>
// //                         {(searchResults.length > 0 ? searchResults : session).map((session, index) => (
// //                             <tr key={session.id}>
// //                                 <td>{index + 1}</td>
// //                                 <td>{session.name}</td>

// //                                 <Dialog open={openDelete} handler={() => setOpenDelete(false)}>
// //                                     <DialogHeader>Confirm Deletion</DialogHeader>
// //                                     <DialogBody>Are you sure you want to delete this instructor? This action cannot be undone.</DialogBody>
// //                                     <DialogFooter>
// //                                         <Button variant="text" color="gray" onClick={() => setOpenDelete(false)}>Cancel</Button>
// //                                         <Button variant="filled" color="red" onClick={deleteSession}>Yes, Delete</Button>
// //                                     </DialogFooter>
// //                                 </Dialog>
// //                                 <td>
// //                                         <div className="flex items-center space-x-2">
// //                                             <button onClick={() => { setDeleteId(session.id); setOpenDelete(true); }} className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600">
// //                                                 Delete
// //                                             </button>
// //                                             <button onClick={() => handleEditClick(session)} className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600">
// //                                                 Update
// //                                             </button>
// //                                         </div>
// //                                     </td>
// //                             </tr>
// //                         ))}
// //                     </tbody>
// //                 </table>
// //             </div>
// //         </div>
// //     );
// // }




// import { useState, useEffect } from "react";
// import { db } from '../../../../config/firebase.js';
// import { getDocs, collection, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
// import CreateSession from "./CreateSession.jsx";
// import SearchBar from '../../../../pages/components/SearchBar.jsx';
// import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input } from "@material-tailwind/react";

// export default function Sessions() {
//     const [currentSession, setCurrentSession] = useState(null);
//     const [session, setSession] = useState([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [searchResults, setSearchResults] = useState([]);
//     const [isOpen, setIsOpen] = useState(false);
//     const [openDelete, setOpenDelete] = useState(false);
//     const [deleteId, setDeleteId] = useState(null);

//     const SessionCollectionRef = collection(db, "Sessions");

//     const toggleSidebar = () => {
//         setIsOpen(prev => !prev);
//     };

//     const handleSearch = (e) => {
//         if (e) e.preventDefault();
//         if (!searchTerm.trim()) {
//             setSearchResults([]);
//             return;
//         }
//         const results = session.filter(s =>
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
//     }, [searchTerm]);

//     const fetchSessions = async () => {
//         try {
//             const q = query(SessionCollectionRef, orderBy('createdAt', 'desc')); // Ensure 'createdAt' exists
//             const snapshot = await getDocs(q);
//             const sessionData = snapshot.docs.map(doc => ({
//                 id: doc.id,
//                 ...doc.data(),
//             }));
//             setSession(sessionData);
//         } catch (error) {
//             console.error("Error fetching sessions:", error);
//         }
//     };

//     useEffect(() => {
//         fetchSessions();
//     }, []);



//     const handleCreateSessionClick = () => {
//         setCurrentSession(null);
//         toggleSidebar();
//     };

//     const handleEditClick = (session) => {
//         setCurrentSession(session);
//         setIsOpen(true);
//     };

//     const handleClose = () => {
//         setIsOpen(false);
//         setCurrentSession(null);
//         fetchSessions();
//     };

//     const deleteSession = async () => {
//         if (!deleteId) return;
//         try {
//             const sessionDoc = doc(db, "Sessions", deleteId);
//             await deleteDoc(sessionDoc);
//             alert("Session deleted successfully");
//             setOpenDelete(false);
//             fetchSessions();
//         } catch (error) {
//             console.error("Error deleting session:", error);
//         }
//     };

//     return (
//         <div className="flex-col w-screen ml-80 p-4">
//             <div className="justify-between items-center p-4 mb-4">
//                 {/* // <div className="p-4"> */}
//                 {/* <div className="flex justify-between items-center mb-4"> */}
//                 <h1 className="text-2xl font-bold">Sessions</h1>
//                 <button
//                     onClick={handleCreateSessionClick}
//                     className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
//                 >
//                     Create Session
//                 </button>
//             </div>

//             <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

//             <table className="w-full border-collapse mt-4">
//                 <thead>
//                     <tr className="bg-gray-100">
//                         <th className="border p-2">Session Name</th>
//                         <th className="border p-2">Date</th>
//                         <th className="border p-2">Action</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {(searchResults.length > 0 ? searchResults : session).map(s => (
//                         <tr key={s.id} className="text-center">
//                             <td className="border p-2">{s.name}</td>
//                             <td className="border p-2">{s.date}</td>
//                             <td className="border p-2">
//                                 <button
//                                     onClick={() => handleEditClick(s)}
//                                     className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 mr-2"
//                                 >
//                                     Edit
//                                 </button>
//                                 <button
//                                     onClick={() => {
//                                         setDeleteId(s.id);
//                                         setOpenDelete(true);
//                                     }}
//                                     className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
//                                 >
//                                     Delete
//                                 </button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>

//             <CreateSession isOpen={isOpen} toggleSidebar={toggleSidebar} />

//             <CreateSession
//                 isOpen={isSidebarOpen}
//                 toggleSidebar={() => setIsSidebarOpen(false)}
//                 sessionToEdit={sessionToEdit}
//             />

//             <Dialog open={openDelete} handler={() => setOpenDelete(false)}>
//                 <DialogHeader>Confirm Deletion</DialogHeader>
//                 <DialogBody>Are you sure you want to delete this session?</DialogBody>
//                 <DialogFooter>
//                     <Button color="red" onClick={() => setOpenDelete(false)}>Cancel</Button>
//                     <Button color="green" onClick={deleteSession}>Confirm</Button>
//                 </DialogFooter>
//             </Dialog>
//         </div>
//     );
// }



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

    // const toggleSidebar = () => {
    //     setIsOpen(prev => !prev);
    // };

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

    // const handleClose = () => {
    //     setIsOpen(false);
    //     setCurrentSession(null);
    //     fetchSessions();
    // };

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
        <div className="flex-col w-screen ml-80 p-4">
            <div className="justify-between items-center p-4 mb-4">
                <h1 className="text-2xl font-bold">Sessions</h1>
                <button
                    onClick={handleCreateSessionClick}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    Create Session
                </button>
            </div>

            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <table className="w-full border-collapse mt-4">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">Session Name</th>
                        <th className="border p-2">Date</th>
                        <th className="border p-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {(searchResults.length > 0 ? searchResults : session).map(s => (
                        <tr key={s.id} className="text-center">
                            <td className="border p-2">{s.name}</td>
                            <td className="border p-2">{s.date}</td>
                            <td className="border p-2">
                                <button
                                    onClick={() => handleEditClick(s)}
                                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => {
                                        setDeleteId(s.id);
                                        setOpenDelete(true);
                                    }}
                                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Updated CreateSession component usage */}
            {/* <CreateSession
                isOpen={isOpen}
                toggleSidebar={handleClose} // Updated to use handleClose to refresh data
                sessionToEdit={currentSession}
            /> */}

<CreateSession
            isOpen={isOpen}
            toggleSidebar={handleClose}
            sessionToEdit={currentSession}
        />

            {/* Remove the duplicate CreateSession component */}
            {/* <CreateSession
                isOpen={isSidebarOpen}
                toggleSidebar={() => setIsSidebarOpen(false)}
                sessionToEdit={sessionToEdit}
            /> */}

            <Dialog open={openDelete} handler={() => setOpenDelete(false)}>
                <DialogHeader>Confirm Deletion</DialogHeader>
                <DialogBody>Are you sure you want to delete this session?</DialogBody>
                <DialogFooter>
                    <Button color="red" onClick={() => setOpenDelete(false)}>Cancel</Button>
                    <Button color="green" onClick={deleteSession}>Confirm</Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
}