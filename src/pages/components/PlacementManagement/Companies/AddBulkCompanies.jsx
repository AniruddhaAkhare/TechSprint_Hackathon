// import React, { useState } from "react";
// import { db } from "../../../../config/firebase";
// import { addDoc, collection, serverTimestamp, writeBatch, doc } from "firebase/firestore";
// import { useAuth } from "../../../../context/AuthContext";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import * as XLSX from "xlsx";

// const domains = ["Finance", "IT", "Healthcare", "Education", "Manufacturing", "Retail", "Other"];
// const companyTypes = ["Mid-level", "Startup", "MNC"];
// const countryCodes = [
//   { code: "1", label: "USA (1)" },
//   { code: "1", label: "Canada (1)" },
//   { code: "91", label: "India (91)" },
// ];

// const AddBulkCompanies = ({ isOpen, toggleSidebar, fetchCompanies }) => {
//   const { user, rolePermissions } = useAuth();
//   const [file, setFile] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   const canCreate = rolePermissions?.Companies?.create || false;
//   const canDisplay = rolePermissions?.Companies?.display || false;

//   // Log user activity to Firestore
//   const logActivity = async (action, details) => {
//     try {
//       const activityLog = {
//         action,
//         details,
//         timestamp: new Date().toISOString(),
//         userEmail: user?.email || "anonymous",
//         userId: user.uid,
//       };
//       await addDoc(collection(db, "activityLogs"), activityLog);
//     } catch (error) {
//       console.error("Error logging activity:", error);
//     }
//   };

//   // Validate email format
//   const validateEmail = (email) => {
//     if (!email) return true;
//     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//   };

//   // Validate phone number (7-15 digits)
//   const validatePhone = (phone) => {
//     if (!phone) return true;
//     return /^\d{7,15}$/.test(phone);
//   };

//   // Validate URL format
//   const validateUrl = (url) => {
//     if (!url) return true;
//     try {
//       new URL(url);
//       return true;
//     } catch {
//       return false;
//     }
//   };

//   // Generate and download Excel template
//   const downloadTemplate = () => {
//     const templateData = [
//       {
//         Name: "",
//         Address: "",
//         City: "",
//         CompanyType: "Mid-level|Startup|MNC",
//         Domain: "Finance|IT|Healthcare|Education|Manufacturing|Retail|Other",
//         Email: "",
//         Status: "Active|Inactive",
//         Url: "",
//         POC_Name: "",
//         POC_Email: "",
//         POC_CountryCode: "1|91",
//         POC_Phone: "",
//         POC_Designation: "",
//         POC_LinkedInProfile: "",
//       },
//     ];
//     const ws = XLSX.utils.json_to_sheet(templateData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Companies");
//     XLSX.writeFile(wb, "Companies_Template.xlsx");
//     logActivity("DOWNLOAD_TEMPLATE", { template: "Companies_Template.xlsx" });
//   };

//   // Handle file selection and validation
//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (
//       selectedFile &&
//       selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     ) {
//       setFile(selectedFile);
//       logActivity("SELECT_FILE", { fileName: selectedFile.name });
//       toast.info(`Selected file: ${selectedFile.name}`);
//     } else {
//       console.error("Invalid file type:", selectedFile?.type);
//       toast.error("Please upload a valid XLSX file.");
//       setFile(null);
//     }
//   };

//   // Process and upload Excel file data
//   const handleUpload = async () => {
//     if (!canCreate) {
//       console.error("Permission denied: User lacks 'create' permission for Companies");
//       toast.error("You don't have permission to create companies. Contact your administrator.");
//       logActivity("PERMISSION_DENIED", { action: "CREATE_COMPANY_BULK", userId: user.uid });
//       return;
//     }
//     if (!file) {
//       toast.error("Please select a file to upload");
//       return;
//     }

//     setUploading(true);
//     try {
//       const reader = new FileReader();
//       reader.onload = async (e) => {
//         try {
//           const data = new Uint8Array(e.target.result);
//           const workbook = XLSX.read(data, { type: "array" });
//           const sheetName = workbook.SheetNames[0];
//           const worksheet = workbook.Sheets[sheetName];
//           const jsonData = XLSX.utils.sheet_to_json(worksheet);
//           console.log("Parsed XLSX Data:", JSON.stringify(jsonData, null, 2));

//           if (jsonData.length === 0) {
//             console.error("Excel file is empty");
//             toast.error("The uploaded Excel file is empty.");
//             setUploading(false);
//             return;
//           }

//           // Validate headers
//           const expectedHeaders = [
//             "Name",
//             "Address",
//             "City",
//             "CompanyType",
//             "Domain",
//             "Email",
//             "Status",
//             "Url",
//             "POC_Name",
//             "POC_Email",
//             "POC_CountryCode",
//             "POC_Phone",
//             "POC_Designation",
//             "POC_LinkedInProfile",
//           ];
//           const headers = Object.keys(jsonData[0] || {});
//           const missingHeaders = expectedHeaders.filter((h) => !headers.includes(h));
//           if (missingHeaders.length > 0) {
//             console.error("Missing headers:", missingHeaders);
//             toast.error(`Missing required columns in XLSX: ${missingHeaders.join(", ")}. Please use the provided template.`);
//             setUploading(false);
//             return;
//           }

//           const batch = writeBatch(db);
//           let successCount = 0;
//           let errorMessages = [];

//           jsonData.forEach((row, index) => {
//             const rowNumber = index + 2; // Excel rows start at 1, plus header row
//             // Extract and trim fields
//             const name = row["Name"]?.toString().trim() || "";
//             const address = row["Address"]?.toString().trim() || "";
//             const city = row["City"]?.toString().trim() || "";
//             const companyType = row["CompanyType"]?.toString().trim() || "";
//             const domain = row["Domain"]?.toString().trim() || "";
//             const email = row["Email"]?.toString().trim() || "";
//             const status = row["Status"]?.toString().trim() || "Active";
//             const url = row["Url"]?.toString().trim() || "";
//             const pocName = row["POC_Name"]?.toString().trim() || "";
//             const pocEmail = row["POC_Email"]?.toString().trim() || "";
//             const pocCountryCode = row["POC_CountryCode"]?.toString().trim() || "";
//             const pocPhone = row["POC_Phone"]?.toString().trim() || "";
//             const pocDesignation = row["POC_Designation"]?.toString().trim() || "";
//             const pocLinkedInProfile = row["POC_LinkedInProfile"]?.toString().trim() || "";

//             // Log row data for debugging
//             console.log(`Row ${rowNumber} Data:`, row);

//             // Validate company fields
//             if (!name) {
//               errorMessages.push(`Row ${rowNumber}: Missing Name for company. Please provide a company name.`);
//               return;
//             }
//             if (companyType && !companyTypes.includes(companyType)) {
//               errorMessages.push(
//                 `Row ${rowNumber}: Invalid CompanyType for company "${name}". Must be one of: ${companyTypes.join(", ")}.`
//               );
//               return;
//             }
//             if (!validateEmail(email) && email) {
//               errorMessages.push(`Row ${rowNumber}: Invalid Email for company "${name}". Please use a valid email format.`);
//               return;
//             }
//             if (domain && !domains.includes(domain)) {
//               errorMessages.push(
//                 `Row ${rowNumber}: Invalid Domain for company "${name}". Must be one of: ${domains.join(", ")}.`
//               );
//               return;
//             }
//             if (status && !["Active", "Inactive"].includes(status)) {
//               errorMessages.push(
//                 `Row ${rowNumber}: Invalid Status for company "${name}". Must be Active or Inactive.`
//               );
//               return;
//             }
//             if (url && !validateUrl(url)) {
//               errorMessages.push(`Row ${rowNumber}: Invalid Url for company "${name}". Please use a valid URL (e.g., https://example.com).`);
//               return;
//             }

//             // Validate POC fields
//             if (pocEmail && !validateEmail(pocEmail)) {
//               errorMessages.push(`Row ${rowNumber}: Invalid POC Email for company "${name}". POC: ${pocName || "Unnamed"}. Please use a valid email format.`);
//               return;
//             }
//             if (pocPhone && !validatePhone(pocPhone)) {
//               errorMessages.push(
//                 `Row ${rowNumber}: Invalid POC Phone for company "${name}". POC: ${pocName || "Unnamed"}. Must be 7-15 digits.`
//               );
//               return;
//             }
//             if (pocCountryCode && !countryCodes.some((cc) => cc.code === pocCountryCode)) {
//               errorMessages.push(
//                 `Row ${rowNumber}: Invalid POC Country Code for company "${name}". POC: ${pocName || "Unnamed"}. Must be 1 or 91.`
//               );
//               return;
//             }
//             if (pocLinkedInProfile && !validateUrl(pocLinkedInProfile)) {
//               errorMessages.push(
//                 `Row ${rowNumber}: Invalid POC LinkedInProfile for company "${name}". POC: ${pocName || "Unnamed"}. Please use a valid URL.`
//               );
//               return;
//             }

//             // Construct POC array
//             let pointsOfContact = [];
//             if (pocName || pocEmail || pocCountryCode || pocPhone || pocDesignation || pocLinkedInProfile) {
//               pointsOfContact.push({
//                 name: pocName,
//                 email: pocEmail,
//                 countryCode: pocCountryCode,
//                 mobile: pocPhone,
//                 designation: pocDesignation,
//                 linkedInProfile: pocLinkedInProfile,
//               });
//             }

//             // Prepare company data for Firestore
//             const companyData = {
//               name,
//               address,
//               city,
//               companyType: companyTypes.includes(companyType) ? companyType : "",
//               createdAt: serverTimestamp(),
//               domain: domains.includes(domain) ? domain : "",
//               email,
//               status: ["Active", "Inactive"].includes(status) ? status : "Active",
//               url,
//               pointsOfContact,
//               userId: user.uid,
//             };

//             console.log(`Row ${rowNumber}: Company Data for ${name}:`, companyData);

//             // Add to batch
//             const docRef = doc(collection(db, "Companies"));
//             batch.set(docRef, companyData);
//             successCount++;
//             logActivity("CREATE_COMPANY_BULK", { name: name || "Unnamed", companyId: docRef.id });
//           });

//           // Commit batch if there are valid rows
//           if (successCount > 0) {
//             await batch.commit();
//             console.log(`Batch committed successfully. ${successCount} companies added.`);
//             toast.success(`${successCount} companies uploaded successfully!`);
//             await fetchCompanies();
//           } else {
//             console.error("No valid rows to upload");
//             toast.warn("No valid rows were uploaded. Check the Excel file for errors (see console for details).");
//           }

//           // Display any validation errors
//           if (errorMessages.length > 0) {
//             errorMessages.forEach((msg) => {
//               console.error(msg);
//               toast.error(msg, { autoClose: 7000 });
//             });
//             toast.warn(`${errorMessages.length} rows had issues. Please correct the errors and try again.`, { autoClose: 7000 });
//           }

//           setFile(null);
//           toggleSidebar();
//         } catch (error) {
//           console.error("Error processing Excel file:", error);
//           toast.error(`Failed to process Excel file: ${error.message}`);
//           setUploading(false);
//         }
//       };
//       reader.onerror = () => {
//         console.error("Error reading file");
//         toast.error("Error reading the uploaded file.");
//         setUploading(false);
//       };
//       reader.readAsArrayBuffer(file);
//     } catch (error) {
//       console.error("Upload failed:", error.code, error.message);
//       toast.error(`Failed to upload companies: ${error.message}`);
//       setUploading(false);
//     }
//   };

//   // Close sidebar and log action
//   const handleClose = () => {
//     toggleSidebar();
//     logActivity("CLOSE_BULK_SIDEBAR", {});
//   };

//   if (!canDisplay) return null;

//   return (
//     <>
//       <ToastContainer position="top-right" autoClose={3500} />
//       <div
//         className={`fixed inset-y-0 right-0 z-50 bg-white w-full sm:w-3/4 md:w-2/5 shadow-lg transform transition-transform duration-300 ${
//           isOpen ? "translate-x-0" : "translate-x-full"
//         } p-4 sm:p-6 overflow-y-auto`}
//       >
//         <div className="flex justify-between items-center mb-4 sm:mb-6">
//           <h1 className="text-lg sm:text-xl font-bold text-gray-800">Add Bulk Companies</h1>
//           <button
//             type="button"
//             onClick={handleClose}
//             className="bg-blue-500 text-white p-4 rounded-md hover:bg-blue-600 transition duration-200"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         <div className="space-y-4 sm:space-y-6">
//           <div>
//             <h2 className="text-lg font-medium text-gray-700">Step 1: Download Template</h2>
//             <p className="text-gray-600 text-sm mb-2">
//               Download the XLSX template, fill in the company details, and upload the file. All fields
//               are optional except for proper formatting. POC fields (Name, Email, CountryCode, Phone, Designation, LinkedInProfile) are in separate columns.
//             </p>
//             <button
//               type="button"
//               onClick={downloadTemplate}
//               className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
//             >
//               Download Template
//             </button>
//           </div>

//           <div>
//             <h2 className="text-lg font-medium text-gray-700">Step 2: Upload Filled Template</h2>
//             <input
//               type="file"
//               accept=".xlsx"
//               onChange={handleFileChange}
//               disabled={!canCreate}
//               className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
//             />
//           </div>

//           <div className="flex justify-end mt-4">
//             <button
//               type="button"
//               onClick={handleUpload}
//               disabled={!file || uploading || !canCreate}
//               className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
//             >
//               {uploading ? "Uploading..." : "Upload Companies"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AddBulkCompanies;



import React, { useState } from "react";
import { db } from "../../../../config/firebase";
import { addDoc, collection, serverTimestamp, writeBatch, doc } from "firebase/firestore";
import { useAuth } from "../../../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";

const domains = ["Finance", "IT", "Healthcare", "Education", "Manufacturing", "Retail", "Other"];
const companyTypes = ["Mid-level", "Startup", "MNC"];
const countryCodes = [
  { code: "1", label: "USA (1)" },
  { code: "1", label: "Canada (1)" },
  { code: "91", label: "India (91)" },
];

const AddBulkCompanies = ({ isOpen, toggleSidebar, fetchCompanies }) => {
  const { user, rolePermissions } = useAuth();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const canCreate = rolePermissions?.Companies?.create || false;
  const canDisplay = rolePermissions?.Companies?.display || false;

  // Log user activity to Firestore
  const logActivity = async (action, details) => {
    try {
      const activityLog = {
        action,
        details,
        timestamp: new Date().toISOString(),
        userEmail: user?.email || "anonymous",
        userId: user.uid,
      };
      await addDoc(collection(db, "activityLogs"), activityLog);
    } catch (error) {
      //console.error("Error logging activity:", error);
    }
  };

  // Validate email format
  const validateEmail = (email) => {
    if (!email) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Validate phone number (7-15 digits)
  const validatePhone = (phone) => {
    if (!phone) return true;
    return /^\d{7,15}$/.test(phone);
  };

  // Validate URL format
  const validateUrl = (url) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Generate and download Excel template
  const downloadTemplate = () => {
    const templateData = [
      {
        Name: "",
        Address: "",
        City: "",
        CompanyType: "Mid-level|Startup|MNC",
        Domain: "Finance|IT|Healthcare|Education|Manufacturing|Retail|Other",
        Email: "",
        Status: "Active|Inactive",
        Url: "",
        POC_Name: "",
        POC_Email: "",
        POC_CountryCode: "1|91",
        POC_Phone: "",
        POC_Designation: "",
        POC_LinkedInProfile: "",
      },
    ];
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Companies");
    XLSX.writeFile(wb, "Companies_Template.xlsx");
    logActivity("DOWNLOAD_TEMPLATE", { template: "Companies_Template.xlsx" });
  };

  // Handle file selection and validation
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (
      selectedFile &&
      selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setFile(selectedFile);
      logActivity("SELECT_FILE", { fileName: selectedFile.name });
      toast.info(`Selected file: ${selectedFile.name}`);
    } else {
      console.error("Invalid file type:", selectedFile?.type);
      toast.error("Please upload a valid XLSX file.");
      setFile(null);
    }
  };

  // Process and upload Excel file data
  const handleUpload = async () => {
    if (!canCreate) {
      console.error("Permission denied: User lacks 'create' permission for Companies");
      toast.error("You don't have permission to create companies. Contact your administrator.");
      logActivity("PERMISSION_DENIED", { action: "CREATE_COMPANY_BULK", userId: user.uid });
      return;
    }
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          console.log("Parsed XLSX Data:", JSON.stringify(jsonData, null, 2));

          if (jsonData.length === 0) {
            console.error("Excel file is empty");
            toast.error("The uploaded Excel file is empty.");
            setUploading(false);
            return;
          }

          // Validate headers
          const expectedHeaders = [
            "Name",
            "Address",
            "City",
            "CompanyType",
            "Domain",
            "Email",
            "Status",
            "Url",
            "POC_Name",
            "POC_Email",
            "POC_CountryCode",
            "POC_Phone",
            "POC_Designation",
            "POC_LinkedInProfile",
          ];
          const headers = Object.keys(jsonData[0] || {});
          const missingHeaders = expectedHeaders.filter((h) => !headers.includes(h));
          if (missingHeaders.length > 0) {
            console.error("Missing headers:", missingHeaders);
            toast.error(`Missing required columns in XLSX: ${missingHeaders.join(", ")}. Please use the provided template.`);
            setUploading(false);
            return;
          }

          const batch = writeBatch(db);
          let successCount = 0;
          let errorMessages = [];

          jsonData.forEach((row, index) => {
            const rowNumber = index + 2; // Excel rows start at 1, plus header row
            // Extract and trim fields
            const name = row["Name"]?.toString().trim() || "";
            const address = row["Address"]?.toString().trim() || "";
            const city = row["City"]?.toString().trim() || "";
            const companyType = row["CompanyType"]?.toString().trim() || "";
            const domain = row["Domain"]?.toString().trim() || "";
            const email = row["Email"]?.toString().trim() || "";
            const status = row["Status"]?.toString().trim() || "Active";
            const url = row["Url"]?.toString().trim() || "";
            const pocName = row["POC_Name"]?.toString().trim() || "";
            const pocEmail = row["POC_Email"]?.toString().trim() || "";
            const pocCountryCode = row["POC_CountryCode"]?.toString().trim() || "";
            const pocPhone = row["POC_Phone"]?.toString().trim() || "";
            const pocDesignation = row["POC_Designation"]?.toString().trim() || "";
            const pocLinkedInProfile = row["POC_LinkedInProfile"]?.toString().trim() || "";

            // Log row data for debugging
            console.log(`Row ${rowNumber} Data:`, row);

            // Skip completely empty rows (where name is empty)
            if (!name) {
              console.log(`Row ${rowNumber}: Skipping empty row (no company name)`);
              return;
            }

            // Validate company fields only if they are provided
            if (companyType && !companyTypes.includes(companyType)) {
              errorMessages.push(
                `Row ${rowNumber}: Invalid CompanyType for company "${name}". Must be one of: ${companyTypes.join(", ")} or empty.`
              );
              return;
            }
            if (email && !validateEmail(email)) {
              errorMessages.push(`Row ${rowNumber}: Invalid Email for company "${name}". Please use a valid email format or leave empty.`);
              return;
            }
            if (domain && !domains.includes(domain)) {
              errorMessages.push(
                `Row ${rowNumber}: Invalid Domain for company "${name}". Must be one of: ${domains.join(", ")} or empty.`
              );
              return;
            }
            if (status && !["Active", "Inactive"].includes(status)) {
              errorMessages.push(
                `Row ${rowNumber}: Invalid Status for company "${name}". Must be Active, Inactive, or empty (defaults to Active).`
              );
              return;
            }
            if (url && !validateUrl(url)) {
              errorMessages.push(`Row ${rowNumber}: Invalid Url for company "${name}". Please use a valid URL (e.g., https://example.com) or leave empty.`);
              return;
            }

            // Validate POC fields only if they are provided
            if (pocEmail && !validateEmail(pocEmail)) {
              errorMessages.push(`Row ${rowNumber}: Invalid POC Email for company "${name}". POC: ${pocName || "Unnamed"}. Please use a valid email format or leave empty.`);
              return;
            }
            if (pocPhone && !validatePhone(pocPhone)) {
              errorMessages.push(
                `Row ${rowNumber}: Invalid POC Phone for company "${name}". POC: ${pocName || "Unnamed"}. Must be 7-15 digits or empty.`
              );
              return;
            }
            if (pocCountryCode && !countryCodes.some((cc) => cc.code === pocCountryCode)) {
              errorMessages.push(
                `Row ${rowNumber}: Invalid POC Country Code for company "${name}". POC: ${pocName || "Unnamed"}. Must be 1 or 91, or empty.`
              );
              return;
            }
            if (pocLinkedInProfile && !validateUrl(pocLinkedInProfile)) {
              errorMessages.push(
                `Row ${rowNumber}: Invalid POC LinkedInProfile for company "${name}". POC: ${pocName || "Unnamed"}. Please use a valid URL or leave empty.`
              );
              return;
            }

            // Construct POC array only if at least one POC field is provided
            let pointsOfContact = [];
            if (pocName || pocEmail || pocCountryCode || pocPhone || pocDesignation || pocLinkedInProfile) {
              pointsOfContact.push({
                name: pocName,
                email: pocEmail,
                countryCode: pocCountryCode,
                mobile: pocPhone,
                designation: pocDesignation,
                linkedInProfile: pocLinkedInProfile,
              });
            }

            // Prepare company data for Firestore
            const companyData = {
              name,
              address,
              city,
              companyType: companyTypes.includes(companyType) ? companyType : "",
              createdAt: serverTimestamp(),
              domain: domains.includes(domain) ? domain : "",
              email,
              status: ["Active", "Inactive"].includes(status) ? status : "Active",
              url,
              pointsOfContact,
              userId: user.uid,
            };

            console.log(`Row ${rowNumber}: Company Data for ${name}:`, companyData);

            // Add to batch
            const docRef = doc(collection(db, "Companies"));
            batch.set(docRef, companyData);
            successCount++;
            logActivity("CREATE_COMPANY_BULK", { name: name || "Unnamed", companyId: docRef.id });
          });

          // Commit batch if there are valid rows
          if (successCount > 0) {
            await batch.commit();
            console.log(`Batch committed successfully. ${successCount} companies added.`);
            toast.success(`${successCount} companies uploaded successfully!`);
            await fetchCompanies();
          } else {
            console.error("No valid rows to upload");
            toast.warn("No valid companies were found in the Excel file. At least a company name is required.");
          }

          // Display any validation errors
          if (errorMessages.length > 0) {
            errorMessages.forEach((msg) => {
              console.error(msg);
              toast.error(msg, { autoClose: 7000 });
            });
            toast.warn(`${errorMessages.length} rows had issues. Please correct the errors and try again.`, { autoClose: 7000 });
          }

          setFile(null);
          toggleSidebar();
        } catch (error) {
          console.error("Error processing Excel file:", error);
          toast.error(`Failed to process Excel file: ${error.message}`);
          setUploading(false);
        }
      };
      reader.onerror = () => {
        console.error("Error reading file");
        toast.error("Error reading the uploaded file.");
        setUploading(false);
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Upload failed:", error.code, error.message);
      toast.error(`Failed to upload companies: ${error.message}`);
      setUploading(false);
    }
  };

  // Close sidebar and log action
  const handleClose = () => {
    toggleSidebar();
    logActivity("CLOSE_BULK_SIDEBAR", {});
  };

  if (!canDisplay) return null;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3500} />
      <div
        className={`fixed inset-y-0 right-0 z-50 bg-white w-full sm:w-3/4 md:w-2/5 shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } p-4 sm:p-6 overflow-y-auto`}
      >
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">Add Bulk Companies</h1>
          <button
            type="button"
            onClick={handleClose}
            className="bg-blue-500 text-white p-4 rounded-md hover:bg-blue-600 transition duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div>
            <h2 className="text-lg font-medium text-gray-700">Step 1: Download Template</h2>
            <p className="text-gray-600 text-sm mb-2">
              Download the XLSX template and fill in the company details. All fields are optional except for proper formatting when provided.
            </p>
            <button
              type="button"
              onClick={downloadTemplate}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Download Template
            </button>
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-700">Step 2: Upload Filled Template</h2>
            <input
              type="file"
              accept=".xlsx"
              onChange={handleFileChange}
              disabled={!canCreate}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={handleUpload}
              disabled={!file || uploading || !canCreate}
              className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {uploading ? "Uploading..." : "Upload Companies"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddBulkCompanies;