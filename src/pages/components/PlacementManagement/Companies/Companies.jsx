// import { useState, useEffect } from "react";
// import { db } from "../../../../config/firebase.js";
// import { getDocs, collection, deleteDoc, doc, query, orderBy, addDoc, updateDoc, getDoc, arrayUnion, serverTimestamp, where } from "firebase/firestore";
// import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Textarea, Select, Option } from "@material-tailwind/react";
// import { useAuth } from "../../../../context/AuthContext.jsx";
// import AddCompanies from "./AddCompanies.jsx";
// import AddBulkCompanies from "./AddBulkCompanies.jsx";
// import { useNavigate } from "react-router-dom";
// import CompanyModal from "./CompanyModal/CompanyModal.jsx";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function Companies() {
//     const navigate = useNavigate();
//     const { user, rolePermissions } = useAuth();
//     const [currentCompany, setCurrentCompany] = useState(null);
//     const [companies, setCompanies] = useState([]);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [searchResults, setSearchResults] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [isAddSingleOpen, setIsAddSingleOpen] = useState(false);
//     const [isAddBulkOpen, setIsAddBulkOpen] = useState(false);
//     const [openDelete, setOpenDelete] = useState(false);
//     const [deleteId, setDeleteId] = useState(null);
//     const [deleteMessage, setDeleteMessage] = useState("Are you sure you want to delete this company? This action cannot be undone.");
//     const [openAddOptions, setOpenAddOptions] = useState(false);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedCompany, setSelectedCompany] = useState(null);
//     const [userDisplayName, setUserDisplayName] = useState("");
//     const [openCallSchedule, setOpenCallSchedule] = useState(false);
//     const [openReminderDialog, setOpenReminderDialog] = useState(false);
//     const [reminderDetails, setReminderDetails] = useState(null);
//     const [callScheduleForm, setCallScheduleForm] = useState({
//         companyId: "",
//         callDate: "",
//         callTime: "",
//         purpose: "",
//         reminderTime: "15",
//     });
//     const [callSchedules, setCallSchedules] = useState([]);

//     const CompanyCollectionRef = collection(db, "Companies");
//     const reminderAudio = new Audio("https://www.soundjay.com/buttons/beep-01a.mp3");

//     const canCreate = rolePermissions?.Companies?.create || false;
//     const canUpdate = rolePermissions?.Companies?.update || false;
//     const canDelete = rolePermissions?.Companies?.delete || false;
//     const canDisplay = rolePermissions?.Companies?.display || false;

//     // Utility function to format Firestore Timestamp or null
//     const formatDate = (date) => {
//         if (!date) return "N/A"; // Handle null or undefined
//         if (date.seconds && date.nanoseconds) {
//             // Firestore Timestamp
//             const jsDate = new Date(date.seconds * 1000);
//             return jsDate.toLocaleDateString("en-GB", {
//                 day: "2-digit",
//                 month: "2-digit",
//                 year: "numeric",
//             }); // e.g., 12/12/2023
//         }
//         return "N/A"; // Fallback for unexpected formats
//     };

//     // Format POC phone number with country code
//     const formatPocPhone = (poc) => {
//         if (!poc?.mobile) return "N/A";
//         return `${poc.countryCode || ""}${poc.mobile}`;
//     };

//     // Fetch call schedules for the selected company
//     useEffect(() => {
//         if (!selectedCompany?.id) return;
//         const fetchCallSchedules = async () => {
//             try {
//                 const q = query(
//                     collection(db, "Companies", selectedCompany.id, "notes"),
//                     where("noteType", "==", "call-schedule"),
//                     orderBy("createdAt", "desc")
//                 );
//                 const snapshot = await getDocs(q);
//                 setCallSchedules(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
//             } catch (error) {
//                 console.error("Error fetching call schedules:", error);
//                 if (error.code === "failed-precondition" && error.message.includes("The query requires an index")) {
//                     toast.error(
//                         "Failed to fetch call schedules: A Firestore index is required. Create it in the Firebase Console and try again.",
//                         { autoClose: 10000 }
//                     );
//                 } else {
//                     toast.error(`Failed to fetch call schedules: ${error.message}`);
//                 }
//             }
//         };
//         fetchCallSchedules();
//     }, [selectedCompany?.id]);

//     // Preload reminder audio
//     useEffect(() => {
//         reminderAudio.load();
//         reminderAudio.onerror = () => {
//             console.error("Error loading reminder audio");
//             toast.error("Failed to load reminder audio.");
//         };
//     }, []);

//     // Fetch user displayName
//     useEffect(() => {
//         if (!user?.uid) return;

//         const fetchUserDisplayName = async () => {
//             try {
//                 const userDocRef = doc(db, "Users", user.uid);
//                 const userDoc = await getDoc(userDocRef);
//                 if (userDoc.exists()) {
//                     const userData = userDoc.data();
//                     setUserDisplayName(userData.displayName || user.email || "Unknown User");
//                 } else {
//                     console.warn("User document not found");
//                     setUserDisplayName(user.email || "Unknown User");
//                 }
//             } catch (error) {
//                 console.error("Error fetching user displayName:", error);
//                 toast.error(`Failed to fetch user data: ${error.message}`);
//                 setUserDisplayName(user.email || "Unknown User");
//             }
//         };

//         fetchUserDisplayName();
//     }, [user?.uid, user?.email]);

//     const logActivity = async (action, details) => {
//         try {
//             const activityLog = {
//                 action,
//                 details,
//                 timestamp: new Date().toISOString(),
//                 userEmail: user?.email || "anonymous",
//                 userId: user.uid,
//             };
//             await addDoc(collection(db, "activityLogs"), activityLog);
//         } catch (error) {
//             console.error("Error logging activity:", error);
//         }
//     };

//     const toggleAddSingleSidebar = () => setIsAddSingleOpen((prev) => !prev);
//     const toggleAddBulkSidebar = () => setIsAddBulkOpen((prev) => !prev);

//     const handleSearch = (e) => {
//         if (e) e.preventDefault();
//         if (!searchTerm.trim()) {
//             setSearchResults([]);
//             return;
//         }
//         const results = companies.filter((company) => {
//             const poc = company.pointsOfContact?.[0] || {};
//             return (
//                 (company.name && company.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
//                 (poc.name && poc.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
//                 (poc.email && poc.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
//                 (poc.mobile && poc.mobile.toLowerCase().includes(searchTerm.toLowerCase())) ||
//                 (poc.countryCode && poc.countryCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
//                 (poc.designation && poc.designation.toLowerCase().includes(searchTerm.toLowerCase())) ||
//                 (poc.linkedInProfile && poc.linkedInProfile.toLowerCase().includes(searchTerm.toLowerCase()))
//             );
//         });
//         setSearchResults(results);
//     };

//     useEffect(() => {
//         if (searchTerm) handleSearch();
//         else setSearchResults([]);
//     }, [searchTerm, companies]);

//     const handleDeleteSchedule = async (noteId) => {
//         if (!canDelete || !selectedCompany?.id) return;
//         try {
//             const noteRef = doc(db, "Companies", selectedCompany.id, "notes", noteId);
//             const noteDoc = await getDoc(noteRef);
//             if (!noteDoc.exists()) throw new Error("Note not found");
//             const noteData = noteDoc.data();

//             const historyEntry = {
//                 action: "Deleted Call Schedule",
//                 performedBy: userDisplayName,
//                 timestamp: new Date().toISOString(),
//                 details: `Deleted call schedule for ${noteData.callDate} ${noteData.callTime}`,
//             };
//             await updateDoc(doc(db, "Companies", selectedCompany.id), {
//                 history: arrayUnion(historyEntry),
//                 updatedAt: serverTimestamp(),
//             });

//             await deleteDoc(noteRef);
//             setCallSchedules(callSchedules.filter((s) => s.id !== noteId));
//             toast.success("Call schedule deleted successfully!");
//             logActivity("DELETE_CALL_SCHEDULE", { companyId: selectedCompany.id, noteId });
//         } catch (error) {
//             console.error("Error deleting call schedule:", error);
//             toast.error(`Failed to delete call schedule: ${error.message}`);
//         }
//     };

//     const fetchCompanies = async () => {
//         try {
//             setLoading(true);
//             const q = query(CompanyCollectionRef, orderBy("createdAt", "asc"));
//             const snapshot = await getDocs(q);
//             const companyData = snapshot.docs.map((doc) => ({
//                 id: doc.id,
//                 ...doc.data(),
//                 pointsOfContact: Array.isArray(doc.data().pointsOfContact) ? doc.data().pointsOfContact : [],
//             }));
//             console.log("Fetched Companies:", companyData);
//             setCompanies(companyData);
//             if (companyData.length === 0) {
//                 console.warn("No companies found in Firestore");
//             }
//         } catch (err) {
//             console.error("Error fetching companies:", err);
//             toast.error(`Failed to fetch companies: ${err.message}`);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (!canDisplay) {
//             navigate("/unauthorized");
//             return;
//         }
//         fetchCompanies();
//     }, [canDisplay, navigate]);

//     const handleAddCompanyClick = () => {
//         if (!canCreate) return;
//         setOpenAddOptions(true);
//         logActivity("OPEN_ADD_OPTIONS", {});
//     };

//     const handleEditClick = (company) => {
//         if (!canUpdate) return;
//         setCurrentCompany(company);
//         setIsAddSingleOpen(true);
//         logActivity("OPEN_EDIT_COMPANY", { companyId: company.id, name: company.name });
//     };

//     const handleDeleteClick = (companyId) => {
//         if (!canDelete) return;
//         setDeleteId(companyId);
//         setOpenDelete(true);
//         logActivity("OPEN_DELETE_COMPANY", { companyId });
//     };

//     const handleRowClick = (company) => {
//         if (!canDisplay) return;
//         setSelectedCompany(company);
//         setIsModalOpen(true);
//         logActivity("VIEW_COMPANY_DETAILS", { companyId: company.id });
//     };

//     const handleCloseSingle = () => {
//         setIsAddSingleOpen(false);
//         setCurrentCompany(null);
//         fetchCompanies();
//     };

//     const handleCloseBulk = () => {
//         setIsAddBulkOpen(false);
//         setSearchTerm("");
//         fetchCompanies();
//     };

//     const deleteCompany = async () => {
//         if (!canDelete || !deleteId) return;
//         try {
//             const companyRef = doc(db, "Companies", deleteId);
//             const companyDoc = await getDoc(companyRef);
//             if (!companyDoc.exists()) {
//                 throw new Error("Company not found");
//             }
//             const companyName = companyDoc.data().name;

//             const historyEntry = {
//                 action: "Deleted",
//                 performedBy: userDisplayName,
//                 timestamp: new Date().toISOString(),
//                 details: `Deleted company "${companyName}"`,
//             };
//             await updateDoc(companyRef, {
//                 history: arrayUnion(historyEntry),
//                 updatedAt: serverTimestamp(),
//             });

//             await deleteDoc(companyRef);
//             fetchCompanies();
//             setOpenDelete(false);
//             setDeleteMessage("Are you sure you want to delete this company? This action cannot be undone.");
//             toast.success("Company deleted successfully!");
//             logActivity("DELETE_COMPANY", { companyId: deleteId, name: companyName });
//         } catch (err) {
//             console.error("Error deleting company:", err);
//             setDeleteMessage("An error occurred while trying to delete the company.");
//             toast.error(`Failed to delete company: ${err.message}`);
//         }
//     };

//     const handleOpenCallSchedule = (company) => {
//         if (!canCreate) return;
//         setCallScheduleForm({
//             companyId: company.id,
//             callDate: "",
//             callTime: "",
//             purpose: "",
//             reminderTime: "15",
//         });
//         setOpenCallSchedule(true);
//         logActivity("OPEN_CALL_SCHEDULE", { companyId: company.id });
//     };

//     const handleCallScheduleSubmit = async () => {
//         if (!canCreate) return;
//         const { companyId, callDate, callTime, purpose, reminderTime } = callScheduleForm;
//         if (!companyId || !callDate || !callTime || !purpose) {
//             toast.error("Please fill all required fields.");
//             return;
//         }

//         try {
//             const companyRef = doc(db, "Companies", companyId);
//             const companyDoc = await getDoc(companyRef);
//             if (!companyDoc.exists()) {
//                 throw new Error("Company not found");
//             }
//             const companyName = companyDoc.data().name;

//             const callDateTime = new Date(`${callDate}T${callTime}`);
//             const reminderDateTime = new Date(callDateTime.getTime() - parseInt(reminderTime) * 60000);

//             const noteData = {
//                 noteType: "call-schedule",
//                 content: purpose,
//                 createdAt: serverTimestamp(),
//                 createdBy: userDisplayName,
//                 callDate,
//                 callTime,
//                 reminderTime,
//                 status: "scheduled",
//             };

//             const noteRef = await addDoc(collection(db, "Companies", companyId, "notes"), noteData);

//             const historyEntry = {
//                 action: "Added Call Schedule",
//                 performedBy: userDisplayName,
//                 timestamp: new Date().toISOString(),
//                 details: `Scheduled call for ${callDate} ${callTime}: ${purpose}`,
//             };
//             await updateDoc(companyRef, {
//                 history: arrayUnion(historyEntry),
//                 updatedAt: serverTimestamp(),
//             });

//             if (companyId === selectedCompany?.id) {
//                 setCallSchedules([{ id: noteRef.id, ...noteData }, ...callSchedules]);
//             }

//             const timeout = reminderDateTime.getTime() - Date.now();
//             if (timeout > 0) {
//                 setTimeout(() => {
//                     if (Notification.permission === "granted") {
//                         new Notification("Call Reminder", {
//                             body: `Call scheduled with ${companyName} at ${callTime}: ${purpose}`,
//                             icon: "/path/to/icon.png",
//                         });
//                     } else if (Notification.permission !== "denied") {
//                         Notification.requestPermission().then((permission) => {
//                             if (permission === "granted") {
//                                 new Notification("Call Reminder", {
//                                     body: `Call scheduled with ${companyName} at ${callTime}: ${purpose}`,
//                                     icon: "/path/to/icon.png",
//                                 });
//                             }
//                         });
//                     }

//                     reminderAudio.play().catch((error) => {
//                         console.error("Error playing reminder audio:", error);
//                         toast.error("Failed to play reminder sound.");
//                     });

//                     setReminderDetails({
//                         companyName,
//                         callDate,
//                         callTime,
//                         purpose,
//                     });
//                     setOpenReminderDialog(true);

//                     logActivity("TRIGGER_CALL_REMINDER", { companyId, callDate, callTime, purpose });
//                 }, timeout);
//             }

//             setOpenCallSchedule(false);
//             toast.success("Call scheduled successfully!");
//             logActivity("ADD_CALL_SCHEDULE", { companyId, callDate, callTime, purpose });
//         } catch (error) {
//             console.error("Error scheduling call:", error);
//             toast.error(`Failed to schedule call: ${error.message}`);
//         }
//     };

//     if (!canDisplay) return null;

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center h-screen text-gray-500">Loading...</div>
//         );
//     }

//     return (
//         <div className="flex flex-col min-h-screen bg-gray-50 p-4 fixed inset-0 left-[300px]">
//             <ToastContainer position="top-right" autoClose={3000} />
//             <div className="flex justify-between items-center mb-6">
//                 <div>
//                     <h1 className="text-2xl font-semibold text-gray-800">Companies</h1>
//                 </div>
//                 {canCreate && (
//                     <div className="flex space-x-4">
//                         <button
//                             type="button"
//                             className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition duration-200"
//                             onClick={handleAddCompanyClick}
//                         >
//                             + Add Company
//                         </button>
//                         <button
//                             type="button"
//                             className="bg-green-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-700 transition duration-200"
//                             onClick={() => handleOpenCallSchedule({ id: "" })}
//                         >
//                             Schedule Call
//                         </button>
//                     </div>
//                 )}
//             </div>

//             <div className="bg-white p-6 rounded-lg shadow-md">
//                 <div className="mb-6 grid grid-cols-2">
//                     <input
//                         type="text"
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         placeholder="Search companies by name, POC name, email, phone, designation, or LinkedIn..."
//                         className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     <p className="text-gray-600 mt-3 ml-auto">Total Companies: {companies.length}</p>
//                 </div>

//                 <div className="overflow-x-auto h-[70vh] overflow-y-auto">
//                     <table className="w-full">
//                         <thead className="bg-gray-100">
//                             <tr>
//                                 <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Sr No</th>
//                                 <th className="px-4 py-3 text-left text-base font-semibold text-gray-700 min-w-52">Company Name</th>
//                                 <th className="px-4 py-3 text-left text-base font-semibold text-gray-700 min-w-52">Domain</th>
//                                 <th className="px-4 py-3 text-left text-base font-semibold text-gray-700 min-w-52">POC Name</th>
//                                 <th className="px-4 py-3 text-left text-base font-semibold text-gray-700 min-w-52">POC Phone</th>
//                                 <th className="px-4 py-3 text-left text-base font-semibold text-gray-700 min-w-52">POC Email</th>
//                                 <th className="px-4 py-3 text-left text-base font-semibold text-gray-700 min-w-52">POC Designation</th>
//                                 <th className="px-4 py-3 text-left text-base font-semibold text-gray-700 min-w-52">POC LinkedIn</th>
//                                 <th className="px-4 py-3 text-left text-base font-semibold text-gray-700 min-w-52">City</th>
//                                 <th className="px-4 py-3 text-left text-base font-semibold text-gray-700 min-w-52">URL</th>
//                                 <th className="px-4 py-3 text-left text-base font-semibold text-gray-700 min-w-52">Company Type</th>
//                                 {(canUpdate || canDelete || canCreate) && (
//                                     <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Action</th>
//                                 )}
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {(searchResults.length > 0 ? searchResults : companies).map((company, index) => (
//                                 <tr
//                                     key={company.id}
//                                     className="border-b hover:bg-gray-50 cursor-pointer"
//                                     onClick={() => handleRowClick(company)}
//                                 >
//                                     <td className="px-4 py-3 text-gray-600">{index + 1}</td>
//                                     <td className="px-4 py-3 text-gray-800">{company.name || "N/A"}</td>
//                                     <td className="px-4 py-3 text-gray-800">{company.domain || "N/A"}</td>
//                                     <td className="px-4 py-3 text-gray-800">{company.pointsOfContact?.[0]?.name || "N/A"}</td>
//                                     <td className="px-4 py-3 text-gray-800">{formatPocPhone(company.pointsOfContact?.[0])}</td>
//                                     <td className="px-4 py-3 text-gray-800">{company.pointsOfContact?.[0]?.email || "N/A"}</td>
//                                     <td className="px-4 py-3 text-gray-800">{company.pointsOfContact?.[0]?.designation || "N/A"}</td>
//                                     <td className="px-4 py-3 text-gray-800">
//                                         {company.pointsOfContact?.[0]?.linkedInProfile ? (
//                                             <a
//                                                 href={company.pointsOfContact[0].linkedInProfile}
//                                                 target="_blank"
//                                                 rel="noopener noreferrer"
//                                                 className="text-blue-600 hover:underline"
//                                             >
//                                                 Profile
//                                             </a>
//                                         ) : (
//                                             "N/A"
//                                         )}
//                                     </td>
//                                     <td className="px-4 py-3 text-gray-800">{company.city || "N/A"}</td>
//                                     <td className="px-4 py-3 text-gray-800">
//                                         {company.url ? (
//                                             <a
//                                                 href={company.url}
//                                                 target="_blank"
//                                                 rel="noopener noreferrer"
//                                                 className="text-blue-600 hover:underline"
//                                             >
//                                                 Website
//                                             </a>
//                                         ) : (
//                                             "N/A"
//                                         )}
//                                     </td>
//                                     <td className="px-4 py-3 text-gray-800">{company.companyType || "N/A"}</td>
//                                     {(canUpdate || canDelete || canCreate) && (
//                                         <td className="px-4 py-3 text-gray-800" onClick={(e) => e.stopPropagation()}>
//                                             {canUpdate && (
//                                                 <button
//                                                     onClick={() => handleEditClick(company)}
//                                                     className="text-blue-600 hover:text-blue-800 mr-3"
//                                                 >
//                                                     Edit
//                                                 </button>
//                                             )}
//                                             {canDelete && (
//                                                 <button
//                                                     onClick={() => handleDeleteClick(company.id)}
//                                                     className="text-red-600 hover:text-red-800 mr-3"
//                                                 >
//                                                     Delete
//                                                 </button>
//                                             )}
//                                             {canCreate && (
//                                                 <button
//                                                     onClick={() => handleOpenCallSchedule(company)}
//                                                     className="text-green-600 hover:text-green-800"
//                                                 >
//                                                     Schedule Call
//                                                 </button>
//                                             )}
//                                         </td>
//                                     )}
//                                 </tr>
//                             ))}
//                             {(searchResults.length > 0 ? searchResults : companies).length === 0 && (
//                                 <tr>
//                                     <td colSpan={(canUpdate || canDelete || canCreate) ? 12 : 11} className="px-4 py-3 text-center text-gray-500">
//                                         No companies found
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//             {(canCreate || canUpdate) && (isAddSingleOpen || isAddBulkOpen) && (
//                 <div
//                     className="fixed inset-0 bg-black bg-opacity-50 z-40"
//                     onClick={isAddSingleOpen ? handleCloseSingle : handleCloseBulk}
//                 />
//             )}

//             {(canCreate || canUpdate) && (
//                 <AddCompanies
//                     isOpen={isAddSingleOpen}
//                     toggleSidebar={handleCloseSingle}
//                     company={currentCompany}
//                 />
//             )}

//             {canCreate && (
//                 <AddBulkCompanies
//                     isOpen={isAddBulkOpen}
//                     toggleSidebar={handleCloseBulk}
//                     fetchCompanies={fetchCompanies}
//                 />
//             )}

//             {canDisplay && (
//                 <CompanyModal
//                     isOpen={isModalOpen}
//                     onRequestClose={() => setIsModalOpen(false)}
//                     company={selectedCompany}
//                     rolePermissions={rolePermissions}
//                     callSchedules={callSchedules}
//                     handleDeleteSchedule={handleDeleteSchedule}
//                 />
//             )}

//             {canCreate && openAddOptions && (
//                 <Dialog
//                     open={openAddOptions}
//                     handler={() => setOpenAddOptions(false)}
//                     className="rounded-lg shadow-lg"
//                 >
//                     <DialogHeader className="text-gray-800 font-semibold">Add Company</DialogHeader>
//                     <DialogBody className="text-gray-600">Choose how you want to add a company:</DialogBody>
//                     <DialogFooter className="space-x-4">
//                         <Button
//                             variant="text"
//                             color="gray"
//                             onClick={() => setOpenAddOptions(false)}
//                         >
//                             Cancel
//                         </Button>
//                         <Button
//                             variant="filled"
//                             color="blue"
//                             onClick={() => {
//                                 setOpenAddOptions(false);
//                                 setIsAddSingleOpen(true);
//                                 logActivity("SELECT_ADD_SINGLE", {});
//                             }}
//                         >
//                             Add Single Company
//                         </Button>
//                         <Button
//                             variant="filled"
//                             color="green"
//                             onClick={() => {
//                                 setOpenAddOptions(false);
//                                 setIsAddBulkOpen(true);
//                                 logActivity("SELECT_ADD_BULK", {});
//                             }}
//                         >
//                             Add Bulk Companies
//                         </Button>
//                     </DialogFooter>
//                 </Dialog>
//             )}

//             {canDelete && openDelete && (
//                 <Dialog
//                     open={openDelete}
//                     handler={() => setOpenDelete(false)}
//                     className="rounded-lg shadow-lg"
//                 >
//                     <DialogHeader className="text-gray-800 font-semibold">Confirm Deletion</DialogHeader>
//                     <DialogBody className="text-gray-600">{deleteMessage}</DialogBody>
//                     <DialogFooter className="space-x-4">
//                         <Button
//                             variant="text"
//                             color="gray"
//                             onClick={() => setOpenDelete(false)}
//                         >
//                             Cancel
//                         </Button>
//                         {deleteMessage === "Are you sure you want to delete this company? This action cannot be undone." && (
//                             <Button
//                                 variant="filled"
//                                 color="red"
//                                 onClick={deleteCompany}
//                             >
//                                 Yes, Delete
//                             </Button>
//                         )}
//                     </DialogFooter>
//                 </Dialog>
//             )}

//             {canCreate && openCallSchedule && (
//                 <Dialog
//                     open={openCallSchedule}
//                     handler={() => setOpenCallSchedule(false)}
//                     className="rounded-lg shadow-lg max-w-sm max-h-[80vh] overflow-auto"
//                 >
//                     <DialogHeader className="text-gray-800 font-semibold">Schedule Call</DialogHeader>
//                     <DialogBody className="text-gray-600 space-y-4">
//                         {callScheduleForm.companyId && (
//                             <Input
//                                 label="Company"
//                                 value={companies.find((c) => c.id === callScheduleForm.companyId)?.name || ""}
//                                 disabled
//                             />
//                         )}
//                         {!callScheduleForm.companyId && (
//                             <Select
//                                 label="Select Company"
//                                 value={callScheduleForm.companyId}
//                                 onChange={(value) =>
//                                     setCallScheduleForm({ ...callScheduleForm, companyId: value })
//                                 }
//                             >
//                                 {companies.map((company) => (
//                                     <Option key={company.id} value={company.id}>
//                                         {company.name}
//                                     </Option>
//                                 ))}
//                             </Select>
//                         )}
//                         <Input
//                             type="date"
//                             label="Call Date"
//                             value={callScheduleForm.callDate}
//                             onChange={(e) =>
//                                 setCallScheduleForm({ ...callScheduleForm, callDate: e.target.value })
//                             }
//                         />
//                         <Input
//                             type="time"
//                             label="Call Time"
//                             value={callScheduleForm.callTime}
//                             onChange={(e) =>
//                                 setCallScheduleForm({ ...callScheduleForm, callTime: e.target.value })
//                             }
//                         />
//                         <Textarea
//                             label="Purpose"
//                             value={callScheduleForm.purpose}
//                             onChange={(e) =>
//                                 setCallScheduleForm({ ...callScheduleForm, purpose: e.target.value })
//                             }
//                         />
//                         <Select
//                             label="Reminder (minutes before)"
//                             value={callScheduleForm.reminderTime}
//                             onChange={(value) =>
//                                 setCallScheduleForm({ ...callScheduleForm, reminderTime: value })
//                             }
//                         >
//                             <Option value="5">5 minutes</Option>
//                             <Option value="15">15 minutes</Option>
//                             <Option value="30">30 minutes</Option>
//                             <Option value="60">1 hour</Option>
//                         </Select>
//                     </DialogBody>
//                     <DialogFooter>
//                         <Button
//                             variant="text"
//                             color="gray"
//                             onClick={() => setOpenCallSchedule(false)}
//                         >
//                             Cancel
//                         </Button>
//                         <Button
//                             variant="filled"
//                             color="green"
//                             onClick={handleCallScheduleSubmit}
//                         >
//                             Schedule
//                         </Button>
//                     </DialogFooter>
//                 </Dialog>
//             )}

//             {openReminderDialog && reminderDetails && (
//                 <Dialog
//                     open={openReminderDialog}
//                     handler={() => setOpenReminderDialog(false)}
//                     className="max-w-sm rounded-lg shadow-md"
//                 >
//                     <DialogHeader className="text-gray-800 font-semibold">Call Reminder</DialogHeader>
//                     <DialogBody className="space-y-2 text-gray-600">
//                         <p><strong>Company:</strong> {reminderDetails.companyName}</p>
//                         <p><strong>Call Time:</strong> {reminderDetails.callDate} {reminderDetails.callTime}</p>
//                         <p><strong>Purpose:</strong> {reminderDetails.purpose}</p>
//                     </DialogBody>
//                     <DialogFooter>
//                         <Button
//                             variant="filled"
//                             color="blue"
//                             onClick={() => setOpenReminderDialog(false)}
//                         >
//                             Close
//                         </Button>
//                     </DialogFooter>
//                 </Dialog>
//             )}
//         </div>
//     );
// }


// // import React, { useState, useEffect } from "react";
// // import { db } from "../../../../config/firebase";
// // import { collection, getDocs, doc, deleteDoc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
// // import { useAuth } from "../../../../context/AuthContext";
// // import { ToastContainer, toast } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";
// // import AddBulkCompanies from "./AddBulkCompanies";
// // import CompanyDetails from "./CompanyModal/CompanyDetails";
// // import JobOpenings from "./CompanyModal/JobOpenings";
// // import Notes from "./CompanyModal/Notes";
// // import PointsOfContact from "./CompanyModal/PointsOfContact";
// // import History from "./CompanyModal/History";
// // import SectionNav from "./CompanyModal/SectionNav";

// // const Companies = () => {
// //   const { user, rolePermissions, userDisplayName } = useAuth();
// //   const [companies, setCompanies] = useState([]);
// //   const [selectedCompany, setSelectedCompany] = useState(null);
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [isEditing, setIsEditing] = useState(false);
// //   const [companyData, setCompanyData] = useState({});
// //   const [jobOpenings, setJobOpenings] = useState([]);
// //   const [newJob, setNewJob] = useState({
// //     title: "",
// //     department: "",
// //     jobType: "",
// //     locationType: "",
// //     city: "",
// //     location: "",
// //     experienceMin: "",
// //     experienceMax: "",
// //     salary: "",
// //     currency: "USD",
// //     duration: "",
// //     description: "",
// //     postingDate: "",
// //     closingDate: "",
// //     status: "Open",
// //     skills: [],
// //     poc: "",
// //   });
// //   const [pointsOfContact, setPointsOfContact] = useState([]);
// //   const [newPOC, setNewPOC] = useState({
// //     name: "",
// //     email: "",
// //     countryCode: "+1",
// //     mobile: "",
// //     linkedinProfile: "",
// //     designation: "",
// //   });
// //   const [newNote, setNewNote] = useState("");
// //   const [noteType, setNoteType] = useState("general");
// //   const [currentSection, setCurrentSection] = useState(1);
// //   const [isBulkSidebarOpen, setIsBulkSidebarOpen] = useState(false);

// //   const canDisplay = rolePermissions?.Companies?.display || false;
// //   const canUpdate = rolePermissions?.Companies?.update || false;
// //   const canDelete = rolePermissions?.Companies?.delete || false;
// //   const canCreate = rolePermissions?.Companies?.create || false;

// //   const countryCodes = [
// //     { code: "+1", label: "USA (+1)" },
// //     { code: "+1", label: "Canada (+1)" },
// //     { code: "+91", label: "India (+91)" },
// //   ];

// //   useEffect(() => {
// //     if (canDisplay) {
// //       fetchCompanies();
// //     }
// //   }, [canDisplay]);

// //   const fetchCompanies = async () => {
// //     try {
// //       const querySnapshot = await getDocs(collection(db, "Companies"));
// //       const companiesList = querySnapshot.docs.map((doc) => ({
// //         id: doc.id,
// //         ...doc.data(),
// //       }));
// //       setCompanies(companiesList);
// //       console.log("Fetched companies:", companiesList);
// //     } catch (error) {
// //       console.error("Error fetching companies:", error);
// //       toast.error("Failed to fetch companies.");
// //     }
// //   };

// //   const handleRowClick = (company) => {
// //     setSelectedCompany(company);
// //     setCompanyData({
// //       name: company.name || "",
// //       domain: company.domain || "",
// //       phone: company.phone || "",
// //       email: company.email || "",
// //       address: company.address || "",
// //       city: company.city || "",
// //       url: company.url || "",
// //       companyType: company.companyType || "",
// //     });
// //     setPointsOfContact(company.pointsOfContact || []);
// //     setJobOpenings(company.jobOpenings || []);
// //     setIsModalOpen(true);
// //     setCurrentSection(1);
// //     setIsEditing(false);
// //   };

// //   const handleDeleteCompany = async (companyId, companyName) => {
// //     if (!canDelete) {
// //       toast.error("You don't have permission to delete companies.");
// //       return;
// //     }
// //     if (!window.confirm(`Are you sure you want to delete ${companyName}?`)) return;

// //     try {
// //       await deleteDoc(doc(db, "Companies", companyId));
// //       setCompanies(companies.filter((company) => company.id !== companyId));
// //       toast.success(`Company ${companyName} deleted successfully!`);
// //       logActivity("DELETE_COMPANY", { companyId, companyName });
// //     } catch (error) {
// //       console.error("Error deleting company:", error);
// //       toast.error(`Failed to delete company: ${error.message}`);
// //     }
// //   };

// //   const handleSaveCompany = async () => {
// //     if (!canUpdate) {
// //       toast.error("You don't have permission to update companies.");
// //       return;
// //     }

// //     try {
// //       const companyRef = doc(db, "Companies", selectedCompany.id);
// //       const historyEntry = {
// //         action: "Updated company details",
// //         performedBy: userDisplayName || "Unknown User",
// //         timestamp: new Date().toISOString(),
// //         details: `Updated fields: ${Object.keys(companyData).filter((key) => companyData[key] !== selectedCompany[key]).join(", ")}`,
// //       };

// //       await updateDoc(companyRef, {
// //         ...companyData,
// //         pointsOfContact,
// //         jobOpenings,
// //         history: arrayUnion(historyEntry),
// //         updatedAt: serverTimestamp(),
// //       });

// //       setCompanies(
// //         companies.map((company) =>
// //           company.id === selectedCompany.id
// //             ? { ...company, ...companyData, pointsOfContact, jobOpenings }
// //             : company
// //         )
// //       );
// //       setIsEditing(false);
// //       setIsModalOpen(false);
// //       toast.success("Company updated successfully!");
// //       logActivity("UPDATE_COMPANY", { companyId: selectedCompany.id, companyName: companyData.name });
// //     } catch (error) {
// //       console.error("Error updating company:", error);
// //       toast.error(`Failed to update company: ${error.message}`);
// //     }
// //   };

// //   const handleAddJobOpening = async () => {
// //     if (!canUpdate) {
// //       toast.error("You don't have permission to add job openings.");
// //       return;
// //     }

// //     const jobData = {
// //       ...newJob,
// //       companyId: selectedCompany.id,
// //       companyName: selectedCompany.name,
// //       skills: newJob.skills || [],
// //       poc: newJob.poc || "",
// //       postingDate: newJob.postingDate || new Date().toISOString().split("T")[0],
// //       closingDate: newJob.closingDate || "",
// //     };

// //     try {
// //       const updatedJobOpenings = [...jobOpenings, { id: `job_${Date.now()}`, ...jobData }];
// //       setJobOpenings(updatedJobOpenings);
// //       setNewJob({
// //         title: "",
// //         department: "",
// //         jobType: "",
// //         locationType: "",
// //         city: "",
// //         location: "",
// //         experienceMin: "",
// //         experienceMax: "",
// //         salary: "",
// //         currency: "USD",
// //         duration: "",
// //         description: "",
// //         postingDate: "",
// //         closingDate: "",
// //         status: "Open",
// //         skills: [],
// //         poc: "",
// //         companyId: selectedCompany.id,
// //         companyName: selectedCompany.name,
// //       });
// //       toast.success("Job opening added successfully!");
// //       logActivity("ADD_JOB_OPENING", { companyId: selectedCompany.id, jobTitle: jobData.title });
// //     } catch (error) {
// //       console.error("Error adding job opening:", error);
// //       toast.error(`Failed to add job opening: ${error.message}`);
// //     }
// //   };

// //   const handleUpdateJob = async (updatedJob) => {
// //     if (!canUpdate) {
// //       toast.error("You don't have permission to update job openings.");
// //       return;
// //     }

// //     try {
// //       const updatedJobOpenings = jobOpenings.map((job) =>
// //         job.id === updatedJob.id ? updatedJob : job
// //       );
// //       setJobOpenings(updatedJobOpenings);
// //       toast.success("Job opening updated successfully!");
// //       logActivity("UPDATE_JOB_OPENING", { companyId: selectedCompany.id, jobTitle: updatedJob.title });
// //     } catch (error) {
// //       console.error("Error updating job opening:", error);
// //       toast.error(`Failed to update job opening: ${error.message}`);
// //     }
// //   };

// //   const handleDeleteJob = async (jobId, jobTitle) => {
// //     if (!canUpdate) {
// //       toast.error("You don't have permission to delete job openings.");
// //       return;
// //     }

// //     try {
// //       const updatedJobOpenings = jobOpenings.filter((job) => job.id !== jobId);
// //       setJobOpenings(updatedJobOpenings);
// //       toast.success("Job opening deleted successfully!");
// //       logActivity("DELETE_JOB_OPENING", { companyId: selectedCompany.id, jobTitle });
// //     } catch (error) {
// //       console.error("Error deleting job opening:", error);
// //       toast.error(`Failed to delete job opening: ${error.message}`);
// //     }
// //   };

// //   const handlePOCChange = (field, value) => {
// //     if (field === "mobile") {
// //       value = value.replace(/\D/g, "").slice(0, 15);
// //     }
// //     setNewPOC({ ...newPOC, [field]: value });
// //   };

// //   const handleAddPOC = async () => {
// //     if (!canUpdate) {
// //       toast.error("You don't have permission to add points of contact.");
// //       return;
// //     }

// //     if (!newPOC.name.trim() || !newPOC.email.trim() || !newPOC.mobile.trim()) {
// //       toast.error("Please fill in all required POC details: Name, Email, Mobile.");
// //       return;
// //     }

// //     const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// //     const validatePOCMobile = (mobile) => /^\d{7,15}$/.test(mobile);

// //     if (!validateEmail(newPOC.email)) {
// //       toast.error("Please enter a valid email address for POC.");
// //       return;
// //     }

// //     if (!validatePOCMobile(newPOC.mobile)) {
// //       toast.error("POC mobile number must be 7-15 digits.");
// //       return;
// //     }

// //     try {
// //       const updatedPOCs = [
// //         ...pointsOfContact,
// //         {
// //           name: newPOC.name,
// //           email: newPOC.email,
// //           countryCode: newPOC.countryCode,
// //           mobile: newPOC.mobile,
// //           linkedinProfile: newPOC.linkedinProfile || "",
// //           designation: newPOC.designation || "",
// //         },
// //       ];
// //       setPointsOfContact(updatedPOCs);
// //       setNewPOC({
// //         name: "",
// //         email: "",
// //         countryCode: "+1",
// //         mobile: "",
// //         linkedinProfile: "",
// //         designation: "",
// //       });
// //       toast.success("Point of contact added successfully!");
// //       logActivity("ADD_POC", { companyId: selectedCompany.id, pocName: newPOC.name });
// //     } catch (error) {
// //       console.error("Error adding POC:", error);
// //       toast.error(`Failed to add POC: ${error.message}`);
// //     }
// //   };

// //   const handleRemovePOC = async (index) => {
// //     if (!canUpdate) {
// //       toast.error("You don't have permission to remove points of contact.");
// //       return;
// //     }

// //     try {
// //       const removedPOC = pointsOfContact[index];
// //       const updatedPOCs = pointsOfContact.filter((_, i) => i !== index);
// //       setPointsOfContact(updatedPOCs);
// //       toast.success("Point of contact removed successfully!");
// //       logActivity("REMOVE_POC", { companyId: selectedCompany.id, pocName: removedPOC.name });
// //     } catch (error) {
// //       console.error("Error removing POC:", error);
// //       toast.error(`Failed to remove POC: ${error.message}`);
// //     }
// //   };

// //   const handleUpdatePOC = async (updatedPOCs) => {
// //     if (!canUpdate) {
// //       toast.error("You don't have permission to update points of contact.");
// //       return;
// //     }

// //     try {
// //       setPointsOfContact(updatedPOCs);
// //       toast.success("Point of contact updated successfully!");
// //       logActivity("UPDATE_POC", { companyId: selectedCompany.id });
// //     } catch (error) {
// //       console.error("Error updating POC:", error);
// //       toast.error(`Failed to update POC: ${error.message}`);
// //     }
// //   };

// //   const handleAddNote = async (noteData) => {
// //     try {
// //       const updatedNotes = [
// //         ...(companyData.notes || []),
// //         {
// //           id: noteData.id,
// //           type: noteData.noteType,
// //           content: noteData.content,
// //           createdAt: new Date(),
// //           addedBy: userDisplayName || "Unknown User",
// //           ...(noteData.noteType === "call-schedule" && {
// //             callDate: noteData.callDate,
// //             callScheduledTime: noteData.callScheduledTime,
// //             reminderTime: noteData.reminderTime,
// //             status: "scheduled",
// //           }),
// //         },
// //       ];
// //       setCompanyData({ ...companyData, notes: updatedNotes });
// //     } catch (error) {
// //       console.error("Error updating note in UI:", error);
// //       toast.error(`Failed to update note in UI: ${error.message}`);
// //     }
// //   };

// //   const logActivity = async (action, details) => {
// //     try {
// //       await addDoc(collection(db, "activityLogs"), {
// //         action,
// //         details,
// //         timestamp: new Date().toISOString(),
// //         userEmail: user?.email || "anonymous",
// //         userId: user.uid,
// //       });
// //     } catch (error) {
// //       console.error("Error logging activity:", error);
// //     }
// //   };

// //   const renderField = (value) => {
// //     return value || "Not Provided";
// //   };

// //   const formatDateSafely = (date, format) => {
// //     try {
// //       if (!date) return "Not Provided";
// //       const d = date instanceof Date ? date : new Date(date);
// //       if (isNaN(d)) return "Invalid Date";
// //       if (format === "yyyy-MM-dd") {
// //         return d.toISOString().split("T")[0];
// //       }
// //       if (format === "MMMM d, yyyy") {
// //         return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
// //       }
// //       if (format === "MMM d, yyyy h:mm a") {
// //         return d.toLocaleString("en-US", {
// //           month: "short",
// //           day: "numeric",
// //           year: "numeric",
// //           hour: "numeric",
// //           minute: "2-digit",
// //           hour12: true,
// //         });
// //       }
// //       return d.toLocaleDateString();
// //     } catch {
// //       return "Invalid Date";
// //     }
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

// //   if (!canDisplay) {
// //     return <p className="text-sm text-gray-500">You don't have permission to view companies.</p>;
// //   }

// //   return ( 
// //   <div className="flex flex-col min-h-screen bg-gray-50 p-4 fixed inset-0 left-[300px]">
// //   <div className="flex justify-between items-center mb-6">
// //       <ToastContainer position="top-right" autoClose={3500} />
// //       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
// //         <h1 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-0">Companies</h1>
// //         {canCreate && (
// //           <button
// //             type="button"
// //             onClick={() => setIsBulkSidebarOpen(true)}
// //             className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
// //           >
// //             Add Bulk Companies
// //           </button>
// //         )}
// //       </div>

// //       <div className="overflow-x-auto">
// //         <table className="w-full table-auto">
// //           <thead className="bg-gray-100">
// //             <tr>
// //               <th className="px-3 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[60px]">Sr No</th>
// //               <th className="px-3 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[150px]">Company Name</th>
// //               <th className="px-3 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[120px]">Domain</th>
// //               <th className="px-3 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[120px]">Company Phone</th>
// //               <th className="px-3 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[150px]">Company Email</th>
// //               <th className="px-3 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[120px]">Company City</th>
// //               <th className="px-3 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[150px]">URL</th>
// //               <th className="px-3 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[120px]">Company Type</th>
// //               <th className="px-3 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[100px]">Action</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {companies.map((company, index) => (
// //               <tr
// //                 key={company.id}
// //                 className="border-b hover:bg-gray-50 cursor-pointer"
// //                 onClick={() => handleRowClick(company)}
// //               >
// //                 <td className="px-3 py-2 text-xs sm:text-sm text-gray-600">{index + 1}</td>
// //                 <td className="px-3 py-2 text-xs sm:text-sm text-gray-600 truncate">{renderField(company.name)}</td>
// //                 <td className="px-3 py-2 text-xs sm:text-sm text-gray-600 truncate">{renderField(company.domain)}</td>
// //                 <td className="px-3 py-2 text-xs sm:text-sm text-gray-600 truncate">{renderField(company.phone)}</td>
// //                 <td className="px-3 py-2 text-xs sm:text-sm text-gray-600 truncate">{renderField(company.email)}</td>
// //                 <td className="px-3 py-2 text-xs sm:text-sm text-gray-600 truncate">{renderField(company.city)}</td>
// //                 <td className="px-3 py-2 text-xs sm:text-sm text-gray-600 truncate">
// //                   {company.url ? (
// //                     <a
// //                       href={company.url}
// //                       target="_blank"
// //                       rel="noopener noreferrer"
// //                       className="text-blue-500 hover:underline"
// //                       onClick={(e) => e.stopPropagation()}
// //                     >
// //                       {company.url}
// //                     </a>
// //                   ) : (
// //                     "Not Provided"
// //                   )}
// //                 </td>
// //                 <td className="px-3 py-2 text-xs sm:text-sm text-gray-600 truncate">{renderField(company.companyType)}</td>
// //                 <td className="px-3 py-2 text-xs sm:text-sm flex gap-2">
// //                   <button
// //                     type="button"
// //                     onClick={(e) => {
// //                       e.stopPropagation();
// //                       handleRowClick(company);
// //                     }}
// //                     className="text-blue-500 hover:text-blue-700 font-bold"
// //                   >
// //                     ✎
// //                   </button>
// //                   <button
// //                     type="button"
// //                     onClick={(e) => {
// //                       e.stopPropagation();
// //                       handleDeleteCompany(company.id, company.name);
// //                     }}
// //                     disabled={!canDelete}
// //                     className="text-red-500 hover:text-red-700 font-bold disabled:text-gray-400 disabled:cursor-not-allowed"
// //                   >
// //                     ✕
// //                   </button>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>

// //       {isModalOpen && selectedCompany && (
// //         <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
// //           <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
// //             <div className="flex justify-between items-center mb-4">
// //               <h2 className="text-lg sm:text-xl font-bold text-gray-800">
// //                 {isEditing ? "Edit Company" : "Company Details"}
// //               </h2>
// //               <button
// //                 type="button"
// //                 onClick={() => {
// //                   setIsModalOpen(false);
// //                   setIsEditing(false);
// //                   setSelectedCompany(null);
// //                 }}
// //                 className="text-gray-500 hover:text-gray-700"
// //               >
// //                 <svg
// //                   xmlns="http://www.w3.org/2000/svg"
// //                   className="h-5 w-5"
// //                   fill="none"
// //                   viewBox="0 0 24 24"
// //                   stroke="currentColor"
// //                 >
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// //                 </svg>
// //               </button>
// //             </div>

// //             <SectionNav currentSection={currentSection} setCurrentSection={setCurrentSection} />

// //             {currentSection === 1 && (
// //               <CompanyDetails
// //                 companyData={companyData}
// //                 setCompanyData={setCompanyData}
// //                 isEditing={isEditing}
// //                 renderField={renderField}
// //               />
// //             )}
// //             {currentSection === 2 && (
// //               <JobOpenings
// //                 jobOpenings={jobOpenings}
// //                 newJob={newJob}
// //                 setNewJob={setNewJob}
// //                 isEditing={isEditing}
// //                 handleAddJobOpening={handleAddJobOpening}
// //                 renderField={renderField}
// //                 canUpdate={canUpdate}
// //                 company={selectedCompany}
// //                 onUpdateJob={handleUpdateJob}
// //                 onDeleteJob={handleDeleteJob}
// //               />
// //             )}
// //             {currentSection === 3 && (
// //               <Notes
// //                 companyData={companyData}
// //                 newNote={newNote}
// //                 setNewNote={setNewNote}
// //                 noteType={noteType}
// //                 setNoteType={setNoteType}
// //                 isEditing={isEditing}
// //                 handleAddNote={handleAddNote}
// //                 formatDateSafely={formatDateSafely}
// //                 formatNoteType={formatNoteType}
// //                 canUpdate={canUpdate}
// //                 userDisplayName={userDisplayName}
// //               />
// //             )}
// //             {currentSection === 4 && (
// //               <PointsOfContact
// //                 pointsOfContact={pointsOfContact}
// //                 newPOC={newPOC}
// //                 handlePOCChange={handlePOCChange}
// //                 handleAddPOC={handleAddPOC}
// //                 handleRemovePOC={handleRemovePOC}
// //                 isEditing={isEditing}
// //                 countryCodes={countryCodes}
// //                 canUpdate={canUpdate}
// //                 canCreate={canCreate}
// //                 company={selectedCompany}
// //                 onUpdatePOC={handleUpdatePOC}
// //               />
// //             )}
// //             {currentSection === 5 && (
// //               <History
// //                 companyData={companyData}
// //                 formatDateSafely={formatDateSafely}
// //                 canDisplay={canDisplay}
// //               />
// //             )}

// //             <div className="flex justify-end gap-2 mt-4">
// //               {isEditing ? (
// //                 <>
// //                   <button
// //                     type="button"
// //                     onClick={() => setIsEditing(false)}
// //                     className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
// //                   >
// //                     Cancel
// //                   </button>
// //                   <button
// //                     type="button"
// //                     onClick={handleSaveCompany}
// //                     disabled={!canUpdate}
// //                     className={`px-4 py-2 rounded-md text-white ${
// //                       canUpdate ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
// //                     }`}
// //                   >
// //                     Save
// //                   </button>
// //                 </>
// //               ) : (
// //                 <button
// //                   type="button"
// //                   onClick={() => setIsEditing(true)}
// //                   disabled={!canUpdate}
// //                   className={`px-4 py-2 rounded-md text-white ${
// //                     canUpdate ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
// //                   }`}
// //                 >
// //                   Edit
// //                 </button>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       <AddBulkCompanies
// //         isOpen={isBulkSidebarOpen}
// //         toggleSidebar={() => setIsBulkSidebarOpen(false)}
// //         fetchCompanies={fetchCompanies}
// //       />
// //     </div>
// //     </div>
// //   );
// // };

// // export default Companies;



// // import React, { useState, useEffect } from "react";
// // import { db } from "../../../../config/firebase";
// // import { collection, getDocs, doc, deleteDoc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
// // import { useAuth } from "../../../../context/AuthContext";
// // import { ToastContainer, toast } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";
// // import AddBulkCompanies from "./AddBulkCompanies";
// // import CompanyDetails from "./CompanyModal/CompanyDetails";
// // import JobOpenings from "./CompanyModal/JobOpenings";
// // import Notes from "./CompanyModal/Notes";
// // import PointsOfContact from "./CompanyModal/PointsOfContact";
// // import History from "./CompanyModal/History";
// // import SectionNav from "./CompanyModal/SectionNav";

// // const Companies = () => {
// //   const { user, rolePermissions, userDisplayName } = useAuth();
// //   const [companies, setCompanies] = useState([]);
// //   const [selectedCompany, setSelectedCompany] = useState(null);
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [isEditing, setIsEditing] = useState(false);
// //   const [companyData, setCompanyData] = useState({});
// //   const [jobOpenings, setJobOpenings] = useState([]);
// //   const [newJob, setNewJob] = useState({
// //     title: "",
// //     department: "",
// //     jobType: "",
// //     locationType: "",
// //     city: "",
// //     location: "",
// //     experienceMin: "",
// //     experienceMax: "",
// //     salary: "",
// //     currency: "USD",
// //     duration: "",
// //     description: "",
// //     postingDate: "",
// //     closingDate: "",
// //     status: "Open",
// //     skills: [],
// //     poc: "",
// //   });
// //   const [pointsOfContact, setPointsOfContact] = useState([]);
// //   const [newPOC, setNewPOC] = useState({
// //     name: "",
// //     email: "",
// //     countryCode: "+1",
// //     mobile: "",
// //     linkedinProfile: "",
// //     designation: "",
// //   });
// //   const [newNote, setNewNote] = useState("");
// //   const [noteType, setNoteType] = useState("general");
// //   const [currentSection, setCurrentSection] = useState(1);
// //   const [isBulkSidebarOpen, setIsBulkSidebarOpen] = useState(false);

// //   const canDisplay = rolePermissions?.Companies?.display || false;
// //   const canUpdate = rolePermissions?.Companies?.update || false;
// //   const canDelete = rolePermissions?.Companies?.delete || false;
// //   const canCreate = rolePermissions?.Companies?.create || false;

// //   const countryCodes = [
// //     { code: "+1", label: "USA (+1)" },
// //     { code: "+1", label: "Canada (+1)" },
// //     { code: "+91", label: "India (+91)" },
// //   ];

// //   useEffect(() => {
// //     if (canDisplay) {
// //       fetchCompanies();
// //     }
// //   }, [canDisplay]);

// //   const fetchCompanies = async () => {
// //     try {
// //       const querySnapshot = await getDocs(collection(db, "Companies"));
// //       const companiesList = querySnapshot.docs.map((doc) => ({
// //         id: doc.id,
// //         ...doc.data(),
// //       }));
// //       setCompanies(companiesList);
// //       // Debug log to inspect domain field
// //       console.log(
// //         "Fetched companies with domains:",
// //         companiesList.map((c) => ({ id: c.id, name: c.name, domain: c.domain }))
// //       );
// //     } catch (error) {
// //       console.error("Error fetching companies:", error);
// //       toast.error("Failed to fetch companies.");
// //     }
// //   };

// //   const handleRowClick = (company) => {
// //     setSelectedCompany(company);
// //     setCompanyData({
// //       name: company.name || "",
// //       domain: company.domain || "",
// //       phone: company.phone || "",
// //       email: company.email || "",
// //       address: company.address || "",
// //       city: company.city || "",
// //       url: company.url || "",
// //       companyType: company.companyType || "",
// //     });
// //     setPointsOfContact(company.pointsOfContact || []);
// //     setJobOpenings(company.jobOpenings || []);
// //     setIsModalOpen(true);
// //     setCurrentSection(1);
// //     setIsEditing(false);
// //   };

// //   const handleDeleteCompany = async (companyId, companyName) => {
// //     if (!canDelete) {
// //       toast.error("You don't have permission to delete companies.");
// //       return;
// //     }
// //     if (!window.confirm(`Are you sure you want to delete ${companyName}?`)) return;

// //     try {
// //       await deleteDoc(doc(db, "Companies", companyId));
// //       setCompanies(companies.filter((company) => company.id !== companyId));
// //       toast.success(`Company ${companyName} deleted successfully!`);
// //       logActivity("DELETE_COMPANY", { companyId, companyName });
// //     } catch (error) {
// //       console.error("Error deleting company:", error);
// //       toast.error(`Failed to delete company: ${error.message}`);
// //     }
// //   };

// //   const handleSaveCompany = async () => {
// //     if (!canUpdate) {
// //       toast.error("You don't have permission to update companies.");
// //       return;
// //     }

// //     try {
// //       const companyRef = doc(db, "Companies", selectedCompany.id);
// //       const historyEntry = {
// //         action: "Updated company details",
// //         performedBy: userDisplayName || "Unknown User",
// //         timestamp: new Date().toISOString(),
// //         details: `Updated fields: ${Object.keys(companyData).filter((key) => companyData[key] !== selectedCompany[key]).join(", ")}`,
// //       };

// //       await updateDoc(companyRef, {
// //         ...companyData,
// //         pointsOfContact,
// //         jobOpenings,
// //         history: arrayUnion(historyEntry),
// //         updatedAt: serverTimestamp(),
// //       });

// //       setCompanies(
// //         companies.map((company) =>
// //           company.id === selectedCompany.id
// //             ? { ...company, ...companyData, pointsOfContact, jobOpenings }
// //             : company
// //         )
// //       );
// //       setIsEditing(false);
// //       setIsModalOpen(false);
// //       toast.success("Company updated successfully!");
// //       logActivity("UPDATE_COMPANY", { companyId: selectedCompany.id, companyName: companyData.name });
// //     } catch (error) {
// //       console.error("Error updating company:", error);
// //       toast.error(`Failed to update company: ${error.message}`);
// //     }
// //   };

// //   const handleAddJobOpening = async () => {
// //     if (!canUpdate) {
// //       toast.error("You don't have permission to add job openings.");
// //       return;
// //     }

// //     const jobData = {
// //       ...newJob,
// //       companyId: selectedCompany.id,
// //       companyName: selectedCompany.name,
// //       skills: newJob.skills || [],
// //       poc: newJob.poc || "",
// //       postingDate: newJob.postingDate || new Date().toISOString().split("T")[0],
// //       closingDate: newJob.closingDate || "",
// //     };

// //     try {
// //       const updatedJobOpenings = [...jobOpenings, { id: `job_${Date.now()}`, ...jobData }];
// //       setJobOpenings(updatedJobOpenings);
// //       setNewJob({
// //         title: "",
// //         department: "",
// //         jobType: "",
// //         locationType: "",
// //         city: "",
// //         location: "",
// //         experienceMin: "",
// //         experienceMax: "",
// //         salary: "",
// //         currency: "USD",
// //         duration: "",
// //         description: "",
// //         postingDate: "",
// //         closingDate: "",
// //         status: "Open",
// //         skills: [],
// //         poc: "",
// //         companyId: selectedCompany.id,
// //         companyName: selectedCompany.name,
// //       });
// //       toast.success("Job opening added successfully!");
// //       logActivity("ADD_JOB_OPENING", { companyId: selectedCompany.id, jobTitle: jobData.title });
// //     } catch (error) {
// //       console.error("Error adding job opening:", error);
// //       toast.error(`Failed to add job opening: ${error.message}`);
// //     }
// //   };

// //   const handleUpdateJob = async (updatedJob) => {
// //     if (!canUpdate) {
// //       toast.error("You don't have permission to update job openings.");
// //       return;
// //     }

// //     try {
// //       const updatedJobOpenings = jobOpenings.map((job) =>
// //         job.id === updatedJob.id ? updatedJob : job
// //       );
// //       setJobOpenings(updatedJobOpenings);
// //       toast.success("Job opening updated successfully!");
// //       logActivity("UPDATE_JOB_OPENING", { companyId: selectedCompany.id, jobTitle: updatedJob.title });
// //     } catch (error) {
// //       console.error("Error updating job opening:", error);
// //       toast.error(`Failed to update job opening: ${error.message}`);
// //     }
// //   };

// //   const handleDeleteJob = async (jobId, jobTitle) => {
// //     if (!canUpdate) {
// //       toast.error("You don't have permission to delete job openings.");
// //       return;
// //     }

// //     try {
// //       const updatedJobOpenings = jobOpenings.filter((job) => job.id !== jobId);
// //       setJobOpenings(updatedJobOpenings);
// //       toast.success("Job opening deleted successfully!");
// //       logActivity("DELETE_JOB_OPENING", { companyId: selectedCompany.id, jobTitle });
// //     } catch (error) {
// //       console.error("Error deleting job opening:", error);
// //       toast.error(`Failed to delete job opening: ${error.message}`);
// //     }
// //   };

// //   const handlePOCChange = (field, value) => {
// //     if (field === "mobile") {
// //       value = value.replace(/\D/g, "");
// //     }
// //     setNewPOC({ ...newPOC, [field]: value });
// //   };

// //   const handleAddPOC = async () => {
// //     if (!canUpdate) {
// //       toast.error("You don't have a permission to update companies.");
// //       return;
// //     }

// //     if (!newPOC.name.trim() || !newPOC.email.trim() || !newPOC.mobile.trim()) {
// //       toast.error("Please fill in all required details: Name, Email, Mobile.");
// //       return;
// //     }

// //     const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// //     const validatePOCMobile = (mobile) => {
// //       return /^\d{7,15}$/.test(mobile);
// //     };

// //     if (!validateEmail(newPOC.email)) {
// //       toast.error("Please enter a valid email address for POC.");
// //       return;
// //     }

// //     if (!validatePOCMobile(newPOC.mobile)) {
// //       toast.error("POC mobile number must be 7-15 digits.");
// //       return;
// //     }
// //     try {
// //       const updatedPOCs = [
// //         ...pointsOfContact,
// //         {
// //           name: newPOC.name,
// //           email: newPOC.email,
// //           countryCode: newPOC.countryCode,
// //           mobile: newPOC.mobile,
// //           linkedinProfile: newPOC.linkedinProfile || "",
// //           designation: newPOC.designation || "",
// //         },
// //       ];
// //       setPointsOfContact(updatedPOCs);
// //       setNewPOC({
// //         name: "",
// //         email: "",
// //         countryCode: "+1",
// //         mobile: "",
// //         linkedinProfile: "",
// //         designation: "",
// //       });
// //       toast.success("Point of Contact added successfully!");
// //       logActivity("ADD_POC", { companyId: selectedCompany.id, pocName: newPOC.name });
// //     } catch (error) {
// //       console.error("Error adding POC:", error);
// //       toast.error(`Failed to add POC: ${error.message}`);
// //     }
// //   };

// //   const handleRemovePOC = async (index) => {
// //     if (!canUpdate) {
// //       toast.error("You don't have permission to remove points of contact.");
// //       return;
// //     }

// //     try {
// //       const removedPOC = pointsOfContact[index];
// //       const updatedPOCs = pointsOfContact.filter((_, i) => i !== index);
// //       setPointsOfContact(updatedPOCs);
// //       toast.success("Point of contact removed successfully!");
// //       logActivity("REMOVE_POC", { companyId: selectedCompany.id, pocName: removedPOC.name });
// //     } catch (error) {
// //       console.error("Error removing POC:", error);
// //       toast.error(`Failed to remove POC: ${error.message}`);
// //       };
// //     }
// //   };

// //   const handleUpdatePOC = async (updatedPOCs) => {
// //     if (!canUpdate) {
// //       toast.error("You don't have permission to update points of contact.");
// //       return;
// //     }

// //     try {
// //       setPointsOfContact(updatedPOCs);
// //       toast.success("Point of contact updated successfully!");
// //       logActivity("UPDATE_POC", { companyId: selectedCompany.id });
// //     } catch (error) {
// //       console.error("Error updating POC:", error);
// //       toast.error(`Failed to update POC: ${error.message}`);
// //       };
// //     }
// //   ;

// //   const handleAddNote = async (noteData) => {
// //     try {
// //       const updatedNotes = [
// //         ...(companyData.notes || []),
// //         {
// //           id: noteData.id,
// //           type: noteData.noteType,
// //           content: noteData.content,
// //           createdAt: new Date(),
// //           addedBy: userDisplayName || "Unknown User",
// //           ...(noteData.noteType === "call-schedule" && {
// //             callDate: noteData.callDate,
// //             callScheduledTime: noteData.callScheduledTime,
// //             reminderTime: noteData.reminderTime,
// //             status: "scheduled",
// //           }),
// //         },
// //       ];
// //       setCompanyData({ ...companyData, notes: updatedNotes });
// //     } catch (error) {
// //       console.error("Error updating note in UI:", error);
// //       toast.error(`Failed to update note in UI: ${error.message}`);
// //     }
// //   };

// //   const logActivity = async (action, details) => {
// //     try {
// //       await addDoc(collection(db, "activityLogs"), {
// //         action,
// //         details,
// //         timestamp: new Date().toISOString(),
// //         userEmail: user?.email || "anonymous",
// //         userId: user.uid,
// //       });
// //     } catch (error) {
// //       console.error("Error logging activity:", error);
// //     }
// //   };

// //   const renderField = (value) => {
// //     return value || "Not Provided";
// //   };

// //   const formatDateSafely = (date, format) => {
// //     try {
// //       if (!date) return "Not Provided";
// //       const d = date instanceof Date ? date : new Date(date);
// //       if (isNaN(d)) return "Invalid Date";
// //       if (format === "yyyy-MM-dd") {
// //         return d.toISOString().split("T")[0];
// //       }
// //       if (format === "MMMM d, yyyy") {
// //         return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
// //       }
// //       if (format === "MMM d, yyyy h:mm a") {
// //         return d.toLocaleString("en-US", {
// //           month: "short",
// //           day: "numeric",
// //           year: "numeric",
// //           hour: "numeric",
// //           minute: "2-digit",
// //           hour12: true,
// //         });
// //       }
// //       return d.toLocaleDateString();
// //     } catch {
// //       return "Invalid Date";
// //     }
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

// //   if (!canDisplay) {
// //     return <p className="text-sm text-gray-600">You don't have permission to view companies.</p>;
// //   }

// //   return (
// //     <>
// //       <ToastContainer position="top-right" autoClose={3500} />
// //       <div className="flex flex-col min-h-screen bg-gray-50 p-3 fixed inset-0 left-[280px]">
// //         <div className="flex justify-between items-center mb-4">
// //           <h3 className="text-lg font-bold text-gray-800">Companies</h3>
// //           {canCreate && (
// //             <button
// //               type="button"
// //               onClick={() => setIsBulkSidebarOpen(true)}
// //               className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
// //             >
// //               Add Bulk Companies
// //             </button>
// //           )}
// //         </div>

// //         <div className="overflow-x-auto max-h-[calc(100vh-200px)] overflow-y-auto">
// //           <table className="w-full table-auto bg-white rounded">
// //             <thead className="bg-gray-100 sticky top-0">
// //               <tr>
// //                 <th className="px-4 py-2 text-sm font-semibold text-gray-700 text-left min-w-[60px]">Sr No</th>
// //                 <th className="px-4 py-2 text-sm font-semibold text-gray-700 text-left min-w-[150px]">Company Name</th>
// //                 <th className="px-4 py-2 text-sm font-semibold text-gray-700 text-left min-w-[120px]">Domain</th>
// //                 <th className="px-4 py-2 text-sm font-semibold text-gray-700 text-left min-w-[120px]">Company Phone</th>
// //                 <th className="px-4 py-2 text-sm font-semibold text-gray-700 text-left min-w-[150px]">Company Email</th>
// //                 <th className="px-4 py-2 text-sm font-semibold text-gray-700 text-left min-w-[120px]">Company City</th>
// //                 <th className="px-4 py-2 text-sm font-semibold text-gray-700 text-left min-w-[150px]">URL</th>
// //                 <th className="px-4 py-2 text-sm font-semibold text-gray-700 text-left min-w-[120px]">Company Type</th>
// //                 <th className="px-4 py-2 text-sm font-semibold text-gray-700 text-left min-w-[100px]">Action</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {companies.map((company, index) => (
// //                 <tr
// //                   key={company.id}
// //                   className="border-b hover:bg-gray-50 cursor-pointer"
// //                   onClick={() => handleRowClick(company)}
// //                 >
// //                   <td className="px-4 py-2 text-sm text-gray-600">{index + 1}</td>
// //                   <td className="px-4 py-2 text-sm text-gray-600 truncate">{renderField(company.name)}</td>
// //                   <td className="px-4 py-2 text-sm text-gray-600 truncate">{renderField(company.domain)}</td>
// //                   <td className="px-4 py-2 text-sm text-gray-600 truncate">{renderField(company.phone)}</td>
// //                   <td className="px-4 py-2 text-sm text-gray-600 truncate">{renderField(company.email)}</td>
// //                   <td className="px-4 py-2 text-sm text-gray-600 truncate">{renderField(company.city)}</td>
// //                   <td className="px-4 py-2 text-sm text-gray-600 truncate">
// //                     {company.url ? (
// //                       <a
// //                         href={company.url}
// //                         target="_blank"
// //                         rel="noopener noreferrer"
// //                         className="text-blue-600 hover:underline"
// //                         onClick={(e) => e.stopPropagation()}
// //                       >
// //                         {company.url}
// //                       </a>
// //                     ) : (
// //                       "Not provided"
// //                     )}
// //                   </td>
// //                   <td className="px-4 py-2 text-sm text-gray-600 truncate">{renderField(company.companyType)}</td>
// //                   <td className="px-4 py-2 text-sm flex items-center gap-2">
// //                     <button
// //                       type="button"
// //                       onClick={(e) => {
// //                         e.stopPropagation();
// //                         handleRowClick(company);
// //                       }}
// //                       className="text-blue-600 hover:text-blue-800"
// //                     >
// //                       ✎
// //                     </button>
// //                     <button
// //                       type="button"
// //                       onClick={(e) => {
// //                         e.stopPropagation();
// //                         handleDeleteCompany(company.id, company.name);
// //                       }}
// //                       disabled={!canDelete}
// //                       className="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
// //                     >
// //                       ✕
// //                     </button>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>

// //         {isModalOpen && selectedCompany && (
// //           <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
// //             <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto">
// //               <div className="flex justify-between items-center mb-4">
// //                 <h2 className="text-xl font-bold text-gray-700">
// //                   {isEditing ? "Edit Company" : "Company Details"}
// //                 </h2>
// //                 <button
// //                   type="button"
// //                   onClick={() => {
// //                     setIsModalOpen(false);
// //                     setIsEditing(false);
// //                     setSelectedCompany(null);
// //                   }}
// //                   className="text-gray-500 hover:text-gray-700"
// //                 >
// //                   <svg
// //                     xmlns="http://www.w3.org/2000/svg"
// //                     className="h-5 w-5"
// //                     fill="none"
// //                     viewBox="0 0 24 24"
// //                     stroke="currentColor"
// //                   >
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
// //                   </svg>
// //                 </button>
// //               </div>

// //               <SectionNav currentSection={currentSection} setCurrentSection={setCurrentSection} />

// //               {currentSection === 1 && (
// //                 <CompanyDetails
// //                   companyData={companyData}
// //                   setCompanyData={setCompanyData}
// //                   isEditing={isEditing}
// //                   renderField={renderField}
// //                 />
// //               )}
// //               {currentSection === 2 && (
// //                 <JobOpenings
// //                   jobOpenings={jobOpenings}
// //                   newJob={newJob}
// //                   setNewJob={setNewJob}
// //                   isEditing={isEditing}
// //                   handleAddJobOpening={handleAddJobOpening}
// //                   renderField={renderField}
// //                   canUpdate={canUpdate}
// //                   company={selectedCompany}
// //                   onUpdateJob={handleUpdateJob}
// //                   onDeleteJob={handleDeleteJob}
// //                 />
// //               )}
// //               {currentSection === 3 && (
// //                 <Notes
// //                   companyData={companyData}
// //                   newNote={newNote}
// //                   setNewNote={setNewNote}
// //                   noteType={noteType}
// //                   setNoteType={setNoteType}
// //                   isEditing={isEditing}
// //                   handleAddNote={handleAddNote}
// //                   formatDateSafely={formatDateSafely}
// //                   formatNoteType={formatNoteType}
// //                   canUpdate={canUpdate}
// //                   userDisplayName={userDisplayName}
// //                 />
// //               )}
// //               {currentSection === 4 && (
// //                 <PointsOfContact
// //                   pointsOfContact={pointsOfContact}
// //                   newPOC={newPOC}
// //                   handlePOCChange={handlePOCChange}
// //                   handleAddPOC={handleAddPOC}
// //                   handleRemovePOC={handleRemovePOC}
// //                   isEditing={isEditing}
// //                   countryCodes={countryCodes}
// //                   canUpdate={canUpdate}
// //                   canCreate={canCreate}
// //                   company={selectedCompany}
// //                   onUpdatePOC={handleUpdatePOC}
// //                 />
// //               )}
// //               {currentSection === 5 && (
// //                 <History
// //                   companyData={companyData}
// //                   formatDate={formatDate}
// //                   canDisplay={canDisplay}
// //                 />
// //               )}

// //               <div className="flex justify-end gap-2 mt-                {isEditing ? (
// //                   <>
// //                     <button
// //                       type="button"
// //                       onClick={() => setIsEditing(false)}
// //                       className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
// //                     >
// //                       Cancel
// //                     </button>
// //                     <button
// //                       type="button"
// //                       onClick={handleSaveCompany}
// //                       disabled={!canUpdate}
// //                       className={`px-4 py-2 rounded-md text-white ${
// //                         canUpdate ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
// //                       }`}
// //                     >
// //                       Save
// //                     </button>
// //                   </>
// //                 ) : (
// //                   <button
// //                     type="button"
// //                       onClick={() => setIsEditing(true)}
// //                       disabled={!canUpdate}
// //                       className={`px-4 py-2 rounded-md text-white ${
// //                         canUpdate ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
// //                       }`}
// //                     >
// //                       Edit
// //                     </button>
// //                 )}
// //             </div>
// //           </div>
// //         </div>
// //       <AddBulkCompanies
// //         isOpen={isBulkSidebarOpen}
// //         toggleSidebar={() => setIsBulkSidebarOpen(false)}
// //         fetchCompanies={fetchCompanies}
// //       />
// //     </>
// //   );
// // };

// // export default Companies;



// // import React, { useState, useEffect } from "react";
// // import { db } from "../../../../config/firebase";
// // import { collection, getDocs, doc, deleteDoc, updateDoc, arrayUnion, serverTimestamp, addDoc } from "firebase/firestore";
// // import { useAuth } from "../../../../context/AuthContext";
// // import { ToastContainer, toast } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";
// // import AddBulkCompanies from "./AddBulkCompanies";
// // import CompanyDetails from "./CompanyModal/CompanyDetails";
// // import JobOpenings from "./CompanyModal/JobOpenings";
// // import Notes from "./CompanyModal/Notes";
// // import PointsOfContact from "./CompanyModal/PointsOfContact";
// // import History from "./CompanyModal/History";
// // import SectionNav from "./CompanyModal/SectionNav";

// // const Companies = () => {
// //   const { user, rolePermissions, userDisplayName } = useAuth();
// //   const [companies, setCompanies] = useState([]);
// //   const [selectedCompany, setSelectedCompany] = useState(null);
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [isEditing, setIsEditing] = useState(false);
// //   const [companyData, setCompanyData] = useState({});
// //   const [jobOpenings, setJobOpenings] = useState([]);
// //   const [newJob, setNewJob] = useState({
// //     title: "",
// //     department: "",
// //     jobType: "",
// //     locationType: "",
// //     city: "",
// //     location: "",
// //     experienceMin: "",
// //     experienceMax: "",
// //     salary: "",
// //     currency: "USD",
// //     duration: "",
// //     description: "",
// //     postingDate: "",
// //     closingDate: "",
// //     status: "Open",
// //     skills: [],
// //     poc: "",
// //   });
// //   const [pointsOfContact, setPointsOfContact] = useState([]);
// //   const [newPOC, setNewPOC] = useState({
// //     name: "",
// //     email: "",
// //     countryCode: "+1",
// //     mobile: "",
// //     linkedinProfile: "",
// //     designation: "",
// //   });
// //   const [newNote, setNewNote] = useState("");
// //   const [noteType, setNoteType] = useState("general");
// //   const [currentSection, setCurrentSection] = useState(1);
// //   const [isBulkSidebarOpen, setIsBulkSidebarOpen] = useState(false);

// //   const canDisplay = rolePermissions?.Companies?.display || false;
// //   const canUpdate = rolePermissions?.Companies?.update || false;
// //   const canDelete = rolePermissions?.Companies?.delete || false;
// //   const canCreate = rolePermissions?.Companies?.create || false;

// //   const countryCodes = [
// //     { code: "+1", label: "USA (+1)" },
// //     { code: "+1", label: "Canada (+1)" },
// //     { code: "+91", label: "India (+91)" },
// //   ];

// //   useEffect(() => {
// //     if (canDisplay) {
// //       fetchCompanies();
// //     }
// //   }, [canDisplay]);

// //   const fetchCompanies = async () => {
// //     try {
// //       const querySnapshot = await getDocs(collection(db, "Companies"));
// //       const companiesList = querySnapshot.docs.map((doc) => ({
// //         id: doc.id,
// //         ...doc.data(),
// //       }));
// //       setCompanies(companiesList);
// //       console.log(
// //         "Fetched companies with domains:",
// //         companiesList.map((c) => ({ id: c.id, name: c.name, domain: c.domain }))
// //       );
// //     } catch (error) {
// //       console.error("Error fetching companies:", error);
// //       toast.error("Failed to fetch companies.");
// //     }
// //   };

// //   const handleRowClick = (company) => {
// //     setSelectedCompany(company);
// //     setCompanyData({
// //       name: company.name || "",
// //       domain: company.domain || "",
// //       phone: company.phone || "",
// //       email: company.email || "",
// //       address: company.address || "",
// //       city: company.city || "",
// //       url: company.url || "",
// //       companyType: company.companyType || "",
// //     });
// //     setPointsOfContact(company.pointsOfContact || []);
// //     setJobOpenings(company.jobOpenings || []);
// //     setIsModalOpen(true);
// //     setCurrentSection(1);
// //     setIsEditing(false);
// //   };

// //   const handleDeleteCompany = async (companyId, companyName) => {
// //     if (!canDelete) {
// //       toast.error("You don't have permission to delete companies.");
// //       return;
// //     }
// //     if (!window.confirm(`Are you sure you want to delete ${companyName}?`)) return;

// //     try {
// //       await deleteDoc(doc(db, "Companies", companyId));
// //       setCompanies(companies.filter((company) => company.id !== companyId));
// //       toast.success(`Company ${companyName} deleted successfully!`);
// //       logActivity("DELETE_COMPANY", { companyId, companyName });
// //     } catch (error) {
// //       console.error("Error deleting company:", error);
// //       toast.error(`Failed to delete company: ${error.message}`);
// //     }
// //   };

// //   const handleSaveCompany = async () => {
// //     if (!canUpdate) {
// //       toast.error("You don't have permission to update companies.");
// //       return;
// //     }

// //     try {
// //       const companyRef = doc(db, "Companies", selectedCompany.id);
// //       const historyEntry = {
// //         action: "Updated company details",
// //         performedBy: userDisplayName || "Unknown User",
// //         timestamp: new Date().toISOString(),
// //         details: `Updated fields: ${Object.keys(companyData).filter((key) => companyData[key] !== selectedCompany[key]).join(", ")}`,
// //       };

// //       await updateDoc(companyRef, {
// //         ...companyData,
// //         pointsOfContact,
// //         jobOpenings,
// //         history: arrayUnion(historyEntry),
// //         updatedAt: serverTimestamp(),
// //       });

// //       setCompanies(
// //         companies.map((company) =>
// //           company.id === selectedCompany.id
// //             ? { ...company, ...companyData, pointsOfContact, jobOpenings }
// //             : company
// //         )
// //       );
// //       setIsEditing(false);
// //       setIsModalOpen(false);
// //       toast.success("Company updated successfully!");
// //       logActivity("UPDATE_COMPANY", { companyId: selectedCompany.id, companyName: companyData.name });
// //     } catch (error) {
// //       console.error("Error updating company:", error);
// //       toast.error(`Failed to update company: ${error.message}`);
// //     }
// //   };

// //   const handleAddJobOpening = async () => {
// //     if (!canUpdate) {
// //       toast.error("You don't have permission to add job openings.");
// //       return;
// //     }

// //     const jobData = {
// //       ...newJob,
// //       companyId: selectedCompany.id,
// //       companyName: selectedCompany.name,
// //       skills: newJob.skills || [],
// //       poc: newJob.poc || "",
// //       postingDate: newJob.postingDate || new Date().toISOString().split("T")[0],
// //       closingDate: newJob.closingDate || "",
// //     };

// //     try {
// //       const updatedJobOpenings = [...jobOpenings, { id: `job_${Date.now()}`, ...jobData }];
// //       setJobOpenings(updatedJobOpenings);
// //       setNewJob({
// //         title: "",
// //         department: "",
// //         jobType: "",
// //         locationType: "",
// //         city: "",
// //         location: "",
// //         experienceMin: "",
// //         experienceMax: "",
// //         salary: "",
// //         currency: "USD",
// //         duration: "",
// //         description: "",
// //         postingDate: "",
// //         closingDate: "",
// //         status: "Open",
// //         skills: [],
// //         poc: "",
// //       });
// //       toast.success("Job opening added successfully!");
// //       logActivity("ADD_JOB_OPENING", { companyId: selectedCompany.id, jobTitle: jobData.title });
// //     } catch (error) {
// //       console.error("Error adding job opening:", error);
// //       toast.error(`Failed to add job opening: ${error.message}`);
// //     }
// //   };

// //   const handleUpdateJob = async (updatedJob) => {
// //     if (!canUpdate) {
// //       toast.error("You don't have permission to update job openings.");
// //       return;
// //     }

// //     try {
// //       const updatedJobOpenings = jobOpenings.map((job) =>
// //         job.id === updatedJob.id ? updatedJob : job
// //       );
// //       setJobOpenings(updatedJobOpenings);
// //       toast.success("Job opening updated successfully!");
// //       logActivity("UPDATE_JOB_OPENING", { companyId: selectedCompany.id, jobTitle: updatedJob.title });
// //     } catch (error) {
// //       console.error("Error updating job opening:", error);
// //       toast.error(`Failed to update job opening: ${error.message}`);
// //     }
// //   };

// //   const handleDeleteJob = async (jobId, jobTitle) => {
// //     if (!canUpdate) {
// //       toast.error("You don't have permission to delete job openings.");
// //       return;
// //     }

// //     try {
// //       const updatedJobOpenings = jobOpenings.filter((job) => job.id !== jobId);
// //       setJobOpenings(updatedJobOpenings);
// //       toast.success("Job opening deleted successfully!");
// //       logActivity("DELETE_JOB_OPENING", { companyId: selectedCompany.id, jobTitle });
// //     } catch (error) {
// //       console.error("Error deleting job opening:", error);
// //       toast.error(`Failed to delete job opening: ${error.message}`);
// //     }
// //   };

// //   const handlePOCChange = (field, value) => {
// //     if (field === "mobile") {
// //       value = value.replace(/\D/g, "");
// //     }
// //     setNewPOC({ ...newPOC, [field]: value });
// //   };

// //   const handleAddPOC = async () => {
// //     if (!canUpdate) {
// //       toast.error("You don't have a permission to update companies.");
// //       return;
// //     }

// //     if (!newPOC.name.trim() || !newPOC.email.trim() || !newPOC.mobile.trim()) {
// //       toast.error("Please fill in all required details: Name, Email, Mobile.");
// //       return;
// //     }

// //     const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// //     const validatePOCMobile = (mobile) => {
// //       return /^\d{7,15}$/.test(mobile);
// //     };

// //     if (!validateEmail(newPOC.email)) {
// //       toast.error("Please enter a valid email address for POC.");
// //       return;
// //     }

// //     if (!validatePOCMobile(newPOC.mobile)) {
// //       toast.error("POC mobile number must be 7-15 digits.");
// //       return;
// //     }
// //     try {
// //       const updatedPOCs = [
// //         ...pointsOfContact,
// //         {
// //           name: newPOC.name,
// //           email: newPOC.email,
// //           countryCode: newPOC.countryCode,
// //           mobile: newPOC.mobile,
// //           linkedinProfile: newPOC.linkedinProfile || "",
// //           designation: newPOC.designation || "",
// //         },
// //       ];
// //       setPointsOfContact(updatedPOCs);
// //       setNewPOC({
// //         name: "",
// //         email: "",
// //         countryCode: "+1",
// //         mobile: "",
// //         linkedinProfile: "",
// //         designation: "",
// //       });
// //       toast.success("Point of Contact added successfully!");
// //       logActivity("ADD_POC", { companyId: selectedCompany.id, pocName: newPOC.name });
// //     } catch (error) {
// //       console.error("Error adding POC:", error);
// //       toast.error(`Failed to add POC: ${error.message}`);
// //     }
// //   };

// //   const handleRemovePOC = async (index) => {
// //     if (!canUpdate) {
// //       toast.error("You don't have permission to remove points of contact.");
// //       return;
// //     }

// //     try {
// //       const removedPOC = pointsOfContact[index];
// //       const updatedPOCs = pointsOfContact.filter((_, i) => i !== index);
// //       setPointsOfContact(updatedPOCs);
// //       toast.success("Point of contact removed successfully!");
// //       logActivity("REMOVE_POC", { companyId: selectedCompany.id, pocName: removedPOC.name });
// //     } catch (error) {
// //       console.error("Error removing POC:", error);
// //       toast.error(`Failed to remove POC: ${error.message}`);
// //     }
// //   };

// //   const handleUpdatePOC = async (updatedPOCs) => {
// //     if (!canUpdate) {
// //       toast.error("You don't have permission to update points of contact.");
// //       return;
// //     }

// //     try {
// //       setPointsOfContact(updatedPOCs);
// //       toast.success("Point of contact updated successfully!");
// //       logActivity("UPDATE_POC", { companyId: selectedCompany.id });
// //     } catch (error) {
// //       console.error("Error updating POC:", error);
// //       toast.error(`Failed to update POC: ${error.message}`);
// //     }
// //   };

// //   const handleAddNote = async (noteData) => {
// //     try {
// //       const updatedNotes = [
// //         ...(companyData.notes || []),
// //         {
// //           id: noteData.id,
// //           type: noteData.noteType,
// //           content: noteData.content,
// //           createdAt: new Date(),
// //           addedBy: userDisplayName || "Unknown User",
// //           ...(noteData.noteType === "call-schedule" && {
// //             callDate: noteData.callDate,
// //             callScheduledTime: noteData.callScheduledTime,
// //             reminderTime: noteData.reminderTime,
// //             status: "scheduled",
// //           }),
// //         },
// //       ];
// //       setCompanyData({ ...companyData, notes: updatedNotes });
// //     } catch (error) {
// //       console.error("Error updating note in UI:", error);
// //       toast.error(`Failed to update note in UI: ${error.message}`);
// //     }
// //   };

// //   const logActivity = async (action, details) => {
// //     try {
// //       await addDoc(collection(db, "activityLogs"), {
// //         action,
// //         details,
// //         timestamp: new Date().toISOString(),
// //         userEmail: user?.email || "anonymous",
// //         userId: user.uid,
// //       });
// //     } catch (error) {
// //       console.error("Error logging activity:", error);
// //     }
// //   };

// //   const renderField = (value) => {
// //     return value || "Not Provided";
// //   };

// //   const formatDateSafely = (date, format) => {
// //     try {
// //       if (!date) return "Not Provided";
// //       const d = date instanceof Date ? date : new Date(date);
// //       if (isNaN(d)) return "Invalid Date";
// //       if (format === "yyyy-MM-dd") {
// //         return d.toISOString().split("T")[0];
// //       }
// //       if (format === "MMMM d, yyyy") {
// //         return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
// //       }
// //       if (format === "MMM d, yyyy h:mm a") {
// //         return d.toLocaleString("en-US", {
// //           month: "short",
// //           day: "numeric",
// //           year: "numeric",
// //           hour: "numeric",
// //           minute: "2-digit",
// //           hour12: true,
// //         });
// //       }
// //       return d.toLocaleDateString();
// //     } catch {
// //       return "Invalid Date";
// //     }
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

// //   if (!canDisplay) {
// //     return <p className="text-sm text-gray-600">You don't have permission to view companies.</p>;
// //   }

// //   return (
// //     <>
// //       <ToastContainer position="top-right" autoClose={3500} />
// //       <div className="flex flex-col min-h-screen bg-gray-50 p-3 fixed inset-0 left-[280px]">
// //         <div className="flex justify-between items-center mb-4">
// //           <h3 className="text-lg font-bold text-gray-800">Companies</h3>
// //           {canCreate && (
// //             <button
// //               type="button"
// //               onClick={() => setIsBulkSidebarOpen(true)}
// //               className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
// //             >
// //               Add Bulk Companies
// //             </button>
// //           )}
// //         </div>

// //         <div className="overflow-x-auto max-h-[calc(100vh-200px)] overflow-y-auto">
// //           <table className="w-full table-auto bg-white rounded">
// //             <thead className="bg-gray-100 sticky top-0">
// //               <tr>
// //                 <th className="px-4 py-2 text-sm font-semibold text-gray-700 text-left min-w-[60px]">Sr No</th>
// //                 <th className="px-4 py-2 text-sm font-semibold text-gray-700 text-left min-w-[150px]">Company Name</th>
// //                 <th className="px-4 py-2 text-sm font-semibold text-gray-700 text-left min-w-[120px]">Domain</th>
// //                 <th className="px-4 py-2 text-sm font-semibold text-gray-700 text-left min-w-[120px]">Company Phone</th>
// //                 <th className="px-4 py-2 text-sm font-semibold text-gray-700 text-left min-w-[150px]">Company Email</th>
// //                 <th className="px-4 py-2 text-sm font-semibold text-gray-700 text-left min-w-[120px]">Company City</th>
// //                 <th className="px-4 py-2 text-sm font-semibold text-gray-700 text-left min-w-[150px]">URL</th>
// //                 <th className="px-4 py-2 text-sm font-semibold text-gray-700 text-left min-w-[120px]">Company Type</th>
// //                 <th className="px-4 py-2 text-sm font-semibold text-gray-700 text-left min-w-[100px]">Action</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {companies.map((company, index) => (
// //                 <tr
// //                   key={company.id}
// //                   className="border-b hover:bg-gray-50 cursor-pointer"
// //                   onClick={() => handleRowClick(company)}
// //                 >
// //                   <td className="px-4 py-2 text-sm text-gray-600">{index + 1}</td>
// //                   <td className="px-4 py-2 text-sm text-gray-600 truncate">{renderField(company.name)}</td>
// //                   <td className="px-4 py-2 text-sm text-gray-600 truncate">{renderField(company.domain)}</td>
// //                   <td className="px-4 py-2 text-sm text-gray-600 truncate">{renderField(company.phone)}</td>
// //                   <td className="px-4 py-2 text-sm text-gray-600 truncate">{renderField(company.email)}</td>
// //                   <td className="px-4 py-2 text-sm text-gray-600 truncate">{renderField(company.city)}</td>
// //                   <td className="px-4 py-2 text-sm text-gray-600 truncate">
// //                     {company.url ? (
// //                       <a
// //                         href={company.url}
// //                         target="_blank"
// //                         rel="noopener noreferrer"
// //                         className="text-blue-600 hover:underline"
// //                         onClick={(e) => e.stopPropagation()}
// //                       >
// //                         {company.url}
// //                       </a>
// //                     ) : (
// //                       "Not Provided"
// //                     )}
// //                   </td>
// //                   <td className="px-4 py-2 text-sm text-gray-600 truncate">{renderField(company.companyType)}</td>
// //                   <td className="px-4 py-2 text-sm flex items-center gap-2">
// //                     <button
// //                       type="button"
// //                       onClick={(e) => {
// //                         e.stopPropagation();
// //                         handleRowClick(company);
// //                       }}
// //                       className="text-blue-600 hover:text-blue-800"
// //                     >
// //                       ✎
// //                     </button>
// //                     <button
// //                       type="button"
// //                       onClick={(e) => {
// //                         e.stopPropagation();
// //                         handleDeleteCompany(company.id, company.name);
// //                       }}
// //                       disabled={!canDelete}
// //                       className="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
// //                     >
// //                       ✕
// //                     </button>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>

// //         {isModalOpen && selectedCompany && (
// //           <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
// //             <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto">
// //               <div className="flex justify-between items-center mb-4">
// //                 <h2 className="text-xl font-bold text-gray-800">
// //                   {isEditing ? "Edit Company" : "Company Details"}
// //                 </h2>
// //                 <button
// //                   type="button"
// //                   onClick={() => {
// //                     setIsModalOpen(false);
// //                     setIsEditing(false);
// //                     setSelectedCompany(null);
// //                   }}
// //                   className="text-gray-500 hover:text-gray-700"
// //                 >
// //                   <svg
// //                     xmlns="http://www.w3.org/2000/svg"
// //                     className="h-5 w-5"
// //                     fill="none"
// //                     viewBox="0 0 24 24"
// //                     stroke="currentColor"
// //                   >
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// //                   </svg>
// //                 </button>
// //               </div>

// //               <SectionNav currentSection={currentSection} setCurrentSection={setCurrentSection} />

// //               {currentSection === 1 && (
// //                 <CompanyDetails
// //                   companyData={companyData}
// //                   setCompanyData={setCompanyData}
// //                   isEditing={isEditing}
// //                   renderField={renderField}
// //                 />
// //               )}
// //               {currentSection === 2 && (
// //                 <JobOpenings
// //                   jobOpenings={jobOpenings}
// //                   newJob={newJob}
// //                   setNewJob={setNewJob}
// //                   isEditing={isEditing}
// //                   handleAddJobOpening={handleAddJobOpening}
// //                   renderField={renderField}
// //                   canUpdate={canUpdate}
// //                   company={selectedCompany}
// //                   onUpdateJob={handleUpdateJob}
// //                   onDeleteJob={handleDeleteJob}
// //                 />
// //               )}
// //               {currentSection === 3 && (
// //                 <Notes
// //                   companyData={companyData}
// //                   newNote={newNote}
// //                   setNewNote={setNewNote}
// //                   noteType={noteType}
// //                   setNoteType={setNoteType}
// //                   isEditing={isEditing}
// //                   handleAddNote={handleAddNote}
// //                   formatDateSafely={formatDateSafely}
// //                   formatNoteType={formatNoteType}
// //                   canUpdate={canUpdate}
// //                   userDisplayName={userDisplayName}
// //                 />
// //               )}
// //               {currentSection === 4 && (
// //                 <PointsOfContact
// //                   pointsOfContact={pointsOfContact}
// //                   newPOC={newPOC}
// //                   handlePOCChange={handlePOCChange}
// //                   handleAddPOC={handleAddPOC}
// //                   handleRemovePOC={handleRemovePOC}
// //                   isEditing={isEditing}
// //                   countryCodes={countryCodes}
// //                   canUpdate={canUpdate}
// //                   canCreate={canCreate}
// //                   company={selectedCompany}
// //                   onUpdatePOC={handleUpdatePOC}
// //                 />
// //               )}
// //               {currentSection === 5 && (
// //                 <History
// //                   companyData={companyData}
// //                   formatDateSafely={formatDateSafely}
// //                   canDisplay={canDisplay}
// //                 />
// //               )}

// //               <div className="flex justify-end gap-2 mt-4">
// //                 {isEditing ? (
// //                   <>
// //                     <button
// //                       type="button"
// //                       onClick={() => setIsEditing(false)}
// //                       className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
// //                     >
// //                       Cancel
// //                     </button>
// //                     <button
// //                       type="button"
// //                       onClick={handleSaveCompany}
// //                       disabled={!canUpdate}
// //                       className={`px-4 py-2 rounded-md text-white ${
// //                         canUpdate ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
// //                       }`}
// //                     >
// //                       Save
// //                     </button>
// //                   </>
// //                 ) : (
// //                   <button
// //                     type="button"
// //                     onClick={() => setIsEditing(true)}
// //                     disabled={!canUpdate}
// //                     className={`px-4 py-2 rounded-md text-white ${
// //                       canUpdate ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
// //                     }`}
// //                   >
// //                     Edit
// //                   </button>
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //         )}

// //         <AddBulkCompanies
// //           isOpen={isBulkSidebarOpen}
// //           toggleSidebar={() => setIsBulkSidebarOpen(false)}
// //           fetchCompanies={fetchCompanies}
// //         />
// //       </div>
// //     </>
// //   );
// // };

// // export default Companies;




// // import React, { useState, useEffect } from "react";
// // import { db } from "../../../../config/firebase";
// // import { collection, getDocs, doc, deleteDoc, updateDoc, arrayUnion, serverTimestamp, addDoc } from "firebase/firestore";
// // import { useAuth } from "../../../../context/AuthContext";
// // import { ToastContainer, toast } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";
// // import AddBulkCompanies from "./AddBulkCompanies";
// // import CompanyDetails from "./CompanyModal/CompanyDetails";
// // import JobOpenings from "./CompanyModal/JobOpenings";
// // import Notes from "./CompanyModal/Notes";
// // import PointsOfContact from "./CompanyModal/PointsOfContact";
// // import History from "./CompanyModal/History";
// // import SectionNav from "./CompanyModal/SectionNav";

// // const Companies = () => {
// //   const { user, rolePermissions, userDisplayName } = useAuth();
// //   const [companies, setCompanies] = useState([]);
// //   const [selectedCompany, setSelectedCompany] = useState(null);
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [isEditing, setIsEditing] = useState(false);
// //   const [companyData, setCompanyData] = useState({});
// //   const [jobOpenings, setJobOpenings] = useState([]);
// //   const [newJob, setNewJob] = useState({
// //     title: "",
// //     department: "",
// //     jobType: "",
// //     locationType: "",
// //     city: "",
// //     location: "",
// //     experienceMin: "",
// //     experienceMax: "",
// //     salary: "",
// //     currency: "USD",
// //     duration: "",
// //     description: "",
// //     postingDate: "",
// //     closingDate: "",
// //     status: "Open",
// //     skills: [],
// //     poc: "",
// //   });
// //   const [pointsOfContact, setPointsOfContact] = useState([]);
// //   const [newPOC, setNewPOC] = useState({
// //     name: "",
// //     email: "",
// //     countryCode: "+1",
// //     mobile: "",
// //     linkedinProfile: "",
// //     designation: "",
// //   });
// //   const [newNote, setNewNote] = useState("");
// //   const [noteType, setNoteType] = useState("general");
// //   const [currentSection, setCurrentSection] = useState(1);
// //   const [isBulkSidebarOpen, setIsBulkSidebarOpen] = useState(false);

// //   const canDisplay = rolePermissions?.Companies?.display || false;
// //   const canUpdate = rolePermissions?.Companies?.update || false;
// //   const canDelete = rolePermissions?.Companies?.delete || false;
// //   const canCreate = rolePermissions?.Companies?.create || false;

// //   const countryCodes = [
// //     { code: "+1", label: "USA (+1)" },
// //     { code: "+1", label: "Canada (+1)" },
// //     { code: "+91", label: "India (+91)" },
// //   ];

// //   useEffect(() => {
// //     if (canDisplay) {
// //       fetchCompanies();
// //     }
// //   }, [canDisplay]);

// //   const fetchCompanies = async () => {
// //     try {
// //       const querySnapshot = await getDocs(collection(db, "Companies"));
// //       const companiesList = querySnapshot.docs.map((doc) => ({
// //         id: doc.id,
// //         ...doc.data(),
// //       }));
// //       setCompanies(companiesList);
// //       // Enhanced debug log to diagnose Domain issue
// //       console.log(
// //         "Fetched companies:",
// //         companiesList.map((c) => ({
// //           id: c.id,
// //           name: c.name,
// //           domain: c.domain,
// //           email: c.email,
// //           phone: c.phone,
// //           city: c.city,
// //           url: c.url,
// //           companyType: c.companyType,
// //         }))
// //       );
// //     } catch (error) {
// //       console.error("Error fetching companies:", error);
// //       toast.error("Failed to fetch companies.");
// //     }
// //   };

// //   const handleRowClick = (company) => {
// //     setSelectedCompany(company);
// //     setCompanyData({
// //       name: company.name || "",
// //       domain: company.domain || "",
// //       phone: company.phone || "",
// //       email: company.email || "",
// //       address: company.address || "",
// //       city: company.city || "",
// //       url: company.url || "",
// //       companyType: company.companyType || "",
// //     });
// //     setPointsOfContact(company.pointsOfContact || []);
// //     setJobOpenings(company.jobOpenings || []);
// //     setIsModalOpen(true);
// //     setCurrentSection(1);
// //     setIsEditing(false);
// //   };

// //   const handleDeleteCompany = async (companyId, companyName) => {
// //     if (!canDelete) {
// //       toast.error("You don't have permission to delete companies.");
// //       return;
// //     }
// //     if (!window.confirm(`Are you sure you want to delete ${companyName}?`)) return;

// //     try {
// //       await deleteDoc(doc(db, "Companies", companyId));
// //       setCompanies(companies.filter((company) => company.id !== companyId));
// //       toast.success(`Company ${companyName} deleted successfully!`);
// //       logActivity("DELETE_COMPANY", { companyId, companyName });
// //     } catch (error) {
// //       console.error("Error deleting company:", error);
// //       toast.error(`Failed to delete company: ${error.message}`);
// //     }
// //   };

// //   const handleSaveCompany = async () => {
// //     if (!canUpdate) {
// //       toast.error("You don't have permission to update companies.");
// //       return;
// //     }

// //     try {
// //       const companyRef = doc(db, "Companies", selectedCompany.id);
// //       const historyEntry = {
// //         action: "Updated company details",
// //         performedBy: userDisplayName || "Unknown User",
// //         timestamp: new Date().toISOString(),
// //         details: `Updated fields: ${Object.keys(companyData).filter((key) => companyData[key] !== selectedCompany[key]).join(", ")}`,
// //       };

// //       await updateDoc(companyRef, {
// //         ...companyData,
// //         pointsOfContact,
// //         jobOpenings,
// //         history: arrayUnion(historyEntry),
// //         updatedAt: serverTimestamp(),
// //       });

// //       setCompanies(
// //         companies.map((company) =>
// //           company.id === selectedCompany.id
// //             ? { ...company, ...companyData, pointsOfContact, jobOpenings }
// //             : company
// //         )
// //       );
// //       setIsEditing(false);
// //       setIsModalOpen(false);
// //       toast.success("Company updated successfully!");
// //       logActivity("UPDATE_COMPANY", { companyId: selectedCompany.id, companyName: companyData.name });
// //     } catch (error) {
// //       console.error("Error updating company:", error);
// //       toast.error(`Failed to update company: ${error.message}`);
// //     }
// //   };

// //   const handleAddJobOpening = async () => {
// //     if (!canUpdate) {
// //       toast.error("You don't have permission to add job openings.");
// //       return;
// //     }

// //     const jobData = {
// //       ...newJob,
// //       companyId: selectedCompany.id,
// //       companyName: selectedCompany.name,
// //       skills: newJob.skills || [],
// //       poc: newJob.poc || "",
// //       postingDate: newJob.postingDate || new Date().toISOString().split("T")[0],
// //       closingDate: newJob.closingDate || "",
// //     };

// //     try {
// //       const updatedJobOpenings = [...jobOpenings, { id: `job_${Date.now()}`, ...jobData }];
// //       setJobOpenings(updatedJobOpenings);
// //       setNewJob({
// //         title: "",
// //         department: "",
// //         jobType: "",
// //         locationType: "",
// //         city: "",
// //         location: "",
// //         experienceMin: "",
// //         experienceMax: "",
// //         salary: "",
// //         currency: "USD",
// //         duration: "",
// //         description: "",
// //         postingDate: "",
// //         closingDate: "",
// //         status: "Open",
// //         skills: [],
// //         poc: "",
// //       });
// //       toast.success("Job opening added successfully!");
// //       logActivity("ADD_JOB_OPENING", { companyId: selectedCompany.id, jobTitle: jobData.title });
// //     } catch (error) {
// //       console.error("Error adding job opening:", error);
// //       toast.error(`Failed to add job opening: ${error.message}`);
// //     }
// //   };

// //   const handleUpdateJob = async (updatedJob) => {
// //     if (!canUpdate) {
// //       toast.error("You don't have permission to update job openings.");
// //       return;
// //     }

// //     try {
// //       const updatedJobOpenings = jobOpenings.map((job) =>
// //         job.id === updatedJob.id ? updatedJob : job
// //       );
// //       setJobOpenings(updatedJobOpenings);
// //       toast.success("Job opening updated successfully!");
// //       logActivity("UPDATE_JOB_OPENING", { companyId: selectedCompany.id, jobTitle: updatedJob.title });
// //     } catch (error) {
// //       console.error("Error updating job opening:", error);
// //       toast.error(`Failed to update job opening: ${error.message}`);
// //     }
// //   };

// //   const handleDeleteJob = async (jobId, jobTitle) => {
// //     if (!canUpdate) {
// //       toast.error("You don't have permission to delete job openings.");
// //       return;
// //     }

// //     try {
// //       const updatedJobOpenings = jobOpenings.filter((job) => job.id !== jobId);
// //       setJobOpenings(updatedJobOpenings);
// //       toast.success("Job opening deleted successfully!");
// //       logActivity("DELETE_JOB_OPENING", { companyId: selectedCompany.id, jobTitle });
// //     } catch (error) {
// //       console.error("Error deleting job opening:", error);
// //       toast.error(`Failed to delete job opening: ${error.message}`);
// //     }
// //   };

// //   const handlePOCChange = (field, value) => {
// //     if (field === "mobile") {
// //       value = value.replace(/\D/g, "");
// //     }
// //     setNewPOC({ ...newPOC, [field]: value });
// //   };

// //   const handleAddPOC = async () => {
// //     if (!canUpdate) {
// //       toast.error("You don't have permission to update companies.");
// //       return;
// //     }

// //     if (!newPOC.name.trim() || !newPOC.email.trim() || !newPOC.mobile.trim()) {
// //       toast.error("Please fill in all required details: Name, Email, Mobile.");
// //       return;
// //     }

// //     const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// //     const validatePOCMobile = (mobile) => {
// //       return /^\d{7,15}$/.test(mobile);
// //     };

// //     if (!validateEmail(newPOC.email)) {
// //       toast.error("Please enter a valid email address for POC.");
// //       return;
// //     }

// //     if (!validatePOCMobile(newPOC.mobile)) {
// //       toast.error("POC mobile number must be 7-15 digits.");
// //       return;
// //     }
// //     try {
// //       const updatedPOCs = [
// //         ...pointsOfContact,
// //         {
// //           name: newPOC.name,
// //           email: newPOC.email,
// //           countryCode: newPOC.countryCode,
// //           mobile: newPOC.mobile,
// //           linkedinProfile: newPOC.linkedinProfile || "",
// //           designation: newPOC.designation || "",
// //         },
// //       ];
// //       setPointsOfContact(updatedPOCs);
// //       setNewPOC({
// //         name: "",
// //         email: "",
// //         countryCode: "+1",
// //         mobile: "",
// //         linkedinProfile: "",
// //         designation: "",
// //       });
// //       toast.success("Point of Contact added successfully!");
// //       logActivity("ADD_POC", { companyId: selectedCompany.id, pocName: newPOC.name });
// //     } catch (error) {
// //       console.error("Error adding POC:", error);
// //       toast.error(`Failed to add POC: ${error.message}`);
// //     }
// //   };

// //   const handleRemovePOC = async (index) => {
// //     if (!canUpdate) {
// //       toast.error("You don't have permission to remove points of contact.");
// //       return;
// //     }

// //     try {
// //       const removedPOC = pointsOfContact[index];
// //       const updatedPOCs = pointsOfContact.filter((_, i) => i !== index);
// //       setPointsOfContact(updatedPOCs);
// //       toast.success("Point of contact removed successfully!");
// //       logActivity("REMOVE_POC", { companyId: selectedCompany.id, pocName: removedPOC.name });
// //     } catch (error) {
// //       console.error("Error removing POC:", error);
// //       toast.error(`Failed to remove POC: ${error.message}`);
// //     }
// //   };

// //   const handleUpdatePOC = async (updatedPOCs) => {
// //     if (!canUpdate) {
// //       toast.error("You don't have permission to update points of contact.");
// //       return;
// //     }

// //     try {
// //       setPointsOfContact(updatedPOCs);
// //       toast.success("Point of contact updated successfully!");
// //       logActivity("UPDATE_POC", { companyId: selectedCompany.id });
// //     } catch (error) {
// //       console.error("Error updating POC:", error);
// //       toast.error(`Failed to update POC: ${error.message}`);
// //     }
// //   };

// //   const handleAddNote = async (noteData) => {
// //     try {
// //       const updatedNotes = [
// //         ...(companyData.notes || []),
// //         {
// //           id: noteData.id,
// //           type: noteData.noteType,
// //           content: noteData.content,
// //           createdAt: new Date(),
// //           addedBy: userDisplayName || "Unknown User",
// //           ...(noteData.noteType === "call-schedule" && {
// //             callDate: noteData.callDate,
// //             callScheduledTime: noteData.callScheduledTime,
// //             reminderTime: noteData.reminderTime,
// //             status: "scheduled",
// //           }),
// //         },
// //       ];
// //       setCompanyData({ ...companyData, notes: updatedNotes });
// //     } catch (error) {
// //       console.error("Error updating note in UI:", error);
// //       toast.error(`Failed to update note in UI: ${error.message}`);
// //     }
// //   };

// //   const logActivity = async (action, details) => {
// //     try {
// //       await addDoc(collection(db, "activityLogs"), {
// //         action,
// //         details,
// //         timestamp: new Date().toISOString(),
// //         userEmail: user?.email || "anonymous",
// //         userId: user.uid,
// //       });
// //     } catch (error) {
// //       console.error("Error logging activity:", error);
// //     }
// //   };

// //   const renderField = (value) => {
// //     return value || "Not Provided";
// //   };

// //   const formatDateSafely = (date, format) => {
// //     try {
// //       if (!date) return "Not Provided";
// //       const d = date instanceof Date ? date : new Date(date);
// //       if (isNaN(d)) return "Invalid Date";
// //       if (format === "yyyy-MM-dd") {
// //         return d.toISOString().split("T")[0];
// //       }
// //       if (format === "MMMM d, yyyy") {
// //         return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
// //       }
// //       if (format === "MMM d, yyyy h:mm a") {
// //         return d.toLocaleString("en-US", {
// //           month: "short",
// //           day: "numeric",
// //           year: "numeric",
// //           hour: "numeric",
// //           minute: "2-digit",
// //           hour12: true,
// //         });
// //       }
// //       return d.toLocaleDateString();
// //     } catch {
// //       return "Invalid Date";
// //     }
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

// //   if (!canDisplay) {
// //     return <p className="text-sm text-gray-600">You don't have permission to view companies.</p>;
// //   }

// //   return (
// //     <>
// //       <ToastContainer position="top-right" autoClose={3500} />
// //       <div className="flex flex-col min-h-screen bg-gray-50 p-3 fixed inset-0 left-[280px]">
// //         {/* Header with title and bulk upload button */}
// //         <div className="flex justify-between items-center mb-4">
// //           <h3 className="text-lg font-bold text-gray-800">Companies</h3>
// //           {canCreate && (
// //             <button
// //               type="button"
// //               onClick={() => setIsBulkSidebarOpen(true)}
// //               className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
// //             >
// //               Add Bulk Companies
// //             </button>
// //           )}
// //         </div>

// //         {/* Scrollable table container */}
// //         <div className="overflow-x-auto max-h-[calc(100vh-200px)] overflow-y-auto">
// //           <table className="w-full table-auto bg-white rounded">
// //             <thead className="bg-gray-100 sticky top-0">
// //               <tr>
// //                 <th className="px-4 py-2 text-sm font-semibold text-gray-700 text-left min-w-[60px]">Sr No</th>
// //                 <th className="px-4 py-2 text-sm font-semibold text-gray-700 text-left min-w-[150px]">Company Name</th>
// //                 <th className="px-4 py-2 text-sm font-semibold text-gray-700 text-left min-w-[120px]">Domain</th>
// //                 <th className="px-4 py-2 text-sm font-semibold text-gray-700 text-left min-w-[120px]">Company Phone</th>
// //                 <th className="px-4 py-2 text-sm font-semibold text-gray-700 text-left min-w-[150px]">Company Email</th>
// //                 <th className="px-4 py-2 text-sm font-semibold text-gray-700 text-left min-w-[120px]">Company City</th>
// //                 <th className="px-4 py-2 text-sm font-semibold text-gray-700 text-left min-w-[150px]">URL</th>
// //                 <th className="px-4 py-2 text-sm font-semibold text-gray-700 text-left min-w-[120px]">Company Type</th>
// //                 <th className="px-4 py-2 text-sm font-semibold text-gray-700 text-left min-w-[100px]">Action</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {companies.map((company, index) => (
// //                 <tr
// //                   key={company.id}
// //                   className="border-b hover:bg-gray-50 cursor-pointer"
// //                   onClick={() => handleRowClick(company)}
// //                 >
// //                   <td className="px-4 py-2 text-sm text-gray-600">{index + 1}</td>
// //                   <td className="px-4 py-2 text-sm text-gray-600 truncate">{renderField(company.name)}</td>
// //                   <td className="px-4 py-2 text-sm text-gray-600 truncate">{renderField(company.domain)}</td>
// //                   <td className="px-4 py-2 text-sm text-gray-600 truncate">{renderField(company.phone)}</td>
// //                   <td className="px-4 py-2 text-sm text-gray-600 truncate">{renderField(company.email)}</td>
// //                   <td className="px-4 py-2 text-sm text-gray-600 truncate">{renderField(company.city)}</td>
// //                   <td className="px-4 py-2 text-sm text-gray-600 truncate">
// //                     {company.url ? (
// //                       <a
// //                         href={company.url}
// //                         target="_blank"
// //                         rel="noopener noreferrer"
// //                         className="text-blue-600 hover:underline"
// //                         onClick={(e) => e.stopPropagation()}
// //                       >
// //                         {company.url}
// //                       </a>
// //                     ) : (
// //                       "Not Provided"
// //                     )}
// //                   </td>
// //                   <td className="px-4 py-2 text-sm text-gray-600 truncate">{renderField(company.companyType)}</td>
// //                   <td className="px-4 py-2 text-sm flex items-center gap-2">
// //                     <button
// //                       type="button"
// //                       onClick={(e) => {
// //                         e.stopPropagation();
// //                         handleRowClick(company);
// //                       }}
// //                       className="text-blue-600 hover:text-blue-800"
// //                     >
// //                       ✎
// //                     </button>
// //                     <button
// //                       type="button"
// //                       onClick={(e) => {
// //                         e.stopPropagation();
// //                         handleDeleteCompany(company.id, company.name);
// //                       }}
// //                       disabled={!canDelete}
// //                       className="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
// //                     >
// //                       ✕
// //                     </button>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>

// //         {/* Modal for company details */}
// //         {isModalOpen && selectedCompany && (
// //           <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
// //             <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto">
// //               <div className="flex justify-between items-center mb-4">
// //                 <h2 className="text-xl font-bold text-gray-800">
// //                   {isEditing ? "Edit Company" : "Company Details"}
// //                 </h2>
// //                 <button
// //                   type="button"
// //                   onClick={() => {
// //                     setIsModalOpen(false);
// //                     setIsEditing(false);
// //                     setSelectedCompany(null);
// //                   }}
// //                   className="text-gray-500 hover:text-gray-700"
// //                 >
// //                   <svg
// //                     xmlns="http://www.w3.org/2000/svg"
// //                     className="h-5 w-5"
// //                     fill="none"
// //                     viewBox="0 0 24 24"
// //                     stroke="currentColor"
// //                   >
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// //                   </svg>
// //                 </button>
// //               </div>

// //               <SectionNav currentSection={currentSection} setCurrentSection={setCurrentSection} />

// //               {currentSection === 1 && (
// //                 <CompanyDetails
// //                   companyData={companyData}
// //                   setCompanyData={setCompanyData}
// //                   isEditing={isEditing}
// //                   renderField={renderField}
// //                 />
// //               )}
// //               {currentSection === 2 && (
// //                 <JobOpenings
// //                   jobOpenings={jobOpenings}
// //                   newJob={newJob}
// //                   setNewJob={setNewJob}
// //                   isEditing={isEditing}
// //                   handleAddJobOpening={handleAddJobOpening}
// //                   renderField={renderField}
// //                   canUpdate={canUpdate}
// //                   company={selectedCompany}
// //                   onUpdateJob={handleUpdateJob}
// //                   onDeleteJob={handleDeleteJob}
// //                 />
// //               )}
// //               {currentSection === 3 && (
// //                 <Notes
// //                   companyData={companyData}
// //                   newNote={newNote}
// //                   setNewNote={setNewNote}
// //                   noteType={noteType}
// //                   setNoteType={setNoteType}
// //                   isEditing={isEditing}
// //                   handleAddNote={handleAddNote}
// //                   formatDateSafely={formatDateSafely}
// //                   formatNoteType={formatNoteType}
// //                   canUpdate={canUpdate}
// //                   userDisplayName={userDisplayName}
// //                 />
// //               )}
// //               {currentSection === 4 && (
// //                 <PointsOfContact
// //                   pointsOfContact={pointsOfContact}
// //                   newPOC={newPOC}
// //                   handlePOCChange={handlePOCChange}
// //                   handleAddPOC={handleAddPOC}
// //                   handleRemovePOC={handleRemovePOC}
// //                   isEditing={isEditing}
// //                   countryCodes={countryCodes}
// //                   canUpdate={canUpdate}
// //                   canCreate={canCreate}
// //                   company={selectedCompany}
// //                   onUpdatePOC={handleUpdatePOC}
// //                 />
// //               )}
// //               {currentSection === 5 && (
// //                 <History
// //                   companyData={companyData}
// //                   formatDateSafely={formatDateSafely}
// //                   canDisplay={canDisplay}
// //                 />
// //               )}

// //               <div className="flex justify-end gap-2 mt-4">
// //                 {isEditing ? (
// //                   <>
// //                     <button
// //                       type="button"
// //                       onClick={() => setIsEditing(false)}
// //                       className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
// //                     >
// //                       Cancel
// //                     </button>
// //                     <button
// //                       type="button"
// //                       onClick={handleSaveCompany}
// //                       disabled={!canUpdate}
// //                       className={`px-4 py-2 rounded-md text-white ${
// //                         canUpdate ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
// //                       }`}
// //                     >
// //                       Save
// //                     </button>
// //                   </>
// //                 ) : (
// //                   <button
// //                     type="button"
// //                     onClick={() => setIsEditing(true)}
// //                     disabled={!canUpdate}
// //                     className={`px-4 py-2 rounded-md text-white ${
// //                       canUpdate ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
// //                     }`}
// //                   >
// //                     Edit
// //                   </button>
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //         )}

// //         {/* Bulk upload sidebar */}
// //         <AddBulkCompanies
// //           isOpen={isBulkSidebarOpen}
// //           toggleSidebar={() => setIsBulkSidebarOpen(false)}
// //           fetchCompanies={fetchCompanies}
// //         />
// //       </div>
// //     </>
// //   );
// // };

// // export default Companies;



import { useState, useEffect } from "react";
import { db } from "../../../../config/firebase.js";
import { getDocs, collection, deleteDoc, doc, query, orderBy, addDoc, updateDoc, getDoc, arrayUnion, serverTimestamp, where } from "firebase/firestore";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Textarea, Select, Option } from "@material-tailwind/react";
import { useAuth } from "../../../../context/AuthContext.jsx";
import AddCompanies from "./AddCompanies.jsx";
import AddBulkCompanies from "./AddBulkCompanies.jsx";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CompanyModal from "./CompanyModal/CompanyModal.jsx";

export default function Companies() {
    const navigate = useNavigate();
    const { user, rolePermissions } = useAuth();
    const [currentCompany, setCurrentCompany] = useState(null);
    const [companies, setCompanies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddSingleOpen, setIsAddSingleOpen] = useState(false);
    const [isAddBulkOpen, setIsAddBulkOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState("Are you sure you want to delete this company? This action cannot be undone.");
    const [openAddOptions, setOpenAddOptions] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [userDisplayName, setUserDisplayName] = useState("");
    const [openCallSchedule, setOpenCallSchedule] = useState(false);
    const [openReminderDialog, setOpenReminderDialog] = useState(false);
    const [reminderDetails, setReminderDetails] = useState(null);
    const [callScheduleForm, setCallScheduleForm] = useState({
        companyId: "",
        callDate: "",
        callTime: "",
        purpose: "",
        reminderTime: "15",
    });
    const [callSchedules, setCallSchedules] = useState([]);

    const CompanyCollectionRef = collection(db, "Companies");
    const reminderAudio = new Audio("https://www.soundjay.com/buttons/beep-01a.mp3");

    const canCreate = rolePermissions?.Companies?.create || false;
    const canUpdate = rolePermissions?.Companies?.update || false;
    const canDelete = rolePermissions?.Companies?.delete || false;
    const canDisplay = rolePermissions?.Companies?.display || false;

    // Utility function to render field or "N/A"
    const renderField = (value) => value || "N/A";

    // Fetch call schedules for the selected company
    useEffect(() => {
        if (!selectedCompany?.id) return;
        const fetchCallSchedules = async () => {
            try {
                const q = query(
                    collection(db, "Companies", selectedCompany.id, "notes"),
                    where("noteType", "==", "call-schedule"),
                    orderBy("createdAt", "desc")
                );
                const snapshot = await getDocs(q);
                setCallSchedules(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                //console.error("Error fetching call schedules:", error);
                if (error.code === "failed-precondition" && error.message.includes("The query requires an index")) {
                    toast.error(
                        "Failed to fetch call schedules: A Firestore index is required. Create it in the Firebase Console.",
                        { autoClose: 10000 }
                    );
                } else {
                    toast.error(`Failed to fetch call schedules: ${error.message}`);
                }
            }
        };
        fetchCallSchedules();
    }, [selectedCompany?.id]);

    // Preload reminder audio
    useEffect(() => {
        reminderAudio.load();
        reminderAudio.onerror = () => {
            //console.error("Error loading reminder audio");
            toast.error("Failed to load reminder audio.");
        };
    }, []);

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
                    // console.warn("");
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
            //console.error("Error logging activity:", error);
        }
    };

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            const q = query(CompanyCollectionRef, orderBy("createdAt", "asc"));
            const snapshot = await getDocs(q);
            const companyData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                pointsOfContact: Array.isArray(doc.data().pointsOfContact) ? doc.data().pointsOfContact : [],
            }));
            console.log(
                "Fetched Companies:",
                companyData.map((c) => ({
                    id: c.id,
                    name: c.name,
                    email: c.email,
                    domain: c.domain,
                    phone: c.phone,
                    city: c.city,
                    companyType: c.companyType,
                    url: c.url,
                }))
            );
            setCompanies(companyData);
            if (companyData.length === 0) {
                console.warn("No companies found in Firestore");
            }
        } catch (err) {
            console.error("Error fetching companies:", err);
            toast.error(`Failed to fetch companies: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!canDisplay) {
            navigate("/unauthorized");
            return;
        }
        fetchCompanies();
    }, [canDisplay, navigate]);

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }
        const results = companies.filter((company) =>
            (
                company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                company.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                company.domain?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                company.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                company.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                company.companyType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                company.url?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setSearchResults(results);
    };

    useEffect(() => {
        if (searchTerm) handleSearch();
        else setSearchResults([]);
    }, [searchTerm, companies]);

    const handleAddCompanyClick = () => {
        if (!canCreate) return;
        setOpenAddOptions(true);
        logActivity("OPEN_ADD_OPTIONS", {});
    };

    const handleEditClick = (company) => {
        if (!canUpdate) return;
        setCurrentCompany(company);
        setIsAddSingleOpen(true);
        logActivity("OPEN_EDIT_COMPANY", { companyId: company.id, name: company.name });
    };

    const handleDeleteClick = (companyId) => {
        if (!canDelete) return;
        setDeleteId(companyId);
        setOpenDelete(true);
        logActivity("OPEN_DELETE_COMPANY", { companyId });
    };

    const handleRowClick = (company) => {
        if (!canDisplay) return;
        setSelectedCompany(company);
        setIsModalOpen(true);
        logActivity("VIEW_COMPANY_DETAILS", { companyId: company.id });
    };

    const handleCloseSingle = () => {
        setIsAddSingleOpen(false);
        setCurrentCompany(null);
        fetchCompanies();
    };

    const handleCloseBulk = () => {
        setIsAddBulkOpen(false);
        setSearchTerm("");
        fetchCompanies();
    };

    const deleteCompany = async () => {
        if (!canDelete || !deleteId) return;
        try {
            const companyRef = doc(db, "Companies", deleteId);
            const companyDoc = await getDoc(companyRef);
            if (!companyDoc.exists()) {
                throw new Error("Company not found");
            }
            const companyName = companyDoc.data().name;

            const historyEntry = {
                action: "Deleted",
                performedBy: userDisplayName,
                timestamp: new Date().toISOString(),
                details: `Deleted company "${companyName}"`,
            };
            await updateDoc(companyRef, {
                history: arrayUnion(historyEntry),
                updatedAt: serverTimestamp(),
            });

            await deleteDoc(companyRef);
            fetchCompanies();
            setOpenDelete(false);
            setDeleteMessage("Are you sure you want to delete this company? This action cannot be undone.");
            toast.success("Company deleted successfully!");
            logActivity("DELETE_COMPANY", { companyId: deleteId, name: companyName });
        } catch (err) {
            //console.error("Error deleting company:", err);
            setDeleteMessage("An error occurred while trying to delete the company.");
            toast.error(`Failed to delete company: ${err.message}`);
        }
    };

    const handleOpenCallSchedule = (company) => {
        if (!canCreate) return;
        setCallScheduleForm({
            companyId: company.id,
            callDate: "",
            callTime: "",
            purpose: "",
            reminderTime: "15",
        });
        setOpenCallSchedule(true);
        logActivity("OPEN_CALL_SCHEDULE", { companyId: company.id });
    };

    const handleCallScheduleSubmit = async () => {
        if (!canCreate) return;
        const { companyId, callDate, callTime, purpose, reminderTime } = callScheduleForm;
        if (!companyId || !callDate || !callTime || !purpose) {
            toast.error("Please fill all required fields.");
            return;
        }

        try {
            const companyRef = doc(db, "Companies", companyId);
            const companyDoc = await getDoc(companyRef);
            if (!companyDoc.exists()) {
                throw new Error("Company not found");
            }
            const companyName = companyDoc.data().name;

            const callDateTime = new Date(`${callDate}T${callTime}`);
            const reminderDateTime = new Date(callDateTime.getTime() - parseInt(reminderTime) * 60000);

            const noteData = {
                noteType: "call-schedule",
                content: purpose,
                createdAt: serverTimestamp(),
                createdBy: userDisplayName,
                callDate,
                callTime,
                reminderTime,
                status: "scheduled",
            };

            const noteRef = await addDoc(collection(db, "Companies", companyId, "notes"), noteData);

            const historyEntry = {
                action: "Added Call Schedule",
                performedBy: userDisplayName,
                timestamp: new Date().toISOString(),
                details: `Scheduled call for ${callDate} ${callTime}: ${purpose}`,
            };
            await updateDoc(companyRef, {
                history: arrayUnion(historyEntry),
                updatedAt: serverTimestamp(),
            });

            if (companyId === selectedCompany?.id) {
                setCallSchedules([{ id: noteRef.id, ...noteData }, ...callSchedules]);
            }

            const timeout = reminderDateTime.getTime() - Date.now();
            if (timeout > 0) {
                setTimeout(() => {
                    if (Notification.permission === "granted") {
                        new Notification("Call Reminder", {
                            body: `Call scheduled with ${companyName} at ${callTime}: ${purpose}`,
                            icon: "/path/to/icon.png",
                        });
                    } else if (Notification.permission !== "denied") {
                        Notification.requestPermission().then((permission) => {
                            if (permission === "granted") {
                                new Notification("Call Reminder", {
                                    body: `Call scheduled with ${companyName} at ${callTime}: ${purpose}`,
                                    icon: "/path/to/icon.png",
                                });
                            }
                        });
                    }

                    reminderAudio.play().catch((error) => {
                        //console.error("Error playing reminder audio:", error);
                        toast.error("Failed to play reminder sound.");
                    });

                    setReminderDetails({
                        companyName,
                        callDate,
                        callTime,
                        purpose,
                    });
                    setOpenReminderDialog(true);

                    logActivity("TRIGGER_CALL_REMINDER", { companyId, callDate, callTime, purpose });
                }, timeout);
            }

            setOpenCallSchedule(false);
            toast.success("Call scheduled successfully!");
            logActivity("ADD_CALL_SCHEDULE", { companyId, callDate, callTime, purpose });
        } catch (error) {
            //console.error("Error scheduling call:", error);
            toast.error(`Failed to schedule call: ${error.message}`);
        }
    };

    const handleDeleteSchedule = async (noteId) => {
        if (!canDelete || !selectedCompany?.id) return;
        try {
            const noteRef = doc(db, "Companies", selectedCompany.id, "notes", noteId);
            const noteDoc = await getDoc(noteRef);
            if (!noteDoc.exists()) throw new Error("Note not found");
            const noteData = noteDoc.data();

            const historyEntry = {
                action: "Deleted Call Schedule",
                performedBy: userDisplayName,
                timestamp: new Date().toISOString(),
                details: `Deleted call schedule for ${noteData.callDate} ${noteData.callTime}`,
            };
            await updateDoc(doc(db, "Companies", selectedCompany.id), {
                history: arrayUnion(historyEntry),
                updatedAt: serverTimestamp(),
            });

            await deleteDoc(noteRef);
            setCallSchedules(callSchedules.filter((s) => s.id !== noteId));
            toast.success("Call schedule deleted successfully!");
            logActivity("DELETE_CALL_SCHEDULE", { companyId: selectedCompany.id, noteId });
        } catch (error) {
            console.error("Error deleting call schedule:", error);
            toast.error(`Failed to delete call schedule: ${error.message}`);
        }
    };

    if (!canDisplay) return null;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen text-gray-500">Loading...</div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 p-4 fixed inset-0 left-[300px]">
            <ToastContainer position="top-right" autoClose={3000} />
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">Companies</h1>
                </div>
                {canCreate && (
                    <div className="flex space-x-4">
                        <button
                            type="button"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition duration-200"
                            onClick={handleAddCompanyClick}
                        >
                            + Add Company
                        </button>
                        <button
                            type="button"
                            className="bg-green-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-700 transition duration-200"
                            onClick={() => handleOpenCallSchedule({ id: "" })}
                        >
                            Schedule Call
                        </button>
                    </div>
                )}
            </div>

            {/* Table Container */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-6 grid grid-cols-2">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search companies by name, email, domain, phone, city, type, or URL..."
                        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-gray-600 mt-3 ml-auto">Total Companies: {companies.length}</p>
                </div>

                <div className="overflow-x-auto h-[70vh] overflow-y-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Sr No</th>
                                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700 min-w-52">Company Name</th>
                                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700 min-w-52">Email</th>
                                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700 min-w-52">Domain</th>
                                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700 min-w-52">Phone</th>
                                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700 min-w-52">City</th>
                                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700 min-w-52">Company Type</th>
                                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700 min-w-52">URL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(searchResults.length > 0 ? searchResults : companies).map((company, index) => (
                                <tr
                                    key={company.id}
                                    className="border-b hover:bg-gray-50 cursor-pointer"
                                    onClick={() => handleRowClick(company)}
                                >
                                    <td className="px-4 py-3 text-gray-600">{index + 1}</td>
                                    <td className="px-4 py-3 text-gray-800">{renderField(company.name)}</td>
                                    <td className="px-4 py-3 text-gray-800">{renderField(company.email)}</td>
                                    <td className="px-4 py-3 text-gray-800">{renderField(company.domain)}</td>
                                    <td className="px-4 py-3 text-gray-800">{renderField(company.phone)}</td>
                                    <td className="px-4 py-3 text-gray-800">{renderField(company.city)}</td>
                                    <td className="px-4 py-3 text-gray-800">{renderField(company.companyType)}</td>
                                    <td className="px-4 py-3 text-gray-800">
                                        {company.url ? (
                                            <a
                                                href={company.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                Website
                                            </a>
                                        ) : (
                                            "N/A"
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {(searchResults.length > 0 ? searchResults : companies).length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-4 py-3 text-center text-gray-500">
                                        No companies found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Overlay for sidebars */}
            {(canCreate || canUpdate) && (isAddSingleOpen || isAddBulkOpen) && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={isAddSingleOpen ? handleCloseSingle : handleCloseBulk}
                />
            )}

            {/* Add/Edit Company Sidebar */}
            {(canCreate || canUpdate) && (
                <AddCompanies
                    isOpen={isAddSingleOpen}
                    toggleSidebar={handleCloseSingle}
                    company={currentCompany}
                />
            )}

            {/* Bulk Upload Sidebar */}
            {canCreate && (
                <AddBulkCompanies
                    isOpen={isAddBulkOpen}
                    toggleSidebar={handleCloseBulk}
                    fetchCompanies={fetchCompanies}
                />
            )}

            {/* Company Modal */}
            {canDisplay && (
                <CompanyModal
                    isOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                    company={selectedCompany}
                    rolePermissions={rolePermissions}
                    callSchedules={callSchedules}
                    handleDeleteSchedule={handleDeleteSchedule}
                />
            )}

            {/* Add Options Dialog */}
            {canCreate && (
                <Dialog
                    open={openAddOptions}
                    handler={() => setOpenAddOptions(false)}
                    className="rounded-lg shadow-lg"
                >
                    <DialogHeader className="text-gray-800 font-semibold">Add Company</DialogHeader>
                    <DialogBody className="text-gray-600">Choose how you want to add a company:</DialogBody>
                    <DialogFooter className="space-x-4">
                        <Button variant="text" color="gray" onClick={() => setOpenAddOptions(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="filled"
                            color="blue"
                            onClick={() => {
                                setOpenAddOptions(false);
                                setIsAddSingleOpen(true);
                                logActivity("SELECT_ADD_SINGLE", {});
                            }}
                        >
                            Add Single Company
                        </Button>
                        <Button
                            variant="filled"
                            color="green"
                            onClick={() => {
                                setOpenAddOptions(false);
                                setIsAddBulkOpen(true);
                                logActivity("SELECT_ADD_BULK", {});
                            }}
                        >
                            Add Bulk Companies
                        </Button>
                    </DialogFooter>
                </Dialog>
            )}

            {/* Delete Confirmation Dialog */}
            {canDelete && (
                <Dialog
                    open={openDelete}
                    handler={() => setOpenDelete(false)}
                    className="rounded-lg shadow-lg"
                >
                    <DialogHeader className="text-gray-800 font-semibold">Confirm Deletion</DialogHeader>
                    <DialogBody className="text-gray-600">{deleteMessage}</DialogBody>
                    <DialogFooter className="space-x-4">
                        <Button variant="text" color="gray" onClick={() => setOpenDelete(false)}>
                            Cancel
                        </Button>
                        {deleteMessage === "Are you sure you want to delete this company? This action cannot be undone." && (
                            <Button variant="filled" color="red" onClick={deleteCompany}>
                                Yes, Delete
                            </Button>
                        )}
                    </DialogFooter>
                </Dialog>
            )}

            {/* Call Schedule Dialog */}
            {canCreate && (
                <Dialog
                    open={openCallSchedule}
                    handler={() => setOpenCallSchedule(false)}
                    className="rounded-lg shadow-lg max-w-sm max-h-[80vh] overflow-auto"
                >
                    <DialogHeader className="text-gray-800 font-semibold">Schedule Call</DialogHeader>
                    <DialogBody className="text-gray-600 space-y-4">
                        {callScheduleForm.companyId && (
                            <Input
                                label="Company"
                                value={companies.find((c) => c.id === callScheduleForm.companyId)?.name || ""}
                                disabled
                            />
                        )}
                        {!callScheduleForm.companyId && (
                            <Select
                                label="Select Company"
                                value={callScheduleForm.companyId}
                                onChange={(value) =>
                                    setCallScheduleForm({ ...callScheduleForm, companyId: value })
                                }
                            >
                                {companies.map((company) => (
                                    <Option key={company.id} value={company.id}>
                                        {company.name}
                                    </Option>
                                ))}
                            </Select>
                        )}
                        <Input
                            type="date"
                            label="Call Date"
                            value={callScheduleForm.callDate}
                            onChange={(e) =>
                                setCallScheduleForm({ ...callScheduleForm, callDate: e.target.value })
                            }
                        />
                        <Input
                            type="time"
                            label="Call Time"
                            value={callScheduleForm.callTime}
                            onChange={(e) =>
                                setCallScheduleForm({ ...callScheduleForm, callTime: e.target.value })
                            }
                        />
                        <Textarea
                            label="Purpose"
                            value={callScheduleForm.purpose}
                            onChange={(e) =>
                                setCallScheduleForm({ ...callScheduleForm, purpose: e.target.value })
                            }
                        />
                        <Select
                            label="Reminder (minutes before)"
                            value={callScheduleForm.reminderTime}
                            onChange={(value) =>
                                setCallScheduleForm({ ...callScheduleForm, reminderTime: value })
                            }
                        >
                            <Option value="5">5 minutes</Option>
                            <Option value="15">15 minutes</Option>
                            <Option value="30">30 minutes</Option>
                            <Option value="60">1 hour</Option>
                        </Select>
                    </DialogBody>
                    <DialogFooter>
                        <Button
                            variant="text"
                            color="gray"
                            onClick={() => setOpenCallSchedule(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="filled"
                            color="green"
                            onClick={handleCallScheduleSubmit}
                        >
                            Schedule
                        </Button>
                    </DialogFooter>
                </Dialog>
            )}

            {/* Call Reminder Dialog */}
            {openReminderDialog && reminderDetails && (
                <Dialog
                    open={openReminderDialog}
                    handler={() => setOpenReminderDialog(false)}
                    className="max-w-sm rounded-lg shadow-md"
                >
                    <DialogHeader className="text-gray-800 font-semibold">Call Reminder</DialogHeader>
                    <DialogBody className="space-y-2 text-gray-600">
                        <p><strong>Company:</strong> {reminderDetails.companyName}</p>
                        <p><strong>Call Time:</strong> {reminderDetails.callDate} {reminderDetails.callTime}</p>
                        <p><strong>Purpose:</strong> {reminderDetails.purpose}</p>
                    </DialogBody>
                    <DialogFooter>
                        <Button
                            variant="filled"
                            color="blue"
                            onClick={() => setOpenReminderDialog(false)}
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </Dialog>
            )}
        </div>
    );
}