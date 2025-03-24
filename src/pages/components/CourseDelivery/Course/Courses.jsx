import { useState, useEffect } from "react";
import { db } from '../../../../config/firebase';
import { getDocs, collection, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import CreateCourses from "./CreateCourses";
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

    // Unified search handler
    const handleSearch = (term) => {
        if (!term.trim()) {
            setSearchResults([]);
            return;
        }
        const results = courses.filter(course =>
            course.name.toLowerCase().includes(term.toLowerCase())
        );
        setSearchResults(results);
    };

    // Trigger search on searchTerm change
    useEffect(() => {
        handleSearch(searchTerm);
    }, [searchTerm]);

    // Fetch courses from Firestore
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
        // ... (unchanged)
        try {
            console.log(`Checking students for course ID: ${courseId}`);
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
        // ... (unchanged)
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
            setDeleteMessage("Are you sure you want to delete this course? This action cannot be undone.");
        } catch (err) {
            console.error("Error deleting course:", err);
            setDeleteMessage("An error occurred while trying to delete the course.");
        }
    };

    return (
        <div className="flex flex-col w-full min-h-screen bg-gray-50 p-6 ml-80">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Courses</h1>
                <button
                    type="button"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={handleCreateCourseClick}
                >
                    + Create Course
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                {/* Search Bar */}
                <div className="mb-6">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search courses by name..."
                        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Table Section */}
                <div className="rounded-lg shadow-md overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Sr No</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Course Name</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(searchResults.length > 0 ? searchResults : courses).map((course, index) => (
                                <tr key={course.id} className="border-b hover:bg-gray-50 transition duration-150">
                                    <td className="px-4 py-3 text-gray-600">{index + 1}</td>
                                    <td className="px-4 py-3 text-gray-800">{course.name}</td>
                                    <td className="px-4 py-3 text-gray-600">{course.status || "Ongoing"}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => {
                                                    setDeleteId(course.id);
                                                    setOpenDelete(true);
                                                    setDeleteMessage("Are you sure you want to delete this course? This action cannot be undone.");
                                                }}
                                                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                            >
                                                Delete
                                            </button>
                                            <button
                                                onClick={() => handleEditClick(course)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
            </div>

            {/* Backdrop for Sidebar */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={handleClose}
                />
            )}

            {/* Sidebar (CreateCourses) */}
            <div
                className={`fixed top-0 right-0 h-full w-1/3 bg-white shadow-lg transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"} z-50 overflow-y-auto`}
            >
                <CreateCourses isOpen={isOpen} toggleSidebar={handleClose} course={currentCourse} />
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={openDelete}
                handler={() => setOpenDelete(false)}
                className="rounded-lg shadow-lg"
            >
                <DialogHeader className="text-gray-800 font-semibold">Confirm Deletion</DialogHeader>
                <DialogBody className="text-gray-600">{deleteMessage}</DialogBody>
                <DialogFooter className="space-x-4">
                    <Button
                        variant="text"
                        color="gray"
                        onClick={() => setOpenDelete(false)}
                        className="hover:bg-gray-100 transition duration-200"
                    >
                        Cancel
                    </Button>
                    {deleteMessage === "Are you sure you want to delete this course? This action cannot be undone." && (
                        <Button
                            variant="filled"
                            color="red"
                            onClick={deleteCourse}
                            className="bg-red-500 hover:bg-red-600 transition duration-200"
                        >
                            Yes, Delete
                        </Button>
                    )}
                </DialogFooter>
            </Dialog>
        </div>
    );
}