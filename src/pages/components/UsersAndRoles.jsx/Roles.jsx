
import { useState, useEffect } from "react";
import Button from '../../../components/ui/Button';
import { db } from "../../../config/firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import CreateRoleModal from "./CreateRoleModal";
import { MoreVertical } from "lucide-react";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);


  const fetchRolesWithUserCount = async () => {
    try {
      const rolesSnapshot = await getDocs(collection(db, "roles"));
      let rolesList = rolesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), usersAssigned: 0 }));

      // Fetch all instructors
      const instructorsSnapshot = await getDocs(collection(db, "Instructor"));
      const instructors = instructorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Count how many instructors are assigned to each role
      for (let role of rolesList) {
        const assignedCount = instructors.filter(instructor => instructor.roleId === role.id).length; // Use roleId

        // Update Firestore if count has changed
        if (role.usersAssigned !== assignedCount) {
          await updateDoc(doc(db, "roles", role.id), { usersAssigned: assignedCount });
        }

        role.usersAssigned = assignedCount;
      }

      setRoles(rolesList);
    } catch (error) {
      console.error("Error fetching roles with user count:", error);
    }
  };

  useEffect(() => {
    fetchRolesWithUserCount();
  }, []);

  // Open Create Role Modal
  const handleNewRole = () => {
    setSelectedRole(null); // Reset previous selection
    setIsModalOpen(true);
  };

  // Open edit modal
  const handleEdit = (role) => {
    setSelectedRole(role);
    setIsModalOpen(true);
    setDropdownOpen(null);
  };

  // Delete role from Firestore
  const handleDelete = async (roleId) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      await deleteDoc(doc(db, "roles", roleId));
      fetchRolesWithUserCount(); // Refresh roles
      setDropdownOpen(null);
    }
  };

  return (
    <div className="flex-col w-screen ml-80 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Roles & Permissions</h2>
        <Button className="bg-blue-600 text-white" onClick={handleNewRole}>
          + New Role
        </Button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">#</th>
            <th className="p-2 border">Role Name</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Users Assigned</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role, index) => (
            <tr key={role.id} className="text-center border">
              <td className="p-2 border">{index + 1}</td>
              <td className="p-2 border">{role.name}</td>
              <td className="p-2 border">{role.description}</td>
              <td className="p-2 border">
                <span className="bg-gray-200 px-2 py-1 rounded text-xs">{role.type}</span>
              </td>
              <td className="p-2 border">{role.usersAssigned}</td>
              <td className="p-2 border relative">
                <button onClick={() => setDropdownOpen(dropdownOpen === role.id ? null : role.id)}>
                  <MoreVertical className="cursor-pointer" />
                </button>
                {dropdownOpen === role.id && (
                  <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg z-10">
                    <button className="block w-full px-4 py-2 text-left hover:bg-gray-100" onClick={() => handleEdit(role)}>
                      Edit
                    </button>
                    <button className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100" onClick={() => handleDelete(role.id)}>
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Create/Edit Role */}
      {/* <CreateRoleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} fetchRoles={fetchRolesWithUserCount} selectedRole={selectedRole} /> */}
      <CreateRoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fetchRoles={fetchRolesWithUserCount}
        roleToEdit={selectedRole}  // Ensure this prop name matches
      />
    </div>
  );
};

export default Roles;
