import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, getDocs, doc, writeBatch, arrayUnion, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input } from "@material-tailwind/react";

export default function StudentDetails() {
    const { adminId } = useParams();
    const [students, setStudents] = useState([]);
    const [course, setCourse] = useState([]);
    const [status, setStatus] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState([]);
    const navigate = useNavigate();

    const [openDelete, setOpenDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        fetchStudents();
        fetchCourse();
    }, []);

    const fetchStudents = async () => {
        const snapshot = await getDocs(collection(db, "student"));
        setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const fetchCourse = async () => {
        const snapshot = await getDocs(collection(db, "Course"));
        setCourse(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const handleStudentSelect = (id) => {
        setSelectedStudents(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    };

    const handleCourseSelect = (id) => {
        setSelectedCourse(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
    };

    const handleStatusChange = async (studentId, newStatus) => {
        try {
            const studentRef = doc(db, "student", studentId);
            await updateDoc(studentRef, {
                status: newStatus
            });
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
                fetchStudents();
            } catch (err) {
                console.error("Error deleting student:", err);
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

                batch.update(studentRef, {
                    course_details: updatedCourseDetails
                });

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
        <div className="flex-col ml-80 p-4 w-screen">
            <ToastContainer position="top-right" autoClose={3000} />
            <h1 className="text-2xl font-bold mb-4">Student Details</h1>
            <button onClick={() => navigate('/studentdetails/addstudent')} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
                Add Student
            </button>
            <div className="overflow-x-auto mt-6">

                <Dialog open={openDelete} handler={() => setOpenDelete(false)}>
                    <DialogHeader>Confirm Deletion</DialogHeader>
                    <DialogBody>Are you sure you want to delete this student? This action cannot be undone.</DialogBody>
                    <DialogFooter>
                        <Button variant="text" color="gray" onClick={() => setOpenDelete(false)}>Cancel</Button>
                        <Button variant="filled" color="red" onClick={deleteStudent}>Yes, Delete</Button>
                    </DialogFooter>
                </Dialog>

                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th>Select</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Actions</th>

                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student.id} >
                                <td>
                                    <input type="checkbox" onChange={() => handleStudentSelect(student.id)} />
                                </td>
                                <td onClick={() => { navigate(`/studentdetails/${student.id}`) }}>{student.first_name}</td>
                                <td onClick={() => { navigate(`/studentdetails/${student.id}`) }}>{student.last_name}</td>
                                <td onClick={() => { navigate(`/studentdetails/${student.id}`) }}>{student.email}</td>
                                <td onClick={() => { navigate(`/studentdetails/${student.id}`) }}>{student.phone}</td>
                                <td>
                                    <select
                                        value={student.status ? student?.status : 'enrolled'}
                                        onChange={(e) => handleStatusChange(student.id, e.target.value)}
                                        className="p-1 border rounded"
                                    >
                                        <option value="enquiry">Enquiry</option>
                                        <option value="enrolled">Enrolled</option>
                                        <option value="deferred">Deferred</option>
                                        <option value="completed">Complete</option>
                                    </select>
                                </td>

                                <td>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => { setDeleteId(student.id); setOpenDelete(true); }}
                                            className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600">
                                            Delete
                                        </button>
                                        <button onClick={() => navigate(`/studentdetails/updatestudent/${student.id}`)} className="bg-blue-500 text-white px-3 py-1">Update</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <h2 className="text-xl font-bold mt-6">Select Courses</h2>
            <div>
                <select id="courseSelect" onChange={(e) => handleCourseSelect(e.target.value)}>
                    <option value="">-- Select a course --</option>
                    {course.map(course => (
                        <option key={course.id} value={course.id}>
                            {course.name}
                        </option>
                    ))}
                </select>
            </div>

            <button
                onClick={handleBulkEnrollment}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 mt-4 rounded-md transition duration-300"
                disabled={selectedStudents.length === 0 || selectedCourse.length === 0}
            >
                Enroll Selected Students
            </button>
        </div>
    );
}
