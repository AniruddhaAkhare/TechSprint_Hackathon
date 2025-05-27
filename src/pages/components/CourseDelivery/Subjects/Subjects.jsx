import { useState, useEffect } from "react";
import { db } from '../../../../config/firebase.js';
import { getDocs, collection, deleteDoc, doc } from 'firebase/firestore';
import CreateSubjects from "./CreateSubjects.jsx";
import SearchBar from '../../../../pages/components/SearchBar.jsx';
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";

export default function Subjects() {
    const [currentSubject, setCurrentSubject] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const SubjectCollectionRef = collection(db, "Subjects");
    const [isOpen, setIsOpen] = useState(false);
    const [courses, setCourses] = useState([]);

    const [openDelete, setOpenDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const toggleSidebar = () => {
        setIsOpen(prev => !prev);
    };

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }
        const results = subject.filter(subject =>
            subject.name.toLowerCase().includes(searchTerm.toLowerCase())
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

    const fetchSubjects = async () => {
        const snapshot = await getDocs(SubjectCollectionRef);
        const subjectData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        setSubjects(subjectData);
    };

    const fetchCourses = async () => {
        // Fetch courses for dropdown (to be implemented)
    };


    useEffect(() => {
        fetchSubjects();
        fetchCourses();
    }, []);


    const handleCreateSubjectClick = () => {
        setCurrentSubject(null);
        toggleSidebar();
    };

    const handleEditClick = (subject) => {
        setCurrentSubject(subject);
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        setCurrentSubject(null);
        fetchSubjects();
    };

    const deleteSubject = async () => {
        if (deleteId) {
            try {
                await deleteDoc(doc(db, "Subjects", deleteId));
                fetchSubjects();
            } catch (err) {
                // //console.error("Error deleting subjects:", err);
            }
        }
        setOpenDelete(false);
    };

    return (
        <div className="flex-col w-screen ml-80 p-4">
            <div className="justify-between items-center p-4 mb-4">
                <div className="flex-1">
                    <h1 className="text-2xl font-semibold">Subjects</h1>
                </div>
                <div>
                    <button type="button"
                        className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                        onClick={handleCreateSubjectClick}>
                        + Create subject
                    </button>
                </div>
            </div>

            <CreateSubjects isOpen={isOpen} toggleSidebar={handleClose} subject={currentSubject} />

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
                            <th>Sr No</th>
                            <th>Subject Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(searchResults.length > 0 ? searchResults : subjects).map((subject, index) => (
                            <tr key={subject.id}>
                                <td>{index + 1}</td>
                                <td>{subject.name}</td>
                                <td>
                                    <div className="flex items-center space-x-2">
                                        <button onClick={() => { setDeleteId(subject.id); setOpenDelete(true); }} className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600">
                                            Delete
                                        </button>
                                        <button onClick={() => handleEditClick(subject)} className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600">
                                            Update
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
