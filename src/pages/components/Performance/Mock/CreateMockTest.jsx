import React, { useState, useEffect } from 'react';
import { db } from '../../../../config/firebase';
import { doc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';
import { useLocation } from 'react-router-dom';

export default function CreateMockTest() {
    const location = useLocation();
    const student = location.state?.student; 
    const [testDetails, setTestDetails] = useState({
        subcategory: '',
        rating: '',
        remarks: '',
        date:'',
        admin:''
    });

    const [mockTests, setMockTests] = useState([]);

    useEffect(() => {
        if (student?.id) {
            fetchMockTests();
        }
    }, [student]);

    const fetchMockTests = async () => {
        try {
            const studentRef = doc(db, "student", student.id);
            const studentSnap = await getDoc(studentRef);

            if (studentSnap.exists()) {
                const data = studentSnap.data();
                setMockTests(data.mockTests || []);
            } else {
                //console.error("Student document not found");
            }
        } catch (error) {
            //console.error("Error fetching mock tests:", error);
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

        const newMockTest = {
            subcategory: testDetails.subcategory,
            rating: testDetails.rating,
            remarks: testDetails.remarks,
            date: testDetails.date,
            admin: testDetails.admin
        };

        try {
            const studentRef = doc(db, "student", student.id);
            await updateDoc(studentRef, {
                mockTests: arrayUnion(newMockTest) 
            });

            alert("Mock test added successfully!");
            setMockTests([...mockTests, newMockTest]); 
        } catch (error) {
            //console.error("Error adding mock test:", error);
            alert("Failed to add mock test. See console for details.");
        }
    };

    return (
        <div className="ml-[20rem] p-4">
            <h1>Create Mock Test</h1>
            {student ? (
                <p>Adding mock test for: <strong>{student.first_name}</strong></p>
            ) : (
                <p style={{ color: 'red' }}>⚠ No student selected!</p>
            )}

            <form onSubmit={handleSubmit}>
                <label>Subcategory:</label>
                <input type="text" name="subcategory" value={testDetails.subcategory} onChange={handleInputChange} required />

                <label>Rating:</label>
                <input type="number" name="rating" value={testDetails.rating} onChange={handleInputChange} required />

                <label>Remarks:</label>
                <input type="text" name="remarks" value={testDetails.remarks} onChange={handleInputChange} required />

                <label>Admin:</label>
                <input type="text" name="admin" value={testDetails.admin} onChange={handleInputChange} required />

                <label>Date:</label>
                <input type="date" name="date" value={testDetails.date} onChange={handleInputChange} required />

                <button type="submit">Add Mock Test</button>
            </form>

           
            <h2>Mock Test History</h2>
            {mockTests.length > 0 ? (
                <ul>
                    {mockTests.map((mock, index) => (
                        <li key={index}>
                            <strong>{mock.subcategory}</strong> - Rating: {mock.rating} - Remarks: {mock.remarks} - Date: {mock.date} - Admin: {mock.admin}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No mock tests added yet.</p>
            )}
        </div>
    );
}
