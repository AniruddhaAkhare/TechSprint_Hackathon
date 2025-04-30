import { useState, useEffect } from "react";
import React from "react";
import { useParams } from "react-router-dom";
import { getDocs, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from '../../../../config/firebase.jsx'
import EditCourseNavbar from "./EditCourseNavbar.jsx";
import SearchBar from "../../../components/SearchBar.jsx";

export default function IndividualCourseBatch() {
    const params = useParams();
    console.log("useParams:", params);
    const { courseId } = useParams();
    // State for batches
    const [allBatches, setAllBatches] = useState([]);
    const [selectedBatches, setSelectedBatches] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const BatchCollectionRef = collection(db, "Batch");

    useEffect(() => {
        if (!courseId) return; // Early return if courseId is undefined

        const fetchCourseBatches = async () => {
            try {
                const courseRef = doc(db, "Course", courseId);
                const docSnap = await getDoc(courseRef);
                if (docSnap.exists()) {
                    const courseData = docSnap.data();
                    setSelectedBatches(courseData.batches || []);
                }
            } catch (error) {
                console.error("Error fetching course:", error);
            }
        };

        fetchCourseBatches();
    }, [courseId]);

    useEffect(() => {
        const fetchBatches = async () => {
            try {
                const snapshot = await getDocs(BatchCollectionRef);
                const batchData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setAllBatches(batchData);
            } catch (error) {
                console.error("Error fetching batches:", error);
            }
        };

        fetchBatches();
    }, []); // Removed courseId from dependency array

    const handleBatchChange = (batchId) => {
        setSelectedBatches(prev =>
            prev.includes(batchId)
                ? prev.filter(id => id !== batchId)
                : [...prev, batchId]
        );
    };

    const handleSave = async () => {
        if (!courseId) {
            console.error("Error: courseId is undefined.");
            return;
        }

        if (!Array.isArray(selectedBatches)) {
            console.error("Error: selectedBatches is not an array.", selectedBatches);
            return;
        }

        try {
            const courseRef = doc(db, "Course", courseId);
            await updateDoc(courseRef, { batches: selectedBatches });
            alert("Batches updated successfully!");
        } catch (error) {
            console.error("Error updating course:", error);
        }
    };

    return (
        <div className="flex-col w-screen ml-80 p-4">
            <div className="justify-between items-center p-4 mb-4">
                <EditCourseNavbar />
                <div className="flex-1">
                    <h1 className="text-2xl font-semibold">Batches</h1>
                </div>
            </div>

            <div className="justify-between items-center p-4 mt-4">
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>

            <h3 className="text-xl font-semibold mt-4">Assign Batches:</h3>
            <div className="grid grid-cols-2 gap-4">
                {allBatches.map(batch => (
                    <label key={batch.id} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={selectedBatches.includes(batch.id)}
                            onChange={() => handleBatchChange(batch.id)}
                        />
                        <span>{batch.name}</span>
                    </label>
                ))}
            </div>

            <div className="mt-4">
                <button
                    type="button"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                    onClick={handleSave}
                >
                    Save Batches
                </button>
            </div>
        </div>
    );
}

