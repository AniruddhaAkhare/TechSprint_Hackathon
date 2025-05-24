
// import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
// import { db, auth } from '../../../../config/firebase';
// import { doc, getDoc, collection, addDoc, getDocs } from 'firebase/firestore';
// import { serverTimestamp } from 'firebase/firestore';
// import { s3Client, debugS3Config } from '../../../../config/aws-config';
// import { PutObjectCommand } from '@aws-sdk/client-s3';
// import { useAuth } from '../../../../context/AuthContext';

// const AddMaterialModal = ({ isOpen, onClose, curriculumId, sectionId, sessionId, allowedMaterialTypes }) => {
//   const [view, setView] = useState('typeSelection');
//   const [selectedType, setSelectedType] = useState(null);
//   const [file, setFile] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [error, setError] = useState(null);
//   const [userRole, setUserRole] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [formTemplates, setFormTemplates] = useState([]);
//   const [formTemplatesLoading, setFormTemplatesLoading] = useState(false);
//   const { user, rolePermissions } = useAuth();
//   const canView = rolePermissions?.curriculums?.display || false;
//   const [materialData, setMaterialData] = useState({
//     name: '',
//     description: '',
//     url: '',
//     templateId: '',
//     maxViews: 'Unlimited',
//     isPrerequisite: false,
//     allowDownload: false,
//     accessOn: 'Both',
//     state: 'draft',
//     scheduledAt: '',
//   });
//   const modalRef = useRef(null);
//   const hasUnsavedChangesRef = useRef(false);

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
//     { type: 'Quiz', icon: '❓' },
//     { type: 'Feedback', icon: '💬' },
//   ].filter((mt) => !allowedMaterialTypes || allowedMaterialTypes.includes(mt.type));

//   // Reset form state
//   const resetForm = useCallback(() => {
//     setView('typeSelection');
//     setSelectedType(null);
//     setFile(null);
//     setUploadProgress(0);
//     setError(null);
//     setMaterialData({
//       name: '',
//       description: '',
//       url: '',
//       templateId: '',
//       maxViews: 'Unlimited',
//       isPrerequisite: false,
//       allowDownload: false,
//       accessOn: 'Both',
//       state: 'draft',
//       scheduledAt: '',
//     });
//     hasUnsavedChangesRef.current = false;
//   }, []);

//   // Fetch user role
//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged(async (user) => {
//       if (user) {
//         try {
//           const userDocRef = doc(db, 'Users', user.uid);
//           const userDoc = await getDoc(userDocRef);
//           setUserRole(userDoc.exists() ? userDoc.data().role || 'student' : 'student');
//         } catch (err) {
//           console.error('Error fetching user role:', err);
//           setError('Failed to verify permissions.');
//           setUserRole('student');
//         }
//       } else {
//         setUserRole(null);
//       }
//       setLoading(false);
//     }, (err) => {
//       console.error('Auth state error:', err);
//       setError('Authentication error.');
//       setLoading(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   // Fetch form templates when selectedType is Form
//   useEffect(() => {
//     if (selectedType === 'Form') {
//       setFormTemplatesLoading(true);
//       const fetchFormTemplates = async () => {
//         try {
//           const templatesCollection = collection(db, 'templates');
//           const templatesSnapshot = await getDocs(templatesCollection);
//           const templatesList = templatesSnapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
//           setFormTemplates(templatesList);
//         } catch (err) {
//           console.error('Error fetching form templates:', err);
//           setError('Failed to load form templates.');
//         } finally {
//           setFormTemplatesLoading(false);
//         }
//       };
//       fetchFormTemplates();
//     } else {
//       setFormTemplates([]);
//       setFormTemplatesLoading(false);
//     }
//   }, [selectedType]);

//   // Handle modal open/close and keyboard events
//   useEffect(() => {
//     if (isOpen) {
//       resetForm(); // Reset form when modal opens
//       const handleKeyDown = (e) => {
//         if (e.key === 'Escape' && !uploading) {
//           handleClose();
//         }
//       };
//       document.addEventListener('keydown', handleKeyDown);
//       return () => document.removeEventListener('keydown', handleKeyDown);
//     }
//   }, [isOpen, uploading, resetForm]);

//   // Handle click outside to close modal
//   const handleClickOutside = useCallback(
//     (e) => {
//       if (modalRef.current && !modalRef.current.contains(e.target) && !uploading) {
//         handleClose();
//       }
//     },
//     [uploading]
//   );

//   useEffect(() => {
//     if (isOpen) {
//       document.addEventListener('mousedown', handleClickOutside);
//       return () => document.removeEventListener('mousedown', handleClickOutside);
//     }
//   }, [isOpen, handleClickOutside]);

//   // Log activity to Firestore
//   const logActivity = async (action, details) => {
//     if (!user) return;
//     try {
//       await addDoc(collection(db, 'activityLogs'), {
//         userId: user.uid,
//         email: user.email,
//         action,
//         details,
//         timestamp: serverTimestamp(),
//         curriculumId,
//         sectionId,
//         sessionId: sessionId || null,
//       });
//     } catch (err) {
//       console.error('Error logging activity:', err);
//     }
//   };

//   // Permission check
//   const hasPermission = useCallback(() => canView, [canView]);

//   const handleTypeSelect = useCallback(
//     (type) => {
//       if (!hasPermission()) {
//         setError('You don’t have permission to add materials.');
//         return;
//       }
//       setSelectedType(type);
//       setError(null);
//       hasUnsavedChangesRef.current = true;
//     },
//     [hasPermission]
//   );

//   const handleContinue = useCallback(() => {
//     if (!hasPermission()) {
//       setError('You don’t have permission to add materials.');
//       return;
//     }
//     if (!selectedType) {
//       setError('Please select a material type.');
//       return;
//     }
//     setView(selectedType === 'YouTube' || selectedType === 'Feedback' || selectedType === 'Form' ? 'textConfig' : 'fileConfig');
//   }, [hasPermission, selectedType]);

//   const handleBack = useCallback(() => {
//     if (uploading) return;
//     setView('typeSelection');
//     setSelectedType(null);
//     setFile(null);
//     setError(null);
//     setUploadProgress(0);
//     hasUnsavedChangesRef.current = true;
//   }, [uploading]);

//   const handleClose = useCallback(() => {
//     if (uploading) return;
//     if (hasUnsavedChangesRef.current && !window.confirm('You have unsaved changes. Are you sure you want to close?')) {
//       return;
//     }
//     resetForm();
//     onClose();
//   }, [uploading, onClose, resetForm]);

//   const handleFileChange = useCallback(
//     (e) => {
//       if (!hasPermission()) {
//         setError('You don’t have permission to upload files.');
//         return;
//       }
//       const selectedFile = e.target.files[0];
//       if (!selectedFile) return;

//       const maxSizeInMB = 100;
//       if (selectedFile.size > maxSizeInMB * 1024 * 1024) {
//         setFile(null);
//         setError(`File size exceeds ${maxSizeInMB}MB limit.`);
//         return;
//       }

//       const mimeChecks = {
//         Quiz: ['application/pdf', 'image/jpeg', 'image/png'],
//         Video: ['video/mp4', 'video/mpeg', 'video/webm'],
//         PDF: ['application/pdf'],
//         Image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
//         Sheet: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
//         Slide: ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
//         Assignment: ['application/pdf'],
//         Form: ['application/pdf'],
//         Zip: ['application/zip', 'application/x-zip-compressed'],
//       };

//       if (mimeChecks[selectedType] && !mimeChecks[selectedType].includes(selectedFile.type)) {
//         setFile(null);
//         setError(`Please select a valid ${selectedType.toLowerCase()} file.`);
//         return;
//       }

//       setFile(selectedFile);
//       setError(null);
//       hasUnsavedChangesRef.current = true;
//     },
//     [hasPermission, selectedType]
//   );

//   const handleMaterialDataChange = useCallback(
//     (e) => {
//       if (!hasPermission()) {
//         setError('You don’t have permission to modify material data.');
//         return;
//       }
//       const { name, value, type, checked } = e.target;
//       setMaterialData((prev) => ({
//         ...prev,
//         [name]: type === 'checkbox' ? checked : value,
//       }));
//       hasUnsavedChangesRef.current = true;
//     },
//     [hasPermission]
//   );

//   const handleFileUpload = useCallback(async () => {
//     if (!file) return null;

//     try {
//       debugS3Config();
//       const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
//       const region = import.meta.env.VITE_AWS_REGION;
//       if (!bucketName || !region) {
//         throw new Error('Missing AWS config: Check VITE_S3_BUCKET_NAME and VITE_AWS_REGION');
//       }

//       const fileKey = sessionId
//         ? `materials/${curriculumId}/${sectionId}/${sessionId}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`
//         : `materials/${curriculumId}/${sectionId}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
//       const fileBuffer = await file.arrayBuffer();
//       const params = {
//         Bucket: bucketName,
//         Key: fileKey,
//         Body: new Uint8Array(fileBuffer),
//         ContentType: file.type,
//       };

//       let progress = 0;
//       const interval = setInterval(() => {
//         progress += 10;
//         setUploadProgress(Math.min(progress, 90));
//         if (progress >= 90) clearInterval(interval);
//       }, 500);

//       await s3Client.send(new PutObjectCommand(params));
//       clearInterval(interval);
//       setUploadProgress(100);

//       const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;
//       await logActivity('file_upload', `Uploaded ${selectedType} file: ${file.name} to S3`);

//       return fileUrl;
//     } catch (error) {
//       console.error('S3 Upload Error:', error);
//       setError(`Failed to upload file: ${error.message}`);
//       setUploadProgress(0);
//       throw error;
//     }
//   }, [file, curriculumId, sectionId, sessionId, selectedType]);

//   const handleAddMaterial = useCallback(async () => {
//     if (!hasPermission()) {
//       setError('You don’t have permission to add materials.');
//       return;
//     }
//     if (!materialData.name) {
//       setError('Please enter a name.');
//       return;
//     }
//     if (selectedType === 'Form' && !materialData.templateId) {
//       setError('Please select a form template.');
//       return;
//     }
//     if (selectedType !== 'YouTube' && selectedType !== 'Feedback' && selectedType !== 'Form' && !file) {
//       setError('Please upload a file.');
//       return;
//     }
//     if (
//       selectedType === 'YouTube' &&
//       materialData.url &&
//       !materialData.url.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//)
//     ) {
//       setError('Please enter a valid YouTube URL.');
//       return;
//     }
//     if (selectedType === 'Feedback' && !materialData.url) {
//       setError('Please enter feedback text.');
//       return;
//     }
//     if (materialData.state === 'scheduled' && !materialData.scheduledAt) {
//       setError('Please set a schedule date and time.');
//       return;
//     }

//     setUploading(true);
//     setError(null);

//     try {
//       let fileUrl = null;
//       if (selectedType !== 'YouTube' && selectedType !== 'Feedback' && selectedType !== 'Form') {
//         fileUrl = await handleFileUpload();
//         if (!fileUrl) throw new Error('File upload failed.');
//       } else if (selectedType === 'YouTube' || selectedType === 'Feedback') {
//         fileUrl = materialData.url;
//       }

//       const collectionPath = sessionId
//         ? `curriculums/${curriculumId}/sections/${sectionId}/sessions/${sessionId}/materials`
//         : `curriculums/${curriculumId}/sections/${sectionId}/materials`;

//       await addDoc(collection(db, collectionPath), {
//         type: selectedType,
//         name: materialData.name,
//         description: materialData.description || null,
//         url: fileUrl || null,
//         templateId: selectedType === 'Form' ? materialData.templateId : null,
//         maxViews: materialData.maxViews === 'Unlimited' ? null : parseInt(materialData.maxViews, 10),
//         isPrerequisite: materialData.isPrerequisite,
//         allowDownload: materialData.allowDownload,
//         accessOn: materialData.accessOn,
//         state: materialData.state,
//         scheduledAt: materialData.state === 'scheduled' ? new Date(materialData.scheduledAt).toISOString() : null,
//         createdAt: serverTimestamp(),
//       });

//       await logActivity('Material Added', `Added ${selectedType} material: ${materialData.name}`);
//       resetForm();
//       onClose();
//     } catch (err) {
//       console.error('Error saving material:', err);
//       setError('Failed to save material: ' + err.message);
//     } finally {
//       setUploading(false);
//       setUploadProgress(0);
//     }
//   }, [
//     hasPermission,
//     materialData,
//     selectedType,
//     file,
//     curriculumId,
//     sectionId,
//     sessionId,
//     handleFileUpload,
//     resetForm,
//     onClose,
//   ]);

//   if (!isOpen) return null;

//   return (
//     <div
//       className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50"
//       role="dialog"
//       aria-labelledby="add-material-modal-title"
//       aria-modal="true"
//     >
//       <div
//         ref={modalRef}
//         className="bg-white w-full max-w-md h-full p-6 shadow-lg animate-slide-in-right overflow-y-auto"
//       >
//         {loading ? (
//           <div className="flex justify-center items-center h-full">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
//           </div>
//         ) : (
//           <>
//             <div className="flex justify-between items-center mb-6">
//               <h3 id="add-material-modal-title" className="text-lg font-semibold text-gray-900">
//                 Add Material
//               </h3>
//               <button
//                 onClick={handleClose}
//                 className="text-gray-500 hover:text-gray-700 text-xl disabled:opacity-50"
//                 disabled={uploading}
//                 aria-label="Close modal"
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="flex-1 space-y-6">
//               {view === 'typeSelection' && (
//                 <>
//                   <p className="text-sm text-gray-600">Select material type</p>
//                   <div className="grid grid-cols-4 gap-3">
//                     {materialTypes.map((material) => (
//                       <button
//                         key={material.type}
//                         type="button"
//                         className={`flex flex-col items-center p-3 border rounded-md transition-colors ${
//                           selectedType === material.type
//                             ? 'bg-indigo-100 border-indigo-500'
//                             : 'bg-white border-gray-200'
//                         } hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed`}
//                         onClick={() => handleTypeSelect(material.type)}
//                         disabled={uploading}
//                       >
//                         <span className="text-2xl mb-2">{material.icon}</span>
//                         <span className="text-xs text-center">{material.type}</span>
//                       </button>
//                     ))}
//                   </div>
//                   {error && <p className="text-red-600 text-sm" role="alert">{error}</p>}
//                 </>
//               )}

//               {(view === 'fileConfig' || view === 'textConfig') && (
//                 <>
//                   <p className="text-sm text-gray-600">
//                     Type: {selectedType}
//                     <button
//                       type="button"
//                       className="ml-2 text-indigo-600 hover:underline focus:outline-none disabled:cursor-not-allowed"
//                       onClick={handleBack}
//                       disabled={uploading}
//                     >
//                       Change
//                     </button>
//                   </p>
//                   <div className="space-y-4">
//                     <div>
//                       <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                         Name <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         id="name"
//                         type="text"
//                         name="name"
//                         value={materialData.name}
//                         onChange={handleMaterialDataChange}
//                         placeholder={`Enter ${selectedType} name`}
//                         className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
//                         maxLength={100}
//                         disabled={uploading}
//                         required
//                         aria-required="true"
//                       />
//                       <p className="text-xs text-gray-500 text-right mt-1">
//                         {materialData.name.length} / 100
//                       </p>
//                     </div>
//                     <div>
//                       <label htmlFor="description" className="block text-sm font-medium text-gray-700">
//                         Description (Optional)
//                       </label>
//                       <textarea
//                         id="description"
//                         name="description"
//                         value={materialData.description}
//                         onChange={handleMaterialDataChange}
//                         placeholder="Enter a description"
//                         className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 min-h-[100px]"
//                         disabled={uploading}
//                       />
//                     </div>
//                     {view === 'fileConfig' && selectedType !== 'Form' && (
//                       <div>
//                         <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
//                           Upload file <span className="text-red-500">*</span>
//                         </label>
//                         <div className="mt-1 p-4 border-2 border-dashed border-gray-300 rounded-md text-center relative">
//                           {file ? (
//                             <p className="text-sm text-gray-600">Selected: {file.name}</p>
//                           ) : (
//                             <>
//                               <span className="text-2xl text-gray-400">☁️</span>
//                               <p className="text-sm text-gray-600 mt-2">
//                                 Upload {selectedType.toLowerCase()} file
//                               </p>
//                               <p className="text-xs text-gray-500 mt-1">Max size: 100MB</p>
//                             </>
//                           )}
//                           <input
//                             id="file-upload"
//                             type="file"
//                             accept={
//                               selectedType === 'Quiz'
//                                 ? 'application/pdf,image/jpeg,image/png'
//                                 : selectedType === 'Video'
//                                 ? 'video/mp4,video/mpeg,video/webm'
//                                 : selectedType === 'PDF'
//                                 ? 'application/pdf'
//                                 : selectedType === 'Image'
//                                 ? 'image/*'
//                                 : selectedType === 'Sheet'
//                                 ? '.xls,.xlsx'
//                                 : selectedType === 'Slide'
//                                 ? '.ppt,.pptx'
//                                 : selectedType === 'Assignment'
//                                 ? 'application/pdf'
//                                 : selectedType === 'Zip'
//                                 ? 'application/zip'
//                                 : '*/*'
//                             }
//                             onChange={handleFileChange}
//                             className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
//                             disabled={uploading}
//                             aria-required="true"
//                           />
//                         </div>
//                       </div>
//                     )}
//                     {selectedType === 'Form' && view === 'textConfig' && (
//                       <div>
//                         <label htmlFor="templateId" className="block text-sm font-medium text-gray-700">
//                           Select Form Template <span className="text-red-500">*</span>
//                         </label>
//                         {formTemplatesLoading ? (
//                           <div className="flex items-center justify-center h-10">
//                             <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-500"></div>
//                           </div>
//                         ) : (
//                           <select
//                             id="templateId"
//                             name="templateId"
//                             value={materialData.templateId}
//                             onChange={handleMaterialDataChange}
//                             className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
//                             disabled={uploading || formTemplates.length === 0}
//                             required
//                             aria-required="true"
//                           >
//                             <option value="">Select a template</option>
//                             {formTemplates.map((template) => (
//                               <option key={template.id} value={template.id}>
//                                 {template.name || `Template ${template.id}`}
//                               </option>
//                             ))}
//                           </select>
//                         )}
//                         {formTemplates.length === 0 && !formTemplatesLoading && (
//                           <p className="text-sm text-gray-500 mt-1">No form templates available.</p>
//                         )}
//                       </div>
//                     )}
//                     {(selectedType === 'YouTube' || selectedType === 'Feedback') && view === 'textConfig' && (
//                       <div>
//                         <label htmlFor="url" className="block text-sm font-medium text-gray-700">
//                           {selectedType === 'YouTube' ? 'YouTube URL' : 'Feedback Text'}{' '}
//                           <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           id="url"
//                           type="text"
//                           name="url"
//                           value={materialData.url}
//                           onChange={handleMaterialDataChange}
//                           placeholder={selectedType === 'YouTube' ? 'Enter YouTube URL' : 'Enter feedback text'}
//                           className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
//                           disabled={uploading}
//                           required
//                           aria-required="true"
//                         />
//                       </div>
//                     )}
//                     <div>
//                       <label htmlFor="state" className="block text-sm font-medium text-gray-700">
//                         State <span className="text-red-500">*</span>
//                       </label>
//                       <select
//                         id="state"
//                         name="state"
//                         value={materialData.state}
//                         onChange={handleMaterialDataChange}
//                         className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
//                         disabled={uploading}
//                         required
//                         aria-required="true"
//                       >
//                         <option value="draft">Draft</option>
//                         <option value="scheduled">Scheduled</option>
//                       </select>
//                     </div>
//                     {materialData.state === 'scheduled' && (
//                       <div>
//                         <label htmlFor="scheduledAt" className="block text-sm font-medium text-gray-700">
//                           Schedule Date/Time <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           id="scheduledAt"
//                           type="datetime-local"
//                           name="scheduledAt"
//                           value={materialData.scheduledAt}
//                           onChange={handleMaterialDataChange}
//                           className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
//                           disabled={uploading}
//                           required
//                           aria-required="true"
//                         />
//                       </div>
//                     )}
//                     <div className="flex gap-4">
//                       <label className="flex items-center text-sm text-gray-700">
//                         <input
//                           type="checkbox"
//                           name="isPrerequisite"
//                           checked={materialData.isPrerequisite}
//                           onChange={handleMaterialDataChange}
//                           className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
//                           disabled={uploading}
//                         />
//                         Prerequisite
//                       </label>
//                       <label className="flex items-center text-sm text-gray-700">
//                         <input
//                           type="checkbox"
//                           name="allowDownload"
//                           checked={materialData.allowDownload}
//                           onChange={handleMaterialDataChange}
//                           className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
//                           disabled={uploading}
//                         />
//                         Allow Download
//                       </label>
//                     </div>
//                     <div>
//                       <label htmlFor="accessOn" className="block text-sm font-medium text-gray-700">
//                         Access On <span className="text-red-500">*</span>
//                       </label>
//                       <select
//                         id="accessOn"
//                         name="accessOn"
//                         value={materialData.accessOn}
//                         onChange={handleMaterialDataChange}
//                         className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
//                         disabled={uploading}
//                         required
//                         aria-required="true"
//                       >
//                         <option value="Both">Both</option>
//                         <option value="Web">Web</option>
//                         <option value="Mobile">Mobile</option>
//                       </select>
//                     </div>
//                     <div>
//                       <label htmlFor="maxViews" className="block text-sm font-medium text-gray-700">
//                         Max Views
//                       </label>
//                       <input
//                         id="maxViews"
//                         type="text"
//                         name="maxViews"
//                         value={materialData.maxViews}
//                         onChange={handleMaterialDataChange}
//                         placeholder="Enter max views or Unlimited"
//                         className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
//                         disabled={uploading}
//                       />
//                     </div>
//                     {error && <p className="text-red-600 text-sm" role="alert">{error}</p>}
//                     {uploading && (
//                       <div className="relative w-full h-5 bg-gray-200 rounded-md">
//                         <div
//                           className="absolute h-full bg-indigo-600 rounded-md transition-all"
//                           style={{ width: `${uploadProgress}%` }}
//                         />
//                         <span className="absolute inset-0 text-xs text-white text-center leading-5">
//                           {Math.round(uploadProgress)}%
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </>
//               )}
//             </div>

//             <div className="flex justify-end gap-2 mt-6">
//               {view === 'typeSelection' ? (
//                 <>
//                   <button
//                     type="button"
//                     onClick={handleClose}
//                     className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     disabled={uploading}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="button"
//                     onClick={handleContinue}
//                     className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     disabled={uploading}
//                   >
//                     Continue
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <button
//                     type="button"
//                     onClick={handleBack}
//                     className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     disabled={uploading}
//                   >
//                     Back
//                   </button>
//                   <button
//                     type="button"
//                     onClick={handleAddMaterial}
//                     className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     disabled={uploading}
//                   >
//                     {uploading ? 'Saving...' : 'Save'}
//                   </button>
//                 </>
//               )}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default memo(AddMaterialModal);



import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
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
  const [formTemplates, setFormTemplates] = useState([]);
  const [formTemplatesLoading, setFormTemplatesLoading] = useState(false);
  const { user, rolePermissions } = useAuth();
  const canView = rolePermissions?.curriculums?.display || false;
  const [materialData, setMaterialData] = useState({
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
  const modalRef = useRef(null);
  const hasUnsavedChangesRef = useRef(false);

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

  // Reset form state
  const resetForm = useCallback(() => {
    setView('typeSelection');
    setSelectedType(null);
    setFile(null);
    setUploadProgress(0);
    setError(null);
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
    hasUnsavedChangesRef.current = false;
  }, []);

  // Fetch user role
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, 'Users', user.uid);
          const userDoc = await getDoc(userDocRef);
          setUserRole(userDoc.exists() ? userDoc.data().role || 'student' : 'student');
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
      setFormTemplatesLoading(true);
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
        } finally {
          setFormTemplatesLoading(false);
        }
      };
      fetchFormTemplates();
    } else {
      setFormTemplates([]);
      setFormTemplatesLoading(false);
    }
  }, [selectedType]);

  // Handle modal open/close and keyboard events
  useEffect(() => {
    if (isOpen) {
      resetForm(); // Reset form when modal opens
      const handleKeyDown = (e) => {
        if (e.key === 'Escape' && !uploading) {
          handleClose();
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, uploading, resetForm]);

  // Handle click outside to close modal
  const handleClickOutside = useCallback(
    (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target) && !uploading) {
        handleClose();
      }
    },
    [uploading]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, handleClickOutside]);

  // Log activity to Firestore
  const logActivity = async (action, details) => {
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

  // Permission check
  const hasPermission = useCallback(() => canView, [canView]);

  const handleTypeSelect = useCallback(
    (type) => {
      if (!hasPermission()) {
        setError('You don’t have permission to add materials.');
        return;
      }
      setSelectedType(type);
      setError(null);
      hasUnsavedChangesRef.current = true;
    },
    [hasPermission]
  );

  const handleContinue = useCallback(() => {
    if (!hasPermission()) {
      setError('You don’t have permission to add materials.');
      return;
    }
    if (!selectedType) {
      setError('Please select a material type.');
      return;
    }
    setView(selectedType === 'YouTube' || selectedType === 'Feedback' || selectedType === 'Form' ? 'textConfig' : 'fileConfig');
  }, [hasPermission, selectedType]);

  const handleBack = useCallback(() => {
    if (uploading) return;
    setView('typeSelection');
    setSelectedType(null);
    setFile(null);
    setError(null);
    setUploadProgress(0);
    hasUnsavedChangesRef.current = true;
  }, [uploading]);

  const handleClose = useCallback(() => {
    if (uploading) return;
    if (hasUnsavedChangesRef.current && !window.confirm('You have unsaved changes. Are you sure you want to close?')) {
      return;
    }
    resetForm();
    onClose();
  }, [uploading, onClose, resetForm]);

  const handleFileChange = useCallback(
    (e) => {
      if (!hasPermission()) {
        setError('You don’t have permission to upload files.');
        return;
      }
      const selectedFile = e.target.files[0];
      if (!selectedFile) return;

      const maxSizeInMB = selectedType === 'Video' ? 500 : 100;
      if (selectedFile.size > maxSizeInMB * 1024 * 1024) {
        setFile(null);
        setError(`File size exceeds ${maxSizeInMB}MB limit for ${selectedType.toLowerCase()} files.`);
        return;
      }

      const mimeChecks = {
        Quiz: ['application/pdf', 'image/jpeg', 'image/png'],
        Video: ['video/mp4', 'video/mpeg', 'video/webm'],
        PDF: ['application/pdf'],
        Image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        Sheet: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        Slide: ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
        Assignment: ['application/pdf'],
        Form: ['application/pdf'],
        Zip: ['application/zip', 'application/x-zip-compressed'],
      };

      if (mimeChecks[selectedType] && !mimeChecks[selectedType].includes(selectedFile.type)) {
        setFile(null);
        setError(`Please select a valid ${selectedType.toLowerCase()} file.`);
        return;
      }

      setFile(selectedFile);
      setError(null);
      hasUnsavedChangesRef.current = true;
    },
    [hasPermission, selectedType]
  );

  const handleMaterialDataChange = useCallback(
    (e) => {
      if (!hasPermission()) {
        setError('You don’t have permission to modify material data.');
        return;
      }
      const { name, value, type, checked } = e.target;
      setMaterialData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
      hasUnsavedChangesRef.current = true;
    },
    [hasPermission]
  );

  const handleFileUpload = useCallback(async () => {
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

      await s3Client.send(new PutObjectCommand(params));
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
  }, [file, curriculumId, sectionId, sessionId, selectedType]);

  const handleAddMaterial = useCallback(async () => {
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
    if (selectedType !== 'YouTube' && selectedType !== 'Feedback' && selectedType !== 'Form' && !file) {
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
        if (!fileUrl) throw new Error('File upload failed.');
      } else if (selectedType === 'YouTube' || selectedType === 'Feedback') {
        fileUrl = materialData.url;
      }

      const collectionPath = sessionId
        ? `curriculums/${curriculumId}/sections/${sectionId}/sessions/${sessionId}/materials`
        : `curriculums/${curriculumId}/sections/${sectionId}/materials`;

      await addDoc(collection(db, collectionPath), {
        type: selectedType,
        name: materialData.name,
        description: materialData.description || null,
        url: fileUrl || null,
        templateId: selectedType === 'Form' ? materialData.templateId : null,
        maxViews: materialData.maxViews === 'Unlimited' ? null : parseInt(materialData.maxViews, 10),
        isPrerequisite: materialData.isPrerequisite,
        allowDownload: materialData.allowDownload,
        accessOn: materialData.accessOn,
        state: materialData.state,
        scheduledAt: materialData.state === 'scheduled' ? new Date(materialData.scheduledAt).toISOString() : null,
        createdAt: serverTimestamp(),
      });

      await logActivity('Material Added', `Added ${selectedType} material: ${materialData.name}`);
      resetForm();
      onClose();
    } catch (err) {
      console.error('Error saving material:', err);
      setError('Failed to save material: ' + err.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [
    hasPermission,
    materialData,
    selectedType,
    file,
    curriculumId,
    sectionId,
    sessionId,
    handleFileUpload,
    resetForm,
    onClose,
  ]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50"
      role="dialog"
      aria-labelledby="add-material-modal-title"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className="bg-white w-full max-w-md h-full p-6 shadow-lg animate-slide-in-right overflow-y-auto"
      >
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h3 id="add-material-modal-title" className="text-lg font-semibold text-gray-900">
                Add Material
              </h3>
              <button
                onClick={handleClose}
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
                      <button
                        key={material.type}
                        type="button"
                        className={`flex flex-col items-center p-3 border rounded-md transition-colors ${
                          selectedType === material.type
                            ? 'bg-indigo-100 border-indigo-500'
                            : 'bg-white border-gray-200'
                        } hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed`}
                        onClick={() => handleTypeSelect(material.type)}
                        disabled={uploading}
                      >
                        <span className="text-2xl mb-2">{material.icon}</span>
                        <span className="text-xs text-center">{material.type}</span>
                      </button>
                    ))}
                  </div>
                  {error && <p className="text-red-600 text-sm" role="alert">{error}</p>}
                </>
              )}

              {(view === 'fileConfig' || view === 'textConfig') && (
                <>
                  <p className="text-sm text-gray-600">
                    Type: {selectedType}
                    <button
                      type="button"
                      className="ml-2 text-indigo-600 hover:underline focus:outline-none disabled:cursor-not-allowed"
                      onClick={handleBack}
                      disabled={uploading}
                    >
                      Change
                    </button>
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        name="name"
                        value={materialData.name}
                        onChange={handleMaterialDataChange}
                        placeholder={`Enter ${selectedType} name`}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                        maxLength={100}
                        disabled={uploading}
                        required
                        aria-required="true"
                      />
                      <p className="text-xs text-gray-500 text-right mt-1">
                        {materialData.name.length} / 100
                      </p>
                    </div>
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description (Optional)
                      </label>
                      <textarea
                        id="description"
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
                        <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
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
                              <p className="text-xs text-gray-500 mt-1">Max size: {selectedType === 'Video' ? '500MB' : '100MB'}</p>
                            </>
                          )}
                          <input
                            id="file-upload"
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
                            aria-required="true"
                          />
                        </div>
                      </div>
                    )}
                    {selectedType === 'Form' && view === 'textConfig' && (
                      <div>
                        <label htmlFor="templateId" className="block text-sm font-medium text-gray-700">
                          Select Form Template <span className="text-red-500">*</span>
                        </label>
                        {formTemplatesLoading ? (
                          <div className="flex items-center justify-center h-10">
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-500"></div>
                          </div>
                        ) : (
                          <select
                            id="templateId"
                            name="templateId"
                            value={materialData.templateId}
                            onChange={handleMaterialDataChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                            disabled={uploading || formTemplates.length === 0}
                            required
                            aria-required="true"
                          >
                            <option value="">Select a template</option>
                            {formTemplates.map((template) => (
                              <option key={template.id} value={template.id}>
                                {template.name || `Template ${template.id}`}
                              </option>
                            ))}
                          </select>
                        )}
                        {formTemplates.length === 0 && !formTemplatesLoading && (
                          <p className="text-sm text-gray-500 mt-1">No form templates available.</p>
                        )}
                      </div>
                    )}
                    {(selectedType === 'YouTube' || selectedType === 'Feedback') && view === 'textConfig' && (
                      <div>
                        <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                          {selectedType === 'YouTube' ? 'YouTube URL' : 'Feedback Text'}{' '}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="url"
                          type="text"
                          name="url"
                          value={materialData.url}
                          onChange={handleMaterialDataChange}
                          placeholder={selectedType === 'YouTube' ? 'Enter YouTube URL' : 'Enter feedback text'}
                          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                          disabled={uploading}
                          required
                          aria-required="true"
                        />
                      </div>
                    )}
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                        State <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="state"
                        name="state"
                        value={materialData.state}
                        onChange={handleMaterialDataChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                        disabled={uploading}
                        required
                        aria-required="true"
                      >
                        <option value="draft">Draft</option>
                        <option value="scheduled">Scheduled</option>
                      </select>
                    </div>
                    {materialData.state === 'scheduled' && (
                      <div>
                        <label htmlFor="scheduledAt" className="block text-sm font-medium text-gray-700">
                          Schedule Date/Time <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="scheduledAt"
                          type="datetime-local"
                          name="scheduledAt"
                          value={materialData.scheduledAt}
                          onChange={handleMaterialDataChange}
                          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                          disabled={uploading}
                          required
                          aria-required="true"
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
                      <label htmlFor="accessOn" className="block text-sm font-medium text-gray-700">
                        Access On <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="accessOn"
                        name="accessOn"
                        value={materialData.accessOn}
                        onChange={handleMaterialDataChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                        disabled={uploading}
                        required
                        aria-required="true"
                      >
                        <option value="Both">Both</option>
                        <option value="Web">Web</option>
                        <option value="Mobile">Mobile</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="maxViews" className="block text-sm font-medium text-gray-700">
                        Max Views
                      </label>
                      <input
                        id="maxViews"
                        type="text"
                        name="maxViews"
                        value={materialData.maxViews}
                        onChange={handleMaterialDataChange}
                        placeholder="Enter max views or Unlimited"
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                        disabled={uploading}
                      />
                    </div>
                    {error && <p className="text-red-600 text-sm" role="alert">{error}</p>}
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
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={uploading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleContinue}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={uploading}
                  >
                    Continue
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={uploading}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleAddMaterial}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={uploading}
                  >
                    {uploading ? 'Saving...' : 'Save'}
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default memo(AddMaterialModal);