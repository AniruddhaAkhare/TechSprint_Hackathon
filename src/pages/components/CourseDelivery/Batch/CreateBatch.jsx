import React, { useState, useEffect } from "react";
import { db } from "../../../../config/firebase";
import { getDocs, collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const CreateBatches = ({ isOpen, toggleSidebar, batch }) => {
    const navigate = useNavigate();

    // State variables
    const [batchName, setBatchName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [status, setStatus] = useState("Ongoing");

    const [centers, setCenters] = useState([]);
    const [selectedCenters, setSelectedCenters] = useState("");
    const [availableCenters, setAvailableCenters] = useState([]);

    const [course, setCourse] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [availableCourse, setAvailableCourse] = useState([]);

    const [curriculum, setCurriculum] = useState([]);
    const [selectedCurriculum, setSelectedCurriculum] = useState("");
    const [availableCurriculum, setAvailableCurriculum] = useState([]);

    const [batchManager, setBatchManager] = useState([]);
    const [selectedBatchManager, setSelectedBatchManager] = useState("");
    const [availableBatchManager, setAvailableBatchManager] = useState([]);

    const [additionalBatchManager, setAdditionalBatchManager] = useState([]);
    const [selectedAdditionalBatchManager, setSelectedAdditionalBatchManager] = useState("");
    const [availableAdditionalBatchManager, setAvailableAdditionalBatchManager] = useState([]);


    const [batchFaculty, setBatchFaculty] = useState([]);
    const [selectedBatchFaculty, setSelectedBatchFaculty] = useState("");
    const [availableBatchFaculty, setAvailableBatchFaculty] = useState([]);



    useEffect(() => {
        const fetchData = async () => {

            const centerSnapshot = await getDocs(collection(db, "Centers"));
            const centersList = centerSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setCenters(centersList);
            setAvailableCenters(centersList);


            const courseSnapshot = await getDocs(collection(db, "Course"));
            const coursesList = courseSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setCourse(coursesList);
            setAvailableCourse(coursesList);

            const curriculumSnapshot = await getDocs(collection(db, "curriculum"));
            const curriculumList = curriculumSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setCurriculum(curriculumList);
            setAvailableCurriculum(curriculumList);

            const batchManagerSnapshot = await getDocs(collection(db, "Instructor"));
            const batchManagersList = batchManagerSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setBatchManager(batchManagersList);
            setAvailableBatchManager(batchManagersList);

            const additionalBatchManagerSnapshot = await getDocs(collection(db, "Instructor"));
            const additionalBatchManagersList = additionalBatchManagerSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setAdditionalBatchManager(additionalBatchManagersList);
            setAvailableAdditionalBatchManager(additionalBatchManagersList);

            const batchFacultySnapshot = await getDocs(collection(db, "Instructor"));
            const batchFacultyList = batchFacultySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setBatchFaculty(batchFacultyList);
            setAvailableBatchFaculty(batchFacultyList);

        };
        fetchData();
    }, []);

    useEffect(() => {
        if (batch) {
            setBatchName(batch.batchName);
            setStartDate(batch.startDate);
            setEndDate(batch.endDate);
            setStatus(batch.status || "Ongoing");

            setSelectedCenters(batch.centers || []);
            setAvailableCenters(centers.filter((c) => !batch.centers.includes(c.id)));

            setSelectedCourse(batch.course || []);
            setAvailableCourse(course.filter((c) => !batch.course.includes(c.id)));

            setSelectedCurriculum(batch.curriculum || []);
            setAvailableCurriculum(curriculum.filter((c) => !batch.curriculum.includes(c.id)));

            setSelectedBatchFaculty(batch.batchFaculty || []);
            setAvailableBatchFaculty(batchFaculty.filter((c) => !batch.batchFaculty.includes(c.id)));

            setSelectedAdditionalBatchManager(batch.additionalBatchManager || []);
            setAvailableAdditionalBatchManager(additionalBatchManager.filter((c) => !batch.additionalBatchManager.includes(c.id)));

            setSelectedBatchFaculty(batch.batchFaculty || []);
            setAvailableBatchFaculty(batchFaculty.filter((c) => !batch.batchFaculty.includes(c.id)));

        }
    }, [batch, course, curriculum, centers]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const batchData = {
            batchName: batchName,
            startDate,
            endDate,
            status,
            centers: selectedCenters,
            course: selectedCourse,
            curriculum: selectedCurriculum,
            batchManager: selectedBatchManager,
            additionalBatchManager: selectedAdditionalBatchManager,
            batchFaculty: selectedBatchFaculty,
            createdAt: serverTimestamp(),
        };

        try {
            if (batch) {
                await updateDoc(doc(db, "Batch", batch.id), batchData);
                alert("Batch updated successfully!");
            } else {
                await addDoc(collection(db, "Batch"), batchData);
                alert("Batch created successfully!");
            }
            resetForm();
            toggleSidebar();
        } catch (error) {
            console.error("Error saving batch:", error);
            alert("Failed to save batch. Please try again.");
        }
    };

    const resetForm = () => {
        setBatchName("");
        setStartDate("");
        setEndDate("");
        setStatus("Ongoing");

        setSelectedCenters([]);
        setAvailableCenters(centers);


        setSelectedCourse([]);
        setAvailableCourse(course);


        setSelectedBatchManager([]);
        setAvailableBatchManager(batchManager);


        setSelectedAdditionalBatchManager([]);
        setAvailableAdditionalBatchManager(additionalBatchManager);

        setSelectedBatchFaculty([]);
        setAvailableBatchFaculty(batchFaculty);

        setSelectedCurriculum([]);
        setAvailableCurriculum(curriculum);

    };

    const handleAddCenter = (centerId) => {
        if (centerId && !selectedCenters.includes(centerId)) {
            setSelectedCenters([...selectedCenters, centerId]);
            setAvailableCenters(availableCenters.filter((c) => c.id !== centerId));
        }
    };

    const handleRemoveCenter = (centerId) => {
        setSelectedCenters(selectedCenters.filter((id) => id !== centerId));
        const removedCenter = centers.find((c) => c.id === centerId);
        if (removedCenter) setAvailableCenters([...availableCenters, removedCenter]);
    };


    const handleAddCurriculum = (curriculumId) => {
        if (curriculumId && !selectedCurriculum.includes(curriculumId)) {
            setSelectedCurriculum([...selectedCurriculum, curriculumId]);
            setAvailableCurriculum(availableCurriculum.filter((c) => c.id !== curriculumId));
        }
    };

    const handleRemoveCurriculum = (curriculumId) => {
        setSelectedCurriculum(selectedCurriculum.filter((id) => id !== curriculumId));
        const removedCurriculum = curriculum.find((c) => c.id === curriculumId);
        if (removedCurriculum) setAvailableCurriculum([...availableCurriculum, removedCurriculum]);
    };


    const handleAddBatchManager = (batchManagerId) => {
        if (batchManagerId && !selectedBatchManager.includes(batchManagerId)) {
            setSelectedBatchManager([...selectedBatchManager, batchManagerId]);
            setAvailableBatchManager(availableBatchManager.filter((c) => c.id !== batchManagerId));
        }
    };

    const handleRemoveBatchManager = (batchManagerId) => {
        setSelectedBatchManager(selectedBatchManager.filter((id) => id !== batchManagerId));
        const removedBatchManager = batchManager.find((c) => c.id === batchManagerId);
        if (removedBatchManager) setAvailableBatchManager([...availableBatchManager, removedBatchManager]);
    };


    const handleAddAdditionalBatchManager = (additionalBatchManagerId) => {
        if (additionalBatchManagerId && !selectedAdditionalBatchManager.includes(additionalBatchManagerId)) {
            setSelectedAdditionalBatchManager([...selectedAdditionalBatchManager, additionalBatchManagerId]);
            setAvailableAdditionalBatchManager(availableAdditionalBatchManager.filter((c) => c.id !== additionalBatchManagerId));
        }
    };

    const handleRemoveAdditionalBatchManager = (additionalBatchManagerId) => {
        setSelectedAdditionalBatchManager(selectedAdditionalBatchManager.filter((id) => id !== additionalBatchManagerId));
        const removedAdditionalBatchManager = additionalBatchManager.find((c) => c.id === additionalBatchManagerId);
        if (removedAdditionalBatchManager) setAvailableAdditionalBatchManager([...availableAdditionalBatchManager, removedAdditionalBatchManager]);
    };


    const handleAddBatchFaculty = (batchFacultyId) => {
        if (batchFacultyId && !selectedBatchFaculty.includes(batchFacultyId)) {
            setSelectedBatchFaculty([...selectedBatchFaculty, batchFacultyId]);
            setAvailableBatchFaculty(availableBatchFaculty.filter((c) => c.id !== batchFacultyId));
        }
    };

    const handleRemoveBatchFaculty = (batchFacultyId) => {
        setSelectedBatchFaculty(selectedBatchFaculty.filter((id) => id !== batchFacultyId));
        const removedBatchFaculty = batchFaculty.find((c) => c.id === batchFacultyId);
        if (removedBatchFaculty) setAvailableBatchFaculty([...availableBatchFaculty, removedBatchFaculty]);
    };

    return (
        <div className={`fixed top-0 right-0 h-full bg-white w-2/5 shadow-lg transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"} p-4 overflow-y-auto`}>
            <button type="button" onClick={toggleSidebar} className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition duration-200">Back</button>
            <h1>{batch ? "Edit Batch" : "Create Batch"}</h1>

            <form onSubmit={handleSubmit}>
                <label>Batch Name:</label>
                <input type="text" value={batchName} onChange={(e) => setBatchName(e.target.value)} required />

                <label>Start Date:</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />

                <label>End Date:</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />

                <label>Status: </label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} required>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Archive">Archive</option>
                    </select>
                    

                {/* Select Centers */}
                <select onChange={(e) => handleAddCenter(e.target.value)}>
                    <option value="">Select a Center</option>
                    {availableCenters.map((center) => (
                        <option key={center.id} value={center.id}>{center.name}</option>
                    ))}
                </select>

                {/* Centers Table */}
                {selectedCenters.length > 0 && (
                    <table border="1">
                        <thead>
                            <tr>
                                <th>Sr No</th>
                                <th>Center Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedCenters.map((centerId, index) => {
                                const center = centers.find((c) => c.id === centerId);
                                return (
                                    <tr key={centerId}>
                                        <td>{index + 1}</td>
                                        <td>{center?.name}</td>
                                        <td>
                                            <button type="button" onClick={() => handleRemoveCenter(centerId)}>✕</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}



                <select onChange={(e) => handleAddCurriculum(e.target.value)}>
                    <option value="">Select a Curriculum</option>
                    {availableCurriculum.map((curriculum) => (
                        <option key={curriculum.id} value={curriculum.id}>{curriculum.name}</option>
                    ))}
                </select>

                {selectedCurriculum.length > 0 && (
                    <table border="1">
                        <thead>
                            <tr>
                                <th>Sr No</th>
                                <th>Curriculum Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedCurriculum.map((curriculumId, index) => {
                                const curr = curriculum.find((c) => c.id === curriculumId);
                                return (
                                    <tr key={curriculumId}>
                                        <td>{index + 1}</td>
                                        <td>{curr?.name}</td>
                                        <td>
                                            <button type="button" onClick={() => handleRemoveCurriculum(curriculumId)}>✕</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}



                <select onChange={(e) => handleAddBatchManager(e.target.value)}>
                    <option value="">Select a Batch Manager</option>
                    {availableBatchManager.map((batchManager) => (
                        <option key={batchManager.id} value={batchManager.id}>{batchManager.f_name}</option>
                    ))}
                </select>

                {selectedBatchManager.length > 0 && (
                    <table border="1">
                        <thead>
                            <tr>
                                <th>Sr No</th>
                                <th>Batch Manager</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedBatchManager.map((batchManagerId, index) => {
                                const BM = batchManager.find((c) => c.id === batchManagerId);
                                return (
                                    <tr key={batchManagerId}>
                                        <td>{index + 1}</td>
                                        <td>{BM?.f_name}</td>
                                        <td>
                                            <button type="button" onClick={() => handleRemoveBatchManager(batchManagerId)}>✕</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}



                <select onChange={(e) => handleAddBatchFaculty(e.target.value)}>
                    <option value="">Select a Batch Faculty</option>
                    {availableBatchFaculty.map((batchFaculty) => (
                        <option key={batchFaculty.id} value={batchFaculty.id}>{batchFaculty.f_name}</option>
                    ))}
                </select>


                {selectedBatchFaculty.length > 0 && (
                    <table border="1">
                        <thead>
                            <tr>
                                <th>Sr No</th>
                                <th>Batch Faculty Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedBatchFaculty.map((batchFacultyId, index) => {
                                const BF = batchFaculty.find((c) => c.id === batchFacultyId);
                                return (
                                    <tr key={batchFacultyId}>
                                        <td>{index + 1}</td>
                                        <td>{BF?.f_name}</td>
                                        <td>
                                            <button type="button" onClick={() => handleRemoveBatchFaculty(batchFacultyId)}>✕</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}



                <select onChange={(e) => handleAddAdditionalBatchManager(e.target.value)}>
                    <option value="">Select a Additional Batch Manager</option>
                    {availableAdditionalBatchManager.map((additionalBatchManager) => (
                        <option key={additionalBatchManager.id} value={additionalBatchManager.id}>{additionalBatchManager.f_name}</option>
                    ))}
                </select>

                {selectedAdditionalBatchManager.length > 0 && (
                    <table border="1">
                        <thead>
                            <tr>
                                <th>Sr No</th>
                                <th>Additional batch Manager Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedAdditionalBatchManager.map((additionalBatchManagerId, index) => {
                                const ABM = additionalBatchManager.find((c) => c.id === additionalBatchManagerId);
                                return (
                                    <tr key={additionalBatchManagerId}>
                                        <td>{index + 1}</td>
                                        <td>{ABM?.f_name}</td>
                                        <td>
                                            <button type="button" onClick={() => handleRemoveAdditionalBatchManager(additionalBatchManagerId)}>✕</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}


                <div className="flex justify-end">
                    <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200">{batch ? "Update batch" : "Create batch"}</button>
                </div>

                {/* <button type="submit">{batch ? "Update" : "Create"}</button> */}
            </form>
        </div>
    );
};

export default CreateBatches;
