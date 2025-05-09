import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteDoc, collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Timestamp } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../context/AuthContext";

export default function EditStaff() {
    const { staffId } = useParams();
    const navigate = useNavigate();
    const { rolePermissions, user } = useAuth();
    const [staff, setStaff] = useState({
        Name: "",
        email: "",
        phoneNumber: "",
        address: { street: "", area: "", city: "", state: "", zip: "", country: "" },
        date_of_birth: "",
        joining_date: "",
        educationDetails: [],
        experienceDetails: [],
        guardian_details: { name: "", phoneNumber: "", email: "", relation: "", occupation: "" },
    });
    const [countryCode, setCountryCode] = useState("+91");
    const [guardianCountryCode, setGuardianCountryCode] = useState("+91");
    const [isOpen, setIsOpen] = useState(false);

    // Define permissions
    const canDisplay = rolePermissions?.instructor?.display || false;
    const canUpdate = rolePermissions?.instructor?.update || false;
    const canDelete = rolePermissions?.instructor?.delete || false;

    // Activity logging function
    const logActivity = async (action, details) => {
        try {
            const activityLog = {
                action,
                details: { staffId, ...details },
                timestamp: new Date().toISOString(),
                userEmail: user?.email || "anonymous",
                userId: user?.uid || "anonymous",
            };
            await addDoc(collection(db, "activityLogs"), activityLog);
        } catch (error) {
            console.error("Error logging activity:", error);
        }
    };

    // List of country codes (unchanged)
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

    useEffect(() => {
        if (!canDisplay) {
            toast.error("You don't have permission to view this page");
            navigate("/unauthorized");
            return;
        }
        const fetchData = async () => {
            await Promise.all([
                fetchStaff(),
       
            ]);
            setTimeout(() => setIsOpen(true), 10); // Trigger slide-in animation
        };
        fetchData();
    }, [staffId, canDisplay, navigate]);

    const fetchStaff = async () => {
        try {
            const staffRef = doc(db, "Instructor", staffId);
            const staffSnap = await getDoc(staffRef);
            if (staffSnap.exists()) {
                const data = staffSnap.data();
                const staffPhone = data.phone || "";
                const guardianPhone = data.guardian_details?.phone || "";
                setStaff({
                    Name: data.Name || "",
                    email: data.email || "",
                    phoneNumber: staffPhone.startsWith("+") ? staffPhone.slice(staffPhone.indexOf("+") + 3) : staffPhone,
                    address: data.residential_address || { street: "", area: "", city: "", state: "", zip: "", country: "" },
                    date_of_birth: data.date_of_birth ? data.date_of_birth.toDate().toISOString().split("T")[0] : "",
                    joining_date: data.admission_date ? data.admission_date.toDate().toISOString().split("T")[0] : "",
                    educationDetails: data.education_details || [],
                    experienceDetails: data.experience_details || [],
                    guardian_details: {
                        name: data.guardian_details?.name || "",
                        phone: guardianPhone.startsWith("+") ? guardianPhone.slice(guardianPhone.indexOf("+") + 3) : guardianPhone,
                        email: data.guardian_details?.email || "",
                        relation: data.guardian_details?.relation || "",
                        occupation: data.guardian_details?.occupation || "",
                    },
                });
                setCountryCode(staffPhone.startsWith("+") ? staffPhone.slice(0, staffPhone.indexOf("+") + 3) : "+91");
                setGuardianCountryCode(guardianPhone.startsWith("+") ? guardianPhone.slice(0, guardianPhone.indexOf("+") + 3) : "+91");
            } else {
                toast.error("Staff not found");
                navigate("/instructor");
            }
        } catch (error) {
            console.error("Error fetching staff data:", error);
            toast.error("Failed to fetch staff data");
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes("address")) {
            const field = name.split(".")[1];
            setStaff(prev => ({ ...prev, address: { ...prev.address, [field]: value } }));
        } else if (name.includes("guardian_details")) {
            const field = name.split(".")[1];
            setStaff(prev => ({ ...prev, guardian_details: { ...prev.guardian_details, [field]: value } }));
        } else if (name.includes("educationDetails")) {
            const [_, index, fieldName] = name.split(".");
            setStaff(prev => {
                const updatedEducation = [...prev.educationDetails];
                updatedEducation[index][fieldName] = value;
                return { ...prev, educationDetails: updatedEducation };
            });
        } else if (name.includes("experienceDetails")) {
            const [_, index, fieldName] = name.split(".");
            setStaff(prev => {
                const updatedExperience = [...prev.experienceDetails];
                updatedExperience[index][fieldName] = value;
                return { ...prev, experienceDetails: updatedExperience };
            });
        }  else {
            setStaff(prev => ({ ...prev, [name]: value }));
        }
        logActivity("FIELD CHANGED", { field: name, value });
    };


    const addExperience = () => {
        if (!canUpdate) {
            toast.error("You don't have permission to update staff details");
            return;
        }
        setStaff(prev => ({ ...prev, experienceDetails: [...prev.experienceDetails, { companyName: '', designation: '', salary: '', years: '', description: '' }] }));
        logActivity("ADD EXPERIENCE", {});
    };


    const deleteEducation = (index) => {
        if (!canUpdate) {
            toast.error("You don't have permission to update staff details");
            return;
        }
        setStaff(prev => ({ ...prev, educationDetails: prev.educationDetails.filter((_, i) => i !== index) }));
        logActivity("DELETE EDUCATION", { index });
    };

    
    const deleteExperience = (index) => {
        if (!canUpdate) {
            toast.error("You don't have permission to update staff details");
            return;
        }
        setStaff(prev => ({ ...prev, experienceDetails: prev.experienceDetails.filter((_, i) => i !== index) }));
        logActivity("DELETE EXPERIENCE", { index });
    };


    
    // Validate and format date for Firestore Timestamp
    const validateDate = (dateValue, fieldName, isRequired = false) => {
        if (!dateValue && !isRequired) {
            return null; // Allow null for optional fields
        }
        if (!dateValue && isRequired) {
            toast.warn(`${fieldName} is required; using current date`);
            return Timestamp.fromDate(new Date());
        }
        const date = new Date(dateValue);
        if (isNaN(date.getTime())) {
            console.warn(`Invalid date value for ${fieldName}: ${dateValue}`);
            toast.warn(`Invalid ${fieldName} provided; using current date`);
            return Timestamp.fromDate(new Date());
        }
        return Timestamp.fromDate(date);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!canUpdate) {
            toast.error("You don't have permission to update staff details");
            return;
        }

        if (!staff.Name || !staff.email || !staff.phoneNumber || !staff.date_of_birth) {
            toast.error("Please fill necessary fields: First Name, Last Name, Email, Phone Number, Date of Birth");
            return;
        }

        const fullPhoneNumber = `${countryCode}${staff.phoneNumber}`;
        const fullGuardianPhoneNumber = `${guardianCountryCode}${staff.guardian_details.phoneNumber || ""}`;

        try {
            const staffRef = doc(db, "Instructor", staffId);
            await updateDoc(staffRef, {
                Name: staff.Name,
                email: staff.email,
                phone: fullPhoneNumber,
                residential_address: staff.address,
                date_of_birth: validateDate(staff.date_of_birth, "Date of Birth", true),
                joining_date: validateDate(staff.admission_date, "Joining Date", false),
                education_details: staff.educationDetails,
                experience_details: staff.experienceDetails,
                preferred_centers: staff.preferred_centers,
                guardian_details: {
                    ...staff.guardian_details,
                    phone: fullGuardianPhoneNumber,
                },
            });

            toast.success("Staff updated successfully!");
            logActivity("UPDATE STAFF SUCCESS", { updatedFields: Object.keys(staff) });
            navigate("/instructor");
        } catch (error) {
            console.error("Error updating staff:", error);
            toast.error("Failed to update staff");
        }
    };

    const handleDelete = async () => {
        if (!canDelete) {
            toast.error("You don't have permission to delete staffs");
            return;
        }

        if (window.confirm("Are you sure you want to delete this staff?")) {
            try {
                await deleteDoc(doc(db, "Instructor", staffId));
                toast.success("Staff deleted successfully!");
                logActivity("DELETE STAFF SUCCESS", {});
                navigate("/instructor");
            } catch (error) {
                console.error("Error deleting staff:", error);
                toast.error("Failed to delete staff");
            }
        } else {
            logActivity("CANCEL DELETE STAFF", {});
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setTimeout(() => {
            navigate("/instructor");
        }, 300);
    };


    if (!canDisplay) return null;

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={handleClose}
            />
            <div
                className={`fixed top-0 right-0 h-full bg-gray-50 w-3/4 shadow-lg transform transition-transform duration-300 ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                } z-50 overflow-y-auto`}
            >
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-800">Edit Staff</h1>
                        <button
                            onClick={handleClose}
                            className="text-gray-500 hover:text-gray-700 transition duration-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleUpdate} className="space-y-8 bg-white p-6 rounded-lg shadow-md">
                        {/* Personal Details */}
                        <div>
                            <h2 className="text-lg font-medium text-gray-700 mb-4">Personal Details</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={staff.Name}
                                        onChange={handleChange}
                                        placeholder="Name"
                                        required
                                        disabled={!canUpdate}
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={staff.email}
                                        onChange={handleChange}
                                        placeholder="Email"
                                        required
                                        disabled={!canUpdate}
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Phone</label>
                                    <div className="flex mt-1">
                                        <select
                                            value={countryCode}
                                            onChange={(e) => {
                                                setCountryCode(e.target.value);
                                                logActivity("CHANGE COUNTRY CODE", { field: "phone", value: e.target.value });
                                            }}
                                            disabled={!canUpdate}
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
                                            name="phoneNumber"
                                            value={staff.phoneNumber}
                                            onChange={handleChange}
                                            placeholder="Phone Number"
                                            required
                                            disabled={!canUpdate}
                                            className="w-2/3 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
                                    <input
                                        type="date"
                                        name="date_of_birth"
                                        value={staff.date_of_birth}
                                        onChange={handleChange}
                                        required
                                        disabled={!canUpdate}
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Joining Date</label>
                                    <input
                                        type="date"
                                        name="joining_date"
                                        value={staff.admission_date}
                                        onChange={handleChange}
                                        disabled={!canUpdate}
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Guardian Details */}
                        <div>
                            <h2 className="text-lg font-medium text-gray-700 mb-4">Guardian Details</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Name</label>
                                    <input
                                        type="text"
                                        name="guardian_details.name"
                                        value={staff.guardian_details.name}
                                        onChange={handleChange}
                                        placeholder="Guardian Name"
                                        disabled={!canUpdate}
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Phone</label>
                                    <div className="flex mt-1">
                                        <select
                                            value={guardianCountryCode}
                                            onChange={(e) => {
                                                setGuardianCountryCode(e.target.value);
                                                logActivity("CHANGE COUNTRY CODE", { field: "guardian_phone", value: e.target.value });
                                            }}
                                            disabled={!canUpdate}
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
                                            name="guardian_details.phoneNumber"
                                            value={staff.guardian_details.phoneNumber}
                                            onChange={handleChange}
                                            placeholder="Guardian Phone"
                                            disabled={!canUpdate}
                                            className="w-2/3 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Email</label>
                                    <input
                                        type="email"
                                        name="guardian_details.email"
                                        value={staff.guardian_details.email}
                                        onChange={handleChange}
                                        placeholder="Guardian Email"
                                        disabled={!canUpdate}
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Relation</label>
                                    <input
                                        type="text"
                                        name="guardian_details.relation"
                                        value={staff.guardian_details.relation}
                                        onChange={handleChange}
                                        placeholder="Relation"
                                        disabled={!canUpdate}
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Occupation</label>
                                    <input
                                        type="text"
                                        name="guardian_details.occupation"
                                        value={staff.guardian_details.occupation}
                                        onChange={handleChange}
                                        placeholder="Occupation"
                                        disabled={!canUpdate}
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Address Details */}
                        <div>
                            <h2 className="text-lg font-medium text-gray-700 mb-4">Address Details</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-md font-medium text-gray-600 mb-2">Residential Address</h3>
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            name="address.street"
                                            value={staff.address.street}
                                            onChange={handleChange}
                                            placeholder="Street"
                                            disabled={!canUpdate}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="text"
                                            name="address.area"
                                            value={staff.address.area}
                                            onChange={handleChange}
                                            placeholder="Area"
                                            disabled={!canUpdate}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="text"
                                            name="address.city"
                                            value={staff.address.city}
                                            onChange={handleChange}
                                            placeholder="City"
                                            disabled={!canUpdate}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="text"
                                            name="address.state"
                                            value={staff.address.state}
                                            onChange={handleChange}
                                            placeholder="State"
                                            disabled={!canUpdate}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="text"
                                            name="address.zip"
                                            value={staff.address.zip}
                                            onChange={handleChange}
                                            placeholder="Zip Code"
                                            disabled={!canUpdate}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="text"
                                            name="address.country"
                                            value={staff.address.country}
                                            onChange={handleChange}
                                            placeholder="Country"
                                            disabled={!canUpdate}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-md font-medium text-gray-600 mb-2">Billing Address</h3>
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            name="billingAddress.name"
                                            value={staff.billingAddress.name}
                                            onChange={handleChange}
                                            placeholder="Name / Company Name"
                                            disabled={!canUpdate}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="text"
                                            name="billingAddress.street"
                                            value={staff.billingAddress.street}
                                            onChange={handleChange}
                                            placeholder="Street"
                                            disabled={!canUpdate}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="text"
                                            name="billingAddress.area"
                                            value={staff.billingAddress.area}
                                            onChange={handleChange}
                                            placeholder="Area"
                                            disabled={!canUpdate}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="text"
                                            name="billingAddress.city"
                                            value={staff.billingAddress.city}
                                            onChange={handleChange}
                                            placeholder="City"
                                            disabled={!canUpdate}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="text"
                                            name="billingAddress.state"
                                            value={staff.billingAddress.state}
                                            onChange={handleChange}
                                            placeholder="State"
                                            disabled={!canUpdate}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="text"
                                            name="billingAddress.zip"
                                            value={staff.billingAddress.zip}
                                            onChange={handleChange}
                                            placeholder="Zip Code"
                                            disabled={!canUpdate}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="text"
                                            name="billingAddress.country"
                                            value={staff.billingAddress.country}
                                            onChange={handleChange}
                                            placeholder="Country"
                                            disabled={!canUpdate}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="text"
                                            name="billingAddress.gstNo"
                                            value={staff.billingAddress.gstNo}
                                            onChange={handleChange}
                                            placeholder="GST No."
                                            disabled={!canUpdate}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Educational Details */}
                        <div>
                            <h2 className="text-lg font-medium text-gray-700 mb-4">Educational Details</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="p-3 text-sm font-medium text-gray-600">Level</th>
                                            <th className="p-3 text-sm font-medium text-gray-600">Institute</th>
                                            <th className="p-3 text-sm font-medium text-gray-600">Degree</th>
                                            <th className="p-3 text-sm font-medium text-gray-600">Specialization</th>
                                            <th className="p-3 text-sm font-medium text-gray-600">Grade</th>
                                            <th className="p-3 text-sm font-medium text-gray-600">Passing Year</th>
                                            <th className="p-3 text-sm font-medium text-gray-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {staff.educationDetails.map((edu, index) => (
                                            <tr key={index} className="border-b hover:bg-gray-50">
                                                <td className="p-3">
                                                    <select
                                                        name={`educationDetails.${index}.level`}
                                                        value={edu.level}
                                                        onChange={handleChange}
                                                        disabled={!canUpdate}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="" disabled>Select Level</option>
                                                        <option value="School">School</option>
                                                        <option value="UG">UG</option>
                                                        <option value="PG">PG</option>
                                                    </select>
                                                </td>
                                                <td className="p-3">
                                                    <input
                                                        type="text"
                                                        name={`educationDetails.${index}.institute`}
                                                        value={edu.institute}
                                                        onChange={handleChange}
                                                        placeholder="Institute Name"
                                                        disabled={!canUpdate}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <input
                                                        type="text"
                                                        name={`educationDetails.${index}.degree`}
                                                        value={edu.degree}
                                                        onChange={handleChange}
                                                        placeholder="Degree"
                                                        disabled={!canUpdate}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <input
                                                        type="text"
                                                        name={`educationDetails.${index}.specialization`}
                                                        value={edu.specialization}
                                                        onChange={handleChange}
                                                        placeholder="Specialization"
                                                        disabled={!canUpdate}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <input
                                                        type="text"
                                                        name={`educationDetails.${index}.grade`}
                                                        value={edu.grade}
                                                        onChange={handleChange}
                                                        placeholder="Grade"
                                                        disabled={!canUpdate}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <input
                                                        type="number"
                                                        name={`educationDetails.${index}.passingyr`}
                                                        value={edu.passingyr}
                                                        onChange={handleChange}
                                                        placeholder="Year"
                                                        disabled={!canUpdate}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteEducation(index)}
                                                        disabled={!canUpdate}
                                                        className="text-red-500 hover:text-red-700 disabled:text-gray-400"
                                                    >
                                                        <FontAwesomeIcon icon={faXmark} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <button
                                    type="button"
                                    onClick={addEducation}
                                    disabled={!canUpdate}
                                    className={`mt-4 px-4 py-2 rounded-md text-white ${
                                        canUpdate ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                                    } transition duration-200`}
                                >
                                    Add Education
                                </button>
                            </div>
                        </div>

                        {/* Experience Details */}
                        <div>
                            <h2 className="text-lg font-medium text-gray-700 mb-4">Experience Details</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="p-3 text-sm font-medium text-gray-600">Company Name</th>
                                            <th className="p-3 text-sm font-medium text-gray-600">Designation</th>
                                            <th className="p-3 text-sm font-medium text-gray-600">Salary</th>
                                            <th className="p-3 text-sm font-medium text-gray-600">Years</th>
                                            <th className="p-3 text-sm font-medium text-gray-600">Description</th>
                                            <th className="p-3 text-sm font-medium text-gray-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {staff.experienceDetails.map((exp, index) => (
                                            <tr key={index} className="border-b hover:bg-gray-50">
                                                <td className="p-3">
                                                    <input
                                                        type="text"
                                                        name={`experienceDetails.${index}.companyName`}
                                                        value={exp.companyName}
                                                        onChange={handleChange}
                                                        placeholder="Company Name"
                                                        disabled={!canUpdate}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <input
                                                        type="text"
                                                        name={`experienceDetails.${index}.designation`}
                                                        value={exp.designation}
                                                        onChange={handleChange}
                                                        placeholder="Designation"
                                                        disabled={!canUpdate}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <input
                                                        type="text"
                                                        name={`experienceDetails.${index}.salary`}
                                                        value={exp.salary}
                                                        onChange={handleChange}
                                                        placeholder="Salary"
                                                        disabled={!canUpdate}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <input
                                                        type="number"
                                                        name={`experienceDetails.${index}.years`}
                                                        value={exp.years}
                                                        onChange={handleChange}
                                                        placeholder="Years"
                                                        disabled={!canUpdate}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <input
                                                        type="text"
                                                        name={`experienceDetails.${index}.description`}
                                                        value={exp.description}
                                                        onChange={handleChange}
                                                        placeholder="Description"
                                                        disabled={!canUpdate}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteExperience(index)}
                                                        disabled={!canUpdate}
                                                        className="text-red-500 hover:text-red-700 disabled:text-gray-400"
                                                    >
                                                        <FontAwesomeIcon icon={faXmark} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <button
                                    type="button"
                                    onClick={addExperience}
                                    disabled={!canUpdate}
                                    className={`mt-4 px-4 py-2 rounded-md text-white ${
                                        canUpdate ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                                    } transition duration-200`}
                                >
                                    Add Experience
                                </button>
                            </div>
                        </div>

                        {/* Goal, Status, and Preferred Learning Centers */}
                        <div>
                            <h2 className="text-lg font-medium text-gray-700 mb-4">Additional Details</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Goal</label>
                                    <select
                                        name="goal"
                                        value={staff.goal}
                                        onChange={handleChange}
                                        disabled={!canUpdate}
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="" disabled>Select Goal</option>
                                        <option value="Upskilling">Upskilling</option>
                                        <option value="Career Switch">Career Switch</option>
                                        <option value="Placement">Placement</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Status</label>
                                    <select
                                        name="status"
                                        value={staff.status}
                                        onChange={handleChange}
                                        disabled={!canUpdate}
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="" disabled>Select Status</option>
                                        <option value="enquiry">Enquiry</option>
                                        <option value="enrolled">Enrolled</option>
                                        <option value="completed">Completed</option>
                                        <option value="deferred">Deferred</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Preferred Learning Centers</label>
                                    <div className="flex items-center space-x-2">
                                        <select
                                            value={selectedCenter}
                                            onChange={(e) => {
                                                setSelectedCenter(e.target.value);
                                                logActivity("SELECT CENTER", { centerId: e.target.value });
                                            }}
                                            disabled={!canUpdate}
                                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="" disabled>Select a Center</option>
                                            {centers
                                                .filter(center => !staff.preferred_centers.includes(center.id))
                                                .map((center) => (
                                                    <option key={center.id} value={center.id}>
                                                        {center.name}
                                                    </option>
                                                ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={handleAddCenter}
                                            disabled={!selectedCenter || !canUpdate}
                                            className={`mt-1 px-3 py-2 rounded-md text-white ${
                                                selectedCenter && canUpdate ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                                            } transition duration-200`}
                                        >
                                            Add
                                        </button>
                                    </div>
                                    {staff.preferred_centers.length > 0 && (
                                        <div className="mt-2">
                                            <p className="text-sm font-medium text-gray-600">Selected Centers:</p>
                                            <ul className="mt-1 space-y-1">
                                                {staff.preferred_centers.map((centerId) => {
                                                    const center = centers.find(c => c.id === centerId);
                                                    return (
                                                        <li key={centerId} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                                                            <span>{center?.name || "Unknown Center"}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveCenter(centerId)}
                                                                disabled={!canUpdate}
                                                                className="text-red-500 hover:text-red-700 disabled:text-gray-400"
                                                            >
                                                                <FontAwesomeIcon icon={faXmark} />
                                                            </button>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Date of Joining</label>
                                    <input
                                        type="date"
                                        name="joining_date"
                                        value={staff.joining_date}
                                        onChange={handleChange}
                                        disabled={!canUpdate}
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-4">
                            <button
                                type="submit"
                                disabled={!canUpdate}
                                className={`px-6 py-2 rounded-md text-white ${
                                    canUpdate ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                                } transition duration-200`}
                            >
                                Update Staff
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={!canDelete}
                                className={`px-6 py-2 rounded-md text-white ${
                                    canDelete ? "bg-red-600 hover:bg-red-700" : "bg-gray-400 cursor-not-allowed"
                                } transition duration-200`}
                            >
                                Delete Staff
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}