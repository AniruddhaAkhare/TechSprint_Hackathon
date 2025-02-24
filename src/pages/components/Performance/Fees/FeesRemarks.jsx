

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';  // ✅ Import useNavigate
import { db } from '../../../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function FeesRemarks() {
    const location = useLocation();
    const navigate = useNavigate();  
    const student = location.state?.student;
    const [feesRemarks, setFeesRemarks] = useState([]);

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
            console.error("Error fetching Fees remarks:", error);
        }
    };

    const handleCreateFeesRemarks = () => {
        navigate("/createFeesRemarks", { state: { student } });  // ✅ Navigate to CreateMockTest with student data
    };

    return (
        <div>
            <h1>Fees Remarks</h1>
            {student ? (
                <p>Fees remarks for :  <strong>{student.first_name}</strong></p>
            ) : (
                <p style={{ color: 'red' }}>⚠ No student selected!</p>
            )}

            <h2>Fees remarks History</h2>
            {feesRemarks.length > 0 ? (
                <ul>
                    {feesRemarks.map((fees, index) => (
                        <li key={index}>
                            <strong>{fees.subcategory}</strong> - Remarks: {fees.remarks} - Admin: {fees.admin} - Date: {fees.date}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No fees remark are added yet.</p>
            )}

            <button onClick={handleCreateFeesRemarks} style={{ marginTop: "20px", padding: "10px", background: "blue", color: "white", cursor: "pointer" }}>
                + Create Fees remarks
            </button>
        </div>
    );
}
