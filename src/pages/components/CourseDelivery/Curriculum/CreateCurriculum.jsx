// // // // // import React, { useState } from "react";
// // // // // import { useNavigate } from "react-router-dom";


// // // // // const CreateCurriculum = ({ isOpen, onClose, onSubmit }) => {
// // // // //   const navigate = useNavigate();

// // // // //   const [name, setName] = useState("");
// // // // //   const [viewDuration, setViewDuration] = useState("Unlimited");
// // // // //   const [totalDuration, setTotalDuration] = useState(0);
// // // // //   const [multiplier, setMultiplier] = useState(0);

// // // // //     const handleSubmit = () => {
// // // // //         if (!name.trim()) return alert("Curriculum name is required!");
// // // // //         // if (!courseId) return alert("Course ID is required!");
// // // // //         const totalWatchTime = totalDuration * multiplier;
// // // // //         onSubmit({ 
// // // // //             name, 
// // // // //             viewDuration, 
// // // // //             totalWatchTime,
             
// // // // //         });
// // // // //         onClose();
// // // // //         navigate(`/curriculum`);

// // // // //     };


// // // // //     if (!isOpen) {
// // // // //       console.log("Modal is closed.");
// // // // //       return null;
// // // // //     }
    
// // // // //     console.log("Modal is open.");
    

// // // // //   // if (!isOpen) return null;

// // // // //   return (
// // // // //     <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
// // // // //       <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
// // // // //         <h3 className="text-xl font-bold mb-4">Add Curriculum</h3>
// // // // //         <label className="block mb-2 font-medium">Name *</label>
// // // // //         <input
// // // // //           type="text"
// // // // //           value={name}
// // // // //           onChange={(e) => setName(e.target.value)}
// // // // //           className="w-full px-3 py-2 border rounded mb-4"
// // // // //           maxLength="50"
// // // // //           placeholder="Enter curriculum name"
// // // // //         />
// // // // //         <label className="block mb-2 font-medium">Maximum View Duration</label>
// // // // //         <div className="mb-4">
// // // // //           <label className="inline-flex items-center">
// // // // //             <input
// // // // //               type="radio"
// // // // //               value="Unlimited"
// // // // //               checked={viewDuration === "Unlimited"}
// // // // //               onChange={(e) => setViewDuration(e.target.value)}
// // // // //               className="mr-2"
// // // // //             />
// // // // //             Unlimited
// // // // //           </label>
// // // // //           <label className="inline-flex items-center ml-4">
// // // // //             <input
// // // // //               type="radio"
// // // // //               value="Restricted"
// // // // //               checked={viewDuration === "Restricted"}
// // // // //               onChange={(e) => setViewDuration(e.target.value)}
// // // // //               className="mr-2"
// // // // //             />
// // // // //             Restricted
// // // // //           </label>
// // // // //         </div>
// // // // //         {viewDuration === "Restricted" && (
// // // // //           <div className="mb-4">
// // // // //             <div className="flex items-center space-x-4">
// // // // //               <div>
// // // // //                 <label className="block mb-1">Total Duration (seconds)</label>
// // // // //                 <input
// // // // //                   type="number"
// // // // //                   value={totalDuration}
// // // // //                   onChange={(e) => setTotalDuration(Number(e.target.value))}
// // // // //                   className="px-2 py-1 border rounded w-full"
// // // // //                   min="0"
// // // // //                 />
// // // // //               </div>
// // // // //               <span className="text-lg">×</span>
// // // // //               <div>
// // // // //                 <label className="block mb-1">Multiplier</label>
// // // // //                 <input
// // // // //                   type="number"
// // // // //                   value={multiplier}
// // // // //                   onChange={(e) => setMultiplier(Number(e.target.value))}
// // // // //                   className="px-2 py-1 border rounded w-full"
// // // // //                   min="0"
// // // // //                 />
// // // // //               </div>
// // // // //               <span className="text-lg">=</span>
// // // // //               <div>
// // // // //                 <label className="block mb-1">Total Watch Time (seconds)</label>
// // // // //                 <input
// // // // //                   type="text"
// // // // //                   value={`${totalDuration * multiplier} s`}
// // // // //                   readOnly
// // // // //                   className="px-2 py-1 border bg-gray-100 rounded w-full"
// // // // //                 />
// // // // //               </div>
// // // // //             </div>
// // // // //             <p className="text-sm text-gray-500 mt-2">
// // // // //               <strong>What is watch-time?</strong> Watch Time is the maximum duration a student can spend viewing course
// // // // //               content. Once the limit is reached, access is restricted.
// // // // //             </p>
// // // // //           </div>
// // // // //         )}
// // // // //         <div className="flex justify-end space-x-4">

// // // // //           <button
// // // // //             onClick={handleSubmit}
// // // // //             className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
// // // // //           >
// // // // //             Add Curriculum
// // // // //           </button>
// // // // //         </div>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default CreateCurriculum;


// // // // import React, { useState } from "react";

// // // // const CreateCurriculum = ({ isOpen, onClose, onSubmit }) => {
// // // //     const [name, setName] = useState("");
// // // //     const [viewDuration, setViewDuration] = useState("Unlimited");
// // // //     const [totalDuration, setTotalDuration] = useState(0);
// // // //     const [multiplier, setMultiplier] = useState(0);

// // // //     if (!isOpen) return null;

// // // //     const handleSubmit = () => {
// // // //         if (!name.trim()) return alert("Curriculum name is required!");

// // // //         const totalWatchTime = totalDuration * multiplier;
// // // //         onSubmit({ name, viewDuration, totalWatchTime });
// // // //         onClose();
// // // //     };

// // // //     return (
// // // //         <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
// // // //             <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
// // // //                 <h3 className="text-xl font-bold mb-4">Add Curriculum</h3>
                
// // // //                 <label className="block mb-2 font-medium">Name *</label>
// // // //                 <input
// // // //                     type="text"
// // // //                     value={name}
// // // //                     onChange={(e) => setName(e.target.value)}
// // // //                     className="w-full px-3 py-2 border rounded mb-4"
// // // //                     placeholder="Enter curriculum name"
// // // //                 />

// // // //                 <label className="block mb-2 font-medium">Maximum View Duration</label>
// // // //                 <div className="mb-4">
// // // //                     <label className="inline-flex items-center">
// // // //                         <input
// // // //                             type="radio"
// // // //                             value="Unlimited"
// // // //                             checked={viewDuration === "Unlimited"}
// // // //                             onChange={(e) => setViewDuration(e.target.value)}
// // // //                             className="mr-2"
// // // //                         />
// // // //                         Unlimited
// // // //                     </label>
// // // //                     <label className="inline-flex items-center ml-4">
// // // //                         <input
// // // //                             type="radio"
// // // //                             value="Restricted"
// // // //                             checked={viewDuration === "Restricted"}
// // // //                             onChange={(e) => setViewDuration(e.target.value)}
// // // //                             className="mr-2"
// // // //                         />
// // // //                         Restricted
// // // //                     </label>
// // // //                 </div>

// // // //                 {viewDuration === "Restricted" && (
// // // //                     <div className="mb-4">
// // // //                         <div className="flex items-center space-x-4">
// // // //                             <input
// // // //                                 type="number"
// // // //                                 value={totalDuration}
// // // //                                 onChange={(e) => setTotalDuration(Number(e.target.value))}
// // // //                                 className="px-2 py-1 border rounded w-full"
// // // //                                 placeholder="Total Duration (sec)"
// // // //                             />
// // // //                             <span className="text-lg">×</span>
// // // //                             <input
// // // //                                 type="number"
// // // //                                 value={multiplier}
// // // //                                 onChange={(e) => setMultiplier(Number(e.target.value))}
// // // //                                 className="px-2 py-1 border rounded w-full"
// // // //                                 placeholder="Multiplier"
// // // //                             />
// // // //                             <span className="text-lg">=</span>
// // // //                             <input
// // // //                                 type="text"
// // // //                                 value={`${totalDuration * multiplier} s`}
// // // //                                 readOnly
// // // //                                 className="px-2 py-1 border bg-gray-100 rounded w-full"
// // // //                             />
// // // //                         </div>
// // // //                     </div>
// // // //                 )}

// // // //                 <div className="flex justify-end space-x-4">
// // // //                     <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded">
// // // //                         Cancel
// // // //                     </button>
// // // //                     <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded">
// // // //                         Add Curriculum
// // // //                     </button>
// // // //                 </div>
// // // //             </div>
// // // //         </div>
// // // //     );
// // // // };

// // // // export default CreateCurriculum;



// // // import React, { useState } from "react";

// // // const CreateCurriculum = ({ isOpen, onClose, onSubmit }) => {
// // //     const [name, setName] = useState("");
// // //     const [viewDuration, setViewDuration] = useState("Unlimited");
// // //     const [totalDuration, setTotalDuration] = useState(0);
// // //     const [multiplier, setMultiplier] = useState(0);

// // //     if (!isOpen) return null;

// // //     const handleSubmit = () => {
// // //         if (!name.trim()) return alert("Curriculum name is required!");

// // //         const totalWatchTime = totalDuration * multiplier;
// // //         onSubmit({ name, viewDuration, totalWatchTime });
// // //         onClose();
// // //     };

// // //     return (
// // //         <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center p-4 z-50">
// // //             <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg">
// // //                 <h3 className="text-lg sm:text-xl font-bold mb-4">Add Curriculum</h3>

// // //                 {/* Curriculum Name */}
// // //                 <div>
// // //                     <label className="block mb-2 text-sm font-medium text-gray-700">Name *</label>
// // //                     <input
// // //                         type="text"
// // //                         value={name}
// // //                         onChange={(e) => setName(e.target.value)}
// // //                         className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                         placeholder="Enter curriculum name"
// // //                     />
// // //                 </div>

// // //                 {/* Maximum View Duration */}
// // //                 <div className="mt-4">
// // //                     <label className="block mb-2 text-sm font-medium text-gray-700">Maximum View Duration</label>
// // //                     <div className="flex flex-col sm:flex-row gap-4">
// // //                         <label className="flex items-center">
// // //                             <input
// // //                                 type="radio"
// // //                                 value="Unlimited"
// // //                                 checked={viewDuration === "Unlimited"}
// // //                                 onChange={(e) => setViewDuration(e.target.value)}
// // //                                 className="mr-2"
// // //                             />
// // //                             Unlimited
// // //                         </label>
// // //                         <label className="flex items-center">
// // //                             <input
// // //                                 type="radio"
// // //                                 value="Restricted"
// // //                                 checked={viewDuration === "Restricted"}
// // //                                 onChange={(e) => setViewDuration(e.target.value)}
// // //                                 className="mr-2"
// // //                             />
// // //                             Restricted
// // //                         </label>
// // //                     </div>
// // //                 </div>

// // //                 {/* Restricted Duration Inputs */}
// // //                 {viewDuration === "Restricted" && (
// // //                     <div className="mt-4">
// // //                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 items-center">
// // //                             <input
// // //                                 type="number"
// // //                                 value={totalDuration}
// // //                                 onChange={(e) => setTotalDuration(Number(e.target.value))}
// // //                                 className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                                 placeholder="Total Duration (sec)"
// // //                             />
// // //                             <div className="flex justify-center text-lg font-medium text-gray-700">×</div>
// // //                             <input
// // //                                 type="number"
// // //                                 value={multiplier}
// // //                                 onChange={(e) => setMultiplier(Number(e.target.value))}
// // //                                 className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                                 placeholder="Multiplier"
// // //                             />
// // //                             <div className="hidden sm:flex justify-center text-lg font-medium text-gray-700">=</div>
// // //                             <input
// // //                                 type="text"
// // //                                 value={`${totalDuration * multiplier} s`}
// // //                                 readOnly
// // //                                 className="w-full px-3 py-2 border bg-gray-100 rounded-md"
// // //                             />
// // //                         </div>
// // //                     </div>
// // //                 )}

// // //                 {/* Action Buttons */}
// // //                 <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 mt-6">
// // //                     <button
// // //                         onClick={onClose}
// // //                         className="w-full sm:w-auto px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition duration-200"
// // //                     >
// // //                         Cancel
// // //                     </button>
// // //                     <button
// // //                         onClick={handleSubmit}
// // //                         className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
// // //                     >
// // //                         Add Curriculum
// // //                     </button>
// // //                 </div>
// // //             </div>
// // //         </div>
// // //     );
// // // };

// // // export default CreateCurriculum;



// // import React, { useState } from 'react';

// // const CreateCurriculum = ({ isOpen, onClose, onSubmit }) => {
// //   // State for form data
// //   const [formData, setFormData] = useState({
// //     name: '',
// //     branch: 'Fireblaze', // Default value
// //     maxViewDuration: 'Unlimited', // Default value
// //   });

// //   // Handle form input changes
// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData((prev) => ({ ...prev, [name]: value }));
// //   };

// //   // Handle form submission
// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     if (!formData.name) {
// //       alert('Please enter a curriculum name.');
// //       return;
// //     }

// //     // Pass the form data to the parent component
// //     onSubmit(formData);
// //     // Reset form and close modal
// //     setFormData({ name: '', branch: 'Fireblaze', maxViewDuration: 'Unlimited' });
// //     onClose();
// //   };

// //   // If the modal is not open, return null
// //   if (!isOpen) return null;

// //   return (
// //     <div style={styles.modalOverlay}>
// //       <div style={styles.modal}>
// //         {/* Modal Header */}
// //         <div style={styles.modalHeader}>
// //           <h3>Add Curriculum</h3>
// //           <button onClick={onClose} style={styles.closeButton}>
// //             ✕
// //           </button>
// //         </div>

// //         {/* Form */}
// //         <form onSubmit={handleSubmit}>
// //           {/* Name Field */}
// //           <div style={styles.formGroup}>
// //             <label style={styles.label}>
// //               Name <span style={styles.required}>*</span>
// //             </label>
// //             <input
// //               type="text"
// //               name="name"
// //               value={formData.name}
// //               onChange={handleInputChange}
// //               placeholder="Enter curriculum name"
// //               style={styles.input}
// //               maxLength="100"
// //             />
// //             <span style={styles.charCount}>{formData.name.length}/100</span>
// //           </div>

// //           {/* Branch Field */}
// //           <div style={styles.formGroup}>
// //             <label style={styles.label}>Branch</label>
// //             <select
// //               name="branch"
// //               value={formData.branch}
// //               onChange={handleInputChange}
// //               style={styles.selectInput}
// //             >
// //               <option value="Fireblaze">Fireblaze</option>
// //               {/* Add more branches as needed */}
// //             </select>
// //           </div>

// //           {/* Maximum View Duration Field */}
// //           <div style={styles.formGroup}>
// //             <label style={styles.label}>Maximum View Duration</label>
// //             <div>
// //               <label style={styles.radioLabel}>
// //                 <input
// //                   type="radio"
// //                   name="maxViewDuration"
// //                   value="Unlimited"
// //                   checked={formData.maxViewDuration === 'Unlimited'}
// //                   onChange={handleInputChange}
// //                   style={styles.radio}
// //                 />
// //                 Unlimited
// //               </label>
// //               <label style={styles.radioLabel}>
// //                 <input
// //                   type="radio"
// //                   name="maxViewDuration"
// //                   value="Restricted"
// //                   checked={formData.maxViewDuration === 'Restricted'}
// //                   onChange={handleInputChange}
// //                   style={styles.radio}
// //                 />
// //                 Restricted
// //               </label>
// //             </div>
// //           </div>

// //           {/* Form Actions */}
// //           <div style={styles.formActions}>
// //             <button
// //               type="button"
// //               onClick={onClose}
// //               style={styles.cancelButton}
// //             >
// //               Cancel
// //             </button>
// //             <button type="submit" style={styles.submitButton}>
// //               Add Curriculum
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // // Inline styles
// // const styles = {
// //   modalOverlay: {
// //     position: 'fixed',
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     bottom: 0,
// //     backgroundColor: 'rgba(0, 0, 0, 0.5)',
// //     display: 'flex',
// //     justifyContent: 'flex-end',
// //     zIndex: 1000,
// //   },
// //   modal: {
// //     backgroundColor: '#fff',
// //     width: '400px',
// //     height: '100%',
// //     padding: '20px',
// //     boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
// //     animation: 'slideIn 0.3s ease-out',
// //   },
// //   modalHeader: {
// //     display: 'flex',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: '20px',
// //   },
// //   closeButton: {
// //     background: 'none',
// //     border: 'none',
// //     fontSize: '16px',
// //     cursor: 'pointer',
// //   },
// //   formGroup: {
// //     marginBottom: '20px',
// //   },
// //   label: {
// //     display: 'block',
// //     fontSize: '14px',
// //     marginBottom: '5px',
// //   },
// //   required: {
// //     color: 'red',
// //   },
// //   input: {
// //     width: '100%',
// //     padding: '8px',
// //     borderRadius: '5px',
// //     border: '1px solid #ddd',
// //     boxSizing: 'border-box',
// //   },
// //   charCount: {
// //     display: 'block',
// //     fontSize: '12px',
// //     color: '#666',
// //     textAlign: 'right',
// //     marginTop: '5px',
// //   },
// //   selectInput: {
// //     width: '100%',
// //     padding: '8px',
// //     borderRadius: '5px',
// //     border: '1px solid #ddd',
// //   },
// //   radioLabel: {
// //     display: 'block',
// //     margin: '5px 0',
// //   },
// //   radio: {
// //     marginRight: '10px',
// //   },
// //   formActions: {
// //     display: 'flex',
// //     justifyContent: 'flex-end',
// //     gap: '10px',
// //   },
// //   cancelButton: {
// //     padding: '8px 15px',
// //     backgroundColor: '#fff',
// //     border: '1px solid #ddd',
// //     borderRadius: '5px',
// //     cursor: 'pointer',
// //   },
// //   submitButton: {
// //     padding: '8px 15px',
// //     backgroundColor: '#007bff',
// //     color: '#fff',
// //     border: 'none',
// //     borderRadius: '5px',
// //     cursor: 'pointer',
// //   },
// // };

// // // Add keyframes for slide-in animation
// // const styleSheet = document.createElement('style');
// // styleSheet.innerHTML = `
// //   @keyframes slideIn {
// //     from {
// //       transform: translateX(100%);
// //     }
// //     to {
// //       transform: translateX(0);
// //     }
// //   }
// // `;
// // document.head.appendChild(styleSheet);

// // export default CreateCurriculum;

// // src/AddCurriculumModal.js

// import React, { useState } from 'react';

// const CreateCurriculum = ({ isOpen, onClose, onSubmit }) => {
//   // State for form data
//   const [formData, setFormData] = useState({
//     name: '',
//     branch: 'Fireblaze', // Default value
//     maxViewDuration: 'Unlimited', // Default value
//   });

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!formData.name) {
//       alert('Please enter a curriculum name.');
//       return;
//     }

//     // Pass the form data to the parent component
//     onSubmit(formData);
//     // Reset form and close modal
//     setFormData({ name: '', branch: 'Fireblaze', maxViewDuration: 'Unlimited' });
//     onClose();
//   };

//   // If the modal is not open, return null
//   if (!isOpen) return null;

//   return (
//     <div style={styles.modalOverlay}>
//       <div style={styles.modal}>
//         {/* Modal Header */}
//         <div style={styles.modalHeader}>
//           <h3>Add Curriculum</h3>
//           <button onClick={onClose} style={styles.closeButton}>
//             ✕
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit}>
//           {/* Name Field */}
//           <div style={styles.formGroup}>
//             <label style={styles.label}>
//               Name <span style={styles.required}>*</span>
//             </label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleInputChange}
//               placeholder="Enter curriculum name"
//               style={styles.input}
//               maxLength="100"
//             />
//             <span style={styles.charCount}>{formData.name.length}/100</span>
//           </div>

//           {/* Branch Field */}
//           <div style={styles.formGroup}>
//             <label style={styles.label}>Branch</label>
//             <select
//               name="branch"
//               value={formData.branch}
//               onChange={handleInputChange}
//               style={styles.selectInput}
//             >
//               <option value="Fireblaze">Fireblaze</option>
//               {/* Add more branches as needed */}
//             </select>
//           </div>

//           {/* Maximum View Duration Field */}
//           <div style={styles.formGroup}>
//             <label style={styles.label}>Maximum View Duration</label>
//             <div>
//               <label style={styles.radioLabel}>
//                 <input
//                   type="radio"
//                   name="maxViewDuration"
//                   value="Unlimited"
//                   checked={formData.maxViewDuration === 'Unlimited'}
//                   onChange={handleInputChange}
//                   style={styles.radio}
//                 />
//                 Unlimited
//               </label>
//               <label style={styles.radioLabel}>
//                 <input
//                   type="radio"
//                   name="maxViewDuration"
//                   value="Restricted"
//                   checked={formData.maxViewDuration === 'Restricted'}
//                   onChange={handleInputChange}
//                   style={styles.radio}
//                 />
//                 Restricted
//               </label>
//             </div>
//           </div>

//           {/* Form Actions */}
//           <div style={styles.formActions}>
//             <button
//               type="button"
//               onClick={onClose}
//               style={styles.cancelButton}
//             >
//               Cancel
//             </button>
//             <button type="submit" style={styles.submitButton}>
//               Add Curriculum
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// // Inline styles for the modal
// const styles = {
//   modalOverlay: {
//     position: 'fixed',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     display: 'flex',
//     justifyContent: 'flex-end',
//     zIndex: 1000,
//   },
//   modal: {
//     backgroundColor: '#fff',
//     width: '400px',
//     height: '100%',
//     padding: '20px',
//     boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
//     animation: 'slideIn 0.3s ease-out',
//   },
//   modalHeader: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: '20px',
//   },
//   closeButton: {
//     background: 'none',
//     border: 'none',
//     fontSize: '16px',
//     cursor: 'pointer',
//   },
//   formGroup: {
//     marginBottom: '20px',
//   },
//   label: {
//     display: 'block',
//     fontSize: '14px',
//     marginBottom: '5px',
//   },
//   required: {
//     color: 'red',
//   },
//   input: {
//     width: '100%',
//     padding: '8px',
//     borderRadius: '5px',
//     border: '1px solid #ddd',
//     boxSizing: 'border-box',
//   },
//   charCount: {
//     display: 'block',
//     fontSize: '12px',
//     color: '#666',
//     textAlign: 'right',
//     marginTop: '5px',
//   },
//   selectInput: {
//     width: '100%',
//     padding: '8px',
//     borderRadius: '5px',
//     border: '1px solid #ddd',
//   },
//   radioLabel: {
//     display: 'block',
//     margin: '5px 0',
//   },
//   radio: {
//     marginRight: '10px',
//   },
//   formActions: {
//     display: 'flex',
//     justifyContent: 'flex-end',
//     gap: '10px',
//   },
//   cancelButton: {
//     padding: '8px 15px',
//     backgroundColor: '#fff',
//     border: '1px solid #ddd',
//     borderRadius: '5px',
//     cursor: 'pointer',
//   },
//   submitButton: {
//     padding: '8px 15px',
//     backgroundColor: '#007bff',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '5px',
//     cursor: 'pointer',
//   },
// };

// // Add keyframes for slide-in animation
// const styleSheet = document.createElement('style');
// styleSheet.innerHTML = `
//   @keyframes slideIn {
//     from {
//       transform: translateX(100%);
//     }
//     to {
//       transform: translateX(0);
//     }
//   }
// `;
// document.head.appendChild(styleSheet);

// export default CreateCurriculum;

// src/CreateCurriculum.js
import React, { useState } from 'react';
import { db } from '../../../../config/firebase'; // Import Firestore
import { collection, addDoc } from 'firebase/firestore'; // Firestore methods

const CreateCurriculum = ({ isOpen, onClose, onSubmit }) => {
  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    branch: 'Fireblaze', // Default value
    maxViewDuration: 'Unlimited', // Default value
  });

  // State for loading and error handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Please enter a curriculum name.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Save the form data to Firestore
      const docRef = await addDoc(collection(db, 'curriculums'), {
        name: formData.name,
        branch: formData.branch,
        maxViewDuration: formData.maxViewDuration,
        sections: 0, // Default value for sections
        createdAt: new Date(),
      });

      // Pass the form data to the parent component, including the Firestore document ID
      onSubmit({
        id: docRef.id,
        ...formData,
        sections: 0,
      });

      // Reset form and close modal
      setFormData({ name: '', branch: 'Fireblaze', maxViewDuration: 'Unlimited' });
      setLoading(false);
      onClose();
    } catch (err) {
      console.error('Error adding curriculum:', err);
      setError('Failed to add curriculum. Please try again.');
      setLoading(false);
    }
  };

  // If the modal is not open, return null
  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        {/* Modal Header */}
        <div style={styles.modalHeader}>
          <h3>Add Curriculum</h3>
          <button onClick={onClose} style={styles.closeButton} disabled={loading}>
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Name <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter curriculum name"
              style={styles.input}
              maxLength="100"
              disabled={loading}
            />
            <span style={styles.charCount}>{formData.name.length}/100</span>
          </div>

          {/* Branch Field */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Branch</label>
            <select
              name="branch"
              value={formData.branch}
              onChange={handleInputChange}
              style={styles.selectInput}
              disabled={loading}
            >
              <option value="Fireblaze">Fireblaze</option>
              {/* Add more branches as needed */}
            </select>
          </div>

          {/* Maximum View Duration Field */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Maximum View Duration</label>
            <div>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="maxViewDuration"
                  value="Unlimited"
                  checked={formData.maxViewDuration === 'Unlimited'}
                  onChange={handleInputChange}
                  style={styles.radio}
                  disabled={loading}
                />
                Unlimited
              </label>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="maxViewDuration"
                  value="Restricted"
                  checked={formData.maxViewDuration === 'Restricted'}
                  onChange={handleInputChange}
                  style={styles.radio}
                  disabled={loading}
                />
                Restricted
              </label>
            </div>
          </div>

          {/* Error Message */}
          {error && <div style={styles.errorMessage}>{error}</div>}

          {/* Form Actions */}
          <div style={styles.formActions}>
            <button
              type="button"
              onClick={onClose}
              style={styles.cancelButton}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" style={styles.submitButton} disabled={loading}>
              {loading ? 'Adding...' : 'Add Curriculum'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Inline styles for the modal (updated with error message style)
const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    width: '400px',
    height: '100%',
    padding: '20px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
    animation: 'slideIn 0.3s ease-out',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    marginBottom: '5px',
  },
  required: {
    color: 'red',
  },
  input: {
    width: '100%',
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    boxSizing: 'border-box',
  },
  charCount: {
    display: 'block',
    fontSize: '12px',
    color: '#666',
    textAlign: 'right',
    marginTop: '5px',
  },
  selectInput: {
    width: '100%',
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
  radioLabel: {
    display: 'block',
    margin: '5px 0',
  },
  radio: {
    marginRight: '10px',
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  cancelButton: {
    padding: '8px 15px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  submitButton: {
    padding: '8px 15px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  errorMessage: {
    color: 'red',
    fontSize: '14px',
    marginBottom: '10px',
  },
};

// Add keyframes for slide-in animation
const styleSheet = document.createElement('style');
styleSheet.innerHTML = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
`;
document.head.appendChild(styleSheet);

export default CreateCurriculum;