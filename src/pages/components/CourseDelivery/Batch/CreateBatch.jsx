import React, { useState, useEffect } from "react";
import { db } from "../../../../config/firebase";
import { getDocs, collection, addDoc, updateDoc, doc, serverTimestamp, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const CreateBatches = ({ isOpen, toggleSidebar, batch }) => {
    const navigate = useNavigate();

    // State variables (unchanged)
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

    // useEffect hooks (unchanged)
    useEffect(() => {
        const fetchData = async () => {
            const instituteSnapshot = await getDocs(collection(db, "instituteSetup"));
            if(instituteSnapshot.empty){
                console.error("No instituteSetup document found");
                return;
            }
            const instituteId = instituteSnapshot.docs[0].id;
            const centerQuery = query(
                collection(db, "instituteSetup", instituteId, "Center"),
                where ("isActive", "==", true)
            );
            const centerSnapshot = await getDocs(centerQuery);
            const centersList = centerSnapshot.docs.map((doc)=>({id:doc.id, ...doc.data()}));
            setCenters(centersList);
            setAvailableCenters(centersList);
            
            // const centerSnapshot = await getDocs(collection(db, "Centers"));
            // const centersList = centerSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            // setCenters(centersList);
            // setAvailableCenters(centersList);



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
    }, [batch, centers, course, curriculum, batchManager, additionalBatchManager, batchFaculty]);

    // Handler functions (unchanged)
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
        <>
            {/* Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={toggleSidebar}
                />
            )}
            
            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full bg-white w-full shadow-lg transform transition-transform duration-300 ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                } p-6 overflow-y-auto z-50`}
            >
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        {batch ? "Edit Batch" : "Create Batch"}
                    </h1>
                    <button
                        type="button"
                        onClick={toggleSidebar}
                        className="bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 transition duration-200 text-base font-medium"
                    >
                        Back
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Batch Name */}
                    <div>
                        <label htmlFor="batchName" className="block text-base font-medium text-gray-700 mb-1">
                            Batch Name
                        </label>
                        <input
                            type="text"
                            value={batchName}
                            onChange={(e) => setBatchName(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base"
                            placeholder="Enter Batch Name"
                        />
                    </div>

                    {/* Start Date */}
                    <div>
                        <label htmlFor="startDate" className="block text-base font-medium text-gray-700 mb-1">
                            Start Date
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base"
                        />
                    </div>

                    {/* End Date */}
                    <div>
                        <label htmlFor="endDate" className="block text-base font-medium text-gray-700 mb-1">
                            End Date
                        </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label htmlFor="status" className="block text-base font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base"
                        >
                            <option value="Active">Active</option>
                            <option value="Archive">Archive</option>
                        </select>
                    </div>

                    {/* Course Selection */}
                    <div>
                        <label htmlFor="course" className="block text-base font-medium text-gray-700 mb-1">
                            Course
                        </label>
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base"
                        >
                            <option value="">Select a Course</option>
                            {availableCourse.map((courseItem) => (
                                <option key={courseItem.id} value={courseItem.id}>
                                    {courseItem.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Centers */}
                    <div>
                        <label className="block text-base font-medium text-gray-700 mb-1">
                            Select Center
                        </label>
                        <select
                            onChange={(e) => handleAddCenter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base"
                        >
                            <option value="">Select a Center</option>
                            {availableCenters.map((center) => (
                                <option key={center.id} value={center.id}>
                                    {center.name}
                                </option>
                            ))}
                        </select>

                        {selectedCenters.length > 0 && (
                            <div className="mt-4">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Sr No
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Center Name
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {selectedCenters.map((centerId, index) => {
                                            const center = centers.find((c) => c.id === centerId);
                                            return (
                                                <tr key={centerId}>
                                                    <td className="px-4 py-2 whitespace-nowrap text-base text-gray-500">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-base text-gray-900">
                                                        {center?.name}
                                                    </td>
                                                    <td className="px-4 py-2 whitespace-nowrap">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveCenter(centerId)}
                                                            className="text-red-600 hover:text-red-800"
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
                    </div>

                    {/* Curriculum */}
                    <div>
                        <label className="block text-base font-medium text-gray-700 mb-1">
                            Select Curriculum
                        </label>
                        <select
                            onChange={(e) => handleAddCurriculum(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base"
                        >
                            <option value="">Select a Curriculum</option>
                            {availableCurriculum.map((curriculumItem) => (
                                <option key={curriculumItem.id} value={curriculumItem.id}>
                                    {curriculumItem.name}
                                </option>
                            ))}
                        </select>

                        {selectedCurriculum.length > 0 && (
                            <div className="mt-4">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Sr No
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Curriculum Name
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {selectedCurriculum.map((curriculumId, index) => {
                                            const curr = curriculum.find((c) => c.id === curriculumId);
                                            return (
                                                <tr key={curriculumId}>
                                                    <td className="px-4 py-2 whitespace-nowrap text-base text-gray-500">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-base text-gray-900">
                                                        {curr?.name}
                                                    </td>
                                                    <td className="px-4 py-2 whitespace-nowrap">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveCurriculum(curriculumId)}
                                                            className="text-red-600 hover:text-red-800"
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
                    </div>

                    {/* Batch Manager */}
                    <div>
                        <label className="block text-base font-medium text-gray-700 mb-1">
                            Select Batch Manager
                        </label>
                        <select
                            onChange={(e) => handleAddBatchManager(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base"
                        >
                            <option value="">Select a Batch Manager</option>
                            {availableBatchManager.map((manager) => (
                                <option key={manager.id} value={manager.id}>
                                    {manager.f_name}
                                </option>
                            ))}
                        </select>

                        {selectedBatchManager.length > 0 && (
                            <div className="mt-4">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Sr No
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Batch Manager
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {selectedBatchManager.map((managerId, index) => {
                                            const BM = batchManager.find((c) => c.id === managerId);
                                            return (
                                                <tr key={managerId}>
                                                    <td className="px-4 py-2 whitespace-nowrap text-base text-gray-500">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-base text-gray-900">
                                                        {BM?.f_name}
                                                    </td>
                                                    <td className="px-4 py-2 whitespace-nowrap">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveBatchManager(managerId)}
                                                            className="text-red-600 hover:text-red-800"
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
                    </div>

                    {/* Additional Batch Manager */}
                    <div>
                        <label className="block text-base font-medium text-gray-700 mb-1">
                            Select Additional Batch Manager
                        </label>
                        <select
                            onChange={(e) => handleAddAdditionalBatchManager(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base"
                        >
                            <option value="">Select an Additional Batch Manager</option>
                            {availableAdditionalBatchManager.map((manager) => (
                                <option key={manager.id} value={manager.id}>
                                    {manager.f_name}
                                </option>
                            ))}
                        </select>

                        {selectedAdditionalBatchManager.length > 0 && (
                            <div className="mt-4">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Sr No
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Additional Batch Manager
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {selectedAdditionalBatchManager.map((managerId, index) => {
                                            const ABM = additionalBatchManager.find((c) => c.id === managerId);
                                            return (
                                                <tr key={managerId}>
                                                    <td className="px-4 py-2 whitespace-nowrap text-base text-gray-500">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-base text-gray-900">
                                                        {ABM?.f_name}
                                                    </td>
                                                    <td className="px-4 py-2 whitespace-nowrap">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveAdditionalBatchManager(managerId)}
                                                            className="text-red-600 hover:text-red-800"
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
                    </div>

                    {/* Batch Faculty */}
                    <div>
                        <label className="block text-base font-medium text-gray-700 mb-1">
                            Select Batch Faculty
                        </label>
                        <select
                            onChange={(e) => handleAddBatchFaculty(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base"
                        >
                            <option value="">Select a Batch Faculty</option>
                            {availableBatchFaculty.map((faculty) => (
                                <option key={faculty.id} value={faculty.id}>
                                    {faculty.f_name}
                                </option>
                            ))}
                        </select>

                        {selectedBatchFaculty.length > 0 && (
                            <div className="mt-4">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Sr No
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Batch Faculty Name
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {selectedBatchFaculty.map((facultyId, index) => {
                                            const BF = batchFaculty.find((c) => c.id === facultyId);
                                            return (
                                                <tr key={facultyId}>
                                                    <td className="px-4 py-2 whitespace-nowrap text-base text-gray-500">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-base text-gray-900">
                                                        {BF?.f_name}
                                                    </td>
                                                    <td className="px-4 py-2 whitespace-nowrap">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveBatchFaculty(facultyId)}
                                                            className="text-red-600 hover:text-red-800"
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
                    </div>

                    {/* Total Students (Static for now) */}
                    <div>
                        <label className="block text-base font-medium text-gray-700 mb-1">
                            Total Students: 0
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end mt-6">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200 text-base font-medium"
                        >
                            {batch ? "Update Batch" : "Create Batch"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CreateBatches;