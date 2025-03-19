// // // import React, { useState, useEffect } from "react";
// // // import { db } from "../../../../config/firebase";
// // // import {
// // //   getDocs,
// // //   collection,
// // //   addDoc,
// // //   updateDoc,
// // //   doc,
// // //   serverTimestamp,
// // // } from "firebase/firestore";
// // // import { useNavigate } from "react-router-dom";

// // // const CreateCourses = ({ isOpen, toggleSidebar, course }) => {
// // //   const navigate = useNavigate();
// // //   const [courses, setCourses] = useState([]);
// // //   const [instructors, setInstructors] = useState([]);
// // //   const [centers, setCenters] = useState([]);
// // //   const [batches, setBatches] = useState([]);
// // //   const [owners, setOwners] = useState([]);

// // //   const [courseName, setCourseName] = useState("");
// // //   const [courseDescription, setCourseDescription] = useState("");
// // //   const [courseFee, setCourseFee] = useState("");
// // //   const [courseDuration, setCourseDuration] = useState("");
// // //   const [courseMode, setCourseMode] = useState("");

// // //   const [selectedCenters, setSelectedCenters] = useState([]);
// // //   const [selectedBatches, setSelectedBatches] = useState([]);
// // //   const [selectedOwners, setSelectedOwners] = useState([]);

// // //   // Available options for dropdowns
// // //   const [availableCenters, setAvailableCenters] = useState([]);
// // //   const [availableBatches, setAvailableBatches] = useState([]);
// // //   const [availableOwners, setAvailableOwners] = useState([]);

// // //   useEffect(() => {
// // //     const fetchData = async () => {
// // //       const instructorSnapshot = await getDocs(collection(db, "Instructor"));
// // //       setInstructors(instructorSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

// // //       const centerSnapshot = await getDocs(collection(db, "Centers"));
// // //       const centersList = centerSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// // //       setCenters(centersList);
// // //       setAvailableCenters(centersList);

// // //       const batchSnapshot = await getDocs(collection(db, "Batch"));
// // //       const batchesList = batchSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// // //       setBatches(batchesList);
// // //       setAvailableBatches(batchesList);

// // //       const ownerSnapshot = await getDocs(collection(db, "Instructor"));
// // //       const ownersList = ownerSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// // //       setOwners(ownersList);
// // //       setAvailableOwners(ownersList);
// // //     };
// // //     fetchData();
// // //   }, []);

// // //   useEffect(() => {
// // //     if (course) {
// // //       setCourseName(course.name);
// // //       setCourseDescription(course.description);
// // //       setCourseFee(course.fee);
// // //       setCourseDuration(course.duration);
// // //       setCourseMode(course.mode);
// // //       setSelectedCenters(course.centers || []);
// // //       setSelectedBatches(course.batches || []);
// // //       setSelectedOwners(course.owners || []);
// // //       setAvailableCenters(centers.filter((c) => !course.centers.includes(c.id)));
// // //       setAvailableBatches(batches.filter((b) => !course.batches.includes(b.id)));
// // //       setAvailableOwners(owners.filter((o) => !course.owners.includes(o.id)));
// // //     }
// // //   }, [course, centers, batches, owners]);

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();

// // //     const courseData = {
// // //       name: courseName,
// // //       description: courseDescription,
// // //       fee: courseFee,
// // //       duration: courseDuration,
// // //       mode: courseMode,
// // //       centers: selectedCenters,
// // //       batches: selectedBatches,
// // //       owners: selectedOwners,
// // //       createdAt: serverTimestamp()
// // //     };

// // //     try {
// // //       if (course) {
// // //         // Update existing course
// // //         await updateDoc(doc(db, "Course", course.id), courseData);
// // //         alert("Course updated successfully!");

// // //         resetForm();
// // //       } else {
// // //         // Add new course
// // //         await addDoc(collection(db, "Course"), courseData);
// // //         alert("Course created successfully!");

// // //         resetForm();
// // //       }
// // //       toggleSidebar();
// // //     } catch (error) {
// // //       console.error("Error saving course:", error);
// // //       alert("Failed to save course. Please try again.");
// // //     }
// // //   };

// // //   const resetForm = () => {
// // //     setCourseName("");
// // //     setCourseDescription("");
// // //     setCourseFee("");
// // //     setCourseDuration("");
// // //     setCourseMode("");
// // //     setSelectedCenters([]);
// // //     setSelectedBatches([]);
// // //     setSelectedOwners([]);
// // //     setAvailableCenters(centers);
// // //     setAvailableBatches(batches);
// // //     setAvailableOwners(owners);
// // //   };

// // //   const handleAddCenter = (centerId) => {
// // //     if (centerId && !selectedCenters.includes(centerId)) {
// // //       setSelectedCenters([...selectedCenters, centerId]);
// // //       setAvailableCenters(availableCenters.filter((c) => c.id !== centerId));
// // //     }
// // //   };

// // //   const handleRemoveCenter = (centerId) => {
// // //     setSelectedCenters(selectedCenters.filter((id) => id !== centerId));
// // //     const removedCenter = centers.find((c) => c.id === centerId);
// // //     if (removedCenter) setAvailableCenters([...availableCenters, removedCenter]);
// // //   };


// // //   const handleAddBatch = (batchId) => {
// // //     if (batchId && !selectedBatches.includes(batchId)) {
// // //       setSelectedBatches([...selectedBatches, batchId]);
// // //       setAvailableBatches(availableBatches.filter((c) => c.id !== batchId));
// // //     }
// // //   };

// // //   const handleRemoveBatch = (batchId) => {
// // //     setSelectedBatches(selectedBatches.filter((id) => id !== batchId));
// // //     const removedBatch = batches.find((c) => c.id === batchId);
// // //     if (removedBatch) setAvailableBatches([...availableBatches, removedBatch]);
// // //   };


// // //   const handleAddOwner = (ownerId) => {
// // //     if (ownerId && !selectedOwners.includes(ownerId)) {
// // //       setSelectedOwners([...selectedOwners, ownerId]);
// // //       setAvailableOwners(availableOwners.filter((c) => c.id !== ownerId));
// // //     }
// // //   };

// // //   const handleRemoveOwner = (ownerId) => {
// // //     setSelectedOwners(selectedOwners.filter((id) => id !== ownerId));
// // //     const removedOwner = owners.find((c) => c.id === ownerId);
// // //     if (removedOwner) setAvailableOwners([...availableOwners, removedOwner]);
// // //   };
// // //   return (
// // //     <div
// // //       className={`fixed top-0 right-0 h-full bg-white w-2/5 shadow-lg transform transition-transform duration-300 ${
// // //         isOpen ? "translate-x-0" : "translate-x-full"
// // //       } p-4 overflow-y-auto`}
// // //     >
// // //       <button type="button" onClick={toggleSidebar} className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition duration-200">Back</button>
// // //       <h1>{course ? "Edit Course" : "Create Course"}</h1>

// // //       <form onSubmit={handleSubmit}>
// // //         <label for="courseName">Course Name:</label>
// // //         <input type="text" value={courseName} placeholder="Course Name" onChange={(e) => setCourseName(e.target.value)} required />
        
// // //         <label for="courseDescription">Course description</label>
// // //         <input type="text" value={courseDescription} placeholder="Course Description" onChange={(e) => setCourseDescription(e.target.value)} required />
        
// // //         <label for="courseFee">Fee</label>
// // //         <input type="number" value={courseFee} placeholder="Enter Course Fee" onChange={(e) => setCourseFee(e.target.value)} required />
        
// // //         <label for="courseDuration">Duration</label>
// // //         <input type="text" value={courseDuration} placeholder="Enter Course Duration" onChange={(e) => setCourseDuration(e.target.value)} required />

// // //         {/* Course Mode */}
// // //         <select value={courseMode} onChange={(e) => setCourseMode(e.target.value)} required>
// // //           <option value="">Select Mode</option>
// // //           <option value="online">Online</option>
// // //           <option value="offline">Offline</option>
// // //           <option value="both">Both</option>
// // //         </select>

// // //         {/* Select Centers */}
// // //         <select onChange={(e) => handleAddCenter(e.target.value)}>
// // //           <option value="">Select a Center</option>
// // //           {availableCenters.map((center) => (
// // //             <option key={center.id} value={center.id}>{center.name}</option>
// // //           ))}
// // //         </select>

// // //         {/* Centers Table */}
// // //         {selectedCenters.length > 0 && (
// // //           <table border="1">
// // //             <thead>
// // //               <tr>
// // //                 <th>Sr No</th>
// // //                 <th>Center Name</th>
// // //                 <th>Action</th>
// // //               </tr>
// // //             </thead>
// // //             <tbody>
// // //               {selectedCenters.map((centerId, index) => {
// // //                 const center = centers.find((c) => c.id === centerId);
// // //                 return (
// // //                   <tr key={centerId}>
// // //                     <td>{index + 1}</td>
// // //                     <td>{center?.name}</td>
// // //                     <td>
// // //                       <button type="button" onClick={() => handleRemoveCenter(centerId)}>✕</button>
// // //                     </td>
// // //                   </tr>
// // //                 );
// // //               })}
// // //             </tbody>
// // //           </table>
// // //         )}



// // //         {/* Select Centers */}
// // //         <select onChange={(e) => handleAddBatch(e.target.value)}>
// // //           <option value="">Select a Batch</option>
// // //           {availableBatches.map((batch) => (
// // //             <option key={batch.id} value={batch.id}>{batch.batchName}</option>
// // //           ))}
// // //         </select>

// // //         {/* Centers Table */}
// // //         {selectedBatches.length > 0 && (
// // //           <table border="1">
// // //             <thead>
// // //               <tr>
// // //                 <th>Sr No</th>
// // //                 <th>batch Name</th>
// // //                 <th>Action</th>
// // //               </tr>
// // //             </thead>
// // //             <tbody>
// // //               {selectedBatches.map((batchId, index) => {
// // //                 const batch = batches.find((c) => c.id === batchId);
// // //                 return (
// // //                   <tr key={batchId}>
// // //                     <td>{index + 1}</td>
// // //                     <td>{batch?.batchName}</td>
// // //                     <td>
// // //                       <button type="button" onClick={() => handleRemoveBatch(batchId)}>✕</button>
// // //                     </td>
// // //                   </tr>
// // //                 );
// // //               })}
// // //             </tbody>
// // //           </table>
// // //         )}



// // //         {/* Select Centers */}
// // //         <select onChange={(e) => handleAddOwner(e.target.value)}>
// // //           <option value="">Select a Owner</option>
// // //           {availableOwners.map((owner) => (
// // //             <option key={owner.id} value={owner.id}>{owner.f_name}</option>
// // //           ))}
// // //         </select>

// // //         {/* Centers Table */}
// // //         {selectedOwners.length > 0 && (
// // //           <table border="1">
// // //             <thead>
// // //               <tr>
// // //                 <th>Sr No</th>
// // //                 <th>Owner Name</th>
// // //                 <th>Action</th>
// // //               </tr>
// // //             </thead>
// // //             <tbody>
// // //               {selectedOwners.map((ownerId, index) => {
// // //                 const owner = owners.find((c) => c.id === ownerId);
// // //                 return (
// // //                   <tr key={ownerId}>
// // //                     <td>{index + 1}</td>
// // //                     <td>{owner?.f_name}</td>
// // //                     <td>
// // //                       <button type="button" onClick={() => handleRemoveOwner(ownerId)}>✕</button>
// // //                     </td>
// // //                   </tr>
// // //                 );
// // //               })}
// // //             </tbody>
// // //           </table>
// // //         )}

// // //         {/* Submit Button */}
// // //         <div className="flex justify-end">
// // //           <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200">{course ? "Update course" : "Create course"}</button>
// // //         </div>
// // //         {/* <button type="submit">{course ? "Update" : "Create"}</button> */}
// // //       </form>
// // //     </div>
// // //   );
// // // };

// // // export default CreateCourses;


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

// //   const [selectedCenters, setSelectedCenters] = useState([]);
// //   const [selectedBatches, setSelectedBatches] = useState([]);
// //   const [selectedOwners, setSelectedOwners] = useState([]);

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
// //       // Filter only ongoing batches
// //       const ongoingBatches = batchesList.filter(batch => batch.status === "Ongoing" || !batch.status); // Include batches without status as ongoing
// //       setAvailableBatches(ongoingBatches);

// //       const ownerSnapshot = await getDocs(collection(db, "Instructor"));
// //       const ownersList = ownerSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// //       setOwners(ownersList);
// //       setAvailableOwners(ownersList);
// //     };
// //     fetchData();
// //   }, []);

// //   useEffect(() => {
// //     if (course) {
// //       setCourseName(course.name);
// //       setCourseDescription(course.description);
// //       setCourseFee(course.fee);
// //       setCourseDuration(course.duration);
// //       setCourseMode(course.mode);
// //       setSelectedCenters(course.centers || []);
// //       setSelectedBatches(course.batches || []);
// //       setSelectedOwners(course.owners || []);
// //       setAvailableCenters(centers.filter((c) => !course.centers.includes(c.id)));
// //       // Filter available batches to only show ongoing ones, excluding already selected ones
// //       setAvailableBatches(batches.filter((b) => 
// //         (b.status === "Ongoing" || !b.status) && !course.batches.includes(b.id)
// //       ));
// //       setAvailableOwners(owners.filter((o) => !course.owners.includes(o.id)));
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
// //       centers: selectedCenters,
// //       batches: selectedBatches,
// //       owners: selectedOwners,
// //       createdAt: serverTimestamp()
// //     };

// //     try {
// //       if (course) {
// //         await updateDoc(doc(db, "Course", course.id), courseData);
// //         alert("Course updated successfully!");
// //         resetForm();
// //       } else {
// //         await addDoc(collection(db, "Course"), courseData);
// //         alert("Course created successfully!");
// //         resetForm();
// //       }
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
// //     setSelectedCenters([]);
// //     setSelectedBatches([]);
// //     setSelectedOwners([]);
// //     setAvailableCenters(centers);
// //     setAvailableBatches(batches.filter(batch => batch.status === "Ongoing" || !batch.status));
// //     setAvailableOwners(owners);
// //   };

// //   const handleAddCenter = (centerId) => {
// //     if (centerId && !selectedCenters.includes(centerId)) {
// //       setSelectedCenters([...selectedCenters, centerId]);
// //       setAvailableCenters(availableCenters.filter((c) => c.id !== centerId));
// //     }
// //   };

// //   const handleRemoveCenter = (centerId) => {
// //     setSelectedCenters(selectedCenters.filter((id) => id !== centerId));
// //     const removedCenter = centers.find((c) => c.id === centerId);
// //     if (removedCenter) setAvailableCenters([...availableCenters, removedCenter]);
// //   };

// //   const handleAddBatch = (batchId) => {
// //     if (batchId && !selectedBatches.includes(batchId)) {
// //       setSelectedBatches([...selectedBatches, batchId]);
// //       setAvailableBatches(availableBatches.filter((c) => c.id !== batchId));
// //     }
// //   };

// //   const handleRemoveBatch = (batchId) => {
// //     setSelectedBatches(selectedBatches.filter((id) => id !== batchId));
// //     const removedBatch = batches.find((c) => c.id === batchId);
// //     if (removedBatch && (removedBatch.status === "Ongoing" || !removedBatch.status)) {
// //       setAvailableBatches([...availableBatches, removedBatch]);
// //     }
// //   };

// //   const handleAddOwner = (ownerId) => {
// //     if (ownerId && !selectedOwners.includes(ownerId)) {
// //       setSelectedOwners([...selectedOwners, ownerId]);
// //       setAvailableOwners(availableOwners.filter((c) => c.id !== ownerId));
// //     }
// //   };

// //   const handleRemoveOwner = (ownerId) => {
// //     setSelectedOwners(selectedOwners.filter((id) => id !== ownerId));
// //     const removedOwner = owners.find((c) => c.id === ownerId);
// //     if (removedOwner) setAvailableOwners([...availableOwners, removedOwner]);
// //   };

// //   return (
// //     <div
// //       className={`fixed top-0 right-0 h-full bg-white w-2/5 shadow-lg transform transition-transform duration-300 ${
// //         isOpen ? "translate-x-0" : "translate-x-full"
// //       } p-4 overflow-y-auto`}
// //     >
// //       <button type="button" onClick={toggleSidebar} className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition duration-200">Back</button>
// //       <h1>{course ? "Edit Course" : "Create Course"}</h1>

// //       <form onSubmit={handleSubmit}>
// //         <label htmlFor="courseName">Course Name:</label>
// //         <input type="text" value={courseName} placeholder="Course Name" onChange={(e) => setCourseName(e.target.value)} required />
        
// //         <label htmlFor="courseDescription">Course description</label>
// //         <input type="text" value={courseDescription} placeholder="Course Description" onChange={(e) => setCourseDescription(e.target.value)} required />
        
// //         <label htmlFor="courseFee">Fee</label>
// //         <input type="number" value={courseFee} placeholder="Enter Course Fee" onChange={(e) => setCourseFee(e.target.value)} required />
        
// //         <label htmlFor="courseDuration">Duration</label>
// //         <input type="text" value={courseDuration} placeholder="Enter Course Duration" onChange={(e) => setCourseDuration(e.target.value)} required />

// //         <select value={courseMode} onChange={(e) => setCourseMode(e.target.value)} required>
// //           <option value="">Select Mode</option>
// //           <option value="online">Online</option>
// //           <option value="offline">Offline</option>
// //           <option value="both">Both</option>
// //         </select>

// //         <select onChange={(e) => handleAddCenter(e.target.value)}>
// //           <option value="">Select a Center</option>
// //           {availableCenters.map((center) => (
// //             <option key={center.id} value={center.id}>{center.name}</option>
// //           ))}
// //         </select>

// //         {selectedCenters.length > 0 && (
// //           <table border="1">
// //             <thead>
// //               <tr>
// //                 <th>Sr No</th>
// //                 <th>Center Name</th>
// //                 <th>Action</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {selectedCenters.map((centerId, index) => {
// //                 const center = centers.find((c) => c.id === centerId);
// //                 return (
// //                   <tr key={centerId}>
// //                     <td>{index + 1}</td>
// //                     <td>{center?.name}</td>
// //                     <td>
// //                       <button type="button" onClick={() => handleRemoveCenter(centerId)}>✕</button>
// //                     </td>
// //                   </tr>
// //                 );
// //               })}
// //             </tbody>
// //           </table>
// //         )}

// //         <select onChange={(e) => handleAddBatch(e.target.value)}>
// //           <option value="">Select a Batch</option>
// //           {availableBatches.map((batch) => (
// //             <option key={batch.id} value={batch.id}>{batch.batchName}</option>
// //           ))}
// //         </select>

// //         {selectedBatches.length > 0 && (
// //           <table border="1">
// //             <thead>
// //               <tr>
// //                 <th>Sr No</th>
// //                 <th>Batch Name</th>
// //                 <th>Action</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {selectedBatches.map((batchId, index) => {
// //                 const batch = batches.find((c) => c.id === batchId);
// //                 return (
// //                   <tr key={batchId}>
// //                     <td>{index + 1}</td>
// //                     <td>{batch?.batchName}</td>
// //                     <td>
// //                       <button type="button" onClick={() => handleRemoveBatch(batchId)}>✕</button>
// //                     </td>
// //                   </tr>
// //                 );
// //               })}
// //             </tbody>
// //           </table>
// //         )}

// //         <select onChange={(e) => handleAddOwner(e.target.value)}>
// //           <option value="">Select an Owner</option>
// //           {availableOwners.map((owner) => (
// //             <option key={owner.id} value={owner.id}>{owner.f_name}</option>
// //           ))}
// //         </select>

// //         {selectedOwners.length > 0 && (
// //           <table border="1">
// //             <thead>
// //               <tr>
// //                 <th>Sr No</th>
// //                 <th>Owner Name</th>
// //                 <th>Action</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {selectedOwners.map((ownerId, index) => {
// //                 const owner = owners.find((c) => c.id === ownerId);
// //                 return (
// //                   <tr key={ownerId}>
// //                     <td>{index + 1}</td>
// //                     <td>{owner?.f_name}</td>
// //                     <td>
// //                       <button type="button" onClick={() => handleRemoveOwner(ownerId)}>✕</button>
// //                     </td>
// //                   </tr>
// //                 );
// //               })}
// //             </tbody>
// //           </table>
// //         )}

// //         <div className="flex justify-end">
// //           <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200">{course ? "Update course" : "Create course"}</button>
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
//   const [courseStatus, setCourseStatus] = useState("Ongoing"); // New state for course status

//   const [selectedCenters, setSelectedCenters] = useState([]);
//   const [selectedBatches, setSelectedBatches] = useState([]);
//   const [selectedOwners, setSelectedOwners] = useState([]);

//   const [availableCenters, setAvailableCenters] = useState([]);
//   const [availableBatches, setAvailableBatches] = useState([]);
//   const [availableOwners, setAvailableOwners] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const instructorSnapshot = await getDocs(collection(db, "Instructor"));
//       setInstructors(instructorSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

//       const centerSnapshot = await getDocs(collection(db, "Centers"));
//       const centersList = centerSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//       setCenters(centersList);
//       setAvailableCenters(centersList);

//       const batchSnapshot = await getDocs(collection(db, "Batch"));
//       const batchesList = batchSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//       setBatches(batchesList);
//       // Filter only ongoing batches
//       const ongoingBatches = batchesList.filter(batch => batch.status === "Ongoing" || !batch.status);
//       setAvailableBatches(ongoingBatches);

//       const ownerSnapshot = await getDocs(collection(db, "Instructor"));
//       const ownersList = ownerSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//       setOwners(ownersList);
//       setAvailableOwners(ownersList);
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (course) {
//       setCourseName(course.name);
//       setCourseDescription(course.description);
//       setCourseFee(course.fee);
//       setCourseDuration(course.duration);
//       setCourseMode(course.mode);
//       setCourseStatus(course.status || "Ongoing"); // Set existing course status or default to Ongoing
//       setSelectedCenters(course.centers || []);
//       setSelectedBatches(course.batches || []);
//       setSelectedOwners(course.owners || []);
//       setAvailableCenters(centers.filter((c) => !course.centers.includes(c.id)));
//       // Filter available batches to only show ongoing ones, excluding already selected ones
//       setAvailableBatches(batches.filter((b) => 
//         (b.status === "Ongoing" || !b.status) && !course.batches.includes(b.id)
//       ));
//       setAvailableOwners(owners.filter((o) => !course.owners.includes(o.id)));
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
//       status: courseStatus, // Include course status in the data
//       centers: selectedCenters,
//       batches: selectedBatches,
//       owners: selectedOwners,
//       createdAt: serverTimestamp()
//     };

//     try {
//       if (course) {
//         await updateDoc(doc(db, "Course", course.id), courseData);
//         alert("Course updated successfully!");
//         resetForm();
//       } else {
//         await addDoc(collection(db, "Course"), courseData);
//         alert("Course created successfully!");
//         resetForm();
//       }
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
//     setCourseStatus("Ongoing"); // Reset to default status
//     setSelectedCenters([]);
//     setSelectedBatches([]);
//     setSelectedOwners([]);
//     setAvailableCenters(centers);
//     setAvailableBatches(batches.filter(batch => batch.status === "Ongoing" || !batch.status));
//     setAvailableOwners(owners);
//   };

//   const handleAddCenter = (centerId) => {
//     if (centerId && !selectedCenters.includes(centerId)) {
//       setSelectedCenters([...selectedCenters, centerId]);
//       setAvailableCenters(availableCenters.filter((c) => c.id !== centerId));
//     }
//   };

//   const handleRemoveCenter = (centerId) => {
//     setSelectedCenters(selectedCenters.filter((id) => id !== centerId));
//     const removedCenter = centers.find((c) => c.id === centerId);
//     if (removedCenter) setAvailableCenters([...availableCenters, removedCenter]);
//   };

//   const handleAddBatch = (batchId) => {
//     if (batchId && !selectedBatches.includes(batchId)) {
//       setSelectedBatches([...selectedBatches, batchId]);
//       setAvailableBatches(availableBatches.filter((c) => c.id !== batchId));
//     }
//   };

//   const handleRemoveBatch = (batchId) => {
//     setSelectedBatches(selectedBatches.filter((id) => id !== batchId));
//     const removedBatch = batches.find((c) => c.id === batchId);
//     if (removedBatch && (removedBatch.status === "Ongoing" || !removedBatch.status)) {
//       setAvailableBatches([...availableBatches, removedBatch]);
//     }
//   };

//   const handleAddOwner = (ownerId) => {
//     if (ownerId && !selectedOwners.includes(ownerId)) {
//       setSelectedOwners([...selectedOwners, ownerId]);
//       setAvailableOwners(availableOwners.filter((c) => c.id !== ownerId));
//     }
//   };

//   const handleRemoveOwner = (ownerId) => {
//     setSelectedOwners(selectedOwners.filter((id) => id !== ownerId));
//     const removedOwner = owners.find((c) => c.id === ownerId);
//     if (removedOwner) setAvailableOwners([...availableOwners, removedOwner]);
//   };

//   return (
//     <div
//       className={`fixed top-0 right-0 h-full bg-white w-2/5 shadow-lg transform transition-transform duration-300 ${
//         isOpen ? "translate-x-0" : "translate-x-full"
//       } p-4 overflow-y-auto`}
//     >
//       <button 
//         type="button" 
//         onClick={toggleSidebar} 
//         className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition duration-200"
//       >
//         Back
//       </button>
//       <h1>{course ? "Edit Course" : "Create Course"}</h1>

//       <form onSubmit={handleSubmit}>
//         <label htmlFor="courseName">Course Name:</label>
//         <input 
//           type="text" 
//           value={courseName} 
//           placeholder="Course Name" 
//           onChange={(e) => setCourseName(e.target.value)} 
//           required 
//         />
        
//         <label htmlFor="courseDescription">Course Description</label>
//         <input 
//           type="text" 
//           value={courseDescription} 
//           placeholder="Course Description" 
//           onChange={(e) => setCourseDescription(e.target.value)} 
//           required 
//         />
        
//         <label htmlFor="courseFee">Fee</label>
//         <input 
//           type="number" 
//           value={courseFee} 
//           placeholder="Enter Course Fee" 
//           onChange={(e) => setCourseFee(e.target.value)} 
//           required 
//         />
        
//         <label htmlFor="courseDuration">Duration</label>
//         <input 
//           type="text" 
//           value={courseDuration} 
//           placeholder="Enter Course Duration" 
//           onChange={(e) => setCourseDuration(e.target.value)} 
//           required 
//         />

//         <label htmlFor="courseMode">Mode:</label>
//         <select 
//           value={courseMode} 
//           onChange={(e) => setCourseMode(e.target.value)} 
//           required
//         >
//           <option value="">Select Mode</option>
//           <option value="online">Online</option>
//           <option value="offline">Offline</option>
//           <option value="both">Both</option>
//         </select>

//         <label htmlFor="courseStatus">Status:</label>
//         <select
//           value={courseStatus}
//           onChange={(e) => setCourseStatus(e.target.value)}
//           required
//         >
//           <option value="Ongoing">Ongoing</option>
//           <option value="Archive">Archive</option>
//         </select>

//         <select onChange={(e) => handleAddCenter(e.target.value)}>
//           <option value="">Select a Center</option>
//           {availableCenters.map((center) => (
//             <option key={center.id} value={center.id}>{center.name}</option>
//           ))}
//         </select>

//         {selectedCenters.length > 0 && (
//           <table border="1">
//             <thead>
//               <tr>
//                 <th>Sr No</th>
//                 <th>Center Name</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {selectedCenters.map((centerId, index) => {
//                 const center = centers.find((c) => c.id === centerId);
//                 return (
//                   <tr key={centerId}>
//                     <td>{index + 1}</td>
//                     <td>{center?.name}</td>
//                     <td>
//                       <button type="button" onClick={() => handleRemoveCenter(centerId)}>✕</button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         )}

//         <select onChange={(e) => handleAddBatch(e.target.value)}>
//           <option value="">Select a Batch</option>
//           {availableBatches.map((batch) => (
//             <option key={batch.id} value={batch.id}>{batch.batchName}</option>
//           ))}
//         </select>

//         {selectedBatches.length > 0 && (
//           <table border="1">
//             <thead>
//               <tr>
//                 <th>Sr No</th>
//                 <th>Batch Name</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {selectedBatches.map((batchId, index) => {
//                 const batch = batches.find((c) => c.id === batchId);
//                 return (
//                   <tr key={batchId}>
//                     <td>{index + 1}</td>
//                     <td>{batch?.batchName}</td>
//                     <td>
//                       <button type="button" onClick={() => handleRemoveBatch(batchId)}>✕</button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         )}

//         <select onChange={(e) => handleAddOwner(e.target.value)}>
//           <option value="">Select an Owner</option>
//           {availableOwners.map((owner) => (
//             <option key={owner.id} value={owner.id}>{owner.f_name}</option>
//           ))}
//         </select>

//         {selectedOwners.length > 0 && (
//           <table border="1">
//             <thead>
//               <tr>
//                 <th>Sr No</th>
//                 <th>Owner Name</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {selectedOwners.map((ownerId, index) => {
//                 const owner = owners.find((c) => c.id === ownerId);
//                 return (
//                   <tr key={ownerId}>
//                     <td>{index + 1}</td>
//                     <td>{owner?.f_name}</td>
//                     <td>
//                       <button type="button" onClick={() => handleRemoveOwner(ownerId)}>✕</button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         )}

//         <div className="flex justify-end">
//           <button 
//             type="submit" 
//             className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200"
//           >
//             {course ? "Update course" : "Create course"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateCourses;



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
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [centers, setCenters] = useState([]);
  const [batches, setBatches] = useState([]);
  const [owners, setOwners] = useState([]);

  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseFee, setCourseFee] = useState("");
  const [courseDuration, setCourseDuration] = useState("");
  const [courseMode, setCourseMode] = useState("");
  const [courseStatus, setCourseStatus] = useState("Ongoing");

  const [centerAssignments, setCenterAssignments] = useState([]); // [{centerId, status}]
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [selectedOwners, setSelectedOwners] = useState([]);
  const [studentCount, setStudentCount] = useState(0); // Total students in course
  const [batchStudentCounts, setBatchStudentCounts] = useState({}); // {batchId: count}

  const [availableCenters, setAvailableCenters] = useState([]);
  const [availableBatches, setAvailableBatches] = useState([]);
  const [availableOwners, setAvailableOwners] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const instructorSnapshot = await getDocs(collection(db, "Instructor"));
      setInstructors(instructorSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      const centerSnapshot = await getDocs(collection(db, "Centers"));
      const centersList = centerSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCenters(centersList);
      setAvailableCenters(centersList);

      const batchSnapshot = await getDocs(collection(db, "Batch"));
      const batchesList = batchSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBatches(batchesList);
      setAvailableBatches(batchesList.filter(batch => batch.status === "Ongoing" || !batch.status));

      const ownerSnapshot = await getDocs(collection(db, "Instructor"));
      const ownersList = ownerSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOwners(ownersList);
      setAvailableOwners(ownersList);

      if (course) {
        // Fetch student count for the course
        const studentSnapshot = await getDocs(collection(db, `Course/${course.id}/Students`));
        setStudentCount(studentSnapshot.docs.length);

        // Fetch student counts per batch
        const batchCounts = {};
        for (const batchId of course.batches || []) {
          const batchStudents = await getDocs(collection(db, `Batch/${batchId}/Students`));
          batchCounts[batchId] = batchStudents.docs.length;
        }
        setBatchStudentCounts(batchCounts);
      }
    };
    fetchData();
  }, [course]);

  useEffect(() => {
    if (course) {
      setCourseName(course.name);
      setCourseDescription(course.description);
      setCourseFee(course.fee);
      setCourseDuration(course.duration);
      setCourseMode(course.mode);
      setCourseStatus(course.status || "Ongoing");
      setCenterAssignments(course.centers?.map(c => typeof c === "string" ? { centerId: c, status: "Active" } : c) || []);
      setSelectedBatches(course.batches || []);
      setSelectedOwners(course.owners || []);
      setAvailableCenters(centers.filter(c => !course.centers?.some(ca => ca.centerId === c.id)));
      setAvailableBatches(batches.filter(b => (b.status === "Ongoing" || !b.status) && !course.batches?.includes(b.id)));
      setAvailableOwners(owners.filter(o => !course.owners?.includes(o.id)));
    }
  }, [course, centers, batches, owners]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const courseData = {
      name: courseName,
      description: courseDescription,
      fee: courseFee,
      duration: courseDuration,
      mode: courseMode,
      status: courseStatus,
      centers: centerAssignments, // Array of {centerId, status}
      batches: selectedBatches,
      owners: selectedOwners,
      createdAt: serverTimestamp(),
    };

    try {
      if (course) {
        await updateDoc(doc(db, "Course", course.id), courseData);
        alert("Course updated successfully!");
      } else {
        await addDoc(collection(db, "Course"), courseData);
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
    setCourseStatus("Ongoing");
    setCenterAssignments([]);
    setSelectedBatches([]);
    setSelectedOwners([]);
    setStudentCount(0);
    setBatchStudentCounts({});
    setAvailableCenters(centers);
    setAvailableBatches(batches.filter(batch => batch.status === "Ongoing" || !batch.status));
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

  const handleAddBatch = (batchId) => {
    if (batchId && !selectedBatches.includes(batchId)) {
      setSelectedBatches([...selectedBatches, batchId]);
      setAvailableBatches(availableBatches.filter(b => b.id !== batchId));
    }
  };

  const handleRemoveBatch = (batchId) => {
    setSelectedBatches(selectedBatches.filter(id => id !== batchId));
    const removedBatch = batches.find(b => b.id === batchId);
    if (removedBatch && (removedBatch.status === "Ongoing" || !removedBatch.status)) {
      setAvailableBatches([...availableBatches, removedBatch]);
    }
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
      className={`fixed top-0 right-0 h-full bg-white w-2/5 shadow-lg transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } p-4 overflow-y-auto`}
    >
      <button 
        type="button" 
        onClick={toggleSidebar} 
        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition duration-200"
      >
        Back
      </button>
      <h1>{course ? "Edit Course" : "Create Course"}</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="courseName">Course Name:</label>
        <input 
          type="text" 
          value={courseName} 
          placeholder="Course Name" 
          onChange={(e) => setCourseName(e.target.value)} 
          required 
        />
        
        <label htmlFor="courseDescription">Course Description</label>
        <input 
          type="text" 
          value={courseDescription} 
          placeholder="Course Description" 
          onChange={(e) => setCourseDescription(e.target.value)} 
          required 
        />
        
        <label htmlFor="courseFee">Fee</label>
        <input 
          type="number" 
          value={courseFee} 
          placeholder="Enter Course Fee" 
          onChange={(e) => setCourseFee(e.target.value)} 
          required 
        />
        
        <label htmlFor="courseDuration">Duration</label>
        <input 
          type="text" 
          value={courseDuration} 
          placeholder="Enter Course Duration" 
          onChange={(e) => setCourseDuration(e.target.value)} 
          required 
        />

        <label htmlFor="courseMode">Mode:</label>
        <select 
          value={courseMode} 
          onChange={(e) => setCourseMode(e.target.value)} 
          required
        >
          <option value="">Select Mode</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
          <option value="both">Both</option>
        </select>

        <label htmlFor="courseStatus">Status:</label>
        <select
          value={courseStatus}
          onChange={(e) => setCourseStatus(e.target.value)}
          required
        >
          <option value="Ongoing">Ongoing</option>
          <option value="Archive">Archive</option>
        </select>

        <h3>Total Students: {studentCount}</h3>

        <select onChange={(e) => handleAddCenter(e.target.value)}>
          <option value="">Select a Center</option>
          {availableCenters.map((center) => (
            <option key={center.id} value={center.id}>{center.name}</option>
          ))}
        </select>

        {centerAssignments.length > 0 && (
          <table border="1">
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Center Name</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {centerAssignments.map((ca, index) => {
                const center = centers.find(c => c.id === ca.centerId);
                return (
                  <tr key={ca.centerId}>
                    <td>{index + 1}</td>
                    <td>{center?.name}</td>
                    <td>
                      <select
                        value={ca.status}
                        onChange={(e) => handleCenterStatusChange(ca.centerId, e.target.value)}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </td>
                    <td>
                      <button type="button" onClick={() => handleRemoveCenter(ca.centerId)}>✕</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <select onChange={(e) => handleAddBatch(e.target.value)}>
          <option value="">Select a Batch</option>
          {availableBatches.map((batch) => (
            <option key={batch.id} value={batch.id}>{batch.batchName}</option>
          ))}
        </select>

        {selectedBatches.length > 0 && (
          <table border="1">
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Batch Name</th>
                <th>Student Count</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {selectedBatches.map((batchId, index) => {
                const batch = batches.find(b => b.id === batchId);
                return (
                  <tr key={batchId}>
                    <td>{index + 1}</td>
                    <td>{batch?.batchName}</td>
                    <td>{batchStudentCounts[batchId] || 0}</td>
                    <td>
                      <button type="button" onClick={() => handleRemoveBatch(batchId)}>✕</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <select onChange={(e) => handleAddOwner(e.target.value)}>
          <option value="">Select an Owner</option>
          {availableOwners.map((owner) => (
            <option key={owner.id} value={owner.id}>{owner.f_name}</option>
          ))}
        </select>

        {selectedOwners.length > 0 && (
          <table border="1">
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Owner Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {selectedOwners.map((ownerId, index) => {
                const owner = owners.find(o => o.id === ownerId);
                return (
                  <tr key={ownerId}>
                    <td>{index + 1}</td>
                    <td>{owner?.f_name}</td>
                    <td>
                      <button type="button" onClick={() => handleRemoveOwner(ownerId)}>✕</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <div className="flex justify-end">
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            {course ? "Update course" : "Create course"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCourses;