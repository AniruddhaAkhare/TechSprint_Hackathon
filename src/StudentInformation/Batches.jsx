import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
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
        if (!user) {
            toast.error("Please log in to view batches");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                await Promise.all([
                    fetchBatches(),
                    fetchCenters(),
                    fetchCourses(),
                    fetchInstructors(),
                    fetchCurriculum(),
                ]);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to load data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [studentId, user]);

    const getInstituteId = async () => {
        if (!user) return null;
        try {
            const userDocRef = doc(db, "Users", user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                return userDoc.data().instituteId || null;
            }
            return null;
        } catch (error) {
            console.error("Error fetching instituteId:", error);
            toast.error("Failed to fetch institute information");
            return null;
        }
    };

    const fetchBatches = async () => {
        try {
            const snapshot = await getDocs(collection(db, "Batch"));
            const batchList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const studentBatches = batchList.filter(batch =>
                batch.students && batch.students.includes(studentId)
            );
            setBatches(studentBatches);

            // Fetch assessments for each student batch
            const assessmentsData = {};
            for (const batch of studentBatches) {
                const assessmentsSnapshot = await getDocs(
                    collection(db, `Batch/${batch.id}/assessments`)
                );
                assessmentsData[batch.id] = assessmentsSnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(assessment => assessment.studentId === studentId);
            }
            setAssessments(assessmentsData);
        } catch (error) {
            console.error("Error fetching batches or assessments:", error);
            toast.error("Failed to fetch batches or assessments");
        }
    };

    const fetchCenters = async () => {
        try {
            const instituteId = "9z6G6BLzfDScI0mzMOlB"; // Or use: await getInstituteId();
            if (!instituteId) {
                throw new Error("No institute ID found for the user");
            }
            const snapshot = await getDocs(
                collection(db, `instituteSetup/${instituteId}/Centers`)
            );
            setCenters(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching centers:", error);
            toast.error("Failed to fetch centers");
        }
    };

    const fetchCourses = async () => {
        try {
            const snapshot = await getDocs(collection(db, "Course"));
            setCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching courses:", error);
            toast.error("Failed to fetch courses");
        }
    };

    const fetchInstructors = async () => {
        try {
            const snapshot = await getDocs(collection(db, "Instructor"));
            setInstructors(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching instructors:", error);
            toast.error("Failed to fetch instructors");
        }
    };

    const fetchCurriculum = async () => {
        try {
            const snapshot = await getDocs(collection(db, "curriculums"));
            setCurriculum(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching curriculum:", error);
            toast.error("Failed to fetch curriculum");
        }
    };

    const getNameFromId = (id, collection) => {
        const item = collection.find(item => item.id === id);
        return item ? item.name || item.f_name || "Unknown" : "Unknown";
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
            <ToastContainer position="top-right" autoClose={3000} />
            {/* <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Batches</h2> */}

            {batches.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-4 text-center">
                    <p className="text-gray-600">You are not enrolled in any batches.</p>
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
                                        role="button"
                                        aria-expanded={expandedBatch === batch.id}
                                        aria-controls={`accordion-${batch.id}`}
                                    >
                                        <td className="p-3 text-gray-700">{batch.batchName || "Unnamed Batch"}</td>
                                        <td className="p-3 text-gray-700">{batch.startDate || "N/A"}</td>
                                        <td className="p-3 text-gray-700">{batch.endDate || "N/A"}</td>
                                        <td className="p-3 text-gray-700">{batch.status || "Unknown"}</td>
                                    </tr>
                                    {expandedBatch === batch.id && (
                                        <tr>
                                            <td colSpan="4" className="p-4 bg-gray-50">
                                                <div className="space-y-4">
                                                    {/* Batch Details */}
                                                    <div>
                                                        <h3 className="text-lg font-medium text-gray-700">Batch Information</h3>
                                                        <p><strong>Centers:</strong> {batch.centers?.map(id => getNameFromId(id, centers)).join(", ") || "N/A"}</p>
                                                        <p><strong>Courses:</strong> {batch.courses?.map(id => getNameFromId(id, courses)).join(", ") || "N/A"}</p>
                                                        <p><strong>Curriculum:</strong> {batch.curriculum?.map(id => getNameFromId(id, curriculum)).join(", ") || "N/A"}</p>
                                                        <p><strong>Batch Manager:</strong> {batch.batchManager?.map(id => getNameFromId(id, instructors)).join(", ") || "N/A"}</p>
                                                        <p><strong>Batch Faculty:</strong> {batch.batchFaculty?.map(id => getNameFromId(id, instructors)).join(", ") || "N/A"}</p>
                                                        <p><strong>Created At:</strong> {batch.createdAt?.toDate().toLocaleString() || "N/A"}</p>
                                                    </div>

                                                    {/* Assessment Section */}
                                                    <div>
                                                        <h3 className="text-lg font-medium text-gray-700 mb-2">Assessments</h3>
                                                        {assessments[batch.id]?.length === 0 ? (
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
                                                                            <td className="p-2">
                                                                                <input
                                                                                    type="number"
                                                                                    value={assessment.marksObtained}
                                                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                                                                    readOnly
                                                                                />
                                                                            </td>
                                                                            <td className="p-2">
                                                                                <input
                                                                                    type="number"
                                                                                    value={assessment.totalMarks}
                                                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                                                                    readOnly
                                                                                />
                                                                            </td>
                                                                            <td className="p-2">
                                                                                <input
                                                                                    type="date"
                                                                                    value={assessment.date}
                                                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                                                                    readOnly
                                                                                />
                                                                            </td>
                                                                            <td className="p-2">
                                                                                <input
                                                                                    type="text"
                                                                                    value={assessment.type}
                                                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                                                                    readOnly
                                                                                />
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