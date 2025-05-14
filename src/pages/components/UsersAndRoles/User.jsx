import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { db, auth } from '../../../config/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../../../context/AuthContext';

export default function User() {
  const { user: currentUser, rolePermissions } = useAuth();

  const canDisplay = rolePermissions.Users?.display || false;
  const canCreate = rolePermissions.Users?.create || false;
  const canUpdate = rolePermissions.Users?.update || false;
  const canDelete = rolePermissions.Users?.delete || false;

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: ''
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!canDisplay) return;

      try {
        setLoading(true);
        const usersSnapshot = await getDocs(collection(db, 'Users'));
        const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);

        const rolesSnapshot = await getDocs(collection(db, 'roles'));
        const rolesData = rolesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRoles(rolesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [canDisplay]);

  // Activity logging function
  const logActivity = async (action, details) => {
    if (!currentUser) {
      console.error("No current user available for logging");
      return;
    }
    try {
      const logRef = await addDoc(collection(db, "activityLogs"), {
        timestamp: serverTimestamp(),
        userId: currentUser.uid,
        userEmail: currentUser.email || 'Unknown',
        action,
        details,
      });
      console.log("Activity logged with ID:", logRef.id, { action, details });
    } catch (err) {
      console.error("Error logging activity:", err.message);
    }
  };

  const handleRoleChange = async () => {
    if (!selectedUser || !selectedRoleId) {
      alert('Please select a user and a role.');
      return;
    }
    if (!canUpdate) {
      alert('You do not have permission to update user roles.');
      return;
    }
    try {
      const oldRoleId = selectedUser.role;
      const newRoleName = roles.find(r => r.id === selectedRoleId)?.name || 'Unknown';
      const oldRoleName = roles.find(r => r.id === oldRoleId)?.name || 'Unknown';

      await setDoc(
        doc(db, 'Users', selectedUser.id),
        { role: selectedRoleId },
        { merge: true }
      );
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, role: selectedRoleId } : u));

      // Log the role change
      await logActivity("Updated user role", {
        userId: selectedUser.id,
        userEmail: selectedUser.email,
        changes: {
          oldRole: oldRoleName,
          newRole: newRoleName,
        },
      });

      setSelectedUser(null);
      setSelectedRoleId('');
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update role. Please try again.');
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.role) {
      alert('Please fill all fields.');
      return;
    }
    if (!canCreate) {
      alert('You do not have permission to create users.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newUser.email,
        newUser.password,
      );
      const authUser = userCredential.user;

      const userData = {
        displayName: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'Users', authUser.uid), userData);

      // Log the creation
      await logActivity("Created user", {
        userId: authUser.uid,
        email: newUser.email,
        name: newUser.name,
        role: roles.find(r => r.id === newUser.role)?.name || 'Unknown',
      });

      setUsers([...users, { id: authUser.uid, ...userData }]);
      setNewUser({ name: '', email: '', password: '', role: '' });
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating user:', error);
      setError(error.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete || !canDelete) {
      if (!canDelete) alert('You do not have permission to delete users.');
      return;
    }

    try {
      setLoading(true);

      await deleteDoc(doc(db, 'Users', userToDelete.id));

      // Log the deletion
      await logActivity("Deleted user", {
        userId: userToDelete.id,
        email: userToDelete.email,
        name: userToDelete.displayName || 'Unknown',
        role: roles.find(r => r.id === userToDelete.role)?.name || 'Unknown',
      });

      // Note: deleteUser requires the user to be signed in as the target user,
      // which isn't practical here. We'll skip auth deletion for now unless you have admin SDK.
      // For proper auth deletion, use Firebase Admin SDK on a server.
      try {
        // This will only work if the currentUser is the one being deleted, which is unlikely
        // await deleteUser(auth.currentUser); 
        console.warn("Skipping auth user deletion - requires Admin SDK or re-authentication.");
      } catch (authError) {
        console.warn('Could not delete auth user:', authError);
      }

      setUsers(users.filter(u => u.id !== userToDelete.id));
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      setError(error.message || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return <Navigate to="/login" />;
  if (!canDisplay) {
    return (
      <div className="p-4 text-red-600 text-center">
        Access Denied: You do not have permission to view users.
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 fixed inset-0 left-[300px]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Users and Roles</h1>
        {canCreate && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            + Add User
          </button>
        )}
      </div>

      {loading && <div className="text-center py-4">Loading...</div>}
      {error && <div className="text-red-600 text-center py-4">{error}</div>}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="w-full h-[50vh] overflow-y-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Email</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Role</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-800">{user.displayName || 'N/A'}</td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {roles.find(r => r.id === user.role)?.name || 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      {canUpdate && (
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit Role
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => {
                            setUserToDelete(user);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-4 py-3 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {selectedUser && canUpdate && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Assign Role to {selectedUser.displayName}
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <select
                value={selectedRoleId}
                onChange={(e) => setSelectedRoleId(e.target.value)}
                className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Role</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
              <button
                onClick={handleRoleChange}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
              >
                Assign Role
              </button>
            </div>
          </div>
        )}
      </div>

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
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Role</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
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
                {loading ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && canDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to permanently delete {userToDelete?.displayName}?
              This will remove the user from the database (authentication deletion requires Admin SDK).
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
                {loading ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}