

import React, { useState, useEffect } from 'react';
import { db } from '../../../../config/firebase';
import { doc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';
import { useLocation } from 'react-router-dom';

export default function CreateFeesRemarks() {
    const location = useLocation();
    const student = location.state?.student; // Get selected student from state

    const [testDetails, setTestDetails] = useState({
        subcategory: '',
        remarks: '',
        admin: '',
        date: ''
    });

    const [feesRemarks, setFeesRemarks] = useState([]);

    // Fetch existing mock tests of the student
    useEffect(() => {
        if (student?.id) {
            fetchFeesRemarks();
        }
    }, [student]);

    const fetchFeesRemarks = async () => {
        try {
            const studentRef = doc(db, "student", student.id);
            const studentSnap = await getDoc(studentRef);

            if (studentSnap.exists()) {
                const data = studentSnap.data();
                setFeesRemarks(data.feesRemarks || []);
            } else {
                console.error("Student document not found");
            }
        } catch (error) {
            console.error("Error fetching fees data:", error);
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

        const newFeesRemarks = {

            subcategory: testDetails.subcategory,
            remarks: testDetails.remarks,
            admin: testDetails.admin,
            date: testDetails.date,
            timestamp: new Date()
        };

        try {
            const studentRef = doc(db, "student", student.id);
            await updateDoc(studentRef, {
                feesRemarks: arrayUnion(newFeesRemarks) // Append to the mockTests array
            });

            alert("Mock test added successfully!");
            setFeesRemarks([...feesRemarks, newFeesRemarks]); // Update local state
        } catch (error) {
            console.error("Error adding mock test:", error);
            alert("Failed to add mock test. See console for details.");
        }
    };

    return (
        <div  className="ml-[20rem] p-4">
            <h1>Create Fees Remarks</h1>
            {student ? (
                <p>Adding Fees remarks for: <strong>{student.first_name}</strong></p>
            ) : (
                <p style={{ color: 'red' }}>⚠ No student selected!</p>
            )}

            <form onSubmit={handleSubmit}>
                <label>Subcategory:</label>
                <input type="text" name="subcategory" value={testDetails.subcategory} onChange={handleInputChange} required />

                <label>Remarks:</label>
                <input type="text" name="remarks" value={testDetails.remarks} onChange={handleInputChange} required />


                <label>Admin:</label>
                <input type="text" name="admin" value={testDetails.admin} onChange={handleInputChange} required />

                <label>Date:</label>
                <input type="date" name="date" value={testDetails.date} onChange={handleInputChange} required />

                <button type="submit">Add Fees remarks</button>
            </form>

            {/* Display existing mock tests */}
            <h2>Fees remark History</h2>
            {feesRemarks.length > 0 ? (
                <ul>
                    {feesRemarks.map((fees, index) => (
                        <li key={index}>
                            <strong>{fees.subcategory}</strong> - Remarks: {fees.remarks} - Admin: {fees.admin} - Date: {fees.date}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No fees remarks are added yet.</p>
            )}
        </div>
    );
}
