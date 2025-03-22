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
    const [selectedCenters, setSelectedCenters] = useState([]);
    const [availableCenters, setAvailableCenters] = useState([]);

    const [course, setCourse] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [availableCourse, setAvailableCourse] = useState([]);

    const [curriculum, setCurriculum] = useState([]);
    const [selectedCurriculum, setSelectedCurriculum] = useState([]);
    const [availableCurriculum, setAvailableCurriculum] = useState([]);

    const [batchManager, setBatchManager] = useState([]);
    const [selectedBatchManager, setSelectedBatchManager] = useState([]);
    const [availableBatchManager, setAvailableBatchManager] = useState([]);

    const [additionalBatchManager, setAdditionalBatchManager] = useState([]);
    const [selectedAdditionalBatchManager, setSelectedAdditionalBatchManager] = useState([]);
    const [availableAdditionalBatchManager, setAvailableAdditionalBatchManager] = useState([]);

    const [batchFaculty, setBatchFaculty] = useState([]);
    const [selectedBatchFaculty, setSelectedBatchFaculty] = useState([]);
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
            setBatchName(batch.batchName || "");
            setStartDate(batch.startDate || "");
            setEndDate(batch.endDate || "");
            setStatus(batch.status || "Ongoing");

            setSelectedCenters(batch.centers || []);
            setAvailableCenters(centers.filter((c) => !batch.centers?.includes(c.id)));

            setSelectedCourse(batch.course || "");
            setAvailableCourse(course.filter((c) => c.id !== batch.course));

            setSelectedCurriculum(batch.curriculum || []);
            setAvailableCurriculum(curriculum.filter((c) => !batch.curriculum?.includes(c.id)));

            setSelectedBatchManager(batch.batchManager || []);
            setAvailableBatchManager(batchManager.filter((c) => !batch.batchManager?.includes(c.id)));

            setSelectedAdditionalBatchManager(batch.additionalBatchManager || []);
            setAvailableAdditionalBatchManager(additionalBatchManager.filter((c) => !batch.additionalBatchManager?.includes(c.id)));

            setSelectedBatchFaculty(batch.batchFaculty || []);
            setAvailableBatchFaculty(batchFaculty.filter((c) => !batch.batchFaculty?.includes(c.id)));
        }
    }, [batch, course, curriculum, centers, batchManager, additionalBatchManager, batchFaculty]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const batchData = {
            batchName,
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
        setSelectedCourse("");
        setAvailableCourse(course);
        setSelectedCurriculum([]);
        setAvailableCurriculum(curriculum);
        setSelectedBatchManager([]);
        setAvailableBatchManager(batchManager);
        setSelectedAdditionalBatchManager([]);
        setAvailableAdditionalBatchManager(additionalBatchManager);
        setSelectedBatchFaculty([]);
        setAvailableBatchFaculty(batchFaculty);
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
        <div
            className={`fixed inset-y-0 right-0 z-50 bg-white w-full sm:w-3/4 md:w-2/5 shadow-lg transform transition-transform duration-300 ${
                isOpen ? "translate-x-0" : "translate-x-full"
            } p-4 overflow-y-auto`}
        >
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl md:text-2xl font-semibold">
                    {batch ? "Edit Batch" : "Create Batch"}
                </h1>
                <button
                    type="button"
                    onClick={toggleSidebar}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
                >
                    Back
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Batch Name:</label>
                    <input
                        type="text"
                        value={batchName}
                        onChange={(e) => setBatchName(e.target.value)}
                        required
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Start Date:</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">End Date:</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Status:</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Ongoing">Ongoing</option>
                        <option value="Archive">Archive</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium">Select Course:</label>
                    <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select a Course</option>
                        {availableCourse.map((course) => (
                            <option key={course.id} value={course.id}>{course.name}</option>
                        ))}
                    </select>
                </div>

                {/* Centers */}
                <div>
                    <label className="block text-sm font-medium">Add Center:</label>
                    <select
                        onChange={(e) => handleAddCenter(e.target.value)}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select a Center</option>
                        {availableCenters.map((center) => (
                            <option key={center.id} value={center.id}>{center.name}</option>
                        ))}
                    </select>
                </div>

                {selectedCenters.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[400px] border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 text-left text-sm font-medium">Sr No</th>
                                    <th className="p-2 text-left text-sm font-medium">Center Name</th>
                                    <th className="p-2 text-left text-sm font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedCenters.map((centerId, index) => {
                                    const center = centers.find((c) => c.id === centerId);
                                    return (
                                        <tr key={centerId}>
                                            <td className="p-2 text-sm">{index + 1}</td>
                                            <td className="p-2 text-sm">{center?.name}</td>
                                            <td className="p-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveCenter(centerId)}
                                                    className="text-red-500 hover:text-red-700 text-sm"
                                                >
                                                    ✕
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Curriculum */}
                <div>
                    <label className="block text-sm font-medium">Add Curriculum:</label>
                    <select
                        onChange={(e) => handleAddCurriculum(e.target.value)}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select a Curriculum</option>
                        {availableCurriculum.map((curriculum) => (
                            <option key={curriculum.id} value={curriculum.id}>{curriculum.name}</option>
                        ))}
                    </select>
                </div>

                {selectedCurriculum.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[400px] border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 text-left text-sm font-medium">Sr No</th>
                                    <th className="p-2 text-left text-sm font-medium">Curriculum Name</th>
                                    <th className="p-2 text-left text-sm font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedCurriculum.map((curriculumId, index) => {
                                    const curr = curriculum.find((c) => c.id === curriculumId);
                                    return (
                                        <tr key={curriculumId}>
                                            <td className="p-2 text-sm">{index + 1}</td>
                                            <td className="p-2 text-sm">{curr?.name}</td>
                                            <td className="p-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveCurriculum(curriculumId)}
                                                    className="text-red-500 hover:text-red-700 text-sm"
                                                >
                                                    ✕
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Batch Manager */}
                <div>
                    <label className="block text-sm font-medium">Add Batch Manager:</label>
                    <select
                        onChange={(e) => handleAddBatchManager(e.target.value)}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select a Batch Manager</option>
                        {availableBatchManager.map((batchManager) => (
                            <option key={batchManager.id} value={batchManager.id}>{batchManager.f_name}</option>
                        ))}
                    </select>
                </div>

                {selectedBatchManager.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[400px] border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 text-left text-sm font-medium">Sr No</th>
                                    <th className="p-2 text-left text-sm font-medium">Batch Manager</th>
                                    <th className="p-2 text-left text-sm font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedBatchManager.map((batchManagerId, index) => {
                                    const BM = batchManager.find((c) => c.id === batchManagerId);
                                    return (
                                        <tr key={batchManagerId}>
                                            <td className="p-2 text-sm">{index + 1}</td>
                                            <td className="p-2 text-sm">{BM?.f_name}</td>
                                            <td className="p-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveBatchManager(batchManagerId)}
                                                    className="text-red-500 hover:text-red-700 text-sm"
                                                >
                                                    ✕
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Additional Batch Manager */}
                <div>
                    <label className="block text-sm font-medium">Add Additional Batch Manager:</label>
                    <select
                        onChange={(e) => handleAddAdditionalBatchManager(e.target.value)}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select an Additional Batch Manager</option>
                        {availableAdditionalBatchManager.map((additionalBatchManager) => (
                            <option key={additionalBatchManager.id} value={additionalBatchManager.id}>{additionalBatchManager.f_name}</option>
                        ))}
                    </select>
                </div>

                {selectedAdditionalBatchManager.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[400px] border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 text-left text-sm font-medium">Sr No</th>
                                    <th className="p-2 text-left text-sm font-medium">Additional Batch Manager</th>
                                    <th className="p-2 text-left text-sm font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedAdditionalBatchManager.map((additionalBatchManagerId, index) => {
                                    const ABM = additionalBatchManager.find((c) => c.id === additionalBatchManagerId);
                                    return (
                                        <tr key={additionalBatchManagerId}>
                                            <td className="p-2 text-sm">{index + 1}</td>
                                            <td className="p-2 text-sm">{ABM?.f_name}</td>
                                            <td className="p-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveAdditionalBatchManager(additionalBatchManagerId)}
                                                    className="text-red-500 hover:text-red-700 text-sm"
                                                >
                                                    ✕
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Batch Faculty */}
                <div>
                    <label className="block text-sm font-medium">Add Batch Faculty:</label>
                    <select
                        onChange={(e) => handleAddBatchFaculty(e.target.value)}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select a Batch Faculty</option>
                        {availableBatchFaculty.map((batchFaculty) => (
                            <option key={batchFaculty.id} value={batchFaculty.id}>{batchFaculty.f_name}</option>
                        ))}
                    </select>
                </div>

                {selectedBatchFaculty.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[400px] border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 text-left text-sm font-medium">Sr No</th>
                                    <th className="p-2 text-left text-sm font-medium">Batch Faculty Name</th>
                                    <th className="p-2 text-left text-sm font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedBatchFaculty.map((batchFacultyId, index) => {
                                    const BF = batchFaculty.find((c) => c.id === batchFacultyId);
                                    return (
                                        <tr key={batchFacultyId}>
                                            <td className="p-2 text-sm">{index + 1}</td>
                                            <td className="p-2 text-sm">{BF?.f_name}</td>
                                            <td className="p-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveBatchFaculty(batchFacultyId)}
                                                    className="text-red-500 hover:text-red-700 text-sm"
                                                >
                                                    ✕
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="flex justify-end mt-4">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200 w-full sm:w-auto"
                    >
                        {batch ? "Update batch" : "Create batch"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateBatches;