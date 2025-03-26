import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Batches = () => {
    const { studentId } = useParams();
    const [batches, setBatches] = useState([]);
    const [centers, setCenters] = useState([]);
    const [courses, setCourses] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [curriculum, setCurriculum] = useState([]);
    const [expandedBatch, setExpandedBatch] = useState(null);

    // Sample assessment data (you might want to fetch this from Firestore too)
    const [assessments, setAssessments] = useState({
        "batchId1": [
            { id: "1", marksObtained: 85, totalMarks: 100, date: "2025-04-01", type: "module exam" },
            { id: "2", marksObtained: 45, totalMarks: 50, date: "2025-04-05", type: "quiz" },
        ],
        // Add more batch-specific assessments as needed
    });

    useEffect(() => {
        fetchBatches();
        fetchCenters();
        fetchCourses();
        fetchInstructors();
        fetchCurriculum();
    }, [studentId]);

    const fetchBatches = async () => {
        try {
            const snapshot = await getDocs(collection(db, "Batch"));
            const batchList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const studentBatches = batchList.filter(batch =>
                batch.students && batch.students.includes(studentId)
            );
            setBatches(studentBatches);
        } catch (error) {
            console.error("Error fetching batches:", error);
            toast.error("Failed to fetch batches");
        }
    };

    const fetchCenters = async () => {
        const snapshot = await getDocs(collection(db, "Centers"));
        setCenters(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const fetchCourses = async () => {
        const snapshot = await getDocs(collection(db, "Course"));
        setCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const fetchInstructors = async () => {
        const snapshot = await getDocs(collection(db, "Instructor"));
        setInstructors(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const fetchCurriculum = async () => {
        const snapshot = await getDocs(collection(db, "curriculum"));
        setCurriculum(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const getNameFromId = (id, collection) => {
        const item = collection.find(item => item.id === id);
        return item ? item.name || item.f_name || "Unknown" : "Unknown";
    };

    const toggleAccordion = (batchId) => {
        setExpandedBatch(expandedBatch === batchId ? null : batchId);
    };

    const handleAssessmentChange = (batchId, assessmentId, field, value) => {
        setAssessments(prev => ({
            ...prev,
            [batchId]: prev[batchId].map(assessment =>
                assessment.id === assessmentId ? { ...assessment, [field]: value } : assessment
            )
        }));
    };

    return (
        <div className="p-4">
            <ToastContainer position="top-right" autoClose={3000} />
            {/* <h2 className="text-2xl font-semibold text-gray-800 mb-6">Batch Details</h2> */}

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
                            <React.Fragment key={batch.id}>
                                <tr
                                    className="border-b hover:bg-gray-50 cursor-pointer hover:text-blue-500 transition-colors duration-200"
                                    onClick={() => toggleAccordion(batch.id)}
                                    role="button"
                                    aria-expanded={expandedBatch === batch.id}
                                    aria-controls={`accordion-${batch.id}`}
                                >
                                    <td className="p-3 text-gray-700">{batch.batchName}</td>
                                    <td className="p-3 text-gray-700">{batch.startDate}</td>
                                    <td className="p-3 text-gray-700">{batch.endDate}</td>
                                    <td className="p-3 text-gray-700">{batch.status}</td>
                                </tr>
                                {expandedBatch === batch.id && (
                                    <tr>
                                        <td colSpan="4" className="p-4 bg-gray-50">
                                            <div className="space-y-4">
                                                {/* Batch Details */}
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-700">Batch Information</h3>
                                                    <p><strong>Centers:</strong> {batch.centers.map(id => getNameFromId(id, centers)).join(", ")}</p>
                                                    <p><strong>Courses:</strong> {batch.courses.map(id => getNameFromId(id, courses)).join(", ")}</p>
                                                    <p><strong>Curriculum:</strong> {batch.curriculum.map(id => getNameFromId(id, curriculum)).join(", ")}</p>
                                                    <p><strong>Batch Manager:</strong> {batch.batchManager.map(id => getNameFromId(id, instructors)).join(", ")}</p>
                                                    <p><strong>Batch Faculty:</strong> {batch.batchFaculty.map(id => getNameFromId(id, instructors)).join(", ")}</p>
                                                    <p><strong>Created At:</strong> {batch.createdAt.toDate().toLocaleString()}</p>
                                                </div>

                                                {/* Assessment Section */}
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-700 mb-2">Assessments</h3>
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
                                                                            onChange={(e) => handleAssessmentChange(batch.id, assessment.id, "marksObtained", e.target.value)}
                                                                            className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                                                        />
                                                                    </td>
                                                                    <td className="p-2">
                                                                        <input
                                                                            type="number"
                                                                            value={assessment.totalMarks}
                                                                            onChange={(e) => handleAssessmentChange(batch.id, assessment.id, "totalMarks", e.target.value)}
                                                                            className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                                                        />
                                                                    </td>
                                                                    <td className="p-2">
                                                                        <input
                                                                            type="date"
                                                                            value={assessment.date}
                                                                            onChange={(e) => handleAssessmentChange(batch.id, assessment.id, "date", e.target.value)}
                                                                            className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                                                        />
                                                                    </td>
                                                                    <td className="p-2">
                                                                        <select
                                                                            value={assessment.type}
                                                                            onChange={(e) => handleAssessmentChange(batch.id, assessment.id, "type", e.target.value)}
                                                                            className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                                                        >
                                                                            <option value="module exam">Module Exam</option>
                                                                            <option value="quiz">Quiz</option>
                                                                            <option value="assignment">Assignment</option>
                                                                        </select>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Batches;