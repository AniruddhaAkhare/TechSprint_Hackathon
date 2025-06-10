// import React, { useState, useEffect } from 'react';
// import { ChevronDown, Plus, Eye, Trash2, FileText, Upload, X, Edit2 } from 'lucide-react';
// import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
// import { db } from '../../../../config/firebase';
// import Submissions from './Submissions';

// const Assignment = () => {
//   const [assignments, setAssignments] = useState([]);
//   const [submissions, setSubmissions] = useState([]);
//   const [batches, setBatches] = useState([]);
//   const [showCreatePanel, setShowCreatePanel] = useState(false);
//   const [showEditPanel, setShowEditPanel] = useState(false);
//   const [showViewPanel, setShowViewPanel] = useState(false);
//   const [showSubmissionsPanel, setShowSubmissionsPanel] = useState(false);
//   const [selectedAssignment, setSelectedAssignment] = useState(null);
//   const [assignmentSubmissions, setAssignmentSubmissions] = useState([]);
//   const [dropdownOpen, setDropdownOpen] = useState(null);
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     deadline: '',
//     fileUrl: '',
//     assignedToBatch: ''
//   });

//   // Fetch data from Firestore
//   useEffect(() => {
//     fetchAssignments();
//     fetchSubmissions();
//     fetchBatches();
//   }, []);

//   const fetchAssignments = async () => {
//     try {
//       const querySnapshot = await getDocs(collection(db, 'assignments'));
//       const assignmentList = querySnapshot.docs.map(doc => {
//         const data = doc.data();
//         return {
//           id: doc.id,
//           title: data.title || 'N/A',
//           description: data.description || 'N/A',
//           deadline: data.deadline || '',
//           fileUrl: data.fileUrl || '',
//           assignedToBatch: data.assignedToBatch || '',
//           createdAt: data.createdAt || new Date().toISOString().split('T')[0], // Fallback for createdAt
//           createdBy: data.createdBy || 'Unknown'
//         };
//       });
//       setAssignments(assignmentList);
//     } catch (error) {
//       console.error('Error fetching assignments:', error);
//       alert('Failed to fetch assignments. Please try again.');
//     }
//   };

//   const fetchSubmissions = async () => {
//     try {
//       const querySnapshot = await getDocs(collection(db, 'Submissions'));
//       const submissionList = querySnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//       setSubmissions(submissionList);
//     } catch (error) {
//       console.error('Error fetching submissions:', error);
//       alert('Failed to fetch submissions. Please try again.');
//     }
//   };

//   const fetchBatches = async () => {
//     try {
//       const querySnapshot = await getDocs(collection(db, 'Batch'));
//       const batchList = querySnapshot.docs.map(doc => ({
//         id: doc.id,
//         batchName: doc.data().batchName || 'N/A'
//       }));
//       setBatches(batchList);
//     } catch (error) {
//       console.error('Error fetching batches:', error);
//       alert('Failed to fetch batches. Please try again.');
//     }
//   };

//   const handleCreateAssignment = async () => {
//     if (!formData.title || !formData.description || !formData.deadline || !formData.assignedToBatch) {
//       alert('Please fill in all required fields');
//       return;
//     }
    
//     try {
//       const newAssignment = {
//         ...formData,
//         createdAt: new Date().toISOString().split('T')[0],
//         createdBy: 'Current User' // Replace with actual authenticated user
//       };
      
//       const docRef = await addDoc(collection(db, 'assignments'), newAssignment);
      
//       setAssignments(prev => [...prev, { id: docRef.id, ...newAssignment }]);
//       resetForm();
//       setShowCreatePanel(false);
//       alert('Assignment created successfully!');
//     } catch (error) {
//       console.error('Error creating assignment:', error);
//       alert('Failed to create assignment. Please try again.');
//     }
//   };

//   const handleEditAssignment = async () => {
//     if (!formData.title || !formData.description || !formData.deadline || !formData.assignedToBatch) {
//       alert('Please fill in all required fields');
//       return;
//     }
    
//     if (!selectedAssignment?.id) {
//       alert('No assignment selected for editing');
//       return;
//     }

//     try {
//       const assignmentRef = doc(db, 'assignments', selectedAssignment.id);
//       const updatedAssignment = {
//         ...formData,
//         createdAt: selectedAssignment.createdAt || new Date().toISOString().split('T')[0], // Fallback
//         createdBy: selectedAssignment.createdBy || 'Unknown' // Fallback
//       };
      
//       await updateDoc(assignmentRef, updatedAssignment);
      
//       setAssignments(prev => prev.map(a => 
//         a.id === selectedAssignment.id ? { id: a.id, ...updatedAssignment } : a
//       ));
      
//       resetForm();
//       setShowEditPanel(false);
//       setSelectedAssignment(null);
//       alert('Assignment updated successfully!');
//     } catch (error) {
//       console.error('Error updating assignment:', error);
//       alert('Failed to update assignment. Please try again.');
//     }
//   };

//   const handleDeleteAssignment = async (assignmentId) => {
//     try {
//       await deleteDoc(doc(db, 'assignments', assignmentId));
//       setAssignments(prev => prev.filter(a => a.id !== assignmentId));
//       setDropdownOpen(null);
//       alert('Assignment deleted successfully!');
//     } catch (error) {
//       console.error('Error deleting assignment:', error);
//       alert('Failed to delete assignment. Please try again.');
//     }
//   };

//   const handleViewAssignment = (assignment) => {
//     setSelectedAssignment(assignment);
//     setShowViewPanel(true);
//     setDropdownOpen(null);
//   };

//   const handleViewSubmissions = (assignment) => {
//     const relatedSubmissions = submissions.filter(sub => sub.assignmentId === assignment.id);
//     setAssignmentSubmissions(relatedSubmissions);
//     setSelectedAssignment(assignment);
//     setShowSubmissionsPanel(true);
//     setDropdownOpen(null);
//   };

//   const handleEditClick = (assignment) => {
//     setSelectedAssignment(assignment);
//     setFormData({
//       title: assignment.title || '',
//       description: assignment.description || '',
//       deadline: assignment.deadline || '',
//       fileUrl: assignment.fileUrl || '',
//       assignedToBatch: assignment.assignedToBatch || ''
//     });
//     setShowEditPanel(true);
//     setDropdownOpen(null);
//   };

//   const resetForm = () => {
//     setFormData({
//       title: '',
//       description: '',
//       deadline: '',
//       fileUrl: '',
//       assignedToBatch: ''
//     });
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       return new Date(dateString).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       });
//     } catch {
//       return 'Invalid Date';
//     }
//   };

//   const isOverdue = (deadline) => {
//     if (!deadline) return false;
//     try {
//       return new Date(deadline) < new Date();
//     } catch {
//       return false;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 fixed inset-0 left-[300px]">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Assignment Management</h1>
//               <p className="text-gray-600 mt-1">Manage and track student assignments</p>
//             </div>
//             <button
//               onClick={() => {
//                 resetForm();
//                 setShowCreatePanel(true);
//               }}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
//             >
//               <Plus size={20} />
//               Create Assignment
//             </button>
//           </div>
//         </div>

//         {/* Assignments Table */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <h2 className="text-lg font-semibold text-gray-900">All Assignments</h2>
//           </div>
          
//           <div className="max-h-[500px] overflow-y-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50 sticky top-0">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {assignments.map((assignment) => (
//                   <tr key={assignment.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4">
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">{assignment.title}</div>
//                         <div className="text-sm text-gray-500 truncate max-w-xs">{assignment.description}</div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                         {assignment.assignedToBatch}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className={`text-sm ${isOverdue(assignment.deadline) ? 'text-red-600' : 'text-gray-900'}`}>
//                         {formatDate(assignment.deadline)}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-500">
//                       {formatDate(assignment.createdAt)}
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         isOverdue(assignment.deadline) ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
//                       }`}>
//                         {isOverdue(assignment.deadline) ? 'Overdue' : 'Active'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 relative">
//                       <button
//                         onClick={() => setDropdownOpen(dropdownOpen === assignment.id ? null : assignment.id)}
//                         className="text-gray-400 hover:text-gray-600 p-1"
//                       >
//                         <ChevronDown size={16} />
//                       </button>
//                       {dropdownOpen === assignment.id && (
//                         <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
//                           <div className="py-1">
//                             <button
//                               onClick={() => handleViewAssignment(assignment)}
//                               className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
//                             >
//                               <Eye size={16} />
//                               View Assignment
//                             </button>
//                             <button
//                               onClick={() => handleViewSubmissions(assignment)}
//                               className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
//                             >
//                               <FileText size={16} />
//                               View Submissions
//                             </button>
//                             <button
//                               onClick={() => handleEditClick(assignment)}
//                               className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
//                             >
//                               <Edit2 size={16} />
//                               Edit Assignment
//                             </button>
//                             <button
//                               onClick={() => handleDeleteAssignment(assignment.id)}
//                               className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
//                             >
//                               <Trash2 size={16} />
//                               Delete Assignment
//                             </button>
//                           </div>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Create Assignment Panel */}
//       {showCreatePanel && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
//           <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 overflow-y-auto">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-xl font-semibold">Create Assignment</h2>
//                 <button
//                   onClick={() => {
//                     resetForm();
//                     setShowCreatePanel(false);
//                   }}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//                   <input
//                     type="text"
//                     required
//                     value={formData.title}
//                     onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                   <textarea
//                     required
//                     rows={3}
//                     value={formData.description}
//                     onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
//                   <input
//                     type="date"
//                     required
//                     value={formData.deadline}
//                     onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">File URL</label>
//                   <input
//                     type="url"
//                     value={formData.fileUrl}
//                     onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="https://example.com/file.pdf"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Assigned to Batch</label>
//                   <select
//                     required
//                     value={formData.assignedToBatch}
//                     onChange={(e) => setFormData({ ...formData, assignedToBatch: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select Batch</option>
//                     {batches.map(batch => (
//                       <option key={batch.id} value={batch.batchName}>{batch.batchName}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="flex gap-3 pt-4">
//                   <button
//                     onClick={handleCreateAssignment}
//                     className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
//                   >
//                     Create Assignment
//                   </button>
//                   <button
//                     onClick={() => {
//                       resetForm();
//                       setShowCreatePanel(false);
//                     }}
//                     className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Assignment Panel */}
//       {showEditPanel && selectedAssignment && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
//           <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 overflow-y-auto">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-xl font-semibold">Edit Assignment</h2>
//                 <button
//                   onClick={() => {
//                     resetForm();
//                     setShowEditPanel(false);
//                     setSelectedAssignment(null);
//                   }}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//                   <input
//                     type="text"
//                     required
//                     value={formData.title}
//                     onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                   <textarea
//                     required
//                     rows={3}
//                     value={formData.description}
//                     onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
//                   <input
//                     type="date"
//                     required
//                     value={formData.deadline}
//                     onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">File URL</label>
//                   <input
//                     type="url"
//                     value={formData.fileUrl}
//                     onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="https://example.com/file.pdf"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Assigned to Batch</label>
//                   <select
//                     required
//                     value={formData.assignedToBatch}
//                     onChange={(e) => setFormData({ ...formData, assignedToBatch: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select Batch</option>
//                     {batches.map(batch => (
//                       <option key={batch.id} value={batch.batchName}>{batch.batchName}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="flex gap-3 pt-4">
//                   <button
//                     onClick={handleEditAssignment}
//                     className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
//                   >
//                     Save Changes
//                   </button>
//                   <button
//                     onClick={() => {
//                       resetForm();
//                       setShowEditPanel(false);
//                       setSelectedAssignment(null);
//                     }}
//                     className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* View Assignment Panel */}
//       {showViewPanel && selectedAssignment && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
//           <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 overflow-y-auto">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-xl font-semibold">Assignment Details</h2>
//                 <button
//                   onClick={() => setShowViewPanel(false)}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//                   <p className="text-gray-900">{selectedAssignment.title}</p>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                   <p className="text-gray-900">{selectedAssignment.description}</p>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
//                   <p className="text-gray-900">{formatDate(selectedAssignment.deadline)}</p>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
//                   <p className="text-gray-900">{formatDate(selectedAssignment.createdAt)}</p>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Created By</label>
//                   <p className="text-gray-900">{selectedAssignment.createdBy}</p>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Assigned to Batch</label>
//                   <p className="text-gray-900">{selectedAssignment.assignedToBatch}</p>
//                 </div>
//                 {selectedAssignment.fileUrl && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
//                     <a
//                       href={selectedAssignment.fileUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
//                     >
//                       <Upload size={16} />
//                       View File
//                     </a>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* View Submissions Panel */}
//       {showSubmissionsPanel && selectedAssignment && (
//   <Submissions
//     assignment={selectedAssignment}
//     onClose={() => setShowSubmissionsPanel(false)}
//   />
// )}

//       {/* Backdrop for dropdown */}
//       {dropdownOpen && (
//         <div
//           className="fixed inset-0 z-30"
//           onClick={() => setDropdownOpen(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default Assignment;




import React, { useState, useEffect } from 'react';
import { ChevronDown, Plus, Eye, Trash2, FileText, Upload, X, Edit2, Search } from 'lucide-react';
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc, runTransaction } from 'firebase/firestore';
import { db } from '../../../../config/firebase';
import Submissions from './Submissions';
import { useAuth } from '../../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Assignment = () => {
  const navigate = useNavigate();
  const { user, rolePermissions } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [batches, setBatches] = useState([]);
  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [showViewPanel, setShowViewPanel] = useState(false);
  const [showSubmissionsPanel, setShowSubmissionsPanel] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [assignmentSubmissions, setAssignmentSubmissions] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true); // Added loading state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    fileUrl: '',
    assignedToBatch: ''
  });

  // Define permissions for Assignment
  const canCreate = rolePermissions?.assignments?.create|| false;
  const canUpdate = rolePermissions?.assignments?.update|| false;
  const canDelete = rolePermissions?.assignments?.delete|| false;
  const canDisplay = rolePermissions?.assignments?.display|| false;

  // Activity logging function (copied from FinancePartner.jsx)
  const logActivity = async (action, details) => {
    if (!user?.email) {
      console.warn("No user email found, skipping activity log");
      return;
    }

    const activityLogRef = doc(db, "activityLogs", "logDocument");

    const logEntry = {
      action,
      details,
      timestamp: new Date().toISOString(),
      userEmail: user.email,
      userId: user.uid,
      section: "Assignment"
    };

    try {
      await runTransaction(db, async (transaction) => {
        const logDoc = await transaction.get(activityLogRef);
        let logs = logDoc.exists() ? logDoc.data().logs || [] : [];

        if (!Array.isArray(logs)) {
          logs = [];
        }

        logs.push(logEntry);

        if (logs.length > 1000) {
          logs = logs.slice(-1000);
        }

        transaction.set(activityLogRef, { logs }, { merge: true });
      });
      console.log("Activity logged successfully:", action);
    } catch (error) {
      console.error("Error logging activity:", error);
      alert("Failed to log activity");
    }
  };

  // Fetch data from Firestore
  useEffect(() => {
    if (!canDisplay) {
      // logActivity('UNAUTHORIZED_ACCESS_ATTEMPT', { page: 'Assignment' });
      navigate("/unauthorized");
      return;
    }
    fetchAssignments();
    fetchSubmissions();
    fetchBatches();
  }, [canDisplay, navigate]);

  // Filter assignments whenever assignments, searchQuery, or statusFilter changes
  useEffect(() => {
    let filtered = assignments;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (assignment) =>
          assignment.title.toLowerCase().includes(query) ||
          assignment.description.toLowerCase().includes(query)
      );
      // logActivity('SEARCH_ASSIGNMENTS', { searchQuery, resultCount: filtered.length });
    }

    // Apply status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter((assignment) =>
        statusFilter === 'Active'
          ? !isOverdue(assignment.deadline)
          : isOverdue(assignment.deadline)
      );
      // logActivity('FILTER_ASSIGNMENTS_BY_STATUS', { status: statusFilter, resultCount: filtered.length });
    }

    setFilteredAssignments(filtered);
  }, [assignments, searchQuery, statusFilter]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'assignments'));
      const assignmentList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || 'N/A',
          description: data.description || 'N/A',
          deadline: data.deadline || '',
          fileUrl: data.fileUrl || '',
          assignedToBatch: data.assignedToBatch || '',
          createdAt: data.createdAt || new Date().toISOString().split('T')[0], // Fallback for createdAt
          createdBy: data.createdBy || 'Unknown'
        };
      });
      setAssignments(assignmentList);
      // logActivity('FETCH_ASSIGNMENTS_SUCCESS', { count: assignmentList.length });
    } catch (error) {
      console.error('Error fetching assignments:', error);
      // logActivity('FETCH_ASSIGNMENTS_ERROR', { error: error.message });
      alert('Failed to fetch assignments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Submissions'));
      const submissionList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSubmissions(submissionList);
      // logActivity('FETCH_SUBMISSIONS_SUCCESS', { count: submissionList.length });
    } catch (error) {
      console.error('Error fetching submissions:', error);
      // logActivity('FETCH_SUBMISSIONS_ERROR', { error: error.message });
      alert('Failed to fetch submissions. Please try again.');
    }
  };

  const fetchBatches = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Batch'));
      const batchList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        batchName: doc.data().batchName || 'N/A'
      }));
      setBatches(batchList);
      // logActivity('FETCH_BATCHES_SUCCESS', { count: batchList.length });
    } catch (error) {
      console.error('Error fetching batches:', error);
      // logActivity('FETCH_BATCHES_ERROR', { error: error.message });
      alert('Failed to fetch batches. Please try again.');
    }
  };

  const handleCreateAssignment = async () => {
    if (!canCreate) {
      // logActivity('UNAUTHORIZED_CREATE_ATTEMPT', { action: 'createAssignment' });
      alert('You do not have permission to create assignments.');
      return;
    }

    if (!formData.title || !formData.description || !formData.deadline || !formData.assignedToBatch) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      const newAssignment = {
        ...formData,
        createdAt: new Date().toISOString().split('T')[0],
        createdBy: user?.email || 'Current User' // Use authenticated user's email
      };
      
      const docRef = await addDoc(collection(db, 'assignments'), newAssignment);
      
      setAssignments(prev => [...prev, { id: docRef.id, ...newAssignment }]);
      resetForm();
      setShowCreatePanel(false);
      logActivity('Assignment created', { title: newAssignment.title });
      alert('Assignment created successfully!');
    } catch (error) {
      console.error('Error creating assignment:', error);
      // logActivity('CREATE_ASSIGNMENT_ERROR', { error: error.message });
      alert('Failed to create assignment. Please try again.');
    }
  };

  const handleEditAssignment = async () => {
    if (!canUpdate) {
      // logActivity('UNAUTHORIZED_UPDATE_ATTEMPT', { action: 'editAssignment', assignmentId: selectedAssignment?.id });
      alert('You do not have permission to edit assignments.');
      return;
    }

    if (!formData.title || !formData.description || !formData.deadline || !formData.assignedToBatch) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (!selectedAssignment?.id) {
      alert('No assignment selected for editing');
      return;
    }

    try {
      const assignmentRef = doc(db, 'assignments', selectedAssignment.id);
      const updatedAssignment = {
        ...formData,
        createdAt: selectedAssignment.createdAt || new Date().toISOString().split('T')[0], // Fallback
        createdBy: selectedAssignment.createdBy || 'Unknown' // Fallback
      };
      
      await updateDoc(assignmentRef, updatedAssignment);
      
      setAssignments(prev => prev.map(a => 
        a.id === selectedAssignment.id ? { id: a.id, ...updatedAssignment } : a
      ));
      
      resetForm();
      setShowEditPanel(false);
      setSelectedAssignment(null);
      logActivity('Assignment updated', { title: updatedAssignment.title });
      alert('Assignment updated successfully!');
    } catch (error) {
      console.error('Error updating assignment:', error);
      // logActivity('UPDATE_ASSIGNMENT_ERROR', { assignmentId: selectedAssignment.id, error: error.message });
      alert('Failed to update assignment. Please try again.');
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!canDelete) {
      // logActivity('UNAUTHORIZED_DELETE_ATTEMPT', { action: 'deleteAssignment', assignmentId });
      alert('You do not have permission to delete assignments.');
      return;
    }

    try {
      await deleteDoc(doc(db, 'assignments', assignmentId));
      setAssignments(prev => prev.filter(a => a.id !== assignmentId));
      setDropdownOpen(null);
      logActivity('Assignment deleted', { assignmentId });
      alert('Assignment deleted successfully!');
    } catch (error) {
      console.error('Error deleting assignment:', error);
      // logActivity('DELETE_ASSIGNMENT_ERROR', { assignmentId, error: error.message });
      alert('Failed to delete assignment. Please try again.');
    }
  };

  const handleViewAssignment = (assignment) => {
    if (!canDisplay) {
      // logActivity('UNAUTHORIZED_VIEW_ATTEMPT', { action: 'viewAssignment', assignmentId: assignment.id });
      alert('You do not have permission to view assignments.');
      return;
    }
    setSelectedAssignment(assignment);
    setShowViewPanel(true);
    setDropdownOpen(null);
    // logActivity('VIEW_ASSIGNMENT', { assignmentId: assignment.id, title: assignment.title });
  };

  const handleViewSubmissions = (assignment) => {
    if (!canDisplay) {
      // logActivity('UNAUTHORIZED_VIEW_SUBMISSIONS_ATTEMPT', { action: 'viewSubmissions', assignmentId: assignment.id });
      alert('You do not have permission to view submissions.');
      return;
    }
    const relatedSubmissions = submissions.filter(sub => sub.assignmentId === assignment.id);
    setAssignmentSubmissions(relatedSubmissions);
    setSelectedAssignment(assignment);
    setShowSubmissionsPanel(true);
    setDropdownOpen(null);
    // logActivity('VIEW_SUBMISSIONS', { assignmentId: assignment.id, title: assignment.title });
  };

  const handleEditClick = (assignment) => {
    if (!canUpdate) {
      // logActivity('UNAUTHORIZED_EDIT_ATTEMPT', { action: 'editAssignment', assignmentId: assignment.id });
      alert('You do not have permission to edit assignments.');
      return;
    }
    setSelectedAssignment(assignment);
    setFormData({
      title: assignment.title || '',
      description: assignment.description || '',
      deadline: assignment.deadline || '',
      fileUrl: assignment.fileUrl || '',
      assignedToBatch: assignment.assignedToBatch || ''
    });
    setShowEditPanel(true);
    setDropdownOpen(null);
    // logActivity('OPEN_EDIT_ASSIGNMENT', { assignmentId: assignment.id, title: assignment.title });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      deadline: '',
      fileUrl: '',
      assignedToBatch: ''
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const isOverdue = (deadline) => {
    if (!deadline) return false;
    try {
      return new Date(deadline) < new Date();
    } catch {
      return false;
    }
  };

  if (!canDisplay) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">Loading...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 fixed inset-0 left-[300px]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Assignment Management</h1>
              <p className="text-gray-600 mt-1">Manage and track student assignments</p>
            </div>
            {canCreate && (
              <button
                onClick={() => {
                  resetForm();
                  setShowCreatePanel(true);
                  // logActivity('OPEN_CREATE_ASSIGNMENT', {});
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus size={20} />
                Create Assignment
              </button>
            )}
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-4 flex items-center gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or description..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Status Filter */}
          <div className="w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>

        {/* Assignments Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              All Assignments ({filteredAssignments.length})
            </h2>
          </div>
          
          <div className="max-h-[500px] overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAssignments.map((assignment) => (
                  <tr key={assignment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{assignment.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{assignment.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {assignment.assignedToBatch}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm ${isOverdue(assignment.deadline) ? 'text-red-600' : 'text-gray-900'}`}>
                        {formatDate(assignment.deadline)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(assignment.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isOverdue(assignment.deadline) ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {isOverdue(assignment.deadline) ? 'Overdue' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 relative">
                      <button
                        onClick={() => setDropdownOpen(dropdownOpen === assignment.id ? null : assignment.id)}
                        className="text-gray-400 hover:text-gray-600 p-1"
                      >
                        <ChevronDown size={16} />
                      </button>
                      {dropdownOpen === assignment.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-30 border border-gray-200">
                          <div className="py-1">
                            <button
                              onClick={() => handleViewAssignment(assignment)}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <Eye size={16} />
                              View Assignment
                            </button>
                            <button
                              onClick={() => handleViewSubmissions(assignment)}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <FileText size={16} />
                              View Submissions
                            </button>
                            {canUpdate && (
                              <button
                                onClick={() => handleEditClick(assignment)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Edit2 size={16} />
                                Edit Assignment
                              </button>
                            )}
                            {canDelete && (
                              <button
                                onClick={() => handleDeleteAssignment(assignment.id)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                              >
                                <Trash2 size={16} />
                                Delete Assignment
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredAssignments.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No assignments found.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Assignment Panel */}
      {canCreate && showCreatePanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
          <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Create Assignment</h2>
                <button
                  onClick={() => {
                    resetForm();
                    setShowCreatePanel(false);
                    // logActivity('CLOSE_CREATE_ASSIGNMENT', {});
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                  <input
                    type="date"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">File URL</label>
                  <input
                    type="url"
                    value={formData.fileUrl}
                    onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/file.pdf"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned to Batch</label>
                  <select
                    required
                    value={formData.assignedToBatch}
                    onChange={(e) => setFormData({ ...formData, assignedToBatch: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Batch</option>
                    {batches.map(batch => (
                      <option key={batch.id} value={batch.batchName}>{batch.batchName}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleCreateAssignment}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    Create Assignment
                  </button>
                  <button
                    onClick={() => {
                      resetForm();
                      setShowCreatePanel(false);
                      // logActivity('CLOSE_CREATE_ASSIGNMENT', {});
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Assignment Panel */}
      {canUpdate && showEditPanel && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
          <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Edit Assignment</h2>
                <button
                  onClick={() => {
                    resetForm();
                    setShowEditPanel(false);
                    setSelectedAssignment(null);
                    // logActivity('CLOSE_EDIT_ASSIGNMENT', { assignmentId: selectedAssignment.id });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                  <input
                    type="date"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">File URL</label>
                  <input
                    type="url"
                    value={formData.fileUrl}
                    onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/file.pdf"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned to Batch</label>
                  <select
                    required
                    value={formData.assignedToBatch}
                    onChange={(e) => setFormData({ ...formData, assignedToBatch: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Batch</option>
                    {batches.map(batch => (
                      <option key={batch.id} value={batch.batchName}>{batch.batchName}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleEditAssignment}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      resetForm();
                      setShowEditPanel(false);
                      setSelectedAssignment(null);
                      // logActivity('CLOSE_EDIT_ASSIGNMENT', { assignmentId: selectedAssignment.id });
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Assignment Panel */}
      {canDisplay && showViewPanel && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
          <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Assignment Details</h2>
                <button
                  onClick={() => {
                    setShowViewPanel(false);
                    // logActivity('CLOSE_VIEW_ASSIGNMENT', { assignmentId: selectedAssignment.id });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <p className="text-gray-900">{selectedAssignment.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <p className="text-gray-900">{selectedAssignment.description}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                  <p className="text-gray-900">{formatDate(selectedAssignment.deadline)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
                  <p className="text-gray-900">{formatDate(selectedAssignment.createdAt)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Created By</label>
                  <p className="text-gray-900">{selectedAssignment.createdBy}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned to Batch</label>
                  <p className="text-gray-900">{selectedAssignment.assignedToBatch}</p>
                </div>
                {selectedAssignment.fileUrl && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
                    <a
                      href={selectedAssignment.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Upload size={16} />
                      View File
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Submissions Panel */}
      {canDisplay && showSubmissionsPanel && selectedAssignment && (
        <Submissions
          assignment={selectedAssignment}
          onClose={() => {
            setShowSubmissionsPanel(false);
            // logActivity('CLOSE_VIEW_SUBMISSIONS', { assignmentId: selectedAssignment.id });
          }}
        />
      )}

      {/* Backdrop for dropdown */}
      {dropdownOpen && (
        <div
          className="z-100"
          onClick={() => setDropdownOpen(null)}
        />
      )}
    </div>
  );
};

export default Assignment;