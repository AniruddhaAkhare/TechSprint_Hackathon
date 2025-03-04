// // // // import React from "react";

// // // // const CreateRoleModal = ({ isOpen, onClose }) => {
// // // //   if (!isOpen) return null;

// // // //   return (
// // // //     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
// // // //       <div className="bg-white p-6 rounded-lg w-1/3 shadow-lg">
// // // //         <h2 className="text-xl font-semibold mb-4">Create Role</h2>
        
// // // //         <label className="block font-medium">Role Name *</label>
// // // //         <input type="text" className="w-full p-2 border rounded mb-3" placeholder="The name of your role" />

// // // //         <label className="block font-medium">Description (Optional)</label>
// // // //         <textarea className="w-full p-2 border rounded mb-3" placeholder="Add a description for your role"></textarea>

// // // //         <div className="flex justify-end mt-4">
// // // //           <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded mr-2">Cancel</button>
// // // //           <button className="px-4 py-2 bg-blue-600 text-white rounded">Create Role</button>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default CreateRoleModal;


// // // import React, { useState } from "react";

// // // const CreateRoleModal = ({ isOpen, onClose }) => {
// // //   const [roleName, setRoleName] = useState("");
// // //   const [description, setDescription] = useState("");
// // //   const [expandedSections, setExpandedSections] = useState({});

// // //   const toggleSection = (section) => {
// // //     setExpandedSections((prev) => ({
// // //       ...prev,
// // //       [section]: !prev[section],
// // //     }));
// // //   };

// // //   if (!isOpen) return null;

// // //   const permissionCategories = [
// // //     "Feedback form",
// // //     "Dashboard",
// // //     "Scheduling",
// // //     "Courses",
// // //     "Batches",
// // //     "Announcements",
// // //     "Reports",
// // //     "New Enrollment",
// // //   ];

// // //   return (
// // //     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
// // //       <div className="bg-white p-6 rounded-lg w-1/3 shadow-lg">
// // //         <h2 className="text-xl font-semibold mb-4">Create Role</h2>

// // //         {/* Role Name Input */}
// // //         <label className="block font-medium">Role Name *</label>
// // //         <input
// // //           type="text"
// // //           className="w-full p-2 border rounded mb-3"
// // //           placeholder="The name of your role"
// // //           value={roleName}
// // //           onChange={(e) => setRoleName(e.target.value)}
// // //         />

// // //         {/* Description Input */}
// // //         <label className="block font-medium">Description (Optional)</label>
// // //         <textarea
// // //           className="w-full p-2 border rounded mb-3"
// // //           placeholder="Add a description for your role"
// // //           value={description}
// // //           onChange={(e) => setDescription(e.target.value)}
// // //         ></textarea>

// // //         {/* Permission Management */}
// // //         <label className="block font-medium mb-2">Permission Management *</label>
// // //         <div className="border rounded">
// // //           {permissionCategories.map((category, index) => (
// // //             <div key={index} className="border-b">
// // //               <button
// // //                 className="w-full text-left p-2 font-medium bg-gray-100 hover:bg-gray-200 flex justify-between"
// // //                 onClick={() => toggleSection(category)}
// // //               >
// // //                 {category}
// // //                 <span>{expandedSections[category] ? "▲" : "▼"}</span>
// // //               </button>
// // //               {expandedSections[category] && (
// // //                 <div className="p-2 pl-4 bg-white">
// // //                   <label className="flex items-center space-x-2">
// // //                     <input type="checkbox" /> <span>View</span>
// // //                   </label>
// // //                   <label className="flex items-center space-x-2 mt-2">
// // //                     <input type="checkbox" /> <span>Edit</span>
// // //                   </label>
// // //                   <label className="flex items-center space-x-2 mt-2">
// // //                     <input type="checkbox" /> <span>Delete</span>
// // //                   </label>
// // //                 </div>
// // //               )}
// // //             </div>
// // //           ))}
// // //         </div>

// // //         {/* Action Buttons */}
// // //         <div className="flex justify-end mt-4">
// // //           <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded mr-2">Cancel</button>
// // //           <button className="px-4 py-2 bg-blue-600 text-white rounded">Create Role</button>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default CreateRoleModal;



// import React, { useState } from "react";
// import { db } from "../../../config/firebase"; // Import Firestore
// import { collection, addDoc } from "firebase/firestore";

// const CreateRoleModal = ({ isOpen, onClose, fetchRoles }) => {
//   const [roleName, setRoleName] = useState("");
//   const [description, setDescription] = useState("");
//   const [expandedSections, setExpandedSections] = useState({});
//   const [permissions, setPermissions] = useState({});

//   const toggleSection = (section) => {
//     setExpandedSections((prev) => ({
//       ...prev,
//       [section]: !prev[section],
//     }));
//   };

//   const handlePermissionChange = (category, permissionType) => {
//     setPermissions((prev) => ({
//       ...prev,
//       [category]: {
//         ...prev[category],
//         [permissionType]: !prev[category]?.[permissionType] || false,
//       },
//     }));
//   };

//   const handleSubmit = async () => {
//     if (!roleName.trim()) {
//       alert("Role Name is required");
//       return;
//     }

//     try {
//       await addDoc(collection(db, "roles"), {
//         name: roleName,
//         description: description || "",
//         permissions,
//         usersAssigned: 0, 
//         type: "CUSTOM",
//       });

//       setRoleName("");
//       setDescription("");
//       setPermissions({});
//       onClose();
//       fetchRoles(); // Refresh roles in Roles.jsx
//     } catch (error) {
//       console.error("Error adding document: ", error);
//     }
//   };

//   if (!isOpen) return null;

//   const permissionCategories = [
//     "Feedback form",
//     "Dashboard",
//     "Scheduling",
//     "Courses",
//     "Batches",
//     "Announcements",
//     "Reports",
//     "New Enrollment",
//   ];

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//       <div className="bg-white p-6 rounded-lg w-1/3 shadow-lg">
//         <h2 className="text-xl font-semibold mb-4">Create Role</h2>

//         {/* Role Name Input */}
//         <label className="block font-medium">Role Name *</label>
//         <input
//           type="text"
//           className="w-full p-2 border rounded mb-3"
//           placeholder="The name of your role"
//           value={roleName}
//           onChange={(e) => setRoleName(e.target.value)}
//         />

//         {/* Description Input */}
//         <label className="block font-medium">Description (Optional)</label>
//         <textarea
//           className="w-full p-2 border rounded mb-3"
//           placeholder="Add a description for your role"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//         ></textarea>

//         {/* Permission Management */}
//         <label className="block font-medium mb-2">Permission Management *</label>
//         <div className="border rounded">
//           {permissionCategories.map((category, index) => (
//             <div key={index} className="border-b">
//               <button
//                 className="w-full text-left p-2 font-medium bg-gray-100 hover:bg-black-200 flex justify-between"
//                 onClick={() => toggleSection(category)}
//               >
//                 {category}
//                 <span>{expandedSections[category] ? "▲" : "▼"}</span>
//               </button>
//               {expandedSections[category] && (
//                 <div className="p-2 pl-4 bg-white">
//                   {["View", "Edit", "Delete"].map((perm) => (
//                     <label key={perm} className="flex items-center space-x-2 mt-2">
//                       <input
//                         type="checkbox"
//                         checked={permissions[category]?.[perm] || false}
//                         onChange={() => handlePermissionChange(category, perm)}
//                       />
//                       <span>{perm}</span>
//                     </label>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-end mt-4">
//           <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded mr-2">Cancel</button>
//           <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
//             Create Role
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateRoleModal;


// // import React, { useState, useEffect } from "react";
// // import { db } from "../../../config/firebase";
// // import { collection, addDoc, updateDoc, doc } from "firebase/firestore";

// // const CreateRoleModal = ({ isOpen, onClose, fetchRoles, selectedRole }) => {
// //   const [roleName, setRoleName] = useState("");
// //   const [description, setDescription] = useState("");

// //   // Set data when editing
// //   useEffect(() => {
// //     if (selectedRole) {
// //       setRoleName(selectedRole.name);
// //       setDescription(selectedRole.description);
// //     } else {
// //       setRoleName("");
// //       setDescription("");
// //     }
// //   }, [selectedRole]);

// //   const handleSubmit = async () => {
// //     if (!roleName.trim()) {
// //       alert("Role Name is required");
// //       return;
// //     }

// //     try {
// //       if (selectedRole) {
// //         // Update existing role
// //         await updateDoc(doc(db, "roles", selectedRole.id), {
// //           name: roleName,
// //           description: description || "",
// //         });
// //       } else {
// //         // Add new role
// //         await addDoc(collection(db, "roles"), {
// //           name: roleName,
// //           description: description || "",
// //           usersAssigned: 0,
// //           type: "CUSTOM",
// //         });
// //       }

// //       fetchRoles();
// //       onClose();
// //     } catch (error) {
// //       console.error("Error saving role: ", error);
// //     }
// //   };

// //   if (!isOpen) return null;

// //   return (
// //     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
// //       <div className="bg-white p-6 rounded-lg w-1/3 shadow-lg">
// //         <h2 className="text-xl font-semibold mb-4">{selectedRole ? "Edit Role" : "Create Role"}</h2>

// //         {/* Role Name Input */}
// //         <label className="block font-medium">Role Name *</label>
// //         <input
// //           type="text"
// //           className="w-full p-2 border rounded mb-3"
// //           placeholder="The name of your role"
// //           value={roleName}
// //           onChange={(e) => setRoleName(e.target.value)}
// //         />

// //         {/* Description Input */}
// //         <label className="block font-medium">Description (Optional)</label>
// //         <textarea
// //           className="w-full p-2 border rounded mb-3"
// //           placeholder="Add a description for your role"
// //           value={description}
// //           onChange={(e) => setDescription(e.target.value)}
// //         ></textarea>

// //         {/* Action Buttons */}
// //         <div className="flex justify-end mt-4">
// //           <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded mr-2">Cancel</button>
// //           <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
// //             {selectedRole ? "Update Role" : "Create Role"}
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default CreateRoleModal;


import React, { useState } from "react";
import { db } from "../../../config/firebase";
import { collection, addDoc } from "firebase/firestore";

const CreateRoleModal = ({ isOpen, onClose, fetchRoles }) => {
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState({});

  const permissionCategories = [
    "Feedback form",
    "Dashboard",
    "Scheduling",
    "Courses",
    "Batches",
    "Announcements",
    "Reports",
    "New Enrollment",
  ];

  const togglePermission = (category) => {
    setPermissions((prev) => ({
      ...prev,
      [category]: !prev[category], // Toggle true/false
    }));
  };

  const handleCreateRole = async () => {
    if (!roleName.trim()) {
      alert("Role name is required");
      return;
    }

    try {
      await addDoc(collection(db, "roles"), {
        roleName,
        description,
        permissions, // Store permissions object
      });

      fetchRoles(); // Refresh roles list
      onClose();
    } catch (error) {
      console.error("Error creating role:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-1/3 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Create Role</h2>

        {/* Role Name Input */}
        <label className="block font-medium">Role Name *</label>
        <input
          type="text"
          className="w-full p-2 border rounded mb-3"
          placeholder="Enter role name"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
        />

        {/* Description Input */}
        <label className="block font-medium">Description (Optional)</label>
        <textarea
          className="w-full p-2 border rounded mb-3"
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Permissions */}
        <label className="block font-medium mb-2">Permissions</label>
        <div className="border rounded p-2">
          {permissionCategories.map((category, index) => (
            <label key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="checkbox"
                checked={permissions[category] || false}
                onChange={() => togglePermission(category)}
              />
              <span>{category}</span>
            </label>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded mr-2">Cancel</button>
          <button onClick={handleCreateRole} className="px-4 py-2 bg-blue-600 text-white rounded">
            Create Role
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoleModal;
