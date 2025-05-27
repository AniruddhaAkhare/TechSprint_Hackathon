import { useState, useEffect } from "react";
import React from "react";
import { useParams } from "react-router-dom";
import { getDocs, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../config/firebase.js";
import EditCourseNavbar from "./EditCourseNavbar.jsx";
import SearchBar from "../../../components/SearchBar.jsx";

export default function IndividualCourseStudnets() {
    const params = useParams();
    const { courseId } = useParams();
    
    const [allCurriculum, setAllCurriculum] = useState([]);
    const [selectedCurriculum, setSelectedCurriculum] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const CurriculumCollectionRef = collection(db, "curriculum");

    useEffect(() => {
        if (!courseId) return; // Early return if courseId is undefined

        const fetchCourseCurriculums = async () => {
            try {
                const courseRef = doc(db, "Course", courseId);
                const docSnap = await getDoc(courseRef);
                if (docSnap.exists()) {
                    const courseData = docSnap.data();
                    setSelectedCurriculum(courseData.curriculum || []);
                }
            } catch (error) {
            }
        };

        fetchCourseCurriculums();
    }, [courseId]);

    useEffect(() => {
        const fetchCourseCurriculums = async () => {
            try {
                const snapshot = await getDocs(CurriculumCollectionRef);
                const curriculumData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setAllCurriculum(curriculumData);
            } catch (error) {
            }
        };

        fetchCourseCurriculums();
    }, []); // Removed courseId from dependency array

    const handleCurriculumChange = (curriculumId) => {
        setSelectedCurriculum(prev =>
            prev.includes(curriculumId)
                ? prev.filter(id => id !== curriculumId)
                : [...prev, curriculumId]
        );
    };

    const handleSave = async () => {
        if (!courseId) {
            return;
        }

        if (!Array.isArray(selectedCurriculum)) {
            return;
        }

        try {
            const courseRef = doc(db, "Course", courseId);
            await updateDoc(courseRef, { curriculum: selectedCurriculum });
            alert("Curriculum updated successfully!");
        } catch (error) {
        }
    };

    return (
        <div className="flex-col w-screen ml-80 p-4">
            <div className="justify-between items-center p-4 mb-4">
                <EditCourseNavbar />
                <div className="flex-1">
                    <h1 className="text-2xl font-semibold">Curriculum</h1>
                </div>
            </div>

            <div className="justify-between items-center p-4 mt-4">
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>

            <h3 className="text-xl font-semibold mt-4">Assign Curriculum:</h3>
            <div className="grid grid-cols-2 gap-4">
                {allCurriculum.map(curriculum => (
                    <label key={curriculum.id} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={selectedCurriculum.includes(curriculum.id)}
                            onChange={() => handleCurriculumChange(curriculum.id)}
                        />
                        <span>{curriculum.name}</span>
                    </label>
                ))}
            </div>

            <div className="mt-4">
                <button
                    type="button"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                    onClick={handleSave}
                >
                    Save Curriculum
                </button>
            </div>
        </div>
    );
}

