import { useState, useEffect } from "react";
import { db } from '../../../../config/firebase';
import { getDocs, collection, deleteDoc, doc } from 'firebase/firestore';
import CreateCourses from "./CreateCourses";
import SearchBar from "../../SearchBar";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input } from "@material-tailwind/react";

export default function Courses() {
    const [currentCourse, setCurrentCourse] = useState(null);
    const [courses, setCourses] = useState([]);

    const [subjects, setSubjects] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const CourseCollectionRef = collection(db, "Course");
    const SubjectCollectionRef = collection(db, "Subject");
    const [isOpen, setIsOpen] = useState(false);


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

    const deleteCourse = async () => {
        // console.log("delete ");
        if (deleteId) {
            try {
                await deleteDoc(doc(db, "Course", deleteId));
                fetchCourses();
            } catch (err) {
                console.error("Error deleting courses:", err);
            }
        }
        setOpenDelete(false);
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

                                <Dialog open={openDelete} handler={() => setOpenDelete(false)}>
                                    <DialogHeader>Confirm Deletion</DialogHeader>
                                    <DialogBody>Are you sure you want to delete this instructor? This action cannot be undone.</DialogBody>
                                    <DialogFooter>
                                        <Button variant="text" color="gray" onClick={() => setOpenDelete(false)}>Cancel</Button>
                                        <Button variant="filled" color="red" onClick={deleteCourse}>Yes, Delete</Button>
                                    </DialogFooter>
                                </Dialog>
                                <td>
                                        <div className="flex items-center space-x-2">
                                            <button onClick={() => { setDeleteId(course.id); setOpenDelete(true); }} className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600">
                                                Delete
                                            </button>
                                            <button onClick={() => handleEditClick(course)} className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600">
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

