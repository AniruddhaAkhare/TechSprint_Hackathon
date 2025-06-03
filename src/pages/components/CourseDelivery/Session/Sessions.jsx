import { useState, useEffect, useCallback, useMemo } from "react";
import { db } from '../../../../config/firebase.jsx'
import { collection, onSnapshot, deleteDoc, doc, query, orderBy, updateDoc, setDoc, arrayUnion, increment } from 'firebase/firestore';
import CreateSession from "./CreateSession.jsx";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";
import { Select, MenuItem, FormControl } from '@mui/material';
import { useAuth } from "../../../../context/AuthContext.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import debounce from 'lodash/debounce';

export default function Sessions() {
    const { rolePermissions, user } = useAuth();

    // Permission checks
    const canCreate = rolePermissions.Sessions?.create || false;
    const canUpdate = rolePermissions.Sessions?.update || false;
    const canDelete = rolePermissions.Sessions?.delete || false;
    const canDisplay = rolePermissions.Sessions?.display || false;

    const [currentSession, setCurrentSession] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [statusFilter, setStatusFilter] = useState('Active');
    const [dateFilter, setDateFilter] = useState('All');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [deleteMessage, setDeleteMessage] = useState("Are you sure you want to delete this session? This action cannot be undone.");
    const [courses, setCourses] = useState([]);
    const [batches, setBatches] = useState([]);
    const [centers, setCenters] = useState([]);

    const SessionCollectionRef = collection(db, "Sessions");
    const CourseCollectionRef = collection(db, "Courses");
    const BatchCollectionRef = collection(db, "Batch");
    const instituteId = "RDJ9wMXGrIUk221MzDxP"; // Hardcoded from Batches component
    const CenterCollectionRef = collection(db, "instituteSetup", instituteId, "Center");

    const toggleSidebar = () => setIsOpen(prev => !prev);

    const logActivity = async (action, details) => {
        if (!user) {
            // //console.error("No user logged in for logging activity");
            return;
        }
        try {
            const logDocRef = doc(db, "activityLogs", "currentLog");
            const logEntry = {
                timestamp: serverTimestamp(),
                userId: user.uid,
                userEmail: user.email || 'Unknown',
                action,
                details
            };
            await updateDoc(logDocRef, {
                logs: arrayUnion(logEntry),
                count: increment(1)
            }).catch(async (err) => {
                if (err.code === 'not-found') {
                    await setDoc(logDocRef, { logs: [logEntry], count: 1 });
                } else {
                    throw err;
                }
            });
        } catch (err) {
            // //console.error("Error logging activity:", err.message);
            toast.error("Failed to log activity.");
        }
    };

    const calculateSessionStatus = useCallback((session) => {
        const sessionDateTime = new Date(`${session.date} ${session.endTime}`);
        const currentDateTime = new Date();
        return sessionDateTime < currentDateTime ? "Inactive" : "Active";
    }, []);

    const fetchCourses = useCallback(() => {
        if (!canDisplay) return;
        const unsubscribe = onSnapshot(CourseCollectionRef, (snapshot) => {
            const courseData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setCourses(courseData);
        }, (err) => {
            // //console.error("Error fetching courses:", err.message);
            toast.error("Failed to fetch courses");
        });
        return unsubscribe;
    }, [canDisplay]);

    const fetchBatches = useCallback(() => {
        if (!canDisplay) return;
        const q = query(BatchCollectionRef, orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const batchData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setBatches(batchData);
        }, (err) => {
            // //console.error("Error fetching batches:", err.message);
            toast.error("Failed to fetch batches");
        });
        return unsubscribe;
    }, [canDisplay]);

    const fetchCenters = useCallback(() => {
        if (!canDisplay) return;
        const unsubscribe = onSnapshot(CenterCollectionRef, (snapshot) => {
            const centerData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setCenters(centerData);
        }, (err) => {
            // //console.error("Error fetching centers:", err.message);
            toast.error("Failed to fetch centers");
        });
        return unsubscribe;
    }, [canDisplay]);

    const fetchSessions = useCallback(() => {
        if (!canDisplay) return;
        const q = query(SessionCollectionRef, orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const sessionData = snapshot.docs.map((doc) => {
                const data = doc.data();
                const status = calculateSessionStatus(data);
                return {
                    id: doc.id,
                    ...data,
                    status
                };
            });
            setSessions(sessionData);
            setSearchResults([]);
        }, (err) => {
            // //console.error("Error fetching sessions:", err.message);
            toast.error("Failed to fetch sessions");
        });
        return unsubscribe;
    }, [canDisplay, calculateSessionStatus]);

    useEffect(() => {
        if (canDisplay) {
            const unsubscribeSessions = fetchSessions();
            const unsubscribeCourses = fetchCourses();
            const unsubscribeBatches = fetchBatches();
            const unsubscribeCenters = fetchCenters();
            return () => {
                unsubscribeSessions && unsubscribeSessions();
                unsubscribeCourses && unsubscribeCourses();
                unsubscribeBatches && unsubscribeBatches();
                unsubscribeCenters && unsubscribeCenters();
            };
        }
    }, [canDisplay, fetchSessions, fetchCourses, fetchBatches, fetchCenters]);

    const debouncedSearch = useCallback(
        debounce((term) => {
            if (!term.trim()) {
                setSearchResults([]);
                return;
            }
            const results = sessions.filter(s =>
                s.name.toLowerCase().includes(term.toLowerCase())
            );
            setSearchResults(results);
            if (results.length === 0 && term.trim()) {
                toast.warn("No sessions match the search term.");
            }
        }, 300),
        [sessions]
    );

    useEffect(() => {
        debouncedSearch(searchTerm);
        return () => debouncedSearch.cancel();
    }, [searchTerm, debouncedSearch]);

    const handleDateFilterChange = useCallback((value) => {
        setDateFilter(value);
        const today = new Date('2025-04-18'); // Current date as per system context
        let start, end;

        switch (value) {
            case 'Today':
                start = end = today.toISOString().split('T')[0];
                break;
            case 'Last Week':
                start = new Date(today);
                start.setDate(today.getDate() - 7);
                end = new Date(today);
                end.setDate(today.getDate() - 1);
                start = start.toISOString().split('T')[0];
                end = end.toISOString().split('T')[0];
                break;
            case 'Last Month':
                start = new Date(today);
                start.setMonth(today.getMonth() - 1);
                end = new Date(today);
                end.setDate(today.getDate() - 1);
                start = start.toISOString().split('T')[0];
                end = end.toISOString().split('T')[0];
                break;
            case 'Next Week':
                start = new Date(today);
                start.setDate(today.getDate() + 1);
                end = new Date(today);
                end.setDate(today.getDate() + 7);
                start = start.toISOString().split('T')[0];
                end = end.toISOString().split('T')[0];
                break;
            case 'Next Month':
                start = new Date(today);
                start.setDate(today.getDate() + 1);
                end = new Date(today);
                end.setMonth(today.getMonth() + 1);
                start = start.toISOString().split('T')[0];
                end = end.toISOString().split('T')[0];
                break;
            case 'All':
            default:
                start = '';
                end = '';
                break;
        }

        setStartDate(start);
        setEndDate(end);
    }, []);

    const filteredSessions = useMemo(() => {
        let baseSessions = searchResults.length > 0 ? searchResults : sessions;

        // Apply status filter
        if (statusFilter !== 'All') {
            baseSessions = baseSessions.filter(s => s.status === statusFilter);
        }

        // Apply date filter
        if (startDate && endDate) {
            baseSessions = baseSessions.filter(s => {
                const sessionDate = new Date(s.date);
                const start = new Date(startDate);
                const end = new Date(endDate);
                return sessionDate >= start && sessionDate <= end;
            });
        }

        return baseSessions;
    }, [sessions, searchResults, statusFilter, startDate, endDate]);

    const handleCreateSessionClick = () => {
        if (!canCreate) {
            toast.error("You do not have permission to create sessions.");
            return;
        }
        setCurrentSession(null);
        toggleSidebar();
    };

    const handleEditClick = (session) => {
        if (!canUpdate) {
            toast.error("You do not have permission to update sessions.");
            return;
        }
        setCurrentSession(session);
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        setCurrentSession(null);
    };

    const deleteSession = async () => {
        if (!deleteId || !canDelete) {
            if (!canDelete) toast.error("You do not have permission to delete sessions.");
            return;
        }
        try {
            const sessionToDelete = sessions.find(s => s.id === deleteId);
            await deleteDoc(doc(db, "Sessions", deleteId));
            await logActivity("Deleted session", {
                name: sessionToDelete?.name || "Unknown",
            });
            setOpenDelete(false);
            setDeleteMessage("Are you sure you want to delete this session? This action cannot be undone.");
            toast.success("Session deleted successfully!");
        } catch (error) {
            // //console.error("Error deleting session:", error.message);
            setDeleteMessage("Failed to delete session. Please try again.");
            toast.error("Failed to delete session.");
        }
    };

    const handleSessionSubmit = async (sessionData) => {
        try {
            await logActivity(sessionData.id ? "Updated session" : "Created session", {
                name: sessionData.name
            });
            handleClose();
            toast.success(`Session ${sessionData.id ? 'updated' : 'created'} successfully.`);
        } catch (error) {
            // //console.error("Error logging session action:", error.message);
            toast.error("Failed to log session action.");
        }
    };

    if (!canDisplay) {
        return (
            <div className="p-4 text-red-600 text-center">
                Access Denied: You do not have permission to view sessions.
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 p-4 fixed inset-0 left-[300px]">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-[#333333] font-sans">Sessions</h1>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <FormControl size="small" className="w-full sm:w-40">
                        <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-white border border-gray-300 rounded-md"
                        >
                            <MenuItem value="All">All</MenuItem>
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="Inactive">Inactive</MenuItem>
                        </Select>
                    </FormControl>
                    {canCreate && (
                        <button
                            onClick={handleCreateSessionClick}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
                        >
                            + Create Session
                        </button>
                    )}
                </div>
            </div>

         <div className="bg-white p-8 rounded-xl shadow-lg max-w-full">
  <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
    <div className="flex flex-col sm:flex-row sm:gap-6 w-full sm:w-auto">
      <div className="flex flex-col">
        <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full sm:w-44 px-4 py-2 border border-gray-300 rounded-lg shadow-sm transition focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-600"
        />
      </div>
      <div className="flex flex-col">
        <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full sm:w-44 px-4 py-2 border border-gray-300 rounded-lg shadow-sm transition focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-600"
        />
      </div>
     <FormControl size="small" className="w-full sm:w-44 mt-4 sm:mt-0">
            <Select
              value={dateFilter}
              onChange={(e) => handleDateFilterChange(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg shadow-sm"
              MenuProps={{
                PaperProps: {
                  style: { borderRadius: "0.5rem", boxShadow: "0 10px 15px rgba(0,0,0,0.1)" },
                },
              }}
            >
              <MenuItem value="All">All Dates</MenuItem>
              <MenuItem value="Today">Today</MenuItem>
              <MenuItem value="Last Week">Last Week</MenuItem>
              <MenuItem value="Last Month">Last Month</MenuItem>
              <MenuItem value="Next Week">Next Week</MenuItem>
              <MenuItem value="Next Month">Next Month</MenuItem>
            </Select>
          </FormControl>
    </div>

   <div className="relative w-full max-w-md mt-4">
  <svg
    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
  <input
    type="text"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Search sessions by name..."
    className="w-full px-12 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-700 placeholder-gray-400 transition focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-600"
  />
</div>

  </div>

  <div className="rounded-xl shadow-md overflow-x-auto max-h-[450px] scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-100">
    <table className="w-full table-auto min-w-[700px] border-collapse">
      <thead className="bg-gray-100 sticky top-0 z-10">
        <tr>
          {[
            "Sr No",
            "Session Name",
            "Date",
            "Start Time",
            "End Time",
            "Mode",
            "Status",
            "Action",
          ].map((header) => (
            <th
              key={header}
              className="px-6 py-4 text-left text-sm font-semibold text-gray-700 select-none"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {filteredSessions.length > 0 ? (
          filteredSessions.map((s, index) => (
            <tr
              key={s.id}
              className="border-b border-gray-200 hover:bg-blue-50 transition-colors"
            >
              <td className="px-6 py-3 text-gray-600">{index + 1}</td>
              <td className="px-6 py-3 font-medium text-gray-900">{s.name || "N/A"}</td>
              <td className="px-6 py-3 text-gray-600">{s.date || "N/A"}</td>
              <td className="px-6 py-3 text-gray-600">{s.startTime || "N/A"}</td>
              <td className="px-6 py-3 text-gray-600">{s.endTime || "N/A"}</td>
              <td className="px-6 py-3 text-gray-600">{s.sessionMode || "N/A"}</td>
              <td className="px-6 py-3">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    s.status === "Active"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {s.status}
                </span>
              </td>
              <td className="px-6 py-3">
                {(canUpdate || canDelete) && (
                  <FormControl size="small" className="w-28">
                    <Select
                      value=""
                      onChange={(e) => {
                        const action = e.target.value;
                        if (action === "edit" && canUpdate) {
                          handleEditClick(s);
                        } else if (action === "delete" && canDelete) {
                          setDeleteId(s.id);
                          setOpenDelete(true);
                          setDeleteMessage(
                            "Are you sure you want to delete this session? This action cannot be undone."
                          );
                        }
                      }}
                      displayEmpty
                      renderValue={() => "Actions"}
                      className="text-sm"
                      disabled={!canUpdate && !canDelete}
                      MenuProps={{
                        PaperProps: {
                          style: { borderRadius: "0.5rem", boxShadow: "0 8px 12px rgba(0,0,0,0.1)" },
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        Actions
                      </MenuItem>
                      {canUpdate && <MenuItem value="edit">Edit</MenuItem>}
                      {canDelete && <MenuItem value="delete">Delete</MenuItem>}
                    </Select>
                  </FormControl>
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan="8"
              className="px-6 py-6 text-center text-gray-500 italic select-none"
            >
              No sessions found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>


            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={handleClose}
                />
            )}

            {isOpen && (
                <div
                    className={`fixed top-0 right-0 h-full w-full sm:w-3/4 md:w-2/5 bg-white shadow-lg transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"} z-50 overflow-y-auto`}
                >
                    <CreateSession
                        isOpen={isOpen}
                        toggleSidebar={handleClose}
                        sessionToEdit={currentSession}
                        onSubmit={handleSessionSubmit}
                        logActivity={logActivity}
                        courses={courses}
                        batches={batches}
                        centers={centers}
                    />
                </div>
            )}

            {canDelete && (
                <Dialog
                    open={openDelete}
                    handler={() => setOpenDelete(false)}
                    className="rounded-lg shadow-lg w-96 max-w-[90%] mx-auto"
                >
                    <DialogHeader className="text-gray-800 font-semibold text-lg p-4">Confirm Deletion</DialogHeader>
                    <DialogBody className="text-gray-600 text-base p-4">{deleteMessage}</DialogBody>
                    <DialogFooter className="space-x-4 p-4">
                        <Button
                            variant="text"
                            color="gray"
                            onClick={() => setOpenDelete(false)}
                            className="hover:bg-gray-100 transition duration-200"
                        >
                            Cancel
                        </Button>
                        {deleteMessage === "Are you sure you want to delete this session? This action cannot be undone." && (
                            <Button
                                variant="filled"
                                color="red"
                                onClick={deleteSession}
                                className="bg-red-500 hover:bg-red-600 transition duration-200 text-sm"
                            >
                                Yes, Delete
                            </Button>
                        )}
                    </DialogFooter>
                </Dialog>
            )}
        </div>
    );
}