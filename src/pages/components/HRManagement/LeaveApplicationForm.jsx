import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  FileText, 
  Upload, 
  Mail, 
  User, 
  Calculator,
  Send,
  Save,
  X
} from 'lucide-react';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from "../../../config/firebase";

const LeaveApplicationForm = () => {
  const [formData, setFormData] = useState({
    leaveType: '',
    leaveTypeId: '',
    startDate: '',
    endDate: '',
    duration: 'Full Day',
    customHours: '',
    reasonForLeave: '',
    supportingDocuments: null,
    teamEmail: '',
    totalDays: 0,
    balanceAfterApplication: 0,
    status: 'Pending'
  });

  const [leaveTypes, setLeaveTypes] = useState([]);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [totalLeaveQuota, setTotalLeaveQuota] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // Fetch current user
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
    } else {
      setError('No user is signed in');
    }
  }, []);

  // Fetch leave types from Firestore
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      setLoading(true);
      setError(null);
      try {
        const leaveTypesRef = collection(db, 'LeaveType');
        const q = query(leaveTypesRef, where('ActiveStatus', '==', true));
        const snapshot = await getDocs(q);
        const leaveTypesData = snapshot.docs
          .map(doc => ({
            id: doc.id,
            name: doc.data().LeaveTypeName,
            allowHalfDay: doc.data().AllowHalfDay,
            requiresSupportingDocs: doc.data().RequiresSupportingDocs
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setLeaveTypes(leaveTypesData);
      } catch (err) {
        setError('Failed to fetch leave types: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaveTypes();
  }, []);

  // Fetch leave policy and previous applications when leaveTypeId or userId changes
  useEffect(() => {
    const fetchLeavePolicyAndApplications = async () => {
      if (!formData.leaveTypeId || !userId) {
        setCurrentBalance(0);
        setTotalLeaveQuota(0);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // Fetch leave policy
        const policiesRef = collection(db, 'LeavePolicy');
        const policyQuery = query(policiesRef, where('LinkedLeaveTypes', 'array-contains', formData.leaveTypeId));
        const policySnapshot = await getDocs(policyQuery);
        const policy = policySnapshot.docs[0]?.data();
        const quota = policy?.MonthlyOrYearlyQuota || 0;
        setTotalLeaveQuota(quota);

        // Fetch previous leave applications for the selected leave type
        const leaveApplicationsRef = collection(db, 'LeaveApplication');
        const applicationQuery = query(
          leaveApplicationsRef,
          where('User_id', '==', userId),
          where('leaveTypeId', '==', formData.leaveTypeId),
          where('status', 'in', ['Pending', 'Approved'])
        );
        const applicationSnapshot = await getDocs(applicationQuery);
        const leaveApplications = applicationSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Calculate used leave days from previous applications
        const usedDays = leaveApplications.reduce((total, app) => total + (app.totalDays || 0), 0);

        // Set current balance as quota minus used days
        const balance = quota - usedDays;
        setCurrentBalance(balance < 0 ? 0 : balance);

        // Update formData balanceAfterApplication
        setFormData(prev => ({
          ...prev,
          balanceAfterApplication: balance - prev.totalDays
        }));
      } catch (err) {
        setError('Failed to fetch leave policy or applications: ' + err.message);
        setCurrentBalance(0);
        setTotalLeaveQuota(0);
      } finally {
        setLoading(false);
      }
    };
    fetchLeavePolicyAndApplications();
  }, [formData.leaveTypeId, userId]);

  // Calculate total days when dates or duration change
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start > end) {
        setErrors(prev => ({ ...prev, endDate: 'End date must be after start date' }));
        return;
      }
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      let totalDays = 0;
      if (formData.duration === 'Full Day') {
        totalDays = diffDays;
      } else if (formData.duration === 'Half Day') {
        totalDays = diffDays * 0.5;
      } else if (formData.duration === 'Custom Hours' && formData.customHours) {
        const hoursPerDay = 8;
        totalDays = (parseFloat(formData.customHours) / hoursPerDay) * diffDays;
      }

      setFormData(prev => ({
        ...prev,
        totalDays,
        balanceAfterApplication: currentBalance - totalDays
      }));
    }
  }, [formData.startDate, formData.endDate, formData.duration, formData.customHours, currentBalance]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'leaveType') {
      const selectedLeave = leaveTypes.find(type => type.name === value);
      setFormData(prev => ({
        ...prev,
        leaveType: value,
        leaveTypeId: selectedLeave ? selectedLeave.id : '',
        duration: selectedLeave?.allowHalfDay ? prev.duration : 'Full Day'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      supportingDocuments: file
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!userId) newErrors.user = 'User must be signed in';
    if (!formData.leaveType) newErrors.leaveType = 'Please select a leave type';
    if (!formData.startDate) newErrors.startDate = 'Please select start date';
    if (!formData.endDate) newErrors.endDate = 'Please select end date';
    if (!formData.reasonForLeave.trim()) newErrors.reasonForLeave = 'Please provide reason for leave';
    if (formData.duration === 'Custom Hours' && !formData.customHours) {
      newErrors.customHours = 'Please specify custom hours';
    }
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    if (formData.balanceAfterApplication < 0) {
      newErrors.leaveType = 'Insufficient leave balance';
    }
    const selectedLeave = leaveTypes.find(type => type.name === formData.leaveType);
    if (selectedLeave?.requiresSupportingDocs && !formData.supportingDocuments) {
      newErrors.supportingDocuments = 'Supporting documents are required for this leave type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const applicationData = {
        User_id: userId,
        leaveType: formData.leaveType,
        leaveTypeId: formData.leaveTypeId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        duration: formData.duration,
        customHours: formData.customHours || null,
        reasonForLeave: formData.reasonForLeave,
        supportingDocuments: formData.supportingDocuments ? formData.supportingDocuments.name : null,
        teamEmail: formData.teamEmail || null,
        totalDays: formData.totalDays,
        balanceAfterApplication: formData.balanceAfterApplication,
        status: formData.status,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'LeaveApplication'), applicationData);
      
      alert('Leave application submitted successfully!');
      setFormData({
        leaveType: '',
        leaveTypeId: '',
        startDate: '',
        endDate: '',
        duration: 'Full Day',
        customHours: '',
        reasonForLeave: '',
        supportingDocuments: null,
        teamEmail: '',
        totalDays: 0,
        balanceAfterApplication: 0,
        status: 'Pending'
      });
      setCurrentBalance(0);
      setTotalLeaveQuota(0);
      setErrors({});
    } catch (err) {
      setError('Failed to submit application: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!userId) {
      setError('User must be signed in to save draft');
      return;
    }

    try {

      const draftData = {
        User_id: userId,
        leaveType: formData.leaveType,
        leaveTypeId: formData.leaveTypeId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        duration: formData.duration,
        customHours: formData.customHours || null,
        reasonForLeave: formData.reasonForLeave,
        supportingDocuments: formData.supportingDocuments ? formData.supportingDocuments.name : null,
        teamEmail: formData.teamEmail || null,
        totalDays: formData.totalDays,
        balanceAfterApplication: formData.balanceAfterApplication,
        status: 'Draft',
        createdAt: new Date().toISOString()
      };
      await addDoc(collection(db, 'LeaveApplication'), draftData);
      alert('Draft saved successfully!');
    } catch (err) {
      setError('Failed to save draft: ' + err.message);
    }
  };

  const handleCancel = () => {
    setFormData({
      leaveType: '',
      leaveTypeId: '',
      startDate: '',
      endDate: '',
      duration: 'Full Day',
      customHours: '',
      reasonForLeave: '',
      supportingDocuments: null,
      teamEmail: '',
      totalDays: 0,
      balanceAfterApplication: 0,
      status: 'Pending'
    });
    setCurrentBalance(0);
    setTotalLeaveQuota(0);
    setErrors({});
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Draft':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen ml-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">Leave Application Form</h1>
        </div>
        <p className="text-gray-600">Submit your leave request with all required details</p>
        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Leave Type Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-indigo-600" />
            Leave Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Leave Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leave Type <span className="text-red-500">*</span>
              </label>
              <select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.leaveType ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              >
                <option value="">Select Leave Type</option>
                {leaveTypes.map(type => (
                  <option key={type.id} value={type.name}>
                    {type.name}
                  </option>
                ))}
              </select>
              {errors.leaveType && <p className="mt-1 text-sm text-red-600">{errors.leaveType}</p>}
              {loading && <p className="mt-1 text-sm text-gray-500">Loading leave types...</p>}
            </div>

            {/* Current Balance and Total Leave */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Balance
                </label>
                <div className="px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <div className="text-2xl font-bold text-indigo-600">
                    {currentBalance} days
                  </div>
                  <div className="text-sm text-gray-600">Available balance</div>
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Leave
                </label>
                <input
                  type="number"
                  value={totalLeaveQuota}
                  readOnly
                  className="w-full px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-lg text-2xl font-bold text-indigo-600"
                />
                <div className="text-sm text-gray-600 mt-1">Total leave quota</div>
              </div>
            </div>
          </div>
        </div>

        {/* Date and Duration Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-600" />
            Date & Duration
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.startDate ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.endDate ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
            </div>

            {/* Duration Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration Type <span className="text-red-500">*</span>
              </label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled={loading || !leaveTypes.find(type => type.name === formData.leaveType)?.allowHalfDay}
              >
                <option value="Full Day">Full Day</option>
                {leaveTypes.find(type => type.name === formData.leaveType)?.allowHalfDay && (
                  <>
                    <option value="Half Day">Half Day</option>
                    <option value="Custom Hours">Custom Hours</option>
                  </>
                )}
              </select>
            </div>

            {/* Custom Hours (conditional) */}
            {formData.duration === 'Custom Hours' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Hours <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="customHours"
                  value={formData.customHours}
                  onChange={handleInputChange}
                  placeholder="Enter hours"
                  min="0.5"
                  max="24"
                  step="0.5"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.customHours ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {errors.customHours && <p className="mt-1 text-sm text-red-600">{errors.customHours}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Reason and Documents Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-600" />
            Additional Information
          </h2>
          
          {/* Reason for Leave */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Leave <span className="text-red-500">*</span>
            </label>
            <textarea
              name="reasonForLeave"
              value={formData.reasonForLeave}
              onChange={handleInputChange}
              rows={4}
              placeholder="Please provide detailed reason for your leave request..."
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none ${
                errors.reasonForLeave ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {errors.reasonForLeave && <p className="mt-1 text-sm text-red-600">{errors.reasonForLeave}</p>}
          </div>

          {/* Supporting Documents */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supporting Documents
              {leaveTypes.find(type => type.name === formData.leaveType)?.requiresSupportingDocs && (
                <span className="text-red-500"> *</span>
              )}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="text-sm text-gray-600 mb-2">
                Upload medical certificates, travel documents, or other supporting files
              </div>
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                className="hidden"
                id="fileUpload"
                disabled={loading}
              />
              <label
                htmlFor="fileUpload"
                className={`cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Choose File
              </label>
              {formData.supportingDocuments && (
                <div className="mt-2 text-sm text-green-600">
                  ✓ {formData.supportingDocuments.name}
                </div>
              )}
            </div>
            {errors.supportingDocuments && (
              <p className="mt-1 text-sm text-red-600">{errors.supportingDocuments}</p>
            )}
          </div>

          {/* Team Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Email (Optional)
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                name="teamEmail"
                value={formData.teamEmail}
                onChange={handleInputChange}
                placeholder="team@company.com (for notifications)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Calculated Values Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-indigo-600" />
            Calculated Values
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Days */}
            <div className="bg-indigo-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {formData.totalDays ? formData.totalDays.toFixed(2) : '0.00'}
              </div>
              <div className="text-sm text-gray-600">Total Days</div>
            </div>

            {/* Balance After Application */}
            <div className={`rounded-lg p-4 text-center ${
              formData.balanceAfterApplication >= 0 ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <div className={`text-2xl font-bold ${
                formData.balanceAfterApplication >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formData.balanceAfterApplication ? formData.balanceAfterApplication.toFixed(2) : '0.00'}
              </div>
              <div className="text-sm text-gray-600">Balance After Application</div>
            </div>

            {/* Status */}
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(formData.status)}`}>
                <Clock className="h-4 w-4" />
                {formData.status}
              </span>
              <div className="text-sm text-gray-600 mt-2">Current Status</div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              disabled={loading || isSubmitting}
            >
              <Save className="h-5 w-5" />
              Save Draft
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              disabled={loading || isSubmitting}
            >
              <X className="h-5 w-5" />
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting || loading || !userId}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Submit Application
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveApplicationForm;