import { useState, useEffect } from "react";
import { db } from '../../../../config/firebase.jsx';
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
    <div className="w-full ml-[20rem] p-8 bg-gray-100 min-h-screen font-sans">
  <div className="max-w-6xl mx-auto space-y-8">
    
    {/* Header Section */}
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold text-gray-800">📘 Subjects</h1>
      <button
        type="button"
        onClick={handleCreateSubjectClick}
        className="bg-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:bg-indigo-700 transition duration-200"
      >
        + Create Subject
      </button>
    </div>

    {/* Create Subject Form */}
    <CreateSubjects isOpen={isOpen} toggleSidebar={handleClose} subject={currentSubject} />

    {/* Search Bar */}
    <div className="mt-4">
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
      />
    </div>

    {/* Subject Table */}
    <div className="mt-6 bg-white rounded-xl shadow-md overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 text-gray-700 text-left uppercase tracking-wider">
          <tr>
            <th className="px-6 py-3">Sr No</th>
            <th className="px-6 py-3">Subject Name</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {(searchResults.length > 0 ? searchResults : subjects).map((subject, index) => (
            <tr key={subject.id} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4">{index + 1}</td>
              <td className="px-6 py-4 font-medium text-gray-800">{subject.name}</td>
              <td className="px-6 py-4">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => { setDeleteId(subject.id); setOpenDelete(true); }}
                    className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 transition duration-150"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleEditClick(subject)}
                    className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 transition duration-150"
                  >
                    Update
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Empty state fallback */}
      {(searchResults.length === 0 && subjects.length === 0) && (
        <div className="text-center text-gray-500 p-6">
          No subjects available.
        </div>
      )}
    </div>
  </div>
</div>

    );
}
