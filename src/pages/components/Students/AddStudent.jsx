import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, Timestamp, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import sendWelcomeEmail from "../../../services/sendWelcomeEmail.jsx";

export default function AddStudent() {
  const [isOpen, setIsOpen] = useState(true);
  const [Name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91"); 
  const [guardianCountryCode, setGuardianCountryCode] = useState("+91"); 
  const [address, setAddress] = useState({ street: "", area: "", city: "", state: "", zip: "", country: "" });
  const [billingAddress, setBillingAddress] = useState({ name: "", street: "", area: "", city: "", state: "", zip: "", country: "", gstNo: "" });
  const [copyAddress, setCopyAddress] = useState(false);
  const [status, setStatus] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [guardianDetails, setGuardianDetails] = useState({ name: "", phone: "", email: "", relation: "", occupation: "" });
  const [admissionDate, setAdmissionDate] = useState("");
  const [courseDetails, setCourseDetails] = useState([]);
  const [educationDetails, setEducationDetails] = useState([]);
  const [installmentDetails, setInstallmentDetails] = useState([]);
  const [experienceDetails, setExperienceDetails] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [centers, setCenters] = useState([]);
  const [preferredCenters, setPreferredCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState("");
  const [goal, setGoal] = useState("");
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState("");
  const [courseId, setCourseId] = useState("");
  const [feeTemplates, setFeeTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // List of country codes (same as provided)
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
    { code: "+298", label: "Far deviance (+298)" },
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

  // Utility function to capitalize the first letter
  const capitalizeFirstLetter = (str) => {
    if (!str || typeof str !== "string") return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setAdmissionDate(today);
    fetchCourses();
    fetchBatches();
    fetchCenters();
    // fetchFeeTemplates();
  }, []);

  const fetchCourses = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Course"));
      setCourses(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      //console.error("Error fetching courses:", error);
    }
  };

  const fetchBatches = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Batch"));
      setBatches(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      //console.error("Error fetching batches:", error);
    }
  };

  const fetchCenters = async () => {
    try {
      const instituteSnapshot = await getDocs(collection(db, "instituteSetup"));
      if (instituteSnapshot.empty) {
        //console.error("No instituteSetup document found");
        return;
      }
      const instituteId = "RDJ9wMXGrIUk221MzDxP";

      const centerQuery = query(
        collection(db, "instituteSetup", instituteId, "Center"),
        where("isActive", "==", true)
      );
      const centerSnapshot = await getDocs(centerQuery);
      const centersList = centerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCenters(centersList);
    } catch (error) {
      //console.error("Error fetching centers:", error);
    }
  };

  // const fetchFeeTemplates = async () => {
  //   try {
  //     const templateSnapshot = await getDocs(collection(db, "feeTemplates"));
  //     if (templateSnapshot.empty) {
  //       alert("No fee templates found.");
  //       return;
  //     }
  //     setFeeTemplates(templateSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  //   } catch (error) {
  //     //console.error("Error in fetching payment type:", error);
  //   }
  // };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!Name.trim() || !email.trim() || !phone.trim()) {
      alert("Please fill all required fields.");
      return;
    }

    let installmentTotal = 0;
    installmentDetails.forEach((installment) => {
      installmentTotal += Number(installment.dueAmount);
    });

    if (installmentTotal !== Number(total)) {
      alert("Installment total does not match with total amount");
      return;
    }

    const fullPhoneNumber = `${countryCode}${phone}`;
    const fullGuardianPhoneNumber = `${guardianCountryCode}${guardianDetails.phone || ""}`;

    setIsSubmitting(true);

    try {
      const studentDocRef = await addDoc(collection(db, 'student'), {
        Name: capitalizeFirstLetter(Name),
        email,
        phone: fullPhoneNumber,
        residential_address: address,
        billing_address: billingAddress,
        goal: goal || "Not specified",
        status: status,
        date_of_birth: dateOfBirth ? Timestamp.fromDate(new Date(dateOfBirth)) : null,
        guardian_details: {
          ...guardianDetails,
          phone: fullGuardianPhoneNumber
        },
        admission_date: Timestamp.fromDate(new Date(admissionDate)),
        course_details: courseDetails,
        course_id: courseId,
        education_details: educationDetails,
        experience_details: experienceDetails,
        discount: discount || 0,
        total: total || 0,
        installment_details: installmentDetails,
        preferred_centers: preferredCenters,
      });

      const studentId = studentDocRef.id;
      const enrollmentsRef = collection(db, 'enrollments');
      let paidAmt = 0;
      const today = new Date().toISOString().split("T")[0];

      let outstanding = 0;
      let overdue = 0;

      installmentDetails.forEach((installment) => {
        const amtPaid = Number(installment.paidAmount) || 0;
        const amtDue = Number(installment.dueAmount) || 0;

        paidAmt += amtPaid;

        const dueDate = new Date(installment.dueDate).toISOString().split("T")[0];
        if (dueDate > today && !installment.paidAmount) {
          outstanding += amtDue;
        } else if (dueDate <= today && !installment.paidAmount) {
          overdue += amtDue;
        }
      });

      const enrollmentData = {
        student_id: studentId,
        course_id: courseId,
        enrollment_date: Timestamp.fromDate(new Date(admissionDate)),
        fee: {
          discount: discount || 0,
          total: total || 0,
          overdue: overdue,
          paid: paidAmt,
          outstanding: outstanding,
        },
        installments: installmentDetails,
      };
      await addDoc(enrollmentsRef, enrollmentData);

      const installmentsRef = collection(db, 'installments');
      for (const installmentData of installmentDetails) {
        await addDoc(installmentsRef, {
          ...installmentData,
          student_id: studentId
        });
      }

      // Send welcome email after successful student creation
      // Send welcome email after successful student creation
      try {
       
        
        
        await sendWelcomeEmail({
          toEmail: email,
          fullName: `${capitalizeFirstLetter(Name)}`
        });
        alert("Student added successfully! Welcome email sent.");
      } catch (emailError) {
        //console.error("Welcome email failed to send:", {
        //   message: emailError.message,
        //   code: emailError.code,
        //   details: emailError.details || emailError,
        //   stack: emailError.stack,
        // }); // Enhanced error logging
        alert("Student added successfully, but welcome email failed to send.");
      }


      navigate("/studentdetails");
    } catch (error) {
      console.error("");
      alert("Error adding student. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyAddress = (isChecked) => {
    setCopyAddress(isChecked);
    if (isChecked) {
      setBillingAddress({ ...address, gstNo: billingAddress.gstNo });
    } else {
      setBillingAddress({ street: "", area: "", city: "", state: "", zip: "", country: "", gstNo: "" });
    }
  };

  const addEducation = () => {
    setEducationDetails([...educationDetails, { level: '', institute: '', degree: '', specialization: '', grade: '', passingyr: '' }]);
  };

  const handleEducationChange = (index, field, value) => {
    const newEducationDetails = [...educationDetails];
    newEducationDetails[index][field] = value;
    setEducationDetails(newEducationDetails);
  };

  const deleteEducation = (index) => {
    setEducationDetails(educationDetails.filter((_, i) => i !== index));
  };

  const addCourse = () => {
    setCourseDetails([...courseDetails, { courseName: '', batch: '', center: '', mode: '', fee: 0 }]);
  };

  const handleCourseChange = (index, field, value) => {
    const newCourseDetails = [...courseDetails];
    newCourseDetails[index][field] = value;

    if (field === 'courseName') {
      const selectedCourse = courses.find(course => course.name === value);
      newCourseDetails[index].fee = selectedCourse ? selectedCourse.fee : 0;
      setCourseId(selectedCourse ? selectedCourse.id : "");
    } else if (field === 'fee') {
      newCourseDetails[index].fee = Number(value);
    }
    setCourseDetails(newCourseDetails);
    handleFeeSummary();
  };

  const deleteCourse = (index) => {
    setCourseDetails(courseDetails.filter((_, i) => i !== index));
    handleFeeSummary();
  };

  const addExperience = () => {
    setExperienceDetails([...experienceDetails, { companyName: '', designation: '', salary: '', years: '', description: '' }]);
  };

  const handleExperienceChange = (index, field, value) => {
    const newExperienceDetails = [...experienceDetails];
    newExperienceDetails[index][field] = value;
    setExperienceDetails(newExperienceDetails);
  };

  const deleteExperience = (index) => {
    setExperienceDetails(experienceDetails.filter((_, i) => i !== index));
  };

  const handleGuardianChange = (field, value) => {
    setGuardianDetails(prev => ({ ...prev, [field]: value }));
  };

  const addInstallment = () => {
    const newInstallment = {
      number: installmentDetails.length + 1,
      dueAmount: "",
      dueDate: "",
      paidDate: "",
      paidAmount: "",
      modeOfPayment: "",
      pdcStatus: "",
      remark: ""
    };
    setInstallmentDetails([...installmentDetails, newInstallment]);
  };

  const deleteInstallment = (index) => {
    setInstallmentDetails(installmentDetails.filter((_, i) => i !== index));
  };

  const handleInstallmentChange = (index, field, value) => {
    const newInstallmentDetails = [...installmentDetails];
    newInstallmentDetails[index][field] = value;
    setInstallmentDetails(newInstallmentDetails);
  };

  const handleFeeSummary = () => {
    let totalFees = 0;
    courseDetails.forEach((course) => {
      if (course.fee && !isNaN(course.fee)) {
        totalFees += Number(course.fee);
      }
    });
    const discountAmount = (totalFees * (discount / 100)) || 0;
    const finalTotal = totalFees - discountAmount;
    setTotal(finalTotal);
  };

  const handleTemplateChange = async (e) => {
    const templateId = e.target.value;
    setSelectedTemplate(templateId);

    const templateSnapshot = await getDocs(collection(db, "feeTemplates"));
    const templateData = templateSnapshot.docs.find(doc => doc.id === templateId)?.data();
    if (templateData && templateData.installments) {
      setInstallmentDetails(templateData.installments);
    }
  };

  const handleAddCenter = () => {
    if (selectedCenter && !preferredCenters.includes(selectedCenter)) {
      setPreferredCenters([...preferredCenters, selectedCenter]);
      setSelectedCenter("");
    }
  };

  const handleRemoveCenter = (centerId) => {
    setPreferredCenters(preferredCenters.filter(id => id !== centerId));
  };

  const toggleSidebar = () => {
    setIsOpen(false);
    navigate("/studentdetails");
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full bg-white w-full sm:w-2/3 shadow-lg transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
          } p-6 overflow-y-auto z-50`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Add Student</h1>
          <button
            onClick={toggleSidebar}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200"
          >
            Back
          </button>
        </div>

        <form onSubmit={handleAddStudent} className="space-y-8">
          {/* Personal Details */}
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-4">Personal Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={Name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Phone <span className="text-red-500">*</span></label>
                <div className="flex mt-1">
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
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone Number"
                    required
                    className="w-2/3 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Date of Birth <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  // required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  value={guardianDetails.name}
                  onChange={(e) => handleGuardianChange('name', e.target.value)}
                  placeholder="Guardian Name"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Phone</label>
                <div className="flex mt-1">
                  <select
                    value={guardianCountryCode}
                    onChange={(e) => setGuardianCountryCode(e.target.value)}
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
                    value={guardianDetails.phone}
                    onChange={(e) => handleGuardianChange('phone', e.target.value)}
                    placeholder="Guardian Phone"
                    className="w-2/3 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <input
                  type="email"
                  value={guardianDetails.email}
                  onChange={(e) => handleGuardianChange('email', e.target.value)}
                  placeholder="Guardian Email"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Relation</label>
                <input
                  type="text"
                  value={guardianDetails.relation}
                  onChange={(e) => handleGuardianChange('relation', e.target.value)}
                  placeholder="Relation"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Occupation</label>
                <input
                  type="text"
                  value={guardianDetails.occupation}
                  onChange={(e) => handleGuardianChange('occupation', e.target.value)}
                  placeholder="Occupation"
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
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    placeholder="Street"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={address.area}
                    onChange={(e) => setAddress({ ...address, area: e.target.value })}
                    placeholder="Area"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    placeholder="City"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    placeholder="State"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={address.zip}
                    onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                    placeholder="Zip Code"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                    placeholder="Country"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <label className="flex items-center text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={copyAddress}
                      onChange={(e) => handleCopyAddress(e.target.checked)}
                      className="mr-2"
                    />
                    Billing same as Residential
                  </label>
                </div>
              </div>
              <div>
                <h3 className="text-md font-medium text-gray-600 mb-2">Billing Address</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={billingAddress.name}
                    onChange={(e) => setBillingAddress({ ...billingAddress, name: e.target.value })}
                    placeholder="Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={billingAddress.street}
                    onChange={(e) => setBillingAddress({ ...billingAddress, street: e.target.value })}
                    placeholder="Street"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={billingAddress.area}
                    onChange={(e) => setBillingAddress({ ...billingAddress, area: e.target.value })}
                    placeholder="Area"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={billingAddress.city}
                    onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                    placeholder="City"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={billingAddress.state}
                    onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
                    placeholder="State"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={billingAddress.zip}
                    onChange={(e) => setBillingAddress({ ...billingAddress, zip: e.target.value })}
                    placeholder="Zip Code"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={billingAddress.country}
                    onChange={(e) => setBillingAddress({ ...billingAddress, country: e.target.value })}
                    placeholder="Country"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={billingAddress.gstNo}
                    onChange={(e) => setBillingAddress({ ...billingAddress, gstNo: e.target.value })}
                    placeholder="GST No."
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
                  {educationDetails.map((edu, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <select
                          value={edu.level}
                          onChange={(e) => handleEducationChange(index, 'level', e.target.value)}
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
                          value={edu.institute}
                          onChange={(e) => handleEducationChange(index, 'institute', e.target.value)}
                          placeholder="Institute Name"
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                          placeholder="Degree"
                          required
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={edu.specialization}
                          onChange={(e) => handleEducationChange(index, 'specialization', e.target.value)}
                          placeholder="Specialization"
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={edu.grade}
                          onChange={(e) => handleEducationChange(index, 'grade', e.target.value)}
                          placeholder="Grade"
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={edu.passingyr}
                          onChange={(e) => handleEducationChange(index, 'passingyr', e.target.value)}
                          placeholder="Year"
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() => deleteEducation(index)}
                          className="text-red-500 hover:text-red-700"
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
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
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
                  {experienceDetails.map((exp, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <input
                          type="text"
                          value={exp.companyName}
                          onChange={(e) => handleExperienceChange(index, 'companyName', e.target.value)}
                          placeholder="Company Name"
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={exp.designation}
                          onChange={(e) => handleExperienceChange(index, 'designation', e.target.value)}
                          placeholder="Designation"
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={exp.salary}
                          onChange={(e) => handleExperienceChange(index, 'salary', e.target.value)}
                          placeholder="Salary"
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={exp.years}
                          onChange={(e) => handleExperienceChange(index, 'years', e.target.value)}
                          placeholder="Years"
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={exp.description}
                          onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                          placeholder="Description"
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() => deleteExperience(index)}
                          className="text-red-500 hover:text-red-700"
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
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
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
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
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
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
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
                    onChange={(e) => setSelectedCenter(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" disabled>Select a Center</option>
                    {centers
                      .filter(center => !preferredCenters.includes(center.id))
                      .map((center) => (
                        <option key={center.id} value={center.id}>
                          {center.name}
                        </option>
                      ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddCenter}
                    disabled={!selectedCenter}
                    className={`mt-1 px-3 py-2 rounded-md text-white ${selectedCenter ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                      } transition duration-200`}
                  >
                    Add
                  </button>
                </div>
                {preferredCenters.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-600">Selected Centers:</p>
                    <ul className="mt-1 space-y-1">
                      {preferredCenters.map((centerId) => {
                        const center = centers.find(c => c.id === centerId);
                        return (
                          <li key={centerId} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                            <span>{center?.name || "Unknown Center"}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveCenter(centerId)}
                              className="text-red-500 hover:text-red-700"
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
                <label className="block text-sm font-medium text-gray-600">Date of Enrollment</label>
                <input
                  type="date"
                  value={admissionDate}
                  onChange={(e) => setAdmissionDate(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
            </div>
          </div>

          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {isSubmitting ? 'Processing...' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}