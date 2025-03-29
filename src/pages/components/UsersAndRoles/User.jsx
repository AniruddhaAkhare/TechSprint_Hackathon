import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { db, auth } from '../../../config/firebase'; // Ensure auth is imported
import { collection, getDocs, doc, setDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';

export default function User() {
  const { user, rolePermissions } = useAuth();

  // Permission checks
  const canDisplay = rolePermissions.Users?.display || false;
  const canCreate = rolePermissions.Users?.create || false;
  const canUpdate = rolePermissions.Users?.update || false;
  const canDelete = rolePermissions.Users?.delete || false;

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [newUser, setNewUser] = useState({ uid: '', displayName: '', email: '', role: '' }); // Added uid
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [authUsers, setAuthUsers] = useState([]); // To store users for dropdown

  useEffect(() => {
    const fetchData = async () => {
      if (!canDisplay) return;

      try {
        // Fetch existing Users collection
        const usersSnapshot = await getDocs(collection(db, 'Users'));
        const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);
        setAuthUsers(usersData); // Use Users collection as source for dropdown

        // Fetch roles
        const rolesSnapshot = await getDocs(collection(db, 'roles'));
        const rolesData = rolesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRoles(rolesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [canDisplay]);

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
      await setDoc(doc(db, 'Users', selectedUser.id), { role: selectedRoleId }, { merge: true });
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, role: selectedRoleId } : u));
      setSelectedUser(null);
      setSelectedRoleId('');
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update role. Please try again.');
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.uid || !newUser.role) {
      alert('Please select a user and a role.');
      return;
    }
    if (!canCreate) {
      alert('You do not have permission to create users.');
      return;
    }
    try {
      // Check if user already exists in Users collection
      const existingUser = users.find(u => u.id === newUser.uid);
      if (existingUser) {
        alert('This user already exists in the database.');
        return;
      }

      const userData = {
        displayName: newUser.displayName,
        email: newUser.email,
        role: newUser.role,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'Users', newUser.uid), userData); // Use uid as document ID
      setUsers([...users, { id: newUser.uid, ...userData }]);
      setNewUser({ uid: '', displayName: '', email: '', role: '' });
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user. Please try again.');
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete || !canDelete) {
      if (!canDelete) alert('You do not have permission to delete users.');
      return;
    }
    try {
      await deleteDoc(doc(db, 'Users', userToDelete.id));
      setUsers(users.filter(u => u.id !== userToDelete.id));
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  const handleUserSelect = (uid) => {
    const selected = authUsers.find(u => u.id === uid);
    if (selected) {
      setNewUser({
        uid: selected.id,
        displayName: selected.displayName || '',
        email: selected.email || '',
        role: newUser.role, // Preserve role selection
      });
    }
  };

  if (!user) return <Navigate to="/login" />;
  if (!canDisplay) {
    return (
      <div className="p-4 text-red-600 text-center">
        Access Denied: You do not have permission to view users.
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
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
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-100">
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

        {/* Role Assignment */}
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

      {/* Create User Modal */}
      {isCreateModalOpen && canCreate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New User</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Select User</label>
                <select
                  value={newUser.uid}
                  onChange={(e) => handleUserSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select User</option>
                  {authUsers.map(authUser => (
                    <option key={authUser.id} value={authUser.id}>
                      {authUser.displayName || authUser.email || authUser.id}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={newUser.displayName}
                  onChange={(e) => setNewUser({ ...newUser, displayName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter user name"
                  disabled // Read-only, populated from selection
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
                  disabled // Read-only, populated from selection
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
              >
                Cancel
              </button>
              <button
                onClick={handleCreateUser}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
              >
                Create User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {isDeleteModalOpen && canDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {userToDelete?.displayName}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}