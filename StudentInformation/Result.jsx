import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../src/config/firebase';

export default function  Result ({ studentId })  {
    const [results, setResults] = useState([]);
    const [newResults, setNewResults] = useState({ result: '', marks_obtained: '', max_marks: '', student_id: studentId });

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const resultsCollection = collection(db, 'results');
            const snapshot = await getDocs(resultsCollection);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setResults(data);
        } catch (error) {
            console.error("Error fetching results: ", error);
            alert("Failed to fetch results. Please try again later.");
        }
    };

    const addResults = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'results'), newResults);
            setNewResults({ result: '', marks_obtained: '', max_marks: '', student_id: studentId }); 
            fetchResults();
        } catch (error) {
            console.error("Error adding results: ", error);
            alert("Failed to add result. Please try again."); 
        }
    };

    const updateResults = async (id) => {
        const resultsRef = doc(db, 'results', id);
        try {
            await updateDoc(resultsRef, newResults);
            fetchResults(); 
        } catch (error) {
            console.error("Error updating results: ", error);
            alert("Failed to update result. Please try again."); 
        }
    };

    const deleteResults = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this grade?");
        if (!confirmDelete) return;

        try {
            await deleteDoc(doc(db, 'results', id));
            fetchResults();
        } catch (error) {
            console.error("Error deleting results: ", error);
            alert("Failed to delete result. Please try again."); 
        }
    };

    return (
        <div className="grades-component">
            <h1>Manage Result</h1>
            <form onSubmit={addResults}>
                <input
                    type="text"
                    placeholder="Result"
                    value={newResults.result}
                    onChange={(e) => setNewResults({ ...newResults, result: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Marks Obtained"
                    value={newResults.marks_obtained}
                    onChange={(e) => setNewResults({ ...newResults, marks_obtained: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Max Marks"
                    value={newResults.max_marks}
                    onChange={(e) => setNewResults({ ...newResults, max_marks: e.target.value })}
                    required
                />
                <button type="submit" className='ml-2 btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200'>Add Result</button>
            </form>

            <table className='table-data table'>
                <thead className='table-secondary'>
                    <tr>
                        <th>Result</th>
                        <th>Marks Obtained</th>
                        <th>Max Marks</th>
                        <th>Student ID</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {results
                        .filter(result => result.student_id === studentId) 
                        .map(result => (
                            <tr key={result.id}>
                                <td>{result.result}</td>
                                <td>{result.marks_obtained}</td>
                                <td>{result.max_marks}</td>
                                <td>{result.student_id}</td>
                                <td>
                                    <button onClick={() => { updateResults(result.id) }} className='ml-2 btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200'>Edit</button>
                                    <button onClick={() => { deleteResults(result.id) }} className='ml-2 btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200'>Delete</button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
};