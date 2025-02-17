import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure you have the correct path to your Firebase config

export default function  Grades ({ studentId })  {
    const [grades, setGrades] = useState([]);
    const [newGrade, setNewGrade] = useState({ grade: '', marks_obtained: '', max_marks: '', student_id: studentId});

    useEffect(() => {
        fetchGrades();
    }, []);

    const fetchGrades = async () => {
        try {
            const gradesCollection = collection(db, 'Grades');
            const snapshot = await getDocs(gradesCollection);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log(data); // Log the fetched grades to see their structure
            setGrades(data);
        } catch (error) {
            console.error("Error fetching grades: ", error);
        }
    };

    const addGrade = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'Grades'), newGrade);
            setNewGrade({ grade: '', marks_obtained: '', max_marks: '', student_id: studentId });
            fetchGrades(); // Refresh the list
        } catch (error) {
            console.error("Error adding grade: ", error);
        }
    };

    const updateGrade = async (id) => {
        const gradeRef = doc(db, 'Grades', id);
        try {
            await updateDoc(gradeRef, newGrade);
            fetchGrades(); // Refresh the list
        } catch (error) {
            console.error("Error updating grade: ", error);
        }
    };

    const deleteGrade = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this grade?");
        if (!confirmDelete) return;

        try {
            await deleteDoc(doc(db, 'Grades', id));
            fetchGrades(); // Refresh the list
        } catch (error) {
            console.error("Error deleting grade: ", error);
        }
    };

    return (
        <div className="grades-component">
            <h1>Manage Grades</h1>
            <form onSubmit={addGrade}>
                <input
                    type="text"
                    placeholder="Grade"
                    value={newGrade.grade}
                    onChange={(e) => setNewGrade({ ...newGrade, grade: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Marks Obtained"
                    value={newGrade.marks_obtained}
                    onChange={(e) => setNewGrade({ ...newGrade, marks_obtained: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Max Marks"
                    value={newGrade.max_marks}
                    onChange={(e) => setNewGrade({ ...newGrade, max_marks: e.target.value })}
                    required
                />
                <button type="submit">Add Grade</button>
            </form>
            <table className='table-data table'>
                <thead className='table-secondary'>
                    <tr>
                        <th>Grade</th>
                        <th>Marks Obtained</th>
                        <th>Max Marks</th>
                        <th>Student ID</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {grades
                        .filter(grade => grade.student_id === studentId) // Filter based on student_id
                        .map(grade => (
                            <tr key={grade.id}>
                                <td>{grade.grade}</td>
                                <td>{grade.marks_obtained}</td>
                                <td>{grade.max_marks}</td>
                                <td>{grade.student_id}</td>
                                <td>
                                    <button onClick={() => updateGrade(grade.id)}>Edit</button>
                                    <button onClick={() => deleteGrade(grade.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
};

// export default Grades;
