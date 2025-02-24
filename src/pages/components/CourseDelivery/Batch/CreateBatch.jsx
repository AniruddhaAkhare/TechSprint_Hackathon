

import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { db } from '../../../../config/firebase';
import { getDocs, collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

const CreateBatches = ({ isOpen, toggleSidebar, batch }) => {
    const navigate = useNavigate();
    const [batchName, setBatchName] = useState('');
    const [curriculums, setCurriculums] = useState([]);
    const [batchDuration, setBatchDuration] = useState('');
    const [batchManager, setBatchManager] = useState([]);
    const [batchFaculty, setBatchFaculty] = useState([]);
    const [student, setStudents] = useState([]);

    const [selectedBatchManagers, setSelectedBatchManagers] = useState([]);
    const [selectedBatchFaculty, setSelectedBatchFaculty] = useState([]);

    const handleManagerSelection = (id) => {
        setSelectedBatchManagers(prev =>
            prev.includes(id) ? prev.filter(managerId => managerId !== id) : [...prev, id]
        );
    };

    const handleFacultySelection = (id) => {
        setSelectedBatchFaculty(prev =>
            prev.includes(id) ? prev.filter(facultyId => facultyId !== id) : [...prev, id]
        );
    };


    useEffect(() => {
        const fetchFaculty = async () => {
            const snapshot = await getDocs(collection(db, "Instructor")); // Fetch instructors from Firestore
            const instructorData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBatchFaculty(instructorData); // ✅ Set the faculty state correctly
        };

        fetchFaculty(); // Call the function to fetch instructors

        const fetchManager = async () => {
            const snapshot = await getDocs(collection(db, "Instructor")); // Fetch managers from Firestore
            const managerData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBatchManager(managerData); // ✅ Fix: Set managers instead of faculty
        };

        fetchManager();

        const fetchCurriculum = async () => {
            const snapshot = await getDocs(collection(db, "Curriculum"));
            const curriculumData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCurriculums(curriculumData);
        };

        fetchCurriculum();

        const fetchStudent = async () => {
            const snapshot = await getDocs(collection(db, "student"));
            const studentData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setStudents(studentData);
        };

        fetchStudent();

        if (batch) {
            setBatchName(batch.name);
            setBatchDuration(batch.duration);
        } else {
            setBatchName("");
            setBatchDuration("");
        }
    }, [batch]);

    const batchCollectionRef = collection(db, "Batch");


    const onSubmitBatch = async (e) => {
    e.preventDefault();

    if (!batchName.trim() || !batchDuration.trim()) {
        alert("Please fill in all required fields");
        return;
    }

    try {
        let batchId;
        if (batch) {
            const batchDoc = doc(db, "Batch", batch.id);
            await updateDoc(batchDoc, {
                name: batchName,
                duration: batchDuration,
            });

            batchId = batch.id;
        } else {
            const docRef = await addDoc(batchCollectionRef, {
                name: batchName,
                duration: batchDuration,
            });

            batchId = docRef.id;
        }

        alert("Batch successfully saved!");
        
        // ✅ Reset Form State
        setBatchName("");
        setBatchDuration("");
        setSelectedBatchManagers([]);
        setSelectedBatchFaculty([]);

        toggleSidebar();
        navigate(`/batches`);
    } catch (err) {
        console.error("Error adding document:", err);
        alert(`Error adding batch: ${err.message}`);
    }
}

    return (
        <>
            <div className={`fixed top-0 right-0 h-full bg-white w-2/5 shadow-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} p-4 overflow-y-auto`}>
                <button type="button" className="close-button" onClick={toggleSidebar}>
                    Back
                </button>

                <h1>{batch ? "Edit batch" : "Create batch"}</h1>
                <form onSubmit={onSubmitBatch}>
                    <div className="col-md-4">
                        <div className="mb-3 subfields">
                            <label htmlFor="batch_name" className="form-label">Batch Name</label>
                            <input type="text" className="form-control" value={batchName} placeholder="Batch Name" onChange={(e) => setBatchName(e.target.value)} required />
                        </div>


                        <div className="mb-3 subfields">
                            <label htmlFor="duration" className="form-label">Batch Duration</label>
                            <input type="text" className="form-control" value={batchDuration} placeholder="Enter Batch Duration" onChange={(e) => setBatchDuration(e.target.value)} required />
                        </div>

                     
                        <div className="mb-3 subfields">
                            <label className="form-label">Select Curriculum</label>
                            {curriculums.map(curriculum => (
                                <div key={curriculum.id} className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value={curriculum.id}
                                        id={`curriculum-${curriculum.id}`}
                                    />
                                    <label className="form-check-label" htmlFor={`curriculum-${curriculum.id}`}>
                                        {curriculum.name} {/* Assuming instructor has a name field */}
                                    </label>
                                </div>
                            ))}
                        </div>


                        <div className="mb-3 subfields">
                            <label className="form-label">Batch Manager</label>
                            {batchManager.map(manager => (
                                <div key={manager.id} className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={selectedBatchManagers.includes(manager.id)}
                                        onChange={() => handleManagerSelection(manager.id)}
                                        id={`manager-${manager.id}`}
                                    />
                                    <label className="form-check-label" htmlFor={`manager-${manager.id}`}>
                                        {manager.f_name} {manager.l_name}
                                    </label>
                                </div>
                            ))}
                        </div>


                        <div className="mb-3 subfields">
                            <label className="form-label">Batch Faculty</label>
                            {batchFaculty.map(instructor => (
                                <div key={instructor.id} className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value={instructor.id}
                                        id={`instructor-${instructor.id}`}
                                    />
                                    <label className="form-check-label" htmlFor={`instructor-${instructor.id}`}>
                                        {instructor.f_name} {/* Assuming instructor has a name field */}
                                    </label>
                                </div>
                            ))}
                        </div>

                        <div className="mb-3 subfields">
                            <label className="form-label">Select Student</label>
                            {student.map(student => (
                                <div key={student.id} className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value={student.id}
                                        id={`student-${student.id}`}
                                    />
                                    <label className="form-check-label" htmlFor={`student-${student.id}`}>
                                        {student.first_name} {/* Assuming instructor has a name field */}
                                    </label>
                                </div>
                            ))}
                        </div>



                        <div className="d-grid gap-2 d-md-flex">
                            <button type="submit">
                                {batch ? "Update" : "Create"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CreateBatches;
