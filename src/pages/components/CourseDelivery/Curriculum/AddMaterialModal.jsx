// // // // src/AddMaterialModal.js
// // // import React, { useState } from 'react';

// // // const AddMaterialModal = ({ isOpen, onClose, curriculumId, sectionId }) => {
// // //   const [selectedType, setSelectedType] = useState(null);

// // //   // List of material types with their icons (using emojis for simplicity)
// // //   const materialTypes = [
// // //     { type: 'Video', icon: '🎥' },
// // //     { type: 'Audio', icon: '🎙️' },
// // //     { type: 'PDF', icon: '📄' },
// // //     { type: 'Youtube', icon: '▶️' },
// // //     { type: 'Image', icon: '🖼️' },
// // //     { type: 'Doc', icon: '📜' },
// // //     { type: 'Sheet', icon: '📊' },
// // //     { type: 'Slide', icon: '📑' },
// // //     { type: 'Text/HTML', icon: '📝' },
// // //     { type: 'Zip', icon: '🗜️' },
// // //     { type: 'Scorm Zip', icon: '📦' },
// // //     { type: 'Link', icon: '🔗' },
// // //     { type: 'Exercise', icon: '🏋️' },
// // //     { type: 'Assignment', icon: '📋' },
// // //     { type: 'Programming Assignment', icon: '💻' },
// // //     { type: 'Form', icon: '📋' },
// // //   ];

// // //   // Handle material type selection
// // //   const handleTypeSelect = (type) => {
// // //     setSelectedType(type);
// // //   };

// // //   // Handle continue (placeholder for now)
// // //   const handleContinue = () => {
// // //     if (!selectedType) {
// // //       alert('Please select a material type.');
// // //       return;
// // //     }
// // //     alert(`Proceeding with material type: ${selectedType}`);
// // //     // Here you can navigate to a new modal/page to configure the material based on the type
// // //     onClose();
// // //   };

// // //   // If the modal is not open, return null
// // //   if (!isOpen) return null;

// // //   return (
// // //     <div style={styles.modalOverlay}>
// // //       <div style={styles.modal}>
// // //         {/* Modal Header */}
// // //         <div style={styles.modalHeader}>
// // //           <h3>Add Material</h3>
// // //           <button onClick={onClose} style={styles.closeButton}>
// // //             ✕
// // //           </button>
// // //         </div>

// // //         {/* Modal Content */}
// // //         <div style={styles.modalContent}>
// // //           <p style={styles.subTitle}>Select material type or Clone from existing library</p>
// // //           <div style={styles.materialGrid}>
// // //             {materialTypes.map((material) => (
// // //               <div
// // //                 key={material.type}
// // //                 style={{
// // //                   ...styles.materialItem,
// // //                   backgroundColor: selectedType === material.type ? '#e0e7ff' : '#fff',
// // //                 }}
// // //                 onClick={() => handleTypeSelect(material.type)}
// // //               >
// // //                 <span style={styles.materialIcon}>{material.icon}</span>
// // //                 <span style={styles.materialLabel}>{material.type}</span>
// // //               </div>
// // //             ))}
// // //           </div>
// // //           <p style={styles.note}>
// // //             If you don't see your format listed here, please upload it as a zip file.
// // //           </p>
// // //         </div>

// // //         {/* Form Actions */}
// // //         <div style={styles.formActions}>
// // //           <button onClick={onClose} style={styles.cancelButton}>
// // //             Cancel
// // //           </button>
// // //           <button onClick={handleContinue} style={styles.continueButton}>
// // //             Continue
// // //           </button>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // // Inline styles
// // // const styles = {
// // //   modalOverlay: {
// // //     position: 'fixed',
// // //     top: 0,
// // //     left: 0,
// // //     right: 0,
// // //     bottom: 0,
// // //     backgroundColor: 'rgba(0, 0, 0, 0.5)',
// // //     display: 'flex',
// // //     justifyContent: 'flex-end',
// // //     zIndex: 1000,
// // //   },
// // //   modal: {
// // //     backgroundColor: '#fff',
// // //     width: '400px',
// // //     height: '100%',
// // //     padding: '20px',
// // //     boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
// // //     animation: 'slideIn 0.3s ease-out',
// // //   },
// // //   modalHeader: {
// // //     display: 'flex',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     marginBottom: '20px',
// // //   },
// // //   closeButton: {
// // //     background: 'none',
// // //     border: 'none',
// // //     fontSize: '16px',
// // //     cursor: 'pointer',
// // //   },
// // //   modalContent: {
// // //     flex: 1,
// // //   },
// // //   subTitle: {
// // //     fontSize: '14px',
// // //     color: '#333',
// // //     marginBottom: '20px',
// // //   },
// // //   materialGrid: {
// // //     display: 'grid',
// // //     gridTemplateColumns: 'repeat(4, 1fr)',
// // //     gap: '10px',
// // //     marginBottom: '20px',
// // //   },
// // //   materialItem: {
// // //     display: 'flex',
// // //     flexDirection: 'column',
// // //     alignItems: 'center',
// // //     padding: '10px',
// // //     border: '1px solid #ddd',
// // //     borderRadius: '5px',
// // //     cursor: 'pointer',
// // //     transition: 'background-color 0.2s',
// // //   },
// // //   materialIcon: {
// // //     fontSize: '24px',
// // //     marginBottom: '5px',
// // //   },
// // //   materialLabel: {
// // //     fontSize: '12px',
// // //     textAlign: 'center',
// // //   },
// // //   note: {
// // //     fontSize: '12px',
// // //     color: '#666',
// // //   },
// // //   formActions: {
// // //     display: 'flex',
// // //     justifyContent: 'flex-end',
// // //     gap: '10px',
// // //   },
// // //   cancelButton: {
// // //     padding: '8px 15px',
// // //     backgroundColor: '#fff',
// // //     border: '1px solid #ddd',
// // //     borderRadius: '5px',
// // //     cursor: 'pointer',
// // //   },
// // //   continueButton: {
// // //     padding: '8px 15px',
// // //     backgroundColor: '#007bff',
// // //     color: '#fff',
// // //     border: 'none',
// // //     borderRadius: '5px',
// // //     cursor: 'pointer',
// // //   },
// // // };

// // // // Add keyframes for slide-in animation
// // // const styleSheet = document.createElement('style');
// // // styleSheet.innerHTML = `
// // //   @keyframes slideIn {
// // //     from {
// // //       transform: translateX(100%);
// // //     }
// // //     to {
// // //       transform: translateX(0);
// // //     }
// // //   }
// // // `;
// // // document.head.appendChild(styleSheet);

// // // export default AddMaterialModal;


// // // src/AddMaterialModal.js
// // import React, { useState } from 'react';
// // import { db } from '../../../../config/firebase'; // Adjust the path to your firebase.js file
// // import { collection, addDoc } from 'firebase/firestore';
// // import s3 from '../../../../config/aws-config'; // Import the S3 configuration


// // const AddMaterialModal = ({ isOpen, onClose, curriculumId, sectionId }) => {
// //   const [selectedType, setSelectedType] = useState(null);
// //   const [file, setFile] = useState(null);
// //   const [uploading, setUploading] = useState(false);
// //   const [error, setError] = useState(null);

// //   // List of material types with their icons (using emojis for simplicity)
// //   const materialTypes = [
// //     { type: 'Video', icon: '🎥' },
// //     { type: 'Audio', icon: '🎙️' },
// //     { type: 'PDF', icon: '📄' },
// //     { type: 'Youtube', icon: '▶️' },
// //     { type: 'Image', icon: '🖼️' },
// //     { type: 'Doc', icon: '📜' },
// //     { type: 'Sheet', icon: '📊' },
// //     { type: 'Slide', icon: '📑' },
// //     { type: 'Text/HTML', icon: '📝' },
// //     { type: 'Zip', icon: '🗜️' },
// //     { type: 'Scorm Zip', icon: '📦' },
// //     { type: 'Link', icon: '🔗' },
// //     { type: 'Exercise', icon: '🏋️' },
// //     { type: 'Assignment', icon: '📋' },
// //     { type: 'Programming Assignment', icon: '💻' },
// //     { type: 'Form', icon: '📋' },
// //   ];

// //   // Handle material type selection
// //   const handleTypeSelect = (type) => {
// //     setSelectedType(type);
// //     setFile(null); // Reset file when changing type
// //     setError(null);
// //   };

// //   // Handle file selection
// //   const handleFileChange = (e) => {
// //     const selectedFile = e.target.files[0];
// //     if (selectedFile && selectedFile.type === 'application/pdf') {
// //       setFile(selectedFile);
// //       setError(null);
// //     } else {
// //       setFile(null);
// //       setError('Please select a valid PDF file.');
// //     }
// //   };

// //   // Handle continue (upload to S3 and save to Firestore)
// //   const handleContinue = async () => {
// //     if (!selectedType) {
// //       setError('Please select a material type.');
// //       return;
// //     }

// //     if (selectedType === 'PDF') {
// //       if (!file) {
// //         setError('Please select a PDF file to upload.');
// //         return;
// //       }

// //       setUploading(true);
// //       setError(null);

// //       try {
// //         // Generate a unique file name
// //         const fileName = `${Date.now()}-${file.name}`;
// //         const params = {
// //           Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
// //           Key: `materials/${fileName}`,
// //           Body: file,
// //           ContentType: 'application/pdf',
// //           ACL: 'public-read', // Make the file publicly accessible (adjust as needed)
// //         };

// //         // Upload to S3
// //         const { Location } = await s3.upload(params).promise();

// //         // Save material metadata to Firestore
// //         await addDoc(collection(db, `curriculums/${curriculumId}/sections/${sectionId}/materials`), {
// //           type: selectedType,
// //           name: file.name, // Use the original file name as the material name
// //           url: Location, // Store the S3 URL
// //           createdAt: new Date(),
// //         });

// //         setUploading(false);
// //         onClose();
// //       } catch (err) {
// //         console.error('Error uploading file to S3:', err);
// //         setError('Failed to upload PDF. Please try again.');
// //         setUploading(false);
// //       }
// //     } else {
// //       // Placeholder for other material types
// //       alert(`Proceeding with material type: ${selectedType}`);
// //       onClose();
// //     }
// //   };

// //   // If the modal is not open, return null
// //   if (!isOpen) return null;

// //   return (
// //     <div style={styles.modalOverlay}>
// //       <div style={styles.modal}>
// //         {/* Modal Header */}
// //         <div style={styles.modalHeader}>
// //           <h3>Add Material</h3>
// //           <button onClick={onClose} style={styles.closeButton} disabled={uploading}>
// //             ✕
// //           </button>
// //         </div>

// //         {/* Modal Content */}
// //         <div style={styles.modalContent}>
// //           <p style={styles.subTitle}>Select material type or Clone from existing library</p>
// //           <div style={styles.materialGrid}>
// //             {materialTypes.map((material) => (
// //               <div
// //                 key={material.type}
// //                 style={{
// //                   ...styles.materialItem,
// //                   backgroundColor: selectedType === material.type ? '#e0e7ff' : '#fff',
// //                 }}
// //                 onClick={() => handleTypeSelect(material.type)}
// //               >
// //                 <span style={styles.materialIcon}>{material.icon}</span>
// //                 <span style={styles.materialLabel}>{material.type}</span>
// //               </div>
// //             ))}
// //           </div>

// //           {/* Show file input if PDF is selected */}
// //           {selectedType === 'PDF' && (
// //             <div style={styles.fileInputContainer}>
// //               <label style={styles.label}>Upload PDF</label>
// //               <input
// //                 type="file"
// //                 accept="application/pdf"
// //                 onChange={handleFileChange}
// //                 style={styles.fileInput}
// //                 disabled={uploading}
// //               />
// //               {file && <p style={styles.fileName}>Selected file: {file.name}</p>}
// //             </div>
// //           )}

// //           <p style={styles.note}>
// //             If you don't see your format listed here, please upload it as a zip file.
// //           </p>

// //           {/* Error Message */}
// //           {error && <div style={styles.errorMessage}>{error}</div>}
// //         </div>

// //         {/* Form Actions */}
// //         <div style={styles.formActions}>
// //           <button onClick={onClose} style={styles.cancelButton} disabled={uploading}>
// //             Cancel
// //           </button>
// //           <button onClick={handleContinue} style={styles.continueButton} disabled={uploading}>
// //             {uploading ? 'Uploading...' : 'Continue'}
// //           </button>
// //         </div>
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
// //   modalContent: {
// //     flex: 1,
// //   },
// //   subTitle: {
// //     fontSize: '14px',
// //     color: '#333',
// //     marginBottom: '20px',
// //   },
// //   materialGrid: {
// //     display: 'grid',
// //     gridTemplateColumns: 'repeat(4, 1fr)',
// //     gap: '10px',
// //     marginBottom: '20px',
// //   },
// //   materialItem: {
// //     display: 'flex',
// //     flexDirection: 'column',
// //     alignItems: 'center',
// //     padding: '10px',
// //     border: '1px solid #ddd',
// //     borderRadius: '5px',
// //     cursor: 'pointer',
// //     transition: 'background-color 0.2s',
// //   },
// //   materialIcon: {
// //     fontSize: '24px',
// //     marginBottom: '5px',
// //   },
// //   materialLabel: {
// //     fontSize: '12px',
// //     textAlign: 'center',
// //   },
// //   note: {
// //     fontSize: '12px',
// //     color: '#666',
// //   },
// //   fileInputContainer: {
// //     marginBottom: '20px',
// //   },
// //   label: {
// //     display: 'block',
// //     fontSize: '14px',
// //     marginBottom: '5px',
// //   },
// //   fileInput: {
// //     width: '100%',
// //     padding: '8px',
// //     borderRadius: '5px',
// //     border: '1px solid #ddd',
// //     boxSizing: 'border-box',
// //   },
// //   fileName: {
// //     fontSize: '12px',
// //     color: '#666',
// //     marginTop: '5px',
// //   },
// //   errorMessage: {
// //     color: 'red',
// //     fontSize: '14px',
// //     marginBottom: '10px',
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
// //   continueButton: {
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

// // export default AddMaterialModal;


// // src/AddMaterialModal.js
// import React, { useState } from 'react';
// import { db } from '../../../../config/firebase'; // Adjust the path to your firebase.js file
// import { collection, addDoc } from 'firebase/firestore';
// import { s3Client, debugS3Config } from '../../../../config/aws-config'; // Import the S3 configuration
// import { PutObjectCommand } from '@aws-sdk/client-s3';

// const AddMaterialModal = ({ isOpen, onClose, curriculumId, sectionId }) => {
//   const [selectedType, setSelectedType] = useState(null);
//   const [file, setFile] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState(null);

//   // List of material types with their icons (using emojis for simplicity)
//   const materialTypes = [
//     { type: 'Video', icon: '🎥' },
//     { type: 'Audio', icon: '🎙️' },
//     { type: 'PDF', icon: '📄' },
//     { type: 'Youtube', icon: '▶️' },
//     { type: 'Image', icon: '🖼️' },
//     { type: 'Doc', icon: '📜' },
//     { type: 'Sheet', icon: '📊' },
//     { type: 'Slide', icon: '📑' },
//     { type: 'Text/HTML', icon: '📝' },
//     { type: 'Zip', icon: '🗜️' },
//     { type: 'Scorm Zip', icon: '📦' },
//     { type: 'Link', icon: '🔗' },
//     { type: 'Exercise', icon: '🏋️' },
//     { type: 'Assignment', icon: '📋' },
//     { type: 'Programming Assignment', icon: '💻' },
//     { type: 'Form', icon: '📋' },
//   ];

//   // Handle material type selection
//   const handleTypeSelect = (type) => {
//     setSelectedType(type);
//     setFile(null); // Reset file when changing type
//     setError(null);
//   };

//   // Handle file selection with validation
//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       // Validate file type
//       if (selectedFile.type !== 'application/pdf') {
//         setFile(null);
//         setError('Please select a valid PDF file.');
//         return;
//       }
//       // Validate file size (e.g., max 10MB)
//       const maxSizeInMB = 10;
//       if (selectedFile.size > maxSizeInMB * 1024 * 1024) {
//         setFile(null);
//         setError(`File size exceeds ${maxSizeInMB}MB limit.`);
//         return;
//       }
//       setFile(selectedFile);
//       setError(null);
//     }
//   };

//   // Handle PDF upload to S3
//   const handlePDFUpload = async () => {
//     if (!file) {
//       setError('Please select a PDF file to upload.');
//       return null;
//     }

//     try {
//       debugS3Config();
//       console.log("S3 Client:", s3Client ? "Initialized" : "Not Initialized");
//       const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
//       const region = import.meta.env.VITE_AWS_REGION;
//       if (!bucketName || !region) {
//         throw new Error("Missing AWS config: Check VITE_S3_BUCKET_NAME and VITE_AWS_REGION");
//       }

//       const fileKey = `materials/${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
//       const fileBuffer = await file.arrayBuffer();
//       const params = {
//         Bucket: bucketName,
//         Key: fileKey,
//         Body: new Uint8Array(fileBuffer),
//         ContentType: file.type,
//         // Optionally set ACL or metadata if needed
//       };
//       console.log("Upload Params:", params);

//       const uploadResult = await s3Client.send(new PutObjectCommand(params));
//       console.log("Upload Success:", uploadResult);

//       const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;
//       setError(null);
//       return fileUrl;
//     } catch (error) {
//       console.error("S3 Upload Error Details:", {
//         message: error.message,
//         name: error.name,
//         stack: error.stack,
//       });
//       let errorMessage = "Failed to upload PDF: ";
//       if (error.name === "TypeError" && error.message === "Failed to fetch") {
//         errorMessage += "Network or CORS issue. Check your internet, CORS settings, or AWS credentials.";
//       } else if (error.name === "CredentialsError") {
//         errorMessage += "Invalid AWS credentials.";
//       } else {
//         errorMessage += error.message;
//       }
//       setError(errorMessage);
//       return null;
//     }
//   };

//   // Handle continue (upload to S3 and save to Firestore)
//   const handleContinue = async () => {
//     if (!selectedType) {
//       setError('Please select a material type.');
//       return;
//     }

//     if (selectedType === 'PDF') {
//       if (!file) {
//         setError('Please select a PDF file to upload.');
//         return;
//       }

//       setUploading(true);
//       setError(null);

//       try {
//         // Upload the PDF to S3
//         const fileUrl = await handlePDFUpload();
//         if (!fileUrl) return;

//         // Save material metadata to Firestore
//         await addDoc(collection(db, `curriculums/${curriculumId}/sections/${sectionId}/materials`), {
//           type: selectedType,
//           name: file.name, // Use the original file name as the material name
//           url: fileUrl, // Store the S3 URL
//           createdAt: new Date(),
//         });

//         setUploading(false);
//         onClose();
//       } catch (err) {
//         console.error('Error saving material to Firestore:', err);
//         setError('Failed to save material. Please try again.');
//         setUploading(false);
//       }
//     } else {
//       // Placeholder for other material types
//       alert(`Proceeding with material type: ${selectedType}`);
//       onClose();
//     }
//   };

//   // If the modal is not open, return null
//   if (!isOpen) return null;

//   return (
//     <div style={styles.modalOverlay}>
//       <div style={styles.modal}>
//         {/* Modal Header */}
//         <div style={styles.modalHeader}>
//           <h3>Add Material</h3>
//           <button onClick={onClose} style={styles.closeButton} disabled={uploading}>
//             ✕
//           </button>
//         </div>

//         {/* Modal Content */}
//         <div style={styles.modalContent}>
//           <p style={styles.subTitle}>Select material type or Clone from existing library</p>
//           <div style={styles.materialGrid}>
//             {materialTypes.map((material) => (
//               <div
//                 key={material.type}
//                 style={{
//                   ...styles.materialItem,
//                   backgroundColor: selectedType === material.type ? '#e0e7ff' : '#fff',
//                 }}
//                 onClick={() => handleTypeSelect(material.type)}
//               >
//                 <span style={styles.materialIcon}>{material.icon}</span>
//                 <span style={styles.materialLabel}>{material.type}</span>
//               </div>
//             ))}
//           </div>

//           {/* Show file input if PDF is selected */}
//           {selectedType === 'PDF' && (
//             <div style={styles.fileInputContainer}>
//               <label style={styles.label}>Upload PDF</label>
//               <input
//                 type="file"
//                 accept="application/pdf"
//                 onChange={handleFileChange}
//                 style={styles.fileInput}
//                 disabled={uploading}
//               />
//               {file && <p style={styles.fileName}>Selected file: {file.name}</p>}
//             </div>
//           )}

//           <p style={styles.note}>
//             If you don't see your format listed here, please upload it as a zip file.
//           </p>

//           {/* Error Message */}
//           {error && <div style={styles.errorMessage}>{error}</div>}
//         </div>

//         {/* Form Actions */}
//         <div style={styles.formActions}>
//           <button onClick={onClose} style={styles.cancelButton} disabled={uploading}>
//             Cancel
//           </button>
//           <button onClick={handleContinue} style={styles.continueButton} disabled={uploading}>
//             {uploading ? 'Uploading...' : 'Continue'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Inline styles
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
//   modalContent: {
//     flex: 1,
//   },
//   subTitle: {
//     fontSize: '14px',
//     color: '#333',
//     marginBottom: '20px',
//   },
//   materialGrid: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(4, 1fr)',
//     gap: '10px',
//     marginBottom: '20px',
//   },
//   materialItem: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     padding: '10px',
//     border: '1px solid #ddd',
//     borderRadius: '5px',
//     cursor: 'pointer',
//     transition: 'background-color 0.2s',
//   },
//   materialIcon: {
//     fontSize: '24px',
//     marginBottom: '5px',
//   },
//   materialLabel: {
//     fontSize: '12px',
//     textAlign: 'center',
//   },
//   note: {
//     fontSize: '12px',
//     color: '#666',
//   },
//   fileInputContainer: {
//     marginBottom: '20px',
//   },
//   label: {
//     display: 'block',
//     fontSize: '14px',
//     marginBottom: '5px',
//   },
//   fileInput: {
//     width: '100%',
//     padding: '8px',
//     borderRadius: '5px',
//     border: '1px solid #ddd',
//     boxSizing: 'border-box',
//   },
//   fileName: {
//     fontSize: '12px',
//     color: '#666',
//     marginTop: '5px',
//   },
//   errorMessage: {
//     color: 'red',
//     fontSize: '14px',
//     marginBottom: '10px',
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
//   continueButton: {
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

// export default AddMaterialModal;


// src/AddMaterialModal.js
import React, { useState } from 'react';
import { db } from '../../../../config/firebase'; // Adjust the path to your firebase.js file
import { collection, addDoc } from 'firebase/firestore';
import { s3Client, debugS3Config } from '../../../../config/aws-config'; // Import the S3 configuration
import { PutObjectCommand } from '@aws-sdk/client-s3';

const AddMaterialModal = ({ isOpen, onClose, curriculumId, sectionId }) => {
  const [view, setView] = useState('typeSelection'); // 'typeSelection' or 'pdfConfig'
  const [selectedType, setSelectedType] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [materialData, setMaterialData] = useState({
    name: '',
    description: '',
    maxViews: 'Unlimited',
    isPrerequisite: false,
    allowDownload: false,
    enableWatermark: false,
    accessOn: 'Both', // 'Both' or 'App'
  });

  // List of material types with their icons (using emojis for simplicity)
  const materialTypes = [
    { type: 'Video', icon: '🎥' },
    { type: 'Audio', icon: '🎙️' },
    { type: 'PDF', icon: '📄' },
    { type: 'Youtube', icon: '▶️' },
    { type: 'Image', icon: '🖼️' },
    { type: 'Doc', icon: '📜' },
    { type: 'Sheet', icon: '📊' },
    { type: 'Slide', icon: '📑' },
    { type: 'Text/HTML', icon: '📝' },
    { type: 'Zip', icon: '🗜️' },
    { type: 'Scorm Zip', icon: '📦' },
    { type: 'Link', icon: '🔗' },
    { type: 'Exercise', icon: '🏋️' },
    { type: 'Assignment', icon: '📋' },
    { type: 'Programming Assignment', icon: '💻' },
    { type: 'Form', icon: '📋' },
  ];

  // Handle material type selection
  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setError(null);
  };

  // Handle continue from type selection view
  const handleContinue = () => {
    if (!selectedType) {
      setError('Please select a material type.');
      return;
    }

    if (selectedType === 'PDF') {
      setView('pdfConfig'); // Transition to PDF configuration view
    } else {
      // Placeholder for other material types
      alert(`Proceeding with material type: ${selectedType}`);
      onClose();
    }
  };

  // Handle back to type selection view
  const handleBack = () => {
    setView('typeSelection');
    setSelectedType(null);
    setFile(null);
    setError(null);
    setMaterialData({
      name: '',
      description: '',
      maxViews: 'Unlimited',
      isPrerequisite: false,
      allowDownload: false,
      enableWatermark: false,
      accessOn: 'Both',
    });
  };

  // Handle file selection with validation
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      if (selectedFile.type !== 'application/pdf') {
        setFile(null);
        setError('Please select a valid PDF file.');
        return;
      }
      // Validate file size (max 100MB as per the image)
      const maxSizeInMB = 100;
      if (selectedFile.size > maxSizeInMB * 1024 * 1024) {
        setFile(null);
        setError(`File size exceeds ${maxSizeInMB}MB limit.`);
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  // Handle input changes for material data
  const handleMaterialDataChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMaterialData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle PDF upload to S3
  const handlePDFUpload = async () => {
    if (!file) {
      setError('Please select a PDF file to upload.');
      return null;
    }

    try {
      debugS3Config();
      console.log("S3 Client:", s3Client ? "Initialized" : "Not Initialized");
      const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
      const region = import.meta.env.VITE_AWS_REGION;
      if (!bucketName || !region) {
        throw new Error("Missing AWS config: Check VITE_S3_BUCKET_NAME and VITE_AWS_REGION");
      }

      const fileKey = `materials/${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
      const fileBuffer = await file.arrayBuffer();
      const params = {
        Bucket: bucketName,
        Key: fileKey,
        Body: new Uint8Array(fileBuffer),
        ContentType: file.type,
      };
      console.log("Upload Params:", params);

      const uploadResult = await s3Client.send(new PutObjectCommand(params));
      console.log("Upload Success:", uploadResult);

      const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;
      setError(null);
      return fileUrl;
    } catch (error) {
      console.error("S3 Upload Error Details:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
      let errorMessage = "Failed to upload PDF: ";
      if (error.name === "TypeError" && error.message === "Failed to fetch") {
        errorMessage += "Network or CORS issue. Check your internet, CORS settings, or AWS credentials.";
      } else if (error.name === "CredentialsError") {
        errorMessage += "Invalid AWS credentials.";
      } else {
        errorMessage += error.message;
      }
      setError(errorMessage);
      return null;
    }
  };

  // Handle adding the material
  const handleAddMaterial = async () => {
    if (!materialData.name) {
      setError('Please enter a material name.');
      return;
    }
    if (!file) {
      setError('Please upload a PDF file.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Upload the PDF to S3
      const fileUrl = await handlePDFUpload();
      if (!fileUrl) return;

      // Save material metadata to Firestore
      await addDoc(collection(db, `curriculums/${curriculumId}/sections/${sectionId}/materials`), {
        type: selectedType,
        name: materialData.name,
        description: materialData.description,
        url: fileUrl,
        maxViews: materialData.maxViews === 'Unlimited' ? null : parseInt(materialData.maxViews, 10),
        isPrerequisite: materialData.isPrerequisite,
        allowDownload: materialData.allowDownload,
        enableWatermark: materialData.enableWatermark,
        accessOn: materialData.accessOn,
        createdAt: new Date(),
      });

      setUploading(false);
      onClose();
    } catch (err) {
      console.error('Error saving material to Firestore:', err);
      setError('Failed to save material. Please try again.');
      setUploading(false);
    }
  };

  // If the modal is not open, return null
  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        {/* Modal Header */}
        <div style={styles.modalHeader}>
          <h3>Add Material</h3>
          <button onClick={onClose} style={styles.closeButton} disabled={uploading}>
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div style={styles.modalContent}>
          {view === 'typeSelection' && (
            <>
              <p style={styles.subTitle}>Select material type or Clone from existing library</p>
              <div style={styles.materialGrid}>
                {materialTypes.map((material) => (
                  <div
                    key={material.type}
                    style={{
                      ...styles.materialItem,
                      backgroundColor: selectedType === material.type ? '#e0e7ff' : '#fff',
                    }}
                    onClick={() => handleTypeSelect(material.type)}
                  >
                    <span style={styles.materialIcon}>{material.icon}</span>
                    <span style={styles.materialLabel}>{material.type}</span>
                  </div>
                ))}
              </div>
              <p style={styles.note}>
                If you don't see your format listed here, please upload it as a zip file.
              </p>
              {error && <div style={styles.errorMessage}>{error}</div>}
            </>
          )}

          {view === 'pdfConfig' && (
            <>
              <p style={styles.subTitle}>
                Type: PDF <span style={styles.changeLink} onClick={handleBack}>Change</span>
              </p>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Material Name <span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={materialData.name}
                  onChange={handleMaterialDataChange}
                  placeholder="Enter a name for this file"
                  style={styles.input}
                  maxLength={100}
                  disabled={uploading}
                />
                <span style={styles.charCount}>{materialData.name.length} / 100</span>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span
                    style={styles.addDescription}
                    onClick={() =>
                      setMaterialData((prev) => ({
                        ...prev,
                        description: prev.description ? '' : ' ',
                      }))
                    }
                  >
                    + Add Description (Optional)
                  </span>
                </label>
                {materialData.description !== '' && (
                  <textarea
                    name="description"
                    value={materialData.description}
                    onChange={handleMaterialDataChange}
                    placeholder="Enter a description"
                    style={styles.textarea}
                    disabled={uploading}
                  />
                )}
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Upload file <span style={styles.required}>*</span>
                </label>
                <div style={styles.uploadBox}>
                  {file ? (
                    <p style={styles.fileName}>Selected file: {file.name}</p>
                  ) : (
                    <>
                      <span style={styles.uploadIcon}>☁️</span>
                      <p>Upload file (.pdf)</p>
                      <p style={styles.uploadNote}>Max file size supported is 100MB</p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    style={styles.fileInputOverlay}
                    disabled={uploading}
                  />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Maximum views <span style={styles.required}>*</span>
                </label>
                <select
                  name="maxViews"
                  value={materialData.maxViews}
                  onChange={handleMaterialDataChange}
                  style={styles.select}
                  disabled={uploading}
                >
                  <option value="Unlimited">Unlimited</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>More Options</label>
                <div style={styles.checkboxGroup}>
                  <label style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="isPrerequisite"
                      checked={materialData.isPrerequisite}
                      onChange={handleMaterialDataChange}
                      disabled={uploading}
                    />
                    Make this a prerequisite
                  </label>
                  <label style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="allowDownload"
                      checked={materialData.allowDownload}
                      onChange={handleMaterialDataChange}
                      disabled={uploading}
                    />
                    Enable download
                  </label>
                  <label style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="enableWatermark"
                      checked={materialData.enableWatermark}
                      onChange={handleMaterialDataChange}
                      disabled={uploading}
                    />
                    Enable watermark
                  </label>
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Allow access on</label>
                <div style={styles.radioGroup}>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="accessOn"
                      value="Both"
                      checked={materialData.accessOn === 'Both'}
                      onChange={handleMaterialDataChange}
                      disabled={uploading}
                    />
                    Both
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="accessOn"
                      value="App"
                      checked={materialData.accessOn === 'App'}
                      onChange={handleMaterialDataChange}
                      disabled={uploading}
                    />
                    App
                  </label>
                </div>
              </div>
              {error && <div style={styles.errorMessage}>{error}</div>}
            </>
          )}
        </div>

        {/* Form Actions */}
        <div style={styles.formActions}>
          {view === 'typeSelection' ? (
            <>
              <button onClick={onClose} style={styles.cancelButton} disabled={uploading}>
                Cancel
              </button>
              <button onClick={handleContinue} style={styles.continueButton} disabled={uploading}>
                Continue
              </button>
            </>
          ) : (
            <>
              <button onClick={handleBack} style={styles.backButton} disabled={uploading}>
                Back
              </button>
              <button onClick={handleAddMaterial} style={styles.addButton} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Add Material'}
              </button>
            </>
          )}
        </div>
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
  modalContent: {
    flex: 1,
  },
  subTitle: {
    fontSize: '14px',
    color: '#333',
    marginBottom: '20px',
  },
  changeLink: {
    color: '#007bff',
    cursor: 'pointer',
    marginLeft: '10px',
  },
  materialGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px',
    marginBottom: '20px',
  },
  materialItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  materialIcon: {
    fontSize: '24px',
    marginBottom: '5px',
  },
  materialLabel: {
    fontSize: '12px',
    textAlign: 'center',
  },
  note: {
    fontSize: '12px',
    color: '#666',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    marginBottom: '5px',
    fontWeight: 'bold',
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
  },
  charCount: {
    fontSize: '12px',
    color: '#666',
    textAlign: 'right',
    marginTop: '5px',
  },
  addDescription: {
    color: '#007bff',
    cursor: 'pointer',
  },
  uploadBox: {
    border: '2px dashed #ddd',
    borderRadius: '5px',
    padding: '20px',
    textAlign: 'center',
    position: 'relative',
  },
  uploadIcon: {
    fontSize: '24px',
    color: '#666',
  },
  uploadNote: {
    fontSize: '12px',
    color: '#666',
  },
  fileInputOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
  },
  fileName: {
    fontSize: '12px',
    color: '#666',
    marginTop: '5px',
  },
  select: {
    width: '100%',
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    boxSizing: 'border-box',
  },
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
  },
  radioGroup: {
    display: 'flex',
    gap: '20px',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
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
  continueButton: {
    padding: '8px 15px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  backButton: {
    padding: '8px 15px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  addButton: {
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

export default AddMaterialModal;