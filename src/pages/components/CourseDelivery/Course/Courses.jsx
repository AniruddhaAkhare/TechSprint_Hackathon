import { useState, useEffect } from "react";
import { db } from '../../../../config/firebase';
import { getDocs, collection, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import CreateCourses from "./CreateCourses";
import SearchBar from "../../SearchBar";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";

export default function Courses() {
    const [currentCourse, setCurrentCourse] = useState(null);
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    
    const CourseCollectionRef = collection(db, "Course");
    const StudentCollectionRef = collection(db, "student");
    const [isOpen, setIsOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState("Are you sure you want to delete this course? This action cannot be undone.");

    const toggleSidebar = () => setIsOpen(prev => !prev);

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
        if (searchTerm) handleSearch();
        else setSearchResults([]);
    }, [searchTerm]);

    const fetchCourses = async () => {
        try {
            const q = query(CourseCollectionRef, orderBy('createdAt', 'asc'));
            const snapshot = await getDocs(q);
            const courseData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setCourses(courseData);
            console.log("Courses fetched:", courseData);
        } catch (err) {
            console.error("Error fetching courses:", err);
        }
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

    const checkStudentsInCourse = async (courseId) => {
        try {
            console.log(`Checking students for course ID: ${courseId}`); // Add this line
            const snapshot = await getDocs(StudentCollectionRef);
            const students = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            console.log("Students fetched:", students);
            const hasStudents = students.some(student => {
                const courseDetails = student.course_details || [];
                console.log(`Checking student ${student.id} course_details:`, courseDetails);
                return courseDetails.some(course => course.course_id === courseId);
            });
            console.log(`Course ${courseId} has students: ${hasStudents}`);
            return hasStudents;
        } catch (err) {
            console.error("Error checking students:", err);
            return false;
        }
    };

    const deleteCourse = async () => {
        if (!deleteId) return;

        try {
            const hasStudents = await checkStudentsInCourse(deleteId);
            if (hasStudents) {
                setDeleteMessage("This course cannot be deleted because students are enrolled in it.");
                return;
            }

            await deleteDoc(doc(db, "Course", deleteId));
            console.log(`Course ${deleteId} deleted successfully`);
            fetchCourses();
            setOpenDelete(false);
            setDeleteMessage("Are you sure you want to delete this course? This action cannot be undone."); // Reset message
        } catch (err) {
            console.error("Error deleting course:", err);
            setDeleteMessage("An error occurred while trying to delete the course.");
        }
    };

    return (
        <div className="flex-col w-screen ml-80 p-4">
            <div className="justify-between items-center p-4 mb-4 flex">
                <div className="flex-1">
                    <h1 className="text-2xl font-semibold">Courses</h1>
                </div>
                <div>
                    <button
                        type="button"
                        className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                        onClick={handleCreateCourseClick}
                    >
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
                <table className="data-table table w-full">
                    <thead className="table-secondary">
                        <tr>
                            <th>Sr No</th>
                            <th>Course Name</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(searchResults.length > 0 ? searchResults : courses).map((course, index) => (
                            <tr key={course.id}>
                                <td>{index + 1}</td>
                                <td>{course.name}</td>
                                <td>{course.status || "Ongoing"}</td>
                                <td>
                                    <div className="flex items-center space-x-2">
                                        <button 
                                            onClick={() => {
                                                setDeleteId(course.id);
                                                setOpenDelete(true);
                                                setDeleteMessage("Are you sure you want to delete this course? This action cannot be undone.");
                                            }} 
                                            className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                        <button 
                                            onClick={() => handleEditClick(course)} 
                                            className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600"
                                        >
                                            Update
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Dialog open={openDelete} handler={() => setOpenDelete(false)}>
                <DialogHeader>Confirm Deletion</DialogHeader>
                <DialogBody>{deleteMessage}</DialogBody>
                <DialogFooter>
                    <Button variant="text" color="gray" onClick={() => setOpenDelete(false)}>Cancel</Button>
                    {deleteMessage === "Are you sure you want to delete this course? This action cannot be undone." && (
                        <Button variant="filled" color="red" onClick={deleteCourse}>Yes, Delete</Button>
                    )}
                </DialogFooter>
            </Dialog>
        </div>
    );
}