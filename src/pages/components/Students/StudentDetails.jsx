import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, getDocs, doc, writeBatch, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";

export default function StudentDetails() {
    const { adminId } = useParams();
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]); // New state for filtered list
    const [course, setCourse] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState([]);
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [searchQuery, setSearchQuery] = useState(""); // New state for search input

    useEffect(() => {
        fetchStudents();
        fetchCourse();
    }, []);

    const fetchStudents = async () => {
        const snapshot = await getDocs(collection(db, "student"));
        const studentList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStudents(studentList);
        setFilteredStudents(studentList); // Initialize filtered list
    };

    const fetchCourse = async () => {
        const snapshot = await getDocs(collection(db, "Course"));
        setCourse(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    // Handle search input change
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = students.filter(student =>
            student.first_name.toLowerCase().includes(query) ||
            student.last_name.toLowerCase().includes(query) ||
            student.email.toLowerCase().includes(query) ||
            student.phone.toLowerCase().includes(query)
        );
        setFilteredStudents(filtered);
    };

    const handleStudentSelect = (id) => {
        setSelectedStudents(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    };

    const handleCourseSelect = (e) => {
        const courseId = e.target.value;
        setSelectedCourse(prev => prev.includes(courseId) ? prev.filter(c => c !== courseId) : [...prev, courseId]);
    };

    const handleStatusChange = async (studentId, newStatus) => {
        try {
            const studentRef = doc(db, "student", studentId);
            await updateDoc(studentRef, { status: newStatus });
            toast.success(`Status updated to ${newStatus}`);
            fetchStudents();
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        }
    };

    const deleteStudent = async () => {
        if (deleteId) {
            try {
                await deleteDoc(doc(db, "student", deleteId));
                toast.success("Student deleted successfully!");
                fetchStudents();
            } catch (err) {
                console.error("Error deleting student:", err);
                toast.error("Failed to delete student");
            }
        }
        setOpenDelete(false);
    };

    const handleBulkEnrollment = async () => {
        if (selectedStudents.length === 0 || selectedCourse.length === 0) {
            toast.error("Please select at least one student and one course.");
            return;
        }

        try {
            const batch = writeBatch(db);
            const enrollmentTimestamp = new Date();
            let studentsSkipped = 0;
            let enrollmentsCreated = 0;
            const courseMap = new Map(course.map(c => [c.id, c]));

            for (const studentId of selectedStudents) {
                const studentRef = doc(db, "student", studentId);
                const studentSnapshot = await getDocs(collection(db, "student"));
                const student = studentSnapshot.docs.find(doc => doc.id === studentId)?.data();

                if (!student) continue;

                const existingCourses = student.course_details?.map(c => c.courseId) || [];
                const newCourseIds = selectedCourse.filter(courseId => !existingCourses.includes(courseId));

                if (newCourseIds.length === 0) {
                    studentsSkipped++;
                    continue;
                }

                const newCourseDetails = newCourseIds.map(courseId => {
                    const courseDetails = courseMap.get(courseId);
                    return {
                        courseId,
                        courseName: courseDetails?.name || 'Unknown Course',
                        enrolledAt: enrollmentTimestamp
                    };
                });

                const updatedCourseDetails = [...(student.course_details || []), ...newCourseDetails];
                batch.update(studentRef, { course_details: updatedCourseDetails });

                for (const courseId of newCourseIds) {
                    const enrollmentRef = doc(collection(db, "enrollment"));
                    const courseDetails = courseMap.get(courseId);

                    batch.set(enrollmentRef, {
                        enrollmentId: enrollmentRef.id,
                        studentId,
                        studentName: `${student.first_name} ${student.last_name}`,
                        studentEmail: student.email,
                        courseId,
                        courseName: courseDetails?.name || 'Unknown Course',
                        enrolledAt: enrollmentTimestamp,
                        status: 'active',
                        lastUpdated: enrollmentTimestamp
                    });
                    enrollmentsCreated++;
                }
            }

            await batch.commit();
            await fetchStudents();

            if (studentsSkipped > 0) {
                toast.warn(`${studentsSkipped} students were already enrolled in the selected courses.`);
            }
            toast.success(`Created ${enrollmentsCreated} enrollment records for ${selectedStudents.length - studentsSkipped} students.`);

            setSelectedStudents([]);
            setSelectedCourse([]);
        } catch (error) {
            console.error("Error enrolling students:", error);
            toast.error("Failed to enroll students. Please try again.");
        }
    };

    return (
        <div className="p-2">
        {/* <div className="min-h-screen bg-gray-50 p-6 ml-80 w-screen justify-between items-center"> */}
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="max-w-8xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Student Details</h1>
                    <button
                        onClick={() => navigate('/studentdetails/addstudent')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        Add Student
                    </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    {/* Search Bar */}
                    <div className="mb-6">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearch}
                            placeholder="Search by name, email, or phone..."
                            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">
                                        <input
                                            type="checkbox"
                                            onChange={(e) => setSelectedStudents(e.target.checked ? filteredStudents.map(s => s.id) : [])}
                                            className="rounded"
                                        />
                                    </th>
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">First Name</th>
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">Last Name</th>
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">Email</th>
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">Phone</th>
                                    {/* <th className="p-3 text-sm font-medium text-gray-600 text-left">Branch</th> */}
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">Status</th>
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map(student => (
                                    <tr key={student.id} className="border-b hover:bg-gray-50 cursor-pointer ">
                                        <td className="p-3 hover:text-blue-600">
                                            <input
                                                type="checkbox"
                                                checked={selectedStudents.includes(student.id)}
                                                onChange={() => handleStudentSelect(student.id)}
                                                className="rounded"
                                            />
                                        </td>
                                        <td
                                            className="p-3 text-gray-700 cursor-pointer hover:text-blue-600"
                                            onClick={() => navigate(`/studentdetails/${student.id}`)}
                                        >
                                            {student.first_name}
                                        </td>
                                        <td
                                            className="p-3 text-gray-700 cursor-pointer hover:text-blue-600"
                                            onClick={() => navigate(`/studentdetails/${student.id}`)}
                                        >
                                            {student.last_name}
                                        </td>
                                        <td
                                            className="p-3 text-gray-700 cursor-pointer hover:text-blue-600"
                                            onClick={() => navigate(`/studentdetails/${student.id}`)}
                                        >
                                            {student.email}
                                        </td>
                                        <td
                                            className="p-3 text-gray-700 cursor-pointer hover:text-blue-600"
                                            onClick={() => navigate(`/studentdetails/${student.id}`)}
                                        >
                                            {student.phone}
                                        </td>
                                        <td className="p-3">
                                            <select
                                                value={student.status || 'enrolled'}
                                                onChange={(e) => handleStatusChange(student.id, e.target.value)}
                                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="enquiry">Enquiry</option>
                                                <option value="enrolled">Enrolled</option>
                                                <option value="deferred">Deferred</option>
                                                <option value="completed">Completed</option>
                                            </select>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => navigate(`/studentdetails/updatestudent/${student.id}`)}
                                                    className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition duration-200"
                                                >
                                                    Update
                                                </button>
                                                <button
                                                    onClick={() => { setDeleteId(student.id); setOpenDelete(true); }}
                                                    className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition duration-200"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Course Selection and Bulk Enrollment */}
                <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-medium text-gray-700 mb-4">Bulk Enrollment</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Select Courses</label>
                            <select
                                value={selectedCourse.length > 0 ? selectedCourse[0] : ""}
                                onChange={handleCourseSelect}
                                className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">-- Select a course --</option>
                                {course.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={handleBulkEnrollment}
                            disabled={selectedStudents.length === 0 || selectedCourse.length === 0}
                            className={`bg-green-600 text-white px-4 py-2 rounded-md transition duration-200 ${selectedStudents.length === 0 || selectedCourse.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
                        >
                            Enroll Selected Students
                        </button>
                    </div>
                </div>

                {/* Delete Confirmation Dialog */}
                <Dialog open={openDelete} handler={() => setOpenDelete(false)}>
                    <DialogHeader className="text-gray-800">Confirm Deletion</DialogHeader>
                    <DialogBody className="text-gray-700">
                        Are you sure you want to delete this student? This action cannot be undone.
                    </DialogBody>
                    <DialogFooter>
                        <Button
                            variant="text"
                            color="gray"
                            onClick={() => setOpenDelete(false)}
                            className="mr-2"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="filled"
                            color="red"
                            onClick={deleteStudent}
                        >
                            Yes, Delete
                        </Button>
                    </DialogFooter>
                </Dialog>
            </div>
        </div>
    );
}