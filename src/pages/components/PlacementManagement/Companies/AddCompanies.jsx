import React, { useState, useEffect } from "react";
import { db } from "../../../../config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const domains = ["IT", "Healthcare", "Finance", "Education", "Manufacturing", "Retail", "Other"];
const cities = [
  "New York", "Los Angeles", "Chicago", "Houston", "Phoenix",
  "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose",
  "London", "Paris", "Berlin", "Tokyo", "Sydney", "Mumbai", "Toronto"
];
const countryCodes = [
  { code: "+1", label: "USA (+1)" },
  { code: "+1", label: "Canada (+1)" },
  { code: "+7", label: "Russia (+7)" },
  { code: "+20", label: "Egypt (+20)" },
  { code: "+27", label: "South Africa (+27)" },
];

const AddCompanies = ({ isOpen, toggleSidebar, company }) => {
  const navigate = useNavigate();
  const { user, rolePermissions } = useAuth();
  const [companyName, setCompanyName] = useState("");
  const [domain, setDomain] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [url, setUrl] = useState("");
  const [city, setCity] = useState("");
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [pointsOfContact, setPointsOfContact] = useState([]);
  const [newPOC, setNewPOC] = useState({ name: "", countryCode: "+91", mobile: "", email: "", designation: "", linkedInProfile: "" });
  const [status, setStatus] = useState("Active");
  const [transactionCount, setTransactionCount] = useState(0);
  const [companyType, setCompanyType] = useState("");
  const [userDisplayName, setUserDisplayName] = useState("");

  // Permission checks
  const canDisplay = rolePermissions?.Companies?.display || false;
  const canCreate = rolePermissions?.Companies?.create || false;
  const canUpdate = rolePermissions?.Companies?.update || false;

  // Fetch user displayName from Users collection
  useEffect(() => {
    if (!user?.uid) return;

    const fetchUserDisplayName = async () => {
      try {
        const userDocRef = doc(db, "Users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserDisplayName(userData.displayName || user.email || "Unknown User");
        } else {
          console.warn("User document not found in Users collection");
          setUserDisplayName(user.email || "Unknown User");
        }
      } catch (error) {
        //console.error("Error fetching user displayName:", error);
        toast.error(`Failed to fetch user data: ${error.message}`);
        setUserDisplayName(user.email || "Unknown User");
      }
    };

    fetchUserDisplayName();
  }, [user?.uid, user?.email]);

  // Activity logging function
  const logActivity = async (action, details) => {
    try {
      const activityLog = {
        action,
        details: { companyId: company?.id || null, ...details },
        timestamp: new Date().toISOString(),
        userEmail: user?.email || "anonymous",
        userId: user.uid
      };
      await addDoc(collection(db, "activityLogs"), activityLog);
    } catch (error) {
      //console.error("Error logging activity:", error);
    }
  };

  useEffect(() => {
    if (!canDisplay) {
      toast.error("You don't have permission to view this page");
      navigate("/unauthorized");
      return;
    }

    const fetchData = async () => {
      if (company) {
        try {
          const transactionSnapshot = await getDocs(collection(db, `Companies/${company.id}/Transactions`));
          setTransactionCount(transactionSnapshot.docs.length);
        } catch (error) {
          //console.error("Error fetching transactions:", error);
          setTransactionCount(0);
        }
      }
    };
    fetchData();
  }, [canDisplay, navigate, company]);

  useEffect(() => {
    if (isOpen) {
      if (company) {
        setCompanyName(company.name || "");
        setDomain(company.domain || "");
        setPhone(company.phone || "");
        setEmail(company.email || "");
        setCity(company.city || "");
        setUrl(company.url || "");
        setPointsOfContact(company.pointsOfContact || []);
        setStatus(company.status || "Active");
        setNewPOC({ name: "", countryCode: "+91", mobile: "", email: "", designation: "", linkedInProfile: "" });
        setCompanyType(company.companyType || "");
      } else {
        resetForm();
      }
    }
  }, [isOpen, company]);

  const resetForm = () => {
    setCompanyName("");
    setDomain("");
    setPhone("");
    setEmail("");
    setCity("");
    setUrl("");
    setCitySuggestions([]);
    setPointsOfContact([]);
    setStatus("Active");
    setTransactionCount(0);
    setNewPOC({ name: "", countryCode: "+91", mobile: "", email: "", designation: "", linkedInProfile: "" });
    setCompanyType("");
    logActivity("RESET_FORM", {});
  };

  const validateEmail = (email) => {
    return email ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) : true;
  };

  const validatePhone = (phone) => {
    return phone ? /^\d{10}$/.test(phone) : true;
  };

  const validatePOCMobile = (mobile) => {
    return mobile ? /^\d{7,15}$/.test(mobile) : true;
  };

  const validateLinkedInProfile = (url) => {
    return url ? /^(https?:\/\/)?([\w]+\.)?linkedin\.com\/.*$/.test(url) : true;
  };

  const handleCityChange = (value) => {
    if (!canUpdate && company) {
      toast.error("You don't have permission to update city");
      return;
    }
    if (!canCreate && !company) {
      toast.error("You don't have permission to create city");
      return;
    }
    setCity(value);
    if (value.trim()) {
      const filteredCities = cities.filter((c) =>
        c.toLowerCase().includes(value.toLowerCase())
      );
      setCitySuggestions(filteredCities);
    } else {
      setCitySuggestions([]);
    }
    logActivity("CHANGE_CITY", { value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredPermission = company ? canUpdate : canCreate;
    const actionType = company ? "update" : "create";
    if (!requiredPermission) {
      toast.error(`You don't have permission to ${actionType} a company`);
      return;
    }

    if (!companyName.trim()) {
      toast.error("Company Name is required");
      return;
    }

    const companyHistoryEntry = {
      action: company ? "Updated" : "Created",
      performedBy: userDisplayName,
      timestamp: new Date().toISOString(),
      details: company ? `Updated company "${companyName}"` : `Created company "${companyName}"`,
    };

    const companyData = {
      name: companyName,
      domain,
      phone,
      email,
      url,
      city,
      pointsOfContact,
      status,
      companyType,
      history: company ? [...(company.history || []), companyHistoryEntry] : [companyHistoryEntry],
    };

    try {
      if (company) {
        await updateDoc(doc(db, "Companies", company.id), {
          ...companyData,
          updatedAt: serverTimestamp(),
        });
        toast.success("Company updated successfully!");
        logActivity("UPDATE_COMPANY", { name: companyName });
      } else {
        const docRef = await addDoc(collection(db, "Companies"), {
          ...companyData,
          createdAt: serverTimestamp(),
        });
        toast.success("Company added successfully!");
        logActivity("CREATE_COMPANY", { name: companyName, newCompanyId: docRef.id });
      }
      resetForm();
      toggleSidebar();
    } catch (error) {
      //console.error("Error saving Company:", error);
      toast.error("Failed to save Company. Please try again.");
    }
  };

  const handleAddPOC = () => {
    if (!canUpdate && company) {
      toast.error("You don't have permission to update points of contact");
      return;
    }
    if (!canCreate && !company) {
      toast.error("You don't have permission to create points of contact");
      return;
    }
    if (!newPOC.name.trim()) {
      toast.error("POC name is required");
      return;
    }
    if (!newPOC.email && !newPOC.mobile) {
      toast.error("At least one of email or mobile number is required for POC");
      return;
    }
    if (newPOC.email && !validateEmail(newPOC.email)) {
      toast.error("Invalid POC email format");
      return;
    }
    if (newPOC.mobile && !validatePOCMobile(newPOC.mobile)) {
      toast.error("POC mobile number must be 7-15 digits");
      return;
    }
    if (newPOC.linkedInProfile && !validateLinkedInProfile(newPOC.linkedInProfile)) {
      toast.error("Invalid LinkedIn profile URL");
      return;
    }
    setPointsOfContact([...pointsOfContact, { ...newPOC }]);
    setNewPOC({ name: "", countryCode: "+91", mobile: "", email: "", designation: "", linkedInProfile: "" });
    logActivity("ADD_POC", { pocName: newPOC.name });
  };

  const handleRemovePOC = (index) => {
    if (!canUpdate && company) {
      toast.error("You don't have permission to update points of contact");
      return;
    }
    if (!canCreate && !company) {
      toast.error("You don't have permission to create points of contact");
      return;
    }
    const pocName = pointsOfContact[index].name;
    setPointsOfContact(pointsOfContact.filter((_, i) => i !== index));
    logActivity("REMOVE_POC", { pocName });
  };

  const handlePOCChange = (field, value) => {
    if (!canUpdate && company) {
      toast.error("You don't have permission to update POC details");
      return;
    }
    if (!canCreate && !company) {
      toast.error("You don't have permission to create POC details");
      return;
    }
    if (field === "mobile") {
      value = value.replace(/\D/g, "").slice(0, 15);
    }
    setNewPOC((prev) => {
      const updated = { ...prev, [field]: value };
      logActivity("CHANGE_NEW_POC", { field, value });
      return updated;
    });
  };

  const handleClose = () => {
    toggleSidebar();
    logActivity("CLOSE_SIDEBAR", {});
  };

  if (!canDisplay) return null;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div
        className={`fixed inset-y-0 right-0 z-50 bg-white w-full sm:w-3/4 md:w-2/5 shadow-lg transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"} p-4 sm:p-6 overflow-y-auto`}
      >
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">
            {company ? "Edit Company" : "Add Company"}
          </h1>
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

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Company Name */}
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company name"
              required
              disabled={(!canUpdate && company) || (!canCreate && !company)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          {/* Domain */}
          <div>
            <label htmlFor="domain" className="block text-sm font-medium text-gray-700">
              Domain
            </label>
            <select
              id="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">Select Domain</option>
              {domains.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="companyType" className="block text-sm font-medium text-gray-700">
              Company Type
            </label>
            <select
              id="companyType"
              value={companyType}
              onChange={(e) => setCompanyType(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              aria-describedby="companyTypeError"
            >
              <option value="" disabled>
                Select company type
              </option>
              <option value="Startup">Startup</option>
              <option value="Mid-level">Mid-level</option>
              <option value="MNC">MNC</option>
            </select>
            <p id="companyTypeError" className="mt-1 text-sm text-red-600 hidden">
              Please select a company type
            </p>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="Enter 10-digit phone number"
              disabled={(!canUpdate && company) || (!canCreate && !company)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              disabled={(!canUpdate && company) || (!canCreate && !company)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>
          <div>
            <label htmlFor="careerPage" className="block text-sm font-medium text-gray-700">
              Career Page URL
            </label>
            <input
              type="url"
              id="careerPage"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/careers"
              pattern="https?://.+"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              aria-describedby="careerPageError"
            />
            <p id="careerPageError" className="mt-1 text-sm text-red-600 hidden">
              Please enter a valid URL starting with http:// or https://
            </p>
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => handleCityChange(e.target.value)}
              placeholder="Enter city"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
            {citySuggestions.length > 0 && (
              <ul className="mt-1 max-h-40 overflow-y-auto border border-gray-300 rounded-md bg-white">
                {citySuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      setCity(suggestion);
                      setCitySuggestions([]);
                    }}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Points of Contact */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Points of Contact</label>
            <div className="flex flex-col gap-4 mb-4">
              <input
                type="text"
                value={newPOC.name}
                onChange={(e) => handlePOCChange("name", e.target.value)}
                placeholder="Contact Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 disabled:bg-gray-100"
              />
              <input
                type="text"
                value={newPOC.designation}
                onChange={(e) => handlePOCChange("designation", e.target.value)}
                placeholder="Designation"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 disabled:bg-gray-100"
              />
              <input
                type="email"
                value={newPOC.email}
                onChange={(e) => handlePOCChange("email", e.target.value)}
                placeholder="Email Address (optional if mobile provided)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 disabled:bg-gray-100"
              />
              <div className="flex gap-4">
                <select
                  value={newPOC.countryCode}
                  onChange={(e) => handlePOCChange("countryCode", e.target.value)}
                  className="w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 disabled:bg-gray-100"
                >
                  {countryCodes.map((country) => (
                    <option key={country.code + country.label} value={country.code}>
                      {country.label}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  value={newPOC.mobile}
                  onChange={(e) => handlePOCChange("mobile", e.target.value)}
                  placeholder="Mobile Number (optional if email provided)"
                  className="w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 disabled:bg-gray-100"
                />
              </div>
              <input
                type="url"
                value={newPOC.linkedInProfile}
                onChange={(e) => handlePOCChange("linkedInProfile", e.target.value)}
                placeholder="LinkedIn Profile URL (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 disabled:bg-gray-100"
              />
            </div>
            <button
              type="button"
              onClick={handleAddPOC}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200 w-full sm:w-auto disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Add POC
            </button>

            {pointsOfContact.length > 0 && (
              <div className="mt-4 max-h-40 overflow-y-auto border border-gray-300 rounded-md">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-200 text-gray-700 sticky top-0">
                    <tr>
                      <th className="p-3 text-sm font-semibold min-w-10">Sr No</th>
                      <th className="p-3 text-sm font-semibold min-w-40">Name</th>
                      <th className="p-3 text-sm font-semibold min-w-40">Designation</th>
                      <th className="p-3 text-sm font-semibold min-w-40">Mobile</th>
                      <th className="p-3 text-sm font-semibold min-w-40">Email</th>
                      <th className="p-3 text-sm font-semibold min-w-40">LinkedIn</th>
                      <th className="p-3 text-sm font-semibold min-w-10">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pointsOfContact.map((poc, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-gray-600">{index + 1}</td>
                        <td className="p-3 text-gray-600">{poc.name}</td>
                        <td className="p-3 text-gray-600">{poc.designation || "N/A"}</td>
                        <td className="p-3 text-gray-600">{poc.mobile ? `${poc.countryCode} ${poc.mobile}` : "N/A"}</td>
                        <td className="p-3 text-gray-600">{poc.email || "N/A"}</td>
                        <td className="p-3 text-gray-600">
                          {poc.linkedInProfile ? (
                            <a href={poc.linkedInProfile} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                              Profile
                            </a>
                          ) : "N/A"}
                        </td>
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => handleRemovePOC(index)}
                            disabled={(!canUpdate && company) || (!canCreate && !company)}
                            className="text-red-500 hover:text-red-700 font-bold disabled:text-gray-400 disabled:cursor-not-allowed"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200 w-full sm:w-auto disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {company ? "Update Company" : "Save Company"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddCompanies;