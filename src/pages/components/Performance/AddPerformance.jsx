import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../../config/firebase.js'
import { collection, getDocs, addDoc } from 'firebase/firestore';

export default function AddPerformance() {
    const [performanceType, setPerformanceType] = useState("");
    const [students, setStudents] = useState([]);
    const [showStudents, setShowStudents] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        if (performanceType === "mockTests") {
            fetchStudents();
        } else if (performanceType === "attendanceReview") {
            fetchStudents();
        } else if (performanceType === "feesReview") {
            fetchStudents();
        } else if (performanceType === "examinationReview") {
            fetchStudents();
        } else {
            setShowStudents(false);
        }
    }, [performanceType]);

    const fetchStudents = async () => {
        try {
            const studentsCollection = collection(db, "student");
            const studentData = await getDocs(studentsCollection);
            const studentList = studentData.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setStudents(studentList);
            setShowStudents(true);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    const addMockTest = async (student) => {
        try {
            if (!student || !student.first_name) {
                console.error("Error: student or student.first_name is undefined", student);
                return;
            }

            const mockTestData = {
                studentName: student.first_name,
                studentId: student.id,
                timestamp: new Date()
            };

            await addDoc(collection(db, `students/${student.id}/mockSessions`), mockTestData);
            alert("Mock test added successfully!");
        } catch (error) {
            console.error("Error adding mock test:", error);
        }
    };

    const addAttendanceReview = async (student) => {
        try {
            if (!student || !student.first_name) {
                console.error("Error: student or student.first_name is undefined", student);
                return;
            }

            const attendanceData = {
                studentName: student.first_name,
                studentId: student.id,
                timestamp: new Date()
            };

            await addDoc(collection(db, `students/${student.id}/attendanceReview`), attendanceData);
            alert("Attendance review added successfully!");
        } catch (error) {
            console.error("Error adding attendance review:", error);
        }
    };

    const addFeesData = async (student) => {
        try {
            if (!student || !student.first_name) {
                console.error("Error: student or student.first_name is undefined", student);
                return;
            }

            const feesData = {
                studentName: student.first_name,
                studentId: student.id,
                timestamp: new Date()
            };

            await addDoc(collection(db, `students/${student.id}/feesReview`), feesData);
            alert("Fees data added successfully!");
        } catch (error) {
            console.error("Error adding fees data:", error);
        }
    };

    const addExaminationReview = async (student) => {
        try {
            if (!student || !student.first_name) {
                console.error("Error: student or student.first_name is undefined", student);
                return;
            }

            const examinationReview = {
                studentName: student.first_name,
                studentId: student.id,
                timestamp: new Date()
            };

            await addDoc(collection(db, `students/${student.id}/examinationReview`), examinationReview);
            alert("Examination review added successfully!");
        } catch (error) {
            console.error("Error adding examination review:", error);
        }
    };

    const handleStudentClick = (student) => {
        if (performanceType === "mockTests") {
            addMockTest(student);
            navigate("/mocktestsessions", { state: { student } });
        } else if (performanceType === "attendanceReview") {
            addAttendanceReview(student);
            navigate("/createAttendanceRemarks", { state: { student } });
        } else if (performanceType === "feesReview") {
            addFeesData(student);
            navigate("/createFeesRemarks", { state: { student } });
        } else if (performanceType === "examinationReview") {
            addExaminationReview(student);
            navigate("/createExaminationRemarks", { state: { student } });

        }
    };

    return (
        <div className='flex-col w-screen p-4 ml-80'>
            <h1>Add Performance</h1>
            <form>
                <label htmlFor="performanceType">Select Performance Type:</label>
                <select
                    id="performanceType"
                    value={performanceType}
                    onChange={(e) => setPerformanceType(e.target.value)}
                    required
                >
                    <option value="">Select</option>
                    <option value="mockTests">Mock Tests</option>
                    <option value="attendanceReview">Attendance review</option>
                    <option value="feesReview">Fees review</option>
                    <option value="examinationReview">Examination review</option>
                </select>
            </form>

            {showStudents && (
                <div>
                    <h2>Select Student</h2>
                    <ul>
                        {/* Search Input */}
                        <input
                            type="text"
                            placeholder="Search student by name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                marginBottom: "20px",
                                padding: "8px",
                                width: "100%",
                                maxWidth: "400px",
                                borderRadius: "4px",
                                border: "1px solid #ccc"
                            }}
                        />
                        {students
                            .filter(student => 
                                student.first_name?.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((student) => (

                            <li
                                key={student.id}
                                onClick={() => handleStudentClick(student)}
                                style={{ cursor: "pointer", padding: "8px", borderBottom: "1px solid #ccc" }}
                            >
                                {student.first_name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
