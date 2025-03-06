// import { useState, useEffect } from "react";
// import React from 'react';
// import { useParams } from 'react-router-dom';
// import CreateAssignment from './CreateAssignment.jsx';
// import { getDocs, collection } from 'firebase/firestore';
// import { deleteBatch, updateBatch } from '../../../../utils/batchOperations';
// import { db } from '../../../../config/firebase.js';
// import SearchBar from '../../../components/SearchBar.jsx';
// import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";

// export default function Assignment() {
//     const { assignmentId } = useParams();
//     const [assignment, setAssignment] = useState(null);
//     const [dueDate, setDueDate] = useState("");
//     const [curriculum, setCurriculum] = useState("");
//     const [searchTerm, setSearchTerm] = useState('');
//     const [searchResults, setSearchResults] = useState([]);
//     const [isOpen, setIsOpen] = useState(false);
//     const [openDelete, setOpenDelete] = useState(false);
//     const [deleteId, setDeleteId] = useState(null);
//     const [loading, setLoading] = useState(true);

//     const BatchCollectionRef = collection(db, "Batch");

//     const toggleSidebar = () => setIsOpen(prev => !prev);

//     const handleSearch = (e) => {
//         if (e) e.preventDefault();
//         if (!searchTerm.trim()) {
//             setSearchResults([]);
//             return;
//         }
//         const results = assignment.filter(assignment =>
//             assignment.name.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//         setSearchResults(results);
//     };

//     useEffect(() => {
//         handleSearch();
//     }, [searchTerm]);

//     const fetchAssignments = async () => {
//         setLoading(true);
//         try {
//             const snapshot = await getDocs(AssignmentCollectionRef);
//             const batchData = snapshot.docs.map(doc => ({
//                 id: doc.id,
//                 ...doc.data(),
//             }));
//             setAssignment(assignmentData);
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
//                             <th>Assignment Name</th>
//                             <th>Due date</th>
//                             <th>Submit count</th>
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
import { useState, useEffect } from 'react';
import { db } from '../../../../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function AssignmentsList() {
    const [assignments, setAssignments] = useState([]);
    const [permissions, setPermissions] = useState({});


    useEffect(() => {
        const loadPermissions = async () => {
          const perms = await fetchUserPermissions(currentUserId);
          setPermissions(perms);
        };
        loadPermissions();
      }, []);
      
      // Example: Disable delete button if user lacks permission
      <Button 
        disabled={!permissions?.Courses?.Delete} 
        onClick={handleDelete}
      >
        Delete Course
      </Button>

      
    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const assignmentsCollection = collection(db, "assignments");
                const snapshot = await getDocs(assignmentsCollection);
                const assignmentList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setAssignments(assignmentList);
            } catch (error) {
                console.error("Error fetching assignments:", error);
            }
        };

        fetchAssignments();
    }, []);

    return (
        <div className="container ml-80 p-4">
        {/* // <div className="p-6"> */}
            <h2 className="text-xl font-bold">Assignments</h2>
            <table className="w-full border-collapse border border-gray-300 mt-4">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Curriculum</th>
                        <th className="border p-2">Due Date</th>
                        <th className="border p-2">Document</th>
                    </tr>
                </thead>
                <tbody>
                    {assignments.map((assignment) => (
                        <tr key={assignment.id} className="text-center">
                            <td className="border p-2">{assignment.curriculum}</td>
                            <td className="border p-2">{assignment.dueDate}</td>
                            <td className="border p-2">
                                <a href={assignment.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                                    View Document
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
