
import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";

const CurriculumDetails = () => {
    const { curriculumId } = useParams();
    const [sections, setSections] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSections = async () => {
            const sectionsSnapshot = await getDocs(collection(db, `curriculum/${curriculumId}/sections`));
            const sectionsList = sectionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSections(sectionsList);
        };
        fetchSections();
    }, [curriculumId]);

    return (
        <div className="flex flex-col w-full p-4 sm:p-6 md:ml-80">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <h2 className="text-xl sm:text-2xl font-bold">Sections</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-200"
                >
                    ← Back
                </button>
            </div>

            {/* Sections List */}
            <ul className="space-y-4">
                {sections.length > 0 ? (
                    sections.map(section => (
                        <li
                            key={section.id}
                            className="border-b py-2 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                        >
                            <div className="text-sm sm:text-base">
                                <div className="font-medium">{section.name}</div>
                                <div className="text-gray-600">
                                    Total Watch Time: {section.totalWatchTime || 0} seconds
                                </div>
                                <div className="text-gray-600">
                                    View Duration: {section.viewDuration || "N/A"}
                                </div>
                            </div>
                            <button
                                onClick={() => navigate(`/curriculum/${curriculumId}/section/${section.id}/add-material`)}
                                className="w-full sm:w-auto px-3 py-1 text-blue-500 border border-blue-500 rounded-md hover:bg-blue-50 hover:text-blue-600 transition duration-200 text-sm sm:text-base"
                            >
                                Add Material
                            </button>
                        </li>
                    ))
                ) : (
                    <li className="text-gray-500 text-sm sm:text-base">No sections available.</li>
                )}
            </ul>
        </div>
    );
};

export default CurriculumDetails;