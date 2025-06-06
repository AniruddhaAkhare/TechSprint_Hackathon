import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { db } from '../../../config/firebase';
import { collection, getDocs, doc, setDoc, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from '@material-tailwind/react';
import { runTransaction } from 'firebase/firestore';

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
    JobOpenings: { create: false, update: false, display: false, delete: false },
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
    if (!user?.email) {
      console.warn("No user email found, skipping activity log");
      return;
    }

    const activityLogRef = doc(db, "activityLogs", "logDocument");

    const logEntry = {
      action,
      details,
      timestamp: new Date().toISOString(),
      userEmail: user.email,
      userId: user.uid,
      section:"Roles",
      // adminId: adminId || "N/A",
    };

    try {
      await runTransaction(db, async (transaction) => {
        const logDoc = await transaction.get(activityLogRef);
        let logs = logDoc.exists() ? logDoc.data().logs || [] : [];

        if (!Array.isArray(logs)) {
          logs = [];
        }

        logs.push(logEntry);

        if (logs.length > 1000) {
          logs = logs.slice(-1000);
        }

        transaction.set(activityLogRef, { logs }, { merge: true });
      });
      console.log("Activity logged successfully:", action);
    } catch (error) {
      console.error("Error logging activity:", error);
      // toast.error("Failed to log activity");
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
        JobOpenings: { create: false, update: false, display: false, delete: false },
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
   <div className="flex flex-col min-h-screen bg-gray-100 p-6 fixed inset-0 left-[300px] overflow-y-auto">
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
    <h1 className="text-2xl font-bold text-[#333333] font-sans">Role Management</h1>
    {canCreate && (
      <button
        onClick={() => setNewRoleName('')}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
      >
        + Create Role
      </button>
    )}
  </div>

  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
    <div className="rounded-lg overflow-x-auto">
      <table className="w-full table-auto">
        <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sr No</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role Name</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Default</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
       <tbody>
  {roles.map((role, index) => (
    <tr key={role.id} className="border-b hover:bg-gray-50 transition-colors duration-150">
      <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
      <td className="px-6 py-4 text-sm font-medium text-gray-900">{role.name}</td>
      <td className="px-6 py-4 text-sm text-gray-900">{role.isDefault ? 'Yes' : 'No'}</td>
      <td className="px-6 py-4">
        <div className="flex gap-3">
          {canUpdate && !role.isDefault && (
            <button
              onClick={() => startEditing(role)}
              className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-md hover:bg-blue-200 transition duration-150"
            >
              ✏️ Edit
            </button>
          )}
          {canDelete && !role.isDefault && (
            <button
              onClick={() => {
                setDeleteId(role.id);
                setOpenDelete(true);
              }}
              className="inline-flex items-center px-3 py-1 bg-red-100 text-red-600 text-sm font-medium rounded-md hover:bg-red-200 transition duration-150"
            >
              🗑️ Delete
            </button>
          )}
        </div>
      </td>
    </tr>
  ))}
  {roles.length === 0 && (
    <tr>
      <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
        No roles found
      </td>
    </tr>
  )}
</tbody>

      </table>
    </div>
  </div>

  {canCreate && newRoleName !== null && (
    <div className="mt-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-5">Create New Role</h2>
      <input
        type="text"
        value={newRoleName}
        onChange={(e) => setNewRoleName(e.target.value)}
        placeholder="Enter role name"
        className="w-full max-w-md px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-200 text-gray-700"
      />
      <div className="space-y-5 max-h-96 overflow-y-auto mt-4">
        {permissionSections.map(section => (
          <div key={section} className="border-b border-gray-200 pb-3">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-semibold text-gray-800 capitalize">{section}</h3>
              <button
                onClick={() => handleSelectAll(section, newRolePermissions)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition duration-150"
              >
                {Object.values(newRolePermissions[section]).every(val => val) ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="flex flex-wrap gap-4 mt-3">
              {['create', 'update', 'display', 'delete'].map(action => (
                <label key={action} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newRolePermissions[section][action]}
                    onChange={() => handlePermissionChange(section, action, newRolePermissions)}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">{action}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
     <div className="flex justify-end mt-2">
  <button
    onClick={handleCreateRole}
    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
  >
    Create Role
  </button>
</div>

    </div>
  )}

  {canUpdate && (
    <Dialog
      open={isEditModalOpen}
      handler={() => setIsEditModalOpen(false)}
      className="rounded-xl shadow-xl max-w-2xl bg-white"
    >
      <DialogHeader className="text-gray-900 font-semibold text-lg px-6 py-4 border-b border-gray-200">
        Edit Role: {editingRole?.name || 'N/A'}
      </DialogHeader>
      <DialogBody className="space-y-5 max-h-96 overflow-y-auto px-6 py-4">
        {editingRole ? (
          permissionSections.map(section => (
            <div key={section} className="border-b border-gray-200 pb-3">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-semibold text-gray-800 capitalize">{section}</h3>
                <button
                  onClick={() => handleSelectAll(section, editingRole.permissions)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium transition duration-150"
                >
                  {Object.values(editingRole.permissions[section]).every(val => val) ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div className="flex flex-wrap gap-4 mt-3">
                {['create', 'update', 'display', 'delete'].map(action => (
                  <label key={action} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingRole.permissions[section][action] || false}
                      onChange={() => handlePermissionChange(section, action, editingRole.permissions)}
                      className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">{action}</span>
                  </label>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-600">No role selected</p>
        )}
      </DialogBody>
      <DialogFooter className="space-x-4 px-6 py-4 border-t border-gray-200">
        <Button
          variant="text"
          color="gray"
          onClick={() => setIsEditModalOpen(false)}
          className="text-gray-600 hover:text-gray-800 font-medium"
        >
          Cancel
        </Button>
        <Button
          variant="filled"
          color="blue"
          onClick={handleUpdateRole}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800"
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
      className="rounded-xl shadow-xl bg-white"
    >
      <DialogHeader className="text-gray-900 font-semibold text-lg px-6 py-4 border-b border-gray-200">
        Confirm Deletion
      </DialogHeader>
      <DialogBody className="text-sm text-gray-600 px-6 py-4">
        Are you sure you want to delete this role? This action cannot be undone.
      </DialogBody>
      <DialogFooter className="space-x-4 px-6 py-4 border-t border-gray-200">
        <Button
          variant="text"
          color="gray"
          onClick={() => setOpenDelete(false)}
          className="text-gray-600 hover:text-gray-800 font-medium"
        >
          Cancel
        </Button>
        <Button
          variant="filled"
          color="red"
          onClick={handleDeleteRole}
          className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-red-800"
        >
          Yes, Delete
        </Button>
      </DialogFooter>
    </Dialog>
  )}
</div>
  );
}