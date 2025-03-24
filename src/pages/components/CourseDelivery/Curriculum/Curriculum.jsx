

// import React, { useState, useEffect, useRef } from "react";
// import { db, storage } from "../../../../config/firebase";
// import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, arrayUnion } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { useNavigate } from "react-router-dom";
// import SearchBar from "../../SearchBar";
// import CreateCurriculum from "./CreateCurriculum";
// import AddMCQModal from "./AddMCQModal.jsx";
// import ParentComponent from './ParentComponent.jsx';

// const Curriculum = () => {
//     const [curriculums, setCurriculums] = useState([]);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedCurriculumId, setSelectedCurriculumId] = useState(null);
//     const [selectedSection, setSelectedSection] = useState(null);
//     const [sectionOptionsOpen, setSectionOptionsOpen] = useState(false);
//     const fileInputRef = useRef(null);
//     const [isMCQModalOpen, setIsMCQModalOpen] = useState(false);
//     const navigate = useNavigate();

//     useEffect(() => {
//         fetchCurriculums();
//     }, []);

//     const fetchCurriculums = async () => {
//         try {
//             const snapshot = await getDocs(collection(db, "curriculum"));
//             const curriculumData = await Promise.all(
//                 snapshot.docs.map(async (doc) => {
//                     const data = doc.data();
//                     const sectionsSnapshot = await getDocs(collection(db, "curriculum", doc.id, "sections"));
//                     return { id: doc.id, name: data.name, sectionCount: sectionsSnapshot.size };
//                 })
//             );
//             setCurriculums(curriculumData);
//         } catch (error) {
//             console.error("Error fetching curriculums:", error);
//         }
//     };

//     const handleDelete = async (curriculumId) => {
//         const confirmDelete = window.confirm("Are you sure you want to delete this curriculum?");
//         if (!confirmDelete) return;

//         try {
//             await deleteDoc(doc(db, "curriculum", curriculumId));
//             fetchCurriculums();
//             alert("Curriculum deleted successfully!");
//         } catch (error) {
//             console.error("Error deleting curriculum:", error);
//         }
//     };

//     const handleAddCurriculum = async (curriculumData) => {
//         try {
//             await addDoc(collection(db, "curriculum"), curriculumData);
//             fetchCurriculums();
//             setIsModalOpen(false);
//         } catch (error) {
//             console.error("Error adding curriculum:", error);
//         }
//     };

//     return (
//         <div className="flex-col w-screen ml-80 p-4">
//             <h1 className="text-2xl font-semibold">Curriculum</h1>
//             <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-blue-500 text-white rounded">
//                 + Add Curriculum
//             </button>
//             <SearchBar />

//             <table className="mt-4 w-full border-collapse border border-gray-300">
//                 <thead>
//                     <tr className="bg-gray-100">
//                         <th className="border border-gray-300 px-4 py-2">Curriculum Name</th>
//                         <th className="border border-gray-300 px-4 py-2">Section Count</th>
//                         <th className="border border-gray-300 px-4 py-2">Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {curriculums.map(curriculum => (
//                         <tr key={curriculum.id} className="border border-gray-300">
//                             <td className="border border-gray-300 px-4 py-2">{curriculum.name}</td>
//                             <td className="border border-gray-300 px-4 py-2 text-center">{curriculum.sectionCount}</td>
//                             <td className="border border-gray-300 px-4 py-2 flex space-x-2">
//                                 <button
//                                     onClick={() => navigate(`/curriculum/${curriculum.id}`)} // Fixed navigation
//                                     className="bg-blue-500 text-white px-2 py-1 rounded"
//                                 >
//                                     Edit
//                                 </button>
//                                 <button
//                                     onClick={() => handleDelete(curriculum.id)}
//                                     className="bg-red-500 text-white px-2 py-1 rounded"
//                                 >
//                                     Delete
//                                 </button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>

//             <CreateCurriculum 
//                 isOpen={isModalOpen} 
//                 onClose={() => setIsModalOpen(false)} 
//                 onSubmit={handleAddCurriculum} 
//             />
//         </div>
//     );
// };

// export default Curriculum;

import React, { useState, useEffect, useRef } from "react";
import { db, storage } from "../../../../config/firebase";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, arrayUnion } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../SearchBar";
import CreateCurriculum from "./CreateCurriculum";
import AddMCQModal from "./AddMCQModal.jsx";
import ParentComponent from './ParentComponent.jsx';

const Curriculum = () => {
    const [curriculums, setCurriculums] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCurriculumId, setSelectedCurriculumId] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [sectionOptionsOpen, setSectionOptionsOpen] = useState(false);
    const fileInputRef = useRef(null);
    const [isMCQModalOpen, setIsMCQModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCurriculums();
    }, []);

    const fetchCurriculums = async () => {
        try {
            const snapshot = await getDocs(collection(db, "curriculum"));
            const curriculumData = await Promise.all(
                snapshot.docs.map(async (doc) => {
                    const data = doc.data();
                    const sectionsSnapshot = await getDocs(collection(db, "curriculum", doc.id, "sections"));
                    return { id: doc.id, name: data.name, sectionCount: sectionsSnapshot.size };
                })
            );
            setCurriculums(curriculumData);
        } catch (error) {
            console.error("Error fetching curriculums:", error);
        }
    };

    const handleDelete = async (curriculumId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this curriculum?");
        if (!confirmDelete) return;

        try {
            await deleteDoc(doc(db, "curriculum", curriculumId));
            fetchCurriculums();
            alert("Curriculum deleted successfully!");
        } catch (error) {
            console.error("Error deleting curriculum:", error);
        }
    };

    const handleAddCurriculum = async (curriculumData) => {
        try {
            await addDoc(collection(db, "curriculum"), curriculumData);
            fetchCurriculums();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error adding curriculum:", error);
        }
    };

    return (
        <div className="p-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <h1 className="text-xl sm:text-2xl font-semibold">Curriculum</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 w-full sm:w-auto"
                >
                    + Add Curriculum
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
                <SearchBar />
            </div>

            {/* Curriculum Table */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2 text-left text-sm font-medium">Curriculum Name</th>
                            <th className="border p-2 text-left text-sm font-medium">Section Count</th>
                            <th className="border p-2 text-left text-sm font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {curriculums.map((curriculum) => (
                            <tr key={curriculum.id} className="border-b">
                                <td className="border p-2 text-sm">{curriculum.name}</td>
                                <td className="border p-2 text-sm text-center">{curriculum.sectionCount}</td>
                                <td className="border p-2">
                                    <div className="flex items-center space-x-2 flex-wrap gap-2">
                                        <button
                                            onClick={() => navigate(`/curriculum/${curriculum.id}`)}
                                            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition duration-200 text-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(curriculum.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-200 text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create Curriculum Modal */}
            <CreateCurriculum 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSubmit={handleAddCurriculum} 
            />
        </div>
    );
};

export default Curriculum;