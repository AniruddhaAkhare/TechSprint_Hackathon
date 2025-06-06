import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Eye, EyeOff } from 'lucide-react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from "../../../../config/firebase";

const LeaveTypesInterface = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    LeaveTypeName: '',
    Code: '',
    ColorCode: '#6366F1',
    LeaveCategory: 'Paid',
    RequiresSupportingDocs: false,
    AllowHalfDay: true,
    IsCarryForwardable: true,
    Encashable: false,
    ActiveStatus: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch leave types from Firestore on component mount
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      setLoading(true);
      try {
        const leaveTypesRef = collection(db, 'LeaveType');
        const q = query(leaveTypesRef, orderBy('LeaveTypeName'));
        const querySnapshot = await getDocs(q);
        const leaveTypesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setLeaveTypes(leaveTypesData);
      } catch (err) {
        setError('Failed to fetch leave types: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaveTypes();
  }, []);

  const resetForm = () => {
    setFormData({
      LeaveTypeName: '',
      Code: '',
      ColorCode: '#6366F1',
      LeaveCategory: 'Paid',
      RequiresSupportingDocs: false,
      AllowHalfDay: true,
      IsCarryForwardable: true,
      Encashable: false,
      ActiveStatus: true
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingId) {
        // Update existing leave type
        const leaveTypeRef = doc(db, 'LeaveType', editingId);
        await updateDoc(leaveTypeRef, formData);
        setLeaveTypes(prev => prev.map(item =>
          item.id === editingId ? { ...formData, id: editingId } : item
        ));
      } else {
        // Add new leave type
        const leaveTypeRef = await addDoc(collection(db, 'LeaveType'), formData);
        setLeaveTypes(prev => [...prev, { ...formData, id: leaveTypeRef.id }]);
      }
      setIsFormOpen(false);
      resetForm();
    } catch (err) {
      setError('Failed to save leave type: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (leaveType) => {
    setFormData({ ...leaveType });
    setEditingId(leaveType.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError(null);

    try {
      await deleteDoc(doc(db, 'LeaveType', id));
      setLeaveTypes(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError('Failed to delete leave type: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Leave Types Management</h1>
              <p className="text-gray-600 mt-1">Configure and manage different types of leaves available in your organization</p>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              disabled={loading}
            >
              <Plus size={20} />
              Add Leave Type
            </button>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingId ? 'Edit Leave Type' : 'Add New Leave Type'}
                  </h2>
                  <button
                    onClick={() => {
                      setIsFormOpen(false);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Leave Type Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Leave Type Name *
                    </label>
                    <input
                      type="text"
                      value={formData.LeaveTypeName}
                      onChange={(e) => handleInputChange('LeaveTypeName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., Personal Leave, Sick Leave"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Code *
                    </label>
                    <input
                      type="text"
                      value={formData.Code}
                      onChange={(e) => handleInputChange('Code', e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., PL, SL"
                      maxLength="5"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Color Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color Code
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.ColorCode}
                        onChange={(e) => handleInputChange('ColorCode', e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                        disabled={loading}
                      />
                      <input
                        type="text"
                        value={formData.ColorCode}
                        onChange={(e) => handleInputChange('ColorCode', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="#6366F1"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Leave Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Leave Category *
                    </label>
                    <select
                      value={formData.LeaveCategory}
                      onChange={(e) => handleInputChange('LeaveCategory', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      required
                      disabled={loading}
                    >
                      <option value="Paid">Paid</option>
                      <option value="Unpaid">Unpaid</option>
                      <option value="Optional">Optional</option>
                    </select>
                  </div>
                </div>

                {/* Boolean Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="requiresDocs"
                        checked={formData.RequiresSupportingDocs}
                        onChange={(e) => handleInputChange('RequiresSupportingDocs', e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        disabled={loading}
                      />
                      <label htmlFor="requiresDocs" className="ml-2 text-sm text-gray-700">
                        Requires Supporting Documents
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="allowHalfDay"
                        checked={formData.AllowHalfDay}
                        onChange={(e) => handleInputChange('AllowHalfDay', e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        disabled={loading}
                      />
                      <label htmlFor="allowHalfDay" className="ml-2 text-sm text-gray-700">
                        Allow Half Day
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="activeStatus"
                        checked={formData.ActiveStatus}
                        onChange={(e) => handleInputChange('ActiveStatus', e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        disabled={loading}
                      />
                      <label htmlFor="activeStatus" className="ml-2 text-sm text-gray-700">
                        Active Status
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="carryForward"
                        checked={formData.IsCarryForwardable}
                        onChange={(e) => handleInputChange('IsCarryForwardable', e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        disabled={loading}
                      />
                      <label htmlFor="carryForward" className="ml-2 text-sm text-gray-700">
                        Is Carry Forwardable
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="encashable"
                        checked={formData.Encashable}
                        onChange={(e) => handleInputChange('Encashable', e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        disabled={loading}
                      />
                      <label htmlFor="encashable" className="ml-2 text-sm text-gray-700">
                        Encashable
                      </label>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFormOpen(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                    disabled={loading}
                  >
                    <Save size={16} />
                    {editingId ? 'Update' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Leave Types Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Leave Types ({leaveTypes.length})</h2>
          </div>

          {loading && (
            <div className="text-center py-4">
              <p className="text-gray-500">Loading leave types...</p>
            </div>
          )}

          {!loading && leaveTypes.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <Plus size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No leave types found</h3>
                <p className="text-gray-500">Get started by adding your first leave type.</p>
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                  disabled={loading}
                >
                  Add Leave Type
                </button>
              </div>
            </div>
          )}

          {!loading && leaveTypes.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Leave Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Properties
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leaveTypes.map((leaveType) => (
                    <tr key={leaveType.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className="w-4 h-4 rounded-full mr-3 border border-gray-300"
                            style={{ backgroundColor: leaveType.ColorCode }}
                          ></div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {leaveType.LeaveTypeName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                          {leaveType.Code}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          leaveType.LeaveCategory === 'Paid' 
                            ? 'bg-green-100 text-green-800'
                            : leaveType.LeaveCategory === 'Unpaid'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {leaveType.LeaveCategory}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {leaveType.RequiresSupportingDocs && (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                              Docs Required
                            </span>
                          )}
                          {leaveType.AllowHalfDay && (
                            <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                              Half Day
                            </span>
                          )}
                          {leaveType.IsCarryForwardable && (
                            <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">
                              Carry Forward
                            </span>
                          )}
                          {leaveType.Encashable && (
                            <span className="px-2 py-1 text-xs bg-emerald-100 text-emerald-800 rounded">
                              Encashable
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {leaveType.ActiveStatus ? (
                            <Eye className="w-4 h-4 text-green-500 mr-1" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-gray-400 mr-1" />
                          )}
                          <span className={`text-sm ${
                            leaveType.ActiveStatus ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {leaveType.ActiveStatus ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(leaveType)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                            disabled={loading}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(leaveType.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            disabled={loading}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveTypesInterface;