import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Users, Calendar, Building2, Clock, Shield } from 'lucide-react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, where } from 'firebase/firestore';
import { db } from "../../../../config/firebase";

const LeavePoliciesInterface = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    PolicyName: '',
    LinkedLeaveTypes: [],
    ApplicableForRoles: [],
    ApplicableForDepartments: [],
    MonthlyOrYearlyQuota: 24,
    ProbationEligibility: false,
    CarryForwardLimit: 5,
    AccrualPattern: 'Monthly',
    MaxLeaveAtOnce: 7
  });

  // Fetch data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch Leave Types
        const leaveTypesRef = collection(db, 'LeaveType');
        const leaveTypesSnapshot = await getDocs(query(leaveTypesRef, orderBy('LeaveTypeName')));
        const leaveTypesData = leaveTypesSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().LeaveTypeName,
          code: doc.data().Code,
          color: doc.data().ColorCode
        }));
        setLeaveTypes(leaveTypesData);

        // Fetch Roles (filtered by domain "Sales")
        const usersRef = collection(db, 'Users');
        const usersSnapshot = await getDocs(query(usersRef, orderBy('domain')));
        const rolesData = [...new Set(usersSnapshot.docs.map(doc => doc.data().domain))];
        setRoles(rolesData);

        // Fetch Departments (filtered by departmentName "Accounts & Finance")
        const departmentsRef = collection(db, 'Departments');
        const departmentsSnapshot = await getDocs(query(departmentsRef, orderBy('departmentName')));
        const departmentsData = departmentsSnapshot.docs.map(doc => doc.data().departmentName);
        setDepartments(departmentsData);

        // Fetch Policies
        const policiesRef = collection(db, 'LeavePolicy');
        const policiesSnapshot = await getDocs(query(policiesRef, orderBy('PolicyName')));
        const policiesData = policiesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPolicies(policiesData);
      } catch (err) {
        setError('Failed to fetch data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const resetForm = () => {
    setFormData({
      PolicyName: '',
      LinkedLeaveTypes: [],
      ApplicableForRoles: [],
      ApplicableForDepartments: [],
      MonthlyOrYearlyQuota: 24,
      ProbationEligibility: false,
      CarryForwardLimit: 5,
      AccrualPattern: 'Monthly',
      MaxLeaveAtOnce: 7
    });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!formData.PolicyName.trim()) {
      setError('Please enter a policy name');
      return;
    }
    
    if (formData.LinkedLeaveTypes.length === 0) {
      setError('Please select at least one leave type');
      return;
    }

    if (formData.ApplicableForRoles.length === 0 && formData.ApplicableForDepartments.length === 0) {
      setError('Please select applicable roles or departments');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (editingId) {
        // Update existing policy
        const policyRef = doc(db, 'LeavePolicy', editingId);
        await updateDoc(policyRef, formData);
        setPolicies(prev => prev.map(item =>
          item.id === editingId ? { ...formData, id: editingId } : item
        ));
      } else {
        // Add new policy
        const policyRef = await addDoc(collection(db, 'LeavePolicy'), formData);
        setPolicies(prev => [...prev, { ...formData, id: policyRef.id }]);
      }
      setIsFormOpen(false);
      resetForm();
    } catch (err) {
      setError('Failed to save policy: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (policy) => {
    setFormData({ ...policy });
    setEditingId(policy.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError(null);

    try {
      await deleteDoc(doc(db, 'LeavePolicy', id));
      setPolicies(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError('Failed to delete policy: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelect = (field, value, isChecked) => {
    setFormData(prev => ({
      ...prev,
      [field]: isChecked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const getLeaveTypeName = (id) => {
    const leaveType = leaveTypes.find(lt => lt.id === id);
    return leaveType ? leaveType.name : `Leave Type ${id}`;
  };

  const getLeaveTypeColor = (id) => {
    const leaveType = leaveTypes.find(lt => lt.id === id);
    return leaveType ? leaveType.color : '#6B7280';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Leave Policies Management</h1>
              <p className="text-gray-600 mt-1">Define rules for who can take how much leave and under what conditions</p>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              disabled={loading}
            >
              <Plus size={20} />
              Add Policy
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
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingId ? 'Edit Leave Policy' : 'Add New Leave Policy'}
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

              <div className="p-6 space-y-6">
                {/* Policy Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Policy Name *
                  </label>
                  <input
                    type="text"
                    value={formData.PolicyName}
                    onChange={(e) => handleInputChange('PolicyName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Standard Annual Policy, Intern Policy"
                    disabled={loading}
                  />
                </div>

                {/* Linked Leave Types */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Linked Leave Types *
                  </label>
                  {loading ? (
                    <p className="text-gray-500">Loading leave types...</p>
                  ) : leaveTypes.length === 0 ? (
                    <p className="text-gray-500">No leave types available</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {leaveTypes.map(leaveType => (
                        <label key={leaveType.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.LinkedLeaveTypes.includes(leaveType.id)}
                            onChange={(e) => handleMultiSelect('LinkedLeaveTypes', leaveType.id, e.target.checked)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            disabled={loading}
                          />
                          <div className="ml-3 flex items-center">
                            <div
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: leaveType.color }}
                            ></div>
                            <span className="text-sm text-gray-700">{leaveType.name}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Applicable For Roles */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Applicable For Roles
                  </label>
                  {loading ? (
                    <p className="text-gray-500">Loading roles...</p>
                  ) : roles.length === 0 ? (
                    <p className="text-gray-500">No roles available</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {roles.map(role => (
                        <label key={role} className="flex items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.ApplicableForRoles.includes(role)}
                            onChange={(e) => handleMultiSelect('ApplicableForRoles', role, e.target.checked)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            disabled={loading}
                          />
                          <span className="ml-2 text-sm text-gray-700">{role}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Applicable For Departments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Applicable For Departments
                  </label>
                  {loading ? (
                    <p className="text-gray-500">Loading departments...</p>
                  ) : departments.length === 0 ? (
                    <p className="text-gray-500">No departments available</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {departments.map(dept => (
                        <label key={dept} className="flex items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.ApplicableForDepartments.includes(dept)}
                            onChange={(e) => handleMultiSelect('ApplicableForDepartments', dept, e.target.checked)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            disabled={loading}
                          />
                          <span className="ml-2 text-sm text-gray-700">{dept}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quota and Limits */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yearly Quota *
                    </label>
                    <input
                      type="number"
                      value={formData.MonthlyOrYearlyQuota}
                      onChange={(e) => handleInputChange('MonthlyOrYearlyQuota', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      min="0"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Carry Forward Limit
                    </label>
                    <input
                      type="number"
                      value={formData.CarryForwardLimit}
                      onChange={(e) => handleInputChange('CarryForwardLimit', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      min="0"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Leave At Once
                    </label>
                    <input
                      type="number"
                      value={formData.MaxLeaveAtOnce}
                      onChange={(e) => handleInputChange('MaxLeaveAtOnce', parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      min="1"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Accrual Pattern
                    </label>
                    <select
                      value={formData.AccrualPattern}
                      onChange={(e) => handleInputChange('AccrualPattern', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      disabled={loading}
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Fixed">Fixed</option>
                    </select>
                  </div>
                </div>

                {/* Probation Eligibility */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.ProbationEligibility}
                      onChange={(e) => handleInputChange('ProbationEligibility', e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      disabled={loading}
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Allow employees on probation to use this policy
                    </span>
                  </label>
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
                    type="button"
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                    disabled={loading}
                  >
                    <Save size={16} />
                    {editingId ? 'Update' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Policies Grid */}
        <div className="grid gap-6">
          {loading && (
            <div className="text-center py-4">
              <p className="text-gray-500">Loading policies...</p>
            </div>
          )}

          {!loading && policies.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="text-gray-500">
                <Plus size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No leave policies found</h3>
                <p className="text-gray-500">Get started by creating your first leave policy.</p>
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                  disabled={loading}
                >
                  Add Policy
                </button>
              </div>
            </div>
          )}

          {!loading && policies.map((policy) => (
            <div key={policy.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Policy Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{policy.PolicyName}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>{policy.MonthlyOrYearlyQuota} days/year</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{policy.AccrualPattern}</span>
                      </div>
                      {policy.ProbationEligibility && (
                        <div className="flex items-center gap-1">
                          <Shield size={16} />
                          <span>Probation OK</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(policy)}
                      className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                      disabled={loading}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(policy.id)}
                      className="text-red-600 hover:text-red-900 p-1 rounded"
                      disabled={loading}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Policy Details */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Linked Leave Types */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        Linked Leave Types
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {policy.LinkedLeaveTypes.map(typeId => (
                          <span
                            key={typeId}
                            className="px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1"
                            style={{ 
                              backgroundColor: `${getLeaveTypeColor(typeId)}20`,
                              color: getLeaveTypeColor(typeId)
                            }}
                          >
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: getLeaveTypeColor(typeId) }}
                            ></div>
                            {getLeaveTypeName(typeId)}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Applicable Roles */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Users size={14} />
                        Applicable Roles
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {policy.ApplicableForRoles.length > 0 ? (
                          policy.ApplicableForRoles.map(role => (
                            <span
                              key={role}
                              className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                            >
                              {role}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500">No specific roles</span>
                        )}
                      </div>
                    </div>

                    {/* Applicable Departments */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Building2 size={14} />
                        Applicable Departments
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {policy.ApplicableForDepartments.length > 0 ? (
                          policy.ApplicableForDepartments.map(dept => (
                            <span
                              key={dept}
                              className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded"
                            >
                              {dept}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500">No specific departments</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {/* Policy Rules */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Policy Rules</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">Yearly Quota</span>
                          <span className="text-sm font-medium text-gray-900">{policy.MonthlyOrYearlyQuota} days</span>
                        </div>
                        
                        <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">Carry Forward Limit</span>
                          <span className="text-sm font-medium text-gray-900">{policy.CarryForwardLimit} days</span>
                        </div>
                        
                        <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">Max Leave at Once</span>
                          <span className="text-sm font-medium text-gray-900">{policy.MaxLeaveAtOnce} days</span>
                        </div>
                        
                        <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">Accrual Pattern</span>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            policy.AccrualPattern === 'Monthly' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {policy.AccrualPattern}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">Probation Eligibility</span>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            policy.ProbationEligibility 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {policy.ProbationEligibility ? 'Allowed' : 'Not Allowed'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeavePoliciesInterface;