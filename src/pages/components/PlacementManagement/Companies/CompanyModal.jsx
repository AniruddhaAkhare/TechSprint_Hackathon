// // // // import { useState, useEffect } from "react";
// // // // import { db } from "../../../../config/firebase.js";
// // // // import {
// // // //   getDocs,
// // // //   collection,
// // // //   deleteDoc,
// // // //   doc,
// // // //   query,
// // // //   orderBy,
// // // //   addDoc,
// // // //   updateDoc,
// // // //   where,
// // // // } from "firebase/firestore";
// // // // import { useAuth } from "../../../../context/AuthContext.jsx";
// // // // import Modal from "react-modal";
// // // // import { format } from "date-fns";
// // // // import { ToastContainer, toast } from "react-toastify";
// // // // import "react-toastify/dist/ReactToastify.css";

// // // // Modal.setAppElement("#root");

// // // // const countryCodes = [
// // // //   { code: "+1", label: "USA (+1)" },
// // // //   { code: "+1", label: "Canada (+1)" },
// // // //   { code: "+7", label: "Russia (+7)" },
// // // //   { code: "+91", label: "India (+91)" },
// // // // ];

// // // // const CompanyModal = ({ isOpen, onRequestClose, company, rolePermissions, availableTags = [] }) => {
// // // //   const [currentSection, setCurrentSection] = useState(1);
// // // //   const [isEditing, setIsEditing] = useState(false);
// // // //   const [newNote, setNewNote] = useState("");
// // // //   const [noteType, setNoteType] = useState("general");
// // // //   const [jobOpenings, setJobOpenings] = useState([]);
// // // //   const [newJob, setNewJob] = useState({
// // // //     title: "",
// // // //     department: "",
// // // //     location: "",
// // // //     type: "",
// // // //     description: "",
// // // //     postedDate: "",
// // // //     closingDate: "",
// // // //     status: "open",
// // // //   });
// // // //   const [newPOC, setNewPOC] = useState({ name: "", countryCode: "+91", mobile: "", email: "" });
// // // //   const [pointsOfContact, setPointsOfContact] = useState([]);
// // // //   const { user } = useAuth();

// // // //   const canUpdate = rolePermissions?.Companies?.update || false;
// // // //   const canDisplay = rolePermissions?.Companies?.display || false;
// // // //   const canCreate = rolePermissions?.Companies?.create || false;

// // // //   const [companyData, setCompanyData] = useState({
// // // //     ...company,
// // // //     notes: Array.isArray(company?.notes) ? company.notes : [],
// // // //     tags: Array.isArray(company?.tags) ? company.tags : [],
// // // //     history: Array.isArray(company?.history) ? company.history : [],
// // // //     pointsOfContact: Array.isArray(company?.pointsOfContact) ? company.pointsOfContact : [],
// // // //   });

// // // //   const formatDateSafely = (dateString, formatString) => {
// // // //     if (!dateString) return "Not available";
// // // //     const date = new Date(dateString);
// // // //     if (isNaN(date.getTime())) return "Invalid date";
// // // //     return format(date, formatString);
// // // //   };

// // // //   const formatNoteType = (type) => {
// // // //     switch (type) {
// // // //       case "general":
// // // //         return "General Note";
// // // //       case "meeting":
// // // //         return "Meeting Note";
// // // //       case "call":
// // // //         return "Call Note";
      
// // // //       default:
// // // //         return type;
// // // //     }
// // // //   };

// // // //   const renderField = (value, placeholder = "Not provided") => {
// // // //     return value || placeholder;
// // // //   };

// // // //   const logActivity = async (action, details) => {
// // // //     try {
// // // //       const activityLog = {
// // // //         action,
// // // //         details: { companyId: company?.id || null, ...details },
// // // //         timestamp: new Date().toISOString(),
// // // //         userEmail: user?.email || "anonymous",
// // // //         userId: user.uid,
// // // //       };
// // // //       await addDoc(collection(db, "activityLogs"), activityLog);
// // // //     } catch (error) {
// // // //       //console.error("Error logging activity:", error);
// // // //     }
// // // //   };

// // // //   const validateEmail = (email) => {
// // // //     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// // // //   };

// // // //   const validatePOCMobile = (mobile) => {
// // // //     return /^\d{7,15}$/.test(mobile);
// // // //   };

// // // //   useEffect(() => {
// // // //     if (company) {
// // // //       setCompanyData({
// // // //         ...company,
// // // //         notes: Array.isArray(company.notes) ? company.notes : [],
// // // //         tags: Array.isArray(company.tags) ? company.tags : [],
// // // //         history: Array.isArray(company.history) ? company.history : [],
// // // //         pointsOfContact: Array.isArray(company.pointsOfContact) ? company.pointsOfContact : [],
// // // //       });
// // // //       setPointsOfContact(Array.isArray(company.pointsOfContact) ? company.pointsOfContact : []);
// // // //       setIsEditing(false);

// // // //       // Fetch job openings from Firestore
// // // //       const fetchJobOpenings = async () => {
// // // //         try {
// // // //           const jobQuery = query(
// // // //             collection(db, "JobOpenings"),
// // // //             where("companyId", "==", company.id),
// // // //             orderBy("postedDate", "desc")
// // // //           );
// // // //           const jobSnapshot = await getDocs(jobQuery);
// // // //           const jobs = jobSnapshot.docs.map((doc) => ({
// // // //             id: doc.id,
// // // //             ...doc.data(),
// // // //           }));
// // // //           setJobOpenings(jobs);
// // // //         } catch (error) {
// // // //           //console.error("Error fetching job openings:", error);
// // // //           toast.error("Failed to fetch job openings.");
// // // //         }
// // // //       };
// // // //       fetchJobOpenings();
// // // //     } else {
// // // //       setCompanyData({
// // // //         name: "",
// // // //         domain: "",
// // // //         phone: "",
// // // //         email: "",
// // // //         city: "",
// // // //         notes: [],
// // // //         tags: [],
// // // //         history: [],
// // // //         pointsOfContact: [],
// // // //       });
// // // //       setPointsOfContact([]);
// // // //       setJobOpenings([]);
// // // //       setIsEditing(true);
// // // //     }
// // // //   }, [company]);

// // // //   const handleAddNote = async () => {
// // // //     if (!newNote.trim()) {
// // // //       toast.error("Please add a note before submitting.");
// // // //       return;
// // // //     }

// // // //     if (!canUpdate) {
// // // //       toast.error("You don't have permission to update companies");
// // // //       return;
// // // //     }

// // // //     const noteObject = {
// // // //       content: newNote,
// // // //       type: noteType,
// // // //       createdAt: new Date().toISOString(),
// // // //       addedBy: user?.displayName || user?.email || "Unknown User",
// // // //     };

// // // //     const updatedNotes = [...companyData.notes, noteObject];
// // // //     const historyEntry = {
// // // //       action: `Added ${formatNoteType(noteType).toLowerCase()}: "${noteObject.content.slice(0, 50)}${noteObject.content.length > 50 ? "..." : ""}"`,
// // // //       performedBy: user?.displayName || user?.email || "Unknown User",
// // // //       timestamp: new Date().toISOString(),
// // // //     };
// // // //     const updatedHistory = [...companyData.history, historyEntry];

// // // //     try {
// // // //       const companyRef = doc(db, "Companies", company.id);
// // // //       await updateDoc(companyRef, {
// // // //         notes: updatedNotes,
// // // //         history: updatedHistory,
// // // //         updatedAt: new Date().toISOString(),
// // // //       });
// // // //       setCompanyData((prev) => ({
// // // //         ...prev,
// // // //         notes: updatedNotes,
// // // //         history: updatedHistory,
// // // //       }));
// // // //       setNewNote("");
// // // //       setNoteType("general");
// // // //       toast.success("Note added successfully!");
// // // //     } catch (error) {
// // // //       toast.error(`Failed to add note: ${error.message}`);
// // // //     }
// // // //   };

// // // //   const handleAddJobOpening = async () => {
// // // //     if (!newJob.title || !newJob.department || !newJob.location || !newJob.type) {
// // // //       toast.error("Please fill in all required job opening fields.");
// // // //       return;
// // // //     }

// // // //     if (!canUpdate) {
// // // //       toast.error("You don't have permission to update companies");
// // // //       return;
// // // //     }

// // // //     const jobData = {
// // // //       ...newJob,
// // // //       companyId: company.id,
// // // //       postedDate: newJob.postedDate || new Date().toISOString().split("T")[0],
// // // //       status: newJob.status || "open",
// // // //     };

// // // //     try {
// // // //       const jobRef = await addDoc(collection(db, "JobOpenings"), jobData);
// // // //       const historyEntry = {
// // // //         action: `Added job opening: "${newJob.title}"`,
// // // //         performedBy: user?.displayName || user?.email || "Unknown User",
// // // //         timestamp: new Date().toISOString(),
// // // //       };
// // // //       const updatedHistory = [...companyData.history, historyEntry];
// // // //       const companyRef = doc(db, "Companies", company.id);
// // // //       await updateDoc(companyRef, {
// // // //         history: updatedHistory,
// // // //         updatedAt: new Date().toISOString(),
// // // //       });

// // // //       setJobOpenings([...jobOpenings, { id: jobRef.id, ...jobData }]);
// // // //       setCompanyData((prev) => ({
// // // //         ...prev,
// // // //         history: updatedHistory,
// // // //       }));
// // // //       setNewJob({
// // // //         title: "",
// // // //         department: "",
// // // //         location: "",
// // // //         type: "",
// // // //         description: "",
// // // //         postedDate: "",
// // // //         closingDate: "",
// // // //         status: "open",
// // // //       });
// // // //       toast.success("Job opening added successfully!");
// // // //     } catch (error) {
// // // //       toast.error(`Failed to add job opening: ${error.message}`);
// // // //     }
// // // //   };

// // // //   const handleAddPOC = async () => {
// // // //     if (!canUpdate && company) {
// // // //       toast.error("You don't have permission to update points of contact");
// // // //       return;
// // // //     }
// // // //     if (!canCreate && !company) {
// // // //       toast.error("You don't have permission to create points of contact");
// // // //       return;
// // // //     }
// // // //     if (
// // // //       newPOC.name.trim() &&
// // // //       validatePOCMobile(newPOC.mobile) &&
// // // //       validateEmail(newPOC.email)
// // // //     ) {
// // // //       const updatedPOCs = [...pointsOfContact, { ...newPOC }];
// // // //       const historyEntry = {
// // // //         action: `Added point of contact: "${newPOC.name}"`,
// // // //         performedBy: user?.displayName || user?.email || "Unknown User",
// // // //         timestamp: new Date().toISOString(),
// // // //       };
// // // //       const updatedHistory = [...companyData.history, historyEntry];

// // // //       try {
// // // //         const companyRef = doc(db, "Companies", company.id);
// // // //         await updateDoc(companyRef, {
// // // //           pointsOfContact: updatedPOCs,
// // // //           history: updatedHistory,
// // // //           updatedAt: new Date().toISOString(),
// // // //         });
// // // //         setPointsOfContact(updatedPOCs);
// // // //         setCompanyData((prev) => ({
// // // //           ...prev,
// // // //           pointsOfContact: updatedPOCs,
// // // //           history: updatedHistory,
// // // //         }));
// // // //         setNewPOC({ name: "", countryCode: "+91", mobile: "", email: "" });
// // // //         logActivity("ADD_POC", { pocName: newPOC.name });
// // // //         toast.success("Point of contact added successfully!");
// // // //       } catch (error) {
// // // //         toast.error(`Failed to add point of contact: ${error.message}`);
// // // //       }
// // // //     } else {
// // // //       toast.error("Please fill in all POC details correctly. Mobile number must be 7-15 digits, and email must be valid.");
// // // //     }
// // // //   };

// // // //   const handleRemovePOC = async (index) => {
// // // //     if (!canUpdate && company) {
// // // //       toast.error("You don't have permission to update points of contact");
// // // //       return;
// // // //     }
// // // //     if (!canCreate && !company) {
// // // //       toast.error("You don't have permission to create points of contact");
// // // //       return;
// // // //     }
// // // //     const pocName = pointsOfContact[index].name;
// // // //     const updatedPOCs = pointsOfContact.filter((_, i) => i !== index);
// // // //     const historyEntry = {
// // // //       action: `Removed point of contact: "${pocName}"`,
// // // //       performedBy: user?.displayName || user?.email || "Unknown User",
// // // //       timestamp: new Date().toISOString(),
// // // //     };
// // // //     const updatedHistory = [...companyData.history, historyEntry];

// // // //     try {
// // // //       const companyRef = doc(db, "Companies", company.id);
// // // //       await updateDoc(companyRef, {
// // // //         pointsOfContact: updatedPOCs,
// // // //         history: updatedHistory,
// // // //         updatedAt: new Date().toISOString(),
// // // //       });
// // // //       setPointsOfContact(updatedPOCs);
// // // //       setCompanyData((prev) => ({
// // // //         ...prev,
// // // //         pointsOfContact: updatedPOCs,
// // // //         history: updatedHistory,
// // // //       }));
// // // //       logActivity("REMOVE_POC", { pocName });
// // // //       toast.success("Point of contact removed successfully!");
// // // //     } catch (error) {
// // // //       toast.error(`Failed to remove point of contact: ${error.message}`);
// // // //     }
// // // //   };

// // // //   const handlePOCChange = (field, value) => {
// // // //     if (!canUpdate && company) {
// // // //       toast.error("You don't have permission to update POC details");
// // // //       return;
// // // //     }
// // // //     if (!canCreate && !company) {
// // // //       toast.error("You don't have permission to create POC details");
// // // //       return;
// // // //     }
// // // //     if (field === "mobile") {
// // // //       value = value.replace(/\D/g, "").slice(0, 15);
// // // //     }
// // // //     setNewPOC((prev) => {
// // // //       const updated = { ...prev, [field]: value };
// // // //       logActivity("CHANGE_NEW_POC", { field, value });
// // // //       return updated;
// // // //     });
// // // //   };

// // // //   const handleUpdateCompany = async () => {
// // // //     if (!companyData.name) {
// // // //       toast.error("Company name is required.");
// // // //       return;
// // // //     }

// // // //     if (!canUpdate) {
// // // //       toast.error("You don't have permission to update companies");
// // // //       return;
// // // //     }

// // // //     try {
// // // //       const companyRef = doc(db, "Companies", company.id);
// // // //       const historyEntry = {
// // // //         action: `Updated company details`,
// // // //         performedBy: user?.displayName || user?.email || "Unknown User",
// // // //         timestamp: new Date().toISOString(),
// // // //       };
// // // //       const updatedHistory = [...companyData.history, historyEntry];

// // // //       await updateDoc(companyRef, {
// // // //         ...companyData,
// // // //         history: updatedHistory,
// // // //         pointsOfContact: pointsOfContact,
// // // //         updatedAt: new Date().toISOString(),
// // // //       });
// // // //       setCompanyData((prev) => ({
// // // //         ...prev,
// // // //         history: updatedHistory,
// // // //       }));
// // // //       setIsEditing(false);
// // // //       toast.success("Company updated successfully!");
// // // //     } catch (error) {
// // // //       toast.error(`Failed to update company: ${error.message}`);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <>
// // // //       <ToastContainer position="top-right" autoClose={3000} />
// // // //       <Modal
// // // //         isOpen={isOpen}
// // // //         onRequestClose={onRequestClose}
// // // //         className="fixed inset-0 mx-auto my-4 max-w-full sm:max-w-3xl w-[95%] sm:w-full bg-white rounded-lg shadow-lg p-4 sm:p-6 overflow-y-auto max-h-[90vh]"
// // // //         overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
// // // //         style={{
// // // //           content: {
// // // //             opacity: isOpen ? 1 : 0,
// // // //             transition: "opacity 0.3s ease-in-out",
// // // //           },
// // // //         }}
// // // //       >
// // // //         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
// // // //           <h2 className="text-base sm:text-lg font-semibold">
// // // //             {companyData.name || (isEditing ? "Edit Company" : "View Company")}
// // // //           </h2>
// // // //         </div>
// // // //         <div className="flex flex-col sm:flex-row justify-between mb-4 flex-wrap gap-2">
// // // //           <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4">
// // // //             <button
// // // //               onClick={() => setCurrentSection(1)}
// // // //               className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-sm ${currentSection === 1 ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
// // // //             >
// // // //               Company Details
// // // //             </button>
// // // //             <button
// // // //               onClick={() => setCurrentSection(2)}
// // // //               className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-sm ${currentSection === 2 ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
// // // //             >
// // // //               Job Openings
// // // //             </button>
// // // //             <button
// // // //               onClick={() => setCurrentSection(3)}
// // // //               className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-sm ${currentSection === 3 ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
// // // //             >
// // // //               Notes
// // // //             </button>
// // // //             <button
// // // //               onClick={() => setCurrentSection(4)}
// // // //               className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-sm ${currentSection === 4 ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
// // // //             >
// // // //               Points of Contact
// // // //             </button>
// // // //             <button
// // // //               onClick={() => setCurrentSection(5)}
// // // //               className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-sm ${currentSection === 5 ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
// // // //             >
// // // //               History
// // // //             </button>
// // // //           </div>
// // // //         </div>

// // // //         <div className="space-y-4 sm:space-y-6">
// // // //           {currentSection === 1 && (
// // // //             <div>
// // // //               <h3 className="text-base sm:text-lg font-medium mb-2">Company Details</h3>
// // // //               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
// // // //                 <div className="mb-3 sm:mb-4">
// // // //                   <label className="block text-xs sm:text-sm font-medium text-gray-700">Company Name</label>
// // // //                   {isEditing ? (
// // // //                     <input
// // // //                       type="text"
// // // //                       value={companyData.name}
// // // //                       onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
// // // //                       placeholder="Enter company name"
// // // //                       className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// // // //                     />
// // // //                   ) : (
// // // //                     <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(companyData.name)}</p>
// // // //                   )}
// // // //                 </div>
// // // //                 <div className="mb-3 sm:mb-4">
// // // //                   <label className="block text-xs sm:text-sm font-medium text-gray-700">Domain</label>
// // // //                   {isEditing ? (
// // // //                     <input
// // // //                       type="text"
// // // //                       value={companyData.domain}
// // // //                       onChange={(e) => setCompanyData({ ...companyData, domain: e.target.value })}
// // // //                       placeholder="Enter domain"
// // // //                       className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// // // //                     />
// // // //                   ) : (
// // // //                     <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(companyData.domain)}</p>
// // // //                   )}
// // // //                 </div>
// // // //                 <div className="mb-3 sm:mb-4">
// // // //                   <label className="block text-xs sm:text-sm font-medium text-gray-700">Phone</label>
// // // //                   {isEditing ? (
// // // //                     <input
// // // //                       type="text"
// // // //                       value={companyData.phone}
// // // //                       onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
// // // //                       placeholder="Enter phone number"
// // // //                       className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// // // //                     />
// // // //                   ) : (
// // // //                     <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(companyData.phone)}</p>
// // // //                   )}
// // // //                 </div>
// // // //                 <div className="mb-3 sm:mb-4">
// // // //                   <label className="block text-xs sm:text-sm font-medium text-gray-700">Email</label>
// // // //                   {isEditing ? (
// // // //                     <input
// // // //                       type="email"
// // // //                       value={companyData.email}
// // // //                       onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
// // // //                       placeholder="Enter email"
// // // //                       className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// // // //                     />
// // // //                   ) : (
// // // //                     <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(companyData.email)}</p>
// // // //                   )}
// // // //                 </div>
// // // //                 <div className="mb-3 sm:mb-4">
// // // //                   <label className="block text-xs sm:text-sm font-medium text-gray-700">City</label>
// // // //                   {isEditing ? (
// // // //                     <input
// // // //                       type="text"
// // // //                       value={companyData.city}
// // // //                       onChange={(e) => setCompanyData({ ...companyData, city: e.target.value })}
// // // //                       placeholder="Enter city"
// // // //                       className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// // // //                     />
// // // //                   ) : (
// // // //                     <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(companyData.city)}</p>
// // // //                   )}
// // // //                 </div>
// // // //               </div>
// // // //             </div>
// // // //           )}
// // // //           {currentSection === 2 && (
// // // //             <div>
// // // //               <h3 className="text-base sm:text-lg font-medium mb-2">Job Openings</h3>
// // // //               {isEditing && (
// // // //                 <div className="mb-4">
// // // //                   <h4 className="text-sm font-medium mb-2">Add New Job Opening</h4>
// // // //                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
// // // //                     <div>
// // // //                       <label className="block text-xs sm:text-sm font-medium text-gray-700">Job Title</label>
// // // //                       <input
// // // //                         type="text"
// // // //                         value={newJob.title}
// // // //                         onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
// // // //                         placeholder="Enter job title"
// // // //                         className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// // // //                       />
// // // //                     </div>
// // // //                     <div>
// // // //                       <label className="block text-xs sm:text-sm font-medium text-gray-700">Department</label>
// // // //                       <input
// // // //                         type="text"
// // // //                         value={newJob.department}
// // // //                         onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
// // // //                         placeholder="Enter department"
// // // //                         className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// // // //                       />
// // // //                     </div>
// // // //                     <div>
// // // //                       <label className="block text-xs sm:text-sm font-medium text-gray-700">Location</label>
// // // //                       <input
// // // //                         type="text"
// // // //                         value={newJob.location}
// // // //                         onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
// // // //                         placeholder="Enter location"
// // // //                         className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// // // //                       />
// // // //                     </div>
// // // //                     <div>
// // // //                       <label className="block text-xs sm:text-sm font-medium text-gray-700">Type</label>
// // // //                       <select
// // // //                         value={newJob.type}
// // // //                         onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
// // // //                         className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// // // //                       >
// // // //                         <option value="">Select type</option>
// // // //                         <option value="Full-time">Full-time</option>
// // // //                         <option value="Part-time">Part-time</option>
// // // //                         <option value="Contract">Contract</option>
// // // //                         <option value="Internship">Internship</option>
// // // //                       </select>
// // // //                     </div>
// // // //                     <div className="sm:col-span-2">
// // // //                       <label className="block text-xs sm:text-sm font-medium text-gray-700">Description</label>
// // // //                       <textarea
// // // //                         value={newJob.description}
// // // //                         onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
// // // //                         placeholder="Enter job description"
// // // //                         className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// // // //                         rows="4"
// // // //                       />
// // // //                     </div>
// // // //                     <div>
// // // //                       <label className="block text-xs sm:text-sm font-medium text-gray-700">Posted Date</label>
// // // //                       <input
// // // //                         type="date"
// // // //                         value={newJob.postedDate}
// // // //                         onChange={(e) => setNewJob({ ...newJob, postedDate: e.target.value })}
// // // //                         className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// // // //                       />
// // // //                     </div>
// // // //                     <div>
// // // //                       <label className="block text-xs sm:text-sm font-medium text-gray-700">Closing Date</label>
// // // //                       <input
// // // //                         type="date"
// // // //                         value={newJob.closingDate}
// // // //                         onChange={(e) => setNewJob({ ...newJob, closingDate: e.target.value })}
// // // //                         className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// // // //                       />
// // // //                     </div>
// // // //                     <div>
// // // //                       <label className="block text-xs sm:text-sm font-medium text-gray-700">Status</label>
// // // //                       <select
// // // //                         value={newJob.status}
// // // //                         onChange={(e) => setNewJob({ ...newJob, status: e.target.value })}
// // // //                         className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// // // //                       >
// // // //                         <option value="open">Open</option>
// // // //                         <option value="closed">Closed</option>
// // // //                       </select>
// // // //                     </div>
// // // //                   </div>
// // // //                   <div className="flex justify-end gap-2 mt-4">
// // // //                     <button
// // // //                       onClick={() =>
// // // //                         setNewJob({
// // // //                           title: "",
// // // //                           department: "",
// // // //                           location: "",
// // // //                           type: "",
// // // //                           description: "",
// // // //                           postedDate: "",
// // // //                           closingDate: "",
// // // //                           status: "open",
// // // //                         })
// // // //                       }
// // // //                       className="px-3 py-1 sm:px-4 sm:py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 text-sm"
// // // //                     >
// // // //                       Clear
// // // //                     </button>
// // // //                     <button
// // // //                       onClick={handleAddJobOpening}
// // // //                       className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
// // // //                     >
// // // //                       Add Job Opening
// // // //                     </button>
// // // //                   </div>
// // // //                 </div>
// // // //               )}
// // // //               <div>
// // // //                 <h4 className="text-sm font-medium mb-2">Existing Job Openings</h4>
// // // //                 {jobOpenings.length > 0 ? (
// // // //                   <div className="space-y-4">
// // // //                     {jobOpenings.map((job) => (
// // // //                       <div key={job.id} className="border border-gray-200 rounded-md p-3 sm:p-4 bg-gray-50">
// // // //                         <p className="text-sm font-medium text-gray-700">{job.title}</p>
// // // //                         <p className="text-xs sm:text-sm text-gray-600">Department: {job.department}</p>
// // // //                         <p className="text-xs sm:text-sm text-gray-600">Location: {job.location}</p>
// // // //                         <p className="text-xs sm:text-sm text-gray-600">Type: {job.type}</p>
// // // //                         <p className="text-xs sm:text-sm text-gray-600">Posted: {renderField(job.postedDate)}</p>
// // // //                         <p className="text-xs sm:text-sm text-gray-600">Closing: {renderField(job.closingDate)}</p>
// // // //                         <p className="text-xs sm:text-sm text-gray-600">Status: {job.status}</p>
// // // //                         <p className="text-xs sm:text-sm text-gray-600 mt-2">{job.description}</p>
// // // //                       </div>
// // // //                     ))}
// // // //                   </div>
// // // //                 ) : (
// // // //                   <p className="text-xs sm:text-sm text-gray-500">No job openings available.</p>
// // // //                 )}
// // // //               </div>
// // // //             </div>
// // // //           )}
// // // //           {currentSection === 3 && (
// // // //             <div>
// // // //               <h3 className="text-base sm:text-lg font-medium mb-2">Notes</h3>
// // // //               {isEditing && (
// // // //                 <>
// // // //                   <div className="mb-3 sm:mb-4">
// // // //                     <label className="block text-xs sm:text-sm font-medium text-gray-700">Note Type</label>
// // // //                     <select
// // // //                       value={noteType}
// // // //                       onChange={(e) => setNoteType(e.target.value)}
// // // //                       className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// // // //                     >
// // // //                       <option value="general">General Note</option>
// // // //                       <option value="meeting">Meeting Note</option>
// // // //                       <option value="call">Call Note</option>
// // // //                     </select>
// // // //                   </div>
// // // //                   <div className="mb-3 sm:mb-4">
// // // //                     <label className="block text-xs sm:text-sm font-medium text-gray-700">Note</label>
// // // //                     <textarea
// // // //                       value={newNote}
// // // //                       onChange={(e) => setNewNote(e.target.value)}
// // // //                       placeholder="Add your note here..."
// // // //                       className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// // // //                       rows="4"
// // // //                     />
// // // //                   </div>
// // // //                   <div className="flex justify-end gap-2 mb-3 sm:mb-4">
// // // //                     <button
// // // //                       onClick={() => {
// // // //                         setNewNote("");
// // // //                         setNoteType("general");
// // // //                       }}
// // // //                       className="px-3 py-1 sm:px-4 sm:py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 text-sm"
// // // //                     >
// // // //                       Clear
// // // //                     </button>
// // // //                     <button
// // // //                       onClick={handleAddNote}
// // // //                       disabled={!canUpdate || !newNote?.trim()}
// // // //                       className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md text-sm ${!canUpdate || !newNote?.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
// // // //                     >
// // // //                       Add Note
// // // //                     </button>
// // // //                   </div>
// // // //                 </>
// // // //               )}
// // // //               <div>
// // // //                 {companyData.notes && companyData.notes.length > 0 ? (
// // // //                   Object.entries(
// // // //                     companyData.notes.reduce((acc, note) => {
// // // //                       const noteDate = formatDateSafely(note.createdAt, "yyyy-MM-dd");
// // // //                       if (!acc[noteDate]) {
// // // //                         acc[noteDate] = [];
// // // //                       }
// // // //                       acc[noteDate].push(note);
// // // //                       return acc;
// // // //                     }, {})
// // // //                   )
// // // //                     .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
// // // //                     .map(([date, notes]) => (
// // // //                       <div key={date} className="mb-6">
// // // //                         <div className="sticky top-0 bg-white py-2 z-10">
// // // //                           <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-1">
// // // //                             {formatDateSafely(date, "MMMM d, yyyy")}
// // // //                           </h4>
// // // //                         </div>
// // // //                         <div className="space-y-3 sm:space-y-4 mt-2">
// // // //                           {notes
// // // //                             .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
// // // //                             .map((note, index) => (
// // // //                               <div key={index} className="border border-gray-200 rounded-md p-3 sm:p-4 bg-gray-50">
// // // //                                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
// // // //                                   <p className="text-xs sm:text-sm font-medium text-gray-700">
// // // //                                     {formatNoteType(note.type)}
// // // //                                     <span className="text-xs text-gray-500 ml-2">
// // // //                                       {formatDateSafely(note.createdAt, "h:mm a")}
// // // //                                     </span>
// // // //                                   </p>
// // // //                                   <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-0">
// // // //                                     by {note.addedBy}
// // // //                                   </p>
// // // //                                 </div>
// // // //                                 <p className="text-xs sm:text-sm text-gray-900 mt-1">{note.content}</p>
// // // //                               </div>
// // // //                             ))}
// // // //                         </div>
// // // //                       </div>
// // // //                     ))
// // // //                 ) : (
// // // //                   <p className="text-xs sm:text-sm text-gray-500">No notes available.</p>
// // // //                 )}
// // // //               </div>
// // // //             </div>
// // // //           )}
// // // //           {currentSection === 4 && (
// // // //             <div>
// // // //               <h3 className="text-base sm:text-lg font-medium mb-2">Points of Contact</h3>
// // // //               {isEditing && (
// // // //                 <div className="mb-4">
// // // //                   <h4 className="text-sm font-medium mb-2">Add New Point of Contact</h4>
// // // //                   <div className="flex flex-col sm:flex-row gap-4 mb-4 overflow-x-auto">
// // // //                     <input
// // // //                       type="text"
// // // //                       value={newPOC.name}
// // // //                       onChange={(e) => handlePOCChange("name", e.target.value)}
// // // //                       placeholder="Contact Name"
// // // //                       disabled={(!canUpdate && company) || (!canCreate && !company)}
// // // //                       className="w-full min-w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 disabled:bg-gray-100"
// // // //                     />
// // // //                     <input
// // // //                       type="email"
// // // //                       value={newPOC.email}
// // // //                       onChange={(e) => handlePOCChange("email", e.target.value)}
// // // //                       placeholder="Email Address"
// // // //                       disabled={(!canUpdate && company) || (!canCreate && !company)}
// // // //                       className="w-full min-w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 disabled:bg-gray-100"
// // // //                     />
// // // //                     <select
// // // //                       value={newPOC.countryCode}
// // // //                       onChange={(e) => handlePOCChange("countryCode", e.target.value)}
// // // //                       disabled={(!canUpdate && company) || (!canCreate && !company)}
// // // //                       className="w-full min-w-40 sm:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 disabled:bg-gray-100"
// // // //                     >
// // // //                       {countryCodes.map((country) => (
// // // //                         <option key={country.code + country.label} value={country.code}>
// // // //                           {country.label}
// // // //                         </option>
// // // //                       ))}
// // // //                     </select>
// // // //                     <input
// // // //                       type="tel"
// // // //                       value={newPOC.mobile}
// // // //                       onChange={(e) => handlePOCChange("mobile", e.target.value)}
// // // //                       placeholder="Mobile Number (7-15 digits)"
// // // //                       disabled={(!canUpdate && company) || (!canCreate && !company)}
// // // //                       className="w-full min-w-40 sm:w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 disabled:bg-gray-100"
// // // //                     />
// // // //                   </div>
// // // //                   <button
// // // //                     type="button"
// // // //                     onClick={handleAddPOC}
// // // //                     disabled={(!canUpdate && company) || (!canCreate && !company)}
// // // //                     className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200 w-full sm:w-auto disabled:bg-gray-400 disabled:cursor-not-allowed"
// // // //                   >
// // // //                     Add POC
// // // //                   </button>
// // // //                 </div>
// // // //               )}
// // // //               <div>
// // // //                 <h4 className="text-sm font-medium mb-2">Existing Points of Contact</h4>
// // // //                 {pointsOfContact.length > 0 ? (
// // // //                   <div className="mt-4 max-h-40 overflow-y-auto border border-gray-300 rounded-md">
// // // //                     <table className="w-full text-left border-collapse">
// // // //                       <thead className="bg-gray-200 text-gray-700 sticky top-0">
// // // //                         <tr>
// // // //                           <th className="p-3 text-sm font-semibold min-w-40">Sr No</th>
// // // //                           <th className="p-3 text-sm font-semibold min-w-40">Name</th>
// // // //                           <th className="p-3 text-sm font-semibold min-w-40">Mobile</th>
// // // //                           <th className="p-3 text-sm font-semibold min-w-40">Email</th>
// // // //                           {isEditing && <th className="p-3 text-sm font-semibold min-w-40">Action</th>}
// // // //                         </tr>
// // // //                       </thead>
// // // //                       <tbody>
// // // //                         {pointsOfContact.map((poc, index) => (
// // // //                           <tr key={index} className="border-b hover:bg-gray-50">
// // // //                             <td className="p-3 text-gray-600">{index + 1}</td>
// // // //                             <td className="p-3 text-gray-600">{poc.name}</td>
// // // //                             <td className="p-3 text-gray-600">
// // // //                               {poc.countryCode} {poc.mobile}
// // // //                             </td>
// // // //                             <td className="p-3 text-gray-600">{poc.email}</td>
// // // //                             {isEditing && (
// // // //                               <td className="p-3">
// // // //                                 <button
// // // //                                   type="button"
// // // //                                   onClick={() => handleRemovePOC(index)}
// // // //                                   disabled={(!canUpdate && company) || (!canCreate && !company)}
// // // //                                   className="text-red-500 hover:text-red-700 font-bold disabled:text-gray-400 disabled:cursor-not-allowed"
// // // //                                 >
// // // //                                   ✕
// // // //                                 </button>
// // // //                               </td>
// // // //                             )}
// // // //                           </tr>
// // // //                         ))}
// // // //                       </tbody>
// // // //                     </table>
// // // //                   </div>
// // // //                 ) : (
// // // //                   <p className="text-xs sm:text-sm text-gray-500">No points of contact available.</p>
// // // //                 )}
// // // //               </div>
// // // //             </div>
// // // //           )}
// // // //           {currentSection === 5 && (
// // // //             <div>
// // // //               <h3 className="text-base sm:text-lg font-medium">History</h3>
// // // //               {canDisplay && companyData.history && companyData.history.length > 0 ? (
// // // //                 <div className="space-y-3 sm:space-y-4">
// // // //                   {companyData.history
// // // //                     .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
// // // //                     .map((entry, index) => (
// // // //                       <div key={index} className="rounded-md">
// // // //                         <p className="text-sm text-gray-900">
// // // //                           {entry.action} by {entry.performedBy} on{" "}
// // // //                           {formatDateSafely(entry.timestamp, "MMM d, yyyy h:mm a")}
// // // //                         </p>
// // // //                       </div>
// // // //                     ))}
// // // //                 </div>
// // // //               ) : (
// // // //                 <p className="text-sm text-gray-500">No history available</p>
// // // //               )}
// // // //             </div>
// // // //           )}
// // // //         </div>
// // // //         <div className="mt-6 flex justify-end gap-2">
// // // //           {isEditing ? (
// // // //             <>
// // // //               <button
// // // //                 onClick={() => {
// // // //                   setIsEditing(false);
// // // //                   setCompanyData({
// // // //                     ...company,
// // // //                     notes: Array.isArray(company.notes) ? company.notes : [],
// // // //                     tags: Array.isArray(company.tags) ? company.tags : [],
// // // //                     history: Array.isArray(company.history) ? company.history : [],
// // // //                     pointsOfContact: Array.isArray(company.pointsOfContact)
// // // //                       ? company.pointsOfContact
// // // //                       : [],
// // // //                   });
// // // //                   setPointsOfContact(
// // // //                     Array.isArray(company.pointsOfContact) ? company.pointsOfContact : []
// // // //                   );
// // // //                 }}
// // // //                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
// // // //               >
// // // //                 Cancel
// // // //               </button>
// // // //               <button
// // // //                 onClick={handleUpdateCompany}
// // // //                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
// // // //               >
// // // //                 Update Company
// // // //               </button>
// // // //             </>
// // // //           ) : (
// // // //             <>
// // // //               <button
// // // //                 onClick={onRequestClose}
// // // //                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
// // // //               >
// // // //                 Close
// // // //               </button>
// // // //               {company && canUpdate && (
// // // //                 <button
// // // //                   onClick={() => setIsEditing(true)}
// // // //                   className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
// // // //                 >
// // // //                   Edit
// // // //                 </button>
// // // //               )}
// // // //             </>
// // // //           )}
// // // //         </div>
// // // //       </Modal>
// // // //     </>
// // // //   );
// // // // };

// // // // export default CompanyModal;




// // // import { useState, useEffect } from "react";
// // // import { db } from "../../../../config/firebase.js";
// // // import {
// // //   getDocs,
// // //   collection,
// // //   deleteDoc,
// // //   doc,
// // //   query,
// // //   orderBy,
// // //   addDoc,
// // //   updateDoc,
// // //   where,
// // // } from "firebase/firestore";
// // // import { useAuth } from "../../../../context/AuthContext.jsx";
// // // import Modal from "react-modal";
// // // import { format } from "date-fns";
// // // import { ToastContainer, toast } from "react-toastify";
// // // import "react-toastify/dist/ReactToastify.css";

// // // Modal.setAppElement("#root");

// // // const countryCodes = [
// // //   { code: "+1", label: "USA (+1)" },
// // //   { code: "+1", label: "Canada (+1)" },
// // //   { code: "+7", label: "Russia (+7)" },
// // //   { code: "+91", label: "India (+91)" },
// // // ];

// // // const CompanyModal = ({ isOpen, onRequestClose, company, rolePermissions, availableTags = [], callSchedules, handleDeleteSchedule }) => {
// // //   const [currentSection, setCurrentSection] = useState(1);
// // //   const [isEditing, setIsEditing] = useState(false);
// // //   const [newNote, setNewNote] = useState("");
// // //   const [noteType, setNoteType] = useState("general");
// // //   const [jobOpenings, setJobOpenings] = useState([]);
// // //   const [newJob, setNewJob] = useState({
// // //     title: "",
// // //     department: "",
// // //     location: "",
// // //     type: "",
// // //     description: "",
// // //     postedDate: "",
// // //     closingDate: "",
// // //     status: "open",
// // //   });
// // //   const [newPOC, setNewPOC] = useState({ name: "", countryCode: "+91", mobile: "", email: "" });
// // //   const [pointsOfContact, setPointsOfContact] = useState([]);
// // //   const { user } = useAuth();
// // //   const [notes, setNotes] = useState([]);

// // //   const canUpdate = rolePermissions?.Companies?.update || false;
// // //   const canDisplay = rolePermissions?.Companies?.display || false;
// // //   const canCreate = rolePermissions?.Companies?.create || false;

// // //   const [companyData, setCompanyData] = useState({
// // //     ...company,
// // //     tags: Array.isArray(company?.tags) ? company.tags : [],
// // //     history: Array.isArray(company?.history) ? company.history : [],
// // //     pointsOfContact: Array.isArray(company?.pointsOfContact) ? company.pointsOfContact : [],
// // //   });

// // //   const formatDateSafely = (dateString, formatString) => {
// // //     if (!dateString) return "Not available";
// // //     const date = new Date(dateString);
// // //     if (isNaN(date.getTime())) return "Invalid date";
// // //     return format(date, formatString);
// // //   };

// // //   const formatNoteType = (type) => {
// // //     switch (type) {
// // //       case "general":
// // //         return "General Note";
// // //       case "meeting":
// // //         return "Meeting Note";
// // //       case "call":
// // //         return "Call Note";
// // //       case "call-schedule":
// // //         return "Call Schedule";
// // //       default:
// // //         return type;
// // //     }
// // //   };

// // //   const renderField = (value, placeholder = "Not provided") => {
// // //     return value || placeholder;
// // //   };

// // //   const logActivity = async (action, details) => {
// // //     try {
// // //       const activityLog = {
// // //         action,
// // //         details: { companyId: company?.id || null, ...details },
// // //         timestamp: new Date().toISOString(),
// // //         userEmail: user?.email || "anonymous",
// // //         userId: user.uid,
// // //       };
// // //       await addDoc(collection(db, "activityLogs"), activityLog);
// // //     } catch (error) {
// // //       //console.error("Error logging activity:", error);
// // //     }
// // //   };

// // //   const validateEmail = (email) => {
// // //     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// // //   };

// // //   const validatePOCMobile = (mobile) => {
// // //     return /^\d{7,15}$/.test(mobile);
// // //   };

// // //   useEffect(() => {
// // //     if (company) {
// // //       setCompanyData({
// // //         ...company,
// // //         tags: Array.isArray(company.tags) ? company.tags : [],
// // //         history: Array.isArray(company.history) ? company.history : [],
// // //         pointsOfContact: Array.isArray(company.pointsOfContact) ? company.pointsOfContact : [],
// // //       });
// // //       setPointsOfContact(Array.isArray(company.pointsOfContact) ? company.pointsOfContact : []);
// // //       setIsEditing(false);

// // //       // Fetch notes from Firestore subcollection
// // //       const fetchNotes = async () => {
// // //         try {
// // //           const notesQuery = query(
// // //             collection(db, "Companies", company.id, "notes"),
// // //             orderBy("createdAt", "desc")
// // //           );
// // //           const notesSnapshot = await getDocs(notesQuery);
// // //           const fetchedNotes = notesSnapshot.docs.map((doc) => ({
// // //             id: doc.id,
// // //             ...doc.data(),
// // //           }));
// // //           setNotes(fetchedNotes);
// // //         } catch (error) {
// // //           //console.error("Error fetching notes:", error);
// // //           toast.error("Failed to fetch notes.");
// // //         }
// // //       };

// // //       // Fetch job openings from Firestore
// // //       const fetchJobOpenings = async () => {
// // //         try {
// // //           const jobQuery = query(
// // //             collection(db, "JobOpenings"),
// // //             where("companyId", "==", company.id),
// // //             orderBy("postedDate", "desc")
// // //           );
// // //           const jobSnapshot = await getDocs(jobQuery);
// // //           const jobs = jobSnapshot.docs.map((doc) => ({
// // //             id: doc.id,
// // //             ...doc.data(),
// // //           }));
// // //           setJobOpenings(jobs);
// // //         } catch (error) {
// // //           //console.error("Error fetching job openings:", error);
// // //           toast.error("Failed to fetch job openings.");
// // //         }
// // //       };

// // //       fetchNotes();
// // //       fetchJobOpenings();
// // //     } else {
// // //       setCompanyData({
// // //         name: "",
// // //         domain: "",
// // //         phone: "",
// // //         email: "",
// // //         city: "",
// // //         tags: [],
// // //         history: [],
// // //         pointsOfContact: [],
// // //       });
// // //       setPointsOfContact([]);
// // //       setNotes([]);
// // //       setJobOpenings([]);
// // //       setIsEditing(true);
// // //     }
// // //   }, [company]);

// // //   const handleAddNote = async () => {
// // //     if (!newNote.trim()) {
// // //       toast.error("Please add a note before submitting.");
// // //       return;
// // //     }

// // //     if (!canUpdate) {
// // //       toast.error("You don't have permission to update companies");
// // //       return;
// // //     }

// // //     const noteObject = {
// // //       content: newNote,
// // //       type: noteType,
// // //       createdAt: new Date().toISOString(),
// // //       addedBy: user?.displayName || user?.email || "Unknown User",
// // //     };

// // //     try {
// // //       const noteRef = await addDoc(collection(db, "Companies", company.id, "notes"), noteObject);
// // //       const historyEntry = {
// // //         action: `Added ${formatNoteType(noteType).toLowerCase()}: "${noteObject.content.slice(0, 50)}${noteObject.content.length > 50 ? "..." : ""}"`,
// // //         performedBy: user?.displayName || user?.email || "Unknown User",
// // //         timestamp: new Date().toISOString(),
// // //       };
// // //       const companyRef = doc(db, "Companies", company.id);
// // //       await updateDoc(companyRef, {
// // //         history: arrayUnion(historyEntry),
// // //         updatedAt: new Date().toISOString(),
// // //       });

// // //       setNotes([{ id: noteRef.id, ...noteObject }, ...notes]);
// // //       setCompanyData((prev) => ({
// // //         ...prev,
// // //         history: [...prev.history, historyEntry],
// // //       }));
// // //       setNewNote("");
// // //       setNoteType("general");
// // //       toast.success("Note added successfully!");
// // //     } catch (error) {
// // //       toast.error(`Failed to add note: ${error.message}`);
// // //     }
// // //   };

// // //   const handleAddJobOpening = async () => {
// // //     if (!newJob.title || !newJob.department || !newJob.location || !newJob.type) {
// // //       toast.error("Please fill in all required job opening fields.");
// // //       return;
// // //     }

// // //     if (!canUpdate) {
// // //       toast.error("You don't have permission to update companies");
// // //       return;
// // //     }

// // //     const jobData = {
// // //       ...newJob,
// // //       companyId: company.id,
// // //       postedDate: newJob.postedDate || new Date().toISOString().split("T")[0],
// // //       status: newJob.status || "open",
// // //     };

// // //     try {
// // //       const jobRef = await addDoc(collection(db, "JobOpenings"), jobData);
// // //       const historyEntry = {
// // //         action: `Added job opening: "${newJob.title}"`,
// // //         performedBy: user?.displayName || user?.email || "Unknown User",
// // //         timestamp: new Date().toISOString(),
// // //       };
// // //       const companyRef = doc(db, "Companies", company.id);
// // //       await updateDoc(companyRef, {
// // //         history: arrayUnion(historyEntry),
// // //         updatedAt: new Date().toISOString(),
// // //       });

// // //       setJobOpenings([...jobOpenings, { id: jobRef.id, ...jobData }]);
// // //       setCompanyData((prev) => ({
// // //         ...prev,
// // //         history: [...prev.history, historyEntry],
// // //       }));
// // //       setNewJob({
// // //         title: "",
// // //         department: "",
// // //         location: "",
// // //         type: "",
// // //         description: "",
// // //         postedDate: "",
// // //         closingDate: "",
// // //         status: "open",
// // //       });
// // //       toast.success("Job opening added successfully!");
// // //     } catch (error) {
// // //       toast.error(`Failed to add job opening: ${error.message}`);
// // //     }
// // //   };

// // //   const handleAddPOC = async () => {
// // //     if (!canUpdate && company) {
// // //       toast.error("You don't have permission to update points of contact");
// // //       return;
// // //     }
// // //     if (!canCreate && !company) {
// // //       toast.error("You don't have permission to create points of contact");
// // //       return;
// // //     }
// // //     if (
// // //       newPOC.name.trim() &&
// // //       validatePOCMobile(newPOC.mobile) &&
// // //       validateEmail(newPOC.email)
// // //     ) {
// // //       const updatedPOCs = [...pointsOfContact, { ...newPOC }];
// // //       const historyEntry = {
// // //         action: `Added point of contact: "${newPOC.name}"`,
// // //         performedBy: user?.displayName || user?.email || "Unknown User",
// // //         timestamp: new Date().toISOString(),
// // //       };
// // //       const updatedHistory = [...companyData.history, historyEntry];

// // //       try {
// // //         const companyRef = doc(db, "Companies", company.id);
// // //         await updateDoc(companyRef, {
// // //           pointsOfContact: updatedPOCs,
// // //           history: updatedHistory,
// // //           updatedAt: new Date().toISOString(),
// // //         });
// // //         setPointsOfContact(updatedPOCs);
// // //         setCompanyData((prev) => ({
// // //           ...prev,
// // //           pointsOfContact: updatedPOCs,
// // //           history: updatedHistory,
// // //         }));
// // //         setNewPOC({ name: "", countryCode: "+91", mobile: "", email: "" });
// // //         logActivity("ADD_POC", { pocName: newPOC.name });
// // //         toast.success("Point of contact added successfully!");
// // //       } catch (error) {
// // //         toast.error(`Failed to add point of contact: ${error.message}`);
// // //       }
// // //     } else {
// // //       toast.error("Please fill in all POC details correctly. Mobile number must be 7-15 digits, and email must be valid.");
// // //     }
// // //   };

// // //   const handleRemovePOC = async (index) => {
// // //     if (!canUpdate && company) {
// // //       toast.error("You don't have permission to update points of contact");
// // //       return;
// // //     }
// // //     if (!canCreate && !company) {
// // //       toast.error("You don't have permission to create points of contact");
// // //       return;
// // //     }
// // //     const pocName = pointsOfContact[index].name;
// // //     const updatedPOCs = pointsOfContact.filter((_, i) => i !== index);
// // //     const historyEntry = {
// // //       action: `Removed point of contact: "${pocName}"`,
// // //       performedBy: user?.displayName || user?.email || "Unknown User",
// // //       timestamp: new Date().toISOString(),
// // //     };
// // //     const updatedHistory = [...companyData.history, historyEntry];

// // //     try {
// // //       const companyRef = doc(db, "Companies", company.id);
// // //       await updateDoc(companyRef, {
// // //         pointsOfContact: updatedPOCs,
// // //         history: updatedHistory,
// // //         updatedAt: new Date().toISOString(),
// // //       });
// // //       setPointsOfContact(updatedPOCs);
// // //       setCompanyData((prev) => ({
// // //         ...prev,
// // //         pointsOfContact: updatedPOCs,
// // //         history: updatedHistory,
// // //       }));
// // //       logActivity("REMOVE_POC", { pocName });
// // //       toast.success("Point of contact removed successfully!");
// // //     } catch (error) {
// // //       toast.error(`Failed to remove point of contact: ${error.message}`);
// // //     }
// // //   };

// // //   const handlePOCChange = (field, value) => {
// // //     if (!canUpdate && company) {
// // //       toast.error("You don't have permission to update POC details");
// // //       return;
// // //     }
// // //     if (!canCreate && !company) {
// // //       toast.error("You don't have permission to create POC details");
// // //       return;
// // //     }
// // //     if (field === "mobile") {
// // //       value = value.replace(/\D/g, "").slice(0, 15);
// // //     }
// // //     setNewPOC((prev) => {
// // //       const updated = { ...prev, [field]: value };
// // //       logActivity("CHANGE_NEW_POC", { field, value });
// // //       return updated;
// // //     });
// // //   };

// // //   const handleUpdateCompany = async () => {
// // //     if (!companyData.name) {
// // //       toast.error("Company name is required.");
// // //       return;
// // //     }

// // //     if (!canUpdate) {
// // //       toast.error("You don't have permission to update companies");
// // //       return;
// // //     }

// // //     try {
// // //       const companyRef = doc(db, "Companies", company.id);
// // //       const historyEntry = {
// // //         action: `Updated company details`,
// // //         performedBy: user?.displayName || user?.email || "Unknown User",
// // //         timestamp: new Date().toISOString(),
// // //       };
// // //       const updatedHistory = [...companyData.history, historyEntry];

// // //       await updateDoc(companyRef, {
// // //         ...companyData,
// // //         history: updatedHistory,
// // //         pointsOfContact: pointsOfContact,
// // //         updatedAt: new Date().toISOString(),
// // //       });
// // //       setCompanyData((prev) => ({
// // //         ...prev,
// // //         history: updatedHistory,
// // //       }));
// // //       setIsEditing(false);
// // //       toast.success("Company updated successfully!");
// // //     } catch (error) {
// // //       toast.error(`Failed to update company: ${error.message}`);
// // //     }
// // //   };

// // //   return (
// // //     <>
// // //       <ToastContainer position="top-right" autoClose={3000} />
// // //       <Modal
// // //         isOpen={isOpen}
// // //         onRequestClose={onRequestClose}
// // //         className="fixed inset-0 mx-auto my-4 max-w-full sm:max-w-3xl w-[95%] sm:w-full bg-white rounded-lg shadow-lg p-4 sm:p-6 overflow-y-auto max-h-[90vh]"
// // //         overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
// // //         style={{
// // //           content: {
// // //             opacity: isOpen ? 1 : 0,
// // //             transition: "opacity 0.3s ease-in-out",
// // //           },
// // //         }}
// // //       >
// // //         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
// // //           <h2 className="text-base sm:text-lg font-semibold">
// // //             {companyData.name || (isEditing ? "Edit Company" : "View Company")}
// // //           </h2>
// // //         </div>
// // //         <div className="flex flex-col sm:flex-row justify-between mb-4 flex-wrap gap-2">
// // //           <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4">
// // //             <button
// // //               onClick={() => setCurrentSection(1)}
// // //               className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-sm ${currentSection === 1 ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
// // //             >
// // //               Company Details
// // //             </button>
// // //             <button
// // //               onClick={() => setCurrentSection(2)}
// // //               className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-sm ${currentSection === 2 ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
// // //             >
// // //               Job Openings
// // //             </button>
// // //             <button
// // //               onClick={() => setCurrentSection(3)}
// // //               className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-sm ${currentSection === 3 ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
// // //             >
// // //               Notes
// // //             </button>
// // //             <button
// // //               onClick={() => setCurrentSection(4)}
// // //               className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-sm ${currentSection === 4 ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
// // //             >
// // //               Points of Contact
// // //             </button>
// // //             <button
// // //               onClick={() => setCurrentSection(5)}
// // //               className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-sm ${currentSection === 5 ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
// // //             >
// // //               History
// // //             </button>
// // //             <button
// // //               onClick={() => setCurrentSection(6)}
// // //               className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-sm ${currentSection === 6 ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
// // //             >
// // //               Call Schedules
// // //             </button>
// // //           </div>
// // //         </div>

// // //         <div className="space-y-4 sm:space-y-6">
// // //           {currentSection === 1 && (
// // //             <div>
// // //               <h3 className="text-base sm:text-lg font-medium mb-2">Company Details</h3>
// // //               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
// // //                 <div className="mb-3 sm:mb-4">
// // //                   <label className="block text-xs sm:text-sm font-medium text-gray-700">Company Name</label>
// // //                   {isEditing ? (
// // //                     <input
// // //                       type="text"
// // //                       value={companyData.name}
// // //                       onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
// // //                       placeholder="Enter company name"
// // //                       className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// // //                     />
// // //                   ) : (
// // //                     <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(companyData.name)}</p>
// // //                   )}
// // //                 </div>
// // //                 <div className="mb-3 sm:mb-4">
// // //                   <label className="block text-xs sm:text-sm font-medium text-gray-700">Domain</label>
// // //                   {isEditing ? (
// // //                     <input
// // //                       type="text"
// // //                       value={companyData.domain}
// // //                       onChange={(e) => setCompanyData({ ...companyData, domain: e.target.value })}
// // //                       placeholder="Enter domain"
// // //                       className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// // //                     />
// // //                   ) : (
// // //                     <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(companyData.domain)}</p>
// // //                   )}
// // //                 </div>
// // //                 <div className="mb-3 sm:mb-4">
// // //                   <label className="block text-xs sm:text-sm font-medium text-gray-700">Phone</label>
// // //                   {isEditing ? (
// // //                     <input
// // //                       type="text"
// // //                       value={companyData.phone}
// // //                       onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
// // //                       placeholder="Enter phone number"
// // //                       className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// // //                     />
// // //                   ) : (
// // //                     <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(companyData.phone)}</p>
// // //                   )}
// // //                 </div>
// // //                 <div className="mb-3 sm:mb-4">
// // //                   <label className="block text-xs sm:text-sm font-medium text-gray-700">Email</label>
// // //                   {isEditing ? (
// // //                     <input
// // //                       type="email"
// // //                       value={companyData.email}
// // //                       onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
// // //                       placeholder="Enter email"
// // //                       className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// // //                     />
// // //                   ) : (
// // //                     <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(companyData.email)}</p>
// // //                   )}
// // //                 </div>
// // //                 <div className="mb-3 sm:mb-4">
// // //                   <label className="block text-xs sm:text-sm font-medium text-gray-700">City</label>
// // //                   {isEditing ? (
// // //                     <input
// // //                       type="text"
// // //                       value={companyData.city}
// // //                       onChange={(e) => setCompanyData({ ...companyData, city: e.target.value })}
// // //                       placeholder="Enter city"
// // //                       className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// // //                     />
// // //                   ) : (
// // //                     <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(companyData.city)}</p>
// // //                   )}
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           )}
// // //           {currentSection === 2 && (
// // //             <div>
// // //               <h3 className="text-base sm:text-lg font-medium mb-2">Job Openings</h3>
// // //               {isEditing && (
// // //                 <div className="mb-4">
// // //                   <h4 className="text-sm font-medium mb-2">Add New Job Opening</h4>
// // //                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
// // //                     <div>
// // //                       <label className="block text-xs sm:text-sm font-medium text-gray-700">Job Title</label>
// // //                       <input
// // //                         type="text"
// // //                         value={newJob.title}
// // //                         onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
// // //                         placeholder="Enter job title"
// // //                         className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// // //                       />
// // //                     </div>
// // //                     <div>
// // //                       <label className="block text-xs sm:text-sm font-medium text-gray-700">Department</label>
// // //                       <input
// // //                         type="text"
// // //                         value={newJob.department}
// // //                         onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
// // //                         placeholder="Enter department"
// // //                         className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// // //                       />
// // //                     </div>
// // //                     <div>
// // //                       <label className="block text-xs sm:text-sm font-medium text-gray-700">Location</label>
// // //                       <input
// // //                         type="text"
// // //                         value={newJob.location}
// // //                         onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
// // //                         placeholder="Enter location"
// // //                         className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// // //                       />
// // //                     </div>
// // //                     <div>
// // //                       <label className="block text-xs sm:text-sm font-medium text-gray-700">Type</label>
// // //                       <select
// // //                         value={newJob.type}
// // //                         onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
// // //                         className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// // //                       >
// // //                         <option value="">Select type</option>
// // //                         <option value="Full-time">Full-time</option>
// // //                         <option value="Part-time">Part-time</option>
// // //                         <option value="Contract">Contract</option>
// // //                         <option value="Internship">Internship</option>
// // //                       </select>
// // //                     </div>
// // //                     <div className="sm:col-span-2">
// // //                       <label className="block text-xs sm:text-sm font-medium text-gray-700">Description</label>
// // //                       <textarea
// // //                         value={newJob.description}
// // //                         onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
// // //                         placeholder="Enter job description"
// // //                         className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// // //                         rows="4"
// // //                       />
// // //                     </div>
// // //                     <div>
// // //                       <label className="block text-xs sm:text-sm font-medium text-gray-700">Posted Date</label>
// // //                       <input
// // //                         type="date"
// // //                         value={newJob.postedDate}
// // //                         onChange={(e) => setNewJob({ ...newJob, postedDate: e.target.value })}
// // //                         className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// // //                       />
// // //                     </div>
// // //                     <div>
// // //                       <label className="block text-xs sm:text-sm font-medium text-gray-700">Closing Date</label>
// // //                       <input
// // //                         type="date"
// // //                         value={newJob.closingDate}
// // //                         onChange={(e) => setNewJob({ ...newJob, closingDate: e.target.value })}
// // //                         className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// // //                       />
// // //                     </div>
// // //                     <div>
// // //                       <label className="block text-xs sm:text-sm font-medium text-gray-700">Status</label>
// // //                       <select
// // //                         value={newJob.status}
// // //                         onChange={(e) => setNewJob({ ...newJob, status: e.target.value })}
// // //                         className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// // //                       >
// // //                         <option value="open">Open</option>
// // //                         <option value="closed">Closed</option>
// // //                       </select>
// // //                     </div>
// // //                   </div>
// // //                   <div className="flex justify-end gap-2 mt-4">
// // //                     <button
// // //                       onClick={() =>
// // //                         setNewJob({
// // //                           title: "",
// // //                           department: "",
// // //                           location: "",
// // //                           type: "",
// // //                           description: "",
// // //                           postedDate: "",
// // //                           closingDate: "",
// // //                           status: "open",
// // //                         })
// // //                       }
// // //                       className="px-3 py-1 sm:px-4 sm:py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 text-sm"
// // //                     >
// // //                       Clear
// // //                     </button>
// // //                     <button
// // //                       onClick={handleAddJobOpening}
// // //                       className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
// // //                     >
// // //                       Add Job Opening
// // //                     </button>
// // //                   </div>
// // //                 </div>
// // //               )}
// // //               <div>
// // //                 <h4 className="text-sm font-medium mb-2">Existing Job Openings</h4>
// // //                 {jobOpenings.length > 0 ? (
// // //                   <div className="space-y-4">
// // //                     {jobOpenings.map((job) => (
// // //                       <div key={job.id} className="border border-gray-200 rounded-md p-3 sm:p-4 bg-gray-50">
// // //                         <p className="text-sm font-medium text-gray-700">{job.title}</p>
// // //                         <p className="text-xs sm:text-sm text-gray-600">Department: {job.department}</p>
// // //                         <p className="text-xs sm:text-sm text-gray-600">Location: {job.location}</p>
// // //                         <p className="text-xs sm:text-sm text-gray-600">Type: {job.type}</p>
// // //                         <p className="text-xs sm:text-sm text-gray-600">Posted: {renderField(job.postedDate)}</p>
// // //                         <p className="text-xs sm:text-sm text-gray-600">Closing: {renderField(job.closingDate)}</p>
// // //                         <p className="text-xs sm:text-sm text-gray-600">Status: {job.status}</p>
// // //                         <p className="text-xs sm:text-sm text-gray-600 mt-2">{job.description}</p>
// // //                       </div>
// // //                     ))}
// // //                   </div>
// // //                 ) : (
// // //                   <p className="text-xs sm:text-sm text-gray-500">No job openings available.</p>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           )}
// // //           {currentSection === 3 && (
// // //             <div>
// // //               <h3 className="text-base sm:text-lg font-medium mb-2">Notes</h3>
// // //               {isEditing && (
// // //                 <>
// // //                   <div className="mb-3 sm:mb-4">
// // //                     <label className="block text-xs sm:text-sm font-medium text-gray-700">Note Type</label>
// // //                     <select
// // //                       value={noteType}
// // //                       onChange={(e) => setNoteType(e.target.value)}
// // //                       className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// // //                     >
// // //                       <option value="general">General Note</option>
// // //                       <option value="meeting">Meeting Note</option>
// // //                       <option value="call">Call Note</option>
// // //                     </select>
// // //                   </div>
// // //                   <div className="mb-3 sm:mb-4">
// // //                     <label className="block text-xs sm:text-sm font-medium text-gray-700">Note</label>
// // //                     <textarea
// // //                       value={newNote}
// // //                       onChange={(e) => setNewNote(e.target.value)}
// // //                       placeholder="Add your note here..."
// // //                       className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// // //                       rows="4"
// // //                     />
// // //                   </div>
// // //                   <div className="flex justify-end gap-2 mb-3 sm:mb-4">
// // //                     <button
// // //                       onClick={() => {
// // //                         setNewNote("");
// // //                         setNoteType("general");
// // //                       }}
// // //                       className="px-3 py-1 sm:px-4 sm:py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 text-sm"
// // //                     >
// // //                       Clear
// // //                     </button>
// // //                     <button
// // //                       onClick={handleAddNote}
// // //                       disabled={!canUpdate || !newNote?.trim()}
// // //                       className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md text-sm ${!canUpdate || !newNote?.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
// // //                     >
// // //                       Add Note
// // //                     </button>
// // //                   </div>
// // //                 </>
// // //               )}
// // //               <div>
// // //                 {notes.length > 0 ? (
// // //                   Object.entries(
// // //                     notes.reduce((acc, note) => {
// // //                       const noteDate = formatDateSafely(note.createdAt, "yyyy-MM-dd");
// // //                       if (!acc[noteDate]) {
// // //                         acc[noteDate] = [];
// // //                       }
// // //                       acc[noteDate].push(note);
// // //                       return acc;
// // //                     }, {})
// // //                   )
// // //                     .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
// // //                     .map(([date, notes]) => (
// // //                       <div key={date} className="mb-6">
// // //                         <div className="sticky top-0 bg-white py-2 z-10">
// // //                           <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-1">
// // //                             {formatDateSafely(date, "MMMM d, yyyy")}
// // //                           </h4>
// // //                         </div>
// // //                         <div className="space-y-3 sm:space-y-4 mt-2">
// // //                           {notes
// // //                             .sort((a, by) => new Date(b.createdAt) - new Date(a.createdAt))
// // //                             .map((note, index) => (
// // //                               <div
// // //                                 key={note.id || index}
// // //                                 className={`border border-gray-200 rounded-md p-3 sm:p-4 ${
// // //                                   note.type === "call-schedule" ? "bg-blue-50" : "bg-gray-50"
// // //                                 }`}
// // //                               >
// // //                                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
// // //                                   <p className="text-xs sm:text-sm font-medium text-gray-700">
// // //                                     {formatNoteType(note.type)}
// // //                                     <span className="text-xs text-gray-500 ml-2">
// // //                                       {formatDateSafely(note.createdAt, "h:mm a")}
// // //                                     </span>
// // //                                   </p>
// // //                                   <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-0">
// // //                                     by {note.addedBy || note.createdBy || "Unknown User"}
// // //                                   </p>
// // //                                 </div>
// // //                                 {note.type === "call-schedule" ? (
// // //                                   <div className="text-xs sm:text-sm text-gray-900 mt-1">
// // //                                     <p><strong>Purpose:</strong> {note.content}</p>
// // //                                     <p><strong>Call Time:</strong> {note.callDate} {note.callTime}</p>
// // //                                     <p><strong>Reminder:</strong> {note.reminderTime} minutes before</p>
// // //                                     <p><strong>Status:</strong> {note.status}</p>
// // //                                   </div>
// // //                                 ) : (
// // //                                   <p className="text-xs sm:text-sm text-gray-900 mt-1">{note.content}</p>
// // //                                 )}
// // //                               </div>
// // //                             ))}
// // //                         </div>
// // //                       </div>
// // //                     ))
// // //                 ) : (
// // //                   <p className="text-xs sm:text-sm text-gray-500">No notes available.</p>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           )}
// // //           {currentSection === 4 && (
// // //             <div>
// // //               <h3 className="text-base sm:text-lg font-medium mb-2">Points of Contact</h3>
// // //               {isEditing && (
// // //                 <div className="mb-4">
// // //                   <h4 className="text-sm font-medium mb-2">Add New Point of Contact</h4>
// // //                   <div className="flex flex-col sm:flex-row gap-4 mb-4 overflow-x-auto">
// // //                     <input
// // //                       type="text"
// // //                       value={newPOC.name}
// // //                       onChange={(e) => handlePOCChange("name", e.target.value)}
// // //                       placeholder="Contact Name"
// // //                       disabled={(!canUpdate && company) || (!canCreate && !company)}
// // //                       className="w-full min-w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 disabled:bg-gray-100"
// // //                     />
// // //                     <input
// // //                       type="email"
// // //                       value={newPOC.email}
// // //                       onChange={(e) => handlePOCChange("email", e.target.value)}
// // //                       placeholder="Email Address"
// // //                       disabled={(!canUpdate && company) || (!canCreate && !company)}
// // //                       className="w-full min-w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 disabled:bg-gray-100"
// // //                     />
// // //                     <select
// // //                       value={newPOC.countryCode}
// // //                       onChange={(e) => handlePOCChange("countryCode", e.target.value)}
// // //                       disabled={(!canUpdate && company) || (!canCreate && !company)}
// // //                       className="w-full min-w-40 sm:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 disabled:bg-gray-100"
// // //                     >
// // //                       {countryCodes.map((country) => (
// // //                         <option key={country.code + country.label} value={country.code}>
// // //                           {country.label}
// // //                         </option>
// // //                       ))}
// // //                     </select>
// // //                     <input
// // //                       type="tel"
// // //                       value={newPOC.mobile}
// // //                       onChange={(e) => handlePOCChange("mobile", e.target.value)}
// // //                       placeholder="Mobile Number (7-15 digits)"
// // //                       disabled={(!canUpdate && company) || (!canCreate && !company)}
// // //                       className="w-full min-w-40 sm:w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 disabled:bg-gray-100"
// // //                     />
// // //                   </div>
// // //                   <button
// // //                     type="button"
// // //                     onClick={handleAddPOC}
// // //                     disabled={(!canUpdate && company) || (!canCreate && !company)}
// // //                     className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200 w-full sm:w-auto disabled:bg-gray-400 disabled:cursor-not-allowed"
// // //                   >
// // //                     Add POC
// // //                   </button>
// // //                 </div>
// // //               )}
// // //               <div>
// // //                 <h4 className="text-sm font-medium mb-2">Existing Points of Contact</h4>
// // //                 {pointsOfContact.length > 0 ? (
// // //                   <div className="mt-4 max-h-40 overflow-y-auto border border-gray-300 rounded-md">
// // //                     <table className="w-full text-left border-collapse">
// // //                       <thead className="bg-gray-200 text-gray-700 sticky top-0">
// // //                         <tr>
// // //                           <th className="p-3 text-sm font-semibold min-w-40">Sr No</th>
// // //                           <th className="p-3 text-sm font-semibold min-w-40">Name</th>
// // //                           <th className="p-3 text-sm font-semibold min-w-40">Mobile</th>
// // //                           <th className="p-3 text-sm font-semibold min-w-40">Email</th>
// // //                           {isEditing && <th className="p-3 text-sm font-semibold min-w-40">Action</th>}
// // //                         </tr>
// // //                       </thead>
// // //                       <tbody>
// // //                         {pointsOfContact.map((poc, index) => (
// // //                           <tr key={index} className="border-b hover:bg-gray-50">
// // //                             <td className="p-3 text-gray-600">{index + 1}</td>
// // //                             <td className="p-3 text-gray-600">{poc.name}</td>
// // //                             <td className="p-3 text-gray-600">
// // //                               {poc.countryCode} {poc.mobile}
// // //                             </td>
// // //                             <td className="p-3 text-gray-600">{poc.email}</td>
// // //                             {isEditing && (
// // //                               <td className="p-3">
// // //                                 <button
// // //                                   type="button"
// // //                                   onClick={() => handleRemovePOC(index)}
// // //                                   disabled={(!canUpdate && company) || (!canCreate && !company)}
// // //                                   className="text-red-500 hover:text-red-700 font-bold disabled:text-gray-400 disabled:cursor-not-allowed"
// // //                                 >
// // //                                   ✕
// // //                                 </button>
// // //                               </td>
// // //                             )}
// // //                           </tr>
// // //                         ))}
// // //                       </tbody>
// // //                     </table>
// // //                   </div>
// // //                 ) : (
// // //                   <p className="text-xs sm:text-sm text-gray-500">No points of contact available.</p>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           )}
// // //           {currentSection === 5 && (
// // //             <div>
// // //               <h3 className="text-base sm:text-lg font-medium">History</h3>
// // //               {canDisplay && companyData.history && companyData.history.length > 0 ? (
// // //                 <div className="space-y-3 sm:space-y-4">
// // //                   {companyData.history
// // //                     .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
// // //                     .map((entry, index) => (
// // //                       <div key={index} className="rounded-md">
// // //                         <p className="text-sm text-gray-900">
// // //                           {entry.action} by {entry.performedBy} on{" "}
// // //                           {formatDateSafely(entry.timestamp, "MMM d, yyyy h:mm a")}
// // //                         </p>
// // //                       </div>
// // //                     ))}
// // //                 </div>
// // //               ) : (
// // //                 <p className="text-sm text-gray-500">No history available</p>
// // //               )}
// // //             </div>
// // //           )}
// // //           {currentSection === 6 && (
// // //             <div>
// // //               <h3 className="text-base sm:text-lg font-medium mb-2">Call Schedules</h3>
// // //               <div>
// // //                 {callSchedules && callSchedules.length > 0 ? (
// // //                   <div className="space-y-4">
// // //                     {callSchedules.map((schedule) => (
// // //                       <div key={schedule.id} className="border border-gray-200 rounded-md p-3 sm:p-4 bg-blue-50">
// // //                         <p className="text-sm font-medium text-gray-700">Call Schedule</p>
// // //                         <p className="text-xs sm:text-sm text-gray-600">Purpose: {schedule.content}</p>
// // //                         <p className="text-xs sm:text-sm text-gray-600">Call Time: {schedule.callDate} {schedule.callTime}</p>
// // //                         <p className="text-xs sm:text-sm text-gray-600">Reminder: {schedule.reminderTime} minutes before</p>
// // //                         <p className="text-xs sm:text-sm text-gray-600">Status: {schedule.status}</p>
// // //                         <p className="text-xs sm:text-sm text-gray-600">Created by: {schedule.createdBy}</p>
// // //                         <p className="text-xs sm:text-sm text-gray-600">
// // //                           Created at: {formatDateSafely(schedule.createdAt, "MMM d, yyyy h:mm a")}
// // //                         </p>
// // //                         {canUpdate && (
// // //                           <button
// // //                             onClick={() => handleDeleteSchedule(schedule.id)}
// // //                             className="mt-2 text-red-600 hover:text-red-800 text-sm"
// // //                           >
// // //                             Delete
// // //                           </button>
// // //                         )}
// // //                       </div>
// // //                     ))}
// // //                   </div>
// // //                 ) : (
// // //                   <p className="text-xs sm:text-sm text-gray-500">No call schedules available.</p>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           )}
// // //         </div>
// // //         <div className="mt-6 flex justify-end gap-2">
// // //           {isEditing ? (
// // //             <>
// // //               <button
// // //                 onClick={() => {
// // //                   setIsEditing(false);
// // //                   setCompanyData({
// // //                     ...company,
// // //                     tags: Array.isArray(company.tags) ? company.tags : [],
// // //                     history: Array.isArray(company.history) ? company.history : [],
// // //                     pointsOfContact: Array.isArray(company.pointsOfContact)
// // //                       ? company.pointsOfContact
// // //                       : [],
// // //                   });
// // //                   setPointsOfContact(
// // //                     Array.isArray(company.pointsOfContact) ? company.pointsOfContact : []
// // //                   );
// // //                 }}
// // //                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
// // //               >
// // //                 Cancel
// // //               </button>
// // //               <button
// // //                 onClick={handleUpdateCompany}
// // //                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
// // //               >
// // //                 Update Company
// // //               </button>
// // //             </>
// // //           ) : (
// // //             <>
// // //               <button
// // //                 onClick={onRequestClose}
// // //                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
// // //               >
// // //                 Close
// // //               </button>
// // //               {company && canUpdate && (
// // //                 <button
// // //                   onClick={() => setIsEditing(true)}
// // //                   className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
// // //                 >
// // //                   Edit
// // //                 </button>
// // //               )}
// // //             </>
// // //           )}
// // //         </div>
// // //       </Modal>
// // //     </>
// // //   );
// // // };

// // // export default CompanyModal;


// // //                 // className="px-4 py-2 border border-gray-300 rounded-md text


// // import { useState, useEffect } from "react";
// // import { db } from "../../../../config/firebase.js";
// // import {
// //   getDocs,
// //   collection,
// //   deleteDoc,
// //   doc,
// //   query,
// //   orderBy,
// //   addDoc,
// //   updateDoc,
// //   where,
// //   arrayUnion,
// //   serverTimestamp,
// // } from "firebase/firestore";
// // import { useAuth } from "../../../../context/AuthContext.jsx";
// // import Modal from "react-modal";
// // import { format } from "date-fns";
// // import { ToastContainer, toast } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";

// // Modal.setAppElement("#root");

// // const countryCodes = [
// //   { code: "+1", label: "USA (+1)" },
// //   { code: "+1", label: "Canada (+1)" },
// //   { code: "+7", label: "Russia (+7)" },
// //   { code: "+91", label: "India (+91)" },
// // ];

// // const CompanyModal = ({ isOpen, onRequestClose, company, rolePermissions, availableTags = [], callSchedules, handleDeleteSchedule }) => {
// //   const [currentSection, setCurrentSection] = useState(1);
// //   const [isEditing, setIsEditing] = useState(false);
// //   const [newNote, setNewNote] = useState("");
// //   const [noteType, setNoteType] = useState("general");
// //   const [callScheduleForm, setCallScheduleForm] = useState({
// //     callDate: "",
// //     callTime: "",
// //     purpose: "",
// //     reminderTime: "15",
// //   });
// //   const [jobOpenings, setJobOpenings] = useState([]);
// //   const [newJob, setNewJob] = useState({
// //     title: "",
// //     department: "",
// //     location: "",
// //     type: "",
// //     description: "",
// //     postedDate: "",
// //     closingDate: "",
// //     status: "open",
// //   });
// //   const [newPOC, setNewPOC] = useState({ name: "", countryCode: "+91", mobile: "", email: "" });
// //   const [pointsOfContact, setPointsOfContact] = useState([]);
// //   const { user } = useAuth();
// //   const [notes, setNotes] = useState([]);

// //   const canUpdate = rolePermissions?.Companies?.update || false;
// //   const canDisplay = rolePermissions?.Companies?.display || false;
// //   const canCreate = rolePermissions?.Companies?.create || false;

// //   const [companyData, setCompanyData] = useState({
// //     ...company,
// //     tags: Array.isArray(company?.tags) ? company.tags : [],
// //     history: Array.isArray(company?.history) ? company.history : [],
// //     pointsOfContact: Array.isArray(company?.pointsOfContact) ? company.pointsOfContact : [],
// //   });

// //   const formatDateSafely = (dateString, formatString) => {
// //     if (!dateString) return "Not available";
// //     const date = new Date(dateString);
// //     if (isNaN(date.getTime())) return "Invalid date";
// //     return format(date, formatString);
// //   };

// //   const formatNoteType = (type) => {
// //     switch (type) {
// //       case "general":
// //         return "General Note";
// //       case "meeting":
// //         return "Meeting Note";
// //       case "call":
// //         return "Call Note";
// //       case "call-schedule":
// //         return "Call Schedule";
// //       default:
// //         return type;
// //     }
// //   };

// //   const renderField = (value, placeholder = "Not provided") => {
// //     return value || placeholder;
// //   };

// //   const logActivity = async (action, details) => {
// //     try {
// //       const activityLog = {
// //         action,
// //         details: { companyId: company?.id || null, ...details },
// //         timestamp: new Date().toISOString(),
// //         userEmail: user?.email || "anonymous",
// //         userId: user.uid,
// //       };
// //       await addDoc(collection(db, "activityLogs"), activityLog);
// //     } catch (error) {
// //       //console.error("Error logging activity:", error);
// //     }
// //   };

// //   const validateEmail = (email) => {
// //     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// //   };

// //   const validatePOCMobile = (mobile) => {
// //     return /^\d{7,15}$/.test(mobile);
// //   };

// //   useEffect(() => {
// //     if (company) {
// //       setCompanyData({
// //         ...company,
// //         tags: Array.isArray(company.tags) ? company.tags : [],
// //         history: Array.isArray(company.history) ? company.history : [],
// //         pointsOfContact: Array.isArray(company.pointsOfContact) ? company.pointsOfContact : [],
// //       });
// //       setPointsOfContact(Array.isArray(company.pointsOfContact) ? company.pointsOfContact : []);
// //       setIsEditing(false);

// //       // Fetch notes from Firestore subcollection
// //       const fetchNotes = async () => {
// //         try {
// //           const notesQuery = query(
// //             collection(db, "Companies", company.id, "notes"),
// //             orderBy("createdAt", "desc")
// //           );
// //           const notesSnapshot = await getDocs(notesQuery);
// //           const fetchedNotes = notesSnapshot.docs.map((doc) => ({
// //             id: doc.id,
// //             ...doc.data(),
// //           }));
// //           setNotes(fetchedNotes);
// //         } catch (error) {
// //           //console.error("Error fetching notes:", error);
// //           toast.error("Failed to fetch notes.");
// //         }
// //       };

// //       // Fetch job openings from Firestore
// //       const fetchJobOpenings = async () => {
// //         try {
// //           const jobQuery = query(
// //             collection(db, "JobOpenings"),
// //             where("companyId", "==", company.id),
// //             orderBy("postedDate", "desc")
// //           );
// //           const jobSnapshot = await getDocs(jobQuery);
// //           const jobs = jobSnapshot.docs.map((doc) => ({
// //             id: doc.id,
// //             ...doc.data(),
// //           }));
// //           setJobOpenings(jobs);
// //         } catch (error) {
// //           //console.error("Error fetching job openings:", error);
// //           toast.error("Failed to fetch job openings.");
// //         }
// //       };

// //       fetchNotes();
// //       fetchJobOpenings();
// //     } else {
// //       setCompanyData({
// //         name: "",
// //         domain: "",
// //         phone: "",
// //         email: "",
// //         city: "",
// //         tags: [],
// //         history: [],
// //         pointsOfContact: [],
// //       });
// //       setPointsOfContact([]);
// //       setNotes([]);
// //       setJobOpenings([]);
// //       setIsEditing(true);
// //     }
// //   }, [company]);

// //   const handleAddNote = async () => {
// //     if (!canUpdate) {
// //       toast.error("You don't have permission to update companies");
// //       return;
// //     }

// //     if (noteType === "call-schedule") {
// //       const { callDate, callTime, purpose, reminderTime } = callScheduleForm;
// //       if (!callDate || !callTime || !purpose) {
// //         toast.error("Please fill all required call schedule fields.");
// //         return;
// //       }

// //       const noteObject = {
// //         noteType: "call-schedule",
// //         content: purpose,
// //         callDate,
// //         callTime,
// //         reminderTime,
// //         status: "scheduled",
// //         createdAt: serverTimestamp(),
// //         createdBy: user?.displayName || user?.email || "Unknown User",
// //       };

// //       try {
// //         const noteRef = await addDoc(collection(db, "Companies", company.id, "notes"), noteObject);
// //         const historyEntry = {
// //           action: `Added call schedule: "${purpose.slice(0, 50)}${purpose.length > 50 ? "..." : ""}" for ${callDate} ${callTime}`,
// //           performedBy: user?.displayName || user?.email || "Unknown User",
// //           timestamp: new Date().toISOString(),
// //         };
// //         const companyRef = doc(db, "Companies", company.id);
// //         await updateDoc(companyRef, {
// //           history: arrayUnion(historyEntry),
// //           updatedAt: new Date().toISOString(),
// //         });

// //         setNotes([{ id: noteRef.id, ...noteObject }, ...notes]);
// //         setCompanyData((prev) => ({
// //           ...prev,
// //           history: [...prev.history, historyEntry],
// //         }));
// //         setCallScheduleForm({
// //           callDate: "",
// //           callTime: "",
// //           purpose: "",
// //           reminderTime: "15",
// //         });
// //         setNoteType("general");
// //         toast.success("Call schedule added successfully!");
// //       } catch (error) {
// //         toast.error(`Failed to add call schedule: ${error.message}`);
// //       }
// //     } else {
// //       if (!newNote.trim()) {
// //         toast.error("Please add a note before submitting.");
// //         return;
// //       }

// //       const noteObject = {
// //         content: newNote,
// //         type: noteType,
// //         createdAt: serverTimestamp(),
// //         addedBy: user?.displayName || user?.email || "Unknown User",
// //       };

// //       try {
// //         const noteRef = await addDoc(collection(db, "Companies", company.id, "notes"), noteObject);
// //         const historyEntry = {
// //           action: `Added ${formatNoteType(noteType).toLowerCase()}: "${noteObject.content.slice(0, 50)}${noteObject.content.length > 50 ? "..." : ""}"`,
// //           performedBy: user?.displayName || user?.email || "Unknown User",
// //           timestamp: new Date().toISOString(),
// //         };
// //         const companyRef = doc(db, "Companies", company.id);
// //         await updateDoc(companyRef, {
// //           history: arrayUnion(historyEntry),
// //           updatedAt: new Date().toISOString(),
// //         });

// //         setNotes([{ id: noteRef.id, ...noteObject }, ...notes]);
// //         setCompanyData((prev) => ({
// //           ...prev,
// //           history: [...prev.history, historyEntry],
// //         }));
// //         setNewNote("");
// //         setNoteType("general");
// //         toast.success("Note added successfully!");
// //       } catch (error) {
// //         toast.error(`Failed to add note: ${error.message}`);
// //       }
// //     }
// //   };

// //   const handleAddJobOpening = async () => {
// //     if (!newJob.title || !newJob.department || !newJob.location || !newJob.type) {
// //       toast.error("Please fill in all required job opening fields.");
// //       return;
// //     }

// //     if (!canUpdate) {
// //       toast.error("You don't have permission to update companies");
// //       return;
// //     }

// //     const jobData = {
// //       ...newJob,
// //       companyId: company.id,
// //       postedDate: newJob.postedDate || new Date().toISOString().split("T")[0],
// //       status: newJob.status || "open",
// //     };

// //     try {
// //       const jobRef = await addDoc(collection(db, "JobOpenings"), jobData);
// //       const historyEntry = {
// //         action: `Added job opening: "${newJob.title}"`,
// //         performedBy: user?.displayName || user?.email || "Unknown User",
// //         timestamp: new Date().toISOString(),
// //       };
// //       const companyRef = doc(db, "Companies", company.id);
// //       await updateDoc(companyRef, {
// //         history: arrayUnion(historyEntry),
// //         updatedAt: new Date().toISOString(),
// //       });

// //       setJobOpenings([...jobOpenings, { id: jobRef.id, ...jobData }]);
// //       setCompanyData((prev) => ({
// //         ...prev,
// //         history: [...prev.history, historyEntry],
// //       }));
// //       setNewJob({
// //         title: "",
// //         department: "",
// //         location: "",
// //         type: "",
// //         description: "",
// //         postedDate: "",
// //         closingDate: "",
// //         status: "open",
// //       });
// //       toast.success("Job opening added successfully!");
// //     } catch (error) {
// //       toast.error(`Failed to add job opening: ${error.message}`);
// //     }
// //   };

// //   const handleAddPOC = async () => {
// //     if (!canUpdate && company) {
// //       toast.error("You don't have permission to update points of contact");
// //       return;
// //     }
// //     if (!canCreate && !company) {
// //       toast.error("You don't have permission to create points of contact");
// //       return;
// //     }
// //     if (
// //       newPOC.name.trim() &&
// //       validatePOCMobile(newPOC.mobile) &&
// //       validateEmail(newPOC.email)
// //     ) {
// //       const updatedPOCs = [...pointsOfContact, { ...newPOC }];
// //       const historyEntry = {
// //         action: `Added point of contact: "${newPOC.name}"`,
// //         performedBy: user?.displayName || user?.email || "Unknown User",
// //         timestamp: new Date().toISOString(),
// //       };
// //       const updatedHistory = [...companyData.history, historyEntry];

// //       try {
// //         const companyRef = doc(db, "Companies", company.id);
// //         await updateDoc(companyRef, {
// //           pointsOfContact: updatedPOCs,
// //           history: updatedHistory,
// //           updatedAt: new Date().toISOString(),
// //         });
// //         setPointsOfContact(updatedPOCs);
// //         setCompanyData((prev) => ({
// //           ...prev,
// //           pointsOfContact: updatedPOCs,
// //           history: updatedHistory,
// //         }));
// //         setNewPOC({ name: "", countryCode: "+91", mobile: "", email: "" });
// //         logActivity("ADD_POC", { pocName: newPOC.name });
// //         toast.success("Point of contact added successfully!");
// //       } catch (error) {
// //         toast.error(`Failed to add point of contact: ${error.message}`);
// //       }
// //     } else {
// //       toast.error("Please fill in all POC details correctly. Mobile number must be 7-15 digits, and email must be valid.");
// //     }
// //   };

// //   const handleRemovePOC = async (index) => {
// //     if (!canUpdate && company) {
// //       toast.error("You don't have permission to update points of contact");
// //       return;
// //     }
// //     if (!canCreate && !company) {
// //       toast.error("You don't have permission to create points of contact");
// //       return;
// //     }
// //     const pocName = pointsOfContact[index].name;
// //     const updatedPOCs = pointsOfContact.filter((_, i) => i !== index);
// //     const historyEntry = {
// //       action: `Removed point of contact: "${pocName}"`,
// //       performedBy: user?.displayName || user?.email || "Unknown User",
// //       timestamp: new Date().toISOString(),
// //     };
// //     const updatedHistory = [...companyData.history, historyEntry];

// //     try {
// //       const companyRef = doc(db, "Companies", company.id);
// //       await updateDoc(companyRef, {
// //         pointsOfContact: updatedPOCs,
// //         history: updatedHistory,
// //         updatedAt: new Date().toISOString(),
// //       });
// //       setPointsOfContact(updatedPOCs);
// //       setCompanyData((prev) => ({
// //         ...prev,
// //         pointsOfContact: updatedPOCs,
// //         history: updatedHistory,
// //       }));
// //       logActivity("REMOVE_POC", { pocName });
// //       toast.success("Point of contact removed successfully!");
// //     } catch (error) {
// //       toast.error(`Failed to remove point of contact: ${error.message}`);
// //     }
// //   };

// //   const handlePOCChange = (field, value) => {
// //     if (!canUpdate && company) {
// //       toast.error("You don't have permission to update POC details");
// //       return;
// //     }
// //     if (!canCreate && !company) {
// //       toast.error("You don't have permission to create POC details");
// //       return;
// //     }
// //     if (field === "mobile") {
// //       value = value.replace(/\D/g, "").slice(0, 15);
// //     }
// //     setNewPOC((prev) => {
// //       const updated = { ...prev, [field]: value };
// //       logActivity("CHANGE_NEW_POC", { field, value });
// //       return updated;
// //     });
// //   };

// //   const handleUpdateCompany = async () => {
// //     if (!companyData.name) {
// //       toast.error("Company name is required.");
// //       return;
// //     }

// //     if (!canUpdate) {
// //       toast.error("You don't have permission to update companies");
// //       return;
// //     }

// //     try {
// //       const companyRef = doc(db, "Companies", company.id);
// //       const historyEntry = {
// //         action: `Updated company details`,
// //         performedBy: user?.displayName || user?.email || "Unknown User",
// //         timestamp: new Date().toISOString(),
// //       };
// //       const updatedHistory = [...companyData.history, historyEntry];

// //       await updateDoc(companyRef, {
// //         ...companyData,
// //         history: updatedHistory,
// //         pointsOfContact: pointsOfContact,
// //         updatedAt: new Date().toISOString(),
// //       });
// //       setCompanyData((prev) => ({
// //         ...prev,
// //         history: updatedHistory,
// //       }));
// //       setIsEditing(false);
// //       toast.success("Company updated successfully!");
// //     } catch (error) {
// //       toast.error(`Failed to update company: ${error.message}`);
// //     }
// //   };

// //   return (
// //     <>
// //       <ToastContainer position="top-right" autoClose={3000} />
// //       <Modal
// //         isOpen={isOpen}
// //         onRequestClose={onRequestClose}
// //         className="fixed inset-0 mx-auto my-4 max-w-full sm:max-w-3xl w-[95%] sm:w-full bg-white rounded-lg shadow-lg p-4 sm:p-6 overflow-y-auto max-h-[90vh]"
// //         overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
// //         style={{
// //           content: {
// //             opacity: isOpen ? 1 : 0,
// //             transition: "opacity 0.3s ease-in-out",
// //           },
// //         }}
// //       >
// //         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
// //           <h2 className="text-base sm:text-lg font-semibold">
// //             {companyData.name || (isEditing ? "Edit Company" : "View Company")}
// //           </h2>
// //         </div>
// //         <div className="flex flex-col sm:flex-row justify-between mb-4 flex-wrap gap-2">
// //           <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4">
// //             <button
// //               onClick={() => setCurrentSection(1)}
// //               className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-sm ${currentSection === 1 ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
// //             >
// //               Company Details
// //             </button>
// //             <button
// //               onClick={() => setCurrentSection(2)}
// //               className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-sm ${currentSection === 2 ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
// //             >
// //               Job Openings
// //             </button>
// //             <button
// //               onClick={() => setCurrentSection(3)}
// //               className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-sm ${currentSection === 3 ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
// //             >
// //               Notes
// //             </button>
// //             <button
// //               onClick={() => setCurrentSection(4)}
// //               className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-sm ${currentSection === 4 ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
// //             >
// //               Points of Contact
// //             </button>
// //             <button
// //               onClick={() => setCurrentSection(5)}
// //               className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-sm ${currentSection === 5 ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
// //             >
// //               History
// //             </button>
// //             <button
// //               onClick={() => setCurrentSection(6)}
// //               className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-sm ${currentSection === 6 ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
// //             >
// //               Call Schedules
// //             </button>
// //           </div>
// //         </div>

// //         <div className="space-y-4 sm:space-y-6">
// //           {currentSection === 1 && (
// //             <div>
// //               <h3 className="text-base sm:text-lg font-medium mb-2">Company Details</h3>
// //               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
// //                 <div className="mb-3 sm:mb-4">
// //                   <label className="block text-xs sm:text-sm font-medium text-gray-700">Company Name</label>
// //                   {isEditing ? (
// //                     <input
// //                       type="text"
// //                       value={companyData.name}
// //                       onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
// //                       placeholder="Enter company name"
// //                       className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// //                     />
// //                   ) : (
// //                     <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(companyData.name)}</p>
// //                   )}
// //                 </div>
// //                 <div className="mb-3 sm:mb-4">
// //                   <label className="block text-xs sm:text-sm font-medium text-gray-700">Domain</label>
// //                   {isEditing ? (
// //                     <input
// //                       type="text"
// //                       value={companyData.domain}
// //                       onChange={(e) => setCompanyData({ ...companyData, domain: e.target.value })}
// //                       placeholder="Enter domain"
// //                       className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// //                     />
// //                   ) : (
// //                     <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(companyData.domain)}</p>
// //                   )}
// //                 </div>
// //                 <div className="mb-3 sm:mb-4">
// //                   <label className="block text-xs sm:text-sm font-medium text-gray-700">Phone</label>
// //                   {isEditing ? (
// //                     <input
// //                       type="text"
// //                       value={companyData.phone}
// //                       onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
// //                       placeholder="Enter phone number"
// //                       className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// //                     />
// //                   ) : (
// //                     <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(companyData.phone)}</p>
// //                   )}
// //                 </div>
// //                 <div className="mb-3 sm:mb-4">
// //                   <label className="block text-xs sm:text-sm font-medium text-gray-700">Email</label>
// //                   {isEditing ? (
// //                     <input
// //                       type="email"
// //                       value={companyData.email}
// //                       onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
// //                       placeholder="Enter email"
// //                       className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// //                     />
// //                   ) : (
// //                     <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(companyData.email)}</p>
// //                   )}
// //                 </div>
// //                 <div className="mb-3 sm:mb-4">
// //                   <label className="block text-xs sm:text-sm font-medium text-gray-700">City</label>
// //                   {isEditing ? (
// //                     <input
// //                       type="text"
// //                       value={companyData.city}
// //                       onChange={(e) => setCompanyData({ ...companyData, city: e.target.value })}
// //                       placeholder="Enter city"
// //                       className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// //                     />
// //                   ) : (
// //                     <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(companyData.city)}</p>
// //                   )}
// //                 </div>
// //               </div>
// //             </div>
// //           )}
// //           {currentSection === 2 && (
// //             <div>
// //               <h3 className="text-base sm:text-lg font-medium mb-2">Job Openings</h3>
// //               {isEditing && (
// //                 <div className="mb-4">
// //                   <h4 className="text-sm font-medium mb-2">Add New Job Opening</h4>
// //                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
// //                     <div>
// //                       <label className="block text-xs sm:text-sm font-medium text-gray-700">Job Title</label>
// //                       <input
// //                         type="text"
// //                         value={newJob.title}
// //                         onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
// //                         placeholder="Enter job title"
// //                         className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// //                       />
// //                     </div>
// //                     <div>
// //                       <label className="block text-xs sm:text-sm font-medium text-gray-700">Department</label>
// //                       <input
// //                         type="text"
// //                         value={newJob.department}
// //                         onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
// //                         placeholder="Enter department"
// //                         className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// //                       />
// //                     </div>
// //                     <div>
// //                       <label className="block text-xs sm:text-sm font-medium text-gray-700">Location</label>
// //                       <input
// //                         type="text"
// //                         value={newJob.location}
// //                         onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
// //                         placeholder="Enter location"
// //                         className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// //                       />
// //                     </div>
// //                     <div>
// //                       <label className="block text-xs sm:text-sm font-medium text-gray-700">Type</label>
// //                       <select
// //                         value={newJob.type}
// //                         onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
// //                         className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// //                       >
// //                         <option value="">Select type</option>
// //                         <option value="Full-time">Full-time</option>
// //                         <option value="Part-time">Part-time</option>
// //                         <option value="Contract">Contract</option>
// //                         <option value="Internship">Internship</option>
// //                       </select>
// //                     </div>
// //                     <div className="sm:col-span-2">
// //                       <label className="block text-xs sm:text-sm font-medium text-gray-700">Description</label>
// //                       <textarea
// //                         value={newJob.description}
// //                         onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
// //                         placeholder="Enter job description"
// //                         className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// //                         rows="4"
// //                       />
// //                     </div>
// //                     <div>
// //                       <label className="block text-xs sm:text-sm font-medium text-gray-700">Posted Date</label>
// //                       <input
// //                         type="date"
// //                         value={newJob.postedDate}
// //                         onChange={(e) => setNewJob({ ...newJob, postedDate: e.target.value })}
// //                         className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// //                       />
// //                     </div>
// //                     <div>
// //                       <label className="block text-xs sm:text-sm font-medium text-gray-700">Closing Date</label>
// //                       <input
// //                         type="date"
// //                         value={newJob.closingDate}
// //                         onChange={(e) => setNewJob({ ...newJob, closingDate: e.target.value })}
// //                         className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// //                       />
// //                     </div>
// //                     <div>
// //                       <label className="block text-xs sm:text-sm font-medium text-gray-700">Status</label>
// //                       <select
// //                         value={newJob.status}
// //                         onChange={(e) => setNewJob({ ...newJob, status: e.target.value })}
// //                         className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// //                       >
// //                         <option value="open">Open</option>
// //                         <option value="closed">Closed</option>
// //                       </select>
// //                     </div>
// //                   </div>
// //                   <div className="flex justify-end gap-2 mt-4">
// //                     <button
// //                       onClick={() =>
// //                         setNewJob({
// //                           title: "",
// //                           department: "",
// //                           location: "",
// //                           type: "",
// //                           description: "",
// //                           postedDate: "",
// //                           closingDate: "",
// //                           status: "open",
// //                         })
// //                       }
// //                       className="px-3 py-1 sm:px-4 sm:py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 text-sm"
// //                     >
// //                       Clear
// //                     </button>
// //                     <button
// //                       onClick={handleAddJobOpening}
// //                       className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
// //                     >
// //                       Add Job Opening
// //                     </button>
// //                   </div>
// //                 </div>
// //               )}
// //               <div>
// //                 <h4 className="text-sm font-medium mb-2">Existing Job Openings</h4>
// //                 {jobOpenings.length > 0 ? (
// //                   <div className="space-y-4">
// //                     {jobOpenings.map((job) => (
// //                       <div key={job.id} className="border border-gray-200 rounded-md p-3 sm:p-4 bg-gray-50">
// //                         <p className="text-sm font-medium text-gray-700">{job.title}</p>
// //                         <p className="text-xs sm:text-sm text-gray-600">Department: {job.department}</p>
// //                         <p className="text-xs sm:text-sm text-gray-600">Location: {job.location}</p>
// //                         <p className="text-xs sm:text-sm text-gray-600">Type: {job.type}</p>
// //                         <p className="text-xs sm:text-sm text-gray-600">Posted: {renderField(job.postedDate)}</p>
// //                         <p className="text-xs sm:text-sm text-gray-600">Closing: {renderField(job.closingDate)}</p>
// //                         <p className="text-xs sm:text-sm text-gray-600">Status: {job.status}</p>
// //                         <p className="text-xs sm:text-sm text-gray-600 mt-2">{job.description}</p>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 ) : (
// //                   <p className="text-xs sm:text-sm text-gray-500">No job openings available.</p>
// //                 )}
// //               </div>
// //             </div>
// //           )}
// //           {currentSection === 3 && (
// //             <div>
// //               <h3 className="text-base sm:text-lg font-medium mb-2">Notes</h3>
// //               {isEditing && (
// //                 <>
// //                   <div className="mb-3 sm:mb-4">
// //                     <label className="block text-xs sm:text-sm font-medium text-gray-700">Note Type</label>
// //                     <select
// //                       value={noteType}
// //                       onChange={(e) => setNoteType(e.target.value)}
// //                       className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// //                       disabled={!canUpdate}
// //                     >
// //                       <option value="general">General Note</option>
// //                       <option value="meeting">Meeting Note</option>
// //                       <option value="call">Call Note</option>
// //                       <option value="call-schedule">Call Schedule</option>
// //                     </select>
// //                   </div>
// //                   {noteType === "call-schedule" ? (
// //                     <div className="space-y-3 sm:space-y-4">
// //                       <div>
// //                         <label className="block text-xs sm:text-sm font-medium text-gray-700">Call Date</label>
// //                         <input
// //                           type="date"
// //                           value={callScheduleForm.callDate}
// //                           onChange={(e) =>
// //                             setCallScheduleForm({ ...callScheduleForm, callDate: e.target.value })
// //                           }
// //                           className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// //                           disabled={!canUpdate}
// //                         />
// //                       </div>
// //                       <div>
// //                         <label className="block text-xs sm:text-sm font-medium text-gray-700">Call Time</label>
// //                         <input
// //                           type="time"
// //                           value={callScheduleForm.callTime}
// //                           onChange={(e) =>
// //                             setCallScheduleForm({ ...callScheduleForm, callTime: e.target.value })
// //                           }
// //                           className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// //                           disabled={!canUpdate}
// //                         />
// //                       </div>
// //                       <div>
// //                         <label className="block text-xs sm:text-sm font-medium text-gray-700">Purpose</label>
// //                         <textarea
// //                           value={callScheduleForm.purpose}
// //                           onChange={(e) =>
// //                             setCallScheduleForm({ ...callScheduleForm, purpose: e.target.value })
// //                           }
// //                           placeholder="Enter call purpose"
// //                           className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// //                           rows="4"
// //                           disabled={!canUpdate}
// //                         />
// //                       </div>
// //                       <div>
// //                         <label className="block text-xs sm:text-sm font-medium text-gray-700">Reminder (minutes before)</label>
// //                         <select
// //                           value={callScheduleForm.reminderTime}
// //                           onChange={(e) =>
// //                             setCallScheduleForm({ ...callScheduleForm, reminderTime: e.target.value })
// //                           }
// //                           className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// //                           disabled={!canUpdate}
// //                         >
// //                           <option value="5">5 minutes</option>
// //                           <option value="15">15 minutes</option>
// //                           <option value="30">30 minutes</option>
// //                           <option value="60">1 hour</option>
// //                         </select>
// //                       </div>
// //                     </div>
// //                   ) : (
// //                     <div className="mb-3 sm:mb-4">
// //                       <label className="block text-xs sm:text-sm font-medium text-gray-700">Note</label>
// //                       <textarea
// //                         value={newNote}
// //                         onChange={(e) => setNewNote(e.target.value)}
// //                         placeholder="Add your note here..."
// //                         className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// //                         rows="4"
// //                         disabled={!canUpdate}
// //                       />
// //                     </div>
// //                   )}
// //                   <div className="flex justify-end gap-2 mb-3 sm:mb-4">
// //                     <button
// //                       onClick={() => {
// //                         setNewNote("");
// //                         setNoteType("general");
// //                         setCallScheduleForm({
// //                           callDate: "",
// //                           callTime: "",
// //                           purpose: "",
// //                           reminderTime: "15",
// //                         });
// //                       }}
// //                       className="px-3 py-1 sm:px-4 sm:py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 text-sm"
// //                       disabled={!canUpdate}
// //                     >
// //                       Clear
// //                     </button>
// //                     <button
// //                       onClick={handleAddNote}
// //                       disabled={
// //                         !canUpdate ||
// //                         (noteType === "call-schedule"
// //                           ? !callScheduleForm.callDate || !callScheduleForm.callTime || !callScheduleForm.purpose
// //                           : !newNote?.trim())
// //                       }
// //                       className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md text-sm ${
// //                         !canUpdate ||
// //                         (noteType === "call-schedule"
// //                           ? !callScheduleForm.callDate || !callScheduleForm.callTime || !callScheduleForm.purpose
// //                           : !newNote?.trim())
// //                           ? "bg-gray-400 cursor-not-allowed"
// //                           : "bg-blue-600 text-white hover:bg-blue-700"
// //                       }`}
// //                     >
// //                       {noteType === "call-schedule" ? "Add Call Schedule" : "Add Note"}
// //                     </button>
// //                   </div>
// //                 </>
// //               )}
// //               <div>
// //                 {notes.length > 0 ? (
// //                   Object.entries(
// //                     notes.reduce((acc, note) => {
// //                       const noteDate = formatDateSafely(note.createdAt, "yyyy-MM-dd");
// //                       if (!acc[noteDate]) {
// //                         acc[noteDate] = [];
// //                       }
// //                       acc[noteDate].push(note);
// //                       return acc;
// //                     }, {})
// //                   )
// //                     .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
// //                     .map(([date, notes]) => (
// //                       <div key={date} className="mb-6">
// //                         <div className="sticky top-0 bg-white py-2 z-10">
// //                           <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-1">
// //                             {formatDateSafely(date, "MMMM d, yyyy")}
// //                           </h4>
// //                         </div>
// //                         <div className="space-y-3 sm:space-y-4 mt-2">
// //                           {notes
// //                             .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
// //                             .map((note, index) => (
// //                               <div
// //                                 key={note.id || index}
// //                                 className={`border border-gray-200 rounded-md p-3 sm:p-4 ${
// //                                   note.noteType === "call-schedule" ? "bg-blue-50" : "bg-gray-50"
// //                                 }`}
// //                               >
// //                                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
// //                                   <p className="text-xs sm:text-sm font-medium text-gray-700">
// //                                     {formatNoteType(note.noteType)}
// //                                     <span className="text-xs text-gray-500 ml-2">
// //                                       {formatDateSafely(note.createdAt, "h:mm a")}
// //                                     </span>
// //                                   </p>
// //                                   <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-0">
// //                                     by {note.addedBy || note.createdBy || "Unknown User"}
// //                                   </p>
// //                                 </div>
// //                                 {note.noteType === "call-schedule" ? (
// //                                   <div className="text-xs sm:text-sm text-gray-900 mt-1">
// //                                     <p><strong>Purpose:</strong> {note.content}</p>
// //                                     <p><strong>Call Time:</strong> {note.callDate} {note.callTime}</p>
// //                                     <p><strong>Reminder:</strong> {note.reminderTime} minutes before</p>
// //                                     <p><strong>Status:</strong> {note.status}</p>
// //                                   </div>
// //                                 ) : (
// //                                   <p className="text-xs sm:text-sm text-gray-900 mt-1">{note.content}</p>
// //                                 )}
// //                               </div>
// //                             ))}
// //                         </div>
// //                       </div>
// //                     ))
// //                 ) : (
// //                   <p className="text-xs sm:text-sm text-gray-500">No notes available.</p>
// //                 )}
// //               </div>
// //             </div>
// //           )}
// //           {currentSection === 4 && (
// //             <div>
// //               <h3 className="text-base sm:text-lg font-medium mb-2">Points of Contact</h3>
// //               {isEditing && (
// //                 <div className="mb-4">
// //                   <h4 className="text-sm font-medium mb-2">Add New Point of Contact</h4>
// //                   <div className="flex flex-col sm:flex-row gap-4 mb-4 overflow-x-auto">
// //                     <input
// //                       type="text"
// //                       value={newPOC.name}
// //                       onChange={(e) => handlePOCChange("name", e.target.value)}
// //                       placeholder="Contact Name"
// //                       disabled={(!canUpdate && company) || (!canCreate && !company)}
// //                       className="w-full min-w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 disabled:bg-gray-100"
// //                     />
// //                     <input
// //                       type="email"
// //                       value={newPOC.email}
// //                       onChange={(e) => handlePOCChange("email", e.target.value)}
// //                       placeholder="Email Address"
// //                       disabled={(!canUpdate && company) || (!canCreate && !company)}
// //                       className="w-full min-w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 disabled:bg-gray-100"
// //                     />
// //                     <select
// //                       value={newPOC.countryCode}
// //                       onChange={(e) => handlePOCChange("countryCode", e.target.value)}
// //                       disabled={(!canUpdate && company) || (!canCreate && !company)}
// //                       className="w-full min-w-40 sm:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 disabled:bg-gray-100"
// //                     >
// //                       {countryCodes.map((country) => (
// //                         <option key={country.code + country.label} value={country.code}>
// //                           {country.label}
// //                         </option>
// //                       ))}
// //                     </select>
// //                     <input
// //                       type="tel"
// //                       value={newPOC.mobile}
// //                       onChange={(e) => handlePOCChange("mobile", e.target.value)}
// //                       placeholder="Mobile Number (7-15 digits)"
// //                       disabled={(!canUpdate && company) || (!canCreate && !company)}
// //                       className="w-full min-w-40 sm:w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 disabled:bg-gray-100"
// //                     />
// //                   </div>
// //                   <button
// //                     type="button"
// //                     onClick={handleAddPOC}
// //                     disabled={(!canUpdate && company) || (!canCreate && !company)}
// //                     className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200 w-full sm:w-auto disabled:bg-gray-400 disabled:cursor-not-allowed"
// //                   >
// //                     Add POC
// //                   </button>
// //                 </div>
// //               )}
// //               <div>
// //                 <h4 className="text-sm font-medium mb-2">Existing Points of Contact</h4>
// //                 {pointsOfContact.length > 0 ? (
// //                   <div className="mt-4 max-h-40 overflow-y-auto border border-gray-300 rounded-md">
// //                     <table className="w-full text-left border-collapse">
// //                       <thead className="bg-gray-200 text-gray-700 sticky top-0">
// //                         <tr>
// //                           <th className="p-3 text-sm font-semibold min-w-40">Sr No</th>
// //                           <th className="p-3 text-sm font-semibold min-w-40">Name</th>
// //                           <th className="p-3 text-sm font-semibold min-w-40">Mobile</th>
// //                           <th className="p-3 text-sm font-semibold min-w-40">Email</th>
// //                           {isEditing && <th className="p-3 text-sm font-semibold min-w-40">Action</th>}
// //                         </tr>
// //                       </thead>
// //                       <tbody>
// //                         {pointsOfContact.map((poc, index) => (
// //                           <tr key={index} className="border-b hover:bg-gray-50">
// //                             <td className="p-3 text-gray-600">{index + 1}</td>
// //                             <td className="p-3 text-gray-600">{poc.name}</td>
// //                             <td className="p-3 text-gray-600">
// //                               {poc.countryCode} {poc.mobile}
// //                             </td>
// //                             <td className="p-3 text-gray-600">{poc.email}</td>
// //                             {isEditing && (
// //                               <td className="p-3">
// //                                 <button
// //                                   type="button"
// //                                   onClick={() => handleRemovePOC(index)}
// //                                   disabled={(!canUpdate && company) || (!canCreate && !company)}
// //                                   className="text-red-500 hover:text-red-700 font-bold disabled:text-gray-400 disabled:cursor-not-allowed"
// //                                 >
// //                                   ✕
// //                                 </button>
// //                               </td>
// //                             )}
// //                           </tr>
// //                         ))}
// //                       </tbody>
// //                     </table>
// //                   </div>
// //                 ) : (
// //                   <p className="text-xs sm:text-sm text-gray-500">No points of contact available.</p>
// //                 )}
// //               </div>
// //             </div>
// //           )}
// //           {currentSection === 5 && (
// //             <div>
// //               <h3 className="text-base sm:text-lg font-medium">History</h3>
// //               {canDisplay && companyData.history && companyData.history.length > 0 ? (
// //                 <div className="space-y-3 sm:space-y-4">
// //                   {companyData.history
// //                     .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
// //                     .map((entry, index) => (
// //                       <div key={index} className="rounded-md">
// //                         <p className="text-sm text-gray-900">
// //                           {entry.action} by {entry.performedBy} on{" "}
// //                           {formatDateSafely(entry.timestamp, "MMM d, yyyy h:mm a")}
// //                         </p>
// //                       </div>
// //                     ))}
// //                 </div>
// //               ) : (
// //                 <p className="text-sm text-gray-500">No history available</p>
// //               )}
// //             </div>
// //           )}
// //           {currentSection === 6 && (
// //             <div>
// //               <h3 className="text-base sm:text-lg font-medium mb-2">Call Schedules</h3>
// //               <div>
// //                 {callSchedules && callSchedules.length > 0 ? (
// //                   <div className="space-y-4">
// //                     {callSchedules.map((schedule) => (
// //                       <div key={schedule.id} className="border border-gray-200 rounded-md p-3 sm:p-4 bg-blue-50">
// //                         <p className="text-sm font-medium text-gray-700">Call Schedule</p>
// //                         <p className="text-xs sm:text-sm text-gray-600">Purpose: {schedule.content}</p>
// //                         <p className="text-xs sm:text-sm text-gray-600">Call Time: {schedule.callDate} {schedule.callTime}</p>
// //                         <p className="text-xs sm:text-sm text-gray-600">Reminder: {schedule.reminderTime} minutes before</p>
// //                         <p className="text-xs sm:text-sm text-gray-600">Status: {schedule.status}</p>
// //                         <p className="text-xs sm:text-sm text-gray-600">Created by: {schedule.createdBy}</p>
// //                         <p className="text-xs sm:text-sm text-gray-600">
// //                           Created at: {formatDateSafely(schedule.createdAt, "MMM d, yyyy h:mm a")}
// //                         </p>
// //                         {canUpdate && (
// //                           <button
// //                             onClick={() => handleDeleteSchedule(schedule.id)}
// //                             className="mt-2 text-red-600 hover:text-red-800 text-sm"
// //                           >
// //                             Delete
// //                           </button>
// //                         )}
// //                       </div>
// //                     ))}
// //                   </div>
// //                 ) : (
// //                   <p className="text-xs sm:text-sm text-gray-500">No call schedules available.</p>
// //                 )}
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //         <div className="mt-6 flex justify-end gap-2">
// //           {isEditing ? (
// //             <>
// //               <button
// //                 onClick={() => {
// //                   setIsEditing(false);
// //                   setCompanyData({
// //                     ...company,
// //                     tags: Array.isArray(company.tags) ? company.tags : [],
// //                     history: Array.isArray(company.history) ? company.history : [],
// //                     pointsOfContact: Array.isArray(company.pointsOfContact)
// //                       ? company.pointsOfContact
// //                       : [],
// //                   });
// //                   setPointsOfContact(
// //                     Array.isArray(company.pointsOfContact) ? company.pointsOfContact : []
// //                   );
// //                 }}
// //                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 onClick={handleUpdateCompany}
// //                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
// //               >
// //                 Update Company
// //               </button>
// //             </>
// //           ) : (
// //             <>
// //               <button
// //                 onClick={onRequestClose}
// //                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
// //               >
// //                 Close
// //               </button>
// //               {company && canUpdate && (
// //                 <button
// //                   onClick={() => setIsEditing(true)}
// //                   className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
// //                 >
// //                   Edit
// //                 </button>
// //               )}
// //             </>
// //           )}
// //         </div>
// //       </Modal>
// //     </>
// //   );
// // };

// // export default CompanyModal;



// import { useState, useEffect } from "react";
// import { db } from "../../../../config/firebase.js";
// import {
//   getDocs,
//   collection,
//   deleteDoc,
//   doc,
//   query,
//   orderBy,
//   addDoc,
//   updateDoc,
//   where,
//   arrayUnion,
//   serverTimestamp,
// } from "firebase/firestore";
// import { useAuth } from "../../../../context/AuthContext.jsx";
// import Modal from "react-modal";
// import { format } from "date-fns";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Notes from "./Notes.jsx"; // Import the Notes component

// Modal.setAppElement("#root");

// const countryCodes = [
//   { code: "+1", label: "USA (+1)" },
//   { code: "+1", label: "Canada (+1)" },
//   { code: "+7", label: "Russia (+7)" },
//   { code: "+91", label: "India (+91)" },
// ];

// const CompanyModal = ({ isOpen, onRequestClose, company, rolePermissions, availableTags = [], callSchedules, handleDeleteSchedule }) => {
//   const [currentSection, setCurrentSection] = useState(1);
//   const [isEditing, setIsEditing] = useState(false);
//   const [newNote, setNewNote] = useState("");
//   const [noteType, setNoteType] = useState("general");
//   const [jobOpenings, setJobOpenings] = useState([]);
//   const [newJob, setNewJob] = useState({
//     title: "",
//     department: "",
//     location: "",
//     type: "",
//     description: "",
//     postedDate: "",
//     closingDate: "",
//     status: "open",
//   });
//   const [newPOC, setNewPOC] = useState({ name: "", countryCode: "+91", mobile: "", email: "" });
//   const [pointsOfContact, setPointsOfContact] = useState([]);
//   const { user } = useAuth();
//   const [notes, setNotes] = useState([]);

//   const canUpdate = rolePermissions?.Companies?.update || false;
//   const canDisplay = rolePermissions?.Companies?.display || false;
//   const canCreate = rolePermissions?.Companies?.create || false;

//   const [companyData, setCompanyData] = useState({
//     ...company,
//     tags: Array.isArray(company?.tags) ? company.tags : [],
//     history: Array.isArray(company?.history) ? company.history : [],
//     pointsOfContact: Array.isArray(company?.pointsOfContact) ? company.pointsOfContact : [],
//   });

//   const formatDateSafely = (dateString, formatString) => {
//     if (!dateString) return "Not available";
//     const date = dateString.toDate ? dateString.toDate() : new Date(dateString);
//     if (isNaN(date.getTime())) return "Invalid date";
//     return format(date, formatString);
//   };

//   const formatNoteType = (type) => {
//     switch (type) {
//       case "general":
//         return "General Note";
//       case "meeting":
//         return "Meeting Note";
//       case "call":
//         return "Call Note";
//       case "call-schedule":
//         return "Call Schedule";
//       default:
//         return type;
//     }
//   };

//   const renderField = (value, placeholder = "Not provided") => {
//     return value || placeholder;
//   };

//   const logActivity = async (action, details) => {
//     try {
//       const activityLog = {
//         action,
//         details: { companyId: company?.id || null, ...details },
//         timestamp: new Date().toISOString(),
//         userEmail: user?.email || "anonymous",
//         userId: user.uid,
//       };
//       await addDoc(collection(db, "activityLogs"), activityLog);
//     } catch (error) {
//       //console.error("Error logging activity:", error);
//     }
//   };

//   const validateEmail = (email) => {
//     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//   };

//   const validatePOCMobile = (mobile) => {
//     return /^\d{7,15}$/.test(mobile);
//   };

//   useEffect(() => {
//     if (company) {
//       setCompanyData({
//         ...company,
//         tags: Array.isArray(company.tags) ? company.tags : [],
//         history: Array.isArray(company.history) ? company.history : [],
//         pointsOfContact: Array.isArray(company.pointsOfContact) ? company.pointsOfContact : [],
//       });
//       setPointsOfContact(Array.isArray(company.pointsOfContact) ? company.pointsOfContact : []);
//       setIsEditing(false);

//       // Fetch notes from Firestore subcollection
//       const fetchNotes = async () => {
//         try {
//           const notesQuery = query(
//             collection(db, "Companies", company.id, "notes"),
//             orderBy("createdAt", "desc")
//           );
//           const notesSnapshot = await getDocs(notesQuery);
//           const fetchedNotes = notesSnapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
//           setNotes(fetchedNotes);
//         } catch (error) {
//           //console.error("Error fetching notes:", error);
//           toast.error("Failed to fetch notes.");
//         }
//       };

//       // Fetch job openings from Firestore
//       const fetchJobOpenings = async () => {
//         try {
//           const jobQuery = query(
//             collection(db, "JobOpenings"),
//             where("companyId", "==", company.id),
//             orderBy("postedDate", "desc")
//           );
//           const jobSnapshot = await getDocs(jobQuery);
//           const jobs = jobSnapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
//           setJobOpenings(jobs);
//         } catch (error) {
//           //console.error("Error fetching job openings:", error);
//           toast.error("Failed to fetch job openings.");
//         }
//       };

//       fetchNotes();
//       fetchJobOpenings();
//     } else {
//       setCompanyData({
//         name: "",
//         domain: "",
//         phone: "",
//         email: "",
//         city: "",
//         tags: [],
//         history: [],
//         pointsOfContact: [],
//       });
//       setPointsOfContact([]);
//       setNotes([]);
//       setJobOpenings([]);
//       setIsEditing(true);
//     }
//   }, [company]);

//   const handleAddNote = async (noteData) => {
//     if (!canUpdate) {
//       toast.error("You don't have permission to update companies");
//       return;
//     }

//     if (noteData.noteType === "call-schedule") {
//       const { callDate, callTime, purpose, reminderTime } = noteData;
//       const noteObject = {
//         noteType: "call-schedule",
//         content: purpose,
//         callDate,
//         callTime,
//         reminderTime,
//         status: "scheduled",
//         createdAt: serverTimestamp(),
//         createdBy: user?.displayName || user?.email || "Unknown User",
//       };

//       try {
//         const noteRef = await addDoc(collection(db, "Companies", company.id, "notes"), noteObject);
//         const historyEntry = {
//           action: `Added call schedule: "${purpose.slice(0, 50)}${purpose.length > 50 ? "..." : ""}" for ${callDate} ${callTime}`,
//           performedBy: user?.displayName || user?.email || "Unknown User",
//           timestamp: new Date().toISOString(),
//         };
//         const companyRef = doc(db, "Companies", company.id);
//         await updateDoc(companyRef, {
//           history: arrayUnion(historyEntry),
//           updatedAt: new Date().toISOString(),
//         });

//         setNotes([{ id: noteRef.id, ...noteObject }, ...notes]);
//         setCompanyData((prev) => ({
//           ...prev,
//           history: [...prev.history, historyEntry],
//         }));
//         toast.success("Call schedule added successfully!");
//       } catch (error) {
//         toast.error(`Failed to add call schedule: ${error.message}`);
//       }
//     } else {
//       const { content, noteType } = noteData;
//       const noteObject = {
//         content,
//         noteType,
//         createdAt: serverTimestamp(),
//         addedBy: user?.displayName || user?.email || "Unknown User",
//       };

//       try {
//         const noteRef = await addDoc(collection(db, "Companies", company.id, "notes"), noteObject);
//         const historyEntry = {
//           action: `Added ${formatNoteType(noteType).toLowerCase()}: "${noteObject.content.slice(0, 50)}${noteObject.content.length > 50 ? "..." : ""}"`,
//           performedBy: user?.displayName || user?.email || "Unknown User",
//           timestamp: new Date().toISOString(),
//         };
//         const companyRef = doc(db, "Companies", company.id);
//         await updateDoc(companyRef, {
//           history: arrayUnion(historyEntry),
//           updatedAt: new Date().toISOString(),
//         });

//         setNotes([{ id: noteRef.id, ...noteObject }, ...notes]);
//         setCompanyData((prev) => ({
//           ...prev,
//           history: [...prev.history, historyEntry],
//         }));
//         setNewNote("");
//         setNoteType("general");
//         toast.success("Note added successfully!");
//       } catch (error) {
//         toast.error(`Failed to add note: ${error.message}`);
//       }
//     }
//   };

//   const handleAddJobOpening = async () => {
//     if (!newJob.title || !newJob.department || !newJob.location || !newJob.type) {
//       toast.error("Please fill in all required job opening fields.");
//       return;
//     }

//     if (!canUpdate) {
//       toast.error("You don't have permission to update companies");
//       return;
//     }

//     const jobData = {
//       ...newJob,
//       companyId: company.id,
//       postedDate: newJob.postedDate || new Date().toISOString().split("T")[0],
//       status: newJob.status || "open",
//     };

//     try {
//       const jobRef = await addDoc(collection(db, "JobOpenings"), jobData);
//       const historyEntry = {
//         action: `Added job opening: "${newJob.title}"`,
//         performedBy: user?.displayName || user?.email || "Unknown User",
//         timestamp: new Date().toISOString(),
//       };
//       const companyRef = doc(db, "Companies", company.id);
//       await updateDoc(companyRef, {
//         history: arrayUnion(historyEntry),
//         updatedAt: new Date().toISOString(),
//       });

//       setJobOpenings([...jobOpenings, { id: jobRef.id, ...jobData }]);
//       setCompanyData((prev) => ({
//         ...prev,
//         history: [...prev.history, historyEntry],
//       }));
//       setNewJob({
//         title: "",
//         department: "",
//         location: "",
//         type: "",
//         description: "",
//         postedDate: "",
//         closingDate: "",
//         status: "open",
//       });
//       toast.success("Job opening added successfully!");
//     } catch (error) {
//       toast.error(`Failed to add job opening: ${error.message}`);
//     }
//   };

//   const handleAddPOC = async () => {
//     if (!canUpdate && company) {
//       toast.error("You don't have permission to update points of contact");
//       return;
//     }
//     if (!canCreate && !company) {
//       toast.error("You don't have permission to create points of contact");
//       return;
//     }
//     if (
//       newPOC.name.trim() &&
//       validatePOCMobile(newPOC.mobile) &&
//       validateEmail(newPOC.email)
//     ) {
//       const updatedPOCs = [...pointsOfContact, { ...newPOC }];
//       const historyEntry = {
//         action: `Added point of contact: "${newPOC.name}"`,
//         performedBy: user?.displayName || user?.email || "Unknown User",
//         timestamp: new Date().toISOString(),
//       };
//       const updatedHistory = [...companyData.history, historyEntry];

//       try {
//         const companyRef = doc(db, "Companies", company.id);
//         await updateDoc(companyRef, {
//           pointsOfContact: updatedPOCs,
//           history: updatedHistory,
//           updatedAt: new Date().toISOString(),
//         });
//         setPointsOfContact(updatedPOCs);
//         setCompanyData((prev) => ({
//           ...prev,
//           pointsOfContact: updatedPOCs,
//           history: updatedHistory,
//         }));
//         setNewPOC({ name: "", countryCode: "+91", mobile: "", email: "" });
//         logActivity("ADD_POC", { pocName: newPOC.name });
//         toast.success("Point of contact added successfully!");
//       } catch (error) {
//         toast.error(`Failed to add point of contact: ${error.message}`);
//       }
//     } else {
//       toast.error("Please fill in all POC details correctly. Mobile number must be 7-15 digits, and email must be valid.");
//     }
//   };

//   const handleRemovePOC = async (index) => {
//     if (!canUpdate && company) {
//       toast.error("You don't have permission to update points of contact");
//       return;
//     }
//     if (!canCreate && !company) {
//       toast.error("You don't have permission to create points of contact");
//       return;
//     }
//     const pocName = pointsOfContact[index].name;
//     const updatedPOCs = pointsOfContact.filter((_, i) => i !== index);
//     const historyEntry = {
//       action: `Removed point of contact: "${pocName}"`,
//       performedBy: user?.displayName || user?.email || "Unknown User",
//       timestamp: new Date().toISOString(),
//     };
//     const updatedHistory = [...companyData.history, historyEntry];

//     try {
//       const companyRef = doc(db, "Companies", company.id);
//       await updateDoc(companyRef, {
//         pointsOfContact: updatedPOCs,
//         history: updatedHistory,
//         updatedAt: new Date().toISOString(),
//       });
//       setPointsOfContact(updatedPOCs);
//       setCompanyData((prev) => ({
//         ...prev,
//         pointsOfContact: updatedPOCs,
//         history: updatedHistory,
//       }));
//       logActivity("REMOVE_POC", { pocName });
//       toast.success("Point of contact removed successfully!");
//     } catch (error) {
//       toast.error(`Failed to remove point of contact: ${error.message}`);
//     }
//   };

//   const handlePOCChange = (field, value) => {
//     if (!canUpdate && company) {
//       toast.error("You don't have permission to update POC details");
//       return;
//     }
//     if (!canCreate && !company) {
//       toast.error("You don't have permission to create POC details");
//       return;
//     }
//     if (field === "mobile") {
//       value = value.replace(/\D/g, "").slice(0, 15);
//     }
//     setNewPOC((prev) => {
//       const updated = { ...prev, [field]: value };
//       logActivity("CHANGE_NEW_POC", { field, value });
//       return updated;
//     });
//   };

//   const handleUpdateCompany = async () => {
//     if (!companyData.name) {
//       toast.error("Company name is required.");
//       return;
//     }

//     if (!canUpdate) {
//       toast.error("You don't have permission to update companies");
//       return;
//     }

//     try {
//       const companyRef = doc(db, "Companies", company.id);
//       const historyEntry = {
//         action: `Updated company details`,
//         performedBy: user?.displayName || user?.email || "Unknown User",
//         timestamp: new Date().toISOString(),
//       };
//       const updatedHistory = [...companyData.history, historyEntry];

//       await updateDoc(companyRef, {
//         ...companyData,
//         history: updatedHistory,
//         pointsOfContact: pointsOfContact,
//         updatedAt: new Date().toISOString(),
//       });
//       setCompanyData((prev) => ({
//         ...prev,
//         history: updatedHistory,
//       }));
//       setIsEditing(false);
//       toast.success("Company updated successfully!");
//     } catch (error) {
//       toast.error(`Failed to update company: ${error.message}`);
//     }
//   };

//   return (
//     <>
//       <ToastContainer position="top-right" autoClose={3000} />
//       <Modal
//         isOpen={isOpen}
//         onRequestClose={onRequestClose}
//         className="fixed inset-0 mx-auto my-4 max-w-full sm:max-w-3xl w-[95%] sm:w-full bg-white rounded-lg shadow-lg p-4 sm:p-6 overflow-y-auto max-h-[90vh]"
//         overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
//         style={{
//           content: {
//             opacity: isOpen ? 1 : 0,
//             transition: "opacity 0.3s ease-in-out",
//           },
//         }}
//       >
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
//           <h2 className="text-base sm:text-lg font-semibold">
//             {companyData.name || (isEditing ? "Edit Company" : "View Company")}
//           </h2>
//         </div>
//         <div className="flex flex-col sm:flex-row justify-between mb-4 flex-wrap gap-2">
//           <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4">
//             <button
//               onClick={() => setCurrentSection(1)}
//               className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-sm ${currentSection === 1 ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
//             >
//               Company Details
//             </button>
//             <button
//               onClick={() => setCurrentSection(2)}
//               className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-sm ${currentSection === 2 ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
//             >
//               Job Openings
//             </button>
//             <button
//               onClick={() => setCurrentSection(3)}
//               className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-sm ${currentSection === 3 ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
//             >
//               Notes
//             </button>
//             <button
//               onClick={() => setCurrentSection(4)}
//               className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-sm ${currentSection === 4 ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
//             >
//               Points of Contact
//             </button>
//             <button
//               onClick={() => setCurrentSection(5)}
//               className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-sm ${currentSection === 5 ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
//             >
//               History
//             </button>
//             <button
//               onClick={() => setCurrentSection(6)}
//               className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-sm ${currentSection === 6 ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
//             >
//               Call Schedules
//             </button>
//           </div>
//         </div>

//         <div className="space-y-4 sm:space-y-6">
//           {currentSection === 1 && (
//             <div>
//               <h3 className="text-base sm:text-lg font-medium mb-2">Company Details</h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                 <div className="mb-3 sm:mb-4">
//                   <label className="block text-xs sm:text-sm font-medium text-gray-700">Company Name</label>
//                   {isEditing ? (
//                     <input
//                       type="text"
//                       value={companyData.name}
//                       onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
//                       placeholder="Enter company name"
//                       className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//                     />
//                   ) : (
//                     <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(companyData.name)}</p>
//                   )}
//                 </div>
//                 <div className="mb-3 sm:mb-4">
//                   <label className="block text-xs sm:text-sm font-medium text-gray-700">Domain</label>
//                   {isEditing ? (
//                     <input
//                       type="text"
//                       value={companyData.domain}
//                       onChange={(e) => setCompanyData({ ...companyData, domain: e.target.value })}
//                       placeholder="Enter domain"
//                       className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//                     />
//                   ) : (
//                     <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(companyData.domain)}</p>
//                   )}
//                 </div>
//                 <div className="mb-3 sm:mb-4">
//                   <label className="block text-xs sm:text-sm font-medium text-gray-700">Phone</label>
//                   {isEditing ? (
//                     <input
//                       type="text"
//                       value={companyData.phone}
//                       onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
//                       placeholder="Enter phone number"
//                       className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//                     />
//                   ) : (
//                     <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(companyData.phone)}</p>
//                   )}
//                 </div>
//                 <div className="mb-3 sm:mb-4">
//                   <label className="block text-xs sm:text-sm font-medium text-gray-700">Email</label>
//                   {isEditing ? (
//                     <input
//                       type="email"
//                       value={companyData.email}
//                       onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
//                       placeholder="Enter email"
//                       className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//                     />
//                   ) : (
//                     <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(companyData.email)}</p>
//                   )}
//                 </div>
//                 <div className="mb-3 sm:mb-4">
//                   <label className="block text-xs sm:text-sm font-medium text-gray-700">City</label>
//                   {isEditing ? (
//                     <input
//                       type="text"
//                       value={companyData.city}
//                       onChange={(e) => setCompanyData({ ...companyData, city: e.target.value })}
//                       placeholder="Enter city"
//                       className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//                     />
//                   ) : (
//                     <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(companyData.city)}</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//           {currentSection === 2 && (
//             <div>
//               <h3 className="text-base sm:text-lg font-medium mb-2">Job Openings</h3>
//               {isEditing && (
//                 <div className="mb-4">
//                   <h4 className="text-sm font-medium mb-2">Add New Job Opening</h4>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                     <div>
//                       <label className="block text-xs sm:text-sm font-medium text-gray-700">Job Title</label>
//                       <input
//                         type="text"
//                         value={newJob.title}
//                         onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
//                         placeholder="Enter job title"
//                         className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-xs sm:text-sm font-medium text-gray-700">Department</label>
//                       <input
//                         type="text"
//                         value={newJob.department}
//                         onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
//                         placeholder="Enter department"
//                         className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-xs sm:text-sm font-medium text-gray-700">Location</label>
//                       <input
//                         type="text"
//                         value={newJob.location}
//                         onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
//                         placeholder="Enter location"
//                         className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-xs sm:text-sm font-medium text-gray-700">Type</label>
//                       <select
//                         value={newJob.type}
//                         onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
//                         className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//                       >
//                         <option value="">Select type</option>
//                         <option value="Full-time">Full-time</option>
//                         <option value="Part-time">Part-time</option>
//                         <option value="Contract">Contract</option>
//                         <option value="Internship">Internship</option>
//                       </select>
//                     </div>
//                     <div className="sm:col-span-2">
//                       <label className="block text-xs sm:text-sm font-medium text-gray-700">Description</label>
//                       <textarea
//                         value={newJob.description}
//                         onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
//                         placeholder="Enter job description"
//                         className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//                         rows="4"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-xs sm:text-sm font-medium text-gray-700">Posted Date</label>
//                       <input
//                         type="date"
//                         value={newJob.postedDate}
//                         onChange={(e) => setNewJob({ ...newJob, postedDate: e.target.value })}
//                         className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-xs sm:text-sm font-medium text-gray-700">Closing Date</label>
//                       <input
//                         type="date"
//                         value={newJob.closingDate}
//                         onChange={(e) => setNewJob({ ...newJob, closingDate: e.target.value })}
//                         className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-xs sm:text-sm font-medium text-gray-700">Status</label>
//                       <select
//                         value={newJob.status}
//                         onChange={(e) => setNewJob({ ...newJob, status: e.target.value })}
//                         className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//                       >
//                         <option value="open">Open</option>
//                         <option value="closed">Closed</option>
//                       </select>
//                     </div>
//                   </div>
//                   <div className="flex justify-end gap-2 mt-4">
//                     <button
//                       onClick={() =>
//                         setNewJob({
//                           title: "",
//                           department: "",
//                           location: "",
//                           type: "",
//                           description: "",
//                           postedDate: "",
//                           closingDate: "",
//                           status: "open",
//                         })
//                       }
//                       className="px-3 py-1 sm:px-4 sm:py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 text-sm"
//                     >
//                       Clear
//                     </button>
//                     <button
//                       onClick={handleAddJobOpening}
//                       className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
//                     >
//                       Add Job Opening
//                     </button>
//                   </div>
//                 </div>
//               )}
//               <div>
//                 <h4 className="text-sm font-medium mb-2">Existing Job Openings</h4>
//                 {jobOpenings.length > 0 ? (
//                   <div className="space-y-4">
//                     {jobOpenings.map((job) => (
//                       <div key={job.id} className="border border-gray-200 rounded-md p-3 sm:p-4 bg-gray-50">
//                         <p className="text-sm font-medium text-gray-700">{job.title}</p>
//                         <p className="text-xs sm:text-sm text-gray-600">Department: {job.department}</p>
//                         <p className="text-xs sm:text-sm text-gray-600">Location: {job.location}</p>
//                         <p className="text-xs sm:text-sm text-gray-600">Type: {job.type}</p>
//                         <p className="text-xs sm:text-sm text-gray-600">Posted: {renderField(job.postedDate)}</p>
//                         <p className="text-xs sm:text-sm text-gray-600">Closing: {renderField(job.closingDate)}</p>
//                         <p className="text-xs sm:text-sm text-gray-600">Status: {job.status}</p>
//                         <p className="text-xs sm:text-sm text-gray-600 mt-2">{job.description}</p>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-xs sm:text-sm text-gray-500">No job openings available.</p>
//                 )}
//               </div>
//             </div>
//           )}
//           {currentSection === 3 && (
//             <Notes
//               companyData={{ ...companyData, notes }}
//               newNote={newNote}
//               setNewNote={setNewNote}
//               noteType={noteType}
//               setNoteType={setNoteType}
//               isEditing={isEditing}
//               handleAddNote={handleAddNote}
//               formatDateSafely={formatDateSafely}
//               formatNoteType={formatNoteType}
//               canUpdate={canUpdate}
//               toast={toast} // Pass toast prop
//             />
//           )}
//           {currentSection === 4 && (
//             <div>
//               <h3 className="text-base sm:text-lg font-medium mb-2">Points of Contact</h3>
//               {isEditing && (
//                 <div className="mb-4">
//                   <h4 className="text-sm font-medium mb-2">Add New Point of Contact</h4>
//                   <div className="flex flex-col sm:flex-row gap-4 mb-4 overflow-x-auto">
//                     <input
//                       type="text"
//                       value={newPOC.name}
//                       onChange={(e) => handlePOCChange("name", e.target.value)}
//                       placeholder="Contact Name"
//                       disabled={(!canUpdate && company) || (!canCreate && !company)}
//                       className="w-full min-w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 disabled:bg-gray-100"
//                     />
//                     <input
//                       type="email"
//                       value={newPOC.email}
//                       onChange={(e) => handlePOCChange("email", e.target.value)}
//                       placeholder="Email Address"
//                       disabled={(!canUpdate && company) || (!canCreate && !company)}
//                       className="w-full min-w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 disabled:bg-gray-100"
//                     />
//                     <select
//                       value={newPOC.countryCode}
//                       onChange={(e) => handlePOCChange("countryCode", e.target.value)}
//                       disabled={(!canUpdate && company) || (!canCreate && !company)}
//                       className="w-full min-w-40 sm:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 disabled:bg-gray-100"
//                     >
//                       {countryCodes.map((country) => (
//                         <option key={country.code + country.label} value={country.code}>
//                           {country.label}
//                         </option>
//                       ))}
//                     </select>
//                     <input
//                       type="tel"
//                       value={newPOC.mobile}
//                       onChange={(e) => handlePOCChange("mobile", e.target.value)}
//                       placeholder="Mobile Number (7-15 digits)"
//                       disabled={(!canUpdate && company) || (!canCreate && !company)}
//                       className="w-full min-w-40 sm:w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 disabled:bg-gray-100"
//                     />
//                   </div>
//                   <button
//                     type="button"
//                     onClick={handleAddPOC}
//                     disabled={(!canUpdate && company) || (!canCreate && !company)}
//                     className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200 w-full sm:w-auto disabled:bg-gray-400 disabled:cursor-not-allowed"
//                   >
//                     Add POC
//                   </button>
//                 </div>
//               )}
//               <div>
//                 <h4 className="text-sm font-medium mb-2">Existing Points of Contact</h4>
//                 {pointsOfContact.length > 0 ? (
//                   <div className="mt-4 max-h-40 overflow-y-auto border border-gray-300 rounded-md">
//                     <table className="w-full text-left border-collapse">
//                       <thead className="bg-gray-200 text-gray-700 sticky top-0">
//                         <tr>
//                           <th className="p-3 text-sm font-semibold min-w-40">Sr No</th>
//                           <th className="p-3 text-sm font-semibold min-w-40">Name</th>
//                           <th className="p-3 text-sm font-semibold min-w-40">Mobile</th>
//                           <th className="p-3 text-sm font-semibold min-w-40">Email</th>
//                           {isEditing && <th className="p-3 text-sm font-semibold min-w-40">Action</th>}
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {pointsOfContact.map((poc, index) => (
//                           <tr key={index} className="border-b hover:bg-gray-50">
//                             <td className="p-3 text-gray-600">{index + 1}</td>
//                             <td className="p-3 text-gray-600">{poc.name}</td>
//                             <td className="p-3 text-gray-600">
//                               {poc.countryCode} {poc.mobile}
//                             </td>
//                             <td className="p-3 text-gray-600">{poc.email}</td>
//                             {isEditing && (
//                               <td className="p-3">
//                                 <button
//                                   type="button"
//                                   onClick={() => handleRemovePOC(index)}
//                                   disabled={(!canUpdate && company) || (!canCreate && !company)}
//                                   className="text-red-500 hover:text-red-700 font-bold disabled:text-gray-400 disabled:cursor-not-allowed"
//                                 >
//                                   ✕
//                                 </button>
//                               </td>
//                             )}
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 ) : (
//                   <p className="text-xs sm:text-sm text-gray-500">No points of contact available.</p>
//                 )}
//               </div>
//             </div>
//           )}
//           {currentSection === 5 && (
//             <div>
//               <h3 className="text-base sm:text-lg font-medium">History</h3>
//               {canDisplay && companyData.history && companyData.history.length > 0 ? (
//                 <div className="space-y-3 sm:space-y-4">
//                   {companyData.history
//                     .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
//                     .map((entry, index) => (
//                       <div key={index} className="rounded-md">
//                         <p className="text-sm text-gray-900">
//                           {entry.action} by {entry.performedBy} on{" "}
//                           {formatDateSafely(entry.timestamp, "MMM d, yyyy h:mm a")}
//                         </p>
//                       </div>
//                     ))}
//                 </div>
//               ) : (
//                 <p className="text-sm text-gray-500">No history available</p>
//               )}
//             </div>
//           )}
//           {currentSection === 6 && (
//             <div>
//               <h3 className="text-base sm:text-lg font-medium mb-2">Call Schedules</h3>
//               <div>
//                 {callSchedules && callSchedules.length > 0 ? (
//                   <div className="space-y-4">
//                     {callSchedules.map((schedule) => (
//                       <div key={schedule.id} className="border border-gray-200 rounded-md p-3 sm:p-4 bg-blue-50">
//                         <p className="text-sm font-medium text-gray-700">Call Schedule</p>
//                         <p className="text-xs sm:text-sm text-gray-600">Purpose: {schedule.content}</p>
//                         <p className="text-xs sm:text-sm text-gray-600">Call Time: {schedule.callDate} {schedule.callTime}</p>
//                         <p className="text-xs sm:text-sm text-gray-600">Reminder: {schedule.reminderTime} minutes before</p>
//                         <p className="text-xs sm:text-sm text-gray-600">Status: {schedule.status}</p>
//                         <p className="text-xs sm:text-sm text-gray-600">Created by: {schedule.createdBy}</p>
//                         <p className="text-xs sm:text-sm text-gray-600">
//                           Created at: {formatDateSafely(schedule.createdAt, "MMM d, yyyy h:mm a")}
//                         </p>
//                         {canUpdate && (
//                           <button
//                             onClick={() => handleDeleteSchedule(schedule.id)}
//                             className="mt-2 text-red-600 hover:text-red-800 text-sm"
//                           >
//                             Delete
//                           </button>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-xs sm:text-sm text-gray-500">No call schedules available.</p>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//         <div className="mt-6 flex justify-end gap-2">
//           {isEditing ? (
//             <>
//               <button
//                 onClick={() => {
//                   setIsEditing(false);
//                   setCompanyData({
//                     ...company,
//                     tags: Array.isArray(company.tags) ? company.tags : [],
//                     history: Array.isArray(company.history) ? company.history : [],
//                     pointsOfContact: Array.isArray(company.pointsOfContact)
//                       ? company.pointsOfContact
//                       : [],
//                   });
//                   setPointsOfContact(
//                     Array.isArray(company.pointsOfContact) ? company.pointsOfContact : []
//                   );
//                 }}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleUpdateCompany}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//               >
//                 Update Company
//               </button>
//             </>
//           ) : (
//             <>
//               <button
//                 onClick={onRequestClose}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
//               >
//                 Close
//               </button>
//               {company && canUpdate && (
//                 <button
//                   onClick={() => setIsEditing(true)}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//                 >
//                   Edit
//                 </button>
//               )}
//             </>
//           )}
//         </div>
//       </Modal>
//     </>
//   );
// };

// export default CompanyModal;


import { useState, useEffect } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";
import { db } from "../../../../config/firebase.js";
import { getDocs, collection, query, orderBy, addDoc, updateDoc, doc, arrayUnion, serverTimestamp } from "firebase/firestore";
import Notes from "../Notes.jsx";
import { useAuth } from "../../../../context/AuthContext.jsx";
import { toast } from "react-toastify";

const CompanyModal = ({ isOpen, onRequestClose, company, rolePermissions, callSchedules, handleDeleteSchedule }) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState("general");
  const [userDisplayName, setUserDisplayName] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const canUpdate = rolePermissions?.Companies?.update || false;
  const canDisplay = rolePermissions?.Companies?.display || false;

  useEffect(() => {
    if (!company?.id || !canDisplay) return;
    const fetchNotes = async () => {
      try {
        const q = query(collection(db, "Companies", company.id, "notes"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        setNotes(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        //console.error("Error fetching notes:", error);
        toast.error("Failed to fetch notes.");
      }
    };
    fetchNotes();
  }, [company?.id, canDisplay]);

  useEffect(() => {
    if (!user?.uid) return;
    const fetchUserDisplayName = async () => {
      try {
        const userDoc = await getDoc(doc(db, "Users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserDisplayName(userData.displayName || user.email || "Unknown User");
        } else {
          setUserDisplayName(user.email || "Unknown User");
        }
      } catch (error) {
        //console.error("Error fetching user displayName:", error);
        toast.error("Failed to fetch user data.");
        setUserDisplayName(user.email || "Unknown User");
      }
    };
    fetchUserDisplayName();
  }, [user?.uid, user?.email]);

  const logActivity = async (action, details) => {
    try {
      await addDoc(collection(db, "activityLogs"), {
        action,
        details,
        timestamp: new Date().toISOString(),
        userEmail: user?.email || "anonymous",
        userId: user.uid,
      });
    } catch (error) {
      //console.error("Error logging activity:", error);
    }
  };

  const formatDateSafely = (date, format) => {
    try {
      return new Date(date).toLocaleString("en-US", {
        year: format.includes("yyyy") ? "numeric" : undefined,
        month: format.includes("MMMM") ? "long" : "numeric",
        day: format.includes("d") ? "numeric" : undefined,
        hour: format.includes("h") ? "numeric" : undefined,
        minute: format.includes("mm") ? "2-digit" : undefined,
        hour12: format.includes("a"),
      });
    } catch {
      return "Invalid Date";
    }
  };

  const formatNoteType = (type) => {
    const noteTypes = {
      general: "General Note",
      meeting: "Meeting Note",
      call: "Call Note",
      "call-schedule": "Call Schedule",
    };
    return noteTypes[type] || "Unknown";
  };

  const handleAddNote = async (noteData) => {
    if (!company?.id || !canUpdate) return;
    try {
      const noteToSave = {
        noteType: noteData.noteType || "general",
        content: noteData.content || "", // Use content from noteData
        createdAt: serverTimestamp(),
        createdBy: userDisplayName,
        ...(noteData.noteType === "call-schedule" && {
          callDate: noteData.callDate,
          callTime: noteData.callTime,
          reminderTime: noteData.reminderTime,
          status: "scheduled",
        }),
      };
      const noteRef = await addDoc(collection(db, "Companies", company.id, "notes"), noteToSave);
      
      const historyEntry = {
        action: `Added ${noteData.noteType} Note`,
        performedBy: userDisplayName,
        timestamp: new Date().toISOString(),
        details: noteData.noteType === "call-schedule" 
          ? `Scheduled call for ${noteData.callDate} ${noteData.callTime}: ${noteData.content}`
          : `Note: ${noteData.content}`,
      };
      await updateDoc(doc(db, "Companies", company.id), {
        history: arrayUnion(historyEntry),
        updatedAt: serverTimestamp(),
      });

      setNotes([{ id: noteRef.id, ...noteToSave }, ...notes]);
      toast.success("Note added successfully!");
      logActivity("ADD_NOTE", { companyId: company.id, noteType: noteData.noteType });

      // Schedule reminder for call-schedule
      if (noteData.noteType === "call-schedule") {
        const callDateTime = new Date(`${noteData.callDate}T${noteData.callTime}`);
        const reminderDateTime = new Date(callDateTime.getTime() - parseInt(noteData.reminderTime) * 60000);
        const timeout = reminderDateTime.getTime() - Date.now();
        if (timeout > 0) {
          setTimeout(() => {
            if (Notification.permission === "granted") {
              new Notification("Call Reminder", {
                body: `Call scheduled with ${company.name} at ${noteData.callTime}: ${noteData.content}`,
                icon: "/path/to/icon.png",
              });
            } else if (Notification.permission !== "denied") {
              Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                  new Notification("Call Reminder", {
                    body: `Call scheduled with ${company.name} at ${noteData.callTime}: ${noteData.content}`,
                    icon: "/path/to/icon.png",
                  });
                }
              });
            }
            const reminderAudio = new Audio("https://www.soundjay.com/buttons/beep-01a.mp3");
            reminderAudio.play().catch((error) => {
              //console.error("Error playing reminder audio:", error);
              toast.error("Failed to play reminder sound.");
            });
            toast.info(`Call Reminder: ${company.name} at ${noteData.callTime}`);
            logActivity("TRIGGER_CALL_REMINDER", { companyId: company.id, callDate: noteData.callDate, callTime: noteData.callTime });
          }, timeout);
        }
      }
    } catch (error) {
      //console.error("Error adding note:", error);
      toast.error(`Failed to add note: ${error.message}`);
    }
  };

  if (!company || !canDisplay) return null;

  return (
    <Dialog open={isOpen} handler={onRequestClose} className="rounded-lg shadow-lg max-w-4xl">
      <DialogHeader className="text-gray-800 font-semibold">{company.name}</DialogHeader>
      <DialogBody className="text-gray-600 max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p><strong>Domain:</strong> {company.domain || "N/A"}</p>
            <p><strong>Phone:</strong> {company.phone || "N/A"}</p>
            <p><strong>Email:</strong> {company.email || "N/A"}</p>
            <p><strong>City:</strong> {company.city || "N/A"}</p>
          </div>
          <div>
            <p><strong>URL:</strong> {company.url || "N/A"}</p>
            <p><strong>Hiring Period:</strong> {company.fromDate || "N/A"} to {company.toDate || "N/A"}</p>
            <p><strong>Company Type:</strong> {company.companyType || "N/A"}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Call Schedules</h3>
          {callSchedules.length > 0 ? (
            callSchedules.map((schedule) => (
              <div key={schedule.id} className="border border-gray-200 rounded-md p-4 mb-2 bg-blue-50">
                <p><strong>Purpose:</strong> {schedule.content}</p>
                <p><strong>Call Time:</strong> {schedule.callDate} {schedule.callTime}</p>
                <p><strong>Reminder:</strong> {schedule.reminderTime} minutes before</p>
                <p><strong>Status:</strong> {schedule.status}</p>
                {canUpdate && (
                  <button
                    onClick={() => handleDeleteSchedule(schedule.id)}
                    className="text-red-600 hover:text-red-800 mt-2"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No call schedules available.</p>
          )}
        </div>

        <Notes
          companyData={{ ...company, notes }}
          newNote={newNote}
          setNewNote={setNewNote}
          noteType={noteType}
          setNoteType={setNoteType}
          isEditing={isEditing}
          handleAddNote={handleAddNote}
          formatDateSafely={formatDateSafely}
          formatNoteType={formatNoteType}
          canUpdate={canUpdate}
          toast={toast}
        />
      </DialogBody>
      <DialogFooter className="space-x-4">
        <Button variant="text" color="gray" onClick={onRequestClose}>
          Close
        </Button>
        {canUpdate && (
          <Button
            variant="filled"
            color="blue"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Done" : "Edit Notes"}
          </Button>
        )}
      </DialogFooter>
    </Dialog>
  );
};

export default CompanyModal;