import React, { useState, useEffect } from "react";
import { db } from "../../../config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { runTransaction } from "firebase/firestore";

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

const AddFinancePartner = ({ isOpen, toggleSidebar, partner }) => {
  const navigate = useNavigate();
  const { user, rolePermissions } = useAuth();
  const [partnerName, setPartnerName] = useState("");
  const [contactPersons, setContactPersons] = useState([]);
  const [scheme, setScheme] = useState([]);
  const [address, setAddress] = useState({
    street: "",
    area: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });
  const [status, setStatus] = useState("Active");
  const [transactionCount, setTransactionCount] = useState(0);
  const [newContact, setNewContact] = useState({ name: "", countryCode: "+91", mobile: "", email: "" });
  const [newScheme, setNewScheme] = useState({ plan: "", total_tenure: "", ratio: "", subvention_rate: "", description: "" });

  // Permission checks
  const canDisplay = rolePermissions?.FinancePartner?.display || false;
  const canCreate = rolePermissions?.FinancePartner?.create || false;
  const canUpdate = rolePermissions?.FinancePartner?.update || false;

  // Activity logging function
  const logActivity = async (action, details) => {
    if (!user?.email) {
      console.warn("No user email found, skipping activity log");
      return;
    }

    const activityLogRef = doc(db, "activityLogs", "logDocument");

    const logEntry = {
      action,
      details,
      timestamp: new Date().toISOString(),
      userEmail: user.email,
      userId: user.uid,
      section: "Finance Partner",
      // adminId: adminId || "N/A",
    };

    try {
      await runTransaction(db, async (transaction) => {
        const logDoc = await transaction.get(activityLogRef);
        let logs = logDoc.exists() ? logDoc.data().logs || [] : [];

        if (!Array.isArray(logs)) {
          logs = [];
        }

        logs.push(logEntry);

        if (logs.length > 1000) {
          logs = logs.slice(-1000);
        }

        transaction.set(activityLogRef, { logs }, { merge: true });
      });
      console.log("Activity logged successfully:", action);
    } catch (error) {
      console.error("Error logging activity:", error);
      // toast.error("Failed to log activity");
    }
  };


  useEffect(() => {
    if (!canDisplay) {
      toast.error("You don't have permission to view this page");
      // logActivity("UNAUTHORIZED_ACCESS_ATTEMPT", { page: "AddFinancePartner" });
      navigate("/unauthorized");
      return;
    }

    const fetchData = async () => {
      if (partner) {
        try {
          const transactionSnapshot = await getDocs(collection(db, `FinancePartner/${partner.id}/Transactions`));
          setTransactionCount(transactionSnapshot.docs.length);
          // logActivity("FETCH_TRANSACTIONS_SUCCESS", { transactionCount: transactionSnapshot.docs.length });
        } catch (error) {
          // //console.error("Error fetching transactions:", error);
          setTransactionCount(0);
          // logActivity("FETCH_TRANSACTIONS_ERROR", { error: error.message });
        }
      }
    };
    fetchData();
    // logActivity("OPEN_SIDEBAR", { mode: partner ? "edit" : "create" });
  }, [canDisplay, navigate, partner]);

  useEffect(() => {
    if (isOpen) {
      if (partner) {
        setPartnerName(partner.name || "");
        setContactPersons(partner.contactPersons || []);
        setScheme(partner.scheme || []);
        setAddress({
          street: partner.address?.street || "",
          area: partner.address?.area || "",
          city: partner.address?.city || "",
          state: partner.address?.state || "",
          country: partner.address?.country || "",
          postalCode: partner.address?.postalCode || "",
        });
        setStatus(partner.status || "Active");
      } else {
        resetForm();
      }
    }
  }, [isOpen, partner]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredPermission = partner ? canUpdate : canCreate;
    const actionType = partner ? "update" : "create";
    if (!requiredPermission) {
      toast.error(`You don't have permission to ${actionType} a finance partner`);
      // logActivity(`UNAUTHORIZED_${actionType.toUpperCase()}_ATTEMPT`, { action: `${actionType}FinancePartner` });
      return;
    }

    const partnerData = {
      name: partnerName,
      contactPersons,
      address,
      status,
      createdAt: serverTimestamp(),
      scheme,
    };

    try {
      if (partner) {
        await updateDoc(doc(db, "FinancePartner", partner.id), partnerData);
        toast.success("Finance Partner updated successfully!");
        logActivity("UPDATE PARTNER ", { name: partnerName });
      } else {
        const docRef = await addDoc(collection(db, "FinancePartner"), partnerData);
        toast.success("Finance Partner added successfully!");
        logActivity("CREATE PARTNER", { name: partnerName, newPartnerId: docRef.id });
      }
      resetForm();
      toggleSidebar();
    } catch (error) {
      // //console.error("Error saving finance partner:", error);
      toast.error("Failed to save finance partner. Please try again.");
      // logActivity(`${actionType.toUpperCase()}_PARTNER_ERROR`, { error: error.message, name: partnerName });
    }
  };

  const resetForm = () => {
    setPartnerName("");
    setContactPersons([]);
    setScheme([]);
    setAddress({ street: "", area: "", city: "", state: "", country: "", postalCode: "" });
    setStatus("Active");
    setTransactionCount(0);
    setNewContact({ name: "", countryCode: "+91", mobile: "", email: "" });
    setNewScheme({ plan: "", total_tenure: "", ratio: "", subvention_rate: "", description: "" });
    logActivity("RESET_FORM", {});
  };

  const handleAddContact = () => {
    if (!canUpdate && partner) {
      toast.error("You don't have permission to update contact persons");
      // logActivity("UNAUTHORIZED_UPDATE_ATTEMPT", { action: "addContact" });
      return;
    }
    if (!canCreate && !partner) {
      toast.error("You don't have permission to create contact persons");
      // logActivity("UNAUTHORIZED_CREATE_ATTEMPT", { action: "addContact" });
      return;
    }
    if (
      newContact.name.trim() &&
      newContact.mobile.trim() &&
      /^\d{7,15}$/.test(newContact.mobile) &&
      newContact.email.trim()
    ) {
      setContactPersons([...contactPersons, { ...newContact }]);
      setNewContact({ name: "", countryCode: "+91", mobile: "", email: "" });
      logActivity("ADD CONTACT", { contactName: newContact.name });
    } else {
      toast.error("Please fill in all contact person details correctly. Mobile number must be 7-15 digits.");
      // logActivity("ADD_CONTACT_FAILED", { reason: "invalid input" });
    }
  };

  const handleAddScheme = () => {
    if (!canUpdate && partner) {
      toast.error("You don't have permission to update schemes");
      // logActivity("UNAUTHORIZED_UPDATE_ATTEMPT", { action: "addScheme" });
      return;
    }
    if (!canCreate && !partner) {
      toast.error("You don't have permission to create schemes");
      // logActivity("UNAUTHORIZED_CREATE_ATTEMPT", { action: "addScheme" });
      return;
    }
    if (
      newScheme.plan.trim() &&
      newScheme.total_tenure.trim() &&
      newScheme.ratio.trim() &&
      newScheme.subvention_rate.trim() &&
      newScheme.description.trim()
    ) {
      setScheme([...scheme, { ...newScheme }]);
      setNewScheme({ plan: "", total_tenure: "", ratio: "", subvention_rate: "", description: "" });
      logActivity("ADD SCHEME", { plan: newScheme.plan });
    } else {
      toast.error("Please fill in all scheme details.");
      // logActivity("ADD_SCHEME_FAILED", { reason: "invalid input" });
    }
  };

  const handleRemoveContact = (index) => {
    if (!canUpdate && partner) {
      toast.error("You don't have permission to update contact persons");
      // logActivity("UNAUTHORIZED_UPDATE_ATTEMPT", { action: "removeContact" });
      return;
    }
    if (!canCreate && !partner) {
      toast.error("You don't have permission to create contact persons");
      // logActivity("UNAUTHORIZED_CREATE_ATTEMPT", { action: "removeContact" });
      return;
    }
    const contactName = contactPersons[index].name;
    setContactPersons(contactPersons.filter((_, i) => i !== index));
    logActivity("REMOVE CONTACT", { contactName });
  };

  const handleRemoveScheme = (index) => {
    if (!canUpdate && partner) {
      toast.error("You don't have permission to update schemes");
      // logActivity("UNAUTHORIZED_UPDATE_ATTEMPT", { action: "removeScheme" });
      return;
    }
    if (!canCreate && !partner) {
      toast.error("You don't have permission to create schemes");
      // logActivity("UNAUTHORIZED_CREATE_ATTEMPT", { action: "removeScheme" });
      return;
    }
    const plan = scheme[index].plan;
    setScheme(scheme.filter((_, i) => i !== index));
    logActivity("REMOVE SCHEME", { plan });
  };

  const handleAddressChange = (field, value) => {
    if (!canUpdate && partner) {
      toast.error("You don't have permission to update address");
      // logActivity("UNAUTHORIZED_UPDATE_ATTEMPT", { action: "updateAddress", field });
      return;
    }
    if (!canCreate && !partner) {
      toast.error("You don't have permission to create address");
      // logActivity("UNAUTHORIZED_CREATE_ATTEMPT", { action: "updateAddress", field });
      return;
    }
    setAddress((prev) => {
      const newAddress = { ...prev, [field]: value };
      logActivity("CHANGE ADDRESS", { field, value });
      return newAddress;
    });
  };

  const handlePartnerNameChange = (value) => {
    if (!canUpdate && partner) {
      toast.error("You don't have permission to update partner name");
      // logActivity("UNAUTHORIZED_UPDATE_ATTEMPT", { action: "updatePartnerName" });
      return;
    }
    if (!canCreate && !partner) {
      toast.error("You don't have permission to create partner name");
      // logActivity("UNAUTHORIZED_CREATE_ATTEMPT", { action: "updatePartnerName" });
      return;
    }
    setPartnerName(value);
    logActivity("CHANGE PARTNER NAME", { value });
  };

  const handleStatusChange = (value) => {
    if (!canUpdate && partner) {
      toast.error("You don't have permission to update status");
      // logActivity("UNAUTHORIZED_UPDATE_ATTEMPT", { action: "updateStatus" });
      return;
    }
    if (!canCreate && !partner) {
      toast.error("You don't have permission to create status");
      // logActivity("UNAUTHORIZED_CREATE_ATTEMPT", { action: "updateStatus" });
      return;
    }
    setStatus(value);
    logActivity("CHANGE STATUS", { value });
  };

  const handleNewContactChange = (field, value) => {
    if (!canUpdate && partner) {
      toast.error("You don't have permission to update contact details");
      // logActivity("UNAUTHORIZED_UPDATE_ATTEMPT", { action: "updateNewContact", field });
      return;
    }
    if (!canCreate && !partner) {
      toast.error("You don't have permission to create contact details");
      // logActivity("UNAUTHORIZED_CREATE_ATTEMPT", { action: "updateNewContact", field });
      return;
    }
    if (field === "mobile") {
      value = value.replace(/\D/g, "").slice(0, 15);
    }
    setNewContact((prev) => {
      const updated = { ...prev, [field]: value };
      logActivity("CHANGE NEW CONTACT", { field, value });
      return updated;
    });
  };

  const handleNewSchemeChange = (field, value) => {
    if (!canUpdate && partner) {
      toast.error("You don't have permission to update scheme details");
      // logActivity("UNAUTHORIZED_UPDATE_ATTEMPT", { action: "updateNewScheme", field });
      return;
    }
    if (!canCreate && !partner) {
      toast.error("You don't have permission to create scheme details");
      // logActivity("UNAUTHORIZED_CREATE_ATTEMPT", { action: "updateNewScheme", field });
      return;
    }
    setNewScheme((prev) => {
      const updated = { ...prev, [field]: value };
      logActivity("CHANGE NEW SCHEME", { field, value });
      return updated;
    });
  };

  const handleClose = () => {
    toggleSidebar();
    // logActivity("CLOSE_SIDEBAR", {});
  };

  if (!canDisplay) return null;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div
        className={`fixed inset-y-0 right-0 z-50 bg-white w-full shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } p-4 sm:p-6 overflow-y-auto`}
      >
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">
            {partner ? "Edit Finance Partner" : "Add Finance Partner"}
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
          {/* Partner Name */}
          <div>
            <label htmlFor="partnerName" className="block text-sm font-medium text-gray-700">
              Partner Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="partnerName"
              value={partnerName}
              onChange={(e) => handlePartnerNameChange(e.target.value)}
              placeholder="Enter partner name"
              required
              disabled={(!canUpdate && partner) || (!canCreate && !partner)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          {/* Contact Persons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Persons</label>
            <div className="flex flex-col sm:flex-row gap-4 mb-4 overflow-x-auto">
              <input
                type="text"
                value={newContact.name}
                onChange={(e) => handleNewContactChange("name", e.target.value)}
                placeholder="Contact Name"
                disabled={(!canUpdate && partner) || (!canCreate && !partner)}
                className="w-full min-w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 disabled:bg-gray-100"
              />
              <input
                type="email"
                value={newContact.email}
                onChange={(e) => handleNewContactChange("email", e.target.value)}
                placeholder="Email Address"
                disabled={(!canUpdate && partner) || (!canCreate && !partner)}
                className="w-full min-w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 disabled:bg-gray-100"
              />
              <select
                value={newContact.countryCode}
                onChange={(e) => handleNewContactChange("countryCode", e.target.value)}
                disabled={(!canUpdate && partner) || (!canCreate && !partner)}
                className="w-full min-w-40 sm:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 disabled:bg-gray-100"
              >
                {countryCodes.map((country) => (
                  <option key={country.code + country.label} value={country.code}>
                    {country.label}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                value={newContact.mobile}
                onChange={(e) => handleNewContactChange("mobile", e.target.value)}
                placeholder="Mobile Number"
                disabled={(!canUpdate && partner) || (!canCreate && !partner)}
                className="w-full min-w-40 sm:w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 disabled:bg-gray-100"
              />
            </div>
            <button
              type="button"
              onClick={handleAddContact}
              disabled={(!canUpdate && partner) || (!canCreate && !partner)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
            >
              Add Contact
            </button>

            {contactPersons.length > 0 && (
              <div className="mt-4 max-h-40 overflow-y-auto border border-gray-300 rounded-md">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-200 text-gray-700 sticky top-0">
                    <tr>
                      <th className="p-3 text-sm font-semibold min-w-40">Sr No</th>
                      <th className="p-3 text-sm font-semibold min-w-40">Name</th>
                      <th className="p-3 text-sm font-semibold min-w-40">Mobile</th>
                      <th className="p-3 text-sm font-semibold min-w-40">Email</th>
                      <th className="p-3 text-sm font-semibold min-w-40">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contactPersons.map((contact, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-gray-600">{index + 1}</td>
                        <td className="p-3 text-gray-600">{contact.name}</td>
                        <td className="p-3 text-gray-600">{contact.countryCode} {contact.mobile}</td>
                        <td className="p-3 text-gray-600">{contact.email}</td>
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => handleRemoveContact(index)}
                            disabled={(!canUpdate && partner) || (!canCreate && !partner)}
                            className="bg-indigo-600 text-white px-2 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
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

          {/* Scheme */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Scheme Details</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                value={newScheme.plan}
                onChange={(e) => handleNewSchemeChange("plan", e.target.value)}
                placeholder="Plan"
                disabled={(!canUpdate && partner) || (!canCreate && !partner)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              <input
                type="text"
                value={newScheme.total_tenure}
                onChange={(e) => handleNewSchemeChange("total_tenure", e.target.value)}
                placeholder="Total Tenure"
                disabled={(!canUpdate && partner) || (!canCreate && !partner)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              <input
                type="text"
                value={newScheme.ratio}
                onChange={(e) => handleNewSchemeChange("ratio", e.target.value)}
                placeholder="Ratio (Downpayment : Total Tenure)"
                disabled={(!canUpdate && partner) || (!canCreate && !partner)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              <input
                type="text"
                value={newScheme.subvention_rate}
                onChange={(e) => handleNewSchemeChange("subvention_rate", e.target.value)}
                placeholder="Subvention Rate"
                disabled={(!canUpdate && partner) || (!canCreate && !partner)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              <input
                type="text"
                value={newScheme.description}
                onChange={(e) => handleNewSchemeChange("description", e.target.value)}
                placeholder="Description"
                disabled={(!canUpdate && partner) || (!canCreate && !partner)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
            <button
              type="button"
              onClick={handleAddScheme}
              disabled={(!canUpdate && partner) || (!canCreate && !partner)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
            >
              Add Scheme
            </button>

            {scheme.length > 0 && (
              <div className="mt-4 max-h-40 overflow-y-auto border border-gray-300 rounded-md">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-200 text-gray-700 sticky top-0">
                    <tr>
                      <th className="p-3 text-sm font-semibold min-w-40">Sr No</th>
                      <th className="p-3 text-sm font-semibold min-w-40">Plan</th>
                      <th className="p-3 text-sm font-semibold min-w-40">Total Tenure</th>
                      <th className="p-3 text-sm font-semibold min-w-40">Ratio</th>
                      <th className="p-3 text-sm font-semibold min-w-40">Subvention Rate</th>
                      <th className="p-3 text-sm font-semibold min-w-40">Description</th>
                      <th className="p-3 text-sm font-semibold min-w-40">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheme.map((s, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-gray-600">{index + 1}</td>
                        <td className="p-3 text-gray-600">{s.plan}</td>
                        <td className="p-3 text-gray-600">{s.total_tenure}</td>
                        <td className="p-3 text-gray-600">{s.ratio}</td>
                        <td className="p-3 text-gray-600">{s.subvention_rate}</td>
                        <td className="p-3 text-gray-600">{s.description}</td>
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => handleRemoveScheme(index)}
                            disabled={(!canUpdate && partner) || (!canCreate && !partner)}
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

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                value={address.street}
                onChange={(e) => handleAddressChange("street", e.target.value)}
                placeholder="Street"
                disabled={(!canUpdate && partner) || (!canCreate && !partner)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              <input
                type="text"
                value={address.area}
                onChange={(e) => handleAddressChange("area", e.target.value)}
                placeholder="Area"
                disabled={(!canUpdate && partner) || (!canCreate && !partner)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              <input
                type="text"
                value={address.city}
                onChange={(e) => handleAddressChange("city", e.target.value)}
                placeholder="City"
                disabled={(!canUpdate && partner) || (!canCreate && !partner)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              <input
                type="text"
                value={address.state}
                onChange={(e) => handleAddressChange("state", e.target.value)}
                placeholder="State"
                disabled={(!canUpdate && partner) || (!canCreate && !partner)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              <input
                type="text"
                value={address.country}
                onChange={(e) => handleAddressChange("country", e.target.value)}
                placeholder="Country"
                disabled={(!canUpdate && partner) || (!canCreate && !partner)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              <input
                type="text"
                value={address.postalCode}
                onChange={(e) => handleAddressChange("postalCode", e.target.value)}
                placeholder="Postal Code"
                disabled={(!canUpdate && partner) || (!canCreate && !partner)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              required
              disabled={(!canUpdate && partner) || (!canCreate && !partner)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Transaction Count */}
          {partner && (
            <div>
              <h3 className="text-sm font-medium text-gray-700">Total Transactions: {transactionCount}</h3>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={(!canUpdate && partner) || (!canCreate && !partner)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
            >
              {partner ? "Update Partner" : "Save Partner"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddFinancePartner;