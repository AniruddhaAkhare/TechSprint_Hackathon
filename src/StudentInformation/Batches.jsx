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

    useEffect(() => {
        console.log("Student ID from useParams:", studentId);
        console.log("User:", user);

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
                const instituteId = "9z6G6BLzfDScI0mzMOlB";
                console.log("Institute ID:", instituteId);
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
                console.error("Error fetching data:", error);
                toast.error(`Failed to load data: ${error.message}`, { toastId: "data-error" });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [studentId, user]);

    const getInstituteId = async () => {
        if (!user || !user.uid) {
            console.error("No user or user UID available");
            toast.error("User not authenticated", { toastId: "user-auth-error" });
            return null;
        }
        try {
            const userDocRef = doc(db, "Users", user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const instituteId = userDoc.data().instituteId;
                console.log("Fetched instituteId:", instituteId);
                return instituteId || null;
            }
            console.error("User document does not exist");
            toast.error("User profile not found", { toastId: "user-profile-error" });
            return null;
        } catch (error) {
            console.error("Error fetching instituteId:", error);
            toast.error("Failed to fetch institute information", { toastId: "institute-error" });
            return null;
        }
    };

    const fetchBatches = async (instituteId) => {
        try {
            console.log("Fetching enrollments for studentId:", studentId);
            // Step 1: Query enrollments to get the student's enrolled courses
            const enrollmentsQuery = query(
                collection(db, "enrollments"),
                where("studentId", "==", studentId) // Assuming enrollments has a studentId field
            );
            const enrollmentsSnapshot = await getDocs(enrollmentsQuery);
            console.log("Enrollments snapshot size:", enrollmentsSnapshot.size);
            const enrolledCourseIds = [];
            enrollmentsSnapshot.forEach(doc => {
                const enrollment = doc.data();
                if (enrollment.courses && Array.isArray(enrollment.courses)) {
                    enrollment.courses.forEach(course => {
                        if (course.selectedCourse && course.selectedCourse.id) {
                            enrolledCourseIds.push(course.selectedCourse.id);
                        }
                    });
                }
            });
            console.log("Enrolled course IDs:", enrolledCourseIds);

            // Step 2: Fetch batches that include any of the enrolled courses or have the student in the students array
            const batchSnapshot = await getDocs(collection(db, "Batch"));
            const batchList = batchSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log("All batches:", batchList);
            const studentBatches = batchList.filter(batch =>
                (batch.students && batch.students.includes(studentId)) ||
                (batch.courses && batch.courses.some(courseId => enrolledCourseIds.includes(courseId)))
            );
            console.log("Filtered student batches:", studentBatches);
            setBatches(studentBatches);

            // Step 3: Fetch assessments for each student batch
            const assessmentsData = {};
            for (const batch of studentBatches) {
                console.log(`Fetching assessments for batch: ${batch.id}`);
                const assessmentsQuery = query(
                    collection(db, `Batch/${batch.id}/assessments`),
                    where("studentId", "==", studentId)
                );
                const assessmentsSnapshot = await getDocs(assessmentsQuery);
                console.log(`Assessments for batch ${batch.id}:`, assessmentsSnapshot.size);
                assessmentsData[batch.id] = assessmentsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
            }
            console.log("Fetched assessments:", assessmentsData);
            setAssessments(assessmentsData);
        } catch (error) {
            console.error("Error fetching batches or assessments:", error);
            toast.error(`Failed to fetch batches or assessments: ${error.message}`, { toastId: "batches-error" });
        }
    };

    const fetchCenters = async (instituteId) => {
        try {
            console.log("Fetching centers for instituteId:", instituteId);
            const snapshot = await getDocs(
                collection(db, `instituteSetup/${instituteId}/Center`) // Fixed to match CreateBatch.jsx
            );
            const centersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log("Fetched centers:", centersList);
            setCenters(centersList);
        } catch (error) {
            console.error("Error fetching centers:", error);
            toast.error("Failed to fetch centers", { toastId: "centers-error" });
        }
    };

    const fetchCourses = async () => {
        try {
            console.log("Fetching courses");
            const snapshot = await getDocs(collection(db, "Course"));
            const coursesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log("Fetched courses:", coursesList);
            setCourses(coursesList);
        } catch (error) {
            console.error("Error fetching courses:", error);
            toast.error("Failed to fetch courses", { toastId: "courses-error" });
        }
    };

    const fetchInstructors = async () => {
        try {
            console.log("Fetching instructors");
            const snapshot = await getDocs(collection(db, "Instructor"));
            const instructorsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log("Fetched instructors:", instructorsList);
            setInstructors(instructorsList);
        } catch (error) {
            console.error("Error fetching instructors:", error);
            toast.error("Failed to fetch instructors", { toastId: "instructors-error" });
        }
    };

    const fetchCurriculum = async () => {
        try {
            console.log("Fetching curriculum");
            const snapshot = await getDocs(collection(db, "curriculums"));
            const curriculumList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log("Fetched curriculum:", curriculumList);
            setCurriculum(curriculumList);
        } catch (error) {
            console.error("Error fetching curriculum:", error);
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
            {/* <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Batches</h2> */}

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