import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../config/firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import "./InstituteSetup.css";
import { FaBook, FaEdit, FaTrash } from "react-icons/fa";
import { s3Client } from "../../config/aws-config";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { debugS3Config } from "../../config/aws-config";

const InstituteSetup = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState("Basic Information");
  const [showModal, setShowModal] = useState(false);
  const [countryCode, setCountryCode] = useState("+91"); // Renamed from centerCode to countryCode
  const [branchCountryCode, setBranchCountryCode] = useState("+91"); // Separate state for branch modal
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


  const countryCodes = [
    { code: "+1", label: "USA (+1)" },
    { code: "+1", label: "Canada (+1)" }, // Note: Canada shares +1 with the USA, but you might differentiate by region if needed
    { code: "+7", label: "Russia (+7)" },
    { code: "+20", label: "Egypt (+20)" },
    { code: "+27", label: "South Africa (+27)" },
    { code: "+30", label: "Greece (+30)" },
    { code: "+31", label: "Netherlands (+31)" },
    { code: "+32", label: "Belgium (+32)" },
    { code: "+33", label: "France (+33)" },
    { code: "+34", label: "Spain (+34)" },
    { code: "+39", label: "Italy (+39)" },
    { code: "+41", label: "Switzerland (+41)" },
    { code: "+44", label: "UK (+44)" },
    { code: "+45", label: "Denmark (+45)" },
    { code: "+46", label: "Sweden (+46)" },
    { code: "+47", label: "Norway (+47)" },
    { code: "+48", label: "Poland (+48)" },
    { code: "+49", label: "Germany (+49)" },
    { code: "+51", label: "Peru (+51)" },
    { code: "+52", label: "Mexico (+52)" },
    { code: "+53", label: "Cuba (+53)" },
    { code: "+54", label: "Argentina (+54)" },
    { code: "+55", label: "Brazil (+55)" },
    { code: "+56", label: "Chile (+56)" },
    { code: "+57", label: "Colombia (+57)" },
    { code: "+58", label: "Venezuela (+58)" },
    { code: "+60", label: "Malaysia (+60)" },
    { code: "+61", label: "Australia (+61)" },
    { code: "+62", label: "Indonesia (+62)" },
    { code: "+63", label: "Philippines (+63)" },
    { code: "+64", label: "New Zealand (+64)" },
    { code: "+65", label: "Singapore (+65)" },
    { code: "+66", label: "Thailand (+66)" },
    { code: "+81", label: "Japan (+81)" },
    { code: "+82", label: "South Korea (+82)" },
    { code: "+84", label: "Vietnam (+84)" },
    { code: "+86", label: "China (+86)" },
    { code: "+90", label: "Turkey (+90)" },
    { code: "+91", label: "India (+91)" },
    { code: "+92", label: "Pakistan (+92)" },
    { code: "+93", label: "Afghanistan (+93)" },
    { code: "+94", label: "Sri Lanka (+94)" },
    { code: "+95", label: "Myanmar (+95)" },
    { code: "+98", label: "Iran (+98)" },
    { code: "+211", label: "South Sudan (+211)" },
    { code: "+212", label: "Morocco (+212)" },
    { code: "+213", label: "Algeria (+213)" },
    { code: "+216", label: "Tunisia (+216)" },
    { code: "+218", label: "Libya (+218)" },
    { code: "+220", label: "Gambia (+220)" },
    { code: "+221", label: "Senegal (+221)" },
    { code: "+233", label: "Ghana (+233)" },
    { code: "+234", label: "Nigeria (+234)" },
    { code: "+236", label: "Central African Republic (+236)" },
    { code: "+237", label: "Cameroon (+237)" },
    { code: "+241", label: "Gabon (+241)" },
    { code: "+242", label: "Congo (+242)" },
    { code: "+243", label: "DR Congo (+243)" },
    { code: "+244", label: "Angola (+244)" },
    { code: "+248", label: "Seychelles (+248)" },
    { code: "+249", label: "Sudan (+249)" },
    { code: "+250", label: "Rwanda (+250)" },
    { code: "+251", label: "Ethiopia (+251)" },
    { code: "+252", label: "Somalia (+252)" },
    { code: "+253", label: "Djibouti (+253)" },
    { code: "+254", label: "Kenya (+254)" },
    { code: "+255", label: "Tanzania (+255)" },
    { code: "+256", label: "Uganda (+256)" },
    { code: "+260", label: "Zambia (+260)" },
    { code: "+261", label: "Madagascar (+261)" },
    { code: "+262", label: "Réunion (+262)" },
    { code: "+263", label: "Zimbabwe (+263)" },
    { code: "+264", label: "Namibia (+264)" },
    { code: "+265", label: "Malawi (+265)" },
    { code: "+266", label: "Lesotho (+266)" },
    { code: "+267", label: "Botswana (+267)" },
    { code: "+268", label: "Eswatini (+268)" },
    { code: "+269", label: "Comoros (+269)" },
    { code: "+291", label: "Eritrea (+291)" },
    { code: "+297", label: "Aruba (+297)" },
    { code: "+298", label: "Faroe Islands (+298)" },
    { code: "+299", label: "Greenland (+299)" },
    { code: "+351", label: "Portugal (+351)" },
    { code: "+352", label: "Luxembourg (+352)" },
    { code: "+353", label: "Ireland (+353)" },
    { code: "+354", label: "Iceland (+354)" },
    { code: "+355", label: "Albania (+355)" },
    { code: "+356", label: "Malta (+356)" },
    { code: "+357", label: "Cyprus (+357)" },
    { code: "+358", label: "Finland (+358)" },
    { code: "+359", label: "Bulgaria (+359)" },
    { code: "+370", label: "Lithuania (+370)" },
    { code: "+371", label: "Latvia (+371)" },
    { code: "+372", label: "Estonia (+372)" },
    { code: "+373", label: "Moldova (+373)" },
    { code: "+374", label: "Armenia (+374)" },
    { code: "+375", label: "Belarus (+375)" },
    { code: "+376", label: "Andorra (+376)" },
    { code: "+377", label: "Monaco (+377)" },
    { code: "+378", label: "San Marino (+378)" },
    { code: "+380", label: "Ukraine (+380)" },
    { code: "+381", label: "Serbia (+381)" },
    { code: "+382", label: "Montenegro (+382)" },
    { code: "+383", label: "Kosovo (+383)" },
    { code: "+385", label: "Croatia (+385)" },
    { code: "+386", label: "Slovenia (+386)" },
    { code: "+387", label: "Bosnia and Herzegovina (+387)" },
    { code: "+389", label: "North Macedonia (+389)" },
    { code: "+420", label: "Czech Republic (+420)" },
    { code: "+421", label: "Slovakia (+421)" },
    { code: "+423", label: "Liechtenstein (+423)" },
    { code: "+501", label: "Belize (+501)" },
    { code: "+502", label: "Guatemala (+502)" },
    { code: "+503", label: "El Salvador (+503)" },
    { code: "+504", label: "Honduras (+504)" },
    { code: "+505", label: "Nicaragua (+505)" },
    { code: "+506", label: "Costa Rica (+506)" },
    { code: "+507", label: "Panama (+507)" },
    { code: "+508", label: "Saint Pierre and Miquelon (+508)" },
    { code: "+509", label: "Haiti (+509)" },
    { code: "+590", label: "Guadeloupe (+590)" },
    { code: "+591", label: "Bolivia (+591)" },
    { code: "+592", label: "Guyana (+592)" },
    { code: "+593", label: "Ecuador (+593)" },
    { code: "+594", label: "French Guiana (+594)" },
    { code: "+595", label: "Paraguay (+595)" },
    { code: "+596", label: "Martinique (+596)" },
    { code: "+597", label: "Suriname (+597)" },
    { code: "+598", label: "Uruguay (+598)" },
    { code: "+599", label: "Curaçao (+599)" },
    { code: "+670", label: "East Timor (+670)" },
    { code: "+672", label: "Norfolk Island (+672)" },
    { code: "+673", label: "Brunei (+673)" },
    { code: "+674", label: "Nauru (+674)" },
    { code: "+675", label: "Papua New Guinea (+675)" },
    { code: "+676", label: "Tonga (+676)" },
    { code: "+677", label: "Solomon Islands (+677)" },
    { code: "+678", label: "Vanuatu (+678)" },
    { code: "+679", label: "Fiji (+679)" },
    { code: "+680", label: "Palau (+680)" },
    { code: "+681", label: "Wallis and Futuna (+681)" },
    { code: "+682", label: "Cook Islands (+682)" },
    { code: "+683", label: "Niue (+683)" },
    { code: "+685", label: "Samoa (+685)" },
    { code: "+686", label: "Kiribati (+686)" },
    { code: "+687", label: "New Caledonia (+687)" },
    { code: "+688", label: "Tuvalu (+688)" },
    { code: "+689", label: "French Polynesia (+689)" },
    { code: "+690", label: "Tokelau (+690)" },
    { code: "+691", label: "Micronesia (+691)" },
    { code: "+692", label: "Marshall Islands (+692)" },
    { code: "+850", label: "North Korea (+850)" },
    { code: "+852", label: "Hong Kong (+852)" },
    { code: "+853", label: "Macau (+853)" },
    { code: "+855", label: "Cambodia (+855)" },
    { code: "+856", label: "Laos (+856)" },
    { code: "+880", label: "Bangladesh (+880)" },
    { code: "+886", label: "Taiwan (+886)" },
    { code: "+960", label: "Maldives (+960)" },
    { code: "+961", label: "Lebanon (+961)" },
    { code: "+962", label: "Jordan (+962)" },
    { code: "+963", label: "Syria (+963)" },
    { code: "+964", label: "Iraq (+964)" },
    { code: "+965", label: "Kuwait (+965)" },
    { code: "+966", label: "Saudi Arabia (+966)" },
    { code: "+967", label: "Yemen (+967)" },
    { code: "+968", label: "Oman (+968)" },
    { code: "+970", label: "Palestine (+970)" },
    { code: "+971", label: "United Arab Emirates (+971)" },
    { code: "+972", label: "Israel (+972)" },
    { code: "+973", label: "Bahrain (+973)" },
    { code: "+974", label: "Qatar (+974)" },
    { code: "+975", label: "Bhutan (+975)" },
    { code: "+976", label: "Mongolia (+976)" },
    { code: "+977", label: "Nepal (+977)" },
    { code: "+992", label: "Tajikistan (+992)" },
    { code: "+993", label: "Turkmenistan (+993)" },
    { code: "+994", label: "Azerbaijan (+994)" },
    { code: "+995", label: "Georgia (+995)" },
    { code: "+996", label: "Kyrgyzstan (+996)" },
    { code: "+998", label: "Uzbekistan (+998)" },
  ];


  useEffect(() => {
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
        // Sort branches by name in ascending order
        branchList.sort((a, b) => a.name.localeCompare(b.name));
        setBranches(branchList);
      }
    };
    fetchInstituteData();
  }, []);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNumber") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ 
        ...prev, 
        phoneNumber: `${countryCode}${numericValue}` 
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

  // const handleBranchChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   setBranchForm((prev) => ({
  //     ...prev,
  //     [name]: type === "checkbox" ? checked : value,
  //   }));
  // };

  const handleBranchChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "contactNumber") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setBranchForm((prev) => ({
        ...prev,
        contactNumber: `${branchCountryCode}${numericValue}`
      }));
    } else {
      setBranchForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleNumericInput = (e) => {
    const charCode = e.charCode;
    if (charCode < 48 || charCode > 57) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e, nextStep) => {
    e.preventDefault();
    try {
      let updatedFormData = { ...formData };
      if (activeStep === "Logo Upload" && logoFile) {
        const logoUrl = await handleLogoUpload();
        if (!logoUrl) return;
        updatedFormData = { ...updatedFormData, logoUrl };
      }

      const querySnapshot = await getDocs(collection(db, "instituteSetup"));
      if (querySnapshot.empty) {
        const docRef = await addDoc(collection(db, "instituteSetup"), updatedFormData);
        setInstituteId(docRef.id);
      } else {
        const docRef = doc(db, "instituteSetup", querySnapshot.docs[0].id);
        await updateDoc(docRef, updatedFormData);
        setInstituteId(querySnapshot.docs[0].id);
      }

      alert("Data saved successfully!");
      setEditModes((prev) => ({ ...prev, [activeStep]: false }));

      if (nextStep) {
        setActiveStep(nextStep);
      } else {
        navigate("/dashboard");
      }
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
    try {
      if (currentBranch) {
        const branchRef = doc(db, "instituteSetup", instituteId, "Center", currentBranch.id);
        await updateDoc(branchRef, branchForm);
        alert("Branch updated successfully!");
      } else {
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
      // Sort branches by name in ascending order
      branchList.sort((a, b) => a.name.localeCompare(b.name));
      setBranches(branchList);
    } catch (error) {
      console.error("Error saving branch: ", error);
      alert("Error saving branch");
    }
  };

  const handleEditBranch = (branch) => {
    setCurrentBranch(branch);
    setBranchForm({
      name: branch.name || "",
      addressLine1: branch.addressLine1 || "",
      addressLine2: branch.addressLine2 || "",
      city: branch.city || "",
      state: branch.state || "",
      postalCode: branch.postalCode || "",
      country: branch.country || "India",
      isActive: branch.isActive !== undefined ? branch.isActive : true,
      contactNumber: branch.contactNumber || "",
      email: branch.email || "",
    });
    setShowModal(true);
  };

  const handleDeleteBranch = async (branchId) => {
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
    setEditModes((prev) => ({ ...prev, [section]: !prev[section] }));
  };

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
            <li className={activeStep === "Contact Information" ? "active Ascending" : ""} onClick={() => setActiveStep("Contact Information")}>
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
                <button onClick={() => toggleEditMode("Basic Information")}>
                  {editModes["Basic Information"] ? "Cancel" : "Edit"}
                </button>
              </div>
              <p>Enter your institute's basic details</p>
              <form onSubmit={(e) => handleSubmit(e, "Logo Upload")}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Institute Name <span className="form-group-required">*</span></label>
                    {editModes["Basic Information"] ? (
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
                    {editModes["Basic Information"] ? (
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
                <div className="form-group">
                  <label>Address</label>
                  {editModes["Basic Information"] ? (
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter address"
                    />
                  ) : (
                    <div className="read-only">{formData.address || "Not set"}</div>
                  )}
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    {editModes["Basic Information"] ? (
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Enter city"
                      />
                    ) : (
                      <div className="read-only">{formData.city || "Not set"}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    {editModes["Basic Information"] ? (
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="Enter state"
                      />
                    ) : (
                      <div className="read-only">{formData.state || "Not set"}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Pincode</label>
                    {editModes["Basic Information"] ? (
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        placeholder="Enter pincode"
                      />
                    ) : (
                      <div className="read-only">{formData.pincode || "Not set"}</div>
                    )}
                  </div>
                </div>
                {editModes["Basic Information"] && (
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
                <button onClick={() => toggleEditMode("Logo Upload")}>
                  {editModes["Logo Upload"] ? "Cancel" : "Edit"}
                </button>
              </div>
              <p>Upload your institute's logo</p>
              <form onSubmit={(e) => handleSubmit(e, "Branch Setup")}>
                <div className="logo-upload-section">
                  <div className="upload-box">
                    {editModes["Logo Upload"] ? (
                      <>
                        <input type="file" accept="image/jpeg,image/png,image/svg+xml" onChange={handleLogoChange} />
                        <button type="button" className="upload-btn">
                          Upload Logo
                        </button>
                      </>
                    ) : null}
                    {logoFile && editModes["Logo Upload"] && <p>Selected file: {logoFile.name}</p>}
                    {logoError && <p className="error">{logoError}</p>}
                    {formData.logoUrl && (
                      <div className="logo-preview">
                        <p>Current Logo:</p>
                        <img src={formData.logoUrl || "/placeholder.svg"} alt="Institute Logo" style={{ maxWidth: "200px" }} />
                      </div>
                    )}
                  </div>
                  <p>Upload a logo that represents your institute. This will appear in the header of the application.</p>
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
                {editModes["Logo Upload"] && (
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
              <div className="branch-table">
                <div className="table-header">
                  <span>Name</span>
                  <span>Address</span>
                  <span>Contact Number</span>
                  <span>Email</span>
                  <span>Status</span>
                  <span>Actions</span>
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
                    <span className="actions">
                      <FaEdit className="action-icon" onClick={() => handleEditBranch(branch)} />
                      <FaTrash className="action-icon delete" onClick={() => handleDeleteBranch(branch.id)} />
                    </span>
                  </div>
                ))}
              </div>
              <button className="next-btn" onClick={() => setActiveStep("Contact Information")}>
                Next →
              </button>
            </>
          )}

    {/* {activeStep === "Contact Information" && (
            <>
              <div className="edit-section">
                <h2>Contact Information</h2>
                <button onClick={() => toggleEditMode("Contact Information")}>
                  {editModes["Contact Information"] ? "Cancel" : "Edit"}
                </button>
              </div>
              <p>Add contact details for your institute</p>
              <form onSubmit={(e) => handleSubmit(e, "System Configuration")}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email Address <span className="form-group-required">*</span></label>
                    {editModes["Contact Information"] ? (
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
                    {editModes["Contact Information"] ? (
                      <div className="phone-input-wrapper flex">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
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
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setFormData((prev) => ({ 
                    ...prev, 
                    phoneNumber: `${countryCode}${value}` 
                  }));
                }}
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
                  {editModes["Contact Information"] ? (
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
                {editModes["Contact Information"] && (
                  <button type="submit" className="next-btn">
                    Save and Next →
                  </button>
                )}
              </form>
            </>
          )}  */}

{activeStep === "Contact Information" && (
  <>
    <div className="edit-section">
      <h2>Contact Information</h2>
      <button onClick={() => toggleEditMode("Contact Information")}>
        {editModes["Contact Information"] ? "Cancel" : "Edit"}
      </button>
    </div>
    <p>Add contact details for your institute</p>
    <form onSubmit={(e) => handleSubmit(e, "System Configuration")}>
      <div className="form-row">
        <div className="form-group">
          <label>Email Address <span className="form-group-required">*</span></label>
          {editModes["Contact Information"] ? (
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
          {editModes["Contact Information"] ? (
            <div className="phone-input-wrapper flex">
              <select
                value={countryCode}
                onChange={(e) => {
                  setCountryCode(e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    phoneNumber: e.target.value + prev.phoneNumber.replace(countryCode, "")
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
        {editModes["Contact Information"] ? (
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
      {editModes["Contact Information"] && (
        <button type="submit" className="next-btn">
          Save and Next →
        </button>
      )}
    </form>
  </>
)}
          {activeStep === "System Configuration" && (
            <>
              <div className="edit-section">
                <h2>System Configuration</h2>
                <button onClick={() => toggleEditMode("System Configuration")}>
                  {editModes["System Configuration"] ? "Cancel" : "Edit"}
                </button>
              </div>
              <p>Configure the system settings for your needs</p>
              <form onSubmit={(e) => handleSubmit(e, null)}>
                <div className="section">
                  <h3>Academic Year</h3>
                  <p>Configure your academic year settings for better organization of courses and batches.</p>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Academic Year Start</label>
                      {editModes["System Configuration"] ? (
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
                      {editModes["System Configuration"] ? (
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
                    {editModes["System Configuration"] ? (
                      <select name="timezone" value={formData.timezone} onChange={handleChange}>
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
                {editModes["System Configuration"] && (
                  <button type="submit" className="complete-btn">
                    Complete Setup
                  </button>
                )}
              </form>
            </>
          )}
        </div>
      </div>

      {showModal && (
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
                  <div className="relative flex items-center">
                    {/* <span className="inline-block px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-gray-600"> */}
                    {/* {countryCodes} */}
                    {/* </span> */}

                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-1/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {countryCodes.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.label}
                        </option>
                      ))}
                    </select>


                    <input
                      type="text"
                      name="contactNumber"
                      value={branchForm.contactNumber}
                      onChange={(e) => handleBranchChange({
                        target: {
                          name: "contactNumber",
                          value: e.target.value.replace(/\D/g, "").slice(0, 10)
                        }
                      })}
                      placeholder="Enter 10-digit phone number"
                      className="mt-0 w-full px-3 py-2 border rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                      required
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
              <div className="form-group">
                <label>
                  <input type="checkbox" name="isActive" checked={branchForm.isActive} onChange={handleBranchChange} />
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
  );
};

export default InstituteSetup;