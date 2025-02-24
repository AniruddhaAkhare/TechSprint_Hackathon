import React, { useState, useEffect } from 'react';
import { db } from '../../../../config/firebase';
import { doc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';
import { useLocation } from 'react-router-dom';

export default function CreateAttendenceRemarks() {
    const location = useLocation();
    const student = location.state?.student; // Get selected student from state

    const [testDetails, setTestDetails] = useState({
        subject: '',
        present: '',
        remarks: '',
        admin: '',
        updatedOn: '',
    });

    const [attendanceRemarks, setAttendanceRemarks] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); 
    
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
                setAttendanceRemarks(data.attendenceRemarks || []);
            } else {
                console.error("Student document not found");
            }
        } catch (error) {
            console.error("Error fetching attendance data:", error);
        }
    };

    const handleInputChange = (e) => {
        setTestDetails({ ...testDetails, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!student || !student.first_name) {
            alert("Error: No student selected!");
            return;
        }

        const newAttenceRemarks = {
            subject: testDetails.subject,
            present: testDetails.present,
            remarks: testDetails.remarks,
            admin: testDetails.admin,
            updatedOn: testDetails.updatedOn,
            timestamp: new Date()
        };

        try {
            const studentRef = doc(db, "student", student.id);
            await updateDoc(studentRef, {
                attendenceRemarks: arrayUnion(newAttenceRemarks) // Append to the mockTests array
            });

            alert("Mock test added successfully!");
            setAttendanceRemarks([...attendanceRemarks, newAttenceRemarks]); // Update local state
        } catch (error) {
            console.error("Error adding mock test:", error);
            alert("Failed to add mock test. See console for details.");
        }
    };

    const filteredRemarks = attendanceRemarks.filter(remark =>
        remark.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div  className="ml-[20rem] p-4">
            <h1>Create Attendance Remarks</h1>
            {student ? (
                <p>Adding Attendance remarks for: <strong>{student.first_name}</strong></p>
            ) : (
                <p style={{ color: 'red' }}>⚠ No student selected!</p>
            )}

            <input
                type="text"
                placeholder="Search by subject"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: "20px", padding: "8px", width: "100%" }}
            />

            <form onSubmit={handleSubmit}>
                <label>Subject:</label>
                <input type="text" name="subject" value={testDetails.subject} onChange={handleInputChange} required />

                <label>Present session count:</label>
                <input type="number" name="present" value={testDetails.present} onChange={handleInputChange} required />

                <label>Remarks:</label>
                <input type="text" name="remarks" value={testDetails.remarks} onChange={handleInputChange} required />

                <label>Updated by:</label>
                <input type="text" name="admin" value={testDetails.admin} onChange={handleInputChange} required />

                <label>Updated on:</label>
                <input type="date" name="updatedOn" value={testDetails.updatedOn} onChange={handleInputChange} required />

                <button type="submit">Add Attendance remarks</button>
            </form>

            {/* Display existing attendance remarks */}
            <h2>Attendance Remark History</h2>
            {filteredRemarks.length > 0 ? (
                <ul>
                    {filteredRemarks.map((attendance, index) => (
                        <li key={index}>
                            <strong>{attendance.subject}</strong> - Present session count: {attendance.present} - Remarks: {attendance.remarks} - Updated by: {attendance.admin} - Updated On: {attendance.updatedOn}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No attendance remarks are added yet.</p>
            )}
        </div>
    );
}
