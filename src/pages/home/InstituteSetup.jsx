// "use client"

// import { useState, useEffect } from "react"
// import { useNavigate } from "react-router-dom"
// import { db } from "../../config/firebase"
// import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore"
// import "./InstituteSetup.css"
// import { FaBook, FaEdit, FaTrash } from "react-icons/fa"
// import { s3Client } from "../../config/aws-config"
// import { PutObjectCommand } from "@aws-sdk/client-s3"
// // Add this import at the top with your other imports
// import { debugS3Config } from "../../config/aws-config"

// const InstituteSetup = () => {
//   const navigate = useNavigate()
//   const [activeStep, setActiveStep] = useState("Basic Information")
//   const [showModal, setShowModal] = useState(false)
//   const [formData, setFormData] = useState({
//     instituteName: "",
//     instituteType: "",
//     address: "",
//     city: "",
//     state: "",
//     pincode: "",
//     email: "",
//     phoneNumber: "",
//     website: "",
//     academicYearStart: "",
//     academicYearEnd: "",
//     timezone: "",
//     logoUrl: "",
//   })
//   const [logoFile, setLogoFile] = useState(null)
//   const [logoError, setLogoError] = useState("")
//   const [branches, setBranches] = useState([])
//   const [currentBranch, setCurrentBranch] = useState(null)
//   const [branchForm, setBranchForm] = useState({
//     name: "",
//     addressLine1: "",
//     addressLine2: "",
//     city: "",
//     state: "",
//     postalCode: "",
//     country: "India",
//     isActive: true,
//   })
//   const [instituteId, setInstituteId] = useState(null) // To store the institute document ID

//   // Fetch institute data and branches
//   useEffect(() => {
//     const fetchInstituteData = async () => {
//       const querySnapshot = await getDocs(collection(db, "instituteSetup"))
//       if (!querySnapshot.empty) {
//         const data = querySnapshot.docs[0].data()
//         setFormData(data)
//         setInstituteId(querySnapshot.docs[0].id) // Store the institute ID
//         // Fetch branches from the Center subcollection
//         const branchesSnapshot = await getDocs(collection(db, "instituteSetup", querySnapshot.docs[0].id, "Center"))
//         const branchList = branchesSnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }))
//         setBranches(branchList)
//       }
//     }
//     fetchInstituteData()
//   }, [])

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleLogoChange = (e) => {
//     const file = e.target.files[0]
//     if (file) {
//       const validFormats = ["image/jpeg", "image/png", "image/svg+xml"]
//       if (!validFormats.includes(file.type)) {
//         setLogoError("Invalid file format. Only JPG, PNG, and SVG are supported.")
//         return
//       }
//       if (file.size > 500 * 1024) {
//         setLogoError("File size exceeds 500KB.")
//         return
//       }
//       const img = new Image()
//       img.src = URL.createObjectURL(file)
//       img.onload = () => {
//         const width = img.width
//         const height = img.height
//         if (width < 100 || width > 400) {
//           setLogoError("Width must be between 100px and 400px.")
//           return
//         }
//         if (height < 50 || height > 200) {
//           setLogoError("Height must be between 50px and 200px.")
//           return
//         }
//         setLogoError("")
//         setLogoFile(file)
//       }
//     }
//   }

//   // Replace the handleLogoUpload function with this updated version
//   const handleLogoUpload = async () => {
//     if (!logoFile) {
//       setLogoError("Please select a logo to upload");
//       return null;
//     }
  
//     try {
//       // Debug configuration
//       debugS3Config();
//       console.log("S3 Client:", s3Client ? "Initialized" : "Not Initialized");
  
//       const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
//       const region = import.meta.env.VITE_AWS_REGION;
  
//       if (!bucketName || !region) {
//         throw new Error("Missing AWS config: Check VITE_S3_BUCKET_NAME and VITE_AWS_REGION");
//       }
  
//       const fileKey = `logos/${Date.now()}_${logoFile.name.replace(/\s+/g, "_")}`;
//       const fileBuffer = await logoFile.arrayBuffer();
  
//       const params = {
//         Bucket: bucketName,
//         Key: fileKey,
//         Body: new Uint8Array(fileBuffer),
//         ContentType: logoFile.type,
//       };
  
//       console.log("Upload Params:", params);
  
//       const uploadResult = await s3Client.send(new PutObjectCommand(params));
//       console.log("Upload Success:", uploadResult);
  
//       const logoUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;
//       setFormData((prev) => ({ ...prev, logoUrl }));
//       setLogoError("");
//       return logoUrl;
  
//     } catch (error) {
//       console.error("S3 Upload Error Details:", {
//         message: error.message,
//         name: error.name,
//         stack: error.stack,
//       });
  
//       let errorMessage = "Failed to upload logo: ";
//       if (error.name === "TypeError" && error.message === "Failed to fetch") {
//         errorMessage += "Network or CORS issue. Check your internet, CORS settings, or AWS credentials.";
//       } else if (error.name === "CredentialsError") {
//         errorMessage += "Invalid AWS credentials.";
//       } else {
//         errorMessage += error.message;
//       }
  
//       setLogoError(errorMessage);
//       return null;
//     }
//   };
//   // const handleLogoUpload = async () => {
//   //   if (!logoFile) {
//   //     setLogoError("Please select a logo to upload");
//   //     return null;
//   //   }
  
//   //   try {
//   //     // Verify S3 client is properly initialized
//   //     if (!s3Client) {
//   //       throw new Error("S3 client is not initialized");
//   //     }
  
//   //     // Get AWS configuration from environment variables
//   //     const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
//   //     const region = import.meta.env.VITE_AWS_REGION;
  
//   //     if (!bucketName || !region) {
//   //       throw new Error("Missing AWS configuration. Check your environment variables: VITE_S3_BUCKET_NAME and VITE_AWS_REGION");
//   //     }
  
//   //     // Create a unique file key
//   //     const fileKey = `logos/${Date.now()}_${logoFile.name.replace(/\s+/g, "_")}`;
      
//   //     // Get file buffer
//   //     const fileBuffer = await logoFile.arrayBuffer();
  
//   //     // S3 upload parameters
//   //     const params = {
//   //       Bucket: bucketName,
//   //       Key: fileKey,
//   //       Body: new Uint8Array(fileBuffer),
//   //       ContentType: logoFile.type,
//   //     };
  
//   //     // Upload to S3
//   //     console.log("Uploading to S3 with params:", {
//   //       bucket: params.Bucket,
//   //       key: params.Key,
//   //       contentType: params.ContentType
//   //     });
  
//   //     const uploadResult = await s3Client.send(new PutObjectCommand(params));
//   //     console.log("Upload result:", uploadResult);
  
//   //     // Generate the public URL
//   //     const logoUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;
      
//   //     setFormData((prev) => ({ ...prev, logoUrl }));
//   //     setLogoError("");
//   //     return logoUrl;
  
//   //   } catch (error) {
//   //     console.error("Detailed S3 Upload Error:", {
//   //       message: error.message,
//   //       name: error.name,
//   //       stack: error.stack,
//   //       code: error.code
//   //     });
      
//   //     // Handle specific AWS errors
//   //     let errorMessage = "Failed to upload logo: ";
//   //     if (error.name === "CredentialsError") {
//   //       errorMessage += "Invalid AWS credentials";
//   //     } else if (error.name === "AccessDenied") {
//   //       errorMessage += "Permission denied - check bucket policy and IAM permissions";
//   //     } else if (error.code === "NetworkingError") {
//   //       errorMessage += "Network issue - check your internet connection";
//   //     } else {
//   //       errorMessage += error.message;
//   //     }
      
//   //     setLogoError(errorMessage);
//   //     return null;
//   //   }
//   // };
//   // const handleLogoUpload = async () => {
//   //   if (!logoFile) {
//   //     setLogoError("Please select a logo to upload")
//   //     return null
//   //   }

//   //   // Debug S3 configuration
//   //   debugS3Config()

//   //   try {
//   //     // Get AWS configuration from environment variables
//   //     const bucketName = import.meta.env.VITE_S3_BUCKET_NAME
//   //     const region = import.meta.env.VITE_AWS_REGION

//   //     if (!bucketName || !region) {
//   //       console.error("Missing S3 configuration")
//   //       setLogoError("Logo upload is not configured properly. Please check your environment variables.")
//   //       return null
//   //     }

//   //     console.log(`Attempting to upload to bucket: ${bucketName} in region: ${region}`)

//   //     // Create a unique file key with timestamp to avoid overwriting
//   //     const fileKey = `logos/${Date.now()}_${logoFile.name.replace(/\s+/g, "_")}`

//   //     // Create a buffer from the file
//   //     const fileBuffer = await logoFile.arrayBuffer()

//   //     // Set up the S3 upload parameters
//   //     const params = {
//   //       Bucket: bucketName,
//   //       Key: fileKey,
//   //       Body: new Uint8Array(fileBuffer),
//   //       ContentType: logoFile.type,
//   //       // Try without ACL first as it might be causing issues
//   //       // ACL: 'public-read',
//   //     }

//   //     console.log("Sending upload command to S3...")

//   //     // Send the upload command
//   //     const command = new PutObjectCommand(params)
//   //     const result = await s3Client.send(command)

//   //     console.log("Upload successful:", result)

//   //     // Construct the URL based on region and bucket
//   //     const logoUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`
//   //     console.log("Generated logo URL:", logoUrl)

//   //     // Update form data with the new logo URL
//   //     setFormData((prev) => ({ ...prev, logoUrl }))
//   //     setLogoError("")
//   //     return logoUrl
//   //   } catch (error) {
//   //     console.error("S3 Upload Error:", error)
//   //     // More detailed error message
//   //     setLogoError(`Failed to upload logo: ${error.message}. Check console for details.`)
//   //     return null
//   //   }
//   // }

//   const handleBranchChange = (e) => {
//     const { name, value, type, checked } = e.target
//     setBranchForm((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }))
//   }

//   const handleSubmit = async (e, nextStep) => {
//     e.preventDefault()
//     try {
//       let updatedFormData = { ...formData }
//       if (activeStep === "Logo Upload" && logoFile) {
//         const logoUrl = await handleLogoUpload()
//         if (!logoUrl) return
//         updatedFormData = { ...updatedFormData, logoUrl }
//       }

//       const querySnapshot = await getDocs(collection(db, "instituteSetup"))
//       if (querySnapshot.empty) {
//         const docRef = await addDoc(collection(db, "instituteSetup"), updatedFormData)
//         setInstituteId(docRef.id) // Set the new institute ID
//       } else {
//         const docRef = doc(db, "instituteSetup", querySnapshot.docs[0].id)
//         await updateDoc(docRef, updatedFormData)
//         setInstituteId(querySnapshot.docs[0].id)
//       }

//       alert("Data saved successfully!");
     
//       if (nextStep) {
//         setActiveStep(nextStep)
//       } else {
//         navigate("/dashboard")
//       }
//     } catch (error) {
//       console.error("Error saving data:", error)
//       alert("Error saving data")
//     }
//   }

//   const handleBranchSubmit = async (e) => {
//     e.preventDefault()
//     if (!instituteId) {
//       alert("Please save the institute details first.")
//       return
//     }
//     try {
//       if (currentBranch) {
//         const branchRef = doc(db, "instituteSetup", instituteId, "Center", currentBranch.id)
//         await updateDoc(branchRef, branchForm)
//         alert("Branch updated successfully!")
//       } else {
//         await addDoc(collection(db, "instituteSetup", instituteId, "Center"), branchForm)
//         alert("Branch added successfully!")
//       }
//       setShowModal(false)
//       setBranchForm({
//         name: "",
//         addressLine1: "",
//         addressLine2: "",
//         city: "",
//         state: "",
//         postalCode: "",
//         country: "India",
//         isActive: true,
//       })
//       setCurrentBranch(null)
//       const branchesSnapshot = await getDocs(collection(db, "instituteSetup", instituteId, "Center"))
//       const branchList = branchesSnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }))
//       setBranches(branchList)
//     } catch (error) {
//       console.error("Error saving branch: ", error)
//       alert("Error saving branch")
//     }
//   }

//   const handleEditBranch = (branch) => {
//     setCurrentBranch(branch)
//     setBranchForm(branch)
//     setShowModal(true)
//   }

//   const handleDeleteBranch = async (branchId) => {
//     if (window.confirm("Are you sure you want to delete this branch?")) {
//       try {
//         await deleteDoc(doc(db, "instituteSetup", instituteId, "Center", branchId))
//         setBranches(branches.filter((branch) => branch.id !== branchId))
//         alert("Branch deleted successfully!")
//       } catch (error) {
//         console.error("Error deleting branch: ", error)
//         alert("Error deleting branch")
//       }
//     }
//   }

//   return (
//     <div className="institute-setup p-20">
//       <div className="header">
//         <FaBook className="header-icon" />
//         <h1>Institute Setup</h1>
//       </div>

//       <div className="content">
//         <div className="steps">
//           <h2>Onboarding Steps</h2>
//           <p>Complete these steps to set up your institute</p>
//           <ul>
//             <li
//               className={activeStep === "Basic Information" ? "active" : ""}
//               onClick={() => setActiveStep("Basic Information")}
//             >
//               1 Basic Information
//             </li>
//             <li className={activeStep === "Logo Upload" ? "active" : ""} onClick={() => setActiveStep("Logo Upload")}>
//               2 Logo Upload
//             </li>
//             <li className={activeStep === "Branch Setup" ? "active" : ""} onClick={() => setActiveStep("Branch Setup")}>
//               3 Center Setup
//             </li>
//             <li
//               className={activeStep === "Contact Information" ? "active" : ""}
//               onClick={() => setActiveStep("Contact Information")}
//             >
//               4 Contact Information
//             </li>
//             <li
//               className={activeStep === "System Configuration" ? "active" : ""}
//               onClick={() => setActiveStep("System Configuration")}
//             >
//               5 System Configuration
//             </li>
//           </ul>
//         </div>

//         <div className="form-section">
//           {activeStep === "Basic Information" && (
//             <>
//               <h2>Basic Information</h2>
//               <p>Enter your institute's basic details</p>
//               <form onSubmit={(e) => handleSubmit(e, "Logo Upload")}>
//                 <div className="form-row">
//                   <div className="form-group">
//                     <label>
//                       Institute Name <span className="form-group-required">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       name="instituteName"
//                       value={formData.instituteName}
//                       onChange={handleChange}
//                       placeholder="Enter institute name"
//                       required
//                     />
//                   </div>
//                   <div className="form-group">
//                     <label>
//                       Institute Type <span className="form-group-required">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       name="instituteType"
//                       value={formData.instituteType}
//                       onChange={handleChange}
//                       placeholder="School, College, University, etc."
//                       required
//                     />
//                   </div>
//                 </div>
//                 <div className="form-group">
//                   <label>Address</label>
//                   <input
//                     type="text"
//                     name="address"
//                     value={formData.address}
//                     onChange={handleChange}
//                     placeholder="Enter address"
//                   />
//                 </div>
//                 <div className="form-row">
//                   <div className="form-group">
//                     <label>City</label>
//                     <input
//                       type="text"
//                       name="city"
//                       value={formData.city}
//                       onChange={handleChange}
//                       placeholder="Enter city"
//                     />
//                   </div>
//                   <div className="form-group">
//                     <label>State</label>
//                     <input
//                       type="text"
//                       name="state"
//                       value={formData.state}
//                       onChange={handleChange}
//                       placeholder="Enter state"
//                     />
//                   </div>
//                   <div className="form-group">
//                     <label>Pincode</label>
//                     <input
//                       type="text"
//                       name="pincode"
//                       value={formData.pincode}
//                       onChange={handleChange}
//                       placeholder="Enter pincode"
//                     />
//                   </div>
//                 </div>
//                 <button type="submit" className="next-btn">
//                   Next →
//                 </button>
//               </form>
//             </>
//           )}

//           {activeStep === "Logo Upload" && (
//             <>
//               <h2>Logo Upload</h2>
//               <p>Upload your institute's logo</p>
//               <form onSubmit={(e) => handleSubmit(e, "Branch Setup")}>
//                 <div className="logo-upload-section">
//                   <div className="upload-box">
//                     <input type="file" accept="image/jpeg,image/png,image/svg+xml" onChange={handleLogoChange} />
//                     <button type="button" className="upload-btn">
//                       Upload Logo
//                     </button>
//                     {logoFile && <p>Selected file: {logoFile.name}</p>}
//                     {logoError && <p className="error">{logoError}</p>}
//                     {formData.logoUrl && (
//                       <div className="logo-preview">
//                         <p>Current Logo:</p>
//                         <img
//                           src={formData.logoUrl || "/placeholder.svg"}
//                           alt="Institute Logo"
//                           style={{ maxWidth: "200px" }}
//                         />
//                       </div>
//                     )}
//                   </div>
//                   <p>
//                     Upload a logo that represents your institute. This will appear in the header of the application.
//                   </p>
//                   <div className="logo-requirements">
//                     <h4>Logo Requirements:</h4>
//                     <ul>
//                       <li>Width: Between 100px and 400px</li>
//                       <li>Height: Between 50px and 200px</li>
//                       <li>Maximum file size: 500KB</li>
//                       <li>Supported formats: JPG, PNG, SVG</li>
//                       <li>Recommended: Use a transparent background for better integration</li>
//                     </ul>
//                   </div>
//                 </div>
//                 <button type="submit" className="next-btn">
//                   Next →
//                 </button>
//               </form>
//             </>
//           )}

//           {activeStep === "Branch Setup" && (
//             <>
//               <h2>Center Management</h2>
//               <p>Set up centers for your institute</p>
//               <button
//                 className="add-branch-btn"
//                 onClick={() => {
//                   setShowModal(true)
//                   setCurrentBranch(null)
//                   setBranchForm({
//                     name: "",
//                     addressLine1: "",
//                     addressLine2: "",
//                     city: "",
//                     state: "",
//                     postalCode: "",
//                     country: "India",
//                     isActive: true,
//                   })
//                 }}
//               >
//                 + Add Center
//               </button>
//               <div className="branch-table">
//                 <div className="table-header">
//                   <span>Name</span>
//                   <span>Address</span>
//                   <span>Status</span>
//                   <span>Actions</span>
//                 </div>
//                 {branches.map((branch) => (
//                   <div key={branch.id} className="table-row">
//                     <span>{branch.name}</span>
//                     <span>
//                       {branch.addressLine1}, {branch.city}, {branch.state}, {branch.postalCode}
//                     </span>
//                     <span className="status">
//                       <span className={`status-dot ${branch.isActive ? "active" : "inactive"}`}></span>
//                       {branch.isActive ? "Active" : "Inactive"}
//                     </span>
//                     <span className="actions">
//                       <FaEdit className="action-icon" onClick={() => handleEditBranch(branch)} />
//                       <FaTrash className="action-icon delete" onClick={() => handleDeleteBranch(branch.id)} />
//                     </span>
//                   </div>
//                 ))}
//               </div>
//               <button className="next-btn" onClick={() => setActiveStep("Contact Information")}>
//                 Next →
//               </button>
//             </>
//           )}

//           {activeStep === "Contact Information" && (
//             <>
//               <h2>Contact Information</h2>
//               <p>Add contact details for your institute</p>
//               <form onSubmit={(e) => handleSubmit(e, "System Configuration")}>
//                 <div className="form-row">
//                   <div className="form-group">
//                     <label>
//                       Email Address <span className="form-group-required">*</span>
//                     </label>
//                     <input
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       placeholder="Enter email"
//                       required
//                     />
//                   </div>
//                   <div className="form-group">
//                     <label>
//                       Phone Number <span className="form-group-required">*</span>
//                     </label>
//                     <input
//                       type="tel"
//                       name="phoneNumber"
//                       value={formData.phoneNumber}
//                       onChange={handleChange}
//                       placeholder="Enter phone number"
//                       required
//                     />
//                   </div>
//                 </div>
//                 <div className="form-group">
//                   <label>Website</label>
//                   <input
//                     type="url"
//                     name="website"
//                     value={formData.website}
//                     onChange={handleChange}
//                     placeholder="Enter website URL"
//                   />
//                 </div>
//                 <button type="submit" className="next-btn">
//                   Next →
//                 </button>
//               </form>
//             </>
//           )}

//           {activeStep === "System Configuration" && (
//             <>
//               <h2>System Configuration</h2>
//               <p>Configure the system settings for your needs</p>
//               <form onSubmit={(e) => handleSubmit(e, null)}>
//                 <div className="section">
//                   <h3>Academic Year</h3>
//                   <p>Configure your academic year settings for better organization of courses and batches.</p>
//                   <div className="form-row">
//                     <div className="form-group">
//                       <label>Academic Year Start</label>
//                       <input
//                         type="date"
//                         name="academicYearStart"
//                         value={formData.academicYearStart}
//                         onChange={handleChange}
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label>Academic Year End</label>
//                       <input
//                         type="date"
//                         name="academicYearEnd"
//                         value={formData.academicYearEnd}
//                         onChange={handleChange}
//                       />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="section">
//                   <h3>System Preferences</h3>
//                   <p>Set up your system preferences for notifications and other settings.</p>
//                   <div className="form-group">
//                     <label>Timezone</label>
//                     <select name="timezone" value={formData.timezone} onChange={handleChange}>
//                       <option value="">Select timezone</option>
//                       <option value="UTC">UTC</option>
//                       <option value="Asia/Kolkata">Asia/Kolkata</option>
//                       <option value="America/New_York">America/New_York</option>
//                       <option value="Europe/London">Europe/London</option>
//                     </select>
//                   </div>
//                 </div>
//                 <button type="submit" className="complete-btn">
//                   Complete Setup
//                 </button>
//               </form>
//             </>
//           )}
//         </div>
//       </div>

//       {showModal && (
//         <div className="modal">
//           <div className="modal-content">
//             <h2>{currentBranch ? "Edit Center" : "Add Center"}</h2>
//             <form onSubmit={handleBranchSubmit}>
//               <div className="form-group">
//                 <label>
//                   Center Name <span className="form-group-required">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={branchForm.name}
//                   onChange={handleBranchChange}
//                   placeholder="Enter Center name"
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label>
//                   Address Line 1 <span className="form-group-required">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="addressLine1"
//                   value={branchForm.addressLine1}
//                   onChange={handleBranchChange}
//                   placeholder="Enter address line 1"
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Address Line 2</label>
//                 <input
//                   type="text"
//                   name="addressLine2"
//                   value={branchForm.addressLine2}
//                   onChange={handleBranchChange}
//                   placeholder="Enter address line 2"
//                 />
//               </div>
//               <div className="form-row">
//                 <div className="form-group">
//                   <label>
//                     City <span className="form-group-required">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="city"
//                     value={branchForm.city}
//                     onChange={handleBranchChange}
//                     placeholder="Enter city"
//                     required
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>
//                     State <span className="form-group-required">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="state"
//                     value={branchForm.state}
//                     onChange={handleBranchChange}
//                     placeholder="Enter state"
//                     required
//                   />
//                 </div>
//               </div>
//               <div className="form-row">
//                 <div className="form-group">
//                   <label>
//                     Postal Code <span className="form-group-required">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="postalCode"
//                     value={branchForm.postalCode}
//                     onChange={handleBranchChange}
//                     placeholder="Enter postal code"
//                     required
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>
//                     Country <span className="form-group-required">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="country"
//                     value={branchForm.country}
//                     onChange={handleBranchChange}
//                     placeholder="Enter country"
//                     required
//                   />
//                 </div>
//               </div>
//               <div className="form-group">
//                 <label>
//                   <input type="checkbox" name="isActive" checked={branchForm.isActive} onChange={handleBranchChange} />
//                   Center is active
//                 </label>
//               </div>
//               <div className="modal-actions">
//                 <button type="button" onClick={() => setShowModal(false)}>
//                   Cancel
//                 </button>
//                 <button type="submit">Save Center</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default InstituteSetup


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
  });
  const [instituteId, setInstituteId] = useState(null);
  const [editModes, setEditModes] = useState({
    "Basic Information": false,
    "Logo Upload": false,
    "Branch Setup": false,
    "Contact Information": false,
    "System Configuration": false,
  });

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
        setBranches(branchList);
      }
    };
    fetchInstituteData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    const { name, value, type, checked } = e.target;
    setBranchForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
      });
      setCurrentBranch(null);
      const branchesSnapshot = await getDocs(collection(db, "instituteSetup", instituteId, "Center"));
      const branchList = branchesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBranches(branchList);
    } catch (error) {
      console.error("Error saving branch: ", error);
      alert("Error saving branch");
    }
  };

  const handleEditBranch = (branch) => {
    setCurrentBranch(branch);
    setBranchForm(branch);
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
                  });
                }}
              >
                + Add Center
              </button>
              <div className="branch-table">
                <div className="table-header">
                  <span>Name</span>
                  <span>Address</span>
                  <span>Status</span>
                  <span>Actions</span>
                </div>
                {branches.map((branch) => (
                  <div key={branch.id} className="table-row">
                    <span>{branch.name}</span>
                    <span>
                      {branch.addressLine1}, {branch.city}, {branch.state}, {branch.postalCode}
                    </span>
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
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        required
                      />
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