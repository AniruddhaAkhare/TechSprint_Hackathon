import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../config/firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import "./InstituteSetup.css";
import { FaBook, FaEdit, FaTrash } from "react-icons/fa";
import { s3Client } from "../../config/aws-config";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { debugS3Config } from "../../config/aws-config";
import { useAuth } from "../../context/AuthContext"; // Assuming this is where useAuth comes from

const InstituteSetup = () => {
  const navigate = useNavigate();
  const { rolePermissions } = useAuth(); // Fetch permissions from useAuth hook
  const [activeStep, setActiveStep] = useState("Basic Information");
  const [showModal, setShowModal] = useState(false);
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

  // Define permissions for InstituteSetup
  const canCreate = rolePermissions?.instituteSetup?.create || false;
  const canUpdate = rolePermissions?.instituteSetup?.update || false;
  const canDelete = rolePermissions?.instituteSetup?.delete || false;
  const canDisplay = rolePermissions?.instituteSetup?.display || false;

  useEffect(() => {
    if (!canDisplay) {
      navigate("/unauthorized"); // Redirect if user can't view this page
      return;
    }

    const fetchInstituteData = async () => {
      const querySnapshot = await getDocs(collection(db, "instituteSetup"));
      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data();
        setFormData(data);
        setInstituteId(querySnapshot.docs[0].id);
        const branchesSnapshot = await getDocs(collection(db, "instituteSetup", querySnapshot.docs[0].id, "Center"));
        const branchList = branchesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        branchList.sort((a, b) => a.name.localeCompare(b.name));
        setBranches(branchList);
      }
    };
    fetchInstituteData();
  }, [canDisplay, navigate]);

  const handleChange = (e) => {
    if (!canUpdate) return; // Prevent updates if no permission
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBranchChange = (e) => {
    if (!canUpdate) return; // Prevent updates if no permission
    const { name, value, type, checked } = e.target;
    setBranchForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e, nextStep) => {
    e.preventDefault();
    if (!canCreate && !instituteId) return; // Prevent creation if no permission
    if (!canUpdate && instituteId) return; // Prevent updates if no permission

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

  const handleBranchSubmit = async (e) => {
    e.preventDefault();
    if (!instituteId) {
      alert("Please save the institute details first.");
      return;
    }
    if (!canCreate && !currentBranch) return; // Prevent branch creation
    if (!canUpdate && currentBranch) return; // Prevent branch updates

    try {
      if (currentBranch && canUpdate) {
        const branchRef = doc(db, "instituteSetup", instituteId, "Center", currentBranch.id);
        await updateDoc(branchRef, branchForm);
        alert("Branch updated successfully!");
      } else if (canCreate) {
        await addDoc(collection(db, "instituteSetup", instituteId, "Center"), branchForm);
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
      });
      setCurrentBranch(null);
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
    if (!canDelete) return; // Prevent deletion if no permission
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

  const toggleEditMode = (section) => {
    if (!canUpdate) return; // Prevent toggling edit mode if no update permission
    setEditModes((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  if (!canDisplay) return null; // Render nothing if no display permission

  return (
    <div className="institute-setup p-20">
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
                {/* Other fields similarly controlled */}
                {editModes["Basic Information"] && canUpdate && (
                  <button type="submit" className="next-btn">
                    Save and Next →
                  </button>
                )}
              </form>
            </>
          )}

          {activeStep === "Branch Setup" && (
            <>
              <h2>Center Management</h2>
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
                    <span>{branch.contactNumber ? `+91 ${branch.contactNumber}` : "Not set"}</span>
                    <span>{branch.email || "Not set"}</span>
                    <span className="status">
                      <span className={`status-dot ${branch.isActive ? "active" : "inactive"}`}></span>
                      {branch.isActive ? "Active" : "Inactive"}
                    </span>
                    {(canUpdate || canDelete) && (
                      <span className="actions">
                        {canUpdate && <FaEdit className="action-icon" onClick={() => handleEditBranch(branch)} />}
                        {canDelete && <FaTrash className="action-icon delete" onClick={() => handleDeleteBranch(branch.id)} />}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <button className="next-btn" onClick={() => setActiveStep("Contact Information")}>
                Next →
              </button>
            </>
          )}

          {/* Other steps similarly modified */}
        </div>
      </div>

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
              {/* Other branch form fields */}
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
  );
};

export default InstituteSetup;