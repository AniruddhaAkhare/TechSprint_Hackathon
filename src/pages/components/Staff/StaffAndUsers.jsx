import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../../config/firebase";
import {
  getDocs,
  collection,
  doc,
  setDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "../../../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function StaffAndUsers() {
  const navigate = useNavigate();
  const { currentUser, rolePermissions } = useAuth();

  // Permissions
  const canDisplay = rolePermissions?.Users?.display || false;
  const canCreate = rolePermissions?.Users?.create || false;
  const canUpdate = rolePermissions?.Users?.update || false;
  const canDelete = rolePermissions?.Users?.delete || false;

  // State
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [centers, setCenters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    phone: "",
    domain: "",
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Firebase References
  const usersCollectionRef = collection(db, "Users");
  const rolesCollectionRef = collection(db, "roles");
  const activityLogsCollectionRef = collection(db, "activityLogs");

  // Fetch Data
  useEffect(() => {
    if (!canDisplay) {
      navigate("/staff");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const usersQuery = query(usersCollectionRef);
        const usersSnapshot = await getDocs(usersQuery);
        const usersData = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);

        // Fetch Roles
        const rolesSnapshot = await getDocs(rolesCollectionRef);
        const rolesData = rolesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setRoles(rolesData);

        // Fetch Centers
        const instituteSnapshot = await getDocs(collection(db, "instituteSetup"));
        if (!instituteSnapshot.empty) {
          const instituteId = instituteSnapshot.docs[0].id;
          const centerQuery = query(
            collection(db, "instituteSetup", instituteId, "Center"),
            where("isActive", "==", true)
          );
          const centerData = await getDocs(centerQuery);
          setCenters(centerData.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        }
      } catch (error) {
        //console.error("Error fetching data:", error);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [canDisplay, navigate]);

  // Activity Logging
  const logActivity = async (action, details) => {
    if (!currentUser) {
      //console.error("No current user available for logging");
      return;
    }
    try {
      const logData = {
        userId: currentUser.uid,
        userEmail: currentUser.email || "Unknown",
        timestamp: serverTimestamp(),
        action,
        details,
      };
      await addDoc(activityLogsCollectionRef, logData);
    } catch (error) {
      //console.error("Error logging activity:", error);
    }
  };

  // Create User
  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.role) {
      setError("Please fill all required fields.");
      return;
    }
    if (!canCreate) {
      setError("You do not have permission to create users.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);
      const authUser = userCredential.user;

      const userData = {
        displayName: newUser.name, // Fixed: Changed from newUser.displayName to newUser.name
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone || "",
        domain: newUser.domain || "",
        created_at: new Date().toISOString(),
      };

      await setDoc(doc(db, "Users", authUser.uid), userData);

      await logActivity("Created user", {
        userId: authUser.uid,
        email: newUser.email,
        name: newUser.name,
        role: roles.find((r) => r.id === newUser.role)?.name || "Unknown",
        phone: newUser.phone || "N/A",
        domain: newUser.domain || "N/A",
      });

      setUsers([...users, { id: authUser.uid, ...userData }]);
      setNewUser({ name: "", email: "", password: "", role: "", phone: "", domain: "" });
      setIsCreateModalOpen(false);
    } catch (error) {
      //console.error("Error creating user:", error);
      setError(error.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  // Update Role
  const handleRoleChange = async () => {
    if (!selectedUser || !selectedRoleId) {
      setError("Please select a user and a role.");
      return;
    }
    if (!canUpdate) {
      setError("You do not have permission to update user roles.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const oldRoleId = selectedUser.role;
      const newRoleName = roles.find((r) => r.id === selectedRoleId)?.name || "Unknown";
      const oldRoleName = roles.find((r) => r.id === oldRoleId)?.name || "Unknown";

      await setDoc(doc(db, "Users", selectedUser.id), { role: selectedRoleId }, { merge: true });
      setUsers(users.map((u) => (u.id === selectedUser.id ? { ...u, role: selectedRoleId } : u)));

      await logActivity("Updated user role", {
        userId: selectedUser.id,
        userEmail: selectedUser.email,
        changes: { oldRole: oldRoleName, newRole: newRoleName },
      });

      setSelectedUser(null);
      setSelectedRoleId("");
    } catch (error) {
      //console.error("Error updating role:", error);
      setError("Failed to update role");
    } finally {
      setLoading(false);
    }
  };

  // Delete User
  const handleDeleteUser = async () => {
    if (!userToDelete || !canDelete) {
      setError("You do not have permission to delete users.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await deleteDoc(doc(db, "Users", userToDelete.id));

      await logActivity("Deleted user", {
        userId: userToDelete.id,
        email: userToDelete.email,
        name: userToDelete.displayName || "Unknown",
        role: roles.find((r) => r.id === userToDelete.role)?.name || "Unknown",
        phone: userToDelete.phone || "N/A",
        domain: userToDelete.domain || "N/A",
      });

      setUsers(users.filter((u) => u.id !== userToDelete.id));
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      //console.error("Error deleting user:", error);
      setError("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  // Utility: Capitalize First Letter
  const capitalizeFirstLetter = (str) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Redirect if no permissions
  if (!canDisplay) return null;

  return (
    <div className="bg-gray-50 min-h-screen p-4 fixed inset-0 left-[300px] overflow-auto overflow-x-auto">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#333333] font-sans">Staff and Users</h1>
            <p className="text-gray-600 mt-2">Total Staff: {users.length}</p>
          </div>
          {canCreate && (
            <div className="flex space-x-4">
              <button
                onClick={() => navigate("/addstaff")}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"              >
                + Add Staff
              </button>
            </div>
          )}
        </div>

        {/* Error and Loading */}
        {loading && <div className="text-center py-4">Loading...</div>}
        {error && <div className="text-red-600 text-center py-4">{error}</div>}

        {/* Search and Table */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-full h-[70vh] overflow-y-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-base font-semibold text-gray-700 w-full">Name</th>
                  <th className="px-4 py-3 text-left text-base font-semibold text-gray-700 w-40">Email</th>
                  <th className="px-4 py-3 text-left text-base font-semibold text-gray-700 w-40">Phone</th>
                  <th className="px-4 py-3 text-left text-base font-semibold text-gray-700 w-40">Domain</th>
                  <th className="px-4 py-3 text-left text-base font-semibold text-gray-700 w-40">Role</th>
                  {(canUpdate || canDelete) && (
                    <th className="px-4 py-3 text-left text-base font-semibold text-gray-700 w-full">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {users
                  .filter(
                    (user) =>
                      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td
                        className="px-4 py-3 text-gray-800 cursor-pointer"
                        onClick={() => navigate(`/employee-profile/${user.id}`)}
                      >
                        {capitalizeFirstLetter(user.displayName) || "N/A"}
                      </td>
                      <td
                        className="px-4 py-3 text-gray-600 cursor-pointer"
                        onClick={() => navigate(`/employee-profile/${user.id}`)}
                      >
                        {user.email || "N/A"}
                      </td>
                      <td
                        className="px-4 py-3 text-gray-600 cursor-pointer"
                        onClick={() => navigate(`/employee-profile/${user.id}`)}
                      >
                        {user.phone || "N/A"}
                      </td>
                      <td
                        className="px-4 py-3 text-gray-600 cursor-pointer"
                        onClick={() => navigate(`/employee-profile/${user.id}`)}
                      >
                        {user.domain || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {selectedUser?.id === user.id && canUpdate ? (
                          <select
                            value={selectedRoleId}
                            onChange={(e) => setSelectedRoleId(e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Role</option>
                            {roles.map((role) => (
                              <option key={role.id} value={role.id}>
                                {role.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          roles.find((r) => r.id === user.role)?.name || "N/A"
                        )}
                      </td>
                      {(canUpdate || canDelete) && (
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            {canUpdate &&
                              (selectedUser?.id === user.id ? (
                                <>
                                  <button
                                    onClick={handleRoleChange}
                                    className="bg-blue-600 text-white px-1 py-1 rounded-md hover:bg-blue-700 transition duration-200 w-40"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setSelectedUser(null)}
                                    className="bg-gray-200 text-gray-700 px-1 py-1 rounded-md hover:bg-gray-300 transition duration-200 w-40"
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setSelectedRoleId(user.role || "");
                                    }}
                                    className="bg-blue-600 text-white px-1 py-1 rounded-md hover:bg-blue-700 transition duration-200 w-40"
                                  >
                                    Edit Role
                                  </button>
                                  <button
                                    onClick={() => navigate(`/editstaff/${user.id}`)}
                                    className="bg-blue-600 text-white px-1 py-1 rounded-md hover:bg-blue-700 transition duration-200 w-40"
                                  >
                                    Edit Staff
                                  </button>
                                </>
                              ))}
                            {canDelete && (
                              <button
                                onClick={() => {
                                  setUserToDelete(user);
                                  setIsDeleteModalOpen(true);
                                }}
                                className="bg-red-600 text-white px-1 py-1 rounded-md hover:bg-red-700 transition duration-200 w-40"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-4 py-3 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create User Modal */}
        {isCreateModalOpen && canCreate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New User</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter user name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter user email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter password (min 6 characters)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="text"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Domain</label>
                  <input
                    type="text"
                    value={newUser.domain}
                    onChange={(e) => setNewUser({ ...newUser, domain: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter domain"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateUser}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create User"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && canDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to permanently delete {userToDelete?.displayName || "this user"}?
                This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete Permanently"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}