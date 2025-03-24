<<<<<<< HEAD
// import { useState, useEffect } from "react";
// import { db } from '../../../../config/firebase';
// import { getDocs, collection, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
// import CreateBatch from "./CreateBatch";
// import SearchBar from "../../SearchBar";
// import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";

// export default function Batches() {
//     const [currentBatch, setCurrentBatch] = useState(null);
//     const [batches, setBatches] = useState([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [searchResults, setSearchResults] = useState([]);
    
//     const BatchCollectionRef = collection(db, "Batch");
//     const StudentCollectionRef = collection(db, "student"); // Reference to student collection
//     const [isOpen, setIsOpen] = useState(false);
//     const [openDelete, setOpenDelete] = useState(false);
//     const [deleteId, setDeleteId] = useState(null);
//     const [deleteMessage, setDeleteMessage] = useState("Are you sure you want to delete this batch? This action cannot be undone.");

//     const toggleSidebar = () => setIsOpen(prev => !prev);

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
//         if (searchTerm) handleSearch();
//         else setSearchResults([]);
//     }, [searchTerm]);

//     const fetchBatches = async () => {
//         try {
//             const q = query(BatchCollectionRef, orderBy('createdAt', 'desc'));
//             const snapshot = await getDocs(q);
//             const batchData = snapshot.docs.map(doc => ({
//                 id: doc.id,
//                 ...doc.data(),
//             }));
//             setBatches(batchData);
//             console.log("Batches fetched:", batchData);
//         } catch (err) {
//             console.error("Error fetching batches:", err);
//         }
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

//     const checkStudentsInBatch = async (batchId) => {
//         try {
//             const snapshot = await getDocs(StudentCollectionRef);
//             const students = snapshot.docs.map(doc => ({
//                 id: doc.id,
//                 ...doc.data(),
//             }));
//             console.log("Students fetched for batch check:", students);
//             const hasStudents = students.some(student => {
//                 const courseDetails = student.course_details || [];
//                 return courseDetails.some(course => course.batch === batchId);
//             });
//             console.log(`Batch ${batchId} has students: ${hasStudents}`);
//             return hasStudents;
//         } catch (err) {
//             console.error("Error checking students in batch:", err);
//             return false; // Default to false if there's an error
//         }
//     };

//     const deleteBatch = async () => {
//         if (!deleteId) return;

//         try {
//             // Check if any student is enrolled in the batch
//             const hasStudents = await checkStudentsInBatch(deleteId);
//             if (hasStudents) {
//                 setDeleteMessage("This batch cannot be deleted because students are enrolled in it.");
//                 return;
//             }

//             // Proceed with deletion if no students are enrolled
//             await deleteDoc(doc(db, "Batch", deleteId));
//             console.log(`Batch ${deleteId} deleted successfully`);
//             fetchBatches();
//             setOpenDelete(false);
//             setDeleteMessage("Are you sure you want to delete this batch? This action cannot be undone."); // Reset message
//         } catch (err) {
//             console.error("Error deleting batch:", err);
//             setDeleteMessage("An error occurred while trying to delete the batch.");
//         }
//     };

//     return (
//         <div className="flex flex-col w-full md:ml-50">
//             <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 mb-4 gap-4">
//                 {/* <div className="flex-1"> */}
//                     <h1 className="text-xl md:text-2xl font-semibold">Batches</h1>
//                 {/* </div> */}
//                 <div>
//                     <button
//                         type="button"
//                         className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200 w-full md:w-auto"
//                         onClick={handleCreateBatchClick}
//                     >
//                         + Create Batch
//                     </button>
//                 </div>
//             </div>

//             <CreateBatch isOpen={isOpen} toggleSidebar={handleClose} batch={currentBatch} />

//             {/* <div className="justify-between items-center p-4 mt-4">
//                 <SearchBar
//                     searchTerm={searchTerm}
//                     setSearchTerm={setSearchTerm}
//                     handleSearch={handleSearch}
//                 />
//             </div> */}

//             {/* Search Bar */}
//             <div className="p-4 mt-4">
//                 <SearchBar
//                     searchTerm={searchTerm}
//                     setSearchTerm={setSearchTerm}
//                     handleSearch={handleSearch}
//                 />
//             </div>

//             <div className="sec-3 overflow auto">
//                 <table className="data-table table w-full min-w-[600px">
//                     <thead className="table-secondary">
//                         <tr>
//                             <th className="sticky left-0 bg-grey-200">Sr No</th>
//                             <th>Batch Name</th>
//                             <th>Status</th>
//                             <th>Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {(searchResults.length > 0 ? searchResults : batches).map((batch, index) => (
//                             <tr key={batch.id}>
//                                 <td className="sticky left-0 bg-white">{index + 1}</td>
//                                 <td>{batch.batchName}</td>
//                                 <td>
//                                     <span className={`px-2 py-1 rounded-full text-sm ${
//                                         batch.status === 'Ongoing' 
//                                         ? 'bg-green-100 text-green-800' 
//                                         : 'bg-gray-100 text-gray-800'
//                                     }`}>
//                                         {batch.status || 'Ongoing'}
//                                     </span>
//                                 </td>
//                                 <td>
//                                     <div className="flex items-center space-x-2">
//                                         <button 
//                                             onClick={() => {
//                                                 setDeleteId(batch.id);
//                                                 setOpenDelete(true);
//                                                 setDeleteMessage("Are you sure you want to delete this batch? This action cannot be undone.");
//                                             }} 
//                                             className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
//                                         >
//                                             Delete
//                                         </button>
//                                         <button 
//                                             onClick={() => handleEditClick(batch)} 
//                                             className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600"
//                                         >
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
//                 <DialogBody>{deleteMessage}</DialogBody>
//                 <DialogFooter>
//                     <Button variant="text" color="gray" onClick={() => setOpenDelete(false)}>Cancel</Button>
//                     {deleteMessage === "Are you sure you want to delete this batch? This action cannot be undone." && (
//                         <Button variant="filled" color="red" onClick={deleteBatch}>Yes, Delete</Button>
//                     )}
//                 </DialogFooter>
//             </Dialog>
//         </div>
//     );
// }



=======
>>>>>>> 131a9e7d27aa2ab0832178eec7299aa64b174d8e
import { useState, useEffect } from "react";
import { db } from '../../../../config/firebase';
import { getDocs, collection, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import CreateBatch from "./CreateBatch";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";

export default function Batches() {
    const [currentBatch, setCurrentBatch] = useState(null);
    const [batches, setBatches] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    
    const BatchCollectionRef = collection(db, "Batch");
    const StudentCollectionRef = collection(db, "student");
    const [isOpen, setIsOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState("Are you sure you want to delete this batch? This action cannot be undone.");

    const toggleSidebar = () => setIsOpen(prev => !prev);

    const handleSearch = (term) => {
        if (!term.trim()) {
            setSearchResults([]);
            return;
        }
        const results = batches.filter(batch =>
            batch.batchName.toLowerCase().includes(term.toLowerCase())
        );
        setSearchResults(results);
    };

    useEffect(() => {
        handleSearch(searchTerm);
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
            return false;
        }
    };

    const deleteBatch = async () => {
        if (!deleteId) return;

        try {
            const hasStudents = await checkStudentsInBatch(deleteId);
            if (hasStudents) {
                setDeleteMessage("This batch cannot be deleted because students are enrolled in it.");
                return;
            }

            await deleteDoc(doc(db, "Batch", deleteId));
            console.log(`Batch ${deleteId} deleted successfully`);
            fetchBatches();
            setOpenDelete(false);
            setDeleteMessage("Are you sure you want to delete this batch? This action cannot be undone.");
        } catch (err) {
            console.error("Error deleting batch:", err);
            setDeleteMessage("An error occurred while trying to delete the batch.");
        }
    };

    return (
        <div className="flex flex-col w-full min-h-screen bg-gray-50 p-6 ml-0 sm:ml-80">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Batches</h1>
                <button
                    type="button"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={handleCreateBatchClick}
                >
                    + Create Batch
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                {/* Search Bar */}
                <div className="mb-6">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search batches by name..."
                        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Table Section */}
                <div className="rounded-lg shadow-md overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Sr No</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Batch Name</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(searchResults.length > 0 ? searchResults : batches).map((batch, index) => (
                                <tr key={batch.id} className="border-b hover:bg-gray-50 transition duration-150">
                                    <td className="px-4 py-3 text-gray-600">{index + 1}</td>
                                    <td className="px-4 py-3 text-gray-800">{batch.batchName}</td>
                                    <td className="px-4 py-3 text-gray-600">{batch.status || "Ongoing"}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => {
                                                    setDeleteId(batch.id);
                                                    setOpenDelete(true);
                                                    setDeleteMessage("Are you sure you want to delete this batch? This action cannot be undone.");
                                                }}
                                                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                            >
                                                Delete
                                            </button>
                                            <button
                                                onClick={() => handleEditClick(batch)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
            </div>

            {/* Backdrop for Sidebar */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={handleClose}
                />
            )}

            {/* Sidebar (CreateBatch) */}
            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-1/3 bg-white shadow-lg transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"} z-50 overflow-y-auto`}
            >
                <CreateBatch isOpen={isOpen} toggleSidebar={handleClose} batch={currentBatch} />
            </div>

            {/* Delete Confirmation Dialog */}
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
                        className="hover:bg-gray-100 transition duration-200"
                    >
                        Cancel
                    </Button>
                    {deleteMessage === "Are you sure you want to delete this batch? This action cannot be undone." && (
                        <Button
                            variant="filled"
                            color="red"
                            onClick={deleteBatch}
                            className="bg-red-500 hover:bg-red-600 transition duration-200"
                        >
                            Yes, Delete
                        </Button>
                    )}
                </DialogFooter>
            </Dialog>
        </div>
    );
}