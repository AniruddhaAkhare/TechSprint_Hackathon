// import React, { useState, useEffect } from "react";
// import { db } from "../../../../config/firebase";
// import { getDocs, collection, addDoc, updateDoc, doc, serverTimestamp, query, where } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";

// const CreateBatches = ({ isOpen, toggleSidebar, batch }) => {
//     const navigate = useNavigate();

//     // State variables (modified course to array for multiple selection)
//     const [batchName, setBatchName] = useState("");
//     const [startDate, setStartDate] = useState("");
//     const [endDate, setEndDate] = useState("");
//     const [status, setStatus] = useState("Ongoing");

//     const [centers, setCenters] = useState([]);
//     const [selectedCenters, setSelectedCenters] = useState([]);
//     const [availableCenters, setAvailableCenters] = useState([]);

//     const [courses, setCourses] = useState([]); // Renamed from 'course' to 'courses'
//     const [selectedCourses, setSelectedCourses] = useState([]); // Changed to array
//     const [availableCourses, setAvailableCourses] = useState([]); // Renamed

//     const [curriculum, setCurriculum] = useState([]);
//     const [selectedCurriculum, setSelectedCurriculum] = useState([]);
//     const [availableCurriculum, setAvailableCurriculum] = useState([]);

//     const [batchManager, setBatchManager] = useState([]);
//     const [selectedBatchManager, setSelectedBatchManager] = useState([]);
//     const [availableBatchManager, setAvailableBatchManager] = useState([]);

//     const [batchFaculty, setBatchFaculty] = useState([]);
//     const [selectedBatchFaculty, setSelectedBatchFaculty] = useState([]);
//     const [availableBatchFaculty, setAvailableBatchFaculty] = useState([]);


//     // Utility function to capitalize the first letter
//     const capitalizeFirstLetter = (str) => {
//         if (!str || typeof str !== "string") return str;
//         return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
//     };


//     // useEffect hooks (unchanged)
//     const [students, setStudents] = useState([]);
//     const [selectedStudents, setSelectedStudents] = useState([]);
//     const [availableStudents, setAvailableStudents] = useState([]);

//     // useEffect hooks (updated course fetching)
//     useEffect(() => {
//         const fetchData = async () => {
//             const instituteSnapshot = await getDocs(collection(db, "instituteSetup"));
//             if(instituteSnapshot.empty){
//                 console.error("No instituteSetup document found");
//                 return;
//             }
//             const instituteId = instituteSnapshot.docs[0].id;
//             const centerQuery = query(
//                 collection(db, "instituteSetup", instituteId, "Center"),
//                 where ("isActive", "==", true)
//             );
//             const centerSnapshot = await getDocs(centerQuery);
//             const centersList = centerSnapshot.docs.map((doc)=>({id:doc.id, ...doc.data()}));
//             setCenters(centersList);
//             setAvailableCenters(centersList);
            
//             // const centerSnapshot = await getDocs(collection(db, "Centers"));
//             // const centersList = centerSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//             // setCenters(centersList);
//             // setAvailableCenters(centersList);



//             const courseSnapshot = await getDocs(collection(db, "Course"));
//             const coursesList = courseSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//             setCourses(coursesList);
//             setAvailableCourses(coursesList);

//             const curriculumSnapshot = await getDocs(collection(db, "curriculum"));
//             const curriculumList = curriculumSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//             setCurriculum(curriculumList);
//             setAvailableCurriculum(curriculumList);

//             const batchManagerSnapshot = await getDocs(collection(db, "Instructor"));
//             const batchManagersList = batchManagerSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//             setBatchManager(batchManagersList);
//             setAvailableBatchManager(batchManagersList);

//             const batchFacultySnapshot = await getDocs(collection(db, "Instructor"));
//             const batchFacultyList = batchFacultySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//             setBatchFaculty(batchFacultyList);
//             setAvailableBatchFaculty(batchFacultyList);

//             const studentSnapshot = await getDocs(collection(db, "student"));
//             const studentsList = studentSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//             setStudents(studentsList);
//             setAvailableStudents(studentsList);
//         };
//         fetchData();
//     }, []);

//     useEffect(() => {
//         if (batch) {
//             setBatchName(batch.batchName || "");
//             setStartDate(batch.startDate || "");
//             setEndDate(batch.endDate || "");
//             setStatus(batch.status || "Ongoing");
//             setSelectedCenters(batch.centers || []);
//             setAvailableCenters(centers.filter((c) => !batch.centers?.includes(c.id)));
//             setSelectedCourses(batch.courses || []); // Changed to courses (array)
//             setAvailableCourses(courses.filter((c) => !batch.courses?.includes(c.id)));
//             setSelectedCurriculum(batch.curriculum || []);
//             setAvailableCurriculum(curriculum.filter((c) => !batch.curriculum?.includes(c.id)));
//             setSelectedBatchManager(batch.batchManager || []);
//             setAvailableBatchManager(batchManager.filter((c) => !batch.batchManager?.includes(c.id)));
//             setSelectedBatchFaculty(batch.batchFaculty || []);
//             setAvailableBatchFaculty(batchFaculty.filter((c) => !batch.batchFaculty?.includes(c.id)));
//             setSelectedStudents(batch.students || []);
//             setAvailableStudents(students.filter((s) => !batch.students?.includes(s.id)));
//         }
//     }, [batch, centers, courses, curriculum, batchManager, batchFaculty, students]);

//     // Handler functions (added course handlers)
//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const batchData = {
//             batchName: capitalizeFirstLetter(batchName),
//             startDate,
//             endDate,
//             status,
//             centers: selectedCenters,
//             courses: selectedCourses, // Changed to courses (array)
//             curriculum: selectedCurriculum,
//             batchManager: selectedBatchManager,
//             batchFaculty: selectedBatchFaculty,
//             students: selectedStudents,
//             createdAt: serverTimestamp(),
//         };

//         try {
//             let batchId;
//             if (batch) {
//                 await updateDoc(doc(db, "Batch", batch.id), batchData);
//                 batchId = batch.id;
//                 alert("Batch updated successfully!");
//             } else {
//                 const docRef = await addDoc(collection(db, "Batch"), batchData);
//                 batchId = docRef.id;
//                 alert("Batch created successfully!");
//             }

//             for (const studentId of selectedStudents) {
//                 await updateDoc(doc(db, "student", studentId), {
//                     enrolledBatch: batchId
//                 });
//             }

//             resetForm();
//             toggleSidebar();
//         } catch (error) {
//             console.error("Error saving batch:", error);
//             alert("Failed to save batch. Please try again.");
//         }
//     };

//     const resetForm = () => {
//         setBatchName("");
//         setStartDate("");
//         setEndDate("");
//         setStatus("Ongoing");
//         setSelectedCenters([]);
//         setAvailableCenters(centers);
//         setSelectedCourses([]); // Reset to empty array
//         setAvailableCourses(courses);
//         setSelectedCurriculum([]);
//         setAvailableCurriculum(curriculum);
//         setSelectedBatchManager([]);
//         setAvailableBatchManager(batchManager);
//         setSelectedBatchFaculty([]);
//         setAvailableBatchFaculty(batchFaculty);
//         setSelectedStudents([]);
//         setAvailableStudents(students);
//     };

//     const handleAddCenter = (centerId) => {
//         if (centerId && !selectedCenters.includes(centerId)) {
//             setSelectedCenters([...selectedCenters, centerId]);
//             setAvailableCenters(availableCenters.filter((c) => c.id !== centerId));
//         }
//     };

//     const handleRemoveCenter = (centerId) => {
//         setSelectedCenters(selectedCenters.filter((id) => id !== centerId));
//         const removedCenter = centers.find((c) => c.id === centerId);
//         if (removedCenter) setAvailableCenters([...availableCenters, removedCenter]);
//     };

//     // New course handlers
//     const handleAddCourse = (courseId) => {
//         if (courseId && !selectedCourses.includes(courseId)) {
//             setSelectedCourses([...selectedCourses, courseId]);
//             setAvailableCourses(availableCourses.filter((c) => c.id !== courseId));
//         }
//     };

//     const handleRemoveCourse = (courseId) => {
//         setSelectedCourses(selectedCourses.filter((id) => id !== courseId));
//         const removedCourse = courses.find((c) => c.id === courseId);
//         if (removedCourse) setAvailableCourses([...availableCourses, removedCourse]);
//     };

//     const handleAddCurriculum = (curriculumId) => {
//         if (curriculumId && !selectedCurriculum.includes(curriculumId)) {
//             setSelectedCurriculum([...selectedCurriculum, curriculumId]);
//             setAvailableCurriculum(availableCurriculum.filter((c) => c.id !== curriculumId));
//         }
//     };

//     const handleRemoveCurriculum = (curriculumId) => {
//         setSelectedCurriculum(selectedCurriculum.filter((id) => id !== curriculumId));
//         const removedCurriculum = curriculum.find((c) => c.id === curriculumId);
//         if (removedCurriculum) setAvailableCurriculum([...availableCurriculum, removedCurriculum]);
//     };

//     const handleAddBatchManager = (batchManagerId) => {
//         if (batchManagerId && !selectedBatchManager.includes(batchManagerId)) {
//             setSelectedBatchManager([...selectedBatchManager, batchManagerId]);
//             setAvailableBatchManager(availableBatchManager.filter((c) => c.id !== batchManagerId));
//         }
//     };

//     const handleRemoveBatchManager = (batchManagerId) => {
//         setSelectedBatchManager(selectedBatchManager.filter((id) => id !== batchManagerId));
//         const removedBatchManager = batchManager.find((c) => c.id === batchManagerId);
//         if (removedBatchManager) setAvailableBatchManager([...availableBatchManager, removedBatchManager]);
//     };

//     const handleAddStudent = (studentId) => {
//         if (studentId && !selectedStudents.includes(studentId)) {
//             setSelectedStudents([...selectedStudents, studentId]);
//             setAvailableStudents(availableStudents.filter((s) => s.id !== studentId));
//         }
//     };

//     const handleRemoveStudent = (studentId) => {
//         setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
//         const removedStudent = students.find((s) => s.id === studentId);
//         if (removedStudent) setAvailableStudents([...availableStudents, removedStudent]);
//     };

//     const handleAddBatchFaculty = (batchFacultyId) => {
//         if (batchFacultyId && !selectedBatchFaculty.includes(batchFacultyId)) {
//             setSelectedBatchFaculty([...selectedBatchFaculty, batchFacultyId]);
//             setAvailableBatchFaculty(availableBatchFaculty.filter((c) => c.id !== batchFacultyId));
//         }
//     };

//     const handleRemoveBatchFaculty = (batchFacultyId) => {
//         setSelectedBatchFaculty(selectedBatchFaculty.filter((id) => id !== batchFacultyId));
//         const removedBatchFaculty = batchFaculty.find((c) => c.id === batchFacultyId);
//         if (removedBatchFaculty) setAvailableBatchFaculty([...availableBatchFaculty, removedBatchFaculty]);
//     };

//     return (
//         <>
//             {isOpen && (
//                 <div
//                     className="fixed inset-0 bg-black bg-opacity-50 z-40"
//                     onClick={toggleSidebar}
//                 />
//             )}

//             <div
//                 className={`fixed top-0 right-0 h-full bg-white w-full shadow-lg transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"} p-6 overflow-y-auto z-50`}
//             >
//                 <div className="flex justify-between items-center mb-6">
//                     <h1 className="text-2xl font-bold text-gray-800">
//                         {batch ? "Edit Batch" : "Create Batch"}
//                     </h1>
//                     <button
//                         type="button"
//                         onClick={toggleSidebar}
//                         className="bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 transition duration-200 text-base font-medium"
//                     >
//                         Back
//                     </button>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     {/* Batch Name */}
//                     <div>
//                         <label htmlFor="batchName" className="block text-base font-medium text-gray-700 mb-1">
//                             Batch Name
//                         </label>
//                         <input
//                             type="text"
//                             value={batchName}
//                             onChange={(e) => setBatchName(e.target.value)}
//                             required
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base"
//                             placeholder="Enter Batch Name"
//                         />
//                     </div>

//                     {/* Start Date */}
//                     <div>
//                         <label htmlFor="startDate" className="block text-base font-medium text-gray-700 mb-1">
//                             Start Date
//                         </label>
//                         <input
//                             type="date"
//                             value={startDate}
//                             onChange={(e) => setStartDate(e.target.value)}
//                             required
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base"
//                         />
//                     </div>

//                     {/* End Date */}
//                     <div>
//                         <label htmlFor="endDate" className="block text-base font-medium text-gray-700 mb-1">
//                             End Date
//                         </label>
//                         <input
//                             type="date"
//                             value={endDate}
//                             onChange={(e) => setEndDate(e.target.value)}
//                             required
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base"
//                         />
//                     </div>

//                     {/* Status */}
//                     <div>
//                         <label htmlFor="status" className="block text-base font-medium text-gray-700 mb-1">
//                             Status
//                         </label>
//                         <select
//                             value={status}
//                             onChange={(e) => setStatus(e.target.value)}
//                             required
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base"
//                         >
//                             <option value="Active">Active</option>
//                             <option value="Archive">Archive</option>
//                         </select>
//                     </div>

//                     {/* Courses Selection (Modified) */}
//                     <div>
//                         <label className="block text-base font-medium text-gray-700 mb-1">
//                             Select Courses
//                         </label>
//                         <select
//                             onChange={(e) => handleAddCourse(e.target.value)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base"
//                         >
//                             <option value="">Select a Course</option>
//                             {availableCourses.map((courseItem) => (
//                                 <option key={courseItem.id} value={courseItem.id}>
//                                     {courseItem.name}
//                                 </option>
//                             ))}
//                         </select>

//                         {selectedCourses.length > 0 && (
//                             <div className="mt-4">
//                                 <table className="min-w-full divide-y divide-gray-200">
//                                     <thead className="bg-gray-50">
//                                         <tr>
//                                             <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                 Sr No
//                                             </th>
//                                             <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                 Course Name
//                                             </th>
//                                             <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                 Action
//                                             </th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="bg-white divide-y divide-gray-200">
//                                         {selectedCourses.map((courseId, index) => {
//                                             const course = courses.find((c) => c.id === courseId);
//                                             return (
//                                                 <tr key={courseId}>
//                                                     <td className="px-4 py-2 whitespace-nowrap text-base text-gray-500">
//                                                         {index + 1}
//                                                     </td>
//                                                     <td className="px-4 py-2 whitespace-nowrap text-base text-gray-900">
//                                                         {course?.name}
//                                                     </td>
//                                                     <td className="px-4 py-2 whitespace-nowrap">
//                                                         <button
//                                                             type="button"
//                                                             onClick={() => handleRemoveCourse(courseId)}
//                                                             className="text-red-600 hover:text-red-800"
//                                                         >
//                                                             ✕
//                                                         </button>
//                                                     </td>
//                                                 </tr>
//                                             );
//                                         })}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         )}
//                     </div>

//                     {/* Centers */}
//                     <div>
//                         <label className="block text-base font-medium text-gray-700 mb-1">
//                             Select Center
//                         </label>
//                         <select
//                             onChange={(e) => handleAddCenter(e.target.value)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base"
//                         >
//                             <option value="">Select a Center</option>
//                             {availableCenters.map((center) => (
//                                 <option key={center.id} value={center.id}>
//                                     {center.name}
//                                 </option>
//                             ))}
//                         </select>

//                         {selectedCenters.length > 0 && (
//                             <div className="mt-4">
//                                 <table className="min-w-full divide-y divide-gray-200">
//                                     <thead className="bg-gray-50">
//                                         <tr>
//                                             <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                 Sr No
//                                             </th>
//                                             <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                 Center Name
//                                             </th>
//                                             <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                 Action
//                                             </th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="bg-white divide-y divide-gray-200">
//                                         {selectedCenters.map((centerId, index) => {
//                                             const center = centers.find((c) => c.id === centerId);
//                                             return (
//                                                 <tr key={centerId}>
//                                                     <td className="px-4 py-2 whitespace-nowrap text-base text-gray-500">
//                                                         {index + 1}
//                                                     </td>
//                                                     <td className="px-4 py-2 whitespace-nowrap text-base text-gray-900">
//                                                         {center?.name}
//                                                     </td>
//                                                     <td className="px-4 py-2 whitespace-nowrap">
//                                                         <button
//                                                             type="button"
//                                                             onClick={() => handleRemoveCenter(centerId)}
//                                                             className="text-red-600 hover:text-red-800"
//                                                         >
//                                                             ✕
//                                                         </button>
//                                                     </td>
//                                                 </tr>
//                                             );
//                                         })}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         )}
//                     </div>

//                     {/* Curriculum */}
//                     <div>
//                         <label className="block text-base font-medium text-gray-700 mb-1">
//                             Select Curriculum
//                         </label>
//                         <select
//                             onChange={(e) => handleAddCurriculum(e.target.value)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base"
//                         >
//                             <option value="">Select a Curriculum</option>
//                             {availableCurriculum.map((curriculumItem) => (
//                                 <option key={curriculumItem.id} value={curriculumItem.id}>
//                                     {curriculumItem.name}
//                                 </option>
//                             ))}
//                         </select>

//                         {selectedCurriculum.length > 0 && (
//                             <div className="mt-4">
//                                 <table className="min-w-full divide-y divide-gray-200">
//                                     <thead className="bg-gray-50">
//                                         <tr>
//                                             <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                 Sr No
//                                             </th>
//                                             <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                 Curriculum Name
//                                             </th>
//                                             <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                 Action
//                                             </th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="bg-white divide-y divide-gray-200">
//                                         {selectedCurriculum.map((curriculumId, index) => {
//                                             const curr = curriculum.find((c) => c.id === curriculumId);
//                                             return (
//                                                 <tr key={curriculumId}>
//                                                     <td className="px-4 py-2 whitespace-nowrap text-base text-gray-500">
//                                                         {index + 1}
//                                                     </td>
//                                                     <td className="px-4 py-2 whitespace-nowrap text-base text-gray-900">
//                                                         {curr?.name}
//                                                     </td>
//                                                     <td className="px-4 py-2 whitespace-nowrap">
//                                                         <button
//                                                             type="button"
//                                                             onClick={() => handleRemoveCurriculum(curriculumId)}
//                                                             className="text-red-600 hover:text-red-800"
//                                                         >
//                                                             ✕
//                                                         </button>
//                                                     </td>
//                                                 </tr>
//                                             );
//                                         })}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         )}
//                     </div>

//                     {/* Batch Manager */}
//                     <div>
//                         <label className="block text-base font-medium text-gray-700 mb-1">
//                             Select Batch Manager
//                         </label>
//                         <select
//                             onChange={(e) => handleAddBatchManager(e.target.value)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base"
//                         >
//                             <option value="">Select a Batch Manager</option>
//                             {availableBatchManager.map((manager) => (
//                                 <option key={manager.id} value={manager.id}>
//                                     {manager.f_name}
//                                 </option>
//                             ))}
//                         </select>

//                         {selectedBatchManager.length > 0 && (
//                             <div className="mt-4">
//                                 <table className="min-w-full divide-y divide-gray-200">
//                                     <thead className="bg-gray-50">
//                                         <tr>
//                                             <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                 Sr No
//                                             </th>
//                                             <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                 Batch Manager
//                                             </th>
//                                             <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                 Action
//                                             </th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="bg-white divide-y divide-gray-200">
//                                         {selectedBatchManager.map((managerId, index) => {
//                                             const BM = batchManager.find((c) => c.id === managerId);
//                                             return (
//                                                 <tr key={managerId}>
//                                                     <td className="px-4 py-2 whitespace-nowrap text-base text-gray-500">
//                                                         {index + 1}
//                                                     </td>
//                                                     <td className="px-4 py-2 whitespace-nowrap text-base text-gray-900">
//                                                         {BM?.f_name}
//                                                     </td>
//                                                     <td className="px-4 py-2 whitespace-nowrap">
//                                                         <button
//                                                             type="button"
//                                                             onClick={() => handleRemoveBatchManager(managerId)}
//                                                             className="text-red-600 hover:text-red-800"
//                                                         >
//                                                             ✕
//                                                         </button>
//                                                     </td>
//                                                 </tr>
//                                             );
//                                         })}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         )}
//                     </div>

//                     <div>
//                         <label className="block text-base font-medium text-gray-700 mb-1">
//                             Select Batch Faculty
//                         </label>
//                         <select
//                             onChange={(e) => handleAddBatchFaculty(e.target.value)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base"
//                         >
//                             <option value="">Select a Batch Faculty</option>
//                             {availableBatchFaculty.map((faculty) => (
//                                 <option key={faculty.id} value={faculty.id}>
//                                     {faculty.f_name}
//                                 </option>
//                             ))}
//                         </select>

//                         {selectedBatchFaculty.length > 0 && (
//                             <div className="mt-4">
//                                 <table className="min-w-full divide-y divide-gray-200">
//                                     <thead className="bg-gray-50">
//                                         <tr>
//                                             <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                 Sr No
//                                             </th>
//                                             <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                 Batch Faculty Name
//                                             </th>
//                                             <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                 Action
//                                             </th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="bg-white divide-y divide-gray-200">
//                                         {selectedBatchFaculty.map((facultyId, index) => {
//                                             const BF = batchFaculty.find((c) => c.id === facultyId);
//                                             return (
//                                                 <tr key={facultyId}>
//                                                     <td className="px-4 py-2 whitespace-nowrap text-base text-gray-500">
//                                                         {index + 1}
//                                                     </td>
//                                                     <td className="px-4 py-2 whitespace-nowrap text-base text-gray-900">
//                                                         {BF?.f_name}
//                                                     </td>
//                                                     <td className="px-4 py-2 whitespace-nowrap">
//                                                         <button
//                                                             type="button"
//                                                             onClick={() => handleRemoveBatchFaculty(facultyId)}
//                                                             className="text-red-600 hover:text-red-800"
//                                                         >
//                                                             ✕
//                                                         </button>
//                                                     </td>
//                                                 </tr>
//                                             );
//                                         })}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         )}
//                     </div>

//                     <div>
//                         <label className="block text-base font-medium text-gray-700 mb-1">
//                             Select Students
//                         </label>
//                         <select
//                             onChange={(e) => handleAddStudent(e.target.value)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base"
//                         >
//                             <option value="">Select Students</option>
//                             {availableStudents.map((student) => (
//                                 <option key={student.id} value={student.id}>
//                                     {student.first_name} {student.last_name} ({student.email})
//                                 </option>
//                             ))}
//                         </select>

//                         {selectedStudents.length > 0 && (
//                             <div className="mt-4">
//                                 <div className="bg-gray-100 p-3 rounded-md">
//                                     <h3 className="text-sm font-medium text-gray-700 mb-2">
//                                         Selected Students ({selectedStudents.length})
//                                     </h3>
//                                     <div className="max-h-40 overflow-y-auto">
//                                         {selectedStudents.map((studentId) => {
//                                             const student = students.find((s) => s.id === studentId);
//                                             return (
//                                                 <div
//                                                     key={studentId}
//                                                     className="flex items-center justify-between bg-white p-2 mb-2 rounded-md shadow-sm"
//                                                 >
//                                                     <span className="text-sm text-gray-900">
//                                                         {student?.first_name} {student?.last_name}
//                                                     </span>
//                                                     <button
//                                                         type="button"
//                                                         onClick={() => handleRemoveStudent(studentId)}
//                                                         className="text-red-600 hover:text-red-800 text-sm"
//                                                     >
//                                                         ✕
//                                                     </button>
//                                                 </div>
//                                             );
//                                         })}
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     {/* Total Students */}
//                     <div>
//                         <label className="block text-base font-medium text-gray-700 mb-1">
//                             Total Students: {selectedStudents.length}
//                         </label>
//                     </div>

//                     {/* Submit Button */}
//                     <div className="flex justify-end mt-6">
//                         <button
//                             type="submit"
//                             className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200 text-base font-medium"
//                         >
//                             {batch ? "Update Batch" : "Create Batch"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </>
//     );
// };

// export default CreateBatches;

import React, { useState, useEffect } from "react";
import { db } from "../../../../config/firebase";
import { getDocs, collection, addDoc, updateDoc, doc, serverTimestamp, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const CreateBatch = ({ isOpen, toggleSidebar, batch }) => {
  const navigate = useNavigate();

  // State variables
  const [batchName, setBatchName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("Active"); // Changed default from "Ongoing" to "Active"

  const [centers, setCenters] = useState([]);
  const [selectedCenters, setSelectedCenters] = useState([]);
  const [availableCenters, setAvailableCenters] = useState([]);

  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);

  const [curriculum, setCurriculum] = useState([]);
  const [selectedCurriculum, setSelectedCurriculum] = useState([]);
  const [availableCurriculum, setAvailableCurriculum] = useState([]);

  const [batchManager, setBatchManager] = useState([]);
  const [selectedBatchManager, setSelectedBatchManager] = useState([]);
  const [availableBatchManager, setAvailableBatchManager] = useState([]);

  const [batchFaculty, setBatchFaculty] = useState([]);
  const [selectedBatchFaculty, setSelectedBatchFaculty] = useState([]);
  const [availableBatchFaculty, setAvailableBatchFaculty] = useState([]);

  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);

  // Utility function to capitalize the first letter
  const capitalizeFirstLetter = (str) => {
    if (!str || typeof str !== "string") return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Fetch data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      const instituteSnapshot = await getDocs(collection(db, "instituteSetup"));
      if (instituteSnapshot.empty) {
        console.error("No instituteSetup document found");
        return;
      }
      const instituteId = instituteSnapshot.docs[0].id;
      const centerQuery = query(
        collection(db, "instituteSetup", instituteId, "Center"),
        where("isActive", "==", true)
      );
      const centerSnapshot = await getDocs(centerQuery);
      const centersList = centerSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCenters(centersList);
      setAvailableCenters(centersList);

      const courseSnapshot = await getDocs(collection(db, "Course"));
      const coursesList = courseSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCourses(coursesList);
      setAvailableCourses(coursesList);

      const curriculumSnapshot = await getDocs(collection(db, "curriculum"));
      const curriculumList = curriculumSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCurriculum(curriculumList);
      setAvailableCurriculum(curriculumList);

      const batchManagerSnapshot = await getDocs(collection(db, "Instructor"));
      const batchManagersList = batchManagerSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBatchManager(batchManagersList);
      setAvailableBatchManager(batchManagersList);

      const batchFacultySnapshot = await getDocs(collection(db, "Instructor"));
      const batchFacultyList = batchFacultySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBatchFaculty(batchFacultyList);
      setAvailableBatchFaculty(batchFacultyList);

      const studentSnapshot = await getDocs(collection(db, "student"));
      const studentsList = studentSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setStudents(studentsList);
      setAvailableStudents(studentsList);
    };
    fetchData();
  }, []);

  // Populate form with batch data when editing
  useEffect(() => {
    if (batch) {
      setBatchName(batch.batchName || "");
      setStartDate(batch.startDate || "");
      setEndDate(batch.endDate || "");
      setStatus(batch.status || "Active"); // Default to "Active" if status is undefined
      setSelectedCenters(batch.centers || []);
      setAvailableCenters(centers.filter((c) => !batch.centers?.includes(c.id)));
      setSelectedCourses(batch.courses || []);
      setAvailableCourses(courses.filter((c) => !batch.courses?.includes(c.id)));
      setSelectedCurriculum(batch.curriculum || []);
      setAvailableCurriculum(curriculum.filter((c) => !batch.curriculum?.includes(c.id)));
      setSelectedBatchManager(batch.batchManager || []);
      setAvailableBatchManager(batchManager.filter((c) => !batch.batchManager?.includes(c.id)));
      setSelectedBatchFaculty(batch.batchFaculty || []);
      setAvailableBatchFaculty(batchFaculty.filter((c) => !batch.batchFaculty?.includes(c.id)));
      setSelectedStudents(batch.students || []);
      setAvailableStudents(students.filter((s) => !batch.students?.includes(s.id)));
    }
  }, [batch, centers, courses, curriculum, batchManager, batchFaculty, students]);

  // Handler functions
  const handleSubmit = async (e) => {
    e.preventDefault();

    const batchData = {
      batchName: capitalizeFirstLetter(batchName),
      startDate,
      endDate,
      status, // Will be "Active" or "Inactive"
      centers: selectedCenters,
      courses: selectedCourses,
      curriculum: selectedCurriculum,
      batchManager: selectedBatchManager,
      batchFaculty: selectedBatchFaculty,
      students: selectedStudents,
      createdAt: serverTimestamp(),
    };

    try {
      let batchId;
      if (batch) {
        await updateDoc(doc(db, "Batch", batch.id), batchData);
        batchId = batch.id;
        alert("Batch updated successfully!");
      } else {
        const docRef = await addDoc(collection(db, "Batch"), batchData);
        batchId = docRef.id;
        alert("Batch created successfully!");
      }

    // const [students, setStudents] = useState([]);
    // const [selectedStudents, setSelectedStudents] = useState([]);
    // const [availableStudents, setAvailableStudents] = useState([]);

    // useEffect hooks (updated course fetching)
    // useEffect(() => {
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
          }
            
            // const centerSnapshot = await getDocs(collection(db, "Centers"));
            // const centersList = centerSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            // setCenters(centersList);
            // setAvailableCenters(centersList);
      for (const studentId of selectedStudents) {
        await updateDoc(doc(db, "student", studentId), {
          enrolledBatch: batchId,
        });
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
    setStatus("Active"); // Changed from "Ongoing" to "Active"
    setSelectedCenters([]);
    setAvailableCenters(centers);
    setSelectedCourses([]);
    setAvailableCourses(courses);
    setSelectedCurriculum([]);
    setAvailableCurriculum(curriculum);
    setSelectedBatchManager([]);
    setAvailableBatchManager(batchManager);
    setSelectedBatchFaculty([]);
    setAvailableBatchFaculty(batchFaculty);
    setSelectedStudents([]);
    setAvailableStudents(students);
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

  const handleAddCourse = (courseId) => {
    if (courseId && !selectedCourses.includes(courseId)) {
      setSelectedCourses([...selectedCourses, courseId]);
      setAvailableCourses(availableCourses.filter((c) => c.id !== courseId));
    }
  };

  const handleRemoveCourse = (courseId) => {
    setSelectedCourses(selectedCourses.filter((id) => id !== courseId));
    const removedCourse = courses.find((c) => c.id === courseId);
    if (removedCourse) setAvailableCourses([...availableCourses, removedCourse]);
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

  const handleAddStudent = (studentId) => {
    if (studentId && !selectedStudents.includes(studentId)) {
      setSelectedStudents([...selectedStudents, studentId]);
      setAvailableStudents(availableStudents.filter((s) => s.id !== studentId));
    }
  };

  const handleRemoveStudent = (studentId) => {
    setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
    const removedStudent = students.find((s) => s.id === studentId);
    if (removedStudent) setAvailableStudents([...availableStudents, removedStudent]);
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
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full bg-white w-full shadow-lg transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"} p-6 overflow-y-auto z-50`}
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
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Courses Selection */}
          <div>
            <label className="block text-base font-medium text-gray-700 mb-1">
              Select Courses
            </label>
            <select
              onChange={(e) => handleAddCourse(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base"
            >
              <option value="">Select a Course</option>
              {availableCourses.map((courseItem) => (
                <option key={courseItem.id} value={courseItem.id}>
                  {courseItem.name}
                </option>
              ))}
            </select>

            {selectedCourses.length > 0 && (
              <div className="mt-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sr No
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course Name
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedCourses.map((courseId, index) => {
                      const course = courses.find((c) => c.id === courseId);
                      return (
                        <tr key={courseId}>
                          <td className="px-4 py-2 whitespace-nowrap text-base text-gray-500">
                            {index + 1}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-base text-gray-900">
                            {course?.name}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleRemoveCourse(courseId)}
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

          {/* Students */}
          <div>
            <label className="block text-base font-medium text-gray-700 mb-1">
              Select Students
            </label>
            <select
              onChange={(e) => handleAddStudent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base"
            >
              <option value="">Select Students</option>
              {availableStudents.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.first_name} {student.last_name} ({student.email})
                </option>
              ))}
            </select>

            {selectedStudents.length > 0 && (
              <div className="mt-4">
                <div className="bg-gray-100 p-3 rounded-md">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Selected Students ({selectedStudents.length})
                  </h3>
                  <div className="max-h-40 overflow-y-auto">
                    {selectedStudents.map((studentId) => {
                      const student = students.find((s) => s.id === studentId);
                      return (
                        <div
                          key={studentId}
                          className="flex items-center justify-between bg-white p-2 mb-2 rounded-md shadow-sm"
                        >
                          <span className="text-sm text-gray-900">
                            {student?.first_name} {student?.last_name}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveStudent(studentId)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Total Students */}
          <div>
            <label className="block text-base font-medium text-gray-700 mb-1">
              Total Students: {selectedStudents.length}
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

export default CreateBatch;