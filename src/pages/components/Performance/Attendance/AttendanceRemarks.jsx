

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';  // ✅ Import useNavigate
import { db } from '../../../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function AttendanceRemarks() {
    const location = useLocation();
    const navigate = useNavigate();  
    const student = location.state?.student;
    const [attendanceRemarks, setAttendanceRemarks] = useState([]);

    useEffect(() => {
        if (student?.id) {
            fetchAttendanceRemarks();
        }
    }, [student]);

    const fetchAttendanceRemarks = async () => {
        try {
            const studentRef = doc(db, "student", student.id);
            const studentSnap = await getDoc(studentRef);

            if (studentSnap.exists()) {
                const data = studentSnap.data();
                setAttendanceRemarks(data.attendanceRemarks || []);
            } else {
                console.error("Student document not found");
            }
        } catch (error) {
            console.error("Error fetching Attendance remarks:", error);
        }
    };

    // ✅ Fix: Define the function properly
    const handleCreateAttendanceRemarks = () => {
        navigate("/createAttendanceRemarks", { state: { student } });  // Navigate to CreateMockTest with student data
    };

    return (
        <div>
            <h1>Attendance Remarks</h1>
            {student ? (
                <p>Attendance remarks for :  <strong>{student.first_name}</strong></p>
            ) : (
                <p style={{ color: 'red' }}>⚠ No student selected!</p>
            )}

            <h2>Attendance remarks History</h2>
            {attendanceRemarks.length > 0 ? (
                <ul>
                    {attendanceRemarks.map((attendance, index) => (
                        <li key={index}>
                            <strong>{attendance.subject}</strong> - Present session count : {attendance.present} - Remarks : {attendance.remarks} -  updated by : {attendance.admin} - UpdatedOn: {attendance.updatedOn}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No attendance remarks are added yet.</p>
            )}

            <button onClick={handleCreateAttendanceRemarks} className='btn bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200'>
                + Create Mock Test
            </button>
        </div>
    );
}
