



import { useState, useEffect } from "react";
import { db } from "../../../../config/firebase.js";
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  query,
  orderBy,
  addDoc,
  updateDoc,
  getDoc,
  arrayUnion,
  serverTimestamp,
  where,
} from "firebase/firestore";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
  Textarea,
  Select,
  Option,
} from "@material-tailwind/react";
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
  const [deleteMessage, setDeleteMessage] = useState(
    "Are you sure you want to delete this company? This action cannot be undone."
  );
  const [openAddOptions, setOpenAddOptions] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [userDisplayName, setUserDisplayName] = useState("");
  const [openCallSchedule, setOpenCallSchedule] = useState(false);
  const [openReminderDialog, setOpenReminderDialog] = useState(false);
  const [reminderDetails, setReminderDetails] = useState(null);
  
  const [callSchedules, setCallSchedules] = useState([]);

  const CompanyCollectionRef = collection(db, "Companies");
  const reminderAudio = new Audio("https://www.soundjay.com/buttons/beep-01a.mp3");

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Returns YYYY-MM-DD
  };
  //     const getTodayDate = () => {
//         const today = new Date();
//         return today.toISOString().split("T")[0]; // Returns YYYY-MM-DD
//       };


const [callScheduleForm, setCallScheduleForm] = useState({
    companyId: "",
    callDate: getTodayDate(), // Initialize with today's date
    callTime: "",
    purpose: "",
    reminderTime: "15",
  });

  const canCreate = rolePermissions?.Companies?.create || false;
  const canUpdate = rolePermissions?.Companies?.update || false;
  const canDelete = rolePermissions?.Companies?.delete || false;
  const canDisplay = rolePermissions?.Companies?.display || false;

  const renderField = (value) => value || "N/A";




  // Fetch call schedules and trigger due reminders
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
        const schedules = snapshot.docs.map((doc) => ({
          id: doc.id,
          companyId: selectedCompany.id,
          ...doc.data(),
        }));
        setCallSchedules(schedules);
        await triggerDueReminders(schedules);
      } catch (error) {
        console.error("Error fetching call schedules:", error);
        if (
          error.code === "failed-precondition" &&
          error.message.includes("The query requires an index")
        ) {
          const indexUrl = error.message.match(/https:\/\/[^\s]+/)?.[0] || "https://console.firebase.google.com";
          toast.error(
            `Failed to fetch call schedules: A Firestore index is required. Create it here: ${indexUrl}`,
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
      toast.error("Failed to load reminder audio.");
    };
  }, []);

  // Fetch user display name
  useEffect(() => {
    if (!user?.uid) return;
    const fetchUserDisplayName = async () => {
      try {
        const userDocRef = doc(db, "Users", user.uid);
        const userDoc = await getDoc(userDocRef);
        setUserDisplayName(
          userDoc.exists() ? userDoc.data().displayName || user.email || "Unknown User" : user.email || "Unknown User"
        );
      } catch (error) {
        console.error("Error fetching user displayName:", error);
        toast.error(`Failed to fetch user data: ${error.message}`);
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
      console.error("Error logging activity:", error);
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
      console.error("Error deleting company:", err);
      setDeleteMessage("An error occurred while trying to delete the company.");
      toast.error(`Failed to delete company: ${err.message}`);
    }
  };

  const handleOpenCallSchedule = (company) => {
    if (!canCreate) return;
    setCallScheduleForm({
      companyId: company.id,
      callDate: getTodayDate(),
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
      if (isNaN(callDateTime.getTime())) {
        throw new Error("Invalid call date or time.");
      }
      const reminderDateTime = new Date(callDateTime.getTime() - parseInt(reminderTime) * 60000);
      if (isNaN(reminderDateTime.getTime())) {
        throw new Error("Invalid reminder time calculation.");
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (callDateTime < today) {
        throw new Error("Cannot schedule a call in the past.");
      }

      const noteData = {
        noteType: "call-schedule",
        content: purpose,
        createdAt: serverTimestamp(),
        createdBy: userDisplayName,
        callDate,
        callTime, // Standardized to callTime
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
        setCallSchedules([{ id: noteRef.id, companyId, ...noteData }, ...callSchedules]);
      }

      const timeout = reminderDateTime.getTime() - Date.now();
      if (timeout > 0) {
        setTimeout(async () => {
          try {
            const hasPermission =
              Notification.permission === "granted" || (await Notification.requestPermission()) === "granted";
            if (hasPermission) {
              new Notification("Call Reminder", {
                body: `Call scheduled with ${companyName} at ${callTime}: ${purpose}`,
                icon: "/path/to/icon.png",
              });
            } else {
              toast.warn("Notification permission not granted for call reminder.");
            }

            await reminderAudio.play();
            setReminderDetails({
              companyName,
              callDate,
              callTime,
              purpose,
            });
            setOpenReminderDialog(true);
            logActivity("TRIGGER_CALL_REMINDER", { companyId, callDate, callTime, purpose });

            await updateDoc(doc(db, "Companies", companyId, "notes", noteRef.id), {
              status: "notified",
              updatedAt: serverTimestamp(),
            });
          } catch (error) {
            console.error("Error in notification callback:", error);
            toast.error(`Failed to trigger reminder: ${error.message}`);
          }
        }, timeout);
      } else {
        console.warn("Reminder time is in the past or invalid, skipping notification.");
      }

      setOpenCallSchedule(false);
      setCallScheduleForm({
        companyId: "",
        callDate: getTodayDate(),
        callTime: "",
        purpose: "",
        reminderTime: "15",
      });
      toast.success("Call scheduled successfully!");
      logActivity("ADD_CALL_SCHEDULE", { companyId, callDate, callTime, purpose });
    } catch (error) {
      console.error("Error scheduling call:", error);
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

    return (
     <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-100 min-h-screen fixed inset-0 left-[300px] overflow-y-auto">
  <ToastContainer position="top-right" autoClose={3000} />

  {/* Header */}
  <div className="flex justify-between items-center mb-8">
    <div>
      <h1 className="text-2xl font-bold text-[#333333] font-sans">Companies</h1>
    </div>
    {canCreate && (
      <div className="flex gap-4">
        <button
          type="button"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
          onClick={handleAddCompanyClick}
        >
          + Add Company
        </button>
        <button
          type="button"
          className="bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-2.5 rounded-lg shadow-md hover:from-green-700 hover:to-green-800 transition duration-200 font-medium mr-8"
          onClick={() => handleOpenCallSchedule({ id: "" })}
        >
          Schedule Call
        </button>
      </div>
    )}
  </div>

  {/* Table Container */}
  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search companies by name, email, domain, phone, city, type, or URL..."
        className="w-full sm:w-1/2 max-w-md px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg shadow-sm text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-200"
      />
      <p className="text-sm text-gray-600">Total Companies: {companies.length}</p>
    </div>

 <div className="relative rounded-xl border border-gray-200 shadow-sm bg-white overflow-hidden">
  <div className="overflow-x-auto h-[65vh]">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50 sticky top-0">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-20">
            Sr No
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[200px]">
            Company Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[200px]">
            Email
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[150px]">
            Domain
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[150px]">
            Phone
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[250px]">
            Recent Note
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[150px]">
            Company Type
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[120px]">
            URL
          </th>
          {(canUpdate || canDelete || canCreate) && (
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[180px]">
              Action
            </th>
          )}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {(searchResults.length > 0 ? searchResults : companies).map((company, index) => (
          <tr
            key={company.id}
            className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
            onClick={() => handleRowClick(company)}
          >
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {index + 1}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {renderField(company.name)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {company.email ? (
                <a 
                  href={`mailto:${company.email}`} 
                  className="text-blue-600 hover:text-blue-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  {renderField(company.email)}
                </a>
              ) : (
                <span className="text-gray-400">N/A</span>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {renderField(company.domain)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {company.phone ? (
                <a 
                  href={`tel:${company.phone}`} 
                  className="text-blue-600 hover:text-blue-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  {renderField(company.phone)}
                </a>
              ) : (
                <span className="text-gray-400">N/A</span>
              )}
            </td>
            <td className="px-6 py-4 text-sm text-gray-700 max-w-[250px] truncate">
              {renderField(company.noteData) || <span className="text-gray-400">No notes</span>}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {company.companyType ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {renderField(company.companyType)}
                </span>
              ) : (
                <span className="text-gray-400">N/A</span>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {company.url ? (
                <a
                  href={company.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  Visit
                </a>
              ) : (
                <span className="text-gray-400">N/A</span>
              )}
            </td>
            {(canUpdate || canDelete || canCreate) && (
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                <div className="flex gap-3">
                  {canUpdate && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(company);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(company.id);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  )}
                  {canCreate && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenCallSchedule(company);
                      }}
                      className="text-green-600 hover:text-green-800"
                    >
                      Schedule
                    </button>
                  )}
                </div>
              </td>
            )}
          </tr>
        ))}
        {(searchResults.length > 0 ? searchResults : companies).length === 0 && (
          <tr>
            <td colSpan={(canUpdate || canDelete || canCreate) ? 9 : 8} className="px-6 py-4 text-center text-sm text-gray-500">
              No companies found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>
  </div>

  {/* Overlay for sidebars */}
  {(canCreate || canUpdate) && (isAddSingleOpen || isAddBulkOpen) && (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40"
      onClick={isAddSingleOpen ? handleCloseSingle : handleCloseBulk}
    ></div>
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
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ${openAddOptions ? '' : 'hidden'}`}>
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Company</h2>
        <p className="text-sm text-gray-600 mb-6">Choose how you want to add a company:</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setOpenAddOptions(false)}
            className="px-5 py-2.5 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 transition duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setOpenAddOptions(false);
              setIsAddSingleOpen(true);
              logActivity("SELECT_ADD_SINGLE", {});
            }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 transition duration-200 font-medium"
          >
            Add Single Company
          </button>
          <button
            onClick={() => {
              setOpenAddOptions(false);
              setIsAddBulkOpen(true);
              logActivity("SELECT_ADD_BULK", {});
            }}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-2.5 rounded-lg shadow-md hover:from-green-700 hover:to-green-800 transition duration-200 font-medium"
          >
            Add Bulk Companies
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Delete Confirmation Dialog */}
  {canDelete && (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ${openDelete ? '' : 'hidden'}`}>
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Confirm Deletion</h2>
        <p className="text-sm text-gray-600 mb-6">{deleteMessage}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setOpenDelete(false)}
            className="px-5 py-2.5 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 transition duration-200 font-medium"
          >
            Cancel
          </button>
          {deleteMessage === "Are you sure you want to delete this company? This action cannot be undone." && (
            <button
              onClick={deleteCompany}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-2.5 rounded-lg shadow-md hover:from-red-700 hover:to-red-800 transition duration-200 font-medium"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  )}

  {/* Call Schedule Dialog */}
  {canCreate && (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ${openCallSchedule ? '' : 'hidden'}`}>
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Schedule Call</h2>
        <div className="space-y-4 text-sm text-gray-700">
          {callScheduleForm.companyId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <input
                type="text"
                value={companies.find((c) => c.id === callScheduleForm.companyId)?.name || ""}
                disabled
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg shadow-sm text-sm text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          )}
          {!callScheduleForm.companyId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Company</label>
              <select
                value={callScheduleForm.companyId}
                onChange={(e) => setCallScheduleForm({ ...callScheduleForm, companyId: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg shadow-sm text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-200"
              >
                <option value="">Select a company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Call Date</label>
            <input
              type="date"
              value={callScheduleForm.callDate}
              onChange={(e) => setCallScheduleForm({ ...callScheduleForm, callDate: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg shadow-sm text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Call Time</label>
            <input
              type="time"
              value={callScheduleForm.callTime}
              onChange={(e) => setCallScheduleForm({ ...callScheduleForm, callTime: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg shadow-sm text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
            <textarea
              value={callScheduleForm.purpose}
              onChange={(e) => setCallScheduleForm({ ...callScheduleForm, purpose: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg shadow-sm text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-200"
              rows="3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reminder (minutes before)</label>
            <select
              value={callScheduleForm.reminderTime}
              onChange={(e) => setCallScheduleForm({ ...callScheduleForm, reminderTime: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg shadow-sm text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-200"
            >
              <option value="5">5 minutes</option>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => setOpenCallSchedule(false)}
            className="px-5 py-2.5 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 transition duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleCallScheduleSubmit}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-2.5 rounded-lg shadow-md hover:from-green-700 hover:to-green-800 transition duration-200 font-medium"
          >
            Schedule
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Call Reminder Dialog */}
  {openReminderDialog && reminderDetails && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Call Reminder</h2>
        <div className="space-y-2 text-sm text-gray-700">
          <p><span className="font-medium text-gray-900">Company:</span> {reminderDetails.companyName}</p>
          <p><span className="font-medium text-gray-900">Call Time:</span> {reminderDetails.callDate} {reminderDetails.callTime}</p>
          <p><span className="font-medium text-gray-900">Purpose:</span> {reminderDetails.purpose}</p>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setOpenReminderDialog(false)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 transition duration-200 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )}
</div>
    );
}
