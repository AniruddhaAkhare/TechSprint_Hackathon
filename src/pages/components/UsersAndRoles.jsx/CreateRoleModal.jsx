

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
//     "Roles",
//     "Courses",
//     "Batches",
//     "Sessions",
//     "Curriculum",
//     "Performance",
//     "Learners",
//     "Staff",
//     "Reports",
//     "Centers",
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
//                 className="w-full text-left p-2 font-medium bg-black-100 hover:bg-black-200 flex justify-between"
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



import React, { useState, useEffect } from "react";
import { db } from "../../../config/firebase"; // Import Firestore
import { collection, addDoc, getDocs } from "firebase/firestore";

const CreateRoleModal = ({ isOpen, onClose, fetchRoles }) => {
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState({});
  const [expandedSections, setExpandedSections] = useState({});
  const [users, setUsers] = useState([]); // List of users from Firestore
  const [selectedUsers, setSelectedUsers] = useState([]); // Selected user IDs

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "Instructor"));
      const usersList = querySnapshot.docs.map(doc => ({
        id: doc.id, 
        ...doc.data()
      }));
      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePermissionChange = (category, permissionType) => {
    setPermissions((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [permissionType]: !prev[category]?.[permissionType] || false,
      },
    }));
  };

  const handleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };
  
  const handleSubmit = async () => {
    if (!roleName.trim()) {
      alert("Role Name is required");
      return;
    }
  
    try {
      // Step 1: Create the role in Firestore
      const roleRef = await addDoc(collection(db, "roles"), {
        name: roleName,
        description: description || "",
        permissions,
        usersAssigned: selectedUsers.length,
        userIds: selectedUsers, // Store assigned user IDs
        type: "CUSTOM",
      });
  
      // Step 2: Update each instructor's document with the assigned role ID
      const roleId = roleRef.id; // Get the newly created role ID
      const instructorCollection = collection(db, "Instructor");
  
      selectedUsers.forEach(async (userId) => {
        const instructorDocRef = doc(instructorCollection, userId);
        await updateDoc(instructorDocRef, {
          roleId: roleId, // Store the assigned role ID in the instructor's document
        });
      });
  
      setRoleName("");
      setDescription("");
      setPermissions({});
      setSelectedUsers([]);
      onClose();
      fetchRoles(); // Refresh roles
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };
  

  // const handleSubmit = async () => {
  //   if (!roleName.trim()) {
  //     alert("Role Name is required");
  //     return;
  //   }

  //   try {
  //     await addDoc(collection(db, "roles"), {
  //       name: roleName,
  //       description: description || "",
  //       permissions,
  //       usersAssigned: selectedUsers.length,
  //       userIds: selectedUsers, // Store assigned user IDs
  //       type: "CUSTOM",
  //     });

  //     setRoleName("");
  //     setDescription("");
  //     setPermissions({});
  //     setSelectedUsers([]);
  //     onClose();
  //     fetchRoles(); // Refresh roles
  //   } catch (error) {
  //     console.error("Error adding document: ", error);
  //   }
  // };

  if (!isOpen) return null;

  const permissionCategories = [
    "Roles",
    "Courses",
    "Batches",
    "Sessions",
    "Curriculum",
    "Performance",
    "Learners",
    "Staff",
    "Reports",
    "Centers",
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-y-auto">
  <div className="bg-white p-6 rounded-lg w-1/3 shadow-lg max-h-[90vh] overflow-y-auto">
    <h2 className="text-xl font-semibold mb-4">Create Role</h2>


        {/* Role Name Input */}
        <label className="block font-medium">Role Name *</label>
        <input
          type="text"
          className="w-full p-2 border rounded mb-3"
          placeholder="Role Name"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
        />

        {/* Description Input */}
        <label className="block font-medium">Description (Optional)</label>
        <textarea
          className="w-full p-2 border rounded mb-3"
          placeholder="Role Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        {/* Permission Management */}
        <label className="block font-medium mb-2">Permissions *</label>
        <div className="border rounded">
          {permissionCategories.map((category, index) => (
            <div key={index} className="border-b">
              <button
                className="w-full text-left p-2 font-medium bg-black-100 hover:bg-gray-200 flex justify-between"
                onClick={() => toggleSection(category)}
              >
                {category}
                <span>{expandedSections[category] ? "▲" : "▼"}</span>
              </button>
              {expandedSections[category] && (
                <div className="p-2 pl-4 bg-white">
                  {["View", "Edit", "Delete"].map((perm) => (
                    <label key={perm} className="flex items-center space-x-2 mt-2">
                      <input
                        type="checkbox"
                        checked={permissions[category]?.[perm] || false}
                        onChange={() => handlePermissionChange(category, perm)}
                      />
                      <span>{perm}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Assign Users */}
        <label className="block font-medium mt-4">Assign Users</label>
        <div className="border rounded p-2 max-h-32 overflow-y-auto">
          {users.map((user) => (
            <label key={user.id} className="flex items-center space-x-2 mt-2">
              <input
                type="checkbox"
                checked={selectedUsers.includes(user.id)}
                onChange={() => handleUserSelection(user.id)}
              />
              <span>{user.f_name} {user.l_name} ({user.email})</span>
            </label>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded mr-2">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
            Create Role
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoleModal;
