import React, { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../../config/firebase"; // Adjust path accordingly
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  Edit, 
  Save, 
  Trash2, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp, 
  User, 
  CreditCard, 
  Calendar,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  X,
  ArrowLeft,
  AlertTriangle,
  Eye,
  EyeOff,
  Copy,
  Check,
  Clock,
  DollarSign,
  FileText,
  Download
} from "lucide-react";

// Reusable Components

const Section = ({ title, icon, children, isOpen, onToggle }) => (
  <div className="bg-white rounded-xl shadow-sm border">
    <div 
      className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={onToggle}
    >
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
          {icon}
        </div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
    </div>
    {isOpen && (
      <div className="px-6 pb-6 border-t border-gray-100">
        <div className="pt-6">
          {children}
        </div>
      </div>
    )}
  </div>
);

const InputField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  disabled, 
  type = "text", 
  icon, 
  error, 
  required = false,
  placeholder
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          {icon}
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`block w-full ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
          disabled 
            ? 'bg-gray-50 text-gray-500 cursor-not-allowed' 
            : 'bg-white text-gray-900'
        } ${error ? 'border-red-300' : 'border-gray-300'}`}
      />
    </div>
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
);

const SelectField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  disabled, 
  options, 
  required = false 
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={value || ""}
      onChange={onChange}
      disabled={disabled}
      className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
        disabled 
          ? 'bg-gray-50 text-gray-500 cursor-not-allowed' 
          : 'bg-white text-gray-900'
      } border-gray-300`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, enrollmentName }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Delete Enrollment</h3>
        </div>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete the enrollment for <strong>{enrollmentName}</strong>? 
          This action cannot be undone.
        </p>
        <div className="flex space-x-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component

const EnrollmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enrollment, setEnrollment] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [openSections, setOpenSections] = useState({
    personal: true,
    education: true,
    career: true,
    finance: true,
  });
  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchEnrollment = async () => {
      try {
        const docRef = doc(db, "enrollments", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setEnrollment(data);
          setFormData(data);
        } else {
          toast.error("Enrollment not found.");
        }
      } catch (error) {
        console.error("Error fetching enrollment:", error);
        toast.error("Failed to load enrollment.");
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollment();
  }, [id]);

  useEffect(() => {
    if (enrollment) {
      const hasChanges = JSON.stringify(formData) !== JSON.stringify(enrollment);
      setHasChanges(hasChanges);
    }
  }, [formData, enrollment]);

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    switch (name) {
      case 'email':
        if (value && !/\S+@\S+\.\S+/.test(value)) {
          newErrors.email = 'Invalid email format';
        } else {
          delete newErrors.email;
        }
        break;
      case 'phone':
        if (value && !/^\d{10}$/.test(value.replace(/\D/g, ''))) {
          newErrors.phone = 'Phone number must be 10 digits';
        } else {
          delete newErrors.phone;
        }
        break;
      case 'pincode':
        if (value && !/^\d{6}$/.test(value)) {
          newErrors.pincode = 'Pincode must be 6 digits';
        } else {
          delete newErrors.pincode;
        }
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const handleChange = (e, parentKey = null) => {
    const { name, value } = e.target;
    validateField(name, value);
    if (parentKey) {
      setFormData((prev) => ({
        ...prev,
        [parentKey]: {
          ...prev[parentKey],
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (index, key, value, arrayPath) => {
    const keys = arrayPath.split(".");
    let target = formData;
    for (let i = 0; i < keys.length - 1; i++) {
      target = target[keys[i]];
    }
    const newArray = [...(target || [])];
    newArray[index] = { ...newArray[index], [key]: value };
    const newFormData = { ...formData };
    let ref = newFormData;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!ref[keys[i]]) ref[keys[i]] = {};
      ref = ref[keys[i]];
    }
    ref[keys[keys.length - 1]] = newArray;
    setFormData(newFormData);
  };

  const handleUpdate = async () => {
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix validation errors before saving.");
      return;
    }
    setSaving(true);
    try {
      await updateDoc(doc(db, "enrollments", id), {
        ...formData,
        updatedAt: new Date(),
      });
      toast.success("Enrollment updated successfully.");
      setEditing(false);
      setEnrollment(formData);
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error("Failed to update enrollment.");
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async () => {
    try {
      await updateDoc(doc(db, "enrollments", id), { 
        status: "approved",
        approvedAt: new Date(),
      });
      setFormData(prev => ({ ...prev, status: "approved" }));
      toast.success("Application approved successfully.");
    } catch (error) {
      console.error("Approval failed:", error);
      toast.error("Failed to approve application.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "enrollments", id));
      toast.success("Enrollment deleted successfully.");
      navigate("/studentdetails");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete enrollment.");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard!");
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const calculateTotalFee = () => {
    if (!formData.financeDetails) return 0;
    const downPayment = parseFloat(formData.financeDetails.downPayment || 0);
    const installments = formData.financeDetails.installmentDetails?.reduce((sum, inst) => 
      sum + parseFloat(inst.dueAmount || 0), 0) || 0;
    return downPayment + installments;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading enrollment details...</p>
        </div>
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Enrollment Not Found</h2>
          <p className="text-gray-600 mb-4">The enrollment you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/studentdetails")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Back to Enrollments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-[75vw] ml-[20%] bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/studentdetails")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {formData.displayName || 'Enrollment Details'}
                </h1>
                <p className="text-sm text-gray-500">ID: {id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(formData.status)}`}>
                {formData.status || 'Pending'}
              </span>
              {hasChanges && editing && (
                <span className="flex items-center text-sm text-amber-600">
                  <Clock className="w-4 h-4 mr-1" />
                  Unsaved changes
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">{formData.displayName}</h3>
                <p className="text-sm text-gray-500 flex items-center justify-center mt-1">
                  <Mail className="w-4 h-4 mr-1" />
                  {formData.email}
                  <button
                    onClick={() => copyToClipboard(formData.email)}
                    className="ml-2 p-1 hover:bg-gray-100 rounded"
                  >
                    {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </p>
              </div>

              {/* Quick Stats */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Career Track:</span>
                  <span className="font-medium">{formData.careerTrack || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mode:</span>
                  <span className="font-medium">{formData.mode || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Fee:</span>
                  <span className="font-medium text-green-600">₹{calculateTotalFee().toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-2">
                {editing ? (
                  <>
                    <button
                      onClick={handleUpdate}
                      disabled={saving || Object.keys(errors).length > 0}
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      {saving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Save size={16} />
                      )}
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setFormData(enrollment);
                        setErrors({});
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Edit size={16} />
                    Edit Details
                  </button>
                )}
                {formData.status !== 'approved' && (
                  <button
                    onClick={handleApprove}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <CheckCircle size={16} />
                    Approve
                  </button>
                )}
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Personal Information */}
              <Section
                title="Personal Information"
                icon={<User className="w-5 h-5" />}
                isOpen={openSections.personal}
                onToggle={() => setOpenSections(prev => ({ ...prev, personal: !prev.personal }))}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Full Name"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    disabled={!editing}
                    icon={<User className="w-4 h-4" />}
                    required
                  />
                  <InputField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!editing}
                    icon={<Mail className="w-4 h-4" />}
                    error={errors.email}
                    required
                  />
                  <InputField
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!editing}
                    icon={<Phone className="w-4 h-4" />}
                    error={errors.phone}
                    required
                  />
                  <InputField
                    label="Date of Birth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    disabled={!editing}
                    icon={<Calendar className="w-4 h-4" />}
                  />
                  <SelectField
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    disabled={!editing}
                    options={[
                      { value: '', label: 'Select Gender' },
                      { value: 'male', label: 'Male' },
                      { value: 'female', label: 'Female' },
                      { value: 'other', label: 'Other' }
                    ]}
                  />
                  <div></div>
                  <InputField
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={!editing}
                    icon={<MapPin className="w-4 h-4" />}
                  />
                  <InputField
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    disabled={!editing}
                    icon={<MapPin className="w-4 h-4" />}
                  />
                  <InputField
                    label="Pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    disabled={!editing}
                    icon={<MapPin className="w-4 h-4" />}
                    error={errors.pincode}
                  />
                </div>
              </Section>

              {/* Education Details */}
              <Section
                title="Education Details"
                icon={<GraduationCap className="w-5 h-5" />}
                isOpen={openSections.education}
                onToggle={() => setOpenSections(prev => ({ ...prev, education: !prev.education }))}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Qualification"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    disabled={!editing}
                    icon={<GraduationCap className="w-4 h-4" />}
                  />
                  <InputField
                    label="Graduation Year"
                    name="graduationYear"
                    type="number"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    disabled={!editing}
                    icon={<Calendar className="w-4 h-4" />}
                  />
                  <div className="md:col-span-2">
                    <InputField
                      label="University"
                      name="university"
                      value={formData.university}
                      onChange={handleChange}
                      disabled={!editing}
                      icon={<GraduationCap className="w-4 h-4" />}
                    />
                  </div>
                </div>
              </Section>

              {/* Career Information */}
              <Section
                title="Career Information"
                icon={<Briefcase className="w-5 h-5" />}
                isOpen={openSections.career}
                onToggle={() => setOpenSections(prev => ({ ...prev, career: !prev.career }))}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SelectField
                    label="Current Status"
                    name="currentStatus"
                    value={formData.currentStatus}
                    onChange={handleChange}
                    disabled={!editing}
                    options={[
                      { value: '', label: 'Select Status' },
                      { value: 'student', label: 'Student' },
                      { value: 'employed', label: 'Employed' },
                      { value: 'unemployed', label: 'Unemployed' },
                      { value: 'freelancer', label: 'Freelancer' }
                    ]}
                  />
                  <InputField
                    label="Job Role"
                    name="jobRole"
                    value={formData.jobRole}
                    onChange={handleChange}
                    disabled={!editing}
                    icon={<Briefcase className="w-4 h-4" />}
                  />
                  <InputField
                    label="Experience (Years)"
                    name="experience"
                    type="number"
                    value={formData.experience}
                    onChange={handleChange}
                    disabled={!editing}
                    icon={<Briefcase className="w-4 h-4" />}
                  />
                  <InputField
                    label="Career Track"
                    name="careerTrack"
                    value={formData.careerTrack}
                    onChange={handleChange}
                    disabled={!editing}
                    icon={<Briefcase className="w-4 h-4" />}
                  />
                  <SelectField
                    label="Batch Preference"
                    name="batchPreference"
                    value={formData.batchPreference}
                    onChange={handleChange}
                    disabled={!editing}
                    options={[
                      { value: '', label: 'Select Batch' },
                      { value: 'morning', label: 'Morning' },
                      { value: 'afternoon', label: 'Afternoon' },
                      { value: 'evening', label: 'Evening' },
                      { value: 'weekend', label: 'Weekend' }
                    ]}
                  />
                  <SelectField
                    label="Mode"
                    name="mode"
                    value={formData.mode}
                    onChange={handleChange}
                    disabled={!editing}
                    options={[
                      { value: '', label: 'Select Mode' },
                      { value: 'online', label: 'Online' },
                      { value: 'offline', label: 'Offline' },
                      { value: 'hybrid', label: 'Hybrid' }
                    ]}
                  />
                </div>
              </Section>

              {/* Finance Details */}
              <Section
                title="Finance Details"
                icon={<CreditCard className="w-5 h-5" />}
                isOpen={openSections.finance}
                onToggle={() => setOpenSections(prev => ({ ...prev, finance: !prev.finance }))}
              >
                <div className="space-y-6">
                  {/* Basic Finance Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Fee Template"
                      name="feeTemplate"
                      value={formData.feeTemplate}
                      onChange={handleChange}
                      disabled={!editing}
                      icon={<FileText className="w-4 h-4" />}
                    />
                    <InputField
                      label="Applicant Name"
                      name="applicantName"
                      value={formData.financeDetails?.applicantName || ""}
                      onChange={(e) => handleChange(e, "financeDetails")}
                      disabled={!editing}
                      icon={<User className="w-4 h-4" />}
                    />
                    <InputField
                      label="Contact Person"
                      name="contactPerson"
                      value={formData.financeDetails?.contactPerson || ""}
                      onChange={(e) => handleChange(e, "financeDetails")}
                      disabled={!editing}
                      icon={<User className="w-4 h-4" />}
                    />
                    <InputField
                      label="Relationship"
                      name="relationship"
                      value={formData.financeDetails?.relationship || ""}
                      onChange={(e) => handleChange(e, "financeDetails")}
                      disabled={!editing}
                      icon={<User className="w-4 h-4" />}
                    />
                  </div>

                  {/* Discount Section */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-800 mb-4 flex items-center">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Discount Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <SelectField
                        label="Discount Type"
                        name="discountType"
                        value={formData.financeDetails?.discountType || ''}
                        onChange={(e) => handleChange(e, "financeDetails")}
                        disabled={!editing}
                        options={[
                          { value: '', label: 'Select Discount Type' },
                          { value: 'percentage', label: 'Percentage' },
                          { value: 'fixed', label: 'Fixed Amount' }
                        ]}
                      />
                      <InputField
                        label="Discount Reason"
                        name="discountReason"
                        value={formData.financeDetails?.discountReason || ''}
                        onChange={(e) => handleChange(e, "financeDetails")}
                        disabled={!editing}
                      />
                      <InputField
                        label="Discount Value"
                        name="discountValue"
                        type="number"
                        value={formData.financeDetails?.discountValue || ''}
                        onChange={(e) => handleChange(e, "financeDetails")}
                        disabled={!editing}
                      />
                      <InputField
                        label="Fee After Discount"
                        name="feeAfterDiscount"
                        type="number"
                        value={formData.financeDetails?.feeAfterDiscount || ''}
                        onChange={(e) => handleChange(e, "financeDetails")}
                        disabled={!editing}
                      />
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Down Payment"
                      name="downPayment"
                      type="number"
                      value={formData.financeDetails?.downPayment || ''}
                      onChange={(e) => handleChange(e, "financeDetails")}
                      disabled={!editing}
                      icon={<DollarSign className="w-4 h-4" />}
                    />
                    <InputField
                      label="Down Payment Date"
                      name="downPaymentDate"
                      type="date"
                      value={formData.financeDetails?.downPaymentDate || ''}
                      onChange={(e) => handleChange(e, "financeDetails")}
                      disabled={!editing}
                      icon={<Calendar className="w-4 h-4" />}
                    />
                  </div>

                  {/* Installment Details */}
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-800 mb-4">Installment Details</h4>
                    {formData.financeDetails?.installmentDetails?.map((inst, idx) => (
                      <div key={idx} className="border p-4 rounded-lg mb-4">
                        <h5 className="font-semibold mb-2">Installment {idx + 1}</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InputField
                            label="Number"
                            name="number"
                            type="number"
                            value={inst.number || ''}
                            onChange={(e) => handleArrayChange(idx, "number", e.target.value, "financeDetails.installmentDetails")}
                            disabled={!editing}
                          />
                          <InputField
                            label="Due Amount"
                            name="dueAmount"
                            type="number"
                            value={inst.dueAmount || ''}
                            onChange={(e) => handleArrayChange(idx, "dueAmount", e.target.value, "financeDetails.installmentDetails")}
                            disabled={!editing}
                          />
                          <InputField
                            label="Due Date"
                            name="dueDate"
                            type="date"
                            value={inst.dueDate || ''}
                            onChange={(e) => handleArrayChange(idx, "dueDate", e.target.value, "financeDetails.installmentDetails")}
                            disabled={!editing}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Section>
            </div>
          </div>
        </div>
      </div>
      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        enrollmentName={formData.displayName}
      />
    </div>
  );
};

export default EnrollmentDetails;