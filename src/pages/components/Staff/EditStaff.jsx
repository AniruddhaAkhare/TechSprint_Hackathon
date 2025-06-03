import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteDoc, collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Timestamp } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../context/AuthContext";
import { Upload } from "@aws-sdk/lib-storage";
import { s3Client } from "../../../config/aws-config";

export default function EditStaff() {
  const { staffId } = useParams();
  const navigate = useNavigate();
  const { currentUser, rolePermissions } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});

  // Permissions
  const canDisplay = rolePermissions?.Users?.display || false;
  const canUpdate = rolePermissions?.Users?.update || false;
  const canDelete = rolePermissions?.Users?.delete || false;

  // Staff state
  const [staff, setStaff] = useState({
    displayName: "",
    email: "",
    phone: "",
    address: { street: "", area: "", city: "", state: "", zip: "", country: "" },
    date_of_birth: "",
    joining_date: "",
    exit_date: "",
    education_details: [],
    experience_details: [],
    emergency_details: { name: "", phone: "", email: "", relation: "", occupation: "" },
    domain: "",
    role: "",
    staff: {
      aadharCard: [],
      panCard: [],
      addressProof: [],
      tenthMarksheet: [],
      twelfthMarksheet: [],
      graduationMarksheet: [],
      pgMarksheet: [],
      offerLetter1: [],
      offerLetter2: [],
      experienceLetter1: [],
      experienceLetter2: [],
      salaryProof: [],
      parentSpouseAadhar: [],
      passportPhoto: [],
    },
  });
  const [countryCode, setCountryCode] = useState("+91");
  const [emergencyCountryCode, setEmergencyCountryCode] = useState("+91");

  // Document types
  const documentTypes = [
    { key: 'aadharCard', label: 'Aadhar Card' },
    { key: 'panCard', label: 'PAN Card' },
    { key: 'addressProof', label: 'Address Proof' },
    { key: 'tenthMarksheet', label: '10th Marksheet' },
    { key: 'twelfthMarksheet', label: '12th Marksheet' },
    { key: 'graduationMarksheet', label: 'Graduation Marksheet' },
    { key: 'pgMarksheet', label: 'PG Marksheet' },
    { key: 'offerLetter1', label: 'Last Offer Letter 1' },
    { key: 'offerLetter2', label: 'Last Offer Letter 2' },
    { key: 'experienceLetter1', label: 'Last Experience Letter 1' },
    { key: 'experienceLetter2', label: 'Last Experience Letter 2' },
    { key: 'salaryProof', label: 'Salary Proof' },
    { key: 'parentSpouseAadhar', label: 'Parent/Spouse Aadhar Card' },
    { key: 'passportPhoto', label: 'Passport Size Photo' },
  ];

  // File input refs
  const fileInputRefs = documentTypes.reduce((acc, doc) => {
    acc[doc.key] = useRef(null);
    return acc;
  }, {});

  // Country codes
  const countryCodes = [
    { key: "canada-+1", code: "+1", label: "Canada (+1)" },
    { key: "russia-+7", code: "+7", label: "Russia (+7)" },
    { key: "egypt-+20", code: "+20", label: "Egypt (+20)" },
    { key: "southafrica-+27", code: "+27", label: "South Africa (+27)" },
    { key: "greece-+30", code: "+30", label: "Greece (+30)" },
    { key: "netherlands-+31", code: "+31", label: "Netherlands (+31)" },
    { key: "belgium-+32", code: "+32", label: "Belgium (+32)" },
    { key: "india-+91", code: "+91", label: "India (+91)" },
  ];

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
        timestamp: Timestamp.now(),
        action,
        details: { staffId, ...details },
      };
      await addDoc(collection(db, "activityLogs"), logData);
    } catch (error) {
      //console.error("Error logging activity:", error);
    }
  };

  // Fetch Staff and Roles
  useEffect(() => {
    if (!canDisplay) {
      toast.error("You do not have permission to view this page");
      navigate("/unauthorized");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch roles
        const rolesSnapshot = await getDocs(collection(db, "roles"));
        const rolesData = rolesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setRoles(rolesData);

        // Fetch staff
        const staffRef = doc(db, "Users", staffId);
        const staffSnap = await getDoc(staffRef);
        if (staffSnap.exists()) {
          const data = staffSnap.data();
          const staffPhone = data.phone || "";
          const emergencyPhone = data.emergency_details?.phone || "";
          setStaff({
            displayName: data.displayName || "",
            email: data.email || "",
            phone: staffPhone.startsWith("+") ? staffPhone.slice(staffPhone.indexOf("+") + 3) : staffPhone,
            address: data.address || { street: "", area: "", city: "", state: "", zip: "", country: "" },
            date_of_birth: data.date_of_birth || "",
            joining_date: data.joining_date ? data.joining_date.toDate().toISOString().split("T")[0] : "",
            exit_date: data.exit_date ? data.exit_date.toDate().toISOString().split("T")[0] : "",
            education_details: data.education_details || [],
            experience_details: data.experience_details || [],
            domain: data.domain || "",
            role: data.role || "",
            emergency_details: {
              name: data.emergency_details?.name || "",
              phone: emergencyPhone.startsWith("+") ? emergencyPhone.slice(emergencyPhone.indexOf("+") + 3) : emergencyPhone,
              email: data.emergency_details?.email || "",
              relation: data.emergency_details?.relation || "",
              occupation: data.emergency_details?.occupation || "",
            },
            staff: data.staff || {
              aadharCard: [],
              panCard: [],
              addressProof: [],
              tenthMarksheet: [],
              twelfthMarksheet: [],
              graduationMarksheet: [],
              pgMarksheet: [],
              offerLetter1: [],
              offerLetter2: [],
              experienceLetter1: [],
              experienceLetter2: [],
              salaryProof: [],
              parentSpouseAadhar: [],
              passportPhoto: [],
            },
          });
          setCountryCode(staffPhone.startsWith("+") ? staffPhone.slice(0, staffPhone.indexOf("+") + 3) : "+91");
          setEmergencyCountryCode(emergencyPhone.startsWith("+") ? emergencyPhone.slice(0, emergencyPhone.indexOf("+") + 3) : "+91");
          setTimeout(() => setIsOpen(true), 10);
        } else {
          toast.error("Staff not found");
          navigate("/staff");
        }
      } catch (error) {
        //console.error("Error fetching data:", error);
        toast.error("Failed to fetch staff or roles data");
      }
    };

    fetchData();
  }, [staffId, canDisplay, navigate]);

  // S3 Upload
  const uploadFileToS3 = async (file, docType, staffId) => {
    const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
    const region = import.meta.env.VITE_AWS_REGION;

    if (!bucketName || !region) {
      throw new Error("Missing S3 configuration: VITE_S3_BUCKET_NAME or VITE_AWS_REGION");
    }

    if (!file || !(file instanceof File)) {
      throw new Error(`Invalid file for ${docType}: File object is null or not a File instance`);
    }



    const fileName = `staff/${staffId}/${docType}_${Date.now()}_${file.name}`;
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: file,
      ContentType: file.type,
    };

    try {
      const upload = new Upload({
        client: s3Client,
        params,
        queueSize: 4,
        partSize: 5 * 1024 * 1024,
      });

      upload.on("httpUploadProgress", (progress) => {
        const percent = Math.round((progress.loaded / progress.total) * 100);
        setUploadProgress((prev) => ({ ...prev, [docType]: percent }));
      });

      await upload.done();

      const url = `https://${params.Bucket}.s3.${region}.amazonaws.com/${params.Key}`;
      return url;
    } catch (err) {
      //console.error(`Error uploading ${docType}:`, err);
      throw err;
    }
  };

  // Document Handling
  const getFileNameFromUrl = (url) => {
    if (!url) return "No file uploaded";
    const parts = url.split("/");
    return parts[parts.length - 1].split("_").slice(2).join("_") || "Unknown file";
  };

  const handleDocumentEdit = async (docType, file) => {
    if (!canUpdate) {
      toast.error("You do not have permission to update staff documents");
      return;
    }

    if (!file) {
      toast.error("No file selected");
      return;
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error(`Invalid file type for ${file.name}. Allowed types: PDF, JPEG, PNG.`);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(`File ${file.name} is too large. Maximum size is 5MB.`);
      return;
    }

    try {
      const url = await uploadFileToS3(file, docType, staffId);
      const staffRef = doc(db, "Users", staffId);
      const currentDocs = staff.staff[docType] || [];
      const updatedDocs = [...currentDocs, url];
      await updateDoc(staffRef, {
        [`staff.${docType}`]: updatedDocs,
      });
      setStaff((prev) => ({
        ...prev,
        staff: {
          ...prev.staff,
          [docType]: updatedDocs,
        },
      }));
      toast.success(`${docType} uploaded successfully`);
      await logActivity("UPLOAD DOCUMENT", { docType, fileName: file.name });
    } catch (error) {
      //console.error(`Error in handleDocumentEdit for ${docType}:`, error);
      toast.error(`Failed to upload ${docType}: ${error.message}`);
    }
  };

  // Input Handling
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("address")) {
      const field = name.split(".")[1];
      setStaff((prev) => ({ ...prev, address: { ...prev.address, [field]: value } }));
    } else if (name.includes("emergency_details")) {
      const field = name.split(".")[1];
      setStaff((prev) => ({ ...prev, emergency_details: { ...prev.emergency_details, [field]: value } }));
    } else if (name.includes("education_details")) {
      const [_, index, fieldName] = name.split(".");
      setStaff((prev) => {
        const updatedEducation = [...prev.education_details];
        updatedEducation[index][fieldName] = value;
        return { ...prev, education_details: updatedEducation };
      });
    } else if (name.includes("experience_details")) {
      const [_, index, fieldName] = name.split(".");
      setStaff((prev) => {
        const updatedExperience = [...prev.experience_details];
        updatedExperience[index][fieldName] = value;
        return { ...prev, experience_details: updatedExperience };
      });
    } else {
      setStaff((prev) => ({ ...prev, [name]: value }));
    }
    logActivity("FIELD CHANGED", { field: name, value });
  };

  const cleanPhoneNumber = (phone) => {
    return phone.replace(/^\+|\D+/g, "");
  };

  // Education and Experience Management
  const addEducation = () => {
    if (!canUpdate) {
      toast.error("You do not have permission to update staff details");
      return;
    }
    setStaff((prev) => ({
      ...prev,
      education_details: [...prev.education_details, { level: '', institute: '', degree: '', specialization: '', grade: '', passingyr: '' }],
    }));
    logActivity("ADD EDUCATION", {});
  };

  const addExperience = () => {
    if (!canUpdate) {
      toast.error("You do not have permission to update staff details");
      return;
    }
    setStaff((prev) => ({
      ...prev,
      experience_details: [...prev.experience_details, { companyName: '', designation: '', salary: '', years: '', description: '' }],
    }));
    logActivity("ADD EXPERIENCE", {});
  };

  const deleteEducation = (index) => {
    if (!canUpdate) {
      toast.error("You do not have permission to update staff details");
      return;
    }
    setStaff((prev) => ({
      ...prev,
      education_details: prev.education_details.filter((_, i) => i !== index),
    }));
    logActivity("DELETE EDUCATION", { index });
  };

  const deleteExperience = (index) => {
    if (!canUpdate) {
      toast.error("You do not have permission to update staff details");
      return;
    }
    setStaff((prev) => ({
      ...prev,
      experience_details: prev.experience_details.filter((_, i) => i !== index),
    }));
    logActivity("DELETE EXPERIENCE", { index });
  };

  // Validation
  const validateDate = (dateValue, fieldName, isRequired = false) => {
    if (!dateValue && !isRequired) {
      return null;
    }
    if (!dateValue && isRequired) {
      toast.warn(`${fieldName} is required; using current date`);
      return Timestamp.fromDate(new Date());
    }
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date value for ${fieldName}: ${dateValue}`);
      toast.warn(`Invalid ${fieldName} provided; using current date`);
      return Timestamp.fromDate(new Date());
    }
    return Timestamp.fromDate(date);
  };

  // Update Staff
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!canUpdate) {
      toast.error("You do not have permission to update staff details");
      return;
    }

    if (!staff.displayName || !staff.email) {
      toast.error("Please fill necessary fields: Name, Email");
      return;
    }

    if (!staff.role) {
      toast.error("Please select a role");
      return;
    }

    const cleanedPhone = cleanPhoneNumber(staff.phone);
    const cleanedEmergencyPhone = cleanPhoneNumber(staff.emergency_details.phone);

    if (cleanedPhone && !/^\d{10,15}$/.test(cleanedPhone)) {
      toast.error("Staff phone number must be 10-15 digits");
      return;
    }
    if (staff.emergency_details.phone && !/^\d{10,15}$/.test(cleanedEmergencyPhone)) {
      toast.error("Emergency phone number must be 10-15 digits");
      return;
    }

    try {
      const staffRef = doc(db, "Users", staffId);
      const updateData = {
        displayName: staff.displayName,
        email: staff.email,
        phone: cleanedPhone ? `${countryCode}${cleanedPhone}` : "",
        address: staff.address,
        domain: staff.domain,
        role: staff.role,
        date_of_birth: staff.date_of_birth,
        joining_date: validateDate(staff.joining_date, "Joining Date", false),
        exit_date: validateDate(staff.exit_date, "Exit Date", false),
        education_details: staff.education_details,
        experience_details: staff.experience_details,
        emergency_details: {
          ...staff.emergency_details,
          phone: cleanedEmergencyPhone ? `${emergencyCountryCode}${cleanedEmergencyPhone}` : "",
        },
        staff: staff.staff,
      };

      await updateDoc(staffRef, updateData);
      toast.success("Staff updated successfully!");
      await logActivity("UPDATE STAFF SUCCESS", { updatedFields: Object.keys(updateData) });
      navigate("/staff");
    } catch (error) {
      //console.error("Error updating staff:", error);
      toast.error(`Failed to update staff: ${error.message}`);
    }
  };

  // Delete Staff
  const handleDelete = async () => {
    if (!canDelete) {
      toast.error("You do not have permission to delete staff");
      return;
    }

    if (window.confirm("Are you sure you want to delete this staff?")) {
      try {
        await deleteDoc(doc(db, "Users", staffId));
        toast.success("Staff deleted successfully!");
        await logActivity("DELETE STAFF SUCCESS", {});
        navigate("/staff-and-users");
      } catch (error) {
        //console.error("Error deleting staff:", error);
        toast.error("Failed to delete staff");
      }
    } else {
      await logActivity("CANCEL DELETE STAFF", {});
    }
  };

  // Close Sidebar
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => navigate("/staff"), 300);
  };

  if (!canDisplay) return null;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleClose}
      />
      <div
        className={`fixed top-0 right-0 h-full bg-white w-full sm:w-3/4 shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } p-6 overflow-y-auto z-50`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Edit Staff</h1>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-8">
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-4">Personal Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="displayName"
                  value={staff.displayName}
                  onChange={handleChange}
                  placeholder="Name"
                  required
                  disabled={!canUpdate}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={staff.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  disabled={!canUpdate}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Phone</label>
                <div className="flex mt-1">
                  <select
                    value={countryCode}
                    onChange={(e) => {
                      setCountryCode(e.target.value);
                      logActivity("CHANGE COUNTRY CODE", { field: "phone", value: e.target.value });
                    }}
                    disabled={!canUpdate}
                    className="w-1/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {countryCodes.map((country) => (
                      <option key={country.key} value={country.code}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    name="phone"
                    value={staff.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    disabled={!canUpdate}
                    className="w-2/3 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Domain</label>
                <input
                  type="text"
                  name="domain"
                  value={staff.domain}
                  onChange={handleChange}
                  placeholder="Domain"
                  disabled={!canUpdate}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Role <span className="text-red-500">*</span></label>
                <select
                  name="role"
                  value={staff.role}
                  onChange={handleChange}
                  disabled={!canUpdate}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Role</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={staff.date_of_birth}
                  onChange={handleChange}
                  disabled={!canUpdate}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Joining Date</label>
                <input
                  type="date"
                  name="joining_date"
                  value={staff.joining_date}
                  onChange={handleChange}
                  disabled={!canUpdate}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Exit Date</label>
                <input
                  type="date"
                  name="exit_date"
                  value={staff.exit_date}
                  onChange={handleChange}
                  disabled={!canUpdate}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-4">Emergency Contact</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Name</label>
                <input
                  type="text"
                  name="emergency_details.name"
                  value={staff.emergency_details.name}
                  onChange={handleChange}
                  placeholder="Person Name"
                  disabled={!canUpdate}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Phone</label>
                <div className="flex mt-1">
                  <select
                    value={emergencyCountryCode}
                    onChange={(e) => {
                      setEmergencyCountryCode(e.target.value);
                      logActivity("CHANGE COUNTRY CODE", { field: "emergency_phone", value: e.target.value });
                    }}
                    disabled={!canUpdate}
                    className="w-1/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {countryCodes.map((country) => (
                      <option key={country.key} value={country.code}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    name="emergency_details.phone"
                    value={staff.emergency_details.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                    disabled={!canUpdate}
                    className="w-2/3 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <input
                  type="email"
                  name="emergency_details.email"
                  value={staff.emergency_details.email}
                  onChange={handleChange}
                  placeholder="Email"
                  disabled={!canUpdate}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Relation</label>
                <input
                  type="text"
                  name="emergency_details.relation"
                  value={staff.emergency_details.relation}
                  onChange={handleChange}
                  placeholder="Relation"
                  disabled={!canUpdate}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Occupation</label>
                <input
                  type="text"
                  name="emergency_details.occupation"
                  value={staff.emergency_details.occupation}
                  onChange={handleChange}
                  placeholder="Occupation"
                  disabled={!canUpdate}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-4">Address Details</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="address.street"
                  value={staff.address.street}
                  onChange={handleChange}
                  placeholder="Street"
                  disabled={!canUpdate}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="address.area"
                  value={staff.address.area}
                  onChange={handleChange}
                  placeholder="Area"
                  disabled={!canUpdate}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="address.city"
                  value={staff.address.city}
                  onChange={handleChange}
                  placeholder="City"
                  disabled={!canUpdate}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="address.state"
                  value={staff.address.state}
                  onChange={handleChange}
                  placeholder="State"
                  disabled={!canUpdate}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="address.zip"
                  value={staff.address.zip}
                  onChange={handleChange}
                  placeholder="Zip Code"
                  disabled={!canUpdate}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="address.country"
                  value={staff.address.country}
                  onChange={handleChange}
                  placeholder="Country"
                  disabled={!canUpdate}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-4">Document Uploads</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {documentTypes.map((doc) => (
                <div key={doc.key}>
                  <label className="block text-sm font-medium text-gray-600">{doc.label}</label>
                  <div className="space-y-2">
                    {staff.staff[doc.key]?.length > 0 ? (
                      staff.staff[doc.key].map((url, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {getFileNameFromUrl(url)}
                          </a>
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-400">No files uploaded</span>
                    )}
                    {canUpdate && (
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => fileInputRefs[doc.key].current.click()}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                        <input
                          type="file"
                          ref={fileInputRefs[doc.key]}
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) handleDocumentEdit(doc.key, file);
                          }}
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          disabled={!canUpdate}
                        />
                      </div>
                    )}
                    {uploadProgress[doc.key] > 0 && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${uploadProgress[doc.key]}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{uploadProgress[doc.key]}%</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-4">Educational Details</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-sm font-medium text-gray-600">Level</th>
                    <th className="p-3 text-sm font-medium text-gray-600">Institute</th>
                    <th className="p-3 text-sm font-medium text-gray-600">Degree</th>
                    <th className="p-3 text-sm font-medium text-gray-600">Specialization</th>
                    <th className="p-3 text-sm font-medium text-gray-600">Grade</th>
                    <th className="p-3 text-sm font-medium text-gray-600">Passing Year</th>
                    <th className="p-3 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.education_details.map((edu, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <select
                          name={`education_details.${index}.level`}
                          value={edu.level}
                          onChange={handleChange}
                          disabled={!canUpdate}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="" disabled>Select Level</option>
                          <option value="School">School</option>
                          <option value="UG">UG</option>
                          <option value="PG">PG</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          name={`education_details.${index}.institute`}
                          value={edu.institute}
                          onChange={handleChange}
                          placeholder="Institute Name"
                          disabled={!canUpdate}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          name={`education_details.${index}.degree`}
                          value={edu.degree}
                          onChange={handleChange}
                          placeholder="Degree"
                          disabled={!canUpdate}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          name={`education_details.${index}.specialization`}
                          value={edu.specialization}
                          onChange={handleChange}
                          placeholder="Specialization"
                          disabled={!canUpdate}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          name={`education_details.${index}.grade`}
                          value={edu.grade}
                          onChange={handleChange}
                          placeholder="Grade"
                          disabled={!canUpdate}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          name={`education_details.${index}.passingyr`}
                          value={edu.passingyr}
                          onChange={handleChange}
                          placeholder="Year"
                          disabled={!canUpdate}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() => deleteEducation(index)}
                          disabled={!canUpdate}
                          className="text-red-500 hover:text-red-700 disabled:text-gray-400"
                        >
                          <FontAwesomeIcon icon={faXmark} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                type="button"
                onClick={addEducation}
                disabled={!canUpdate}
                className={`mt-4 px-4 py-2 rounded-md text-white ${
                  canUpdate ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                } transition duration-200`}
              >
                Add Education
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-4">Experience Details</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-sm font-medium text-gray-600">Company Name</th>
                    <th className="p-3 text-sm font-medium text-gray-600">Designation</th>
                    <th className="p-3 text-sm font-medium text-gray-600">Salary</th>
                    <th className="p-3 text-sm font-medium text-gray-600">Years</th>
                    <th className="p-3 text-sm font-medium text-gray-600">Description</th>
                    <th className="p-3 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.experience_details.map((exp, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <input
                          type="text"
                          name={`experience_details.${index}.companyName`}
                          value={exp.companyName}
                          onChange={handleChange}
                          placeholder="Company Name"
                          disabled={!canUpdate}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          name={`experience_details.${index}.designation`}
                          value={exp.designation}
                          onChange={handleChange}
                          placeholder="Designation"
                          disabled={!canUpdate}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          name={`experience_details.${index}.salary`}
                          value={exp.salary}
                          onChange={handleChange}
                          placeholder="Salary"
                          disabled={!canUpdate}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          name={`experience_details.${index}.years`}
                          value={exp.years}
                          onChange={handleChange}
                          placeholder="Years"
                          disabled={!canUpdate}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          name={`experience_details.${index}.description`}
                          value={exp.description}
                          onChange={handleChange}
                          placeholder="Description"
                          disabled={!canUpdate}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() => deleteExperience(index)}
                          disabled={!canUpdate}
                          className="text-red-500 hover:text-red-700 disabled:text-gray-400"
                        >
                          <FontAwesomeIcon icon={faXmark} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                type="button"
                onClick={addExperience}
                disabled={!canUpdate}
                className={`mt-4 px-4 py-2 rounded-md text-white ${
                  canUpdate ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                } transition duration-200`}
              >
                Add Experience
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={!canUpdate && !canDelete}
              className={`px-6 py-2 rounded-md text-gray-700 ${
                canUpdate || canDelete ? "bg-gray-200 hover:bg-gray-300" : "bg-gray-400 cursor-not-allowed"
              } transition duration-200`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canUpdate}
              className={`px-6 py-2 rounded-md text-white ${
                canUpdate ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
              } transition duration-200`}
            >
              Update Staff
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={!canDelete}
              className={`px-6 py-2 rounded-md text-white ${
                canDelete ? "bg-red-600 hover:bg-red-700" : "bg-gray-400 cursor-not-allowed"
              } transition duration-200`}
            >
              Delete Staff
            </button>
          </div>
        </form>
      </div>
    </>
  );
}