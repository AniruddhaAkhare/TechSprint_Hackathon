


// // import { useState, useEffect } from "react";
// // import { db } from '../../../../config/firebase';
// // import { getDocs, collection, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
// // import CreateBatch from "./CreateBatch";
// // import SearchBar from "../../SearchBar";
// // import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input } from "@material-tailwind/react";

// // export default function Batches() {
// //     const [currentBatch, setCurrentBatch] = useState(null);
// //     const [batches, setBatches] = useState([]);

// //     const [subjects, setSubjects] = useState([]);

// //     const [searchTerm, setSearchTerm] = useState('');
// //     const [searchResults, setSearchResults] = useState([]);

// //     const BatchCollectionRef = collection(db, "Batch");
// //     const SubjectCollectionRef = collection(db, "Subject");
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
// //         const results = batches.filter(batch =>
// //             batch.batchName.toLowerCase().includes(searchTerm.toLowerCase())
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

// //     const fetchBatches = async () => {
// //         const q = query(BatchCollectionRef, orderBy('createdAt', 'desc')); // Add order by createdAt
// //         const snapshot = await getDocs(q);
// //         const batchData = snapshot.docs.map(doc => ({
// //             id: doc.id,
// //             ...doc.data(),
// //         }));
// //         setBatches(batchData);
// //     };

// //     useEffect(() => {
// //         fetchBatches();
// //     }, []);

// //     // const fetchBatches = async () => {
// //     //     const snapshot = await getDocs(BatchCollectionRef);
// //     //     const batchData = snapshot.docs.map(doc => ({
// //     //         id: doc.id,
// //     //         ...doc.data(),
// //     //     }));
// //     //     setBatches(batchData);
// //     // };

// //     // useEffect(() => {
// //     //     fetchBatches();
// //     // }, []);

// //     const handleCreateBatchClick = () => {
// //         setCurrentBatch(null);
// //         toggleSidebar();
// //     };

// //     const handleEditClick = (batch) => {
// //         setCurrentBatch(batch);
// //         setIsOpen(true);
// //     };

// //     const handleClose = () => {
// //         setIsOpen(false);
// //         setCurrentBatch(null);
// //         fetchBatches();
// //     };

// //     // const deleteBatch = async () => {
// //     //     console.log("Delete function triggered for ID:", deleteId);
// //     //     if (deleteId) {
// //     //         try {
// //     //             await deleteDoc(doc(db, "Batch", deleteId));
// //     //             console.log("Batch deleted successfully");
// //     //             fetchBatches(); // Refresh the list
// //     //         } catch (err) {
// //     //             console.error("Error deleting batch:", err);
// //     //         }
// //     //     }
// //     //     setOpenDelete(false);
// //     // };


// //     const deleteBatch = async () => {
// //         if (deleteId) {
// //             try {
// //                 await deleteDoc(doc(db, "Batch", deleteId));
// //                 setBatches(prevBatches => prevBatches.filter(batch => batch.id !== deleteId)); // Update UI
// //                 fetchBatches(); // Fetch latest data
// //             } catch (err) {
// //                 console.error("Error deleting batch:", err);
// //             }
// //         }
// //         setOpenDelete(false);
// //     };


// //     // const deleteBatch = async () => {
// //     //     // console.log("delete ");
// //     //     if (deleteId) {
// //     //         try {
// //     //             await deleteDoc(doc(db, "Batch", deleteId));
// //     //             fetchBatches();
// //     //         } catch (err) {
// //     //             console.error("Error deleting batches:", err);
// //     //         }
// //     //     }
// //     //     setOpenDelete(false);
// //     // };

// //     return (
// //         <div className="flex-col w-screen ml-80 p-4">
// //             <div className="justify-between items-center p-4 mb-4">
// //                 <div className="flex-1">
// //                     <h1 className="text-2xl font-semibold">Batches</h1>
// //                 </div>
// //                 <div>
// //                     <button type="button"
// //                         className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
// //                         onClick={handleCreateBatchClick}>
// //                         + Create Batch
// //                     </button>
// //                 </div>
// //             </div>

// //             <CreateBatch isOpen={isOpen} toggleSidebar={handleClose} batch={currentBatch} />

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
// //                             <th>Batch Name</th>
// //                             <th>Action</th>
// //                         </tr>
// //                     </thead>
// //                     <tbody>
// //                         {(searchResults.length > 0 ? searchResults : batches).map((batch, index) => (
// //                             <tr key={batch.id}>
// //                                 <td>{index + 1}</td>
// //                                 <td>{batch.batchName}</td>

// //                                 <Dialog open={openDelete} handler={() => setOpenDelete(false)}>
// //                                     <DialogHeader>Confirm Deletion</DialogHeader>
// //                                     <DialogBody>Are you sure you want to delete this instructor? This action cannot be undone.</DialogBody>
// //                                     <DialogFooter>
// //                                         <Button variant="text" color="gray" onClick={() => setOpenDelete(false)}>Cancel</Button>
// //                                         <Button variant="filled" color="red" onClick={deleteBatch}>Yes, Delete</Button>
// //                                     </DialogFooter>
// //                                 </Dialog>
// //                                 <td>
// //                                     <div className="flex items-center space-x-2">
// //                                         <button onClick={() => { setDeleteId(batch.id); setOpenDelete(true); }} className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600">
// //                                             Delete
// //                                         </button>
// //                                         <button onClick={() => handleEditClick(batch)} className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600">
// //                                             Update
// //                                         </button>
// //                                     </div>
// //                                 </td>
// //                             </tr>
// //                         ))}
// //                     </tbody>
// //                 </table>
// //             </div>
// //         </div>
// //     );
// // }


// import { useState, useEffect } from "react";
// import { db } from '../../../../config/firebase';
// import { getDocs, collection, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
// import CreateBatch from "./CreateBatch";
// import SearchBar from "../../SearchBar";
// import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input } from "@material-tailwind/react";

// export default function Batches() {
//     const [currentBatch, setCurrentBatch] = useState(null);
//     const [batches, setBatches] = useState([]);
//     const [subjects, setSubjects] = useState([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [searchResults, setSearchResults] = useState([]);

//     const BatchCollectionRef = collection(db, "Batch");
//     const SubjectCollectionRef = collection(db, "Subject");
//     const [isOpen, setIsOpen] = useState(false);
//     const [openDelete, setOpenDelete] = useState(false);
//     const [deleteId, setDeleteId] = useState(null);

//     const toggleSidebar = () => {
//         setIsOpen(prev => !prev);
//     };

//     const handleSearch = (e) => {
//         if (e) e.preventDefault();
//         if (!searchTerm.trim()) {
//             setSearchResults([]);
//             return;
//         }
//         const results = batches.filter(batch =>
//             batch.batchName.toLowerCase().includes(searchTerm.toLowerCase())
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

//     const fetchBatches = async () => {
//         const q = query(BatchCollectionRef, orderBy('createdAt', 'desc'));
//         const snapshot = await getDocs(q);
//         const batchData = snapshot.docs.map(doc => ({
//             id: doc.id,
//             ...doc.data(),
//         }));
//         setBatches(batchData);
//     };

//     useEffect(() => {
//         fetchBatches();
//     }, []);

//     const handleCreateBatchClick = () => {
//         setCurrentBatch(null);
//         toggleSidebar();
//     };

//     const handleEditClick = (batch) => {
//         setCurrentBatch(batch);
//         setIsOpen(true);
//     };

//     const handleClose = () => {
//         setIsOpen(false);
//         setCurrentBatch(null);
//         fetchBatches();
//     };

//     const deleteBatch = async () => {
//         if (deleteId) {
//             try {
//                 await deleteDoc(doc(db, "Batch", deleteId));
//                 setBatches(prevBatches => prevBatches.filter(batch => batch.id !== deleteId));
//                 fetchBatches();
//             } catch (err) {
//                 console.error("Error deleting batch:", err);
//             }
//         }
//         setOpenDelete(false);
//     };

//     return (
//         <div className="flex-col w-screen ml-80 p-4">
//             <div className="justify-between items-center p-4 mb-4">
//                 <div className="flex-1">
//                     <h1 className="text-2xl font-semibold">Batches</h1>
//                 </div>
//                 <div>
//                     <button type="button"
//                         className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
//                         onClick={handleCreateBatchClick}>
//                         + Create Batch
//                     </button>
//                 </div>
//             </div>

//             <CreateBatch isOpen={isOpen} toggleSidebar={handleClose} batch={currentBatch} />

//             <div className="justify-between items-center p-4 mt-4">
//                 <SearchBar
//                     searchTerm={searchTerm}
//                     setSearchTerm={setSearchTerm}
//                     handleSearch={handleSearch}
//                 />
//             </div>

//             <div className="sec-3">
//                 <table className="data-table table">
//                     <thead className="table-secondary">
//                         <tr>
//                             <th>Sr No</th>
//                             <th>Batch Name</th>
//                             <th>Status</th> {/* New Status Column */}
//                             <th>Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {(searchResults.length > 0 ? searchResults : batches).map((batch, index) => (
//                             <tr key={batch.id}>
//                                 <td>{index + 1}</td>
//                                 <td>{batch.batchName}</td>
//                                 <td>
//                                     <span className={`px-2 py-1 rounded-full text-sm ${
//                                         batch.status === 'Ongoing' 
//                                         ? 'bg-green-100 text-green-800' 
//                                         : 'bg-gray-100 text-gray-800'
//                                     }`}>
//                                         {batch.status || 'Ongoing'} {/* Default to 'Ongoing' if status is undefined */}
//                                     </span>
//                                 </td>
//                                 <td>
//                                     <div className="flex items-center space-x-2">
//                                         <button onClick={() => { setDeleteId(batch.id); setOpenDelete(true); }} className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600">
//                                             Delete
//                                         </button>
//                                         <button onClick={() => handleEditClick(batch)} className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600">
//                                             Update
//                                         </button>
//                                     </div>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             <Dialog open={openDelete} handler={() => setOpenDelete(false)}>
//                 <DialogHeader>Confirm Deletion</DialogHeader>
//                 <DialogBody>Are you sure you want to delete this batch? This action cannot be undone.</DialogBody>
//                 <DialogFooter>
//                     <Button variant="text" color="gray" onClick={() => setOpenDelete(false)}>Cancel</Button>
//                     <Button variant="filled" color="red" onClick={deleteBatch}>Yes, Delete</Button>
//                 </DialogFooter>
//             </Dialog>
//         </div>
//     );
// }


import { useState, useEffect } from "react";
import { db } from '../../../../config/firebase';
import { getDocs, collection, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import CreateBatch from "./CreateBatch";
import SearchBar from "../../SearchBar";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";

export default function Batches() {
    const [currentBatch, setCurrentBatch] = useState(null);
    const [batches, setBatches] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    
    const BatchCollectionRef = collection(db, "Batch");
    const StudentCollectionRef = collection(db, "student"); // Reference to student collection
    const [isOpen, setIsOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState("Are you sure you want to delete this batch? This action cannot be undone.");

    const toggleSidebar = () => setIsOpen(prev => !prev);

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }
        const results = batches.filter(batch =>
            batch.batchName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results);
    };

    useEffect(() => {
        if (searchTerm) handleSearch();
        else setSearchResults([]);
    }, [searchTerm]);

    const fetchBatches = async () => {
        try {
            const q = query(BatchCollectionRef, orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            const batchData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setBatches(batchData);
            console.log("Batches fetched:", batchData);
        } catch (err) {
            console.error("Error fetching batches:", err);
        }
    };

    useEffect(() => {
        fetchBatches();
    }, []);

    const handleCreateBatchClick = () => {
        setCurrentBatch(null);
        toggleSidebar();
    };

    const handleEditClick = (batch) => {
        setCurrentBatch(batch);
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        setCurrentBatch(null);
        fetchBatches();
    };

    const checkStudentsInBatch = async (batchId) => {
        try {
            const snapshot = await getDocs(StudentCollectionRef);
            const students = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            console.log("Students fetched for batch check:", students);
            const hasStudents = students.some(student => {
                const courseDetails = student.course_details || [];
                return courseDetails.some(course => course.batch === batchId);
            });
            console.log(`Batch ${batchId} has students: ${hasStudents}`);
            return hasStudents;
        } catch (err) {
            console.error("Error checking students in batch:", err);
            return false; // Default to false if there's an error
        }
    };

    const deleteBatch = async () => {
        if (!deleteId) return;

        try {
            // Check if any student is enrolled in the batch
            const hasStudents = await checkStudentsInBatch(deleteId);
            if (hasStudents) {
                setDeleteMessage("This batch cannot be deleted because students are enrolled in it.");
                return;
            }

            // Proceed with deletion if no students are enrolled
            await deleteDoc(doc(db, "Batch", deleteId));
            console.log(`Batch ${deleteId} deleted successfully`);
            fetchBatches();
            setOpenDelete(false);
            setDeleteMessage("Are you sure you want to delete this batch? This action cannot be undone."); // Reset message
        } catch (err) {
            console.error("Error deleting batch:", err);
            setDeleteMessage("An error occurred while trying to delete the batch.");
        }
    };

    return (
        <div className="flex-col w-screen ml-80 p-4">
            <div className="justify-between items-center p-4 mb-4">
                <div className="flex-1">
                    <h1 className="text-2xl font-semibold">Batches</h1>
                </div>
                <div>
                    <button
                        type="button"
                        className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                        onClick={handleCreateBatchClick}
                    >
                        + Create Batch
                    </button>
                </div>
            </div>

            <CreateBatch isOpen={isOpen} toggleSidebar={handleClose} batch={currentBatch} />

            <div className="justify-between items-center p-4 mt-4">
                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    handleSearch={handleSearch}
                />
            </div>

            <div className="sec-3">
                <table className="data-table table">
                    <thead className="table-secondary">
                        <tr>
                            <th>Sr No</th>
                            <th>Batch Name</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(searchResults.length > 0 ? searchResults : batches).map((batch, index) => (
                            <tr key={batch.id}>
                                <td>{index + 1}</td>
                                <td>{batch.batchName}</td>
                                <td>
                                    <span className={`px-2 py-1 rounded-full text-sm ${
                                        batch.status === 'Ongoing' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {batch.status || 'Ongoing'}
                                    </span>
                                </td>
                                <td>
                                    <div className="flex items-center space-x-2">
                                        <button 
                                            onClick={() => {
                                                setDeleteId(batch.id);
                                                setOpenDelete(true);
                                                setDeleteMessage("Are you sure you want to delete this batch? This action cannot be undone.");
                                            }} 
                                            className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                        <button 
                                            onClick={() => handleEditClick(batch)} 
                                            className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600"
                                        >
                                            Update
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Dialog open={openDelete} handler={() => setOpenDelete(false)}>
                <DialogHeader>Confirm Deletion</DialogHeader>
                <DialogBody>{deleteMessage}</DialogBody>
                <DialogFooter>
                    <Button variant="text" color="gray" onClick={() => setOpenDelete(false)}>Cancel</Button>
                    {deleteMessage === "Are you sure you want to delete this batch? This action cannot be undone." && (
                        <Button variant="filled" color="red" onClick={deleteBatch}>Yes, Delete</Button>
                    )}
                </DialogFooter>
            </Dialog>
        </div>
    );
}