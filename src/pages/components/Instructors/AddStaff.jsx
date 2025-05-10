


// // // // // // // import React, { useState, useEffect } from "react";
// // // // // // // import { useNavigate } from "react-router-dom";
// // // // // // // import { collection, addDoc, Timestamp } from "firebase/firestore";
// // // // // // // import { db } from "../../../config/firebase";
// // // // // // // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // // // // // // import { faXmark } from '@fortawesome/free-solid-svg-icons';
// // // // // // // import { PutObjectCommand } from "@aws-sdk/client-s3";
// // // // // // // import { s3Client } from "../../../config/aws-config";

// // // // // // // export default function AddStaff() {
// // // // // // //   const [isOpen, setIsOpen] = useState(true);
// // // // // // //   const [Name, setName] = useState("");
// // // // // // //   const [email, setEmail] = useState("");
// // // // // // //   const [phone, setPhone] = useState("");
// // // // // // //   const [countryCode, setCountryCode] = useState("+91");
// // // // // // //   const [guardianCountryCode, setGuardianCountryCode] = useState("+91");
// // // // // // //   const [address, setAddress] = useState({ street: "", area: "", city: "", state: "", zip: "", country: "" });
// // // // // // //   const [dateOfBirth, setDateOfBirth] = useState("");
// // // // // // //   const [guardianDetails, setGuardianDetails] = useState({ name: "", phone: "", email: "", relation: "", occupation: "" });
// // // // // // //   const [joiningDate, setJoiningDate] = useState("");
// // // // // // //   const [educationDetails, setEducationDetails] = useState([]);
// // // // // // //   const [experienceDetails, setExperienceDetails] = useState([]);
// // // // // // //   const [emergencyContact, setEmergencyContact] = useState({ name: "", phone: "", countryCode: "+91" });
// // // // // // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // // // // // //   const navigate = useNavigate();

// // // // // // //   // File states for document uploads
// // // // // // //   const [documents, setDocuments] = useState({
// // // // // // //     aadharCard: null,
// // // // // // //     panCard: null,
// // // // // // //     addressProof: null,
// // // // // // //     tenthMarksheet: null,
// // // // // // //     twelfthMarksheet: null,
// // // // // // //     graduationMarksheet: null,
// // // // // // //     pgMarksheet: null,
// // // // // // //     offerLetter1: null,
// // // // // // //     offerLetter2: null,
// // // // // // //     experienceLetter1: null,
// // // // // // //     experienceLetter2: null,
// // // // // // //     salaryProof: null,
// // // // // // //     parentSpouseAadhar: null,
// // // // // // //     passportPhoto: null,
// // // // // // //   });
// // // // // // //   const [uploadProgress, setUploadProgress] = useState({});

// // // // // // //   // AWS S3 Configuration
// // // // // // //   AWS.config.update({
// // // // // // //     accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
// // // // // // //     secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
// // // // // // //     region: import.meta.env.VITE_AWS_REGION,
// // // // // // //   });
// // // // // // //   const s3 = new AWS.S3();

// // // // // // //   // Country codes (same as provided)
// // // // // // //   const countryCodes = [
// // // // // // //     { code: "+1", label: "USA (+1)" },
// // // // // // //     { code: "+1", label: "Canada (+1)" },
// // // // // // //     { code: "+7", label: "Russia (+7)" },
// // // // // // //     { code: "+20", label: "Egypt (+20)" },
// // // // // // //     { code: "+27", label: "South Africa (+27)" },
// // // // // // //     { code: "+30", label: "Greece (+30)" },
// // // // // // //     { code: "+31", label: "Netherlands (+31)" },
// // // // // // //     { code: "+32", label: "Belgium (+32)" },
// // // // // // //     { code: "+33", label: "France (+33)" },
// // // // // // //     { code: "+34", label: "Spain (+34)" },
// // // // // // //     { code: "+39", label: "Italy (+39)" },
// // // // // // //     { code: "+41", label: "Switzerland (+41)" },
// // // // // // //     { code: "+44", label: "UK (+44)" },
// // // // // // //     { code: "+45", label: "Denmark (+45)" },
// // // // // // //     { code: "+46", label: "Sweden (+46)" },
// // // // // // //     { code: "+47", label: "Norway (+47)" },
// // // // // // //     { code: "+48", label: "Poland (+48)" },
// // // // // // //     { code: "+49", label: "Germany (+49)" },
// // // // // // //     { code: "+51", label: "Peru (+51)" },
// // // // // // //     { code: "+52", label: "Mexico (+52)" },
// // // // // // //     { code: "+53", label: "Cuba (+53)" },
// // // // // // //     { code: "+54", label: "Argentina (+54)" },
// // // // // // //     { code: "+55", label: "Brazil (+55)" },
// // // // // // //     { code: "+56", label: "Chile (+56)" },
// // // // // // //     { code: "+57", label: "Colombia (+57)" },
// // // // // // //     { code: "+58", label: "Venezuela (+58)" },
// // // // // // //     { code: "+60", label: "Malaysia (+60)" },
// // // // // // //     { code: "+61", label: "Australia (+61)" },
// // // // // // //     { code: "+62", label: "Indonesia (+62)" },
// // // // // // //     { code: "+63", label: "Philippines (+63)" },
// // // // // // //     { code: "+64", label: "New Zealand (+64)" },
// // // // // // //     { code: "+65", label: "Singapore (+65)" },
// // // // // // //     { code: "+66", label: "Thailand (+66)" },
// // // // // // //     { code: "+81", label: "Japan (+81)" },
// // // // // // //     { code: "+82", label: "South Korea (+82)" },
// // // // // // //     { code: "+84", label: "Vietnam (+84)" },
// // // // // // //     { code: "+86", label: "China (+86)" },
// // // // // // //     { code: "+90", label: "Turkey (+90)" },
// // // // // // //     { code: "+91", label: "India (+91)" },
// // // // // // //     { code: "+92", label: "Pakistan (+92)" },
// // // // // // //     { code: "+93", label: "Afghanistan (+93)" },
// // // // // // //     { code: "+94", label: "Sri Lanka (+94)" },
// // // // // // //     { code: "+95", label: "Myanmar (+95)" },
// // // // // // //     { code: "+98", label: "Iran (+98)" },
// // // // // // //     { code: "+211", label: "South Sudan (+211)" },
// // // // // // //     { code: "+212", label: "Morocco (+212)" },
// // // // // // //     { code: "+213", label: "Algeria (+213)" },
// // // // // // //     { code: "+216", label: "Tunisia (+216)" },
// // // // // // //     { code: "+218", label: "Libya (+218)" },
// // // // // // //     { code: "+220", label: "Gambia (+220)" },
// // // // // // //     { code: "+221", label: "Senegal (+221)" },
// // // // // // //     { code: "+233", label: "Ghana (+233)" },
// // // // // // //     { code: "+234", label: "Nigeria (+234)" },
// // // // // // //     { code: "+236", label: "Central African Republic (+236)" },
// // // // // // //     { code: "+237", label: "Cameroon (+237)" },
// // // // // // //     { code: "+241", label: "Gabon (+241)" },
// // // // // // //     { code: "+242", label: "Congo (+242)" },
// // // // // // //     { code: "+243", label: "DR Congo (+243)" },
// // // // // // //     { code: "+244", label: "Angola (+244)" },
// // // // // // //     { code: "+248", label: "Seychelles (+248)" },
// // // // // // //     { code: "+249", label: "Sudan (+249)" },
// // // // // // //     { code: "+250", label: "Rwanda (+250)" },
// // // // // // //     { code: "+251", label: "Ethiopia (+251)" },
// // // // // // //     { code: "+252", label: "Somalia (+252)" },
// // // // // // //     { code: "+253", label: "Djibouti (+253)" },
// // // // // // //     { code: "+254", label: "Kenya (+254)" },
// // // // // // //     { code: "+255", label: "Tanzania (+255)" },
// // // // // // //     { code: "+256", label: "Uganda (+256)" },
// // // // // // //     { code: "+260", label: "Zambia (+260)" },
// // // // // // //     { code: "+261", label: "Madagascar (+261)" },
// // // // // // //     { code: "+262", label: "Réunion (+262)" },
// // // // // // //     { code: "+263", label: "Zimbabwe (+263)" },
// // // // // // //     { code: "+264", label: "Namibia (+264)" },
// // // // // // //     { code: "+265", label: "Malawi (+265)" },
// // // // // // //     { code: "+266", label: "Lesotho (+266)" },
// // // // // // //     { code: "+267", label: "Botswana (+267)" },
// // // // // // //     { code: "+268", label: "Eswatini (+268)" },
// // // // // // //     { code: "+269", label: "Comoros (+269)" },
// // // // // // //     { code: "+291", label: "Eritrea (+291)" },
// // // // // // //     { code: "+297", label: "Aruba (+297)" },
// // // // // // //     { code: "+298", label: "Faroe Islands (+298)" },
// // // // // // //     { code: "+299", label: "Greenland (+299)" },
// // // // // // //     { code: "+351", label: "Portugal (+351)" },
// // // // // // //     { code: "+352", label: "Luxembourg (+352)" },
// // // // // // //     { code: "+353", label: "Ireland (+353)" },
// // // // // // //     { code: "+354", label: "Iceland (+354)" },
// // // // // // //     { code: "+355", label: "Albania (+355)" },
// // // // // // //     { code: "+356", label: "Malta (+356)" },
// // // // // // //     { code: "+357", label: "Cyprus (+357)" },
// // // // // // //     { code: "+358", label: "Finland (+358)" },
// // // // // // //     { code: "+359", label: "Bulgaria (+359)" },
// // // // // // //     { code: "+370", label: "Lithuania (+370)" },
// // // // // // //     { code: "+371", label: "Latvia (+371)" },
// // // // // // //     { code: "+372", label: "Estonia (+372)" },
// // // // // // //     { code: "+373", label: "Moldova (+373)" },
// // // // // // //     { code: "+374", label: "Armenia (+374)" },
// // // // // // //     { code: "+375", label: "Belarus (+375)" },
// // // // // // //     { code: "+376", label: "Andorra (+376)" },
// // // // // // //     { code: "+377", label: "Monaco (+377)" },
// // // // // // //     { code: "+378", label: "San Marino (+378)" },
// // // // // // //     { code: "+380", label: "Ukraine (+380)" },
// // // // // // //     { code: "+381", label: "Serbia (+381)" },
// // // // // // //     { code: "+382", label: "Montenegro (+382)" },
// // // // // // //     { code: "+383", label: "Kosovo (+383)" },
// // // // // // //     { code: "+385", label: "Croatia (+385)" },
// // // // // // //     { code: "+386", label: "Slovenia (+386)" },
// // // // // // //     { code: "+387", label: "Bosnia and Herzegovina (+387)" },
// // // // // // //     { code: "+389", label: "North Macedonia (+389)" },
// // // // // // //     { code: "+420", label: "Czech Republic (+420)" },
// // // // // // //     { code: "+421", label: "Slovakia (+421)" },
// // // // // // //     { code: "+423", label: "Liechtenstein (+423)" },
// // // // // // //     { code: "+501", label: "Belize (+501)" },
// // // // // // //     { code: "+502", label: "Guatemala (+502)" },
// // // // // // //     { code: "+503", label: "El Salvador (+503)" },
// // // // // // //     { code: "+504", label: "Honduras (+504)" },
// // // // // // //     { code: "+505", label: "Nicaragua (+505)" },
// // // // // // //     { code: "+506", label: "Costa Rica (+506)" },
// // // // // // //     { code: "+507", label: "Panama (+507)" },
// // // // // // //     { code: "+508", label: "Saint Pierre and Miquelon (+508)" },
// // // // // // //     { code: "+509", label: "Haiti (+509)" },
// // // // // // //     { code: "+590", label: "Guadeloupe (+590)" },
// // // // // // //     { code: "+591", label: "Bolivia (+591)" },
// // // // // // //     { code: "+592", label: "Guyana (+592)" },
// // // // // // //     { code: "+593", label: "Ecuador (+593)" },
// // // // // // //     { code: "+594", label: "French Guiana (+594)" },
// // // // // // //     { code: "+595", label: "Paraguay (+595)" },
// // // // // // //     { code: "+596", label: "Martinique (+596)" },
// // // // // // //     { code: "+597", label: "Suriname (+597)" },
// // // // // // //     { code: "+598", label: "Uruguay (+598)" },
// // // // // // //     { code: "+599", label: "Curaçao (+599)" },
// // // // // // //     { code: "+670", label: "East Timor (+670)" },
// // // // // // //     { code: "+672", label: "Norfolk Island (+672)" },
// // // // // // //     { code: "+673", label: "Brunei (+673)" },
// // // // // // //     { code: "+674", label: "Nauru (+674)" },
// // // // // // //     { code: "+675", label: "Papua New Guinea (+675)" },
// // // // // // //     { code: "+676", label: "Tonga (+676)" },
// // // // // // //     { code: "+677", label: "Solomon Islands (+677)" },
// // // // // // //     { code: "+678", label: "Vanuatu (+678)" },
// // // // // // //     { code: "+679", label: "Fiji (+679)" },
// // // // // // //     { code: "+680", label: "Palau (+680)" },
// // // // // // //     { code: "+681", label: "Wallis and Futuna (+681)" },
// // // // // // //     { code: "+682", label: "Cook Islands (+682)" },
// // // // // // //     { code: "+683", label: "Niue (+683)" },
// // // // // // //     { code: "+685", label: "Samoa (+685)" },
// // // // // // //     { code: "+686", label: "Kiribati (+686)" },
// // // // // // //     { code: "+687", label: "New Caledonia (+687)" },
// // // // // // //     { code: "+688", label: "Tuvalu (+688)" },
// // // // // // //     { code: "+689", label: "French Polynesia (+689)" },
// // // // // // //     { code: "+690", label: "Tokelau (+690)" },
// // // // // // //     { code: "+691", label: "Micronesia (+691)" },
// // // // // // //     { code: "+692", label: "Marshall Islands (+692)" },
// // // // // // //     { code: "+850", label: "North Korea (+850)" },
// // // // // // //     { code: "+852", label: "Hong Kong (+852)" },
// // // // // // //     { code: "+853", label: "Macau (+853)" },
// // // // // // //     { code: "+855", label: "Cambodia (+855)" },
// // // // // // //     { code: "+856", label: "Laos (+856)" },
// // // // // // //     { code: "+880", label: "Bangladesh (+880)" },
// // // // // // //     { code: "+886", label: "Taiwan (+886)" },
// // // // // // //     { code: "+960", label: "Maldives (+960)" },
// // // // // // //     { code: "+961", label: "Lebanon (+961)" },
// // // // // // //     { code: "+962", label: "Jordan (+962)" },
// // // // // // //     { code: "+963", label: "Syria (+963)" },
// // // // // // //     { code: "+964", label: "Iraq (+964)" },
// // // // // // //     { code: "+965", label: "Kuwait (+965)" },
// // // // // // //     { code: "+966", label: "Saudi Arabia (+966)" },
// // // // // // //     { code: "+967", label: "Yemen (+967)" },
// // // // // // //     { code: "+968", label: "Oman (+968)" },
// // // // // // //     { code: "+970", label: "Palestine (+970)" },
// // // // // // //     { code: "+971", label: "United Arab Emirates (+971)" },
// // // // // // //     { code: "+972", label: "Israel (+972)" },
// // // // // // //     { code: "+973", label: "Bahrain (+973)" },
// // // // // // //     { code: "+974", label: "Qatar (+974)" },
// // // // // // //     { code: "+975", label: "Bhutan (+975)" },
// // // // // // //     { code: "+976", label: "Mongolia (+976)" },
// // // // // // //     { code: "+977", label: "Nepal (+977)" },
// // // // // // //     { code: "+992", label: "Tajikistan (+992)" },
// // // // // // //     { code: "+993", label: "Turkmenistan (+993)" },
// // // // // // //     { code: "+994", label: "Azerbaijan (+994)" },
// // // // // // //     { code: "+995", label: "Georgia (+995)" },
// // // // // // //     { code: "+996", label: "Kyrgyzstan (+996)" },
// // // // // // //     { code: "+998", label: "Uzbekistan (+998)" },
// // // // // // //   ];

// // // // // // //   const capitalizeFirstLetter = (str) => {
// // // // // // //     if (!str || typeof str !== "string") return str;
// // // // // // //     return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
// // // // // // //   };

// // // // // // //   useEffect(() => {
// // // // // // //     const today = new Date().toISOString().split("T")[0];
// // // // // // //     setJoiningDate(today);
// // // // // // //   }, []);

// // // // // // //   // Handle file input change
// // // // // // // const handleFileChange = (e, docType) => {
// // // // // // //   const file = e.target.files[0];
// // // // // // //   if (file) {
// // // // // // //     setDocuments((prev) => ({ ...prev, [docType]: file }));
// // // // // // //     setUploadProgress((prev) => ({ ...prev, [docType]: 0 }));
// // // // // // //   }
// // // // // // // };

// // // // // // //   // const handleFileChange = (e, docType) => {
// // // // // // //   //   const file = e.target.files[0];
// // // // // // //   //   if (file) {
// // // // // // //   //     setDocuments((prev) => ({ ...prev, [docType]: file }));
// // // // // // //   //     setUploadProgress((prev) => ({ ...prev, [docType]: 0 }));
// // // // // // //   //   }
// // // // // // //   // };

// // // // // // //   const uploadFileToS3 = async (file, docType, staffId) => {
// // // // // // //     const fileName = `${staffId}/${docType}_${Date.now()}_${file.name}`;
// // // // // // //     const params = {
// // // // // // //       Bucket: process.env.REACT_APP_AWS_S3_BUCKET_NAME,
// // // // // // //       Key: fileName,
// // // // // // //       Body: file,
// // // // // // //       ContentType: file.type,
// // // // // // //       ACL: "public-read",
// // // // // // //     };

// // // // // // //     return new Promise((resolve, reject) => {
// // // // // // //       s3Client
// // // // // // //         .send(new PutObjectCommand(params))
// // // // // // //         .then((data) => {
// // // // // // //           const url = `https://${params.Bucket}.s3.${process.env.REACT_APP_AWS_REGION}.amazonaws.com/${fileName}`;
// // // // // // //           resolve(url);
// // // // // // //         })
// // // // // // //         .catch((err) => {
// // // // // // //           console.error(`Error uploading ${docType}:`, err);
// // // // // // //           reject(err);
// // // // // // //         });
// // // // // // //     });
// // // // // // //   };
// // // // // // //   // const uploadFileToS3 = async (file, docType, staffId) => {
// // // // // // //   //   const fileName = `${staffId}/${docType}_${Date.now()}_${file.name}`;
// // // // // // //   //   const params = {
// // // // // // //   //     Bucket: process.env.REACT_APP_AWS_S3_BUCKET_NAME,
// // // // // // //   //     Key: fileName,
// // // // // // //   //     Body: file,
// // // // // // //   //     ContentType: file.type,
// // // // // // //   //     ACL: 'public-read',
// // // // // // //   //   };

// // // // // // //   //   return new Promise((resolve, reject) => {
// // // // // // //   //     s3.upload(params)
// // // // // // //   //       .on('httpUploadProgress', (progress) => {
// // // // // // //   //         const percent = Math.round((progress.loaded / progress.total) * 100);
// // // // // // //   //         setUploadProgress((prev) => ({ ...prev, [docType]: percent }));
// // // // // // //   //       })
// // // // // // //   //       .send((err, data) => {
// // // // // // //   //         if (err) {
// // // // // // //   //           console.error(`Error uploading ${docType}:`, err);
// // // // // // //   //           reject(err);
// // // // // // //   //         } else {
// // // // // // //   //           resolve(data.Location);
// // // // // // //   //         }
// // // // // // //   //       });
// // // // // // //   //   });
// // // // // // //   // };

// // // // // // //   // const handleAddStaff = async (e) => {
// // // // // // //   //   e.preventDefault();
// // // // // // //   //   if (!Name.trim() || !email.trim() || !phone.trim()) {
// // // // // // //   //     alert("Please fill all required fields.");
// // // // // // //   //     return;
// // // // // // //   //   }

// // // // // // //   //   const fullPhoneNumber = `${countryCode}${phone}`;
// // // // // // //   //   const fullGuardianPhoneNumber = `${guardianCountryCode}${guardianDetails.phone || ""}`;
// // // // // // //   //   const fullEmergencyPhoneNumber = `${emergencyContact.countryCode}${emergencyContact.phone || ""}`;

// // // // // // //   //   setIsSubmitting(true);

// // // // // // //   //   try {
// // // // // // //   //     // Add staff to Firestore first to get staffId
// // // // // // //   //     const staffDocRef = await addDoc(collection(db, 'Instructor'), {
// // // // // // //   //       Name: capitalizeFirstLetter(Name),
// // // // // // //   //       email,
// // // // // // //   //       phone: fullPhoneNumber,
// // // // // // //   //       residential_address: address,
// // // // // // //   //       date_of_birth: dateOfBirth ? Timestamp.fromDate(new Date(dateOfBirth)) : null,
// // // // // // //   //       guardian_details: {
// // // // // // //   //         ...guardianDetails,
// // // // // // //   //         phone: fullGuardianPhoneNumber,
// // // // // // //   //       },
// // // // // // //   //       emergency_contact: {
// // // // // // //   //         name: emergencyContact.name,
// // // // // // //   //         phone: fullEmergencyPhoneNumber,
// // // // // // //   //       },
// // // // // // //   //       joining_date: Timestamp.fromDate(new Date(joiningDate)),
// // // // // // //   //       education_details: educationDetails,
// // // // // // //   //       experience_details: experienceDetails,
// // // // // // //   //       documents: {}, // Placeholder for document URLs
// // // // // // //   //     });

// // // // // // //   //     const staffId = staffDocRef.id;

// // // // // // //   //     // Upload files to S3 and collect URLs
// // // // // // //   //     const documentUrls = {};
// // // // // // //   //     for (const [docType, file] of Object.entries(documents)) {
// // // // // // //   //       if (file) {
// // // // // // //   //         const url = await uploadFileToS3(file, docType, staffId);
// // // // // // //   //         documentUrls[docType] = url;
// // // // // // //   //       }
// // // // // // //   //     }

// // // // // // //   //     // Update Firestore document with S3 URLs
// // // // // // //   //     await addDoc(collection(db, 'Instructor'), {
// // // // // // //   //       ...staffDocRef.data(),
// // // // // // //   //       documents: documentUrls,
// // // // // // //   //     });

// // // // // // //   //     alert("Staff added successfully!");
// // // // // // //   //     navigate("/instructor");
// // // // // // //   //   } catch (error) {
// // // // // // //   //     console.error("Error adding staff:", error);
// // // // // // //   //     alert("Error adding staff. Please try again.");
// // // // // // //   //   } finally {
// // // // // // //   //     setIsSubmitting(false);
// // // // // // //   //   }
// // // // // // //   // };


// // // // // // //   // Integrate uploads in form submission
// // // // // // // const handleAddStaff = async (e) => {
// // // // // // //   e.preventDefault();
// // // // // // //   if (!Name.trim() || !email.trim() || !phone.trim()) {
// // // // // // //     alert("Please fill all required fields.");
// // // // // // //     return;
// // // // // // //   }

// // // // // // //   setIsSubmitting(true);

// // // // // // //   try {
// // // // // // //     // Add staff to Firestore to get staffId
// // // // // // //     const staffDocRef = await addDoc(collection(db, "Instructor"), {
// // // // // // //       Name: capitalizeFirstLetter(Name),
// // // // // // //       email,
// // // // // // //       phone: `${countryCode}${phone}`,
// // // // // // //       residential_address: address,
// // // // // // //       date_of_birth: dateOfBirth ? Timestamp.fromDate(new Date(dateOfBirth)) : null,
// // // // // // //       guardian_details: {
// // // // // // //         ...guardianDetails,
// // // // // // //         phone: `${guardianCountryCode}${guardianDetails.phone || ""}`,
// // // // // // //       },
// // // // // // //       emergency_contact: {
// // // // // // //         name: emergencyContact.name,
// // // // // // //         phone: `${emergencyContact.countryCode}${emergencyContact.phone || ""}`,
// // // // // // //       },
// // // // // // //       joining_date: Timestamp.fromDate(new Date(joiningDate)),
// // // // // // //       education_details: educationDetails,
// // // // // // //       experience_details: experienceDetails,
// // // // // // //       documents: {},
// // // // // // //     });

// // // // // // //     const staffId = staffDocRef.id;

// // // // // // //     // Upload files to S3 and collect URLs
// // // // // // //     const documentUrls = {};
// // // // // // //     for (const [docType, file] of Object.entries(documents)) {
// // // // // // //       if (file) {
// // // // // // //         const url = await uploadFileToS3(file, docType, staffId);
// // // // // // //         documentUrls[docType] = url;
// // // // // // //       }
// // // // // // //     }

// // // // // // //     // Update Firestore with document URLs
// // // // // // //     await updateDoc(doc(db, "Instructor", staffId), {
// // // // // // //       documents: documentUrls,
// // // // // // //     });

// // // // // // //     alert("Staff added successfully!");
// // // // // // //     navigate("/instructor");
// // // // // // //   } catch (error) {
// // // // // // //     console.error("Error adding staff:", error);
// // // // // // //     alert("Error adding staff. Please try again.");
// // // // // // //   } finally {
// // // // // // //     setIsSubmitting(false);
// // // // // // //   }
// // // // // // // };
// // // // // // //   const addEducation = () => {
// // // // // // //     setEducationDetails([...educationDetails, { level: '', institute: '', degree: '', specialization: '', grade: '', passingyr: '' }]);
// // // // // // //   };

// // // // // // //   const handleEducationChange = (index, field, value) => {
// // // // // // //     const newEducationDetails = [...educationDetails];
// // // // // // //     newEducationDetails[index][field] = value;
// // // // // // //     setEducationDetails(newEducationDetails);
// // // // // // //   };

// // // // // // //   const deleteEducation = (index) => {
// // // // // // //     setEducationDetails(educationDetails.filter((_, i) => i !== index));
// // // // // // //   };

// // // // // // //   const addExperience = () => {
// // // // // // //     setExperienceDetails([...experienceDetails, { companyName: '', designation: '', salary: '', years: '', description: '' }]);
// // // // // // //   };

// // // // // // //   const handleExperienceChange = (index, field, value) => {
// // // // // // //     const newExperienceDetails = [...experienceDetails];
// // // // // // //     newExperienceDetails[index][field] = value;
// // // // // // //     setExperienceDetails(newExperienceDetails);
// // // // // // //   };

// // // // // // //   const deleteExperience = (index) => {
// // // // // // //     setExperienceDetails(experienceDetails.filter((_, i) => i !== index));
// // // // // // //   };

// // // // // // //   const handleGuardianChange = (field, value) => {
// // // // // // //     setGuardianDetails((prev) => ({ ...prev, [field]: value }));
// // // // // // //   };

// // // // // // //   const handleEmergencyContactChange = (field, value) => {
// // // // // // //     setEmergencyContact((prev) => ({ ...prev, [field]: value }));
// // // // // // //   };

// // // // // // //   const toggleSidebar = () => {
// // // // // // //     setIsOpen(false);
// // // // // // //     navigate("/instructor");
// // // // // // //   };

// // // // // // //   return (
// // // // // // //     <>
// // // // // // //       {isOpen && (
// // // // // // //         <div
// // // // // // //           className="fixed inset-0 bg-black bg-opacity-50 z-40"
// // // // // // //           onClick={toggleSidebar}
// // // // // // //         />
// // // // // // //       )}

// // // // // // //       <div
// // // // // // //         className={`fixed top-0 right-0 h-full bg-white w-full sm:w-2/3 shadow-lg transform transition-transform duration-300 ${
// // // // // // //           isOpen ? "translate-x-0" : "translate-x-full"
// // // // // // //         } p-6 overflow-y-auto z-50`}
// // // // // // //       >
// // // // // // //         <div className="flex justify-between items-center mb-6">
// // // // // // //           <h1 className="text-2xl font-semibold text-gray-800">Add Staff</h1>
// // // // // // //           <button
// // // // // // //             onClick={() => navigate('/instructor')}
// // // // // // //             className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200"
// // // // // // //           >
// // // // // // //             Back
// // // // // // //           </button>
// // // // // // //         </div>

// // // // // // //         <form onSubmit={handleAddStaff} className="space-y-8">
// // // // // // //           {/* Personal Details */}
// // // // // // //           <div>
// // // // // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Personal Details</h2>
// // // // // // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // // // // // //               <div>
// // // // // // //                 <label className="block text-sm font-medium text-gray-600">Name</label>
// // // // // // //                 <input
// // // // // // //                   type="text"
// // // // // // //                   value={Name}
// // // // // // //                   onChange={(e) => setName(e.target.value)}
// // // // // // //                   placeholder="Name"
// // // // // // //                   required
// // // // // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // // //                 />
// // // // // // //               </div>
// // // // // // //               <div>
// // // // // // //                 <label className="block text-sm font-medium text-gray-600">Email</label>
// // // // // // //                 <input
// // // // // // //                   type="email"
// // // // // // //                   value={email}
// // // // // // //                   onChange={(e) => setEmail(e.target.value)}
// // // // // // //                   placeholder="Email"
// // // // // // //                   required
// // // // // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // // //                 />
// // // // // // //               </div>
// // // // // // //               <div>
// // // // // // //                 <label className="block text-sm font-medium text-gray-600">Phone</label>
// // // // // // //                 <div className="flex mt-1">
// // // // // // //                   <select
// // // // // // //                     value={countryCode}
// // // // // // //                     onChange={(e) => setCountryCode(e.target.value)}
// // // // // // //                     className="w-1/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // // //                   >
// // // // // // //                     {countryCodes.map((country) => (
// // // // // // //                       <option key={country.code} value={country.code}>
// // // // // // //                         {country.label}
// // // // // // //                       </option>
// // // // // // //                     ))}
// // // // // // //                   </select>
// // // // // // //                   <input
// // // // // // //                     type="text"
// // // // // // //                     value={phone}
// // // // // // //                     onChange={(e) => setPhone(e.target.value)}
// // // // // // //                     placeholder="Phone Number"
// // // // // // //                     required
// // // // // // //                     className="w-2/3 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // // //                   />
// // // // // // //                 </div>
// // // // // // //               </div>
// // // // // // //               <div>
// // // // // // //                 <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
// // // // // // //                 <input
// // // // // // //                   type="date"
// // // // // // //                   value={dateOfBirth}
// // // // // // //                   onChange={(e) => setDateOfBirth(e.target.value)}
// // // // // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // // //                 />
// // // // // // //               </div>
// // // // // // //             </div>
// // // // // // //           </div>

// // // // // // //           {/* Guardian Details */}
// // // // // // //           <div>
// // // // // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Guardian Details</h2>
// // // // // // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // // // // // //               <div>
// // // // // // //                 <label className="block text-sm font-medium text-gray-600">Name</label>
// // // // // // //                 <input
// // // // // // //                   type="text"
// // // // // // //                   value={guardianDetails.name}
// // // // // // //                   onChange={(e) => handleGuardianChange('name', e.target.value)}
// // // // // // //                   placeholder="Guardian Name"
// // // // // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // // //                 />
// // // // // // //               </div>
// // // // // // //               <div>
// // // // // // //                 <label className="block text-sm font-medium text-gray-600">Phone</label>
// // // // // // //                 <div className="flex mt-1">
// // // // // // //                   <select
// // // // // // //                     value={guardianCountryCode}
// // // // // // //                     onChange={(e) => setGuardianCountryCode(e.target.value)}
// // // // // // //                     className="w-1/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // // //                   >
// // // // // // //                     {countryCodes.map((country) => (
// // // // // // //                       <option key={country.code} value={country.code}>
// // // // // // //                         {country.label}
// // // // // // //                       </option>
// // // // // // //                     ))}
// // // // // // //                   </select>
// // // // // // //                   <input
// // // // // // //                     type="text"
// // // // // // //                     value={guardianDetails.phone}
// // // // // // //                     onChange={(e) => handleGuardianChange('phone', e.target.value)}
// // // // // // //                     placeholder="Guardian Phone"
// // // // // // //                     className="w-2/3 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // // //                   />
// // // // // // //                 </div>
// // // // // // //               </div>
// // // // // // //               <div>
// // // // // // //                 <label className="block text-sm font-medium text-gray-600">Email</label>
// // // // // // //                 <input
// // // // // // //                   type="email"
// // // // // // //                   value={guardianDetails.email}
// // // // // // //                   onChange={(e) => handleGuardianChange('email', e.target.value)}
// // // // // // //                   placeholder="Guardian Email"
// // // // // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // // //                 />
// // // // // // //               </div>
// // // // // // //               <div>
// // // // // // //                 <label className="block text-sm font-medium text-gray-600">Relation</label>
// // // // // // //                 <input
// // // // // // //                   type="text"
// // // // // // //                   value={guardianDetails.relation}
// // // // // // //                   onChange={(e) => handleGuardianChange('relation', e.target.value)}
// // // // // // //                   placeholder="Relation"
// // // // // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // // //                 />
// // // // // // //               </div>
// // // // // // //               <div>
// // // // // // //                 <label className="block text-sm font-medium text-gray-600">Occupation</label>
// // // // // // //                 <input
// // // // // // //                   type="text"
// // // // // // //                   value={guardianDetails.occupation}
// // // // // // //                   onChange={(e) => handleGuardianChange('occupation', e.target.value)}
// // // // // // //                   placeholder="Occupation"
// // // // // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // // //                 />
// // // // // // //               </div>
// // // // // // //             </div>
// // // // // // //           </div>

// // // // // // //           {/* Emergency Contact */}
// // // // // // //           <div>
// // // // // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Emergency Contact</h2>
// // // // // // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // // // // // //               <div>
// // // // // // //                 <label className="block text-sm font-medium text-gray-600">Name</label>
// // // // // // //                 <input
// // // // // // //                   type="text"
// // // // // // //                   value={emergencyContact.name}
// // // // // // //                   onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
// // // // // // //                   placeholder="Emergency Contact Name"
// // // // // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // // //                 />
// // // // // // //               </div>
// // // // // // //               <div>
// // // // // // //                 <label className="block text-sm font-medium text-gray-600">Phone</label>
// // // // // // //                 <div className="flex mt-1">
// // // // // // //                   <select
// // // // // // //                     value={emergencyContact.countryCode}
// // // // // // //                     onChange={(e) => handleEmergencyContactChange('countryCode', e.target.value)}
// // // // // // //                     className="w-1/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // // //                   >
// // // // // // //                     {countryCodes.map((country) => (
// // // // // // //                       <option key={country.code} value={country.code}>
// // // // // // //                         {country.label}
// // // // // // //                       </option>
// // // // // // //                     ))}
// // // // // // //                   </select>
// // // // // // //                   <input
// // // // // // //                     type="text"
// // // // // // //                     value={emergencyContact.phone}
// // // // // // //                     onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
// // // // // // //                     placeholder="Emergency Contact Phone"
// // // // // // //                     className="w-2/3 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // // //                   />
// // // // // // //                 </div>
// // // // // // //               </div>
// // // // // // //             </div>
// // // // // // //           </div>

// // // // // // //           {/* Address Details */}
// // // // // // //           <div>
// // // // // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Address Details</h2>
// // // // // // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
// // // // // // //               <div>
// // // // // // //                 <h3 className="text-md font-medium text-gray-600 mb-2">Residential Address</h3>
// // // // // // //                 <div className="space-y-3">
// // // // // // //                   <input
// // // // // // //                     type="text"
// // // // // // //                     value={address.street}
// // // // // // //                     onChange={(e) => setAddress({ ...address, street: e.target.value })}
// // // // // // //                     placeholder="Street"
// // // // // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // // //                   />
// // // // // // //                   <input
// // // // // // //                     type="text"
// // // // // // //                     value={address.area}
// // // // // // //                     onChange={(e) => setAddress({ ...address, area: e.target.value })}
// // // // // // //                     placeholder="Area"
// // // // // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // // //                   />
// // // // // // //                   <input
// // // // // // //                     type="text"
// // // // // // //                     value={address.city}
// // // // // // //                     onChange={(e) => setAddress({ ...address, city: e.target.value })}
// // // // // // //                     placeholder="City"
// // // // // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // // //                   />
// // // // // // //                   <input
// // // // // // //                     type="text"
// // // // // // //                     value={address.state}
// // // // // // //                     onChange={(e) => setAddress({ ...address, state: e.target.value })}
// // // // // // //                     placeholder="State"
// // // // // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // // //                   />
// // // // // // //                   <input
// // // // // // //                     type="text"
// // // // // // //                     value={address.zip}
// // // // // // //                     onChange={(e) => setAddress({ ...address, zip: e.target.value })}
// // // // // // //                     placeholder="Zip Code"
// // // // // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // // //                   />
// // // // // // //                   <input
// // // // // // //                     type="text"
// // // // // // //                     value={address.country}
// // // // // // //                     onChange={(e) => setAddress({ ...address, country: e.target.value })}
// // // // // // //                     placeholder="Country"
// // // // // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // // //                   />
// // // // // // //                 </div>
// // // // // // //               </div>
// // // // // // //             </div>
// // // // // // //           </div>

// // // // // // //           {/* Document Uploads */}
// // // // // // //           <div>
// // // // // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Document Uploads</h2>
// // // // // // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // // // // // //               {[
// // // // // // //                 { key: 'aadharCard', label: 'Aadhar Card' },
// // // // // // //                 { key: 'panCard', label: 'PAN Card' },
// // // // // // //                 { key: 'addressProof', label: 'Address Proof' },
// // // // // // //                 { key: 'tenthMarksheet', label: '10th Marksheet' },
// // // // // // //                 { key: 'twelfthMarksheet', label: '12th Marksheet' },
// // // // // // //                 { key: 'graduationMarksheet', label: 'Graduation Marksheet' },
// // // // // // //                 { key: 'pgMarksheet', label: 'PG Marksheet' },
// // // // // // //                 { key: 'offerLetter1', label: 'Last Offer Letter 1' },
// // // // // // //                 { key: 'offerLetter2', label: 'Last Offer Letter 2' },
// // // // // // //                 { key: 'experienceLetter1', label: 'Last Experience Letter 1' },
// // // // // // //                 { key: 'experienceLetter2', label: 'Last Experience Letter 2' },
// // // // // // //                 { key: 'salaryProof', label: 'Salary Proof' },
// // // // // // //                 { key: 'parentSpouseAadhar', label: "Parent/Spouse Aadhar Card" },
// // // // // // //                 { key: 'passportPhoto', label: 'Passport Size Photo' },
// // // // // // //               ].map((doc) => (
// // // // // // //                 <div key={doc.key}>
// // // // // // //                   <label className="block text-sm font-medium text-gray-600">{doc.label}</label>
// // // // // // //                   <input
// // // // // // //                     type="file"
// // // // // // //                     onChange={(e) => handleFileChange(e, doc.key)}
// // // // // // //                     accept=".pdf,.jpg,.jpeg,.png"
// // // // // // //                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // // //                   />
// // // // // // //                   {uploadProgress[doc.key] > 0 && (
// // // // // // //                     <div className="mt-2">
// // // // // // //                       <div className="w-full bg-gray-200 rounded-full h-2.5">
// // // // // // //                         <div
// // // // // // //                           className="bg-blue-600 h-2.5 rounded-full"
// // // // // // //                           style={{ width: `${uploadProgress[doc.key]}%` }}
// // // // // // //                         ></div>
// // // // // // //                       </div>
// // // // // // //                       <span className="text-sm text-gray-600">{uploadProgress[doc.key]}%</span>
// // // // // // //                     </div>
// // // // // // //                   )}
// // // // // // //                 </div>
// // // // // // //               ))}
// // // // // // //             </div>
// // // // // // //           </div>

// // // // // // //           {/* Educational Details */}
// // // // // // //           <div>
// // // // // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Educational Details</h2>
// // // // // // //             <div className="overflow-x-auto">
// // // // // // //               <table className="w-full border-collapse">
// // // // // // //                 <thead>
// // // // // // //                   <tr className="bg-gray-100">
// // // // // // //                     <th className="p-3 text-sm font-medium text-gray-600">Level</th>
// // // // // // //                     <th className="p-3 text-sm font-medium text-gray-600">Institute</th>
// // // // // // //                     <th className="p-3 text-sm font-medium text-gray-600">Degree</th>
// // // // // // //                     <th className="p-3 text-sm font-medium text-gray-600">Specialization</th>
// // // // // // //                     <th className="p-3 text-sm font-medium text-gray-600">Grade</th>
// // // // // // //                     <th className="p-3 text-sm font-medium text-gray-600">Passing Year</th>
// // // // // // //                     <th className="p-3 text-sm font-medium text-gray-600">Actions</th>
// // // // // // //                   </tr>
// // // // // // //                 </thead>
// // // // // // //                 <tbody>
// // // // // // //                   {educationDetails.map((edu, index) => (
// // // // // // //                     <tr key={index} className="border-b hover:bg-gray-50">
// // // // // // //                       <td className="p-3">
// // // // // // //                         <select
// // // // // // //                           value={edu.level}
// // // // // // //                           onChange={(e) => handleEducationChange(index, 'level', e.target.value)}
// // // // // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // // //                         >
// // // // // // //                           <option value="" disabled>Select Level</option>
// // // // // // //                           <option value="School">School</option>
// // // // // // //                           <option value="UG">UG</option>
// // // // // // //                           <option value="PG">PG</option>
// // // // // // //                         </select>
// // // // // // //                       </td>
// // // // // // //                       <td className="p-3">
// // // // // // //                         <input
// // // // // // //                           type="text"
// // // // // // //                           value={edu.institute}
// // // // // // //                           onChange={(e) => handleEducationChange(index, 'institute', e.target.value)}
// // // // // // //                           placeholder="Institute Name"
// // // // // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // // //                         />
// // // // // // //                       </td>
// // // // // // //                       <td className="p-3">
// // // // // // //                         <input
// // // // // // //                           type="text"
// // // // // // //                           value={edu.degree}
// // // // // // //                           onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
// // // // // // //                           placeholder="Degree"
// // // // // // //                           required
// // // // // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // // //                         />
// // // // // // //                       </td>
// // // // // // //                       <td className="p-3">
// // // // // // //                         <input
// // // // // // //                           type="text"
// // // // // // //                           value={edu.specialization}
// // // // // // //                           onChange={(e) => handleEducationChange(index, 'specialization', e.target.value)}
// // // // // // //                           placeholder="Specialization"
// // // // // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // // //                         />
// // // // // // //                       </td>
// // // // // // //                       <td className="p-3">
// // // // // // //                         <input
// // // // // // //                           type="number"
// // // // // // //                           value={edu.grade}
// // // // // // //                           onChange={(e) => handleEducationChange(index, 'grade', e.target.value)}
// // // // // // //                           placeholder="Grade"
// // // // // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // // //                         />
// // // // // // //                       </td>
// // // // // // //                       <td className="p-3">
// // // // // // //                         <input
// // // // // // //                           type="number"
// // // // // // //                           value={edu.passingyr}
// // // // // // //                           onChange={(e) => handleEducationChange(index, 'passingyr', e.target.value)}
// // // // // // //                           placeholder="Year"
// // // // // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // // //                         />
// // // // // // //                       </td>
// // // // // // //                       <td className="p-3">
// // // // // // //                         <button
// // // // // // //                           type="button"
// // // // // // //                           onClick={() => deleteEducation(index)}
// // // // // // //                           className="text-red-500 hover:text-red-700"
// // // // // // //                         >
// // // // // // //                           <FontAwesomeIcon icon={faXmark} />
// // // // // // //                         </button>
// // // // // // //                       </td>
// // // // // // //                     </tr>
// // // // // // //                   ))}
// // // // // // //                 </tbody>
// // // // // // //               </table>
// // // // // // //               <button
// // // // // // //                 type="button"
// // // // // // //                 onClick={addEducation}
// // // // // // //                 className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
// // // // // // //               >
// // // // // // //                 Add Education
// // // // // // //               </button>
// // // // // // //             </div>
// // // // // // //           </div>

// // // // // // //           {/* Experience Details */}
// // // // // // //           <div>
// // // // // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Experience Details</h2>
// // // // // // //             <div className="overflow-x-auto">
// // // // // // //               <table className="w-full border-collapse">
// // // // // // //                 <thead>
// // // // // // //                   <tr className="bg-gray-100">
// // // // // // //                     <th className="p-3 text-sm font-medium text-gray-600">Company Name</th>
// // // // // // //                     <th className="p-3 text-sm font-medium text-gray-600">Designation</th>
// // // // // // //                     <th className="p-3 text-sm font-medium text-gray-600">Salary</th>
// // // // // // //                     <th className="p-3 text-sm font-medium text-gray-600">Years</th>
// // // // // // //                     <th className="p-3 text-sm font-medium text-gray-600">Description</th>
// // // // // // //                     <th className="p-3 text-sm font-medium text-gray-600">Actions</th>
// // // // // // //                   </tr>
// // // // // // //                 </thead>
// // // // // // //                 <tbody>
// // // // // // //                   {experienceDetails.map((exp, index) => (
// // // // // // //                     <tr key={index} className="border-b hover:bg-gray-50">
// // // // // // //                       <td className="p-3">
// // // // // // //                         <input
// // // // // // //                           type="text"
// // // // // // //                           value={exp.companyName}
// // // // // // //                           onChange={(e) => handleExperienceChange(index, 'companyName', e.target.value)}
// // // // // // //                           placeholder="Company Name"
// // // // // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // // //                         />
// // // // // // //                       </td>
// // // // // // //                       <td className="p-3">
// // // // // // //                         <input
// // // // // // //                           type="text"
// // // // // // //                           value={exp.designation}
// // // // // // //                           onChange={(e) => handleExperienceChange(index, 'designation', e.target.value)}
// // // // // // //                           placeholder="Designation"
// // // // // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // // //                         />
// // // // // // //                       </td>
// // // // // // //                       <td className="p-3">
// // // // // // //                         <input
// // // // // // //                           type="number"
// // // // // // //                           value={exp.salary}
// // // // // // //                           onChange={(e) => handleExperienceChange(index, 'salary', e.target.value)}
// // // // // // //                           placeholder="Salary"
// // // // // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // // //                         />
// // // // // // //                       </td>
// // // // // // //                       <td className="p-3">
// // // // // // //                         <input
// // // // // // //                           type="number"
// // // // // // //                           value={exp.years}
// // // // // // //                           onChange={(e) => handleExperienceChange(index, 'years', e.target.value)}
// // // // // // //                           placeholder="Years"
// // // // // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // // //                         />
// // // // // // //                       </td>
// // // // // // //                       <td className="p-3">
// // // // // // //                         <input
// // // // // // //                           type="text"
// // // // // // //                           value={exp.description}
// // // // // // //                           onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
// // // // // // //                           placeholder="Description"
// // // // // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // // //                         />
// // // // // // //                       </td>
// // // // // // //                       <td className="p-3">
// // // // // // //                         <button
// // // // // // //                           type="button"
// // // // // // //                           onClick={() => deleteExperience(index)}
// // // // // // //                           className="text-red-500 hover:text-red-700"
// // // // // // //                         >
// // // // // // //                           <FontAwesomeIcon icon={faXmark} />
// // // // // // //                         </button>
// // // // // // //                       </td>
// // // // // // //                     </tr>
// // // // // // //                   ))}
// // // // // // //                 </tbody>
// // // // // // //               </table>
// // // // // // //               <button
// // // // // // //                 type="button"
// // // // // // //                 onClick={addExperience}
// // // // // // //                 className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
// // // // // // //               >
// // // // // // //                 Add Experience
// // // // // // //               </button>
// // // // // // //             </div>
// // // // // // //           </div>

// // // // // // //           {/* Additional Details */}
// // // // // // //           <div>
// // // // // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Additional Details</h2>
// // // // // // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // // // // // //               <div>
// // // // // // //                 <label className="block text-sm font-medium text-gray-600">Date of Joining</label>
// // // // // // //                 <input
// // // // // // //                   type="date"
// // // // // // //                   value={joiningDate}
// // // // // // //                   onChange={(e) => setJoiningDate(e.target.value)}
// // // // // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
// // // // // // //                 />
// // // // // // //               </div>
// // // // // // //             </div>
// // // // // // //           </div>

// // // // // // //           <div className="flex justify-end">
// // // // // // //             <button
// // // // // // //               type="submit"
// // // // // // //               disabled={isSubmitting}
// // // // // // //               className={`bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200 ${
// // // // // // //                 isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
// // // // // // //               }`}
// // // // // // //             >
// // // // // // //               {isSubmitting ? 'Processing...' : 'Add Staff'}
// // // // // // //             </button>
// // // // // // //           </div>
// // // // // // //         </form>
// // // // // // //       </div>
// // // // // // //     </>
// // // // // // //   );
// // // // // // // }


// // // // // // import React, { useState, useEffect } from "react";
// // // // // // import { useNavigate } from "react-router-dom";
// // // // // // import { collection, addDoc, doc, updateDoc, Timestamp } from "firebase/firestore";
// // // // // // import { db } from "../../../config/firebase";
// // // // // // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // // // // // import { faXmark } from '@fortawesome/free-solid-svg-icons';
// // // // // // import { PutObjectCommand } from "@aws-sdk/client-s3";
// // // // // // import { s3Client } from "../../../config/aws-config";

// // // // // // export default function AddStaff() {
// // // // // //   const [isOpen, setIsOpen] = useState(true);
// // // // // //   const [Name, setName] = useState("");
// // // // // //   const [email, setEmail] = useState("");
// // // // // //   const [phone, setPhone] = useState("");
// // // // // //   const [countryCode, setCountryCode] = useState("+91");
// // // // // //   const [guardianCountryCode, setGuardianCountryCode] = useState("+91");
// // // // // //   const [address, setAddress] = useState({ street: "", area: "", city: "", state: "", zip: "", country: "" });
// // // // // //   const [dateOfBirth, setDateOfBirth] = useState("");
// // // // // //   const [guardianDetails, setGuardianDetails] = useState({ name: "", phone: "", email: "", relation: "", occupation: "" });
// // // // // //   const [joiningDate, setJoiningDate] = useState("");
// // // // // //   const [educationDetails, setEducationDetails] = useState([]);
// // // // // //   const [experienceDetails, setExperienceDetails] = useState([]);
// // // // // //   const [emergencyContact, setEmergencyContact] = useState({ name: "", phone: "", countryCode: "+91" });
// // // // // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // // // // //   const navigate = useNavigate();

// // // // // //   // File states for document uploads
// // // // // //   const [documents, setDocuments] = useState({
// // // // // //     aadharCard: null,
// // // // // //     panCard: null,
// // // // // //     addressProof: null,
// // // // // //     tenthMarksheet: null,
// // // // // //     twelfthMarksheet: null,
// // // // // //     graduationMarksheet: null,
// // // // // //     pgMarksheet: null,
// // // // // //     offerLetter1: null,
// // // // // //     offerLetter2: null,
// // // // // //     experienceLetter1: null,
// // // // // //     experienceLetter2: null,
// // // // // //     salaryProof: null,
// // // // // //     parentSpouseAadhar: null,
// // // // // //     passportPhoto: null,
// // // // // //   });
// // // // // //   const [uploadProgress, setUploadProgress] = useState({});

// // // // // //   // Country codes
// // // // // //   const countryCodes = [
// // // // // //   // const countryCodes = [
// // // // // //     { code: "+1", label: "USA (+1)" },
// // // // // //     { code: "+7", label: "Russia (+7)" },
// // // // // //     { code: "+91", label: "India (+91)" },
// // // // // //   ];

// // // // // //   const capitalizeFirstLetter = (str) => {
// // // // // //     if (!str || typeof str !== "string") return str;
// // // // // //     return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
// // // // // //   };

// // // // // //   useEffect(() => {
// // // // // //     const today = new Date().toISOString().split("T")[0];
// // // // // //     setJoiningDate(today);
// // // // // //   }, []);

// // // // // //   // Handle file input change
// // // // // //   const handleFileChange = (e, docType) => {
// // // // // //     const file = e.target.files[0];
// // // // // //     if (file) {
// // // // // //       setDocuments((prev) => ({ ...prev, [docType]: file }));
// // // // // //       setUploadProgress((prev) => ({ ...prev, [docType]: 0 }));
// // // // // //     }
// // // // // //   };

// // // // // //   // Upload file to S3 with progress tracking
// // // // // //   const uploadFileToS3 = async (file, docType, staffId) => {
// // // // // //     const bucketName = import.meta.env.VITE_AWS_S3_BUCKET_NAME;
// // // // // //     if (!bucketName) {
// // // // // //       throw new Error("S3 Bucket name is not defined. Please check your environment variables.");
// // // // // //     }

// // // // // //     const fileName = `${staffId}/${docType}_${Date.now()}_${file.name}`;
// // // // // //     const params = {
// // // // // //       Bucket: bucketName,
// // // // // //       Key: fileName,
// // // // // //       Body: file,
// // // // // //       ContentType: file.type,
// // // // // //     };

// // // // // //     try {
// // // // // //       // Simulate progress
// // // // // //       const fileSize = file.size;
// // // // // //       let uploadedBytes = 0;

// // // // // //       const updateProgress = (bytes) => {
// // // // // //         uploadedBytes += bytes;
// // // // // //         const percent = Math.min(Math.round((uploadedBytes / fileSize) * 100), 100);
// // // // // //         setUploadProgress((prev) => ({ ...prev, [docType]: percent }));
// // // // // //       };

// // // // // //       const interval = setInterval(() => {
// // // // // //         updateProgress(fileSize / 10);
// // // // // //         if (uploadedBytes >= fileSize) clearInterval(interval);
// // // // // //       }, 500);

// // // // // //       await s3Client.send(new PutObjectCommand(params));
// // // // // //       clearInterval(interval);
// // // // // //       setUploadProgress((prev) => ({ ...prev, [docType]: 100 }));

// // // // // //       const url = `https://${params.Bucket}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${fileName}`;
// // // // // //       return url;
// // // // // //     } catch (err) {
// // // // // //       console.error(`Error uploading ${docType}:`, err);
// // // // // //       throw err;
// // // // // //     }
// // // // // //   };
// // // // // //   // const uploadFileToS3 = async (file, docType, staffId) => {
// // // // // //   //   const fileName = `${staffId}/${docType}_${Date.now()}_${file.name}`;
// // // // // //   //   const params = {
// // // // // //   //     Bucket: import.meta.env.VITE_AWS_S3_BUCKET_NAME,
// // // // // //   //     Key: fileName,
// // // // // //   //     Body: file,
// // // // // //   //     ContentType: file.type,
// // // // // //   //     ACL: "public-read"
// // // // // //   //     // Removed ACL: "public-read" for better security; use pre-signed URLs or private bucket if needed
// // // // // //   //   };

// // // // // //   //   try {
// // // // // //   //     // Simulate progress (AWS SDK v3 doesn't natively support progress events)
// // // // // //   //     const fileSize = file.size;
// // // // // //   //     let uploadedBytes = 0;

// // // // // //   //     const updateProgress = (bytes) => {
// // // // // //   //       uploadedBytes += bytes;
// // // // // //   //       const percent = Math.min(Math.round((uploadedBytes / fileSize) * 100), 100);
// // // // // //   //       setUploadProgress((prev) => ({ ...prev, [docType]: percent }));
// // // // // //   //     };

// // // // // //   //     // Simulate progress updates (replace with actual stream-based tracking if needed)
// // // // // //   //     const interval = setInterval(() => {
// // // // // //   //       updateProgress(fileSize / 10); // Simulate 10% increments
// // // // // //   //       if (uploadedBytes >= fileSize) clearInterval(interval);
// // // // // //   //     }, 500);

// // // // // //   //     await s3Client.send(new PutObjectCommand(params));
// // // // // //   //     clearInterval(interval);
// // // // // //   //     setUploadProgress((prev) => ({ ...prev, [docType]: 100 }));

// // // // // //   //     const url = `https://${params.Bucket}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${fileName}`;
// // // // // //   //     return url;
// // // // // //   //   } catch (err) {
// // // // // //   //     console.error(`Error uploading ${docType}:`, err);
// // // // // //   //     throw err;
// // // // // //   //   }
// // // // // //   // };

// // // // // //   // Handle form submission
// // // // // //   const handleAddStaff = async (e) => {
// // // // // //     e.preventDefault();
// // // // // //     if (!Name.trim() || !email.trim() || !phone.trim()) {
// // // // // //       alert("Please fill all required fields.");
// // // // // //       return;
// // // // // //     }

// // // // // //     setIsSubmitting(true);

// // // // // //     try {
// // // // // //       // Add staff to Firestore
// // // // // //       const staffDocRef = await addDoc(collection(db, "Instructor"), {
// // // // // //         Name: capitalizeFirstLetter(Name),
// // // // // //         email,
// // // // // //         phone: `${countryCode}${phone}`,
// // // // // //         residential_address: address,
// // // // // //         date_of_birth: dateOfBirth ? Timestamp.fromDate(new Date(dateOfBirth)) : null,
// // // // // //         guardian_details: {
// // // // // //           ...guardianDetails,
// // // // // //           phone: `${guardianCountryCode}${guardianDetails.phone || ""}`,
// // // // // //         },
// // // // // //         emergency_contact: {
// // // // // //           name: emergencyContact.name,
// // // // // //           phone: `${emergencyContact.countryCode}${emergencyContact.phone || ""}`,
// // // // // //         },
// // // // // //         joining_date: Timestamp.fromDate(new Date(joiningDate)),
// // // // // //         education_details: educationDetails,
// // // // // //         experience_details: experienceDetails,
// // // // // //         documents: {},
// // // // // //       });

// // // // // //       const staffId = staffDocRef.id;

// // // // // //       // Upload files to S3
// // // // // //       const documentUrls = {};
// // // // // //       for (const [docType, file] of Object.entries(documents)) {
// // // // // //         if (file) {
// // // // // //           try {
// // // // // //             const url = await uploadFileToS3(file, docType, staffId);
// // // // // //             documentUrls[docType] = url;
// // // // // //           } catch (uploadErr) {
// // // // // //             console.error(`Failed to upload ${docType}:`, uploadErr);
// // // // // //             throw new Error(`Failed to upload ${docType}: ${uploadErr.message}`);
// // // // // //           }
// // // // // //         }
// // // // // //       }

// // // // // //       // Update Firestore with document URLs
// // // // // //       await updateDoc(doc(db, "Instructor", staffId), {
// // // // // //         documents: documentUrls,
// // // // // //       });

// // // // // //       alert("Staff added successfully!");
// // // // // //       navigate("/instructor");
// // // // // //     } catch (error) {
// // // // // //       console.error("Error adding staff:", error);
// // // // // //       alert(`Error adding staff: ${error.message}`);
// // // // // //     } finally {
// // // // // //       setIsSubmitting(false);
// // // // // //     }
// // // // // //   };
// // // // // //   // const handleAddStaff = async (e) => {
// // // // // //   //   e.preventDefault();
// // // // // //   //   if (!Name.trim() || !email.trim() || !phone.trim()) {
// // // // // //   //     alert("Please fill all required fields.");
// // // // // //   //     return;
// // // // // //   //   }

// // // // // //   //   setIsSubmitting(true);

// // // // // //   //   try {
// // // // // //   //     // Add staff to Firestore to get staffId
// // // // // //   //     const staffDocRef = await addDoc(collection(db, "Instructor"), {
// // // // // //   //       Name: capitalizeFirstLetter(Name),
// // // // // //   //       email,
// // // // // //   //       phone: `${countryCode}${phone}`,
// // // // // //   //       residential_address: address,
// // // // // //   //       date_of_birth: dateOfBirth ? Timestamp.fromDate(new Date(dateOfBirth)) : null,
// // // // // //   //       guardian_details: {
// // // // // //   //         ...guardianDetails,
// // // // // //   //         phone: `${guardianCountryCode}${guardianDetails.phone || ""}`,
// // // // // //   //       },
// // // // // //   //       emergency_contact: {
// // // // // //   //         name: emergencyContact.name,
// // // // // //   //         phone: `${emergencyContact.countryCode}${emergencyContact.phone || ""}`,
// // // // // //   //       },
// // // // // //   //       joining_date: Timestamp.fromDate(new Date(joiningDate)),
// // // // // //   //       education_details: educationDetails,
// // // // // //   //       experience_details: experienceDetails,
// // // // // //   //       documents: {},
// // // // // //   //     });

// // // // // //   //     const staffId = staffDocRef.id;

// // // // // //   //     // Upload files to S3 and collect URLs
// // // // // //   //     const documentUrls = {};
// // // // // //   //     for (const [docType, file] of Object.entries(documents)) {
// // // // // //   //       if (file) {
// // // // // //   //         const url = await uploadFileToS3(file, docType, staffId);
// // // // // //   //         documentUrls[docType] = url;
// // // // // //   //       }
// // // // // //   //     }

// // // // // //   //     // Update Firestore with document URLs
// // // // // //   //     await updateDoc(doc(db, "Instructor", staffId), {
// // // // // //   //       documents: documentUrls,
// // // // // //   //     });

// // // // // //   //     alert("Staff added successfully!");
// // // // // //   //     navigate("/instructor");
// // // // // //   //   } catch (error) {
// // // // // //   //     console.error("Error adding staff:", error);
// // // // // //   //     alert("Error adding staff. Please try again.");
// // // // // //   //   } finally {
// // // // // //   //     setIsSubmitting(false);
// // // // // //   //   }
// // // // // //   // };

// // // // // //   const addEducation = () => {
// // // // // //     setEducationDetails([...educationDetails, { level: '', institute: '', degree: '', specialization: '', grade: '', passingyr: '' }]);
// // // // // //   };

// // // // // //   const handleEducationChange = (index, field, value) => {
// // // // // //     const newEducationDetails = [...educationDetails];
// // // // // //     newEducationDetails[index][field] = value;
// // // // // //     setEducationDetails(newEducationDetails);
// // // // // //   };

// // // // // //   const deleteEducation = (index) => {
// // // // // //     setEducationDetails(educationDetails.filter((_, i) => i !== index));
// // // // // //   };

// // // // // //   const addExperience = () => {
// // // // // //     setExperienceDetails([...experienceDetails, { companyName: '', designation: '', salary: '', years: '', description: '' }]);
// // // // // //   };

// // // // // //   const handleExperienceChange = (index, field, value) => {
// // // // // //     const newExperienceDetails = [...experienceDetails];
// // // // // //     newExperienceDetails[index][field] = value;
// // // // // //     setExperienceDetails(newExperienceDetails);
// // // // // //   };

// // // // // //   const deleteExperience = (index) => {
// // // // // //     setExperienceDetails(experienceDetails.filter((_, i) => i !== index));
// // // // // //   };

// // // // // //   const handleGuardianChange = (field, value) => {
// // // // // //     setGuardianDetails((prev) => ({ ...prev, [field]: value }));
// // // // // //   };

// // // // // //   const handleEmergencyContactChange = (field, value) => {
// // // // // //     setEmergencyContact((prev) => ({ ...prev, [field]: value }));
// // // // // //   };

// // // // // //   const toggleSidebar = () => {
// // // // // //     setIsOpen(false);
// // // // // //     navigate("/instructor");
// // // // // //   };

// // // // // //   return (
// // // // // //     <>
// // // // // //       {isOpen && (
// // // // // //         <div
// // // // // //           className="fixed inset-0 bg-black bg-opacity-50 z-40"
// // // // // //           onClick={toggleSidebar}
// // // // // //         />
// // // // // //       )}

// // // // // //       <div
// // // // // //         className={`fixed top-0 right-0 h-full bg-white w-full sm:w-2/3 shadow-lg transform transition-transform duration-300 ${
// // // // // //           isOpen ? "translate-x-0" : "translate-x-full"
// // // // // //         } p-6 overflow-y-auto z-50`}
// // // // // //       >
// // // // // //         <div className="flex justify-between items-center mb-6">
// // // // // //           <h1 className="text-2xl font-semibold text-gray-800">Add Staff</h1>
// // // // // //           <button
// // // // // //             onClick={() => navigate('/instructor')}
// // // // // //             className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200"
// // // // // //           >
// // // // // //             Back
// // // // // //           </button>
// // // // // //         </div>

// // // // // //         <form onSubmit={handleAddStaff} className="space-y-8">
// // // // // //           {/* Personal Details */}
// // // // // //           <div>
// // // // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Personal Details</h2>
// // // // // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // // // // //               <div>
// // // // // //                 <label className="block text-sm font-medium text-gray-600">Name</label>
// // // // // //                 <input
// // // // // //                   type="text"
// // // // // //                   value={Name}
// // // // // //                   onChange={(e) => setName(e.target.value)}
// // // // // //                   placeholder="Name"
// // // // // //                   required
// // // // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // //                 />
// // // // // //               </div>
// // // // // //               <div>
// // // // // //                 <label className="block text-sm font-medium text-gray-600">Email</label>
// // // // // //                 <input
// // // // // //                   type="email"
// // // // // //                   value={email}
// // // // // //                   onChange={(e) => setEmail(e.target.value)}
// // // // // //                   placeholder="Email"
// // // // // //                   required
// // // // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // //                 />
// // // // // //               </div>
// // // // // //               <div>
// // // // // //                 <label className="block text-sm font-medium text-gray-600">Phone</label>
// // // // // //                 <div className="flex mt-1">
// // // // // //                   <select
// // // // // //                     value={countryCode}
// // // // // //                     onChange={(e) => setCountryCode(e.target.value)}
// // // // // //                     className="w-1/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // //                   >
// // // // // //                     {countryCodes.map((country) => (
// // // // // //                       <option key={country.code} value={country.code}>
// // // // // //                         {country.label}
// // // // // //                       </option>
// // // // // //                     ))}
// // // // // //                   </select>
// // // // // //                   <input
// // // // // //                     type="text"
// // // // // //                     value={phone}
// // // // // //                     onChange={(e) => setPhone(e.target.value)}
// // // // // //                     placeholder="Phone Number"
// // // // // //                     required
// // // // // //                     className="w-2/3 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // //                   />
// // // // // //                 </div>
// // // // // //               </div>
// // // // // //               <div>
// // // // // //                 <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
// // // // // //                 <input
// // // // // //                   type="date"
// // // // // //                   value={dateOfBirth}
// // // // // //                   onChange={(e) => setDateOfBirth(e.target.value)}
// // // // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // //                 />
// // // // // //               </div>
// // // // // //             </div>
// // // // // //           </div>

// // // // // //           {/* Guardian Details */}
// // // // // //           <div>
// // // // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Guardian Details</h2>
// // // // // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // // // // //               <div>
// // // // // //                 <label className="block text-sm font-medium text-gray-600">Name</label>
// // // // // //                 <input
// // // // // //                   type="text"
// // // // // //                   value={guardianDetails.name}
// // // // // //                   onChange={(e) => handleGuardianChange('name', e.target.value)}
// // // // // //                   placeholder="Guardian Name"
// // // // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // //                 />
// // // // // //               </div>
// // // // // //               <div>
// // // // // //                 <label className="block text-sm font-medium text-gray-600">Phone</label>
// // // // // //                 <div className="flex mt-1">
// // // // // //                   <select
// // // // // //                     value={guardianCountryCode}
// // // // // //                     onChange={(e) => setGuardianCountryCode(e.target.value)}
// // // // // //                     className="w-1/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // //                   >
// // // // // //                     {countryCodes.map((country) => (
// // // // // //                       <option key={country.code} value={country.code}>
// // // // // //                         {country.label}
// // // // // //                       </option>
// // // // // //                     ))}
// // // // // //                   </select>
// // // // // //                   <input
// // // // // //                     type="text"
// // // // // //                     value={guardianDetails.phone}
// // // // // //                     onChange={(e) => handleGuardianChange('phone', e.target.value)}
// // // // // //                     placeholder="Guardian Phone"
// // // // // //                     className="w-2/3 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // //                   />
// // // // // //                 </div>
// // // // // //               </div>
// // // // // //               <div>
// // // // // //                 <label className="block text-sm font-medium text-gray-600">Email</label>
// // // // // //                 <input
// // // // // //                   type="email"
// // // // // //                   value={guardianDetails.email}
// // // // // //                   onChange={(e) => handleGuardianChange('email', e.target.value)}
// // // // // //                   placeholder="Guardian Email"
// // // // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // //                 />
// // // // // //               </div>
// // // // // //               <div>
// // // // // //                 <label className="block text-sm font-medium text-gray-600">Relation</label>
// // // // // //                 <input
// // // // // //                   type="text"
// // // // // //                   value={guardianDetails.relation}
// // // // // //                   onChange={(e) => handleGuardianChange('relation', e.target.value)}
// // // // // //                   placeholder="Relation"
// // // // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // //                 />
// // // // // //               </div>
// // // // // //               <div>
// // // // // //                 <label className="block text-sm font-medium text-gray-600">Occupation</label>
// // // // // //                 <input
// // // // // //                   type="text"
// // // // // //                   value={guardianDetails.occupation}
// // // // // //                   onChange={(e) => handleGuardianChange('occupation', e.target.value)}
// // // // // //                   placeholder="Occupation"
// // // // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // //                 />
// // // // // //               </div>
// // // // // //             </div>
// // // // // //           </div>

// // // // // //           {/* Emergency Contact */}
// // // // // //           <div>
// // // // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Emergency Contact</h2>
// // // // // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // // // // //               <div>
// // // // // //                 <label className="block text-sm font-medium text-gray-600">Name</label>
// // // // // //                 <input
// // // // // //                   type="text"
// // // // // //                   value={emergencyContact.name}
// // // // // //                   onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
// // // // // //                   placeholder="Emergency Contact Name"
// // // // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // //                 />
// // // // // //               </div>
// // // // // //               <div>
// // // // // //                 <label className="block text-sm font-medium text-gray-600">Phone</label>
// // // // // //                 <div className="flex mt-1">
// // // // // //                   <select
// // // // // //                     value={emergencyContact.countryCode}
// // // // // //                     onChange={(e) => handleEmergencyContactChange('countryCode', e.target.value)}
// // // // // //                     className="w-1/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // //                   >
// // // // // //                     {countryCodes.map((country) => (
// // // // // //                       <option key={country.code} value={country.code}>
// // // // // //                         {country.label}
// // // // // //                       </option>
// // // // // //                     ))}
// // // // // //                   </select>
// // // // // //                   <input
// // // // // //                     type="text"
// // // // // //                     value={emergencyContact.phone}
// // // // // //                     onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
// // // // // //                     placeholder="Emergency Contact Phone"
// // // // // //                     className="w-2/3 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // //                   />
// // // // // //                 </div>
// // // // // //               </div>
// // // // // //             </div>
// // // // // //           </div>

// // // // // //           {/* Address Details */}
// // // // // //           <div>
// // // // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Address Details</h2>
// // // // // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
// // // // // //               <div>
// // // // // //                 <h3 className="text-md font-medium text-gray-600 mb-2">Residential Address</h3>
// // // // // //                 <div className="space-y-3">
// // // // // //                   <input
// // // // // //                     type="text"
// // // // // //                     value={address.street}
// // // // // //                     onChange={(e) => setAddress({ ...address, street: e.target.value })}
// // // // // //                     placeholder="Street"
// // // // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // //                   />
// // // // // //                   <input
// // // // // //                     type="text"
// // // // // //                     value={address.area}
// // // // // //                     onChange={(e) => setAddress({ ...address, area: e.target.value })}
// // // // // //                     placeholder="Area"
// // // // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // //                   />
// // // // // //                   <input
// // // // // //                     type="text"
// // // // // //                     value={address.city}
// // // // // //                     onChange={(e) => setAddress({ ...address, city: e.target.value })}
// // // // // //                     placeholder="City"
// // // // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // //                   />
// // // // // //                   <input
// // // // // //                     type="text"
// // // // // //                     value={address.state}
// // // // // //                     onChange={(e) => setAddress({ ...address, state: e.target.value })}
// // // // // //                     placeholder="State"
// // // // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // //                   />
// // // // // //                   <input
// // // // // //                     type="text"
// // // // // //                     value={address.zip}
// // // // // //                     onChange={(e) => setAddress({ ...address, zip: e.target.value })}
// // // // // //                     placeholder="Zip Code"
// // // // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // //                   />
// // // // // //                   <input
// // // // // //                     type="text"
// // // // // //                     value={address.country}
// // // // // //                     onChange={(e) => setAddress({ ...address, country: e.target.value })}
// // // // // //                     placeholder="Country"
// // // // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // //                   />
// // // // // //                 </div>
// // // // // //               </div>
// // // // // //             </div>
// // // // // //           </div>

// // // // // //           {/* Document Uploads */}
// // // // // //           <div>
// // // // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Document Uploads</h2>
// // // // // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // // // // //               {[
// // // // // //                 { key: 'aadharCard', label: 'Aadhar Card' },
// // // // // //                 { key: 'panCard', label: 'PAN Card' },
// // // // // //                 { key: 'addressProof', label: 'Address Proof' },
// // // // // //                 { key: 'tenthMarksheet', label: '10th Marksheet' },
// // // // // //                 { key: 'twelfthMarksheet', label: '12th Marksheet' },
// // // // // //                 { key: 'graduationMarksheet', label: 'Graduation Marksheet' },
// // // // // //                 { key: 'pgMarksheet', label: 'PG Marksheet' },
// // // // // //                 { key: 'offerLetter1', label: 'Last Offer Letter 1' },
// // // // // //                 { key: 'offerLetter2', label: 'Last Offer Letter 2' },
// // // // // //                 { key: 'experienceLetter1', label: 'Last Experience Letter 1' },
// // // // // //                 { key: 'experienceLetter2', label: 'Last Experience Letter 2' },
// // // // // //                 { key: 'salaryProof', label: 'Salary Proof' },
// // // // // //                 { key: 'parentSpouseAadhar', label: "Parent/Spouse Aadhar Card" },
// // // // // //                 { key: 'passportPhoto', label: 'Passport Size Photo' },
// // // // // //               ].map((doc) => (
// // // // // //                 <div key={doc.key}>
// // // // // //                   <label className="block text-sm font-medium text-gray-600">{doc.label}</label>
// // // // // //                   <input
// // // // // //                     type="file"
// // // // // //                     onChange={(e) => handleFileChange(e, doc.key)}
// // // // // //                     accept=".pdf,.jpg,.jpeg,.png"
// // // // // //                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // //                   />
// // // // // //                   {uploadProgress[doc.key] > 0 && (
// // // // // //                     <div className="mt-2">
// // // // // //                       <div className="w-full bg-gray-200 rounded-full h-2.5">
// // // // // //                         <div
// // // // // //                           className="bg-blue-600 h-2.5 rounded-full"
// // // // // //                           style={{ width: `${uploadProgress[doc.key]}%` }}
// // // // // //                         ></div>
// // // // // //                       </div>
// // // // // //                       <span className="text-sm text-gray-600">{uploadProgress[doc.key]}%</span>
// // // // // //                     </div>
// // // // // //                   )}
// // // // // //                 </div>
// // // // // //               ))}
// // // // // //             </div>
// // // // // //           </div>

// // // // // //           {/* Educational Details */}
// // // // // //           <div>
// // // // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Educational Details</h2>
// // // // // //             <div className="overflow-x-auto">
// // // // // //               <table className="w-full border-collapse">
// // // // // //                 <thead>
// // // // // //                   <tr className="bg-gray-100">
// // // // // //                     <th className="p-3 text-sm font-medium text-gray-600">Level</th>
// // // // // //                     <th className="p-3 text-sm font-medium text-gray-600">Institute</th>
// // // // // //                     <th className="p-3 text-sm font-medium text-gray-600">Degree</th>
// // // // // //                     <th className="p-3 text-sm font-medium text-gray-600">Specialization</th>
// // // // // //                     <th className="p-3 text-sm font-medium text-gray-600">Grade</th>
// // // // // //                     <th className="p-3 text-sm font-medium text-gray-600">Passing Year</th>
// // // // // //                     <th className="p-3 text-sm font-medium text-gray-600">Actions</th>
// // // // // //                   </tr>
// // // // // //                 </thead>
// // // // // //                 <tbody>
// // // // // //                   {educationDetails.map((edu, index) => (
// // // // // //                     <tr key={index} className="border-b hover:bg-gray-50">
// // // // // //                       <td className="p-3">
// // // // // //                         <select
// // // // // //                           value={edu.level}
// // // // // //                           onChange={(e) => handleEducationChange(index, 'level', e.target.value)}
// // // // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // //                         >
// // // // // //                           <option value="" disabled>Select Level</option>
// // // // // //                           <option value="School">School</option>
// // // // // //                           <option value="UG">UG</option>
// // // // // //                           <option value="PG">PG</option>
// // // // // //                         </select>
// // // // // //                       </td>
// // // // // //                       <td className="p-3">
// // // // // //                         <input
// // // // // //                           type="text"
// // // // // //                           value={edu.institute}
// // // // // //                           onChange={(e) => handleEducationChange(index, 'institute', e.target.value)}
// // // // // //                           placeholder="Institute Name"
// // // // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // //                         />
// // // // // //                       </td>
// // // // // //                       <td className="p-3">
// // // // // //                         <input
// // // // // //                           type="text"
// // // // // //                           value={edu.degree}
// // // // // //                           onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
// // // // // //                           placeholder="Degree"
// // // // // //                           required
// // // // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // //                         />
// // // // // //                       </td>
// // // // // //                       <td className="p-3">
// // // // // //                         <input
// // // // // //                           type="text"
// // // // // //                           value={edu.specialization}
// // // // // //                           onChange={(e) => handleEducationChange(index, 'specialization', e.target.value)}
// // // // // //                           placeholder="Specialization"
// // // // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // //                         />
// // // // // //                       </td>
// // // // // //                       <td className="p-3">
// // // // // //                         <input
// // // // // //                           type="number"
// // // // // //                           value={edu.grade}
// // // // // //                           onChange={(e) => handleEducationChange(index, 'grade', e.target.value)}
// // // // // //                           placeholder="Grade"
// // // // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // //                         />
// // // // // //                       </td>
// // // // // //                       <td className="p-3">
// // // // // //                         <input
// // // // // //                           type="number"
// // // // // //                           value={edu.passingyr}
// // // // // //                           onChange={(e) => handleEducationChange(index, 'passingyr', e.target.value)}
// // // // // //                           placeholder="Year"
// // // // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // //                         />
// // // // // //                       </td>
// // // // // //                       <td className="p-3">
// // // // // //                         <button
// // // // // //                           type="button"
// // // // // //                           onClick={() => deleteEducation(index)}
// // // // // //                           className="text-red-500 hover:text-red-700"
// // // // // //                         >
// // // // // //                           <FontAwesomeIcon icon={faXmark} />
// // // // // //                         </button>
// // // // // //                       </td>
// // // // // //                     </tr>
// // // // // //                   ))}
// // // // // //                 </tbody>
// // // // // //               </table>
// // // // // //               <button
// // // // // //                 type="button"
// // // // // //                 onClick={addEducation}
// // // // // //                 className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
// // // // // //               >
// // // // // //                 Add Education
// // // // // //               </button>
// // // // // //             </div>
// // // // // //           </div>

// // // // // //           {/* Experience Details */}
// // // // // //           <div>
// // // // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Experience Details</h2>
// // // // // //             <div className="overflow-x-auto">
// // // // // //               <table className="w-full border-collapse">
// // // // // //                 <thead>
// // // // // //                   <tr className="bg-gray-100">
// // // // // //                     <th className="p-3 text-sm font-medium text-gray-600">Company Name</th>
// // // // // //                     <th className="p-3 text-sm font-medium text-gray-600">Designation</th>
// // // // // //                     <th className="p-3 text-sm font-medium text-gray-600">Salary</th>
// // // // // //                     <th className="p-3 text-sm font-medium text-gray-600">Years</th>
// // // // // //                     <th className="p-3 text-sm font-medium text-gray-600">Description</th>
// // // // // //                     <th className="p-3 text-sm font-medium text-gray-600">Actions</th>
// // // // // //                   </tr>
// // // // // //                 </thead>
// // // // // //                 <tbody>
// // // // // //                   {experienceDetails.map((exp, index) => (
// // // // // //                     <tr key={index} className="border-b hover:bg-gray-50">
// // // // // //                       <td className="p-3">
// // // // // //                         <input
// // // // // //                           type="text"
// // // // // //                           value={exp.companyName}
// // // // // //                           onChange={(e) => handleExperienceChange(index, 'companyName', e.target.value)}
// // // // // //                           placeholder="Company Name"
// // // // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // //                         />
// // // // // //                       </td>
// // // // // //                       <td className="p-3">
// // // // // //                         <input
// // // // // //                           type="text"
// // // // // //                           value={exp.designation}
// // // // // //                           onChange={(e) => handleExperienceChange(index, 'designation', e.target.value)}
// // // // // //                           placeholder="Designation"
// // // // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // //                         />
// // // // // //                       </td>
// // // // // //                       <td className="p-3">
// // // // // //                         <input
// // // // // //                           type="number"
// // // // // //                           value={exp.salary}
// // // // // //                           onChange={(e) => handleExperienceChange(index, 'salary', e.target.value)}
// // // // // //                           placeholder="Salary"
// // // // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // //                         />
// // // // // //                       </td>
// // // // // //                       <td className="p-3">
// // // // // //                         <input
// // // // // //                           type="number"
// // // // // //                           value={exp.years}
// // // // // //                           onChange={(e) => handleExperienceChange(index, 'years', e.target.value)}
// // // // // //                           placeholder="Years"
// // // // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // //                         />
// // // // // //                       </td>
// // // // // //                       <td className="p-3">
// // // // // //                         <input
// // // // // //                           type="text"
// // // // // //                           value={exp.description}
// // // // // //                           onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
// // // // // //                           placeholder="Description"
// // // // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // //                         />
// // // // // //                       </td>
// // // // // //                       <td className="p-3">
// // // // // //                         <button
// // // // // //                           type="button"
// // // // // //                           onClick={() => deleteExperience(index)}
// // // // // //                           className="text-red-500 hover:text-red-700"
// // // // // //                         >
// // // // // //                           <FontAwesomeIcon icon={faXmark} />
// // // // // //                         </button>
// // // // // //                       </td>
// // // // // //                     </tr>
// // // // // //                   ))}
// // // // // //                 </tbody>
// // // // // //               </table>
// // // // // //               <button
// // // // // //                 type="button"
// // // // // //                 onClick={addExperience}
// // // // // //                 className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
// // // // // //               >
// // // // // //                 Add Experience
// // // // // //               </button>
// // // // // //             </div>
// // // // // //           </div>

// // // // // //           {/* Additional Details */}
// // // // // //           <div>
// // // // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Additional Details</h2>
// // // // // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // // // // //               <div>
// // // // // //                 <label className="block text-sm font-medium text-gray-600">Date of Joining</label>
// // // // // //                 <input
// // // // // //                   type="date"
// // // // // //                   value={joiningDate}
// // // // // //                   onChange={(e) => setJoiningDate(e.target.value)}
// // // // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
// // // // // //                 />
// // // // // //               </div>
// // // // // //             </div>
// // // // // //           </div>

// // // // // //           <div className="flex justify-end">
// // // // // //             <button
// // // // // //               type="submit"
// // // // // //               disabled={isSubmitting}
// // // // // //               className={`bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200 ${
// // // // // //                 isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
// // // // // //               }`}
// // // // // //             >
// // // // // //               {isSubmitting ? 'Processing...' : 'Add Staff'}
// // // // // //             </button>
// // // // // //           </div>
// // // // // //         </form>
// // // // // //       </div>
// // // // // //     </>
// // // // // //   );
// // // // // // }


// // // // // import React, { useState, useEffect } from "react";
// // // // // import { useNavigate } from "react-router-dom";
// // // // // import { collection, addDoc, doc, updateDoc, Timestamp } from "firebase/firestore";
// // // // // import { db } from "../../../config/firebase";
// // // // // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // // // // import { faXmark } from '@fortawesome/free-solid-svg-icons';
// // // // // import { PutObjectCommand } from "@aws-sdk/client-s3";
// // // // // import { s3Client } from "../../../config/aws-config";

// // // // // export default function AddStaff() {
// // // // //   const [isOpen, setIsOpen] = useState(true);
// // // // //   const [Name, setName] = useState("");
// // // // //   const [email, setEmail] = useState("");
// // // // //   const [phone, setPhone] = useState("");
// // // // //   const [countryCode, setCountryCode] = useState("+91");
// // // // //   const [guardianCountryCode, setGuardianCountryCode] = useState("+91");
// // // // //   const [address, setAddress] = useState({ street: "", area: "", city: "", state: "", zip: "", country: "" });
// // // // //   const [dateOfBirth, setDateOfBirth] = useState("");
// // // // //   const [guardianDetails, setGuardianDetails] = useState({ name: "", phone: "", email: "", relation: "", occupation: "" });
// // // // //   const [joiningDate, setJoiningDate] = useState("");
// // // // //   const [educationDetails, setEducationDetails] = useState([]);
// // // // //   const [experienceDetails, setExperienceDetails] = useState([]);
// // // // //   const [emergencyContact, setEmergencyContact] = useState({ name: "", phone: "", countryCode: "+91" });
// // // // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // // // //   const navigate = useNavigate();

// // // // //   // File states for document uploads
// // // // //   const [documents, setDocuments] = useState({
// // // // //     aadharCard: null,
// // // // //     panCard: null,
// // // // //     addressProof: null,
// // // // //     tenthMarksheet: null,
// // // // //     twelfthMarksheet: null,
// // // // //     graduationMarksheet: null,
// // // // //     pgMarksheet: null,
// // // // //     offerLetter1: null,
// // // // //     offerLetter2: null,
// // // // //     experienceLetter1: null,
// // // // //     experienceLetter2: null,
// // // // //     salaryProof: null,
// // // // //     parentSpouseAadhar: null,
// // // // //     passportPhoto: null,
// // // // //   });
// // // // //   const [uploadProgress, setUploadProgress] = useState({});

// // // // //   // Country codes with unique keys
// // // // //   const countryCodes = [
// // // // //     // { key: "usa-+1", code: "+1", label: "USA (+1)" },
// // // // //     { key: "canada-+1", code: "+1", label: "Canada (+1)" },
// // // // //     { key: "russia-+7", code: "+7", label: "Russia (+7)" },
// // // // //     { key: "india-+91", code: "+91", label: "India (+91)" },
// // // // //   ];

// // // // //   const capitalizeFirstLetter = (str) => {
// // // // //     if (!str || typeof str !== "string") return str;
// // // // //     return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
// // // // //   };

// // // // //   useEffect(() => {
// // // // //     const today = new Date().toISOString().split("T")[0];
// // // // //     setJoiningDate(today);
// // // // //   }, []);

// // // // //   // Handle file input change
// // // // //   const handleFileChange = (e, docType) => {
// // // // //     const file = e.target.files[0];
// // // // //     if (file) {
// // // // //       setDocuments((prev) => ({ ...prev, [docType]: file }));
// // // // //       setUploadProgress((prev) => ({ ...prev, [docType]: 0 }));
// // // // //     }
// // // // //   };

// // // // //   // Upload file to S3 with progress tracking
// // // // //   const uploadFileToS3 = async (file, docType, staffId) => {
// // // // //     const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
// // // // //     if (!bucketName) {
// // // // //       throw new Error("S3 Bucket name is not defined. Please check your environment variables.");
// // // // //     }

// // // // //     if (!file || !(file instanceof File)) {
// // // // //       throw new Error(`Invalid file for ${docType}: File object is null or not a File instance`);
// // // // //     }

// // // // //     console.log(`Uploading ${docType}:`, {
// // // // //       name: file.name,
// // // // //       size: file.size,
// // // // //       type: file.type,
// // // // //     });

// // // // //     const fileName = `${staffId}/${docType}_${Date.now()}_${file.name}`;
// // // // //     const params = {
// // // // //       Bucket: bucketName,
// // // // //       Key: fileName,
// // // // //       Body: file, // File object should work as-is
// // // // //       ContentType: file.type,
// // // // //     };

// // // // //     try {
// // // // //       // Simulate progress
// // // // //       const fileSize = file.size;
// // // // //       let uploadedBytes = 0;

// // // // //       const updateProgress = (bytes) => {
// // // // //         uploadedBytes += bytes;
// // // // //         const percent = Math.min(Math.round((uploadedBytes / fileSize) * 100), 100);
// // // // //         setUploadProgress((prev) => ({ ...prev, [docType]: percent }));
// // // // //       };

// // // // //       const interval = setInterval(() => {
// // // // //         updateProgress(fileSize / 10);
// // // // //         if (uploadedBytes >= fileSize) clearInterval(interval);
// // // // //       }, 500);

// // // // //       await s3Client.send(new PutObjectCommand(params));
// // // // //       clearInterval(interval);
// // // // //       setUploadProgress((prev) => ({ ...prev, [docType]: 100 }));

// // // // //       const url = `https://${params.Bucket}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${fileName}`;
// // // // //       return url;
// // // // //     } catch (err) {
// // // // //       console.error(`Error uploading ${docType}:`, err);
// // // // //       throw err;
// // // // //     }
// // // // //   };
// // // // //   // const uploadFileToS3 = async (file, docType, staffId) => {
// // // // //   //   const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
// // // // //   //   if (!bucketName) {
// // // // //   //     throw new Error("S3 Bucket name is not defined. Please check your environment variables.");
// // // // //   //   }

// // // // //   //   const fileName = `${staffId}/${docType}_${Date.now()}_${file.name}`;
// // // // //   //   const params = {
// // // // //   //     Bucket: bucketName,
// // // // //   //     Key: fileName,
// // // // //   //     Body: file,
// // // // //   //     ContentType: file.type,
// // // // //   //   };

// // // // //   //   try {
// // // // //   //     // Simulate progress
// // // // //   //     const fileSize = file.size;
// // // // //   //     let uploadedBytes = 0;

// // // // //   //     const updateProgress = (bytes) => {
// // // // //   //       uploadedBytes += bytes;
// // // // //   //       const percent = Math.min(Math.round((uploadedBytes / fileSize) * 100), 100);
// // // // //   //       setUploadProgress((prev) => ({ ...prev, [docType]: percent }));
// // // // //   //     };

// // // // //   //     const interval = setInterval(() => {
// // // // //   //       updateProgress(fileSize / 10);
// // // // //   //       if (uploadedBytes >= fileSize) clearInterval(interval);
// // // // //   //     }, 500);

// // // // //   //     await s3Client.send(new PutObjectCommand(params));
// // // // //   //     clearInterval(interval);
// // // // //   //     setUploadProgress((prev) => ({ ...prev, [docType]: 100 }));

// // // // //   //     const url = `https://${params.Bucket}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${fileName}`;
// // // // //   //     return url;
// // // // //   //   } catch (err) {
// // // // //   //     console.error(`Error uploading ${docType}:`, err);
// // // // //   //     throw err;
// // // // //   //   }
// // // // //   // };

// // // // //   // Handle form submission
// // // // //   const handleAddStaff = async (e) => {
// // // // //     e.preventDefault();
// // // // //     if (!Name.trim() || !email.trim() || !phone.trim()) {
// // // // //       alert("Please fill all required fields.");
// // // // //       return;
// // // // //     }

// // // // //     setIsSubmitting(true);

// // // // //     try {
// // // // //       // Add staff to Firestore
// // // // //       const staffDocRef = await addDoc(collection(db, "Instructor"), {
// // // // //         Name: capitalizeFirstLetter(Name),
// // // // //         email,
// // // // //         phone: `${countryCode}${phone}`,
// // // // //         residential_address: address,
// // // // //         date_of_birth: dateOfBirth ? Timestamp.fromDate(new Date(dateOfBirth)) : null,
// // // // //         guardian_details: {
// // // // //           ...guardianDetails,
// // // // //           phone: `${guardianCountryCode}${guardianDetails.phone || ""}`,
// // // // //         },
// // // // //         emergency_contact: {
// // // // //           name: emergencyContact.name,
// // // // //           phone: `${emergencyContact.countryCode}${emergencyContact.phone || ""}`,
// // // // //         },
// // // // //         joining_date: Timestamp.fromDate(new Date(joiningDate)),
// // // // //         education_details: educationDetails,
// // // // //         experience_details: experienceDetails,
// // // // //         documents: {},
// // // // //       });

// // // // //       const staffId = staffDocRef.id;

// // // // //       // Upload files to S3
// // // // //       const documentUrls = {};
// // // // //       for (const [docType, file] of Object.entries(documents)) {
// // // // //         if (file) {
// // // // //           try {
// // // // //             const url = await uploadFileToS3(file, docType, staffId);
// // // // //             documentUrls[docType] = url;
// // // // //           } catch (uploadErr) {
// // // // //             console.error(`Failed to upload ${docType}:`, uploadErr);
// // // // //             throw new Error(`Failed to upload ${docType}: ${uploadErr.message}`);
// // // // //           }
// // // // //         }
// // // // //       }

// // // // //       // Update Firestore with document URLs
// // // // //       await updateDoc(doc(db, "Instructor", staffId), {
// // // // //         documents: documentUrls,
// // // // //       });

// // // // //       alert("Staff added successfully!");
// // // // //       navigate("/instructor");
// // // // //     } catch (error) {
// // // // //       console.error("Error adding staff:", error);
// // // // //       alert(`Error adding staff: ${error.message}`);
// // // // //     } finally {
// // // // //       setIsSubmitting(false);
// // // // //     }
// // // // //   };

// // // // //   const addEducation = () => {
// // // // //     setEducationDetails([...educationDetails, { level: '', institute: '', degree: '', specialization: '', grade: '', passingyr: '' }]);
// // // // //   };

// // // // //   const handleEducationChange = (index, field, value) => {
// // // // //     const newEducationDetails = [...educationDetails];
// // // // //     newEducationDetails[index][field] = value;
// // // // //     setEducationDetails(newEducationDetails);
// // // // //   };

// // // // //   const deleteEducation = (index) => {
// // // // //     setEducationDetails(educationDetails.filter((_, i) => i !== index));
// // // // //   };

// // // // //   const addExperience = () => {
// // // // //     setExperienceDetails([...experienceDetails, { companyName: '', designation: '', salary: '', years: '', description: '' }]);
// // // // //   };

// // // // //   const handleExperienceChange = (index, field, value) => {
// // // // //     const newExperienceDetails = [...experienceDetails];
// // // // //     newExperienceDetails[index][field] = value;
// // // // //     setExperienceDetails(newExperienceDetails);
// // // // //   };

// // // // //   const deleteExperience = (index) => {
// // // // //     setExperienceDetails(experienceDetails.filter((_, i) => i !== index));
// // // // //   };

// // // // //   const handleGuardianChange = (field, value) => {
// // // // //     setGuardianDetails((prev) => ({ ...prev, [field]: value }));
// // // // //   };

// // // // //   const handleEmergencyContactChange = (field, value) => {
// // // // //     setEmergencyContact((prev) => ({ ...prev, [field]: value }));
// // // // //   };

// // // // //   const toggleSidebar = () => {
// // // // //     setIsOpen(false);
// // // // //     navigate("/instructor");
// // // // //   };

// // // // //   return (
// // // // //     <>
// // // // //       {isOpen && (
// // // // //         <div
// // // // //           className="fixed inset-0 bg-black bg-opacity-50 z-40"
// // // // //           onClick={toggleSidebar}
// // // // //         />
// // // // //       )}

// // // // //       <div
// // // // //         className={`fixed top-0 right-0 h-full bg-white w-full sm:w-2/3 shadow-lg transform transition-transform duration-300 ${
// // // // //           isOpen ? "translate-x-0" : "translate-x-full"
// // // // //         } p-6 overflow-y-auto z-50`}
// // // // //       >
// // // // //         <div className="flex justify-between items-center mb-6">
// // // // //           <h1 className="text-2xl font-semibold text-gray-800">Add Staff</h1>
// // // // //           <button
// // // // //             onClick={() => navigate('/instructor')}
// // // // //             className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200"
// // // // //           >
// // // // //             Back
// // // // //           </button>
// // // // //         </div>

// // // // //         <form onSubmit={handleAddStaff} className="space-y-8">
// // // // //           {/* Personal Details */}
// // // // //           <div>
// // // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Personal Details</h2>
// // // // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // // // //               <div>
// // // // //                 <label className="block text-sm font-medium text-gray-600">Name</label>
// // // // //                 <input
// // // // //                   type="text"
// // // // //                   value={Name}
// // // // //                   onChange={(e) => setName(e.target.value)}
// // // // //                   placeholder="Name"
// // // // //                   required
// // // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // //                 />
// // // // //               </div>
// // // // //               <div>
// // // // //                 <label className="block text-sm font-medium text-gray-600">Email</label>
// // // // //                 <input
// // // // //                   type="email"
// // // // //                   value={email}
// // // // //                   onChange={(e) => setEmail(e.target.value)}
// // // // //                   placeholder="Email"
// // // // //                   required
// // // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // //                 />
// // // // //               </div>
// // // // //               <div>
// // // // //                 <label className="block text-sm font-medium text-gray-600">Phone</label>
// // // // //                 <div className="flex mt-1">
// // // // //                   <select
// // // // //                     value={countryCode}
// // // // //                     onChange={(e) => setCountryCode(e.target.value)}
// // // // //                     className="w-1/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // //                   >
// // // // //                     {countryCodes.map((country) => (
// // // // //                       <option key={country.key} value={country.code}>
// // // // //                         {country.label}
// // // // //                       </option>
// // // // //                     ))}
// // // // //                   </select>
// // // // //                   <input
// // // // //                     type="text"
// // // // //                     value={phone}
// // // // //                     onChange={(e) => setPhone(e.target.value)}
// // // // //                     placeholder="Phone Number"
// // // // //                     required
// // // // //                     className="w-2/3 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // //                   />
// // // // //                 </div>
// // // // //               </div>
// // // // //               <div>
// // // // //                 <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
// // // // //                 <input
// // // // //                   type="date"
// // // // //                   value={dateOfBirth}
// // // // //                   onChange={(e) => setDateOfBirth(e.target.value)}
// // // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // //                 />
// // // // //               </div>
// // // // //             </div>
// // // // //           </div>

// // // // //           {/* Guardian Details */}
// // // // //           <div>
// // // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Guardian Details</h2>
// // // // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // // // //               <div>
// // // // //                 <label className="block text-sm font-medium text-gray-600">Name</label>
// // // // //                 <input
// // // // //                   type="text"
// // // // //                   value={guardianDetails.name}
// // // // //                   onChange={(e) => handleGuardianChange('name', e.target.value)}
// // // // //                   placeholder="Guardian Name"
// // // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // //                 />
// // // // //               </div>
// // // // //               <div>
// // // // //                 <label className="block text-sm font-medium text-gray-600">Phone</label>
// // // // //                 <div className="flex mt-1">
// // // // //                   <select
// // // // //                     value={guardianCountryCode}
// // // // //                     onChange={(e) => setGuardianCountryCode(e.target.value)}
// // // // //                     className="w-1/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // //                   >
// // // // //                     {countryCodes.map((country) => (
// // // // //                       <option key={country.key} value={country.code}>
// // // // //                         {country.label}
// // // // //                       </option>
// // // // //                     ))}
// // // // //                   </select>
// // // // //                   <input
// // // // //                     type="text"
// // // // //                     value={guardianDetails.phone}
// // // // //                     onChange={(e) => handleGuardianChange('phone', e.target.value)}
// // // // //                     placeholder="Guardian Phone"
// // // // //                     className="w-2/3 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // //                   />
// // // // //                 </div>
// // // // //               </div>
// // // // //               <div>
// // // // //                 <label className="block text-sm font-medium text-gray-600">Email</label>
// // // // //                 <input
// // // // //                   type="email"
// // // // //                   value={guardianDetails.email}
// // // // //                   onChange={(e) => handleGuardianChange('email', e.target.value)}
// // // // //                   placeholder="Guardian Email"
// // // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // //                 />
// // // // //               </div>
// // // // //               <div>
// // // // //                 <label className="block text-sm font-medium text-gray-600">Relation</label>
// // // // //                 <input
// // // // //                   type="text"
// // // // //                   value={guardianDetails.relation}
// // // // //                   onChange={(e) => handleGuardianChange('relation', e.target.value)}
// // // // //                   placeholder="Relation"
// // // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // //                 />
// // // // //               </div>
// // // // //               <div>
// // // // //                 <label className="block text-sm font-medium text-gray-600">Occupation</label>
// // // // //                 <input
// // // // //                   type="text"
// // // // //                   value={guardianDetails.occupation}
// // // // //                   onChange={(e) => handleGuardianChange('occupation', e.target.value)}
// // // // //                   placeholder="Occupation"
// // // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // //                 />
// // // // //               </div>
// // // // //             </div>
// // // // //           </div>

// // // // //           {/* Emergency Contact */}
// // // // //           <div>
// // // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Emergency Contact</h2>
// // // // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // // // //               <div>
// // // // //                 <label className="block text-sm font-medium text-gray-600">Name</label>
// // // // //                 <input
// // // // //                   type="text"
// // // // //                   value={emergencyContact.name}
// // // // //                   onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
// // // // //                   placeholder="Emergency Contact Name"
// // // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // //                 />
// // // // //               </div>
// // // // //               <div>
// // // // //                 <label className="block text-sm font-medium text-gray-600">Phone</label>
// // // // //                 <div className="flex mt-1">
// // // // //                   <select
// // // // //                     value={emergencyContact.countryCode}
// // // // //                     onChange={(e) => handleEmergencyContactChange('countryCode', e.target.value)}
// // // // //                     className="w-1/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // //                   >
// // // // //                     {countryCodes.map((country) => (
// // // // //                       <option key={country.key} value={country.code}>
// // // // //                         {country.label}
// // // // //                       </option>
// // // // //                     ))}
// // // // //                   </select>
// // // // //                   <input
// // // // //                     type="text"
// // // // //                     value={emergencyContact.phone}
// // // // //                     onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
// // // // //                     placeholder="Emergency Contact Phone"
// // // // //                     className="w-2/3 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // //                   />
// // // // //                 </div>
// // // // //               </div>
// // // // //             </div>
// // // // //           </div>

// // // // //           {/* Address Details */}
// // // // //           <div>
// // // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Address Details</h2>
// // // // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
// // // // //               <div>
// // // // //                 <h3 className="text-md font-medium text-gray-600 mb-2">Residential Address</h3>
// // // // //                 <div className="space-y-3">
// // // // //                   <input
// // // // //                     type="text"
// // // // //                     value={address.street}
// // // // //                     onChange={(e) => setAddress({ ...address, street: e.target.value })}
// // // // //                     placeholder="Street"
// // // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // //                   />
// // // // //                   <input
// // // // //                     type="text"
// // // // //                     value={address.area}
// // // // //                     onChange={(e) => setAddress({ ...address, area: e.target.value })}
// // // // //                     placeholder="Area"
// // // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // //                   />
// // // // //                   <input
// // // // //                     type="text"
// // // // //                     value={address.city}
// // // // //                     onChange={(e) => setAddress({ ...address, city: e.target.value })}
// // // // //                     placeholder="City"
// // // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // //                   />
// // // // //                   <input
// // // // //                     type="text"
// // // // //                     value={address.state}
// // // // //                     onChange={(e) => setAddress({ ...address, state: e.target.value })}
// // // // //                     placeholder="State"
// // // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // //                   />
// // // // //                   <input
// // // // //                     type="text"
// // // // //                     value={address.zip}
// // // // //                     onChange={(e) => setAddress({ ...address, zip: e.target.value })}
// // // // //                     placeholder="Zip Code"
// // // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // //                   />
// // // // //                   <input
// // // // //                     type="text"
// // // // //                     value={address.country}
// // // // //                     onChange={(e) => setAddress({ ...address, country: e.target.value })}
// // // // //                     placeholder="Country"
// // // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // //                   />
// // // // //                 </div>
// // // // //               </div>
// // // // //             </div>
// // // // //           </div>

// // // // //           {/* Document Uploads */}
// // // // //           <div>
// // // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Document Uploads</h2>
// // // // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // // // //               {[
// // // // //                 { key: 'aadharCard', label: 'Aadhar Card' },
// // // // //                 { key: 'panCard', label: 'PAN Card' },
// // // // //                 { key: 'addressProof', label: 'Address Proof' },
// // // // //                 { key: 'tenthMarksheet', label: '10th Marksheet' },
// // // // //                 { key: 'twelfthMarksheet', label: '12th Marksheet' },
// // // // //                 { key: 'graduationMarksheet', label: 'Graduation Marksheet' },
// // // // //                 { key: 'pgMarksheet', label: 'PG Marksheet' },
// // // // //                 { key: 'offerLetter1', label: 'Last Offer Letter 1' },
// // // // //                 { key: 'offerLetter2', label: 'Last Offer Letter 2' },
// // // // //                 { key: 'experienceLetter1', label: 'Last Experience Letter 1' },
// // // // //                 { key: 'experienceLetter2', label: 'Last Experience Letter 2' },
// // // // //                 { key: 'salaryProof', label: 'Salary Proof' },
// // // // //                 { key: 'parentSpouseAadhar', label: "Parent/Spouse Aadhar Card" },
// // // // //                 { key: 'passportPhoto', label: 'Passport Size Photo' },
// // // // //               ].map((doc) => (
// // // // //                 <div key={doc.key}>
// // // // //                   <label className="block text-sm font-medium text-gray-600">{doc.label}</label>
// // // // //                   <input
// // // // //                     type="file"
// // // // //                     onChange={(e) => handleFileChange(e, doc.key)}
// // // // //                     accept=".pdf,.jpg,.jpeg,.png"
// // // // //                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // //                   />
// // // // //                   {uploadProgress[doc.key] > 0 && (
// // // // //                     <div className="mt-2">
// // // // //                       <div className="w-full bg-gray-200 rounded-full h-2.5">
// // // // //                         <div
// // // // //                           className="bg-blue-600 h-2.5 rounded-full"
// // // // //                           style={{ width: `${uploadProgress[doc.key]}%` }}
// // // // //                         ></div>
// // // // //                       </div>
// // // // //                       <span className="text-sm text-gray-600">{uploadProgress[doc.key]}%</span>
// // // // //                     </div>
// // // // //                   )}
// // // // //                 </div>
// // // // //               ))}
// // // // //             </div>
// // // // //           </div>

// // // // //           {/* Educational Details */}
// // // // //           <div>
// // // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Educational Details</h2>
// // // // //             <div className="overflow-x-auto">
// // // // //               <table className="w-full border-collapse">
// // // // //                 <thead>
// // // // //                   <tr className="bg-gray-100">
// // // // //                     <th className="p-3 text-sm font-medium text-gray-600">Level</th>
// // // // //                     <th className="p-3 text-sm font-medium text-gray-600">Institute</th>
// // // // //                     <th className="p-3 text-sm font-medium text-gray-600">Degree</th>
// // // // //                     <th className="p-3 text-sm font-medium text-gray-600">Specialization</th>
// // // // //                     <th className="p-3 text-sm font-medium text-gray-600">Grade</th>
// // // // //                     <th className="p-3 text-sm font-medium text-gray-600">Passing Year</th>
// // // // //                     <th className="p-3 text-sm font-medium text-gray-600">Actions</th>
// // // // //                   </tr>
// // // // //                 </thead>
// // // // //                 <tbody>
// // // // //                   {educationDetails.map((edu, index) => (
// // // // //                     <tr key={index} className="border-b hover:bg-gray-50">
// // // // //                       <td className="p-3">
// // // // //                         <select
// // // // //                           value={edu.level}
// // // // //                           onChange={(e) => handleEducationChange(index, 'level', e.target.value)}
// // // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // //                         >
// // // // //                           <option value="" disabled>Select Level</option>
// // // // //                           <option value="School">School</option>
// // // // //                           <option value="UG">UG</option>
// // // // //                           <option value="PG">PG</option>
// // // // //                         </select>
// // // // //                       </td>
// // // // //                       <td className="p-3">
// // // // //                         <input
// // // // //                           type="text"
// // // // //                           value={edu.institute}
// // // // //                           onChange={(e) => handleEducationChange(index, 'institute', e.target.value)}
// // // // //                           placeholder="Institute Name"
// // // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // //                         />
// // // // //                       </td>
// // // // //                       <td className="p-3">
// // // // //                         <input
// // // // //                           type="text"
// // // // //                           value={edu.degree}
// // // // //                           onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
// // // // //                           placeholder="Degree"
// // // // //                           required
// // // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // //                         />
// // // // //                       </td>
// // // // //                       <td className="p-3">
// // // // //                         <input
// // // // //                           type="text"
// // // // //                           value={edu.specialization}
// // // // //                           onChange={(e) => handleEducationChange(index, 'specialization', e.target.value)}
// // // // //                           placeholder="Specialization"
// // // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // //                         />
// // // // //                       </td>
// // // // //                       <td className="p-3">
// // // // //                         <input
// // // // //                           type="number"
// // // // //                           value={edu.grade}
// // // // //                           onChange={(e) => handleEducationChange(index, 'grade', e.target.value)}
// // // // //                           placeholder="Grade"
// // // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // //                         />
// // // // //                       </td>
// // // // //                       <td className="p-3">
// // // // //                         <input
// // // // //                           type="number"
// // // // //                           value={edu.passingyr}
// // // // //                           onChange={(e) => handleEducationChange(index, 'passingyr', e.target.value)}
// // // // //                           placeholder="Year"
// // // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // //                         />
// // // // //                       </td>
// // // // //                       <td className="p-3">
// // // // //                         <button
// // // // //                           type="button"
// // // // //                           onClick={() => deleteEducation(index)}
// // // // //                           className="text-red-500 hover:text-red-700"
// // // // //                         >
// // // // //                           <FontAwesomeIcon icon={faXmark} />
// // // // //                         </button>
// // // // //                       </td>
// // // // //                     </tr>
// // // // //                   ))}
// // // // //                 </tbody>
// // // // //               </table>
// // // // //               <button
// // // // //                 type="button"
// // // // //                 onClick={addEducation}
// // // // //                 className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
// // // // //               >
// // // // //                 Add Education
// // // // //               </button>
// // // // //             </div>
// // // // //           </div>

// // // // //           {/* Experience Details */}
// // // // //           <div>
// // // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Experience Details</h2>
// // // // //             <div className="overflow-x-auto">
// // // // //               <table className="w-full border-collapse">
// // // // //                 <thead>
// // // // //                   <tr className="bg-gray-100">
// // // // //                     <th className="p-3 text-sm font-medium text-gray-600">Company Name</th>
// // // // //                     <th className="p-3 text-sm font-medium text-gray-600">Designation</th>
// // // // //                     <th className="p-3 text-sm font-medium text-gray-600">Salary</th>
// // // // //                     <th className="p-3 text-sm font-medium text-gray-600">Years</th>
// // // // //                     <th className="p-3 text-sm font-medium text-gray-600">Description</th>
// // // // //                     <th className="p-3 text-sm font-medium text-gray-600">Actions</th>
// // // // //                   </tr>
// // // // //                 </thead>
// // // // //                 <tbody>
// // // // //                   {experienceDetails.map((exp, index) => (
// // // // //                     <tr key={index} className="border-b hover:bg-gray-50">
// // // // //                       <td className="p-3">
// // // // //                         <input
// // // // //                           type="text"
// // // // //                           value={exp.companyName}
// // // // //                           onChange={(e) => handleExperienceChange(index, 'companyName', e.target.value)}
// // // // //                           placeholder="Company Name"
// // // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // //                         />
// // // // //                       </td>
// // // // //                       <td className="p-3">
// // // // //                         <input
// // // // //                           type="text"
// // // // //                           value={exp.designation}
// // // // //                           onChange={(e) => handleExperienceChange(index, 'designation', e.target.value)}
// // // // //                           placeholder="Designation"
// // // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // //                         />
// // // // //                       </td>
// // // // //                       <td className="p-3">
// // // // //                         <input
// // // // //                           type="number"
// // // // //                           value={exp.salary}
// // // // //                           onChange={(e) => handleExperienceChange(index, 'salary', e.target.value)}
// // // // //                           placeholder="Salary"
// // // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // //                         />
// // // // //                       </td>
// // // // //                       <td className="p-3">
// // // // //                         <input
// // // // //                           type="number"
// // // // //                           value={exp.years}
// // // // //                           onChange={(e) => handleExperienceChange(index, 'years', e.target.value)}
// // // // //                           placeholder="Years"
// // // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // //                         />
// // // // //                       </td>
// // // // //                       <td className="p-3">
// // // // //                         <input
// // // // //                           type="text"
// // // // //                           value={exp.description}
// // // // //                           onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
// // // // //                           placeholder="Description"
// // // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // //                         />
// // // // //                       </td>
// // // // //                       <td className="p-3">
// // // // //                         <button
// // // // //                           type="button"
// // // // //                           onClick={() => deleteExperience(index)}
// // // // //                           className="text-red-500 hover:text-red-700"
// // // // //                         >
// // // // //                           <FontAwesomeIcon icon={faXmark} />
// // // // //                         </button>
// // // // //                       </td>
// // // // //                     </tr>
// // // // //                   ))}
// // // // //                 </tbody>
// // // // //               </table>
// // // // //               <button
// // // // //                 type="button"
// // // // //                 onClick={addExperience}
// // // // //                 className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
// // // // //               >
// // // // //                 Add Experience
// // // // //               </button>
// // // // //             </div>
// // // // //           </div>

// // // // //           {/* Additional Details */}
// // // // //           <div>
// // // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Additional Details</h2>
// // // // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // // // //               <div>
// // // // //                 <label className="block text-sm font-medium text-gray-600">Date of Joining</label>
// // // // //                 <input
// // // // //                   type="date"
// // // // //                   value={joiningDate}
// // // // //                   onChange={(e) => setJoiningDate(e.target.value)}
// // // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
// // // // //                 />
// // // // //               </div>
// // // // //             </div>
// // // // //           </div>

// // // // //           <div className="flex justify-end">
// // // // //             <button
// // // // //               type="submit"
// // // // //               disabled={isSubmitting}
// // // // //               className={`bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200 ${
// // // // //                 isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
// // // // //               }`}
// // // // //             >
// // // // //               {isSubmitting ? 'Processing...' : 'Add Staff'}
// // // // //             </button>
// // // // //           </div>
// // // // //         </form>
// // // // //       </div>
// // // // //     </>
// // // // //   );
// // // // // }


// // // // import React, { useState, useEffect } from "react";
// // // // import { useNavigate } from "react-router-dom";
// // // // import { collection, addDoc, doc, updateDoc, Timestamp } from "firebase/firestore";
// // // // import { db } from "../../../config/firebase";
// // // // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // // // import { faXmark } from '@fortawesome/free-solid-svg-icons';
// // // // import { s3Client } from "../../../config/aws-config";
// // // // import { Upload } from "@aws-sdk/lib-storage";

// // // // export default function AddStaff() {
// // // //   const [isOpen, setIsOpen] = useState(true);
// // // //   const [Name, setName] = useState("");
// // // //   const [email, setEmail] = useState("");
// // // //   const [phone, setPhone] = useState("");
// // // //   const [countryCode, setCountryCode] = useState("+91");
// // // //   const [guardianCountryCode, setGuardianCountryCode] = useState("+91");
// // // //   const [address, setAddress] = useState({ street: "", area: "", city: "", state: "", zip: "", country: "" });
// // // //   const [dateOfBirth, setDateOfBirth] = useState("");
// // // //   const [guardianDetails, setGuardianDetails] = useState({ name: "", phone: "", email: "", relation: "", occupation: "" });
// // // //   const [joiningDate, setJoiningDate] = useState("");
// // // //   const [educationDetails, setEducationDetails] = useState([]);
// // // //   const [experienceDetails, setExperienceDetails] = useState([]);
// // // //   const [emergencyContact, setEmergencyContact] = useState({ name: "", phone: "", countryCode: "+91" });
// // // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // // //   const navigate = useNavigate();

// // // //   // File states for document uploads
// // // //   const [documents, setDocuments] = useState({
// // // //     aadharCard: null,
// // // //     panCard: null,
// // // //     addressProof: null,
// // // //     tenthMarksheet: null,
// // // //     twelfthMarksheet: null,
// // // //     graduationMarksheet: null,
// // // //     pgMarksheet: null,
// // // //     offerLetter1: null,
// // // //     offerLetter2: null,
// // // //     experienceLetter1: null,
// // // //     experienceLetter2: null,
// // // //     salaryProof: null,
// // // //     parentSpouseAadhar: null,
// // // //     passportPhoto: null,
// // // //   });
// // // //   const [uploadProgress, setUploadProgress] = useState({});

// // // //   // Country codes with unique keys
// // // //   const countryCodes = [
// // // //     { key: "usa-+1", code: "+1", label: "USA (+1)" },
// // // //     { key: "canada-+1", code: "+1", label: "Canada (+1)" },
// // // //     { key: "russia-+7", code: "+7", label: "Russia (+7)" },
// // // //     { key: "india-+91", code: "+91", label: "India (+91)" },
// // // //   ];

// // // //   const capitalizeFirstLetter = (str) => {
// // // //     if (!str || typeof str !== "string") return str;
// // // //     return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
// // // //   };

// // // //   useEffect(() => {
// // // //     const today = new Date().toISOString().split("T")[0];
// // // //     setJoiningDate(today);
// // // //   }, []);

// // // //   // Handle file input change
// // // //   const handleFileChange = (e, docType) => {
// // // //     const file = e.target.files[0];
// // // //     if (file) {
// // // //       console.log(`Selected file for ${docType}:`, {
// // // //         name: file.name,
// // // //         size: file.size,
// // // //         type: file.type,
// // // //         instanceofFile: file instanceof File,
// // // //         instanceofBlob: file instanceof Blob,
// // // //       });
// // // //       setDocuments((prev) => ({ ...prev, [docType]: file }));
// // // //       setUploadProgress((prev) => ({ ...prev, [docType]: 0 }));
// // // //     } else {
// // // //       console.warn(`No file selected for ${docType}`);
// // // //     }
// // // //   };

// // // //   // Upload file to S3 with progress tracking
// // // //   const uploadFileToS3 = async (file, docType, staffId) => {
// // // //     const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
// // // //     if (!bucketName) {
// // // //       throw new Error("S3 Bucket name is not defined. Please check your environment variables.");
// // // //     }

// // // //     if (!file || !(file instanceof File)) {
// // // //       throw new Error(`Invalid file for ${docType}: File object is null or not a File instance`);
// // // //     }

// // // //     console.log(`Uploading ${docType}:`, {
// // // //       name: file.name,
// // // //       size: file.size,
// // // //       type: file.type,
// // // //     });

// // // //     const fileName = `${staffId}/${docType}_${Date.now()}_${file.name}`;
// // // //     const params = {
// // // //       Bucket: bucketName,
// // // //       Key: fileName,
// // // //       Body: file,
// // // //       ContentType: file.type,
// // // //     };

// // // //     try {
// // // //       const upload = new Upload({
// // // //         client: s3Client,
// // // //         params,
// // // //         queueSize: 4,
// // // //         partSize: 5 * 1024 * 1024,
// // // //       });

// // // //       upload.on("httpUploadProgress", (progress) => {
// // // //         const percent = Math.round((progress.loaded / progress.total) * 100);
// // // //         setUploadProgress((prev) => ({ ...prev, [docType]: percent }));
// // // //       });

// // // //       await upload.done();

// // // //       const url = `https://${params.Bucket}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${params.Key}`;
// // // //       return url;
// // // //     } catch (err) {
// // // //       console.error(`Error uploading ${docType}:`, err);
// // // //       throw err;
// // // //     }
// // // //   };

// // // //   // Handle form submission
// // // //   const handleAddStaff = async (e) => {
// // // //     e.preventDefault();
// // // //     if (!Name.trim() || !email.trim() || !phone.trim()) {
// // // //       alert("Please fill all required fields.");
// // // //       return;
// // // //     }

// // // //     setIsSubmitting(true);

// // // //     try {
// // // //       // Log documents state
// // // //       console.log("Documents to upload:", Object.keys(documents).filter((key) => documents[key]));

// // // //       // Add staff to Firestore
// // // //       const staffDocRef = await addDoc(collection(db, "Instructor"), {
// // // //         Name: capitalizeFirstLetter(Name),
// // // //         email,
// // // //         phone: `${countryCode}${phone}`,
// // // //         residential_address: address,
// // // //         date_of_birth: dateOfBirth ? Timestamp.fromDate(new Date(dateOfBirth)) : null,
// // // //         guardian_details: {
// // // //           ...guardianDetails,
// // // //           phone: `${guardianCountryCode}${guardianDetails.phone || ""}`,
// // // //         },
// // // //         emergency_contact: {
// // // //           name: emergencyContact.name,
// // // //           phone: `${emergencyContact.countryCode}${emergencyContact.phone || ""}`,
// // // //         },
// // // //         joining_date: Timestamp.fromDate(new Date(joiningDate)),
// // // //         education_details: educationDetails,
// // // //         experience_details: experienceDetails,
// // // //         documents: {},
// // // //       });

// // // //       const staffId = staffDocRef.id;

// // // //       // Upload files to S3
// // // //       const documentUrls = {};
// // // //       for (const [docType, file] of Object.entries(documents)) {
// // // //         if (file) {
// // // //           try {
// // // //             const url = await uploadFileToS3(file, docType, staffId);
// // // //             documentUrls[docType] = url;
// // // //           } catch (uploadErr) {
// // // //             console.error(`Failed to upload ${docType}:`, uploadErr);
// // // //             throw new Error(`Failed to upload ${docType}: ${uploadErr.message}`);
// // // //           }
// // // //         }
// // // //       }

// // // //       // Update Firestore with document URLs
// // // //       await updateDoc(doc(db, "Instructor", staffId), {
// // // //         documents: documentUrls,
// // // //       });

// // // //       alert("Staff added successfully!");
// // // //       navigate("/instructor");
// // // //     } catch (error) {
// // // //       console.error("Error adding staff:", error);
// // // //       alert(`Error adding staff: ${error.message}`);
// // // //     } finally {
// // // //       setIsSubmitting(false);
// // // //     }
// // // //   };

// // // //   const addEducation = () => {
// // // //     setEducationDetails([...educationDetails, { level: '', institute: '', degree: '', specialization: '', grade: '', passingyr: '' }]);
// // // //   };

// // // //   const handleEducationChange = (index, field, value) => {
// // // //     const newEducationDetails = [...educationDetails];
// // // //     newEducationDetails[index][field] = value;
// // // //     setEducationDetails(newEducationDetails);
// // // //   };

// // // //   const deleteEducation = (index) => {
// // // //     setEducationDetails(educationDetails.filter((_, i) => i !== index));
// // // //   };

// // // //   const addExperience = () => {
// // // //     setExperienceDetails([...experienceDetails, { companyName: '', designation: '', salary: '', years: '', description: '' }]);
// // // //   };

// // // //   const handleExperienceChange = (index, field, value) => {
// // // //     const newExperienceDetails = [...experienceDetails];
// // // //     newExperienceDetails[index][field] = value;
// // // //     setExperienceDetails(newExperienceDetails);
// // // //   };

// // // //   const deleteExperience = (index) => {
// // // //     setExperienceDetails(experienceDetails.filter((_, i) => i !== index));
// // // //   };

// // // //   const handleGuardianChange = (field, value) => {
// // // //     setGuardianDetails((prev) => ({ ...prev, [field]: value }));
// // // //   };

// // // //   const handleEmergencyContactChange = (field, value) => {
// // // //     setEmergencyContact((prev) => ({ ...prev, [field]: value }));
// // // //   };

// // // //   const toggleSidebar = () => {
// // // //     setIsOpen(false);
// // // //     navigate("/instructor");
// // // //   };

// // // //   return (
// // // //     <>
// // // //       {isOpen && (
// // // //         <div
// // // //           className="fixed inset-0 bg-black bg-opacity-50 z-40"
// // // //           onClick={toggleSidebar}
// // // //         />
// // // //       )}

// // // //       <div
// // // //         className={`fixed top-0 right-0 h-full bg-white w-full sm:w-2/3 shadow-lg transform transition-transform duration-300 ${
// // // //           isOpen ? "translate-x-0" : "translate-x-full"
// // // //         } p-6 overflow-y-auto z-50`}
// // // //       >
// // // //         <div className="flex justify-between items-center mb-6">
// // // //           <h1 className="text-2xl font-semibold text-gray-800">Add Staff</h1>
// // // //           <button
// // // //             onClick={() => navigate('/instructor')}
// // // //             className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200"
// // // //           >
// // // //             Back
// // // //           </button>
// // // //         </div>

// // // //         <form onSubmit={handleAddStaff} className="space-y-8">
// // // //           {/* Personal Details */}
// // // //           <div>
// // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Personal Details</h2>
// // // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-600">Name</label>
// // // //                 <input
// // // //                   type="text"
// // // //                   value={Name}
// // // //                   onChange={(e) => setName(e.target.value)}
// // // //                   placeholder="Name"
// // // //                   required
// // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                 />
// // // //               </div>
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-600">Email</label>
// // // //                 <input
// // // //                   type="email"
// // // //                   value={email}
// // // //                   onChange={(e) => setEmail(e.target.value)}
// // // //                   placeholder="Email"
// // // //                   required
// // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                 />
// // // //               </div>
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-600">Phone</label>
// // // //                 <div className="flex mt-1">
// // // //                   <select
// // // //                     value={countryCode}
// // // //                     onChange={(e) => setCountryCode(e.target.value)}
// // // //                     className="w-1/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                   >
// // // //                     {countryCodes.map((country) => (
// // // //                       <option key={country.key} value={country.code}>
// // // //                         {country.label}
// // // //                       </option>
// // // //                     ))}
// // // //                   </select>
// // // //                   <input
// // // //                     type="text"
// // // //                     value={phone}
// // // //                     onChange={(e) => setPhone(e.target.value)}
// // // //                     placeholder="Phone Number"
// // // //                     required
// // // //                     className="w-2/3 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                   />
// // // //                 </div>
// // // //               </div>
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
// // // //                 <input
// // // //                   type="date"
// // // //                   value={dateOfBirth}
// // // //                   onChange={(e) => setDateOfBirth(e.target.value)}
// // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                 />
// // // //               </div>
// // // //             </div>
// // // //           </div>

// // // //           {/* Guardian Details */}
// // // //           <div>
// // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Guardian Details</h2>
// // // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-600">Name</label>
// // // //                 <input
// // // //                   type="text"
// // // //                   value={guardianDetails.name}
// // // //                   onChange={(e) => handleGuardianChange('name', e.target.value)}
// // // //                   placeholder="Guardian Name"
// // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                 />
// // // //               </div>
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-600">Phone</label>
// // // //                 <div className="flex mt-1">
// // // //                   <select
// // // //                     value={guardianCountryCode}
// // // //                     onChange={(e) => setGuardianCountryCode(e.target.value)}
// // // //                     className="w-1/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                   >
// // // //                     {countryCodes.map((country) => (
// // // //                       <option key={country.key} value={country.code}>
// // // //                         {country.label}
// // // //                       </option>
// // // //                     ))}
// // // //                   </select>
// // // //                   <input
// // // //                     type="text"
// // // //                     value={guardianDetails.phone}
// // // //                     onChange={(e) => handleGuardianChange('phone', e.target.value)}
// // // //                     placeholder="Guardian Phone"
// // // //                     className="w-2/3 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                   />
// // // //                 </div>
// // // //               </div>
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-600">Email</label>
// // // //                 <input
// // // //                   type="email"
// // // //                   value={guardianDetails.email}
// // // //                   onChange={(e) => handleGuardianChange('email', e.target.value)}
// // // //                   placeholder="Guardian Email"
// // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                 />
// // // //               </div>
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-600">Relation</label>
// // // //                 <input
// // // //                   type="text"
// // // //                   value={guardianDetails.relation}
// // // //                   onChange={(e) => handleGuardianChange('relation', e.target.value)}
// // // //                   placeholder="Relation"
// // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                 />
// // // //               </div>
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-600">Occupation</label>
// // // //                 <input
// // // //                   type="text"
// // // //                   value={guardianDetails.occupation}
// // // //                   onChange={(e) => handleGuardianChange('occupation', e.target.value)}
// // // //                   placeholder="Occupation"
// // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                 />
// // // //               </div>
// // // //             </div>
// // // //           </div>

// // // //           {/* Emergency Contact */}
// // // //           <div>
// // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Emergency Contact</h2>
// // // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-600">Name</label>
// // // //                 <input
// // // //                   type="text"
// // // //                   value={emergencyContact.name}
// // // //                   onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
// // // //                   placeholder="Emergency Contact Name"
// // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                 />
// // // //               </div>
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-600">Phone</label>
// // // //                 <div className="flex mt-1">
// // // //                   <select
// // // //                     value={emergencyContact.countryCode}
// // // //                     onChange={(e) => handleEmergencyContactChange('countryCode', e.target.value)}
// // // //                     className="w-1/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                   >
// // // //                     {countryCodes.map((country) => (
// // // //                       <option key={country.key} value={country.code}>
// // // //                         {country.label}
// // // //                       </option>
// // // //                     ))}
// // // //                   </select>
// // // //                   <input
// // // //                     type="text"
// // // //                     value={emergencyContact.phone}
// // // //                     onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
// // // //                     placeholder="Emergency Contact Phone"
// // // //                     className="w-2/3 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                   />
// // // //                 </div>
// // // //               </div>
// // // //             </div>
// // // //           </div>

// // // //           {/* Address Details */}
// // // //           <div>
// // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Address Details</h2>
// // // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
// // // //               <div>
// // // //                 <h3 className="text-md font-medium text-gray-600 mb-2">Residential Address</h3>
// // // //                 <div className="space-y-3">
// // // //                   <input
// // // //                     type="text"
// // // //                     value={address.street}
// // // //                     onChange={(e) => setAddress({ ...address, street: e.target.value })}
// // // //                     placeholder="Street"
// // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                   />
// // // //                   <input
// // // //                     type="text"
// // // //                     value={address.area}
// // // //                     onChange={(e) => setAddress({ ...address, area: e.target.value })}
// // // //                     placeholder="Area"
// // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                   />
// // // //                   <input
// // // //                     type="text"
// // // //                     value={address.city}
// // // //                     onChange={(e) => setAddress({ ...address, city: e.target.value })}
// // // //                     placeholder="City"
// // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                   />
// // // //                   <input
// // // //                     type="text"
// // // //                     value={address.state}
// // // //                     onChange={(e) => dukeAddress({ ...address, state: e.target.value })}
// // // //                     placeholder="State"
// // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                   />
// // // //                   <input
// // // //                     type="text"
// // // //                     value={address.zip}
// // // //                     onChange={(e) => setAddress({ ...address, zip: e.target.value })}
// // // //                     placeholder="Zip Code"
// // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                   />
// // // //                   <input
// // // //                     type="text"
// // // //                     value={address.country}
// // // //                     onChange={(e) => setAddress({ ...address, country: e.target.value })}
// // // //                     placeholder="Country"
// // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                   />
// // // //                 </div>
// // // //               </div>
// // // //             </div>
// // // //           </div>

// // // //           {/* Document Uploads */}
// // // //           <div>
// // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Document Uploads</h2>
// // // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // // //               {[
// // // //                 { key: 'aadharCard', label: 'Aadhar Card' },
// // // //                 { key: 'panCard', label: 'PAN Card' },
// // // //                 { key: 'addressProof', label: 'Address Proof' },
// // // //                 { key: 'tenthMarksheet', label: '10th Marksheet' },
// // // //                 { key: 'twelfthMarksheet', label: '12th Marksheet' },
// // // //                 { key: 'graduationMarksheet', label: 'Graduation Marksheet' },
// // // //                 { key: 'pgMarksheet', label: 'PG Marksheet' },
// // // //                 { key: 'offerLetter1', label: 'Last Offer Letter 1' },
// // // //                 { key: 'offerLetter2', label: 'Last Offer Letter 2' },
// // // //                 { key: 'experienceLetter1', label: 'Last Experience Letter 1' },
// // // //                 { key: 'experienceLetter2', label: 'Last Experience Letter 2' },
// // // //                 { key: 'salaryProof', label: 'Salary Proof' },
// // // //                 { key: 'parentSpouseAadhar', label: "Parent/Spouse Aadhar Card" },
// // // //                 { key: 'passportPhoto', label: 'Passport Size Photo' },
// // // //               ].map((doc) => (
// // // //                 <div key={doc.key}>
// // // //                   <label className="block text-sm font-medium text-gray-600">{doc.label}</label>
// // // //                   <input
// // // //                     type="file"
// // // //                     onChange={(e) => handleFileChange(e, doc.key)}
// // // //                     accept=".pdf,.jpg,.jpeg,.png"
// // // //                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                   />
// // // //                   {uploadProgress[doc.key] > 0 && (
// // // //                     <div className="mt-2">
// // // //                       <div className="w-full bg-gray-200 rounded-full h-2.5">
// // // //                         <div
// // // //                           className="bg-blue-600 h-2.5 rounded-full"
// // // //                           style={{ width: `${uploadProgress[doc.key]}%` }}
// // // //                         ></div>
// // // //                       </div>
// // // //                       <span className="text-sm text-gray-600">{uploadProgress[doc.key]}%</span>
// // // //                     </div>
// // // //                   )}
// // // //                 </div>
// // // //               ))}
// // // //             </div>
// // // //           </div>

// // // //           {/* Educational Details */}
// // // //           <div>
// // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Educational Details</h2>
// // // //             <div className="overflow-x-auto">
// // // //               <table className="w-full border-collapse">
// // // //                 <thead>
// // // //                   <tr className="bg-gray-100">
// // // //                     <th className="p-3 text-sm font-medium text-gray-600">Level</th>
// // // //                     <th className="p-3 text-sm font-medium text-gray-600">Institute</th>
// // // //                     <th className="p-3 text-sm font-medium text-gray-600">Degree</th>
// // // //                     <th className="p-3 text-sm font-medium text-gray-600">Specialization</th>
// // // //                     <th className="p-3 text-sm font-medium text-gray-600">Grade</th>
// // // //                     <th className="p-3 text-sm font-medium text-gray-600">Passing Year</th>
// // // //                     <th className="p-3 text-sm font-medium text-gray-600">Actions</th>
// // // //                   </tr>
// // // //                 </thead>
// // // //                 <tbody>
// // // //                   {educationDetails.map((edu, index) => (
// // // //                     <tr key={index} className="border-b hover:bg-gray-50">
// // // //                       <td className="p-3">
// // // //                         <select
// // // //                           value={edu.level}
// // // //                           onChange={(e) => handleEducationChange(index, 'level', e.target.value)}
// // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                         >
// // // //                           <option value="" disabled>Select Level</option>
// // // //                           <option value="School">School</option>
// // // //                           <option value="UG">UG</option>
// // // //                           <option value="PG">PG</option>
// // // //                         </select>
// // // //                       </td>
// // // //                       <td className="p-3">
// // // //                         <input
// // // //                           type="text"
// // // //                           value={edu.institute}
// // // //                           onChange={(e) => handleEducationChange(index, 'institute', e.target.value)}
// // // //                           placeholder="Institute Name"
// // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                         />
// // // //                       </td>
// // // //                       <td className="p-3">
// // // //                         <input
// // // //                           type="text"
// // // //                           value={edu.degree}
// // // //                           onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
// // // //                           placeholder="Degree"
// // // //                           required
// // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                         />
// // // //                       </td>
// // // //                       <td className="p-3">
// // // //                         <input
// // // //                           type="text"
// // // //                           value={edu.specialization}
// // // //                           onChange={(e) => handleEducationChange(index, 'specialization', e.target.value)}
// // // //                           placeholder="Specialization"
// // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                         />
// // // //                       </td>
// // // //                       <td className="p-3">
// // // //                         <input
// // // //                           type="number"
// // // //                           value={edu.grade}
// // // //                           onChange={(e) => handleEducationChange(index, 'grade', e.target.value)}
// // // //                           placeholder="Grade"
// // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                         />
// // // //                       </td>
// // // //                       <td className="p-3">
// // // //                         <input
// // // //                           type="number"
// // // //                           value={edu.passingyr}
// // // //                           onChange={(e) => handleEducationChange(index, 'passingyr', e.target.value)}
// // // //                           placeholder="Year"
// // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                         />
// // // //                       </td>
// // // //                       <td className="p-3">
// // // //                         <button
// // // //                           type="button"
// // // //                           onClick={() => deleteEducation(index)}
// // // //                           className="text-red-500 hover:text-red-700"
// // // //                         >
// // // //                           <FontAwesomeIcon icon={faXmark} />
// // // //                         </button>
// // // //                       </td>
// // // //                     </tr>
// // // //                   ))}
// // // //                 </tbody>
// // // //               </table>
// // // //               <button
// // // //                 type="button"
// // // //                 onClick={addEducation}
// // // //                 className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
// // // //               >
// // // //                 Add Education
// // // //               </button>
// // // //             </div>
// // // //           </div>

// // // //           {/* Experience Details */}
// // // //           <div>
// // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Experience Details</h2>
// // // //             <div className="overflow-x-auto">
// // // //               <table className="w-full border-collapse">
// // // //                 <thead>
// // // //                   <tr className="bg-gray-100">
// // // //                     <th className="p-3 text-sm font-medium text-gray-600">Company Name</th>
// // // //                     <th className="p-3 text-sm font-medium text-gray-600">Designation</th>
// // // //                     <th className="p-3 text-sm font-medium text-gray-600">Salary</th>
// // // //                     <th className="p-3 text-sm font-medium text-gray-600">Years</th>
// // // //                     <th className="p-3 text-sm font-medium text-gray-600">Description</th>
// // // //                     <th className="p-3 text-sm font-medium text-gray-600">Actions</th>
// // // //                   </tr>
// // // //                 </thead>
// // // //                 <tbody>
// // // //                   {experienceDetails.map((exp, index) => (
// // // //                     <tr key={index} className="border-b hover:bg-gray-50">
// // // //                       <td className="p-3">
// // // //                         <input
// // // //                           type="text"
// // // //                           value={exp.companyName}
// // // //                           onChange={(e) => handleExperienceChange(index, 'companyName', e.target.value)}
// // // //                           placeholder="Company Name"
// // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                         />
// // // //                       </td>
// // // //                       <td className="p-3">
// // // //                         <input
// // // //                           type="text"
// // // //                           value={exp.designation}
// // // //                           onChange={(e) => handleExperienceChange(index, 'designation', e.target.value)}
// // // //                           placeholder="Designation"
// // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                         />
// // // //                       </td>
// // // //                       <td className="p-3">
// // // //                         <input
// // // //                           type="number"
// // // //                           value={exp.salary}
// // // //                           onChange={(e) => handleExperienceChange(index, 'salary', e.target.value)}
// // // //                           placeholder="Salary"
// // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                         />
// // // //                       </td>
// // // //                       <td className="p-3">
// // // //                         <input
// // // //                           type="number"
// // // //                           value={exp.years}
// // // //                           onChange={(e) => handleExperienceChange(index, 'years', e.target.value)}
// // // //                           placeholder="Years"
// // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                         />
// // // //                       </td>
// // // //                       <td className="p-3">
// // // //                         <input
// // // //                           type="text"
// // // //                           value={exp.description}
// // // //                           onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
// // // //                           placeholder="Description"
// // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                         />
// // // //                       </td>
// // // //                       <td className="p-3">
// // // //                         <button
// // // //                           type="button"
// // // //                           onClick={() => deleteExperience(index)}
// // // //                           className="text-red-500 hover:text-red-700"
// // // //                         >
// // // //                           <FontAwesomeIcon icon={faXmark} />
// // // //                         </button>
// // // //                       </td>
// // // //                     </tr>
// // // //                   ))}
// // // //                 </tbody>
// // // //               </table>
// // // //               <button
// // // //                 type="button"
// // // //                 onClick={addExperience}
// // // //                 className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
// // // //               >
// // // //                 Add Experience
// // // //               </button>
// // // //             </div>
// // // //           </div>

// // // //           {/* Additional Details */}
// // // //           <div>
// // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Additional Details</h2>
// // // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-600">Date of Joining</label>
// // // //                 <input
// // // //                   type="date"
// // // //                   value={joiningDate}
// // // //                   onChange={(e) => setJoiningDate(e.target.value)}
// // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
// // // //                 />
// // // //               </div>
// // // //             </div>
// // // //           </div>

// // // //           <div className="flex justify-end">
// // // //             <button
// // // //               type="submit"
// // // //               disabled={isSubmitting}
// // // //               className={`bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200 ${
// // // //                 isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
// // // //               }`}
// // // //             >
// // // //               {isSubmitting ? 'Processing...' : 'Add Staff'}
// // // //             </button>
// // // //           </div>
// // // //         </form>
// // // //       </div>
// // // //     </>
// // // //   );
// // // // }


// // // // import React, { useState, useEffect } from "react";
// // // // import { useNavigate } from "react-router-dom";
// // // // import { collection, addDoc, doc, updateDoc, Timestamp } from "firebase/firestore";
// // // // import { db } from "../../../config/firebase";
// // // // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // // // import { faXmark } from '@fortawesome/free-solid-svg-icons';
// // // // import { s3Client } from "../../../config/aws-config";
// // // // import { Upload } from "@aws-sdk/lib-storage";

// // // // export default function AddStaff() {
// // // //   const [isOpen, setIsOpen] = useState(true);
// // // //   const [Name, setName] = useState("");
// // // //   const [email, setEmail] = useState("");
// // // //   const [phone, setPhone] = useState("");
// // // //   const [countryCode, setCountryCode] = useState("+91");
// // // //   const [guardianCountryCode, setGuardianCountryCode] = useState("+91");
// // // //   const [address, setAddress] = useState({ street: "", area: "", city: "", state: "", zip: "", country: "" });
// // // //   const [dateOfBirth, setDateOfBirth] = useState("");
// // // //   const [guardianDetails, setGuardianDetails] = useState({ name: "", phone: "", email: "", relation: "", occupation: "" });
// // // //   const [joiningDate, setJoiningDate] = useState("");
// // // //   const [educationDetails, setEducationDetails] = useState([]);
// // // //   const [experienceDetails, setExperienceDetails] = useState([]);
// // // //   const [emergencyContact, setEmergencyContact] = useState({ name: "", phone: "", countryCode: "+91" });
// // // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // // //   const navigate = useNavigate();

// // // //   // File states for document uploads
// // // //   const [documents, setDocuments] = useState({
// // // //     aadharCard: null,
// // // //     panCard: null,
// // // //     addressProof: null,
// // // //     tenthMarksheet: null,
// // // //     twelfthMarksheet: null,
// // // //     graduationMarksheet: null,
// // // //     pgMarksheet: null,
// // // //     offerLetter1: null,
// // // //     offerLetter2: null,
// // // //     experienceLetter1: null,
// // // //     experienceLetter2: null,
// // // //     salaryProof: null,
// // // //     parentSpouseAadhar: null,
// // // //     passportPhoto: null,
// // // //   });
// // // //   const [uploadProgress, setUploadProgress] = useState({});

// // // //   // Country codes with unique keys
// // // //   const countryCodes = [
// // // //     { key: "usa-+1", code: "+1", label: "USA (+1)" },
// // // //     { key: "canada-+1", code: "+1", label: "Canada (+1)" },
// // // //     { key: "russia-+7", code: "+7", label: "Russia (+7)" },
// // // //     { key: "india-+91", code: "+91", label: "India (+91)" },
// // // //   ];

// // // //   const capitalizeFirstLetter = (str) => {
// // // //     if (!str || typeof str !== "string") return str;
// // // //     return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
// // // //   };

// // // //   useEffect(() => {
// // // //     const today = new Date().toISOString().split("T")[0];
// // // //     setJoiningDate(today);
// // // //   }, []);

// // // //   // Handle file input change
// // // //   const handleFileChange = (e, docType) => {
// // // //     const file = e.target.files[0];
// // // //     if (file) {
// // // //       console.log(`Selected file for ${docType}:`, {
// // // //         name: file.name,
// // // //         size: file.size,
// // // //         type: file.type,
// // // //         instanceofFile: file instanceof File,
// // // //         instanceofBlob: file instanceof Blob,
// // // //       });
// // // //       // });
// // // //       setDocuments((prev) => ({ ...prev, [docType]: file }));
// // // //       setUploadProgress((prev) => ({ ...prev, [docType]: 0 }));
// // // //     } else {
// // // //       console.warn(`No file selected for ${docType}`);
// // // //     }
// // // //   };

// // // //   // Upload file to S3 with progress tracking
// // // //   const uploadFileToS3 = async (file, docType, staffId) => {
// // // //     const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
// // // //     if (!bucketName) {
// // // //       throw new Error("S3 Bucket name is not defined. Please check your environment variables.");
// // // //     }

// // // //     if (!file || !(file instanceof File)) {
// // // //       throw new Error(`Invalid file for ${docType}: File object is null or not a File instance`);
// // // //     }

// // // //     console.log(`Uploading ${docType}:`, {
// // // //       name: file.name,
// // // //       size: file.size,
// // // //       type: file.type,
// // // //     });

// // // //     const fileName = `${staffId}/${docType}_${Date.now()}_${file.name}`;
// // // //     const params = {
// // // //       Bucket: bucketName,
// // // //       Key: fileName,
// // // //       Body: file,
// // // //       ContentType: file.type,
// // // //     };

// // // //     try {
// // // //       const upload = new Upload({
// // // //         client: s3Client,
// // // //         params,
// // // //         queueSize: 4,
// // // //         partSize: 5 * 1024 * 1024,
// // // //       });

// // // //       upload.on("httpUploadProgress", (progress) => {
// // // //         const percent = Math.round((progress.loaded / progress.total) * 100);
// // // //         setUploadProgress((prev) => ({ ...prev, [docType]: percent }));
// // // //       });

// // // //       await upload.done();

// // // //       const url = `https://${params.Bucket}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${params.Key}`;
// // // //       return url;
// // // //     } catch (err) {
// // // //       console.error(`Error uploading ${docType}:`, err);
// // // //       throw err;
// // // //     }
// // // //   };

// // // //   // Handle form submission
// // // //   const handleAddStaff = async (e) => {
// // // //     e.preventDefault();
// // // //     if (!Name.trim() || !email.trim() || !phone.trim()) {
// // // //       alert("Please fill all required fields.");
// // // //       return;
// // // //     }

// // // //     setIsSubmitting(true);

// // // //     try {
// // // //       // Log documents state
// // // //       console.log("Documents to upload:", Object.keys(documents).filter((key) => documents[key]));

// // // //       // Add staff to Firestore
// // // //       const staffDocRef = await addDoc(collection(db, "Instructor"), {
// // // //         Name: capitalizeFirstLetter(Name),
// // // //         email,
// // // //         phone: `${countryCode}${phone}`,
// // // //         residential_address: address,
// // // //         date_of_birth: dateOfBirth ? Timestamp.fromDate(new Date(dateOfBirth)) : null,
// // // //         guardian_details: {
// // // //           ...guardianDetails,
// // // //           phone: `${guardianCountryCode}${guardianDetails.phone || ""}`,
// // // //         },
// // // //         emergency_contact: {
// // // //           name: emergencyContact.name,
// // // //           phone: `${emergencyContact.countryCode}${emergencyContact.phone || ""}`,
// // // //         },
// // // //         joining_date: Timestamp.fromDate(new Date(joiningDate)),
// // // //         education_detailssixth_mark_list: educationDetails,
// // // //         experience_details: experienceDetails,
// // // //         staff: {
// // // //           aadharCard: [],
// // // //           panCard: [],
// // // //           addressProof: [],
// // // //           tenthMarksheet: [],
// // // //           twelfthMarksheet: [],
// // // //           graduationMarksheet: [],
// // // //           pgMarksheet: [],
// // // //           offerLetter1: [],
// // // //           offerLetter2: [],
// // // //           experienceLetter1: [],
// // // //           experienceLetter2: [],
// // // //           salaryProof: [],
// // // //           parentSpouseAadhar: [],
// // // //           passportPhoto: [],
// // // //         },
// // // //       });

// // // //       const staffId = staffDocRef.id;

// // // //       // Upload files to S3 and prepare document URLs
// // // //       const documentUpdates = {};
// // // //       for (const [docType, file] of Object.entries(documents)) {
// // // //         if (file) {
// // // //           try {
// // // //             const url = await uploadFileToS3(file, docType, staffId);
// // // //             documentUpdates[`staff.${docType}`] = [url]; // Store as an array
// // // //           } catch (uploadErr) {
// // // //             console.error(`Failed to upload ${docType}:`, uploadErr);
// // // //             throw new Error(`Failed to upload ${docType}: ${uploadErr.message}`);
// // // //           }
// // // //         }
// // // //       }

// // // //       // Update Firestore with document URLs
// // // //       await updateDoc(doc(db, "Instructor", staffId), documentUpdates);

// // // //       alert("Staff added successfully!");
// // // //       navigate("/instructor");
// // // //     } catch (error) {
// // // //       console.error("Error adding staff:", error);
// // // //       alert(`Error adding staff: ${error.message}`);
// // // //     } finally {
// // // //       setIsSubmitting(false);
// // // //     }
// // // //   };

// // // //   const addEducation = () => {
// // // //     setEducationDetails([...educationDetails, { level: '', institute: '', degree: '', specialization: '', grade: '', passingyr: '' }]);
// // // //   };

// // // //   const handleEducationChange = (index, field, value) => {
// // // //     const newEducationDetails = [...educationDetails];
// // // //     newEducationDetails[index][field] = value;
// // // //     setEducationDetails(newEducationDetails);
// // // //   };

// // // //   const deleteEducation = (index) => {
// // // //     setEducationDetails(educationDetails.filter((_, i) => i !== index));
// // // //   };

// // // //   const addExperience = () => {
// // // //     setExperienceDetails([...experienceDetails, { companyName: '', designation: '', salary: '', years: '', description: '' }]);
// // // //   };

// // // //   const handleExperienceChange = (index, field, value) => {
// // // //     const newExperienceDetails = [...experienceDetails];
// // // //     newExperienceDetails[index][field] = value;
// // // //     setExperienceDetails(newExperienceDetails);
// // // //   };

// // // //   const deleteExperience = (index) => {
// // // //     setExperienceDetails(experienceDetails.filter((_, i) => i !== index));
// // // //   };

// // // //   const handleGuardianChange = (field, value) => {
// // // //     setGuardianDetails((prev) => ({ ...prev, [field]: value }));
// // // //   };

// // // //   const handleEmergencyContactChange = (field, value) => {
// // // //     setEmergencyContact((prev) => ({ ...prev, [field]: value }));
// // // //   };

// // // //   const toggleSidebar = () => {
// // // //     setIsOpen(false);
// // // //     navigate("/instructor");
// // // //   };

// // // //   return (
// // // //     <>
// // // //       {isOpen && (
// // // //         <div
// // // //           className="fixed inset-0 bg-black bg-opacity-50 z-40"
// // // //           onClick={toggleSidebar}
// // // //         />
// // // //       )}

// // // //       <div
// // // //         className={`fixed top-0 right-0 h-full bg-white w-full sm:w-2/3 shadow-lg transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
// // // //           } p-6 overflow-y-auto z-50`}
// // // //       >
// // // //         <div className="flex justify-between items-center mb-6">
// // // //           <h1 className="text-2xl font-semibold text-gray-800">Add Staff</h1>
// // // //           <button
// // // //             onClick={() => navigate('/instructor')}
// // // //             className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200"
// // // //           >
// // // //             Back
// // // //           </button>
// // // //         </div>

// // // //         <form onSubmit={handleAddStaff} className="space-y-8">
// // // //           {/* Personal Details */}
// // // //           <div>
// // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Personal Details</h2>
// // // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-600">Name</label>
// // // //                 <input
// // // //                   type="text"
// // // //                   value={Name}
// // // //                   onChange={(e) => setName(e.target.value)}
// // // //                   placeholder="Name"
// // // //                   required
// // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                 />
// // // //               </div>
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-600">Email</label>
// // // //                 <input
// // // //                   type="email"
// // // //                   value={email}
// // // //                   onChange={(e) => setEmail(e.target.value)}
// // // //                   placeholder="Email"
// // // //                   required
// // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                 />
// // // //               </div>
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-600">Phone</label>
// // // //                 <div className="flex mt-1">
// // // //                   <select
// // // //                     value={countryCode}
// // // //                     onChange={(e) => setCountryCode(e.target.value)}
// // // //                     className="w-1/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                   >
// // // //                     {countryCodes.map((country) => (
// // // //                       <option key={country.key} value={country.code}>
// // // //                         {country.label}
// // // //                       </option>
// // // //                     ))}
// // // //                   </select>
// // // //                   <input
// // // //                     type="text"
// // // //                     value={phone}
// // // //                     onChange={(e) => setPhone(e.target.value)}
// // // //                     placeholder="Phone Number"
// // // //                     required
// // // //                     className="w-2/3 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                   />
// // // //                 </div>
// // // //               </div>
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
// // // //                 <input
// // // //                   type="date"
// // // //                   value={dateOfBirth}
// // // //                   onChange={(e) => setDateOfBirth(e.target.value)}
// // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                 />
// // // //               </div>
// // // //             </div>
// // // //           </div>

// // // //           {/* Guardian Details */}
// // // //           <div>
// // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Guardian Details</h2>
// // // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-600">Name</label>
// // // //                 <input
// // // //                   type="text"
// // // //                   value={guardianDetails.name}
// // // //                   onChange={(e) => handleGuardianChange('name', e.target.value)}
// // // //                   placeholder="Guardian Name"
// // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                 />
// // // //               </div>
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-600">Phone</label>
// // // //                 <div className="flex mt-1">
// // // //                   <select
// // // //                     value={guardianCountryCode}
// // // //                     onChange={(e) => setGuardianCountryCode(e.target.value)}
// // // //                     className="w-1/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                   >
// // // //                     {countryCodes.map((country) => (
// // // //                       <option key={country.key} value={country.code}>
// // // //                         {country.label}
// // // //                       </option>
// // // //                     ))}
// // // //                   </select>
// // // //                   <input
// // // //                     type="text"
// // // //                     value={guardianDetails.phone}
// // // //                     onChange={(e) => handleGuardianChange('phone', e.target.value)}
// // // //                     placeholder="Guardian Phone"
// // // //                     className="w-2/3 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                   />
// // // //                 </div>
// // // //               </div>
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-600">Email</label>
// // // //                 <input
// // // //                   type="email"
// // // //                   value={guardianDetails.email}
// // // //                   onChange={(e) => handleGuardianChange('email', e.target.value)}
// // // //                   placeholder="Guardian Email"
// // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                 />
// // // //               </div>
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-600">Relation</label>
// // // //                 <input
// // // //                   type="text"
// // // //                   value={guardianDetails.relation}
// // // //                   onChange={(e) => handleGuardianChange('relation', e.target.value)}
// // // //                   placeholder="Relation"
// // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                 />
// // // //               </div>
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-600">Occupation</label>
// // // //                 <input
// // // //                   type="text"
// // // //                   value={guardianDetails.occupation}
// // // //                   onChange={(e) => handleGuardianChange('occupation', e.target.value)}
// // // //                   placeholder="Occupation"
// // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                 />
// // // //               </div>
// // // //             </div>
// // // //           </div>

// // // //           {/* Emergency Contact */}
// // // //           <div>
// // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Emergency Contact</h2>
// // // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-600">Name</label>
// // // //                 <input
// // // //                   type="text"
// // // //                   value={emergencyContact.name}
// // // //                   onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
// // // //                   placeholder="Emergency Contact Name"
// // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                 />
// // // //               </div>
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-600">Phone</label>
// // // //                 <div className="flex mt-1">
// // // //                   <select
// // // //                     value={emergencyContact.countryCode}
// // // //                     onChange={(e) => handleEmergencyContactChange('countryCode', e.target.value)}
// // // //                     className="w-1/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                   >
// // // //                     {countryCodes.map((country) => (
// // // //                       <option key={country.key} value={country.code}>
// // // //                         {country.label}
// // // //                       </option>
// // // //                     ))}
// // // //                   </select>
// // // //                   <input
// // // //                     type="text"
// // // //                     value={emergencyContact.phone}
// // // //                     onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
// // // //                     placeholder="Emergency Contact Phone"
// // // //                     className="w-2/3 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                   />
// // // //                 </div>
// // // //               </div>
// // // //             </div>
// // // //           </div>

// // // //           {/* Address Details */}
// // // //           <div>
// // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Address Details</h2>
// // // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
// // // //               <div>
// // // //                 <h3 className="text-md font-medium text-gray-600 mb-2">Residential Address</h3>
// // // //                 <div className="space-y-3">
// // // //                   <input
// // // //                     type="text"
// // // //                     value={address.street}
// // // //                     onChange={(e) => setAddress({ ...address, street: e.target.value })}
// // // //                     placeholder="Street"
// // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                   />
// // // //                   <input
// // // //                     type="text"
// // // //                     value={address.area}
// // // //                     onChange={(e) => setAddress({ ...address, area: e.target.value })}
// // // //                     placeholder="Area"
// // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                   />
// // // //                   <input
// // // //                     type="text"
// // // //                     value={address.city}
// // // //                     onChange={(e) => setAddress({ ...address, city: e.target.value })}
// // // //                     placeholder="City"
// // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                   />
// // // //                   <input
// // // //                     type="text"
// // // //                     value={address.state}
// // // //                     onChange={(e) => setAddress({ ...address, state: e.target.value })}
// // // //                     placeholder="State"
// // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                   />
// // // //                   <input
// // // //                     type="text"
// // // //                     value={address.zip}
// // // //                     onChange={(e) => setAddress({ ...address, zip: e.target.value })}
// // // //                     placeholder="Zip Code"
// // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                   />
// // // //                   <input
// // // //                     type="text"
// // // //                     value={address.country}
// // // //                     onChange={(e) => setAddress({ ...address, country: e.target.value })}
// // // //                     placeholder="Country"
// // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                   />
// // // //                 </div>
// // // //               </div>
// // // //             </div>
// // // //           </div>

// // // //           {/* Document Uploads */}
// // // //           <div>
// // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Document Uploads</h2>
// // // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // // //               {[
// // // //                 { key: 'aadharCard', label: 'Aadhar Card' },
// // // //                 { key: 'panCard', label: 'PAN Card' },
// // // //                 { key: 'addressProof', label: 'Address Proof' },
// // // //                 { key: 'tenthMarksheet', label: '10th Marksheet' },
// // // //                 { key: 'twelfthMarksheet', label: '12th Marksheet' },
// // // //                 { key: 'graduationMarksheet', label: 'Graduation Marksheet' },
// // // //                 { key: 'pgMarksheet', label: 'PG Marksheet' },
// // // //                 { key: 'offerLetter1', label: 'Last Offer Letter 1' },
// // // //                 { key: 'offerLetter2', label: 'Last Offer Letter 2' },
// // // //                 { key: 'experienceLetter1', label: 'Last Experience Letter 1' },
// // // //                 { key: 'experienceLetter2', label: 'Last Experience Letter 2' },
// // // //                 { key: 'salaryProof', label: 'Salary Proof' },
// // // //                 { key: 'parentSpouseAadhar', label: "Parent/Spouse Aadhar Card" },
// // // //                 { key: 'passportPhoto', label: 'Passport Size Photo' },
// // // //               ].map((doc) => (
// // // //                 <div key={doc.key}>
// // // //                   <label className="block text-sm font-medium text-gray-600">{doc.label}</label>
// // // //                   <input
// // // //                     type="file"
// // // //                     onChange={(e) => handleFileChange(e, doc.key)}
// // // //                     accept=".pdf,.jpg,.jpeg,.png"
// // // //                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                   />
// // // //                   {uploadProgress[doc.key] > 0 && (
// // // //                     <div className="mt-2">
// // // //                       <div className="w-full bg-gray-200 rounded-full h-2.5">
// // // //                         <div
// // // //                           className="bg-blue-600 h-2.5 rounded-full"
// // // //                           style={{ width: `${uploadProgress[doc.key]}%` }}
// // // //                         ></div>
// // // //                       </div>
// // // //                       <span className="text-sm text-gray-600">{uploadProgress[doc.key]}%</span>
// // // //                     </div>
// // // //                   )}
// // // //                 </div>
// // // //               ))}
// // // //             </div>
// // // //           </div>

// // // //           {/* Educational Details */}
// // // //           <div>
// // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Educational Details</h2>
// // // //             <div className="overflow-x-auto">
// // // //               <table className="w-full border-collapse">
// // // //                 <thead>
// // // //                   <tr className="bg-gray-100">
// // // //                     <th className="p-3 text-sm font-medium text-gray-600">Level</th>
// // // //                     <th className="p-3 text-sm font-medium text-gray-600">Institute</th>
// // // //                     <th className="p-3 text-sm font-medium text-gray-600">Degree</th>
// // // //                     <th className="p-3 text-sm font-medium text-gray-600">Specialization</th>
// // // //                     <th className="p-3 text-sm font-medium text-gray-600">Grade</th>
// // // //                     <th className="p-3 text-sm font-medium text-gray-600">Passing Year</th>
// // // //                     <th className="p-3 text-sm font-medium text-gray-600">Actions</th>
// // // //                   </tr>
// // // //                 </thead>
// // // //                 <tbody>
// // // //                   {educationDetails.map((edu, index) => (
// // // //                     <tr key={index} className="border-b hover:bg-gray-50">
// // // //                       <td className="p-3">
// // // //                         <select
// // // //                           value={edu.level}
// // // //                           onChange={(e) => handleEducationChange(index, 'level', e.target.value)}
// // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                         >
// // // //                           <option value="" disabled>Select Level</option>
// // // //                           <option value="School">School</option>
// // // //                           <option value="UG">UG</option>
// // // //                           <option value="PG">PG</option>
// // // //                         </select>
// // // //                       </td>
// // // //                       <td className="p-3">
// // // //                         <input
// // // //                           type="text"
// // // //                           value={edu.institute}
// // // //                           onChange={(e) => handleEducationChange(index, 'institute', e.target.value)}
// // // //                           placeholder="Institute Name"
// // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                         />
// // // //                       </td>
// // // //                       <td className="p-3">
// // // //                         <input
// // // //                           type="text"
// // // //                           value={edu.degree}
// // // //                           onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
// // // //                           placeholder="Degree"
// // // //                           required
// // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                         />
// // // //                       </td>
// // // //                       <td className="p-3">
// // // //                         <input
// // // //                           type="text"
// // // //                           value={edu.specialization}
// // // //                           onChange={(e) => handleEducationChange(index, 'specialization', e.target.value)}
// // // //                           placeholder="Specialization"
// // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                         />
// // // //                       </td>
// // // //                       <td className="p-3">
// // // //                         <input
// // // //                           type="number"
// // // //                           value={edu.grade}
// // // //                           onChange={(e) => handleEducationChange(index, 'grade', e.target.value)}
// // // //                           placeholder="Grade"
// // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                         />
// // // //                       </td>
// // // //                       <td className="p-3">
// // // //                         <input
// // // //                           type="number"
// // // //                           value={edu.passingyr}
// // // //                           onChange={(e) => handleEducationChange(index, 'passingyr', e.target.value)}
// // // //                           placeholder="Year"
// // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                         />
// // // //                       </td>
// // // //                       <td className="p-3">
// // // //                         <button
// // // //                           type="button"
// // // //                           onClick={() => deleteEducation

// // // //                             (index)}
// // // //                           className="text-red-500 hover:text-red-700"
// // // //                         >
// // // //                           <FontAwesomeIcon icon={faXmark} />
// // // //                         </button>
// // // //                       </td>
// // // //                     </tr>
// // // //                   ))}
// // // //                 </tbody>
// // // //               </table>
// // // //               <button
// // // //                 type="button"
// // // //                 onClick={addEducation}
// // // //                 className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
// // // //               >
// // // //                 Add Education
// // // //               </button>
// // // //             </div>
// // // //           </div>

// // // //           {/* Experience Details */}
// // // //           <div>
// // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Experience Details</h2>
// // // //             <div className="overflow-x-auto">
// // // //               <table className="w-full border-collapse">
// // // //                 <thead>
// // // //                   <tr className="bg-gray-100">
// // // //                     <th className="p-3 text-sm font-medium text-gray-600">Company Name</th>
// // // //                     <th className="p-3 text-sm font-medium text-gray-600">Designation</th>
// // // //                     <th className="p-3 text-sm font-medium text-gray-600">Salary</th>
// // // //                     <th className="p-3 text-sm font-medium text-gray-600">Years</th>
// // // //                     <th className="p-3 text-sm font-medium text-gray-600">Description</th>
// // // //                     <th className="p-3 text-sm font-medium text-gray-600">Actions</th>
// // // //                   </tr>
// // // //                 </thead>
// // // //                 <tbody>
// // // //                   {experienceDetails.map((exp, index) => (
// // // //                     <tr key={index} className="border-b hover:bg-gray-50">
// // // //                       <td className="p-3">
// // // //                         <input
// // // //                           type="text"
// // // //                           value={exp.companyName}
// // // //                           onChange={(e) => handleExperienceChange(index, 'companyName', e.target.value)}
// // // //                           placeholder="Company Name"
// // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                         />
// // // //                       </td>
// // // //                       <td className="p-3">
// // // //                         <input
// // // //                           type="text"
// // // //                           value={exp.designation}
// // // //                           onChange={(e) => handleExperienceChange(index, 'designation', e.target.value)}
// // // //                           placeholder="Designation"
// // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                         />
// // // //                       </td>
// // // //                       <td className="p-3">
// // // //                         <input
// // // //                           type="number"
// // // //                           value={exp.salary}
// // // //                           onChange={(e) => handleExperienceChange(index, 'salary', e.target.value)}
// // // //                           placeholder="Salary"
// // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                         />
// // // //                       </td>
// // // //                       <td className="p-3">
// // // //                         <input
// // // //                           type="number"
// // // //                           value={exp.years}
// // // //                           onChange={(e) => handleExperienceChange(index, 'years', e.target.value)}
// // // //                           placeholder="Years"
// // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                         />
// // // //                       </td>
// // // //                       <td className="p-3">
// // // //                         <input
// // // //                           type="text"
// // // //                           value={exp.description}
// // // //                           onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
// // // //                           placeholder="Description"
// // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                         />
// // // //                       </td>
// // // //                       <td className="p-3">
// // // //                         <button
// // // //                           type="button"
// // // //                           onClick={() => deleteExperience(index)}
// // // //                           className="text-red-500 hover:text-red-700"
// // // //                         >
// // // //                           <FontAwesomeIcon icon={faXmark} />
// // // //                         </button>
// // // //                       </td>
// // // //                     </tr>
// // // //                   ))}
// // // //                 </tbody>
// // // //               </table>
// // // //               <button
// // // //                 type="button"
// // // //                 onClick={addExperience}
// // // //                 className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
// // // //               >
// // // //                 Add Experience
// // // //               </button>
// // // //             </div>
// // // //           </div>

// // // //           {/* Additional Details */}
// // // //           <div>
// // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Additional Details</h2>
// // // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-600">Date of Joining</label>
// // // //                 <input
// // // //                   type="date"
// // // //                   value={joiningDate}
// // // //                   onChange={(e) => setJoiningDate(e.target.value)}
// // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
// // // //                 />
// // // //               </div>
// // // //             </div>
// // // //           </div>

// // // //           <div className="flex justify-end">
// // // //             <button
// // // //               type="submit"
// // // //               disabled={isSubmitting}
// // // //               className={`bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
// // // //                 }`}
// // // //             >
// // // //               {isSubmitting ? 'Processing...' : 'Add Staff'}
// // // //             </button>
// // // //           </div>
// // // //         </form>
// // // //       </div>
// // // //     </>
// // // //   );
// // // // }



// // // // import React, { useState, useEffect } from "react";
// // // // import { useNavigate } from "react-router-dom";
// // // // import { collection, addDoc, doc, updateDoc, Timestamp } from "firebase/firestore";
// // // // import { db } from "../../../config/firebase";
// // // // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // // // import { faXmark } from '@fortawesome/free-solid-svg-icons';
// // // // import { s3Client } from "../../../config/aws-config";
// // // // import { Upload } from "@aws-sdk/lib-storage";
// // // // import { ToastContainer, toast } from "react-toastify";
// // // // import "react-toastify/dist/ReactToastify.css";

// // // // export default function AddStaff() {
// // // //   const [isOpen, setIsOpen] = useState(true);
// // // //   const [Name, setName] = useState("");
// // // //   const [email, setEmail] = useState("");
// // // //   const [phone, setPhone] = useState("");
// // // //   const [countryCode, setCountryCode] = useState("+91");
// // // //   const [guardianCountryCode, setGuardianCountryCode] = useState("+91");
// // // //   const [address, setAddress] = useState({ street: "", area: "", city: "", state: "", zip: "", country: "" });
// // // //   const [dateOfBirth, setDateOfBirth] = useState("");
// // // //   const [guardianDetails, setGuardianDetails] = useState({ name: "", phone: "", email: "", relation: "", occupation: "" });
// // // //   const [joiningDate, setJoiningDate] = useState("");
// // // //   const [educationDetails, setEducationDetails] = useState([]);
// // // //   const [experienceDetails, setExperienceDetails] = useState([]);
// // // //   const [emergencyContact, setEmergencyContact] = useState({ name: "", phone: "", countryCode: "+91" });
// // // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // // //   const navigate = useNavigate();

// // // //   // File states for document uploads
// // // //   const [documents, setDocuments] = useState({
// // // //     aadharCard: null,
// // // //     panCard: null,
// // // //     addressProof: null,
// // // //     tenthMarksheet: null,
// // // //     twelfthMarksheet: null,
// // // //     graduationMarksheet: null,
// // // //     pgMarksheet: null,
// // // //     offerLetter1: null,
// // // //     offerLetter2: null,
// // // //     experienceLetter1: null,
// // // //     experienceLetter2: null,
// // // //     salaryProof: null,
// // // //     parentSpouseAadhar: null,
// // // //     passportPhoto: null,
// // // //   });
// // // //   const [uploadProgress, setUploadProgress] = useState({});

// // // //   // Country codes with unique keys, aligned with EditStaff
// // // //   const countryCodes = [
// // // //     { key: "canada-+1", code: "+1", label: "Canada (+1)" },
// // // //     { key: "russia-+7", code: "+7", label: "Russia (+7)" },
// // // //     { key: "egypt-+20", code: "+20", label: "Egypt (+20)" },
// // // //     { key: "southafrica-+27", code: "+27", label: "South Africa (+27)" },
// // // //     { key: "greece-+30", code: "+30", label: "Greece (+30)" },
// // // //     { key: "netherlands-+31", code: "+31", label: "Netherlands (+31)" },
// // // //     { key: "belgium-+32", code: "+32", label: "Belgium (+32)" },
// // // //     { key: "india-+91", code: "+91", label: "India (+91)" },
// // // //   ];

// // // //   const capitalizeFirstLetter = (str) => {
// // // //     if (!str || typeof str !== "string") return str;
// // // //     return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
// // // //   };

// // // //   useEffect(() => {
// // // //     const today = new Date().toISOString().split("T")[0];
// // // //     setJoiningDate(today);
// // // //   }, []);

// // // //   // Handle file input change
// // // //   const handleFileChange = (e, docType) => {
// // // //     const file = e.target.files[0];
// // // //     if (file) {
// // // //       const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
// // // //       if (!allowedTypes.includes(file.type)) {
// // // //         toast.error(`Invalid file type for ${file.name}. Allowed types: PDF, JPEG, PNG.`);
// // // //         return;
// // // //       }
// // // //       if (file.size > 5 * 1024 * 1024) {
// // // //         toast.error(`File ${file.name} is too large. Maximum size is 5MB.`);
// // // //         return;
// // // //       }
// // // //       console.log(`Selected file for ${docType}:`, {
// // // //         name: file.name,
// // // //         size: file.size,
// // // //         type: file.type,
// // // //         instanceofFile: file instanceof File,
// // // //         instanceofBlob: file instanceof Blob,
// // // //       });
// // // //       setDocuments((prev) => ({ ...prev, [docType]: file }));
// // // //       setUploadProgress((prev) => ({ ...prev, [docType]: 0 }));
// // // //     } else {
// // // //       console.warn(`No file selected for ${docType}`);
// // // //     }
// // // //   };

// // // //   // Upload file to S3 with progress tracking
// // // //   const uploadFileToS3 = async (file, docType, staffId) => {
// // // //     const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
// // // //     const region = import.meta.env.VITE_AWS_REGION;

// // // //     if (!bucketName || !region) {
// // // //       throw new Error("Missing S3 configuration: VITE_S3_BUCKET_NAME or VITE_AWS_REGION");
// // // //     }

// // // //     if (!file || !(file instanceof File)) {
// // // //       throw new Error(`Invalid file for ${docType}: File object is null or not a File instance`);
// // // //     }

// // // //     console.log(`Uploading ${docType}:`, {
// // // //       name: file.name,
// // // //       size: file.size,
// // // //       type: file.type,
// // // //     });

// // // //     const fileName = `staff/${staffId}/${docType}_${Date.now()}_${file.name}`;
// // // //     const params = {
// // // //       Bucket: bucketName,
// // // //       Key: fileName,
// // // //       Body: file,
// // // //       ContentType: file.type,
// // // //     };

// // // //     try {
// // // //       const upload = new Upload({
// // // //         client: s3Client,
// // // //         params,
// // // //         queueSize: 4,
// // // //         partSize: 5 * 1024 * 1024,
// // // //       });

// // // //       upload.on("httpUploadProgress", (progress) => {
// // // //         const percent = Math.round((progress.loaded / progress.total) * 100);
// // // //         setUploadProgress((prev) => ({ ...prev, [docType]: percent }));
// // // //       });

// // // //       await upload.done();

// // // //       const url = `https://${params.Bucket}.s3.${region}.amazonaws.com/${params.Key}`;
// // // //       return url;
// // // //     } catch (err) {
// // // //       console.error(`Error uploading ${docType}:`, err);
// // // //       throw err;
// // // //     }
// // // //   };

// // // //   // Handle form submission
// // // //   const handleAddStaff = async (e) => {
// // // //     e.preventDefault();
// // // //     if (!Name.trim() || !email.trim() || !phone.trim()) {
// // // //       toast.error("Please fill all required fields: Name, Email, Phone Number.");
// // // //       return;
// // // //     }

// // // //     setIsSubmitting(true);

// // // //     try {
// // // //       // Log documents state
// // // //       console.log("Documents to upload:", Object.keys(documents).filter((key) => documents[key]));

// // // //       // Add staff to Firestore
// // // //       const staffDocRef = await addDoc(collection(db, "Instructor"), {
// // // //         Name: capitalizeFirstLetter(Name),
// // // //         email,
// // // //         phone: `${countryCode}${phone}`,
// // // //         residential_address: address,
// // // //         date_of_birth: dateOfBirth ? Timestamp.fromDate(new Date(dateOfBirth)) : null,
// // // //         guardian_details: {
// // // //           ...guardianDetails,
// // // //           phone: guardianDetails.phone ? `${guardianCountryCode}${guardianDetails.phone}` : "",
// // // //         },
// // // //         emergency_contact: {
// // // //           name: emergencyContact.name,
// // // //           phone: emergencyContact.phone ? `${emergencyContact.countryCode}${emergencyContact.phone}` : "",
// // // //         },
// // // //         joining_date: Timestamp.fromDate(new Date(joiningDate)),
// // // //         education_details: educationDetails,
// // // //         experience_details: experienceDetails,
// // // //         staff: {
// // // //           aadharCard: [],
// // // //           panCard: [],
// // // //           addressProof: [],
// // // //           tenthMarksheet: [],
// // // //           twelfthMarksheet: [],
// // // //           graduationMarksheet: [],
// // // //           pgMarksheet: [],
// // // //           offerLetter1: [],
// // // //           offerLetter2: [],
// // // //           experienceLetter1: [],
// // // //           experienceLetter2: [],
// // // //           salaryProof: [],
// // // //           parentSpouseAadhar: [],
// // // //           passportPhoto: [],
// // // //         },
// // // //       });

// // // //       const staffId = staffDocRef.id;

// // // //       // Upload files to S3 and prepare document URLs
// // // //       const documentUpdates = {};
// // // //       for (const [docType, file] of Object.entries(documents)) {
// // // //         if (file) {
// // // //           try {
// // // //             const url = await uploadFileToS3(file, docType, staffId);
// // // //             documentUpdates[`staff.${docType}`] = [url]; // Store as an array
// // // //           } catch (uploadErr) {
// // // //             console.error(`Failed to upload ${docType}:`, uploadErr);
// // // //             throw new Error(`Failed to upload ${docType}: ${uploadErr.message}`);
// // // //           }
// // // //         }
// // // //       }

// // // //       // Update Firestore with document URLs
// // // //       if (Object.keys(documentUpdates).length > 0) {
// // // //         await updateDoc(doc(db, "Instructor", staffId), documentUpdates);
// // // //       }

// // // //       toast.success("Staff added successfully!");
// // // //       navigate("/instructor");
// // // //     } catch (error) {
// // // //       console.error("Error adding staff:", error);
// // // //       toast.error(`Error adding staff: ${error.message}`);
// // // //     } finally {
// // // //       setIsSubmitting(false);
// // // //     }
// // // //   };

// // // //   const addEducation = () => {
// // // //     setEducationDetails([...educationDetails, { level: '', institute: '', degree: '', specialization: '', grade: '', passingyr: '' }]);
// // // //   };

// // // //   const handleEducationChange = (index, field, value) => {
// // // //     const newEducationDetails = [...educationDetails];
// // // //     newEducationDetails[index][field] = value;
// // // //     setEducationDetails(newEducationDetails);
// // // //   };

// // // //   const deleteEducation = (index) => {
// // // //     setEducationDetails(educationDetails.filter((_, i) => i !== index));
// // // //   };

// // // //   const addExperience = () => {
// // // //     setExperienceDetails([...experienceDetails, { companyName: '', designation: '', salary: '', years: '', description: '' }]);
// // // //   };

// // // //   const handleExperienceChange = (index, field, value) => {
// // // //     const newExperienceDetails = [...experienceDetails];
// // // //     newExperienceDetails[index][field] = value;
// // // //     setExperienceDetails(newExperienceDetails);
// // // //   };

// // // //   const deleteExperience = (index) => {
// // // //     setExperienceDetails(experienceDetails.filter((_, i) => i !== index));
// // // //   };

// // // //   const handleGuardianChange = (field, value) => {
// // // //     setGuardianDetails((prev) => ({ ...prev, [field]: value }));
// // // //   };

// // // //   const handleEmergencyContactChange = (field, value) => {
// // // //     setEmergencyContact((prev) => ({ ...prev, [field]: value }));
// // // //   };

// // // //   const toggleSidebar = () => {
// // // //     setIsOpen(false);
// // // //     setTimeout(() => navigate("/instructor"), 300);
// // // //   };

// // // //   return (
// // // //     <>
// // // //       <ToastContainer position="top-right" autoClose={3000} />
// // // //       <div
// // // //         className="fixed inset-0 bg-black bg-opacity-50 z-40"
// // // //         onClick={toggleSidebar}
// // // //       />
// // // //       <div
// // // //         className={`fixed top-0 right-0 h-full bg-white w-full sm:w-3/4 shadow-lg transform transition-transform duration-300 ${
// // // //           isOpen ? "translate-x-0" : "translate-x-full"
// // // //         } p-6 overflow-y-auto z-50`}
// // // //       >
// // // //         <div className="flex justify-between items-center mb-6">
// // // //           <h1 className="text-2xl font-semibold text-gray-800">Add Staff</h1>
// // // //           <button
// // // //             onClick={toggleSidebar}
// // // //             className="text-gray-500 hover:text-gray-700 transition duration-200"
// // // //           >
// // // //             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // // //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
// // // //             </svg>
// // // //           </button>
// // // //         </div>

// // // //         <form onSubmit={handleAddStaff} className="space-y-8">
// // // //           {/* Personal Details */}
// // // //           <div>
// // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Personal Details</h2>
// // // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-600">Name</label>
// // // //                 <input
// // // //                   type="text"
// // // //                   value={Name}
// // // //                   onChange={(e) => setName(e.target.value)}
// // // //                   placeholder="Name"
// // // //                   required
// // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                 />
// // // //               </div>
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-600">Email</label>
// // // //                 <input
// // // //                   type="email"
// // // //                   value={email}
// // // //                   onChange={(e) => setEmail(e.target.value)}
// // // //                   placeholder="Email"
// // // //                   required
// // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                 />
// // // //               </div>
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-600">Phone</label>
// // // //                 <div className="flex mt-1">
// // // //                   <select
// // // //                     value={countryCode}
// // // //                     onChange={(e) => setCountryCode(e.target.value)}
// // // //                     className="w-1/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                   >
// // // //                     {countryCodes.map((country) => (
// // // //                       <option key={country.key} value={country.code}>
// // // //                         {country.label}
// // // //                       </option>
// // // //                     ))}
// // // //                   </select>
// // // //                   <input
// // // //                     type="text"
// // // //                     value={phone}
// // // //                     onChange={(e) => setPhone(e.target.value)}
// // // //                     placeholder="Phone Number"
// // // //                     required
// // // //                     className="w-2/3 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                   />
// // // //                 </div>
// // // //               </div>
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
// // // //                 <input
// // // //                   type="date"
// // // //                   value={dateOfBirth}
// // // //                   onChange={(e) => setDateOfBirth(e.target.value)}
// // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                 />
// // // //               </div>
// // // //             </div>
// // // //           </div>

// // // //           {/* Guardian Details */}
// // // //           <div>
// // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Guardian Details</h2>
// // // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-600">Name</label>
// // // //                 <input
// // // //                   type="text"
// // // //                   value={guardianDetails.name}
// // // //                   onChange={(e) => handleGuardianChange('name', e.target.value)}
// // // //                   placeholder="Guardian Name"
// // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                 />
// // // //               </div>
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-600">Phone</label>
// // // //                 <div className="flex mt-1">
// // // //                   <select
// // // //                     value={guardianCountryCode}
// // // //                     onChange={(e) => setGuardianCountryCode(e.target.value)}
// // // //                     className="w-1/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                   >
// // // //                     {countryCodes.map((country) => (
// // // //                       <option key={country.key} value={country.code}>
// // // //                         {country.label}
// // // //                       </option>
// // // //                     ))}
// // // //                   </select>
// // // //                   <input
// // // //                     type="text"
// // // //                     value={guardianDetails.phone}
// // // //                     onChange={(e) => handleGuardianChange('phone', e.target.value)}
// // // //                     placeholder="Guardian Phone"
// // // //                     className="w-2/3 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                   />
// // // //                 </div>
// // // //               </div>
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-600">Email</label>
// // // //                 <input
// // // //                   type="email"
// // // //                   value={guardianDetails.email}
// // // //                   onChange={(e) => handleGuardianChange('email', e.target.value)}
// // // //                   placeholder="Guardian Email"
// // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                 />
// // // //               </div>
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-600">Relation</label>
// // // //                 <input
// // // //                   type="text"
// // // //                   value={guardianDetails.relation}
// // // //                   onChange={(e) => handleGuardianChange('relation', e.target.value)}
// // // //                   placeholder="Relation"
// // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                 />
// // // //               </div>
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-600">Occupation</label>
// // // //                 <input
// // // //                   type="text"
// // // //                   value={guardianDetails.occupation}
// // // //                   onChange={(e) => handleGuardianChange('occupation', e.target.value)}
// // // //                   placeholder="Occupation"
// // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                 />
// // // //               </div>
// // // //             </div>
// // // //           </div>

// // // //           {/* Emergency Contact */}
// // // //           <div>
// // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Emergency Contact</h2>
// // // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-600">Name</label>
// // // //                 <input
// // // //                   type="text"
// // // //                   value={emergencyContact.name}
// // // //                   onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
// // // //                   placeholder="Emergency Contact Name"
// // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                 />
// // // //               </div>
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-600">Phone</label>
// // // //                 <div className="flex mt-1">
// // // //                   <select
// // // //                     value={emergencyContact.countryCode}
// // // //                     onChange={(e) => handleEmergencyContactChange('countryCode', e.target.value)}
// // // //                     className="w-1/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                   >
// // // //                     {countryCodes.map((country) => (
// // // //                       <option key={country.key} value={country.code}>
// // // //                         {country.label}
// // // //                       </option>
// // // //                     ))}
// // // //                   </select>
// // // //                   <input
// // // //                     type="text"
// // // //                     value={emergencyContact.phone}
// // // //                     onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
// // // //                     placeholder="Emergency Contact Phone"
// // // //                     className="w-2/3 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                   />
// // // //                 </div>
// // // //               </div>
// // // //             </div>
// // // //           </div>

// // // //           {/* Address Details */}
// // // //           <div>
// // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Address Details</h2>
// // // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
// // // //               <div>
// // // //                 <h3 className="text-md font-medium text-gray-600 mb-2">Residential Address</h3>
// // // //                 <div className="space-y-3">
// // // //                   <input
// // // //                     type="text"
// // // //                     value={address.street}
// // // //                     onChange={(e) => setAddress({ ...address, street: e.target.value })}
// // // //                     placeholder="Street"
// // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                   />
// // // //                   <input
// // // //                     type="text"
// // // //                     value={address.area}
// // // //                     onChange={(e) => setAddress({ ...address, area: e.target.value })}
// // // //                     placeholder="Area"
// // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                   />
// // // //                   <input
// // // //                     type="text"
// // // //                     value={address.city}
// // // //                     onChange={(e) => setAddress({ ...address, city: e.target.value })}
// // // //                     placeholder="City"
// // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                   />
// // // //                   <input
// // // //                     type="text"
// // // //                     value={address.state}
// // // //                     onChange={(e) => setAddress({ ...address, state: e.target.value })}
// // // //                     placeholder="State"
// // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                   />
// // // //                   <input
// // // //                     type="text"
// // // //                     value={address.zip}
// // // //                     onChange={(e) => setAddress({ ...address, zip: e.target.value })}
// // // //                     placeholder="Zip Code"
// // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                   />
// // // //                   <input
// // // //                     type="text"
// // // //                     value={address.country}
// // // //                     onChange={(e) => setAddress({ ...address, country: e.target.value })}
// // // //                     placeholder="Country"
// // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                   />
// // // //                 </div>
// // // //               </div>
// // // //             </div>
// // // //           </div>

// // // //           {/* Document Uploads */}
// // // //           <div>
// // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Document Uploads</h2>
// // // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // // //               {[
// // // //                 { key: 'aadharCard', label: 'Aadhar Card' },
// // // //                 { key: 'panCard', label: 'PAN Card' },
// // // //                 { key: 'addressProof', label: 'Address Proof' },
// // // //                 { key: 'tenthMarksheet', label: '10th Marksheet' },
// // // //                 { key: 'twelfthMarksheet', label: '12th Marksheet' },
// // // //                 { key: 'graduationMarksheet', label: 'Graduation Marksheet' },
// // // //                 { key: 'pgMarksheet', label: 'PG Marksheet' },
// // // //                 { key: 'offerLetter1', label: 'Last Offer Letter 1' },
// // // //                 { key: 'offerLetter2', label: 'Last Offer Letter 2' },
// // // //                 { key: 'experienceLetter1', label: 'Last Experience Letter 1' },
// // // //                 { key: 'experienceLetter2', label: 'Last Experience Letter 2' },
// // // //                 { key: 'salaryProof', label: 'Salary Proof' },
// // // //                 { key: 'parentSpouseAadhar', label: "Parent/Spouse Aadhar Card" },
// // // //                 { key: 'passportPhoto', label: 'Passport Size Photo' },
// // // //               ].map((doc) => (
// // // //                 <div key={doc.key}>
// // // //                   <label className="block text-sm font-medium text-gray-600">{doc.label}</label>
// // // //                   <input
// // // //                     type="file"
// // // //                     onChange={(e) => handleFileChange(e, doc.key)}
// // // //                     accept=".pdf,.jpg,.jpeg,.png"
// // // //                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                   />
// // // //                   {documents[doc.key] && (
// // // //                     <span className="text-sm text-gray-600">{documents[doc.key].name}</span>
// // // //                   )}
// // // //                   {uploadProgress[doc.key] > 0 && (
// // // //                     <div className="mt-2">
// // // //                       <div className="w-full bg-gray-200 rounded-full h-2.5">
// // // //                         <div
// // // //                           className="bg-blue-600 h-2.5 rounded-full"
// // // //                           style={{ width: `${uploadProgress[doc.key]}%` }}
// // // //                         ></div>
// // // //                       </div>
// // // //                       <span className="text-sm text-gray-600">{uploadProgress[doc.key]}%</span>
// // // //                     </div>
// // // //                   )}
// // // //                 </div>
// // // //               ))}
// // // //             </div>
// // // //           </div>

// // // //           {/* Educational Details */}
// // // //           <div>
// // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Educational Details</h2>
// // // //             <div className="overflow-x-auto">
// // // //               <table className="w-full border-collapse">
// // // //                 <thead>
// // // //                   <tr className="bg-gray-100">
// // // //                     <th className="p-3 text-sm font-medium text-gray-600">Level</th>
// // // //                     <th className="p-3 text-sm font-medium text-gray-600">Institute</th>
// // // //                     <th className="p-3 text-sm font-medium text-gray-600">Degree</th>
// // // //                     <th className="p-3 text-sm font-medium text-gray-600">Specialization</th>
// // // //                     <th className="p-3 text-sm font-medium text-gray-600">Grade</th>
// // // //                     <th className="p-3 text-sm font-medium text-gray-600">Passing Year</th>
// // // //                     <th className="p-3 text-sm font-medium text-gray-600">Actions</th>
// // // //                   </tr>
// // // //                 </thead>
// // // //                 <tbody>
// // // //                   {educationDetails.map((edu, index) => (
// // // //                     <tr key={index} className="border-b hover:bg-gray-50">
// // // //                       <td className="p-3">
// // // //                         <select
// // // //                           value={edu.level}
// // // //                           onChange={(e) => handleEducationChange(index, 'level', e.target.value)}
// // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                         >
// // // //                           <option value="" disabled>Select Level</option>
// // // //                           <option value="School">School</option>
// // // //                           <option value="UG">UG</option>
// // // //                           <option value="PG">PG</option>
// // // //                         </select>
// // // //                       </td>
// // // //                       <td className="p-3">
// // // //                         <input
// // // //                           type="text"
// // // //                           value={edu.institute}
// // // //                           onChange={(e) => handleEducationChange(index, 'institute', e.target.value)}
// // // //                           placeholder="Institute Name"
// // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                         />
// // // //                       </td>
// // // //                       <td className="p-3">
// // // //                         <input
// // // //                           type="text"
// // // //                           value={edu.degree}
// // // //                           onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
// // // //                           placeholder="Degree"
// // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                         />
// // // //                       </td>
// // // //                       <td className="p-3">
// // // //                         <input
// // // //                           type="text"
// // // //                           value={edu.specialization}
// // // //                           onChange={(e) => handleEducationChange(index, 'specialization', e.target.value)}
// // // //                           placeholder="Specialization"
// // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                         />
// // // //                       </td>
// // // //                       <td className="p-3">
// // // //                         <input
// // // //                           type="text"
// // // //                           value={edu.grade}
// // // //                           onChange={(e) => handleEducationChange(index, 'grade', e.target.value)}
// // // //                           placeholder="Grade"
// // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                         />
// // // //                       </td>
// // // //                       <td className="p-3">
// // // //                         <input
// // // //                           type="number"
// // // //                           value={edu.passingyr}
// // // //                           onChange={(e) => handleEducationChange(index, 'passingyr', e.target.value)}
// // // //                           placeholder="Year"
// // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                         />
// // // //                       </td>
// // // //                       <td className="p-3">
// // // //                         <button
// // // //                           type="button"
// // // //                           onClick={() => deleteEducation(index)}
// // // //                           className="text-red-500 hover:text-red-700"
// // // //                         >
// // // //                           <FontAwesomeIcon icon={faXmark} />
// // // //                         </button>
// // // //                       </td>
// // // //                     </tr>
// // // //                   ))}
// // // //                 </tbody>
// // // //               </table>
// // // //               <button
// // // //                 type="button"
// // // //                 onClick={addEducation}
// // // //                 className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
// // // //               >
// // // //                 Add Education
// // // //               </button>
// // // //             </div>
// // // //           </div>

// // // //           {/* Experience Details */}
// // // //           <div>
// // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Experience Details</h2>
// // // //             <div className="overflow-x-auto">
// // // //               <table className="w-full border-collapse">
// // // //                 <thead>
// // // //                   <tr className="bg-gray-100">
// // // //                     <th className="p-3 text-sm font-medium text-gray-600">Company Name</th>
// // // //                     <th className="p-3 text-sm font-medium text-gray-600">Designation</th>
// // // //                     <th className="p-3 text-sm font-medium text-gray-600">Salary</th>
// // // //                     <th className="p-3 text-sm font-medium text-gray-600">Years</th>
// // // //                     <th className="p-3 text-sm font-medium text-gray-600">Description</th>
// // // //                     <th className="p-3 text-sm font-medium text-gray-600">Actions</th>
// // // //                   </tr>
// // // //                 </thead>
// // // //                 <tbody>
// // // //                   {experienceDetails.map((exp, index) => (
// // // //                     <tr key={index} className="border-b hover:bg-gray-50">
// // // //                       <td className="p-3">
// // // //                         <input
// // // //                           type="text"
// // // //                           value={exp.companyName}
// // // //                           onChange={(e) => handleExperienceChange(index, 'companyName', e.target.value)}
// // // //                           placeholder="Company Name"
// // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                         />
// // // //                       </td>
// // // //                       <td className="p-3">
// // // //                         <input
// // // //                           type="text"
// // // //                           value={exp.designation}
// // // //                           onChange={(e) => handleExperienceChange(index, 'designation', e.target.value)}
// // // //                           placeholder="Designation"
// // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                         />
// // // //                       </td>
// // // //                       <td className="p-3">
// // // //                         <input
// // // //                           type="text"
// // // //                           value={exp.salary}
// // // //                           onChange={(e) => handleExperienceChange(index, 'salary', e.target.value)}
// // // //                           placeholder="Salary"
// // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                         />
// // // //                       </td>
// // // //                       <td className="p-3">
// // // //                         <input
// // // //                           type="number"
// // // //                           value={exp.years}
// // // //                           onChange={(e) => handleExperienceChange(index, 'years', e.target.value)}
// // // //                           placeholder="Years"
// // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                         />
// // // //                       </td>
// // // //                       <td className="p-3">
// // // //                         <input
// // // //                           type="text"
// // // //                           value={exp.description}
// // // //                           onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
// // // //                           placeholder="Description"
// // // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                         />
// // // //                       </td>
// // // //                       <td className="p-3">
// // // //                         <button
// // // //                           type="button"
// // // //                           onClick={() => deleteExperience(index)}
// // // //                           className="text-red-500 hover:text-red-700"
// // // //                         >
// // // //                           <FontAwesomeIcon icon={faXmark} />
// // // //                         </button>
// // // //                       </td>
// // // //                     </tr>
// // // //                   ))}
// // // //                 </tbody>
// // // //               </table>
// // // //               <button
// // // //                 type="button"
// // // //                 onClick={addExperience}
// // // //                 className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
// // // //               >
// // // //                 Add Experience
// // // //               </button>
// // // //             </div>
// // // //           </div>

// // // //           {/* Additional Details */}
// // // //           <div>
// // // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Additional Details</h2>
// // // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-600">Date of Joining</label>
// // // //                 <input
// // // //                   type="date"
// // // //                   value={joiningDate}
// // // //                   onChange={(e) => setJoiningDate(e.target.value)}
// // // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                 />
// // // //               </div>
// // // //             </div>
// // // //           </div>

// // // //           <div className="flex justify-end space-x-4">
// // // //             <button
// // // //               type="button"
// // // //               onClick={toggleSidebar}
// // // //               className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition duration-200"
// // // //             >
// // // //               Cancel
// // // //             </button>
// // // //             <button
// // // //               type="submit"
// // // //               disabled={isSubmitting}
// // // //               className={`px-6 py-2 rounded-md text-white ${
// // // //                 isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
// // // //               } transition duration-200`}
// // // //             >
// // // //               {isSubmitting ? 'Processing...' : 'Add Staff'}
// // // //             </button>
// // // //           </div>
// // // //         </form>
// // // //       </div>
// // // //     </>
// // // //   );
// // // // }


// // // import React, { useState, useEffect, useRef } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import { collection, addDoc, doc, updateDoc, Timestamp } from "firebase/firestore";
// // // import { db } from "../../../config/firebase";
// // // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // // import { faXmark } from '@fortawesome/free-solid-svg-icons';
// // // import { s3Client } from "../../../config/aws-config";
// // // import { Upload } from "@aws-sdk/lib-storage";
// // // import { ToastContainer, toast } from "react-toastify";
// // // import "react-toastify/dist/ReactToastify.css";

// // // export default function AddStaff() {
// // //   const [isOpen, setIsOpen] = useState(true);
// // //   const [Name, setName] = useState("");
// // //   const [email, setEmail] = useState("");
// // //   const [phone, setPhone] = useState("");
// // //   const [countryCode, setCountryCode] = useState("+91");
// // //   const [guardianCountryCode, setGuardianCountryCode] = useState("+91");
// // //   const [address, setAddress] = useState({ street: "", area: "", city: "", state: "", zip: "", country: "" });
// // //   const [dateOfBirth, setDateOfBirth] = useState("");
// // //   const [guardianDetails, setGuardianDetails] = useState({ name: "", phone: "", email: "", relation: "", occupation: "" });
// // //   const [joiningDate, setJoiningDate] = useState("");
// // //   const [educationDetails, setEducationDetails] = useState([]);
// // //   const [experienceDetails, setExperienceDetails] = useState([]);
// // //   const [emergencyContact, setEmergencyContact] = useState({ name: "", phone: "", countryCode: "+91" });
// // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // //   const navigate = useNavigate();
// // //   const submissionRef = useRef(false); // Prevent duplicate submissions

// // //   // File states for document uploads
// // //   const [documents, setDocuments] = useState({
// // //     aadharCard: null,
// // //     panCard: null,
// // //     addressProof: null,
// // //     tenthMarksheet: null,
// // //     twelfthMarksheet: null,
// // //     graduationMarksheet: null,
// // //     pgMarksheet: null,
// // //     offerLetter1: null,
// // //     offerLetter2: null,
// // //     experienceLetter1: null,
// // //     experienceLetter2: null,
// // //     salaryProof: null,
// // //     parentSpouseAadhar: null,
// // //     passportPhoto: null,
// // //   });
// // //   const [uploadProgress, setUploadProgress] = useState({});

// // //   // Country codes with unique keys, aligned with EditStaff
// // //   const countryCodes = [
// // //     { key: "canada-+1", code: "+1", label: "Canada (+1)" },
// // //     { key: "russia-+7", code: "+7", label: "Russia (+7)" },
// // //     { key: "egypt-+20", code: "+20", label: "Egypt (+20)" },
// // //     { key: "southafrica-+27", code: "+27", label: "South Africa (+27)" },
// // //     { key: "greece-+30", code: "+30", label: "Greece (+30)" },
// // //     { key: "netherlands-+31", code: "+31", label: "Netherlands (+31)" },
// // //     { key: "belgium-+32", code: "+32", label: "Belgium (+32)" },
// // //     { key: "india-+91", code: "+91", label: "India (+91)" },
// // //   ];

// // //   const capitalizeFirstLetter = (str) => {
// // //     if (!str || typeof str !== "string") return str;
// // //     return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
// // //   };

// // //   useEffect(() => {
// // //     const today = new Date().toISOString().split("T")[0];
// // //     setJoiningDate(today);
// // //   }, []);

// // //   // Handle file input change
// // //   const handleFileChange = (e, docType) => {
// // //     const file = e.target.files[0];
// // //     if (file) {
// // //       const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
// // //       if (!allowedTypes.includes(file.type)) {
// // //         toast.error(`Invalid file type for ${file.name}. Allowed types: PDF, JPEG, PNG.`);
// // //         return;
// // //       }
// // //       if (file.size > 5 * 1024 * 1024) {
// // //         toast.error(`File ${file.name} is too large. Maximum size is 5MB.`);
// // //         return;
// // //       }
// // //       console.log(`Selected file for ${docType}:`, {
// // //         name: file.name,
// // //         size: file.size,
// // //         type: file.type,
// // //         instanceofFile: file instanceof File,
// // //         instanceofBlob: file instanceof Blob,
// // //       });
// // //       setDocuments((prev) => ({ ...prev, [docType]: file }));
// // //       setUploadProgress((prev) => ({ ...prev, [docType]: 0 }));
// // //     } else {
// // //       console.warn(`No file selected for ${docType}`);
// // //     }
// // //   };

// // //   // Upload file to S3 with progress tracking
// // //   const uploadFileToS3 = async (file, docType, staffId) => {
// // //     const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
// // //     const region = import.meta.env.VITE_AWS_REGION;

// // //     if (!bucketName || !region) {
// // //       throw new Error("Missing S3 configuration: VITE_S3_BUCKET_NAME or VITE_AWS_REGION");
// // //     }

// // //     if (!file || !(file instanceof File)) {
// // //       throw new Error(`Invalid file for ${docType}: File object is null or not a File instance`);
// // //     }

// // //     console.log(`Uploading ${docType}:`, {
// // //       name: file.name,
// // //       size: file.size,
// // //       type: file.type,
// // //     });

// // //     const fileName = `staff/${staffId}/${docType}_${Date.now()}_${file.name}`;
// // //     const params = {
// // //       Bucket: bucketName,
// // //       Key: fileName,
// // //       Body: file,
// // //       ContentType: file.type,
// // //     };

// // //     try {
// // //       const upload = new Upload({
// // //         client: s3Client,
// // //         params,
// // //         queueSize: 4,
// // //         partSize: 5 * 1024 * 1024,
// // //       });

// // //       upload.on("httpUploadProgress", (progress) => {
// // //         const percent = Math.round((progress.loaded / progress.total) * 100);
// // //         setUploadProgress((prev) => ({ ...prev, [docType]: percent }));
// // //       });

// // //       await upload.done();

// // //       const url = `https://${params.Bucket}.s3.${region}.amazonaws.com/${params.Key}`;
// // //       return url;
// // //     } catch (err) {
// // //       console.error(`Error uploading ${docType}:`, err);
// // //       throw err;
// // //     }
// // //   };

// // //   // Handle form submission
// // //   const handleAddStaff = async (e) => {
// // //     e.preventDefault();
// // //     if (submissionRef.current) {
// // //       console.warn("Submission already in progress, ignoring duplicate.");
// // //       return;
// // //     }
// // //     if (!Name.trim() || !email.trim() || !phone.trim()) {
// // //       toast.error("Please fill all required fields: Name, Email, Phone Number.");
// // //       return;
// // //     }

// // //     submissionRef.current = true;
// // //     setIsSubmitting(true);

// // //     try {
// // //       console.log("Starting staff submission:", { Name, email, phone });
// // //       const staffDocRef = await addDoc(collection(db, "Instructor"), {
// // //         Name: capitalizeFirstLetter(Name),
// // //         email,
// // //         phone: `${countryCode}${phone}`,
// // //         residential_address: address,
// // //         date_of_birth: dateOfBirth ? Timestamp.fromDate(new Date(dateOfBirth)) : null,
// // //         guardian_details: {
// // //           ...guardianDetails,
// // //           phone: guardianDetails.phone ? `${guardianCountryCode}${guardianDetails.phone}` : "",
// // //         },
// // //         emergency_contact: {
// // //           name: emergencyContact.name,
// // //           phone: emergencyContact.phone ? `${emergencyContact.countryCode}${emergencyContact.phone}` : "",
// // //         },
// // //         joining_date: Timestamp.fromDate(new Date(joiningDate)),
// // //         created_at: Timestamp.now(), // Add creation timestamp
// // //         education_details: educationDetails,
// // //         experience_details: experienceDetails,
// // //         staff: {
// // //           aadharCard: [],
// // //           panCard: [],
// // //           addressProof: [],
// // //           tenthMarksheet: [],
// // //           twelfthMarksheet: [],
// // //           graduationMarksheet: [],
// // //           pgMarksheet: [],
// // //           offerLetter1: [],
// // //           offerLetter2: [],
// // //           experienceLetter1: [],
// // //           experienceLetter2: [],
// // //           salaryProof: [],
// // //           parentSpouseAadhar: [],
// // //           passportPhoto: [],
// // //         },
// // //       });

// // //       const staffId = staffDocRef.id;
// // //       console.log("Staff added to Firestore with ID:", staffId);

// // //       const documentUpdates = {};
// // //       for (const [docType, file] of Object.entries(documents)) {
// // //         if (file) {
// // //           console.log(`Uploading document: ${docType}`);
// // //           try {
// // //             const url = await uploadFileToS3(file, docType, staffId);
// // //             documentUpdates[`staff.${docType}`] = [url];
// // //           } catch (uploadErr) {
// // //             console.error(`Failed to upload ${docType}:`, uploadErr);
// // //             throw new Error(`Failed to upload ${docType}: ${uploadErr.message}`);
// // //           }
// // //         }
// // //       }

// // //       if (Object.keys(documentUpdates).length > 0) {
// // //         console.log("Updating Firestore with document URLs:", documentUpdates);
// // //         await updateDoc(doc(db, "Instructor", staffId), documentUpdates);
// // //       }

// // //       toast.success("Staff added successfully!");
// // //       navigate("/instructor");
// // //     } catch (error) {
// // //       console.error("Error adding staff:", error);
// // //       toast.error(`Error adding staff: ${error.message}`);
// // //     } finally {
// // //       submissionRef.current = false;
// // //       setIsSubmitting(false);
// // //     }
// // //   };

// // //   const addEducation = () => {
// // //     setEducationDetails([...educationDetails, { level: '', institute: '', degree: '', specialization: '', grade: '', passingyr: '' }]);
// // //   };

// // //   const handleEducationChange = (index, field, value) => {
// // //     const newEducationDetails = [...educationDetails];
// // //     newEducationDetails[index][field] = value;
// // //     setEducationDetails(newEducationDetails);
// // //   };

// // //   const deleteEducation = (index) => {
// // //     setEducationDetails(educationDetails.filter((_, i) => i !== index));
// // //   };

// // //   const addExperience = () => {
// // //     setExperienceDetails([...experienceDetails, { companyName: '', designation: '', salary: '', years: '', description: '' }]);
// // //   };

// // //   const handleExperienceChange = (index, field, value) => {
// // //     const newExperienceDetails = [...experienceDetails];
// // //     newExperienceDetails[index][field] = value;
// // //     setExperienceDetails(newExperienceDetails);
// // //   };

// // //   const deleteExperience = (index) => {
// // //     setExperienceDetails(experienceDetails.filter((_, i) => i !== index));
// // //   };

// // //   const handleGuardianChange = (field, value) => {
// // //     setGuardianDetails((prev) => ({ ...prev, [field]: value }));
// // //   };

// // //   const handleEmergencyContactChange = (field, value) => {
// // //     setEmergencyContact((prev) => ({ ...prev, [field]: value }));
// // //   };

// // //   const toggleSidebar = () => {
// // //     setIsOpen(false);
// // //     setTimeout(() => navigate("/instructor"), 300);
// // //   };

// // //   return (
// // //     <>
// // //       <ToastContainer position="top-right" autoClose={3000} />
// // //       <div
// // //         className="fixed inset-0 bg-black bg-opacity-50 z-40"
// // //         onClick={toggleSidebar}
// // //       />
// // //       <div
// // //         className={`fixed top-0 right-0 h-full bg-white w-full sm:w-3/4 shadow-lg transform transition-transform duration-300 ${
// // //           isOpen ? "translate-x-0" : "translate-x-full"
// // //         } p-6 overflow-y-auto z-50`}
// // //       >
// // //         <div className="flex justify-between items-center mb-6">
// // //           <h1 className="text-2xl font-semibold text-gray-800">Add Staff</h1>
// // //           <button
// // //             onClick={toggleSidebar}
// // //             className="text-gray-500 hover:text-gray-700 transition duration-200"
// // //           >
// // //             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
// // //             </svg>
// // //           </button>
// // //         </div>

// // //         <form onSubmit={handleAddStaff} className="space-y-8">
// // //           {/* Personal Details */}
// // //           <div>
// // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Personal Details</h2>
// // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-600">Name</label>
// // //                 <input
// // //                   type="text"
// // //                   value={Name}
// // //                   onChange={(e) => setName(e.target.value)}
// // //                   placeholder="Name"
// // //                   required
// // //                   disabled={isSubmitting}
// // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                 />
// // //               </div>
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-600">Email</label>
// // //                 <input
// // //                   type="email"
// // //                   value={email}
// // //                   onChange={(e) => setEmail(e.target.value)}
// // //                   placeholder="Email"
// // //                   required
// // //                   disabled={isSubmitting}
// // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                 />
// // //               </div>
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-600">Phone</label>
// // //                 <div className="flex mt-1">
// // //                   <select
// // //                     value={countryCode}
// // //                     onChange={(e) => setCountryCode(e.target.value)}
// // //                     disabled={isSubmitting}
// // //                     className="w-1/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                   >
// // //                     {countryCodes.map((country) => (
// // //                       <option key={country.key} value={country.code}>
// // //                         {country.label}
// // //                       </option>
// // //                     ))}
// // //                   </select>
// // //                   <input
// // //                     type="text"
// // //                     value={phone}
// // //                     onChange={(e) => setPhone(e.target.value)}
// // //                     placeholder="Phone Number"
// // //                     required
// // //                     disabled={isSubmitting}
// // //                     className="w-2/3 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                   />
// // //                 </div>
// // //               </div>
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
// // //                 <input
// // //                   typeofac="date"
// // //                   value={dateOfBirth}
// // //                   onChange={(e) => setDateOfBirth(e.target.value)}
// // //                   disabled={isSubmitting}
// // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                 />
// // //               </div>
// // //             </div>
// // //           </div>

// // //           {/* Guardian Details */}
// // //           <div>
// // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Guardian Details</h2>
// // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-600">Name</label>
// // //                 <input
// // //                   type="text"
// // //                   value={guardianDetails.name}
// // //                   onChange={(e) => handleGuardianChange('name', e.target.value)}
// // //                   placeholder="Guardian Name"
// // //                   disabled={isSubmitting}
// // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                 />
// // //               </div>
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-600">Phone</label>
// // //                 <div className="flex mt-1">
// // //                   <select
// // //                     value={guardianCountryCode}
// // //                     onChange={(e) => setGuardianCountryCode(e.target.value)}
// // //                     disabled={isSubmitting}
// // //                     className="w-1/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                   >
// // //                     {countryCodes.map((country) => (
// // //                       <option key={country.key} value={country.code}>
// // //                         {country.label}
// // //                       </option>
// // //                     ))}
// // //                   </select>
// // //                   <input
// // //                     type="text"
// // //                     value={guardianDetails.phone}
// // //                     onChange={(e) => handleGuardianChange('phone', e.target.value)}
// // //                     placeholder="Guardian Phone"
// // //                     disabled={isSubmitting}
// // //                     className="w-2/3 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                   />
// // //                 </div>
// // //               </div>
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-600">Email</label>
// // //                 <input
// // //                   type="email"
// // //                   value={guardianDetails.email}
// // //                   onChange={(e) => handleGuardianChange('email', e.target.value)}
// // //                   placeholder="Guardian Email"
// // //                   disabled={isSubmitting}
// // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                 />
// // //               </div>
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-600">Relation</label>
// // //                 <input
// // //                   type="text"
// // //                   value={guardianDetails.relation}
// // //                   onChange={(e) => handleGuardianChange('relation', e.target.value)}
// // //                   placeholder="Relation"
// // //                   disabled={isSubmitting}
// // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                 />
// // //               </div>
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-600">Occupation</label>
// // //                 <input
// // //                   type="text"
// // //                   value={guardianDetails.occupation}
// // //                   onChange={(e) => handleGuardianChange('occupation', e.target.value)}
// // //                   placeholder="Occupation"
// // //                   disabled={isSubmitting}
// // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                 />
// // //               </div>
// // //             </div>
// // //           </div>

// // //           {/* Emergency Contact */}
// // //           <div>
// // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Emergency Contact</h2>
// // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-600">Name</label>
// // //                 <input
// // //                   type="text"
// // //                   value={emergencyContact.name}
// // //                   onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
// // //                   placeholder="Emergency Contact Name"
// // //                   disabled={isSubmitting}
// // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                 />
// // //               </div>
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-600">Phone</label>
// // //                 <div className="flex mt-1">
// // //                   <select
// // //                     value={emergencyContact.countryCode}
// // //                     onChange={(e) => handleEmergencyContactChange('countryCode', e.target.value)}
// // //                     disabled={isSubmitting}
// // //                     className="w-1/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                   >
// // //                     {countryCodes.map((country) => (
// // //                       <option key={country.key} value={country.code}>
// // //                         {country.label}
// // //                       </option>
// // //                     ))}
// // //                   </select>
// // //                   <input
// // //                     type="text"
// // //                     value={emergencyContact.phone}
// // //                     onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
// // //                     placeholder="Emergency Contact Phone"
// // //                     disabled={isSubmitting}
// // //                     className="w-2/3 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                   />
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>

// // //           {/* Address Details */}
// // //           <div>
// // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Address Details</h2>
// // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
// // //               <div>
// // //                 <h3 className="text-md font-medium text-gray-600 mb-2">Residential Address</h3>
// // //                 <div className="space-y-3">
// // //                   <input
// // //                     type="text"
// // //                     value={address.street}
// // //                     onChange={(e) => setAddress({ ...address, street: e.target.value })}
// // //                     placeholder="Street"
// // //                     disabled={isSubmitting}
// // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                   />
// // //                   <input
// // //                     type="text"
// // //                     value={address.area}
// // //                     onChange={(e) => setAddress({ ...address, area: e.target.value })}
// // //                     placeholder="Area"
// // //                     disabled={isSubmitting}
// // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                   />
// // //                   <input
// // //                     type="text"
// // //                     value={address.city}
// // //                     onChange={(e) => setAddress({ ...address, city: e.target.value })}
// // //                     placeholder="City"
// // //                     disabled={isSubmitting}
// // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                   />
// // //                   <input
// // //                     type="text"
// // //                     value={address.state}
// // //                     onChange={(e) => setAddress({ ...address, state: e.target.value })}
// // //                     placeholder="State"
// // //                     disabled={isSubmitting}
// // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                   />
// // //                   <input
// // //                     type="text"
// // //                     value={address.zip}
// // //                     onChange={(e) => setAddress({ ...address, zip: e.target.value })}
// // //                     placeholder="Zip Code"
// // //                     disabled={isSubmitting}
// // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                   />
// // //                   <input
// // //                     type="text"
// // //                     value={address.country}
// // //                     onChange={(e) => setAddress({ ...address, country: e.target.value })}
// // //                     placeholder="Country"
// // //                     disabled={isSubmitting}
// // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                   />
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>

// // //           {/* Document Uploads */}
// // //           <div>
// // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Document Uploads</h2>
// // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // //               {[
// // //                 { key: 'aadharCard', label: 'Aadhar Card' },
// // //                 { key: 'panCard', label: 'PAN Card' },
// // //                 { key: 'addressProof', label: 'Address Proof' },
// // //                 { key: 'tenthMarksheet', label: '10th Marksheet' },
// // //                 { key: 'twelfthMarksheet', label: '12th Marksheet' },
// // //                 { key: 'graduationMarksheet', label: 'Graduation Marksheet' },
// // //                 { key: 'pgMarksheet', label: 'PG Marksheet' },
// // //                 { key: 'offerLetter1', label: 'Last Offer Letter 1' },
// // //                 { key: 'offerLetter2', label: 'Last Offer Letter 2' },
// // //                 { key: 'experienceLetter1', label: 'Last Experience Letter 1' },
// // //                 { key: 'experienceLetter2', label: 'Last Experience Letter 2' },
// // //                 { key: 'salaryProof', label: 'Salary Proof' },
// // //                 { key: 'parentSpouseAadhar', label: "Parent/Spouse Aadhar Card" },
// // //                 { key: 'passportPhoto', label: 'Passport Size Photo' },
// // //               ].map((doc) => (
// // //                 <div key={doc.key}>
// // //                   <label className="block text-sm font-medium text-gray-600">{doc.label}</label>
// // //                   <input
// // //                     type="file"
// // //                     onChange={(e) => handleFileChange(e, doc.key)}
// // //                     accept=".pdf,.jpg,.jpeg,.png"
// // //                     disabled={isSubmitting}
// // //                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                   />
// // //                   {documents[doc.key] && (
// // //                     <span className="text-sm text-gray-600">{documents[doc.key].name}</span>
// // //                   )}
// // //                   {uploadProgress[doc.key] > 0 && (
// // //                     <div className="mt-2">
// // //                       <div className="w-full bg-gray-200 rounded-full h-2.5">
// // //                         <div
// // //                           className="bg-blue-600 h-2.5 rounded-full"
// // //                           style={{ width: `${uploadProgress[doc.key]}%` }}
// // //                         ></div>
// // //                       </div>
// // //                       <span className="text-sm text-gray-600">{uploadProgress[doc.key]}%</span>
// // //                     </div>
// // //                   )}
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           </div>

// // //           {/* Educational Details */}
// // //           <div>
// // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Educational Details</h2>
// // //             <div className="overflow-x-auto">
// // //               <table className="w-full border-collapse">
// // //                 <thead>
// // //                   <tr className="bg-gray-100">
// // //                     <th className="p-3 text-sm font-medium text-gray-600">Level</th>
// // //                     <th className="p-3 text-sm font-medium text-gray-600">Institute</th>
// // //                     <th className="p-3 text-sm font-medium text-gray-600">Degree</th>
// // //                     <th className="p-3 text-sm font-medium text-gray-600">Specialization</th>
// // //                     <th className="p-3 text-sm font-medium text-gray-600">Grade</th>
// // //                     <th className="p-3 text-sm font-medium text-gray-600">Passing Year</th>
// // //                     <th className="p-3 text-sm font-medium text-gray-600">Actions</th>
// // //                   </tr>
// // //                 </thead>
// // //                 <tbody>
// // //                   {educationDetails.map((edu, index) => (
// // //                     <tr key={index} className="border-b hover:bg-gray-50">
// // //                       <td className="p-3">
// // //                         <select
// // //                           value={edu.level}
// // //                           onChange={(e) => handleEducationChange(index, 'level', e.target.value)}
// // //                           disabled={isSubmitting}
// // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus  focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                         >
// // //                           <option value="" disabled>Select Level</option>
// // //                           <option value="School">School</option>
// // //                           <option value="UG">UG</option>
// // //                           <option value="PG">PG</option>
// // //                         </select>
// // //                       </td>
// // //                       <td className="p-3">
// // //                         <input
// // //                           type="text"
// // //                           value={edu.institute}
// // //                           onChange={(e) => handleEducationChange(index, 'institute', e.target.value)}
// // //                           placeholder="Institute Name"
// // //                           disabled={isSubmitting}
// // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                         />
// // //                       </td>
// // //                       <td className="p-3">
// // //                         <input
// // //                           type="text"
// // //                           value={edu.degree}
// // //                           onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
// // //                           placeholder="Degree"
// // //                           disabled={isSubmitting}
// // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                         />
// // //                       </td>
// // //                       <td className="p-3">
// // //                         <input
// // //                           type="text"
// // //                           value={edu.specialization}
// // //                           onChange={(e) => handleEducationChange(index, 'specialization', e.target.value)}
// // //                           placeholder="Specialization"
// // //                           disabled={isSubmitting}
// // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                         />
// // //                       </td>
// // //                       <td className="p-3">
// // //                         <input
// // //                           type="text"
// // //                           value={edu.grade}
// // //                           onChange={(e) => handleEducationChange(index, 'grade', e.target.value)}
// // //                           placeholder="Grade"
// // //                           disabled={isSubmitting}
// // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                         />
// // //                       </td>
// // //                       <td className="p-3">
// // //                         <input
// // //                           type="number"
// // //                           value={edu.passingyr}
// // //                           onChange={(e) => handleEducationChange(index, 'passingyr', e.target.value)}
// // //                           placeholder="Year"
// // //                           disabled={isSubmitting}
// // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                         />
// // //                       </td>
// // //                       <td className="p-3">
// // //                         <button
// // //                           type="button"
// // //                           onClick={() => deleteEducation(index)}
// // //                           disabled={isSubmitting}
// // //                           className="text-red-500 hover:text-red-700"
// // //                         >
// // //                           <FontAwesomeIcon icon={faXmark} />
// // //                         </button>
// // //                       </td>
// // //                     </tr>
// // //                   ))}
// // //                 </tbody>
// // //               </table>
// // //               <button
// // //                 type="button"
// // //                 onClick={addEducation}
// // //                 disabled={isSubmitting}
// // //                 className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-gray-400"
// // //               >
// // //                 Add Education
// // //               </button>
// // //             </div>
// // //           </div>

// // //           {/* Experience Details */}
// // //           <div>
// // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Experience Details</h2>
// // //             <div className="overflow-x-auto">
// // //               <table className="w-full border-collapse">
// // //                 <thead>
// // //                   <tr className="bg-gray-100">
// // //                     <th className="p-3 text-sm font-medium text-gray-600">Company Name</th>
// // //                     <th className="p-3 text-sm font-medium text-gray-600">Designation</th>
// // //                     <th className="p-3 text-sm font-medium text-gray-600">Salary</th>
// // //                     <th className="p-3 text-sm font-medium text-gray-600">Years</th>
// // //                     <th className="p-3 text-sm font-medium text-gray-600">Description</th>
// // //                     <th className="p-3 text-sm font-medium text-gray-600">Actions</th>
// // //                   </tr>
// // //                 </thead>
// // //                 <tbody>
// // //                   {experienceDetails.map((exp, index) => (
// // //                     <tr key={index} className="border-b hover:bg-gray-50">
// // //                       <td className="p-3">
// // //                         <input
// // //                           type="text"
// // //                           value={exp.companyName}
// // //                           onChange={(e) => handleExperienceChange(index, 'companyName', e.target.value)}
// // //                           placeholder="Company Name"
// // //                           disabled={isSubmitting}
// // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                         />
// // //                       </td>
// // //                       <td className="p-3">
// // //                         <input
// // //                           type="text"
// // //                           value={exp.designation}
// // //                           onChange={(e) => handleExperienceChange(index, 'designation', e.target.value)}
// // //                           placeholder="Designation"
// // //                           disabled={isSubmitting}
// // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                         />
// // //                       </td>
// // //                       <td className="p-3">
// // //                         <input
// // //                           type="text"
// // //                           value={exp.salary}
// // //                           onChange={(e) => handleExperienceChange(index, 'salary', e.target.value)}
// // //                           placeholder="Salary"
// // //                           disabled={isSubmitting}
// // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                         />
// // //                       </td>
// // //                       <td className="p-3">
// // //                         <input
// // //                           type="number"
// // //                           value={exp.years}
// // //                           onChange={(e) => handleExperienceChange(index, 'years', e.target.value)}
// // //                           placeholder="Years"
// // //                           disabled={isSubmitting}
// // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                         />
// // //                       </td>
// // //                       <td className="p-3">
// // //                         <input
// // //                           type="text"
// // //                           value={exp.description}
// // //                           onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
// // //                           placeholder="Description"
// // //                           disabled={isSubmitting}
// // //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                         />
// // //                       </td>
// // //                       <td className="p-3">
// // //                         <button
// // //                           type="button"
// // //                           onClick={() => deleteExperience(index)}
// // //                           disabled={isSubmitting}
// // //                           className="text-red-500 hover:text-red-700"
// // //                         >
// // //                           <FontAwesomeIcon icon={faXmark} />
// // //                         </button>
// // //                       </td>
// // //                     </tr>
// // //                   ))}
// // //                 </tbody>
// // //               </table>
// // //               <button
// // //                 type="button"
// // //                 onClick={addExperience}
// // //                 disabled={isSubmitting}
// // //                 className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-gray-400"
// // //               >
// // //                 Add Experience
// // //               </button>
// // //             </div>
// // //           </div>

// // //           {/* Additional Details */}
// // //           <div>
// // //             <h2 className="text-lg font-medium text-gray-700 mb-4">Additional Details</h2>
// // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-600">Date of Joining</label>
// // //                 <input
// // //                   type="date"
// // //                   value={joiningDate}
// // //                   onChange={(e) => setJoiningDate(e.target.value)}
// // //                   disabled={isSubmitting}
// // //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                 />
// // //               </div>
// // //             </div>
// // //           </div>

// // //           <div className="flex justify-end space-x-4">
// // //             <button
// // //               type="button"
// // //               onClick={toggleSidebar}
// // //               disabled={isSubmitting}
// // //               className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition duration-200 disabled:bg-gray-400"
// // //             >
// // //               Cancel
// // //             </button>
// // //             <button
// // //               type="submit"
// // //               disabled={isSubmitting}
// // //               className={`px-6 py-2 rounded-md text-white ${
// // //                 isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
// // //               } transition duration-200`}
// // //             >
// // //               {isSubmitting ? 'Processing...' : 'Add Staff'}
// // //             </button>
// // //           </div>
// // //         </form>
// // //       </div>
// // //     </>
// // //   );
// // // }



// // import React, { useState, useEffect, useRef } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { collection, addDoc, doc, updateDoc, Timestamp } from "firebase/firestore";
// // import { db } from "../../../config/firebase";
// // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // import { faXmark } from '@fortawesome/free-solid-svg-icons';
// // import { s3Client } from "../../../config/aws-config";
// // import { Upload } from "@aws-sdk/lib-storage";
// // import { ToastContainer, toast } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";

// // export default function AddStaff() {
// //   const [isOpen, setIsOpen] = useState(true);
// //   const [Name, setName] = useState("");
// //   const [email, setEmail] = useState("");
// //   const [phone, setPhone] = useState("");
// //   const [countryCode, setCountryCode] = useState("+91");
// //   const [guardianCountryCode, setGuardianCountryCode] = useState("+91");
// //   const [address, setAddress] = useState({ street: "", area: "", city: "", state: "", zip: "", country: "" });
// //   const [dateOfBirth, setDateOfBirth] = useState("");
// //   const [guardianDetails, setGuardianDetails] = useState({ name: "", phone: "", email: "", relation: "", occupation: "" });
// //   const [joiningDate, setJoiningDate] = useState("");
// //   const [educationDetails, setEducationDetails] = useState([]);
// //   const [experienceDetails, setExperienceDetails] = useState([]);
// //   const [emergencyContact, setEmergencyContact] = useState({ name: "", phone: "", countryCode: "+91" });
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const navigate = useNavigate();
// //   const submissionRef = useRef(false); // Prevent duplicate submissions

// //   // File states for document uploads
// //   const [documents, setDocuments] = useState({
// //     aadharCard: null,
// //     panCard: null,
// //     addressProof: null,
// //     tenthMarksheet: null,
// //     twelfthMarksheet: null,
// //     graduationMarksheet: null,
// //     pgMarksheet: null,
// //     offerLetter1: null,
// //     offerLetter2: null,
// //     experienceLetter1: null,
// //     experienceLetter2: null,
// //     salaryProof: null,
// //     parentSpouseAadhar: null,
// //     passportPhoto: null,
// //   });
// //   const [uploadProgress, setUploadProgress] = useState({});

// //   // Country codes with unique keys, aligned with EditStaff
// //   const countryCodes = [
// //     { key: "canada-+1", code: "+1", label: "Canada (+1)" },
// //     { key: "russia-+7", code: "+7", label: "Russia (+7)" },
// //     { key: "egypt-+20", code: "+20", label: "Egypt (+20)" },
// //     { key: "southafrica-+27", code: "+27", label: "South Africa (+27)" },
// //     { key: "greece-+30", code: "+30", label: "Greece (+30)" },
// //     { key: "netherlands-+31", code: "+31", label: "Netherlands (+31)" },
// //     { key: "belgium-+32", code: "+32", label: "Belgium (+32)" },
// //     { key: "india-+91", code: "+91", label: "India (+91)" },
// //   ];

// //   const capitalizeFirstLetter = (str) => {
// //     if (!str || typeof str !== "string") return str;
// //     return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
// //   };

// //   useEffect(() => {
// //     const today = new Date().toISOString().split("T")[0];
// //     setJoiningDate(today);
// //   }, []);

// //   // Handle file input change
// //   const handleFileChange = (e, docType) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
// //       if (!allowedTypes.includes(file.type)) {
// //         toast.error(`Invalid file type for ${file.name}. Allowed types: PDF, JPEG, PNG.`);
// //         return;
// //       }
// //       if (file.size > 5 * 1024 * 1024) {
// //         toast.error(`File ${file.name} is too large. Maximum size is 5MB.`);
// //         return;
// //       }
// //       console.log(`Selected file for ${docType}:`, {
// //         name: file.name,
// //         size: file.size,
// //         type: file.type,
// //         instanceofFile: file instanceof File,
// //         instanceofBlob: file instanceof Blob,
// //       });
// //       setDocuments((prev) => ({ ...prev, [docType]: file }));
// //       setUploadProgress((prev) => ({ ...prev, [docType]: 0 }));
// //     } else {
// //       console.warn(`No file selected for ${docType}`);
// //     }
// //   };

// //   // Upload file to S3 with progress tracking
// //   const uploadFileToS3 = async (file, docType, staffId) => {
// //     const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
// //     const region = import.meta.env.VITE_AWS_REGION;

// //     if (!bucketName || !region) {
// //       throw new Error("Missing S3 configuration: VITE_S3_BUCKET_NAME or VITE_AWS_REGION");
// //     }

// //     if (!file || !(file instanceof File)) {
// //       throw new Error(`Invalid file for ${docType}: File object is null or not a File instance`);
// //     }

// //     console.log(`Uploading ${docType}:`, {
// //       name: file.name,
// //       size: file.size,
// //       type: file.type,
// //     });

// //     const fileName = `staff/${staffId}/${docType}_${Date.now()}_${file.name}`;
// //     const params = {
// //       Bucket: bucketName,
// //       Key: fileName,
// //       Body: file,
// //       ContentType: file.type,
// //     };

// //     try {
// //       const upload = new Upload({
// //         client: s3Client,
// //         params,
// //         queueSize: 4,
// //         partSize: 5 * 1024 * 1024,
// //       });

// //       upload.on("httpUploadProgress", (progress) => {
// //         const percent = Math.round((progress.loaded / progress.total) * 100);
// //         setUploadProgress((prev) => ({ ...prev, [docType]: percent }));
// //       });

// //       await upload.done();

// //       const url = `https://${params.Bucket}.s3.${region}.amazonaws.com/${params.Key}`;
// //       return url;
// //     } catch (err) {
// //       console.error(`Error uploading ${docType}:`, err);
// //       throw err;
// //     }
// //   };

// //   // Handle form submission
// //   const handleAddStaff = async (e) => {
// //     e.preventDefault();
// //     if (submissionRef.current) {
// //       console.warn("Submission already in progress, ignoring duplicate.");
// //       return;
// //     }
// //     if (!Name.trim() || !email.trim() || !phone.trim()) {
// //       toast.error("Please fill all required fields: Name, Email, Phone Number.");
// //       return;
// //     }

// //     submissionRef.current = true;
// //     setIsSubmitting(true);

// //     try {
// //       console.log("Starting staff submission:", { Name, email, phone });
// //       const staffDocRef = await addDoc(collection(db, "Instructor"), {
// //         Name: capitalizeFirstLetter(Name),
// //         email,
// //         phone: `${countryCode}${phone}`,
// //         residential_address: address,
// //         date_of_birth: dateOfBirth ? Timestamp.fromDate(new Date(dateOfBirth)) : null,
// //         guardian_details: {
// //           ...guardianDetails,
// //           phone: guardianDetails.phone ? `${guardianCountryCode}${guardianDetails.phone}` : "",
// //         },
// //         emergency_contact: {
// //           name: emergencyContact.name,
// //           phone: emergencyContact.phone ? `${emergencyContact.countryCode}${emergencyContact.phone}` : "",
// //         },
// //         joining_date: Timestamp.fromDate(new Date(joiningDate)),
// //         created_at: Timestamp.now(), // Add creation timestamp
// //         education_details: educationDetails,
// //         experience_details: experienceDetails,
// //         staff: {
// //           aadharCard: [],
// //           panCard: [],
// //           addressProof: [],
// //           tenthMarksheet: [],
// //           twelfthMarksheet: [],
// //           graduationMarksheet: [],
// //           pgMarksheet: [],
// //           offerLetter1: [],
// //           offerLetter2: [],
// //           experienceLetter1: [],
// //           experienceLetter2: [],
// //           salaryProof: [],
// //           parentSpouseAadhar: [],
// //           passportPhoto: [],
// //         },
// //       });

// //       const staffId = staffDocRef.id;
// //       console.log("Staff added to Firestore with ID:", staffId);

// //       const documentUpdates = {};
// //       for (const [docType, file] of Object.entries(documents)) {
// //         if (file) {
// //           console.log(`Uploading document: ${docType}`);
// //           try {
// //             const url = await uploadFileToS3(file, docType, staffId);
// //             documentUpdates[`staff.${docType}`] = [url];
// //           } catch (uploadErr) {
// //             console.error(`Failed to upload ${docType}:`, uploadErr);
// //             throw new Error(`Failed to upload ${docType}: ${uploadErr.message}`);
// //           }
// //         }
// //       }

// //       if (Object.keys(documentUpdates).length > 0) {
// //         console.log("Updating Firestore with document URLs:", documentUpdates);
// //         await updateDoc(doc(db, "Instructor", staffId), documentUpdates);
// //       }

// //       toast.success("Staff added successfully!");
// //       navigate("/instructor");
// //     } catch (error) {
// //       console.error("Error adding staff:", error);
// //       toast.error(`Error adding staff: ${error.message}`);
// //     } finally {
// //       submissionRef.current = false;
// //       setIsSubmitting(false);
// //     }
// //   };

// //   const addEducation = () => {
// //     setEducationDetails([...educationDetails, { level: '', institute: '', degree: '', specialization: '', grade: '', passingyr: '' }]);
// //   };

// //   const handleEducationChange = (index, field, value) => {
// //     const newEducationDetails = [...educationDetails];
// //     newEducationDetails[index][field] = value;
// //     setEducationDetails(newEducationDetails);
// //   };

// //   const deleteEducation = (index) => {
// //     setEducationDetails(educationDetails.filter((_, i) => i !== index));
// //   };

// //   const addExperience = () => {
// //     setExperienceDetails([...experienceDetails, { companyName: '', designation: '', salary: '', years: '', description: '' }]);
// //   };

// //   const handleExperienceChange = (index, field, value) => {
// //     const newExperienceDetails = [...experienceDetails];
// //     newExperienceDetails[index][field] = value;
// //     setExperienceDetails(newExperienceDetails);
// //   };

// //   const deleteExperience = (index) => {
// //     setExperienceDetails(experienceDetails.filter((_, i) => i !== index));
// //   };

// //   const handleGuardianChange = (field, value) => {
// //     setGuardianDetails((prev) => ({ ...prev, [field]: value }));
// //   };

// //   const handleEmergencyContactChange = (field, value) => {
// //     setEmergencyContact((prev) => ({ ...prev, [field]: value }));
// //   };

// //   const toggleSidebar = () => {
// //     setIsOpen(false);
// //     setTimeout(() => navigate("/instructor"), 300);
// //   };

// //   return (
// //     <>
// //       <ToastContainer position="top-right" autoClose={3000} />
// //       <div
// //         className="fixed inset-0 bg-black bg-opacity-50 z-40"
// //         onClick={toggleSidebar}
// //       />
// //       <div
// //         className={`fixed top-0 right-0 h-full bg-white w-full sm:w-3/4 shadow-lg transform transition-transform duration-300 ${
// //           isOpen ? "translate-x-0" : "translate-x-full"
// //         } p-6 overflow-y-auto z-50`}
// //       >
// //         <div className="flex justify-between items-center mb-6">
// //           <h1 className="text-2xl font-semibold text-gray-800">Add Staff</h1>
// //           <button
// //             onClick={toggleSidebar}
// //             className="text-gray-500 hover:text-gray-700 transition duration-200"
// //           >
// //             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
// //             </svg>
// //           </button>
// //         </div>

// //         <form onSubmit={handleAddStaff} className="space-y-8">
// //           {/* Personal Details */}
// //           <div>
// //             <h2 className="text-lg font-medium text-gray-700 mb-4">Personal Details</h2>
// //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-600">Name</label>
// //                 <input
// //                   type="text"
// //                   value={Name}
// //                   onChange={(e) => setName(e.target.value)}
// //                   placeholder="Name"
// //                   required
// //                   disabled={isSubmitting}
// //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                 />
// //               </div>
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-600">Email</label>
// //                 <input
// //                   type="email"
// //                   value={email}
// //                   onChange={(e) => setEmail(e.target.value)}
// //                   placeholder="Email"
// //                   required
// //                   disabled={isSubmitting}
// //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                 />
// //               </div>
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-600">Phone</label>
// //                 <div className="flex mt-1">
// //                   <select
// //                     value={countryCode}
// //                     onChange={(e) => setCountryCode(e.target.value)}
// //                     disabled={isSubmitting}
// //                     className="w-1/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                   >
// //                     {countryCodes.map((country) => (
// //                       <option key={country.key} value={country.code}>
// //                         {country.label}
// //                       </option>
// //                     ))}
// //                   </select>
// //                   <input
// //                     type="text"
// //                     value={phone}
// //                     onChange={(e) => setPhone(e.target.value)}
// //                     placeholder="Phone Number"
// //                     required
// //                     disabled={isSubmitting}
// //                     className="w-2/3 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                   />
// //                 </div>
// //               </div>
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
// //                 <input
// //                   type="date"
// //                   value={dateOfBirth}
// //                   onChange={(e) => setDateOfBirth(e.target.value)}
// //                   disabled={isSubmitting}
// //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                 />
// //               </div>
// //             </div>
// //           </div>

// //           {/* Guardian Details */}
// //           <div>
// //             <h2 className="text-lg font-medium text-gray-700 mb-4">Guardian Details</h2>
// //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-600">Name</label>
// //                 <input
// //                   type="text"
// //                   value={guardianDetails.name}
// //                   onChange={(e) => handleGuardianChange('name', e.target.value)}
// //                   placeholder="Guardian Name"
// //                   disabled={isSubmitting}
// //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                 />
// //               </div>
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-600">Phone</label>
// //                 <div className="flex mt-1">
// //                   <select
// //                     value={guardianCountryCode}
// //                     onChange={(e) => setGuardianCountryCode(e.target.value)}
// //                     disabled={isSubmitting}
// //                     className="w-1/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                   >
// //                     {countryCodes.map((country) => (
// //                       <option key={country.key} value={country.code}>
// //                         {country.label}
// //                       </option>
// //                     ))}
// //                   </select>
// //                   <input
// //                     type="text"
// //                     value={guardianDetails.phone}
// //                     onChange={(e) => handleGuardianChange('phone', e.target.value)}
// //                     placeholder="Guardian Phone"
// //                     disabled={isSubmitting}
// //                     className="w-2/3 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                   />
// //                 </div>
// //               </div>
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-600">Email</label>
// //                 <input
// //                   type="email"
// //                   value={guardianDetails.email}
// //                   onChange={(e) => handleGuardianChange('email', e.target.value)}
// //                   placeholder="Guardian Email"
// //                   disabled={isSubmitting}
// //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                 />
// //               </div>
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-600">Relation</label>
// //                 <input
// //                   type="text"
// //                   value={guardianDetails.relation}
// //                   onChange={(e) => handleGuardianChange('relation', e.target.value)}
// //                   placeholder="Relation"
// //                   disabled={isSubmitting}
// //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                 />
// //               </div>
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-600">Occupation</label>
// //                 <input
// //                   type="text"
// //                   value={guardianDetails.occupation}
// //                   onChange={(e) => handleGuardianChange('occupation', e.target.value)}
// //                   placeholder="Occupation"
// //                   disabled={isSubmitting}
// //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                 />
// //               </div>
// //             </div>
// //           </div>

// //           {/* Emergency Contact */}
// //           <div>
// //             <h2 className="text-lg font-medium text-gray-700 mb-4">Emergency Contact</h2>
// //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-600">Name</label>
// //                 <input
// //                   type="text"
// //                   value={emergencyContact.name}
// //                   onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
// //                   placeholder="Emergency Contact Name"
// //                   disabled={isSubmitting}
// //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                 />
// //               </div>
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-600">Phone</label>
// //                 <div className="flex mt-1">
// //                   <select
// //                     value={emergencyContact.countryCode}
// //                     onChange={(e) => handleEmergencyContactChange('countryCode', e.target.value)}
// //                     disabled={isSubmitting}
// //                     className="w-1/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                   >
// //                     {countryCodes.map((country) => (
// //                       <option key={country.key} >
// //                         {country.label}
// //                       </option>
// //                     ))}
// //                   </select>
// //                   <input
// //                     type="text"
// //                     value={emergencyContact.phone}
// //                     onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
// //                     placeholder="Emergency Contact Phone"
// //                     disabled={isSubmitting}
// //                     className="w-2/3 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                   />
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Address Details */}
// //           <div>
// //             <h2 className="text-lg font-medium text-gray-700 mb-4">Address Details</h2>
// //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
// //               <div>
// //                 <h3 className="text-md font-medium text-gray-600 mb-2">Residential Address</h3>
// //                 <div className="space-y-3">
// //                   <input
// //                     type="text"
// //                     value={address.street}
// //                     onChange={(e) => setAddress({ ...address, street: e.target.value })}
// //                     placeholder="Street"
// //                     disabled={isSubmitting}
// //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                   />
// //                   <input
// //                     type="text"
// //                     value={address.area}
// //                     onChange={(e) => setAddress({ ...address, area: e.target.value })}
// //                     placeholder="Area"
// //                     disabled={isSubmitting}
// //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                   />
// //                   <input
// //                     type="text"
// //                     value={address.city}
// //                     onChange={(e) => setAddress({ ...address, city: e.target.value })}
// //                     placeholder="City"
// //                     disabled={isSubmitting}
// //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                   />
// //                   <input
// //                     type="text"
// //                     value={address.state}
// //                     onChange={(e) => setAddress({ ...address, state: e.target.value })}
// //                     placeholder="State"
// //                     disabled={isSubmitting}
// //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                   />
// //                   <input
// //                     type="text"
// //                     value={address.zip}
// //                     onChange={(e) => setAddress({ ...address, zip: e.target.value })}
// //                     placeholder="Zip Code"
// //                     disabled={isSubmitting}
// //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                   />
// //                   <input
// //                     type="text"
// //                     value={address.country}
// //                     onChange={(e) => setAddress({ ...address, country: e.target.value })}
// //                     placeholder="Country"
// //                     disabled={isSubmitting}
// //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                   />
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Document Uploads */}
// //           <div>
// //             <h2 className="text-lg font-medium text-gray-700 mb-4">Document Uploads</h2>
// //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //               {[
// //                 { key: 'aadharCard', label: 'Aadhar Card' },
// //                 { key: 'panCard', label: 'PAN Card' },
// //                 { key: 'addressProof', label: 'Address Proof' },
// //                 { key: 'tenthMarksheet', label: '10th Marksheet' },
// //                 { key: 'twelfthMarksheet', label: '12th Marksheet' },
// //                 { key: 'graduationMarksheet', label: 'Graduation Marksheet' },
// //                 { key: 'pgMarksheet', label: 'PG Marksheet' },
// //                 { key: 'offerLetter1', label: 'Last Offer Letter 1' },
// //                 { key: 'offerLetter2', label: 'Last Offer Letter 2' },
// //                 { key: 'experienceLetter1', label: 'Last Experience Letter 1' },
// //                 { key: 'experienceLetter2', label: 'Last Experience Letter 2' },
// //                 { key: 'salaryProof', label: 'Salary Proof' },
// //                 { key: 'parentSpouseAadhar', label: "Parent/Spouse Aadhar Card" },
// //                 { key: 'passportPhoto', label: 'Passport Size Photo' },
// //               ].map((doc) => (
// //                 <div key={doc.key}>
// //                   <label className="block text-sm font-medium text-gray-600">{doc.label}</label>
// //                   <input
// //                     type="file"
// //                     onChange={(e) => handleFileChange(e, doc.key)}
// //                     accept=".pdf,.jpg,.jpeg,.png"
// //                     disabled={isSubmitting}
// //                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                   />
// //                   {documents[doc.key] && (
// //                     <span className="text-sm text-gray-600">{documents[doc.key].name}</span>
// //                   )}
// //                   {uploadProgress[doc.key] > 0 && (
// //                     <div className="mt-2">
// //                       <div className="w-full bg-gray-200 rounded-full h-2.5">
// //                         <div
// //                           className="bg-blue-600 h-2.5 rounded-full"
// //                           style={{ width: `${uploadProgress[doc.key]}%` }}
// //                         ></div>
// //                       </div>
// //                       <span className="text-sm text-gray-600">{uploadProgress[doc.key]}%</span>
// //                     </div>
// //                   )}
// //                 </div>
// //               ))}
// //             </div>
// //           </div>

// //           {/* Educational Details */}
// //           <div>
// //             <h2 className="text-lg font-medium text-gray-700 mb-4">Educational Details</h2>
// //             <div className="overflow-x-auto">
// //               <table className="w-full border-collapse">
// //                 <thead>
// //                   <tr className="bg-gray-100">
// //                     <th className="p-3 text-sm font-medium text-gray-600">Level</th>
// //                     <th className="p-3 text-sm font-medium text-gray-600">Institute</th>
// //                     <th className="p-3 text-sm font-medium text-gray-600">Degree</th>
// //                     <th className="p-3 text-sm font-medium text-gray-600">Specialization</th>
// //                     <th className="p-3 text-sm font-medium text-gray-600">Grade</th>
// //                     <th className="p-3 text-sm font-medium text-gray-600">Passing Year</th>
// //                     <th className="p-3 text-sm font-medium text-gray-600">Actions</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {educationDetails.map((edu, index) => (
// //                     <tr key={index} className="border-b hover:bg-gray-50">
// //                       <td className="p-3">
// //                         <select
// //                           value={edu.level}
// //                           onChange={(e) => handleEducationChange(index, 'level', e.target.value)}
// //                           disabled={isSubmitting}
// //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                         >
// //                           <option value="" disabled>Select Level</option>
// //                           <option value="School">School</option>
// //                           <option value="UG">UG</option>
// //                           <option value="PG">PG</option>
// //                         </select>
// //                       </td>
// //                       <td className="p-3">
// //                         <input
// //                           type="text"
// //                           value={edu.institute}
// //                           onChange={(e) => handleEducationChange(index, 'institute', e.target.value)}
// //                           placeholder="Institute Name"
// //                           disabled={isSubmitting}
// //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                         />
// //                       </td>
// //                       <td className="p-3">
// //                         <input
// //                           type="text"
// //                           value={edu.degree}
// //                           onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
// //                           placeholder="Degree"
// //                           disabled={isSubmitting}
// //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                         />
// //                       </td>
// //                       <td className="p-3">
// //                         <input
// //                           type="text"
// //                           value={edu.specialization}
// //                           onChange={(e) => handleEducationChange(index, 'specialization', e.target.value)}
// //                           placeholder="Specialization"
// //                           disabled={isSubmitting}
// //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                         />
// //                       </td>
// //                       <td className="p-3">
// //                         <input
// //                           type="text"
// //                           value={edu.grade}
// //                           onChange={(e) => handleEducationChange(index, 'grade', e.target.value)}
// //                           placeholder="Grade"
// //                           disabled={isSubmitting}
// //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                         />
// //                       </td>
// //                       <td className="p-3">
// //                         <input
// //                           type="number"
// //                           value={edu.passingyr}
// //                           onChange={(e) => handleEducationChange(index, 'passingyr', e.target.value)}
// //                           placeholder="Year"
// //                           disabled={isSubmitting}
// //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                         />
// //                       </td>
// //                       <td className="p-3">
// //                         <button
// //                           type="button"
// //                           onClick={() => deleteEducation(index)}
// //                           disabled={isSubmitting}
// //                           className="text-red-500 hover:text-red-700"
// //                         >
// //                           <FontAwesomeIcon icon={faXmark} />
// //                         </button>
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //               <button
// //                 type="button"
// //                 onClick={addEducation}
// //                 disabled={isSubmitting}
// //                 className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-gray-400"
// //               >
// //                 Add Education
// //               </button>
// //             </div>
// //           </div>

// //           {/* Experience Details */}
// //           <div>
// //             <h2 className="text-lg font-medium text-gray-700 mb-4">Experience Details</h2>
// //             <div className="overflow-x-auto">
// //               <table className="w-full border-collapse">
// //                 <thead>
// //                   <tr className="bg-gray-100">
// //                     <th className="p-3 text-sm font-medium text-gray-600">Company Name</th>
// //                     <th className="p-3 text-sm font-medium text-gray-600">Designation</th>
// //                     <th className="p-3 text-sm font-medium text-gray-600">Salary</th>
// //                     <th className="p-3 text-sm font-medium text-gray-600">Years</th>
// //                     <th className="p-3 text-sm font-medium text-gray-600">Description</th>
// //                     <th className="p-3 text-sm font-medium text-gray-600">Actions</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {experienceDetails.map((exp, index) => (
// //                     <tr key={index} className="border-b hover:bg-gray-50">
// //                       <td className="p-3">
// //                         <input
// //                           type="text"
// //                           value={exp.companyName}
// //                           onChange={(e) => handleExperienceChange(index, 'companyName', e.target.value)}
// //                           placeholder="Company Name"
// //                           disabled={isSubmitting}
// //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                         />
// //                       </td>
// //                       <td className="p-3">
// //                         <input
// //                           type="text"
// //                           value={exp.designation}
// //                           onChange={(e) => handleExperienceChange(index, 'designation', e.target.value)}
// //                           placeholder="Designation"
// //                           disabled={isSubmitting}
// //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                         />
// //                       </td>
// //                       <td className="p-3">
// //                         <input
// //                           type="text"
// //                           value={exp.salary}
// //                           onChange={(e) => handleExperienceChange(index, 'salary', e.target.value)}
// //                           placeholder="Salary"
// //                           disabled={isSubmitting}
// //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                         />
// //                       </td>
// //                       <td className="p-3">
// //                         <input
// //                           type="number"
// //                           value={exp.years}
// //                           onChange={(e) => handleExperienceChange(index, 'years', e.target.value)}
// //                           placeholder="Years"
// //                           disabled={isSubmitting}
// //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                         />
// //                       </td>
// //                       <td className="p-3">
// //                         <input
// //                           type="text"
// //                           value={exp.description}
// //                           onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
// //                           placeholder="Description"
// //                           disabled={isSubmitting}
// //                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                         />
// //                       </td>
// //                       <td className="p-3">
// //                         <button
// //                           type="button"
// //                           onClick={() => deleteExperience(index)}
// //                           disabled={isSubmitting}
// //                           className="text-red-500 hover:text-red-700"
// //                         >
// //                           <FontAwesomeIcon icon={faXmark} />
// //                         </button>
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //               <button
// //                 type="button"
// //                 onClick={addExperience}
// //                 disabled={isSubmitting}
// //                 className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-gray-400"
// //               >
// //                 Add Experience
// //               </button>
// //             </div>
// //           </div>

// //           {/* Additional Details */}
// //           <div>
// //             <h2 className="text-lg font-medium text-gray-700 mb-4">Additional Details</h2>
// //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-600">Date of Joining</label>
// //                 <input
// //                   type="date"
// //                   value={joiningDate}
// //                   onChange={(e) => setJoiningDate(e.target.value)}
// //                   disabled={isSubmitting}
// //                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                 />
// //               </div>
// //             </div>
// //           </div>

// //           <div className="flex justify-end space-x-4">
// //             <button
// //               type="button"
// //               onClick={toggleSidebar}
// //               disabled={isSubmitting}
// //               className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition duration-200 disabled:bg-gray-400"
// //             >
// //               Cancel
// //             </button>
// //             <button
// //               type="submit"
// //               disabled={isSubmitting}
// //               className={`px-6 py-2 rounded-md text-white ${
// //                 isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
// //               } transition duration-200`}
// //             >
// //               {isSubmitting ? 'Processing...' : 'Add Staff'}
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </>
// //   );
// // }



// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { collection, addDoc, doc, updateDoc, Timestamp } from "firebase/firestore";
// import { db } from "../../../config/firebase";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faXmark } from '@fortawesome/free-solid-svg-icons';
// import { s3Client } from "../../../config/aws-config";
// import { Upload } from "@aws-sdk/lib-storage";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function AddStaff() {
//   const [isOpen, setIsOpen] = useState(true);
//   const [Name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [countryCode, setCountryCode] = useState("+91");
//   const [guardianCountryCode, setGuardianCountryCode] = useState("+91");
//   const [address, setAddress] = useState({ street: "", area: "", city: "", state: "", zip: "", country: "" });
//   const [dateOfBirth, setDateOfBirth] = useState("");
//   const [guardianDetails, setGuardianDetails] = useState({ name: "", phone: "", email: "", relation: "", occupation: "" });
//   const [joiningDate, setJoiningDate] = useState("");
//   const [educationDetails, setEducationDetails] = useState([]);
//   const [experienceDetails, setExperienceDetails] = useState([]);
//   const [emergencyContact, setEmergencyContact] = useState({ name: "", phone: "", countryCode: "+91" });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const navigate = useNavigate();
//   const submissionRef = useRef(false);

//   const [documents, setDocuments] = useState({
//     aadharCard: null,
//     panCard: null,
//     addressProof: null,
//     tenthMarksheet: null,
//     twelfthMarksheet: null,
//     graduationMarksheet: null,
//     pgMarksheet: null,
//     offerLetter1: null,
//     offerLetter2: null,
//     experienceLetter1: null,
//     experienceLetter2: null,
//     salaryProof: null,
//     parentSpouseAadhar: null,
//     passportPhoto: null,
//   });
//   const [uploadProgress, setUploadProgress] = useState({});

//   const countryCodes = [
//     { key: "canada-+1", code: "+1", label: "Canada (+1)" },
//     { key: "russia-+7", code: "+7", label: "Russia (+7)" },
//     { key: "egypt-+20", code: "+20", label: "Egypt (+20)" },
//     { key: "southafrica-+27", code: "+27", label: "South Africa (+27)" },
//     { key: "greece-+30", code: "+30", label: "Greece (+30)" },
//     { key: "netherlands-+31", code: "+31", label: "Netherlands (+31)" },
//     { key: "belgium-+32", code: "+32", label: "Belgium (+32)" },
//     { key: "india-+91", code: "+91", label: "India (+91)" },
//   ];

//   const capitalizeFirstLetter = (str) => {
//     if (!str || typeof str !== "string") return str;
//     return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
//   };

//   useEffect(() => {
//     const today = new Date().toISOString().split("T")[0];
//     setJoiningDate(today);
//   }, []);

//   const handleFileChange = (e, docType) => {
//     const file = e.target.files[0];
//     if (file) {
//       const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
//       if (!allowedTypes.includes(file.type)) {
//         toast.error(`Invalid file type for ${file.name}. Allowed types: PDF, JPEG, PNG.`);
//         return;
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error(`File ${file.name} is too large. Maximum size is 5MB.`);
//         return;
//       }
//       console.log(`Selected file for ${docType}:`, {
//         name: file.name,
//         size: file.size,
//         type: file.type,
//         instanceofFile: file instanceof File,
//         instanceofBlob: file instanceof Blob,
//       });
//       setDocuments((prev) => ({ ...prev, [docType]: file }));
//       setUploadProgress((prev) => ({ ...prev, [docType]: 0 }));
//     } else {
//       console.warn(`No file selected for ${docType}`);
//     }
//   };

//   const uploadFileToS3 = async (file, docType, staffId) => {
//     const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
//     const region = import.meta.env.VITE_AWS_REGION;

//     if (!bucketName || !region) {
//       throw new Error("Missing S3 configuration: VITE_S3_BUCKET_NAME or VITE_AWS_REGION");
//     }

//     if (!file || !(file instanceof File)) {
//       throw new Error(`Invalid file for ${docType}: File object is null or not a File instance`);
//     }

//     console.log(`Uploading ${docType}:`, {
//       name: file.name,
//       size: file.size,
//       type: file.type,
//     });

//     const fileName = `staff/${staffId}/${docType}_${Date.now()}_${file.name}`;
//     const params = {
//       Bucket: bucketName,
//       Key: fileName,
//       Body: file,
//       ContentType: file.type,
//     };

//     try {
//       const upload = new Upload({
//         client: s3Client,
//         params,
//         queueSize: 4,
//         partSize: 5 * 1024 * 1024,
//       });

//       upload.on("httpUploadProgress", (progress) => {
//         const percent = Math.round((progress.loaded / progress.total) * 100);
//         setUploadProgress((prev) => ({ ...prev, [docType]: percent }));
//       });

//       await upload.done();

//       const url = `https://${params.Bucket}.s3.${region}.amazonaws.com/${params.Key}`;
//       return url;
//     } catch (err) {
//       console.error(`Error uploading ${docType}:`, err);
//       throw err;
//     }
//   };

//   const cleanPhoneNumber = (phone) => {
//     return phone.replace(/^\+|\s+|[^\d]/g, '');
//   };

//   const handleAddStaff = async (e) => {
//     e.preventDefault();
//     if (submissionRef.current) {
//       console.warn("Submission already in progress, ignoring duplicate.");
//       return;
//     }
//     if (!Name.trim() || !email.trim() || !phone.trim()) {
//       toast.error("Please fill all required fields: Name, Email, Phone Number.");
//       return;
//     }

//     const cleanedPhone = cleanPhoneNumber(phone);
//     const cleanedGuardianPhone = cleanPhoneNumber(guardianDetails.phone);
//     const cleanedEmergencyPhone = cleanPhoneNumber(emergencyContact.phone);

//     if (!/^\d{10,15}$/.test(cleanedPhone)) {
//       toast.error("Staff phone number must be 10-15 digits.");
//       return;
//     }
//     if (guardianDetails.phone && !/^\d{10,15}$/.test(cleanedGuardianPhone)) {
//       toast.error("Guardian phone number must be 10-15 digits.");
//       return;
//     }
//     if (emergencyContact.phone && !/^\d{10,15}$/.test(cleanedEmergencyPhone)) {
//       toast.error("Emergency contact phone number must be 10-15 digits.");
//       return;
//     }

//     submissionRef.current = true;
//     setIsSubmitting(true);

//     try {
//       console.log("Starting staff submission:", { Name, email, phone: cleanedPhone });
//       const staffDocRef = await addDoc(collection(db, "Instructor"), {
//         Name: capitalizeFirstLetter(Name),
//         email,
//         phoneecnie_contact: {
//           name: emergencyContact.name,
//           phone: cleanedEmergencyPhone ? `+${cleanedEmergencyPhone}` : "",
//           countryCode: emergencyContact.countryCode,
//         },
//         joining_date: Timestamp.fromDate(new Date(joiningDate)),
//         created_at: Timestamp.now(),
//         education_details: educationDetails,
//         experience_details: experienceDetails,
//         staff: {
//           aadharCard: [],
//           panCard: [],
//           addressProof: [],
//           tenthMarksheet: [],
//           twelfthMarksheet: [],
//           graduationMarksheet: [],
//           pgMarksheet: [],
//           offerLetter1: [],
//           offerLetter2: [],
//           experienceLetter1: [],
//           experienceLetter2: [],
//           salaryProof: [],
//           parentSpouseAadhar: [],
//           passportPhoto: [],
//         },
//       });

//       const staffId = staffDocRef.id;
//       console.log("Staff added to Firestore with ID:", staffId);

//       const documentUpdates = {};
//       for (const [docType, file] of Object.entries(documents)) {
//         if (file) {
//           console.log(`Uploading document: ${docType}`);
//           try {
//             const url = await uploadFileToS3(file, docType, staffId);
//             documentUpdates[`staff.${docType}`] = [url];
//           } catch (uploadErr) {
//             console.error(`Failed to upload ${docType}:`, uploadErr);
//             throw new Error(`Failed to upload ${docType}: ${uploadErr.message}`);
//           }
//         }
//       }

//       if (Object.keys(documentUpdates).length > 0) {
//         console.log("Updating Firestore with document URLs:", documentUpdates);
//         await updateDoc(doc(db, "Instructor", staffId), documentUpdates);
//       }

//       toast.success("Staff added successfully!");
//       navigate("/instructor");
//     } catch (error) {
//       console.error("Error adding staff:", error);
//       toast.error(`Error adding staff: ${error.message}`);
//     } finally {
//       submissionRef.current = false;
//       setIsSubmitting(false);
//     }
//   };

//   const addEducation = () => {
//     setEducationDetails([...educationDetails, { level: '', institute: '', degree: '', specialization: '', grade: '', passingyr: '' }]);
//   };

//   const handleEducationChange = (index, field, value) => {
//     const newEducationDetails = [...educationDetails];
//     newEducationDetails[index][field] = value;
//     setEducationDetails(newEducationDetails);
//   };

//   const deleteEducation = (index) => {
//     setEducationDetails(educationDetails.filter((_, i) => i !== index));
//   };

//   const addExperience = () => {
//     setExperienceDetails([...experienceDetails, { companyName: '', designation: '', salary: '', years: '', description: '' }]);
//   };

//   const handleExperienceChange = (index, field, value) => {
//     const newExperienceDetails = [...experienceDetails];
//     newExperienceDetails[index][field] = value;
//     setExperienceDetails(newExperienceDetails);
//   };

//   const deleteExperience = (index) => {
//     setExperienceDetails(experienceDetails.filter((_, i) => i !== index));
//   };

//   const handleGuardianChange = (field, value) => {
//     setGuardianDetails((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleEmergencyContactChange = (field, value) => {
//     setEmergencyContact((prev) => ({ ...prev, [field]: value }));
//   };

//   const toggleSidebar = () => {
//     setIsOpen(false);
//     setTimeout(() => navigate("/instructor"), 300);
//   };

//   return (
//     <>
//       <ToastContainer position="top-right" autoClose={3000} />
//       <div
//         className="fixed inset-0 bg-black bg-opacity-50 z-40"
//         onClick={toggleSidebar}
//       />
//       <div
//         className={`fixed top-0 right-0 h-full bg-white w-full sm:w-3/4 shadow-lg transform transition-transform duration-300 ${
//           isOpen ? "translate-x-0" : "translate-x-full"
//         } p-6 overflow-y-auto z-50`}
//       >
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-semibold text-gray-800">Add Staff</h1>
//           <button
//             onClick={toggleSidebar}
//             className="text-gray-500 hover:text-gray-700 transition duration-200"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         <form onSubmit={handleAddStaff} className="space-y-8">
//           <div>
//             <h2 className="text-lg font-medium text-gray-700 mb-4">Personal Details</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-600">Name</label>
//                 <input
//                   type="text"
//                   value={Name}
//                   onChange={(e) => setName(e.target.value)}
//                   placeholder="Name"
//                   required
//                   disabled={isSubmitting}
//                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-600">Email</label>
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="Email"
//                   required
//                   disabled={isSubmitting}
//                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-600">Phone</label>
//                 <div className="flex mt-1">
//                   <select
//                     value={countryCode}
//                     onChange={(e) => setCountryCode(e.target.value)}
//                     disabled={isSubmitting}
//                     className="w-1/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     {countryCodes.map((country) => (
//                       <option key={country.key} value={country.code}>
//                         {country.label}
//                       </option>
//                     ))}
//                   </select>
//                   <input
//                     type="text"
//                     value={phone}
//                     onChange={(e) => setPhone(e.target.value)}
//                     placeholder="Phone Number"
//                     required
//                     disabled={isSubmitting}
//                     className="w-2/3 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
//                 <input
//                   type="date"
//                   value={dateOfBirth}
//                   onChange={(e) => setDateOfBirth(e.target.value)}
//                   disabled={isSubmitting}
//                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>
//           </div>

//           <div>
//             <h2 className="text-lg font-medium text-gray-700 mb-4">Guardian Details</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-600">Name</label>
//                 <input
//                   type="text"
//                   value={guardianDetails.name}
//                   onChange={(e) => handleGuardianChange('name', e.target.value)}
//                   placeholder="Guardian Name"
//                   disabled={isSubmitting}
//                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-600">Phone</label>
//                 <div className="flex mt-1">
//                   <select
//                     value={guardianCountryCode}
//                     onChange={(e) => setGuardianCountryCode(e.target.value)}
//                     disabled={isSubmitting}
//                     className="w-1/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     {countryCodes.map((country) => (
//                       <option key={country.key} value={country.code}>
//                         {country.label}
//                       </option>
//                     ))}
//                   </select>
//                   <input
//                     type="text"
//                     value={guardianDetails.phone}
//                     onChange={(e) => handleGuardianChange('phone', e.target.value)}
//                     placeholder="Guardian Phone"
//                     disabled={isSubmitting}
//                     className="w-2/3 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-600">Email</label>
//                 <input
//                   type="email"
//                   value={guardianDetails.email}
//                   onChange={(e) => handleGuardianChange('email', e.target.value)}
//                   placeholder="Guardian Email"
//                   disabled={isSubmitting}
//                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-600">Relation</label>
//                 <input
//                   type="text"
//                   value={guardianDetails.relation}
//                   onChange={(e) => handleGuardianChange('relation', e.target.value)}
//                   placeholder="Relation"
//                   disabled={isSubmitting}
//                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-600">Occupation</label>
//                 <input
//                   type="text"
//                   value={guardianDetails.occupation}
//                   onChange={(e) => handleGuardianChange('occupation', e.target.value)}
//                   placeholder="Occupation"
//                   disabled={isSubmitting}
//                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>
//           </div>

//           <div>
//             <h2 className="text-lg font-medium text-gray-700 mb-4">Emergency Contact</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-600">Name</label>
//                 <input
//                   type="text"
//                   value={emergencyContact.name}
//                   onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
//                   placeholder="Emergency Contact Name"
//                   disabled={isSubmitting}
//                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-600">Phone</label>
//                 <div className="flex mt-1">
//                   <select
//                     value={emergencyContact.countryCode}
//                     onChange={(e) => handleEmergencyContactChange('countryCode', e.target.value)}
//                     disabled={isSubmitting}
//                     className="w-1/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     {countryCodes.map((country) => (
//                       <option key={country.key} value={country.code}>
//                         {country.label}
//                       </option>
//                     ))}
//                   </select>
//                   <input
//                     type="text"
//                     value={emergencyContact.phone}
//                     onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
//                     placeholder="Emergency Contact Phone"
//                     disabled={isSubmitting}
//                     className="w-2/3 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div>
//             <h2 className="text-lg font-medium text-gray-700 mb-4">Address Details</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//               <div>
//                 <h3 className="text-md font-medium text-gray-600 mb-2">Residential Address</h3>
//                 <div className="space-y-3">
//                   <input
//                     type="text"
//                     value={address.street}
//                     onChange={(e) => setAddress({ ...address, street: e.target.value })}
//                     placeholder="Street"
//                     disabled={isSubmitting}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   <input
//                     type="text"
//                     value={address.area}
//                     onChange={(e) => setAddress({ ...address, area: e.target.value })}
//                     placeholder="Area"
//                     disabled={isSubmitting}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   <input
//                     type="text"
//                     value={address.city}
//                     onChange={(e) => setAddress({ ...address, city: e.target.value })}
//                     placeholder="City"
//                     disabled={isSubmitting}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   <input
//                     type="text"
//                     value={address.state}
//                     onChange={(e) => setAddress({ ...address, state: e.target.value })}
//                     placeholder="State"
//                     disabled={isSubmitting}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   <input
//                     type="text"
//                     value={address.zip}
//                     onChange={(e) => setAddress({ ...address, zip: e.target.value })}
//                     placeholder="Zip Code"
//                     disabled={isSubmitting}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   <input
//                     type="text"
//                     value={address.country}
//                     onChange={(e) => setAddress({ ...address, country: e.target.value })}
//                     placeholder="Country"
//                     disabled={isSubmitting}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div>
//             <h2 className="text-lg font-medium text-gray-700 mb-4">Document Uploads</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {[
//                 { key: 'aadharCard', label: 'Aadhar Card' },
//                 { key: 'panCard', label: 'PAN Card' },
//                 { key: 'addressProof', label: 'Address Proof' },
//                 { key: 'tenthMarksheet', label: '10th Marksheet' },
//                 { key: 'twelfthMarksheet', label: '12th Marksheet' },
//                 { key: 'graduationMarksheet', label: 'Graduation Marksheet' },
//                 { key: 'pgMarksheet', label: 'PG Marksheet' },
//                 { key: 'offerLetter1', label: 'Last Offer Letter 1' },
//                 { key: 'offerLetter2', label: 'Last Offer Letter 2' },
//                 { key: 'experienceLetter1', label: 'Last Experience Letter 1' },
//                 { key: 'experienceLetter2', label: 'Last Experience Letter 2' },
//                 { key: 'salaryProof', label: 'Salary Proof' },
//                 { key: 'parentSpouseAadhar', label: "Parent/Spouse Aadhar Card" },
//                 { key: 'passportPhoto', label: 'Passport Size Photo' },
//               ].map((doc) => (
//                 <div key={doc.key}>
//                   <label className="block text-sm font-medium text-gray-600">{doc.label}</label>
//                   <input
//                     type="file"
//                     onChange={(e) => handleFileChange(e, doc.key)}
//                     accept=".pdf,.jpg,.jpeg,.png"
//                     disabled={isSubmitting}
//                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   {documents[doc.key] && (
//                     <span className="text-sm text-gray-600">{documents[doc.key].name}</span>
//                   )}
//                   {uploadProgress[doc.key] > 0 && (
//                     <div className="mt-2">
//                       <div className="w-full bg-gray-200 rounded-full h-2.5">
//                         <div
//                           className="bg-blue-600 h-2.5 rounded-full"
//                           style={{ width: `${uploadProgress[doc.key]}%` }}
//                         ></div>
//                       </div>
//                       <span className="text-sm text-gray-600">{uploadProgress[doc.key]}%</span>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div>
//             <h2 className="text-lg font-medium text-gray-700 mb-4">Educational Details</h2>
//             <div className="overflow-x-auto">
//               <table className="w-full border-collapse">
//                 <thead>
//                   <tr className="bg-gray-100">
//                     <th className="p-3 text-sm font-medium text-gray-600">Level</th>
//                     <th className="p-3 text-sm font-medium text-gray-600">Institute</th>
//                     <th className="p-3 text-sm font-medium text-gray-600">Degree</th>
//                     <th className="p-3 text-sm font-medium text-gray-600">Specialization</th>
//                     <th className="p-3 text-sm font-medium text-gray-600">Grade</th>
//                     <th className="p-3 text-sm font-medium text-gray-600">Passing Year</th>
//                     <th className="p-3 text-sm font-medium text-gray-600">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {educationDetails.map((edu, index) => (
//                     <tr key={index} className="border-b hover:bg-gray-50">
//                       <td className="p-3">
//                         <select
//                           value={edu.level}
//                           onChange={(e) => handleEducationChange(index, 'level', e.target.value)}
//                           disabled={isSubmitting}
//                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         >
//                           <option value="" disabled>Select Level</option>
//                           <option value="School">School</option>
//                           <option value="UG">UG</option>
//                           <option value="PG">PG</option>
//                         </select>
//                       </td>
//                       <td className="p-3">
//                         <input
//                           type="text"
//                           value={edu.institute}
//                           onChange={(e) => handleEducationChange(index, 'institute', e.target.value)}
//                           placeholder="Institute Name"
//                           disabled={isSubmitting}
//                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                       </td>
//                       <td className="p-3">
//                         <input
//                           type="text"
//                           value={edu.degree}
//                           onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
//                           placeholder="Degree"
//                           disabled={isSubmitting}
//                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                       </td>
//                       <td className="p-3">
//                         <input
//                           type="text"
//                           value={edu.specialization}
//                           onChange={(e) => handleEducationChange(index, 'specialization', e.target.value)}
//                           placeholder="Specialization"
//                           disabled={isSubmitting}
//                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                       </td>
//                       <td className="p-3">
//                         <input
//                           type="text"
//                           value={edu.grade}
//                           onChange={(e) => handleEducationChange(index, 'grade', e.target.value)}
//                           placeholder="Grade"
//                           disabled={isSubmitting}
//                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                       </td>
//                       <td className="p-3">
//                         <input
//                           type="number"
//                           value={edu.passingyr}
//                           onChange={(e) => handleEducationChange(index, 'passingyr', e.target.value)}
//                           placeholder="Year"
//                           disabled={isSubmitting}
//                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                       </td>
//                       <td className="p-3">
//                         <button
//                           type="button"
//                           onClick={() => deleteEducation(index)}
//                           disabled={isSubmitting}
//                           className="text-red-500 hover:text-red-700"
//                         >
//                           <FontAwesomeIcon icon={faXmark} />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               <button
//                 type="button"
//                 onClick={addEducation}
//                 disabled={isSubmitting}
//                 className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-gray-400"
//               >
//                 Add Education
//               </button>
//             </div>
//           </div>

//           <div>
//             <h2 className="text-lg font-medium text-gray-700 mb-4">Experience Details</h2>
//             <div className="overflow-x-auto">
//               <table className="w-full border-collapse">
//                 <thead>
//                   <tr className="bg-gray-100">
//                     <th className="p-3 text-sm font-medium text-gray-600">Company Name</th>
//                     <th className="p-3 text-sm font-medium text-gray-600">Designation</th>
//                     <th className="p-3 text-sm font-medium text-gray-600">Salary</th>
//                     <th className="p-3 text-sm font-medium text-gray-600">Years</th>
//                     <th className="p-3 text-sm font-medium text-gray-600">Description</th>
//                     <th className="p-3 text-sm font-medium text-gray-600">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {experienceDetails.map((exp, index) => (
//                     <tr key={index} className="border-b hover:bg-gray-50">
//                       <td className="p-3">
//                         <input
//                           type="text"
//                           value={exp.companyName}
//                           onChange={(e) => handleExperienceChange(index, 'companyName', e.target.value)}
//                           placeholder="Company Name"
//                           disabled={isSubmitting}
//                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                       </td>
//                       <td className="p-3">
//                         <input
//                           type="text"
//                           value={exp.designation}
//                           onChange={(e) => handleExperienceChange(index, 'designation', e.target.value)}
//                           placeholder="Designation"
//                           disabled={isSubmitting}
//                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                       </td>
//                       <td className="p-3">
//                         <input
//                           type="text"
//                           value={exp.salary}
//                           onChange={(e) => handleExperienceChange(index, 'salary', e.target.value)}
//                           placeholder="Salary"
//                           disabled={isSubmitting}
//                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                       </td>
//                       <td className="p-3">
//                         <input
//                           type="number"
//                           value={exp.years}
//                           onChange={(e) => handleExperienceChange(index, 'years', e.target.value)}
//                           placeholder="Years"
//                           disabled={isSubmitting}
//                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                       </td>
//                       <td className="p-3">
//                         <input
//                           type="text"
//                           value={exp.description}
//                           onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
//                           placeholder="Description"
//                           disabled={isSubmitting}
//                           className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                       </td>
//                       <td className="p-3">
//                         <button
//                           type="button"
//                           onClick={() => deleteExperience(index)}
//                           disabled={isSubmitting}
//                           className="text-red-500 hover:text-red-700"
//                         >
//                           <FontAwesomeIcon icon={faXmark} />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               <button
//                 type="button"
//                 onClick={addExperience}
//                 disabled={isSubmitting}
//                 className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-gray-400"
//               >
//                 Add Experience
//               </button>
//             </div>
//           </div>

//           <div>
//             <h2 className="text-lg font-medium text-gray-700 mb-4">Additional Details</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-600">Date of Joining</label>
//                 <input
//                   type="date"
//                   value={joiningDate}
//                   onChange={(e) => setJoiningDate(e.target.value)}
//                   disabled={isSubmitting}
//                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-end space-x-4">
//             <button
//               type="button"
//               onClick={toggleSidebar}
//               disabled={isSubmitting}
//               className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition duration-200 disabled:bg-gray-400"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className={`px-6 py-2 rounded-md text-white ${
//                 isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
//               } transition duration-200`}
//             >
//               {isSubmitting ? 'Processing...' : 'Add Staff'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// }


import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { s3Client } from "../../../config/aws-config";
import { Upload } from "@aws-sdk/lib-storage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddStaff() {
  const [isOpen, setIsOpen] = useState(true);
  const [Name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [guardianCountryCode, setGuardianCountryCode] = useState("+91");
  const [address, setAddress] = useState({ street: "", area: "", city: "", state: "", zip: "", country: "" });
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [guardianDetails, setGuardianDetails] = useState({ name: "", phone: "", email: "", relation: "", occupation: "" });
  const [joiningDate, setJoiningDate] = useState("");
  const [educationDetails, setEducationDetails] = useState([]);
  const [experienceDetails, setExperienceDetails] = useState([]);
  const [emergencyContact, setEmergencyContact] = useState({ name: "", phone: "", countryCode: "+91" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const submissionRef = useRef(false);

  const [documents, setDocuments] = useState({
    aadharCard: null,
    panCard: null,
    addressProof: null,
    tenthMarksheet: null,
    twelfthMarksheet: null,
    graduationMarksheet: null,
    pgMarksheet: null,
    offerLetter1: null,
    offerLetter2: null,
    experienceLetter1: null,
    experienceLetter2: null,
    salaryProof: null,
    parentSpouseAadhar: null,
    passportPhoto: null,
  });
  const [uploadProgress, setUploadProgress] = useState({});

  const countryCodes = [
    { key: "canada-+1", code: "+1", label: "Canada (+1)" },
    { key: "russia-+7", code: "+7", label: "Russia (+7)" },
    { key: "egypt-+20", code: "+20", label: "Egypt (+20)" },
    { key: "southafrica-+27", code: "+27", label: "South Africa (+27)" },
    { key: "greece-+30", code: "+30", label: "Greece (+30)" },
    { key: "netherlands-+31", code: "+31", label: "Netherlands (+31)" },
    { key: "belgium-+32", code: "+32", label: "Belgium (+32)" },
    { key: "india-+91", code: "+91", label: "India (+91)" },
  ];

  const capitalizeFirstLetter = (str) => {
    if (!str || typeof str !== "string") return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setJoiningDate(today);
  }, []);

  const handleFileChange = (e, docType) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Invalid file type for ${file.name}. Allowed types: PDF, JPEG, PNG.`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large. Maximum size is 5MB.`);
        return;
      }
      console.log(`Selected file for ${docType}:`, {
        name: file.name,
        size: file.size,
        type: file.type,
        instanceofFile: file instanceof File,
        instanceofBlob: file instanceof Blob,
      });
      setDocuments((prev) => ({ ...prev, [docType]: file }));
      setUploadProgress((prev) => ({ ...prev, [docType]: 0 }));
    } else {
      console.warn(`No file selected for ${docType}`);
    }
  };

  const uploadFileToS3 = async (file, docType, staffId) => {
    const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
    const region = import.meta.env.VITE_AWS_REGION;

    if (!bucketName || !region) {
      throw new Error("Missing S3 configuration: VITE_S3_BUCKET_NAME or VITE_AWS_REGION");
    }

    if (!file || !(file instanceof File)) {
      throw new Error(`Invalid file for ${docType}: File object is null or not a File instance`);
    }

    console.log(`Uploading ${docType}:`, {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    const fileName = `staff/${staffId}/${docType}_${Date.now()}_${file.name}`;
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: file,
      ContentType: file.type,
    };

    try {
      const upload = new Upload({
        client: s3Client,
        params,
        queueSize: 4,
        partSize: 5 * 1024 * 1024,
      });

      upload.on("httpUploadProgress", (progress) => {
        const percent = Math.round((progress.loaded / progress.total) * 100);
        setUploadProgress((prev) => ({ ...prev, [docType]: percent }));
      });

      await upload.done();

      const url = `https://${params.Bucket}.s3.${region}.amazonaws.com/${params.Key}`;
      return url;
    } catch (err) {
      console.error(`Error uploading ${docType}:`, err);
      throw err;
    }
  };

  const cleanPhoneNumber = (phone) => {
    // return phone.replace(/^\+|\s+|[^\d]/g, '');


    return phone.replace(/^\+|\D+/g, '');
    };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (submissionRef.current) {
      console.warn("Submission already in progress, ignoring duplicate.");
      return;
    }
    if (!Name.trim() || !email.trim() || !phone.trim()) {
      toast.error("Please fill all required fields: Name, Email, Phone Number.");
      return;
    }
  
    const cleanedPhone = cleanPhoneNumber(phone);
    const cleanedGuardianPhone = cleanPhoneNumber(guardianDetails.phone);
    const cleanedEmergencyPhone = cleanPhoneNumber(emergencyContact.phone);
  
    if (!/^\d{10,15}$/.test(cleanedPhone)) {
      toast.error("Staff phone number must be 10-15 digits.");
      return;
    }
    if (guardianDetails.phone && !/^\d{10,15}$/.test(cleanedGuardianPhone)) {
      toast.error("Guardian phone number must be 10-15 digits.");
      return;
    }
    if (emergencyContact.phone && !/^\d{10,15}$/.test(cleanedEmergencyPhone)) {
      toast.error("Emergency contact phone number must be 10-15 digits.");
      return;
    }
  
    submissionRef.current = true;
    setIsSubmitting(true);
  
    try {
      console.log("Starting staff submission:", { Name, email, phone: cleanedPhone });
      const staffDocRef = await addDoc(collection(db, "Instructor"), {
        Name: capitalizeFirstLetter(Name),
        email,
        phone: `${countryCode}${cleanedPhone}`, // Combine country code with cleaned phone number
        guardian_details: {
          ...guardianDetails,
          phone: guardianDetails.phone ? `${guardianCountryCode}${cleanedGuardianPhone}` : "",
        },
        emergency_contact: {
          name: emergencyContact.name,
          phone: cleanedEmergencyPhone ? `${emergencyContact.countryCode}${cleanedEmergencyPhone}` : "",
        },
        joining_date: Timestamp.fromDate(new Date(joiningDate)),
        created_at: Timestamp.now(),
        education_details: educationDetails,
        experience_details: experienceDetails,
        address: address,
        date_of_birth: dateOfBirth,
        staff: {
          aadharCard: [],
          panCard: [],
          addressProof: [],
          tenthMarksheet: [],
          twelfthMarksheet: [],
          graduationMarksheet: [],
          pgMarksheet: [],
          offerLetter1: [],
          offerLetter2: [],
          experienceLetter1: [],
          experienceLetter2: [],
          salaryProof: [],
          parentSpouseAadhar: [],
          passportPhoto: [],
        },
      });
  
      const staffId = staffDocRef.id;
          console.log("Staff added to Firestore with ID:", staffId);
    
          const documentUpdates = {};
          for (const [docType, file] of Object.entries(documents)) {
            if (file) {
              console.log(`Uploading document: ${docType}`);
              try {
                const url = await uploadFileToS3(file, docType, staffId);
                documentUpdates[`staff.${docType}`] = [url];
              } catch (uploadErr) {
                console.error(`Failed to upload ${docType}:`, uploadErr);
                throw new Error(`Failed to upload ${docType}: ${uploadErr.message}`);
              }
            }
          }
    
          if (Object.keys(documentUpdates).length > 0) {
            console.log("Updating Firestore with document URLs:", documentUpdates);
            await updateDoc(doc(db, "Instructor", staffId), documentUpdates);
          }
    
          toast.success("Staff added successfully!");
          navigate("/instructor");
      // Rest of your code...
    } catch (error) {
      console.error("Error adding staff:", error);
      toast.error(`Error adding staff: ${error.message}`);
    } finally{
      submissionRef.current = false;
    setIsSubmitting(false);
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
    setGuardianDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleEmergencyContactChange = (field, value) => {
    setEmergencyContact((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSidebar = () => {
    setIsOpen(false);
    setTimeout(() => navigate("/instructor"), 300);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={toggleSidebar}
      />
      <div
        className={`fixed top-0 right-0 h-full bg-white w-full sm:w-3/4 shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } p-6 overflow-y-auto z-50`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Add Staff</h1>
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-700 transition duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleAddStaff} className="space-y-8">
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-4">Personal Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Name</label>
                <input
                  type="text"
                  value={Name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  required
                  disabled={isSubmitting}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  disabled={isSubmitting}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Phone</label>
                <div className="flex mt-1">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    disabled={isSubmitting}
                    className="w-1/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {countryCodes.map((country) => (
                      <option key={country.key} value={country.code}>
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
                    disabled={isSubmitting}
                    className="w-2/3 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  disabled={isSubmitting}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

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
                  disabled={isSubmitting}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Phone</label>
                <div className="flex mt-1">
                  <select
                    value={guardianCountryCode}
                    onChange={(e) => setGuardianCountryCode(e.target.value)}
                    disabled={isSubmitting}
                    className="w-1/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {countryCodes.map((country) => (
                      <option key={country.key} value={country.code}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={guardianDetails.phone}
                    onChange={(e) => handleGuardianChange('phone', e.target.value)}
                    placeholder="Guardian Phone"
                    disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-4">Emergency Contact</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Name</label>
                <input
                  type="text"
                  value={emergencyContact.name}
                  onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                  placeholder="Emergency Contact Name"
                  disabled={isSubmitting}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Phone</label>
                <div className="flex mt-1">
                  <select
                    value={emergencyContact.countryCode}
                    onChange={(e) => handleEmergencyContactChange('countryCode', e.target.value)}
                    disabled={isSubmitting}
                    className="w-1/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {countryCodes.map((country) => (
                      <option key={country.key} value={country.code}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={emergencyContact.phone}
                    onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                    placeholder="Emergency Contact Phone"
                    disabled={isSubmitting}
                    className="w-2/3 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

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
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={address.area}
                    onChange={(e) => setAddress({ ...address, area: e.target.value })}
                    placeholder="Area"
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    placeholder="City"
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    placeholder="State"
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={address.zip}
                    onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                    placeholder="Zip Code"
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                    placeholder="Country"
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-4">Document Uploads</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'aadharCard', label: 'Aadhar Card' },
                { key: 'panCard', label: 'PAN Card' },
                { key: 'addressProof', label: 'Address Proof' },
                { key: 'tenthMarksheet', label: '10th Marksheet' },
                { key: 'twelfthMarksheet', label: '12th Marksheet' },
                { key: 'graduationMarksheet', label: 'Graduation Marksheet' },
                { key: 'pgMarksheet', label: 'PG Marksheet' },
                { key: 'offerLetter1', label: 'Last Offer Letter 1' },
                { key: 'offerLetter2', label: 'Last Offer Letter 2' },
                { key: 'experienceLetter1', label: 'Last Experience Letter 1' },
                { key: 'experienceLetter2', label: 'Last Experience Letter 2' },
                { key: 'salaryProof', label: 'Salary Proof' },
                { key: 'parentSpouseAadhar', label: "Parent/Spouse Aadhar Card" },
                { key: 'passportPhoto', label: 'Passport Size Photo' },
              ].map((doc) => (
                <div key={doc.key}>
                  <label className="block text-sm font-medium text-gray-600">{doc.label}</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, doc.key)}
                    accept=".pdf,.jpg,.jpeg,.png"
                    disabled={isSubmitting}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {documents[doc.key] && (
                    <span className="text-sm text-gray-600">{documents[doc.key].name}</span>
                  )}
                  {uploadProgress[doc.key] > 0 && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${uploadProgress[doc.key]}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{uploadProgress[doc.key]}%</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

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
                          disabled={isSubmitting}
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
                          disabled={isSubmitting}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                          placeholder="Degree"
                          disabled={isSubmitting}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={edu.specialization}
                          onChange={(e) => handleEducationChange(index, 'specialization', e.target.value)}
                          placeholder="Specialization"
                          disabled={isSubmitting}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={edu.grade}
                          onChange={(e) => handleEducationChange(index, 'grade', e.target.value)}
                          placeholder="Grade"
                          disabled={isSubmitting}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={edu.passingyr}
                          onChange={(e) => handleEducationChange(index, 'passingyr', e.target.value)}
                          placeholder="Year"
                          disabled={isSubmitting}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() => deleteEducation(index)}
                          disabled={isSubmitting}
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
                disabled={isSubmitting}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-gray-400"
              >
                Add Education
              </button>
            </div>
          </div>

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
                          disabled={isSubmitting}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={exp.designation}
                          onChange={(e) => handleExperienceChange(index, 'designation', e.target.value)}
                          placeholder="Designation"
                          disabled={isSubmitting}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={exp.salary}
                          onChange={(e) => handleExperienceChange(index, 'salary', e.target.value)}
                          placeholder="Salary"
                          disabled={isSubmitting}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={exp.years}
                          onChange={(e) => handleExperienceChange(index, 'years', e.target.value)}
                          placeholder="Years"
                          disabled={isSubmitting}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={exp.description}
                          onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                          placeholder="Description"
                          disabled={isSubmitting}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() => deleteExperience(index)}
                          disabled={isSubmitting}
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
                disabled={isSubmitting}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-gray-400"
              >
                Add Experience
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-4">Additional Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Date of Joining</label>
                <input
                  type="date"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  disabled={isSubmitting}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={toggleSidebar}
              disabled={isSubmitting}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition duration-200 disabled:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 rounded-md text-white ${
                isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              } transition duration-200`}
            >
              {isSubmitting ? 'Processing...' : 'Add Staff'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}