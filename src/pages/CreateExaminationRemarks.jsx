import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';
import { useLocation } from 'react-router-dom';

export default function CreateExaminationRemarks() {
    const location = useLocation();
    const student = location.state?.student; // Get selected student from state

    const [testDetails, setTestDetails] = useState({
        subject: '',
        score: '',
        remarks: '',
        admin:'',
        date: ''
    });

    const [examinationRemarks, setExaminationRemarks] = useState([]);

    // Fetch existing mock tests of the student
    useEffect(() => {
        if (student?.id) {
            fetchExaminationRemarks();
        }
    }, [student]);

    const fetchExaminationRemarks = async () => {
        try {
            const studentRef = doc(db, "student", student.id);
            const studentSnap = await getDoc(studentRef);

            if (studentSnap.exists()) {
                const data = studentSnap.data();
                setExaminationRemarks(data.examinationRemarks || []);
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

        const newExaminationRemarks = {
            subject: testDetails.subject,
            score: testDetails.score,
            remarks: testDetails.remarks,
            admin: testDetails.admin,
            date: testDetails.date,
            timestamp: new Date()
        };

        try {
            const studentRef = doc(db, "student", student.id);
            await updateDoc(studentRef, {
                examinationRemarks: arrayUnion(newExaminationRemarks) // Append to the mockTests array
            });

            alert("Examination remarks are added successfully!");
            setExaminationRemarks([...examinationRemarks, newExaminationRemarks]); // Update local state
        } catch (error) {
            console.error("Error adding examination reamr:", error);
            alert("Failed to add Examination remark. See console for details.");
        }
    };

    return (
        <div>
            <h1>Create Examination Remarks</h1>
            {student ? (
                <p>Adding Examination remarks for: <strong>{student.first_name}</strong></p>
            ) : (
                <p style={{ color: 'red' }}>⚠ No student selected!</p>
            )}

            <form onSubmit={handleSubmit}>
                <label>Subject:</label>
                <input type="text" name="subject" value={testDetails.subject} onChange={handleInputChange} required />

                <label>Score:</label>
                <input type="number" name="score" value={testDetails.score} onChange={handleInputChange} required />

                <label>Remarks: </label>
                <input type="text" name="remarks" value={testDetails.remarks} onChange={handleInputChange} required />

                <label>Admin: </label>
                <input type='text' name='admin' value={testDetails.admin} onChange={handleInputChange} required/>

                <label>Date:</label>
                <input type="date" name="date" value={testDetails.date} onChange={handleInputChange} required />

                <button type="submit">Add Examination remarks</button>
            </form>

            {/* Display existing mock tests */}
            <h2>Examination remark History</h2>
            {examinationRemarks.length > 0 ? (
                <ul>
                    {examinationRemarks.map((examination, index) => (
                        <li key={index}>
                            <strong>{examination.subject}</strong> - Score: {examination.score} - Remarks: {examination.remarks} - Admin: {examination.admin} - Date: {examination.date}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No Examination remarks are added yet.</p>
            )}
        </div>
    );
}
