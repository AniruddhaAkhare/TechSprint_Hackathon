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
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">Sections</h2>
            <button onClick={() => navigate(-1)} className="mb-4 px-4 py-2 bg-gray-300 rounded text-gray-700 hover:bg-gray-400">
                &larr; Back
            </button>
            <ul>
                {sections.map(section => (
                    <li key={section.id} className="border-b py-2">
                        <div>{section.name}</div>
                        <div>Total Watch Time: {section.totalWatchTime} seconds</div>
                        <div>View Duration: {section.viewDuration}</div>
                        <button className="ml-2 text-blue-500 hover:underline">Add Material</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CurriculumDetails;
