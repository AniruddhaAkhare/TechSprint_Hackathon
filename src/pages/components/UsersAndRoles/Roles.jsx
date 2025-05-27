import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { db } from '../../../config/firebase';
import { collection, getDocs, doc, setDoc, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from '@material-tailwind/react';

export default function Roles() {
  const { user, rolePermissions } = useAuth();
  const [roles, setRoles] = useState([]);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRolePermissions, setNewRolePermissions] = useState({
    instituteSetup: { create: false, update: false, display: false, delete: false },
    Users: { create: false, update: false, display: false, delete: false },
    Sessions: { create: false, update: false, display: false, delete: false },
    Course: { create: false, update: false, display: false, delete: false },
    curriculums: { create: false, update: false, display: false, delete: false },
    Batch: { create: false, update: false, display: false, delete: false },
    attendance: { create: false, update: false, display: false, delete: false },
    assignments: { create: false, update: false, display: false, delete: false },
    performance: { create: false, update: false, display: false, delete: false },
    student: { create: false, update: false, display: false, delete: false },
    enquiries: { create: false, update: false, display: false, delete: false },
    Instructor: { create: false, update: false, display: false, delete: false },
    roles: { create: false, update: false, display: false, delete: false },
    questions: { create: false, update: false, display: false, delete: false },
    fee: { create: false, update: false, display: false, delete: false },
    invoice: { create: false, update: false, display: false, delete: false },
    FinancePartner: { create: false, update: false, display: false, delete: false },
    Holidays: { create: false, update: false, display: false, delete: false },
    Leaves: { create: false, update: false, display: false, delete: false },
    JopOpenings: { create: false, update: false, display: false, delete: false },
    Companies: { create: false, update: false, display: false, delete: false },
    templates: { create: false, update: false, display: false, delete: false },
    invoices: { create: false, update: false, display: false, delete: false },
    activityLogs: { create: false, update: false, display: false, delete: false },
    enquiryForms: { create: false, update: false, display: false, delete: false },
  });
  const [editingRole, setEditingRole] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const canCreate = rolePermissions.roles?.create || false;
  const canUpdate = rolePermissions.roles?.update || false;
  const canDelete = rolePermissions.roles?.delete || false;
  const canDisplay = rolePermissions.roles?.display || false;

  useEffect(() => {
    const fetchRoles = async () => {
      if (!canDisplay) return;
      try {
        const rolesSnapshot = await getDocs(collection(db, 'roles'));
        const rolesData = rolesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRoles(rolesData);
      } catch (error) {
        //console.error('Error fetching roles:', error);
      }
    };
    fetchRoles();
  }, [canDisplay]);

  // Activity logging function
  const logActivity = async (action, details) => {
    if (!user) {
      //console.error("No current user available for logging");
      return;
    }
    try {
      const logRef = await addDoc(collection(db, "activityLogs"), {
        timestamp: serverTimestamp(),
        userId: user.uid,
        userEmail: user.email || 'Unknown',
        action,
        details,
      });
    } catch (err) {
    }
  };

  const handlePermissionChange = (section, action, permissions) => {
    if (editingRole) {
      setEditingRole(prev => ({
        ...prev,
        permissions: {
          ...prev.permissions,
          [section]: {
            ...prev.permissions[section],
            [action]: !prev.permissions[section][action],
          },
        },
      }));
    } else {
      setNewRolePermissions(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [action]: !prev[section][action],
        },
      }));
    }
  };

  const handleSelectAll = (section, permissions) => {
    const allSelected = Object.values(permissions[section]).every(val => val);
    const newSectionPermissions = {
      create: !allSelected,
      update: !allSelected,
      display: !allSelected,
      delete: !allSelected,
    };

    if (editingRole) {
      setEditingRole(prev => ({
        ...prev,
        permissions: {
          ...prev.permissions,
          [section]: newSectionPermissions,
        },
      }));
    } else {
      setNewRolePermissions(prev => ({
        ...prev,
        [section]: newSectionPermissions,
      }));
    }
  };

  const handleCreateRole = async () => {
    if (!canCreate) {
      alert('You do not have permission to create roles.');
      return;
    }
    if (!newRoleName.trim()) {
      alert('Please enter a role name.');
      return;
    }
    try {
      const newRole = { name: newRoleName, permissions: newRolePermissions, isDefault: false };
      const roleRef = await addDoc(collection(db, 'roles'), newRole);
      const newRoleId = roleRef.id;
      setRoles([...roles, { id: newRoleId, ...newRole }]);

      // Log the creation
      await logActivity("Created role", {
        roleId: newRoleId,
        name: newRoleName,
        permissions: newRolePermissions,
        isDefault: false,
      });

      setNewRoleName('');
      setNewRolePermissions({
        instituteSetup: { create: false, update: false, display: false, delete: false },
        Users: { create: false, update: false, display: false, delete: false },
        Sessions: { create: false, update: false, display: false, delete: false },
        Course: { create: false, update: false, display: false, delete: false },
        curriculums: { create: false, update: false, display: false, delete: false },
        Batch: { create: false, update: false, display: false, delete: false },
        attendance: { create: false, update: false, display: false, delete: false },
        assignments: { create: false, update: false, display: false, delete: false },
        performance: { create: false, update: false, display: false, delete: false },
        student: { create: false, update: false, display: false, delete: false },
        enquiries: { create: false, update: false, display: false, delete: false },
        Instructor: { create: false, update: false, display: false, delete: false },
        roles: { create: false, update: false, display: false, delete: false },
        questions: { create: false, update: false, display: false, delete: false },
        fee: { create: false, update: false, display: false, delete: false },
        invoice: { create: false, update: false, display: false, delete: false },
        FinancePartner: { create: false, update: false, display: false, delete: false },
        Holidays: { create: false, update: false, display: false, delete: false },
        Leaves: { create: false, update: false, display: false, delete: false },
        JopOpenings: { create: false, update: false, display: false, delete: false },
        Companies: { create: false, update: false, display: false, delete: false },
        templates: { create: false, update: false, display: false, delete: false },
        invoices: { create: false, update: false, display: false, delete: false },
        activityLogs: { create: false, update: false, display: false, delete: false },
        enquiryForms: { create: false, update: false, display: false, delete: false },
      });
      alert('Role created successfully!');
    } catch (error) {
      //console.error('Error creating role:', error);
      alert('Failed to create role.');
    }
  };

  const handleUpdateRole = async () => {
    if (!canUpdate) {
      alert('You do not have permission to update roles.');
      return;
    }
    if (!editingRole || !editingRole.id) {
      alert('No role selected for editing.');
      return;
    }
    if (editingRole.isDefault) {
      alert('Default roles cannot be updated.');
      return;
    }
    try {
      const roleDoc = doc(db, 'roles', editingRole.id);
      const oldRole = roles.find(r => r.id === editingRole.id);
      await setDoc(roleDoc, { permissions: editingRole.permissions }, { merge: true });
      setRoles(roles.map(r => (r.id === editingRole.id ? { ...r, permissions: editingRole.permissions } : r)));

      // Log the update
      await logActivity("Updated role", {
        roleId: editingRole.id,
        name: editingRole.name,
        changes: {
          oldPermissions: oldRole.permissions,
          newPermissions: editingRole.permissions,
        },
      });

      setEditingRole(null);
      setIsEditModalOpen(false);
      alert('Role updated successfully!');
    } catch (error) {
      //console.error('Error updating role:', error);
      alert('Failed to update role: ' + error.message);
    }
  };

  const handleDeleteRole = async () => {
    if (!deleteId || !canDelete) {
      if (!canDelete) alert('You do not have permission to delete roles.');
      return;
    }
    const roleToDelete = roles.find(r => r.id === deleteId);
    if (roleToDelete.isDefault) {
      alert('Default roles cannot be deleted.');
      setOpenDelete(false);
      return;
    }
    try {
      await deleteDoc(doc(db, 'roles', deleteId));

      // Log the deletion
      await logActivity("Deleted role", {
        roleId: deleteId,
        name: roleToDelete.name,
        permissions: roleToDelete.permissions,
        isDefault: roleToDelete.isDefault,
      });

      setRoles(roles.filter(r => r.id !== deleteId));
      setOpenDelete(false);
      alert('Role deleted successfully!');
    } catch (error) {
      //console.error('Error deleting role:', error);
      alert('Failed to delete role.');
    }
  };

  const startEditing = (role) => {
    if (!canUpdate) {
      alert('You do not have permission to edit roles.');
      return;
    }
    if (role.isDefault) {
      alert('Default roles cannot be edited.');
      return;
    }
    const fullPermissions = {
      ...newRolePermissions, // Default permissions
      ...role.permissions,   // Override with existing role permissions
    };
    setEditingRole({ ...role, permissions: fullPermissions });
    setIsEditModalOpen(true);
  };

  if (!user) return <Navigate to="/login" />;
  if (!canDisplay) {
    return (
      <div className="p-4 text-red-600 text-center">
        Access Denied: You do not have permission to view roles.
      </div>
    );
  }

  const permissionSections = Object.keys(newRolePermissions);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-4 fixed inset-0 left-[300px] overflow-y-scroll">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">Role Management</h1>
        {canCreate && (
          <button
            onClick={() => setNewRoleName('')} // Reset form
            className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition duration-200 w-full sm:w-auto"
          >
            + Create Role
          </button>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="rounded-lg shadow-md overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Sr No</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Role Name</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Default</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role, index) => (
                <tr key={role.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">{index + 1}</td>
                  <td className="px-4 py-3 text-gray-800">{role.name}</td>
                  <td className="px-4 py-3 text-gray-800">{role.isDefault ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {canUpdate && !role.isDefault && (
                        <button
                          onClick={() => startEditing(role)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                      )}
                      {canDelete && !role.isDefault && (
                        <button
                          onClick={() => {
                            setDeleteId(role.id);
                            setOpenDelete(true);
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
              {roles.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-4 py-3 text-center text-gray-500">
                    No roles found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {canCreate && newRoleName !== null && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Role</h2>
          <input
            type="text"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            placeholder="Enter role name"
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {permissionSections.map(section => (
              <div key={section} className="border-b pb-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-semibold text-gray-700 capitalize">{section}</h3>
                  <button
                    onClick={() => handleSelectAll(section, newRolePermissions)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {Object.values(newRolePermissions[section]).every(val => val) ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                <div className="flex flex-wrap gap-4 mt-2">
                  {['create', 'update', 'display', 'delete'].map(action => (
                    <label key={action} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newRolePermissions[section][action]}
                        onChange={() => handlePermissionChange(section, action, newRolePermissions)}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <span className="text-gray-600 capitalize">{action}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleCreateRole}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition duration-200"
          >
            Create Role
          </button>
        </div>
      )}

      {canUpdate && (
        <Dialog
          open={isEditModalOpen}
          handler={() => setIsEditModalOpen(false)}
          className="rounded-lg shadow-lg max-w-2xl"
        >
          <DialogHeader className="text-gray-800 font-semibold">
            Edit Role: {editingRole?.name || 'N/A'}
          </DialogHeader>
          <DialogBody className="space-y-4 max-h-96 overflow-y-auto">
            {editingRole ? (
              permissionSections.map(section => (
                <div key={section} className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-semibold text-gray-700 capitalize">{section}</h3>
                    <button
                      onClick={() => handleSelectAll(section, editingRole.permissions)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {Object.values(editingRole.permissions[section]).every(val => val) ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {['create', 'update', 'display', 'delete'].map(action => (
                      <label key={action} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={editingRole.permissions[section][action] || false}
                          onChange={() => handlePermissionChange(section, action, editingRole.permissions)}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <span className="text-gray-600 capitalize">{action}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No role selected</p>
            )}
          </DialogBody>
          <DialogFooter className="space-x-4">
            <Button
              variant="text"
              color="gray"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="filled"
              color="blue"
              onClick={handleUpdateRole}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </Dialog>
      )}

      {canDelete && (
        <Dialog
          open={openDelete}
          handler={() => setOpenDelete(false)}
          className="rounded-lg shadow-lg"
        >
          <DialogHeader className="text-gray-800 font-semibold">Confirm Deletion</DialogHeader>
          <DialogBody className="text-gray-600">
            Are you sure you want to delete this role? This action cannot be undone.
          </DialogBody>
          <DialogFooter className="space-x-4">
            <Button
              variant="text"
              color="gray"
              onClick={() => setOpenDelete(false)}
            >
              Cancel
            </Button>
            <Button
              variant="filled"
              color="red"
              onClick={handleDeleteRole}
            >
              Yes, Delete
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </div>
  );
}