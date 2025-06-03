import React, { useState, useEffect } from "react";
import { db } from "../../../config/firebase";
import { collection, addDoc, getDocs, doc, updateDoc, query, where } from "firebase/firestore";

const CreateRoleModal = ({ isOpen, onClose, fetchRoles, roleToEdit }) => {
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState({});
  const [expandedSections, setExpandedSections] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "Users"));
      const usersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (roleToEdit) {
      setIsEditMode(true);
      setRoleName(roleToEdit.name);
      setDescription(roleToEdit.description || "");

      const updatedPermissions = {};
      permissionCategories.forEach(category => {
        updatedPermissions[category] = roleToEdit.permissions?.[category] || { create: false, update: false, display: false, delete: false };
      });

      setPermissions(updatedPermissions);
      setSelectedUsers(roleToEdit.userIds || []);
    } else {
      setIsEditMode(false);
      setRoleName("");
      setDescription("");
      setPermissions({});
      setSelectedUsers([]);
    }
  }, [roleToEdit]);

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
      if (isEditMode && roleToEdit) {
        const roleDocRef = doc(db, "roles", roleToEdit.id);
        await updateDoc(roleDocRef, {
          name: roleName,
          description: description || "",
          permissions,
          usersAssigned: selectedUsers.length,
          userIds: selectedUsers,
          type: "CUSTOM",
        });

        const instructorCollection = collection(db, "Users");
        const allUsersWithRole = await getDocs(query(instructorCollection, where("roleId", "==", roleToEdit.id)));
        allUsersWithRole.forEach(async (doc) => {
          if (!selectedUsers.includes(doc.id)) {
            await updateDoc(doc.ref, { roleId: null });
          }
        });

        selectedUsers.forEach(async (userId) => {
          const instructorDocRef = doc(instructorCollection, userId);
          await updateDoc(instructorDocRef, { roleId: roleToEdit.id });
        });

        alert("Role updated successfully!");
      } else {
        const roleRef = await addDoc(collection(db, "roles"), {
          name: roleName,
          description: description || "",
          permissions,
          usersAssigned: selectedUsers.length,
          userIds: selectedUsers,
          type: "CUSTOM",
        });

        const roleId = roleRef.id;
        const instructorCollection = collection(db, "Users");

        selectedUsers.forEach(async (userId) => {
          const instructorDocRef = doc(instructorCollection, userId);
          await updateDoc(instructorDocRef, { roleId: roleId });
        });

        alert("Role created successfully!");
      }

      setRoleName("");
      setDescription("");
      setPermissions({});
      setSelectedUsers([]);
      onClose();
      fetchRoles();
    } catch (error) {
      //console.error("Error saving document: ", error);
      alert("Failed to save role: " + error.message);
    }
  };

  if (!isOpen) return null;

  const permissionCategories = [
    "instituteSetup",
    "Users",
    "Sessions",
    "Course",
    "curriculums",
    "Batch",
    "attendance",
    "assignments",
    "performance",
    "student",
    "enquiries",
    "Users",
    "roles",
    "questions",
    "fee",
    "invoice",
    "FinancePartner",
    "Holidays",
    "Leaves",
    "JopOpenings",
    "Companies",
    "templates",
    "invoices",
    "activityLogs",
    "enquiryForms"
  ];

  return (
    <div className={`fixed top-0 right-0 h-full bg-white w-full md:w-2/5 shadow-lg transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"} p-6 overflow-y-auto`}>
      <h1 className="text-xl font-bold">{isEditMode ? "Edit Role" : "Create Role"}</h1>

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
              className="w-full text-left p-2 font-medium bg-gray-100 hover:bg-gray-200 flex justify-between"
              onClick={() => toggleSection(category)}
            >
              {category}
              <span>{expandedSections[category] ? "▲" : "▼"}</span>
            </button>
            {expandedSections[category] && (
              <div className="p-2 pl-4 bg-white">
                {["create", "update", "display", "delete"].map((perm) => (
                  <label key={perm} className="flex items-center space-x-2 mt-2">
                    <input
                      type="checkbox"
                      checked={permissions[category]?.[perm] || false}
                      onChange={() => handlePermissionChange(category, perm)}
                    />
                    <span className="capitalize">{perm}</span>
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
          {isEditMode ? "Update Role" : "Create Role"}
        </button>
      </div>
    </div>
  );
};

export default CreateRoleModal;