// // // // // // // import React, { useState } from "react";
// // // // // // // import { db } from "../../../../config/firebase";
// // // // // // // import { addDoc, collection, serverTimestamp } from "firebase/firestore";
// // // // // // // import { useAuth } from "../../../../context/AuthContext";
// // // // // // // import { ToastContainer, toast } from "react-toastify";
// // // // // // // import "react-toastify/dist/ReactToastify.css";
// // // // // // // import * as XLSX from "xlsx";

// // // // // // // const domains = ["Finance", "IT", "Healthcare", "Education", "Manufacturing", "Retail", "Other"];
// // // // // // // const companyTypes = ["Mid-level", "Startup", "MNC"];
// // // // // // // const countryCodes = [
// // // // // // //   { code: "+1", label: "USA (+1)" },
// // // // // // //   { code: "+1", label: "Canada (+1)" },
// // // // // // //   { code: "+91", label: "India (+91)" },

// // // // // // //   // ... (rest of the country codes remain unchanged)
// // // // // // // ];

// // // // // // // const AddBulkCompanies = ({ isOpen, toggleSidebar }) => {
// // // // // // //   const { user, rolePermissions } = useAuth();
// // // // // // //   const [file, setFile] = useState(null);
// // // // // // //   const [uploading, setUploading] = useState(false);

// // // // // // //   // Permission checks
// // // // // // //   const canCreate = rolePermissions?.Companies?.create || false;
// // // // // // //   const canDisplay = rolePermissions?.Companies?.display || false;

// // // // // // //   // Activity logging function
// // // // // // //   const logActivity = async (action, details) => {
// // // // // // //     try {
// // // // // // //       const activityLog = {
// // // // // // //         action,
// // // // // // //         details,
// // // // // // //         timestamp: new Date().toISOString(),
// // // // // // //         userEmail: user?.email || "anonymous",
// // // // // // //         userId: user.uid,
// // // // // // //       };
// // // // // // //       await addDoc(collection(db, "activityLogs"), activityLog);
// // // // // // //     } catch (error) {
// // // // // // //       console.error("Error logging activity:", error);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const validateEmail = (email) => {
// // // // // // //     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// // // // // // //   };

// // // // // // //   const validatePhone = (phone) => {
// // // // // // //     return /^\d{7,15}$/.test(phone);
// // // // // // //   };

// // // // // // //   const validateUrl = (url) => {
// // // // // // //     try {
// // // // // // //       new URL(url);
// // // // // // //       return true;
// // // // // // //     } catch {
// // // // // // //       return false;
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const validateDate = (date) => {
// // // // // // //     return !isNaN(Date.parse(date));
// // // // // // //   };

// // // // // // //   const downloadTemplate = () => {
// // // // // // //     const templateData = [
// // // // // // //       {
// // // // // // //         "Name": "",
// // // // // // //         "Address": "",
// // // // // // //         "City": "",
// // // // // // //         "CompanyType": "Mid-level|Startup|MNC",
// // // // // // //         "CreatedAt": "YYYY-MM-DD",
// // // // // // //         "Domain": "Finance|IT|Healthcare|Education|Manufacturing|Retail|Other",
// // // // // // //         "Email": "",
// // // // // // //         "FromDate": "YYYY-MM-DD",
// // // // // // //         "ToDate": "YYYY-MM-DD",
// // // // // // //         "Status": "Active|Inactive",
// // // // // // //         "Url": "",
// // // // // // //         "POC": "Name|Email|CountryCode|Phone|Designation|LinkedInProfile;Name2|Email2|CountryCode2|Phone2|Designation2|LinkedInProfile2",
// // // // // // //       },
// // // // // // //     ];
// // // // // // //     const ws = XLSX.utils.json_to_sheet(templateData);
// // // // // // //     const wb = XLSX.utils.book_new();
// // // // // // //     XLSX.utils.book_append_sheet(wb, ws, "Companies");
// // // // // // //     XLSX.writeFile(wb, "Companies_Template.xlsx");
// // // // // // //     logActivity("DOWNLOAD_TEMPLATE", { template: "Companies_Template.xlsx" });
// // // // // // //   };

// // // // // // //   const handleFileChange = (e) => {
// // // // // // //     const selectedFile = e.target.files[0];
// // // // // // //     if (selectedFile && selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
// // // // // // //       setFile(selectedFile);
// // // // // // //       logActivity("SELECT_FILE", { fileName: selectedFile.name });
// // // // // // //     } else {
// // // // // // //       toast.error("Please upload a valid XLSX file.");
// // // // // // //       setFile(null);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const handleUpload = async () => {
// // // // // // //     if (!canCreate) {
// // // // // // //       toast.error("You don't have permission to create companies");
// // // // // // //       return;
// // // // // // //     }
// // // // // // //     if (!file) {
// // // // // // //       toast.error("Please select a file to upload");
// // // // // // //       return;
// // // // // // //     }

// // // // // // //     setUploading(true);
// // // // // // //     try {
// // // // // // //       const reader = new FileReader();
// // // // // // //       reader.onload = async (e) => {
// // // // // // //         const data = new Uint8Array(e.target.result);
// // // // // // //         const workbook = XLSX.read(data, { type: "array" });
// // // // // // //         const sheetName = workbook.SheetNames[0];
// // // // // // //         const worksheet = workbook.Sheets[sheetName];
// // // // // // //         const jsonData = XLSX.utils.sheet_to_json(worksheet);

// // // // // // //         for (const row of jsonData) {
// // // // // // //           const name = row["Name"]?.toString().trim();
// // // // // // //           const address = row["Address"]?.toString().trim();
// // // // // // //           const city = row["City"]?.toString().trim();
// // // // // // //           const companyType = row["CompanyType"]?.toString().trim();
// // // // // // //           const createdAt = row["CreatedAt"]?.toString().trim();
// // // // // // //           const domain = row["Domain"]?.toString().trim();
// // // // // // //           const email = row["Email"]?.toString().trim();
// // // // // // //           const fromDate = row["FromDate"]?.toString().trim();
// // // // // // //           const toDate = row["ToDate"]?.toString().trim();
// // // // // // //           const status = row["Status"]?.toString().trim();
// // // // // // //           const url = row["Url"]?.toString().trim();
// // // // // // //           const pocString = row["POC"]?.toString().trim();

// // // // // // //           // Validate required fields
// // // // // // //           if (!name) {
// // // // // // //             toast.error(`Missing Name in row: ${JSON.stringify(row)}`);
// // // // // // //             continue;
// // // // // // //           }
// // // // // // //           if (!address) {
// // // // // // //             toast.error(`Missing Address in row: ${name}`);
// // // // // // //             continue;
// // // // // // //           }
// // // // // // //           if (!city) {
// // // // // // //             toast.error(`Missing City in row: ${name}`);
// // // // // // //             continue;
// // // // // // //           }
// // // // // // //           if (!companyType || !companyTypes.includes(companyType)) {
// // // // // // //             toast.error(`Invalid CompanyType in row: ${name}. Must be one of: ${companyTypes.join(", ")}`);
// // // // // // //             continue;
// // // // // // //           }
// // // // // // //           if (createdAt && !validateDate(createdAt)) {
// // // // // // //             toast.error(`Invalid CreatedAt date in row: ${name}`);
// // // // // // //             continue;
// // // // // // //           }
// // // // // // //           if (!validateEmail(email)) {
// // // // // // //             toast.error(`Invalid Email in row: ${name}`);
// // // // // // //             continue;
// // // // // // //           }
// // // // // // //           if (domain && !domains.includes(domain)) {
// // // // // // //             toast.error(`Invalid Domain in row: ${name}. Must be one of: ${domains.join(", ")}`);
// // // // // // //             continue;
// // // // // // //           }
// // // // // // //           if (fromDate && !validateDate(fromDate)) {
// // // // // // //             toast.error(`Invalid FromDate in row: ${name}`);
// // // // // // //             continue;
// // // // // // //           }
// // // // // // //           if (toDate && !validateDate(toDate)) {
// // // // // // //             toast.error(`Invalid ToDate in row: ${name}`);
// // // // // // //             continue;
// // // // // // //           }
// // // // // // //           if (status && !["Active", "Inactive"].includes(status)) {
// // // // // // //             toast.error(`Invalid Status in row: ${name}. Must be Active or Inactive`);
// // // // // // //             continue;
// // // // // // //           }
// // // // // // //           if (url && !validateUrl(url)) {
// // // // // // //             toast.error(`Invalid Url in row: ${name}`);
// // // // // // //             continue;
// // // // // // //           }

// // // // // // //           // Parse POC
// // // // // // //           let pointsOfContact = [];
// // // // // // //           if (pocString) {
// // // // // // //             const pocEntries = pocString.split(";");
// // // // // // //             for (const entry of pocEntries) {
// // // // // // //               const [pocName, pocEmail, countryCode, phone, designation, linkedinProfile] = entry
// // // // // // //                 .split("|")
// // // // // // //                 .map((s) => s?.trim());
// // // // // // //               if (!pocName || !pocEmail || !countryCode || !phone || !designation) {
// // // // // // //                 toast.error(`Invalid POC format in row: ${name}. POC: ${entry}`);
// // // // // // //                 continue;
// // // // // // //               }
// // // // // // //               if (!validateEmail(pocEmail)) {
// // // // // // //                 toast.error(`Invalid POC Email in row: ${name}. POC: ${pocName}`);
// // // // // // //                 continue;
// // // // // // //               }
// // // // // // //               if (!validatePhone(phone)) {
// // // // // // //                 toast.error(`Invalid POC Phone (must be 7-15 digits) in row: ${name}. POC: ${pocName}`);
// // // // // // //                 continue;
// // // // // // //               }
// // // // // // //               if (!countryCodes.some((cc) => cc.code === countryCode)) {
// // // // // // //                 toast.error(`Invalid POC Country Code in row: ${name}. POC: ${pocName}`);
// // // // // // //                 continue;
// // // // // // //               }
// // // // // // //               if (linkedinProfile && !validateUrl(linkedinProfile)) {
// // // // // // //                 toast.error(`Invalid POC LinkedInProfile in row: ${name}. POC: ${pocName}`);
// // // // // // //                 continue;
// // // // // // //               }
// // // // // // //               pointsOfContact.push({
// // // // // // //                 name: pocName,
// // // // // // //                 email: pocEmail,
// // // // // // //                 countryCode,
// // // // // // //                 phone,
// // // // // // //                 designation,
// // // // // // //                 linkedinProfile: linkedinProfile || "",
// // // // // // //               });
// // // // // // //             }
// // // // // // //           }

// // // // // // //           const companyData = {
// // // // // // //             name,
// // // // // // //             address,
// // // // // // //             city,
// // // // // // //             companyType,
// // // // // // //             createdAt: createdAt ? new Date(createdAt) : serverTimestamp(),
// // // // // // //             domain: domain || "",
// // // // // // //             email,
// // // // // // //             fromDate: fromDate ? new Date(fromDate) : null,
// // // // // // //             toDate: toDate ? new Date(toDate) : null,
// // // // // // //             status: status || "Active",
// // // // // // //             url: url || "",
// // // // // // //             pointsOfContact,
// // // // // // //           };

// // // // // // //           await addDoc(collection(db, "Companies"), companyData);
// // // // // // //           logActivity("CREATE_COMPANY_BULK", { name });
// // // // // // //         }

// // // // // // //         toast.success("Companies uploaded successfully!");
// // // // // // //         setFile(null);
// // // // // // //         toggleSidebar();
// // // // // // //         fetchCompanies();
// // // // // // //       };
// // // // // // //       reader.readAsArrayBuffer(file);
// // // // // // //     } catch (error) {
// // // // // // //       console.error("Error uploading companies:", error);
// // // // // // //       toast.error("Failed to upload companies. Please try again.");
// // // // // // //     } finally {
// // // // // // //       setUploading(false);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const handleClose = () => {
// // // // // // //     toggleSidebar();
// // // // // // //     logActivity("CLOSE_BULK_SIDEBAR", {});
// // // // // // //   };

// // // // // // //   if (!canDisplay) return null;

// // // // // // //   return (
// // // // // // //     <>
// // // // // // //       <ToastContainer position="top-right" autoClose={3000} />
// // // // // // //       <div
// // // // // // //         className={`fixed inset-y-0 right-0 z-50 bg-white w-full sm:w-3/4 md:w-2/5 shadow-lg transform transition-transform duration-300 ${
// // // // // // //           isOpen ? "translate-x-0" : "translate-x-full"
// // // // // // //         } p-4 sm:p-6 overflow-y-auto`}
// // // // // // //       >
// // // // // // //         <div className="flex justify-between items-center mb-4 sm:mb-6">
// // // // // // //           <h1 className="text-lg sm:text-xl font-bold text-gray-800">Add Bulk Companies</h1>
// // // // // // //           <button
// // // // // // //             onClick={handleClose}
// // // // // // //             className="bg-blue-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-200"
// // // // // // //           >
// // // // // // //             <svg
// // // // // // //               xmlns="http://www.w3.org/2000/svg"
// // // // // // //               className="h-5 w-5"
// // // // // // //               fill="none"
// // // // // // //               viewBox="0 0 24 24"
// // // // // // //               stroke="currentColor"
// // // // // // //             >
// // // // // // //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// // // // // // //             </svg>
// // // // // // //           </button>
// // // // // // //         </div>

// // // // // // //         <div className="space-y-4 sm:space-y-6">
// // // // // // //           <div>
// // // // // // //             <h2 className="text-sm font-medium text-gray-700">Step 1: Download Template</h2>
// // // // // // //             <p className="text-gray-600 text-sm mb-2">
// // // // // // //               Download the XLSX template, fill in the company details, and upload the file. The POC column should be formatted as:
// // // // // // //               <code>Name|Email|CountryCode|Phone|Designation|LinkedInProfile;Name2|Email2|CountryCode2|Phone2|Designation2|LinkedInProfile2</code>
// // // // // // //             </p>
// // // // // // //             <button
// // // // // // //               onClick={downloadTemplate}
// // // // // // //               className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
// // // // // // //             >
// // // // // // //               Download Template
// // // // // // //             </button>
// // // // // // //           </div>

// // // // // // //           <div>
// // // // // // //             <h2 className="text-sm font-medium text-gray-700">Step 2: Upload Filled Template</h2>
// // // // // // //             <input
// // // // // // //               type="file"
// // // // // // //               accept=".xlsx"
// // // // // // //               onChange={handleFileChange}
// // // // // // //               disabled={!canCreate}
// // // // // // //               className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
// // // // // // //             />
// // // // // // //           </div>

// // // // // // //           <div className="flex justify-end mt-4">
// // // // // // //             <button
// // // // // // //               onClick={handleUpload}
// // // // // // //               disabled={!file || uploading || !canCreate}
// // // // // // //               className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
// // // // // // //             >
// // // // // // //               {uploading ? "Uploading..." : "Upload Companies"}
// // // // // // //             </button>
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //       </div>
// // // // // // //     </>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default AddBulkCompanies;


// // // // // // import React, { useState } from "react";
// // // // // // import { db } from "../../../../config/firebase";
// // // // // // import { addDoc, collection, serverTimestamp, writeBatch } from "firebase/firestore";
// // // // // // import { useAuth } from "../../../../context/AuthContext";
// // // // // // import { ToastContainer, toast } from "react-toastify";
// // // // // // import "react-toastify/dist/ReactToastify.css";
// // // // // // import * as XLSX from "xlsx";

// // // // // // const domains = ["Finance", "IT", "Healthcare", "Education", "Manufacturing", "Retail", "Other"];
// // // // // // const companyTypes = ["Mid-level", "Startup", "MNC"];
// // // // // // const countryCodes = [
// // // // // //   { code: "+1", label: "USA (+1)" },
// // // // // //   { code: "+1", label: "Canada (+1)" },
// // // // // //   { code: "+91", label: "India (+91)" },
// // // // // //   // ... (rest of the country codes remain unchanged)
// // // // // // ];

// // // // // // const AddBulkCompanies = ({ isOpen, toggleSidebar, fetchCompanies }) => {
// // // // // //   const { user, rolePermissions } = useAuth();
// // // // // //   const [file, setFile] = useState(null);
// // // // // //   const [uploading, setUploading] = useState(false);

// // // // // //   // Permission checks
// // // // // //   const canCreate = rolePermissions?.Companies?.create || false;
// // // // // //   const canDisplay = rolePermissions?.Companies?.display || false;

// // // // // //   // Activity logging function
// // // // // //   const logActivity = async (action, details) => {
// // // // // //     try {
// // // // // //       const activityLog = {
// // // // // //         action,
// // // // // //         details,
// // // // // //         timestamp: new Date().toISOString(),
// // // // // //         userEmail: user?.email || "anonymous",
// // // // // //         userId: user.uid,
// // // // // //       };
// // // // // //       await addDoc(collection(db, "activityLogs"), activityLog);
// // // // // //     } catch (error) {
// // // // // //       console.error("Error logging activity:", error);
// // // // // //     }
// // // // // //   };

// // // // // //   const validateEmail = (email) => {
// // // // // //     return email ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) : false;
// // // // // //   };

// // // // // //   const validatePhone = (phone) => {
// // // // // //     return phone ? /^\d{7,15}$/.test(phone) : false;
// // // // // //   };

// // // // // //   const validateUrl = (url) => {
// // // // // //     try {
// // // // // //       if (!url) return true; // URL is optional
// // // // // //       new URL(url);
// // // // // //       return true;
// // // // // //     } catch {
// // // // // //       return false;
// // // // // //     }
// // // // // //   };

// // // // // //   const validateDate = (dateStr) => {
// // // // // //     if (!dateStr) return true; // Allow empty dates
// // // // // //     const date = new Date(dateStr);
// // // // // //     return !isNaN(date.getTime()) && dateStr.match(/^\d{4}-\d{2}-\d{2}$/);
// // // // // //   };

// // // // // //   const downloadTemplate = () => {
// // // // // //     const templateData = [
// // // // // //       {
// // // // // //         "Name": "",
// // // // // //         "Address": "",
// // // // // //         "City": "",
// // // // // //         "CompanyType": "Mid-level|Startup|MNC",
// // // // // //         "CreatedAt": "YYYY-MM-DD",
// // // // // //         "Domain": "Finance|IT|Healthcare|Education|Manufacturing|Retail|Other",
// // // // // //         "Email": "",
// // // // // //         "FromDate": "YYYY-MM-DD",
// // // // // //         "ToDate": "YYYY-MM-DD",
// // // // // //         "Status": "Active|Inactive",
// // // // // //         "Url": "",
// // // // // //         "POC": "Name|Email|CountryCode|Phone|Designation|LinkedInProfile;Name2|Email2|CountryCode2|Phone2|Designation2|LinkedInProfile2",
// // // // // //       },
// // // // // //     ];
// // // // // //     const ws = XLSX.utils.json_to_sheet(templateData);
// // // // // //     const wb = XLSX.utils.book_new();
// // // // // //     XLSX.utils.book_append_sheet(wb, ws, "Companies");
// // // // // //     XLSX.writeFile(wb, "Companies_Template.xlsx");
// // // // // //     logActivity("DOWNLOAD_TEMPLATE", { template: "Companies_Template.xlsx" });
// // // // // //   };

// // // // // //   const handleFileChange = (e) => {
// // // // // //     const selectedFile = e.target.files[0];
// // // // // //     if (selectedFile && selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
// // // // // //       setFile(selectedFile);
// // // // // //       logActivity("SELECT_FILE", { fileName: selectedFile.name });
// // // // // //       toast.info(`Selected file: ${selectedFile.name}`);
// // // // // //     } else {
// // // // // //       console.log("Invalid file type:", selectedFile?.type);
// // // // // //       toast.error("Please upload a valid XLSX file.");
// // // // // //       setFile(null);
// // // // // //     }
// // // // // //   };

// // // // // //   const handleUpload = async () => {
// // // // // //     if (!canCreate) {
// // // // // //       console.log("Permission denied: User lacks 'create' permission for Companies");
// // // // // //       toast.error("You don't have permission to create companies. Contact your administrator.");
// // // // // //       logActivity("PERMISSION_DENIED", { action: "CREATE_COMPANY_BULK", userId: user.uid });
// // // // // //       return;
// // // // // //     }
// // // // // //     if (!file) {
// // // // // //       toast.error("Please select a file to upload");
// // // // // //       return;
// // // // // //     }

// // // // // //     setUploading(true);
// // // // // //     try {
// // // // // //       const reader = new FileReader();
// // // // // //       reader.onload = async (e) => {
// // // // // //         const data = new Uint8Array(e.target.result);
// // // // // //         const workbook = XLSX.read(data, { type: "array" });
// // // // // //         const sheetName = workbook.SheetNames[0];
// // // // // //         const worksheet = workbook.Sheets[sheetName];
// // // // // //         const jsonData = XLSX.utils.sheet_to_json(worksheet);
// // // // // //         console.log("Parsed XLSX Data:", jsonData);

// // // // // //         // Validate headers
// // // // // //         const expectedHeaders = [
// // // // // //           "Name", "Address", "City", "CompanyType", "CreatedAt", "Domain",
// // // // // //           "Email", "FromDate", "ToDate", "Status", "Url", "POC"
// // // // // //         ];
// // // // // //         const headers = Object.keys(jsonData[0] || {});
// // // // // //         const missingHeaders = expectedHeaders.filter((h) => !headers.includes(h));
// // // // // //         if (missingHeaders.length > 0) {
// // // // // //           console.log("Missing headers:", missingHeaders);
// // // // // //           toast.error(`Missing required columns in XLSX: ${missingHeaders.join(", ")}`);
// // // // // //           setUploading(false);
// // // // // //           return;
// // // // // //         }

// // // // // //         const batch = writeBatch(db);
// // // // // //         let successCount = 0;
// // // // // //         let errorMessages = [];

// // // // // //         for (const row of jsonData) {
// // // // // //           const name = row["Name"]?.toString().trim();
// // // // // //           const address = row["Address"]?.toString().trim();
// // // // // //           const city = row["City"]?.toString().trim();
// // // // // //           const companyType = row["CompanyType"]?.toString().trim();
// // // // // //           const createdAt = row["CreatedAt"]?.toString().trim();
// // // // // //           const domain = row["Domain"]?.toString().trim();
// // // // // //           const email = row["Email"]?.toString().trim();
// // // // // //           const fromDate = row["FromDate"]?.toString().trim();
// // // // // //           const toDate = row["ToDate"]?.toString().trim();
// // // // // //           const status = row["Status"]?.toString().trim();
// // // // // //           const url = row["Url"]?.toString().trim();
// // // // // //           const pocString = row["POC"]?.toString().trim();

// // // // // //           // Validate required fields
// // // // // //           if (!name) {
// // // // // //             console.log(`Missing Name in row: ${JSON.stringify(row)}`);
// // // // // //             errorMessages.push(`Missing Name in row: ${JSON.stringify(row)}`);
// // // // // //             continue;
// // // // // //           }
// // // // // //           if (!address) {
// // // // // //             console.log(`Missing Address in row: ${name}`);
// // // // // //             errorMessages.push(`Missing Address in row: ${name}`);
// // // // // //             continue;
// // // // // //           }
// // // // // //           if (!city) {
// // // // // //             console.log(`Missing City in row: ${name}`);
// // // // // //             errorMessages.push(`Missing City in row: ${name}`);
// // // // // //             continue;
// // // // // //           }
// // // // // //           if (!companyType || !companyTypes.includes(companyType)) {
// // // // // //             console.log(`Invalid CompanyType in row: ${name}. Must be one of: ${companyTypes.join(", ")}`);
// // // // // //             errorMessages.push(`Invalid CompanyType in row: ${name}. Must be one of: ${companyTypes.join(", ")}`);
// // // // // //             continue;
// // // // // //           }
// // // // // //           if (createdAt && !validateDate(createdAt)) {
// // // // // //             console.log(`Invalid CreatedAt date in row: ${name}`);
// // // // // //             errorMessages.push(`Invalid CreatedAt date in row: ${name}`);
// // // // // //             continue;
// // // // // //           }
// // // // // //           if (!validateEmail(email)) {
// // // // // //             console.log(`Invalid Email in row: ${name}`);
// // // // // //             errorMessages.push(`Invalid Email in row: ${name}`);
// // // // // //             continue;
// // // // // //           }
// // // // // //           if (domain && !domains.includes(domain)) {
// // // // // //             console.log(`Invalid Domain in row: ${name}. Must be one of: ${domains.join(", ")}`);
// // // // // //             errorMessages.push(`Invalid Domain in row: ${name}. Must be one of: ${domains.join(", ")}`);
// // // // // //             continue;
// // // // // //           }
// // // // // //           if (fromDate && !validateDate(fromDate)) {
// // // // // //             console.log(`Invalid FromDate in row: ${name}`);
// // // // // //             errorMessages.push(`Invalid FromDate in row: ${name}`);
// // // // // //             continue;
// // // // // //           }
// // // // // //           if (toDate && !validateDate(toDate)) {
// // // // // //             console.log(`Invalid ToDate in row: ${name}`);
// // // // // //             errorMessages.push(`Invalid ToDate in row: ${name}`);
// // // // // //             continue;
// // // // // //           }
// // // // // //           if (status && !["Active", "Inactive"].includes(status)) {
// // // // // //             console.log(`Invalid Status in row: ${name}. Must be Active or Inactive`);
// // // // // //             errorMessages.push(`Invalid Status in row: ${name}. Must be Active or Inactive`);
// // // // // //             continue;
// // // // // //           }
// // // // // //           if (url && !validateUrl(url)) {
// // // // // //             console.log(`Invalid Url in row: ${name}`);
// // // // // //             errorMessages.push(`Invalid Url in row: ${name}`);
// // // // // //             continue;
// // // // // //           }

// // // // // //           // Parse POC
// // // // // //           let pointsOfContact = [];
// // // // // //           if (pocString) {
// // // // // //             const pocEntries = pocString.split(";");
// // // // // //             for (const entry of pocEntries) {
// // // // // //               const [pocName, pocEmail, countryCode, phone, designation, linkedinProfile] = entry
// // // // // //                 .split("|")
// // // // // //                 .map((s) => s?.trim());
// // // // // //               if (!pocName || !pocEmail || !countryCode || !phone || !designation) {
// // // // // //                 console.log(`Invalid POC format in row: ${name}. POC: ${entry}`);
// // // // // //                 errorMessages.push(`Invalid POC format in row: ${name}. POC: ${entry}`);
// // // // // //                 continue;
// // // // // //               }
// // // // // //               if (!validateEmail(pocEmail)) {
// // // // // //                 console.log(`Invalid POC Email in row: ${name}. POC: ${pocName}`);
// // // // // //                 errorMessages.push(`Invalid POC Email in row: ${name}. POC: ${pocName}`);
// // // // // //                 continue;
// // // // // //               }
// // // // // //               if (!validatePhone(phone)) {
// // // // // //                 console.log(`Invalid POC Phone in row: ${name}. POC: ${pocName}`);
// // // // // //                 errorMessages.push(`Invalid POC Phone (must be 7-15 digits) in row: ${name}. POC: ${pocName}`);
// // // // // //                 continue;
// // // // // //               }
// // // // // //               if (!countryCodes.some((cc) => cc.code === countryCode)) {
// // // // // //                 console.log(`Invalid POC Country Code in row: ${name}. POC: ${pocName}`);
// // // // // //                 errorMessages.push(`Invalid POC Country Code in row: ${name}. POC: ${pocName}`);
// // // // // //                 continue;
// // // // // //               }
// // // // // //               if (linkedinProfile && !validateUrl(linkedinProfile)) {
// // // // // //                 console.log(`Invalid POC LinkedInProfile in row: ${name}. POC: ${pocName}`);
// // // // // //                 errorMessages.push(`Invalid POC LinkedInProfile in row: ${name}. POC: ${pocName}`);
// // // // // //                 continue;
// // // // // //               }
// // // // // //               pointsOfContact.push({
// // // // // //                 name: pocName,
// // // // // //                 email: pocEmail,
// // // // // //                 countryCode,
// // // // // //                 phone,
// // // // // //                 designation,
// // // // // //                 linkedinProfile: linkedinProfile || "",
// // // // // //               });
// // // // // //             }
// // // // // //           }

// // // // // //           const companyData = {
// // // // // //             name,
// // // // // //             address,
// // // // // //             city,
// // // // // //             companyType,
// // // // // //             createdAt: createdAt ? new Date(createdAt) : serverTimestamp(),
// // // // // //             domain: domain || "",
// // // // // //             email,
// // // // // //             fromDate: fromDate ? new Date(fromDate) : null,
// // // // // //             toDate: toDate ? new Date(toDate) : null,
// // // // // //             status: status || "Active",
// // // // // //             url: url || "",
// // // // // //             pointsOfContact,
// // // // // //             userId: user.uid, // Include userId for permission checks
// // // // // //           };

// // // // // //           // const docRef = collection(db, "Companies"); // Reference to the collection
// // // // // //           // batch.set(doc(docRef), companyData); // Create a new document with an auto-generated ID

// // // // // //           const docRef = doc(collection(db, "Companies"));
// // // // // //           batch.set(docRef, companyData);

// // // // // //           successCount++;
// // // // // //           logActivity("CREATE_COMPANY_BULK", { name, companyId: docRef.id });
// // // // // //         }

// // // // // //         // Commit batch
// // // // // //         await batch.commit();
// // // // // //         if (successCount > 0) {
// // // // // //           toast.success(`${successCount} companies uploaded successfully!`);
// // // // // //           fetchCompanies(); // Refresh the company list
// // // // // //         }
// // // // // //         if (errorMessages.length > 0) {
// // // // // //           errorMessages.forEach((msg) => toast.error(msg));
// // // // // //           toast.warn(`${errorMessages.length} rows failed to upload. Check console for details.`);
// // // // // //         }
// // // // // //         setFile(null);
// // // // // //         toggleSidebar();
// // // // // //       };
// // // // // //       reader.readAsArrayBuffer(file);
// // // // // //     } catch (error) {
// // // // // //       console.error("Error uploading companies:", error);
// // // // // //       toast.error(`Failed to upload companies: ${error.message}`);
// // // // // //     } finally {
// // // // // //       setUploading(false);
// // // // // //     }
// // // // // //   };

// // // // // //   const handleClose = () => {
// // // // // //     toggleSidebar();
// // // // // //     logActivity("CLOSE_BULK_SIDEBAR", {});
// // // // // //   };

// // // // // //   if (!canDisplay) return null;

// // // // // //   return (
// // // // // //     <>
// // // // // //       <ToastContainer position="top-right" autoClose={3000} />
// // // // // //       <div
// // // // // //         className={`fixed inset-y-0 right-0 z-50 bg-white w-full sm:w-3/4 md:w-2/5 shadow-lg transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
// // // // // //           } p-4 sm:p-6 overflow-y-auto`}
// // // // // //       >
// // // // // //         <div className="flex justify-between items-center mb-4 sm:mb-6">
// // // // // //           <h1 className="text-lg sm:text-xl font-bold text-gray-800">Add Bulk Companies</h1>
// // // // // //           <button
// // // // // //             onClick={handleClose}
// // // // // //             className="bg-blue-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-200"
// // // // // //           >
// // // // // //             <svg
// // // // // //               xmlns="http://www.w3.org/2000/svg"
// // // // // //               className="h-5 w-5"
// // // // // //               fill="none"
// // // // // //               viewBox="0 0 24 24"
// // // // // //               stroke="currentColor"
// // // // // //             >
// // // // // //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// // // // // //             </svg>
// // // // // //           </button>
// // // // // //         </div>

// // // // // //         <div className="space-y-4 sm:space-y-6">
// // // // // //           <div>
// // // // // //             <h2 className="text-sm font-medium text-gray-700">Step 1: Download Template</h2>
// // // // // //             <p className="text-gray-600 text-sm mb-2">
// // // // // //               Download the XLSX template, fill in the company details, and upload the file. The POC column should be formatted as:
// // // // // //               <code>Name|Email|CountryCode|Phone|Designation|LinkedInProfile;Name2|Email2|CountryCode2|Phone2|Designation2|LinkedInProfile2</code>
// // // // // //             </p>
// // // // // //             <button
// // // // // //               onClick={downloadTemplate}
// // // // // //               className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
// // // // // //             >
// // // // // //               Download Template
// // // // // //             </button>
// // // // // //           </div>

// // // // // //           <div>
// // // // // //             <h2 className="text-sm font-medium text-gray-700">Step 2: Upload Filled Template</h2>
// // // // // //             <input
// // // // // //               type="file"
// // // // // //               accept=".xlsx"
// // // // // //               onChange={handleFileChange}
// // // // // //               disabled={!canCreate}
// // // // // //               className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
// // // // // //             />
// // // // // //           </div>

// // // // // //           <div className="flex justify-end mt-4">
// // // // // //             <button
// // // // // //               onClick={handleUpload}
// // // // // //               disabled={!file || uploading || !canCreate}
// // // // // //               className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
// // // // // //             >
// // // // // //               {uploading ? "Uploading..." : "Upload Companies"}
// // // // // //             </button>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     </>
// // // // // //   );
// // // // // // };

// // // // // // export default AddBulkCompanies;


// // // // // import React, { useState } from "react";
// // // // // import { db } from "../../../../config/firebase";
// // // // // import { addDoc, collection, serverTimestamp, writeBatch, doc } from "firebase/firestore";
// // // // // import { useAuth } from "../../../../context/AuthContext";
// // // // // import { ToastContainer, toast } from "react-toastify";
// // // // // import "react-toastify/dist/ReactToastify.css";
// // // // // import * as XLSX from "xlsx";

// // // // // const domains = ["Finance", "IT", "Healthcare", "Education", "Manufacturing", "Retail", "Other"];
// // // // // const companyTypes = ["Mid-level", "Startup", "MNC"];
// // // // // const countryCodes = [
// // // // //   { code: "+1", label: "USA (+1)" },
// // // // //   { code: "+1", label: "Canada (+1)" },
// // // // //   { code: "+91", label: "India (+91)" },
// // // // //   // Add other country codes as needed
// // // // // ];

// // // // // const AddBulkCompanies = ({ isOpen, toggleSidebar, fetchCompanies }) => {
// // // // //   const { user, rolePermissions } = useAuth();
// // // // //   const [file, setFile] = useState(null);
// // // // //   const [uploading, setUploading] = useState(false);

// // // // //   const canCreate = rolePermissions?.Companies?.create || false;
// // // // //   const canDisplay = rolePermissions?.Companies?.display || false;

// // // // //   const logActivity = async (action, details) => {
// // // // //     try {
// // // // //       const activityLog = {
// // // // //         action,
// // // // //         details,
// // // // //         timestamp: new Date().toISOString(),
// // // // //         userEmail: user?.email || "anonymous",
// // // // //         userId: user.uid,
// // // // //       };
// // // // //       await addDoc(collection(db, "activityLogs"), activityLog);
// // // // //     } catch (error) {
// // // // //       console.error("Error logging activity:", error);
// // // // //     }
// // // // //   };

// // // // //   const validateEmail = (email) => {
// // // // //     return email ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) : false;
// // // // //   };

// // // // //   const validatePhone = (phone) => {
// // // // //     return phone ? /^\d{7,15}$/.test(phone) : false;
// // // // //   };

// // // // //   const validateUrl = (url) => {
// // // // //     try {
// // // // //       if (!url) return true;
// // // // //       new URL(url);
// // // // //       return true;
// // // // //     } catch {
// // // // //       return false;
// // // // //     }
// // // // //   };

// // // // //   const validateDate = (dateStr) => {
// // // // //     if (!dateStr) return true;
// // // // //     const date = new Date(dateStr);
// // // // //     return !isNaN(date.getTime()) && dateStr.match(/^\d{4}-\d{2}-\d{2}$/);
// // // // //   };

// // // // //   const downloadTemplate = () => {
// // // // //     const templateData = [
// // // // //       {
// // // // //         Name: "",
// // // // //         Address: "",
// // // // //         City: "",
// // // // //         CompanyType: "Mid-level|Startup|MNC",
// // // // //         CreatedAt: "YYYY-MM-DD",
// // // // //         Domain: "Finance|IT|Healthcare|Education|Manufacturing|Retail|Other",
// // // // //         Email: "",
// // // // //         FromDate: "YYYY-MM-DD",
// // // // //         ToDate: "YYYY-MM-DD",
// // // // //         Status: "Active|Inactive",
// // // // //         Url: "",
// // // // //         POC: "Name|Email|CountryCode|Phone|Designation|LinkedInProfile",
// // // // //       },
// // // // //     ];
// // // // //     const ws = XLSX.utils.json_to_sheet(templateData);
// // // // //     const wb = XLSX.utils.book_new();
// // // // //     XLSX.utils.book_append_sheet(wb, ws, "Companies");
// // // // //     XLSX.writeFile(wb, "Companies_Template.xlsx");
// // // // //     logActivity("DOWNLOAD_TEMPLATE", { template: "Companies_Template.xlsx" });
// // // // //   };

// // // // //   const handleFileChange = (e) => {
// // // // //     const selectedFile = e.target.files[0];
// // // // //     if (selectedFile && selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
// // // // //       setFile(selectedFile);
// // // // //       logActivity("SELECT_FILE", { fileName: selectedFile.name });
// // // // //       toast.info(`Selected file: ${selectedFile.name}`);
// // // // //     } else {
// // // // //       console.log("Invalid file type:", selectedFile?.type);
// // // // //       toast.error("Please upload a valid XLSX file.");
// // // // //       setFile(null);
// // // // //     }
// // // // //   };

// // // // //   const handleUpload = async () => {
// // // // //     if (!canCreate) {
// // // // //       console.log("Permission denied: User lacks 'create' permission for Companies");
// // // // //       toast.error("You don't have permission to create companies. Contact your administrator.");
// // // // //       logActivity("PERMISSION_DENIED", { action: "CREATE_COMPANY_BULK", userId: user.uid });
// // // // //       return;
// // // // //     }
// // // // //     if (!file) {
// // // // //       toast.error("Please select a file to upload");
// // // // //       return;
// // // // //     }

// // // // //     setUploading(true);
// // // // //     try {
// // // // //       const reader = new FileReader();
// // // // //       reader.onload = async (e) => {
// // // // //         const data = new Uint8Array(e.target.result);
// // // // //         const workbook = XLSX.read(data, { type: "array" });
// // // // //         const sheetName = workbook.SheetNames[0];
// // // // //         const worksheet = workbook.Sheets[sheetName];
// // // // //         const jsonData = XLSX.utils.sheet_to_json(worksheet);
// // // // //         console.log("Parsed XLSX Data:", jsonData);

// // // // //         if (jsonData.length === 0) {
// // // // //           console.log("Excel file is empty");
// // // // //           toast.error("The uploaded Excel file is empty.");
// // // // //           setUploading(false);
// // // // //           return;
// // // // //         }

// // // // //         const expectedHeaders = [
// // // // //           "Name", "Address", "City", "CompanyType", "CreatedAt", "Domain",
// // // // //           "Email", "FromDate", "ToDate", "Status", "Url", "POC"
// // // // //         ];
// // // // //         const headers = Object.keys(jsonData[0] || {});
// // // // //         const missingHeaders = expectedHeaders.filter((h) => !headers.includes(h));
// // // // //         if (missingHeaders.length > 0) {
// // // // //           console.log("Missing headers:", missingHeaders);
// // // // //           toast.error(`Missing required columns in XLSX: ${missingHeaders.join(", ")}`);
// // // // //           setUploading(false);
// // // // //           return;
// // // // //         }

// // // // //         const batch = writeBatch(db);
// // // // //         let successCount = 0;
// // // // //         let errorMessages = [];

// // // // //         for (const row of jsonData) {
// // // // //           const name = row["Name"]?.toString().trim();
// // // // //           const address = row["Address"]?.toString().trim();
// // // // //           const city = row["City"]?.toString().trim();
// // // // //           const companyType = row["CompanyType"]?.toString().trim();
// // // // //           const createdAt = row["CreatedAt"]?.toString().trim();
// // // // //           const domain = row["Domain"]?.toString().trim();
// // // // //           const email = row["Email"]?.toString().trim();
// // // // //           const fromDate = row["FromDate"]?.toString().trim();
// // // // //           const toDate = row["ToDate"]?.toString().trim();
// // // // //           const status = row["Status"]?.toString().trim();
// // // // //           const url = row["Url"]?.toString().trim();
// // // // //           const pocString = row["POC"]?.toString().trim();

// // // // //           if (!name) {
// // // // //             errorMessages.push(`Missing Name in row: ${JSON.stringify(row)}`);
// // // // //             continue;
// // // // //           }
// // // // //           if (!address) {
// // // // //             errorMessages.push(`Missing Address in row: ${name}`);
// // // // //             continue;
// // // // //           }
// // // // //           if (!city) {
// // // // //             errorMessages.push(`Missing City in row: ${name}`);
// // // // //             continue;
// // // // //           }
// // // // //           if (!companyType || !companyTypes.includes(companyType)) {
// // // // //             errorMessages.push(`Invalid CompanyType in row: ${name}. Must be one of: ${companyTypes.join(", ")}`);
// // // // //             continue;
// // // // //           }
// // // // //           if (createdAt && !validateDate(createdAt)) {
// // // // //             errorMessages.push(`Invalid CreatedAt date in row: ${name}`);
// // // // //             continue;
// // // // //           }
// // // // //           if (!validateEmail(email)) {
// // // // //             errorMessages.push(`Invalid Email in row: ${name}`);
// // // // //             continue;
// // // // //           }
// // // // //           if (domain && !domains.includes(domain)) {
// // // // //             errorMessages.push(`Invalid Domain in row: ${name}. Must be one of: ${domains.join(", ")}`);
// // // // //             continue;
// // // // //           }
// // // // //           if (fromDate && !validateDate(fromDate)) {
// // // // //             errorMessages.push(`Invalid FromDate in row: ${name}`);
// // // // //             continue;
// // // // //           }
// // // // //           if (toDate && !validateDate(toDate)) {
// // // // //             errorMessages.push(`Invalid ToDate in row: ${name}`);
// // // // //             continue;
// // // // //           }
// // // // //           if (status && !["Active", "Inactive"].includes(status)) {
// // // // //             errorMessages.push(`Invalid Status in row: ${name}. Must be Active or Inactive`);
// // // // //             continue;
// // // // //           }
// // // // //           if (url && !validateUrl(url)) {
// // // // //             errorMessages.push(`Invalid Url in row: ${name}`);
// // // // //             continue;
// // // // //           }

// // // // //           let pointsOfContact = [];
// // // // //           if (pocString) {
// // // // //             const [pocName, pocEmail, countryCode, phone, designation, linkedinProfile] = pocString
// // // // //               .split("|")
// // // // //               .map((s) => s?.trim());
// // // // //             if (!pocName || !pocEmail || !countryCode || !phone || !designation) {
// // // // //               errorMessages.push(`Invalid POC format in row: ${name}. POC: ${pocString}`);
// // // // //               continue;
// // // // //             }
// // // // //             if (!validateEmail(pocEmail)) {
// // // // //               errorMessages.push(`Invalid POC Email in row: ${name}. POC: ${pocName}`);
// // // // //               continue;
// // // // //             }
// // // // //             if (!validatePhone(phone)) {
// // // // //               errorMessages.push(`Invalid POC Phone (must be 7-15 digits) in row: ${name}. POC: ${pocName}`);
// // // // //               continue;
// // // // //             }
// // // // //             if (!countryCodes.some((cc) => cc.code === countryCode)) {
// // // // //               errorMessages.push(`Invalid POC Country Code in row: ${name}. POC: ${pocName}`);
// // // // //               continue;
// // // // //             }
// // // // //             if (linkedinProfile && !validateUrl(linkedinProfile)) {
// // // // //               errorMessages.push(`Invalid POC LinkedInProfile in row: ${name}. POC: ${pocName}`);
// // // // //               continue;
// // // // //             }
// // // // //             pointsOfContact.push({
// // // // //               name: pocName,
// // // // //               email: pocEmail,
// // // // //               countryCode,
// // // // //               mobile: phone, // Use 'mobile' for consistency
// // // // //               designation,
// // // // //               linkedInProfile: linkedinProfile || "",
// // // // //             });
// // // // //           }

// // // // //           const companyData = {
// // // // //             name,
// // // // //             address,
// // // // //             city,
// // // // //             companyType,
// // // // //             createdAt: createdAt ? new Date(createdAt) : serverTimestamp(),
// // // // //             domain: domain || "",
// // // // //             email,
// // // // //             fromDate: fromDate ? new Date(fromDate) : null,
// // // // //             toDate: toDate ? new Date(toDate) : null,
// // // // //             status: status || "Active",
// // // // //             url: url || "",
// // // // //             pointsOfContact,
// // // // //             userId: user.uid,
// // // // //           };

// // // // //           const docRef = doc(collection(db, "Companies")); // Corrected document reference
// // // // //           batch.set(docRef, companyData);
// // // // //           successCount++;
// // // // //           logActivity("CREATE_COMPANY_BULK", { name, companyId: docRef.id });
// // // // //         }

// // // // //         if (successCount > 0) {
// // // // //           await batch.commit();
// // // // //           console.log(`Batch committed successfully. ${successCount} companies added.`);
// // // // //           toast.success(`${successCount} companies uploaded successfully!`);
// // // // //           await fetchCompanies(); // Refresh the company list
// // // // //         } else {
// // // // //           console.log("No valid rows to upload");
// // // // //           toast.warn("No valid rows were uploaded. Check the file for errors.");
// // // // //         }

// // // // //         if (errorMessages.length > 0) {
// // // // //           errorMessages.forEach((msg) => {
// // // // //             console.error(msg);
// // // // //             toast.error(msg);
// // // // //           });
// // // // //           toast.warn(`${errorMessages.length} rows failed to upload. Check console for details.`);
// // // // //         }

// // // // //         setFile(null);
// // // // //         toggleSidebar();
// // // // //       };
// // // // //       reader.readAsArrayBuffer(file);
// // // // //     } catch (error) {
// // // // //       console.error("Batch commit failed:", error.code, error.message);
// // // // //       toast.error(`Failed to upload companies: ${error.message}`);
// // // // //     } finally {
// // // // //       setUploading(false);
// // // // //     }
// // // // //   };

// // // // //   const handleClose = () => {
// // // // //     toggleSidebar();
// // // // //     logActivity("CLOSE_BULK_SIDEBAR", {});
// // // // //   };

// // // // //   if (!canDisplay) return null;

// // // // //   return (
// // // // //     <>
// // // // //       <ToastContainer position="top-right" autoClose={3000} />
// // // // //       <div
// // // // //         className={`fixed inset-y-0 right-0 z-50 bg-white w-full sm:w-3/4 md:w-2/5 shadow-lg transform transition-transform duration-300 ${
// // // // //           isOpen ? "translate-x-0" : "translate-x-full"
// // // // //         } p-4 sm:p-6 overflow-y-auto`}
// // // // //       >
// // // // //         <div className="flex justify-between items-center mb-4 sm:mb-6">
// // // // //           <h1 className="text-lg sm:text-xl font-bold text-gray-800">Add Bulk Companies</h1>
// // // // //           <button
// // // // //             onClick={handleClose}
// // // // //             className="bg-blue-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-200"
// // // // //           >
// // // // //             <svg
// // // // //               xmlns="http://www.w3.org/2000/svg"
// // // // //               className="h-5 w-5"
// // // // //               fill="none"
// // // // //               viewBox="0 0 24 24"
// // // // //               stroke="currentColor"
// // // // //             >
// // // // //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// // // // //             </svg>
// // // // //           </button>
// // // // //         </div>

// // // // //         <div className="space-y-4 sm:space-y-6">
// // // // //           <div>
// // // // //             <h2 className="text-sm font-medium text-gray-700">Step 1: Download Template</h2>
// // // // //             <p className="text-gray-600 text-sm mb-2">
// // // // //               Download the XLSX template, fill in the company details, and upload the file. The POC column should be formatted as:
// // // // //               <code>Name|Email|CountryCode|Phone|Designation|LinkedInProfile</code>
// // // // //             </p>
// // // // //             <button
// // // // //               onClick={downloadTemplate}
// // // // //               className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
// // // // //             >
// // // // //               Download Template
// // // // //             </button>
// // // // //           </div>

// // // // //           <div>
// // // // //             <h2 className="text-sm font-medium text-gray-700">Step 2: Upload Filled Template</h2>
// // // // //             <input
// // // // //               type="file"
// // // // //               accept=".xlsx"
// // // // //               onChange={handleFileChange}
// // // // //               disabled={!canCreate}
// // // // //               className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
// // // // //             />
// // // // //           </div>

// // // // //           <div className="flex justify-end mt-4">
// // // // //             <button
// // // // //               onClick={handleUpload}
// // // // //               disabled={!file || uploading || !canCreate}
// // // // //               className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
// // // // //             >
// // // // //               {uploading ? "Uploading..." : "Upload Companies"}
// // // // //             </button>
// // // // //           </div>
// // // // //         </div>
// // // // //       </div>
// // // // //     </>
// // // // //   );
// // // // // };

// // // // // export default AddBulkCompanies;


// // // // import React, { useState } from "react";
// // // // import { db } from "../../../../config/firebase";
// // // // import { addDoc, collection, serverTimestamp, writeBatch, doc } from "firebase/firestore";
// // // // import { useAuth } from "../../../../context/AuthContext";
// // // // import { ToastContainer, toast } from "react-toastify";
// // // // import "react-toastify/dist/ReactToastify.css";
// // // // import * as XLSX from "xlsx";

// // // // const domains = ["Finance", "IT", "Healthcare", "Education", "Manufacturing", "Retail", "Other"];
// // // // const companyTypes = ["Mid-level", "Startup", "MNC"];
// // // // const countryCodes = [
// // // //   { code: "+1", label: "USA (+1)" },
// // // //   { code: "+1", label: "Canada (+1)" },
// // // //   { code: "+91", label: "India (+91)" },
// // // //   // Add other country codes as needed
// // // // ];

// // // // const AddBulkCompanies = ({ isOpen, toggleSidebar, fetchCompanies }) => {
// // // //   const { user, rolePermissions } = useAuth();
// // // //   const [file, setFile] = useState(null);
// // // //   const [uploading, setUploading] = useState(false);

// // // //   const canCreate = rolePermissions?.Companies?.create || false;
// // // //   const canDisplay = rolePermissions?.Companies?.display || false;

// // // //   const logActivity = async (action, details) => {
// // // //     try {
// // // //       const activityLog = {
// // // //         action,
// // // //         details,
// // // //         timestamp: new Date().toISOString(),
// // // //         userEmail: user?.email || "anonymous",
// // // //         userId: user.uid,
// // // //       };
// // // //       await addDoc(collection(db, "activityLogs"), activityLog);
// // // //     } catch (error) {
// // // //       console.error("Error logging activity:", error);
// // // //     }
// // // //   };

// // // //   const validateEmail = (email) => {
// // // //     return email ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) : false;
// // // //   };

// // // //   const validatePhone = (phone) => {
// // // //     return phone ? /^\d{7,15}$/.test(phone) : false;
// // // //   };

// // // //   const validateUrl = (url) => {
// // // //     try {
// // // //       if (!url) return true;
// // // //       new URL(url);
// // // //       return true;
// // // //     } catch {
// // // //       return false;
// // // //     }
// // // //   };

// // // //   const validateDate = (dateStr) => {
// // // //     if (!dateStr) return { isValid: true, formattedDate: null };

// // // //     // Check for YYYY-MM-DD format
// // // //     const yyyymmddRegex = /^\d{4}-\d{2}-\d{2}$/;
// // // //     if (yyyymmddRegex.test(dateStr)) {
// // // //       const date = new Date(dateStr);
// // // //       if (!isNaN(date.getTime())) {
// // // //         return { isValid: true, formattedDate: dateStr };
// // // //       }
// // // //     }

// // // //     // Check for DD-MM-YYYY format
// // // //     const ddmmyyyyRegex = /^\d{2}-\d{2}-\d{4}$/;
// // // //     if (ddmmyyyyRegex.test(dateStr)) {
// // // //       const [day, month, year] = dateStr.split("-").map(Number);
// // // //       const date = new Date(year, month - 1, day);
// // // //       if (
// // // //         !isNaN(date.getTime()) &&
// // // //         date.getFullYear() === year &&
// // // //         date.getMonth() + 1 === month &&
// // // //         date.getDate() === day
// // // //       ) {
// // // //         // Convert to YYYY-MM-DD
// // // //         const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
// // // //           .toString()
// // // //           .padStart(2, "0")}`;
// // // //         return { isValid: true, formattedDate };
// // // //       }
// // // //     }

// // // //     return { isValid: false, formattedDate: null };
// // // //   };

// // // //   const downloadTemplate = () => {
// // // //     const templateData = [
// // // //       {
// // // //         Name: "",
// // // //         Address: "",
// // // //         City: "",
// // // //         CompanyType: "Mid-level|Startup|MNC",
// // // //         CreatedAt: "DD-MM-YYYY or YYYY-MM-DD",
// // // //         Domain: "Finance|IT|Healthcare|Education|Manufacturing|Retail|Other",
// // // //         Email: "",
// // // //         FromDate: "DD-MM-YYYY or YYYY-MM-DD",
// // // //         ToDate: "DD-MM-YYYY or YYYY-MM-DD",
// // // //         Status: "Active|Inactive",
// // // //         Url: "",
// // // //         POC: "Name|Email|CountryCode|Phone|Designation|LinkedInProfile",
// // // //       },
// // // //     ];
// // // //     const ws = XLSX.utils.json_to_sheet(templateData);
// // // //     const wb = XLSX.utils.book_new();
// // // //     XLSX.utils.book_append_sheet(wb, ws, "Companies");
// // // //     XLSX.writeFile(wb, "Companies_Template.xlsx");
// // // //     logActivity("DOWNLOAD_TEMPLATE", { template: "Companies_Template.xlsx" });
// // // //   };

// // // //   const handleFileChange = (e) => {
// // // //     const selectedFile = e.target.files[0];
// // // //     if (
// // // //       selectedFile &&
// // // //       selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
// // // //     ) {
// // // //       setFile(selectedFile);
// // // //       logActivity("SELECT_FILE", { fileName: selectedFile.name });
// // // //       toast.info(`Selected file: ${selectedFile.name}`);
// // // //     } else {
// // // //       console.log("Invalid file type:", selectedFile?.type);
// // // //       toast.error("Please upload a valid XLSX file.");
// // // //       setFile(null);
// // // //     }
// // // //   };

// // // //   const handleUpload = async () => {
// // // //     if (!canCreate) {
// // // //       console.log("Permission denied: User lacks 'create' permission for Companies");
// // // //       toast.error("You don't have permission to create companies. Contact your administrator.");
// // // //       logActivity("PERMISSION_DENIED", { action: "CREATE_COMPANY_BULK", userId: user.uid });
// // // //       return;
// // // //     }
// // // //     if (!file) {
// // // //       toast.error("Please select a file to upload");
// // // //       return;
// // // //     }

// // // //     setUploading(true);
// // // //     try {
// // // //       const reader = new FileReader();
// // // //       reader.onload = async (e) => {
// // // //         const data = new Uint8Array(e.target.result);
// // // //         const workbook = XLSX.read(data, { type: "array" });
// // // //         const sheetName = workbook.SheetNames[0];
// // // //         const worksheet = workbook.Sheets[sheetName];
// // // //         const jsonData = XLSX.utils.sheet_to_json(worksheet);
// // // //         console.log("Parsed XLSX Data:", jsonData);

// // // //         if (jsonData.length === 0) {
// // // //           console.log("Excel file is empty");
// // // //           toast.error("The uploaded Excel file is empty.");
// // // //           setUploading(false);
// // // //           return;
// // // //         }

// // // //         const expectedHeaders = [
// // // //           "Name",
// // // //           "Address",
// // // //           "City",
// // // //           "CompanyType",
// // // //           "CreatedAt",
// // // //           "Domain",
// // // //           "Email",
// // // //           "FromDate",
// // // //           "ToDate",
// // // //           "Status",
// // // //           "Url",
// // // //           "POC",
// // // //         ];
// // // //         const headers = Object.keys(jsonData[0] || {});
// // // //         const missingHeaders = expectedHeaders.filter((h) => !headers.includes(h));
// // // //         if (missingHeaders.length > 0) {
// // // //           console.log("Missing headers:", missingHeaders);
// // // //           toast.error(`Missing required columns in XLSX: ${missingHeaders.join(", ")}`);
// // // //           setUploading(false);
// // // //           return;
// // // //         }

// // // //         const batch = writeBatch(db);
// // // //         let successCount = 0;
// // // //         let errorMessages = [];

// // // //         for (const row of jsonData) {
// // // //           const name = row["Name"]?.toString().trim();
// // // //           const address = row["Address"]?.toString().trim();
// // // //           const city = row["City"]?.toString().trim();
// // // //           const companyType = row["CompanyType"]?.toString().trim();
// // // //           const createdAt = row["CreatedAt"]?.toString().trim();
// // // //           const domain = row["Domain"]?.toString().trim();
// // // //           const email = row["Email"]?.toString().trim();
// // // //           const fromDate = row["FromDate"]?.toString().trim();
// // // //           const toDate = row["ToDate"]?.toString().trim();
// // // //           const status = row["Status"]?.toString().trim();
// // // //           const url = row["Url"]?.toString().trim();
// // // //           const pocString = row["POC"]?.toString().trim();

// // // //           if (!name) {
// // // //             errorMessages.push(`Missing Name in row: ${JSON.stringify(row)}`);
// // // //             continue;
// // // //           }
// // // //           if (!address) {
// // // //             errorMessages.push(`Missing Address in row: ${name}`);
// // // //             continue;
// // // //           }
// // // //           if (!city) {
// // // //             errorMessages.push(`Missing City in row: ${name}`);
// // // //             continue;
// // // //           }
// // // //           if (!companyType || !companyTypes.includes(companyType)) {
// // // //             errorMessages.push(
// // // //               `Invalid CompanyType in row: ${name}. Must be one of: ${companyTypes.join(", ")}`
// // // //             );
// // // //             continue;
// // // //           }
// // // //           const createdAtValidation = validateDate(createdAt);
// // // //           if (!createdAtValidation.isValid && createdAt) {
// // // //             errorMessages.push(
// // // //               `Invalid CreatedAt date in row: ${name}. Use DD-MM-YYYY or YYYY-MM-DD format.`
// // // //             );
// // // //             continue;
// // // //           }
// // // //           if (!validateEmail(email)) {
// // // //             errorMessages.push(`Invalid Email in row: ${name}`);
// // // //             continue;
// // // //           }
// // // //           if (domain && !domains.includes(domain)) {
// // // //             errorMessages.push(
// // // //               `Invalid Domain in row: ${name}. Must be one of: ${domains.join(", ")}`
// // // //             );
// // // //             continue;
// // // //           }
// // // //           const fromDateValidation = validateDate(fromDate);
// // // //           if (!fromDateValidation.isValid && fromDate) {
// // // //             errorMessages.push(
// // // //               `Invalid FromDate in row: ${name}. Use DD-MM-YYYY or YYYY-MM-DD format.`
// // // //             );
// // // //             continue;
// // // //           }
// // // //           const toDateValidation = validateDate(toDate);
// // // //           if (!toDateValidation.isValid && toDate) {
// // // //             errorMessages.push(
// // // //               `Invalid ToDate in row: ${name}. Use DD-MM-YYYY or YYYY-MM-DD format.`
// // // //             );
// // // //             continue;
// // // //           }
// // // //           if (status && !["Active", "Inactive"].includes(status)) {
// // // //             errorMessages.push(`Invalid Status in row: ${name}. Must be Active or Inactive`);
// // // //             continue;
// // // //           }
// // // //           if (url && !validateUrl(url)) {
// // // //             errorMessages.push(`Invalid Url in row: ${name}`);
// // // //             continue;
// // // //           }

// // // //           let pointsOfContact = [];
// // // //           if (pocString) {
// // // //             const [pocName, pocEmail, countryCode, phone, designation, linkedinProfile] = pocString
// // // //               .split("|")
// // // //               .map((s) => s?.trim());
// // // //             if (!pocName || !pocEmail || !countryCode || !phone || !designation) {
// // // //               errorMessages.push(`Invalid POC format in row: ${name}. POC: ${pocString}`);
// // // //               continue;
// // // //             }
// // // //             if (!validateEmail(pocEmail)) {
// // // //               errorMessages.push(`Invalid POC Email in row: ${name}. POC: ${pocName}`);
// // // //               continue;
// // // //             }
// // // //             if (!validatePhone(phone)) {
// // // //               errorMessages.push(
// // // //                 `Invalid POC Phone (must be 7-15 digits) in row: ${name}. POC: ${pocName}`
// // // //               );
// // // //               continue;
// // // //             }
// // // //             if (!countryCodes.some((cc) => cc.code === countryCode)) {
// // // //               errorMessages.push(`Invalid POC Country Code in row: ${name}. POC: ${pocName}`);
// // // //               continue;
// // // //             }
// // // //             if (linkedinProfile && !validateUrl(linkedinProfile)) {
// // // //               errorMessages.push(`Invalid POC LinkedInProfile in row: ${name}. POC: ${pocName}`);
// // // //               continue;
// // // //             }
// // // //             pointsOfContact.push({
// // // //               name: pocName,
// // // //               email: pocEmail,
// // // //               countryCode,
// // // //               mobile: phone, // Use 'mobile' for consistency
// // // //               designation,
// // // //               linkedInProfile: linkedinProfile || "",
// // // //             });
// // // //           }

// // // //           const companyData = {
// // // //             name,
// // // //             address,
// // // //             city,
// // // //             companyType,
// // // //             createdAt: createdAtValidation.formattedDate
// // // //               ? new Date(createdAtValidation.formattedDate)
// // // //               : serverTimestamp(),
// // // //             domain: domain || "",
// // // //             email,
// // // //             fromDate: fromDateValidation.formattedDate
// // // //               ? new Date(fromDateValidation.formattedDate)
// // // //               : null,
// // // //             toDate: toDateValidation.formattedDate ? new Date(toDateValidation.formattedDate) : null,
// // // //             status: status || "Active",
// // // //             url: url || "",
// // // //             pointsOfContact,
// // // //             userId: user.uid,
// // // //           };

// // // //           const docRef = doc(collection(db, "Companies"));
// // // //           batch.set(docRef, companyData);
// // // //           successCount++;
// // // //           logActivity("CREATE_COMPANY_BULK", { name, companyId: docRef.id });
// // // //         }

// // // //         if (successCount > 0) {
// // // //           await batch.commit();
// // // //           console.log(`Batch committed successfully. ${successCount} companies added.`);
// // // //           toast.success(`${successCount} companies uploaded successfully!`);
// // // //           await fetchCompanies(); // Refresh the company list
// // // //         } else {
// // // //           console.log("No valid rows to upload");
// // // //           toast.warn("No valid rows were uploaded. Check the file for errors.");
// // // //         }

// // // //         if (errorMessages.length > 0) {
// // // //           errorMessages.forEach((msg) => {
// // // //             console.error(msg);
// // // //             toast.error(msg);
// // // //           });
// // // //           toast.warn(`${errorMessages.length} rows failed to upload. Check console for details.`);
// // // //         }

// // // //         setFile(null);
// // // //         toggleSidebar();
// // // //       };
// // // //       reader.readAsArrayBuffer(file);
// // // //     } catch (error) {
// // // //       console.error("Batch commit failed:", error.code, error.message);
// // // //       toast.error(`Failed to upload companies: ${error.message}`);
// // // //     } finally {
// // // //       setUploading(false);
// // // //     }
// // // //   };

// // // //   const handleClose = () => {
// // // //     toggleSidebar();
// // // //     logActivity("CLOSE_BULK_SIDEBAR", {});
// // // //   };

// // // //   if (!canDisplay) return null;

// // // //   return (
// // // //     <>
// // // //       <ToastContainer position="top-right" autoClose={3000} />
// // // //       <div
// // // //         className={`fixed inset-y-0 right-0 z-50 bg-white w-full sm:w-3/4 md:w-2/5 shadow-lg transform transition-transform duration-300 ${
// // // //           isOpen ? "translate-x-0" : "translate-x-full"
// // // //         } p-4 sm:p-6 overflow-y-auto`}
// // // //       >
// // // //         <div className="flex justify-between items-center mb-4 sm:mb-6">
// // // //           <h1 className="text-lg sm:text-xl font-bold text-gray-800">Add Bulk Companies</h1>
// // // //           <button
// // // //             onClick={handleClose}
// // // //             className="bg-blue-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-200"
// // // //           >
// // // //             <svg
// // // //               xmlns="http://www.w3.org/2000/svg"
// // // //               className="h-5 w-5"
// // // //               fill="none"
// // // //               viewBox="0 0 24 24"
// // // //               stroke="currentColor"
// // // //             >
// // // //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// // // //             </svg>
// // // //           </button>
// // // //         </div>

// // // //         <div className="space-y-4 sm:space-y-6">
// // // //           <div>
// // // //             <h2 className="text-sm font-medium text-gray-700">Step 1: Download Template</h2>
// // // //             <p className="text-gray-600 text-sm mb-2">
// // // //               Download the XLSX template, fill in the company details, and upload the file. Use
// // // //               DD-MM-YYYY or YYYY-MM-DD for dates. The POC column should be formatted as:
// // // //               <code>Name|Email|CountryCode|Phone|Designation|LinkedInProfile</code>
// // // //             </p>
// // // //             <button
// // // //               onClick={downloadTemplate}
// // // //               className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
// // // //             >
// // // //               Download Template
// // // //             </button>
// // // //           </div>

// // // //           <div>
// // // //             <h2 className="text-sm font-medium text-gray-700">Step 2: Upload Filled Template</h2>
// // // //             <input
// // // //               type="file"
// // // //               accept=".xlsx"
// // // //               onChange={handleFileChange}
// // // //               disabled={!canCreate}
// // // //               className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
// // // //             />
// // // //           </div>

// // // //           <div className="flex justify-end mt-4">
// // // //             <button
// // // //               onClick={handleUpload}
// // // //               disabled={!file || uploading || !canCreate}
// // // //               className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
// // // //             >
// // // //               {uploading ? "Uploading..." : "Upload Companies"}
// // // //             </button>
// // // //           </div>
// // // //         </div>
// // // //       </div>
// // // //     </>
// // // //   );
// // // // };

// // // // export default AddBulkCompanies;





// // // import React, { useState } from "react";
// // // import { db } from "../../../../config/firebase";
// // // import { addDoc, collection, serverTimestamp, writeBatch, doc } from "firebase/firestore";
// // // import { useAuth } from "../../../../context/AuthContext";
// // // import { ToastContainer, toast } from "react-toastify";
// // // import "react-toastify/dist/ReactToastify.css";
// // // import * as XLSX from "xlsx";

// // // const domains = ["Finance", "IT", "Healthcare", "Education", "Manufacturing", "Retail", "Other"];
// // // const companyTypes = ["Mid-level", "Startup", "MNC"];
// // // const countryCodes = [
// // //   { code: "+1", label: "USA (+1)" },
// // //   { code: "+1", label: "Canada (+1)" },
// // //   { code: "+91", label: "India (+91)" },
// // //   // Add other country codes as needed
// // // ];

// // // const AddBulkCompanies = ({ isOpen, toggleSidebar, fetchCompanies }) => {
// // //   const { user, rolePermissions } = useAuth();
// // //   const [file, setFile] = useState(null);
// // //   const [uploading, setUploading] = useState(false);

// // //   const canCreate = rolePermissions?.Companies?.create || false;
// // //   const canDisplay = rolePermissions?.Companies?.display || false;

// // //   const logActivity = async (action, details) => {
// // //     try {
// // //       const activityLog = {
// // //         action,
// // //         details,
// // //         timestamp: new Date().toISOString(),
// // //         userEmail: user?.email || "anonymous",
// // //         userId: user.uid,
// // //       };
// // //       await addDoc(collection(db, "activityLogs"), activityLog);
// // //     } catch (error) {
// // //       console.error("Error logging activity:", error);
// // //     }
// // //   };

// // //   const validateEmail = (email) => {
// // //     if (!email) return true; // Empty email is valid
// // //     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// // //   };

// // //   const validatePhone = (phone) => {
// // //     if (!phone) return true; // Empty phone is valid
// // //     return /^\d{7,15}$/.test(phone);
// // //   };

// // //   const validateUrl = (url) => {
// // //     if (!url) return true; // Empty URL is valid
// // //     try {
// // //       new URL(url);
// // //       return true;
// // //     } catch {
// // //       return false;
// // //     }
// // //   };

// // //   const validateDate = (dateInput) => {
// // //     if (!dateInput) return { isValid: true, formattedDate: null };

// // //     // Handle Excel serial dates
// // //     if (typeof dateInput === "number") {
// // //       const excelEpoch = new Date(1899, 11, 30); // Excel's epoch (Dec 30, 1899)
// // //       const date = new Date(excelEpoch.getTime() + dateInput * 24 * 60 * 60 * 1000);
// // //       if (!isNaN(date.getTime())) {
// // //         const formattedDate = date.toISOString().split("T")[0]; // YYYY-MM-DD
// // //         return { isValid: true, formattedDate };
// // //       }
// // //     }

// // //     // Convert dateInput to string and trim
// // //     const dateStr = dateInput.toString().trim();

// // //     // Define regex for various date formats
// // //     const yyyymmddRegex = /^\d{4}-\d{2}-\d{2}$/;
// // //     const ddmmyyyyRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
// // //     const mmddyyyyRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
// // //     const dmmmyyyyRegex = /^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/;

// // //     // YYYY-MM-DD
// // //     if (yyyymmddRegex.test(dateStr)) {
// // //       const date = new Date(dateStr);
// // //       if (!isNaN(date.getTime())) {
// // //         return { isValid: true, formattedDate: dateStr };
// // //       }
// // //     }

// // //     // DD-MM-YYYY
// // //     if (ddmmyyyyRegex.test(dateStr)) {
// // //       const [, day, month, year] = dateStr.match(ddmmyyyyRegex);
// // //       const date = new Date(year, month - 1, day);
// // //       if (
// // //         !isNaN(date.getTime()) &&
// // //         date.getFullYear() === parseInt(year) &&
// // //         date.getMonth() + 1 === parseInt(month) &&
// // //         date.getDate() === parseInt(day)
// // //       ) {
// // //         const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
// // //         return { isValid: true, formattedDate };
// // //       }
// // //     }

// // //     // MM/DD/YYYY
// // //     if (mmddyyyyRegex.test(dateStr)) {
// // //       const [, month, day, year] = dateStr.match(mmddyyyyRegex);
// // //       const date = new Date(year, month - 1, day);
// // //       if (
// // //         !isNaN(date.getTime()) &&
// // //         date.getFullYear() === parseInt(year) &&
// // //         date.getMonth() + 1 === parseInt(month) &&
// // //         date.getDate() === parseInt(day)
// // //       ) {
// // //         const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
// // //         return { isValid: true, formattedDate };
// // //       }
// // //     }

// // //     // D-MMM-YYYY (e.g., 1-Jan-2023)
// // //     if (dmmmyyyyRegex.test(dateStr)) {
// // //       const [, day, monthStr, year] = dateStr.match(dmmmyyyyRegex);
// // //       const monthNames = [
// // //         "jan",
// // //         "feb",
// // //         "mar",
// // //         "apr",
// // //         "may",
// // //         "jun",
// // //         "jul",
// // //         "aug",
// // //         "sep",
// // //         "oct",
// // //         "nov",
// // //         "dec",
// // //       ];
// // //       const month = monthNames.findIndex((m) => m.toLowerCase() === monthStr.toLowerCase());
// // //       if (month !== -1) {
// // //         const date = new Date(year, month, day);
// // //         if (
// // //           !isNaN(date.getTime()) &&
// // //           date.getFullYear() === parseInt(year) &&
// // //           date.getMonth() === month &&
// // //           date.getDate() === parseInt(day)
// // //         ) {
// // //           const formattedDate = `${year}-${(month + 1).toString().padStart(2, "0")}-${day.padStart(
// // //             2,
// // //             "0"
// // //           )}`;
// // //           return { isValid: true, formattedDate };
// // //         }
// // //       }
// // //     }

// // //     return { isValid: false, formattedDate: null };
// // //   };

// // //   const downloadTemplate = () => {
// // //     const templateData = [
// // //       {
// // //         Name: "",
// // //         Address: "",
// // //         City: "",
// // //         CompanyType: "Mid-level|Startup|MNC",
// // //         CreatedAt: "DD-MM-YYYY or YYYY-MM-DD or MM/DD/YYYY",
// // //         Domain: "Finance|IT|Healthcare|Education|Manufacturing|Retail|Other",
// // //         Email: "",
// // //         FromDate: "DD-MM-YYYY or YYYY-MM-DD or MM/DD/YYYY",
// // //         ToDate: "DD-MM-YYYY or YYYY-MM-DD or MM/DD/YYYY",
// // //         Status: "Active|Inactive",
// // //         Url: "",
// // //         POC: "Name|Email|CountryCode|Phone|Designation|LinkedInProfile",
// // //       },
// // //     ];
// // //     const ws = XLSX.utils.json_to_sheet(templateData);
// // //     const wb = XLSX.utils.book_new();
// // //     XLSX.utils.book_append_sheet(wb, ws, "Companies");
// // //     XLSX.writeFile(wb, "Companies_Template.xlsx");
// // //     logActivity("DOWNLOAD_TEMPLATE", { template: "Companies_Template.xlsx" });
// // //   };

// // //   const handleFileChange = (e) => {
// // //     const selectedFile = e.target.files[0];
// // //     if (
// // //       selectedFile &&
// // //       selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
// // //     ) {
// // //       setFile(selectedFile);
// // //       logActivity("SELECT_FILE", { fileName: selectedFile.name });
// // //       toast.info(`Selected file: ${selectedFile.name}`);
// // //     } else {
// // //       console.log("Invalid file type:", selectedFile?.type);
// // //       toast.error("Please upload a valid XLSX file.");
// // //       setFile(null);
// // //     }
// // //   };

// // //   const handleUpload = async () => {
// // //     if (!canCreate) {
// // //       console.log("Permission denied: User lacks 'create' permission for Companies");
// // //       toast.error("You don't have permission to create companies. Contact your administrator.");
// // //       logActivity("PERMISSION_DENIED", { action: "CREATE_COMPANY_BULK", userId: user.uid });
// // //       return;
// // //     }
// // //     if (!file) {
// // //       toast.error("Please select a file to upload");
// // //       return;
// // //     }

// // //     setUploading(true);
// // //     try {
// // //       const reader = new FileReader();
// // //       reader.onload = async (e) => {
// // //         const data = new Uint8Array(e.target.result);
// // //         const workbook = XLSX.read(data, { type: "array" });
// // //         const sheetName = workbook.SheetNames[0];
// // //         const worksheet = workbook.Sheets[sheetName];
// // //         const jsonData = XLSX.utils.sheet_to_json(worksheet);
// // //         console.log("Parsed XLSX Data:", jsonData);

// // //         if (jsonData.length === 0) {
// // //           console.log("Excel file is empty");
// // //           toast.error("The uploaded Excel file is empty.");
// // //           setUploading(false);
// // //           return;
// // //         }

// // //         const expectedHeaders = [
// // //           "Name",
// // //           "Address",
// // //           "City",
// // //           "CompanyType",
// // //           "CreatedAt",
// // //           "Domain",
// // //           "Email",
// // //           "FromDate",
// // //           "ToDate",
// // //           "Status",
// // //           "Url",
// // //           "POC",
// // //         ];
// // //         const headers = Object.keys(jsonData[0] || {});
// // //         const missingHeaders = expectedHeaders.filter((h) => !headers.includes(h));
// // //         if (missingHeaders.length > 0) {
// // //           console.log("Missing headers:", missingHeaders);
// // //           toast.error(`Missing required columns in XLSX: ${missingHeaders.join(", ")}`);
// // //           setUploading(false);
// // //           return;
// // //         }

// // //         const batch = writeBatch(db);
// // //         let successCount = 0;
// // //         let errorMessages = [];

// // //         for (const row of jsonData) {
// // //           const name = row["Name"]?.toString().trim() || "";
// // //           const address = row["Address"]?.toString().trim() || "";
// // //           const city = row["City"]?.toString().trim() || "";
// // //           const companyType = row["CompanyType"]?.toString().trim() || "";
// // //           const createdAt = row["CreatedAt"];
// // //           const domain = row["Domain"]?.toString().trim() || "";
// // //           const email = row["Email"]?.toString().trim() || "";
// // //           const fromDate = row["FromDate"];
// // //           const toDate = row["ToDate"];
// // //           const status = row["Status"]?.toString().trim() || "Active";
// // //           const url = row["Url"]?.toString().trim() || "";
// // //           const pocString = row["POC"]?.toString().trim();

// // //           // Validate dates
// // //           const createdAtValidation = validateDate(createdAt);
// // //           if (!createdAtValidation.isValid && createdAt) {
// // //             errorMessages.push(
// // //               `Invalid CreatedAt date for company "${name || "Unnamed"}". Use DD-MM-YYYY, YYYY-MM-DD, or MM/DD/YYYY format.`
// // //             );
// // //             continue;
// // //           }
// // //           const fromDateValidation = validateDate(fromDate);
// // //           if (!fromDateValidation.isValid && fromDate) {
// // //             errorMessages.push(
// // //               `Invalid FromDate for company "${name || "Unnamed"}". Use DD-MM-YYYY, YYYY-MM-DD, or MM/DD/YYYY format.`
// // //             );
// // //             continue;
// // //           }
// // //           const toDateValidation = validateDate(toDate);
// // //           if (!toDateValidation.isValid && toDate) {
// // //             errorMessages.push(
// // //               `Invalid ToDate for company "${name || "Unnamed"}". Use DD-MM-YYYY, YYYY-MM-DD, or MM/DD/YYYY format.`
// // //             );
// // //             continue;
// // //           }

// // //           // Validate other fields (optional)
// // //           if (companyType && !companyTypes.includes(companyType)) {
// // //             errorMessages.push(
// // //               `Invalid CompanyType for company "${name || "Unnamed"}". Must be one of: ${companyTypes.join(
// // //                 ", "
// // //               )}. Using empty string.`
// // //             );
// // //           }
// // //           if (!validateEmail(email) && email) {
// // //             errorMessages.push(`Invalid Email for company "${name || "Unnamed"}".`);
// // //             continue;
// // //           }
// // //           if (domain && !domains.includes(domain)) {
// // //             errorMessages.push(
// // //               `Invalid Domain for company "${name || "Unnamed"}". Must be one of: ${domains.join(
// // //                 ", "
// // //               )}. Using empty string.`
// // //             );
// // //           }
// // //           if (status && !["Active", "Inactive"].includes(status)) {
// // //             errorMessages.push(
// // //               `Invalid Status for company "${name || "Unnamed"}". Must be Active or Inactive. Using "Active".`
// // //             );
// // //           }
// // //           if (url && !validateUrl(url)) {
// // //             errorMessages.push(`Invalid Url for company "${name || "Unnamed"}".`);
// // //             continue;
// // //           }

// // //           let pointsOfContact = [];
// // //           if (pocString) {
// // //             const pocFields = pocString.split("|").map((s) => s?.trim());
// // //             const [pocName, pocEmail, countryCode, phone, designation, linkedinProfile] = pocFields;
// // //             if (pocFields.length !== 6) {
// // //               errorMessages.push(
// // //                 `Invalid POC format for company "${name || "Unnamed"}". Expected: Name|Email|CountryCode|Phone|Designation|LinkedInProfile`
// // //               );
// // //               continue;
// // //             }
// // //             if (pocEmail && !validateEmail(pocEmail)) {
// // //               errorMessages.push(
// // //                 `Invalid POC Email for company "${name || "Unnamed"}". POC: ${pocName || "Unnamed"}`
// // //               );
// // //               continue;
// // //             }
// // //             if (phone && !validatePhone(phone)) {
// // //               errorMessages.push(
// // //                 `Invalid POC Phone (must be 7-15 digits) for company "${name || "Unnamed"}". POC: ${
// // //                   pocName || "Unnamed"
// // //                 }`
// // //               );
// // //               continue;
// // //             }
// // //             if (countryCode && !countryCodes.some((cc) => cc.code === countryCode)) {
// // //               errorMessages.push(
// // //                 `Invalid POC Country Code for company "${name || "Unnamed"}". POC: ${
// // //                   pocName || "Unnamed"
// // //                 }`
// // //               );
// // //               continue;
// // //             }
// // //             if (linkedinProfile && !validateUrl(linkedinProfile)) {
// // //               errorMessages.push(
// // //                 `Invalid POC LinkedInProfile for company "${name || "Unnamed"}". POC: ${
// // //                   pocName || "Unnamed"
// // //                 }`
// // //               );
// // //               continue;
// // //             }
// // //             // Only add POC if at least one field is provided
// // //             if (pocName || pocEmail || countryCode || phone || designation || linkedinProfile) {
// // //               pointsOfContact.push({
// // //                 name: pocName || "",
// // //                 email: pocEmail || "",
// // //                 countryCode: countryCode || "",
// // //                 mobile: phone || "",
// // //                 designation: designation || "",
// // //                 linkedInProfile: linkedinProfile || "",
// // //               });
// // //             }
// // //           }

// // //           const companyData = {
// // //             name,
// // //             address,
// // //             city,
// // //             companyType: companyTypes.includes(companyType) ? companyType : "",
// // //             createdAt: createdAtValidation.formattedDate
// // //               ? new Date(createdAtValidation.formattedDate)
// // //               : serverTimestamp(),
// // //             domain: domains.includes(domain) ? domain : "",
// // //             email,
// // //             fromDate: fromDateValidation.formattedDate
// // //               ? new Date(fromDateValidation.formattedDate)
// // //               : null,
// // //             toDate: toDateValidation.formattedDate ? new Date(toDateValidation.formattedDate) : null,
// // //             status: ["Active", "Inactive"].includes(status) ? status : "Active",
// // //             url,
// // //             pointsOfContact,
// // //             userId: user.uid,
// // //           };

// // //           const docRef = doc(collection(db, "Companies"));
// // //           batch.set(docRef, companyData);
// // //           successCount++;
// // //           logActivity("CREATE_COMPANY_BULK", { name: name || "Unnamed", companyId: docRef.id });
// // //         }

// // //         if (successCount > 0) {
// // //           await batch.commit();
// // //           console.log(`Batch committed successfully. ${successCount} companies added.`);
// // //           toast.success(`${successCount} companies uploaded successfully!`);
// // //           await fetchCompanies(); // Refresh the company list
// // //         } else {
// // //           console.log("No valid rows to upload");
// // //           toast.warn("No valid rows were uploaded. Check the file for errors.");
// // //         }

// // //         if (errorMessages.length > 0) {
// // //           errorMessages.forEach((msg) => {
// // //             console.error(msg);
// // //             toast.error(msg);
// // //           });
// // //           toast.warn(`${errorMessages.length} rows had issues. Check console for details.`);
// // //         }

// // //         setFile(null);
// // //         toggleSidebar();
// // //       };
// // //       reader.readAsArrayBuffer(file);
// // //     } catch (error) {
// // //       console.error("Batch commit failed:", error.code, error.message);
// // //       toast.error(`Failed to upload companies: ${error.message}`);
// // //     } finally {
// // //       setUploading(false);
// // //     }
// // //   };

// // //   const handleClose = () => {
// // //     toggleSidebar();
// // //     logActivity("CLOSE_BULK_SIDEBAR", {});
// // //   };

// // //   if (!canDisplay) return null;

// // //   return (
// // //     <>
// // //       <ToastContainer position="top-right" autoClose={3000} />
// // //       <div
// // //         className={`fixed inset-y-0 right-0 z-50 bg-white w-full sm:w-3/4 md:w-2/5 shadow-lg transform transition-transform duration-300 ${
// // //           isOpen ? "translate-x-0" : "translate-x-full"
// // //         } p-4 sm:p-6 overflow-y-auto`}
// // //       >
// // //         <div className="flex justify-between items-center mb-4 sm:mb-6">
// // //           <h1 className="text-lg sm:text-xl font-bold text-gray-800">Add Bulk Companies</h1>
// // //           <button
// // //             onClick={handleClose}
// // //             className="bg-blue-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-200"
// // //           >
// // //             <svg
// // //               xmlns="http://www.w3.org/2000/svg"
// // //               className="h-5 w-5"
// // //               fill="none"
// // //               viewBox="0 0 24 24"
// // //               stroke="currentColor"
// // //             >
// // //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// // //             </svg>
// // //           </button>
// // //         </div>

// // //         <div className="space-y-4 sm:space-y-6">
// // //           <div>
// // //             <h2 className="text-sm font-medium text-gray-700">Step 1: Download Template</h2>
// // //             <p className="text-gray-600 text-sm mb-2">
// // //               Download the XLSX template, fill in the company details, and upload the file. All fields
// // //               are optional. Use DD-MM-YYYY, YYYY-MM-DD, or MM/DD/YYYY for dates. The POC column
// // //               should be formatted as: <code>Name|Email|CountryCode|Phone|Designation|LinkedInProfile</code>
// // //             </p>
// // //             <button
// // //               onClick={downloadTemplate}
// // //               className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
// // //             >
// // //               Download Template
// // //             </button>
// // //           </div>

// // //           <div>
// // //             <h2 className="text-sm font-medium text-gray-700">Step 2: Upload Filled Template</h2>
// // //             <input
// // //               type="file"
// // //               accept=".xlsx"
// // //               onChange={handleFileChange}
// // //               disabled={!canCreate}
// // //               className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
// // //             />
// // //           </div>

// // //           <div className="flex justify-end mt-4">
// // //             <button
// // //               onClick={handleUpload}
// // //               disabled={!file || uploading || !canCreate}
// // //               className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
// // //             >
// // //               {uploading ? "Uploading..." : "Upload Companies"}
// // //             </button>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </>
// // //   );
// // // };

// // // export default AddBulkCompanies;



// // import React, { useState } from "react";
// // import { db } from "../../../../config/firebase";
// // import { addDoc, collection, serverTimestamp, writeBatch, doc, Timestamp } from "firebase/firestore";
// // import { useAuth } from "../../../../context/AuthContext";
// // import { ToastContainer, toast } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";
// // import * as XLSX from "xlsx";
// // import { parse } from "date-fns";

// // const domains = ["Finance", "IT", "Healthcare", "Education", "Manufacturing", "Retail", "Other"];
// // const companyTypes = ["Mid-level", "Startup", "MNC"];
// // const countryCodes = [
// //   { code: "+1", label: "USA (+1)" },
// //   { code: "+1", label: "Canada (+1)" },
// //   { code: "+91", label: "India (+91)" },
// // ];

// // const AddBulkCompanies = ({ isOpen, toggleSidebar, fetchCompanies }) => {
// //   const { user, rolePermissions } = useAuth();
// //   const [file, setFile] = useState(null);
// //   const [uploading, setUploading] = useState(false);

// //   const canCreate = rolePermissions?.Companies?.create || false;
// //   const canDisplay = rolePermissions?.Companies?.display || false;

// //   const logActivity = async (action, details) => {
// //     try {
// //       const activityLog = {
// //         action,
// //         details,
// //         timestamp: new Date().toISOString(),
// //         userEmail: user?.email || "anonymous",
// //         userId: user.uid,
// //       };
// //       await addDoc(collection(db, "activityLogs"), activityLog);
// //     } catch (error) {
// //       console.error("Error logging activity:", error);
// //     }
// //   };

// //   const validateEmail = (email) => {
// //     if (!email) return true;
// //     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// //   };

// //   const validatePhone = (phone) => {
// //     if (!phone) return true;
// //     return /^\d{7,15}$/.test(phone);
// //   };

// //   const validateUrl = (url) => {
// //     if (!url) return true;
// //     try {
// //       new URL(url);
// //       return true;
// //     } catch {
// //       return false;
// //     }
// //   };

// //   const validateDate = (dateInput) => {
// //     if (!dateInput) return { isValid: true, formattedDate: null };

// //     // Handle Excel serial dates
// //     if (typeof dateInput === "number") {
// //       const excelEpoch = new Date(1899, 11, 30);
// //       const date = new Date(excelEpoch.getTime() + dateInput * 24 * 60 * 60 * 1000);
// //       if (!isNaN(date.getTime())) {
// //         return { isValid: true, formattedDate: date };
// //       }
// //     }

// //     // Convert to string and trim
// //     const dateStr = dateInput.toString().trim();

// //     // Try parsing various formats using date-fns
// //     const formats = [
// //       "yyyy-MM-dd",
// //       "dd-MM-yyyy",
// //       "MM/dd/yyyy",
// //       "d-MMM-yyyy",
// //       "MMM d, yyyy",
// //     ];
// //     for (const format of formats) {
// //       try {
// //         const date = parse(dateStr, format, new Date());
// //         if (!isNaN(date.getTime())) {
// //           return { isValid: true, formattedDate: date };
// //         }
// //       } catch {
// //         continue;
// //       }
// //     }

// //     return { isValid: false, formattedDate: null };
// //   };

// //   const downloadTemplate = () => {
// //     const templateData = [
// //       {
// //         Name: "",
// //         Address: "",
// //         City: "",
// //         CompanyType: "Mid-level|Startup|MNC",
// //         CreatedAt: "DD-MM-YYYY or YYYY-MM-DD or MM/DD/YYYY",
// //         Domain: "Finance|IT|Healthcare|Education|Manufacturing|Retail|Other",
// //         Email: "",
// //         FromDate: "DD-MM-YYYY or YYYY-MM-DD or MM/DD/YYYY",
// //         ToDate: "DD-MM-YYYY or YYYY-MM-DD or MM/DD/YYYY",
// //         Status: "Active|Inactive",
// //         Url: "",
// //         POC: "Name|Email|CountryCode|Phone|Designation|LinkedInProfile",
// //       },
// //     ];
// //     const ws = XLSX.utils.json_to_sheet(templateData);
// //     const wb = XLSX.utils.book_new();
// //     XLSX.utils.book_append_sheet(wb, ws, "Companies");
// //     XLSX.writeFile(wb, "Companies_Template.xlsx");
// //     logActivity("DOWNLOAD_TEMPLATE", { template: "Companies_Template.xlsx" });
// //   };

// //   const handleFileChange = (e) => {
// //     const selectedFile = e.target.files[0];
// //     if (
// //       selectedFile &&
// //       selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
// //     ) {
// //       setFile(selectedFile);
// //       logActivity("SELECT_FILE", { fileName: selectedFile.name });
// //       toast.info(`Selected file: ${selectedFile.name}`);
// //     } else {
// //       console.log("Invalid file type:", selectedFile?.type);
// //       toast.error("Please upload a valid XLSX file.");
// //       setFile(null);
// //     }
// //   };

// //   const handleUpload = async () => {
// //     if (!canCreate) {
// //       console.log("Permission denied: User lacks 'create' permission for Companies");
// //       toast.error("You don't have permission to create companies. Contact your administrator.");
// //       logActivity("PERMISSION_DENIED", { action: "CREATE_COMPANY_BULK", userId: user.uid });
// //       return;
// //     }
// //     if (!file) {
// //       toast.error("Please select a file to upload");
// //       return;
// //     }

// //     setUploading(true);
// //     try {
// //       const reader = new FileReader();
// //       reader.onload = async (e) => {
// //         const data = new Uint8Array(e.target.result);
// //         const workbook = XLSX.read(data, { type: "array" });
// //         const sheetName = workbook.SheetNames[0];
// //         const worksheet = workbook.Sheets[sheetName];
// //         const jsonData = XLSX.utils.sheet_to_json(worksheet);
// //         console.log("Parsed XLSX Data:", jsonData);

// //         if (jsonData.length === 0) {
// //           console.log("Excel file is empty");
// //           toast.error("The uploaded Excel file is empty.");
// //           setUploading(false);
// //           return;
// //         }

// //         const expectedHeaders = [
// //           "Name",
// //           "Address",
// //           "City",
// //           "CompanyType",
// //           "CreatedAt",
// //           "Domain",
// //           "Email",
// //           "FromDate",
// //           "ToDate",
// //           "Status",
// //           "Url",
// //           "POC",
// //         ];
// //         const headers = Object.keys(jsonData[0] || {});
// //         const missingHeaders = expectedHeaders.filter((h) => !headers.includes(h));
// //         if (missingHeaders.length > 0) {
// //           console.log("Missing headers:", missingHeaders);
// //           toast.error(`Missing required columns in XLSX: ${missingHeaders.join(", ")}`);
// //           setUploading(false);
// //           return;
// //         }

// //         const batch = writeBatch(db);
// //         let successCount = 0;
// //         let errorMessages = [];

// //         for (const row of jsonData) {
// //           const name = row["Name"]?.toString().trim() || "";
// //           const address = row["Address"]?.toString().trim() || "";
// //           const city = row["City"]?.toString().trim() || "";
// //           const companyType = row["CompanyType"]?.toString().trim() || "";
// //           const createdAt = row["CreatedAt"];
// //           const domain = row["Domain"]?.toString().trim() || "";
// //           const email = row["Email"]?.toString().trim() || "";
// //           const fromDate = row["FromDate"];
// //           const toDate = row["ToDate"];
// //           const status = row["Status"]?.toString().trim() || "Active";
// //           const url = row["Url"]?.toString().trim() || "";
// //           const pocString = row["POC"]?.toString().trim();

// //           // Validate dates
// //           const createdAtValidation = validateDate(createdAt);
// //           console.log(`CreatedAt for ${name}:`, { input: createdAt, ...createdAtValidation });
// //           if (!createdAtValidation.isValid && createdAt) {
// //             errorMessages.push(
// //               `Invalid CreatedAt date for company "${name || "Unnamed"}". Use DD-MM-YYYY, YYYY-MM-DD, MM/DD/YYYY, or D-MMM-YYYY format.`
// //             );
// //             continue;
// //           }
// //           const fromDateValidation = validateDate(fromDate);
// //           console.log(`FromDate for ${name}:`, { input: fromDate, ...fromDateValidation });
// //           if (!fromDateValidation.isValid && fromDate) {
// //             errorMessages.push(
// //               `Invalid FromDate for company "${name || "Unnamed"}". Use DD-MM-YYYY, YYYY-MM-DD, MM/DD/YYYY, or D-MMM-YYYY format.`
// //             );
// //             continue;
// //           }
// //           const toDateValidation = validateDate(toDate);
// //           console.log(`ToDate for ${name}:`, { input: toDate, ...toDateValidation });
// //           if (!toDateValidation.isValid && toDate) {
// //             errorMessages.push(
// //               `Invalid ToDate for company "${name || "Unnamed"}". Use DD-MM-YYYY, YYYY-MM-DD, MM/DD/YYYY, or D-MMM-YYYY format.`
// //             );
// //             continue;
// //           }

// //           // Validate other fields
// //           if (companyType && !companyTypes.includes(companyType)) {
// //             errorMessages.push(
// //               `Invalid CompanyType for company "${name || "Unnamed"}". Must be one of: ${companyTypes.join(
// //                 ", "
// //               )}. Using empty string.`
// //             );
// //           }
// //           if (!validateEmail(email) && email) {
// //             errorMessages.push(`Invalid Email for company "${name || "Unnamed"}".`);
// //             continue;
// //           }
// //           if (domain && !domains.includes(domain)) {
// //             errorMessages.push(
// //               `Invalid Domain for company "${name || "Unnamed"}". Must be one of: ${domains.join(
// //                 ", "
// //               )}. Using empty string.`
// //             );
// //           }
// //           if (status && !["Active", "Inactive"].includes(status)) {
// //             errorMessages.push(
// //               `Invalid Status for company "${name || "Unnamed"}". Must be Active or Inactive. Using "Active".`
// //             );
// //           }
// //           if (url && !validateUrl(url)) {
// //             errorMessages.push(`Invalid Url for company "${name || "Unnamed"}".`);
// //             continue;
// //           }

// //           let pointsOfContact = [];
// //           if (pocString) {
// //             const pocFields = pocString.split("|").map((s) => s?.trim());
// //             const [pocName, pocEmail, countryCode, phone, designation, linkedinProfile] = pocFields;
// //             if (pocFields.length !== 6) {
// //               errorMessages.push(
// //                 `Invalid POC format for company "${name || "Unnamed"}". Expected: Name|Email|CountryCode|Phone|Designation|LinkedInProfile`
// //               );
// //               continue;
// //             }
// //             if (pocEmail && !validateEmail(pocEmail)) {
// //               errorMessages.push(
// //                 `Invalid POC Email for company "${name || "Unnamed"}". POC: ${pocName || "Unnamed"}`
// //               );
// //               continue;
// //             }
// //             if (phone && !validatePhone(phone)) {
// //               errorMessages.push(
// //                 `Invalid POC Phone (must be 7-15 digits) for company "${name || "Unnamed"}". POC: ${
// //                   pocName || "Unnamed"
// //                 }`
// //               );
// //               continue;
// //             }
// //             if (countryCode && !countryCodes.some((cc) => cc.code === countryCode)) {
// //               errorMessages.push(
// //                 `Invalid POC Country Code for company "${name || "Unnamed"}". POC: ${
// //                   pocName || "Unnamed"
// //                 }`
// //               );
// //               continue;
// //             }
// //             if (linkedinProfile && !validateUrl(linkedinProfile)) {
// //               errorMessages.push(
// //                 `Invalid POC LinkedInProfile for company "${name || "Unnamed"}". POC: ${
// //                   pocName || "Unnamed"
// //                 }`
// //               );
// //               continue;
// //             }
// //             if (pocName || pocEmail || countryCode || phone || designation || linkedinProfile) {
// //               pointsOfContact.push({
// //                 name: pocName || "",
// //                 email: pocEmail || "",
// //                 countryCode: countryCode || "",
// //                 mobile: phone || "",
// //                 designation: designation || "",
// //                 linkedInProfile: linkedinProfile || "",
// //               });
// //             }
// //           }

// //           const companyData = {
// //             name,
// //             address,
// //             city,
// //             companyType: companyTypes.includes(companyType) ? companyType : "",
// //             createdAt: createdAtValidation.formattedDate
// //               ? Timestamp.fromDate(createdAtValidation.formattedDate)
// //               : serverTimestamp(),
// //             domain: domains.includes(domain) ? domain : "",
// //             email,
// //             fromDate: fromDateValidation.formattedDate
// //               ? Timestamp.fromDate(fromDateValidation.formattedDate)
// //               : null,
// //             toDate: toDateValidation.formattedDate
// //               ? Timestamp.fromDate(toDateValidation.formattedDate)
// //               : null,
// //             status: ["Active", "Inactive"].includes(status) ? status : "Active",
// //             url,
// //             pointsOfContact,
// //             userId: user.uid,
// //           };

// //           console.log(`Company Data for ${name}:`, companyData);

// //           const docRef = doc(collection(db, "Companies"));
// //           batch.set(docRef, companyData);
// //           successCount++;
// //           logActivity("CREATE_COMPANY_BULK", { name: name || "Unnamed", companyId: docRef.id });
// //         }

// //         if (successCount > 0) {
// //           await batch.commit();
// //           console.log(`Batch committed successfully. ${successCount} companies added.`);
// //           toast.success(`${successCount} companies uploaded successfully!`);
// //           await fetchCompanies();
// //         } else {
// //           console.log("No valid rows to upload");
// //           toast.warn("No valid rows were uploaded. Check the file for errors.");
// //         }

// //         if (errorMessages.length > 0) {
// //           errorMessages.forEach((msg) => {
// //             console.error(msg);
// //             toast.error(msg);
// //           });
// //           toast.warn(`${errorMessages.length} rows had issues. Check console for details.`);
// //         }

// //         setFile(null);
// //         toggleSidebar();
// //       };
// //       reader.readAsArrayBuffer(file);
// //     } catch (error) {
// //       console.error("Batch commit failed:", error.code, error.message);
// //       toast.error(`Failed to upload companies: ${error.message}`);
// //     } finally {
// //       setUploading(false);
// //     }
// //   };

// //   const handleClose = () => {
// //     toggleSidebar();
// //     logActivity("CLOSE_BULK_SIDEBAR", {});
// //   };

// //   if (!canDisplay) return null;

// //   return (
// //     <>
// //       <ToastContainer position="top-right" autoClose={3000} />
// //       <div
// //         className={`fixed inset-y-0 right-0 z-50 bg-white w-full sm:w-3/4 md:w-2/5 shadow-lg transform transition-transform duration-300 ${
// //           isOpen ? "translate-x-0" : "translate-x-full"
// //         } p-4 sm:p-6 overflow-y-auto`}
// //       >
// //         <div className="flex justify-between items-center mb-4 sm:mb-6">
// //           <h1 className="text-lg sm:text-xl font-bold text-gray-800">Add Bulk Companies</h1>
// //           <button
// //             onClick={handleClose}
// //             className="bg-blue-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-200"
// //           >
// //             <svg
// //               xmlns="http://www.w3.org/2000/svg"
// //               className="h-5 w-5"
// //               fill="none"
// //               viewBox="0 0 24 24"
// //               stroke="currentColor"
// //             >
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// //             </svg>
// //           </button>
// //         </div>

// //         <div className="space-y-4 sm:space-y-6">
// //           <div>
// //             <h2 className="text-sm font-medium text-gray-700">Step 1: Download Template</h2>
// //             <p className="text-gray-600 text-sm mb-2">
// //               Download the XLSX template, fill in the company details, and upload the file. All fields
// //               are optional. Use DD-MM-YYYY, YYYY-MM-DD, MM/DD/YYYY, or D-MMM-YYYY for dates. The POC column
// //               should be formatted as: <code>Name|Email|CountryCode|Phone|Designation|LinkedInProfile</code>
// //             </p>
// //             <button
// //               onClick={downloadTemplate}
// //               className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
// //             >
// //               Download Template
// //             </button>
// //           </div>

// //           <div>
// //             <h2 className="text-sm font-medium text-gray-700">Step 2: Upload Filled Template</h2>
// //             <input
// //               type="file"
// //               accept=".xlsx"
// //               onChange={handleFileChange}
// //               disabled={!canCreate}
// //               className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
// //             />
// //           </div>

// //           <div className="flex justify-end mt-4">
// //             <button
// //               onClick={handleUpload}
// //               disabled={!file || uploading || !canCreate}
// //               className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
// //             >
// //               {uploading ? "Uploading..." : "Upload Companies"}
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </>
// //   );
// // };

// // export default AddBulkCompanies;





// import React, { useState } from "react";
// import { db } from "../../../../config/firebase";
// import { addDoc, collection, serverTimestamp, writeBatch, doc, Timestamp } from "firebase/firestore";
// import { useAuth } from "../../../../context/AuthContext";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import * as XLSX from "xlsx";
// import { parse } from "date-fns";

// const domains = ["Finance", "IT", "Healthcare", "Education", "Manufacturing", "Retail", "Other"];
// const companyTypes = ["Mid-level", "Startup", "MNC"];
// const countryCodes = [
//   { code: "+1", label: "USA (+1)" },
//   { code: "+1", label: "Canada (+1)" },
//   { code: "+91", label: "India (+91)" },
// ];

// const AddBulkCompanies = ({ isOpen, toggleSidebar, fetchCompanies }) => {
//   const { user, rolePermissions } = useAuth();
//   const [file, setFile] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   const canCreate = rolePermissions?.Companies?.create || false;
//   const canDisplay = rolePermissions?.Companies?.display || false;

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

//   const validateEmail = (email) => {
//     if (!email) return true;
//     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//   };

//   const validatePhone = (phone) => {
//     if (!phone) return true;
//     return /^\d{7,15}$/.test(phone);
//   };

//   const validateUrl = (url) => {
//     if (!url) return true;
//     try {
//       new URL(url);
//       return true;
//     } catch {
//       return false;
//     }
//   };

//   const validateDate = (dateInput) => {
//     if (!dateInput) return { isValid: true, formattedDate: null };

//     // Handle Excel serial dates
//     if (typeof dateInput === "number") {
//       const excelEpoch = new Date(1899, 11, 30);
//       const date = new Date(excelEpoch.getTime() + dateInput * 24 * 60 * 60 * 1000);
//       if (!isNaN(date.getTime())) {
//         return { isValid: true, formattedDate: date };
//       }
//     }

//     // Convert to string and trim
//     const dateStr = dateInput.toString().trim();

//     // Try parsing various formats using date-fns
//     const formats = [
//       "yyyy-MM-dd",
//       "dd-MM-yyyy",
//       "MM/dd/yyyy",
//       "d-MMM-yyyy",
//       "MMM d, yyyy",
//     ];
//     for (const format of formats) {
//       try {
//         const date = parse(dateStr, format, new Date());
//         if (!isNaN(date.getTime())) {
//           return { isValid: true, formattedDate: date };
//         }
//       } catch {
//         continue;
//       }
//     }

//     return { isValid: false, formattedDate: null };
//   };

//   const downloadTemplate = () => {
//     const templateData = [
//       {
//         Name: "",
//         Address: "",
//         City: "",
//         CompanyType: "Mid-level|Startup|MNC",
//         CreatedAt: "DD-MM-YYYY or YYYY-MM-DD or MM/DD/YYYY",
//         Domain: "Finance|IT|Healthcare|Education|Manufacturing|Retail|Other",
//         Email: "",
//         FromDate: "DD-MM-YYYY or YYYY-MM-DD or MM/DD/YYYY",
//         ToDate: "DD-MM-YYYY or YYYY-MM-DD or MM/DD/YYYY",
//         Status: "Active|Inactive",
//         Url: "",
//         POC: "Name|Email|CountryCode|Phone|Designation|LinkedInProfile",
//       },
//     ];
//     const ws = XLSX.utils.json_to_sheet(templateData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Companies");
//     XLSX.writeFile(wb, "Companies_Template.xlsx");
//     logActivity("DOWNLOAD_TEMPLATE", { template: "Companies_Template.xlsx" });
//   };

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
//       console.log("Invalid file type:", selectedFile?.type);
//       toast.error("Please upload a valid XLSX file.");
//       setFile(null);
//     }
//   };

//   const handleUpload = async () => {
//     if (!canCreate) {
//       console.log("Permission denied: User lacks 'create' permission for Companies");
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
//         const data = new Uint8Array(e.target.result);
//         const workbook = XLSX.read(data, { type: "array" });
//         const sheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[sheetName];
//         const jsonData = XLSX.utils.sheet_to_json(worksheet);
//         console.log("Parsed XLSX Data:", jsonData);

//         if (jsonData.length === 0) {
//           console.log("Excel file is empty");
//           toast.error("The uploaded Excel file is empty.");
//           setUploading(false);
//           return;
//         }

//         const expectedHeaders = [
//           "Name",
//           "Address",
//           "City",
//           "CompanyType",
//           "CreatedAt",
//           "Domain",
//           "Email",
//           "FromDate",
//           "ToDate",
//           "Status",
//           "Url",
//           "POC",
//         ];
//         const headers = Object.keys(jsonData[0] || {});
//         const missingHeaders = expectedHeaders.filter((h) => !headers.includes(h));
//         if (missingHeaders.length > 0) {
//           console.log("Missing headers:", missingHeaders);
//           toast.error(`Missing required columns in XLSX: ${missingHeaders.join(", ")}`);
//           setUploading(false);
//           return;
//         }

//         const batch = writeBatch(db);
//         let successCount = 0;
//         let errorMessages = [];

//         for (const row of jsonData) {
//           const name = row["Name"]?.toString().trim() || "";
//           const address = row["Address"]?.toString().trim() || "";
//           const city = row["City"]?.toString().trim() || "";
//           const companyType = row["CompanyType"]?.toString().trim() || "";
//           const createdAt = row["CreatedAt"];
//           const domain = row["Domain"]?.toString().trim() || "";
//           const email = row["Email"]?.toString().trim() || "";
//           const fromDate = row["FromDate"];
//           const toDate = row["ToDate"];
//           const status = row["Status"]?.toString().trim() || "Active";
//           const url = row["Url"]?.toString().trim() || "";
//           const pocString = row["POC"]?.toString().trim();

//           // Validate dates
//           const createdAtValidation = validateDate(createdAt);
//           console.log(`CreatedAt for ${name}:`, { input: createdAt, ...createdAtValidation });
//           if (!createdAtValidation.isValid && createdAt) {
//             errorMessages.push(
//               `Invalid CreatedAt date for company "${name || "Unnamed"}". Use DD-MM-YYYY, YYYY-MM-DD, MM/DD/YYYY, or D-MMM-YYYY format.`
//             );
//             continue;
//           }
//           const fromDateValidation = validateDate(fromDate);
//           console.log(`FromDate for ${name}:`, { input: fromDate, ...fromDateValidation });
//           if (!fromDateValidation.isValid && fromDate) {
//             errorMessages.push(
//               `Invalid FromDate for company "${name || "Unnamed"}". Use DD-MM-YYYY, YYYY-MM-DD, MM/DD/YYYY, or D-MMM-YYYY format.`
//             );
//             continue;
//           }
//           const toDateValidation = validateDate(toDate);
//           console.log(`ToDate for ${name}:`, { input: toDate, ...toDateValidation });
//           if (!toDateValidation.isValid && toDate) {
//             errorMessages.push(
//               `Invalid ToDate for company "${name || "Unnamed"}". Use DD-MM-YYYY, YYYY-MM-DD, MM/DD/YYYY, or D-MMM-YYYY format.`
//             );
//             continue;
//           }

//           // Validate other fields
//           if (companyType && !companyTypes.includes(companyType)) {
//             errorMessages.push(
//               `Invalid CompanyType for company "${name || "Unnamed"}". Must be one of: ${companyTypes.join(
//                 ", "
//               )}. Using empty string.`
//             );
//           }
//           if (!validateEmail(email) && email) {
//             errorMessages.push(`Invalid Email for company "${name || "Unnamed"}".`);
//             continue;
//           }
//           if (domain && !domains.includes(domain)) {
//             errorMessages.push(
//               `Invalid Domain for company "${name || "Unnamed"}". Must be one of: ${domains.join(
//                 ", "
//               )}. Using empty string.`
//             );
//           }
//           if (status && !["Active", "Inactive"].includes(status)) {
//             errorMessages.push(
//               `Invalid Status for company "${name || "Unnamed"}". Must be Active or Inactive. Using "Active".`
//             );
//           }
//           if (url && !validateUrl(url)) {
//             errorMessages.push(`Invalid Url for company "${name || "Unnamed"}".`);
//             continue;
//           }

//           let pointsOfContact = [];
//           if (pocString) {
//             const pocFields = pocString.split("|").map((s) => s?.trim());
//             const [pocName, pocEmail, countryCode, phone, designation, linkedinProfile] = pocFields;
//             if (pocFields.length !== 6) {
//               errorMessages.push(
//                 `Invalid POC format for company "${name || "Unnamed"}". Expected: Name|Email|CountryCode|Phone|Designation|LinkedInProfile`
//               );
//               continue;
//             }
//             if (pocEmail && !validateEmail(pocEmail)) {
//               errorMessages.push(
//                 `Invalid POC Email for company "${name || "Unnamed"}". POC: ${pocName || "Unnamed"}`
//               );
//               continue;
//             }
//             if (phone && !validatePhone(phone)) {
//               errorMessages.push(
//                 `Invalid POC Phone (must be 7-15 digits) for company "${name || "Unnamed"}". POC: ${
//                   pocName || "Unnamed"
//                 }`
//               );
//               continue;
//             }
//             if (countryCode && !countryCodes.some((cc) => cc.code === countryCode)) {
//               errorMessages.push(
//                 `Invalid POC Country Code for company "${name || "Unnamed"}". POC: ${
//                   pocName || "Unnamed"
//                 }`
//               );
//               continue;
//             }
//             if (linkedinProfile && !validateUrl(linkedinProfile)) {
//               errorMessages.push(
//                 `Invalid POC LinkedInProfile for company "${name || "Unnamed"}". POC: ${
//                   pocName || "Unnamed"
//                 }`
//               );
//               continue;
//             }
//             if (pocName || pocEmail || countryCode || phone || designation || linkedinProfile) {
//               pointsOfContact.push({
//                 name: pocName || "",
//                 email: pocEmail || "",
//                 countryCode: countryCode || "",
//                 mobile: phone || "",
//                 designation: designation || "",
//                 linkedInProfile: linkedinProfile || "",
//               });
//             }
//           }

//           const companyData = {
//             name,
//             address,
//             city,
//             companyType: companyTypes.includes(companyType) ? companyType : "",
//             createdAt: createdAtValidation.formattedDate
//               ? Timestamp.fromDate(createdAtValidation.formattedDate)
//               : serverTimestamp(),
//             domain: domains.includes(domain) ? domain : "",
//             email,
//             // fromDate: fromDateValidation.formattedDate
//             //   ? Timestamp.fromDate(fromDateValidation.formattedDate)
//             //   : null,
//             // toDate: toDateValidation.formattedDate
//             //   ? Timestamp.fromDate(toDateValidation.formattedDate)
//             //   : null,
//             status: ["Active", "Inactive"].includes(status) ? status : "Active",
//             url,
//             pointsOfContact,
//             userId: user.uid,
//           };

//           console.log(`Company Data for ${name}:`, companyData);

//           const docRef = doc(collection(db, "Companies"));
//           batch.set(docRef, companyData);
//           successCount++;
//           logActivity("CREATE_COMPANY_BULK", { name: name || "Unnamed", companyId: docRef.id });
//         }

//         if (successCount > 0) {
//           await batch.commit();
//           console.log(`Batch committed successfully. ${successCount} companies added.`);
//           toast.success(`${successCount} companies uploaded successfully!`);
//           await fetchCompanies();
//         } else {
//           console.log("No valid rows to upload");
//           toast.warn("No valid rows were uploaded. Check the file for errors.");
//         }

//         if (errorMessages.length > 0) {
//           errorMessages.forEach((msg) => {
//             console.error(msg);
//             toast.error(msg);
//           });
//           toast.warn(`${errorMessages.length} rows had issues. Check console for details.`);
//         }

//         setFile(null);
//         toggleSidebar();
//       };
//       reader.readAsArrayBuffer(file);
//     } catch (error) {
//       console.error("Batch commit failed:", error.code, error.message);
//       toast.error(`Failed to upload companies: ${error.message}`);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleClose = () => {
//     toggleSidebar();
//     logActivity("CLOSE_BULK_SIDEBAR", {});
//   };

//   if (!canDisplay) return null;

//   return (
//     <>
//       <ToastContainer position="top-right" autoClose={3000} />
//       <div
//         className={`fixed inset-y-0 right-0 z-50 bg-white w-full sm:w-3/4 md:w-2/5 shadow-lg transform transition-transform duration-300 ${
//           isOpen ? "translate-x-0" : "translate-x-full"
//         } p-4 sm:p-6 overflow-y-auto`}
//       >
//         <div className="flex justify-between items-center mb-4 sm:mb-6">
//           <h1 className="text-lg sm:text-xl font-bold text-gray-800">Add Bulk Companies</h1>
//           <button
//             onClick={handleClose}
//             className="bg-blue-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-200"
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
//             <h2 className="text-sm font-medium text-gray-700">Step 1: Download Template</h2>
//             <p className="text-gray-600 text-sm mb-2">
//               Download the XLSX template, fill in the company details, and upload the file. All fields
//               are optional. Use DD-MM-YYYY, YYYY-MM-DD, MM/DD/YYYY, or D-MMM-YYYY for dates. The POC column
//               should be formatted as: <code>Name|Email|CountryCode|Phone|Designation|LinkedInProfile</code>
//             </p>
//             <button
//               onClick={downloadTemplate}
//               className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
//             >
//               Download Template
//             </button>
//           </div>

//           <div>
//             <h2 className="text-sm font-medium text-gray-700">Step 2: Upload Filled Template</h2>
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
import { addDoc, collection, serverTimestamp, writeBatch, doc, Timestamp } from "firebase/firestore";
import { useAuth } from "../../../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import { parse } from "date-fns";

const domains = ["Finance", "IT", "Healthcare", "Education", "Manufacturing", "Retail", "Other"];
const companyTypes = ["Mid-level", "Startup", "MNC"];
const countryCodes = [
  { code: "+1", label: "USA (+1)" },
  { code: "+1", label: "Canada (+1)" },
  { code: "+91", label: "India (+91)" },
];

const AddBulkCompanies = ({ isOpen, toggleSidebar, fetchCompanies }) => {
  const { user, rolePermissions } = useAuth();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const canCreate = rolePermissions?.Companies?.create || false;
  const canDisplay = rolePermissions?.Companies?.display || false;

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
      console.error("Error logging activity:", error);
    }
  };

  const validateEmail = (email) => {
    if (!email) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    if (!phone) return true;
    return /^\d{7,15}$/.test(phone);
  };

  const validateUrl = (url) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateDate = (dateInput) => {
    if (!dateInput) return { isValid: true, formattedDate: null };

    // Handle Excel serial dates
    if (typeof dateInput === "number") {
      const excelEpoch = new Date(1899, 11, 30);
      const date = new Date(excelEpoch.getTime() + dateInput * 24 * 60 * 60 * 1000);
      if (!isNaN(date.getTime())) {
        return { isValid: true, formattedDate: date };
      }
    }

    // Convert to string and trim
    const dateStr = dateInput.toString().trim();

    // Try parsing various formats using date-fns
    const formats = [
      "yyyy-MM-dd",
      "dd-MM-yyyy",
      "MM/dd/yyyy",
      "d-MMM-yyyy",
      "MMM d, yyyy",
    ];
    for (const format of formats) {
      try {
        const date = parse(dateStr, format, new Date());
        if (!isNaN(date.getTime())) {
          return { isValid: true, formattedDate: date };
        }
      } catch {
        continue;
      }
    }

    return { isValid: false, formattedDate: null };
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        Name: "",
        Address: "",
        City: "",
        CompanyType: "Mid-level|Startup|MNC",
        CreatedAt: "DD-MM-YYYY or YYYY-MM-DD or MM/DD/YYYY",
        Domain: "Finance|IT|Healthcare|Education|Manufacturing|Retail|Other",
        Email: "",
        Status: "Active|Inactive",
        Url: "",
        POC: "Name|Email|CountryCode|Phone|Designation|LinkedInProfile",
      },
    ];
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Companies");
    XLSX.writeFile(wb, "Companies_Template.xlsx");
    logActivity("DOWNLOAD_TEMPLATE", { template: "Companies_Template.xlsx" });
  };

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
      console.log("Invalid file type:", selectedFile?.type);
      toast.error("Please upload a valid XLSX file.");
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!canCreate) {
      console.log("Permission denied: User lacks 'create' permission for Companies");
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
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        console.log("Parsed XLSX Data:", jsonData);

        if (jsonData.length === 0) {
          console.log("Excel file is empty");
          toast.error("The uploaded Excel file is empty.");
          setUploading(false);
          return;
        }

        const expectedHeaders = [
          "Name",
          "Address",
          "City",
          "CompanyType",
          "CreatedAt",
          "Domain",
          "Email",
          "Status",
          "Url",
          "POC",
        ];
        const headers = Object.keys(jsonData[0] || {});
        const missingHeaders = expectedHeaders.filter((h) => !headers.includes(h));
        if (missingHeaders.length > 0) {
          console.log("Missing headers:", missingHeaders);
          toast.error(`Missing required columns in XLSX: ${missingHeaders.join(", ")}`);
          setUploading(false);
          return;
        }

        const batch = writeBatch(db);
        let successCount = 0;
        let errorMessages = [];

        for (const row of jsonData) {
          const name = row["Name"]?.toString().trim() || "";
          const address = row["Address"]?.toString().trim() || "";
          const city = row["City"]?.toString().trim() || "";
          const companyType = row["CompanyType"]?.toString().trim() || "";
          const createdAt = row["CreatedAt"];
          const domain = row["Domain"]?.toString().trim() || "";
          const email = row["Email"]?.toString().trim() || "";
          const status = row["Status"]?.toString().trim() || "Active";
          const url = row["Url"]?.toString().trim() || "";
          const pocString = row["POC"]?.toString().trim();

          // Validate CreatedAt date
          const createdAtValidation = validateDate(createdAt);
          console.log(`CreatedAt for ${name}:`, { input: createdAt, ...createdAtValidation });
          if (!createdAtValidation.isValid && createdAt) {
            errorMessages.push(
              `Invalid CreatedAt date for company "${name || "Unnamed"}". Use DD-MM-YYYY, YYYY-MM-DD, MM/DD/YYYY, or D-MMM-YYYY format.`
            );
            continue;
          }

          // Validate other fields
          if (companyType && !companyTypes.includes(companyType)) {
            errorMessages.push(
              `Invalid CompanyType for company "${name || "Unnamed"}". Must be one of: ${companyTypes.join(
                ", "
              )}. Using empty string.`
            );
          }
          if (!validateEmail(email) && email) {
            errorMessages.push(`Invalid Email for company "${name || "Unnamed"}".`);
            continue;
          }
          if (domain && !domains.includes(domain)) {
            errorMessages.push(
              `Invalid Domain for company "${name || "Unnamed"}". Must be one of: ${domains.join(
                ", "
              )}. Using empty string.`
            );
          }
          if (status && !["Active", "Inactive"].includes(status)) {
            errorMessages.push(
              `Invalid Status for company "${name || "Unnamed"}". Must be Active or Inactive. Using "Active".`
            );
          }
          if (url && !validateUrl(url)) {
            errorMessages.push(`Invalid Url for company "${name || "Unnamed"}".`);
            continue;
          }

          let pointsOfContact = [];
          if (pocString) {
            const pocFields = pocString.split("|").map((s) => s?.trim());
            const [pocName, pocEmail, countryCode, phone, designation, linkedinProfile] = pocFields;
            if (pocFields.length !== 6) {
              errorMessages.push(
                `Invalid POC format for company "${name || "Unnamed"}". Expected: Name|Email|CountryCode|Phone|Designation|LinkedInProfile`
              );
              continue;
            }
            if (pocEmail && !validateEmail(pocEmail)) {
              errorMessages.push(
                `Invalid POC Email for company "${name || "Unnamed"}". POC: ${pocName || "Unnamed"}`
              );
              continue;
            }
            if (phone && !validatePhone(phone)) {
              errorMessages.push(
                `Invalid POC Phone (must be 7-15 digits) for company "${name || "Unnamed"}". POC: ${
                  pocName || "Unnamed"
                }`
              );
              continue;
            }
            if (countryCode && !countryCodes.some((cc) => cc.code === countryCode)) {
              errorMessages.push(
                `Invalid POC Country Code for company "${name || "Unnamed"}". POC: ${
                  pocName || "Unnamed"
                }`
              );
              continue;
            }
            if (linkedinProfile && !validateUrl(linkedinProfile)) {
              errorMessages.push(
                `Invalid POC LinkedInProfile for company "${name || "Unnamed"}". POC: ${
                  pocName || "Unnamed"
                }`
              );
              continue;
            }
            if (pocName || pocEmail || countryCode || phone || designation || linkedinProfile) {
              pointsOfContact.push({
                name: pocName || "",
                email: pocEmail || "",
                countryCode: countryCode || "",
                mobile: phone || "",
                designation: designation || "",
                linkedInProfile: linkedinProfile || "",
              });
            }
          }

          const companyData = {
            name,
            address,
            city,
            companyType: companyTypes.includes(companyType) ? companyType : "",
            createdAt: createdAtValidation.formattedDate
              ? Timestamp.fromDate(createdAtValidation.formattedDate)
              : serverTimestamp(),
            domain: domains.includes(domain) ? domain : "",
            email,
            status: ["Active", "Inactive"].includes(status) ? status : "Active",
            url,
            pointsOfContact,
            userId: user.uid,
          };

          console.log(`Company Data for ${name}:`, companyData);

          const docRef = doc(collection(db, "Companies"));
          batch.set(docRef, companyData);
          successCount++;
          logActivity("CREATE_COMPANY_BULK", { name: name || "Unnamed", companyId: docRef.id });
        }

        if (successCount > 0) {
          await batch.commit();
          console.log(`Batch committed successfully. ${successCount} companies added.`);
          toast.success(`${successCount} companies uploaded successfully!`);
          await fetchCompanies();
        } else {
          console.log("No valid rows to upload");
          toast.warn("No valid rows were uploaded. Check the file for errors.");
        }

        if (errorMessages.length > 0) {
          errorMessages.forEach((msg) => {
            console.error(msg);
            toast.error(msg);
          });
          toast.warn(`${errorMessages.length} rows had issues. Check console for details.`);
        }

        setFile(null);
        toggleSidebar();
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Batch commit failed:", error.code, error.message);
      toast.error(`Failed to upload companies: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    toggleSidebar();
    logActivity("CLOSE_BULK_SIDEBAR", {});
  };

  if (!canDisplay) return null;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div
        className={`fixed inset-y-0 right-0 z-50 bg-white w-full sm:w-3/4 md:w-2/5 shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } p-4 sm:p-6 overflow-y-auto`}
      >
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">Add Bulk Companies</h1>
          <button
            onClick={handleClose}
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-200"
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
            <h2 className="text-sm font-medium text-gray-700">Step 1: Download Template</h2>
            <p className="text-gray-600 text-sm mb-2">
              Download the XLSX template, fill in the company details, and upload the file. All fields
              are optional. Use DD-MM-YYYY, YYYY-MM-DD, MM/DD/YYYY, or D-MMM-YYYY for dates. The POC column
              should be formatted as: <code>Name|Email|CountryCode|Phone|Designation|LinkedInProfile</code>
            </p>
            <button
              onClick={downloadTemplate}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Download Template
            </button>
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-700">Step 2: Upload Filled Template</h2>
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