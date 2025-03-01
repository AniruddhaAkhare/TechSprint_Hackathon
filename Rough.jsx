import React, { useState, useEffect, useRef } from "react";
import { db, storage } from "../../../../config/firebase";
import { collection, getDocs, addDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import CreateCurriculum from "./CreateCurriculum";
import SearchBar from "../../SearchBar";
import { useNavigate } from "react-router-dom";
import AddMCQModal from "./AddMCQModal.jsx";
import AddSectionalModal from './AddSectionalModel.jsx';
import ParentComponent from './ParentComponent.jsx';
const Curriculum = () => {
    const [curriculums, setCurriculums] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
    const [isMCQModalOpen, setIsMCQModalOpen] = useState(false);
    const [selectedCurriculumId, setSelectedCurriculumId] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [sectionOptionsOpen, setSectionOptionsOpen] = useState(false);
    const fileInputRef = useRef(null);
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

                    const sections = await Promise.all(sectionsSnapshot.docs.map(async (sectionDoc) => {
                        const sectionData = sectionDoc.data();
                        const mcqsSnapshot = await getDocs(collection(db, "curriculum", doc.id, "sections", sectionDoc.id, "mcqs"));
                        const mcqs = mcqsSnapshot.docs.map(mcqDoc => ({ id: mcqDoc.id, ...mcqDoc.data() }));
                        return { id: sectionDoc.id, name: sectionData.name, mcqs };
                    }));

                    return { id: doc.id, name: data.name, sections };
                })
            );

            setCurriculums(curriculumData);
        } catch (error) {
            console.error("Error fetching curriculums with sections:", error);
        }
    };

    const handleUpload = async (type) => {
        if (!selectedSection || !selectedCurriculumId) return;
        fileInputRef.current.accept = type === "video" ? "video/*" : "application/pdf";
        fileInputRef.current.dataset.type = type;
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const type = e.target.dataset.type;
        const storageRef = ref(storage, `sections/${selectedCurriculumId}/${selectedSection.id}/${type}/${file.name}`);
        await uploadBytes(storageRef, file);
        const fileURL = await getDownloadURL(storageRef);
        await saveToFirestore(type, fileURL);
    };

    const handleLink = async () => {
        const link = prompt("Enter YouTube Link:");
        if (!link) return;
        await saveToFirestore("youtube", link);
    };

    const saveToFirestore = async (type, fileURL) => {
        const sectionRef = doc(db, "curriculum", selectedCurriculumId, "sections", selectedSection.id);
        await updateDoc(sectionRef, { [type]: arrayUnion(fileURL) });
        alert(`${type.toUpperCase()} uploaded successfully!`);
    };



    return (
        <div className="flex-col w-screen ml-80 p-4">
            <h1 className="text-2xl font-semibold">Curriculum</h1>
            {/* <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-blue-500 text-white rounded">+ Add Curriculum</button> */}
            <button onClick={() => navigate("/createCurriculum")} className="px-4 py-2 bg-blue-500 text-white rounded">
                + Add Curriculum
            </button>
            <SearchBar />

            <table className="mt-4">
                <thead><tr><th>Curriculum Name</th><th>Sections</th><th>Actions</th></tr></thead>
                <tbody>
                    {curriculums.map(curriculum => (
                        <tr key={curriculum.id}>
                            <td>{curriculum.name}</td>
                            <td className="curriculumSection">
                                {curriculum.sections.map(section => (
                                    <button key={section.id} onClick={() => {
                                        setSelectedSection(section);
                                        setSectionOptionsOpen(true);
                                        setSelectedCurriculumId(curriculum.id);
                                    }} className="text-white-500 underline">
                                        {section.name}
                                    </button>
                                ))}
                            </td>

                            <td>
                                <button
                                    onClick={() => navigate(`/courses/:courseId/curriculum/curriculumEditor/${curriculum.id}`)}
                                    className="text-white-500 underline"
                                >
                                    Edit
                                </button>




                                {/* <button
                                    onClick={() => {
                                        setIsAddSectionModalOpen(true);
                                        setSelectedCurriculumId(curriculum.id); // Set the selected curriculum
                                    }}
                                    className="text-white-500 underline"
                                >
                                    Edit
                                    {/* {curriculum.name} */}
                                {/* </button>  */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>


            {sectionOptionsOpen && selectedSection && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg">
                        <h2 className="text-lg font-semibold">{selectedSection.name} - Options</h2>
                        <button onClick={() => setIsMCQModalOpen(true)} className="bg-purple-500 text-white py-2 rounded mb-2">Add MCQs</button>
                        <button onClick={() => handleUpload("pdf")} className="bg-blue-500 text-white py-2 rounded mb-2">Upload PDF</button>
                        <button onClick={() => handleUpload("video")} className="bg-blue-500 text-white py-2 rounded mb-2">Upload Video</button>
                        <button onClick={handleLink} className="bg-red-500 text-white py-2 rounded">Add YouTube Link</button>

                        <button
                            type="button"
                            onClick={() => {
                                setSectionOptionsOpen(false);
                                setSelectedSection(null); // Ensure the selected section is reset
                            }}
                            className="bg-gray-400 text-white px-4 py-2 rounded"
                        >
                            Cancel
                        </button>

                    </div>
                </div>
            )}





            <ParentComponent selectedSection={selectedSection} selectedCurriculumId={selectedCurriculumId} />
            <CreateCurriculum isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddCurriculum} />


            {
                isMCQModalOpen && sectionOptionsOpen && selectedSection && (
                    <AddMCQModal
                        sectionId={selectedSection.id}
                        curriculumId={selectedCurriculumId}
                        onClose={() => {
                            setIsMCQModalOpen(false);
                            setSectionOptionsOpen(false);
                        }} // ✅ Ensure onClose function is passed
                    />
                )
            }

            <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} />
        </div >
    );
};

export default Curriculum;
