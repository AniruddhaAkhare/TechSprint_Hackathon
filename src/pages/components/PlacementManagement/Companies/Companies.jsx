

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
                                {(canUpdate || canDelete || canCreate) && (
                                    <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Action</th>
                                )}
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
                                    {(canUpdate || canDelete || canCreate) && (
                                        <td className="px-4 py-3 text-gray-800" onClick={(e) => e.stopPropagation()}>
                                            {canUpdate && (
                                                <button
                                                    onClick={() => handleEditClick(company)}
                                                    className="text-blue-600 hover:text-blue-800 mr-3"
                                                >
                                                    Edit
                                                </button>
                                            )}
                                            {canDelete && (
                                                <button
                                                    onClick={() => handleDeleteClick(company.id)}
                                                    className="text-red-600 hover:text-red-800 mr-3"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                            {canCreate && (
                                                <button
                                                    onClick={() => handleOpenCallSchedule(company)}
                                                    className="text-green-600 hover:text-green-800"
                                                >
                                                    Schedule Call
                                                </button>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {(searchResults.length > 0 ? searchResults : companies).length === 0 && (
                                <tr>
                                    <td colSpan={(canUpdate || canDelete || canCreate) ? 9 : 8} className="px-4 py-3 text-center text-gray-500">
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
                                Delete
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
                    className="max-w-sm rounded-lg shadow-lg"
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