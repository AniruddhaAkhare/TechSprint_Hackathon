// import { useState, useEffect } from "react";
// import React from 'react';
// import { useParams } from 'react-router-dom';
// import CreateBatch from './CreateBatch.jsx';
// import { getDocs, collection } from 'firebase/firestore';
// import { deleteBatch, updateBatch } from '../../../../utils/batchOperations';
// import { db } from '../../../../config/firebase.js';
// import SearchBar from '../../../components/SearchBar.jsx';
// import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";

// export default function Batches() {
//     const { courseId } = useParams();
//     const [currentBatch, setCurrentBatch] = useState(null);
//     const [batches, setBatches] = useState([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [searchResults, setSearchResults] = useState([]);
//     const [isOpen, setIsOpen] = useState(false);
//     const [openDelete, setOpenDelete] = useState(false);
//     const [deleteId, setDeleteId] = useState(null);
//     const [loading, setLoading] = useState(true);

//     const [permissions, setPermissions] = useState([]);

//     const BatchCollectionRef = collection(db, "Batch");

//     const toggleSidebar = () => setIsOpen(prev => !prev);

//     const handleSearch = (e) => {
//         if (e) e.preventDefault();
//         if (!searchTerm.trim()) {
//             setSearchResults([]);
//             return;
//         }
//         const results = batches.filter(batch =>
//             batch.name.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//         setSearchResults(results);
//     };

//     useEffect(() => {
//         handleSearch();
//     }, [searchTerm]);

//     // Fetch permissions on mount
//     useEffect(() => {
//         const loadPermissions = async () => {
//             const perms = await fetchUserPermissions(currentUserId);
//             setPermissions(perms);
//         };
//         loadPermissions();
//     }, []);

//     // Example: Disable delete button if user lacks permission
//     <Button
//         disabled={!permissions?.Batch?.Delete}
//         onClick={handleDelete}
//     >
//         Delete Batch
//     </Button>

//     const fetchBatches = async () => {
//         setLoading(true);
//         try {
//             const snapshot = await getDocs(BatchCollectionRef);
//             const batchData = snapshot.docs.map(doc => ({
//                 id: doc.id,
//                 ...doc.data(),
//             }));
//             setBatches(batchData);
//         } catch (error) {
//             console.error('Error fetching batches:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchBatches();
//     }, [courseId]);

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

//     const handleDeleteBatch = async () => {
//         if (!deleteId) return;
//         try {
//             await deleteBatch(deleteId);
//             fetchBatches();
//             alert('Batch deleted successfully!');
//         } catch (err) {
//             console.error("Error deleting batch:", err);
//             alert('Failed to delete batch. Please try again.');
//         } finally {
//             setOpenDelete(false);
//             setDeleteId(null);
//         }
//     };

//     return (
//         <div className="flex-col w-screen ml-80 p-4">
//             <div className="justify-between items-center p-4 mb-4 flex">
//                 <h1 className="text-2xl font-semibold">Batches</h1>
//                 <button
//                     type="button"
//                     className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
//                     onClick={handleCreateBatchClick}
//                 >
//                     + Create Batch
//                 </button>
//             </div>

//             <CreateBatch
//                 isOpen={isOpen}
//                 toggleSidebar={handleClose}
//                 batch={currentBatch}
//                 courseId={courseId}
//             />

//             <div className="p-4 mt-4">
//                 <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleSearch={handleSearch} />
//             </div>

//             <div className="sec-3">
//                 <table className="data-table table">
//                     <thead className="table-secondary">
//                         <tr>
//                             <th>Sr No</th>
//                             <th>Batch Name</th>
//                             <th>Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {loading ? (
//                             <tr>
//                                 <td colSpan="3" className="text-center py-4">Loading...</td>
//                             </tr>
//                         ) : batches.length > 0 ? (
//                             (searchResults.length > 0 ? searchResults : batches).map((batch, index) => (
//                                 <tr key={batch.id}>
//                                     <td>{index + 1}</td>
//                                     <td>{batch.name}</td>
//                                     <td>
//                                         <div className="flex items-center space-x-2">
//                                             <button
//                                                 onClick={() => { setDeleteId(batch.id); setOpenDelete(true); }}
//                                                 className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
//                                             >
//                                                 Delete
//                                             </button>
//                                             <button
//                                                 onClick={() => handleEditClick(batch)}
//                                                 className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600"
//                                             >
//                                                 Update
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan="3" className="text-center py-4">No batches found</td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Delete Confirmation Dialog */}
//             <Dialog open={openDelete} handler={() => setOpenDelete(false)}>
//                 <DialogHeader>Confirm Deletion</DialogHeader>
//                 <DialogBody>Are you sure you want to delete this batch? This action cannot be undone.</DialogBody>
//                 <DialogFooter>
//                     <Button variant="text" color="gray" onClick={() => setOpenDelete(false)}>Cancel</Button>
//                     <Button variant="filled" color="red" onClick={handleDeleteBatch}>Yes, Delete</Button>
//                 </DialogFooter>
//             </Dialog>
//         </div>
//     );
// }


import { useState, useEffect } from "react";
import React from 'react';
import { useParams } from 'react-router-dom';
import CreateBatch from './CreateBatch.jsx';
import { getDocs, collection } from 'firebase/firestore';
import { deleteBatch } from '../../../../utils/batchOperations';
import { db } from '../../../../config/firebase.js';
import SearchBar from '../../../components/SearchBar.jsx';
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";
import { fetchUserPermissions } from "../../../../utils/fetchUserPermissions.js"; // Function to fetch permissions
import { auth } from "../../../../config/firebase"; // Ensure Firebase auth import

export default function Batches() {
    const { courseId } = useParams();
    const [currentBatch, setCurrentBatch] = useState(null);
    const [batches, setBatches] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [permissions, setPermissions] = useState({}); // Store role-based permissions
    const [currentUserId, setCurrentUserId] = useState(null);
    const BatchCollectionRef = collection(db, "Batch");

    // Fetch user permissions on mount
    useEffect(() => {
        const loadPermissions = async () => {
            if (!currentUserId) {
                console.error("currentUserId is undefined");
                return;
            }
    
            try {
                const perms = await fetchUserPermissions(currentUserId);
                console.log("User Permissions:", perms);
                setPermissions(perms);
            } catch (error) {
                console.error("Error fetching permissions:", error);
            }
        };
    
        loadPermissions();
    }, [currentUserId]);


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                console.log("Logged-in user:", user.uid);
                setCurrentUserId(user.uid);
            } else {
                console.warn("No user logged in");
                setCurrentUserId(null);
            }
        });
    
        return () => unsubscribe();
    }, []);
    
    // useEffect(() => {
    //     const loadPermissions = async () => {
    //         const userId = localStorage.getItem("userId"); // Assuming you store userId in localStorage
    //         if (!userId) return;

    //         const perms = await fetchUserPermissions(userId);
    //         console.log("User permissions: ", perms);
    //         setPermissions(perms || {});
    //     };
    //     loadPermissions();
    // }, []);

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }
        const results = batches.filter(batch =>
            batch.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results);
    };

    useEffect(() => {
        handleSearch();
    }, [searchTerm]);

    const fetchBatches = async () => {
        setLoading(true);
        try {
            const snapshot = await getDocs(BatchCollectionRef);
            const batchData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setBatches(batchData);
        } catch (error) {
            console.error('Error fetching batches:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBatches();
    }, [courseId]);

    const handleCreateBatchClick = () => {
        if (!permissions?.Batch?.Write) {
            alert("You are not authorized to create a batch.");
            return;
        }
        setCurrentBatch(null);
        setIsOpen(true);
    };

    const handleEditClick = (batch) => {
        if (!permissions?.Batch?.Update) {
            alert("You are not authorized to update batches.");
            return;
        }
        console.log("Editing Batch:", batch);
        setCurrentBatch(batch);
        setIsOpen(true);
    };


    const handleUpdateBatch = async (batchId, updatedData) => {
        try {
            console.log("Updating Batch ID:", batchId);
            console.log("Updated Data:", updatedData);
    
            await updateBatch(batchId, updatedData);
            fetchBatches(); // Refresh the list
            alert("Batch updated successfully!");
        } catch (error) {
            console.error("Error updating batch:", error);
            alert("Failed to update batch.");
        }
    };
    
    const handleDeleteBatch = async () => {
        if (!permissions?.Batch?.Delete) {
            alert("You are not authorized to delete batches.");
            return;
        }

        if (!deleteId) return;
        try {
            await deleteBatch(deleteId);
            fetchBatches();
            alert('Batch deleted successfully!');
        } catch (err) {
            console.error("Error deleting batch:", err);
            alert('Failed to delete batch. Please try again.');
        } finally {
            setOpenDelete(false);
            setDeleteId(null);
        }
    };

    return (
        <div className="flex-col w-screen ml-80 p-4">
            <div className="justify-between items-center p-4 mb-4 flex">
                <h1 className="text-2xl font-semibold">Batches</h1>
                {permissions?.Batch?.Write && (
                    <button
                        type="button"
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                        onClick={handleCreateBatchClick}
                    >
                        + Create Batch
                    </button>
                )}
            </div>

            <CreateBatch
                isOpen={isOpen}
                toggleSidebar={() => setIsOpen(false)}
                batch={currentBatch}
                courseId={courseId}
            />

            <div className="p-4 mt-4">
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleSearch={handleSearch} />
            </div>

            <div className="sec-3">
                <table className="data-table table">
                    <thead className="table-secondary">
                        <tr>
                            <th>Sr No</th>
                            <th>Batch Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="3" className="text-center py-4">Loading...</td>
                            </tr>
                        ) : batches.length > 0 ? (
                            (searchResults.length > 0 ? searchResults : batches).map((batch, index) => (
                                <tr key={batch.id}>
                                    <td>{index + 1}</td>
                                    <td>{batch.name}</td>
                                    <td>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => {
                                                    if (permissions?.Batch?.Delete) {
                                                        setDeleteId(batch.id);
                                                        setOpenDelete(true);
                                                    } else {
                                                        alert("You are not authorized to delete batches.");
                                                    }
                                                }}
                                                className={`px-4 py-1 rounded-lg transition ${permissions?.Batch?.Delete
                                                    ? "bg-red-500 text-white hover:bg-red-600"
                                                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                                                    }`}
                                                disabled={!permissions?.Batch?.Delete}
                                            >
                                                Delete
                                            </button>

                                            <Button
                                                disabled={!permissions?.Batch?.Update}
                                                onClick={() => handleEditClick(batch)}
                                            >
                                                Update
                                            </Button>


                                            {/* <button 
                                                onClick={() => handleEditClick(batch)}
                                                className={`px-4 py-1 rounded-lg transition ${
                                                    permissions?.Batch?.Update 
                                                        ? "bg-blue-500 text-white hover:bg-blue-600"
                                                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                                                }`}
                                                disabled={!permissions?.Batch?.Update}
                                            >
                                                Update
                                            </button> */}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center py-4">No batches found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDelete} handler={() => setOpenDelete(false)}>
                <DialogHeader>Confirm Deletion</DialogHeader>
                <DialogBody>Are you sure you want to delete this batch? This action cannot be undone.</DialogBody>
                <DialogFooter>
                    <Button variant="text" color="gray" onClick={() => setOpenDelete(false)}>Cancel</Button>
                    <Button variant="filled" color="red" onClick={handleDeleteBatch}>Yes, Delete</Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
}
