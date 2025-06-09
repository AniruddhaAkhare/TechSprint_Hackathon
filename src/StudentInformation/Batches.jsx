import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";

const Batches = () => {
    const { studentId } = useParams();
    const { user } = useAuth();
    const [batches, setBatches] = useState([]);
    const [centers, setCenters] = useState([]);
    const [courses, setCourses] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [curriculum, setCurriculum] = useState([]);
    const [assessments, setAssessments] = useState({});
    const [expandedBatch, setExpandedBatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [instituteId, setInstituteId] = useState();


    

    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                return;
            }

            try {
                // Fetch user data and institute ID
                const userDocRef = doc(db, 'Users', user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const data = userDoc.data();
                    const institute = "RDJ9wMXGrIUk221MzDxP";
                    if (institute) {
                        setInstituteId(institute);
                    } else {
                        toast.error("Institute ID not found in user document", { toastId: "institute-error" });
                    }
                } else {
                    toast.error("User data not found", { toastId: "user-error" });
                }
            } catch (err) {
                toast.error(`Failed to fetch data: ${err.message}`, { toastId: "data-error" });
            }
        };

        fetchData();
    }, [user]);

    useEffect(() => {
        if (!user) {
            toast.error("Please log in to view batches", { toastId: "auth-error" });
            setLoading(false);
            return;
        }

        if (!studentId) {
            toast.error("Invalid student ID", { toastId: "student-id-error" });
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                if (!instituteId) {
                    throw new Error("No institute ID found for the user");
                }
                await Promise.all([
                    fetchBatches(instituteId),
                    fetchCenters(instituteId),
                    fetchCourses(),
                    fetchInstructors(),
                    fetchCurriculum(),
                ]);
            } catch (error) {
                toast.error(`Failed to load data: ${error.message}`, { toastId: "data-error" });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [studentId, user, instituteId]);

    const getInstituteId = async () => {
        if (!user || !user.uid) {
            toast.error("User not authenticated", { toastId: "user-auth-error" });
            return null;
        }
        try {
            const userDocRef = doc(db, "Users", user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const instituteId = userDoc.data().instituteId;
                return instituteId || null;
            }
            toast.error("User profile not found", { toastId: "user-profile-error" });
            return null;
        } catch (error) {
            toast.error("Failed to fetch institute information", { toastId: "institute-error" });
            return null;
        }
    };

    const fetchBatches = async (instituteId) => {
        try {
            // Fetch batches where the studentId is in the students array
            const batchSnapshot = await getDocs(collection(db, "Batch"));
            const batchList = batchSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const studentBatches = batchList.filter(batch =>
                batch.students && batch.students.includes(studentId)
            );
            setBatches(studentBatches);

            // Fetch assessments for each student batch
            const assessmentsData = {};
            for (const batch of studentBatches) {
                const assessmentsQuery = query(
                    collection(db, `Batch/${batch.id}/assessments`),
                    where("studentId", "==", studentId)
                );
                const assessmentsSnapshot = await getDocs(assessmentsQuery);
                assessmentsData[batch.id] = assessmentsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
            }
            setAssessments(assessmentsData);
        } catch (error) {
            toast.error(`Failed to fetch batches or assessments: ${error.message}`, { toastId: "batches-error" });
        }
    };

    const fetchCenters = async (instituteId) => {
        try {
            const snapshot = await getDocs(
                collection(db, `instituteSetup/${instituteId}/Center`)
            );
            const centersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCenters(centersList);
        } catch (error) {
            toast.error("Failed to fetch centers", { toastId: "centers-error" });
        }
    };

    const fetchCourses = async () => {
        try {
            const snapshot = await getDocs(collection(db, "Course"));
            const coursesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCourses(coursesList);
        } catch (error) {
            toast.error("Failed to fetch courses", { toastId: "courses-error" });
        }
    };

    const fetchInstructors = async () => {
        try {
            const snapshot = await getDocs(collection(db, "Users"));
            const instructorsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setInstructors(instructorsList);
        } catch (error) {
            toast.error("Failed to fetch instructors", { toastId: "instructors-error" });
        }
    };

    const fetchCurriculum = async () => {
        try {
            const snapshot = await getDocs(collection(db, "curriculums"));
            const curriculumList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCurriculum(curriculumList);
        } catch (error) {
            toast.error("Failed to fetch curriculum", { toastId: "curriculum-error" });
        }
    };

    const getNameFromId = (id, collection) => {
        if (!id || !collection) return "Unknown";
        const item = collection.find(item => item.id === id);
        return item ? item.name || item.f_name || item.firstName || "Unknown" : "Unknown";
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return "N/A";
        try {
            const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } catch (error) {
            console.warn("Error formatting date:", error);
            return "Invalid Date";
        }
    };

    const formatInputDate = (timestamp) => {
        if (!timestamp) return "";
        try {
            const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
            return date.toISOString().split("T")[0];
        } catch (error) {
            console.warn("Error formatting input date:", error);
            return "";
        }
    };

    const toggleAccordion = (batchId) => {
        setExpandedBatch(expandedBatch === batchId ? null : batchId);
    };

    if (!user) {
        return (
            <div className="p-4 text-center">
                <p className="text-red-600">Please log in to view your batches.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="p-4 text-center">
                <p className="text-gray-600">Loading batches...</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <ToastContainer position="top-right" autoClose={3000} limit={3} />
            {batches.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-4 text-center">
                    <p className="text-gray-600">You are not enrolled in any batches. (Student ID: {studentId})</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-3 text-sm font-medium text-gray-600 text-left">Batch Name</th>
                                <th className="p-3 text-sm font-medium text-gray-600 text-left">Start Date</th>
                                <th className="p-3 text-sm font-medium text-gray-600 text-left">End Date</th>
                                <th className="p-3 text-sm font-medium text-gray-600 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {batches.map(batch => (
                                <Fragment key={batch.id}>
                                    <tr
                                        className="border-b hover:bg-gray-50 cursor-pointer hover:text-blue-500 transition-colors duration-200"
                                        onClick={() => toggleAccordion(batch.id)}
                                        onKeyDown={(e) => e.key === "Enter" && toggleAccordion(batch.id)}
                                        role="button"
                                        tabIndex={0}
                                        aria-expanded={expandedBatch === batch.id}
                                        aria-controls={`accordion-${batch.id}`}
                                        aria-label={`Toggle details for ${batch.batchName || "Unnamed Batch"}`}
                                    >
                                        <td className="p-3 text-gray-700">{batch.batchName || "Unnamed Batch"}</td>
                                        <td className="p-3 text-gray-700">{formatDate(batch.startDate)}</td>
                                        <td className="p-3 text-gray-700">{formatDate(batch.endDate)}</td>
                                        <td className="p-3 text-gray-700">{batch.status || "Unknown"}</td>
                                    </tr>
                                    {expandedBatch === batch.id && (
                                        <tr id={`accordion-${batch.id}`}>
                                            <td colSpan="4" className="p-4 bg-gray-50">
                                                <div className="space-y-4">
                                                    {/* Batch Details */}
                                                    <div>
                                                        <h3 className="text-lg font-medium text-gray-700">Batch Information</h3>
                                                        <p><strong>Centers:</strong> {(batch.centers || []).map(id => getNameFromId(id, centers)).join(", ") || "N/A"}</p>
                                                        <p><strong>Courses:</strong> {(batch.courses || []).map(id => getNameFromId(id, courses)).join(", ") || "N/A"}</p>
                                                        <p><strong>Curriculum:</strong> {(batch.curriculum || []).map(id => getNameFromId(id, curriculum)).join(", ") || "N/A"}</p>
                                                        <p><strong>Batch Manager:</strong> {(batch.batchManager || []).map(id => getNameFromId(id, instructors)).join(", ") || "N/A"}</p>
                                                        <p><strong>Batch Faculty:</strong> {(batch.batchFaculty || []).map(id => getNameFromId(id, instructors)).join(", ") || "N/A"}</p>
                                                        <p><strong>Created At:</strong> {formatDate(batch.createdAt)}</p>
                                                    </div>

                                                    {/* Assessment Section */}
                                                    <div>
                                                        <h3 className="text-lg font-medium text-gray-700 mb-2">Assessments</h3>
                                                        {!(assessments[batch.id]?.length > 0) ? (
                                                            <p className="text-gray-600">No assessments available for this batch.</p>
                                                        ) : (
                                                            <table className="w-full border-collapse">
                                                                <thead>
                                                                    <tr className="bg-gray-200">
                                                                        <th className="p-2 text-sm font-medium text-gray-600 text-left">Marks Obtained</th>
                                                                        <th className="p-2 text-sm font-medium text-gray-600 text-left">Total Marks</th>
                                                                        <th className="p-2 text-sm font-medium text-gray-600 text-left">Date</th>
                                                                        <th className="p-2 text-sm font-medium text-gray-600 text-left">Type</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {(assessments[batch.id] || []).map(assessment => (
                                                                        <tr key={assessment.id} className="border-b">
                                                                            <td className="p-2 text-gray-700">
                                                                                <span>{assessment.marksObtained ?? "N/A"}</span>
                                                                            </td>
                                                                            <td className="p-2 text-gray-700">
                                                                                <span>{assessment.totalMarks ?? "N/A"}</span>
                                                                            </td>
                                                                            <td className="p-2 text-gray-700">
                                                                                <span>{formatDate(assessment.date)}</span>
                                                                            </td>
                                                                            <td className="p-2 text-gray-700">
                                                                                <span>{assessment.type || "N/A"}</span>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Batches;