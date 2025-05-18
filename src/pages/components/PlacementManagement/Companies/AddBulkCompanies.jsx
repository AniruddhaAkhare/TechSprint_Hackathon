import React, { useState } from "react";
import { db } from "../../../../config/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";

const domains = ["Finance", "IT", "Healthcare", "Education", "Manufacturing", "Retail", "Other"];
const companyTypes = ["Mid-level", "Startup", "MNC"];
const countryCodes = [
  { code: "+1", label: "USA (+1)" },
  { code: "+1", label: "Canada (+1)" },
  { code: "+91", label: "India (+91)" },

  // ... (rest of the country codes remain unchanged)
];

const AddBulkCompanies = ({ isOpen, toggleSidebar }) => {
  const { user, rolePermissions } = useAuth();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Permission checks
  const canCreate = rolePermissions?.Companies?.create || false;
  const canDisplay = rolePermissions?.Companies?.display || false;

  // Activity logging function
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
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^\d{7,15}$/.test(phone);
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateDate = (date) => {
    return !isNaN(Date.parse(date));
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        "Name": "",
        "Address": "",
        "City": "",
        "CompanyType": "Mid-level|Startup|MNC",
        "CreatedAt": "YYYY-MM-DD",
        "Domain": "Finance|IT|Healthcare|Education|Manufacturing|Retail|Other",
        "Email": "",
        "FromDate": "YYYY-MM-DD",
        "ToDate": "YYYY-MM-DD",
        "Status": "Active|Inactive",
        "Url": "",
        "POC": "Name|Email|CountryCode|Phone|Designation|LinkedInProfile;Name2|Email2|CountryCode2|Phone2|Designation2|LinkedInProfile2",
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
    if (selectedFile && selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      setFile(selectedFile);
      logActivity("SELECT_FILE", { fileName: selectedFile.name });
    } else {
      toast.error("Please upload a valid XLSX file.");
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!canCreate) {
      toast.error("You don't have permission to create companies");
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

        for (const row of jsonData) {
          const name = row["Name"]?.toString().trim();
          const address = row["Address"]?.toString().trim();
          const city = row["City"]?.toString().trim();
          const companyType = row["CompanyType"]?.toString().trim();
          const createdAt = row["CreatedAt"]?.toString().trim();
          const domain = row["Domain"]?.toString().trim();
          const email = row["Email"]?.toString().trim();
          const fromDate = row["FromDate"]?.toString().trim();
          const toDate = row["ToDate"]?.toString().trim();
          const status = row["Status"]?.toString().trim();
          const url = row["Url"]?.toString().trim();
          const pocString = row["POC"]?.toString().trim();

          // Validate required fields
          if (!name) {
            toast.error(`Missing Name in row: ${JSON.stringify(row)}`);
            continue;
          }
          if (!address) {
            toast.error(`Missing Address in row: ${name}`);
            continue;
          }
          if (!city) {
            toast.error(`Missing City in row: ${name}`);
            continue;
          }
          if (!companyType || !companyTypes.includes(companyType)) {
            toast.error(`Invalid CompanyType in row: ${name}. Must be one of: ${companyTypes.join(", ")}`);
            continue;
          }
          if (createdAt && !validateDate(createdAt)) {
            toast.error(`Invalid CreatedAt date in row: ${name}`);
            continue;
          }
          if (!validateEmail(email)) {
            toast.error(`Invalid Email in row: ${name}`);
            continue;
          }
          if (domain && !domains.includes(domain)) {
            toast.error(`Invalid Domain in row: ${name}. Must be one of: ${domains.join(", ")}`);
            continue;
          }
          if (fromDate && !validateDate(fromDate)) {
            toast.error(`Invalid FromDate in row: ${name}`);
            continue;
          }
          if (toDate && !validateDate(toDate)) {
            toast.error(`Invalid ToDate in row: ${name}`);
            continue;
          }
          if (status && !["Active", "Inactive"].includes(status)) {
            toast.error(`Invalid Status in row: ${name}. Must be Active or Inactive`);
            continue;
          }
          if (url && !validateUrl(url)) {
            toast.error(`Invalid Url in row: ${name}`);
            continue;
          }

          // Parse POC
          let pointsOfContact = [];
          if (pocString) {
            const pocEntries = pocString.split(";");
            for (const entry of pocEntries) {
              const [pocName, pocEmail, countryCode, phone, designation, linkedinProfile] = entry
                .split("|")
                .map((s) => s?.trim());
              if (!pocName || !pocEmail || !countryCode || !phone || !designation) {
                toast.error(`Invalid POC format in row: ${name}. POC: ${entry}`);
                continue;
              }
              if (!validateEmail(pocEmail)) {
                toast.error(`Invalid POC Email in row: ${name}. POC: ${pocName}`);
                continue;
              }
              if (!validatePhone(phone)) {
                toast.error(`Invalid POC Phone (must be 7-15 digits) in row: ${name}. POC: ${pocName}`);
                continue;
              }
              if (!countryCodes.some((cc) => cc.code === countryCode)) {
                toast.error(`Invalid POC Country Code in row: ${name}. POC: ${pocName}`);
                continue;
              }
              if (linkedinProfile && !validateUrl(linkedinProfile)) {
                toast.error(`Invalid POC LinkedInProfile in row: ${name}. POC: ${pocName}`);
                continue;
              }
              pointsOfContact.push({
                name: pocName,
                email: pocEmail,
                countryCode,
                phone,
                designation,
                linkedinProfile: linkedinProfile || "",
              });
            }
          }

          const companyData = {
            name,
            address,
            city,
            companyType,
            createdAt: createdAt ? new Date(createdAt) : serverTimestamp(),
            domain: domain || "",
            email,
            fromDate: fromDate ? new Date(fromDate) : null,
            toDate: toDate ? new Date(toDate) : null,
            status: status || "Active",
            url: url || "",
            pointsOfContact,
          };

          await addDoc(collection(db, "Companies"), companyData);
          logActivity("CREATE_COMPANY_BULK", { name });
        }

        toast.success("Companies uploaded successfully!");
        setFile(null);
        toggleSidebar();
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Error uploading companies:", error);
      toast.error("Failed to upload companies. Please try again.");
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
              Download the XLSX template, fill in the company details, and upload the file. The POC column should be formatted as:
              <code>Name|Email|CountryCode|Phone|Designation|LinkedInProfile;Name2|Email2|CountryCode2|Phone2|Designation2|LinkedInProfile2</code>
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