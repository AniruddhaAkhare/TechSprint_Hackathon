// import React, { useState, useEffect, useRef } from "react";
// import { db } from "../../../config/firebase";
// import { getDocs, collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
// import { allEnquiryFields } from "./enquiryFields.jsx";
// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// const CreateEnquiryForm = ({ isOpen, toggleSidebar, form, logActivity }) => {
//   const [formName, setFormName] = useState("");
//   const [users, setUsers] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [selectedRoles, setSelectedRoles] = useState([]);
//   const [availableUsers, setAvailableUsers] = useState([]);
//   const [availableRoles, setAvailableRoles] = useState([]);
//   const [selectedFields, setSelectedFields] = useState([]);
//   const [assignmentType, setAssignmentType] = useState("Users");
//   const [tags, setTags] = useState([]);
//   const [tagInput, setTagInput] = useState("");
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [isDragging, setIsDragging] = useState(false);
//   const [formLink, setFormLink] = useState(null);
//   const [expandedCategories, setExpandedCategories] = useState({
//     "Personal Details": true,
//     "Additional Details": true,
//     "Enquiry Details": true,
//   });
//   const droppableId = `selectedFields-${form?.id || "new"}`;
//   const droppableRef = useRef(null);
//   const [dynamicOptions, setDynamicOptions] = useState({
//     course: [],
//     branch: [],
//     assignTo: [],
//   });

//   useEffect(() => {
//     if (form) {
//       setFormName(form.name || "");
//       setSelectedUsers(Array.isArray(form.users) ? form.users : []);
//       setSelectedRoles(Array.isArray(form.roles) ? form.roles : []);
//       setAssignmentType(form.users?.length > 0 ? "Users" : "Roles");
//       setSelectedFields(
//         Array.isArray(form.fields)
//           ? form.fields.map((field) => ({
//               id: field.id || "",
//               defaultValue: field.defaultValue ?? "",
//             }))
//           : []
//       );
//       setTags(Array.isArray(form.tags) ? form.tags : []);
//       setFormLink(form.formLink || `https://form.shikshasaarathi.com/${form.id}`);
//     } else {
//       setFormName("");
//       setSelectedUsers([]);
//       setSelectedRoles([]);
//       setAssignmentType("Users");
//       setSelectedFields([]);
//       setTags([]);
//       setFormLink(null);
//     }
//   }, [form]);

//   useEffect(() => {
//     const fetchDynamicOptions = async () => {
//       try {
//         const [courseSnapshot, centerSnapshot, roleSnapshot, userSnapshot] = await Promise.all([
//           getDocs(collection(db, "Course")),
//           getDocs(collection(db, "instituteSetup", "Center")),
//           getDocs(query(collection(db, "roles"), where("name", "==", "Sales"))),
//           getDocs(collection(db, "Users")),
//         ]);
  
//         setDynamicOptions({
//           course: courseSnapshot.docs.map((doc) => ({
//             value: doc.data().name,
//             label: doc.data().name,
//           })),
//           branch: centerSnapshot.docs.map((doc) => ({
//             value: doc.data().name,
//             label: doc.data().name,
//           })),
//           assignTo: userSnapshot.docs
//             .filter((doc) => doc.data().roleId === roleSnapshot.docs[0]?.id)
//             .map((doc) => ({
//               value: doc.data().displayName || doc.data().email,
//               label: doc.data().displayName || doc.data().email,
//             })),
//         });
//       } catch (err) {
//         console.error("Error fetching dynamic options:", err);
//         setError(`Error fetching options: ${err.message}`);
//       }
//     };
//     fetchDynamicOptions();
//   }, []);
  
//   // Update handleDefaultValueChange to handle object values
//   const handleDefaultValueChange = (fieldId, value) => {
//     if (isDragging) return;
//     setSelectedFields(
//       selectedFields.map((field) =>
//         field.id === fieldId ? { ...field, defaultValue: value } : field
//       )
//     );
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setError(null);
//         setLoading(true);
//         const userSnapshot = await getDocs(collection(db, "Users"));
//         setUsers(userSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
//         setAvailableUsers(
//           form
//             ? userSnapshot.docs
//                 .filter((doc) => !form.users?.includes(doc.id))
//                 .map((doc) => ({ id: doc.id, ...doc.data() }))
//             : userSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
//         );
//         const roleSnapshot = await getDocs(collection(db, "roles"));
//         setRoles(roleSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
//         setAvailableRoles(
//           form
//             ? roleSnapshot.docs
//                 .filter((doc) => !form.roles?.includes(doc.id))
//                 .map((doc) => ({ id: doc.id, ...doc.data() }))
//             : roleSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
//         );
//       } catch (err) {
//         setError(`Failed to fetch data: ${err.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [form]);

//   useEffect(() => {
//     return () => {
//       console.log(`Droppable unmounted with ID: ${droppableId}`);
//     };
//   }, [droppableId]);

//   const sanitizeData = (data) => {
//     const sanitized = {};
//     for (const [key, value] of Object.entries(data)) {
//       if (value === undefined) sanitized[key] = null;
//       else if (Array.isArray(value))
//         sanitized[key] = value.map((item) =>
//           typeof item === "object" && item !== null ? sanitizeData(item) : item
//         );
//       else if (typeof value === "object" && value !== null && !(value instanceof Date))
//         sanitized[key] = sanitizeData(value);
//       else sanitized[key] = value;
//     }
//     return sanitized;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formName.trim()) {
//       setError("Form name is required.");
//       return;
//     }
//     if (selectedFields.length === 0) {
//       setError("At least one enquiry field must be selected.");
//       return;
//     }
//     if (assignmentType === "Users" && selectedUsers.length === 0) {
//       setError("At least one user must be selected.");
//       return;
//     }
//     if (assignmentType === "Roles" && selectedRoles.length === 0) {
//       setError("At least one role must be selected.");
//       return;
//     }
  
//     let formId;
//     const formData = {
//       name: formName,
//       users: assignmentType === "Users" ? selectedUsers : [],
//       roles: assignmentType === "Roles" ? selectedRoles : [],
//       fields: selectedFields.map((field) => {
//         const fieldConfig = allEnquiryFields
//           .flatMap((category) => category.fields)
//           .find((f) => f.id === field.id);
//         return {
//           id: field.id,
//           defaultValue: field.defaultValue,
//           options: fieldConfig?.type === "select" ? fieldConfig.options : undefined,
//         };
//       }),
//       tags,
//       enquiryCount: form?.enquiryCount || 0,
//       updatedAt: serverTimestamp(),
//       ...(form ? {} : { createdAt: serverTimestamp() }),
//     };
  
//     try {
//       setLoading(true);
//       setError(null);
//       const sanitizedFormData = sanitizeData(formData);
  
//       if (form) {
//         const formRef = doc(db, "enquiryForms", form.id);
//         await updateDoc(formRef, sanitizedFormData);
//         await logActivity("Updated enquiry form", { name: formName });
//         formId = form.id;
//       } else {
//         const docRef = await addDoc(collection(db, "enquiryForms"), sanitizedFormData);
//         formId = docRef.id;
//         const newFormLink = `https://form.shikshasaarathi.com/${formId}`;
//         const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(newFormLink)}`;
//         await updateDoc(doc(db, "enquiryForms", formId), {
//           formLink: newFormLink,
//           qrCodeUrl,
//         });
//         setFormLink(newFormLink);
//         await logActivity("Created enquiry form", { name: formName });
//       }
  
//       resetForm();
//       toggleSidebar();
//     } catch (error) {
//       setError(`Failed to save enquiry form: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };


 
//   const resetForm = () => {
//     setFormName("");
//     setSelectedUsers([]);
//     setSelectedRoles([]);
//     setSelectedFields([]);
//     setAvailableUsers(users);
//     setAvailableRoles(roles);
//     setAssignmentType("Users");
//     setTags([]);
//     setError(null);
//     setFormLink(null);
//   };

//   const handleAddTag = (e) => {
//     e.preventDefault();
//     const newTag = tagInput.trim();
//     if (newTag && !tags.includes(newTag)) {
//       setTags([...tags, newTag]);
//       setTagInput("");
//     }
//   };

//   const handleRemoveTag = (tagToRemove) => {
//     setTags(tags.filter((tag) => tag !== tagToRemove));
//   };

//   const handleAddUser = (userId) => {
//     if (userId && !selectedUsers.includes(userId)) {
//       setSelectedUsers([...selectedUsers, userId]);
//       setAvailableUsers(availableUsers.filter((u) => u.id !== userId));
//     }
//   };

//   const handleRemoveUser = (userId) => {
//     setSelectedUsers(selectedUsers.filter((id) => id !== userId));
//     const removedUser = users.find((u) => u.id === userId);
//     if (removedUser) setAvailableUsers([...availableUsers, removedUser]);
//   };

//   const handleAddRole = (roleId) => {
//     if (roleId && !selectedRoles.includes(roleId)) {
//       setSelectedRoles([...selectedRoles, roleId]);
//       setAvailableRoles(availableRoles.filter((r) => r.id !== roleId));
//     }
//   };

//   const handleRemoveRole = (roleId) => {
//     setSelectedRoles(selectedRoles.filter((id) => id !== roleId));
//     const removedRole = roles.find((r) => r.id === roleId);
//     if (removedRole) setAvailableRoles([...availableRoles, removedRole]);
//   };

//   const handleFieldToggle = (fieldId) => {
//     if (isDragging || !fieldId) return;
//     if (selectedFields.some((field) => field.id === fieldId)) {
//       setSelectedFields(selectedFields.filter((field) => field.id !== fieldId));
//     } else {
//       setSelectedFields([...selectedFields, { id: fieldId, defaultValue: "" }]);
//     }
//   };

//   const handleCategoryToggle = (category) => {
//     const categoryFields = allEnquiryFields
//       .find((cat) => cat.category === category)
//       .fields.map((field) => field.id);
//     const allSelected = categoryFields.every((fieldId) =>
//       selectedFields.some((field) => field.id === fieldId)
//     );

//     if (allSelected) {
//       // Deselect all fields in the category
//       setSelectedFields(
//         selectedFields.filter((field) => !categoryFields.includes(field.id))
//       );
//     } else {
//       // Select all fields in the category, adding only those not already selected
//       const newFields = categoryFields
//         .filter((fieldId) => !selectedFields.some((field) => field.id === fieldId))
//         .map((fieldId) => ({ id: fieldId, defaultValue: "" }));
//       setSelectedFields([...selectedFields, ...newFields]);
//     }

//     // Toggle category expansion
//     setExpandedCategories((prev) => ({
//       ...prev,
//       [category]: !prev[category],
//     }));
//   };

//   // const handleDefaultValueChange = (fieldId, value) => {
//   //   if (isDragging) return;
//   //   setSelectedFields(
//   //     selectedFields.map((field) =>
//   //       field.id === fieldId ? { ...field, defaultValue: value } : field
//   //     )
//   //   );
//   // };

//   const handleDragStart = () => setIsDragging(true);
//   const handleDragEnd = (result) => {
//     setIsDragging(false);
//     if (!result.destination) return;
//     const items = Array.from(selectedFields);
//     const [reorderedItem] = items.splice(result.source.index, 1);
//     items.splice(result.destination.index, 0, reorderedItem);
//     setSelectedFields(items);
//   };

//   return (
//     <div
//       className={`fixed top-0 right-0 h-full bg-white w-full shadow-lg transform transition-transform duration-300 ${
//         isOpen ? "translate-x-0" : "translate-x-full"
//       } p-6 overflow-y-auto`}
//     >
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">
//           {form ? "Update Enquiry Form" : "Create Enquiry Form"}
//         </h1>
//         <button
//           onClick={toggleSidebar}
//           className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
//         >
//           Back
//         </button>
//       </div>

//       {error && (
//         <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
//           {error}
//         </div>
//       )}
//       {loading && (
//         <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md text-blue-700">
//           Loading...
//         </div>
//       )}
//       {formLink && (
//         <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-700">
//           <p className="font-medium">Form Submission Link</p>
//           <a
//             href={formLink}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-blue-600 hover:underline break-all block mt-2"
//           >
//             {formLink}
//           </a>
//           <div className="mt-2 space-x-2">
//             <a
//               href={formLink}
//               download={`${formName}-form-link.txt`}
//               className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
//             >
//               Download Link
//             </a>
//             <button
//               onClick={() => navigator.clipboard.writeText(formLink)}
//               className="inline-block bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
//             >
//               Copy Link
//             </button>
//           </div>
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
//           <div>
//             <label
//               htmlFor="formName"
//               className="block text-base font-medium text-gray-700"
//             >
//               Form Name
//             </label>
//             <input
//               type="text"
//               id="formName"
//               value={formName}
//               placeholder="Enter form name"
//               onChange={(e) => setFormName(e.target.value)}
//               required
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-separate focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
//               disabled={loading}
//             />
//           </div>

//           <div>
//   <label htmlFor="tags" className="block text-base font-medium text-gray-700">
//     Tags
//   </label>
//   <div className="flex mt-1">
//     <input
//       type="text"
//       value={tagInput}
//       onChange={(e) => setTagInput(e.target.value)}
//       placeholder="Enter tag and press Enter"
//       className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
//       disabled={loading}
//     />
//     <button
//       type="button"
//       onClick={handleAddTag}
//       className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
//       disabled={loading}
//     >
//       Add
//     </button>
//   </div>
// </div>

//           {/* <div>
//             <label
//               htmlFor="tags"
//               className="block text-base font-medium text-gray-700"
//             >
//               Tags
//             </label>
//             <div className="flex mt-1">
//               <input
//                 type="text"
//                 value={tagInput}
//                 onChange={(e) => setTagInput(e.target.value)}
//                 placeholder="Enter tag and press Enter"
//                 className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
//                 disabled={loading}
//               />
//               <button
//                 type="button"
//                 onClick={handleAddTag}
//                 className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
//                 disabled={loading}
//               >
//                 Add
//               </button>
//             </div>
//             {tags.length > 0 && (
//               <div className="mt-2 flex flex-wrap gap-2">
//                 {tags.map((tag) => (
//                   <span
//                     key={tag}
//                     className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded"
//                   >
//                     {tag}
//                     <button
//                       type="button"
//                       onClick={() => handleRemoveTag(tag)}
//                       className="ml-1 text-red-600 hover:text-red-800"
//                     >
//                       ✕
//                     </button>
//                   </span>
//                 ))}
//               </div>
//             )}
//           </div> */}

//           <div>
//             <label
//               htmlFor="assignmentType"
//               className="block text-base font-medium text-gray-700"
//             >
//               Assign To
//             </label>
//             <select
//               id="assignmentType"
//               value={assignmentType}
//               onChange={(e) => {
//                 setAssignmentType(e.target.value);
//                 setSelectedUsers([]);
//                 setSelectedRoles([]);
//                 setAvailableUsers(users);
//                 setAvailableRoles(roles);
//               }}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
//               disabled={loading}
//             >
//               <option value="Users">Users</option>
//               <option value="Roles">Roles</option>
//             </select>
//           </div>

//           {assignmentType === "Users" && (
//             <div>
//               <label className="block text-base font-medium text-gray-700">
//                 Select Users
//               </label>
//               <select
//                 onChange={(e) => handleAddUser(e.target.value)}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
//                 disabled={loading}
//               >
//                 <option value="">Select a User</option>
//                 {availableUsers.map((user) => (
//                   <option key={user.id} value={user.id}>
//                     {user.name || user.email}
//                   </option>
//                 ))}
//               </select>
//               {selectedUsers.length > 0 && (
//                 <div className="mt-4">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Sr No
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           User Name
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Action
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {selectedUsers.map((userId, index) => {
//                         const user = users.find((u) => u.id === userId);
//                         return (
//                           <tr key={userId}>
//                             <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">
//                               {index + 1}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">
//                               {user?.name || user?.email}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <button
//                                 type="button"
//                                 onClick={() => handleRemoveUser(userId)}
//                                 className="text-red-600 hover:text-red-800"
//                                 disabled={loading}
//                               >
//                                 ✕
//                               </button>
//                             </td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           )}

//           {assignmentType === "Roles" && (
//             <div>
//               <label className="block text-base font-medium text-gray-700">
//                 Select Roles
//               </label>
//               <select
//                 onChange={(e) => handleAddRole(e.target.value)}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
//                 disabled={loading}
//               >
//                 <option value="">Select a Role</option>
//                 {availableRoles.map((role) => (
//                   <option key={role.id} value={role.id}>
//                     {role.name}
//                   </option>
//                 ))}
//               </select>
//               {selectedRoles.length > 0 && (
//                 <div className="mt-4">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Sr No
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Role Name
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Action
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {selectedRoles.map((roleId, index) => {
//                         const role = roles.find((r) => r.id === roleId);
//                         return (
//                           <tr key={roleId}>
//                             <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">
//                               {index + 1}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">
//                               {role?.name}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <button
//                                 type="button"
//                                 onClick={() => handleRemoveRole(roleId)}
//                                 className="text-red-600 hover:text-red-800"
//                                 disabled={loading}
//                               >
//                                 ✕
//                               </button>
//                             </td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           )}

//           <div>
//             <label className="block text-base font-medium text-gray-700">
//               Select Enquiry Fields
//             </label>
//             <div className="mt-2 space-y-2 max-h-60 overflow-y-auto border p-4 rounded-md">
//               {allEnquiryFields.length > 0 ? (
//                 allEnquiryFields.map((category) => {
//                   const categoryFields = category.fields.map((field) => field.id);
//                   const allSelected = categoryFields.every((fieldId) =>
//                     selectedFields.some((field) => field.id === fieldId)
//                   );
//                   return (
//                     <div key={category.category} className="mb-4">
//                       <button
//                         type="button"
//                         onClick={() => handleCategoryToggle(category.category)}
//                         className="w-full text-left flex justify-between items-center p-2 bg-gray-100 rounded-md hover:bg-gray-200"
//                       >
//                         <span className="text-base font-medium text-gray-700">
//                           {category.category}
//                           {allSelected && (
//                             <span className="ml-2 text-green-600">✓ All Selected</span>
//                           )}
//                         </span>
//                         <span>{expandedCategories[category.category] ? "▼" : "▶"}</span>
//                       </button>
//                       {expandedCategories[category.category] && (
//                         <div className="mt-2 space-y-2 pl-4">
//                           {category.fields.map((field) => (
//                             <div key={field.id} className="flex items-center">
//                               <input
//                                 type="checkbox"
//                                 id={field.id}
//                                 checked={selectedFields.some((f) => f.id === field.id)}
//                                 onChange={() => handleFieldToggle(field.id)}
//                                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                                 disabled={loading || isDragging}
//                               />
//                               <label
//                                 htmlFor={field.id}
//                                 className="ml-2 text-base text-gray-700"
//                               >
//                                 {field.label} ({field.type})
//                                 {field.required && (
//                                   <span className="text-red-500">*</span>
//                                 )}
//                               </label>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })
//               ) : (
//                 <p>No enquiry fields available</p>
//               )}
//             </div>


//             <div className="mt-4">
//   <h3 className="text-base font-medium text-gray-700">
//     Selected Fields (Drag to Reorder)
//   </h3>
//   <Droppable droppableId={droppableId}>
//     {(provided, snapshot) => (
//       <div
//         {...provided.droppableProps}
//         ref={(el) => {
//           provided.innerRef(el);
//           droppableRef.current = el;
//         }}
//         className={`mt-2 space-y-2 p-4 border rounded-md min-h-[100px] ${
//           snapshot.isDraggingOver
//             ? "bg-blue-50 border-blue-500"
//             : "bg-white border-gray-300"
//         }`}
//       >
//         {selectedFields.length > 0 ? (
//           selectedFields.map((field, index) => {
//             const enquiryField = allEnquiryFields
//               .flatMap((category) => category.fields)
//               .find((f) => f.id === field.id);
//             if (!enquiryField) return null;
//             const fieldOptions =
//               field.id === "course"
//                 ? dynamicOptions.course
//                 : field.id === "branch"
//                 ? dynamicOptions.branch
//                 : field.id === "assignTo"
//                 ? dynamicOptions.assignTo
//                 : enquiryField.options || [];
//             return (
//               <Draggable
//                 key={field.id}
//                 draggableId={field.id.toString()}
//                 index={index}
//                 isDragDisabled={loading}
//               >
//                 {(provided, snapshot) => (
//                   <div
//                     ref={provided.innerRef}
//                     {...provided.draggableProps}
//                     {...provided.dragHandleProps}
//                     className={`flex items-center p-2 rounded hover:bg-gray-100 ${
//                       snapshot.isDragging
//                         ? "bg-blue-100 shadow-lg"
//                         : "bg-gray-50"
//                     }`}
//                   >
//                     <span className="mr-2 cursor-move text-gray-500 text-lg">
//                       ☰
//                     </span>
//                     <input
//                       type="checkbox"
//                       checked={true}
//                       onChange={(e) => {
//                         e.stopPropagation();
//                         handleFieldToggle(field.id);
//                       }}
//                       className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                       disabled={loading || isDragging}
//                     />
//                     <span className="ml-2 text-base text-gray-700 flex-1">
//                       {enquiryField.label} ({enquiryField.type})
//                       {enquiryField.required && (
//                         <span className="text-red-500">*</span>
//                       )}
//                     </span>
//                     {enquiryField.type === "select" ? (
//                       <select
//                         value={field.defaultValue || ""}
//                         onChange={(e) =>
//                           handleDefaultValueChange(field.id, e.target.value)
//                         }
//                         className="ml-2 p-1 border border-gray-300 rounded-md text-sm w-1/3"
//                         disabled={loading || isDragging}
//                       >
//                         <option value="">Select default</option>
//                         {fieldOptions.length > 0 ? (
//                           fieldOptions.map((option) => (
//                             <option
//                               key={option.value || option}
//                               value={option.value || option}
//                             >
//                               {option.label || option}
//                             </option>
//                           ))
//                         ) : (
//                           <option value="" disabled>
//                             No options available
//                           </option>
//                         )}
//                       </select>
//                     ) : (
//                       <input
//                         type="text"
//                         value={field.defaultValue}
//                         onChange={(e) => {
//                           e.stopPropagation();
//                           handleDefaultValueChange(field.id, e.target.value);
//                         }}
//                         placeholder="Default value"
//                         className="ml-2 p-1 border border-gray-300 rounded-md text-sm w-1/3"
//                         disabled={loading || isDragging}
//                       />
//                     )}
//                   </div>
//                 )}
//               </Draggable>
//             );
//           })
//         ) : (
//           <p className="text-gray-500 text-center">No fields selected</p>
//         )}
//         {provided.placeholder}
//       </div>
//     )}
//   </Droppable>
// </div>

//             {/* <div className="mt-4">
//               <h3 className="text-base font-medium text-gray-700">
//                 Selected Fields (Drag to Reorder)
//               </h3>
//               <Droppable droppableId={droppableId}>
//                 {(provided, snapshot) => (
//                   <div
//                     {...provided.droppableProps}
//                     ref={(el) => {
//                       provided.innerRef(el);
//                       droppableRef.current = el;
//                     }}
//                     className={`mt-2 space-y-2 p-4 border rounded-md min-h-[100px] ${
//                       snapshot.isDraggingOver
//                         ? "bg-blue-50 border-blue-500"
//                         : "bg-white border-gray-300"
//                     }`}
//                   >
//                     {selectedFields.length > 0 ? (
//                       selectedFields.map((field, index) => {
//                         const enquiryField = allEnquiryFields
//                           .flatMap((category) => category.fields)
//                           .find((f) => f.id === field.id);
//                         if (!enquiryField) return null;
//                         return (
//                           <Draggable
//                             key={field.id}
//                             draggableId={field.id.toString()}
//                             index={index}
//                             isDragDisabled={loading}
//                           >
//                             {(provided, snapshot) => (
//                               <div
//                                 ref={provided.innerRef}
//                                 {...provided.draggableProps}
//                                 {...provided.dragHandleProps}
//                                 className={`flex items-center p-2 rounded hover:bg-gray-100 ${
//                                   snapshot.isDragging
//                                     ? "bg-blue-100 shadow-lg"
//                                     : "bg-gray-50"
//                                 }`}
//                               >
//                                 <span className="mr-2 cursor-move text-gray-500 text-lg">
//                                   ☰
//                                 </span>
//                                 <input
//                                   type="checkbox"
//                                   checked={true}
//                                   onChange={(e) => {
//                                     e.stopPropagation();
//                                     handleFieldToggle(field.id);
//                                   }}
//                                   className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                                   disabled={loading || isDragging}
//                                 />
//                                 <span className="ml-2 text-base text-gray-700 flex-1">
//                                   {enquiryField.label} ({enquiryField.type})
//                                   {enquiryField.required && (
//                                     <span className="text-red-500">*</span>
//                                   )}
//                                 </span>
//                                 {enquiryField.type === "select" ? (
//   <select
//     value={field.defaultValue || ""}
//     onChange={(e) => handleDefaultValueChange(field.id, e.target.value)}
//     className="ml-2 p-1 border border-gray-300 rounded-md text-sm w-1/3"
//     disabled={loading || isDragging}
//   >
//     <option value="">Select default</option>
//     {enquiryField.options?.map((option) => (
//       <option key={option} value={option}>
//         {option}
//       </option>
//     ))}
//   </select>
// ) : (
//                                   <input
//                                     type="text"
//                                     value={field.defaultValue}
//                                     onChange={(e) => {
//                                       e.stopPropagation();
//                                       handleDefaultValueChange(field.id, e.target.value);
//                                     }}
//                                     placeholder="Default value"
//                                     className="ml-2 p-1 border border-gray-300 rounded-md text-sm w-1/3"
//                                     disabled={loading || isDragging}
//                                   />
//                                 )}
//                               </div>
//                             )}
//                           </Draggable>
//                         );
//                       })
//                     ) : (
//                       <p className="text-gray-500 text-center">No fields selected</p>
//                     )}
//                     {provided.placeholder}
//                   </div>
//                 )}
//               </Droppable>
//             </div> */}
//           </div>

//           <div className="flex justify-end">
//             <button
//               type="submit"
//               className={`bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200 ${
//                 loading ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//               disabled={loading}
//             >
//               {loading ? "Saving..." : form ? "Update" : "Save"}
//             </button>
//           </div>
//         </DragDropContext>
//       </form>
//     </div>
//   );
// };

// export default CreateEnquiryForm;



import React, { useState, useEffect, useRef } from "react";
import { db } from "../../../config/firebase";
import { getDocs, collection, addDoc, updateDoc, doc, serverTimestamp, query, where } from "firebase/firestore";
import { allEnquiryFields } from "./enquiryFields.jsx";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const CreateEnquiryForm = ({ isOpen, toggleSidebar, form, logActivity }) => {
  const [formName, setFormName] = useState("");
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [assignmentType, setAssignmentType] = useState("Users");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [formLink, setFormLink] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({
    "Personal Details": true,
    "Additional Details": true,
    "Enquiry Details": true,
  });
  const droppableId = `selectedFields-${form?.id || "new"}`;
  const droppableRef = useRef(null);
  const [dynamicOptions, setDynamicOptions] = useState({
    course: [],
    branch: [],
    assignTo: [],
  });

  useEffect(() => {
    if (form) {
      setFormName(form.name || "");
      setSelectedUsers(Array.isArray(form.users) ? form.users : []);
      setSelectedRoles(Array.isArray(form.roles) ? form.roles : []);
      setAssignmentType(form.users?.length > 0 ? "Users" : "Roles");
      setSelectedFields(
        Array.isArray(form.fields)
          ? form.fields.map((field) => ({
              id: field.id || "",
              defaultValue: field.defaultValue ?? "",
              customOptions: field.customOptions || [],
              isReadOnly: field.isReadOnly || false,
              useDynamicOptions: field.useDynamicOptions ?? true,
            }))
          : []
      );
      setTags(Array.isArray(form.tags) ? form.tags : []);
      setFormLink(form.formLink || `https://form.shikshasaarathi.com/${form.id}`);
    } else {
      setFormName("");
      setSelectedUsers([]);
      setSelectedRoles([]);
      setAssignmentType("Users");
      setSelectedFields([]);
      setTags([]);
      setFormLink(null);
    }
  }, [form]);

  useEffect(() => {
    const fetchDynamicOptions = async () => {
      try {
        // Fetch instituteSetup document ID dynamically
        const instituteSetupSnapshot = await getDocs(collection(db, "instituteSetup"));
        const instituteSetupDocId = instituteSetupSnapshot.docs[0]?.id;

        const [courseSnapshot, centerSnapshot, roleSnapshot, userSnapshot] = await Promise.all([
          getDocs(collection(db, "Course")),
          instituteSetupDocId
            ? getDocs(collection(db, "instituteSetup", instituteSetupDocId, "Center"))
            : Promise.resolve({ docs: [] }),
          getDocs(query(collection(db, "roles"), where("name", "==", "Sales"))),
          getDocs(collection(db, "Users")),
        ]);

        setDynamicOptions({
          course: courseSnapshot.docs.map((doc) => ({
            value: doc.data().name || doc.id,
            label: doc.data().name || doc.id,
          })),
          branch: centerSnapshot.docs.map((doc) => ({
            value: doc.data().name || doc.id,
            label: doc.data().name || doc.id,
          })),
          assignTo: userSnapshot.docs
            .filter((doc) => doc.data().role === roleSnapshot.docs[0]?.id)
            .map((doc) => ({
              value: doc.data().displayName || doc.data().email || doc.id,
              label: doc.data().displayName || doc.data().email || doc.id,
            })),
        });
      } catch (err) {
        // //console.error("Error fetching dynamic options:", err);
        setError(`Error fetching options: ${err.message}`);
      }
    };
    fetchDynamicOptions();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        setLoading(true);
        const userSnapshot = await getDocs(collection(db, "Users"));
        setUsers(userSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setAvailableUsers(
          form
            ? userSnapshot.docs
                .filter((doc) => !form.users?.includes(doc.id))
                .map((doc) => ({ id: doc.id, ...doc.data() }))
            : userSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
        const roleSnapshot = await getDocs(collection(db, "roles"));
        setRoles(roleSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setAvailableRoles(
          form
            ? roleSnapshot.docs
                .filter((doc) => !form.roles?.includes(doc.id))
                .map((doc) => ({ id: doc.id, ...doc.data() }))
            : roleSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (err) {
        setError(`Failed to fetch data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [form]);

  useEffect(() => {
    return () => {
    };
  }, [droppableId]);

  const sanitizeData = (data) => {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      if (value === undefined) sanitized[key] = null;
      else if (Array.isArray(value))
        sanitized[key] = value.map((item) =>
          typeof item === "object" && item !== null ? sanitizeData(item) : item
        );
      else if (typeof value === "object" && value !== null && !(value instanceof Date))
        sanitized[key] = sanitizeData(value);
      else sanitized[key] = value;
    }
    return sanitized;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      setError("Form name is required.");
      return;
    }
    if (selectedFields.length === 0) {
      setError("At least one enquiry field must be selected.");
      return;
    }
    if (assignmentType === "Users" && selectedUsers.length === 0) {
      setError("At least one user must be selected.");
      return;
    }
    if (assignmentType === "Roles" && selectedRoles.length === 0) {
      setError("At least one role must be selected.");
      return;
    }

    let formId;
    const formData = {
      name: formName,
      users: assignmentType === "Users" ? selectedUsers : [],
      roles: assignmentType === "Roles" ? selectedRoles : [],
      fields: selectedFields.map((field) => {
        const fieldConfig = allEnquiryFields
          .flatMap((category) => category.fields)
          .find((f) => f.id === field.id);
        return {
          id: field.id,
          defaultValue: field.defaultValue,
          customOptions: field.customOptions || [],
          isReadOnly: field.isReadOnly || false,
          useDynamicOptions: field.useDynamicOptions ?? true,
          options: field.useDynamicOptions
            ? fieldConfig?.type === "select"
              ? dynamicOptions[field.id] || fieldConfig?.options || []
              : undefined
            : field.customOptions,
        };
      }),
      tags,
      enquiryCount: form?.enquiryCount || 0,
      updatedAt: serverTimestamp(),
      ...(form ? {} : { createdAt: serverTimestamp() }),
    };

    try {
      setLoading(true);
      setError(null);
      const sanitizedFormData = sanitizeData(formData);

      if (form) {
        const formRef = doc(db, "enquiryForms", form.id);
        await updateDoc(formRef, sanitizedFormData);
        await logActivity("Updated enquiry form", { name: formName });
        formId = form.id;
      } else {
        const docRef = await addDoc(collection(db, "enquiryForms"), sanitizedFormData);
        formId = docRef.id;
        const newFormLink = `https://form.shikshasaarathi.com/${formId}`;
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(newFormLink)}`;
        await updateDoc(doc(db, "enquiryForms", formId), {
          formLink: newFormLink,
          qrCodeUrl,
        });
        setFormLink(newFormLink);
        await logActivity("Created enquiry form", { name: formName });
      }

      resetForm();
      toggleSidebar();
    } catch (error) {
      setError(`Failed to save enquiry form: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormName("");
    setSelectedUsers([]);
    setSelectedRoles([]);
    setSelectedFields([]);
    setAvailableUsers(users);
    setAvailableRoles(roles);
    setAssignmentType("Users");
    setTags([]);
    setError(null);
    setFormLink(null);
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    const newTag = tagInput.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleAddUser = (userId) => {
    if (userId && !selectedUsers.includes(userId)) {
      setSelectedUsers([...selectedUsers, userId]);
      setAvailableUsers(availableUsers.filter((u) => u.id !== userId));
    }
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    const removedUser = users.find((u) => u.id === userId);
    if (removedUser) setAvailableUsers([...availableUsers, removedUser]);
  };

  const handleAddRole = (roleId) => {
    if (roleId && !selectedRoles.includes(roleId)) {
      setSelectedRoles([...selectedRoles, roleId]);
      setAvailableRoles(availableRoles.filter((r) => r.id !== roleId));
    }
  };

  const handleRemoveRole = (roleId) => {
    setSelectedRoles(selectedRoles.filter((id) => id !== roleId));
    const removedRole = roles.find((r) => r.id === roleId);
    if (removedRole) setAvailableRoles([...availableRoles, removedRole]);
  };

  const handleFieldToggle = (fieldId) => {
    if (isDragging || !fieldId) return;
    if (selectedFields.some((field) => field.id === fieldId)) {
      setSelectedFields(selectedFields.filter((field) => field.id !== fieldId));
    } else {
      const fieldConfig = allEnquiryFields
        .flatMap((category) => category.fields)
        .find((f) => f.id === fieldId);
      setSelectedFields([
        ...selectedFields,
        {
          id: fieldId,
          defaultValue: "",
          customOptions: fieldConfig?.type === "select" ? [] : [],
          isReadOnly: false,
          useDynamicOptions: ["course", "branch", "assignTo"].includes(fieldId),
        },
      ]);
    }
  };

  const handleCategoryToggle = (category) => {
    const categoryFields = allEnquiryFields
      .find((cat) => cat.category === category)
      .fields.map((field) => field.id);
    const allSelected = categoryFields.every((fieldId) =>
      selectedFields.some((field) => field.id === fieldId)
    );

    if (allSelected) {
      setSelectedFields(
        selectedFields.filter((field) => !categoryFields.includes(field.id))
      );
    } else {
      const newFields = categoryFields
        .filter((fieldId) => !selectedFields.some((field) => field.id === fieldId))
        .map((fieldId) => {
          const fieldConfig = allEnquiryFields
            .flatMap((category) => category.fields)
            .find((f) => f.id === fieldId);
          return {
            id: fieldId,
            defaultValue: "",
            customOptions: fieldConfig?.type === "select" ? [] : [],
            isReadOnly: false,
            useDynamicOptions: ["course", "branch", "assignTo"].includes(fieldId),
          };
        });
      setSelectedFields([...selectedFields, ...newFields]);
    }

    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleDefaultValueChange = (fieldId, value) => {
    if (isDragging) return;
    setSelectedFields(
      selectedFields.map((field) =>
        field.id === fieldId ? { ...field, defaultValue: value } : field
      )
    );
  };

  const handleCustomOptionsChange = (fieldId, value) => {
    if (isDragging) return;
    const options = value
      .split(",")
      .map((opt) => opt.trim())
      .filter((opt) => opt);
    setSelectedFields(
      selectedFields.map((field) =>
        field.id === fieldId ? { ...field, customOptions: options } : field
      )
    );
  };

  const handleReadOnlyToggle = (fieldId) => {
    if (isDragging) return;
    setSelectedFields(
      selectedFields.map((field) =>
        field.id === fieldId ? { ...field, isReadOnly: !field.isReadOnly } : field
      )
    );
  };

  const handleUseDynamicOptionsToggle = (fieldId) => {
    if (isDragging) return;
    setSelectedFields(
      selectedFields.map((field) =>
        field.id === fieldId
          ? { ...field, useDynamicOptions: !field.useDynamicOptions, customOptions: [] }
          : field
      )
    );
  };

  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = (result) => {
    setIsDragging(false);
    if (!result.destination) return;
    const items = Array.from(selectedFields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setSelectedFields(items);
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-white w-full shadow-lg transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } p-6 overflow-y-auto`}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {form ? "Update Enquiry Form" : "Create Enquiry Form"}
        </h1>
        <button
          onClick={toggleSidebar}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
        >
          Back
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}
      {loading && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md text-blue-700">
          Loading...
        </div>
      )}
      {formLink && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-700">
          <p className="font-medium">Form Submission Link</p>
          <a
            href={formLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-all block mt-2"
          >
            {formLink}
          </a>
          <div className="mt-2 space-x-2">
            <a
              href={formLink}
              download={`${formName}-form-link.txt`}
              className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Download Link
            </a>
            <button
              onClick={() => navigator.clipboard.writeText(formLink)}
              className="inline-block bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Copy Link
            </button>
          </div>
        </div>
      )}

   <form onSubmit={handleSubmit} className="space-y-6">
  <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
    {/* Form Name Section */}
  <div className="space-y-1.5">
  <label htmlFor="formName" className="block text-sm font-medium text-gray-700">
    Form Name
  </label>
  <div className="relative">
    <input
      type="text"
      id="formName"
      value={formName}
      placeholder="Enter form name"
      onChange={(e) => setFormName(e.target.value)}
      required
      className="block w-full px-3 py-2 text-sm rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 disabled:opacity-50 transition-all duration-150"
      disabled={loading}
    />
    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
      <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    </div>
  </div>
</div>

    {/* Tags Section */}
   <div className="space-y-1.5">
  <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
    Tags
  </label>
  <div className="flex rounded-md shadow-sm">
    <input
      type="text"
      value={tagInput}
      onChange={(e) => setTagInput(e.target.value)}
      placeholder="Enter tag and press Enter"
      className="flex-1 min-w-0 block w-full px-3 py-2 text-sm rounded-l-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150"
      disabled={loading}
      onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
    />
    <button
      type="button"
      onClick={handleAddTag}
      className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      disabled={loading}
    >
      <svg className="-ml-1 mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
      Add
    </button>
  </div>

  {tags.length > 0 && (
    <div className="mt-2 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-sm font-medium"
        >
          {tag}
          <button
            type="button"
            onClick={() => handleRemoveTag(tag)}
            className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 transition-colors"
          >
            <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </span>
      ))}
    </div>
  )}
</div>



    {/* Assignment Type Section */}
   <div className="space-y-1.5">
  <label htmlFor="assignmentType" className="block text-sm font-medium text-gray-700">
    Assign To
  </label>
  <div className="relative">
    <select
      id="assignmentType"
      value={assignmentType}
      onChange={(e) => {
        setAssignmentType(e.target.value);
        setSelectedUsers([]);
        setSelectedRoles([]);
        setAvailableUsers(users);
        setAvailableRoles(roles);
      }}
      className="block w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none transition-all duration-150 disabled:opacity-50"
      disabled={loading}
    >
      <option value="Users">Users</option>
      <option value="Roles">Roles</option>
    </select>
    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
      <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
</div>

    {/* Users/Roles Selection */}
    {assignmentType === "Users" && (
    <div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">Select Users</label>
  <div className="relative">
    <select
      onChange={(e) => handleAddUser(e.target.value)}
      className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm transition-all duration-150 disabled:opacity-50"
      disabled={loading}
    >
      <option value="">Select a User</option>
      {availableUsers.map((user) => (
        <option key={user.id} value={user.id}>
          {user.name || user.email}
        </option>
      ))}
    </select>
    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
      <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>

  {selectedUsers.length > 0 && (
    <div className="mt-4 border rounded-lg overflow-hidden shadow-sm ring-1 ring-gray-300">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase tracking-wide text-xs">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">User Name</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {selectedUsers.map((userId, index) => {
              const user = users.find((u) => u.id === userId);
              return (
                <tr key={userId} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-500">{index + 1}</td>
                  <td className="px-4 py-2 font-medium text-gray-800">{user?.name || user?.email}</td>
                  <td className="px-4 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveUser(userId)}
                      className="text-red-500 hover:text-red-700 transition"
                      disabled={loading}
                      title="Remove"
                    >
                      <svg className="h-5 w-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  )}
</div>

    )}

    {assignmentType === "Roles" && (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Select Roles</label>
        <div className="relative">
          <select
            onChange={(e) => handleAddRole(e.target.value)}
            className="block w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base appearance-none bg-white"
            disabled={loading}
          >
            <option value="">Select a Role</option>
            {availableRoles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {selectedRoles.length > 0 && (
          <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedRoles.map((roleId, index) => {
                    const role = roles.find((r) => r.id === roleId);
                    return (
                      <tr key={roleId} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {role?.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            type="button"
                            onClick={() => handleRemoveRole(roleId)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-200"
                            disabled={loading}
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    )}

    {/* Enquiry Fields Section */}
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Select Enquiry Fields</label>
      <div className="mt-2 space-y-2 max-h-60 overflow-y-auto border border-gray-200 p-4 rounded-lg shadow-inner">
        {allEnquiryFields.length > 0 ? (
          allEnquiryFields.map((category) => {
            const categoryFields = category.fields.map((field) => field.id);
            const allSelected = categoryFields.every((fieldId) =>
              selectedFields.some((field) => field.id === fieldId)
            );
            return (
              <div key={category.category} className="mb-4">
                <button
                  type="button"
                  onClick={() => handleCategoryToggle(category.category)}
                  className="w-full text-left flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <span className="text-sm font-medium text-gray-900 flex items-center">
                    <span className="mr-2">{category.category}</span>
                    {allSelected && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        All Selected
                      </span>
                    )}
                  </span>
                  <span className="text-gray-500">
                    {expandedCategories[category.category] ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </span>
                </button>
                {expandedCategories[category.category] && (
                  <div className="mt-2 space-y-2 pl-4">
                    {category.fields.map((field) => (
                      <div key={field.id} className="flex items-center p-2 hover:bg-gray-50 rounded transition-colors duration-200">
                        <input
                          type="checkbox"
                          id={field.id}
                          checked={selectedFields.some((f) => f.id === field.id)}
                          onChange={() => handleFieldToggle(field.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
                          disabled={loading || isDragging}
                        />
                        <label
                          htmlFor={field.id}
                          className="ml-3 text-sm text-gray-700 flex items-center"
                        >
                          <span>{field.label}</span>
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {field.type}
                          </span>
                          {field.required && (
                            <span className="ml-1 text-red-500">*</span>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-1 text-sm text-gray-500">No enquiry fields available</p>
          </div>
        )}
      </div>
    </div>

    {/* Selected Fields Section */}
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700">
        Selected Fields (Drag to Reorder)
      </h3>
      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={(el) => {
              provided.innerRef(el);
              droppableRef.current = el;
            }}
            className={`mt-2 space-y-2 p-4 border rounded-lg transition-all duration-200 min-h-[100px] ${
              snapshot.isDraggingOver
                ? "bg-blue-50 border-blue-500 ring-1 ring-blue-200"
                : "bg-white border-gray-200"
            }`}
          >
            {selectedFields.length > 0 ? (
              selectedFields.map((field, index) => {
                const enquiryField = allEnquiryFields
                  .flatMap((category) => category.fields)
                  .find((f) => f.id === field.id);
                if (!enquiryField) return null;
                const fieldOptions = field.useDynamicOptions
                  ? dynamicOptions[field.id] || enquiryField.options || []
                  : field.customOptions || [];
                return (
                  <Draggable
                    key={field.id}
                    draggableId={field.id.toString()}
                    index={index}
                    isDragDisabled={loading}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`flex flex-col p-3 rounded-lg shadow-sm border transition-all duration-200 ${
                          snapshot.isDragging
                            ? "bg-blue-100 border-blue-300 shadow-md"
                            : "bg-white border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="mr-3 cursor-move text-gray-400 hover:text-gray-600 transition-colors duration-200">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                          </span>
                          <input
                            type="checkbox"
                            checked={true}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleFieldToggle(field.id);
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
                            disabled={loading || isDragging}
                          />
                          <span className="ml-3 text-sm font-medium text-gray-900 flex-1 flex items-center">
                            {enquiryField.label}
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {enquiryField.type}
                            </span>
                            {enquiryField.required && (
                              <span className="ml-1 text-red-500">*</span>
                            )}
                          </span>
                          <label className="ml-3 inline-flex items-center">
                            <input
                              type="checkbox"
                              checked={field.isReadOnly}
                              onChange={() => handleReadOnlyToggle(field.id)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
                              disabled={loading || isDragging}
                            />
                            <span className="ml-2 text-xs text-gray-600">Read-Only</span>
                          </label>
                        </div>
                        <div className="ml-11 mt-3 flex flex-wrap items-center gap-3">
                          {enquiryField.type === "select" ? (
                            <>
                              <label className="inline-flex items-center">
                                <input
                                  type="checkbox"
                                  checked={field.useDynamicOptions}
                                  onChange={() => handleUseDynamicOptionsToggle(field.id)}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
                                  disabled={loading || isDragging || !["course", "branch", "assignTo"].includes(field.id)}
                                />
                                <span className="ml-2 text-xs text-gray-600">
                                  Use Database Options
                                </span>
                              </label>
                              {field.useDynamicOptions ? (
                                <div className="relative">
                                  <select
                                    value={field.defaultValue || ""}
                                    onChange={(e) => handleDefaultValueChange(field.id, e.target.value)}
                                    className="block w-full pl-3 pr-10 py-2 text-xs border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    disabled={loading || isDragging}
                                  >
                                    <option value="">Select default</option>
                                    {fieldOptions.length > 0 ? (
                                      fieldOptions.map((option) => (
                                        <option
                                          key={option.value || option}
                                          value={option.value || option}
                                        >
                                          {option.label || option}
                                        </option>
                                      ))
                                    ) : (
                                      <option value="" disabled>
                                        No options available
                                      </option>
                                    )}
                                  </select>
                                </div>
                              ) : (
                                <>
                                  <input
                                    type="text"
                                    value={field.customOptions.join(", ")}
                                    onChange={(e) => handleCustomOptionsChange(field.id, e.target.value)}
                                    placeholder="Enter options (comma-separated)"
                                    className="block w-full px-3 py-2 text-xs border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    disabled={loading || isDragging}
                                  />
                                  <div className="relative">
                                    <select
                                      value={field.defaultValue || ""}
                                      onChange={(e) => handleDefaultValueChange(field.id, e.target.value)}
                                      className="block w-full pl-3 pr-10 py-2 text-xs border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                      disabled={loading || isDragging}
                                    >
                                      <option value="">Select default</option>
                                      {field.customOptions.map((option) => (
                                        <option key={option} value={option}>
                                          {option}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </>
                              )}
                            </>
                          ) : (
                            <input
                              type="text"
                              value={field.defaultValue}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleDefaultValueChange(field.id, e.target.value);
                              }}
                              placeholder="Default value"
                              className="block w-full px-3 py-2 text-xs border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              disabled={loading || isDragging}
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })
            ) : (
              <div className="text-center py-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-1 text-sm text-gray-500">No fields selected</p>
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>

    {/* Submit Button */}
    <div className="flex justify-end pt-4">
      <button
        type="submit"
        className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : form ? (
          <>
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Update Form
          </>
        ) : (
          <>
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Save Form
          </>
        )}
      </button>
    </div>
  </DragDropContext>
</form>
    </div>
  );
};

export default CreateEnquiryForm;