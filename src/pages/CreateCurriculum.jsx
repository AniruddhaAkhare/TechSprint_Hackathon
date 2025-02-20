// // // import React, { useState, useEffect } from 'react';
// // // import { FaTimes } from 'react-icons/fa';
// // // import { db } from '../config/firebase';
// // // import { getDocs, collection, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';

// // // export default function CreateCurriculum({ onClose, course }) {
// // //     const [isMoved, setIsMoved] = useState(false);

// // //     const [curriculumName, setCurriculumName] = useState("");
// // //     // const [courseDescription, setCourseDescription] = useState("");
// // //     // const [courseFee, setCourseFee] = useState("");
// // //     // const [courseDuration, setCourseDuration] = useState("");
// // //     // const [coursePrerequisite, setCoursePrerequisites] = useState("");
// // //     // const [courseMode, setCourseMode] = useState("");

// // //     useEffect(() => {
// // //         if (course) {
// // //             setCurriculumName(curriculum.name);
// // //             // setCourseDescription(course.description);
// // //             // setCourseFee(course.fee);
// // //             // setCourseDuration(course.duration);
// // //             // setCoursePrerequisites(course.prerequisites);
// // //             // setCourseMode(course.mode);
// // //         }
// // //     }, [curriculum]);

// // //     const curriculumCollectionRef = collection(db, "Curriculum");

// // //     const onSubmitCurriculum = async (e) => {
// // //         e.preventDefault(); // Prevent default form submission
// // //         try {
// // //             if (curriculum) {
// // //                 // Update existing course
// // //                 const curriculumDoc = doc(db, "Curriculum", curriculum.id);
// // //                 await updateDoc(curriculumDoc, {
// // //                     // description: courseDescription,
// // //                     // duration: courseDuration,
// // //                     // fee: courseFee,
// // //                     name: curriculumName,
// // //                     // prerequisites: coursePrerequisite,
// // //                     // mode: courseMode
// // //                 });
// // //             } else {
// // //                 // Create new course
// // //                 await addDoc(curriculumCollectionRef, {
// // //                     // description: courseDescription,
// // //                     // duration: courseDuration,
// // //                     // fee: courseFee,
// // //                     name: courseName,
// // //                     // prerequisites: coursePrerequisite,
// // //                     // mode: courseMode
// // //                 });
// // //             }
// // //             alert("Curriculum successfully added!");
// // //             onClose();
// // //         } catch (err) {
// // //             console.error("Error adding document: ", err);
// // //             alert("Error adding curriculum!");
// // //         }
// // //     };
    


// // //     const handleCloseClick = () => {
// // //         setIsMoved(true);
// // //         onClose();
// // //     }

// // //     return (
// // //         <>
// // //             <div className={`container ${isMoved ? 'moved' : ''}`}>
// // //                 <button type="button" className="close-button" onClick={handleCloseClick}>
// // //                     <FaTimes /> { }
// // //                 </button>

// // //                 <h1>{curriculum ? "Edit curriculum" : "Create curriculum"}</h1>
// // //                 <form onSubmit={onSubmitCurriculum}>
// // //                     <div className="col-md-4">
// // //                         <div className="mb-3 subfields">
// // //                             <label htmlFor="curriculum_name" className="form-label">curriculum Name</label>
// // //                             <input type="text" className="form-control" placeholder={curriculum ? curriculum.curriculum_name : "curriculum Name"} onChange={(e) => setCurriculumName(e.target.value)} required />
// // //                         </div>

// // //                         {/* <div className="mb-3 subfields">
// // //                             <label htmlFor="description" className="form-label">Course Description</label>
// // //                             <input type="text" className="form-control" placeholder={course ? course.description : "Course Description"} onChange={(e) => setCourseDescription(e.target.value)} required />
// // //                         </div>

// // //                         <div className="mb-3 subfields">
// // //                             <label htmlFor="fee" className="form-label">Course Fee</label>
// // //                             <input type="text" className="form-control" placeholder={course ? course.fee : "Course Fee"} onChange={(e) => setCourseFee(e.target.value)} required />
// // //                         </div>

// // //                         <div className="mb-3 subfields">
// // //                             <label htmlFor="duration" className="form-label">Course Duration</label>
// // //                             <input type="text" className="form-control" placeholder={course ? course.duration : "Course Duration"} onChange={(e) => setCourseDuration(e.target.value)} required />
// // //                         </div>

// // //                         <div className="mb-3 subfields">
// // //                             <label htmlFor="prerequisites" className="form-label">Course Prerequisites</label>
// // //                             <input type="text" className="form-control" placeholder={course ? course.prerequisites : "Course Prerequisites"} onChange={(e) => setCoursePrerequisites(e.target.value)} required />
// // //                         </div> */}

// // //                         {/* <div className="mb-3 subfields">
// // //                             <label htmlFor="mode" className="form-label">Course Mode</label>
// // //                             <select value={courseMode} className="form-control" onChange={(e) => setCourseMode(e.target.value)} required>
// // //                                 <option value="">Select Mode</option>
// // //                                 <option value="online">Online</option>
// // //                                 <option value="offline">Offline</option>
// // //                                 <option value="both">Both</option>
// // //                             </select>
// // //                         </div> */}

// // //                         <div className="d-grid gap-2 d-md-flex">
// // //                             <button type="submit" className="btn btn-primary btn-sm">
// // //                                 {course ? "Update" : "Create"}
// // //                             </button>

// // //                             <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}><FaTimes />Cancel</button>
// // //                         </div>
// // //                     </div>
// // //                 </form>
// // //             </div>
// // //         </>
// // //     );
// // // }


// // import React, { useState, useEffect } from "react";
// // import { db } from "../config/firebase"; // Ensure you have a firebase.js config file
// // import { collection, getDocs, addDoc } from "firebase/firestore";

// // const Curriculum = () => {
// //   const [curriculums, setCurriculums] = useState([]);
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [newCurriculumName, setNewCurriculumName] = useState("");
// //   const [viewDuration, setViewDuration] = useState("Unlimited");

// //   useEffect(() => {
// //     const fetchCurriculums = async () => {
// //       const querySnapshot = await getDocs(collection(db, "curriculum"));
// //       const curriculumList = querySnapshot.docs.map((doc, index) => ({
// //         id: doc.id,
// //         index: index + 1,
// //         ...doc.data(),
// //       }));
// //       setCurriculums(curriculumList);
// //     };
// //     fetchCurriculums();
// //   }, []);

// //   const handleAddCurriculum = async () => {
// //     if (!newCurriculumName.trim()) return;

// //     const newCurriculum = {
// //       name: newCurriculumName,
// //       viewDuration,
// //       sections: "0 Sections",
// //     };

// //     try {
// //       await addDoc(collection(db, "curriculum"), newCurriculum);
// //       setCurriculums((prev) => [...prev, { ...newCurriculum, id: Date.now(), index: prev.length + 1 }]);
// //       setIsModalOpen(false);
// //       setNewCurriculumName("");
// //       setViewDuration("Unlimited");
// //     } catch (error) {
// //       console.error("Error adding curriculum:", error);
// //     }
// //   };

// //   return (
// //     <div className="p-6">
// //       <h2 className="text-2xl font-bold mb-2">Curriculum</h2>
// //       <p className="text-gray-600 mb-6">Manage all your course curriculum in one place.</p>
// //       <div className="flex justify-between items-center mb-4">
// //         <span className="text-sm bg-gray-200 text-gray-600 px-2 py-1 rounded">
// //           All Curriculum <span className="ml-1 font-bold">{curriculums.length.toString().padStart(2, "0")}</span>
// //         </span>
// //         <button
// //           onClick={() => setIsModalOpen(true)}
// //           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
// //         >
// //           + Add Curriculum
// //         </button>
// //       </div>
// //       <table className="w-full border-collapse border border-gray-300">
// //         <thead>
// //           <tr>
// //             <th className="border border-gray-300 px-4 py-2">Sr.</th>
// //             <th className="border border-gray-300 px-4 py-2">Curriculum Name</th>
// //             <th className="border border-gray-300 px-4 py-2">Content</th>
// //             <th className="border border-gray-300 px-4 py-2">Actions</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {curriculums.map((curriculum) => (
// //             <tr key={curriculum.id}>
// //               <td className="border border-gray-300 px-4 py-2 text-center">
// //                 {curriculum.index.toString().padStart(2, "0")}
// //               </td>
// //               <td className="border border-gray-300 px-4 py-2">{curriculum.name}</td>
// //               <td className="border border-gray-300 px-4 py-2">{curriculum.sections || "-"}</td>
// //               <td className="border border-gray-300 px-4 py-2 text-center">
// //                 <button className="text-blue-500 hover:underline">Edit</button>
// //               </td>
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>

// //       {isModalOpen && (
// //         <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
// //           <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
// //             <h3 className="text-xl font-bold mb-4">Add Curriculum</h3>
// //             <label className="block mb-2 font-medium">Name *</label>
// //             <input
// //               type="text"
// //               value={newCurriculumName}
// //               onChange={(e) => setNewCurriculumName(e.target.value)}
// //               className="w-full px-3 py-2 border rounded mb-4"
// //               placeholder="Enter curriculum name"
// //             />
// //             <label className="block mb-2 font-medium">Maximum View Duration</label>
// //             <div className="mb-4">
// //               <label className="inline-flex items-center">
// //                 <input
// //                   type="radio"
// //                   value="Unlimited"
// //                   checked={viewDuration === "Unlimited"}
// //                   onChange={(e) => setViewDuration(e.target.value)}
// //                   className="mr-2"
// //                 />
// //                 Unlimited
// //               </label>
// //               <label className="inline-flex items-center ml-4">
// //                 <input
// //                   type="radio"
// //                   value="Restricted"
// //                   checked={viewDuration === "Restricted"}
// //                   onChange={(e) => setViewDuration(e.target.value)}
// //                   className="mr-2"
// //                 />
// //                 Restricted
// //               </label>
// //             </div>
// //             <div className="flex justify-end space-x-4">
// //               <button
// //                 onClick={() => setIsModalOpen(false)}
// //                 className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 onClick={handleAddCurriculum}
// //                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
// //               >
// //                 Add Curriculum
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default Curriculum;



// import React, { useState } from "react";

// const CreateCurriculum = ({ isOpen, onClose, onSubmit }) => {
//   const [name, setName] = useState("");
//   const [viewDuration, setViewDuration] = useState("Unlimited");
//   const [totalDuration, setTotalDuration] = useState(0);
//   const [multiplier, setMultiplier] = useState(0);

//   const handleSubmit = () => {
//     if (!name.trim()) return alert("Curriculum name is required!");
//     const totalWatchTime = totalDuration * multiplier;
//     onSubmit({ name, viewDuration, totalWatchTime });
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
//         <h3 className="text-xl font-bold mb-4">Add Curriculum</h3>
//         <label className="block mb-2 font-medium">Name *</label>
//         <input
//           type="text"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="w-full px-3 py-2 border rounded mb-4"
//           maxLength="50"
//           placeholder="Enter curriculum name"
//         />
//         <label className="block mb-2 font-medium">Maximum View Duration</label>
//         <div className="mb-4">
//           <label className="inline-flex items-center">
//             <input
//               type="radio"
//               value="Unlimited"
//               checked={viewDuration === "Unlimited"}
//               onChange={(e) => setViewDuration(e.target.value)}
//               className="mr-2"
//             />
//             Unlimited
//           </label>
//           <label className="inline-flex items-center ml-4">
//             <input
//               type="radio"
//               value="Restricted"
//               checked={viewDuration === "Restricted"}
//               onChange={(e) => setViewDuration(e.target.value)}
//               className="mr-2"
//             />
//             Restricted
//           </label>
//         </div>
//         {viewDuration === "Restricted" && (
//           <div className="mb-4">
//             <div className="flex items-center space-x-4">
//               <div>
//                 <label className="block mb-1">Total Duration (seconds)</label>
//                 <input
//                   type="number"
//                   value={totalDuration}
//                   onChange={(e) => setTotalDuration(Number(e.target.value))}
//                   className="px-2 py-1 border rounded w-full"
//                   min="0"
//                 />
//               </div>
//               <span className="text-lg">×</span>
//               <div>
//                 <label className="block mb-1">Multiplier</label>
//                 <input
//                   type="number"
//                   value={multiplier}
//                   onChange={(e) => setMultiplier(Number(e.target.value))}
//                   className="px-2 py-1 border rounded w-full"
//                   min="0"
//                 />
//               </div>
//               <span className="text-lg">=</span>
//               <div>
//                 <label className="block mb-1">Total Watch Time (seconds)</label>
//                 <input
//                   type="text"
//                   value={`${totalDuration * multiplier} s`}
//                   readOnly
//                   className="px-2 py-1 border bg-gray-100 rounded w-full"
//                 />
//               </div>
//             </div>
//             <p className="text-sm text-gray-500 mt-2">
//               <strong>What is watch-time?</strong> Watch Time is the maximum duration a student can spend viewing course
//               content. Once the limit is reached, access is restricted.
//             </p>
//           </div>
//         )}
//         <div className="flex justify-end space-x-4">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//           >
//             Add Curriculum
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateCurriculum;
