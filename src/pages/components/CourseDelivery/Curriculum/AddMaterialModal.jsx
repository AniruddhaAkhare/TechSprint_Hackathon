// // // // import React, { useState } from 'react';
// // // // import { db } from '../../../../config/firebase';
// // // // import { collection, addDoc } from 'firebase/firestore';
// // // // import { s3Client, debugS3Config } from '../../../../config/aws-config';
// // // // import { Upload } from '@aws-sdk/lib-storage'; // Import the Upload class for multipart uploads

// // // // const AddMaterialModal = ({ isOpen, onClose, curriculumId, sectionId }) => {
// // // //   const [view, setView] = useState('typeSelection');
// // // //   const [selectedType, setSelectedType] = useState(null);
// // // //   const [file, setFile] = useState(null);
// // // //   const [uploading, setUploading] = useState(false);
// // // //   const [uploadProgress, setUploadProgress] = useState(0);
// // // //   const [error, setError] = useState(null);
// // // //   const [materialData, setMaterialData] = useState({
// // // //     name: '',
// // // //     description: '',
// // // //     maxViews: 'Unlimited',
// // // //     isPrerequisite: false,
// // // //     allowDownload: false,
// // // //     accessOn: 'Both',
// // // //   });

// // // //   const materialTypes = [
// // // //     { type: 'Video', icon: '🎥' },
// // // //     { type: 'Audio', icon: '🎙️' },
// // // //     { type: 'PDF', icon: '📄' },
// // // //     { type: 'Youtube', icon: '▶️' },
// // // //     { type: 'Image', icon: '🖼️' },
// // // //     { type: 'Doc', icon: '📜' },
// // // //     { type: 'Sheet', icon: '📊' },
// // // //     { type: 'Slide', icon: '📑' },
// // // //     { type: 'Text/HTML', icon: '📝' },
// // // //     { type: 'Zip', icon: '🗜️' },
// // // //     { type: 'Scorm Zip', icon: '📦' },
// // // //     { type: 'Link', icon: '🔗' },
// // // //     { type: 'Exercise', icon: '🏋️' },
// // // //     { type: 'Assignment', icon: '📋' },
// // // //     { type: 'Programming Assignment', icon: '💻' },
// // // //     { type: 'Form', icon: '📋' },
// // // //   ];

// // // //   const handleTypeSelect = (type) => {
// // // //     setSelectedType(type);
// // // //     setError(null);
// // // //   };

// // // //   const handleContinue = () => {
// // // //     if (!selectedType) {
// // // //       setError('Please select a material type.');
// // // //       return;
// // // //     }

// // // //     if (selectedType === 'PDF') {
// // // //       setView('pdfConfig');
// // // //     } else if (selectedType === 'Video') {
// // // //       setView('videoConfig');
// // // //     } else {
// // // //       alert(`Proceeding with material type: ${selectedType}`);
// // // //       onClose();
// // // //     }
// // // //   };

// // // //   const handleBack = () => {
// // // //     if (uploading) return; // Prevent going back while uploading
// // // //     setView('typeSelection');
// // // //     setSelectedType(null);
// // // //     setFile(null);
// // // //     setError(null);
// // // //     setUploadProgress(0);
// // // //     setMaterialData({
// // // //       name: '',
// // // //       description: '',
// // // //       maxViews: 'Unlimited',
// // // //       isPrerequisite: false,
// // // //       allowDownload: false,
// // // //       accessOn: 'Both',
// // // //     });
// // // //   };

// // // //   const handleFileChange = (e) => {
// // // //     const selectedFile = e.target.files[0];
// // // //     if (selectedFile) {
// // // //       if (view === 'pdfConfig') {
// // // //         if (selectedFile.type !== 'application/pdf') {
// // // //           setFile(null);
// // // //           setError('Please select a valid PDF file.');
// // // //           return;
// // // //         }
// // // //         const maxSizeInMB = 100;
// // // //         if (selectedFile.size > maxSizeInMB * 1024 * 1024) {
// // // //           setFile(null);
// // // //           setError(`File size exceeds ${maxSizeInMB}MB limit.`);
// // // //           return;
// // // //         }
// // // //       } else if (view === 'videoConfig') {
// // // //         const allowedTypes = ['video/mp4', 'video/mpeg', 'video/webm'];
// // // //         if (!allowedTypes.includes(selectedFile.type)) {
// // // //           setFile(null);
// // // //           setError('Please select a valid video file (.mp4, .mpeg, or .webm).');
// // // //           return;
// // // //         }
// // // //         const maxSizeInMB = 100;
// // // //         if (selectedFile.size > maxSizeInMB * 1024 * 1024) {
// // // //           setFile(null);
// // // //           setError(`File size exceeds ${maxSizeInMB}MB limit.`);
// // // //           return;
// // // //         }
// // // //       }
// // // //       setFile(selectedFile);
// // // //       setError(null);
// // // //     }
// // // //   };

// // // //   const handleMaterialDataChange = (e) => {
// // // //     const { name, value, type, checked } = e.target;
// // // //     setMaterialData((prev) => ({
// // // //       ...prev,
// // // //       [name]: type === 'checkbox' ? checked : value,
// // // //     }));
// // // //   };

// // // //   const handleFileUpload = async () => {
// // // //     if (!file) {
// // // //       setError('Please select a file to upload.');
// // // //       return null;
// // // //     }

// // // //     try {
// // // //       debugS3Config();
// // // //       console.log("S3 Client:", s3Client ? "Initialized" : "Not Initialized");
// // // //       const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
// // // //       const region = import.meta.env.VITE_AWS_REGION;
// // // //       if (!bucketName || !region) {
// // // //         throw new Error("Missing AWS config: Check VITE_S3_BUCKET_NAME and VITE_AWS_REGION in your .env file");
// // // //       }

// // // //       const fileKey = `materials/${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
// // // //       const upload = new Upload({
// // // //         client: s3Client,
// // // //         params: {
// // // //           Bucket: bucketName,
// // // //           Key: fileKey,
// // // //           Body: file, // Pass the file directly for multipart upload
// // // //           ContentType: file.type,
// // // //         },
// // // //         partSize: 5 * 1024 * 1024, // 5MB parts (minimum for S3 multipart upload)
// // // //         queueSize: 4, // Number of concurrent uploads
// // // //       });

// // // //       // Track upload progress
// // // //       upload.on('httpUploadProgress', (progress) => {
// // // //         const uploaded = progress.loaded || 0;
// // // //         const total = progress.total || 1;
// // // //         const percentage = (uploaded / total) * 100;
// // // //         setUploadProgress(percentage);
// // // //         console.log(`Upload Progress: ${Math.round(percentage)}%`);
// // // //       });

// // // //       // Perform the upload
// // // //       const uploadResult = await upload.done();
// // // //       console.log("Upload Success:", uploadResult);

// // // //       const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;
// // // //       setError(null);
// // // //       setUploadProgress(0);
// // // //       return fileUrl;
// // // //     } catch (error) {
// // // //       console.error("S3 Upload Error Details:", {
// // // //         message: error.message,
// // // //         name: error.name,
// // // //         stack: error.stack,
// // // //         code: error.code,
// // // //       });
// // // //       let errorMessage = "Failed to upload file to S3: ";
// // // //       if (error.name === "CredentialsError") {
// // // //         errorMessage += "Invalid AWS credentials. Check your AWS access key and secret key.";
// // // //       } else if (error.name === "NoSuchBucket") {
// // // //         errorMessage += `The bucket "${import.meta.env.VITE_S3_BUCKET_NAME}" does not exist.`;
// // // //       } else if (error.message.includes("CORS")) {
// // // //         errorMessage += "CORS issue. Ensure your S3 bucket's CORS policy allows uploads.";
// // // //       } else if (error.message.includes("Access Denied")) {
// // // //         errorMessage += "Access denied. Check your S3 bucket permissions and IAM role.";
// // // //       } else {
// // // //         errorMessage += error.message;
// // // //       }
// // // //       setError(errorMessage);
// // // //       setUploadProgress(0);
// // // //       return null;
// // // //     }
// // // //   };

// // // //   const handleAddMaterial = async () => {
// // // //     if (!materialData.name) {
// // // //       setError('Please enter a material name.');
// // // //       return;
// // // //     }
// // // //     if (!file) {
// // // //       setError('Please upload a file.');
// // // //       return;
// // // //     }

// // // //     setUploading(true);
// // // //     setError(null);

// // // //     try {
// // // //       const fileUrl = await handleFileUpload();
// // // //       if (!fileUrl) {
// // // //         setUploading(false);
// // // //         return;
// // // //       }

// // // //       await addDoc(collection(db, `curriculums/${curriculumId}/sections/${sectionId}/materials`), {
// // // //         type: selectedType,
// // // //         name: materialData.name,
// // // //         description: materialData.description,
// // // //         url: fileUrl,
// // // //         maxViews: materialData.maxViews === 'Unlimited' ? null : parseInt(materialData.maxViews, 10),
// // // //         isPrerequisite: materialData.isPrerequisite,
// // // //         allowDownload: materialData.allowDownload,
// // // //         accessOn: materialData.accessOn,
// // // //         createdAt: new Date(),
// // // //       });

// // // //       setUploading(false);
// // // //       onClose();
// // // //     } catch (err) {
// // // //       console.error('Error saving material to Firestore:', err);
// // // //       setError('Failed to save material to Firestore. Please try again.');
// // // //       setUploading(false);
// // // //     }
// // // //   };

// // // //   if (!isOpen) return null;

// // // //   return (
// // // //     <div style={styles.modalOverlay}>
// // // //       <div style={styles.modal}>
// // // //         <div style={styles.modalHeader}>
// // // //           <h3>Add Material</h3>
// // // //           <button onClick={onClose} style={styles.closeButton} disabled={uploading}>
// // // //             ✕
// // // //           </button>
// // // //         </div>

// // // //         <div style={styles.modalContent}>
// // // //           {view === 'typeSelection' && (
// // // //             <>
// // // //               <p style={styles.subTitle}>Select material type or Clone from existing library</p>
// // // //               <div style={styles.materialGrid}>
// // // //                 {materialTypes.map((material) => (
// // // //                   <div
// // // //                     key={material.type}
// // // //                     style={{
// // // //                       ...styles.materialItem,
// // // //                       backgroundColor: selectedType === material.type ? '#e0e7ff' : '#fff',
// // // //                     }}
// // // //                     onClick={() => handleTypeSelect(material.type)}
// // // //                   >
// // // //                     <span style={styles.materialIcon}>{material.icon}</span>
// // // //                     <span style={styles.materialLabel}>{material.type}</span>
// // // //                   </div>
// // // //                 ))}
// // // //               </div>
// // // //               <p style={styles.note}>
// // // //                 If you don't see your format listed here, please upload it as a zip file.
// // // //               </p>
// // // //               {error && <div style={styles.errorMessage}>{error}</div>}
// // // //             </>
// // // //           )}

// // // //           {view === 'pdfConfig' && (
// // // //             <>
// // // //               <p style={styles.subTitle}>
// // // //                 Type: PDF <span style={styles.changeLink} onClick={handleBack}>Change</span>
// // // //               </p>
// // // //               <div style={styles.formGroup}>
// // // //                 <label style={styles.label}>
// // // //                   Material Name <span style={styles.required}>*</span>
// // // //                 </label>
// // // //                 <input
// // // //                   type="text"
// // // //                   name="name"
// // // //                   value={materialData.name}
// // // //                   onChange={handleMaterialDataChange}
// // // //                   placeholder="Enter a name for this file"
// // // //                   style={styles.input}
// // // //                   maxLength={100}
// // // //                   disabled={uploading}
// // // //                 />
// // // //                 <span style={styles.charCount}>{materialData.name.length} / 100</span>
// // // //               </div>
// // // //               <div style={styles.formGroup}>
// // // //                 <label style={styles.label}>
// // // //                   <span
// // // //                     style={styles.addDescription}
// // // //                     onClick={() =>
// // // //                       setMaterialData((prev) => ({
// // // //                         ...prev,
// // // //                         description: prev.description ? '' : ' ',
// // // //                       }))
// // // //                     }
// // // //                   >
// // // //                     + Add Description (Optional)
// // // //                   </span>
// // // //                 </label>
// // // //                 {materialData.description !== '' && (
// // // //                   <textarea
// // // //                     name="description"
// // // //                     value={materialData.description}
// // // //                     onChange={handleMaterialDataChange}
// // // //                     placeholder="Enter a description"
// // // //                     style={styles.textarea}
// // // //                     disabled={uploading}
// // // //                   />
// // // //                 )}
// // // //               </div>
// // // //               <div style={styles.formGroup}>
// // // //                 <label style={styles.label}>
// // // //                   Upload file <span style={styles.required}>*</span>
// // // //                 </label>
// // // //                 <div style={styles.uploadBox}>
// // // //                   {file ? (
// // // //                     <p style={styles.fileName}>Selected file: {file.name}</p>
// // // //                   ) : (
// // // //                     <>
// // // //                       <span style={styles.uploadIcon}>☁️</span>
// // // //                       <p>Upload file (.pdf)</p>
// // // //                       <p style={styles.uploadNote}>Max file size supported is 100MB</p>
// // // //                     </>
// // // //                   )}
// // // //                   <input
// // // //                     type="file"
// // // //                     accept="application/pdf"
// // // //                     onChange={handleFileChange}
// // // //                     style={styles.fileInputOverlay}
// // // //                     disabled={uploading}
// // // //                   />
// // // //                 </div>
// // // //               </div>
// // // //               <div style={styles.formGroup}>
// // // //                 <label style={styles.label}>
// // // //                   Maximum views <span style={styles.required}>*</span>
// // // //                 </label>
// // // //                 <select
// // // //                   name="maxViews"
// // // //                   value={materialData.maxViews}
// // // //                   onChange={handleMaterialDataChange}
// // // //                   style={styles.select}
// // // //                   disabled={uploading}
// // // //                 >
// // // //                   <option value="Unlimited">Unlimited</option>
// // // //                   <option value="1">1</option>
// // // //                   <option value="2">2</option>
// // // //                   <option value="3">3</option>
// // // //                   <option value="5">5</option>
// // // //                   <option value="10">10</option>
// // // //                 </select>
// // // //               </div>
// // // //               <div style={styles.formGroup}>
// // // //                 <label style={styles.label}>More Options</label>
// // // //                 <div style={styles.checkboxGroup}>
// // // //                   <label style={styles.checkboxLabel}>
// // // //                     <input
// // // //                       type="checkbox"
// // // //                       name="isPrerequisite"
// // // //                       checked={materialData.isPrerequisite}
// // // //                       onChange={handleMaterialDataChange}
// // // //                       disabled={uploading}
// // // //                     />
// // // //                     Make this a prerequisite
// // // //                   </label>
// // // //                   <label style={styles.checkboxLabel}>
// // // //                     <input
// // // //                       type="checkbox"
// // // //                       name="allowDownload"
// // // //                       checked={materialData.allowDownload}
// // // //                       onChange={handleMaterialDataChange}
// // // //                       disabled={uploading}
// // // //                     />
// // // //                     Enable download
// // // //                   </label>
// // // //                 </div>
// // // //               </div>
// // // //               <div style={styles.formGroup}>
// // // //                 <label style={styles.label}>Allow access on</label>
// // // //                 <div style={styles.radioGroup}>
// // // //                   <label style={styles.radioLabel}>
// // // //                     <input
// // // //                       type="radio"
// // // //                       name="accessOn"
// // // //                       value="Both"
// // // //                       checked={materialData.accessOn === 'Both'}
// // // //                       onChange={handleMaterialDataChange}
// // // //                       disabled={uploading}
// // // //                     />
// // // //                     Both
// // // //                   </label>
// // // //                   <label style={styles.radioLabel}>
// // // //                     <input
// // // //                       type="radio"
// // // //                       name="accessOn"
// // // //                       value="App"
// // // //                       checked={materialData.accessOn === 'App'}
// // // //                       onChange={handleMaterialDataChange}
// // // //                       disabled={uploading}
// // // //                     />
// // // //                     App
// // // //                   </label>
// // // //                 </div>
// // // //               </div>
// // // //               {error && <div style={styles.errorMessage}>{error}</div>}
// // // //               {uploading && (
// // // //                 <div style={styles.progressBar}>
// // // //                   <div style={{ ...styles.progressFill, width: `${uploadProgress}%` }} />
// // // //                   <span style={styles.progressText}>{Math.round(uploadProgress)}%</span>
// // // //                 </div>
// // // //               )}
// // // //             </>
// // // //           )}

// // // //           {view === 'videoConfig' && (
// // // //             <>
// // // //               <p style={styles.subTitle}>
// // // //                 Type: Video <span style={styles.changeLink} onClick={handleBack}>Change</span>
// // // //               </p>
// // // //               <div style={styles.formGroup}>
// // // //                 <label style={styles.label}>
// // // //                   Material Name <span style={styles.required}>*</span>
// // // //                 </label>
// // // //                 <input
// // // //                   type="text"
// // // //                   name="name"
// // // //                   value={materialData.name}
// // // //                   onChange={handleMaterialDataChange}
// // // //                   placeholder="Enter a name for this file"
// // // //                   style={styles.input}
// // // //                   maxLength={100}
// // // //                   disabled={uploading}
// // // //                 />
// // // //                 <span style={styles.charCount}>{materialData.name.length} / 100</span>
// // // //               </div>
// // // //               <div style={styles.formGroup}>
// // // //                 <label style={styles.label}>
// // // //                   <span
// // // //                     style={styles.addDescription}
// // // //                     onClick={() =>
// // // //                       setMaterialData((prev) => ({
// // // //                         ...prev,
// // // //                         description: prev.description ? '' : ' ',
// // // //                       }))
// // // //                     }
// // // //                   >
// // // //                     + Add Description (Optional)
// // // //                   </span>
// // // //                 </label>
// // // //                 {materialData.description !== '' && (
// // // //                   <textarea
// // // //                     name="description"
// // // //                     value={materialData.description}
// // // //                     onChange={handleMaterialDataChange}
// // // //                     placeholder="Enter a description"
// // // //                     style={styles.textarea}
// // // //                     disabled={uploading}
// // // //                   />
// // // //                 )}
// // // //               </div>
// // // //               <div style={styles.formGroup}>
// // // //                 <label style={styles.label}>
// // // //                   Upload file <span style={styles.required}>*</span>
// // // //                 </label>
// // // //                 <div style={styles.uploadBox}>
// // // //                   {file ? (
// // // //                     <p style={styles.fileName}>Selected file: {file.name}</p>
// // // //                   ) : (
// // // //                     <>
// // // //                       <span style={styles.uploadIcon}>☁️</span>
// // // //                       <p>Upload file (.mp4, .mpeg or .webm)</p>
// // // //                       <p style={styles.uploadNote}>
// // // //                         <a href="#" style={styles.uploadLink}>Choose from library</a>
// // // //                       </p>
// // // //                     </>
// // // //                   )}
// // // //                   <input
// // // //                     type="file"
// // // //                     accept="video/mp4,video/mpeg,video/webm"
// // // //                     onChange={handleFileChange}
// // // //                     style={styles.fileInputOverlay}
// // // //                     disabled={uploading}
// // // //                   />
// // // //                 </div>
// // // //               </div>
// // // //               <div style={styles.formGroup}>
// // // //                 <label style={styles.label}>
// // // //                   Maximum views <span style={styles.required}>*</span>
// // // //                 </label>
// // // //                 <select
// // // //                   name="maxViews"
// // // //                   value={materialData.maxViews}
// // // //                   onChange={handleMaterialDataChange}
// // // //                   style={styles.select}
// // // //                   disabled={uploading}
// // // //                 >
// // // //                   <option value="Unlimited">Unlimited</option>
// // // //                   <option value="1">1</option>
// // // //                   <option value="2">2</option>
// // // //                   <option value="3">3</option>
// // // //                   <option value="5">5</option>
// // // //                   <option value="10">10</option>
// // // //                 </select>
// // // //               </div>
// // // //               <div style={styles.formGroup}>
// // // //                 <label style={styles.label}>More Options</label>
// // // //                 <div style={styles.checkboxGroup}>
// // // //                   <label style={styles.checkboxLabel}>
// // // //                     <input
// // // //                       type="checkbox"
// // // //                       name="isPrerequisite"
// // // //                       checked={materialData.isPrerequisite}
// // // //                       onChange={handleMaterialDataChange}
// // // //                       disabled={uploading}
// // // //                     />
// // // //                     Make this a prerequisite
// // // //                   </label>
// // // //                   <label style={styles.checkboxLabel}>
// // // //                     <input
// // // //                       type="checkbox"
// // // //                       name="allowDownload"
// // // //                       checked={materialData.allowDownload}
// // // //                       onChange={handleMaterialDataChange}
// // // //                       disabled={uploading}
// // // //                     />
// // // //                     Enable download
// // // //                   </label>
// // // //                 </div>
// // // //               </div>
// // // //               <div style={styles.formGroup}>
// // // //                 <label style={styles.label}>Allow access on</label>
// // // //                 <div style={styles.radioGroup}>
// // // //                   <label style={styles.radioLabel}>
// // // //                     <input
// // // //                       type="radio"
// // // //                       name="accessOn"
// // // //                       value="Both"
// // // //                       checked={materialData.accessOn === 'Both'}
// // // //                       onChange={handleMaterialDataChange}
// // // //                       disabled={uploading}
// // // //                     />
// // // //                     Both
// // // //                   </label>
// // // //                   <label style={styles.radioLabel}>
// // // //                     <input
// // // //                       type="radio"
// // // //                       name="accessOn"
// // // //                       value="App"
// // // //                       checked={materialData.accessOn === 'App'}
// // // //                       onChange={handleMaterialDataChange}
// // // //                       disabled={uploading}
// // // //                     />
// // // //                     App
// // // //                   </label>
// // // //                 </div>
// // // //               </div>
// // // //               {error && <div style={styles.errorMessage}>{error}</div>}
// // // //               {uploading && (
// // // //                 <div style={styles.progressBar}>
// // // //                   <div style={{ ...styles.progressFill, width: `${uploadProgress}%` }} />
// // // //                   <span style={styles.progressText}>{Math.round(uploadProgress)}%</span>
// // // //                 </div>
// // // //               )}
// // // //             </>
// // // //           )}
// // // //         </div>

// // // //         <div style={styles.formActions}>
// // // //           {view === 'typeSelection' ? (
// // // //             <>
// // // //               <button onClick={onClose} style={styles.cancelButton} disabled={uploading}>
// // // //                 Cancel
// // // //               </button>
// // // //               <button onClick={handleContinue} style={styles.continueButton} disabled={uploading}>
// // // //                 Continue
// // // //               </button>
// // // //             </>
// // // //           ) : (
// // // //             <>
// // // //               <button onClick={handleBack} style={styles.backButton} disabled={uploading}>
// // // //                 Back
// // // //               </button>
// // // //               <button onClick={handleAddMaterial} style={styles.addButton} disabled={uploading}>
// // // //                 {uploading ? 'Uploading...' : 'Add Material'}
// // // //               </button>
// // // //             </>
// // // //           )}
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // // Inline styles
// // // // const styles = {
// // // //   modalOverlay: {
// // // //     position: 'fixed',
// // // //     top: 0,
// // // //     left: 0,
// // // //     right: 0,
// // // //     bottom: 0,
// // // //     backgroundColor: 'rgba(0, 0, 0, 0.5)',
// // // //     display: 'flex',
// // // //     justifyContent: 'flex-end',
// // // //     zIndex: 1000,
// // // //   },
// // // //   modal: {
// // // //     backgroundColor: '#fff',
// // // //     width: '400px',
// // // //     height: '100%',
// // // //     padding: '20px',
// // // //     boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
// // // //     animation: 'slideIn 0.3s ease-out',
// // // //   },
// // // //   modalHeader: {
// // // //     display: 'flex',
// // // //     justifyContent: 'space-between',
// // // //     alignItems: 'center',
// // // //     marginBottom: '20px',
// // // //   },
// // // //   closeButton: {
// // // //     background: 'none',
// // // //     border: 'none',
// // // //     fontSize: '16px',
// // // //     cursor: 'pointer',
// // // //   },
// // // //   modalContent: {
// // // //     flex: 1,
// // // //   },
// // // //   subTitle: {
// // // //     fontSize: '14px',
// // // //     color: '#333',
// // // //     marginBottom: '20px',
// // // //   },
// // // //   changeLink: {
// // // //     color: '#007bff',
// // // //     cursor: 'pointer',
// // // //     marginLeft: '10px',
// // // //   },
// // // //   materialGrid: {
// // // //     display: 'grid',
// // // //     gridTemplateColumns: 'repeat(4, 1fr)',
// // // //     gap: '10px',
// // // //     marginBottom: '20px',
// // // //   },
// // // //   materialItem: {
// // // //     display: 'flex',
// // // //     flexDirection: 'column',
// // // //     alignItems: 'center',
// // // //     padding: '10px',
// // // //     border: '1px solid #ddd',
// // // //     borderRadius: '5px',
// // // //     cursor: 'pointer',
// // // //     transition: 'background-color 0.2s',
// // // //   },
// // // //   materialIcon: {
// // // //     fontSize: '24px',
// // // //     marginBottom: '5px',
// // // //   },
// // // //   materialLabel: {
// // // //     fontSize: '12px',
// // // //     textAlign: 'center',
// // // //   },
// // // //   note: {
// // // //     fontSize: '12px',
// // // //     color: '#666',
// // // //   },
// // // //   formGroup: {
// // // //     marginBottom: '20px',
// // // //   },
// // // //   label: {
// // // //     display: 'block',
// // // //     fontSize: '14px',
// // // //     marginBottom: '5px',
// // // //     fontWeight: 'bold',
// // // //   },
// // // //   required: {
// // // //     color: 'red',
// // // //   },
// // // //   input: {
// // // //     width: '100%',
// // // //     padding: '8px',
// // // //     borderRadius: '5px',
// // // //     border: '1px solid #ddd',
// // // //     boxSizing: 'border-box',
// // // //   },
// // // //   textarea: {
// // // //     width: '100%',
// // // //     padding: '8px',
// // // //     borderRadius: '5px',
// // // //     border: '1px solid #ddd',
// // // //     boxSizing: 'border-box',
// // // //     minHeight: '100px',
// // // //   },
// // // //   charCount: {
// // // //     fontSize: '12px',
// // // //     color: '#666',
// // // //     textAlign: 'right',
// // // //     marginTop: '5px',
// // // //   },
// // // //   addDescription: {
// // // //     color: '#007bff',
// // // //     cursor: 'pointer',
// // // //   },
// // // //   uploadBox: {
// // // //     border: '2px dashed #ddd',
// // // //     borderRadius: '5px',
// // // //     padding: '20px',
// // // //     textAlign: 'center',
// // // //     position: 'relative',
// // // //   },
// // // //   uploadIcon: {
// // // //     fontSize: '24px',
// // // //     color: '#666',
// // // //   },
// // // //   uploadNote: {
// // // //     fontSize: '12px',
// // // //     color: '#666',
// // // //   },
// // // //   uploadLink: {
// // // //     color: '#007bff',
// // // //     textDecoration: 'underline',
// // // //   },
// // // //   fileInputOverlay: {
// // // //     position: 'absolute',
// // // //     top: 0,
// // // //     left: 0,
// // // //     width: '100%',
// // // //     height: '100%',
// // // //     opacity: 0,
// // // //     cursor: 'pointer',
// // // //   },
// // // //   fileName: {
// // // //     fontSize: '12px',
// // // //     color: '#666',
// // // //     marginTop: '5px',
// // // //   },
// // // //   select: {
// // // //     width: '100%',
// // // //     padding: '8px',
// // // //     borderRadius: '5px',
// // // //     border: '1px solid #ddd',
// // // //     boxSizing: 'border-box',
// // // //   },
// // // //   checkboxGroup: {
// // // //     display: 'flex',
// // // //     flexDirection: 'column',
// // // //     gap: '10px',
// // // //   },
// // // //   checkboxLabel: {
// // // //     display: 'flex',
// // // //     alignItems: 'center',
// // // //     fontSize: '14px',
// // // //   },
// // // //   radioGroup: {
// // // //     display: 'flex',
// // // //     gap: '20px',
// // // //   },
// // // //   radioLabel: {
// // // //     display: 'flex',
// // // //     alignItems: 'center',
// // // //     fontSize: '14px',
// // // //   },
// // // //   errorMessage: {
// // // //     color: 'red',
// // // //     fontSize: '14px',
// // // //     marginBottom: '10px',
// // // //   },
// // // //   formActions: {
// // // //     display: 'flex',
// // // //     justifyContent: 'flex-end',
// // // //     gap: '10px',
// // // //   },
// // // //   cancelButton: {
// // // //     padding: '8px 15px',
// // // //     backgroundColor: '#fff',
// // // //     border: '1px solid #ddd',
// // // //     borderRadius: '5px',
// // // //     cursor: 'pointer',
// // // //   },
// // // //   continueButton: {
// // // //     padding: '8px 15px',
// // // //     backgroundColor: '#007bff',
// // // //     color: '#fff',
// // // //     border: 'none',
// // // //     borderRadius: '5px',
// // // //     cursor: 'pointer',
// // // //   },
// // // //   backButton: {
// // // //     padding: '8px 15px',
// // // //     backgroundColor: '#fff',
// // // //     border: '1px solid #ddd',
// // // //     borderRadius: '5px',
// // // //     cursor: 'pointer',
// // // //   },
// // // //   addButton: {
// // // //     padding: '8px 15px',
// // // //     backgroundColor: '#007bff',
// // // //     color: '#fff',
// // // //     border: 'none',
// // // //     borderRadius: '5px',
// // // //     cursor: 'pointer',
// // // //   },
// // // //   progressBar: {
// // // //     width: '100%',
// // // //     backgroundColor: '#f0f0f0',
// // // //     borderRadius: '5px',
// // // //     height: '20px',
// // // //     position: 'relative',
// // // //     marginTop: '10px',
// // // //   },
// // // //   progressFill: {
// // // //     height: '100%',
// // // //     backgroundColor: '#007bff',
// // // //     borderRadius: '5px',
// // // //     transition: 'width 0.3s ease',
// // // //   },
// // // //   progressText: {
// // // //     position: 'absolute',
// // // //     top: '50%',
// // // //     left: '50%',
// // // //     transform: 'translate(-50%, -50%)',
// // // //     fontSize: '12px',
// // // //     color: '#fff',
// // // //   },
// // // // };

// // // // const styleSheet = document.createElement('style');
// // // // styleSheet.innerHTML = `
// // // //   @keyframes slideIn {
// // // //     from {
// // // //       transform: translateX(100%);
// // // //     }
// // // //     to {
// // // //       transform: translateX(0);
// // // //     }
// // // //   }
// // // // `;
// // // // document.head.appendChild(styleSheet);

// // // // export default AddMaterialModal;


// // // import React, { useState } from 'react';
// // // import { db } from '../../../../config/firebase';
// // // import { collection, addDoc } from 'firebase/firestore';
// // // import { s3Client, debugS3Config } from '../../../../config/aws-config';
// // // import { Upload } from '@aws-sdk/lib-storage';

// // // const AddMaterialModal = ({ isOpen, onClose, curriculumId, sectionId, allowedMaterialTypes }) => {
// // //   const [selectedType, setSelectedType] = useState(''); // Start with no type selected
// // //   const [file, setFile] = useState(null);
// // //   const [uploading, setUploading] = useState(false);
// // //   const [uploadProgress, setUploadProgress] = useState(0);
// // //   const [error, setError] = useState(null);
// // //   const [materialData, setMaterialData] = useState({
// // //     name: '',
// // //     description: '',
// // //     url: '', // Added for YouTube or other URL-based types
// // //     maxViews: 'Unlimited',
// // //     isPrerequisite: false,
// // //     allowDownload: false,
// // //     accessOn: 'Both',
// // //   });

// // //   // Define allowed material types (passed as prop or hardcoded if not provided)
// // //   const materialTypes = allowedMaterialTypes || [
// // //     'Video',
// // //     'PDF',
// // //     'Image',
// // //     'YouTube',
// // //     'Sheet',
// // //     'Slide',
// // //     'Assignment',
// // //     'Form',
// // //     'Zip',
// // //   ];

// // //   const handleMaterialDataChange = (e) => {
// // //     const { name, value, type, checked } = e.target;
// // //     setMaterialData((prev) => ({
// // //       ...prev,
// // //       [name]: type === 'checkbox' ? checked : value,
// // //     }));
// // //     if (name === 'url' && value && selectedType === 'YouTube') {
// // //       setFile(null); // Clear file if URL is provided for YouTube
// // //     }
// // //   };

// // //   const handleFileChange = (e) => {
// // //     const selectedFile = e.target.files[0];
// // //     if (!selectedFile || !selectedType) return;

// // //     const maxSizeInMB = 100;
// // //     if (selectedFile.size > maxSizeInMB * 1024 * 1024) {
// // //       setFile(null);
// // //       setError(`File size exceeds ${maxSizeInMB}MB limit.`);
// // //       return;
// // //     }

// // //     switch (selectedType) {
// // //       case 'Video':
// // //         if (!['video/mp4', 'video/mpeg', 'video/webm'].includes(selectedFile.type)) {
// // //           setFile(null);
// // //           setError('Please select a valid video file (.mp4, .mpeg, or .webm).');
// // //           return;
// // //         }
// // //         break;
// // //       case 'PDF':
// // //         if (selectedFile.type !== 'application/pdf') {
// // //           setFile(null);
// // //           setError('Please select a valid PDF file.');
// // //           return;
// // //         }
// // //         break;
// // //       case 'Image':
// // //         if (!selectedFile.type.startsWith('image/')) {
// // //           setFile(null);
// // //           setError('Please select a valid image file.');
// // //           return;
// // //         }
// // //         break;
// // //       case 'Sheet':
// // //         if (!['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(selectedFile.type)) {
// // //           setFile(null);
// // //           setError('Please select a valid spreadsheet file (.xls, .xlsx).');
// // //           return;
// // //         }
// // //         break;
// // //       case 'Slide':
// // //         if (!['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'].includes(selectedFile.type)) {
// // //           setFile(null);
// // //           setError('Please select a valid presentation file (.ppt, .pptx).');
// // //           return;
// // //         }
// // //         break;
// // //       case 'Assignment':
// // //       case 'Form':
// // //         if (selectedFile.type !== 'application/pdf') {
// // //           setFile(null);
// // //           setError('Please select a valid PDF file for Assignment or Form.');
// // //           return;
// // //         }
// // //         break;
// // //       case 'Zip':
// // //         if (selectedFile.type !== 'application/zip') {
// // //           setFile(null);
// // //           setError('Please select a valid ZIP file.');
// // //           return;
// // //         }
// // //         break;
// // //       default:
// // //         setFile(null);
// // //         setError('File upload not supported for this type.');
// // //         return;
// // //     }

// // //     setFile(selectedFile);
// // //     setMaterialData((prev) => ({ ...prev, url: '' })); // Clear URL if file is selected
// // //     setError(null);
// // //   };

// // //   const handleFileUpload = async () => {
// // //     if (!file) return materialData.url || null; // Return URL if no file (e.g., YouTube)

// // //     try {
// // //       debugS3Config();
// // //       const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
// // //       const region = import.meta.env.VITE_AWS_REGION;
// // //       if (!bucketName || !region) {
// // //         throw new Error('Missing AWS config: Check VITE_S3_BUCKET_NAME and VITE_AWS_REGION in your .env file');
// // //       }

// // //       const fileKey = `materials/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
// // //       const upload = new Upload({
// // //         client: s3Client,
// // //         params: {
// // //           Bucket: bucketName,
// // //           Key: fileKey,
// // //           Body: file,
// // //           ContentType: file.type,
// // //         },
// // //         partSize: 5 * 1024 * 1024,
// // //         queueSize: 4,
// // //       });

// // //       upload.on('httpUploadProgress', (progress) => {
// // //         const percentage = Math.round((progress.loaded / progress.total) * 100);
// // //         setUploadProgress(percentage);
// // //       });

// // //       const uploadResult = await upload.done();
// // //       const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;
// // //       setError(null);
// // //       setUploadProgress(0);
// // //       return fileUrl;
// // //     } catch (error) {
// // //       console.error('S3 Upload Error:', error);
// // //       setError(`Failed to upload file: ${error.message}`);
// // //       setUploadProgress(0);
// // //       return null;
// // //     }
// // //   };

// // //   const handleAddMaterial = async () => {
// // //     if (!materialData.name) {
// // //       setError('Please enter a material name.');
// // //       return;
// // //     }
// // //     if (!selectedType) {
// // //       setError('Please select a material type.');
// // //       return;
// // //     }
// // //     if (!file && !materialData.url && selectedType !== 'YouTube') {
// // //       setError('Please upload a file.');
// // //       return;
// // //     }
// // //     if (selectedType === 'YouTube' && !materialData.url) {
// // //       setError('Please enter a YouTube URL.');
// // //       return;
// // //     }

// // //     setUploading(true);
// // //     setError(null);

// // //     try {
// // //       const fileUrl = await handleFileUpload();
// // //       if (!fileUrl && selectedType !== 'YouTube') {
// // //         setUploading(false);
// // //         return;
// // //       }

// // //       await addDoc(collection(db, `curriculums/${curriculumId}/sections/${sectionId}/materials`), {
// // //         type: selectedType,
// // //         name: materialData.name,
// // //         description: materialData.description,
// // //         url: selectedType === 'YouTube' ? materialData.url : fileUrl,
// // //         maxViews: materialData.maxViews === 'Unlimited' ? null : parseInt(materialData.maxViews, 10),
// // //         isPrerequisite: materialData.isPrerequisite,
// // //         allowDownload: materialData.allowDownload,
// // //         accessOn: materialData.accessOn,
// // //         createdAt: new Date(),
// // //       });

// // //       setUploading(false);
// // //       onClose();
// // //     } catch (err) {
// // //       console.error('Error saving material:', err);
// // //       setError('Failed to save material. Please try again.');
// // //       setUploading(false);
// // //     }
// // //   };

// // //   if (!isOpen) return null;

// // //   return (
// // //     <div style={styles.modalOverlay}>
// // //       <div style={styles.modal}>
// // //         <div style={styles.modalHeader}>
// // //           <h3>Add Material</h3>
// // //           <button onClick={onClose} style={styles.closeButton} disabled={uploading}>
// // //             ✕
// // //           </button>
// // //         </div>

// // //         <div style={styles.modalContent}>
// // //           <div style={styles.formGroup}>
// // //             <label style={styles.label}>
// // //               Material Type <span style={styles.required}>*</span>
// // //             </label>
// // //             <select
// // //               name="type"
// // //               value={selectedType}
// // //               onChange={(e) => setSelectedType(e.target.value)}
// // //               style={styles.select}
// // //               disabled={uploading}
// // //             >
// // //               <option value="">Select a type</option>
// // //               {materialTypes.map((type) => (
// // //                 <option key={type} value={type}>
// // //                   {type}
// // //                 </option>
// // //               ))}
// // //             </select>
// // //           </div>

// // //           {selectedType && (
// // //             <>
// // //               <div style={styles.formGroup}>
// // //                 <label style={styles.label}>
// // //                   Material Name <span style={styles.required}>*</span>
// // //                 </label>
// // //                 <input
// // //                   type="text"
// // //                   name="name"
// // //                   value={materialData.name}
// // //                   onChange={handleMaterialDataChange}
// // //                   placeholder="Enter a name for this file"
// // //                   style={styles.input}
// // //                   maxLength={100}
// // //                   disabled={uploading}
// // //                 />
// // //                 <span style={styles.charCount}>{materialData.name.length} / 100</span>
// // //               </div>

// // //               <div style={styles.formGroup}>
// // //                 <label style={styles.label}>
// // //                   <span
// // //                     style={styles.addDescription}
// // //                     onClick={() =>
// // //                       setMaterialData((prev) => ({
// // //                         ...prev,
// // //                         description: prev.description ? '' : ' ',
// // //                       }))
// // //                     }
// // //                   >
// // //                     + Add Description (Optional)
// // //                   </span>
// // //                 </label>
// // //                 {materialData.description !== '' && (
// // //                   <textarea
// // //                     name="description"
// // //                     value={materialData.description}
// // //                     onChange={handleMaterialDataChange}
// // //                     placeholder="Enter a description"
// // //                     style={styles.textarea}
// // //                     disabled={uploading}
// // //                   />
// // //                 )}
// // //               </div>

// // //               {selectedType === 'YouTube' ? (
// // //                 <div style={styles.formGroup}>
// // //                   <label style={styles.label}>
// // //                     YouTube URL <span style={styles.required}>*</span>
// // //                   </label>
// // //                   <input
// // //                     type="text"
// // //                     name="url"
// // //                     value={materialData.url}
// // //                     onChange={handleMaterialDataChange}
// // //                     placeholder="Enter YouTube URL (e.g., https://youtu.be/VIDEO_ID)"
// // //                     style={styles.input}
// // //                     disabled={uploading}
// // //                   />
// // //                 </div>
// // //               ) : (
// // //                 <div style={styles.formGroup}>
// // //                   <label style={styles.label}>
// // //                     Upload File <span style={styles.required}>*</span>
// // //                   </label>
// // //                   <div style={styles.uploadBox}>
// // //                     {file ? (
// // //                       <p style={styles.fileName}>Selected file: {file.name}</p>
// // //                     ) : (
// // //                       <>
// // //                         <span style={styles.uploadIcon}>☁️</span>
// // //                         <p>Upload {selectedType.toLowerCase()} file</p>
// // //                         <p style={styles.uploadNote}>Max file size: 100MB</p>
// // //                       </>
// // //                     )}
// // //                     <input
// // //                       type="file"
// // //                       accept={
// // //                         selectedType === 'Video' ? 'video/mp4,video/mpeg,video/webm' :
// // //                         selectedType === 'PDF' ? 'application/pdf' :
// // //                         selectedType === 'Image' ? 'image/*' :
// // //                         selectedType === 'Sheet' ? '.xls,.xlsx' :
// // //                         selectedType === 'Slide' ? '.ppt,.pptx' :
// // //                         selectedType === 'Assignment' || selectedType === 'Form' ? 'application/pdf' :
// // //                         selectedType === 'Zip' ? 'application/zip' : '*/*'
// // //                       }
// // //                       onChange={handleFileChange}
// // //                       style={styles.fileInputOverlay}
// // //                       disabled={uploading}
// // //                     />
// // //                   </div>
// // //                 </div>
// // //               )}

// // //               <div style={styles.formGroup}>
// // //                 <label style={styles.label}>
// // //                   Maximum Views <span style={styles.required}>*</span>
// // //                 </label>
// // //                 <select
// // //                   name="maxViews"
// // //                   value={materialData.maxViews}
// // //                   onChange={handleMaterialDataChange}
// // //                   style={styles.select}
// // //                   disabled={uploading}
// // //                 >
// // //                   <option value="Unlimited">Unlimited</option>
// // //                   <option value="1">1</option>
// // //                   <option value="2">2</option>
// // //                   <option value="3">3</option>
// // //                   <option value="5">5</option>
// // //                   <option value="10">10</option>
// // //                 </select>
// // //               </div>

// // //               <div style={styles.formGroup}>
// // //                 <label style={styles.label}>More Options</label>
// // //                 <div style={styles.checkboxGroup}>
// // //                   <label style={styles.checkboxLabel}>
// // //                     <input
// // //                       type="checkbox"
// // //                       name="isPrerequisite"
// // //                       checked={materialData.isPrerequisite}
// // //                       onChange={handleMaterialDataChange}
// // //                       disabled={uploading}
// // //                     />
// // //                     Make this a prerequisite
// // //                   </label>
// // //                   <label style={styles.checkboxLabel}>
// // //                     <input
// // //                       type="checkbox"
// // //                       name="allowDownload"
// // //                       checked={materialData.allowDownload}
// // //                       onChange={handleMaterialDataChange}
// // //                       disabled={uploading}
// // //                     />
// // //                     Enable download
// // //                   </label>
// // //                 </div>
// // //               </div>

// // //               <div style={styles.formGroup}>
// // //                 <label style={styles.label}>Allow Access On</label>
// // //                 <div style={styles.radioGroup}>
// // //                   <label style={styles.radioLabel}>
// // //                     <input
// // //                       type="radio"
// // //                       name="accessOn"
// // //                       value="Both"
// // //                       checked={materialData.accessOn === 'Both'}
// // //                       onChange={handleMaterialDataChange}
// // //                       disabled={uploading}
// // //                     />
// // //                     Both
// // //                   </label>
// // //                   <label style={styles.radioLabel}>
// // //                     <input
// // //                       type="radio"
// // //                       name="accessOn"
// // //                       value="App"
// // //                       checked={materialData.accessOn === 'App'}
// // //                       onChange={handleMaterialDataChange}
// // //                       disabled={uploading}
// // //                     />
// // //                     App
// // //                   </label>
// // //                 </div>
// // //               </div>

// // //               {error && <div style={styles.errorMessage}>{error}</div>}
// // //               {uploading && (
// // //                 <div style={styles.progressBar}>
// // //                   <div style={{ ...styles.progressFill, width: `${uploadProgress}%` }} />
// // //                   <span style={styles.progressText}>{Math.round(uploadProgress)}%</span>
// // //                 </div>
// // //               )}
// // //             </>
// // //           )}
// // //         </div>

// // //         <div style={styles.formActions}>
// // //           <button onClick={onClose} style={styles.cancelButton} disabled={uploading}>
// // //             Cancel
// // //           </button>
// // //           <button onClick={handleAddMaterial} style={styles.addButton} disabled={uploading || !selectedType}>
// // //             {uploading ? 'Uploading...' : 'Add Material'}
// // //           </button>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // // Inline styles (unchanged from your original code)
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
// // //   formGroup: {
// // //     marginBottom: '20px',
// // //   },
// // //   label: {
// // //     display: 'block',
// // //     fontSize: '14px',
// // //     marginBottom: '5px',
// // //     fontWeight: 'bold',
// // //   },
// // //   required: {
// // //     color: 'red',
// // //   },
// // //   input: {
// // //     width: '100%',
// // //     padding: '8px',
// // //     borderRadius: '5px',
// // //     border: '1px solid #ddd',
// // //     boxSizing: 'border-box',
// // //   },
// // //   textarea: {
// // //     width: '100%',
// // //     padding: '8px',
// // //     borderRadius: '5px',
// // //     border: '1px solid #ddd',
// // //     boxSizing: 'border-box',
// // //     minHeight: '100px',
// // //   },
// // //   charCount: {
// // //     fontSize: '12px',
// // //     color: '#666',
// // //     textAlign: 'right',
// // //     marginTop: '5px',
// // //   },
// // //   addDescription: {
// // //     color: '#007bff',
// // //     cursor: 'pointer',
// // //   },
// // //   uploadBox: {
// // //     border: '2px dashed #ddd',
// // //     borderRadius: '5px',
// // //     padding: '20px',
// // //     textAlign: 'center',
// // //     position: 'relative',
// // //   },
// // //   uploadIcon: {
// // //     fontSize: '24px',
// // //     color: '#666',
// // //   },
// // //   uploadNote: {
// // //     fontSize: '12px',
// // //     color: '#666',
// // //   },
// // //   fileInputOverlay: {
// // //     position: 'absolute',
// // //     top: 0,
// // //     left: 0,
// // //     width: '100%',
// // //     height: '100%',
// // //     opacity: 0,
// // //     cursor: 'pointer',
// // //   },
// // //   fileName: {
// // //     fontSize: '12px',
// // //     color: '#666',
// // //     marginTop: '5px',
// // //   },
// // //   select: {
// // //     width: '100%',
// // //     padding: '8px',
// // //     borderRadius: '5px',
// // //     border: '1px solid #ddd',
// // //     boxSizing: 'border-box',
// // //   },
// // //   checkboxGroup: {
// // //     display: 'flex',
// // //     flexDirection: 'column',
// // //     gap: '10px',
// // //   },
// // //   checkboxLabel: {
// // //     display: 'flex',
// // //     alignItems: 'center',
// // //     fontSize: '14px',
// // //   },
// // //   radioGroup: {
// // //     display: 'flex',
// // //     gap: '20px',
// // //   },
// // //   radioLabel: {
// // //     display: 'flex',
// // //     alignItems: 'center',
// // //     fontSize: '14px',
// // //   },
// // //   errorMessage: {
// // //     color: 'red',
// // //     fontSize: '14px',
// // //     marginBottom: '10px',
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
// // //   addButton: {
// // //     padding: '8px 15px',
// // //     backgroundColor: '#007bff',
// // //     color: '#fff',
// // //     border: 'none',
// // //     borderRadius: '5px',
// // //     cursor: 'pointer',
// // //   },
// // //   progressBar: {
// // //     width: '100%',
// // //     backgroundColor: '#f0f0f0',
// // //     borderRadius: '5px',
// // //     height: '20px',
// // //     position: 'relative',
// // //     marginTop: '10px',
// // //   },
// // //   progressFill: {
// // //     height: '100%',
// // //     backgroundColor: '#007bff',
// // //     borderRadius: '5px',
// // //     transition: 'width 0.3s ease',
// // //   },
// // //   progressText: {
// // //     position: 'absolute',
// // //     top: '50%',
// // //     left: '50%',
// // //     transform: 'translate(-50%, -50%)',
// // //     fontSize: '12px',
// // //     color: '#fff',
// // //   },
// // // };

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

// // import React, { useState } from 'react';
// // import { db } from '../../../../config/firebase';
// // import { collection, addDoc } from 'firebase/firestore';
// // import { s3Client, debugS3Config } from '../../../../config/aws-config';
// // import { Upload } from '@aws-sdk/lib-storage';

// // const AddMaterialModal = ({ isOpen, onClose, curriculumId, sectionId }) => {
// //   const [view, setView] = useState('typeSelection');
// //   const [selectedType, setSelectedType] = useState(null);
// //   const [file, setFile] = useState(null);
// //   const [uploading, setUploading] = useState(false);
// //   const [uploadProgress, setUploadProgress] = useState(0);
// //   const [error, setError] = useState(null);
// //   const [materialData, setMaterialData] = useState({
// //     name: '',
// //     description: '',
// //     maxViews: 'Unlimited',
// //     isPrerequisite: false,
// //     allowDownload: false,
// //     accessOn: 'Both',
// //   });

// //   // Restricted material types with their icons
// //   const materialTypes = [
// //     { type: 'Video', icon: '🎥' },
// //     { type: 'PDF', icon: '📄' },
// //     { type: 'Image', icon: '🖼️' },
// //     { type: 'YouTube', icon: '▶️' },
// //     { type: 'Sheet', icon: '📊' },
// //     { type: 'Slide', icon: '📑' },
// //     { type: 'Assignment', icon: '📋' },
// //     { type: 'Form', icon: '📋' },
// //     { type: 'Zip', icon: '🗜️' },
// //   ];

// //   const handleTypeSelect = (type) => {
// //     setSelectedType(type);
// //     setError(null);
// //   };

// //   const handleContinue = () => {
// //     if (!selectedType) {
// //       setError('Please select a material type.');
// //       return;
// //     }

// //     if (['Video', 'PDF', 'Image', 'Sheet', 'Slide', 'Assignment', 'Form', 'Zip'].includes(selectedType)) {
// //       setView('fileConfig'); // Generic config for file-based types
// //     } else if (selectedType === 'YouTube') {
// //       setView('youtubeConfig'); // Specific config for YouTube
// //     }
// //   };

// //   const handleBack = () => {
// //     if (uploading) return;
// //     setView('typeSelection');
// //     setSelectedType(null);
// //     setFile(null);
// //     setError(null);
// //     setUploadProgress(0);
// //     setMaterialData({
// //       name: '',
// //       description: '',
// //       maxViews: 'Unlimited',
// //       isPrerequisite: false,
// //       allowDownload: false,
// //       accessOn: 'Both',
// //     });
// //   };

// //   const handleFileChange = (e) => {
// //     const selectedFile = e.target.files[0];
// //     if (selectedFile) {
// //       const maxSizeInMB = 100;
// //       if (selectedFile.size > maxSizeInMB * 1024 * 1024) {
// //         setFile(null);
// //         setError(`File size exceeds ${maxSizeInMB}MB limit.`);
// //         return;
// //       }

// //       switch (selectedType) {
// //         case 'Video':
// //           if (!['video/mp4', 'video/mpeg', 'video/webm'].includes(selectedFile.type)) {
// //             setFile(null);
// //             setError('Please select a valid video file (.mp4, .mpeg, or .webm).');
// //             return;
// //           }
// //           break;
// //         case 'PDF':
// //           if (selectedFile.type !== 'application/pdf') {
// //             setFile(null);
// //             setError('Please select a valid PDF file.');
// //             return;
// //           }
// //           break;
// //         case 'Image':
// //           if (!selectedFile.type.startsWith('image/')) {
// //             setFile(null);
// //             setError('Please select a valid image file.');
// //             return;
// //           }
// //           break;
// //         case 'Sheet':
// //           if (!['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(selectedFile.type)) {
// //             setFile(null);
// //             setError('Please select a valid spreadsheet file (.xls, .xlsx).');
// //             return;
// //           }
// //           break;
// //         case 'Slide':
// //           if (!['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'].includes(selectedFile.type)) {
// //             setFile(null);
// //             setError('Please select a valid presentation file (.ppt, .pptx).');
// //             return;
// //           }
// //           break;
// //         case 'Assignment':
// //         case 'Form':
// //           if (selectedFile.type !== 'application/pdf') {
// //             setFile(null);
// //             setError('Please select a valid PDF file for Assignment or Form.');
// //             return;
// //           }
// //           break;
// //         case 'Zip':
// //           if (selectedFile.type !== 'application/zip') {
// //             setFile(null);
// //             setError('Please select a valid ZIP file.');
// //             return;
// //           }
// //           break;
// //         default:
// //           break; // YouTube doesn’t use file upload
// //       }
// //       setFile(selectedFile);
// //       setError(null);
// //     }
// //   };

// //   const handleMaterialDataChange = (e) => {
// //     const { name, value, type, checked } = e.target;
// //     setMaterialData((prev) => ({
// //       ...prev,
// //       [name]: type === 'checkbox' ? checked : value,
// //     }));
// //   };

// //   const handleFileUpload = async () => {
// //     if (!file) return null;

// //     try {
// //       debugS3Config();
// //       const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
// //       const region = import.meta.env.VITE_AWS_REGION;
// //       if (!bucketName || !region) {
// //         throw new Error('Missing AWS config: Check VITE_S3_BUCKET_NAME and VITE_AWS_REGION in your .env file');
// //       }

// //       const fileKey = `materials/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
// //       const upload = new Upload({
// //         client: s3Client,
// //         params: {
// //           Bucket: bucketName,
// //           Key: fileKey,
// //           Body: file,
// //           ContentType: file.type,
// //         },
// //         partSize: 5 * 1024 * 1024,
// //         queueSize: 4,
// //       });

// //       upload.on('httpUploadProgress', (progress) => {
// //         const percentage = Math.round((progress.loaded / progress.total) * 100);
// //         setUploadProgress(percentage);
// //       });

// //       const uploadResult = await upload.done();
// //       const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;
// //       setError(null);
// //       setUploadProgress(0);
// //       return fileUrl;
// //     } catch (error) {
// //       console.error('S3 Upload Error:', error);
// //       setError(`Failed to upload file: ${error.message}`);
// //       setUploadProgress(0);
// //       return null;
// //     }
// //   };

// //   const handleAddMaterial = async () => {
// //     if (!materialData.name) {
// //       setError('Please enter a material name.');
// //       return;
// //     }
// //     if (selectedType !== 'YouTube' && !file) {
// //       setError('Please upload a file.');
// //       return;
// //     }
// //     if (selectedType === 'YouTube' && !materialData.url) {
// //       setError('Please enter a YouTube URL.');
// //       return;
// //     }

// //     setUploading(true);
// //     setError(null);

// //     try {
// //       const fileUrl = selectedType === 'YouTube' ? materialData.url : await handleFileUpload();
// //       if (!fileUrl) {
// //         setUploading(false);
// //         return;
// //       }

// //       await addDoc(collection(db, `curriculums/${curriculumId}/sections/${sectionId}/materials`), {
// //         type: selectedType,
// //         name: materialData.name,
// //         description: materialData.description,
// //         url: fileUrl,
// //         maxViews: materialData.maxViews === 'Unlimited' ? null : parseInt(materialData.maxViews, 10),
// //         isPrerequisite: materialData.isPrerequisite,
// //         allowDownload: materialData.allowDownload,
// //         accessOn: materialData.accessOn,
// //         createdAt: new Date(),
// //       });

// //       setUploading(false);
// //       onClose();
// //     } catch (err) {
// //       console.error('Error saving material:', err);
// //       setError('Failed to save material. Please try again.');
// //       setUploading(false);
// //     }
// //   };

// //   if (!isOpen) return null;

// //   return (
// //     <div style={styles.modalOverlay}>
// //       <div style={styles.modal}>
// //         <div style={styles.modalHeader}>
// //           <h3>Add Material</h3>
// //           <button onClick={onClose} style={styles.closeButton} disabled={uploading}>
// //             ✕
// //           </button>
// //         </div>

// //         <div style={styles.modalContent}>
// //           {view === 'typeSelection' && (
// //             <>
// //               <p style={styles.subTitle}>Select material type or Clone from existing library</p>
// //               <div style={styles.materialGrid}>
// //                 {materialTypes.map((material) => (
// //                   <div
// //                     key={material.type}
// //                     style={{
// //                       ...styles.materialItem,
// //                       backgroundColor: selectedType === material.type ? '#e0e7ff' : '#fff',
// //                     }}
// //                     onClick={() => handleTypeSelect(material.type)}
// //                   >
// //                     <span style={styles.materialIcon}>{material.icon}</span>
// //                     <span style={styles.materialLabel}>{material.type}</span>
// //                   </div>
// //                 ))}
// //               </div>
// //               <p style={styles.note}>
// //                 If you don't see your format listed here, please upload it as a zip file.
// //               </p>
// //               {error && <div style={styles.errorMessage}>{error}</div>}
// //             </>
// //           )}

// //           {view === 'fileConfig' && (
// //             <>
// //               <p style={styles.subTitle}>
// //                 Type: {selectedType} <span style={styles.changeLink} onClick={handleBack}>Change</span>
// //               </p>
// //               <div style={styles.formGroup}>
// //                 <label style={styles.label}>
// //                   Material Name <span style={styles.required}>*</span>
// //                 </label>
// //                 <input
// //                   type="text"
// //                   name="name"
// //                   value={materialData.name}
// //                   onChange={handleMaterialDataChange}
// //                   placeholder="Enter a name for this file"
// //                   style={styles.input}
// //                   maxLength={100}
// //                   disabled={uploading}
// //                 />
// //                 <span style={styles.charCount}>{materialData.name.length} / 100</span>
// //               </div>
// //               <div style={styles.formGroup}>
// //                 <label style={styles.label}>
// //                   <span
// //                     style={styles.addDescription}
// //                     onClick={() =>
// //                       setMaterialData((prev) => ({
// //                         ...prev,
// //                         description: prev.description ? '' : ' ',
// //                       }))
// //                     }
// //                   >
// //                     + Add Description (Optional)
// //                   </span>
// //                 </label>
// //                 {materialData.description !== '' && (
// //                   <textarea
// //                     name="description"
// //                     value={materialData.description}
// //                     onChange={handleMaterialDataChange}
// //                     placeholder="Enter a description"
// //                     style={styles.textarea}
// //                     disabled={uploading}
// //                   />
// //                 )}
// //               </div>
// //               <div style={styles.formGroup}>
// //                 <label style={styles.label}>
// //                   Upload file <span style={styles.required}>*</span>
// //                 </label>
// //                 <div style={styles.uploadBox}>
// //                   {file ? (
// //                     <p style={styles.fileName}>Selected file: {file.name}</p>
// //                   ) : (
// //                     <>
// //                       <span style={styles.uploadIcon}>☁️</span>
// //                       <p>Upload {selectedType.toLowerCase()} file</p>
// //                       <p style={styles.uploadNote}>Max file size supported is 100MB</p>
// //                     </>
// //                   )}
// //                   <input
// //                     type="file"
// //                     accept={
// //                       selectedType === 'Video' ? 'video/mp4,video/mpeg,video/webm' :
// //                       selectedType === 'PDF' ? 'application/pdf' :
// //                       selectedType === 'Image' ? 'image/*' :
// //                       selectedType === 'Sheet' ? '.xls,.xlsx' :
// //                       selectedType === 'Slide' ? '.ppt,.pptx' :
// //                       selectedType === 'Assignment' || selectedType === 'Form' ? 'application/pdf' :
// //                       selectedType === 'Zip' ? 'application/zip' : '*/*'
// //                     }
// //                     onChange={handleFileChange}
// //                     style={styles.fileInputOverlay}
// //                     disabled={uploading}
// //                   />
// //                 </div>
// //               </div>
// //               <div style={styles.formGroup}>
// //                 <label style={styles.label}>
// //                   Maximum views <span style={styles.required}>*</span>
// //                 </label>
// //                 <select
// //                   name="maxViews"
// //                   value={materialData.maxViews}
// //                   onChange={handleMaterialDataChange}
// //                   style={styles.select}
// //                   disabled={uploading}
// //                 >
// //                   <option value="Unlimited">Unlimited</option>
// //                   <option value="1">1</option>
// //                   <option value="2">2</option>
// //                   <option value="3">3</option>
// //                   <option value="5">5</option>
// //                   <option value="10">10</option>
// //                 </select>
// //               </div>
// //               <div style={styles.formGroup}>
// //                 <label style={styles.label}>More Options</label>
// //                 <div style={styles.checkboxGroup}>
// //                   <label style={styles.checkboxLabel}>
// //                     <input
// //                       type="checkbox"
// //                       name="isPrerequisite"
// //                       checked={materialData.isPrerequisite}
// //                       onChange={handleMaterialDataChange}
// //                       disabled={uploading}
// //                     />
// //                     Make this a prerequisite
// //                   </label>
// //                   <label style={styles.checkboxLabel}>
// //                     <input
// //                       type="checkbox"
// //                       name="allowDownload"
// //                       checked={materialData.allowDownload}
// //                       onChange={handleMaterialDataChange}
// //                       disabled={uploading}
// //                     />
// //                     Enable download
// //                   </label>
// //                 </div>
// //               </div>
// //               <div style={styles.formGroup}>
// //                 <label style={styles.label}>Allow access on</label>
// //                 <div style={styles.radioGroup}>
// //                   <label style={styles.radioLabel}>
// //                     <input
// //                       type="radio"
// //                       name="accessOn"
// //                       value="Both"
// //                       checked={materialData.accessOn === 'Both'}
// //                       onChange={handleMaterialDataChange}
// //                       disabled={uploading}
// //                     />
// //                     Both
// //                   </label>
// //                   <label style={styles.radioLabel}>
// //                     <input
// //                       type="radio"
// //                       name="accessOn"
// //                       value="App"
// //                       checked={materialData.accessOn === 'App'}
// //                       onChange={handleMaterialDataChange}
// //                       disabled={uploading}
// //                     />
// //                     App
// //                   </label>
// //                 </div>
// //               </div>
// //               {error && <div style={styles.errorMessage}>{error}</div>}
// //               {uploading && (
// //                 <div style={styles.progressBar}>
// //                   <div style={{ ...styles.progressFill, width: `${uploadProgress}%` }} />
// //                   <span style={styles.progressText}>{Math.round(uploadProgress)}%</span>
// //                 </div>
// //               )}
// //             </>
// //           )}

// //           {view === 'youtubeConfig' && (
// //             <>
// //               <p style={styles.subTitle}>
// //                 Type: YouTube <span style={styles.changeLink} onClick={handleBack}>Change</span>
// //               </p>
// //               <div style={styles.formGroup}>
// //                 <label style={styles.label}>
// //                   Material Name <span style={styles.required}>*</span>
// //                 </label>
// //                 <input
// //                   type="text"
// //                   name="name"
// //                   value={materialData.name}
// //                   onChange={handleMaterialDataChange}
// //                   placeholder="Enter a name for this video"
// //                   style={styles.input}
// //                   maxLength={100}
// //                   disabled={uploading}
// //                 />
// //                 <span style={styles.charCount}>{materialData.name.length} / 100</span>
// //               </div>
// //               <div style={styles.formGroup}>
// //                 <label style={styles.label}>
// //                   <span
// //                     style={styles.addDescription}
// //                     onClick={() =>
// //                       setMaterialData((prev) => ({
// //                         ...prev,
// //                         description: prev.description ? '' : ' ',
// //                       }))
// //                     }
// //                   >
// //                     + Add Description (Optional)
// //                   </span>
// //                 </label>
// //                 {materialData.description !== '' && (
// //                   <textarea
// //                     name="description"
// //                     value={materialData.description}
// //                     onChange={handleMaterialDataChange}
// //                     placeholder="Enter a description"
// //                     style={styles.textarea}
// //                     disabled={uploading}
// //                   />
// //                 )}
// //               </div>
// //               <div style={styles.formGroup}>
// //                 <label style={styles.label}>
// //                   YouTube URL <span style={styles.required}>*</span>
// //                 </label>
// //                 <input
// //                   type="text"
// //                   name="url"
// //                   value={materialData.url || ''}
// //                   onChange={handleMaterialDataChange}
// //                   placeholder="Enter YouTube URL (e.g., https://youtu.be/VIDEO_ID)"
// //                   style={styles.input}
// //                   disabled={uploading}
// //                 />
// //               </div>
// //               <div style={styles.formGroup}>
// //                 <label style={styles.label}>
// //                   Maximum views <span style={styles.required}>*</span>
// //                 </label>
// //                 <select
// //                   name="maxViews"
// //                   value={materialData.maxViews}
// //                   onChange={handleMaterialDataChange}
// //                   style={styles.select}
// //                   disabled={uploading}
// //                 >
// //                   <option value="Unlimited">Unlimited</option>
// //                   <option value="1">1</option>
// //                   <option value="2">2</option>
// //                   <option value="3">3</option>
// //                   <option value="5">5</option>
// //                   <option value="10">10</option>
// //                 </select>
// //               </div>
// //               <div style={styles.formGroup}>
// //                 <label style={styles.label}>More Options</label>
// //                 <div style={styles.checkboxGroup}>
// //                   <label style={styles.checkboxLabel}>
// //                     <input
// //                       type="checkbox"
// //                       name="isPrerequisite"
// //                       checked={materialData.isPrerequisite}
// //                       onChange={handleMaterialDataChange}
// //                       disabled={uploading}
// //                     />
// //                     Make this a prerequisite
// //                   </label>
// //                   <label style={styles.checkboxLabel}>
// //                     <input
// //                       type="checkbox"
// //                       name="allowDownload"
// //                       checked={materialData.allowDownload}
// //                       onChange={handleMaterialDataChange}
// //                       disabled={uploading}
// //                     />
// //                     Enable download
// //                   </label>
// //                 </div>
// //               </div>
// //               <div style={styles.formGroup}>
// //                 <label style={styles.label}>Allow access on</label>
// //                 <div style={styles.radioGroup}>
// //                   <label style={styles.radioLabel}>
// //                     <input
// //                       type="radio"
// //                       name="accessOn"
// //                       value="Both"
// //                       checked={materialData.accessOn === 'Both'}
// //                       onChange={handleMaterialDataChange}
// //                       disabled={uploading}
// //                     />
// //                     Both
// //                   </label>
// //                   <label style={styles.radioLabel}>
// //                     <input
// //                       type="radio"
// //                       name="accessOn"
// //                       value="App"
// //                       checked={materialData.accessOn === 'App'}
// //                       onChange={handleMaterialDataChange}
// //                       disabled={uploading}
// //                     />
// //                     App
// //                   </label>
// //                 </div>
// //               </div>
// //               {error && <div style={styles.errorMessage}>{error}</div>}
// //               {uploading && (
// //                 <div style={styles.progressBar}>
// //                   <div style={{ ...styles.progressFill, width: `${uploadProgress}%` }} />
// //                   <span style={styles.progressText}>{Math.round(uploadProgress)}%</span>
// //                 </div>
// //               )}
// //             </>
// //           )}
// //         </div>

// //         <div style={styles.formActions}>
// //           {view === 'typeSelection' ? (
// //             <>
// //               <button onClick={onClose} style={styles.cancelButton} disabled={uploading}>
// //                 Cancel
// //               </button>
// //               <button onClick={handleContinue} style={styles.continueButton} disabled={uploading}>
// //                 Continue
// //               </button>
// //             </>
// //           ) : (
// //             <>
// //               <button onClick={handleBack} style={styles.backButton} disabled={uploading}>
// //                 Back
// //               </button>
// //               <button onClick={handleAddMaterial} style={styles.addButton} disabled={uploading}>
// //                 {uploading ? 'Uploading...' : 'Add Material'}
// //               </button>
// //             </>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // // Inline styles (unchanged from your original code)
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
// //   changeLink: {
// //     color: '#007bff',
// //     cursor: 'pointer',
// //     marginLeft: '10px',
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
// //   formGroup: {
// //     marginBottom: '20px',
// //   },
// //   label: {
// //     display: 'block',
// //     fontSize: '14px',
// //     marginBottom: '5px',
// //     fontWeight: 'bold',
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
// //   textarea: {
// //     width: '100%',
// //     padding: '8px',
// //     borderRadius: '5px',
// //     border: '1px solid #ddd',
// //     boxSizing: 'border-box',
// //     minHeight: '100px',
// //   },
// //   charCount: {
// //     fontSize: '12px',
// //     color: '#666',
// //     textAlign: 'right',
// //     marginTop: '5px',
// //   },
// //   addDescription: {
// //     color: '#007bff',
// //     cursor: 'pointer',
// //   },
// //   uploadBox: {
// //     border: '2px dashed #ddd',
// //     borderRadius: '5px',
// //     padding: '20px',
// //     textAlign: 'center',
// //     position: 'relative',
// //   },
// //   uploadIcon: {
// //     fontSize: '24px',
// //     color: '#666',
// //   },
// //   uploadNote: {
// //     fontSize: '12px',
// //     color: '#666',
// //   },
// //   fileInputOverlay: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     width: '100%',
// //     height: '100%',
// //     opacity: 0,
// //     cursor: 'pointer',
// //   },
// //   fileName: {
// //     fontSize: '12px',
// //     color: '#666',
// //     marginTop: '5px',
// //   },
// //   select: {
// //     width: '100%',
// //     padding: '8px',
// //     borderRadius: '5px',
// //     border: '1px solid #ddd',
// //     boxSizing: 'border-box',
// //   },
// //   checkboxGroup: {
// //     display: 'flex',
// //     flexDirection: 'column',
// //     gap: '10px',
// //   },
// //   checkboxLabel: {
// //     display: 'flex',
// //     alignItems: 'center',
// //     fontSize: '14px',
// //   },
// //   radioGroup: {
// //     display: 'flex',
// //     gap: '20px',
// //   },
// //   radioLabel: {
// //     display: 'flex',
// //     alignItems: 'center',
// //     fontSize: '14px',
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
// //   backButton: {
// //     padding: '8px 15px',
// //     backgroundColor: '#fff',
// //     border: '1px solid #ddd',
// //     borderRadius: '5px',
// //     cursor: 'pointer',
// //   },
// //   addButton: {
// //     padding: '8px 15px',
// //     backgroundColor: '#007bff',
// //     color: '#fff',
// //     border: 'none',
// //     borderRadius: '5px',
// //     cursor: 'pointer',
// //   },
// //   progressBar: {
// //     width: '100%',
// //     backgroundColor: '#f0f0f0',
// //     borderRadius: '5px',
// //     height: '20px',
// //     position: 'relative',
// //     marginTop: '10px',
// //   },
// //   progressFill: {
// //     height: '100%',
// //     backgroundColor: '#007bff',
// //     borderRadius: '5px',
// //     transition: 'width 0.3s ease',
// //   },
// //   progressText: {
// //     position: 'absolute',
// //     top: '50%',
// //     left: '50%',
// //     transform: 'translate(-50%, -50%)',
// //     fontSize: '12px',
// //     color: '#fff',
// //   },
// // };

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

// // import React, { useState } from 'react';
// import { db } from '../../../../config/firebase';
// import { collection, addDoc } from 'firebase/firestore';
// import { s3Client, debugS3Config } from '../../../../config/aws-config';
// import { PutObjectCommand } from '@aws-sdk/client-s3';

// // const AddMaterialModal = ({ isOpen, onClose, curriculumId, sectionId }) => {
// //   const [view, setView] = useState('typeSelection');
// //   const [selectedType, setSelectedType] = useState(null);
// //   const [file, setFile] = useState(null);
// //   const [uploading, setUploading] = useState(false);
// //   const [uploadProgress, setUploadProgress] = useState(0);
// //   const [error, setError] = useState(null);
// //   const [materialData, setMaterialData] = useState({
// //     name: '',
// //     description: '',
// //     url: '', // For YouTube
// //     maxViews: 'Unlimited',
// //     isPrerequisite: false,
// //     allowDownload: false,
// //     accessOn: 'Both',
// //   });

// //   const materialTypes = [
// //     { type: 'Video', icon: '🎥' },
// //     { type: 'PDF', icon: '📄' },
// //     { type: 'Image', icon: '🖼️' },
// //     { type: 'YouTube', icon: '▶️' },
// //     { type: 'Sheet', icon: '📊' },
// //     { type: 'Slide', icon: '📑' },
// //     { type: 'Assignment', icon: '📋' },
// //     { type: 'Form', icon: '📋' },
// //     { type: 'Zip', icon: '🗜️' },
// //   ];

// //   const handleTypeSelect = (type) => {
// //     setSelectedType(type);
// //     setError(null);
// //   };

// //   const handleContinue = () => {
// //     if (!selectedType) {
// //       setError('Please select a material type.');
// //       return;
// //     }
// //     if (selectedType === 'YouTube') {
// //       setView('youtubeConfig');
// //     } else {
// //       setView('fileConfig');
// //     }
// //   };

// //   const handleBack = () => {
// //     if (uploading) return;
// //     setView('typeSelection');
// //     setSelectedType(null);
// //     setFile(null);
// //     setError(null);
// //     setUploadProgress(0);
// //     setMaterialData({
// //       name: '',
// //       description: '',
// //       url: '',
// //       maxViews: 'Unlimited',
// //       isPrerequisite: false,
// //       allowDownload: false,
// //       accessOn: 'Both',
// //     });
// //   };

// //   const handleFileChange = (e) => {
// //     const selectedFile = e.target.files[0];
// //     if (selectedFile) {
// //       const maxSizeInMB = 100;
// //       if (selectedFile.size > maxSizeInMB * 1024 * 1024) {
// //         setFile(null);
// //         setError(`File size exceeds ${maxSizeInMB}MB limit.`);
// //         return;
// //       }

// //       switch (selectedType) {
// //         case 'Video':
// //           if (!['video/mp4', 'video/mpeg', 'video/webm'].includes(selectedFile.type)) {
// //             setFile(null);
// //             setError('Please select a valid video file (.mp4, .mpeg, or .webm).');
// //             return;
// //           }
// //           break;
// //         case 'PDF':
// //           if (selectedFile.type !== 'application/pdf') {
// //             setFile(null);
// //             setError('Please select a valid PDF file.');
// //             return;
// //           }
// //           break;
// //         case 'Image':
// //           if (!selectedFile.type.startsWith('image/')) {
// //             setFile(null);
// //             setError('Please select a valid image file.');
// //             return;
// //           }
// //           break;
// //         case 'Sheet':
// //           if (!['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(selectedFile.type)) {
// //             setFile(null);
// //             setError('Please select a valid spreadsheet file (.xls, .xlsx).');
// //             return;
// //           }
// //           break;
// //         case 'Slide':
// //           if (!['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'].includes(selectedFile.type)) {
// //             setFile(null);
// //             setError('Please select a valid presentation file (.ppt, .pptx).');
// //             return;
// //           }
// //           break;
// //         case 'Assignment':
// //         case 'Form':
// //           if (selectedFile.type !== 'application/pdf') {
// //             setFile(null);
// //             setError('Please select a valid PDF file.');
// //             return;
// //           }
// //           break;
// //         case 'Zip':
// //           if (selectedFile.type !== 'application/zip') {
// //             setFile(null);
// //             setError('Please select a valid ZIP file.');
// //             return;
// //           }
// //           break;
// //         default:
// //           break;
// //       }
// //       setFile(selectedFile);
// //       setError(null);
// //     }
// //   };

// //   const handleMaterialDataChange = (e) => {
// //     const { name, value, type, checked } = e.target;
// //     setMaterialData((prev) => ({
// //       ...prev,
// //       [name]: type === 'checkbox' ? checked : value,
// //     }));
// //   };

// //   const handleFileUpload = async () => {
// //     if (!file) return null;

// //     try {
// //       debugS3Config(); // Ensure this logs your S3 config for debugging
// //       const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
// //       const region = import.meta.env.VITE_AWS_REGION;
// //       if (!bucketName || !region) {
// //         throw new Error('Missing AWS config: Check VITE_S3_BUCKET_NAME and VITE_AWS_REGION in your .env file');
// //       }

// //       const fileKey = `materials/${curriculumId}/${sectionId}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
// //       const fileBuffer = await file.arrayBuffer();
// //       const params = {
// //         Bucket: bucketName,
// //         Key: fileKey,
// //         Body: new Uint8Array(fileBuffer),
// //         ContentType: file.type,
// //       };

// //       console.log('Uploading to S3 with params:', params);
// //       const uploadResult = await s3Client.send(new PutObjectCommand(params));
// //       console.log('S3 Upload Success:', uploadResult);

// //       const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;
// //       setError(null);
// //       setUploadProgress(0);
// //       return fileUrl;
// //     } catch (error) {
// //       console.error('S3 Upload Error:', {
// //         message: error.message,
// //         name: error.name,
// //         stack: error.stack,
// //         code: error.code,
// //       });
// //       let errorMessage = 'Failed to upload file to S3: ';
// //       if (error.name === 'CredentialsError') {
// //         errorMessage += 'Invalid AWS credentials. Check your access key and secret key.';
// //       } else if (error.code === 'NoSuchBucket') {
// //         errorMessage += `The bucket "${bucketName}" does not exist.`;
// //       } else if (error.message.includes('CORS')) {
// //         errorMessage += 'CORS issue. Ensure your S3 bucket’s CORS policy allows uploads.';
// //       } else if (error.code === 'AccessDenied') {
// //         errorMessage += 'Access denied. Check your S3 bucket permissions and IAM role.';
// //       } else {
// //         errorMessage += error.message;
// //       }
// //       setError(errorMessage);
// //       setUploadProgress(0);
// //       throw error; // Re-throw to handle in caller
// //     }
// //   };

// //   const handleAddMaterial = async () => {
// //     if (!materialData.name) {
// //       setError('Please enter a material name.');
// //       return;
// //     }
// //     if (selectedType !== 'YouTube' && !file) {
// //       setError('Please upload a file.');
// //       return;
// //     }
// //     if (selectedType === 'YouTube' && !materialData.url) {
// //       setError('Please enter a YouTube URL.');
// //       return;
// //     }

// //     setUploading(true);
// //     setError(null);

// //     try {
// //       const fileUrl = selectedType === 'YouTube' ? materialData.url : await handleFileUpload();
// //       if (!fileUrl) {
// //         setUploading(false);
// //         return;
// //       }

// //       await addDoc(collection(db, `curriculums/${curriculumId}/sections/${sectionId}/materials`), {
// //         type: selectedType,
// //         name: materialData.name,
// //         description: materialData.description,
// //         url: fileUrl,
// //         maxViews: materialData.maxViews === 'Unlimited' ? null : parseInt(materialData.maxViews, 10),
// //         isPrerequisite: materialData.isPrerequisite,
// //         allowDownload: materialData.allowDownload,
// //         accessOn: materialData.accessOn,
// //         createdAt: new Date(),
// //       });

// //       setUploading(false);
// //       onClose();
// //     } catch (err) {
// //       console.error('Error saving material:', err);
// //       setError('Failed to save material: ' + err.message);
// //       setUploading(false);
// //     }
// //   };

// //   if (!isOpen) return null;

// //   return (
// //     <div style={styles.modalOverlay}>
// //       <div style={styles.modal}>
// //         <div style={styles.modalHeader}>
// //           <h3>Add Material</h3>
// //           <button onClick={onClose} style={styles.closeButton} disabled={uploading}>
// //             ✕
// //           </button>
// //         </div>

// //         <div style={styles.modalContent}>
// //           {view === 'typeSelection' && (
// //             <>
// //               <p style={styles.subTitle}>Select material type or Clone from existing library</p>
// //               <div style={styles.materialGrid}>
// //                 {materialTypes.map((material) => (
// //                   <div
// //                     key={material.type}
// //                     style={{
// //                       ...styles.materialItem,
// //                       backgroundColor: selectedType === material.type ? '#e0e7ff' : '#fff',
// //                     }}
// //                     onClick={() => handleTypeSelect(material.type)}
// //                   >
// //                     <span style={styles.materialIcon}>{material.icon}</span>
// //                     <span style={styles.materialLabel}>{material.type}</span>
// //                   </div>
// //                 ))}
// //               </div>
// //               <p style={styles.note}>
// //                 If you don't see your format listed here, please upload it as a zip file.
// //               </p>
// //               {error && <div style={styles.errorMessage}>{error}</div>}
// //             </>
// //           )}

// //           {view === 'fileConfig' && (
// //             <>
// //               <p style={styles.subTitle}>
// //                 Type: {selectedType} <span style={styles.changeLink} onClick={handleBack}>Change</span>
// //               </p>
// //               <div style={styles.formGroup}>
// //                 <label style={styles.label}>
// //                   Material Name <span style={styles.required}>*</span>
// //                 </label>
// //                 <input
// //                   type="text"
// //                   name="name"
// //                   value={materialData.name}
// //                   onChange={handleMaterialDataChange}
// //                   placeholder="Enter a name for this file"
// //                   style={styles.input}
// //                   maxLength={100}
// //                   disabled={uploading}
// //                 />
// //                 <span style={styles.charCount}>{materialData.name.length} / 100</span>
// //               </div>
// //               <div style={styles.formGroup}>
// //                 <label style={styles.label}>
// //                   <span
// //                     style={styles.addDescription}
// //                     onClick={() =>
// //                       setMaterialData((prev) => ({
// //                         ...prev,
// //                         description: prev.description ? '' : ' ',
// //                       }))
// //                     }
// //                   >
// //                     + Add Description (Optional)
// //                   </span>
// //                 </label>
// //                 {materialData.description !== '' && (
// //                   <textarea
// //                     name="description"
// //                     value={materialData.description}
// //                     onChange={handleMaterialDataChange}
// //                     placeholder="Enter a description"
// //                     style={styles.textarea}
// //                     disabled={uploading}
// //                   />
// //                 )}
// //               </div>
// //               <div style={styles.formGroup}>
// //                 <label style={styles.label}>
// //                   Upload file <span style={styles.required}>*</span>
// //                 </label>
// //                 <div style={styles.uploadBox}>
// //                   {file ? (
// //                     <p style={styles.fileName}>Selected file: {file.name}</p>
// //                   ) : (
// //                     <>
// //                       <span style={styles.uploadIcon}>☁️</span>
// //                       <p>Upload {selectedType.toLowerCase()} file</p>
// //                       <p style={styles.uploadNote}>Max file size supported is 100MB</p>
// //                     </>
// //                   )}
// //                   <input
// //                     type="file"
// //                     accept={
// //                       selectedType === 'Video' ? 'video/mp4,video/mpeg,video/webm' :
// //                       selectedType === 'PDF' ? 'application/pdf' :
// //                       selectedType === 'Image' ? 'image/*' :
// //                       selectedType === 'Sheet' ? '.xls,.xlsx' :
// //                       selectedType === 'Slide' ? '.ppt,.pptx' :
// //                       selectedType === 'Assignment' || selectedType === 'Form' ? 'application/pdf' :
// //                       selectedType === 'Zip' ? 'application/zip' : '*/*'
// //                     }
// //                     onChange={handleFileChange}
// //                     style={styles.fileInputOverlay}
// //                     disabled={uploading}
// //                   />
// //                 </div>
// //               </div>
// //               <div style={styles.formGroup}>
// //                 <label style={styles.label}>
// //                   Maximum views <span style={styles.required}>*</span>
// //                 </label>
// //                 <select
// //                   name="maxViews"
// //                   value={materialData.maxViews}
// //                   onChange={handleMaterialDataChange}
// //                   style={styles.select}
// //                   disabled={uploading}
// //                 >
// //                   <option value="Unlimited">Unlimited</option>
// //                   <option value="1">1</option>
// //                   <option value="2">2</option>
// //                   <option value="3">3</option>
// //                   <option value="5">5</option>
// //                   <option value="10">10</option>
// //                 </select>
// //               </div>
// //               <div style={styles.formGroup}>
// //                 <label style={styles.label}>More Options</label>
// //                 <div style={styles.checkboxGroup}>
// //                   <label style={styles.checkboxLabel}>
// //                     <input
// //                       type="checkbox"
// //                       name="isPrerequisite"
// //                       checked={materialData.isPrerequisite}
// //                       onChange={handleMaterialDataChange}
// //                       disabled={uploading}
// //                     />
// //                     Make this a prerequisite
// //                   </label>
// //                   <label style={styles.checkboxLabel}>
// //                     <input
// //                       type="checkbox"
// //                       name="allowDownload"
// //                       checked={materialData.allowDownload}
// //                       onChange={handleMaterialDataChange}
// //                       disabled={uploading}
// //                     />
// //                     Enable download
// //                   </label>
// //                 </div>
// //               </div>
// //               <div style={styles.formGroup}>
// //                 <label style={styles.label}>Allow access on</label>
// //                 <div style={styles.radioGroup}>
// //                   <label style={styles.radioLabel}>
// //                     <input
// //                       type="radio"
// //                       name="accessOn"
// //                       value="Both"
// //                       checked={materialData.accessOn === 'Both'}
// //                       onChange={handleMaterialDataChange}
// //                       disabled={uploading}
// //                     />
// //                     Both
// //                   </label>
// //                   <label style={styles.radioLabel}>
// //                     <input
// //                       type="radio"
// //                       name="accessOn"
// //                       value="App"
// //                       checked={materialData.accessOn === 'App'}
// //                       onChange={handleMaterialDataChange}
// //                       disabled={uploading}
// //                     />
// //                     App
// //                   </label>
// //                 </div>
// //               </div>
// //               {error && <div style={styles.errorMessage}>{error}</div>}
// //               {uploading && (
// //                 <div style={styles.progressBar}>
// //                   <div style={{ ...styles.progressFill, width: `${uploadProgress}%` }} />
// //                   <span style={styles.progressText}>{Math.round(uploadProgress)}%</span>
// //                 </div>
// //               )}
// //             </>
// //           )}

// //           {view === 'youtubeConfig' && (
// //             <>
// //               <p style={styles.subTitle}>
// //                 Type: YouTube <span style={styles.changeLink} onClick={handleBack}>Change</span>
// //               </p>
// //               <div style={styles.formGroup}>
// //                 <label style={styles.label}>
// //                   Material Name <span style={styles.required}>*</span>
// //                 </label>
// //                 <input
// //                   type="text"
// //                   name="name"
// //                   value={materialData.name}
// //                   onChange={handleMaterialDataChange}
// //                   placeholder="Enter a name for this video"
// //                   style={styles.input}
// //                   maxLength={100}
// //                   disabled={uploading}
// //                 />
// //                 <span style={styles.charCount}>{materialData.name.length} / 100</span>
// //               </div>
// //               <div style={styles.formGroup}>
// //                 <label style={styles.label}>
// //                   <span
// //                     style={styles.addDescription}
// //                     onClick={() =>
// //                       setMaterialData((prev) => ({
// //                         ...prev,
// //                         description: prev.description ? '' : ' ',
// //                       }))
// //                     }
// //                   >
// //                     + Add Description (Optional)
// //                   </span>
// //                 </label>
// //                 {materialData.description !== '' && (
// //                   <textarea
// //                     name="description"
// //                     value={materialData.description}
// //                     onChange={handleMaterialDataChange}
// //                     placeholder="Enter a description"
// //                     style={styles.textarea}
// //                     disabled={uploading}
// //                   />
// //                 )}
// //               </div>
// //               <div style={styles.formGroup}>
// //                 <label style={styles.label}>
// //                   YouTube URL <span style={styles.required}>*</span>
// //                 </label>
// //                 <input
// //                   type="text"
// //                   name="url"
// //                   value={materialData.url}
// //                   onChange={handleMaterialDataChange}
// //                   placeholder="Enter YouTube URL (e.g., https://youtu.be/VIDEO_ID)"
// //                   style={styles.input}
// //                   disabled={uploading}
// //                 />
// //               </div>
// //               <div style={styles.formGroup}>
// //                 <label style={styles.label}>
// //                   Maximum views <span style={styles.required}>*</span>
// //                 </label>
// //                 <select
// //                   name="maxViews"
// //                   value={materialData.maxViews}
// //                   onChange={handleMaterialDataChange}
// //                   style={styles.select}
// //                   disabled={uploading}
// //                 >
// //                   <option value="Unlimited">Unlimited</option>
// //                   <option value="1">1</option>
// //                   <option value="2">2</option>
// //                   <option value="3">3</option>
// //                   <option value="5">5</option>
// //                   <option value="10">10</option>
// //                 </select>
// //               </div>
// //               <div style={styles.formGroup}>
// //                 <label style={styles.label}>More Options</label>
// //                 <div style={styles.checkboxGroup}>
// //                   <label style={styles.checkboxLabel}>
// //                     <input
// //                       type="checkbox"
// //                       name="isPrerequisite"
// //                       checked={materialData.isPrerequisite}
// //                       onChange={handleMaterialDataChange}
// //                       disabled={uploading}
// //                     />
// //                     Make this a prerequisite
// //                   </label>
// //                   <label style={styles.checkboxLabel}>
// //                     <input
// //                       type="checkbox"
// //                       name="allowDownload"
// //                       checked={materialData.allowDownload}
// //                       onChange={handleMaterialDataChange}
// //                       disabled={uploading}
// //                     />
// //                     Enable download
// //                   </label>
// //                 </div>
// //               </div>
// //               <div style={styles.formGroup}>
// //                 <label style={styles.label}>Allow access on</label>
// //                 <div style={styles.radioGroup}>
// //                   <label style={styles.radioLabel}>
// //                     <input
// //                       type="radio"
// //                       name="accessOn"
// //                       value="Both"
// //                       checked={materialData.accessOn === 'Both'}
// //                       onChange={handleMaterialDataChange}
// //                       disabled={uploading}
// //                     />
// //                     Both
// //                   </label>
// //                   <label style={styles.radioLabel}>
// //                     <input
// //                       type="radio"
// //                       name="accessOn"
// //                       value="App"
// //                       checked={materialData.accessOn === 'App'}
// //                       onChange={handleMaterialDataChange}
// //                       disabled={uploading}
// //                     />
// //                     App
// //                   </label>
// //                 </div>
// //               </div>
// //               {error && <div style={styles.errorMessage}>{error}</div>}
// //               {uploading && (
// //                 <div style={styles.progressBar}>
// //                   <div style={{ ...styles.progressFill, width: `${uploadProgress}%` }} />
// //                   <span style={styles.progressText}>{Math.round(uploadProgress)}%</span>
// //                 </div>
// //               )}
// //             </>
// //           )}
// //         </div>

// //         <div style={styles.formActions}>
// //           {view === 'typeSelection' ? (
// //             <>
// //               <button onClick={onClose} style={styles.cancelButton} disabled={uploading}>
// //                 Cancel
// //               </button>
// //               <button onClick={handleContinue} style={styles.continueButton} disabled={uploading}>
// //                 Continue
// //               </button>
// //             </>
// //           ) : (
// //             <>
// //               <button onClick={handleBack} style={styles.backButton} disabled={uploading}>
// //                 Back
// //               </button>
// //               <button onClick={handleAddMaterial} style={styles.addButton} disabled={uploading}>
// //                 {uploading ? 'Uploading...' : 'Add Material'}
// //               </button>
// //             </>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// import React, { useState } from 'react';
// import { db } from '../../../../config/firebase';
// import { collection, addDoc } from 'firebase/firestore';
// import { s3Client, debugS3Config } from '../../../../config/aws-config';
// import { PutObjectCommand } from '@aws-sdk/client-s3';

// const AddMaterialModal = ({ isOpen, onClose, curriculumId, sectionId, sessionId }) => {
//   const [view, setView] = useState('typeSelection');
//   const [selectedType, setSelectedType] = useState(null);
//   const [file, setFile] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [error, setError] = useState(null);
//   const [materialData, setMaterialData] = useState({
//     name: '',
//     description: '',
//     url: '', // For YouTube or feedback text
//     maxViews: 'Unlimited',
//     isPrerequisite: false,
//     allowDownload: false,
//     accessOn: 'Both',
//     state: 'draft', // New: "draft" or "scheduled"
//     scheduledAt: '', // New: ISO timestamp for scheduling
//   });

//   const materialTypes = [
//     { type: 'Video', icon: '🎥' },
//     { type: 'PDF', icon: '📄' },
//     { type: 'Image', icon: '🖼️' },
//     { type: 'YouTube', icon: '▶️' },
//     { type: 'Sheet', icon: '📊' },
//     { type: 'Slide', icon: '📑' },
//     { type: 'Assignment', icon: '📋' },
//     { type: 'Form', icon: '📋' },
//     { type: 'Zip', icon: '🗜️' },
//     { type: 'Quiz', icon: '❓' }, // New
//     { type: 'Feedback', icon: '💬' }, // New
//   ];

//   const handleTypeSelect = (type) => {
//     setSelectedType(type);
//     setError(null);
//   };

//   const handleContinue = () => {
//     if (!selectedType) {
//       setError('Please select a material type.');
//       return;
//     }
//     if (selectedType === 'YouTube' || selectedType === 'Feedback') {
//       setView('textConfig'); // For YouTube URL or feedback text
//     } else {
//       setView('fileConfig'); // For file uploads (including Quiz)
//     }
//   };

//   const handleBack = () => {
//     if (uploading) return;
//     setView('typeSelection');
//     setSelectedType(null);
//     setFile(null);
//     setError(null);
//     setUploadProgress(0);
//     setMaterialData({
//       name: '',
//       description: '',
//       url: '',
//       maxViews: 'Unlimited',
//       isPrerequisite: false,
//       allowDownload: false,
//       accessOn: 'Both',
//       state: 'draft',
//       scheduledAt: '',
//     });
//   };

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       const maxSizeInMB = 100;
//       if (selectedFile.size > maxSizeInMB * 1024 * 1024) {
//         setFile(null);
//         setError(`File size exceeds ${maxSizeInMB}MB limit.`);
//         return;
//       }
//       // File type validation (same as before, extended for Quiz)
//       switch (selectedType) {
//         case 'Quiz':
//           if (!['application/pdf', 'image/*'].includes(selectedFile.type)) {
//             setFile(null);
//             setError('Please select a valid quiz file (PDF or image).');
//             return;
//           }
//           break;
//         // Other cases remain unchanged
//         default:
//           break;
//       }
//       setFile(selectedFile);
//       setError(null);
//     }
//   };

//   const handleMaterialDataChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setMaterialData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const handleFileUpload = async () => {
//     if (!file) return null;

//     try {
//       debugS3Config();
//       const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
//       const region = import.meta.env.VITE_AWS_REGION;
//       if (!bucketName || !region) {
//         throw new Error('Missing AWS config: Check VITE_S3_BUCKET_NAME and VITE_AWS_REGION');
//       }

//       const fileKey = `materials/${curriculumId}/${sectionId}/${sessionId}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
//       const fileBuffer = await file.arrayBuffer();
//       const params = {
//         Bucket: bucketName,
//         Key: fileKey,
//         Body: new Uint8Array(fileBuffer),
//         ContentType: file.type,
//       };

//       console.log('Uploading to S3 with params:', params);
//       const uploadResult = await s3Client.send(new PutObjectCommand(params));
//       console.log('S3 Upload Success:', uploadResult);

//       const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;
//       setError(null);
//       setUploadProgress(0);
//       return fileUrl;
//     } catch (error) {
//       console.error('S3 Upload Error:', error);
//       setError(`Failed to upload file: ${error.message}`);
//       setUploadProgress(0);
//       throw error;
//     }
//   };

//   const handleAddMaterial = async () => {
//     if (!materialData.name) {
//       setError('Please enter a name.');
//       return;
//     }
//     if (selectedType !== 'YouTube' && selectedType !== 'Feedback' && !file) {
//       setError('Please upload a file.');
//       return;
//     }
//     if ((selectedType === 'YouTube' || selectedType === 'Feedback') && !materialData.url) {
//       setError(`Please enter a ${selectedType === 'YouTube' ? 'YouTube URL' : 'feedback text'}.`);
//       return;
//     }
//     if (materialData.state === 'scheduled' && !materialData.scheduledAt) {
//       setError('Please set a schedule date and time.');
//       return;
//     }

//     setUploading(true);
//     setError(null);

//     try {
//       const fileUrl = (selectedType === 'YouTube' || selectedType === 'Feedback') 
//         ? materialData.url 
//         : await handleFileUpload();

//       if (!fileUrl && selectedType !== 'YouTube' && selectedType !== 'Feedback') {
//         setUploading(false);
//         return;
//       }

//       await addDoc(collection(db, `curriculums/${curriculumId}/sections/${sectionId}/sessions/${sessionId}/materials`), {
//         type: selectedType,
//         name: materialData.name,
//         description: materialData.description,
//         url: fileUrl,
//         maxViews: materialData.maxViews === 'Unlimited' ? null : parseInt(materialData.maxViews, 10),
//         isPrerequisite: materialData.isPrerequisite,
//         allowDownload: materialData.allowDownload,
//         accessOn: materialData.accessOn,
//         state: materialData.state,
//         scheduledAt: materialData.state === 'scheduled' ? new Date(materialData.scheduledAt).toISOString() : null,
//         createdAt: new Date(),
//       });

//       setUploading(false);
//       onClose();
//     } catch (err) {
//       console.error('Error saving material:', err);
//       setError('Failed to save: ' + err.message);
//       setUploading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div style={styles.modalOverlay}>
//       <div style={styles.modal}>
//         <div style={styles.modalHeader}>
//           <h3>Add Material</h3>
//           <button onClick={onClose} style={styles.closeButton} disabled={uploading}>✕</button>
//         </div>

//         <div style={styles.modalContent}>
//           {view === 'typeSelection' && (
//             <>
//               <p style={styles.subTitle}>Select material type</p>
//               <div style={styles.materialGrid}>
//                 {materialTypes.map((material) => (
//                   <div
//                     key={material.type}
//                     style={{
//                       ...styles.materialItem,
//                       backgroundColor: selectedType === material.type ? '#e0e7ff' : '#fff',
//                     }}
//                     onClick={() => handleTypeSelect(material.type)}
//                   >
//                     <span style={styles.materialIcon}>{material.icon}</span>
//                     <span style={styles.materialLabel}>{material.type}</span>
//                   </div>
//                 ))}
//               </div>
//               {error && <div style={styles.errorMessage}>{error}</div>}
//             </>
//           )}

//           {(view === 'fileConfig' || view === 'textConfig') && (
//             <>
//               <p style={styles.subTitle}>
//                 Type: {selectedType} <span style={styles.changeLink} onClick={handleBack}>Change</span>
//               </p>
//               <div style={styles.formGroup}>
//                 <label style={styles.label}>Name <span style={styles.required}>*</span></label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={materialData.name}
//                   onChange={handleMaterialDataChange}
//                   placeholder={`Enter ${selectedType} name`}
//                   style={styles.input}
//                   maxLength={100}
//                   disabled={uploading}
//                 />
//                 <span style={styles.charCount}>{materialData.name.length} / 100</span>
//               </div>
//               <div style={styles.formGroup}>
//                 <label style={styles.label}>Description (Optional)</label>
//                 <textarea
//                   name="description"
//                   value={materialData.description}
//                   onChange={handleMaterialDataChange}
//                   placeholder="Enter a description"
//                   style={styles.textarea}
//                   disabled={uploading}
//                 />
//               </div>
//               {view === 'fileConfig' && (
//                 <div style={styles.formGroup}>
//                   <label style={styles.label}>Upload file <span style={styles.required}>*</span></label>
//                   <div style={styles.uploadBox}>
//                     {file ? (
//                       <p style={styles.fileName}>Selected file: {file.name}</p>
//                     ) : (
//                       <>
//                         <span style={styles.uploadIcon}>☁️</span>
//                         <p>Upload {selectedType.toLowerCase()} file</p>
//                         <p style={styles.uploadNote}>Max file size: 100MB</p>
//                       </>
//                     )}
//                     <input
//                       type="file"
//                       accept={
//                         selectedType === 'Quiz' ? 'application/pdf,image/*' :
//                         selectedType === 'Video' ? 'video/mp4,video/mpeg,video/webm' :
//                         selectedType === 'PDF' ? 'application/pdf' :
//                         selectedType === 'Image' ? 'image/*' :
//                         selectedType === 'Sheet' ? '.xls,.xlsx' :
//                         selectedType === 'Slide' ? '.ppt,.pptx' :
//                         selectedType === 'Assignment' || selectedType === 'Form' ? 'application/pdf' :
//                         selectedType === 'Zip' ? 'application/zip' : '*/*'
//                       }
//                       onChange={handleFileChange}
//                       style={styles.fileInputOverlay}
//                       disabled={uploading}
//                     />
//                   </div>
//                 </div>
//               )}
//               {view === 'textConfig' && (
//                 <div style={styles.formGroup}>
//                   <label style={styles.label}>
//                     {selectedType === 'YouTube' ? 'YouTube URL' : 'Feedback Text'} <span style={styles.required}>*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="url"
//                     value={materialData.url}
//                     onChange={handleMaterialDataChange}
//                     placeholder={selectedType === 'YouTube' ? 'Enter YouTube URL' : 'Enter feedback text'}
//                     style={styles.input}
//                     disabled={uploading}
//                   />
//                 </div>
//               )}
//               <div style={styles.formGroup}>
//                 <label style={styles.label}>State <span style={styles.required}>*</span></label>
//                 <select
//                   name="state"
//                   value={materialData.state}
//                   onChange={handleMaterialDataChange}
//                   style={styles.select}
//                   disabled={uploading}
//                 >
//                   <option value="draft">Draft</option>
//                   <option value="scheduled">Scheduled</option>
//                 </select>
//               </div>
//               {materialData.state === 'scheduled' && (
//                 <div style={styles.formGroup}>
//                   <label style={styles.label}>Schedule Date/Time <span style={styles.required}>*</span></label>
//                   <input
//                     type="datetime-local"
//                     name="scheduledAt"
//                     value={materialData.scheduledAt}
//                     onChange={handleMaterialDataChange}
//                     style={styles.input}
//                     disabled={uploading}
//                   />
//                 </div>
//               )}
//               {error && <div style={styles.errorMessage}>{error}</div>}
//               {uploading && (
//                 <div style={styles.progressBar}>
//                   <div style={{ ...styles.progressFill, width: `${uploadProgress}%` }} />
//                   <span style={styles.progressText}>{Math.round(uploadProgress)}%</span>
//                 </div>
//               )}
//             </>
//           )}
//         </div>

//         <div style={styles.formActions}>
//           {view === 'typeSelection' ? (
//             <>
//               <button onClick={onClose} style={styles.cancelButton} disabled={uploading}>Cancel</button>
//               <button onClick={handleContinue} style={styles.continueButton} disabled={uploading}>Continue</button>
//             </>
//           ) : (
//             <>
//               <button onClick={handleBack} style={styles.backButton} disabled={uploading}>Back</button>
//               <button onClick={handleAddMaterial} style={styles.addButton} disabled={uploading}>
//                 {uploading ? 'Saving...' : 'Save'}
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Styles (unchanged for brevity, assume same as previous)
// // const styles = {
// //   modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'flex-end', zIndex: 1000 },
// //   modal: { backgroundColor: '#fff', width: '400px', height: '100%', padding: '20px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)', animation: 'slideIn 0.3s ease-out' },
// //   // ... other styles ...
// // };

// // export default AddMaterialModal;
// // Inline styles (unchanged from your original)
// const styles = {
//   modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'flex-end', zIndex: 1000 },
//   modal: { backgroundColor: '#fff', width: '400px', height: '100%', padding: '20px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)', animation: 'slideIn 0.3s ease-out' },
//   modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
//   closeButton: { background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer' },
//   modalContent: { flex: 1 },
//   subTitle: { fontSize: '14px', color: '#333', marginBottom: '20px' },
//   changeLink: { color: '#007bff', cursor: 'pointer', marginLeft: '10px' },
//   materialGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' },
//   materialItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.2s' },
//   materialIcon: { fontSize: '24px', marginBottom: '5px' },
//   materialLabel: { fontSize: '12px', textAlign: 'center' },
//   note: { fontSize: '12px', color: '#666' },
//   formGroup: { marginBottom: '20px' },
//   label: { display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold' },
//   required: { color: 'red' },
//   input: { width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' },
//   textarea: { width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box', minHeight: '100px' },
//   charCount: { fontSize: '12px', color: '#666', textAlign: 'right', marginTop: '5px' },
//   addDescription: { color: '#007bff', cursor: 'pointer' },
//   uploadBox: { border: '2px dashed #ddd', borderRadius: '5px', padding: '20px', textAlign: 'center', position: 'relative' },
//   uploadIcon: { fontSize: '24px', color: '#666' },
//   uploadNote: { fontSize: '12px', color: '#666' },
//   fileInputOverlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' },
//   fileName: { fontSize: '12px', color: '#666', marginTop: '5px' },
//   select: { width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' },
//   checkboxGroup: { display: 'flex', flexDirection: 'column', gap: '10px' },
//   checkboxLabel: { display: 'flex', alignItems: 'center', fontSize: '14px' },
//   radioGroup: { display: 'flex', gap: '20px' },
//   radioLabel: { display: 'flex', alignItems: 'center', fontSize: '14px' },
//   errorMessage: { color: 'red', fontSize: '14px', marginBottom: '10px' },
//   formActions: { display: 'flex', justifyContent: 'flex-end', gap: '10px' },
//   cancelButton: { padding: '8px 15px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '5px', cursor: 'pointer' },
//   continueButton: { padding: '8px 15px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' },
//   backButton: { padding: '8px 15px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '5px', cursor: 'pointer' },
//   addButton: { padding: '8px 15px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' },
//   progressBar: { width: '100%', backgroundColor: '#f0f0f0', borderRadius: '5px', height: '20px', position: 'relative', marginTop: '10px' },
//   progressFill: { height: '100%', backgroundColor: '#007bff', borderRadius: '5px', transition: 'width 0.3s ease' },
//   progressText: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '12px', color: '#fff' },
// };

// const styleSheet = document.createElement('style');
// styleSheet.innerHTML = `@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`;
// document.head.appendChild(styleSheet);

// export default AddMaterialModal;

import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../../config/firebase';
import { doc, getDoc, collection, addDoc, getDocs } from 'firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';
import { s3Client, debugS3Config } from '../../../../config/aws-config';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { useAuth } from '../../../../context/AuthContext';

const AddMaterialModal = ({ isOpen, onClose, curriculumId, sectionId, sessionId, allowedMaterialTypes }) => {
  const [view, setView] = useState('typeSelection');
  const [selectedType, setSelectedType] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formTemplates, setFormTemplates] = useState([]); // New state for form templates
  const { user, rolePermissions } = useAuth();
  const canView = rolePermissions?.curriculums?.display || false;
  const [materialData, setMaterialData] = useState({
    name: '',
    description: '',
    url: '',
    templateId: '', // New field for form template ID
    maxViews: 'Unlimited',
    isPrerequisite: false,
    allowDownload: false,
    accessOn: 'Both',
    state: 'draft',
    scheduledAt: '',
  });

  const materialTypes = [
    { type: 'Video', icon: '🎥' },
    { type: 'PDF', icon: '📄' },
    { type: 'Image', icon: '🖼️' },
    { type: 'YouTube', icon: '▶️' },
    { type: 'Sheet', icon: '📊' },
    { type: 'Slide', icon: '📑' },
    { type: 'Assignment', icon: '📋' },
    { type: 'Form', icon: '📋' },
    { type: 'Zip', icon: '🗜️' },
    { type: 'Quiz', icon: '❓' },
    { type: 'Feedback', icon: '💬' },
  ].filter((mt) => !allowedMaterialTypes || allowedMaterialTypes.includes(mt.type));

  // Fetch user role (unchanged)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, 'Users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role || 'student');
          } else {
            console.warn('No user document found for UID:', user.uid);
            setUserRole('student');
          }
        } catch (err) {
          console.error('Error fetching user role:', err);
          setError('Failed to verify permissions.');
          setUserRole('student');
        }
      } else {
        setUserRole(null);
      }
      setLoading(false);
    }, (err) => {
      console.error('Auth state error:', err);
      setError('Authentication error.');
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch form templates when selectedType is Form
  useEffect(() => {
    if (selectedType === 'Form') {
      const fetchFormTemplates = async () => {
        try {
          const templatesCollection = collection(db, 'templates');
          const templatesSnapshot = await getDocs(templatesCollection);
          const templatesList = templatesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setFormTemplates(templatesList);
        } catch (err) {
          console.error('Error fetching form templates:', err);
          setError('Failed to load form templates.');
        }
      };
      fetchFormTemplates();
    }
  }, [selectedType]);

  // Log activity to Firestore (unchanged)
  const logActivity = async (action, details) => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      await addDoc(collection(db, 'activityLogs'), {
        userId: user.uid,
        email: user.email,
        action,
        details,
        timestamp: serverTimestamp(),
        curriculumId,
        sectionId,
        sessionId: sessionId || null,
      });
    } catch (err) {
      console.error('Error logging activity:', err);
    }
  };

  // Permission check (unchanged)
  const hasPermission = () => {
    return canView;
  };

  const handleTypeSelect = (type) => {
    if (!hasPermission()) {
      setError('You don’t have permission to add materials.');
      return;
    }
    setSelectedType(type);
    setError(null);
  };

  const handleContinue = () => {
    if (!hasPermission()) {
      setError('You don’t have permission to add materials.');
      return;
    }
    if (!selectedType) {
      setError('Please select a material type.');
      return;
    }
    setView(selectedType === 'YouTube' || selectedType === 'Feedback' || selectedType === 'Form' ? 'textConfig' : 'fileConfig');
  };

  const handleBack = () => {
    if (uploading) return;
    setView('typeSelection');
    setSelectedType(null);
    setFile(null);
    setError(null);
    setUploadProgress(0);
    setMaterialData({
      name: '',
      description: '',
      url: '',
      templateId: '',
      maxViews: 'Unlimited',
      isPrerequisite: false,
      allowDownload: false,
      accessOn: 'Both',
      state: 'draft',
      scheduledAt: '',
    });
  };

  const handleFileChange = (e) => {
    if (!hasPermission()) {
      setError('You don’t have permission to upload files.');
      return;
    }
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const maxSizeInMB = 100;
    if (selectedFile.size > maxSizeInMB * 1024 * 1024) {
      setFile(null);
      setError(`File size exceeds ${maxSizeInMB}MB limit.`);
      return;
    }

    const mimeChecks = {
      Quiz: ['application/pdf', 'image/jpeg', 'image/png'],
      Video: ['video/mp4', 'video/mpeg', 'video/webm'],
      PDF: ['application/pdf'],
      Image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      Sheet: [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ],
      Slide: [
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      ],
      Assignment: ['application/pdf'],
      Form: ['application/pdf'], // This won't be used since we’re using templates
      Zip: ['application/zip', 'application/x-zip-compressed'],
    };

    if (mimeChecks[selectedType] && !mimeChecks[selectedType].includes(selectedFile.type)) {
      setFile(null);
      setError(`Please select a valid ${selectedType.toLowerCase()} file.`);
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  const handleMaterialDataChange = (e) => {
    if (!hasPermission()) {
      setError('You don’t have permission to modify material data.');
      return;
    }
    const { name, value, type, checked } = e.target;
    setMaterialData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileUpload = async () => {
    if (!file) return null;

    try {
      debugS3Config();
      const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
      const region = import.meta.env.VITE_AWS_REGION;
      if (!bucketName || !region) {
        throw new Error('Missing AWS config: Check VITE_S3_BUCKET_NAME and VITE_AWS_REGION');
      }

      const fileKey = sessionId
        ? `materials/${curriculumId}/${sectionId}/${sessionId}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`
        : `materials/${curriculumId}/${sectionId}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const fileBuffer = await file.arrayBuffer();
      const params = {
        Bucket: bucketName,
        Key: fileKey,
        Body: new Uint8Array(fileBuffer),
        ContentType: file.type,
      };

      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(Math.min(progress, 90));
        if (progress >= 90) clearInterval(interval);
      }, 500);

      const uploadResult = await s3Client.send(new PutObjectCommand(params));
      clearInterval(interval);
      setUploadProgress(100);

      const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;
      await logActivity('file_upload', `Uploaded ${selectedType} file: ${file.name} to S3`);

      return fileUrl;
    } catch (error) {
      console.error('S3 Upload Error:', error);
      setError(`Failed to upload file: ${error.message}`);
      setUploadProgress(0);
      throw error;
    }
  };

  const handleAddMaterial = async () => {
    if (!hasPermission()) {
      setError('You don’t have permission to add materials.');
      return;
    }
    if (!materialData.name) {
      setError('Please enter a name.');
      return;
    }
    if (selectedType === 'Form' && !materialData.templateId) {
      setError('Please select a form template.');
      return;
    }
    if (
      selectedType !== 'YouTube' &&
      selectedType !== 'Feedback' &&
      selectedType !== 'Form' &&
      !file
    ) {
      setError('Please upload a file.');
      return;
    }
    if (
      selectedType === 'YouTube' &&
      materialData.url &&
      !materialData.url.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//)
    ) {
      setError('Please enter a valid YouTube URL.');
      return;
    }
    if (selectedType === 'Feedback' && !materialData.url) {
      setError('Please enter feedback text.');
      return;
    }
    if (materialData.state === 'scheduled' && !materialData.scheduledAt) {
      setError('Please set a schedule date and time.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      let fileUrl = null;
      if (selectedType !== 'YouTube' && selectedType !== 'Feedback' && selectedType !== 'Form') {
        fileUrl = await handleFileUpload();
        if (!fileUrl) {
          throw new Error('File upload failed.');
        }
      } else if (selectedType === 'YouTube' || selectedType === 'Feedback') {
        fileUrl = materialData.url;
      }
      // For Form, fileUrl remains null, and templateId is used

      const collectionPath = sessionId
        ? `curriculums/${curriculumId}/sections/${sectionId}/sessions/${sessionId}/materials`
        : `curriculums/${curriculumId}/sections/${sectionId}/materials`;

      await addDoc(collection(db, collectionPath), {
        type: selectedType,
        name: materialData.name,
        description: materialData.description || null,
        url: fileUrl || null,
        templateId: selectedType === 'Form' ? materialData.templateId : null, // Store templateId for Form
        maxViews: materialData.maxViews === 'Unlimited' ? null : parseInt(materialData.maxViews, 10),
        isPrerequisite: materialData.isPrerequisite,
        allowDownload: materialData.allowDownload,
        accessOn: materialData.accessOn,
        state: materialData.state,
        scheduledAt: materialData.state === 'scheduled' ? new Date(materialData.scheduledAt).toISOString() : null,
        createdAt: serverTimestamp(),
      });

      await logActivity('Material Added', `Added ${selectedType} material: ${materialData.name}`);
      onClose();
    } catch (err) {
      console.error('Error saving material:', err);
      setError('Failed to save material: ' + err.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  if (!isOpen || loading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
      <div className="bg-white w-full max-w-md h-full p-6 shadow-lg animate-slide-in-right overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Add Material</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl disabled:opacity-50"
            disabled={uploading}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 space-y-6">
          {view === 'typeSelection' && (
            <>
              <p className="text-sm text-gray-600">Select material type</p>
              <div className="grid grid-cols-4 gap-3">
                {materialTypes.map((material) => (
                  <div
                    key={material.type}
                    className={`flex flex-col items-center p-3 border rounded-md cursor-pointer transition-colors ${
                      selectedType === material.type ? 'bg-indigo-100 border-indigo-500' : 'bg-white border-gray-200'
                    } hover:bg-gray-50`}
                    onClick={() => handleTypeSelect(material.type)}
                  >
                    <span className="text-2xl mb-2">{material.icon}</span>
                    <span className="text-xs text-center">{material.type}</span>
                  </div>
                ))}
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
            </>
          )}

          {(view === 'fileConfig' || view === 'textConfig') && (
            <>
              <p className="text-sm text-gray-600">
                Type: {selectedType}
                <span
                  className="ml-2 text-indigo-600 cursor-pointer hover:underline"
                  onClick={handleBack}
                >
                  Change
                </span>
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={materialData.name}
                    onChange={handleMaterialDataChange}
                    placeholder={`Enter ${selectedType} name`}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                    maxLength={100}
                    disabled={uploading}
                    required
                  />
                  <p className="text-xs text-gray-500 text-right mt-1">
                    {materialData.name.length} / 100
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description (Optional)
                  </label>
                  <textarea
                    name="description"
                    value={materialData.description}
                    onChange={handleMaterialDataChange}
                    placeholder="Enter a description"
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 min-h-[100px]"
                    disabled={uploading}
                  />
                </div>
                {view === 'fileConfig' && selectedType !== 'Form' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Upload file <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 p-4 border-2 border-dashed border-gray-300 rounded-md text-center relative">
                      {file ? (
                        <p className="text-sm text-gray-600">Selected: {file.name}</p>
                      ) : (
                        <>
                          <span className="text-2xl text-gray-400">☁️</span>
                          <p className="text-sm text-gray-600 mt-2">
                            Upload {selectedType.toLowerCase()} file
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Max size: 100MB</p>
                        </>
                      )}
                      <input
                        type="file"
                        accept={
                          selectedType === 'Quiz'
                            ? 'application/pdf,image/jpeg,image/png'
                            : selectedType === 'Video'
                            ? 'video/mp4,video/mpeg,video/webm'
                            : selectedType === 'PDF'
                            ? 'application/pdf'
                            : selectedType === 'Image'
                            ? 'image/*'
                            : selectedType === 'Sheet'
                            ? '.xls,.xlsx'
                            : selectedType === 'Slide'
                            ? '.ppt,.pptx'
                            : selectedType === 'Assignment'
                            ? 'application/pdf'
                            : selectedType === 'Zip'
                            ? 'application/zip'
                            : '*/*'
                        }
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        disabled={uploading}
                      />
                    </div>
                  </div>
                )}
                {selectedType === 'Form' && view === 'textConfig' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Select Form Template <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="templateId"
                      value={materialData.templateId}
                      onChange={handleMaterialDataChange}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                      disabled={uploading || formTemplates.length === 0}
                      required
                    >
                      <option value="">Select a template</option>
                      {formTemplates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.name || `Template ${template.id}`}
                        </option>
                      ))}
                    </select>
                    {formTemplates.length === 0 && (
                      <p className="text-sm text-gray-500 mt-1">No form templates available.</p>
                    )}
                  </div>
                )}
                {(selectedType === 'YouTube' || selectedType === 'Feedback') && view === 'textConfig' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {selectedType === 'YouTube' ? 'YouTube URL' : 'Feedback Text'}{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="url"
                      value={materialData.url}
                      onChange={handleMaterialDataChange}
                      placeholder={selectedType === 'YouTube' ? 'Enter YouTube URL' : 'Enter feedback text'}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                      disabled={uploading}
                      required
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="state"
                    value={materialData.state}
                    onChange={handleMaterialDataChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                    disabled={uploading}
                  >
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
                {materialData.state === 'scheduled' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Schedule Date/Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      name="scheduledAt"
                      value={materialData.scheduledAt}
                      onChange={handleMaterialDataChange}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                      disabled={uploading}
                      required
                    />
                  </div>
                )}
                <div className="flex gap-4">
                  <label className="flex items-center text-sm text-gray-700">
                    <input
                      type="checkbox"
                      name="isPrerequisite"
                      checked={materialData.isPrerequisite}
                      onChange={handleMaterialDataChange}
                      className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
                      disabled={uploading}
                    />
                    Prerequisite
                  </label>
                  <label className="flex items-center text-sm text-gray-700">
                    <input
                      type="checkbox"
                      name="allowDownload"
                      checked={materialData.allowDownload}
                      onChange={handleMaterialDataChange}
                      className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
                      disabled={uploading}
                    />
                    Allow Download
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Access On <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="accessOn"
                    value={materialData.accessOn}
                    onChange={handleMaterialDataChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                    disabled={uploading}
                  >
                    <option value="Both">Both</option>
                    <option value="Web">Web</option>
                    <option value="Mobile">Mobile</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Max Views
                  </label>
                  <input
                    type="text"
                    name="maxViews"
                    value={materialData.maxViews}
                    onChange={handleMaterialDataChange}
                    placeholder="Enter max views or Unlimited"
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                    disabled={uploading}
                  />
                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                {uploading && (
                  <div className="relative w-full h-5 bg-gray-200 rounded-md">
                    <div
                      className="absolute h-full bg-indigo-600 rounded-md transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                    <span className="absolute inset-0 text-xs text-white text-center leading-5">
                      {Math.round(uploadProgress)}%
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          {view === 'typeSelection' ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                onClick={handleContinue}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                disabled={uploading}
              >
                Continue
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleBack}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                disabled={uploading}
              >
                Back
              </button>
              <button
                onClick={handleAddMaterial}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                disabled={uploading}
              >
                {uploading ? 'Saving...' : 'Save'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddMaterialModal;