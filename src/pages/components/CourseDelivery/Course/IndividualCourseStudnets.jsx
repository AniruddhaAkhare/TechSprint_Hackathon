import { useState, useEffect } from "react";
import React from "react";
import { useParams } from "react-router-dom";
import { getDocs, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../config/firebase.js";
import EditCourseNavbar from "./EditCourseNavbar.jsx";
import SearchBar from "../../../components/SearchBar.jsx";

export default function IndividualCourseStudnets() {
    const params = useParams();
    console.log("useParams:", params);
    const { courseId } = useParams();
    
    const [allStudents, setAllStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const StudentCollectionRef = collection(db, "student");

    useEffect(() => {
        if (!courseId) return; // Early return if courseId is undefined

        const fetchCourseStudents = async () => {
            try {
                const courseRef = doc(db, "Course", courseId);
                const docSnap = await getDoc(courseRef);
                if (docSnap.exists()) {
                    const courseData = docSnap.data();
                    setSelectedStudents(courseData.students || []);
                }
            } catch (error) {
                console.error("Error fetching course:", error);
            }
        };

        fetchCourseStudents();
    }, [courseId]);

    useEffect(() => {
        const fetchCourseStudents = async () => {
            try {
                const snapshot = await getDocs(StudentCollectionRef);
                const studentData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setAllStudents(studentData);
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        };

        fetchCourseStudents();
    }, []); // Removed courseId from dependency array

    const handleStudentChange = (studentId) => {
        setSelectedStudents(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleSave = async () => {
        if (!courseId) {
            console.error("Error: courseId is undefined.");
            return;
        }

        if (!Array.isArray(selectedStudents)) {
            console.error("Error: selected students is not an array.", selectedStudents);
            return;
        }

        try {
            const courseRef = doc(db, "Course", courseId);
            await updateDoc(courseRef, { students: selectedStudents });
            alert("Students updated successfully!");
        } catch (error) {
            console.error("Error updating course:", error);
        }
    };

    return (
        <div className="flex-col w-screen ml-80 p-4">
            <div className="justify-between items-center p-4 mb-4">
                <EditCourseNavbar />
                <div className="flex-1">
                    <h1 className="text-2xl font-semibold">Students</h1>
                </div>
            </div>

            <div className="justify-between items-center p-4 mt-4">
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>

            <h3 className="text-xl font-semibold mt-4">Assign Students:</h3>
            <div className="grid grid-cols-2 gap-4">
                {allStudents.map(student => (
                    <label key={student.id} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={selectedStudents.includes(student.id)}
                            onChange={() => handleStudentChange(student.id)}
                        />
                        <span>{student.first_name}</span>
                    </label>
                ))}
            </div>

            <div className="mt-4">
                <button
                    type="button"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                    onClick={handleSave}
                >
                    Save Students
                </button>
            </div>
        </div>
    );
}

