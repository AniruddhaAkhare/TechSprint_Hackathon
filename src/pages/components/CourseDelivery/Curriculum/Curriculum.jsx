

// // // // // // import React, { useState, useEffect, useRef } from "react";
// // // // // // import { db, storage } from "../../../../config/firebase";
// // // // // // import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, arrayUnion } from "firebase/firestore";
// // // // // // import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// // // // // // import { useNavigate } from "react-router-dom";
// // // // // // import SearchBar from "../../SearchBar";
// // // // // // import CreateCurriculum from "./CreateCurriculum";
// // // // // // import AddMCQModal from "./AddMCQModal.jsx";
// // // // // // import ParentComponent from './ParentComponent.jsx';

// // // // // // const Curriculum = () => {
// // // // // //     const [curriculums, setCurriculums] = useState([]);
// // // // // //     const [isModalOpen, setIsModalOpen] = useState(false);
// // // // // //     const [selectedCurriculumId, setSelectedCurriculumId] = useState(null);
// // // // // //     const [selectedSection, setSelectedSection] = useState(null);
// // // // // //     const [sectionOptionsOpen, setSectionOptionsOpen] = useState(false);
// // // // // //     const fileInputRef = useRef(null);
// // // // // //     const [isMCQModalOpen, setIsMCQModalOpen] = useState(false);
// // // // // //     const navigate = useNavigate();

// // // // // //     useEffect(() => {
// // // // // //         fetchCurriculums();
// // // // // //     }, []);

// // // // // //     const fetchCurriculums = async () => {
// // // // // //         try {
// // // // // //             const snapshot = await getDocs(collection(db, "curriculum"));
// // // // // //             const curriculumData = await Promise.all(
// // // // // //                 snapshot.docs.map(async (doc) => {
// // // // // //                     const data = doc.data();
// // // // // //                     const sectionsSnapshot = await getDocs(collection(db, "curriculum", doc.id, "sections"));
// // // // // //                     return { id: doc.id, name: data.name, sectionCount: sectionsSnapshot.size };
// // // // // //                 })
// // // // // //             );
// // // // // //             setCurriculums(curriculumData);
// // // // // //         } catch (error) {
// // // // // //             console.error("Error fetching curriculums:", error);
// // // // // //         }
// // // // // //     };

// // // // // //     const handleDelete = async (curriculumId) => {
// // // // // //         const confirmDelete = window.confirm("Are you sure you want to delete this curriculum?");
// // // // // //         if (!confirmDelete) return;

// // // // // //         try {
// // // // // //             await deleteDoc(doc(db, "curriculum", curriculumId));
// // // // // //             fetchCurriculums();
// // // // // //             alert("Curriculum deleted successfully!");
// // // // // //         } catch (error) {
// // // // // //             console.error("Error deleting curriculum:", error);
// // // // // //         }
// // // // // //     };

// // // // // //     const handleAddCurriculum = async (curriculumData) => {
// // // // // //         try {
// // // // // //             await addDoc(collection(db, "curriculum"), curriculumData);
// // // // // //             fetchCurriculums();
// // // // // //             setIsModalOpen(false);
// // // // // //         } catch (error) {
// // // // // //             console.error("Error adding curriculum:", error);
// // // // // //         }
// // // // // //     };

// // // // // //     return (
// // // // // //         <div className="flex-col w-screen ml-80 p-4">
// // // // // //             <h1 className="text-2xl font-semibold">Curriculum</h1>
// // // // // //             <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-blue-500 text-white rounded">
// // // // // //                 + Add Curriculum
// // // // // //             </button>
// // // // // //             <SearchBar />

// // // // // //             <table className="mt-4 w-full border-collapse border border-gray-300">
// // // // // //                 <thead>
// // // // // //                     <tr className="bg-gray-100">
// // // // // //                         <th className="border border-gray-300 px-4 py-2">Curriculum Name</th>
// // // // // //                         <th className="border border-gray-300 px-4 py-2">Section Count</th>
// // // // // //                         <th className="border border-gray-300 px-4 py-2">Actions</th>
// // // // // //                     </tr>
// // // // // //                 </thead>
// // // // // //                 <tbody>
// // // // // //                     {curriculums.map(curriculum => (
// // // // // //                         <tr key={curriculum.id} className="border border-gray-300">
// // // // // //                             <td className="border border-gray-300 px-4 py-2">{curriculum.name}</td>
// // // // // //                             <td className="border border-gray-300 px-4 py-2 text-center">{curriculum.sectionCount}</td>
// // // // // //                             <td className="border border-gray-300 px-4 py-2 flex space-x-2">
// // // // // //                                 <button
// // // // // //                                     onClick={() => navigate(`/curriculum/${curriculum.id}`)} // Fixed navigation
// // // // // //                                     className="bg-blue-500 text-white px-2 py-1 rounded"
// // // // // //                                 >
// // // // // //                                     Edit
// // // // // //                                 </button>
// // // // // //                                 <button
// // // // // //                                     onClick={() => handleDelete(curriculum.id)}
// // // // // //                                     className="bg-red-500 text-white px-2 py-1 rounded"
// // // // // //                                 >
// // // // // //                                     Delete
// // // // // //                                 </button>
// // // // // //                             </td>
// // // // // //                         </tr>
// // // // // //                     ))}
// // // // // //                 </tbody>
// // // // // //             </table>

// // // // // //             <CreateCurriculum 
// // // // // //                 isOpen={isModalOpen} 
// // // // // //                 onClose={() => setIsModalOpen(false)} 
// // // // // //                 onSubmit={handleAddCurriculum} 
// // // // // //             />
// // // // // //         </div>
// // // // // //     );
// // // // // // };

// // // // // // export default Curriculum;

// // // // // import React, { useState, useEffect, useRef } from "react";
// // // // // import { db, storage } from "../../../../config/firebase";
// // // // // import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, arrayUnion } from "firebase/firestore";
// // // // // import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// // // // // import { useNavigate } from "react-router-dom";
// // // // // import SearchBar from "../../SearchBar";
// // // // // import CreateCurriculum from "./CreateCurriculum";
// // // // // import AddMCQModal from "./AddMCQModal.jsx";
// // // // // import ParentComponent from './ParentComponent.jsx';

// // // // // const Curriculum = () => {
// // // // //     const [curriculums, setCurriculums] = useState([]);
// // // // //     const [isModalOpen, setIsModalOpen] = useState(false);
// // // // //     const [selectedCurriculumId, setSelectedCurriculumId] = useState(null);
// // // // //     const [selectedSection, setSelectedSection] = useState(null);
// // // // //     const [sectionOptionsOpen, setSectionOptionsOpen] = useState(false);
// // // // //     const fileInputRef = useRef(null);
// // // // //     const [isMCQModalOpen, setIsMCQModalOpen] = useState(false);
// // // // //     const navigate = useNavigate();

// // // // //     useEffect(() => {
// // // // //         fetchCurriculums();
// // // // //     }, []);

// // // // //     const fetchCurriculums = async () => {
// // // // //         try {
// // // // //             const snapshot = await getDocs(collection(db, "curriculum"));
// // // // //             const curriculumData = await Promise.all(
// // // // //                 snapshot.docs.map(async (doc) => {
// // // // //                     const data = doc.data();
// // // // //                     const sectionsSnapshot = await getDocs(collection(db, "curriculum", doc.id, "sections"));
// // // // //                     return { id: doc.id, name: data.name, sectionCount: sectionsSnapshot.size };
// // // // //                 })
// // // // //             );
// // // // //             setCurriculums(curriculumData);
// // // // //         } catch (error) {
// // // // //             console.error("Error fetching curriculums:", error);
// // // // //         }
// // // // //     };

// // // // //     const handleDelete = async (curriculumId) => {
// // // // //         const confirmDelete = window.confirm("Are you sure you want to delete this curriculum?");
// // // // //         if (!confirmDelete) return;

// // // // //         try {
// // // // //             await deleteDoc(doc(db, "curriculum", curriculumId));
// // // // //             fetchCurriculums();
// // // // //             alert("Curriculum deleted successfully!");
// // // // //         } catch (error) {
// // // // //             console.error("Error deleting curriculum:", error);
// // // // //         }
// // // // //     };

// // // // //     const handleAddCurriculum = async (curriculumData) => {
// // // // //         try {
// // // // //             await addDoc(collection(db, "curriculum"), curriculumData);
// // // // //             fetchCurriculums();
// // // // //             setIsModalOpen(false);
// // // // //         } catch (error) {
// // // // //             console.error("Error adding curriculum:", error);
// // // // //         }
// // // // //     };

// // // // //     return (
// // // // //         <div className="p-20">
// // // // //             {/* Header */}
// // // // //             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
// // // // //                 <h1 className="text-xl sm:text-2xl font-semibold">Curriculum</h1>
// // // // //                 <button
// // // // //                     onClick={() => setIsModalOpen(true)}
// // // // //                     className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 w-full sm:w-auto"
// // // // //                 >
// // // // //                     + Add Curriculum
// // // // //                 </button>
// // // // //             </div>

// // // // //             {/* Search Bar */}
// // // // //             <div className="mb-4">
// // // // //                 <SearchBar />
// // // // //             </div>

// // // // //             {/* Curriculum Table */}
// // // // //             <div className="overflow-x-auto">
// // // // //                 <table className="w-full min-w-[600px] border-collapse">
// // // // //                     <thead>
// // // // //                         <tr className="bg-gray-100">
// // // // //                             <th className="border p-2 text-left text-sm font-medium">Curriculum Name</th>
// // // // //                             <th className="border p-2 text-left text-sm font-medium">Section Count</th>
// // // // //                             <th className="border p-2 text-left text-sm font-medium">Actions</th>
// // // // //                         </tr>
// // // // //                     </thead>
// // // // //                     <tbody>
// // // // //                         {curriculums.map((curriculum) => (
// // // // //                             <tr key={curriculum.id} className="border-b">
// // // // //                                 <td className="border p-2 text-sm">{curriculum.name}</td>
// // // // //                                 <td className="border p-2 text-sm text-center">{curriculum.sectionCount}</td>
// // // // //                                 <td className="border p-2">
// // // // //                                     <div className="flex items-center space-x-2 flex-wrap gap-2">
// // // // //                                         <button
// // // // //                                             onClick={() => navigate(`/curriculum/${curriculum.id}`)}
// // // // //                                             className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition duration-200 text-sm"
// // // // //                                         >
// // // // //                                             Edit
// // // // //                                         </button>
// // // // //                                         <button
// // // // //                                             onClick={() => handleDelete(curriculum.id)}
// // // // //                                             className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-200 text-sm"
// // // // //                                         >
// // // // //                                             Delete
// // // // //                                         </button>
// // // // //                                     </div>
// // // // //                                 </td>
// // // // //                             </tr>
// // // // //                         ))}
// // // // //                     </tbody>
// // // // //                 </table>
// // // // //             </div>

// // // // //             {/* Create Curriculum Modal */}
// // // // //             <CreateCurriculum 
// // // // //                 isOpen={isModalOpen} 
// // // // //                 onClose={() => setIsModalOpen(false)} 
// // // // //                 onSubmit={handleAddCurriculum} 
// // // // //             />
// // // // //         </div>
// // // // //     );
// // // // // };

// // // // // export default Curriculum;


// // // // import React, { useState } from 'react';

// // // // const CurriculumTable = () => {
// // // //   // Sample data for the table
// // // //   const [curriculums, setCurriculums] = useState([
// // // //     { id: 1, name: 'Samiksha Raut', sections: 1 },
// // // //   ]);

// // // //   // State for pagination
// // // //   const [currentPage, setCurrentPage] = useState(1);
// // // //   const itemsPerPage = 50;

// // // //   // State for search
// // // //   const [searchTerm, setSearchTerm] = useState('');

// // // //   // Handle search input change
// // // //   const handleSearchChange = (e) => {
// // // //     setSearchTerm(e.target.value);
// // // //   };

// // // //   // Filter curriculums based on search term
// // // //   const filteredCurriculums = curriculums.filter((curriculum) =>
// // // //     curriculum.name.toLowerCase().includes(searchTerm.toLowerCase())
// // // //   );

// // // //   // Handle pagination
// // // //   const totalPages = Math.ceil(filteredCurriculums.length / itemsPerPage);
// // // //   const paginatedCurriculums = filteredCurriculums.slice(
// // // //     (currentPage - 1) * itemsPerPage,
// // // //     currentPage * itemsPerPage
// // // //   );

// // // //   const handlePageChange = (page) => {
// // // //     setCurrentPage(page);
// // // //   };

// // // //   // Handle adding a new curriculum (placeholder function)
// // // //   const handleAddCurriculum = () => {
// // // //     alert('Add Curriculum functionality to be implemented!');
// // // //   };

// // // //   return (
// // // //     <div style={styles.container}>
// // // //       {/* Header */}
// // // //       <h2 style={styles.header}>Curriculum</h2>
// // // //       <p style={styles.subHeader}>Manage all your course curriculum in one place.</p>

// // // //       {/* Filters and Actions */}
// // // //       <div style={styles.filters}>
// // // //         <div style={styles.filterItem}>
// // // //           <select style={styles.select}>
// // // //             <option>All Curriculum</option>
// // // //           </select>
// // // //           <span style={styles.badge}>01</span>
// // // //         </div>
// // // //         <div style={styles.searchAndAdd}>
// // // //           <input
// // // //             type="text"
// // // //             placeholder="Search"
// // // //             value={searchTerm}
// // // //             onChange={handleSearchChange}
// // // //             style={styles.searchInput}
// // // //           />
// // // //           <button onClick={handleAddCurriculum} style={styles.addButton}>
// // // //             + Add Curriculum
// // // //           </button>
// // // //         </div>
// // // //       </div>

// // // //       {/* Table */}
// // // //       <table style={styles.table}>
// // // //         <thead>
// // // //           <tr style={styles.tableHeader}>
// // // //             <th style={styles.tableCell}>Sr.</th>
// // // //             <th style={styles.tableCell}>Curriculum Name</th>
// // // //             <th style={styles.tableCell}>Content</th>
// // // //             <th style={styles.tableCell}>Actions</th>
// // // //           </tr>
// // // //         </thead>
// // // //         <tbody>
// // // //           {paginatedCurriculums.length > 0 ? (
// // // //             paginatedCurriculums.map((curriculum, index) => (
// // // //               <tr key={curriculum.id} style={styles.tableRow}>
// // // //                 <td style={styles.tableCell}>{index + 1}</td>
// // // //                 <td style={styles.tableCell}>{curriculum.name}</td>
// // // //                 <td style={styles.tableCell}>
// // // //                   <span style={styles.sections}>
// // // //                     ≡ {curriculum.sections} Sections
// // // //                   </span>
// // // //                 </td>
// // // //                 <td style={styles.tableCell}>
// // // //                   <button style={styles.actionButton}>⋮</button>
// // // //                 </td>
// // // //               </tr>
// // // //             ))
// // // //           ) : (
// // // //             <tr>
// // // //               <td colSpan="4" style={styles.noData}>
// // // //                 No curriculums found.
// // // //               </td>
// // // //             </tr>
// // // //           )}
// // // //         </tbody>
// // // //       </table>

// // // //       {/* Pagination */}
// // // //       <div style={styles.pagination}>
// // // //         <button
// // // //           onClick={() => handlePageChange(currentPage - 1)}
// // // //           disabled={currentPage === 1}
// // // //           style={styles.pageButton}
// // // //         >
// // // //           &lt;
// // // //         </button>
// // // //         <span style={styles.pageNumber}>{currentPage}</span>
// // // //         <button
// // // //           onClick={() => handlePageChange(currentPage + 1)}
// // // //           disabled={currentPage === totalPages}
// // // //           style={styles.pageButton}
// // // //         >
// // // //           &gt;
// // // //         </button>
// // // //         <select style={styles.itemsPerPage}>
// // // //           <option>50/page</option>
// // // //           <option>25/page</option>
// // // //           <option>10/page</option>
// // // //         </select>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // // Inline styles
// // // // const styles = {
// // // //   container: {
// // // //     padding: '20px',
// // // //     fontFamily: 'Arial, sans-serif',
// // // //   },
// // // //   header: {
// // // //     fontSize: '24px',
// // // //     fontWeight: 'bold',
// // // //     marginBottom: '5px',
// // // //   },
// // // //   subHeader: {
// // // //     fontSize: '14px',
// // // //     color: '#666',
// // // //     marginBottom: '20px',
// // // //   },
// // // //   filters: {
// // // //     display: 'flex',
// // // //     justifyContent: 'space-between',
// // // //     marginBottom: '20px',
// // // //   },
// // // //   filterItem: {
// // // //     display: 'flex',
// // // //     alignItems: 'center',
// // // //   },
// // // //   select: {
// // // //     padding: '5px',
// // // //     borderRadius: '5px',
// // // //     border: '1px solid #ddd',
// // // //     marginRight: '10px',
// // // //   },
// // // //   badge: {
// // // //     backgroundColor: '#f0f0f0',
// // // //     padding: '2px 8px',
// // // //     borderRadius: '10px',
// // // //     fontSize: '12px',
// // // //   },
// // // //   searchAndAdd: {
// // // //     display: 'flex',
// // // //     alignItems: 'center',
// // // //   },
// // // //   searchInput: {
// // // //     padding: '5px',
// // // //     borderRadius: '5px',
// // // //     border: '1px solid #ddd',
// // // //     marginRight: '10px',
// // // //   },
// // // //   addButton: {
// // // //     padding: '5px 15px',
// // // //     backgroundColor: '#007bff',
// // // //     color: '#fff',
// // // //     border: 'none',
// // // //     borderRadius: '5px',
// // // //     cursor: 'pointer',
// // // //   },
// // // //   table: {
// // // //     width: '100%',
// // // //     borderCollapse: 'collapse',
// // // //     backgroundColor: '#f9f9f9',
// // // //   },
// // // //   tableHeader: {
// // // //     backgroundColor: '#f0f0f0',
// // // //     textAlign: 'left',
// // // //   },
// // // //   tableCell: {
// // // //     padding: '10px',
// // // //     borderBottom: '1px solid #ddd',
// // // //   },
// // // //   tableRow: {
// // // //     backgroundColor: '#fff',
// // // //   },
// // // //   sections: {
// // // //     display: 'inline-flex',
// // // //     alignItems: 'center',
// // // //   },
// // // //   actionButton: {
// // // //     background: 'none',
// // // //     border: 'none',
// // // //     cursor: 'pointer',
// // // //     fontSize: '16px',
// // // //   },
// // // //   noData: {
// // // //     textAlign: 'center',
// // // //     padding: '20px',
// // // //     color: '#666',
// // // //   },
// // // //   pagination: {
// // // //     display: 'flex',
// // // //     justifyContent: 'flex-end',
// // // //     alignItems: 'center',
// // // //     marginTop: '20px',
// // // //   },
// // // //   pageButton: {
// // // //     padding: '5px 10px',
// // // //     border: '1px solid #ddd',
// // // //     backgroundColor: '#fff',
// // // //     cursor: 'pointer',
// // // //     margin: '0 5px',
// // // //   },
// // // //   pageNumber: {
// // // //     padding: '5px 10px',
// // // //     border: '1px solid #007bff',
// // // //     backgroundColor: '#007bff',
// // // //     color: '#fff',
// // // //     borderRadius: '5px',
// // // //   },
// // // //   itemsPerPage: {
// // // //     padding: '5px',
// // // //     borderRadius: '5px',
// // // //     border: '1px solid #ddd',
// // // //     marginLeft: '10px',
// // // //   },
// // // // };

// // // // export default CurriculumTable;


// // // // src/CurriculumTable.js

// // // import React, { useState } from 'react';
// // // import CreateCurriculum from './CreateCurriculum'; // Import the modal component

// // // const CurriculumTable = () => {
// // //   // State for curriculums
// // //   const [curriculums, setCurriculums] = useState([
// // //     { id: 1, name: 'Samiksha Raut', sections: 1 },
// // //   ]);

// // //   // State for pagination
// // //   const [currentPage, setCurrentPage] = useState(1);
// // //   const itemsPerPage = 50;

// // //   // State for search
// // //   const [searchTerm, setSearchTerm] = useState('');

// // //   // State for modal visibility
// // //   const [isModalOpen, setIsModalOpen] = useState(false);

// // //   // Handle search input change
// // //   const handleSearchChange = (e) => {
// // //     setSearchTerm(e.target.value);
// // //   };

// // //   // Filter curriculums based on search term
// // //   const filteredCurriculums = curriculums.filter((curriculum) =>
// // //     curriculum.name.toLowerCase().includes(searchTerm.toLowerCase())
// // //   );

// // //   // Handle pagination
// // //   const totalPages = Math.ceil(filteredCurriculums.length / itemsPerPage);
// // //   const paginatedCurriculums = filteredCurriculums.slice(
// // //     (currentPage - 1) * itemsPerPage,
// // //     currentPage * itemsPerPage
// // //   );

// // //   const handlePageChange = (page) => {
// // //     setCurrentPage(page);
// // //   };

// // //   // Open the modal
// // //   const handleAddCurriculum = () => {
// // //     setIsModalOpen(true);
// // //   };

// // //   // Close the modal
// // //   const handleCloseModal = () => {
// // //     setIsModalOpen(false);
// // //   };

// // //   // Handle form submission from the modal
// // //   const handleAddCurriculumSubmit = (formData) => {
// // //     const newCurriculum = {
// // //       id: curriculums.length + 1, // Simple ID generation (replace with a better method in production)
// // //       name: formData.name,
// // //       sections: 0, // Default value for sections
// // //       branch: formData.branch,
// // //       maxViewDuration: formData.maxViewDuration,
// // //     };
// // //     setCurriculums((prev) => [...prev, newCurriculum]);
// // //   };

// // //   return (
// // //     <div style={styles.container}>
// // //       {/* Header */}
// // //       <h2 style={styles.header}>Curriculum</h2>
// // //       <p style={styles.subHeader}>Manage all your course curriculum in one place.</p>

// // //       {/* Filters and Actions */}
// // //       <div style={styles.filters}>
// // //         <div style={styles.filterItem}>
// // //           <select style={styles.select}>
// // //             <option>All Curriculum</option>
// // //           </select>
// // //           <span style={styles.badge}>{curriculums.length.toString().padStart(2, '0')}</span>
// // //         </div>
// // //         <div style={styles.searchAndAdd}>
// // //           <input
// // //             type="text"
// // //             placeholder="Search"
// // //             value={searchTerm}
// // //             onChange={handleSearchChange}
// // //             style={styles.searchInput}
// // //           />
// // //           <button onClick={handleAddCurriculum} style={styles.addButton}>
// // //             + Add Curriculum
// // //           </button>
// // //         </div>
// // //       </div>

// // //       {/* Table */}
// // //       <table style={styles.table}>
// // //         <thead>
// // //           <tr style={styles.tableHeader}>
// // //             <th style={styles.tableCell}>Sr.</th>
// // //             <th style={styles.tableCell}>Curriculum Name</th>
// // //             <th style={styles.tableCell}>Content</th>
// // //             <th style={styles.tableCell}>Actions</th>
// // //           </tr>
// // //         </thead>
// // //         <tbody>
// // //           {paginatedCurriculums.length > 0 ? (
// // //             paginatedCurriculums.map((curriculum, index) => (
// // //               <tr key={curriculum.id} style={styles.tableRow}>
// // //                 <td style={styles.tableCell}>{index + 1}</td>
// // //                 <td style={styles.tableCell}>{curriculum.name}</td>
// // //                 <td style={styles.tableCell}>
// // //                   <span style={styles.sections}>
// // //                     ≡ {curriculum.sections} Sections
// // //                   </span>
// // //                 </td>
// // //                 <td style={styles.tableCell}>
// // //                   <button style={styles.actionButton}>⋮</button>
// // //                 </td>
// // //               </tr>
// // //             ))
// // //           ) : (
// // //             <tr>
// // //               <td colSpan="4" style={styles.noData}>
// // //                 No curriculums found.
// // //               </td>
// // //             </tr>
// // //           )}
// // //         </tbody>
// // //       </table>

// // //       {/* Pagination */}
// // //       <div style={styles.pagination}>
// // //         <button
// // //           onClick={() => handlePageChange(currentPage - 1)}
// // //           disabled={currentPage === 1}
// // //           style={styles.pageButton}
// // //         >
// // //           &lt;
// // //         </button>
// // //         <span style={styles.pageNumber}>{currentPage}</span>
// // //         <button
// // //           onClick={() => handlePageChange(currentPage + 1)}
// // //           disabled={currentPage === totalPages}
// // //           style={styles.pageButton}
// // //         >
// // //           &gt;
// // //         </button>
// // //         <select style={styles.itemsPerPage}>
// // //           <option>50/page</option>
// // //           <option>25/page</option>
// // //           <option>10/page</option>
// // //         </select>
// // //       </div>

// // //       {/* Add Curriculum Modal */}
// // //       <CreateCurriculum
// // //         isOpen={isModalOpen}
// // //         onClose={handleCloseModal}
// // //         onSubmit={handleAddCurriculumSubmit}
// // //       />
// // //     </div>
// // //   );
// // // };

// // // // Inline styles (same as before)
// // // const styles = {
// // //   container: {
// // //     padding: '20px',
// // //     fontFamily: 'Arial, sans-serif',
// // //   },
// // //   header: {
// // //     fontSize: '24px',
// // //     fontWeight: 'bold',
// // //     marginBottom: '5px',
// // //   },
// // //   subHeader: {
// // //     fontSize: '14px',
// // //     color: '#666',
// // //     marginBottom: '20px',
// // //   },
// // //   filters: {
// // //     display: 'flex',
// // //     justifyContent: 'space-between',
// // //     marginBottom: '20px',
// // //   },
// // //   filterItem: {
// // //     display: 'flex',
// // //     alignItems: 'center',
// // //   },
// // //   select: {
// // //     padding: '5px',
// // //     borderRadius: '5px',
// // //     border: '1px solid #ddd',
// // //     marginRight: '10px',
// // //   },
// // //   badge: {
// // //     backgroundColor: '#f0f0f0',
// // //     padding: '2px 8px',
// // //     borderRadius: '10px',
// // //     fontSize: '12px',
// // //   },
// // //   searchAndAdd: {
// // //     display: 'flex',
// // //     alignItems: 'center',
// // //   },
// // //   searchInput: {
// // //     padding: '5px',
// // //     borderRadius: '5px',
// // //     border: '1px solid #ddd',
// // //     marginRight: '10px',
// // //   },
// // //   addButton: {
// // //     padding: '5px 15px',
// // //     backgroundColor: '#007bff',
// // //     color: '#fff',
// // //     border: 'none',
// // //     borderRadius: '5px',
// // //     cursor: 'pointer',
// // //   },
// // //   table: {
// // //     width: '100%',
// // //     borderCollapse: 'collapse',
// // //     backgroundColor: '#f9f9f9',
// // //   },
// // //   tableHeader: {
// // //     backgroundColor: '#f0f0f0',
// // //     textAlign: 'left',
// // //   },
// // //   tableCell: {
// // //     padding: '10px',
// // //     borderBottom: '1px solid #ddd',
// // //   },
// // //   tableRow: {
// // //     backgroundColor: '#fff',
// // //   },
// // //   sections: {
// // //     display: 'inline-flex',
// // //     alignItems: 'center',
// // //   },
// // //   actionButton: {
// // //     background: 'none',
// // //     border: 'none',
// // //     cursor: 'pointer',
// // //     fontSize: '16px',
// // //   },
// // //   noData: {
// // //     textAlign: 'center',
// // //     padding: '20px',
// // //     color: '#666',
// // //   },
// // //   pagination: {
// // //     display: 'flex',
// // //     justifyContent: 'flex-end',
// // //     alignItems: 'center',
// // //     marginTop: '20px',
// // //   },
// // //   pageButton: {
// // //     padding: '5px 10px',
// // //     border: '1px solid #ddd',
// // //     backgroundColor: '#fff',
// // //     cursor: 'pointer',
// // //     margin: '0 5px',
// // //   },
// // //   pageNumber: {
// // //     padding: '5px 10px',
// // //     border: '1px solid #007bff',
// // //     backgroundColor: '#007bff',
// // //     color: '#fff',
// // //     borderRadius: '5px',
// // //   },
// // //   itemsPerPage: {
// // //     padding: '5px',
// // //     borderRadius: '5px',
// // //     border: '1px solid #ddd',
// // //     marginLeft: '10px',
// // //   },
// // // };

// // // export default CurriculumTable;


// // // src/CurriculumTable.js (example parent component)
// // import React, { useState, useEffect } from 'react';
// // import CreateCurriculum from './CreateCurriculum';
// // import { db } from '../../../../config/firebase';
// // import { collection, onSnapshot } from 'firebase/firestore';

// // const Curriculum = () => {
// //   // State for curriculums
// //   const [curriculums, setCurriculums] = useState([]);

// //   // State for pagination
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const itemsPerPage = 50;

// //   // State for search
// //   const [searchTerm, setSearchTerm] = useState('');

// //   // State for modal visibility
// //   const [isModalOpen, setIsModalOpen] = useState(false);

// //   // Fetch curriculums from Firestore on component mount
// //   useEffect(() => {
// //     const unsubscribe = onSnapshot(collection(db, 'curriculums'), (snapshot) => {
// //       const curriculumData = snapshot.docs.map((doc) => ({
// //         id: doc.id,
// //         ...doc.data(),
// //       }));
// //       setCurriculums(curriculumData);
// //     });
// //     return () => unsubscribe();
// //   }, []);

// //   // Handle search input change
// //   const handleSearchChange = (e) => {
// //     setSearchTerm(e.target.value);
// //   };

// //   // Filter curriculums based on search term
// //   const filteredCurriculums = curriculums.filter((curriculum) =>
// //     curriculum.name.toLowerCase().includes(searchTerm.toLowerCase())
// //   );

// //   // Handle pagination
// //   const totalPages = Math.ceil(filteredCurriculums.length / itemsPerPage);
// //   const paginatedCurriculums = filteredCurriculums.slice(
// //     (currentPage - 1) * itemsPerPage,
// //     currentPage * itemsPerPage
// //   );

// //   const handlePageChange = (page) => {
// //     setCurrentPage(page);
// //   };

// //   // Open the modal
// //   const handleAddCurriculum = () => {
// //     setIsModalOpen(true);
// //   };

// //   // Close the modal
// //   const handleCloseModal = () => {
// //     setIsModalOpen(false);
// //   };

// //   // Handle form submission from the modal
// //   const handleAddCurriculumSubmit = (formData) => {
// //     // The data is already saved to Firestore in CreateCurriculum
// //     // We just need to close the modal here
// //     // The Firestore listener (onSnapshot) will automatically update the curriculums state
// //     handleCloseModal();
// //   };

// //   return (
// //     <div style={styles.container}>
// //       {/* Header */}
// //       <h2 style={styles.header}>Curriculum</h2>
// //       <p style={styles.subHeader}>Manage all your course curriculum in one place.</p>

// //       {/* Filters and Actions */}
// //       <div style={styles.filters}>
// //         <div style={styles.filterItem}>
// //           <select style={styles.select}>
// //             <option>All Curriculum</option>
// //           </select>
// //           <span style={styles.badge}>{curriculums.length.toString().padStart(2, '0')}</span>
// //         </div>
// //         <div style={styles.searchAndAdd}>
// //           <input
// //             type="text"
// //             placeholder="Search"
// //             value={searchTerm}
// //             onChange={handleSearchChange}
// //             style={styles.searchInput}
// //           />
// //           <button onClick={handleAddCurriculum} style={styles.addButton}>
// //             + Add Curriculum
// //           </button>
// //         </div>
// //       </div>

// //       {/* Table */}
// //       <table style={styles.table}>
// //         <thead>
// //           <tr style={styles.tableHeader}>
// //             <th style={styles.tableCell}>Sr.</th>
// //             <th style={styles.tableCell}>Curriculum Name</th>
// //             <th style={styles.tableCell}>Content</th>
// //             <th style={styles.tableCell}>Actions</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {paginatedCurriculums.length > 0 ? (
// //             paginatedCurriculums.map((curriculum, index) => (
// //               <tr key={curriculum.id} style={styles.tableRow}>
// //                 <td style={styles.tableCell}>{index + 1}</td>
// //                 <td style={styles.tableCell}>{curriculum.name}</td>
// //                 <td style={styles.tableCell}>
// //                   <span style={styles.sections}>
// //                     ≡ {curriculum.sections} Sections
// //                   </span>
// //                 </td>
// //                 <td style={styles.tableCell}>
// //                   <button style={styles.actionButton}>⋮</button>
// //                 </td>
// //               </tr>
// //             ))
// //           ) : (
// //             <tr>
// //               <td colSpan="4" style={styles.noData}>
// //                 No curriculums found.
// //               </td>
// //             </tr>
// //           )}
// //         </tbody>
// //       </table>

// //       {/* Pagination */}
// //       <div style={styles.pagination}>
// //         <button
// //           onClick={() => handlePageChange(currentPage - 1)}
// //           disabled={currentPage === 1}
// //           style={styles.pageButton}
// //         >
// //           &lt;
// //         </button>
// //         <span style={styles.pageNumber}>{currentPage}</span>
// //         <button
// //           onClick={() => handlePageChange(currentPage + 1)}
// //           disabled={currentPage === totalPages}
// //           style={styles.pageButton}
// //         >
// //           &gt;
// //         </button>
// //         <select style={styles.itemsPerPage}>
// //           <option>50/page</option>
// //           <option>25/page</option>
// //           <option>10/page</option>
// //         </select>
// //       </div>

// //       {/* Create Curriculum Modal */}
// //       <CreateCurriculum
// //         isOpen={isModalOpen}
// //         onClose={handleCloseModal}
// //         onSubmit={handleAddCurriculumSubmit}
// //       />
// //     </div>
// //   );
// // };

// // // Inline styles (same as before)
// // const styles = {
// //   container: {
// //     padding: '20px',
// //     fontFamily: 'Arial, sans-serif',
// //   },
// //   header: {
// //     fontSize: '24px',
// //     fontWeight: 'bold',
// //     marginBottom: '5px',
// //   },
// //   subHeader: {
// //     fontSize: '14px',
// //     color: '#666',
// //     marginBottom: '20px',
// //   },
// //   filters: {
// //     display: 'flex',
// //     justifyContent: 'space-between',
// //     marginBottom: '20px',
// //   },
// //   filterItem: {
// //     display: 'flex',
// //     alignItems: 'center',
// //   },
// //   select: {
// //     padding: '5px',
// //     borderRadius: '5px',
// //     border: '1px solid #ddd',
// //     marginRight: '10px',
// //   },
// //   badge: {
// //     backgroundColor: '#f0f0f0',
// //     padding: '2px 8px',
// //     borderRadius: '10px',
// //     fontSize: '12px',
// //   },
// //   searchAndAdd: {
// //     display: 'flex',
// //     alignItems: 'center',
// //   },
// //   searchInput: {
// //     padding: '5px',
// //     borderRadius: '5px',
// //     border: '1px solid #ddd',
// //     marginRight: '10px',
// //   },
// //   addButton: {
// //     padding: '5px 15px',
// //     backgroundColor: '#007bff',
// //     color: '#fff',
// //     border: 'none',
// //     borderRadius: '5px',
// //     cursor: 'pointer',
// //   },
// //   table: {
// //     width: '100%',
// //     borderCollapse: 'collapse',
// //     backgroundColor: '#f9f9f9',
// //   },
// //   tableHeader: {
// //     backgroundColor: '#f0f0f0',
// //     textAlign: 'left',
// //   },
// //   tableCell: {
// //     padding: '10px',
// //     borderBottom: '1px solid #ddd',
// //   },
// //   tableRow: {
// //     backgroundColor: '#fff',
// //   },
// //   sections: {
// //     display: 'inline-flex',
// //     alignItems: 'center',
// //   },
// //   actionButton: {
// //     background: 'none',
// //     border: 'none',
// //     cursor: 'pointer',
// //     fontSize: '16px',
// //   },
// //   noData: {
// //     textAlign: 'center',
// //     padding: '20px',
// //     color: '#666',
// //   },
// //   pagination: {
// //     display: 'flex',
// //     justifyContent: 'flex-end',
// //     alignItems: 'center',
// //     marginTop: '20px',
// //   },
// //   pageButton: {
// //     padding: '5px 10px',
// //     border: '1px solid #ddd',
// //     backgroundColor: '#fff',
// //     cursor: 'pointer',
// //     margin: '0 5px',
// //   },
// //   pageNumber: {
// //     padding: '5px 10px',
// //     border: '1px solid #007bff',
// //     backgroundColor: '#007bff',
// //     color: '#fff',
// //     borderRadius: '5px',
// //   },
// //   itemsPerPage: {
// //     padding: '5px',
// //     borderRadius: '5px',
// //     border: '1px solid #ddd',
// //     marginLeft: '10px',
// //   },
// // };

// // export default Curriculum;


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const Curriculum = () => {
//   // State for curriculums
//   const [curriculums, setCurriculums] = useState([
//     { id: 1, name: 'Samiksha Raut', sections: 1 },
//   ]);

//   // State for pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 50;

//   // State for search
//   const [searchTerm, setSearchTerm] = useState('');

//   const navigate = useNavigate();

//   // Handle search input change
//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   // Filter curriculums based on search term
//   const filteredCurriculums = curriculums.filter((curriculum) =>
//     curriculum.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Handle pagination
//   const totalPages = Math.ceil(filteredCurriculums.length / itemsPerPage);
//   const paginatedCurriculums = filteredCurriculums.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   // Handle row click to navigate to the edit page
//   const handleRowClick = (id) => {
//     navigate(`/edit-curriculum/${id}`);
//   };

//   // Handle adding a new curriculum (placeholder function)
//   const handleAddCurriculum = () => {
//     alert('Add Curriculum functionality to be implemented!');
//   };

//   return (
//     <div style={styles.container}>
//       {/* Header */}
//       <h2 style={styles.header}>Curriculum</h2>
//       <p style={styles.subHeader}>Manage all your course curriculum in one place.</p>

//       {/* Filters and Actions */}
//       <div style={styles.filters}>
//         <div style={styles.filterItem}>
//           <select style={styles.select}>
//             <option>All Curriculum</option>
//           </select>
//           <span style={styles.badge}>{curriculums.length.toString().padStart(2, '0')}</span>
//         </div>
//         <div style={styles.searchAndAdd}>
//           <input
//             type="text"
//             placeholder="Search"
//             value={searchTerm}
//             onChange={handleSearchChange}
//             style={styles.searchInput}
//           />
//           <button onClick={handleAddCurriculum} style={styles.addButton}>
//             + Add Curriculum
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <table style={styles.table}>
//         <thead>
//           <tr style={styles.tableHeader}>
//             <th style={styles.tableCell}>Sr.</th>
//             <th style={styles.tableCell}>Curriculum Name</th>
//             <th style={styles.tableCell}>Content</th>
//             <th style={styles.tableCell}>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {paginatedCurriculums.length > 0 ? (
//             paginatedCurriculums.map((curriculum, index) => (
//               <tr
//                 key={curriculum.id}
//                 style={styles.tableRow}
//                 onClick={() => handleRowClick(curriculum.id)}
//               >
//                 <td style={styles.tableCell}>{index + 1}</td>
//                 <td style={styles.tableCell}>{curriculum.name}</td>
//                 <td style={styles.tableCell}>
//                   <span style={styles.sections}>
//                     ≡ {curriculum.sections} Sections
//                   </span>
//                 </td>
//                 <td style={styles.tableCell}>
//                   <button style={styles.actionButton}>⋮</button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="4" style={styles.noData}>
//                 No curriculums found.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {/* Pagination */}
//       <div style={styles.pagination}>
//         <button
//           onClick={() => handlePageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           style={styles.pageButton}
//         >
          
//         </button>
//         <span style={styles.pageNumber}>{currentPage}</span>
//         <button
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           style={styles.pageButton}
//         >
          
//         </button>
//         <select style={styles.itemsPerPage}>
//           <option>50/page</option>
//           <option>25/page</option>
//           <option>10/page</option>
//         </select>
//       </div>
//     </div>
//   );
// };

// // Inline styles (same as before)
// const styles = {
//   container: {
//     padding: '20px',
//     fontFamily: 'Arial, sans-serif',
//   },
//   header: {
//     fontSize: '24px',
//     fontWeight: 'bold',
//     marginBottom: '5px',
//   },
//   subHeader: {
//     fontSize: '14px',
//     color: '#666',
//     marginBottom: '20px',
//   },
//   filters: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     marginBottom: '20px',
//   },
//   filterItem: {
//     display: 'flex',
//     alignItems: 'center',
//   },
//   select: {
//     padding: '5px',
//     borderRadius: '5px',
//     border: '1px solid #ddd',
//     marginRight: '10px',
//   },
//   badge: {
//     backgroundColor: '#f0f0f0',
//     padding: '2px 8px',
//     borderRadius: '10px',
//     fontSize: '12px',
//   },
//   searchAndAdd: {
//     display: 'flex',
//     alignItems: 'center',
//   },
//   searchInput: {
//     padding: '5px',
//     borderRadius: '5px',
//     border: '1px solid #ddd',
//     marginRight: '10px',
//   },
//   addButton: {
//     padding: '5px 15px',
//     backgroundColor: '#007bff',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '5px',
//     cursor: 'pointer',
//   },
//   table: {
//     width: '100%',
//     borderCollapse: 'collapse',
//     backgroundColor: '#f9f9f9',
//   },
//   tableHeader: {
//     backgroundColor: '#f0f0f0',
//     textAlign: 'left',
//   },
//   tableCell: {
//     padding: '10px',
//     borderBottom: '1px solid #ddd',
//   },
//   tableRow: {
//     backgroundColor: '#fff',
//     cursor: 'pointer', // Add cursor pointer to indicate the row is clickable
//   },
//   sections: {
//     display: 'inline-flex',
//     alignItems: 'center',
//   },
//   actionButton: {
//     background: 'none',
//     border: 'none',
//     cursor: 'pointer',
//     fontSize: '16px',
//   },
//   noData: {
//     textAlign: 'center',
//     padding: '20px',
//     color: '#666',
//   },
//   pagination: {
//     display: 'flex',
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     marginTop: '20px',
//   },
//   pageButton: {
//     padding: '5px 10px',
//     border: '1px solid #ddd',
//     backgroundColor: '#fff',
//     cursor: 'pointer',
//     margin: '0 5px',
//   },
//   pageNumber: {
//     padding: '5px 10px',
//     border: '1px solid #007bff',
//     backgroundColor: '#007bff',
//     color: '#fff',
//     borderRadius: '5px',
//   },
//   itemsPerPage: {
//     padding: '5px',
//     borderRadius: '5px',
//     border: '1px solid #ddd',
//     marginLeft: '10px',
//   },
// };

// export default Curriculum;


// src/Curriculum.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateCurriculum from './CreateCurriculum'; // Import the CreateCurriculum modal
import { db } from '../../../../config/firebase'; // Import Firestore
import { collection, onSnapshot } from 'firebase/firestore'; // Firestore methods

const Curriculum = () => {
  // State for curriculums
  const [curriculums, setCurriculums] = useState([]);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // State for search
  const [searchTerm, setSearchTerm] = useState('');

  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  // Fetch curriculums from Firestore on component mount
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'curriculums'), (snapshot) => {
      const curriculumData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCurriculums(curriculumData);
    });
    return () => unsubscribe();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter curriculums based on search term
  const filteredCurriculums = curriculums.filter((curriculum) =>
    curriculum.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle pagination
  const totalPages = Math.ceil(filteredCurriculums.length / itemsPerPage);
  const paginatedCurriculums = filteredCurriculums.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle row click to navigate to the edit page
  const handleRowClick = (id) => {
    navigate(`/edit-curriculum/${id}`);
  };

  // Open the modal
  const handleAddCurriculum = () => {
    setIsModalOpen(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handle form submission from the modal
  const handleAddCurriculumSubmit = (formData) => {
    // The data is already saved to Firestore in CreateCurriculum
    // We just need to close the modal here
    // The Firestore listener (onSnapshot) will automatically update the curriculums state
    handleCloseModal();
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <h2 style={styles.header}>Curriculum</h2>
      <p style={styles.subHeader}>Manage all your course curriculum in one place.</p>

      {/* Filters and Actions */}
      <div style={styles.filters}>
        <div style={styles.filterItem}>
          <select style={styles.select}>
            <option>All Curriculum</option>
          </select>
          <span style={styles.badge}>{curriculums.length.toString().padStart(2, '0')}</span>
        </div>
        <div style={styles.searchAndAdd}>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            style={styles.searchInput}
          />
          <button onClick={handleAddCurriculum} style={styles.addButton}>
            + Add Curriculum
          </button>
        </div>
      </div>

      {/* Table */}
      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeader}>
            <th style={styles.tableCell}>Sr.</th>
            <th style={styles.tableCell}>Curriculum Name</th>
            <th style={styles.tableCell}>Content</th>
            <th style={styles.tableCell}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCurriculums.length > 0 ? (
            paginatedCurriculums.map((curriculum, index) => (
              <tr
                key={curriculum.id}
                style={styles.tableRow}
                onClick={() => handleRowClick(curriculum.id)}
              >
                <td style={styles.tableCell}>{index + 1}</td>
                <td style={styles.tableCell}>{curriculum.name}</td>
                <td style={styles.tableCell}>
                  <span style={styles.sections}>
                    ≡ {curriculum.sections} Sections
                  </span>
                </td>
                <td style={styles.tableCell}>
                  <button style={styles.actionButton}>⋮</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={styles.noData}>
                No curriculums found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={styles.pagination}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={styles.pageButton}
        >
          &lt;
        </button>
        <span style={styles.pageNumber}>{currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={styles.pageButton}
        >
          &gt;
        </button>
        <select style={styles.itemsPerPage}>
          <option>50/page</option>
          <option>25/page</option>
          <option>10/page</option>
        </select>
      </div>

      {/* Create Curriculum Modal */}
      <CreateCurriculum
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddCurriculumSubmit}
      />
    </div>
  );
};

// Inline styles (same as before)
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  subHeader: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '20px',
  },
  filters: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  filterItem: {
    display: 'flex',
    alignItems: 'center',
  },
  select: {
    padding: '5px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    marginRight: '10px',
  },
  badge: {
    backgroundColor: '#f0f0f0',
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '12px',
  },
  searchAndAdd: {
    display: 'flex',
    alignItems: 'center',
  },
  searchInput: {
    padding: '5px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    marginRight: '10px',
  },
  addButton: {
    padding: '5px 15px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#f9f9f9',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    textAlign: 'left',
  },
  tableCell: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
  },
  tableRow: {
    backgroundColor: '#fff',
    cursor: 'pointer', // Add cursor pointer to indicate the row is clickable
  },
  sections: {
    display: 'inline-flex',
    alignItems: 'center',
  },
  actionButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
  },
  noData: {
    textAlign: 'center',
    padding: '20px',
    color: '#666',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: '20px',
  },
  pageButton: {
    padding: '5px 10px',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
    cursor: 'pointer',
    margin: '0 5px',
  },
  pageNumber: {
    padding: '5px 10px',
    border: '1px solid #007bff',
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: '5px',
  },
  itemsPerPage: {
    padding: '5px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    marginLeft: '10px',
  },
};

export default Curriculum;