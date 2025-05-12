import React, { useState, useEffect } from "react";
import { db } from "../../../../config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
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
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [companyType, setCompanyType] = useState("");

  // Permission checks
  const canDisplay = rolePermissions?.Companies?.display || false;
  const canCreate = rolePermissions?.Companies?.create || false;
  const canUpdate = rolePermissions?.Companies?.update || false;

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
      console.error("Error logging activity:", error);
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
          console.error("Error fetching transactions:", error);
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
        setFromDate(company.fromDate || "");
        setToDate(company.toDate || "");
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
    logActivity("RESET_FORM", {});
    setFromDate("");
    setToDate("");
    setCompanyType("");
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

    const companyData = {
      name: companyName,
      domain,
      phone,
      email,
      url,
      city,
      pointsOfContact,
      status,
      createdAt: serverTimestamp(),
      toDate,
      fromDate,
      companyType,
    };

    try {
      if (company) {
        await updateDoc(doc(db, "Companies", company.id), companyData);
        toast.success("Company updated successfully!");
        logActivity("UPDATE_COMPANY", { name: companyName });
      } else {
        const docRef = await addDoc(collection(db, "Companies"), companyData);
        toast.success("Company added successfully!");
        logActivity("CREATE_COMPANY", { name: companyName, newCompanyId: docRef.id });
      }
      resetForm();
      toggleSidebar();
    } catch (error) {
      console.error("Error saving Company:", error);
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
              Company Name
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

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Hiring Period
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="hiringFrom" className="block text-sm font-medium text-gray-600">
                  From
                </label>
                <input
                  type="date"
                  id="hiringFrom"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  aria-describedby="hiringFromError"
                />
                <p id="hiringFromError" className="mt-1 text-sm text-red-600 hidden">
                  Please select a valid start date
                </p>
              </div>
              <div>
                <label htmlFor="hiringTo" className="block text-sm font-medium text-gray-600">
                  To
                </label>
                <input
                  type="date"
                  id="hiringTo"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  min={fromDate || undefined}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  aria-describedby="hiringToError"
                />
                <p id="hiringToError" className="mt-1 text-sm text-red-600 hidden">
                  End date must be after the start date
                </p>
              </div>
            </div>
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