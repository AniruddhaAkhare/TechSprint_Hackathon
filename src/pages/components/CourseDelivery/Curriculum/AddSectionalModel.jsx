// // import React, { useState } from "react";
// // import { db } from "../../../../config/firebase";
// // import { collection, addDoc } from "firebase/firestore";
// // import Feedback from "./Feedback";
// // import VideoPage from "./Videos";

// // export default function AddSectionalModal ({ curriculumId, onClose }) {
// //   const [sectionName, setSectionName] = useState("");
// //   const [sectionDescription, setSectionDescription] = useState("");
// //   const [isPrerequisite, setIsPrerequisite] = useState(false);

// //   const handleAddSection = async () => {
// //     if (!sectionName.trim()) {
// //       alert("Section name is required!");
// //       return;
// //     }
// //     const newSection = {
// //       name: sectionName,
// //       description: sectionDescription,
// //       prerequisite: isPrerequisite,
// //     };

// //     try {
// //       // Add section to the Firestore under the selected curriculum
// //       await addDoc(collection(db, `curriculum/${curriculumId}/sections`), newSection);
// //       console.log("New Section:", newSection);
// //       onClose(); // Close the modal after adding the section
// //     } catch (error) {
// //       console.error("Error adding section:", error);
// //     }
// //   };

// //   return (
// //     <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
// //       <div className="bg-white rounded-lg shadow-lg w-[400px]">

// //         <div className="px-6 py-4 border-b">
// //           <h2 className="text-xl font-semibold">Add New Section</h2>
// //         </div>
// //         <div className="p-6 space-y-4">
// //           <div>
// //             <label
// //               htmlFor="sectionName"
// //               className="block text-sm font-medium text-gray-700"
// //             >
// //               Section Name <span className="text-red-500">*</span>
// //             </label>
// //             <input
// //               id="sectionName"
// //               type="text"
// //               value={sectionName}
// //               onChange={(e) => setSectionName(e.target.value)}
// //               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
// //               placeholder="Section Name"
// //             />
// //           </div>
// //           <div>
// //             <label
// //               htmlFor="sectionDescription"
// //               className="block text-sm font-medium text-gray-700"
// //             >
// //               Short Description
// //             </label>
// //             <textarea
// //               id="sectionDescription"
// //               value={sectionDescription}
// //               onChange={(e) => setSectionDescription(e.target.value)}
// //               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
// //               placeholder="Section Description"
// //               maxLength={250}
// //               rows={3}
// //             />
// //             <p className="text-sm text-gray-500">
// //               {sectionDescription.length}/250
// //             </p>
// //           </div>
// //           <div className="flex items-center">
// //             <input
// //               id="isPrerequisite"
// //               type="checkbox"
// //               checked={isPrerequisite}
// //               onChange={(e) => setIsPrerequisite(e.target.checked)}
// //               className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
// //             />
// //             <label
// //               htmlFor="isPrerequisite"
// //               className="ml-2 text-sm text-gray-700"
// //             >
// //               Make this a prerequisite
// //             </label>
// //           </div>
// //         </div>
// //         <div className="px-6 py-4 border-t flex justify-between">
// //           <button
// //             onClick={onClose}
// //             className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
// //           >
// //             Back
// //           </button>
// //           <button
// //             onClick={handleAddSection}
// //             className={`px-4 py-2 rounded-md text-white ${
// //               sectionName.trim()
// //                 ? "bg-blue-600 hover:bg-blue-700"
// //                 : "bg-gray-300 cursor-not-allowed"
// //             }`}
// //             disabled={!sectionName.trim()}
// //           >
// //             Add Section
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // // export default AddSectionModal;


// import React, { useState } from "react";
// import { db } from "../../../../config/firebase";
// import { collection, addDoc } from "firebase/firestore";

// const AddSectionalModal = ({ curriculumId, onClose }) => {
//   const [sectionName, setSectionName] = useState("");
//   const [sectionDescription, setSectionDescription] = useState("");
//   const [isPrerequisite, setIsPrerequisite] = useState(false);

//   const handleAddSection = async () => {
//     if (!sectionName.trim()) {
//       alert("Section name is required!");
//       return;
//     }
//     const newSection = {
//       name: sectionName,
//       description: sectionDescription,
//       prerequisite: isPrerequisite,
//     };

//     try {
//       await addDoc(collection(db, `curriculum/${curriculumId}/sections`), newSection);
//       console.log("New Section:", newSection);
//       onClose();
//     } catch (error) {
//       console.error("Error adding section:", error);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg shadow-lg w-full max-w-md sm:max-w-lg">
//         {/* Header */}
//         <div className="px-4 py-3 sm:px-6 sm:py-4 border-b">
//           <h2 className="text-lg sm:text-xl font-semibold">Add New Section</h2>
//         </div>

//         {/* Form Body */}
//         <div className="p-4 sm:p-6 space-y-4">
//           {/* Section Name */}
//           <div>
//             <label
//               htmlFor="sectionName"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Section Name <span className="text-red-500">*</span>
//             </label>
//             <input
//               id="sectionName"
//               type="text"
//               value={sectionName}
//               onChange={(e) => setSectionName(e.target.value)}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3"
//               placeholder="Section Name"
//             />
//           </div>

//           {/* Section Description */}
//           <div>
//             <label
//               htmlFor="sectionDescription"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Short Description
//             </label>
//             <textarea
//               id="sectionDescription"
//               value={sectionDescription}
//               onChange={(e) => setSectionDescription(e.target.value)}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3"
//               placeholder="Section Description"
//               maxLength={250}
//               rows={3}
//             />
//             <p className="mt-1 text-sm text-gray-500">
//               {sectionDescription.length}/250
//             </p>
//           </div>

//           {/* Prerequisite Checkbox */}
//           <div className="flex items-center">
//             <input
//               id="isPrerequisite"
//               type="checkbox"
//               checked={isPrerequisite}
//               onChange={(e) => setIsPrerequisite(e.target.checked)}
//               className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//             />
//             <label
//               htmlFor="isPrerequisite"
//               className="ml-2 text-sm text-gray-700"
//             >
//               Make this a prerequisite
//             </label>
//           </div>
//         </div>

//         {/* Footer with Buttons */}
//         <div className="px-4 py-3 sm:px-6 sm:py-4 border-t flex flex-col sm:flex-row justify-between gap-2 sm:gap-4">
//           <button
//             onClick={onClose}
//             className="w-full sm:w-auto px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition duration-200"
//           >
//             Back
//           </button>
//           <button
//             onClick={handleAddSection}
//             className={`w-full sm:w-auto px-4 py-2 rounded-md text-white ${
//               sectionName.trim()
//                 ? "bg-blue-600 hover:bg-blue-700"
//                 : "bg-gray-300 cursor-not-allowed"
//             } transition duration-200`}
//             disabled={!sectionName.trim()}
//           >
//             Add Section
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddSectionalModal;


// src/AddSectionModal.js
import React, { useState } from 'react';
import { db } from '../../../../config/firebase'; // Import Firestore
import { collection, addDoc } from 'firebase/firestore'; // Firestore methods

const AddSectionModal = ({ isOpen, onClose, curriculumId }) => {
  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPrerequisite: false,
  });

  // State for loading and error handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Please enter a section name.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Save the section data to Firestore as a subcollection under the curriculum
      await addDoc(collection(db, `curriculums/${curriculumId}/sections`), {
        name: formData.name,
        description: formData.description,
        isPrerequisite: formData.isPrerequisite,
        createdAt: new Date(),
      });

      // Reset form and close modal
      setFormData({ name: '', description: '', isPrerequisite: false });
      setLoading(false);
      onClose();
    } catch (err) {
      console.error('Error adding section:', err);
      setError('Failed to add section. Please try again.');
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
          <h3>Add New Section</h3>
          <button onClick={onClose} style={styles.closeButton} disabled={loading}>
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Section Name Field */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Section Name <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Section Name"
              style={styles.input}
              disabled={loading}
            />
          </div>

          {/* Short Description Field */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Short Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Section Description"
              style={styles.textarea}
              maxLength="250"
              disabled={loading}
            />
            <span style={styles.charCount}>{formData.description.length} / 250</span>
          </div>

          {/* More Options */}
          <div style={styles.formGroup}>
            <label style={styles.label}>More Options</label>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="isPrerequisite"
                checked={formData.isPrerequisite}
                onChange={handleInputChange}
                style={styles.checkbox}
                disabled={loading}
              />
              Make this a prerequisite
            </label>
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
              Back
            </button>
            <button type="submit" style={styles.submitButton} disabled={loading}>
              {loading ? 'Adding...' : 'Add Section'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Inline styles
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
  textarea: {
    width: '100%',
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    boxSizing: 'border-box',
    minHeight: '100px',
    resize: 'vertical',
  },
  charCount: {
    display: 'block',
    fontSize: '12px',
    color: '#666',
    textAlign: 'right',
    marginTop: '5px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: '10px',
  },
  errorMessage: {
    color: 'red',
    fontSize: '14px',
    marginBottom: '10px',
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

export default AddSectionModal;