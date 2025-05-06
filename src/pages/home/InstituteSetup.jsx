import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../config/firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import "./InstituteSetup.css";
import { FaBook, FaEdit, FaTrash } from "react-icons/fa";
import { s3Client } from "../../config/aws-config";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { debugS3Config } from "../../config/aws-config";
import { useAuth } from "../../context/AuthContext";




const InstituteSetup = () => {
  const navigate = useNavigate();
  const { rolePermissions } = useAuth();
  const [activeStep, setActiveStep] = useState("Basic Information");
  const [showModal, setShowModal] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [branchCountryCode, setBranchCountryCode] = useState("+91");
  const [formData, setFormData] = useState({
    instituteName: "",
    instituteType: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    email: "",
    phoneNumber: "",
    website: "",
    academicYearStart: "",
    academicYearEnd: "",
    timezone: "",
    logoUrl: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoError, setLogoError] = useState("");
  const [branches, setBranches] = useState([]);
  const [currentBranch, setCurrentBranch] = useState(null);
  const [branchForm, setBranchForm] = useState({
    name: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    isActive: true,
    contactNumber: "",
    email: "",
  });
  const [instituteId, setInstituteId] = useState(null);
  const [editModes, setEditModes] = useState({
    "Basic Information": false,
    "Logo Upload": false,
    "Branch Setup": false,
    "Contact Information": false,
    "System Configuration": false,
  });

  const canCreate = rolePermissions?.instituteSetup?.create || false;
  const canUpdate = rolePermissions?.instituteSetup?.update || false;
  const canDelete = rolePermissions?.instituteSetup?.delete || false;
  const canDisplay = rolePermissions?.instituteSetup?.display || false;

  useEffect(() => {
    if (!canDisplay) {
      navigate("/unauthorized");
      return;
    }

    const fetchInstituteData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "instituteSetup"));
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          setFormData({
            ...data,
            phoneNumber: data.phoneNumber || "", // Fallback to empty string
            email: data.email || "",
            website: data.website || "",
            academicYearStart: data.academicYearStart || "",
            academicYearEnd: data.academicYearEnd || "",
            timezone: data.timezone || "",
          });
          setInstituteId(querySnapshot.docs[0].id);
          const branchesSnapshot = await getDocs(collection(db, "instituteSetup", querySnapshot.docs[0].id, "Center"));
          const branchList = branchesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          branchList.sort((a, b) => a.name.localeCompare(b.name));
          setBranches(branchList);
        }
      } catch (error) {
        console.error("Error fetching institute data:", error);
      }
    };
    fetchInstituteData();
  }, [canDisplay, navigate]);

  const handleChange = (e) => {
    if (!canUpdate) return;
    const { name, value } = e.target;
    if (name === "phoneNumber") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        phoneNumber: `${countryCode}${numericValue}`,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validFormats = ["image/jpeg", "image/png", "image/svg+xml"];
      if (!validFormats.includes(file.type)) {
        setLogoError("Invalid file format. Only JPG, PNG, and SVG are supported.");
        return;
      }
      if (file.size > 500 * 1024) {
        setLogoError("File size exceeds 500KB.");
        return;
      }
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        if (width < 100 || width > 400) {
          setLogoError("Width must be between 100px and 400px.");
          return;
        }
        if (height < 50 || height > 200) {
          setLogoError("Height must be between 50px and 200px.");
          return;
        }
        setLogoError("");
        setLogoFile(file);
      };
    }
  };

  const handleLogoUpload = async () => {
    if (!logoFile) {
      setLogoError("Please select a logo to upload");
      return null;
    }
    try {
      debugS3Config();
      console.log("S3 Client:", s3Client ? "Initialized" : "Not Initialized");
      const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
      const region = import.meta.env.VITE_AWS_REGION;
      if (!bucketName || !region) {
        throw new Error("Missing AWS config: Check VITE_S3_BUCKET_NAME and VITE_AWS_REGION");
      }
      const fileKey = `logos/${Date.now()}_${logoFile.name.replace(/\s+/g, "_")}`;
      const fileBuffer = await logoFile.arrayBuffer();
      const params = {
        Bucket: bucketName,
        Key: fileKey,
        Body: new Uint8Array(fileBuffer),
        ContentType: logoFile.type,
      };
      console.log("Upload Params:", params);
      const uploadResult = await s3Client.send(new PutObjectCommand(params));
      console.log("Upload Success:", uploadResult);
      const logoUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;
      setFormData((prev) => ({ ...prev, logoUrl }));
      setLogoError("");
      return logoUrl;
    } catch (error) {
      console.error("S3 Upload Error Details:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
      let errorMessage = "Failed to upload logo: ";
      if (error.name === "TypeError" && error.message === "Failed to fetch") {
        errorMessage += "Network or CORS issue. Check your internet, CORS settings, or AWS credentials.";
      } else if (error.name === "CredentialsError") {
        errorMessage += "Invalid AWS credentials.";
      } else {
        errorMessage += error.message;
      }
      setLogoError(errorMessage);
      return null;
    }
  };

  const handleBranchChange = (e) => {
    if (!canUpdate && currentBranch) return;
    if (!canCreate && !currentBranch) return;
    const { name, value, type, checked } = e.target;
    if (name === "contactNumber") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setBranchForm((prev) => ({
        ...prev,
        contactNumber: numericValue,
      }));
    } else if (name === "latitude" || name === "longitude") {
      // Validate latitude and longitude
      const numericValue = value.replace(/[^0-9.-]/g, "");
      if (name === "latitude" && (numericValue < -90 || numericValue > 90)) {
        return;
      }
      if (name === "longitude" && (numericValue < -180 || numericValue > 180)) {
        return;
      }
      setBranchForm((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    }
    else {
      setBranchForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setBranchForm((prev) => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to fetch current location. Please enter manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleEditBranch = (branch) => {
    if (!canUpdate) {
      alert("You don't have permission to edit branches");
      return;
    }
    setCurrentBranch(branch);
    const contactNumber = branch.contactNumber || "";
    const countryCodeMatch = contactNumber.match(/^\+(\d+)/);
    const extractedCountryCode = countryCodeMatch ? `+${countryCodeMatch[1]}` : "+91";
    const numberWithoutCode = contactNumber.replace(extractedCountryCode, "");

    setBranchCountryCode(extractedCountryCode);
    setBranchForm({
      name: branch.name || "",
      addressLine1: branch.addressLine1 || "",
      addressLine2: branch.addressLine2 || "",
      city: branch.city || "",
      state: branch.state || "",
      postalCode: branch.postalCode || "",
      country: branch.country || "India",
      isActive: branch.isActive !== undefined ? branch.isActive : true,
      contactNumber: numberWithoutCode || "",
      email: branch.email || "",
      latitute: branch.latitute || "",
      longitute: branch.lengitute || "",
    });
    setShowModal(true);
  };

  const handleBranchSubmit = async (e) => {
    e.preventDefault();
    if (!instituteId) {
      alert("Please save the institute details first.");
      return;
    }
    if (!canCreate && !currentBranch) return;
    if (!canUpdate && currentBranch) return;

    try {
      const fullContactNumber = `${branchCountryCode}${branchForm.contactNumber}`;
      const updatedBranchForm = { ...branchForm, contactNumber: fullContactNumber };

      if (currentBranch && canUpdate) {
        const branchRef = doc(db, "instituteSetup", instituteId, "Center", currentBranch.id);
        await updateDoc(branchRef, updatedBranchForm);
        alert("Branch updated successfully!");
      } else if (canCreate) {
        await addDoc(collection(db, "instituteSetup", instituteId, "Center"), updatedBranchForm);
        alert("Branch added successfully!");
      }
      setShowModal(false);
      setBranchForm({
        name: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
        isActive: true,
        contactNumber: "",
        email: "",
        latitude: "",
        longitude: "",
      });
      setCurrentBranch(null);
      setBranchCountryCode("+91");
      const branchesSnapshot = await getDocs(collection(db, "instituteSetup", instituteId, "Center"));
      const branchList = branchesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      branchList.sort((a, b) => a.name.localeCompare(b.name));
      setBranches(branchList);
    } catch (error) {
      console.error("Error saving branch: ", error);
      alert("Error saving branch");
    }
  };

  const handleDeleteBranch = async (branchId) => {
    if (!canDelete) return;
    if (window.confirm("Are you sure you want to delete this branch?")) {
      try {
        await deleteDoc(doc(db, "instituteSetup", instituteId, "Center", branchId));
        setBranches(branches.filter((branch) => branch.id !== branchId));
        alert("Branch deleted successfully!");
      } catch (error) {
        console.error("Error deleting branch: ", error);
        alert("Error deleting branch");
      }
    }
  };

  const handleSubmit = async (e, nextStep) => {
    e.preventDefault();
    if (!canCreate && !instituteId) return;
    if (!canUpdate && instituteId) return;

    try {
      let updatedFormData = { ...formData };
      if (activeStep === "Logo Upload" && logoFile) {
        const logoUrl = await handleLogoUpload();
        if (!logoUrl) return;
        updatedFormData = { ...updatedFormData, logoUrl };
      }

      const querySnapshot = await getDocs(collection(db, "instituteSetup"));
      if (querySnapshot.empty && canCreate) {
        const docRef = await addDoc(collection(db, "instituteSetup"), updatedFormData);
        setInstituteId(docRef.id);
      } else if (canUpdate) {
        const docRef = doc(db, "instituteSetup", querySnapshot.docs[0].id);
        await updateDoc(docRef, updatedFormData);
        setInstituteId(querySnapshot.docs[0].id);
      }

      alert("Data saved successfully!");
      setEditModes((prev) => ({ ...prev, [activeStep]: false }));

      if (nextStep) setActiveStep(nextStep);
      else navigate("/dashboard");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error saving data");
    }
  };

  const toggleEditMode = (section) => {
    if (!canUpdate) {
      console.log(`Cannot toggle edit mode for ${section}: canUpdate is false`);
      alert("You don't have permission to edit this section.");
      return;
    }
    console.log(`Toggling edit mode for ${section}. Current editModes:`, editModes);
    setEditModes((prev) => {
      const newEditModes = { ...prev, [section]: !prev[section] };
      console.log(`New editModes:`, newEditModes);
      return newEditModes;
    });
  };

  if (!canDisplay) return null;

  return (
    <div className="institute-setup ">
      <div className="header">
        <FaBook className="header-icon" />
        <h1>Institute Setup</h1>
      </div>

      <div className="content">
        <div className="steps">
          <h2>Onboarding Steps</h2>
          <p>Complete these steps to set up your institute</p>
          <ul>
            <li className={activeStep === "Basic Information" ? "active" : ""} onClick={() => setActiveStep("Basic Information")}>
              1 Basic Information
            </li>
            <li className={activeStep === "Logo Upload" ? "active" : ""} onClick={() => setActiveStep("Logo Upload")}>
              2 Logo Upload
            </li>
            <li className={activeStep === "Branch Setup" ? "active" : ""} onClick={() => setActiveStep("Branch Setup")}>
              3 Center Setup
            </li>
            <li className={activeStep === "Contact Information" ? "active" : ""} onClick={() => setActiveStep("Contact Information")}>
              4 Contact Information
            </li>
            <li className={activeStep === "System Configuration" ? "active" : ""} onClick={() => setActiveStep("System Configuration")}>
              5 System Configuration
            </li>
          </ul>
        </div>

        <div className="form-section">
          {activeStep === "Basic Information" && (
            <>
              <div className="edit-section">
                <h2>Basic Information</h2>
                {canUpdate && (
                  <button onClick={() => toggleEditMode("Basic Information")}>
                    {editModes["Basic Information"] ? "Cancel" : "Edit"}
                  </button>
                )}
              </div>
              <p>Enter your institute's basic details</p>
              <form onSubmit={(e) => handleSubmit(e, "Logo Upload")}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Institute Name <span className="form-group-required">*</span></label>
                    {editModes["Basic Information"] && canUpdate ? (
                      <input
                        type="text"
                        name="instituteName"
                        value={formData.instituteName}
                        onChange={handleChange}
                        placeholder="Enter institute name"
                        required
                      />
                    ) : (
                      <div className="read-only">{formData.instituteName || "Not set"}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Institute Type <span className="form-group-required">*</span></label>
                    {editModes["Basic Information"] && canUpdate ? (
                      <input
                        type="text"
                        name="instituteType"
                        value={formData.instituteType}
                        onChange={handleChange}
                        placeholder="School, College, University, etc."
                        required
                      />
                    ) : (
                      <div className="read-only">{formData.instituteType || "Not set"}</div>
                    )}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Address <span className="form-group-required">*</span></label>
                    {editModes["Basic Information"] && canUpdate ? (
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter address"
                        required
                      />
                    ) : (
                      <div className="read-only">{formData.address || "Not set"}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>City <span className="form-group-required">*</span></label>
                    {editModes["Basic Information"] && canUpdate ? (
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Enter city"
                        required
                      />
                    ) : (
                      <div className="read-only">{formData.city || "Not set"}</div>
                    )}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>State <span className="form-group-required">*</span></label>
                    {editModes["Basic Information"] && canUpdate ? (
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="Enter state"
                        required
                      />
                    ) : (
                      <div className="read-only">{formData.state || "Not set"}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Pincode <span className="form-group-required">*</span></label>
                    {editModes["Basic Information"] && canUpdate ? (
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        placeholder="Enter pincode"
                        required
                      />
                    ) : (
                      <div className="read-only">{formData.pincode || "Not set"}</div>
                    )}
                  </div>
                </div>
                {editModes["Basic Information"] && canUpdate && (
                  <button type="submit" className="next-btn">
                    Save and Next →
                  </button>
                )}
              </form>
            </>
          )}

          {activeStep === "Logo Upload" && (
            <>
              <div className="edit-section">
                <h2>Logo Upload</h2>
                {canUpdate && (
                  <button onClick={() => toggleEditMode("Logo Upload")}>
                    {editModes["Logo Upload"] ? "Cancel" : "Edit"}
                  </button>
                )}
              </div>
              <p>Upload your institute's logo</p>
              <form onSubmit={(e) => handleSubmit(e, "Branch Setup")}>
                <div className="logo-upload-section">
                  <div className="upload-box">
                    {editModes["Logo Upload"] && canUpdate ? (
                      <>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/svg+xml"
                          onChange={handleLogoChange}
                          disabled={!editModes["Logo Upload"]}
                        />
                        <button type="button" className="upload-btn" disabled={!editModes["Logo Upload"]}>
                          Upload Logo
                        </button>
                      </>
                    ) : null}
                    {logoFile && <p>Selected file: {logoFile.name}</p>}
                    {logoError && <p className="error">{logoError}</p>}
                    {formData.logoUrl && (
                      <div className="logo-preview">
                        <p>Current Logo:</p>
                        <img
                          src={formData.logoUrl || "/placeholder.svg"}
                          alt="Institute Logo"
                          style={{ maxWidth: "200px" }}
                        />
                      </div>
                    )}
                  </div>
                  <p>
                    Upload a logo that represents your institute. This will appear in the header of the application.
                  </p>
                  <div className="logo-requirements">
                    <h4>Logo Requirements:</h4>
                    <ul>
                      <li>Width: Between 100px and 400px</li>
                      <li>Height: Between 50px and 200px</li>
                      <li>Maximum file size: 500KB</li>
                      <li>Supported formats: JPG, PNG, SVG</li>
                      <li>Recommended: Use a transparent background for better integration</li>
                    </ul>
                  </div>
                </div>
                {editModes["Logo Upload"] && canUpdate && (
                  <button type="submit" className="next-btn">
                    Save and Next →
                  </button>
                )}
                {!editModes["Logo Upload"] && (
                  <button
                    type="button"
                    className="next-btn"
                    onClick={() => setActiveStep("Branch Setup")}
                  >
                    Next →
                  </button>
                )}
              </form>
            </>
          )}

          {activeStep === "Branch Setup" && (
            <>
              <div className="edit-section">
                <h2>Center Management</h2>
              </div>
              <p>Set up centers for your institute</p>
              {canCreate && (
                <button
                  className="add-branch-btn"
                  onClick={() => {
                    setShowModal(true);
                    setCurrentBranch(null);
                    setBranchForm({
                      name: "",
                      addressLine1: "",
                      addressLine2: "",
                      city: "",
                      state: "",
                      postalCode: "",
                      country: "India",
                      isActive: true,
                      contactNumber: "",
                      email: "",
                    });
                    setBranchCountryCode("+91");
                  }}
                >
                  + Add Center
                </button>
              )}
              <div className="branch-table">
                <div className="table-header">
                  <span>Name</span>
                  <span>Address</span>
                  <span>Contact Number</span>
                  <span>Email</span>
                  <span>Status</span>
                  {(canUpdate || canDelete) && <span>Actions</span>}
                </div>
                {branches.map((branch) => (
                  <div key={branch.id} className="table-row">
                    <span>{branch.name}</span>
                    <span>
                      {branch.addressLine1}, {branch.city}, {branch.state}, {branch.postalCode}
                    </span>
                    <span>{branch.contactNumber || "Not set"}</span>
                    <span>{branch.email || "Not set"}</span>
                    <span className="status">
                      <span className={`status-dot ${branch.isActive ? "active" : "inactive"}`}></span>
                      {branch.isActive ? "Active" : "Inactive"}
                    </span>
                    {(canUpdate || canDelete) && (
                      <span className="actions">
                        {canUpdate && <FaEdit className="action-icon" onClick={() => handleEditBranch(branch)} />}
                        {canDelete && (
                          <FaTrash
                            className="action-icon delete"
                            onClick={() => handleDeleteBranch(branch.id)}
                          />
                        )}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <button
                className="next-btn"
                onClick={() => setActiveStep("Contact Information")}
              >
                Next →
              </button>
            </>
          )}

          {activeStep === "Contact Information" && (
            <>
              <div className="edit-section">
                <h2>Contact Information</h2>
                {canUpdate && (
                  <button onClick={() => toggleEditMode("Contact Information")}>
                    {editModes["Contact Information"] ? "Cancel" : "Edit"}
                  </button>
                )}
              </div>
              <p>Add contact details for your institute</p>
              <form onSubmit={(e) => handleSubmit(e, "System Configuration")}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email Address <span className="form-group-required">*</span></label>
                    {editModes["Contact Information"] && canUpdate ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                        required
                      />
                    ) : (
                      <div className="read-only">{formData.email || "Not set"}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Phone Number <span className="form-group-required">*</span></label>
                    {editModes["Contact Information"] && canUpdate ? (
                      <div className="phone-input-wrapper flex">
                        <select
                          value={countryCode}
                          onChange={(e) => {
                            const newCountryCode = e.target.value;
                            setCountryCode(newCountryCode);
                            setFormData((prev) => ({
                              ...prev,
                              phoneNumber: prev.phoneNumber
                                ? newCountryCode + (prev.phoneNumber.replace(countryCode, "") || "")
                                : newCountryCode,
                            }));
                          }}
                          className="w-1/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {countryCodes.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.label}
                            </option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber.replace(countryCode, "")}
                          onChange={handleChange}
                          placeholder="Enter 10-digit phone number"
                          maxLength="10"
                          required
                          className="flex-1 px-3 py-2 border border-l-0 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ) : (
                      <div className="read-only">{formData.phoneNumber || "Not set"}</div>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label>Website</label>
                  {editModes["Contact Information"] && canUpdate ? (
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="Enter website URL"
                    />
                  ) : (
                    <div className="read-only">{formData.website || "Not set"}</div>
                  )}
                </div>
                {editModes["Contact Information"] && canUpdate && (
                  <button type="submit" className="next-btn">
                    Save and Next →
                  </button>
                )}
                {!editModes["Contact Information"] && (
                  <button
                    type="button"
                    className="next-btn"
                    onClick={() => setActiveStep("System Configuration")}
                  >
                    Next →
                  </button>
                )}
              </form>
            </>
          )}

          {activeStep === "System Configuration" && (
            <>
              <div className="edit-section">
                <h2>System Configuration</h2>
                {canUpdate && (
                  <button onClick={() => toggleEditMode("System Configuration")}>
                    {editModes["System Configuration"] ? "Cancel" : "Edit"}
                  </button>
                )}
              </div>
              <p>Configure the system settings for your needs</p>
              <form onSubmit={(e) => handleSubmit(e, null)}>
                <div className="section">
                  <h3>Academic Year</h3>
                  <p>Configure your academic year settings for better organization of courses and batches.</p>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Academic Year Start</label>
                      {editModes["System Configuration"] && canUpdate ? (
                        <input
                          type="date"
                          name="academicYearStart"
                          value={formData.academicYearStart}
                          onChange={handleChange}
                        />
                      ) : (
                        <div className="read-only">{formData.academicYearStart || "Not set"}</div>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Academic Year End</label>
                      {editModes["System Configuration"] && canUpdate ? (
                        <input
                          type="date"
                          name="academicYearEnd"
                          value={formData.academicYearEnd}
                          onChange={handleChange}
                        />
                      ) : (
                        <div className="read-only">{formData.academicYearEnd || "Not set"}</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="section">
                  <h3>System Preferences</h3>
                  <p>Set up your system preferences for notifications and other settings.</p>
                  <div className="form-group">
                    <label>Timezone</label>
                    {editModes["System Configuration"] && canUpdate ? (
                      <select
                        name="timezone"
                        value={formData.timezone}
                        onChange={handleChange}
                      >
                        <option value="">Select timezone</option>
                        <option value="UTC">UTC</option>
                        <option value="Asia/Kolkata">Asia/Kolkata</option>
                        <option value="America/New_York">America/New_York</option>
                        <option value="Europe/London">Europe/London</option>
                      </select>
                    ) : (
                      <div className="read-only">{formData.timezone || "Not set"}</div>
                    )}
                  </div>
                </div>
                {editModes["System Configuration"] && canUpdate && (
                  <button type="submit" className="complete-btn">
                    Complete Setup
                  </button>
                )}
                {!editModes["System Configuration"] && (
                  <button
                    type="button"
                    className="complete-btn"
                    onClick={() => navigate("/dashboard")}
                  >
                    Complete Setup
                  </button>
                )}
              </form>
            </>
          )}

          {showModal && (canCreate || (canUpdate && currentBranch)) && (
            <div className="modal">
              <div className="modal-content">
                <h2>{currentBranch ? "Edit Center" : "Add Center"}</h2>
                <form onSubmit={handleBranchSubmit}>
                  <div className="form-group">
                    <label>Center Name <span className="form-group-required">*</span></label>
                    <input
                      type="text"
                      name="name"
                      value={branchForm.name}
                      onChange={handleBranchChange}
                      placeholder="Enter Center name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Address Line 1 <span className="form-group-required">*</span></label>
                    <input
                      type="text"
                      name="addressLine1"
                      value={branchForm.addressLine1}
                      onChange={handleBranchChange}
                      placeholder="Enter address line 1"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Address Line 2</label>
                    <input
                      type="text"
                      name="addressLine2"
                      value={branchForm.addressLine2}
                      onChange={handleBranchChange}
                      placeholder="Enter address line 2"
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>City <span className="form-group-required">*</span></label>
                      <input
                        type="text"
                        name="city"
                        value={branchForm.city}
                        onChange={handleBranchChange}
                        placeholder="Enter city"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>State <span className="form-group-required">*</span></label>
                      <input
                        type="text"
                        name="state"
                        value={branchForm.state}
                        onChange={handleBranchChange}
                        placeholder="Enter state"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Postal Code <span className="form-group-required">*</span></label>
                      <input
                        type="text"
                        name="postalCode"
                        value={branchForm.postalCode}
                        onChange={handleBranchChange}
                        placeholder="Enter postal code"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Country <span className="form-group-required">*</span></label>
                      <input
                        type="text"
                        name="country"
                        value={branchForm.country}
                        onChange={handleBranchChange}
                        placeholder="Enter country"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Contact Number <span className="form-group-required">*</span></label>
                      <div className="flex items-center space-x-2">
                        <select
                          value={branchCountryCode}
                          onChange={(e) => setBranchCountryCode(e.target.value)}
                          className="w-1/4 px-2 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {countryCodes.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.code}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          name="contactNumber"
                          value={branchForm.contactNumber}
                          onChange={handleBranchChange}
                          placeholder="Enter 10-digit phone number"
                          maxLength="10"
                          required
                          className="w-3/4 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Email <span className="form-group-required">*</span></label>
                      <input
                        type="email"
                        name="email"
                        value={branchForm.email}
                        onChange={handleBranchChange}
                        placeholder="Enter email"
                        required
                      />
                    </div>

                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Latitude <span className="form-group-required">*</span></label>
                      <input
                        type="text"
                        name="latitude"
                        value={branchForm.latitude}
                        onChange={handleBranchChange}
                        placeholder="Enter latitude"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Longitude <span className="form-group-required">*</span></label>
                      <input
                        type="text"
                        name="longitude"
                        value={branchForm.longitude}
                        onChange={handleBranchChange}
                        placeholder="Enter longitude"
                        required
                      />
                    </div>
                  </div>
                  <button type="button" onClick={getCurrentLocation}>
                    Use Current Location
                  </button>
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={branchForm.isActive}
                        onChange={handleBranchChange}
                      />
                      Center is active
                    </label>
                  </div>
                  <div className="modal-actions">
                    <button type="button" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit">Save Center</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstituteSetup;