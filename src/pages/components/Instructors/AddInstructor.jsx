import { useState, useEffect } from "react";
import { db } from '../../../config/firebase';
import { addDoc, updateDoc, doc, collection } from 'firebase/firestore';

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

const AddInstructor = ({ open, onClose, instructor, centers, roles, setInstructorList }) => {
    const [formData, setFormData] = useState({
        f_name: "",
        l_name: "",
        email: "",
        countryCode: "+91", // Default to India
        phone: "",
        specialization: "",
        center: "",
        role: ""
    });
    const [errors, setErrors] = useState({});

    const instructorCollectionRef = collection(db, "Instructor");

    useEffect(() => {
        if (instructor && instructor.id) {
            setFormData({
                f_name: instructor.f_name || "",
                l_name: instructor.l_name || "",
                email: instructor.email || "",
                countryCode: instructor.countryCode || "+91", // Extract country code if stored, default to +91
                phone: instructor.phone || "",
                specialization: instructor.specialization || "",
                center: instructor.center || "",
                role: instructor.role || ""
            });
        } else {
            resetForm();
        }
    }, [instructor]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.f_name.trim()) newErrors.f_name = "First name is required";
        if (!formData.l_name.trim()) newErrors.l_name = "Last name is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }
        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^\d{7,15}$/.test(formData.phone)) { // Adjusted for variable length based on country
            newErrors.phone = "Phone number must be 7-15 digits";
        }
        if (!formData.specialization.trim()) newErrors.specialization = "Specialization is required";
        if (!formData.center) newErrors.center = "Center is required";
        if (!formData.role) newErrors.role = "Role is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const instructorData = {
                f_name: formData.f_name,
                l_name: formData.l_name,
                email: formData.email,
                countryCode: formData.countryCode,
                phone: formData.phone,
                specialization: formData.specialization,
                center: formData.center,
                role: formData.role
            };

            if (formData.id) {
                await updateDoc(doc(db, "Instructor", formData.id), instructorData);
                setInstructorList(prev => prev.map(i => i.id === formData.id ? { ...instructorData, id: formData.id } : i));
                alert("Instructor updated successfully!");
            } else {
                const newDoc = await addDoc(instructorCollectionRef, instructorData);
                setInstructorList(prev => [...prev, { id: newDoc.id, ...instructorData }]);
                alert("Instructor created successfully!");
            }
            onClose();
        } catch (error) {
            console.error("Error saving instructor:", error);
            alert("Failed to save instructor. Please try again.");
        }
    };

    const resetForm = () => {
        setFormData({
            f_name: "",
            l_name: "",
            email: "",
            countryCode: "+91",
            phone: "",
            specialization: "",
            center: "",
            role: ""
        });
        setErrors({});
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    return (
        <>
            {/* Backdrop Overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={onClose}
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full bg-white w-full sm:w-2/5 md:w-1/3 shadow-lg transform transition-transform duration-300 ${
                    open ? "translate-x-0" : "translate-x-full"
                } z-50 overflow-y-auto`}
            >
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {formData.id ? "Edit Instructor" : "Add Instructor"}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 transition duration-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* First Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600">First Name</label>
                            <input
                                type="text"
                                value={formData.f_name}
                                onChange={(e) => handleChange("f_name", e.target.value)}
                                placeholder="Enter first name"
                                className={`mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.f_name ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {errors.f_name && <p className="mt-1 text-sm text-red-500">{errors.f_name}</p>}
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Last Name</label>
                            <input
                                type="text"
                                value={formData.l_name}
                                onChange={(e) => handleChange("l_name", e.target.value)}
                                placeholder="Enter last name"
                                className={`mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.l_name ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {errors.l_name && <p className="mt-1 text-sm text-red-500">{errors.l_name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                placeholder="Enter email"
                                className={`mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.email ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                        </div>

                        {/* Phone with Country Code */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Phone</label>
                            <div className="flex mt-1">
                                <select
                                    value={formData.countryCode}
                                    onChange={(e) => handleChange("countryCode", e.target.value)}
                                    className={`w-1/3 px-3 py-2 border border-r-0 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.phone ? "border-red-500" : "border-gray-300"
                                    }`}
                                >
                                    {countryCodes.map((country) => (
                                        <option key={country.code + country.label} value={country.code}>
                                            {country.label}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => handleChange("phone", e.target.value.replace(/\D/g, "").slice(0, 15))}
                                    placeholder="Enter phone number"
                                    className={`w-2/3 px-3 py-2 border rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.phone ? "border-red-500" : "border-gray-300"
                                    }`}
                                />
                            </div>
                            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                        </div>

                        {/* Specialization */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Specialization</label>
                            <input
                                type="text"
                                value={formData.specialization}
                                onChange={(e) => handleChange("specialization", e.target.value)}
                                placeholder="Enter specialization"
                                className={`mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.specialization ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {errors.specialization && <p className="mt-1 text-sm text-red-500">{errors.specialization}</p>}
                        </div>

                        {/* Center */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Center</label>
                            <select
                                value={formData.center}
                                onChange={(e) => handleChange("center", e.target.value)}
                                className={`mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.center ? "border-red-500" : "border-gray-300"
                                }`}
                            >
                                <option value="">Select a center</option>
                                {centers.map(center => (
                                    <option key={center.id} value={center.name}>{center.name}</option>
                                ))}
                            </select>
                            {errors.center && <p className="mt-1 text-sm text-red-500">{errors.center}</p>}
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Role</label>
                            <select
                                value={formData.role}
                                onChange={(e) => handleChange("role", e.target.value)}
                                className={`mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.role ? "border-red-500" : "border-gray-300"
                                }`}
                            >
                                <option value="">Select a role</option>
                                {roles.map(role => (
                                    <option key={role.id} value={role.name}>{role.name}</option>
                                ))}
                            </select>
                            {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role}</p>}
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end space-x-2 mt-6">
                            <button
                                type="button"
                                onClick={() => { resetForm(); onClose(); }}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                            >
                                {formData.id ? "Update Instructor" : "Add Instructor"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AddInstructor;