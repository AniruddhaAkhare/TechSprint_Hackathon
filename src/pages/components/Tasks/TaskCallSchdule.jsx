import React, { useState, useEffect } from "react";
import { getFirestore, collection, query, getDocs, where, doc, updateDoc } from "firebase/firestore";
import { format } from "date-fns";
import { useAuth } from "../../../context/AuthContext";

const TaskCallSchdule = () => {
    const [scheduledCalls, setScheduledCalls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const db = getFirestore();

    useEffect(() => {
        console.log("Auth user state:", user ? user.email : "No user");

        if (!user) {
            console.log("No user logged in, skipping fetch.");
            setLoading(false);
            setError("Please log in to view scheduled calls.");
            return;
        }

        const fetchEnquiries = async () => {
            console.log("Fetching enquiries...");
            try {
                const enquiriesQuery = query(collection(db, "enquiries"));
                const enquirySnapshot = await getDocs(enquiriesQuery);
                console.log("Total enquiries fetched:", enquirySnapshot.size);

                const calls = [];
                enquirySnapshot.forEach((doc) => {
                    const enquiryData = doc.data();
                    const enquiryId = doc.id;

                    console.log(`Processing enquiry ID: ${enquiryId}, Name: ${enquiryData.name}`);

                    const callScheduleNotes = (enquiryData.notes || []).filter(
                        (note) =>
                            note.type === "call-schedule" &&
                            note.callDate &&
                            note.callScheduledTime
                    );

                    console.log(`Found ${callScheduleNotes.length} call-schedule notes for enquiry ${enquiryId}`);

                    callScheduleNotes.forEach((note, noteIndex) => {
                        try {
                            const callDateTime = new Date(`${note.callDate}T${note.callScheduledTime}`);
                            if (isNaN(callDateTime.getTime())) {
                                console.warn(`Invalid date for enquiry note ${noteIndex} in ${enquiryId}:`, note);
                                return;
                            }
                            console.log(`Enquiry Note ${noteIndex}:`, {
                                callDate: note.callDate,
                                callTime: note.callScheduledTime,
                                callDateTime: callDateTime.toISOString(),
                            });

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
                                createdAt: note.createdAt || "",
                                isPast: callDateTime < new Date(),
                                isDone: note.isDone || false,
                                noteIndex,
                                phone: note.phone || enquiryData.phone || "N/A",
                            });
                        } catch (noteError) {
                            console.error(`Error processing enquiry note ${noteIndex} in enquiry ${enquiryId}:`, noteError);
                        }
                    });
                });
                return calls;
            } catch (enquiryError) {
                console.error("Error fetching enquiries:", enquiryError);
                throw new Error(`Failed to fetch enquiries: ${enquiryError.message}`);
            }
        };

        const fetchCompanies = async () => {
            console.log("Fetching companies...");
            try {
                const companiesQuery = query(collection(db, "Companies"));
                const companySnapshot = await getDocs(companiesQuery);
                console.log("Total companies fetched:", companySnapshot.size);

                const calls = [];
                for (const companyDoc of companySnapshot.docs) {
                    const companyData = companyDoc.data();
                    const companyId = companyDoc.id;

                    console.log(`Processing company ID: ${companyId}, Name: ${companyData.name || "Unnamed"}`);

                    const notesQuery = query(
                        collection(db, "Companies", companyId, "notes"),
                        where("noteType", "==", "call-schedule")
                    );
                    const notesSnapshot = await getDocs(notesQuery);
                    console.log(`Found ${notesSnapshot.size} call-schedule notes for company ${companyId}`);

                    notesSnapshot.forEach((noteDoc, noteIndex) => {
                        try {
                            const noteData = noteDoc.data();
                            const callDateTime = new Date(`${noteData.callDate}T${noteData.callTime}`);
                            if (isNaN(callDateTime.getTime())) {
                                console.warn(`Invalid date for company note ${noteIndex} in ${companyId}:`, noteData);
                                return;
                            }
                            console.log(`Company Note ${noteIndex}:`, {
                                callDate: noteData.callDate,
                                callTime: noteData.callTime,
                                callDateTime: callDateTime.toISOString(),
                            });

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
                                createdAt: noteData.createdAt?.toDate?.().toISOString?.() || "",
                                isPast: callDateTime < new Date(),
                                isDone: noteData.isDone || false,
                                noteId: noteDoc.id,
                                phone: noteData.phone || companyData.phone || "N/A",
                            });
                        } catch (noteError) {
                            console.error(`Error processing company note ${noteIndex} in company ${companyId}:`, noteError);
                        }
                    });
                }
                return calls;
            } catch (companyError) {
                console.error("Error fetching companies:", companyError);
                throw new Error(`Failed to fetch companies: ${companyError.message}`);
            }
        };

        const fetchScheduledCalls = async (retries = 2) => {
            const timeout = setTimeout(() => {
                console.error("Fetch scheduled calls timed out after 20 seconds");
                setError("Request timed out while fetching scheduled calls. Please try again.");
                setLoading(false);
            }, 20000);

            try {
                setLoading(true);
                setError(null);
                console.log("Starting fetch for user:", user.email);

                let calls = [];
                try {
                    calls = [...calls, ...(await fetchEnquiries())];
                } catch (enquiryError) {
                    if (retries > 0) {
                        console.log(`Retrying enquiries fetch, ${retries} attempts left...`);
                        return await fetchScheduledCalls(retries - 1);
                    }
                    throw enquiryError;
                }

                try {
                    calls = [...calls, ...(await fetchCompanies())];
                } catch (companyError) {
                    if (retries > 0) {
                        console.log(`Retrying companies fetch, ${retries} attempts left...`);
                        return await fetchScheduledCalls(retries - 1);
                    }
                    throw companyError;
                }

                calls.sort((a, b) => a.callDateTime - b.callDateTime);
                console.log("Processed calls:", calls);

                setScheduledCalls(calls);
                if (calls.length === 0) {
                    console.log("No valid scheduled calls found.");
                }
            } catch (err) {
                console.error("Error in fetchScheduledCalls:", err);
                setError(`Failed to load scheduled calls: ${err.message}`);
            } finally {
                clearTimeout(timeout);
                setLoading(false);
                console.log("Fetch completed, loading set to false");
            }
        };

        console.log("Initiating fetchScheduledCalls...");
        fetchScheduledCalls();
    }, [user, db]);

    const toggleCallDoneStatus = async (call) => {
        try {
            const newDoneStatus = !call.isDone;
            if (call.source === "Enquiry") {
                const enquiryRef = doc(db, "enquiries", call.entityId);
                const enquiryDoc = await getDocs(query(collection(db, "enquiries"), where("__name__", "==", call.entityId)));
                const enquiryData = enquiryDoc.docs[0].data();
                const updatedNotes = [...(enquiryData.notes || [])];
                updatedNotes[call.noteIndex] = { ...updatedNotes[call.noteIndex], isDone: newDoneStatus };

                await updateDoc(enquiryRef, { notes: updatedNotes });
                console.log(`Toggled enquiry call ${call.entityId} note ${call.noteIndex} to isDone: ${newDoneStatus}`);
            } else if (call.source === "Company") {
                const noteRef = doc(db, "Companies", call.entityId, "notes", call.noteId);
                await updateDoc(noteRef, { isDone: newDoneStatus });
                console.log(`Toggled company call ${call.entityId} note ${call.noteId} to isDone: ${newDoneStatus}`);
            }

            // Update local state
            setScheduledCalls((prevCalls) =>
                prevCalls.map((c) =>
                    c.source === call.source && c.entityId === call.entityId && (call.noteIndex ? c.noteIndex === call.noteIndex : c.noteId === call.noteId)
                        ? { ...c, isDone: newDoneStatus }
                        : c
                )
            );
        } catch (error) {
            console.error("Error toggling call done status:", error);
            setError(`Failed to toggle call done status: ${error.message}`);
        }
    };

    const formatDateSafely = (dateString, formatString) => {
        if (!dateString) return "Not available";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Invalid date";
        return format(date, formatString);
    };

    const getRowColorClass = (call) => {
        if (call.isDone) return "text-gray-500 line-through";
        if (call.isPast) return "text-gray-400";
        return call.source === "Enquiry" ? "text-green-600" : "text-blue-600";
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
                    No scheduled calls found.
                </div>
            ) : (
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
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {scheduledCalls.map((call, index) => (
                                <tr
                                    key={`${call.source}-${call.entityId}-${call.createdAt}-${index}`}
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
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                        <button
                                            onClick={() => toggleCallDoneStatus(call)}
                                            className={`text-sm ${call.isDone ? "text-red-600 hover:text-red-800" : "text-blue-600 hover:text-blue-800"}`}
                                        >
                                            {call.isDone ? "Mark as Not Done" : "Mark as Done"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TaskCallSchdule;