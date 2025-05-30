import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, doc, updateDoc, Timestamp, getDocs } from "firebase/firestore";
import { db, auth } from "../../../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { s3Client } from "../../../config/aws-config";
import { Upload } from "@aws-sdk/lib-storage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../context/AuthContext";

export default function AddStaff() {
  const { currentUser, rolePermissions } = useAuth();
  const navigate = useNavigate();
  const submissionRef = useRef(false);

  // Permissions
  const canCreate = rolePermissions?.Users?.create || false;

  // State
  const [isOpen, setIsOpen] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [emergencyCountryCode, setEmergencyCountryCode] = useState("+91");
  const [address, setAddress] = useState({ street: "", area: "", city: "", state: "", zip: "", country: "" });
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [emergencyDetails, setEmergencyDetails] = useState({ name: "", phone: "", email: "", relation: "", occupation: "" });
  const [joiningDate, setJoiningDate] = useState("");
  const [exitDate, setExitDate] = useState("");
  const [domain, setDomain] = useState("");
  const [role, setRole] = useState("");
  const [roles, setRoles] = useState([]);
  const [educationDetails, setEducationDetails] = useState([]);
  const [experienceDetails, setExperienceDetails] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documents, setDocuments] = useState({
    aadharCard: null,
    panCard: null,
    addressProof: null,
    tenthMarksheet: null,
    twelfthMarksheet: null,
    graduationMarksheet: null,
    pgMarksheet: null,
    offerLetter1: null,
    offerLetter2: null,
    experienceLetter1: null,
    experienceLetter2: null,
    salaryProof: null,
    parentSpouseAadhar: null,
    passportPhoto: null,
  });
  const [uploadProgress, setUploadProgress] = useState({});

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

  // Fetch Roles
  useEffect(() => {
    if (!canCreate) {
      toast.error("You do not have permission to add staff.");
      navigate("/unauthorized");
      return;
    }

    const fetchRoles = async () => {
      try {
        const rolesSnapshot = await getDocs(collection(db, "roles"));
        const rolesData = rolesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setRoles(rolesData);
      } catch (error) {
        //console.error("Error fetching roles:", error);
        toast.error("Failed to fetch roles");
      }
    };

    fetchRoles();

    const today = new Date().toISOString().split("T")[0];
    setJoiningDate(today);
  }, [canCreate, navigate]);

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
        details,
      };
      await addDoc(collection(db, "activityLogs"), logData);
    } catch (error) {
      //console.error("Error logging activity:", error);
    }
  };

  // File Handling
  const handleFileChange = (e, docType) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Invalid file type for ${file.name}. Allowed types: PDF, JPEG, PNG.`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large. Maximum size is 5MB.`);
        return;
      }

      setDocuments((prev) => ({ ...prev, [docType]: file }));
      setUploadProgress((prev) => ({ ...prev, [docType]: 0 }));
    } else {
      console.warn(`No file selected for ${docType}`);
    }
  };

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

  const cleanPhoneNumber = (phone) => {
    return phone.replace(/^\+|\D+/g, "");
  };

  const capitalizeFirstLetter = (str) => {
    if (!str || typeof str !== "string") return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (submissionRef.current) {
      console.warn("Submission already in progress, ignoring duplicate.");
      return;
    }

    if (!displayName.trim() || !email.trim() || !password.trim() || !role) {
      toast.error("Please fill all required fields: Name, Email, Password, Role.");
      return;
    }

    const cleanedPhone = cleanPhoneNumber(phone);
    const cleanedEmergencyPhone = cleanPhoneNumber(emergencyDetails.phone);

    if (cleanedPhone && !/^\d{10,15}$/.test(cleanedPhone)) {
      toast.error("Staff phone number must be 10-15 digits.");
      return;
    }
    if (emergencyDetails.phone && !/^\d{10,15}$/.test(cleanedEmergencyPhone)) {
      toast.error("Emergency phone number must be 10-15 digits.");
      return;
    }

    submissionRef.current = true;
    setIsSubmitting(true);

    try {
      // Create Firebase Authentication User
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const authUser = userCredential.user;

      // Add Staff to Firestore
      const staffData = {
        displayName: capitalizeFirstLetter(displayName),
        email,
        phone: cleanedPhone ? `${countryCode}${cleanedPhone}` : "",
        emergency_details: {
          ...emergencyDetails,
          phone: emergencyDetails.phone ? `${emergencyCountryCode}${cleanedEmergencyPhone}` : "",
        },
        joining_date: joiningDate ? Timestamp.fromDate(new Date(joiningDate)) : Timestamp.now(),
        exit_date: exitDate ? Timestamp.fromDate(new Date(exitDate)) : null,
        domain: domain || "",
        role,
        created_at: Timestamp.now(),
        education_details: educationDetails,
        experience_details: experienceDetails,
        address,
        date_of_birth: dateOfBirth || "",
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
      };

      const staffDocRef = await addDoc(collection(db, "Users"), staffData);
      const staffId = staffDocRef.id;

      // Upload Documents to S3
      const documentUpdates = {};
      for (const [docType, file] of Object.entries(documents)) {
        if (file) {
          try {
            const url = await uploadFileToS3(file, docType, staffId);
            documentUpdates[`staff.${docType}`] = [url];
          } catch (uploadErr) {
            //console.error(`Failed to upload ${docType}:`, uploadErr);
            throw new Error(`Failed to upload ${docType}: ${uploadErr.message}`);
          }
        }
      }

      if (Object.keys(documentUpdates).length > 0) {
        await updateDoc(doc(db, "Users", staffId), documentUpdates);
      }

      // Log Activity
      await logActivity("Created staff", {
        userId: authUser.uid,
        email,
        name: displayName,
        role: roles.find((r) => r.id === role)?.name || "Unknown",
        phone: cleanedPhone ? `${countryCode}${cleanedPhone}` : "N/A",
        domain: domain || "N/A",
      });

      toast.success("Staff added successfully!");
      navigate("/staff");
    } catch (error) {
      //console.error("Error adding staff:", error);
      toast.error(`Error adding staff: ${error.message}`);
    } finally {
      submissionRef.current = false;
      setIsSubmitting(false);
    }
  };

  const addEducation = () => {
    setEducationDetails([...educationDetails, { level: "", institute: "", degree: "", specialization: "", grade: "", passingyr: "" }]);
  };

  const handleEducationChange = (index, field, value) => {
    const newEducationDetails = [...educationDetails];
    newEducationDetails[index][field] = value;
    setEducationDetails(newEducationDetails);
  };

  const deleteEducation = (index) => {
    setEducationDetails(educationDetails.filter((_, i) => i !== index));
  };

  const addExperience = () => {
    setExperienceDetails([...experienceDetails, { companyName: "", designation: "", salary: "", years: "", description: "" }]);
  };

  const handleExperienceChange = (index, field, value) => {
    const newExperienceDetails = [...experienceDetails];
    newExperienceDetails[index][field] = value;
    setExperienceDetails(newExperienceDetails);
  };

  const deleteExperience = (index) => {
    setExperienceDetails(experienceDetails.filter((_, i) => i !== index));
  };

  const handleEmergencyChange = (field, value) => {
    setEmergencyDetails((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSidebar = () => {
    setIsOpen(false);
    setTimeout(() => navigate("/staff"), 300);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={toggleSidebar}
      />
      <div
        className={`fixed top-0 right-0 h-full bg-white sm:w-3/4 shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } p-6 overflow-y-auto z-50 overflow-x-auto`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Add Staff</h1>
          <button
            onClick={toggleSidebar}
            className="bg-indigo-600 text-white px-2 py-2 rounded-md hover:bg-indigo-700 flex items-center"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleAddStaff} className="space-y-8">
          <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
  <div className="space-y-10">
    {/* Personal Details Section */}
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Personal Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter Name"
            required
            disabled={isSubmitting}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
            required
            disabled={isSubmitting}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password <span className="text-red-500">*</span></label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 6 characters)"
            required
            disabled={isSubmitting}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <div className="flex">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              disabled={isSubmitting}
              className="w-1/3 px-4 py-3 border border-gray-200 rounded-l-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
            >
              {countryCodes.map((country) => (
                <option key={country.key} value={country.code}>
                  {country.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              disabled={isSubmitting}
              className="w-2/3 px-4 py-3 border border-gray-200 rounded-r-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Domain</label>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Role <span className="text-red-500">*</span></label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
          />
        </div>
      </div>
    </div>

    {/* Emergency Contact Section */}
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Emergency Contact</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <input
            type="text"
            value={emergencyDetails.name}
            onChange={(e) => handleEmergencyChange("name", e.target.value)}
            placeholder="Person Name"
            disabled={isSubmitting}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <div className="flex">
            <select
              value={emergencyCountryCode}
              onChange={(e) => setEmergencyCountryCode(e.target.value)}
              disabled={isSubmitting}
              className="w-1/3 px-4 py-3 border border-gray-200 rounded-l-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
            >
              {countryCodes.map((country) => (
                <option key={country.key} value={country.code}>
                  {country.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={emergencyDetails.phone}
              onChange={(e) => handleEmergencyChange("phone", e.target.value)}
              placeholder="Phone"
              disabled={isSubmitting}
              className="w-2/3 px-4 py-3 border border-gray-200 rounded-r-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={emergencyDetails.email}
            onChange={(e) => handleEmergencyChange("email", e.target.value)}
            placeholder="Email"
            disabled={isSubmitting}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Relation</label>
          <input
            type="text"
            value={emergencyDetails.relation}
            onChange={(e) => handleEmergencyChange("relation", e.target.value)}
            placeholder="Relation"
            disabled={isSubmitting}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
          <input
            type="text"
            value={emergencyDetails.occupation}
            onChange={(e) => handleEmergencyChange("occupation", e.target.value)}
            placeholder="Occupation"
            disabled={isSubmitting}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
          />
        </div>
      </div>
    </div>

    {/* Address Details Section */}
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Address Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          type="text"
          value={address.street}
          onChange={(e) => setAddress({ ...address, street: e.target.value })}
          placeholder="Street"
          disabled={isSubmitting}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
        />
        <input
          type="text"
          value={address.area}
          onChange={(e) => setAddress({ ...address, area: e.target.value })}
          placeholder="Area"
          disabled={isSubmitting}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
        />
        <input
          type="text"
          value={address.city}
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
          placeholder="City"
          disabled={isSubmitting}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
        />
        <input
          type="text"
          value={address.state}
          onChange={(e) => setAddress({ ...address, state: e.target.value })}
          placeholder="State"
          disabled={isSubmitting}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
        />
        <input
          type="text"
          value={address.zip}
          onChange={(e) => setAddress({ ...address, zip: e.target.value })}
          placeholder="Zip Code"
          disabled={isSubmitting}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
        />
        <input
          type="text"
          value={address.country}
          onChange={(e) => setAddress({ ...address, country: e.target.value })}
          placeholder="Country"
          disabled={isSubmitting}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
        />
      </div>
    </div>

    {/* Document Uploads Section */}
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Document Uploads</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { key: "aadharCard", label: "Aadhar Card" },
          { key: "panCard", label: "PAN Card" },
          { key: "addressProof", label: "Address Proof" },
          { key: "tenthMarksheet", label: "10th Marksheet" },
          { key: "twelfthMarksheet", label: "12th Marksheet" },
          { key: "graduationMarksheet", label: "Graduation Marksheet" },
          { key: "pgMarksheet", label: "PG Marksheet" },
          { key: "offerLetter1", label: "Last Offer Letter 1" },
          { key: "offerLetter2", label: "Last Offer Letter 2" },
          { key: "experienceLetter1", label: "Last Experience Letter 1" },
          { key: "experienceLetter2", label: "Last Experience Letter 2" },
          { key: "salaryProof", label: "Salary Proof" },
          { key: "parentSpouseAadhar", label: "Parent/Spouse Aadhar Card" },
          { key: "passportPhoto", label: "Passport Size Photo" },
        ].map((doc) => (
          <div key={doc.key}>
            <label className="block text-sm font-medium text-gray-700 mb-2">{doc.label}</label>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, doc.key)}
              accept=".pdf,.jpg,.jpeg,.png"
              disabled={isSubmitting}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
            />
            {documents[doc.key] && (
              <span className="block mt-2 text-sm text-gray-600">{documents[doc.key].name}</span>
            )}
            {uploadProgress[doc.key] > 0 && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress[doc.key]}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">{uploadProgress[doc.key]}%</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>

    {/* Educational Details Section */}
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Educational Details</h2>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="bg-indigo-50">
              <th className="p-4 text-sm font-medium text-gray-700 text-left">Level</th>
              <th className="p-4 text-sm font-medium text-gray-700 text-left">Institute</th>
              <th className="p-4 text-sm font-medium text-gray-700 text-left">Degree</th>
              <th className="p-4 text-sm font-medium text-gray-700 text-left">Specialization</th>
              <th className="p-4 text-sm font-medium text-gray-700 text-left">Grade</th>
              <th className="p-4 text-sm font-medium text-gray-700 text-left">Passing Year</th>
              <th className="p-4 text-sm font-medium text-gray-700 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {educationDetails.map((edu, index) => (
              <tr key={index} className="border-b hover:bg-gray-50 transition duration-200">
                <td className="p-4">
                  <select
                    value={edu.level}
                    onChange={(e) => handleEducationChange(index, "level", e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                  >
                    <option value="" disabled>
                      Select Level
                    </option>
                    <option value="School">School</option>
                    <option value="UG">UG</option>
                    <option value="PG">PG</option>
                  </select>
                </td>
                <td className="p-4">
                  <input
                    type="text"
                    value={edu.institute}
                    onChange={(e) => handleEducationChange(index, "institute", e.target.value)}
                    placeholder="Institute Name"
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                  />
                </td>
                <td className="p-4">
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                    placeholder="Degree"
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                  />
                </td>
                <td className="p-4">
                  <input
                    type="text"
                    value={edu.specialization}
                    onChange={(e) => handleEducationChange(index, "specialization", e.target.value)}
                    placeholder="Specialization"
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                  />
                </td>
                <td className="p-4">
                  <input
                    type="text"
                    value={edu.grade}
                    onChange={(e) => handleEducationChange(index, "grade", e.target.value)}
                    placeholder="Grade"
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                  />
                </td>
                <td className="p-4">
                  <input
                    type="number"
                    value={edu.passingyr}
                    onChange={(e) => handleEducationChange(index, "passingyr", e.target.value)}
                    placeholder="Year"
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                  />
                </td>
                <td className="p-4">
                  <button
                    type="button"
                    onClick={() => deleteEducation(index)}
                    disabled={isSubmitting}
                    className="text-red-500 hover:text-red-700 transition duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          type="button"
          onClick={addEducation}
          disabled={isSubmitting}
          className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-200 disabled:bg-gray-400"
        >
          Add Education
        </button>
      </div>
    </div>

    {/* Experience Details Section */}
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Experience Details</h2>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="bg-indigo-50">
              <th className="p-4 text-sm font-medium text-gray-700 text-left">Company Name</th>
              <th className="p-4 text-sm font-medium text-gray-700 text-left">Designation</th>
              <th className="p-4 text-sm font-medium text-gray-700 text-left">Salary</th>
              <th className="p-4 text-sm font-medium text-gray-700 text-left">Years</th>
              <th className="p-4 text-sm font-medium text-gray-700 text-left">Description</th>
              <th className="p-4 text-sm font-medium text-gray-700 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {experienceDetails.map((exp, index) => (
              <tr key={index} className="border-b hover:bg-gray-50 transition duration-200">
                <td className="p-4">
                  <input
                    type="text"
                    value={exp.companyName}
                    onChange={(e) => handleExperienceChange(index, "companyName", e.target.value)}
                    placeholder="Company Name"
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                  />
                </td>
                <td className="p-4">
                  <input
                    type="text"
                    value={exp.designation}
                    onChange={(e) => handleExperienceChange(index, "designation", e.target.value)}
                    placeholder="Designation"
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                  />
                </td>
                <td className="p-4">
                  <input
                    type="text"
                    value={exp.salary}
                    onChange={(e) => handleExperienceChange(index, "salary", e.target.value)}
                    placeholder="Salary"
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                  />
                </td>
                <td className="p-4">
                  <input
                    type="number"
                    value={exp.years}
                    onChange={(e) => handleExperienceChange(index, "years", e.target.value)}
                    placeholder="Years"
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                  />
                </td>
                <td className="p-4">
                  <input
                    type="text"
                    value={exp.description}
                    onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
                    placeholder="Description"
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                  />
                </td>
                <td className="p-4">
                  <button
                    type="button"
                    onClick={() => deleteExperience(index)}
                    disabled={isSubmitting}
                    className="text-red-500 hover:text-red-700 transition duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          type="button"
          onClick={addExperience}
          disabled={isSubmitting}
          className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-200 disabled:bg-gray-400"
        >
          Add Experience
        </button>
      </div>
    </div>

    {/* Additional Details Section */}
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Additional Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Joining</label>
          <input
            type="date"
            value={joiningDate}
            onChange={(e) => setJoiningDate(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Exit Date</label>
          <input
            type="date"
            value={exitDate}
            onChange={(e) => setExitDate(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
          />
        </div>
      </div>
    </div>

    {/* Form Actions */}
    <div className="flex justify-end space-x-4">
      <button
        type="button"
        onClick={toggleSidebar}
        disabled={isSubmitting}
        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200 disabled:bg-gray-400"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={handleAddStaff}
        disabled={isSubmitting}
        className={`px-6 py-3 rounded-lg text-white font-medium ${
          isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
        } transition duration-200`}
      >
        {isSubmitting ? "Processing..." : "Add Staff"}
      </button>
    </div>
  </div>
</div>
        </form>
      </div>
    </>
  );
}