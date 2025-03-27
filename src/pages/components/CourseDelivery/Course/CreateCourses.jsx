// // import React, { useState, useEffect } from "react";
// // import { db } from "../../../../config/firebase";
// // import {
// //   getDocs,
// //   collection,
// //   addDoc,
// //   updateDoc,
// //   doc,
// //   serverTimestamp,
// // } from "firebase/firestore";
// // import { useNavigate } from "react-router-dom";

// // const CreateCourses = ({ isOpen, toggleSidebar, course }) => {
// //   const navigate = useNavigate();
// //   const [courses, setCourses] = useState([]);
// //   const [instructors, setInstructors] = useState([]);
// //   const [centers, setCenters] = useState([]);
// //   const [batches, setBatches] = useState([]);
// //   const [owners, setOwners] = useState([]);

// //   const [courseName, setCourseName] = useState("");
// //   const [courseDescription, setCourseDescription] = useState("");
// //   const [courseFee, setCourseFee] = useState("");
// //   const [courseDuration, setCourseDuration] = useState("");
// //   const [courseMode, setCourseMode] = useState("");
// //   const [courseStatus, setCourseStatus] = useState("Active");

// //   const [centerAssignments, setCenterAssignments] = useState([]);
// //   const [selectedBatches, setSelectedBatches] = useState([]);
// //   const [selectedOwners, setSelectedOwners] = useState([]);
// //   const [studentCount, setStudentCount] = useState(0);
// //   const [batchStudentCounts, setBatchStudentCounts] = useState({});

// //   const [availableCenters, setAvailableCenters] = useState([]);
// //   const [availableBatches, setAvailableBatches] = useState([]);
// //   const [availableOwners, setAvailableOwners] = useState([]);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       const instructorSnapshot = await getDocs(collection(db, "Instructor"));
// //       setInstructors(instructorSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

// //       const centerSnapshot = await getDocs(collection(db, "Centers"));
// //       const centersList = centerSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// //       setCenters(centersList);
// //       setAvailableCenters(centersList);

// //       const batchSnapshot = await getDocs(collection(db, "Batch"));
// //       const batchesList = batchSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// //       setBatches(batchesList);
// //       setAvailableBatches(batchesList.filter(batch => batch.status === "Ongoing" || !batch.status));

// //       const ownerSnapshot = await getDocs(collection(db, "Instructor"));
// //       const ownersList = ownerSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// //       setOwners(ownersList);
// //       setAvailableOwners(ownersList);

// //       if (course) {
// //         const studentSnapshot = await getDocs(collection(db, `Course/${course.id}/Students`));
// //         setStudentCount(studentSnapshot.docs.length);

// //         const batchCounts = {};
// //         for (const batchId of course.batches || []) {
// //           const batchStudents = await getDocs(collection(db, `Batch/${batchId}/Students`));
// //           batchCounts[batchId] = batchStudents.docs.length;
// //         }
// //         setBatchStudentCounts(batchCounts);
// //       }
// //     };
// //     fetchData();
// //   }, [course]);

// //   // Reset or populate form based on course prop
// //   useEffect(() => {
// //     if (course) {
// //       // Editing an existing course
// //       setCourseName(course.name || "");
// //       setCourseDescription(course.description || "");
// //       setCourseFee(course.fee || "");
// //       setCourseDuration(course.duration || "");
// //       setCourseMode(course.mode || "");
// //       setCourseStatus(course.status || "Active");
// //       setCenterAssignments(course.centers?.map(c => typeof c === "string" ? { centerId: c, status: "Active" } : c) || []);
// //       setSelectedBatches(course.batches || []);
// //       setSelectedOwners(course.owners || []);
// //       setAvailableCenters(centers.filter(c => !course.centers?.some(ca => ca.centerId === c.id)));
// //       setAvailableBatches(batches.filter(b => (b.status === "Ongoing" || !b.status) && !course.batches?.includes(b.id)));
// //       setAvailableOwners(owners.filter(o => !course.owners?.includes(o.id)));
// //     } else {
// //       // Creating a new course - reset form
// //       resetForm();
// //     }
// //   }, [course, centers, batches, owners]);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     const courseData = {
// //       name: courseName,
// //       description: courseDescription,
// //       fee: courseFee,
// //       duration: courseDuration,
// //       mode: courseMode,
// //       status: courseStatus,
// //       centers: centerAssignments,
// //       batches: selectedBatches,
// //       owners: selectedOwners,
// //       createdAt: serverTimestamp(),
// //     };

// //     try {
// //       if (course) {
// //         await updateDoc(doc(db, "Course", course.id), courseData);
// //         alert("Course updated successfully!");
// //       } else {
// //         await addDoc(collection(db, "Course"), courseData);
// //         alert("Course created successfully!");
// //       }
// //       resetForm();
// //       toggleSidebar();
// //     } catch (error) {
// //       console.error("Error saving course:", error);
// //       alert("Failed to save course. Please try again.");
// //     }
// //   };

// //   const resetForm = () => {
// //     setCourseName("");
// //     setCourseDescription("");
// //     setCourseFee("");
// //     setCourseDuration("");
// //     setCourseMode("");
// //     setCourseStatus("Active");
// //     setCenterAssignments([]);
// //     setSelectedBatches([]);
// //     setSelectedOwners([]);
// //     setStudentCount(0);
// //     setBatchStudentCounts({});
// //     setAvailableCenters(centers);
// //     setAvailableBatches(batches.filter(batch => batch.status === "Ongoing" || !batch.status));
// //     setAvailableOwners(owners);
// //   };

// //   const handleAddCenter = (centerId) => {
// //     if (centerId && !centerAssignments.some(ca => ca.centerId === centerId)) {
// //       setCenterAssignments([...centerAssignments, { centerId, status: "Active" }]);
// //       setAvailableCenters(availableCenters.filter(c => c.id !== centerId));
// //     }
// //   };

// //   const handleRemoveCenter = (centerId) => {
// //     setCenterAssignments(centerAssignments.filter(ca => ca.centerId !== centerId));
// //     const removedCenter = centers.find(c => c.id === centerId);
// //     if (removedCenter) setAvailableCenters([...availableCenters, removedCenter]);
// //   };

// //   const handleCenterStatusChange = (centerId, newStatus) => {
// //     setCenterAssignments(centerAssignments.map(ca => 
// //       ca.centerId === centerId ? { ...ca, status: newStatus } : ca
// //     ));
// //   };

// //   const handleAddBatch = (batchId) => {
// //     if (batchId && !selectedBatches.includes(batchId)) {
// //       setSelectedBatches([...selectedBatches, batchId]);
// //       setAvailableBatches(availableBatches.filter(b => b.id !== batchId));
// //     }
// //   };

// //   const handleRemoveBatch = (batchId) => {
// //     setSelectedBatches(selectedBatches.filter(id => id !== batchId));
// //     const removedBatch = batches.find(b => b.id === batchId);
// //     if (removedBatch && (removedBatch.status === "Ongoing" || !removedBatch.status)) {
// //       setAvailableBatches([...availableBatches, removedBatch]);
// //     }
// //   };

// //   const handleAddOwner = (ownerId) => {
// //     if (ownerId && !selectedOwners.includes(ownerId)) {
// //       setSelectedOwners([...selectedOwners, ownerId]);
// //       setAvailableOwners(availableOwners.filter(o => o.id !== ownerId));
// //     }
// //   };

// //   const handleRemoveOwner = (ownerId) => {
// //     setSelectedOwners(selectedOwners.filter(id => id !== ownerId));
// //     const removedOwner = owners.find(o => o.id === ownerId);
// //     if (removedOwner) setAvailableOwners([...availableOwners, removedOwner]);
// //   };

// //   return (
// //     <div
// //       className={`fixed top-0 right-0 h-full bg-white w-full shadow-lg transform transition-transform duration-300 ${
// //         isOpen ? "translate-x-0" : "translate-x-full"
// //       } p-6 overflow-y-auto`}
// //     >
// //       <div className="flex justify-between items-center mb-6">
// //         <h1 className="text-2xl font-bold text-gray-800">
// //           {course ? "Edit Course" : "Create Course"}
// //         </h1>
// //         <button
// //           type="button"
// //           onClick={toggleSidebar}
// //           className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
// //         >
// //           Back
// //         </button>
// //       </div>

// //       <form onSubmit={handleSubmit} className="space-y-6">
// //         <div>
// //           <label htmlFor="courseName" className="block text-base font-medium text-gray-700">
// //             Course Name
// //           </label>
// //           <input
// //             type="text"
// //             value={courseName}
// //             placeholder="Course Name"
// //             onChange={(e) => setCourseName(e.target.value)}
// //             required
// //             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
// //           />
// //         </div>

// //         <div>
// //           <label htmlFor="courseDescription" className="block text-base font-medium text-gray-700">
// //             Course Description
// //           </label>
// //           <input
// //             type="text"
// //             value={courseDescription}
// //             placeholder="Course Description"
// //             onChange={(e) => setCourseDescription(e.target.value)}
// //             required
// //             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
// //           />
// //         </div>

// //         <div>
// //           <label htmlFor="courseFee" className="block text-base font-medium text-gray-700">
// //             Fee
// //           </label>
// //           <input
// //             type="number"
// //             value={courseFee}
// //             placeholder="Enter Course Fee"
// //             onChange={(e) => setCourseFee(e.target.value)}
// //             required
// //             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
// //           />
// //         </div>

// //         <div>
// //           <label htmlFor="courseDuration" className="block text-base font-medium text-gray-700">
// //             Duration
// //           </label>
// //           <input
// //             type="text"
// //             value={courseDuration}
// //             placeholder="Enter Course Duration"
// //             onChange={(e) => setCourseDuration(e.target.value)}
// //             required
// //             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
// //           />
// //         </div>

// //         <div>
// //           <label htmlFor="courseMode" className="block text-base font-medium text-gray-700">
// //             Mode
// //           </label>
// //           <select
// //             value={courseMode}
// //             onChange={(e) => setCourseMode(e.target.value)}
// //             required
// //             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
// //           >
// //             <option value="">Select Mode</option>
// //             <option value="Online">Online</option>
// //             <option value="Offline">Offline</option>
// //             <option value="Hybrid">Hybrid</option>
// //           </select>
// //         </div>

// //         <div>
// //           <label htmlFor="courseStatus" className="block text-base font-medium text-gray-700">
// //             Status
// //           </label>
// //           <select
// //             value={courseStatus}
// //             onChange={(e) => setCourseStatus(e.target.value)}
// //             required
// //             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
// //           >
// //             <option value="Active">Active</option>
// //             <option value="Inactive">Inactive</option>
// //           </select>
// //         </div>

// //         <h3 className="text-lg font-semibold text-gray-800">Total Students: {studentCount}</h3>

// //         <div>
// //           <select
// //             onChange={(e) => handleAddCenter(e.target.value)}
// //             className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
// //           >
// //             <option value="">Select a Center</option>
// //             {availableCenters.map((center) => (
// //               <option key={center.id} value={center.id}>
// //                 {center.name}
// //               </option>
// //             ))}
// //           </select>

// //           {centerAssignments.length > 0 && (
// //             <div className="mt-4">
// //               <table className="min-w-full divide-y divide-gray-200">
// //                 <thead className="bg-gray-50">
// //                   <tr>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr No</th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Center Name</th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="bg-white divide-y divide-gray-200">
// //                   {centerAssignments.map((ca, index) => {
// //                     const center = centers.find((c) => c.id === ca.centerId);
// //                     return (
// //                       <tr key={ca.centerId}>
// //                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">{index + 1}</td>
// //                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">{center?.name}</td>
// //                         <td className="px-6 py-4 whitespace-nowrap">
// //                           <select
// //                             value={ca.status}
// //                             onChange={(e) => handleCenterStatusChange(ca.centerId, e.target.value)}
// //                             className="block w-full px-3 py-1 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
// //                           >
// //                             <option value="Active">Active</option>
// //                             <option value="Inactive">Inactive</option>
// //                           </select>
// //                         </td>
// //                         <td className="px-6 py-4 whitespace-nowrap">
// //                           <button
// //                             type="button"
// //                             onClick={() => handleRemoveCenter(ca.centerId)}
// //                             className="text-red-600 hover:text-red-800"
// //                           >
// //                             ✕
// //                           </button>
// //                         </td>
// //                       </tr>
// //                     );
// //                   })}
// //                 </tbody>
// //               </table>
// //             </div>
// //           )}
// //         </div>

// //         <div>
// //           <select
// //             onChange={(e) => handleAddBatch(e.target.value)}
// //             className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
// //           >
// //             <option value="">Select a Batch</option>
// //             {availableBatches.map((batch) => (
// //               <option key={batch.id} value={batch.id}>
// //                 {batch.batchName}
// //               </option>
// //             ))}
// //           </select>

// //           {selectedBatches.length > 0 && (
// //             <div className="mt-4">
// //               <table className="min-w-full divide-y divide-gray-200">
// //                 <thead className="bg-gray-50">
// //                   <tr>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr No</th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch Name</th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Count</th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="bg-white divide-y divide-gray-200">
// //                   {selectedBatches.map((batchId, index) => {
// //                     const batch = batches.find((b) => b.id === batchId);
// //                     return (
// //                       <tr key={batchId}>
// //                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">{index + 1}</td>
// //                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">{batch?.batchName}</td>
// //                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">{batchStudentCounts[batchId] || 0}</td>
// //                         <td className="px-6 py-4 whitespace-nowrap">
// //                           <button
// //                             type="button"
// //                             onClick={() => handleRemoveBatch(batchId)}
// //                             className="text-red-600 hover:text-red-800"
// //                           >
// //                             ✕
// //                           </button>
// //                         </td>
// //                       </tr>
// //                     );
// //                   })}
// //                 </tbody>
// //               </table>
// //             </div>
// //           )}
// //         </div>

// //         <div>
// //           <select
// //             onChange={(e) => handleAddOwner(e.target.value)}
// //             className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
// //           >
// //             <option value="">Select an Owner</option>
// //             {availableOwners.map((owner) => (
// //               <option key={owner.id} value={owner.id}>
// //                 {owner.f_name}
// //               </option>
// //             ))}
// //           </select>

// //           {selectedOwners.length > 0 && (
// //             <div className="mt-4">
// //               <table className="min-w-full divide-y divide-gray-200">
// //                 <thead className="bg-gray-50">
// //                   <tr>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr No</th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner Name</th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="bg-white divide-y divide-gray-200">
// //                   {selectedOwners.map((ownerId, index) => {
// //                     const owner = owners.find((o) => o.id === ownerId);
// //                     return (
// //                       <tr key={ownerId}>
// //                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">{index + 1}</td>
// //                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">{owner?.f_name}</td>
// //                         <td className="px-6 py-4 whitespace-nowrap">
// //                           <button
// //                             type="button"
// //                             onClick={() => handleRemoveOwner(ownerId)}
// //                             className="text-red-600 hover:text-red-800"
// //                           >
// //                             ✕
// //                           </button>
// //                         </td>
// //                       </tr>
// //                     );
// //                   })}
// //                 </tbody>
// //               </table>
// //             </div>
// //           )}
// //         </div>

// //         <div className="flex justify-end">
// //           <button
// //             type="submit"
// //             className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200"
// //           >
// //             {course ? "Update Course" : "Create Course"}
// //           </button>
// //         </div>
// //       </form>
// //     </div>
// //   );
// // };

// // export default CreateCourses;


// import React, { useState, useEffect } from "react";
// import { db } from "../../../../config/firebase";
// import {
//   getDocs,
//   collection,
//   addDoc,
//   updateDoc,
//   doc,
//   serverTimestamp,
// } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";

// const CreateCourses = ({ isOpen, toggleSidebar, course }) => {
//   const navigate = useNavigate();
//   const [courses, setCourses] = useState([]);
//   const [instructors, setInstructors] = useState([]);
//   const [centers, setCenters] = useState([]);
//   const [batches, setBatches] = useState([]);
//   const [owners, setOwners] = useState([]);

//   const [courseName, setCourseName] = useState("");
//   const [courseDescription, setCourseDescription] = useState("");
//   const [courseFee, setCourseFee] = useState("");
//   const [courseDuration, setCourseDuration] = useState("");
//   const [courseMode, setCourseMode] = useState("");
//   const [courseStatus, setCourseStatus] = useState("Active");

//   const [centerAssignments, setCenterAssignments] = useState([]);
//   const [selectedBatches, setSelectedBatches] = useState([]);
//   const [selectedOwners, setSelectedOwners] = useState([]);
//   const [studentCount, setStudentCount] = useState(0);
//   const [batchStudentCounts, setBatchStudentCounts] = useState({});

//   const [availableCenters, setAvailableCenters] = useState([]);
//   const [availableBatches, setAvailableBatches] = useState([]);
//   const [availableOwners, setAvailableOwners] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       // Fetch Instructors
//       const instructorSnapshot = await getDocs(collection(db, "Instructor"));
//       setInstructors(instructorSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

//       // Fetch Centers from instituteSetup -> Center (only active ones)
//       const instituteSnapshot = await getDocs(collection(db, "instituteSetup"));
//       if (!instituteSnapshot.empty) {
//         const instituteId = instituteSnapshot.docs[0].id; // Assuming single institute
//         const centerSnapshot = await getDocs(collection(db, "instituteSetup", instituteId, "Center"));
//         const activeCenters = centerSnapshot.docs
//           .map((doc) => ({ id: doc.id, ...doc.data() }))
//           .filter((center) => center.isActive); // Filter only active centers
//         setCenters(activeCenters);
//         setAvailableCenters(activeCenters);
//       }

//       // Fetch Batches
//       const batchSnapshot = await getDocs(collection(db, "Batch"));
//       const batchesList = batchSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//       setBatches(batchesList);
//       setAvailableBatches(batchesList.filter(batch => batch.status === "Ongoing" || !batch.status));

//       // Fetch Owners (assuming owners are instructors)
//       const ownerSnapshot = await getDocs(collection(db, "Instructor"));
//       const ownersList = ownerSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//       setOwners(ownersList);
//       setAvailableOwners(ownersList);

//       // Fetch student count and batch student counts if editing a course
//       if (course) {
//         const studentSnapshot = await getDocs(collection(db, `Course/${course.id}/Students`));
//         setStudentCount(studentSnapshot.docs.length);

//         const batchCounts = {};
//         for (const batchId of course.batches || []) {
//           const batchStudents = await getDocs(collection(db, `Batch/${batchId}/Students`));
//           batchCounts[batchId] = batchStudents.docs.length;
//         }
//         setBatchStudentCounts(batchCounts);
//       }
//     };
//     fetchData();
//   }, [course]);

//   // Reset or populate form based on course prop
//   useEffect(() => {
//     if (course) {
//       setCourseName(course.name || "");
//       setCourseDescription(course.description || "");
//       setCourseFee(course.fee || "");
//       setCourseDuration(course.duration || "");
//       setCourseMode(course.mode || "");
//       setCourseStatus(course.status || "Active");
//       setCenterAssignments(course.centers?.map(c => typeof c === "string" ? { centerId: c, status: "Active" } : c) || []);
//       setSelectedBatches(course.batches || []);
//       setSelectedOwners(course.owners || []);
//       setAvailableCenters(centers.filter(c => !course.centers?.some(ca => ca.centerId === c.id)));
//       setAvailableBatches(batches.filter(b => (b.status === "Ongoing" || !b.status) && !course.batches?.includes(b.id)));
//       setAvailableOwners(owners.filter(o => !course.owners?.includes(o.id)));
//     } else {
//       resetForm();
//     }
//   }, [course, centers, batches, owners]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const courseData = {
//       name: courseName,
//       description: courseDescription,
//       fee: courseFee,
//       duration: courseDuration,
//       mode: courseMode,
//       status: courseStatus,
//       centers: centerAssignments,
//       batches: selectedBatches,
//       owners: selectedOwners,
//       createdAt: serverTimestamp(),
//     };

//     try {
//       if (course) {
//         await updateDoc(doc(db, "Course", course.id), courseData);
//         alert("Course updated successfully!");
//       } else {
//         await addDoc(collection(db, "Course"), courseData);
//         alert("Course created successfully!");
//       }
//       resetForm();
//       toggleSidebar();
//     } catch (error) {
//       console.error("Error saving course:", error);
//       alert("Failed to save course. Please try again.");
//     }
//   };

//   const resetForm = () => {
//     setCourseName("");
//     setCourseDescription("");
//     setCourseFee("");
//     setCourseDuration("");
//     setCourseMode("");
//     setCourseStatus("Active");
//     setCenterAssignments([]);
//     setSelectedBatches([]);
//     setSelectedOwners([]);
//     setStudentCount(0);
//     setBatchStudentCounts({});
//     setAvailableCenters(centers);
//     setAvailableBatches(batches.filter(batch => batch.status === "Ongoing" || !batch.status));
//     setAvailableOwners(owners);
//   };

//   const handleAddCenter = (centerId) => {
//     if (centerId && !centerAssignments.some(ca => ca.centerId === centerId)) {
//       setCenterAssignments([...centerAssignments, { centerId, status: "Active" }]);
//       setAvailableCenters(availableCenters.filter(c => c.id !== centerId));
//     }
//   };

//   const handleRemoveCenter = (centerId) => {
//     setCenterAssignments(centerAssignments.filter(ca => ca.centerId !== centerId));
//     const removedCenter = centers.find(c => c.id === centerId);
//     if (removedCenter) setAvailableCenters([...availableCenters, removedCenter]);
//   };

//   const handleCenterStatusChange = (centerId, newStatus) => {
//     setCenterAssignments(centerAssignments.map(ca => 
//       ca.centerId === centerId ? { ...ca, status: newStatus } : ca
//     ));
//   };

//   const handleAddBatch = (batchId) => {
//     if (batchId && !selectedBatches.includes(batchId)) {
//       setSelectedBatches([...selectedBatches, batchId]);
//       setAvailableBatches(availableBatches.filter(b => b.id !== batchId));
//     }
//   };

//   const handleRemoveBatch = (batchId) => {
//     setSelectedBatches(selectedBatches.filter(id => id !== batchId));
//     const removedBatch = batches.find(b => b.id === batchId);
//     if (removedBatch && (removedBatch.status === "Ongoing" || !removedBatch.status)) {
//       setAvailableBatches([...availableBatches, removedBatch]);
//     }
//   };

//   const handleAddOwner = (ownerId) => {
//     if (ownerId && !selectedOwners.includes(ownerId)) {
//       setSelectedOwners([...selectedOwners, ownerId]);
//       setAvailableOwners(availableOwners.filter(o => o.id !== ownerId));
//     }
//   };

//   const handleRemoveOwner = (ownerId) => {
//     setSelectedOwners(selectedOwners.filter(id => id !== ownerId));
//     const removedOwner = owners.find(o => o.id === ownerId);
//     if (removedOwner) setAvailableOwners([...availableOwners, removedOwner]);
//   };

//   return (
//     <div
//       className={`fixed top-0 right-0 h-full bg-white w-full shadow-lg transform transition-transform duration-300 ${
//         isOpen ? "translate-x-0" : "translate-x-full"
//       } p-6 overflow-y-auto`}
//     >
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">
//           {course ? "Edit Course" : "Create Course"}
//         </h1>
//         <button
//           type="button"
//           onClick={toggleSidebar}
//           className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
//         >
//           Back
//         </button>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div>
//           <label htmlFor="courseName" className="block text-base font-medium text-gray-700">
//             Course Name
//           </label>
//           <input
//             type="text"
//             value={courseName}
//             placeholder="Course Name"
//             onChange={(e) => setCourseName(e.target.value)}
//             required
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
//           />
//         </div>

//         <div>
//           <label htmlFor="courseDescription" className="block text-base font-medium text-gray-700">
//             Course Description
//           </label>
//           <input
//             type="text"
//             value={courseDescription}
//             placeholder="Course Description"
//             onChange={(e) => setCourseDescription(e.target.value)}
//             required
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
//           />
//         </div>

//         <div>
//           <label htmlFor="courseFee" className="block text-base font-medium text-gray-700">
//             Fee
//           </label>
//           <input
//             type="number"
//             value={courseFee}
//             placeholder="Enter Course Fee"
//             onChange={(e) => setCourseFee(e.target.value)}
//             required
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
//           />
//         </div>

//         <div>
//           <label htmlFor="courseDuration" className="block text-base font-medium text-gray-700">
//             Duration
//           </label>
//           <input
//             type="text"
//             value={courseDuration}
//             placeholder="Enter Course Duration"
//             onChange={(e) => setCourseDuration(e.target.value)}
//             required
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
//           />
//         </div>

//         <div>
//           <label htmlFor="courseMode" className="block text-base font-medium text-gray-700">
//             Mode
//           </label>
//           <select
//             value={courseMode}
//             onChange={(e) => setCourseMode(e.target.value)}
//             required
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
//           >
//             <option value="">Select Mode</option>
//             <option value="Online">Online</option>
//             <option value="Offline">Offline</option>
//             <option value="Hybrid">Hybrid</option>
//           </select>
//         </div>

//         <div>
//           <label htmlFor="courseStatus" className="block text-base font-medium text-gray-700">
//             Status
//           </label>
//           <select
//             value={courseStatus}
//             onChange={(e) => setCourseStatus(e.target.value)}
//             required
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
//           >
//             <option value="Active">Active</option>
//             <option value="Inactive">Inactive</option>
//           </select>
//         </div>

//         <h3 className="text-lg font-semibold text-gray-800">Total Students: {studentCount}</h3>

//         <div>
//           <select
//             onChange={(e) => handleAddCenter(e.target.value)}
//             className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
//           >
//             <option value="">Select a Center</option>
//             {availableCenters.map((center) => (
//               <option key={center.id} value={center.id}>
//                 {center.name}
//               </option>
//             ))}
//           </select>

//           {centerAssignments.length > 0 && (
//             <div className="mt-4">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr No</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Center Name</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {centerAssignments.map((ca, index) => {
//                     const center = centers.find((c) => c.id === ca.centerId);
//                     return (
//                       <tr key={ca.centerId}>
//                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">{index + 1}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">{center?.name}</td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <select
//                             value={ca.status}
//                             onChange={(e) => handleCenterStatusChange(ca.centerId, e.target.value)}
//                             className="block w-full px-3 py-1 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
//                           >
//                             <option value="Active">Active</option>
//                             <option value="Inactive">Inactive</option>
//                           </select>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <button
//                             type="button"
//                             onClick={() => handleRemoveCenter(ca.centerId)}
//                             className="text-red-600 hover:text-red-800"
//                           >
//                             ✕
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         <div>
//           <select
//             onChange={(e) => handleAddBatch(e.target.value)}
//             className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
//           >
//             <option value="">Select a Batch</option>
//             {availableBatches.map((batch) => (
//               <option key={batch.id} value={batch.id}>
//                 {batch.batchName}
//               </option>
//             ))}
//           </select>

//           {selectedBatches.length > 0 && (
//             <div className="mt-4">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr No</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch Name</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Count</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {selectedBatches.map((batchId, index) => {
//                     const batch = batches.find((b) => b.id === batchId);
//                     return (
//                       <tr key={batchId}>
//                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">{index + 1}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">{batch?.batchName}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">{batchStudentCounts[batchId] || 0}</td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <button
//                             type="button"
//                             onClick={() => handleRemoveBatch(batchId)}
//                             className="text-red-600 hover:text-red-800"
//                           >
//                             ✕
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         <div>
//           <select
//             onChange={(e) => handleAddOwner(e.target.value)}
//             className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
//           >
//             <option value="">Select an Owner</option>
//             {availableOwners.map((owner) => (
//               <option key={owner.id} value={owner.id}>
//                 {owner.f_name}
//               </option>
//             ))}
//           </select>

//           {selectedOwners.length > 0 && (
//             <div className="mt-4">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr No</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner Name</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {selectedOwners.map((ownerId, index) => {
//                     const owner = owners.find((o) => o.id === ownerId);
//                     return (
//                       <tr key={ownerId}>
//                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">{index + 1}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">{owner?.f_name}</td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <button
//                             type="button"
//                             onClick={() => handleRemoveOwner(ownerId)}
//                             className="text-red-600 hover:text-red-800"
//                           >
//                             ✕
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         <div className="flex justify-end">
//           <button
//             type="submit"
//             className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200"
//           >
//             {course ? "Update Course" : "Create Course"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateCourses;







// // import React, { useState, useEffect } from "react";
// // import { db } from "../../../../config/firebase";
// // import {
// //   getDocs,
// //   collection,
// //   addDoc,
// //   updateDoc,
// //   doc,
// //   serverTimestamp,
// // } from "firebase/firestore";
// // import { useNavigate } from "react-router-dom";

// // const CreateCourses = ({ isOpen, toggleSidebar, course }) => {
// //   const navigate = useNavigate();
// //   const [instructors, setInstructors] = useState([]);
// //   const [centers, setCenters] = useState([]);
// //   const [owners, setOwners] = useState([]);
  
// //   const [courseName, setCourseName] = useState("");
// //   const [courseDescription, setCourseDescription] = useState("");
// //   const [courseFee, setCourseFee] = useState("");
// //   const [courseDuration, setCourseDuration] = useState("");
// //   const [courseMode, setCourseMode] = useState("");
// //   const [courseStatus, setCourseStatus] = useState("Active");
  
// //   const [centerAssignments, setCenterAssignments] = useState([]);
// //   const [selectedOwners, setSelectedOwners] = useState([]);
// //   const [totalStudentCount, setTotalStudentCount] = useState(0);
  
// //   const [availableCenters, setAvailableCenters] = useState([]);
// //   const [availableOwners, setAvailableOwners] = useState([]);

// //   // Utility function to capitalize the first letter
// //   const capitalizeFirstLetter = (str) => {
// //     if (!str || typeof str !== "string") return str;
// //     return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
// //   };

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       const instructorSnapshot = await getDocs(collection(db, "Instructor"));
// //       setInstructors(instructorSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

// //       const instituteSnapshot = await getDocs(collection(db, "instituteSetup"));
// //       if (!instituteSnapshot.empty) {
// //         const instituteId = instituteSnapshot.docs[0].id;
// //         const centerSnapshot = await getDocs(collection(db, "instituteSetup", instituteId, "Center"));
// //         const activeCenters = centerSnapshot.docs
// //           .map((doc) => ({ id: doc.id, ...doc.data() }))
// //           .filter((center) => center.isActive);
// //         setCenters(activeCenters);
// //         setAvailableCenters(activeCenters);
// //       }

// //       const batchSnapshot = await getDocs(collection(db, "Batch"));
// //       const batchesList = batchSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// //       setBatches(batchesList);
// //       setAvailableBatches(batchesList.filter(batch => batch.status === "Ongoing" || !batch.status));

// //       const ownerSnapshot = await getDocs(collection(db, "Instructor"));
// //       const ownersList = ownerSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// //       setOwners(ownersList);
// //       setAvailableOwners(ownersList);

// //       if (course) {
// //         // Calculate total students similar to LearnerList
// //         const enrollmentsRef = collection(db, "enrollments");
// //         const enrollmentSnapshot = await getDocs(enrollmentsRef);
// //         const allEnrollments = enrollmentSnapshot.docs.map(doc => ({
// //           id: doc.id,
// //           ...doc.data()
// //         }));

// //         const matchedLearners = allEnrollments
// //           .filter(enrollment => 
// //             enrollment.courses?.some(c => 
// //               c.selectedCourse?.id === course.id
// //             )
// //           );
        
// //         setTotalStudentCount(matchedLearners.length);
// //       }
// //     };
// //     fetchData();
// //   }, [course]);

// //   useEffect(() => {
// //     if (course) {
// //       setCourseName(course.name || "");
// //       setCourseDescription(course.description || "");
// //       setCourseFee(course.fee || "");
// //       setCourseDuration(course.duration || "");
// //       setCourseMode(course.mode || "");
// //       setCourseStatus(course.status || "Active");
// //       setCenterAssignments(course.centers?.map(c => typeof c === "string" ? { centerId: c, status: "Active" } : c) || []);
// //       setSelectedOwners(course.owners || []);
// //       setAvailableCenters(centers.filter(c => !course.centers?.some(ca => ca.centerId === c.id)));
// //       setAvailableOwners(owners.filter(o => !course.owners?.includes(o.id)));
// //     } else {
// //       resetForm();
// //     }
// //   }, [course, centers, owners]);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     const courseData = {
// //       name: capitalizeFirstLetter(courseName),
// //       description: capitalizeFirstLetter(courseDescription),
// //       fee: courseFee, // No capitalization needed for numeric fields
// //       duration: courseDuration, // Duration might include numbers (e.g., "3 months"), so leave as is unless you want specific formatting
// //       mode: capitalizeFirstLetter(courseMode),
// //       status: capitalizeFirstLetter(courseStatus),
// //       centers: centerAssignments,
// //       owners: selectedOwners,
// //       createdAt: serverTimestamp(),
// //     };

// //     try {
// //       if (course) {
// //         await updateDoc(doc(db, "Course", course.id), courseData);
// //         alert("Course updated successfully!");
// //       } else {
// //         const docRef = await addDoc(collection(db, "Course"), courseData);
// //         alert("Course created successfully!");
// //       }
// //       resetForm();
// //       toggleSidebar();
// //     } catch (error) {
// //       console.error("Error saving course:", error);
// //       alert("Failed to save course. Please try again.");
// //     }
// //   };

// //   const resetForm = () => {
// //     setCourseName("");
// //     setCourseDescription("");
// //     setCourseFee("");
// //     setCourseDuration("");
// //     setCourseMode("");
// //     setCourseStatus("Active");
// //     setCenterAssignments([]);
// //     setSelectedOwners([]);
// //     setTotalStudentCount(0);
// //     setAvailableCenters(centers);
// //     setAvailableOwners(owners);
// //   };

// //   const handleAddCenter = (centerId) => {
// //     if (centerId && !centerAssignments.some(ca => ca.centerId === centerId)) {
// //       setCenterAssignments([...centerAssignments, { centerId, status: "Active" }]);
// //       setAvailableCenters(availableCenters.filter(c => c.id !== centerId));
// //     }
// //   };

// //   const handleRemoveCenter = (centerId) => {
// //     setCenterAssignments(centerAssignments.filter(ca => ca.centerId !== centerId));
// //     const removedCenter = centers.find(c => c.id === centerId);
// //     if (removedCenter) setAvailableCenters([...availableCenters, removedCenter]);
// //   };

// //   const handleCenterStatusChange = (centerId, newStatus) => {
// //     setCenterAssignments(centerAssignments.map(ca => 
// //       ca.centerId === centerId ? { ...ca, status: capitalizeFirstLetter(newStatus) } : ca
// //     ));
// //   };

// //   const handleAddOwner = (ownerId) => {
// //     if (ownerId && !selectedOwners.includes(ownerId)) {
// //       setSelectedOwners([...selectedOwners, ownerId]);
// //       setAvailableOwners(availableOwners.filter(o => o.id !== ownerId));
// //     }
// //   };

// //   const handleRemoveOwner = (ownerId) => {
// //     setSelectedOwners(selectedOwners.filter(id => id !== ownerId));
// //     const removedOwner = owners.find(o => o.id === ownerId);
// //     if (removedOwner) setAvailableOwners([...availableOwners, removedOwner]);
// //   };

// //   return (
// //     <div
// //       className={`fixed top-0 right-0 h-full bg-white w-full shadow-lg transform transition-transform duration-300 ${
// //         isOpen ? "translate-x-0" : "translate-x-full"
// //       } p-6 overflow-y-auto`}
// //     >
// //       <div className="flex justify-between items-center mb-6">
// //         <h1 className="text-2xl font-bold text-gray-800">
// //           {course ? "Edit Course" : "Create Course"}
// //         </h1>
// //         <button
// //           type="button"
// //           onClick={toggleSidebar}
// //           className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
// //         >
// //           Back
// //         </button>
// //       </div>

// //       <form onSubmit={handleSubmit} className="space-y-6">
// //         <div>
// //           <label htmlFor="courseName" className="block text-base font-medium text-gray-700">
// //             Course Name
// //           </label>
// //           <input
// //             type="text"
// //             value={courseName}
// //             placeholder="Course Name"
// //             onChange={(e) => setCourseName(e.target.value)}
// //             required
// //             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
// //           />
// //         </div>

// //         <div>
// //           <label htmlFor="courseDescription" className="block text-base font-medium text-gray-700">
// //             Course Description
// //           </label>
// //           <input
// //             type="text"
// //             value={courseDescription}
// //             placeholder="Course Description"
// //             onChange={(e) => setCourseDescription(e.target.value)}
// //             required
// //             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
// //           />
// //         </div>

// //         <div>
// //           <label htmlFor="courseFee" className="block text-base font-medium text-gray-700">
// //             Fee
// //           </label>
// //           <input
// //             type="number"
// //             value={courseFee}
// //             placeholder="Enter Course Fee"
// //             onChange={(e) => setCourseFee(e.target.value)}
// //             required
// //             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
// //           />
// //         </div>

// //         <div>
// //           <label htmlFor="courseDuration" className="block text-base font-medium text-gray-700">
// //             Duration
// //           </label>
// //           <input
// //             type="text"
// //             value={courseDuration}
// //             placeholder="Enter Course Duration"
// //             onChange={(e) => setCourseDuration(e.target.value)}
// //             required
// //             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
// //           />
// //         </div>

// //         <div>
// //           <label htmlFor="courseMode" className="block text-base font-medium text-gray-700">
// //             Mode
// //           </label>
// //           <select
// //             value={courseMode}
// //             onChange={(e) => setCourseMode(e.target.value)}
// //             required
// //             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
// //           >
// //             <option value="">Select Mode</option>
// //             <option value="Online">Online</option>
// //             <option value="Offline">Offline</option>
// //             <option value="Hybrid">Hybrid</option>
// //           </select>
// //         </div>

// //         <div>
// //           <label htmlFor="courseStatus" className="block text-base font-medium text-gray-700">
// //             Status
// //           </label>
// //           <select
// //             value={courseStatus}
// //             onChange={(e) => setCourseStatus(e.target.value)}
// //             required
// //             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
// //           >
// //             <option value="Active">Active</option>
// //             <option value="Inactive">Inactive</option>
// //           </select>
// //         </div>

// //         <h3 className="text-lg font-semibold text-gray-800">Total Students: {totalStudentCount}</h3>

// //         <div>
// //           <select
// //             onChange={(e) => handleAddCenter(e.target.value)}
// //             className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
// //           >
// //             <option value="">Select a Center</option>
// //             {availableCenters.map((center) => (
// //               <option key={center.id} value={center.id}>
// //                 {center.name}
// //               </option>
// //             ))}
// //           </select>

// //           {centerAssignments.length > 0 && (
// //             <div className="mt-4">
// //               <table className="min-w-full divide-y divide-gray-200">
// //                 <thead className="bg-gray-50">
// //                   <tr>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr No</th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Center Name</th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="bg-white divide-y divide-gray-200">
// //                   {centerAssignments.map((ca, index) => {
// //                     const center = centers.find((c) => c.id === ca.centerId);
// //                     return (
// //                       <tr key={ca.centerId}>
// //                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">{index + 1}</td>
// //                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">{center?.name}</td>
// //                         <td className="px-6 py-4 whitespace-nowrap">
// //                           <select
// //                             value={ca.status}
// //                             onChange={(e) => handleCenterStatusChange(ca.centerId, e.target.value)}
// //                             className="block w-full px-3 py-1 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
// //                           >
// //                             <option value="Active">Active</option>
// //                             <option value="Inactive">Inactive</option>
// //                           </select>
// //                         </td>
// //                         <td className="px-6 py-4 whitespace-nowrap">
// //                           <button
// //                             type="button"
// //                             onClick={() => handleRemoveCenter(ca.centerId)}
// //                             className="text-red-600 hover:text-red-800"
// //                           >
// //                             ✕
// //                           </button>
// //                         </td>
// //                       </tr>
// //                     );
// //                   })}
// //                 </tbody>
// //               </table>
// //             </div>
// //           )}
// //         </div>

// //         <div>
// //           <select
// //             onChange={(e) => handleAddOwner(e.target.value)}
// //             className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
// //           >
// //             <option value="">Select an Owner</option>
// //             {availableOwners.map((owner) => (
// //               <option key={owner.id} value={owner.id}>
// //                 {owner.f_name}
// //               </option>
// //             ))}
// //           </select>

// //           {selectedOwners.length > 0 && (
// //             <div className="mt-4">
// //               <table className="min-w-full divide-y divide-gray-200">
// //                 <thead className="bg-gray-50">
// //                   <tr>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr No</th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner Name</th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="bg-white divide-y divide-gray-200">
// //                   {selectedOwners.map((ownerId, index) => {
// //                     const owner = owners.find((o) => o.id === ownerId);
// //                     return (
// //                       <tr key={ownerId}>
// //                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">{index + 1}</td>
// //                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">{owner?.f_name}</td>
// //                         <td className="px-6 py-4 whitespace-nowrap">
// //                           <button
// //                             type="button"
// //                             onClick={() => handleRemoveOwner(ownerId)}
// //                             className="text-red-600 hover:text-red-800"
// //                           >
// //                             ✕
// //                           </button>
// //                         </td>
// //                       </tr>
// //                     );
// //                   })}
// //                 </tbody>
// //               </table>
// //             </div>
// //           )}
// //         </div>

// //         <div className="flex justify-end">
// //           <button
// //             type="submit"
// //             className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200"
// //           >
// //             {course ? "Update Course" : "Create Course"}
// //           </button>
// //         </div>
// //       </form>
// //     </div>
// //   );
// // };

// // export default CreateCourses;






import React, { useState, useEffect } from "react";
import { db } from "../../../../config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const CreateCourses = ({ isOpen, toggleSidebar, course }) => {
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState([]);
  const [centers, setCenters] = useState([]);
  const [owners, setOwners] = useState([]);
  
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseFee, setCourseFee] = useState("");
  const [courseDuration, setCourseDuration] = useState("");
  const [courseMode, setCourseMode] = useState("");
  const [courseStatus, setCourseStatus] = useState("Active");
  
  const [centerAssignments, setCenterAssignments] = useState([]);
  const [selectedOwners, setSelectedOwners] = useState([]);
  const [totalStudentCount, setTotalStudentCount] = useState(0);
  
  const [availableCenters, setAvailableCenters] = useState([]);
  const [availableOwners, setAvailableOwners] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Instructors
      const instructorSnapshot = await getDocs(collection(db, "Instructor"));
      setInstructors(instructorSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      // Fetch Centers from instituteSetup -> Center (only active ones)
      const instituteSnapshot = await getDocs(collection(db, "instituteSetup"));
      if (!instituteSnapshot.empty) {
        const instituteId = instituteSnapshot.docs[0].id; // Assuming single institute
        const centerSnapshot = await getDocs(collection(db, "instituteSetup", instituteId, "Center"));
        const activeCenters = centerSnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((center) => center.isActive); // Filter only active centers
        setCenters(activeCenters);
        setAvailableCenters(activeCenters);
      }

      const batchSnapshot = await getDocs(collection(db, "Batch"));
      const batchesList = batchSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBatches(batchesList);
      setAvailableBatches(batchesList.filter(batch => batch.status === "Ongoing" || !batch.status));

      const ownerSnapshot = await getDocs(collection(db, "Instructor"));
      const ownersList = ownerSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOwners(ownersList);
      setAvailableOwners(ownersList);

      // Fetch student count and batch student counts if editing a course
      if (course) {
        // Calculate total students similar to LearnerList
        const enrollmentsRef = collection(db, "enrollments");
        const enrollmentSnapshot = await getDocs(enrollmentsRef);
        const allEnrollments = enrollmentSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const matchedLearners = allEnrollments
          .filter(enrollment => 
            enrollment.courses?.some(c => 
              c.selectedCourse?.id === course.id
            )
          );
        
        setTotalStudentCount(matchedLearners.length);
      }
    };
    fetchData();
  }, [course]);

  useEffect(() => {
    if (course) {
      setCourseName(course.name || "");
      setCourseDescription(course.description || "");
      setCourseFee(course.fee || "");
      setCourseDuration(course.duration || "");
      setCourseMode(course.mode || "");
      setCourseStatus(course.status || "Active");
      setCenterAssignments(course.centers?.map(c => typeof c === "string" ? { centerId: c, status: "Active" } : c) || []);
      setSelectedOwners(course.owners || []);
      setAvailableCenters(centers.filter(c => !course.centers?.some(ca => ca.centerId === c.id)));
      setAvailableOwners(owners.filter(o => !course.owners?.includes(o.id)));
    } else {
      resetForm();
    }
  }, [course, centers, owners]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const courseData = {
      name: courseName,
      description: courseDescription,
      fee: courseFee,
      duration: courseDuration,
      mode: courseMode,
      status: courseStatus,
      centers: centerAssignments,
      owners: selectedOwners,
      createdAt: serverTimestamp(),
    };

    try {
      if (course) {
        await updateDoc(doc(db, "Course", course.id), courseData);
        alert("Course updated successfully!");
      } else {
        const docRef = await addDoc(collection(db, "Course"), courseData);
        alert("Course created successfully!");
      }
      resetForm();
      toggleSidebar();
    } catch (error) {
      console.error("Error saving course:", error);
      alert("Failed to save course. Please try again.");
    }
  };

  const resetForm = () => {
    setCourseName("");
    setCourseDescription("");
    setCourseFee("");
    setCourseDuration("");
    setCourseMode("");
    setCourseStatus("Active");
    setCenterAssignments([]);
    setSelectedOwners([]);
    setTotalStudentCount(0);
    setAvailableCenters(centers);
    setAvailableOwners(owners);
  };

  const handleAddCenter = (centerId) => {
    if (centerId && !centerAssignments.some(ca => ca.centerId === centerId)) {
      setCenterAssignments([...centerAssignments, { centerId, status: "Active" }]);
      setAvailableCenters(availableCenters.filter(c => c.id !== centerId));
    }
  };

  const handleRemoveCenter = (centerId) => {
    setCenterAssignments(centerAssignments.filter(ca => ca.centerId !== centerId));
    const removedCenter = centers.find(c => c.id === centerId);
    if (removedCenter) setAvailableCenters([...availableCenters, removedCenter]);
  };

  const handleCenterStatusChange = (centerId, newStatus) => {
    setCenterAssignments(centerAssignments.map(ca => 
      ca.centerId === centerId ? { ...ca, status: newStatus } : ca
    ));
  };

  const handleAddOwner = (ownerId) => {
    if (ownerId && !selectedOwners.includes(ownerId)) {
      setSelectedOwners([...selectedOwners, ownerId]);
      setAvailableOwners(availableOwners.filter(o => o.id !== ownerId));
    }
  };

  const handleRemoveOwner = (ownerId) => {
    setSelectedOwners(selectedOwners.filter(id => id !== ownerId));
    const removedOwner = owners.find(o => o.id === ownerId);
    if (removedOwner) setAvailableOwners([...availableOwners, removedOwner]);
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-white w-full shadow-lg transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } p-6 overflow-y-auto`}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {course ? "Edit Course" : "Create Course"}
        </h1>
        <button
          type="button"
          onClick={toggleSidebar}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
        >
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="courseName" className="block text-base font-medium text-gray-700">
            Course Name
          </label>
          <input
            type="text"
            value={courseName}
            placeholder="Course Name"
            onChange={(e) => setCourseName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
          />
        </div>

        <div>
          <label htmlFor="courseDescription" className="block text-base font-medium text-gray-700">
            Course Description
          </label>
          <input
            type="text"
            value={courseDescription}
            placeholder="Course Description"
            onChange={(e) => setCourseDescription(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
          />
        </div>

        <div>
          <label htmlFor="courseFee" className="block text-base font-medium text-gray-700">
            Fee
          </label>
          <input
            type="number"
            value={courseFee}
            placeholder="Enter Course Fee"
            onChange={(e) => setCourseFee(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
          />
        </div>

        <div>
          <label htmlFor="courseDuration" className="block text-base font-medium text-gray-700">
            Duration
          </label>
          <input
            type="text"
            value={courseDuration}
            placeholder="Enter Course Duration"
            onChange={(e) => setCourseDuration(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
          />
        </div>

        <div>
          <label htmlFor="courseMode" className="block text-base font-medium text-gray-700">
            Mode
          </label>
          <select
            value={courseMode}
            onChange={(e) => setCourseMode(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
          >
            <option value="">Select Mode</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        <div>
          <label htmlFor="courseStatus" className="block text-base font-medium text-gray-700">
            Status
          </label>
          <select
            value={courseStatus}
            onChange={(e) => setCourseStatus(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <h3 className="text-lg font-semibold text-gray-800">Total Students: {totalStudentCount}</h3>

        <div>
          <select
            onChange={(e) => handleAddCenter(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
          >
            <option value="">Select a Center</option>
            {availableCenters.map((center) => (
              <option key={center.id} value={center.id}>
                {center.name}
              </option>
            ))}
          </select>

          {centerAssignments.length > 0 && (
            <div className="mt-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Center Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {centerAssignments.map((ca, index) => {
                    const center = centers.find((c) => c.id === ca.centerId);
                    return (
                      <tr key={ca.centerId}>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">{center?.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={ca.status}
                            onChange={(e) => handleCenterStatusChange(ca.centerId, e.target.value)}
                            className="block w-full px-3 py-1 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleRemoveCenter(ca.centerId)}
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

        <div>
          <select
            onChange={(e) => handleAddOwner(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
          >
            <option value="">Select an Owner</option>
            {availableOwners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.f_name}
              </option>
            ))}
          </select>

          {selectedOwners.length > 0 && (
            <div className="mt-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedOwners.map((ownerId, index) => {
                    const owner = owners.find((o) => o.id === ownerId);
                    return (
                      <tr key={ownerId}>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">{owner?.f_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleRemoveOwner(ownerId)}
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

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            {course ? "Update Course" : "Create Course"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCourses;