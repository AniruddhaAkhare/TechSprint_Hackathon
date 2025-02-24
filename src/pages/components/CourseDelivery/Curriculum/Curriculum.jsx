import React, { useState, useEffect } from "react";
import { db } from "../../../../config/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import CreateCurriculum from "./CreateCurriculum";
import AddSectionModal from './AddSectionalModel.jsx'; // Import AddSectionModal
import { useNavigate, useParams } from "react-router-dom";
import SearchBar from "../../SearchBar";


const Curriculum = () => {
  const { courseId } = useParams();


    const [curriculums, setCurriculums] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false); // State for AddSectionModal
    const [selectedCurriculumId, setSelectedCurriculumId] = useState(null); // State for selected curriculum ID

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    // const CurriculumCollectionRef = collection(db, "Curriculum");


    const navigate = useNavigate();

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }
        const results = curriculums.filter(curr =>
            curr.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results);
    };

    useEffect(() => {
        if (searchTerm) {
            handleSearch();
        } else {
            setSearchResults([]);
        }
    }, [searchTerm]);


    const fetchCurriculums = async () => {
        const snapshot = await getDocs(collection(db, "curriculum"));
        const curriculumData = snapshot.docs
            .map((doc, index) => ({
                id: doc.id,
                index: index + 1,
                ...doc.data(),
            }))
            .filter(curriculum => curriculum.courseId === courseId);

        setCurriculums(curriculumData);
    };


    useEffect(() => {
        fetchCurriculums();
    }, []);

    const handleAddCurriculum = async (newCurriculum) => {
        try {
            const docRef = await addDoc(collection(db, "curriculum"), newCurriculum);
            setCurriculums((prev) => [
                ...prev,
                { ...newCurriculum, id: docRef.id, index: prev.length + 1 },
            ]);
        } catch (error) {
            console.error("Error adding curriculum:", error);
        }
    };

    const handleCurriculumClick = (curriculumId) => {
        setSelectedCurriculumId(curriculumId);
        setIsAddSectionModalOpen(true);
    };

    return (
        <div className="flez-col w-screen ml-80 p-4">
            <div className="justify-between items-center p-4 mb-4">
                <div className="flex-1">
                    <h1 className="text-2xl font-semibold">Curriculum</h1>
                   </div>
                <div>
           
          <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        + Add Curriculum
                    </button>
                </div>
            </div> 
            <div className="justify-between items-center p-4 mt-4">
                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    handleSearch={handleSearch}
                />

            </div>
            <div className="sec-3">
                <table className="data-table table">
                    <thead className="table-secondary">
                        <tr>
                            <th >Sr.</th>
                            <th >Curriculum Name</th>
                            <th >Content</th>
                            <th >Actions</th>
                        </tr>
                    </thead>
                    <tbody>
            {curriculums.length > 0 ? (
              (searchResults.length > 0 ? searchResults : curriculums).map((curriculum) => (

                            <tr key={curriculum.id} onClick={() => handleCurriculumClick(curriculum.id)}>
                                <td >
                                    {curriculum.index.toString().padStart(2, "0")}
                                </td>
                                <td >{curriculum.name}</td>
                                <td >{curriculum.sections || "-"}</td>
                                <td >
                                    <button onClick={() => setIsAddSectionModalOpen(true)} className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Edit</button>
                                </td>
                            </tr>
                        ))) : (
                        <tr>
                            <td colSpan="4" className="text-center py-4">
                                <div className="flex flex-col items-center space-y-4">
                                    <p className="text-gray-600">No curriculum found for this course</p>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        + Add Curriculum
                                    </button>
                                </div>
                            </td>
                        </tr>

                    )}
                    </tbody>

                </table>
            </div>
            <CreateCurriculum
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddCurriculum}
                courseId={courseId}
            />

            {isAddSectionModalOpen && (
                <AddSectionModal curriculumId={selectedCurriculumId} onClose={() => setIsAddSectionModalOpen(false)} />
            )}
        </div> 
    );
};

export default Curriculum;
