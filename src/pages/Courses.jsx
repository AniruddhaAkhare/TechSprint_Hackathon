import { useState, useEffect } from "react";
import { db } from '../config/firebase';
import { getDocs, collection, deleteDoc, doc } from 'firebase/firestore';
import CreateCourses from "./components/CreateCourses";
import SearchBar from "./components/SearchBar";
export default function Courses() {
    const [currentCourse, setCurrentCourse] = useState(null);
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const CourseCollectionRef = collection(db, "Course");
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(prev => !prev);
    };

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }
        const results = courses.filter(course => 
            course.name.toLowerCase().includes(searchTerm.toLowerCase())
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

    const fetchCourses = async () => {
        const snapshot = await getDocs(CourseCollectionRef);
        const courseData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        setCourses(courseData);
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleCreateCourseClick = () => {
        setCurrentCourse(null);
        toggleSidebar();
    };

    const handleEditClick = (course) => {
        setCurrentCourse(course);
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        setCurrentCourse(null);
        fetchCourses();            
    };

    const deleteCourse = async (id) => {
        const courseDoc = doc(db, "Course", id);
        await deleteDoc(courseDoc);
        alert("Course deleted successfully");
        fetchCourses();  
    };

    return (
        <div className="flex-col w-screen ml-80 p-4">
            <div className="justify-between items-center p-4 mb-4">
                <div className="flex-1">
                    <h1 className="text-2xl font-semibold">Courses</h1>
                </div>
                <div>
                    <button type="button"
                        className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                        onClick={handleCreateCourseClick}>
                        + Create Course
                    </button>
                </div>
            </div>

            <CreateCourses isOpen={isOpen} toggleSidebar={handleClose} course={currentCourse} />

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
                            <th>Course Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(searchResults.length > 0 ? searchResults : courses).map((course, index) => (
                            <tr key={course.id}>
                                <td>{index + 1}</td>
                                <td>{course.name}</td>
                                <td>
                                    <button onClick={() => handleEditClick(course)} className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Edit</button>
                                    <button onClick={() => deleteCourse(course.id)} className="ml-2 btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
