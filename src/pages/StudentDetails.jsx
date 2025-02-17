import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "./components/firebase";
import AddStudent from "./components/AddStudent";
import EditStudent from "./components/EditStudent";
import SearchBar from "./components/Searchbar";

export default function StudentDetails() {
    const { adminId } = useParams();
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();

    const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
    const [isEditStudentOpen, setIsEditStudentOpen] = useState(false);
    const [studentToEdit, setStudentToEdit] = useState(null);
    const StudentCollectionRef = collection(db, "student");

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }
        const searchLower = searchTerm.toLowerCase();
        const results = students.filter(student => {
            const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
            return (
            (student.first_name?.toLowerCase() || '').includes(searchLower) ||
            (student.last_name?.toLowerCase() || '').includes(searchLower) ||
            fullName.includes(searchLower) ||
            (student.email?.toLowerCase() || '').includes(searchLower) ||
            (student.phone || '').includes(searchTerm)

            );
        });
        setSearchResults(results);
    };

    useEffect(() => {
        if (searchTerm) {
            handleSearch();
        } else {
            setSearchResults([]);
        }
    }, [searchTerm]);

    const fetchStudents = async () => {
        const snapshot = await getDocs(StudentCollectionRef);
        const studentData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        setStudents(studentData);
    }

    useEffect(() => {
        fetchStudents();
    }, []);

    const onDelete = async (studentId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this student?");
        if (!confirmDelete) return;

        try {
            const enrollmentCollection = collection(db, "enrollment");
            const enrollmentQuery = query(enrollmentCollection, where("student_id", "==", studentId));
            const enrollmentDocs = await getDocs(enrollmentQuery);

            const deletePromises = enrollmentDocs.docs.map(doc => deleteDoc(doc.ref));
            await Promise.all(deletePromises);
            await deleteDoc(doc(db, "student", studentId));

            setStudents(prevStudents => prevStudents.filter(student => student.id !== studentId));
            alert("Student and associated enrollments deleted successfully!");
        } catch (error) {
            console.error("Error deleting student or enrollments:", error);
        }
    };

    const onEdit = (student) => {
        setStudentToEdit(student);
        setIsEditStudentOpen(true);
        navigate(`/studentdetails/updatestudent/${student.id}`)
    };

    const formatDate = (timestamp) => {
        if (timestamp && timestamp.seconds) {
            return new Date(timestamp.seconds * 1000).toLocaleDateString();
        }
        return timestamp;
    };

    return (
        <div className="container ml-80 p-4">
            <h1 className="text-2xl font-semibold mb-4">Student Details</h1>
            <div className="flex space-x-4 mb-4">
                <button onClick={() => {navigate('/studentdetails/addstudent')}} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                    Add Student
                </button>
            </div>
            <div className="justify-between items-center p-4 mt-4">
                    <SearchBar
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        handleSearch={handleSearch}
                    />
                    {/* {searchTerm && (
                        <div className="mt-2 text-sm text-gray-500">
                            Showing {searchResults.length} results
                        </div>
                    )} */}
            </div>
            <div className="overflow-x-auto">
                <table className="table-data table">
                    <thead className="table-secondary">
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>DOB</th>
                            <th>Admission Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {students.length > 0 ? (
                            <>
                                {(searchResults.length > 0 ? searchResults : students).map(student => (
                                    <tr key={student.id}>
                                        <td className="cursor-pointer" onClick={() => navigate(`/studentdetails/studentinfo/${student.id}`)}>
                                            {student.first_name}
                                        </td>
                                        <td className="cursor-pointer" onClick={() => navigate(`/studentdetails/studentinfo/${student.id}`)}>
                                            {student.last_name}
                                        </td>
                                        <td className="cursor-pointer" onClick={() => navigate(`/studentdetails/studentinfo/${student.id}`)}>
                                            {student.email}
                                        </td>
                                        <td className="cursor-pointer" onClick={() => navigate(`/studentdetails/studentinfo/${student.id}`)}>
                                            {student.phone}
                                        </td>
                                        <td className="cursor-pointer" onClick={() => navigate(`/studentdetails/studentinfo/${student.id}`)}>
                                            {formatDate(student.date_of_birth)}
                                        </td>
                                        <td className="cursor-pointer" onClick={() => navigate(`/studentdetails/studentinfo/${student.id}`)}>
                                            {formatDate(student.admission_date)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                                            <button onClick={() => onDelete(student.id)} className="text-white">Delete</button>
                                            <button onClick={() => onEdit(student)} className="text-white">Update</button>
                                        </td>
                                    </tr>
                                ))}
                                {searchResults.length === 0 && searchTerm && (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No students found for this search.</td>
                                    </tr>
                                )}
                            </>
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No students found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {isAddStudentOpen && (<AddStudent />)}
            {isEditStudentOpen && studentToEdit && (<EditStudent />)}
        </div>
    );
}
