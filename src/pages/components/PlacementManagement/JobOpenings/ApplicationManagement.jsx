// import React, { useState, useEffect } from "react";
// import { db } from "../../../../config/firebase";
// import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from "firebase/firestore";
// import { useAuth } from "../../../../context/AuthContext";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// const statuses = ["Pending", "Applied", "Rejected", "Shortlisted", "Interviewed"];
// const studentStatuses = ["enquiry", "enrolled", "completed", "deferred"];
// const educationLevels = ["School", "UG", "PG", "Diploma"];

// const ApplicationManagement = ({ jobId }) => {
//   const { user } = useAuth();
//   const [applications, setApplications] = useState([]);
//   const [filteredApplications, setFilteredApplications] = useState([]);
//   const [selectedApplications, setSelectedApplications] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [selectedStudents, setSelectedStudents] = useState([]);
//   const [statusFilter, setStatusFilter] = useState("");
//   const [courseFilter, setCourseFilter] = useState("");
//   const [batchFilter, setBatchFilter] = useState("");
//   const [studentStatusFilter, setStudentStatusFilter] = useState("");
//   const [centerFilter, setCenterFilter] = useState("");
//   const [educationLevelFilter, setEducationLevelFilter] = useState("");
//   const [admissionDateFilter, setAdmissionDateFilter] = useState("");
//   const [centers, setCenters] = useState([]);
//   const [courses, setCourses] = useState([]);
//   // const [batches, setBatches] = useState([]);
//   const [enrollments, setEnrollments] = useState([]);
//   const [shareableLink, setShareableLink] = useState("");
//   const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

//   const logActivity = async (action, details) => {
//     try {
//       const activityLog = {
//         action,
//         details: { jobId, ...details },
//         timestamp: new Date().toISOString(),
//         userEmail: user?.email || "anonymous",
//         userId: user.uid,
//       };
//       await addDoc(collection(db, "activityLogs"), activityLog);
//     } catch (error) {
//       //console.error("Error logging activity:", error);
//     }
//   };

//   useEffect(() => {
//     const fetchApplications = async () => {
//       try {
//         const snapshot = await getDocs(collection(db, `JobOpenings/${jobId}/Applications`));
//         const appData = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setApplications(appData);
//         setFilteredApplications(appData);
//       } catch (err) {
//         //console.error("Error fetching applications:", err);
//       }
//     };

//     const fetchStudents = async () => {
//       try {
//         const snapshot = await getDocs(collection(db, "student"));
//         const studentData = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setStudents(studentData);
//       } catch (err) {
//         //console.error("Error fetching students:", err);
//       }
//     };

//     const fetchCenters = async () => {
//       try {
//         const instituteSnapshot = await getDocs(collection(db, "instituteSetup"));
//         if (!instituteSnapshot.empty) {
//           const instituteId = instituteSnapshot.docs[0].id; // Use the first institute document
//           const snapshot = await getDocs(collection(db, "Branch"));
//           const centerData = snapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
//           setCenters(centerData);
//         }
//       } catch (err) {
//         //console.error("Error fetching centers:", err);
//       }
//     };

//     const fetchCourses = async () => {
//       try {
//         const snapshot = await getDocs(collection(db, "Course"));
//         const courseData = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setCourses(courseData);
//       } catch (err) {
//         //console.error("Error fetching courses:", err);
//       }
//     };

//     // const fetchBatches = async () => {
//     //   try {
//     //     const snapshot = await getDocs(collection(db, "Batches"));
//     //     const batchData = snapshot.docs.map((doc) => ({
//     //       id: doc.id,
//     //       ...doc.data(),
//     //     }));
//     //     setBatches(batchData);
//     //   } catch (err) {
//     //     //console.error("Error fetching batches:", err);
//     //   }
//     // };

//     const fetchEnrollments = async () => {
//       try {
//         const snapshot = await getDocs(collection(db, "enrollment"));
//         const enrollmentData = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setEnrollments(enrollmentData);
//       } catch (err) {
//         //console.error("Error fetching enrollments:", err);
//       }
//     };

//     fetchApplications();
//     fetchStudents();
//     fetchCenters();
//     fetchCourses();
//     // fetchBatches();
//     fetchEnrollments();
//   }, [jobId]);

//   useEffect(() => {
//     let filtered = applications;
//     if (statusFilter) {
//       filtered = filtered.filter((app) => app.status === statusFilter);
//     }
//     setFilteredApplications(filtered);
//   }, [statusFilter, applications]);

//   const handleAddApplications = async () => {
//     if (selectedStudents.length === 0) {
//       toast.error("Please select at least one student");
//       return;
//     }
//     try {
//       const newApplications = [];
//       for (const studentId of selectedStudents) {
//         const student = students.find((s) => s.id === studentId);
//         if (!student) continue;

//         const appData = {
//           studentId,
//           studentName: `${student.Name}`,
//           studentEmail: student.email || "",
//           status: "Pending",
//           remarks: "",
//           createdAt: serverTimestamp(),
//         };

//         const docRef = await addDoc(collection(db, `JobOpenings/${jobId}/Applications`), appData);
//         newApplications.push({ id: docRef.id, ...appData });

//         // Add placement record to Placements collection
//         const placementData = {
//           studentId,
//           jobId,
//           applicationId: docRef.id,
//           studentName: appData.studentName,
//           status: "Pending", // Initial status, can be synced with application status
//           createdAt: serverTimestamp(),
//         };

//         await addDoc(collection(db, "Placements"), placementData);

//         // Log activity for application creation
//         logActivity("CREATE_APPLICATION", { studentId, studentName: appData.studentName });
//         logActivity("CREATE_PLACEMENT", { studentId, jobId, applicationId: docRef.id });
//       }

//       setApplications([...applications, ...newApplications]);
//       setSelectedStudents([]);
//       toast.success("Applications and placements added successfully!");
//     } catch (err) {
//       //console.error("Error adding applications or placements:", err);
//       toast.error("Failed to add applications or placements.");
//     }
//   };

//   const handleUpdateApplication = async (id, updates) => {
//     try {
//       await updateDoc(doc(db, `JobOpenings/${jobId}/Applications`, id), updates);
//       setApplications(applications.map((app) => (app.id === id ? { ...app, ...updates } : app)));
//       toast.success("Application updated successfully!");
//       logActivity("UPDATE_APPLICATION", { applicationId: id, updates });
//     } catch (err) {
//       //console.error("Error updating application:", err);
//       toast.error("Failed to update application.");
//     }
//   };

//   const handleDeleteApplication = async (id) => {
//     try {
//       await deleteDoc(doc(db, `JobOpenings/${jobId}/Applications`, id));
//       setApplications(applications.filter((app) => app.id !== id));
//       setFilteredApplications(filteredApplications.filter((app) => app.id !== id));
//       setSelectedApplications(selectedApplications.filter((appId) => appId !== id));
//       toast.success("Application deleted successfully!");
//       logActivity("DELETE_APPLICATION", { applicationId: id });
//     } catch (err) {
//       //console.error("Error deleting application:", err);
//       toast.error("Failed to delete application.");
//     }
//   };

//   const handleSelectAllApplications = (e) => {
//     if (e.target.checked) {
//       setSelectedApplications(filteredApplications.map((app) => app.id));
//     } else {
//       setSelectedApplications([]);
//     }
//   };

//   const handleBulkEmail = () => {
//     if (selectedApplications.length === 0) {
//       toast.error("Please select at least one application");
//       return;
//     }
//     toast.success("Emails sent to selected candidates!");
//     logActivity("SEND_BULK_EMAIL", { applicationIds: selectedApplications });
//   };

//   const generateShareableLink = () => {
//     const link = `${window.location.origin}/recruiter-view/${jobId}`;
//     setShareableLink(link);
//     navigator.clipboard.writeText(link);
//     toast.success("Shareable link copied to clipboard!");
//     logActivity("GENERATE_SHAREABLE_LINK", { jobId, link });
//   };

//   const onDragEnd = (result) => {
//     if (!result.destination) return;
//     const updatedApplications = [...filteredApplications];
//     const [reorderedItem] = updatedApplications.splice(result.source.index, 1);
//     updatedApplications.splice(result.destination.index, 0, reorderedItem);
//     setFilteredApplications(updatedApplications);
//     handleUpdateApplication(reorderedItem.id, { status: reorderedItem.status });
//   };

//   // Student filtering logic
//   const filteredStudents = students.filter((student) => {
//     // Course filter (using enrollment data)
//     if (courseFilter) {
//       const studentEnrollments = enrollments.filter((enrollment) => enrollment.studentId === student.id);
//       const courseIds = studentEnrollments
//         .map((enrollment) => enrollment.courseId)
//         .filter((id) => id);
//       if (!courseIds.includes(courseFilter)) {
//         return false;
//       }
//     }

//     // Batch filter (optional, since batch_id is not in provided data)
//     if (batchFilter && student.batch_id && student.batch_id !== batchFilter) {
//       return false;
//     }

//     // Student status filter
//     if (studentStatusFilter && student.status !== studentStatusFilter) {
//       return false;
//     }

//     // Center filter
//     if (centerFilter) {
//       const preferredCenters = Array.isArray(student.preferred_centers) ? student.preferred_centers : [];
//       if (!preferredCenters.includes(centerFilter)) {
//         return false;
//       }
//     }

//     // Education level filter
//     if (educationLevelFilter) {
//       const educationLevels = Array.isArray(student.education_details)
//         ? student.education_details.map((edu) => edu.level).filter((level) => level)
//         : [];
//       if (!educationLevels.includes(educationLevelFilter)) {
//         return false;
//       }
//     }

//     // Admission date filter
//     if (admissionDateFilter && student.admission_date) {
//       const admissionDate = student.admission_date.toDate ? student.admission_date.toDate() : new Date(student.admission_date);
//       const [year, month] = admissionDateFilter.split("-").map(Number);
//       if (admissionDate.getFullYear() !== year || admissionDate.getMonth() + 1 !== month) {
//         return false;
//       }
//     }

//     return true;
//   });

//   const handleApplyFilters = () => {
//     setIsFilterDialogOpen(false);
//     // The filteredStudents logic will automatically update the student list
//   };

//   const handleClearFilters = () => {
//     setCourseFilter("");
//     setBatchFilter("");
//     setStudentStatusFilter("");
//     setCenterFilter("");
//     setEducationLevelFilter("");
//     setAdmissionDateFilter("");
//     setIsFilterDialogOpen(false);
//   };

//   return (
//     <>
//       <ToastContainer position="top-right" autoClose={3000} />
//       <div className="space-y-6">
//         {/* Add Applications */}
//         <div className="bg-gray-50 p-4 rounded-md">
//           <div className="flex flex-wrap gap-4 items-center mb-4">
//           <h3 className="text-lg font-semibold text-gray-800 ">Add Applications</h3>
//           <div className="flex flex-wrap gap-4 items-center justify-end">
//           <button
//             onClick={() => setIsFilterDialogOpen(true)}
//             className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 justify-items-end"
//           >
//             Filter Students
//           </button>
//           </div>
//         </div>
//           <div className="mb-4">
//             <h4 className="text-md font-medium text-gray-700 mb-2">Select Students</h4>
//             <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-md p-2">
//               {filteredStudents.map((student) => (
//                 <div key={student.id} className="flex items-center gap-2 py-1">
//                   <input
//                     type="checkbox"
//                     checked={selectedStudents.includes(student.id)}
//                     onChange={() => {
//                       setSelectedStudents(
//                         selectedStudents.includes(student.id)
//                           ? selectedStudents.filter((id) => id !== student.id)
//                           : [...selectedStudents, student.id]
//                       );
//                     }}
//                   />
//                   <span>{`${student.Name} (${student.email})`}</span>
//                 </div>
//               ))}
//               {filteredStudents.length === 0 && (
//                 <p className="text-gray-500 text-center">No students found</p>
//               )}
//             </div>
//           </div>
//           <button
//             type="button"
//             onClick={handleAddApplications}
//             className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
//           >
//             Add Selected Students
//           </button>
//         </div>

//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">All Application Statuses</option>
//             {statuses.map((status) => (
//               <option key={status} value={status}>
//                 {status}
//               </option>
//             ))}
//           </select>

//         {/* Filter Dialog */}
//         {isFilterDialogOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Students</h3>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Course</label>
//                   <select
//                     value={courseFilter}
//                     onChange={(e) => setCourseFilter(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">All Courses</option>
//                     {courses.map((course) => (
//                       <option key={course.id} value={course.id}>
//                         {course.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 {/* <div>
//                   <label className="block text-sm font-medium text-gray-700">Batch</label>
//                   <select
//                     value={batchFilter}
//                     onChange={(e) => setBatchFilter(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">All Batches</option>
//                     {batches.map((batch) => (
//                       <option key={batch.id} value={batch.id}>
//                         {batch.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div> */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Student Status</label>
//                   <select
//                     value={studentStatusFilter}
//                     onChange={(e) => setStudentStatusFilter(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">All Statuses</option>
//                     {studentStatuses.map((status) => (
//                       <option key={status} value={status}>
//                         {status}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Center</label>
//                   <select
//                     value={centerFilter}
//                     onChange={(e) => setCenterFilter(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">All Centers</option>
//                     {centers.map((center) => (
//                       <option key={center.id} value={center.id}>
//                         {center.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Education Level</label>
//                   <select
//                     value={educationLevelFilter}
//                     onChange={(e) => setEducationLevelFilter(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">All Education Levels</option>
//                     {educationLevels.map((level) => (
//                       <option key={level} value={level}>
//                         {level}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 {/* <div>
//                   <label className="block text-sm font-medium text-gray-700">Admission Date</label>
//                   <input
//                     type="month"
//                     value={admissionDateFilter}
//                     onChange={(e) => setAdmissionDateFilter(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div> */}
//               </div>
//               <div className="mt-6 flex justify-end gap-2">
//                 <button
//                   onClick={handleClearFilters}
//                   className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
//                 >
//                   Clear
//                 </button>
//                 <button
//                   onClick={handleApplyFilters}
//                   className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
//                 >
//                   Apply
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Shareable Link */}
//         <div>
//           <button
//             onClick={generateShareableLink}
//             className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
//           >
//             Generate Shareable Link
//           </button>
//           {shareableLink && <p className="mt-2 text-gray-600">{shareableLink}</p>}
//         </div>

//         {/* Applications Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full table-auto">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">
//                   <input
//                     type="checkbox"
//                     onChange={handleSelectAllApplications}
//                     checked={selectedApplications.length === filteredApplications.length && filteredApplications.length > 0}
//                   />
//                 </th>
//                 <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Student Name</th>
//                 <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Email</th>
//                 <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Status</th>
//                 <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Remarks</th>
//                 <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Actions</th>
//               </tr>
//             </thead>
//             <DragDropContext onDragEnd={onDragEnd}>
//               <Droppable droppableId="applications">
//                 {(provided) => (
//                   <tbody {...provided.droppableProps} ref={provided.innerRef}>
//                     {filteredApplications.map((app, index) => (
//                       <Draggable key={app.id} draggableId={app.id} index={index}>
//                         {(provided) => (
//                           <tr
//                             ref={provided.innerRef}
//                             {...provided.draggableProps}
//                             {...provided.dragHandleProps}
//                             className="border-b hover:bg-gray-50"
//                           >
//                             <td className="px-4 py-3">
//                               <input
//                                 type="checkbox"
//                                 checked={selectedApplications.includes(app.id)}
//                                 onChange={() => {
//                                   setSelectedApplications(
//                                     selectedApplications.includes(app.id)
//                                       ? selectedApplications.filter((id) => id !== app.id)
//                                       : [...selectedApplications, app.id]
//                                   );
//                                 }}
//                               />
//                             </td>
//                             <td className="px-4 py-3 text-gray-800">{app.studentName}</td>
//                             <td className="px-4 py-3 text-gray-800">{app.studentEmail}</td>
//                             <td className="px-4 py-3 text-gray-800">
//                               <select
//                                 value={app.status}
//                                 onChange={(e) => handleUpdateApplication(app.id, { status: e.target.value })}
//                                 className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                               >
//                                 {statuses.map((status) => (
//                                   <option key={status} value={status}>
//                                     {status}
//                                   </option>
//                                 ))}
//                               </select>
//                             </td>
//                             <td className="px-4 py-3 text-gray-800">
//                               <input
//                                 type="text"
//                                 value={app.remarks || ""}
//                                 onChange={(e) => handleUpdateApplication(app.id, { remarks: e.target.value })}
//                                 className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                               />
//                             </td>
//                             <td className="px-4 py-3 text-gray-800">
//                               <button
//                                 onClick={() => handleDeleteApplication(app.id)}
//                                 className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
//                               >
//                                 Delete
//                               </button>
//                             </td>
//                           </tr>
//                         )}
//                       </Draggable>
//                     ))}
//                     {provided.placeholder}
//                   </tbody>
//                 )}
//               </Droppable>
//             </DragDropContext>
//           </table>
//           {filteredApplications.length === 0 && (
//             <p className="text-gray-500 text-center mt-4">No applications found</p>
//           )}
//         </div>

//         {/* Bulk Actions */}
//         {selectedApplications.length > 0 && (
//           <div className="mt-4">
//             <button
//               onClick={handleBulkEmail}
//               className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
//             >
//               Send Email to Selected
//             </button>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default ApplicationManagement;

// import React, { useState, useEffect } from "react";
// import { db } from "../../../../config/firebase";
// import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from "firebase/firestore";
// import { useAuth } from "../../../../context/AuthContext";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// const statuses = ["Pending", "Applied", "Rejected", "Shortlisted", "Interviewed"];
// const studentStatuses = ["enquiry", "enrolled", "completed", "deferred"];
// const educationLevels = ["School", "UG", "PG", "Diploma"];

// const ApplicationManagement = ({ jobId }) => {
//   const { user } = useAuth();
//   const [applications, setApplications] = useState([]);
//   const [filteredApplications, setFilteredApplications] = useState([]);
//   const [selectedApplications, setSelectedApplications] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [selectedStudents, setSelectedStudents] = useState([]);
//   const [statusFilter, setStatusFilter] = useState("");
//   const [courseFilter, setCourseFilter] = useState("");
//   const [batchFilter, setBatchFilter] = useState("");
//   const [studentStatusFilter, setStudentStatusFilter] = useState("");
//   const [centerFilter, setCenterFilter] = useState("");
//   const [educationLevelFilter, setEducationLevelFilter] = useState("");
//   const [admissionDateFilter, setAdmissionDateFilter] = useState("");
//   const [centers, setCenters] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [enrollments, setEnrollments] = useState([]);
//   const [shareableLink, setShareableLink] = useState("");
//   const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

//   const logActivity = async (action, details) => {
//     try {
//       const activityLog = {
//         action,
//         details: { jobId, ...details },
//         timestamp: new Date().toISOString(),
//         userEmail: user?.email || "anonymous",
//         userId: user.uid,
//       };
//       await addDoc(collection(db, "activityLogs"), activityLog);
//     } catch (error) {
//       //console.error("Error logging activity:", error);
//     }
//   };

//   useEffect(() => {
//     const fetchApplications = async () => {
//       try {
//         const snapshot = await getDocs(collection(db, `JobOpenings/${jobId}/Applications`));
//         const appData = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setApplications(appData);
//         setFilteredApplications(appData);
//       } catch (err) {
//         //console.error("Error fetching applications:", err);
//       }
//     };

//     const fetchStudents = async () => {
//       try {
//         const snapshot = await getDocs(collection(db, "student"));
//         const studentData = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setStudents(studentData);
//       } catch (err) {
//         //console.error("Error fetching students:", err);
//       }
//     };

//     const fetchCenters = async () => {
//       try {
//         const instituteSnapshot = await getDocs(collection(db, "instituteSetup"));
//         if (!instituteSnapshot.empty) {
//           const instituteId = instituteSnapshot.docs[0].id;
//           const snapshot = await getDocs(collection(db, "Branch"));
//           const centerData = snapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
//           setCenters(centerData);
//         }
//       } catch (err) {
//         //console.error("Error fetching centers:", err);
//       }
//     };

//     const fetchCourses = async () => {
//       try {
//         const snapshot = await getDocs(collection(db, "Course"));
//         const courseData = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setCourses(courseData);
//       } catch (err) {
//         //console.error("Error fetching courses:", err);
//       }
//     };

//     const fetchEnrollments = async () => {
//       try {
//         const snapshot = await getDocs(collection(db, "enrollment"));
//         const enrollmentData = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setEnrollments(enrollmentData);
//       } catch (err) {
//         //console.error("Error fetching enrollments:", err);
//       }
//     };

//     fetchApplications();
//     fetchStudents();
//     fetchCenters();
//     fetchCourses();
//     fetchEnrollments();
//   }, [jobId]);

//   useEffect(() => {
//     let filtered = applications;
//     if (statusFilter) {
//       filtered = filtered.filter((app) => app.status === statusFilter);
//     }
//     setFilteredApplications(filtered);
//   }, [statusFilter, applications]);

//   const handleAddApplications = async () => {
//     if (selectedStudents.length === 0) {
//       toast.error("Please select at least one student");
//       return;
//     }
//     try {
//       const newApplications = [];
//       for (const studentId of selectedStudents) {
//         const student = students.find((s) => s.id === studentId);
//         if (!student) continue;

//         const appData = {
//           studentId,
//           studentName: `${student.first_name} ${student.last_name}`,
//           studentEmail: student.email || "",
//           status: "Pending",
//           remarks: "",
//           createdAt: serverTimestamp(),
//         };

//         const docRef = await addDoc(collection(db, `JobOpenings/${jobId}/Applications`), appData);
//         newApplications.push({ id: docRef.id, ...appData });

//         const placementData = {
//           studentId,
//           jobId,
//           applicationId: docRef.id,
//           studentName: appData.studentName,
//           status: "Pending",
//           createdAt: serverTimestamp(),
//         };

//         await addDoc(collection(db, "Placements"), placementData);

//         logActivity("CREATE_APPLICATION", { studentId, studentName: appData.studentName });
//         logActivity("CREATE_PLACEMENT", { studentId, jobId, applicationId: docRef.id });
//       }

//       setApplications([...applications, ...newApplications]);
//       setSelectedStudents([]);
//       toast.success("Applications and placements added successfully!");
//     } catch (err) {
//       //console.error("Error adding applications or placements:", err);
//       toast.error("Failed to add applications or placements.");
//     }
//   };

//   const handleUpdateApplication = async (id, updates) => {
//     try {
//       await updateDoc(doc(db, `JobOpenings/${jobId}/Applications`, id), updates);
//       setApplications(applications.map((app) => (app.id === id ? { ...app, ...updates } : app)));
//       toast.success("Application updated successfully!");
//       logActivity("UPDATE_APPLICATION", { applicationId: id, updates });
//     } catch (err) {
//       //console.error("Error updating application:", err);
//       toast.error("Failed to update application.");
//     }
//   };

//   const handleDeleteApplication = async (id) => {
//     try {
//       await deleteDoc(doc(db, `JobOpenings/${jobId}/Applications`, id));
//       setApplications(applications.filter((app) => app.id !== id));
//       setFilteredApplications(filteredApplications.filter((app) => app.id !== id));
//       setSelectedApplications(selectedApplications.filter((appId) => appId !== id));
//       toast.success("Application deleted successfully!");
//       logActivity("DELETE_APPLICATION", { applicationId: id });
//     } catch (err) {
//       //console.error("Error deleting application:", err);
//       toast.error("Failed to delete application.");
//     }
//   };

//   const handleSelectAllApplications = (e) => {
//     if (e.target.checked) {
//       setSelectedApplications(filteredApplications.map((app) => app.id));
//     } else {
//       setSelectedApplications([]);
//     }
//   };

//   const handleBulkEmail = () => {
//     if (selectedApplications.length === 0) {
//       toast.error("Please select at least one application");
//       return;
//     }
//     toast.success("Emails sent to selected candidates!");
//     logActivity("SEND_BULK_EMAIL", { applicationIds: selectedApplications });
//   };

//   const generateShareableLink = () => {
//     const link = `${window.location.origin}/recruiter-view/${jobId}`;
//     setShareableLink(link);
//     navigator.clipboard.writeText(link);
//     toast.success("Shareable link copied to clipboard!");
//     logActivity("GENERATE_SHAREABLE_LINK", { jobId, link });
//   };

//   const onDragEnd = (result) => {
//     if (!result.destination) return;
//     const updatedApplications = [...filteredApplications];
//     const [reorderedItem] = updatedApplications.splice(result.source.index, 1);
//     updatedApplications.splice(result.destination.index, 0, reorderedItem);
//     setFilteredApplications(updatedApplications);
//     handleUpdateApplication(reorderedItem.id, { status: reorderedItem.status });
//   };

//   // Student filtering logic with enrollment-based course data
//   const filteredStudents = students.map((student) => {
//     // Find enrollments for this student
//     const studentEnrollments = enrollments.filter((enrollment) => enrollment.student_id === student.id);
//     const courseDetails = studentEnrollments
//       .flatMap((enrollment) =>
//         (enrollment.courses || []).map((course) => ({
//           id: course.selectedCourse?.id || "",
//           name: course.selectedCourse?.name || "N/A",
//           duration: course.selectedCourse?.duration || "N/A",
//           fee: course.selectedCourse?.fee || "N/A",
//           mode: course.selectedCourse?.mode || "N/A",
//         }))
//       )
//       .filter((course) => course.id && courses.some((c) => c.id === course.id)); // Validate against Course collection

//     return {
//       ...student,
//       courseDetails,
//     };
//   }).filter((student) => {
//     // Course filter
//     if (courseFilter) {
//       const courseIds = student.courseDetails.map((course) => course.id);
//       if (!courseIds.includes(courseFilter)) {
//         return false;
//       }
//     }

//     // Batch filter
//     if (batchFilter && student.batch_id && student.batch_id !== batchFilter) {
//       return false;
//     }

//     // Student status filter
//     if (studentStatusFilter && student.status !== studentStatusFilter) {
//       return false;
//     }

//     // Center filter
//     if (centerFilter) {
//       const preferredCenters = Array.isArray(student.preferred_centers) ? student.preferred_centers : [];
//       if (!preferredCenters.includes(centerFilter)) {
//         return false;
//       }
//     }

//     // Education level filter
//     if (educationLevelFilter) {
//       const educationLevels = Array.isArray(student.education_details)
//         ? student.education_details.map((edu) => edu.level).filter((level) => level)
//         : [];
//       if (!educationLevels.includes(educationLevelFilter)) {
//         return false;
//       }
//     }

//     // Admission date filter
//     if (admissionDateFilter && student.admission_date) {
//       const admissionDate = student.admission_date.toDate ? student.admission_date.toDate() : new Date(student.admission_date);
//       const [year, month] = admissionDateFilter.split("-").map(Number);
//       if (admissionDate.getFullYear() !== year || admissionDate.getMonth() + 1 !== month) {
//         return false;
//       }
//     }

//     return true;
//   });

//   const handleApplyFilters = () => {
//     setIsFilterDialogOpen(false);
//   };

//   const handleClearFilters = () => {
//     setCourseFilter("");
//     setBatchFilter("");
//     setStudentStatusFilter("");
//     setCenterFilter("");
//     setEducationLevelFilter("");
//     setAdmissionDateFilter("");
//     setIsFilterDialogOpen(false);
//   };

//   return (
//     <>
//       <ToastContainer position="top-right" autoClose={3000} />
//       <div className="space-y-6">
//         {/* Add Applications */}
//         <div className="bg-gray-50 p-4 rounded-md">
//           <div className="flex flex-wrap gap-4 items-center mb-4">
//             <h3 className="text-lg font-semibold text-gray-800">Add Applications</h3>
//             <div className="flex flex-wrap gap-4 items-center justify-end">
//               <button
//                 onClick={() => setIsFilterDialogOpen(true)}
//                 className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
//               >
//                 Filter Students
//               </button>
//             </div>
//           </div>
//           <div className="mb-4">
//             <h4 className="text-md font-medium text-gray-700 mb-2">Select Students</h4>
//             <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-md p-2">
//               {filteredStudents.map((student) => (
//                 <div key={student.id} className="flex items-center gap-2 py-1">
//                   <input
//                     type="checkbox"
//                     checked={selectedStudents.includes(student.id)}
//                     onChange={() => {
//                       setSelectedStudents(
//                         selectedStudents.includes(student.id)
//                           ? selectedStudents.filter((id) => id !== student.id)
//                           : [...selectedStudents, student.id]
//                       );
//                     }}
//                   />
//                   <div>
//                     <span>{`${student.first_name} ${student.last_name} (${student.email})`}</span>
//                     {student.courseDetails.length > 0 && (
//                       <div className="text-sm text-gray-600">
//                         <strong>Courses:</strong>{" "}
//                         {student.courseDetails.map((course, index) => (
//                           <div key={index}>
//                             {course.name} ({course.duration}, {course.fee}, {course.mode})
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                     {student.courseDetails.length === 0 && (
//                       <div className="text-sm text-gray-600">No enrolled courses</div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//               {filteredStudents.length === 0 && (
//                 <p className="text-gray-500 text-center">No students found</p>
//               )}
//             </div>
//           </div>
//           <button
//             type="button"
//             onClick={handleAddApplications}
//             className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
//           >
//             Add Selected Students
//           </button>
//         </div>

//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//           className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="">All Application Statuses</option>
//           {statuses.map((status) => (
//             <option key={status} value={status}>
//               {status}
//             </option>
//           ))}
//         </select>

//         {/* Filter Dialog */}
//         {isFilterDialogOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Students</h3>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Course</label>
//                   <select
//                     value={courseFilter}
//                     onChange={(e) => setCourseFilter(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">All Courses</option>
//                     {courses.map((course) => (
//                       <option key={course.id} value={course.id}>
//                         {course.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Student Status</label>
//                   <select
//                     value={studentStatusFilter}
//                     onChange={(e) => setStudentStatusFilter(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">All Statuses</option>
//                     {studentStatuses.map((status) => (
//                       <option key={status} value={status}>
//                         {status}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Center</label>
//                   <select
//                     value={centerFilter}
//                     onChange={(e) => setCenterFilter(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">All Centers</option>
//                     {centers.map((center) => (
//                       <option key={center.id} value={center.id}>
//                         {center.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Education Level</label>
//                   <select
//                     value={educationLevelFilter}
//                     onChange={(e) => setEducationLevelFilter(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">All Education Levels</option>
//                     {educationLevels.map((level) => (
//                       <option key={level} value={level}>
//                         {level}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//               <div className="mt-6 flex justify-end gap-2">
//                 <button
//                   onClick={handleClearFilters}
//                   className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
//                 >
//                   Clear
//                 </button>
//                 <button
//                   onClick={handleApplyFilters}
//                   className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
//                 >
//                   Apply
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Shareable Link */}
//         <div>
//           <button
//             onClick={generateShareableLink}
//             className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
//           >
//             Generate Shareable Link
//           </button>
//           {shareableLink && <p className="mt-2 text-gray-600">{shareableLink}</p>}
//         </div>

//         {/* Applications Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full table-auto">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">
//                   <input
//                     type="checkbox"
//                     onChange={handleSelectAllApplications}
//                     checked={selectedApplications.length === filteredApplications.length && filteredApplications.length > 0}
//                   />
//                 </th>
//                 <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Student Name</th>
//                 <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Email</th>
//                 <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Status</th>
//                 <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Remarks</th>
//                 <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Actions</th>
//               </tr>
//             </thead>
//             <DragDropContext onDragEnd={onDragEnd}>
//               <Droppable droppableId="applications">
//                 {(provided) => (
//                   <tbody {...provided.droppableProps} ref={provided.innerRef}>
//                     {filteredApplications.map((app, index) => (
//                       <Draggable key={app.id} draggableId={app.id} index={index}>
//                         {(provided) => (
//                           <tr
//                             ref={provided.innerRef}
//                             {...provided.draggableProps}
//                             {...provided.dragHandleProps}
//                             className="border-b hover:bg-gray-50"
//                           >
//                             <td className="px-4 py-3">
//                               <input
//                                 type="checkbox"
//                                 checked={selectedApplications.includes(app.id)}
//                                 onChange={() => {
//                                   setSelectedApplications(
//                                     selectedApplications.includes(app.id)
//                                       ? selectedApplications.filter((id) => id !== app.id)
//                                       : [...selectedApplications, app.id]
//                                   );
//                                 }}
//                               />
//                             </td>
//                             <td className="px-4 py-3 text-gray-800">{app.studentName}</td>
//                             <td className="px-4 py-3 text-gray-800">{app.studentEmail}</td>
//                             <td className="px-4 py-3 text-gray-800">
//                               <select
//                                 value={app.status}
//                                 onChange={(e) => handleUpdateApplication(app.id, { status: e.target.value })}
//                                 className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                               >
//                                 {statuses.map((status) => (
//                                   <option key={status} value={status}>
//                                     {status}
//                                   </option>
//                                 ))}
//                               </select>
//                             </td>
//                             <td className="px-4 py-3 text-gray-800">
//                               <input
//                                 type="text"
//                                 value={app.remarks || ""}
//                                 onChange={(e) => handleUpdateApplication(app.id, { remarks: e.target.value })}
//                                 className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                               />
//                             </td>
//                             <td className="px-4 py-3 text-gray-800">
//                               <button
//                                 onClick={() => handleDeleteApplication(app.id)}
//                                 className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
//                               >
//                                 Delete
//                               </button>
//                             </td>
//                           </tr>
//                         )}
//                       </Draggable>
//                     ))}
//                     {provided.placeholder}
//                   </tbody>
//                 )}
//               </Droppable>
//             </DragDropContext>
//           </table>
//           {filteredApplications.length === 0 && (
//             <p className="text-gray-500 text-center mt-4">No applications found</p>
//           )}
//         </div>

//         {/* Bulk Actions */}
//         {selectedApplications.length > 0 && (
//           <div className="mt-4">
//             <button
//               onClick={handleBulkEmail}
//               className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
//             >
//               Send Email to Selected
//             </button>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default ApplicationManagement;
import { useState, useEffect } from "react";
import { db } from "../../../../config/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { useAuth } from "../../../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { runTransaction } from "firebase/firestore";

const statuses = [
  "Pending",
  "Applied",
  "Rejected",
  "Shortlisted",
  "Interviewed",
];
const studentStatuses = ["enquiry", "enrolled", "completed", "deferred"];
const educationLevels = ["School", "UG", "PG", "Diploma"];

const ApplicationManagement = ({ jobId }) => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const [studentStatusFilter, setStudentStatusFilter] = useState("");
  const [centerFilter, setCenterFilter] = useState("");
  const [educationLevelFilter, setEducationLevelFilter] = useState("");
  const [admissionDateFilter, setAdmissionDateFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [centers, setCenters] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [shareableLink, setShareableLink] = useState("");
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

const logActivity = async (action, details) => {
  if (!user?.email) return;

  const activityLogRef = doc(db, "activityLogs", "logDocument");

  const logEntry = {
    action,
    details,
    timestamp: new Date().toISOString(),
    userEmail: user.email,
    userId: user.uid,
    section: "Job Opening",
    // adminId: adminId || "N/A",
  };

  try {
    await runTransaction(db, async (transaction) => {
      const logDoc = await transaction.get(activityLogRef);
      let logs = logDoc.exists() ? logDoc.data().logs || [] : [];

      // Ensure logs is an array and contains only valid data
      if (!Array.isArray(logs)) {
        logs = [];
      }

      // Append the new log entry
      logs.push(logEntry);

      // Trim to the last 1000 entries if necessary
      if (logs.length > 1000) {
        logs = logs.slice(-1000);
      }

      // Update the document with the new logs array
      transaction.set(activityLogRef, { logs }, { merge: true });
    });
    console.log("Activity logged successfully");
  } catch (error) {
    console.error("Error logging activity:", error);
    // toast.error("Failed to log activity");
  }
};
  
  // const fetchLogs = useCallback(() => {
  //   if (!isAdmin) return;
  //   const q = query(LogsCollectionRef, orderBy("timestamp", "desc"));
  //   const unsubscribe = onSnapshot(
  //     q,
  //     (snapshot) => {
  //       const allLogs = [];
  //       snapshot.docs.forEach((doc) => {
  //         const data = doc.data();
  //         (data.logs || []).forEach((log) => {
  //           allLogs.push({ id: doc.id, ...log });
  //         });
  //       });
  //       allLogs.sort(
  //         (a, b) =>
  //           (b.timestamp?.toDate() || new Date(0)) - (a.timestamp?.toDate() || new Date(0))
  //       );
  //       setLogs(allLogs);
  //     },
  //   );
  //   return unsubscribe;
  // }, [isAdmin]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const snapshot = await getDocs(
          collection(db, `JobOpenings/${jobId}/Applications`)
        );
        const appData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setApplications(appData);
        setFilteredApplications(appData);
      } catch (err) {
        //console.error("Error fetching applications:", err);
      }
    };

    const fetchStudents = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const studentData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStudents(studentData);
      } catch (err) {
        //console.error("Error fetching students:", err);
      }
    };

    const fetchCenters = async () => {
      try {
        const instituteSnapshot = await getDocs(
          collection(db, "instituteSetup")
        );
        if (!instituteSnapshot.empty) {
          const instituteId = instituteSnapshot.docs[0].id;
          const snapshot = await getDocs(collection(db, "Branch"));
          const centerData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCenters(centerData);
        }
      } catch (err) {
        //console.error("Error fetching centers:", err);
      }
    };

    const fetchCourses = async () => {
      try {
        const snapshot = await getDocs(collection(db, "Course"));
        const courseData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(courseData);
      } catch (err) {
        //console.error("Error fetching courses:", err);
      }
    };

    const fetchEnrollments = async () => {
      try {
        const snapshot = await getDocs(collection(db, "enrollment"));
        const enrollmentData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEnrollments(enrollmentData);
      } catch (err) {
        //console.error("Error fetching enrollments:", err);
      }
    };

    fetchApplications();
    fetchStudents();
    fetchCenters();
    fetchCourses();
    fetchEnrollments();
  }, [jobId]);

  useEffect(() => {
    let filtered = applications;
    if (statusFilter) {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }
    setFilteredApplications(filtered);
  }, [statusFilter, applications]);

  const handleAddApplications = async () => {
    if (selectedStudents.length === 0) {
      toast.error("Please select at least one student");
      return;
    }
    
    try {
      // Filter out students who already have applications
      const existingStudentIds = applications.map(app => app.studentId);
      const newStudentIds = selectedStudents.filter(studentId => 
        !existingStudentIds.includes(studentId)
      );
      
      if (newStudentIds.length === 0) {
        toast.warning("All selected students already have applications for this job");
        return;
      }
      
      // Show warning if some students are already applied
      if (newStudentIds.length < selectedStudents.length) {
        const duplicateCount = selectedStudents.length - newStudentIds.length;
        toast.warning(`${duplicateCount} student(s) already have applications and were skipped`);
      }
      
      const newApplications = [];
      for (const studentId of newStudentIds) {
        const student = students.find((s) => s.id === studentId);
        if (!student) continue;
  
        const appData = {
          studentId,
          studentName: `${student.firstName} ${student.lastName}`,
          studentEmail: student.email || "",
          status: "Pending",
          remarks: "",
          createdAt: serverTimestamp(),
        };
  
        const docRef = await addDoc(
          collection(db, `JobOpenings/${jobId}/Applications`),
          appData
        );
        newApplications.push({ id: docRef.id, ...appData });
  
        // Add placement record to Placements collection
        const placementData = {
          studentId,
          jobId,
          applicationId: docRef.id,
          studentName: appData.studentName,
          status: "Pending",
          createdAt: serverTimestamp(),
        };
  
        await addDoc(collection(db, "Placements"), placementData);

        logActivity("Application created", { studentId, studentName: appData.studentName });
        logActivity("Placement created", { studentId, jobId, applicationId: docRef.id });
      }
  
      setApplications([...applications, ...newApplications]);
      setSelectedStudents([]);
      toast.success(`${newApplications.length} application(s) and placement(s) added successfully!`);
    } catch (err) {
      console.error("Error adding applications or placements:", err);
      toast.error("Failed to add applications or placements.");
    }
  };

  //new function added by Aayush
  const handleAddAllStudents = async () => {
    if (filteredStudents.length === 0) {
      toast.error("No students to add");
      return;
    }
    
    try {
      // Filter out students who already have applications
      const existingStudentIds = applications.map(app => app.studentId);
      const newStudents = filteredStudents.filter(student => 
        !existingStudentIds.includes(student.id)
      );
      
      if (newStudents.length === 0) {
        toast.warning("All filtered students already have applications for this job");
        return;
      }
      
      // Show info about how many students will be added
      if (newStudents.length < filteredStudents.length) {
        const duplicateCount = filteredStudents.length - newStudents.length;
        toast.info(`Adding ${newStudents.length} new students. ${duplicateCount} student(s) already have applications and were skipped.`);
      }
      
      const newApplications = [];
      for (const student of newStudents) {
        const appData = {
          studentId: student.id,
          studentName: `${student.firstName} ${student.lastName}`,
          studentEmail: student.email || "",
          status: "Pending",
          remarks: "",
          createdAt: serverTimestamp(),
        };
  
        const docRef = await addDoc(
          collection(db, `JobOpenings/${jobId}/Applications`),
          appData
        );
        newApplications.push({ id: docRef.id, ...appData });
  
        // Add placement record to Placements collection
        const placementData = {
          studentId: student.id,
          jobId,
          applicationId: docRef.id,
          studentName: appData.studentName,
          status: "Pending",
          createdAt: serverTimestamp(),
        };
  
        await addDoc(collection(db, "Placements"), placementData);
  
        logActivity("CREATE_APPLICATION", {
          studentId: student.id,
          studentName: appData.studentName,
        });
        logActivity("CREATE_PLACEMENT", {
          studentId: student.id,
          jobId,
          applicationId: docRef.id,
        });
      }
  
      setApplications([...applications, ...newApplications]);
      setSelectedStudents([]);
      toast.success(`${newApplications.length} student(s) added successfully!`);
    } catch (err) {
      console.error("Error adding all students:", err);
      toast.error("Failed to add all students");
    }
  };
  

  const handleUpdateApplication = async (id, updates) => {
    try {
      await updateDoc(
        doc(db, `JobOpenings/${jobId}/Applications`, id),
        updates
      );
      setApplications(
        applications.map((app) =>
          app.id === id ? { ...app, ...updates } : app
        )
      );
      toast.success("Application updated successfully!");
      logActivity("Application updated", { applicationId: id, updates });
    } catch (err) {
      //console.error("Error updating application:", err);
      toast.error("Failed to update application.");
    }
  };

  const handleDeleteApplication = async (id) => {
    try {
      // Delete the application from JobOpenings/${jobId}/Applications
      await deleteDoc(doc(db, `JobOpenings/${jobId}/Applications`, id));

      // Query and delete corresponding placement records from Placements collection
      const placementsQuery = query(
        collection(db, "Placements"),
        where("applicationId", "==", id)
      );
      const placementsSnapshot = await getDocs(placementsQuery);
      const deletePromises = placementsSnapshot.docs.map((placementDoc) =>
        deleteDoc(doc(db, "Placements", placementDoc.id))
      );
      await Promise.all(deletePromises);

      // Update local state
      setApplications(applications.filter((app) => app.id !== id));
      setFilteredApplications(
        filteredApplications.filter((app) => app.id !== id)
      );
      setSelectedApplications(
        selectedApplications.filter((appId) => appId !== id)
      );

      // Log activity for application and placement deletion
      logActivity("Application deleted", { applicationId: id });
      if (deletePromises.length > 0) {
        logActivity("Placement deleted", { applicationId: id, count: deletePromises.length });
      }

      toast.success(
        "Application and associated placements deleted successfully!"
      );
    } catch (err) {
      //console.error("Error deleting application or placements:", err);
      toast.error("Failed to delete application or associated placements.");
    }
  };

  const handleSelectAllApplications = (e) => {
    if (e.target.checked) {
      setSelectedApplications(filteredApplications.map((app) => app.id));
    } else {
      setSelectedApplications([]);
    }
  };

  const handleBulkEmail = () => {
    if (selectedApplications.length === 0) {
      toast.error("Please select at least one application");
      return;
    }
    toast.success("Emails sent to selected candidates!");
    logActivity("Email(Bulk) send", { applicationIds: selectedApplications });
  };

  const generateShareableLink = () => {
    const link = `${window.location.origin}/recruiter-view/${jobId}`;
    setShareableLink(link);
    navigator.clipboard.writeText(link);
    toast.success("Shareable link copied to clipboard!");
    logActivity("Sharable Link generated", { jobId, link });
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const updatedApplications = [...filteredApplications];
    const [reorderedItem] = updatedApplications.splice(result.source.index, 1);
    updatedApplications.splice(result.destination.index, 0, reorderedItem);
    setFilteredApplications(updatedApplications);
    handleUpdateApplication(reorderedItem.id, { status: reorderedItem.status });
  };

  const filteredStudents = students.filter((student) => {
    if (courseFilter) {
      const studentEnrollments = enrollments.filter(
        (enrollment) => enrollment.studentId === student.id
      );
      const courseIds = studentEnrollments
        .map((enrollment) => enrollment.courseId)
        .filter((id) => id);
      if (!courseIds.includes(courseFilter)) {
        return false;
      }
    }

    if (batchFilter && student.batch_id && student.batch_id !== batchFilter) {
      return false;
    }

    if (studentStatusFilter && student.status !== studentStatusFilter) {
      return false;
    }

    if (centerFilter) {
      const preferredCenters = Array.isArray(student.preferred_centers)
        ? student.preferred_centers
        : [];
      if (!preferredCenters.includes(centerFilter)) {
        return false;
      }
    }

    if (educationLevelFilter) {
      const educationLevels = Array.isArray(student.education_details)
        ? student.education_details
            .map((edu) => edu.level)
            .filter((level) => level)
        : [];
      if (!educationLevels.includes(educationLevelFilter)) {
        return false;
      }
    }

    if (locationFilter && student.location !== locationFilter) {
      return false;
    }

    if (admissionDateFilter && student.createdAt) {
      const createdAtDate = student.createdAt.toDate
        ? student.createdAt.toDate()
        : new Date(student.createdAt);
      const [year, month] = admissionDateFilter.split("-").map(Number);
      if (
        createdAtDate.getFullYear() !== year ||
        createdAtDate.getMonth() + 1 !== month
      ) {
        return false;
      }
    }

    return true;
  });

  const handleApplyFilters = () => {
    setIsFilterDialogOpen(false);
  };

  const handleClearFilters = () => {
    setCourseFilter("");
    setBatchFilter("");
    setStudentStatusFilter("");
    setCenterFilter("");
    setEducationLevelFilter("");
    setLocationFilter("");
    setAdmissionDateFilter("");
    setIsFilterDialogOpen(false);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="space-y-6">
        {/* Add Applications */}
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex flex-wrap gap-4 items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Add Applications
            </h3>
            <div className="flex flex-wrap gap-4 items-center justify-end">
              <button
                onClick={() => setIsFilterDialogOpen(true)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Filter Students
              </button>

              <button
            type="button"
            onClick={handleAddAllStudents}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Add All Students
          </button>
            </div>
          </div>
          <div className="mb-4">
            <h4 className="text-md font-medium text-gray-700 mb-2">
              Select Students
            </h4>
            <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-md p-2">
              {filteredStudents.map((student) => (
                <div key={student.id} className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => {
                      setSelectedStudents(
                        selectedStudents.includes(student.id)
                          ? selectedStudents.filter((id) => id !== student.id)
                          : [...selectedStudents, student.id]
                      );
                    }}
                  />
                  <span>{`${student.firstName} ${student.lastName} (${student.email || student.phone || student.username})`}</span>
                </div>
              ))}
              {filteredStudents.length === 0 && (
                <p className="text-gray-500 text-center">No students found</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddApplications}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add Selected Students
          </button>
        </div>
         
        

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Application Statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        {/* Filter Dialog */}
        {isFilterDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Filter Students
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Course
                  </label>
                  <select
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Courses</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Student Status
                  </label>
                  <select
                    value={studentStatusFilter}
                    onChange={(e) => setStudentStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Statuses</option>
                    {studentStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Center
                  </label>
                  <select
                    value={centerFilter}
                    onChange={(e) => setCenterFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Centers</option>
                    {centers.map((center) => (
                      <option key={center.id} value={center.id}>
                        {center.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Locations</option>
                    {[...new Set(students.map(student => student.location).filter(Boolean))].map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Education Level
                  </label>
                  <select
                    value={educationLevelFilter}
                    onChange={(e) => setEducationLevelFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Education Levels</option>
                    {educationLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Registration Date (YYYY-MM)
                  </label>
                  <input
                    type="month"
                    value={admissionDateFilter}
                    onChange={(e) => setAdmissionDateFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={handleClearFilters}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Clear
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Shareable Link */}
        <div>
          <button
            onClick={generateShareableLink}
            className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
          >
            Generate Shareable Link
          </button>
          {shareableLink && (
            <p className="mt-2 text-gray-600">{shareableLink}</p>
          )}
        </div>

        {/* Applications Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    onChange={handleSelectAllApplications}
                    checked={
                      selectedApplications.length ===
                        filteredApplications.length &&
                      filteredApplications.length > 0
                    }
                  />
                </th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">
                  Student Name
                </th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">
                  Remarks
                </th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="applications">
                {(provided) => (
                  <tbody {...provided.droppableProps} ref={provided.innerRef}>
                    {filteredApplications.map((app, index) => (
                      <Draggable
                        key={app.id}
                        draggableId={app.id}
                        index={index}
                      >
                        {(provided) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={selectedApplications.includes(app.id)}
                                onChange={() => {
                                  setSelectedApplications(
                                    selectedApplications.includes(app.id)
                                      ? selectedApplications.filter(
                                          (id) => id !== app.id
                                        )
                                      : [...selectedApplications, app.id]
                                  );
                                }}
                              />
                            </td>
                            <td className="px-4 py-3 text-gray-800">
                              {app.studentName}
                            </td>
                            <td className="px-4 py-3 text-gray-800">
                              {app.studentEmail}
                            </td>
                            <td className="px-4 py-3 text-gray-800">
                              <select
                                value={app.status}
                                onChange={(e) =>
                                  handleUpdateApplication(app.id, {
                                    status: e.target.value,
                                  })
                                }
                                className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                {statuses.map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-3 text-gray-800">
                              <input
                                type="text"
                                value={app.remarks || ""}
                                onChange={(e) =>
                                  handleUpdateApplication(app.id, {
                                    remarks: e.target.value,
                                  })
                                }
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-4 py-3 text-gray-800">
                              <button
                                onClick={() => handleDeleteApplication(app.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </tbody>
                )}
              </Droppable>
            </DragDropContext>
          </table>
          {filteredApplications.length === 0 && (
            <p className="text-gray-500 text-center mt-4">
              No applications found
            </p>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedApplications.length > 0 && (
          <div className="mt-4">
            <button
              onClick={handleBulkEmail}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Send Email to Selected
            </button>
          </div>
        )}
      </div>
    </>
  );
};
  
export default ApplicationManagement;