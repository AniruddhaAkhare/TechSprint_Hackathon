// // import React, { useState, useEffect, useRef } from "react";
// // import { db, storage } from "../../../../config/firebase";
// // import { collection, getDocs, addDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
// // import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// // import { useNavigate } from "react-router-dom";
// // import SearchBar from "../../SearchBar";
// // import CreateCurriculum from "./CreateCurriculum";
// // import AddMCQModal from "./AddMCQModal.jsx";
// // import ParentComponent from './ParentComponent.jsx';
// // // import AddSectionalModal from './AddSectionalModel.jsx';

// // const Curriculum = () => {
// //     const [curriculums, setCurriculums] = useState([]);
// //     const [isModalOpen, setIsModalOpen] = useState(false);
// //     const [selectedCurriculumId, setSelectedCurriculumId] = useState(null);
// //     const [selectedSection, setSelectedSection] = useState(null);
// //     const [sectionOptionsOpen, setSectionOptionsOpen] = useState(false);
// //     const fileInputRef = useRef(null);
// //     // const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
// //     const [isMCQModalOpen, setIsMCQModalOpen] = useState(false);

// //     const navigate = useNavigate();

// //     useEffect(() => {
// //         fetchCurriculums();
// //     }, []);

// //     const fetchCurriculums = async () => {
// //         try {
// //             const snapshot = await getDocs(collection(db, "curriculum"));
// //             const curriculumData = await Promise.all(
// //                 snapshot.docs.map(async (doc) => {
// //                     const data = doc.data();
// //                     const sectionsSnapshot = await getDocs(collection(db, "curriculum", doc.id, "sections"));

// //                     const sections = await Promise.all(sectionsSnapshot.docs.map(async (sectionDoc) => {
// //                         const sectionData = sectionDoc.data();
// //                         const mcqsSnapshot = await getDocs(collection(db, "curriculum", doc.id, "sections", sectionDoc.id, "mcqs"));
// //                         const mcqs = mcqsSnapshot.docs.map(mcqDoc => ({ id: mcqDoc.id, ...mcqDoc.data() }));
// //                         return { id: sectionDoc.id, name: sectionData.name };
// //                     }));

// //                     return { id: doc.id, name: data.name, sections };
// //                 })
// //             );
// //             setCurriculums(curriculumData);
// //         } catch (error) {
// //             console.error("Error fetching curriculums:", error);
// //         }
// //     };

// //     const handleUpload = async (type) => {
// //         if (!selectedSection || !selectedCurriculumId) return;
// //         fileInputRef.current.accept = type === "video" ? "video/*" : "application/pdf";
// //         fileInputRef.current.dataset.type = type;
// //         fileInputRef.current.click();
// //     };

// //     const handleFileChange = async (e) => {
// //         const file = e.target.files[0];
// //         if (!file) return;
// //         const type = e.target.dataset.type;
// //         const storageRef = ref(storage, `sections/${selectedCurriculumId}/${selectedSection.id}/${type}/${file.name}`);
// //         await uploadBytes(storageRef, file);
// //         const fileURL = await getDownloadURL(storageRef);
// //         await saveToFirestore(type, fileURL);
// //     };

// //     const handleLink = async () => {
// //         const link = prompt("Enter YouTube Link:");
// //         if (!link) return;
// //         await saveToFirestore("youtube", link);
// //     };

// //     const saveToFirestore = async (type, fileURL) => {
// //         const sectionRef = doc(db, "curriculum", selectedCurriculumId, "sections", selectedSection.id);
// //         await updateDoc(sectionRef, { [type]: arrayUnion(fileURL) });
// //         alert(`${type.toUpperCase()} uploaded successfully!`);
// //     };


// //     const handleAddCurriculum = async (curriculumData) => {
// //         try {
// //             await addDoc(collection(db, "curriculum"), curriculumData);
// //             fetchCurriculums(); // Refresh list
// //             setIsModalOpen(false);
// //         } catch (error) {
// //             console.error("Error adding curriculum:", error);
// //         }
// //     };

// //     return (
// //         <div className="flex-col w-screen ml-80 p-4">
// //             <h1 className="text-2xl font-semibold">Curriculum</h1>
// //             <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-blue-500 text-white rounded">
// //                 + Add Curriculum
// //             </button>
// //             <SearchBar />

// //             <table className="mt-4">
// //                 <thead>
// //                     <tr><th>Curriculum Name</th><th>Sections</th><th>Actions</th></tr>
// //                 </thead>
// //                 <tbody>
// //                     {curriculums.map(curriculum => (
// //                         <tr key={curriculum.id}>
// //                             <td>{curriculum.name}</td>
// //                             <td>
// //                                 {curriculum.sections.map(section => (
// //                                     <button key={section.id} onClick={() => {
// //                                         setSelectedSection(section);
// //                                         setSectionOptionsOpen(true);
// //                                         setSelectedCurriculumId(curriculum.id);
// //                                     }} className="text-white-500 underline">
// //                                         {section.name}
// //                                     </button>
// //                                 ))}
// //                             </td>
// //                             <td>
// //                                 <button
// //                                     onClick={() => navigate(`/courses/:courseId/curriculum/curriculumEditor/${curriculum.id}`)}
// //                                     className="text-white-500 underline"
// //                                 >
// //                                     Edit
// //                                 </button>
// //                             </td>
// //                         </tr>
// //                     ))}
// //                 </tbody>
// //             </table>



            

// //             <ParentComponent selectedSection={selectedSection} selectedCurriculumId={selectedCurriculumId} />
// //             <CreateCurriculum isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddCurriculum} />

// //             {
// //                 isMCQModalOpen && sectionOptionsOpen && selectedSection && (
// //                     <AddMCQModal
// //                         sectionId={selectedSection.id}
// //                         curriculumId={selectedCurriculumId}
// //                         onClose={() => {
// //                             setIsMCQModalOpen(false);
// //                             setSectionOptionsOpen(false);
// //                         }} // ✅ Ensure onClose function is passed
// //                     />
// //                 )
// //             }

// //             <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} />
// //         </div>
// //     );
// // };

// // export default Curriculum;



// // // import React, { useState, useEffect, useRef } from "react";
// // // import { db, storage } from "../../../../config/firebase";
// // // import { collection, getDocs, addDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
// // // import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// // // import { useNavigate } from "react-router-dom";
// // // import SearchBar from "../../SearchBar";
// // // import CreateCurriculum from "./CreateCurriculum";
// // // import AddMCQModal from "./AddMCQModal.jsx";
// // // import ParentComponent from './ParentComponent.jsx';

// // // const Curriculum = () => {
// // //     const [curriculums, setCurriculums] = useState([]);
// // //     const [isModalOpen, setIsModalOpen] = useState(false);
// // //     const [selectedCurriculumId, setSelectedCurriculumId] = useState(null);
// // //     const [selectedSection, setSelectedSection] = useState(null);
// // //     const [sectionOptionsOpen, setSectionOptionsOpen] = useState(false);
// // //     const fileInputRef = useRef(null);
// // //     const [isMCQModalOpen, setIsMCQModalOpen] = useState(false);

// // //     const navigate = useNavigate();

// // //     useEffect(() => {
// // //         fetchCurriculums();
// // //     }, []);

// // //     const fetchCurriculums = async () => {
// // //         try {
// // //             const snapshot = await getDocs(collection(db, "curriculum"));
// // //             const curriculumData = await Promise.all(
// // //                 snapshot.docs.map(async (doc) => {
// // //                     const data = doc.data();
// // //                     const sectionsSnapshot = await getDocs(collection(db, "curriculum", doc.id, "sections"));
// // //                     const sections = sectionsSnapshot.docs.map(sectionDoc => ({
// // //                         id: sectionDoc.id, 
// // //                         name: sectionDoc.data().name
// // //                     }));

// // //                     return { id: doc.id, name: data.name, sections };
// // //                 })
// // //             );
// // //             setCurriculums(curriculumData);
// // //         } catch (error) {
// // //             console.error("Error fetching curriculums:", error);
// // //         }
// // //     };

// // //     const handleUpload = (type) => {
// // //         if (!selectedSection || !selectedCurriculumId) return;
// // //         fileInputRef.current.accept = type === "video" ? "video/*" : "application/pdf";
// // //         fileInputRef.current.dataset.type = type;
// // //         fileInputRef.current.click();
// // //     };

// // //     const handleFileChange = async (e) => {
// // //         const file = e.target.files[0];
// // //         if (!file) return;
// // //         const type = e.target.dataset.type;
// // //         const storageRef = ref(storage, `sections/${selectedCurriculumId}/${selectedSection.id}/${type}/${file.name}`);
// // //         await uploadBytes(storageRef, file);
// // //         const fileURL = await getDownloadURL(storageRef);
// // //         await saveToFirestore(type, fileURL);
// // //     };

// // //     const handleLink = async () => {
// // //         const link = prompt("Enter YouTube Link:");
// // //         if (!link) return;
// // //         await saveToFirestore("youtube", link);
// // //     };

// // //     const saveToFirestore = async (type, fileURL) => {
// // //         const sectionRef = doc(db, "curriculum", selectedCurriculumId, "sections", selectedSection.id);
// // //         await updateDoc(sectionRef, { [type]: arrayUnion(fileURL) });
// // //         alert(`${type.toUpperCase()} uploaded successfully!`);
// // //     };

// // //     const handleAddCurriculum = async (curriculumData) => {
// // //         try {
// // //             await addDoc(collection(db, "curriculum"), curriculumData);
// // //             fetchCurriculums();
// // //             setIsModalOpen(false);
// // //         } catch (error) {
// // //             console.error("Error adding curriculum:", error);
// // //         }
// // //     };

// // //     return (
// // //         <div className="flex-col w-screen ml-80 p-4">
// // //         {/* // <div className="flex flex-col w-full p-8 bg-gray-100 min-h-screen"> */}
// // //             <div className="flex justify-between items-center mb-6">
// // //                 <h1 className="text-3xl font-bold text-gray-800">📚 Curriculum Management</h1>
// // //                 <button 
// // //                     onClick={() => setIsModalOpen(true)}
// // //                     className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md shadow-md transition duration-300"
// // //                 >
// // //                     + Add Curriculum
// // //                 </button>
// // //             </div>

// // //             <SearchBar />

// // //             <div className="bg-white shadow-md rounded-lg mt-6 overflow-hidden">
// // //                 <table className="w-full">
// // //                     <thead className="bg-blue-500 text-white">
// // //                         <tr>
// // //                             <th className="py-3 px-5 text-left">📖 Curriculum Name</th>
// // //                             <th className="py-3 px-5 text-left">📂 Sections</th>
// // //                             <th className="py-3 px-5 text-left">✏️ Actions</th>
// // //                         </tr>
// // //                     </thead>
// // //                     <tbody>
// // //                         {curriculums.map(curriculum => (
// // //                             <tr key={curriculum.id} className="border-b hover:bg-gray-100 transition">
// // //                                 <td className="py-3 px-5 font-medium">{curriculum.name}</td>
// // //                                 <td className="py-3 px-5">
// // //                                     {curriculum.sections.map(section => (
// // //                                         <button 
// // //                                             key={section.id} 
// // //                                             onClick={() => {
// // //                                                 setSelectedSection(section);
// // //                                                 setSectionOptionsOpen(true);
// // //                                                 setSelectedCurriculumId(curriculum.id);
// // //                                             }}
// // //                                             className="underline mx-2"
// // //                                         >
// // //                                             {section.name}
// // //                                         </button>
// // //                                     ))}
// // //                                 </td>
// // //                                 <td className="py-3 px-5">
// // //                                     <button 
// // //                                         onClick={() => navigate(`/courses/:courseId/curriculum/curriculumEditor/${curriculum.id}`)}
// // //                                         className="hover:underline"
// // //                                     >
// // //                                         Edit
// // //                                     </button>
// // //                                 </td>
// // //                             </tr>
// // //                         ))}
// // //                     </tbody>
// // //                 </table>
// // //             </div>

// // //             {sectionOptionsOpen && selectedSection && (
// // //                 <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 transition-opacity">
// // //                     <div className="bg-white p-6 rounded-lg shadow-lg text-center">
// // //                         <h2 className="text-lg font-semibold mb-4">{selectedSection.name} - Options</h2>
// // //                         <button onClick={() => setIsMCQModalOpen(true)} className="block w-full bg-purple-500 text-white py-2 rounded mb-2 hover:bg-purple-700">📝 Add MCQs</button>
// // //                         <button onClick={() => handleUpload("pdf")} className="block w-full bg-blue-500 text-white py-2 rounded mb-2 hover:bg-blue-700">📄 Upload PDF</button>
// // //                         <button onClick={() => handleUpload("video")} className="block w-full bg-blue-500 text-white py-2 rounded mb-2 hover:bg-blue-700">🎥 Upload Video</button>
// // //                         <button onClick={handleLink} className="block w-full bg-red-500 text-white py-2 rounded mb-2 hover:bg-red-700">📺 Add YouTube Link</button>

// // //                         <button 
// // //                             onClick={() => {
// // //                                 setSectionOptionsOpen(false);
// // //                                 setSelectedSection(null);
// // //                             }} 
// // //                             className="block w-full bg-gray-400 text-white py-2 rounded mt-4 hover:bg-gray-600"
// // //                         >
// // //                             ❌ Close
// // //                         </button>
// // //                     </div>
// // //                 </div>
// // //             )}

// // //             <ParentComponent selectedSection={selectedSection} selectedCurriculumId={selectedCurriculumId} />
// // //             <CreateCurriculum isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddCurriculum} />

// // //             <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} />
// // //         </div>
// // //     );
// // // };

// // // export default Curriculum;



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
//                                     onClick={() => navigate(`/curriculum/:curriculumId`)}
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

//             <CreateCurriculum isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddCurriculum} />
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
        <div className="flex-col w-screen ml-80 p-4">
            <h1 className="text-2xl font-semibold">Curriculum</h1>
            <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-blue-500 text-white rounded">
                + Add Curriculum
            </button>
            <SearchBar />

            <table className="mt-4 w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2">Curriculum Name</th>
                        <th className="border border-gray-300 px-4 py-2">Section Count</th>
                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {curriculums.map(curriculum => (
                        <tr key={curriculum.id} className="border border-gray-300">
                            <td className="border border-gray-300 px-4 py-2">{curriculum.name}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">{curriculum.sectionCount}</td>
                            <td className="border border-gray-300 px-4 py-2 flex space-x-2">
                                <button
                                    onClick={() => navigate(`/curriculum/${curriculum.id}`)} // Fixed navigation
                                    className="bg-blue-500 text-white px-2 py-1 rounded"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(curriculum.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <CreateCurriculum 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSubmit={handleAddCurriculum} 
            />
        </div>
    );
};

export default Curriculum;