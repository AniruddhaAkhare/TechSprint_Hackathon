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
  where,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "../../../context/AuthContext";
import { runTransaction } from "firebase/firestore";


export default function StaffAndUsers() {
  const navigate = useNavigate();
  const { user, rolePermissions } = useAuth();

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
    if (!canDisplay) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const usersQuery = query(usersCollectionRef);
        const usersSnapshot = await getDocs(usersQuery);
        const usersData = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);

        const rolesSnapshot = await getDocs(rolesCollectionRef);
        const rolesData = rolesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setRoles(rolesData);

        const instituteSnapshot = await getDocs(collection(db, "instituteSetup"));
        if (!instituteSnapshot.empty) {
          const instituteId = instituteSnapshot.docs[0].id;
          const centerQuery = query(
            collection(db, "Branch"),
            where("isActive", "==", true)
          );
          const centerData = await getDocs(centerQuery);
          setCenters(centerData.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [canDisplay]);

  // Activity Logging
  const logActivity = async (action, details) => {
    if (!user?.email) return;

    const activityLogRef = doc(db, "activityLogs", "logDocument");

    const logEntry = {
      action,
      details,
      timestamp: new Date().toISOString(),
      userEmail: user.email,
      userId: user.uid,
      section: "Staff",
      // adminId: adminId || "N/A",
    };

    try {
      await runTransaction(db, async (transaction) => {
        const logDoc = await transaction.get(activityLogRef);
        let logs = logDoc.exists() ? logDoc.data().logs || [] : [];

        // Ensure logs is an array and contains only valid data
        if (!Array.isArray(logs)) {
          logs = [];
        }

        // Append the new log entry
        logs.push(logEntry);

        // Trim to the last 1000 entries if necessary
        if (logs.length > 1000) {
          logs = logs.slice(-1000);
        }

        // Update the document with the new logs array
        transaction.set(activityLogRef, { logs }, { merge: true });
      });
      console.log("Activity logged successfully");
    } catch (error) {
      console.error("Error logging activity:", error);
      // toast.error("Failed to log activity");
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
        displayName: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone || "",
        domain: newUser.domain || "",
        created_at: new Date().toISOString(),
      };

      await setDoc(doc(db, "Users", authUser.uid), userData);

      await logActivity("User created", {
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
      console.error("Error creating user:", error);
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

      await logActivity("User role updated", {
        userId: selectedUser.id,
        userEmail: selectedUser.email,
        changes: { oldRole: oldRoleName, newRole: newRoleName },
      });

      setSelectedUser(null);
      setSelectedRoleId("");
    } catch (error) {
      console.error("Error updating role:", error);
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

      await logActivity("user deleted", {
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
      console.error("Error deleting user:", error);
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

  const handleVerifyEmail = async () => {
    const emailToCheck = newUser.email?.trim().toLowerCase();

    if (!emailToCheck) {
      alert("Please enter an email to verify.");
      return;
    }

    try {
      const usersRef = collection(db, "Users");
      const q = query(usersRef, where("email", "==", emailToCheck));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        alert("❌ Email already exists.");
      } else {
        alert("✅ Email is available.");
      }
    } catch (error) {
      console.error("Error checking email existence:", error);
      alert("Something went wrong while verifying email.");
    }
  };


  // Render Permission Error
  if (!canDisplay) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-red-600 text-lg font-medium">You do not have permission to view staff and users.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
            <p className="text-gray-500 mt-1">Total Staff: <span className="font-semibold text-indigo-600">{users.length}</span></p>
          </div>
          {canCreate && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Staff
            </button>
          )}
        </div>

        {/* Error and Loading */}
        {loading && (
          <div className="text-center py-10">
            <div className="inline-flex items-center justify-center p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
              <svg
                className="animate-spin h-8 w-8 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="ml-3 text-gray-600">Loading staff data...</span>
            </div>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 animate-fadeIn">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Search and Table */}
        {!loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">
            <div className="p-6 border-b border-gray-100">
              <div className="relative max-w-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
              <table className="w-full table-auto divide-y divide-gray-100">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    {["Name", "Email", "Phone", "Domain", "Role", (canUpdate || canDelete) && "Actions"].filter(Boolean).map((header) => (
                      <th
                        key={header}
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {users
                    .filter(
                      (user) =>
                        user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-medium">
                              {user.displayName?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {capitalizeFirstLetter(user.displayName) || "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {user.email || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {user.phone || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                            {user.domain || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {selectedUser?.id === user.id && canUpdate ? (
                            <div className="flex items-center gap-2">
                              <select
                                value={selectedRoleId}
                                onChange={(e) => setSelectedRoleId(e.target.value)}
                                className="px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                              >
                                <option value="">Select Role</option>
                                {roles.map((role) => (
                                  <option key={role.id} value={role.id}>
                                    {role.name}
                                  </option>
                                ))}
                              </select>
                              <button
                                onClick={handleRoleChange}
                                className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setSelectedUser(null)}
                                className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium">
                              {roles.find((r) => r.id === user.role)?.name || "N/A"}
                            </span>
                          )}
                        </td>
                        {(canUpdate || canDelete) && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <button
                                onClick={() => navigate(`/employee-profile/${user.id}`)}
                                className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded-lg transition-colors duration-200 flex items-center"
                                title="View"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                View
                              </button>
                              {canUpdate && (
                                <>
                                  <button
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setSelectedRoleId(user.role || "");
                                    }}
                                    className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-lg transition-colors duration-200 flex items-center"
                                    title="Edit Role"
                                  >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Role
                                  </button>
                                  <button
                                    onClick={() => navigate(`/editstaff/${user.id}`)}
                                    className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded-lg transition-colors duration-200 flex items-center"
                                    title="Edit"
                                  >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit
                                  </button>
                                </>
                              )}
                              {canDelete && (
                                <button
                                  onClick={() => {
                                    setUserToDelete(user);
                                    setIsDeleteModalOpen(true);
                                  }}
                                  className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-lg transition-colors duration-200 flex items-center"
                                  title="Delete"
                                >
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  {users.length === 0 && !loading && (
                    <tr>
                      <td colSpan={canUpdate || canDelete ? 6 : 5} className="px-6 py-8 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-lg">No users found</p>
                          {canCreate && (
                            <button
                              onClick={() => setIsCreateModalOpen(true)}
                              className="mt-4 flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                              </svg>
                              Add your first staff member
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Create User Modal */}
        {isCreateModalOpen && canCreate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 animate-fadeInUp">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">Add New User</h2>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Form Fields */}
              <div className="p-6 space-y-5">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="float-left text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email + Verify */}
                <div className="flex flex-col items-left">
                  <label htmlFor="email" className="float-left text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="flex gap-2">
                    <input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      placeholder="john@example.com"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyEmail}
                      className="px-3 text-sm text-indigo-600 border border-indigo-500 rounded-lg hover:bg-indigo-50 transition"
                    >
                      Verify
                    </button>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="float-left text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="Minimum 6 characters"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="float-left text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    id="phone"
                    type="tel"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="+91-XXXXXXXXXX"
                  />
                </div>

                {/* Domain */}
                <div>
                  <label htmlFor="domain" className="float-left text-sm font-medium text-gray-700 mb-1">Domain</label>
                  <input
                    id="domain"
                    type="text"
                    value={newUser.domain}
                    onChange={(e) => setNewUser({ ...newUser, domain: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="e.g. Education, Tech"
                  />
                </div>

                {/* Role */}
                <div>
                  <label htmlFor="role" className="float-left text-sm font-medium text-gray-700 mb-1">User Role</label>
                  <select
                    id="role"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100 flex justify-end space-x-3">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateUser}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium flex items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                      </svg>
                      Creating...
                    </>
                  ) : (
                    "Create User"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && canDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 animate-fadeInUp">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">Confirm Deletion</h2>
              </div>
              <div className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-600">
                      Are you sure you want to permanently delete{" "}
                      <span className="font-medium text-gray-900">{userToDelete?.displayName || "this user"}</span>? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Deleting...
                    </span>
                  ) : (
                    "Delete Permanently"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}