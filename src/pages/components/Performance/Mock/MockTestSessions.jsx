import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';  // ✅ Import useNavigate
import { db } from '../../../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function MockTestSession() {
    const location = useLocation();
    const navigate = useNavigate();  // ✅ Initialize navigate

    const student = location.state?.student;
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
                console.error("Student document not found");
            }
        } catch (error) {
            console.error("Error fetching mock tests:", error);
        }
    };

    // ✅ Fix: Define the function properly
    const handleCreateMockClick = () => {
        navigate("/createMockTest", { state: { student } });  // ✅ Navigate to CreateMockTest with student data
    };

    return (
        <div className="ml-[20rem] p-4">
            <h1>Mock Test Sessions</h1>
            {student ? (
                <p>Mock tests for: <strong>{student.first_name}</strong></p>
            ) : (
                <p style={{ color: 'red' }}>⚠ No student selected!</p>
            )}

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

            <button onClick={handleCreateMockClick} style={{ marginTop: "20px", padding: "10px", background: "blue", color: "white", cursor: "pointer" }}>
                + Create Mock Test
            </button>
        </div>
    );
}
