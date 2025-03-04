

// import React, { useState, useEffect } from 'react';
// import { db } from '../../../../config/firebase';
// import { getDocs, collection, addDoc, updateDoc, doc } from 'firebase/firestore';
// import { useNavigate } from "react-router-dom";

// const CreateBatches = ({ isOpen, toggleSidebar, batch }) => {
//     const navigate = useNavigate();
//     const [batchName, setBatchName] = useState('');
//     const [batchDuration, setBatchDuration] = useState('');
//     const [curriculums, setCurriculums] = useState([]);
//     const [allBatchManager, setAllBatchManager] = useState([]);
//     const [batchManager, setBatchManager] = useState([]);
//     const [allBatchFaculty, setAllBatchFaculty] = useState([]);
//     const [batchFaculty, setBatchFaculty] = useState([]);
//     const [students, setStudents] = useState([]);
//     const [centers, setCenters] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const [selectedBatchManagers, setSelectedBatchManagers] = useState([]);
//     const [selectedBatchFaculty, setSelectedBatchFaculty] = useState([]);
//     const [selectedCurriculums, setSelectedCurriculums] = useState([]);
//     const [selectedCenters, setSelectedCenters] = useState([]);
//     const [selectedStudents, setSelectedStudents] = useState([]);

//     useEffect(() => {
//         const fetchData = async () => {
//             const fetchCollection = async (collectionName, setter) => {
//                 const snapshot = await getDocs(collection(db, collectionName));
//                 setter(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//             };

//             await fetchCollection("Instructor", setAllBatchFaculty);
//             await fetchCollection("Instructor", setBatchManager);
//             await fetchCollection("Curriculum", setCurriculums);
//             await fetchCollection("student", setStudents);
//             await fetchCollection("Centers", setCenters);
//             setLoading(false);
//         };

//         fetchData();

//         if (batch) {
//             setBatchName(batch.name);
//             setBatchDuration(batch.duration);
//             setSelectedBatchManagers(batch.managers || []);
//             setSelectedBatchFaculty(batch.faculty || []);
//             setSelectedCurriculums(batch.curriculums || []);
//             setSelectedCenters(batch.centers || []);
//             setSelectedStudents(batch.students || []);
//         }
//     }, [batch]);

//     useEffect(() => {
//         filterFacultyByCenter();
//     }, [selectedCenters, allBatchFaculty]);

//     const filterFacultyByCenter = () => {
//         if (selectedCenters.length === 0) {
//             setBatchFaculty(allBatchFaculty);
//             return;
//         }

//         const filteredFaculty = allBatchFaculty.filter(faculty => {
//             return selectedCenters.some(centerId => {
//                 const center = centers.find(c => c.id === centerId);
//                 return center && faculty.center === center.name;
//             });
//         });
//         setBatchFaculty(filteredFaculty);
//     };



//     useEffect(() => {
//         filterManagerByCenter();
//     }, [selectedCenters, allBatchManager]);

//     const filterManagerByCenter = () => {
//         if (selectedCenters.length === 0) {
//             setBatchManager(allBatchManager);
//             return;
//         }

//         const filteredManager = allBatchManager.filter(manager => {
//             return selectedCenters.some(centerId => {
//                 const center = centers.find(c => c.id === centerId);
//                 return center && manager.center === center.name;
//             });
//         });
//         setBatchManager(filteredManager);
//     };

//     const handleSelection = (id, setter, selected) => {
//         setter(prev => prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]);
//     };

//     const handleStudentSelection = (studentId) => {
//         setSelectedStudents(prev =>
//             prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
//         );
//     };

//     const addSelectedStudentsToBatch = () => {
//         alert("Students added to batch!");
//     };

//     const onSubmitBatch = async (e) => {
//         e.preventDefault();
//         if (!batchName.trim() || !batchDuration.trim()) {
//             alert("Please fill in all required fields");
//             return;
//         }

//         try {
//             let batchId;
//             const batchData = {
//                 name: batchName,
//                 duration: batchDuration,
//                 managers: selectedBatchManagers,
//                 faculty: selectedBatchFaculty,
//                 curriculums: selectedCurriculums,
//                 students: selectedStudents,
//                 centers: selectedCenters
//             };

//             if (batch) {
//                 const batchDoc = doc(db, "Batch", batch.id);
//                 await updateDoc(batchDoc, batchData);
//                 batchId = batch.id;
//             } else {
//                 const docRef = await addDoc(collection(db, "Batch"), batchData);
//                 batchId = docRef.id;
//             }

//             alert("Batch successfully saved!");
//             setBatchName("");
//             setBatchDuration("");
//             setSelectedBatchManagers([]);
//             setSelectedBatchFaculty([]);
//             setSelectedCurriculums([]);
//             setSelectedCenters([]);
//             setSelectedStudents([]);
//             toggleSidebar();
//             navigate(`/batches`);
//         } catch (err) {
//             console.error("Error adding document:", err);
//             alert(`Error adding batch: ${err.message}`);
//         }
//     };

//     return (
//         <div className={`fixed top-0 right-0 h-full bg-white w-2/5 shadow-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} p-4 overflow-y-auto`}>
//             <button type="button" className="close-button" onClick={toggleSidebar}>Back</button>
//             <h1>{batch ? "Edit Batch" : "Create Batch"}</h1>
//             <form onSubmit={onSubmitBatch}>
//                 {/* ... (rest of your form) ... */}
//                 <div className="mb-3">
//                     <label>Batch Name</label>
//                     <input type="text" value={batchName} onChange={(e) => setBatchName(e.target.value)} required />
//                 </div>
//                 <div className="mb-3">
//                     <label>Batch Duration</label>
//                     <input type="text" value={batchDuration} onChange={(e) => setBatchDuration(e.target.value)} required />
//                 </div>

//                 <div className="mb-3">
//                     <label>Select Curriculum</label>
//                     {curriculums.map(curriculum => (<div key={curriculum.id}>
//                         <input type="checkbox" checked={selectedCurriculums.includes(curriculum.id)} onChange={() => handleSelection(curriculum.id, setSelectedCurriculums, selectedCurriculums)} />
//                         {curriculum.name}
//                     </div>))}
//                 </div>

//                 <div className="mb-3">
//                     <label>Select Center</label>
//                     {centers.map(center => (
//                         <div key={center.id}>
//                             <input type="checkbox" checked={selectedCenters.includes(center.id)} onChange={() => handleSelection(center.id, setSelectedCenters, selectedCenters)} />
//                             {center.name}
//                         </div>
//                     ))}
//                 </div>

//                 {/* ... (other form fields) ... */}

//                 <div className="mb-3">
//                     <label>Batch Manager</label>
//                     {batchManager.map(instructor => (
//                         <div key={instructor.id}>
//                             <input type="checkbox" checked={selectedBatchManagers.includes(instructor.id)} onChange={() => handleSelection(instructor.id, setSelectedBatchManagers, selectedBatchManagers)} />
//                             {instructor.f_name} {instructor.l_name}
//                         </div>))}
//                 </div>

//                 <div className="mb-3">
//                     <label>Batch Faculty</label>
//                     {batchFaculty.map(instructor => (
//                         <div key={instructor.id}>
//                             <input type="checkbox" checked={selectedBatchFaculty.includes(instructor.id)} onChange={() => handleSelection(instructor.id, setSelectedBatchFaculty, selectedBatchFaculty)} />
//                             {instructor.f_name}
//                         </div>
//                     ))}
//                 </div>

//                 {/* ... (rest of your form) ... */}

//                 <div className="mb-3">
//                     <label>Add Students</label>
//                     <table className="table">
//                         <thead>
//                             <tr>
//                                 <th>Sr No</th>
//                                 <th>Student Name</th>
//                                 <th>Enrollment Date</th>
//                                 <th>Course Name</th>
//                                 <th>Select</th>
//                             </tr>
//                         </thead>


//                         <tbody>
//                             {loading ? (
//                                 <tr>
//                                     <td colSpan="5" className="text-center py-4">Loading...</td>
//                                 </tr>
//                             ) : students.length > 0 ? (
//                                 students.flatMap((student, index) =>
//                                     (student.course_details || [{}]).map((course, courseIndex) => (
//                                         <tr key={`${student.id || index}-${courseIndex}`}>
//                                             <td>{index + 1}</td>
//                                             <td>{student.first_name} {student.last_name}</td>
//                                             <td>{student.enrollment_date || "N/A"}</td>
//                                             <td>{course.courseName || "No Course Assigned"}</td>
//                                             <td>
//                                                 <input
//                                                     type="checkbox"
//                                                     checked={selectedStudents.includes(student.id)}
//                                                     onChange={() => handleStudentSelection(student.id)}
//                                                 />
//                                             </td>
//                                         </tr>
//                                     ))
//                                 )
//                             ) : (
//                                 <tr>
//                                     <td colSpan="5" className="text-center py-4">No students found</td>
//                                 </tr>
//                             )}
//                         </tbody>

//                     </table>
//                     <button
//                         type="button"
//                         className="bg-green-500 text-white px-4 py-2 rounded-lg mt-3"
//                         onClick={addSelectedStudentsToBatch}
//                     >
//                         Add Students
//                     </button>
//                 </div>

//                 <button type="submit">{batch ? "Update" : "Create"}</button>
//             </form>
//         </div>
//     );
// };

// export default CreateBatches;





import React, { useState, useEffect } from 'react';
import { db } from '../../../../config/firebase';
import { getDocs, collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";

const CreateBatches = ({ isOpen, toggleSidebar, batch }) => {
    const navigate = useNavigate();
    const [batchName, setBatchName] = useState('');
    const [batchDuration, setBatchDuration] = useState('');
    const [curriculums, setCurriculums] = useState([]);
    const [allBatchManager, setAllBatchManager] = useState([]);
    const [batchManager, setBatchManager] = useState([]);
    const [allBatchFaculty, setAllBatchFaculty] = useState([]);
    const [batchFaculty, setBatchFaculty] = useState([]);
    const [allStudents, setAllStudents] = useState([]); // Store all students
    const [students, setStudents] = useState([]); // Store filtered students
    const [centers, setCenters] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedBatchManagers, setSelectedBatchManagers] = useState([]);
    const [selectedBatchFaculty, setSelectedBatchFaculty] = useState([]);
    const [selectedCurriculums, setSelectedCurriculums] = useState([]);
    const [selectedCenters, setSelectedCenters] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const fetchCollection = async (collectionName, setter) => {
                const snapshot = await getDocs(collection(db, collectionName));
                setter(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            };

            await fetchCollection("Instructor", setAllBatchFaculty);
            await fetchCollection("Instructor", setAllBatchManager); // Fetch all managers
            await fetchCollection("Curriculum", setCurriculums);
            await fetchCollection("student", setAllStudents); // Fetch all students
            await fetchCollection("Centers", setCenters);
            setLoading(false);
        };

        fetchData();

        if (batch) {
            setBatchName(batch.name);
            setBatchDuration(batch.duration);
            setSelectedBatchManagers(batch.managers || []);
            setSelectedBatchFaculty(batch.faculty || []);
            setSelectedCurriculums(batch.curriculums || []);
            setSelectedCenters(batch.centers || []);
            setSelectedStudents(batch.students || []);
        }
    }, [batch]);

    useEffect(() => {
        filterFacultyByCenter();
        filterManagerByCenter();
        filterStudentByCenter();
    }, [selectedCenters, allBatchFaculty, allBatchManager, allStudents]);

    const filterFacultyByCenter = () => {
        if (selectedCenters.length === 0) {
            setBatchFaculty(allBatchFaculty);
            return;
        }

        const filteredFaculty = allBatchFaculty.filter(faculty => {
            return selectedCenters.some(centerId => {
                const center = centers.find(c => c.id === centerId);
                return center && faculty.center === center.name;
            });
        });
        setBatchFaculty(filteredFaculty);
    };

    const filterManagerByCenter = () => {
        if (selectedCenters.length === 0) {
            setBatchManager(allBatchManager);
            return;
        }

        const filteredManager = allBatchManager.filter(manager => {
            return selectedCenters.some(centerId => {
                const center = centers.find(c => c.id === centerId);
                return center && manager.center === center.name;
            });
        });
        setBatchManager(filteredManager);
    };

    const filterStudentByCenter = () => {
        if (selectedCenters.length === 0) {
            setStudents(allStudents);
            return;
        }

        const filteredStudents = allStudents.filter(student => {
            if (!student.course_details || student.course_details.length === 0) {
                return false; // Skip students without course details
            }

            return student.course_details.some(course => {
                return selectedCenters.some(centerId => {
                    const center = centers.find(c => c.id === centerId);
                    return center && course.center === center.name;
                });
            });
        });
        setStudents(filteredStudents);
    };

    // const filterStudentByCenter = () => {
    //     if (selectedCenters.length === 0) {
    //         setStudents(allStudents);
    //         return;
    //     }

    //     const filteredStudents = allStudents.filter(student => {
    //         return selectedCenters.some(centerId => {
    //             const center = centers.find(c => c.id === centerId);
    //             return center && student.center === center.name;
    //         });
    //     });
    //     setStudents(filteredStudents);
    // };

    const handleSelection = (id, setter, selected) => {
        setter(prev => prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]);
    };

    const handleStudentSelection = (studentId) => {
        setSelectedStudents(prev =>
            prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
        );
    };

    const addSelectedStudentsToBatch = () => {
        alert("Students added to batch!");
    };

    const onSubmitBatch = async (e) => {
        e.preventDefault();
        if (!batchName.trim() || !batchDuration.trim()) {
            alert("Please fill in all required fields");
            return;
        }

        try {
            let batchId;
            const batchData = {
                name: batchName,
                duration: batchDuration,
                managers: selectedBatchManagers,
                faculty: selectedBatchFaculty,
                curriculums: selectedCurriculums,
                students: selectedStudents,
                centers: selectedCenters
            };

            if (batch) {
                const batchDoc = doc(db, "Batch", batch.id);
                await updateDoc(batchDoc, batchData);
                batchId = batch.id;
            } else {
                const docRef = await addDoc(collection(db, "Batch"), batchData);
                batchId = docRef.id;
            }

            alert("Batch successfully saved!");
            setBatchName("");
            setBatchDuration("");
            setSelectedBatchManagers([]);
            setSelectedBatchFaculty([]);
            setSelectedCurriculums([]);
            setSelectedCenters([]);
            setSelectedStudents([]);
            toggleSidebar();
            navigate(`/batches`);
        } catch (err) {
            console.error("Error adding document:", err);
            alert(`Error adding batch: ${err.message}`);
        }
    };

    return (
        <div className={`fixed top-0 right-0 h-full bg-white w-2/5 shadow-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} p-4 overflow-y-auto`}>

            <button type="button" className="close-button" onClick={toggleSidebar}>Back</button>
            <h1>{batch ? "Edit Batch" : "Create Batch"}</h1>
            <form onSubmit={onSubmitBatch}>
                {/* ... (rest of your form) ... */}
                <div className="mb-3">
                    <label>Batch Name</label>
                    <input type="text" value={batchName} onChange={(e) => setBatchName(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label>Batch Duration</label>
                    <input type="text" value={batchDuration} onChange={(e) => setBatchDuration(e.target.value)} required />
                </div>

                <div className="mb-3">
                    <label>Select Curriculum</label>
                    {curriculums.map(curriculum => (<div key={curriculum.id}>
                        <input type="checkbox" checked={selectedCurriculums.includes(curriculum.id)} onChange={() => handleSelection(curriculum.id, setSelectedCurriculums, selectedCurriculums)} />
                        {curriculum.name}
                    </div>))}
                </div>
                <div className="mb-3">
                    <label>Select Center</label>
                    {centers.map(center => (
                        <div key={center.id}>
                            <input type="checkbox" checked={selectedCenters.includes(center.id)} onChange={() => handleSelection(center.id, setSelectedCenters, selectedCenters)} />
                            {center.name}
                        </div>
                    ))}
                </div>

                <div className="mb-3">
                    <label>Batch Manager</label>
                    {batchManager.map(instructor => (
                        <div key={instructor.id}>
                            <input type="checkbox" checked={selectedBatchManagers.includes(instructor.id)} onChange={() => handleSelection(instructor.id, setSelectedBatchManagers, selectedBatchManagers)} />
                            {instructor.f_name} {instructor.l_name}
                        </div>))}
                </div>


                <div className="mb-3">
                    <label>Batch Faculty</label>
                    {batchFaculty.map(instructor => (
                        <div key={instructor.id}>
                            <input type="checkbox" checked={selectedBatchFaculty.includes(instructor.id)} onChange={() => handleSelection(instructor.id, setSelectedBatchFaculty, selectedBatchFaculty)} />
                            {instructor.f_name}
                        </div>
                    ))}
                </div>

                <div className="mb-3">
                    <label>Add Students</label>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Sr No</th>
                                <th>Student Name</th>
                                <th>Enrollment Date</th>
                                <th>Course Name</th>
                                <th>Select</th>
                            </tr>
                        </thead>


                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">Loading...</td>
                                </tr>
                            ) : students.length > 0 ? (
                                students.flatMap((student, index) =>
                                    (student.course_details || [{}]).map((course, courseIndex) => (
                                        <tr key={`${student.id || index}-${courseIndex}`}>
                                            <td>{index + 1}</td>
                                            <td>{student.first_name} {student.last_name}</td>
                                            <td>{student.enrollment_date || "N/A"}</td>
                                            <td>{course.courseName || "No Course Assigned"}</td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedStudents.includes(student.id)}
                                                    onChange={() => handleStudentSelection(student.id)}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">No students found</td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                    <button
                        type="button"
                        className="bg-green-500 text-white px-4 py-2 rounded-lg mt-3"
                        onClick={addSelectedStudentsToBatch}
                    >
                        Add Students
                    </button>
                </div>

                <button type="submit">{batch ? "Update" : "Create"}</button>
            </form>
        </div >
    );
};
export default CreateBatches;




