import React, { useState, useEffect, useCallback } from "react";
import { getFirestore, collection, query, getDocs, where, doc, updateDoc } from "firebase/firestore";
import { format } from "date-fns";
import { useAuth } from "../../../context/AuthContext";

const ITEMS_PER_PAGE = 10;

const TaskCallSchedule = () => {
    const [scheduledCalls, setScheduledCalls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const { user } = useAuth();
    const db = getFirestore();
    const [debugInfo, setDebugInfo] = useState({ enquiryCalls: 0, companyArrayCalls: 0, companySubcollectionCalls: 0 });

    const fetchScheduledCalls = useCallback(async (retries = 2) => {
        if (!user) {
            setError("Please log in to view scheduled calls.");
            setLoading(false);
            return;
        }

        const timeout = setTimeout(() => {
            setError("Request timed out while fetching scheduled calls.");
            setLoading(false);
        }, 30000);

        try {
            setLoading(true);
            setError(null);

            const [enquiryCalls, companyCalls] = await Promise.all([
                fetchEnquiries(),
                fetchCompanies()
            ]);

            const calls = [...enquiryCalls, ...companyCalls]
                .sort((a, b) => a.callDateTime - b.callDateTime)
                .map(call => ({
                    ...call,
                    status: determineStatus(call),
                    isCompleted: call.status === "Completed"
                }));

            setDebugInfo({
                enquiryCalls: enquiryCalls.length,
                companyArrayCalls: companyCalls.filter(c => !c.noteId).length,
                companySubcollectionCalls: companyCalls.filter(c => c.noteId).length
            });
            setScheduledCalls(calls);
        } catch (err) {
            console.warn(`Retrying fetchScheduledCalls, attempts left: ${retries}`, err);
            if (retries > 0) {
                return fetchScheduledCalls(retries - 1);
            }
            setError(`Failed to load scheduled calls: ${err.message}`);
        } finally {
            clearTimeout(timeout);
            setLoading(false);
        }
    }, [user]);

    const fetchEnquiries = async () => {
        try {
            const enquiriesQuery = query(collection(db, "enquiries"));
            const enquirySnapshot = await getDocs(enquiriesQuery);
            const calls = [];

            enquirySnapshot.forEach((doc) => {
                const enquiryData = doc.data();
                const enquiryId = doc.id;
                const callScheduleNotes = (enquiryData.notes || []).filter(
                    note => note.type === "call-schedule" && note.callDate && note.callScheduledTime
                );

                callScheduleNotes.forEach((note, noteIndex) => {
                    try {
                        const callDateTime = new Date(`${note.callDate}T${note.callScheduledTime}`);
                        if (isNaN(callDateTime.getTime())) {
                            console.warn(`Invalid date/time for enquiry ${enquiryId}, note ${noteIndex}`);
                            return;
                        }

                        const createdAt = note.createdAt && note.createdAt.toDate
                            ? note.createdAt.toDate().toISOString()
                            : note.createdAt || "";

                        calls.push({
                            source: "Enquiry",
                            entityId: enquiryId,
                            entityName: enquiryData.name || "Unnamed Enquiry",
                            assignTo: enquiryData.assignTo || "Unassigned",
                            callDate: note.callDate,
                            callTime: note.callScheduledTime,
                            callDateTime,
                            noteContent: note.content || "No details provided",
                            addedBy: note.addedBy || "Unknown",
                            createdAt,
                            status: note.status || "Pending",
                            noteIndex,
                            phone: note.phone || enquiryData.phone || "N/A",
                        });
                    } catch (error) {
                        console.warn(`Invalid enquiry note data for ${enquiryId}, note ${noteIndex}:`, error);
                    }
                });
            });
            return calls;
        } catch (error) {
            return [];
        }
    };

    const fetchCompanies = async () => {
        try {
            const companiesQuery = query(collection(db, "Companies"));
            const companySnapshot = await getDocs(companiesQuery);
            const calls = [];

            for (const doc of companySnapshot.docs) {
                const companyData = doc.data();
                const companyId = doc.id;

                // Fetch from notes array
                const callScheduleNotes = (companyData.notes || []).filter(
                    note => note.type === "call-schedule" && note.callDate && note.callScheduledTime
                );

                callScheduleNotes.forEach((note, noteIndex) => {
                    try {
                        const callDateTime = new Date(`${note.callDate}T${note.callScheduledTime}`);
                        if (isNaN(callDateTime.getTime())) {
                            console.warn(`Invalid date/time for company ${companyId}, array note ${noteIndex}`);
                            return;
                        }

                        const createdAt = note.createdAt && note.createdAt.toDate
                            ? note.createdAt.toDate().toISOString()
                            : note.createdAt || "";

                        calls.push({
                            source: "Company",
                            entityId: companyId,
                            entityName: companyData.name || "Unnamed Company",
                            assignTo: note.addedBy || "Unassigned",
                            callDate: note.callDate,
                            callTime: note.callScheduledTime,
                            callDateTime,
                            noteContent: note.content || "No details provided",
                            addedBy: note.addedBy || "Unknown",
                            createdAt,
                            status: note.status || "Pending",
                            noteIndex,
                            phone: note.phone || companyData.phone || "N/A",
                        });
                    } catch (error) {
                        console.warn(`Invalid company array note data for ${companyId}, note ${noteIndex}:`, error);
                    }
                });

                // Fetch from notes subcollection
                const notesQuery = query(
                    collection(db, "Companies", companyId, "notes"),
                    where("noteType", "==", "call-schedule")
                );
                const notesSnapshot = await getDocs(notesQuery);

                notesSnapshot.forEach((noteDoc) => {
                    try {
                        const noteData = noteDoc.data();
                        const callDateTime = new Date(`${noteData.callDate}T${noteData.callTime}`);
                        if (isNaN(callDateTime.getTime())) {
                            console.warn(`Invalid date/time for company ${companyId}, subcollection note ${noteDoc.id}`);
                            return;
                        }

                        const createdAt = noteData.createdAt && noteData.createdAt.toDate
                            ? noteData.createdAt.toDate().toISOString()
                            : noteData.createdAt || "";

                        calls.push({
                            source: "Company",
                            entityId: companyId,
                            entityName: companyData.name || "Unnamed Company",
                            assignTo: noteData.createdBy || "Unassigned",
                            callDate: noteData.callDate,
                            callTime: noteData.callTime,
                            callDateTime,
                            noteContent: noteData.content || "No details provided",
                            addedBy: noteData.createdBy || "Unknown",
                            createdAt,
                            status: noteData.status || "Pending",
                            noteId: noteDoc.id,
                            phone: companyData.phone || "N/A",
                        });
                    } catch (error) {
                        console.warn(`Invalid company subcollection note data for ${companyId}, note ${noteDoc.id}:`, error);
                    }
                });
            }
            return calls;
        } catch (error) {
            //console.error("Error fetching companies:", error);
            return [];
        }
    };

    const determineStatus = (call) => {
        if (call.status === "Completed") return "Completed";
        if (call.status === "In Progress") return "In Progress";
        if (call.status === "Pending" || call.status === "scheduled") return "Pending";
        if (call.callDateTime < new Date()) return "Overdue";
        return "Pending";
    };

    const updateCallStatus = async (call, newStatus) => {
        try {
            if (call.source === "Enquiry") {
                const enquiryRef = doc(db, "enquiries", call.entityId);
                const enquiryDoc = await getDocs(query(collection(db, "enquiries"), where("__name__", "==", call.entityId)));
                if (enquiryDoc.empty) throw new Error("Enquiry not found");
                const enquiryData = enquiryDoc.docs[0].data();
                const updatedNotes = [...(enquiryData.notes || [])];
                updatedNotes[call.noteIndex] = { ...updatedNotes[call.noteIndex], status: newStatus };

                await updateDoc(enquiryRef, { notes: updatedNotes });
            } else if (call.source === "Company") {
                if (call.noteId) {
                    // Subcollection note
                    const noteRef = doc(db, "Companies", call.entityId, "notes", call.noteId);
                    await updateDoc(noteRef, { status: newStatus });
                } else {
                    // Array note
                    const companyRef = doc(db, "Companies", call.entityId);
                    const companyDoc = await getDocs(query(collection(db, "Companies"), where("__name__", "==", call.entityId)));
                    if (companyDoc.empty) throw new Error("Company not found");
                    const companyData = companyDoc.docs[0].data();
                    const updatedNotes = [...(companyData.notes || [])];
                    updatedNotes[call.noteIndex] = { ...updatedNotes[call.noteIndex], status: newStatus };

                    await updateDoc(companyRef, { notes: updatedNotes });
                }
            }

            setScheduledCalls(prevCalls =>
                prevCalls.map(c =>
                    c.source === call.source && c.entityId === call.entityId &&
                    ((call.noteId && c.noteId === call.noteId) || (call.noteIndex !== undefined && c.noteIndex === call.noteIndex))
                        ? { ...c, status: newStatus, isCompleted: newStatus === "Completed" }
                        : c
                )
            );
        } catch (error) {
            setError(`Failed to update call status: ${error.message}`);
        }
    };

    useEffect(() => {
        fetchScheduledCalls();
    }, [fetchScheduledCalls]);

    const formatDateSafely = (dateString, formatString) => {
        if (!dateString) return "Not available";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Invalid date";
        return format(date, formatString);
    };

    const getRowColorClass = (call) => {
        if (call.isCompleted) return "text-gray-500 line-through";
        if (call.status === "Overdue") return "bg-red-100 text-red-800";
        if (call.status === "In Progress") return "bg-blue-50 text-blue-800";
        return call.source === "Enquiry" ? "text-green-600" : "text-blue-600";
    };

    // Pagination logic
    const totalPages = Math.ceil(scheduledCalls.length / ITEMS_PER_PAGE);
    const paginatedCalls = scheduledCalls.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 p-4 fixed inset-0 left-[300px] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Scheduled Call Tasks</h2>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <p className="text-gray-600 text-sm">Loading scheduled calls...</p>
                </div>
            ) : error ? (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                    {error}
                </div>
            ) : scheduledCalls.length === 0 ? (
                <div className="p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-md text-sm">
                    No scheduled calls found. (Enquiries: {debugInfo.enquiryCalls}, Company Array: {debugInfo.companyArrayCalls}, Company Subcollection: {debugInfo.companySubcollectionCalls})
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-lg shadow overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Source
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Phone Number
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Assigned To
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Call Date
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Call Time
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Note
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Added By
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Action
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedCalls.map((call, index) => (
                                    <tr
                                        key={`${call.source}-${call.entityId}-${call.createdAt}-${call.noteId || call.noteIndex}-${index}`}
                                        className={`hover:bg-gray-50 ${getRowColorClass(call)}`}
                                    >
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">{call.source}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">{call.entityName}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">{call.phone}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">{call.assignTo}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                            {formatDateSafely(call.callDate, "MMM d, yyyy")}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">{call.callTime}</td>
                                        <td className="px-4 py-3 text-sm max-w-xs truncate">{call.noteContent}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">{call.addedBy}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm space-x-2">
                                            {call.isCompleted ? (
                                                <button
                                                    className="text-sm text-blue-600 hover:text-blue-800"
                                                    disabled
                                                >
                                                    Completed
                                                </button>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => updateCallStatus(call, "In Progress")}
                                                        className="text-sm text-green-600 hover:text-green-800 disabled:opacity-50"
                                                        disabled={call.status === "In Progress"}
                                                    >
                                                        Start
                                                    </button>
                                                    <button
                                                        onClick={() => updateCallStatus(call, "Pending")}
                                                        className="text-sm text-yellow-600 hover:text-yellow-800 disabled:opacity-50"
                                                        disabled={call.status !== "In Progress"}
                                                    >
                                                        Stop
                                                    </button>
                                                    <button
                                                        onClick={() => updateCallStatus(call, "Completed")}
                                                        className="text-sm text-blue-600 hover:text-blue-800"
                                                    >
                                                        Complete
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">{call.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-3 bg-gray-200 text-gray-800 rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-600">
                            Page {currentPage} of {totalPages} (Total Calls: {scheduledCalls.length})
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-3 bg-gray-200 text-gray-800 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default TaskCallSchedule;