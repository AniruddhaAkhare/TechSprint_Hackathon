import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDoc, doc, setDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase"; // Adjust path as needed
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Result = () => {
    const { studentId } = useParams(); // Get studentId from URL params
    const [enrollmentData, setEnrollmentData] = useState([]);
    const [courses, setCourses] = useState([]);
    const [results, setResults] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Fetch enrollment data
                const enrollmentDoc = await getDoc(doc(db, "enrollments", studentId));
                if (enrollmentDoc.exists() && enrollmentDoc.data().courses) {
                    const coursesData = enrollmentDoc.data().courses;

                    // Fetch course details
                    const coursePromises = coursesData.map(course =>
                        getDoc(doc(db, "Course", course.selectedCourse?.id || ""))
                    );
                    const courseDocs = await Promise.all(coursePromises);

                    const formattedEnrollments = coursesData.map((course, index) => {
                        const courseDoc = courseDocs[index];
                        const courseName = courseDoc.exists() ? courseDoc.data().name : "Course not found";
                        return {
                            ...course,
                            id: course.selectedCourse?.id || `course-${index}`,
                            name: courseName,
                        };
                    });

                    setEnrollmentData(formattedEnrollments);
                } else {
                    setError("No enrollments found for this student.");
                }

                // Fetch course list for reference
                const courseSnapshot = await getDocs(collection(db, "Course"));
                setCourses(courseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

                // Fetch existing results
                const resultSnapshot = await getDocs(collection(db, "Result"));
                const resultList = resultSnapshot.docs.map(doc => doc.data());
                const studentResults = resultList.reduce((acc, result) => {
                    if (result.studentId === studentId) {
                        acc[result.enrollmentId] = {
                            status: result.status || "ongoing",
                            marks: result.marks || "",
                            totalMarks: result.totalMarks || ""
                        };
                    }
                    return acc;
                }, {});
                setResults(studentResults);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error.message || "Failed to fetch data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [studentId]);

    const getCourseName = (courseId) => {
        const course = courses.find(c => c.id === courseId);
        return course ? course.name : "Unknown Course";
    };

    const handleResultChange = (enrollmentId, field, value) => {
        setResults(prev => ({
            ...prev,
            [enrollmentId]: {
                ...prev[enrollmentId] || { status: "ongoing", marks: "", totalMarks: "" },
                [field]: value
            }
        }));
    };

    const saveResult = async (enrollmentId) => {
        const resultData = results[enrollmentId] || { status: "ongoing", marks: "", totalMarks: "" };
        try {
            const resultRef = doc(db, "Result", `${studentId}_${enrollmentId}`);
            await setDoc(resultRef, {
                studentId,
                enrollmentId,
                courseId: enrollmentData.find(e => e.id === enrollmentId)?.selectedCourse?.id,
                courseName: getCourseName(enrollmentData.find(e => e.id === enrollmentId)?.selectedCourse?.id),
                status: resultData.status,
                marks: resultData.status === "certified" ? resultData.marks : "",
                totalMarks: resultData.status === "certified" ? resultData.totalMarks : "",
                updatedAt: new Date()
            }, { merge: true });
            toast.success("Result saved successfully!");
        } catch (error) {
            console.error("Error saving result:", error);
            toast.error("Failed to save result");
        }
    };

    if (isLoading) return <p className="text-gray-600 text-center py-10">Loading...</p>;
    if (error) return <p className="text-red-500 text-center py-10">{error}</p>;

    return (
        <div className="p-4">
            <ToastContainer position="top-right" autoClose={3000} />
            {/* <h2 className="text-2xl font-semibold text-gray-800 mb-6">Student Results</h2> */}

            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-3 text-sm font-medium text-gray-600 text-left min-w-[200px]">Course Name</th>
                            <th className="p-3 text-sm font-medium text-gray-600 text-left min-w-[150px]">Status</th>
                            <th className="p-3 text-sm font-medium text-gray-600 text-left min-w-[120px]">Marks</th>
                            <th className="p-3 text-sm font-medium text-gray-600 text-left min-w-[120px]">Total Marks</th>
                            <th className="p-3 text-sm font-medium text-gray-600 text-left min-w-[100px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enrollmentData.map(enrollment => (
                            <tr key={enrollment.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 text-gray-700">{enrollment.name}</td>
                                <td className="p-3">
                                    <select
                                        value={results[enrollment.id]?.status || "ongoing"}
                                        onChange={(e) => handleResultChange(enrollment.id, "status", e.target.value)}
                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="ongoing">Ongoing</option>
                                        <option value="deferred">Deferred</option>
                                        <option value="certified">Certified</option>
                                    </select>
                                </td>
                                <td className="p-3">
                                    {results[enrollment.id]?.status === "certified" ? (
                                        <input
                                            type="number"
                                            value={results[enrollment.id]?.marks || ""}
                                            onChange={(e) => handleResultChange(enrollment.id, "marks", e.target.value)}
                                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Marks"
                                        />
                                    ) : (
                                        <span className="text-gray-500">N/A</span>
                                    )}
                                </td>
                                <td className="p-3">
                                    {results[enrollment.id]?.status === "certified" ? (
                                        <input
                                            type="number"
                                            value={results[enrollment.id]?.totalMarks || ""}
                                            onChange={(e) => handleResultChange(enrollment.id, "totalMarks", e.target.value)}
                                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Total Marks"
                                        />
                                    ) : (
                                        <span className="text-gray-500">N/A</span>
                                    )}
                                </td>
                                <td className="p-3">
                                    <button
                                        onClick={() => saveResult(enrollment.id)}
                                        className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition duration-200"
                                    >
                                        Save
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Result;