import { useState, useEffect, useCallback } from "react";
import { db } from '../../../../config/firebase';
import { getDocs, collection, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import CreateCourses from "./CreateCourses";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";
import LearnerList from "./LearnerList";
import { Select, MenuItem, FormControl } from '@mui/material';

export default function Courses() {
    const [currentCourse, setCurrentCourse] = useState(null);
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]); // New state for student data
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState("Are you sure you want to delete this course? This action cannot be undone.");
    const [openLearnersDialog, setOpenLearnersDialog] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState(null);

    const CourseCollectionRef = collection(db, "Course");
    const StudentCollectionRef = collection(db, "student");

    const toggleSidebar = () => setIsOpen(prev => !prev);

    const handleLearnersClick = (courseId) => {
        setSelectedCourseId(courseId);
        setOpenLearnersDialog(true);
    };

    const handleSearch = useCallback((term) => {
        if (!term.trim()) {
            setSearchResults([]);
            return;
        }
        const results = courses.filter(course => 
            course.name?.toLowerCase().includes(term.toLowerCase())
        );
        setSearchResults(results);
    }, [courses]);

    useEffect(() => {
        handleSearch(searchTerm);
    }, [searchTerm, handleSearch]);

    const fetchStudents = useCallback(async () => {
        try {
            const snapshot = await getDocs(StudentCollectionRef);
            const studentData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setStudents(studentData);
        } catch (err) {
            console.error("Error fetching students:", err);
        }
    }, []);

    const fetchCourses = useCallback(async () => {
        try {
            const q = query(CourseCollectionRef, orderBy('createdAt', 'asc'));
            const snapshot = await getDocs(q);
            const courseData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setCourses(courseData);
        } catch (err) {
            console.error("Error fetching courses:", err);
        }
    }, []);

    useEffect(() => {
        fetchCourses();
        fetchStudents(); // Fetch students when component mounts
    }, [fetchCourses, fetchStudents]);

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
            const snapshot = await getDocs(StudentCollectionRef);
            const students = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            return students.some(student => 
                (student.course_details || []).some(course => 
                    course.course_id === courseId
                )
            );
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
            await fetchCourses();
            setOpenDelete(false);
            setDeleteMessage("Are you sure you want to delete this course? This action cannot be undone.");
        } catch (err) {
            console.error("Error deleting course:", err);
            setDeleteMessage("An error occurred while trying to delete the course.");
        }
    };

    // Helper function to get student names for a course
    const getStudentNamesForCourse = (courseId) => {
        const enrolledStudents = students.filter(student => 
            (student.course_details || []).some(course => course.course_id === courseId)
        );
        return enrolledStudents.map(student => student.name || 'Unknown').join(', ') || 'None';
    };

    return (
        <div className="flex flex-col w-full min-h-screen bg-gray-50 p-20">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Courses</h1>
                <button
                    type="button"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700"
                    onClick={handleCreateCourseClick}
                >
                    + Create Course
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-6">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search courses by name..."
                        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="rounded-lg shadow-md overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Sr No</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Course Name</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Fee (₹)</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Duration</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Mode</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Students</th> {/* New column */}
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(searchResults.length > 0 ? searchResults : courses).map((course, index) => (
                                <tr key={course.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 text-gray-600">{index + 1}</td>
                                    <td className="px-4 py-3 text-gray-800">{course.name || 'N/A'}</td>
                                    <td className="px-4 py-3 text-gray-600">{course.fee || 'N/A'}</td>
                                    <td className="px-4 py-3 text-gray-600">{course.duration || 'N/A'}</td>
                                    <td className="px-4 py-3 text-gray-600">{course.mode || 'N/A'}</td>
                                    <td className="px-4 py-3 text-gray-600">{course.status || "Active"}</td>
                                    <td className="px-4 py-3 text-gray-600">{getStudentNamesForCourse(course.id)}</td> {/* Display student names */}
                                    <td className="px-4 py-3">
                                        <FormControl size="small">
                                            <Select
                                                value=""
                                                onChange={(e) => {
                                                    const action = e.target.value;
                                                    if (action === 'delete') {
                                                        setDeleteId(course.id);
                                                        setOpenDelete(true);
                                                        setDeleteMessage("Are you sure you want to delete this course? This action cannot be undone.");
                                                    } else if (action === 'update') {
                                                        handleEditClick(course);
                                                    } else if (action === 'learners') {
                                                        handleLearnersClick(course.id);
                                                    }
                                                }}
                                                displayEmpty
                                                renderValue={() => "Actions"}
                                            >
                                                <MenuItem value="" disabled>Actions</MenuItem>
                                                <MenuItem value="update">Update</MenuItem>
                                                <MenuItem value="delete">Delete</MenuItem>
                                                <MenuItem value="learners">Learners</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={handleClose}
                />
            )}

            <div
                className={`fixed top-0 right-0 h-full w-1/3 bg-white shadow-lg transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"} z-50 overflow-y-auto`}
            >
                <CreateCourses 
                    isOpen={isOpen} 
                    toggleSidebar={handleClose} 
                    course={currentCourse} 
                />
            </div>

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
                    >
                        Cancel
                    </Button>
                    {deleteMessage === "Are you sure you want to delete this course? This action cannot be undone." && (
                        <Button
                            variant="filled"
                            color="red"
                            onClick={deleteCourse}
                        >
                            Yes, Delete
                        </Button>
                    )}
                </DialogFooter>
            </Dialog>

            <LearnerList
                courseId={selectedCourseId}
                open={openLearnersDialog}
                onClose={() => setOpenLearnersDialog(false)}
            />
        </div>
    );
}