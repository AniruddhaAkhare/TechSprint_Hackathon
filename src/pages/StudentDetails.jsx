// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
// import { db } from "./components/firebase";
// import AddStudent from "./components/AddStudent";
// import EditStudent from "./components/EditStudent";
// // import SearchBar from "./components/Searchbar";
// import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";

// export default function StudentDetails() {
//     const { adminId } = useParams();
//     const [students, setStudents] = useState([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [searchResults, setSearchResults] = useState([]);
//     const navigate = useNavigate();

//     const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
//     const [isEditStudentOpen, setIsEditStudentOpen] = useState(false);
//     const [studentToEdit, setStudentToEdit] = useState(null);
//     const StudentCollectionRef = collection(db, "student");

//     const [openDelete, setOpenDelete] = useState(false);
//     const [deleteId, setDeleteId] = useState(null);


   

//     const handleSearch = (e) => {
//         if (e) e.preventDefault();
//         if (!searchTerm.trim()) {
//             setSearchResults([]);
//             return;
//         }
//         const searchLower = searchTerm.toLowerCase();
//         const results = students.filter(student => {
//             const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
//             return (
//                 (student.first_name?.toLowerCase() || '').includes(searchLower) ||
//                 (student.last_name?.toLowerCase() || '').includes(searchLower) ||
//                 fullName.includes(searchLower) ||
//                 (student.email?.toLowerCase() || '').includes(searchLower) ||
//                 (student.phone || '').includes(searchTerm)

//             );
//         });
//         setSearchResults(results);
//     };

//     useEffect(() => {
//         if (searchTerm) {
//             handleSearch();
//         } else {
//             setSearchResults([]);
//         }
//     }, [searchTerm]);

//     const fetchStudents = async () => {
//         const snapshot = await getDocs(StudentCollectionRef);
//         const studentData = snapshot.docs.map(doc => ({
//             id: doc.id,
//             ...doc.data(),
//         }));
//         setStudents(studentData);
//     }

//     useEffect(() => {
//         fetchStudents();
//     }, []);

//     const handleOpenDelete = (id) => {
//         setDeleteId(id);
//         setOpenDelete(true);
//     };

//     const handleDelete = async () => {
//         if (deleteId) {
//             try {
                
//                 const studentDoc = doc(db, "student", deleteId);
//                 await deleteDoc(studentDoc);
//                 fetchStudents(); // Refresh the list after deletion
//             } catch (err) {
//                 console.error("Error deleting instructor:", err);
//             }
//         }
//         setOpenDelete(false); // Close modal after deletion
//     };
    
//     // const onDelete = async (studentId) => {
//     //     const confirmDelete = window.confirm("Are you sure you want to delete this student?");
//     //     if (!confirmDelete) return;

//     //     try {
//     //         const enrollmentCollection = collection(db, "enrollment");
//     //         const enrollmentQuery = query(enrollmentCollection, where("student_id", "==", studentId));
//     //         const enrollmentDocs = await getDocs(enrollmentQuery);

//     //         const deletePromises = enrollmentDocs.docs.map(doc => deleteDoc(doc.ref));
//     //         await Promise.all(deletePromises);
//     //         await deleteDoc(doc(db, "student", studentId));

//     //         setStudents(prevStudents => prevStudents.filter(student => student.id !== studentId));
//     //         alert("Student and associated enrollments deleted successfully!");
//     //     } catch (error) {
//     //         console.error("Error deleting student or enrollments:", error);
//     //     }
//     // };


//     <Dialog open={openDelete} handler={() => setOpenDelete(false)}>
//     <DialogHeader>Confirm Deletion</DialogHeader>
//     <DialogBody>Are you sure you want to delete this student? This action cannot be undone.</DialogBody>
//     <DialogFooter>
//         <Button variant="text" color="gray" onClick={() => setOpenDelete(false)}>Cancel</Button>
//         <Button variant="filled" color="red" onClick={handleDelete}>Yes, Delete</Button>
//     </DialogFooter>
// </Dialog>

//     const onEdit = (student) => {
//         setStudentToEdit(student);
//         setIsEditStudentOpen(true);
//         navigate(`/studentdetails/updatestudent/${student.id}`)
//     };

//     const formatDate = (timestamp) => {
//         if (timestamp && timestamp.seconds) {
//             return new Date(timestamp.seconds * 1000).toLocaleDateString();
//         }
//         return timestamp;
//     };

//     return (
//         <div className="container ml-80 p-4">
//             <h1 className="text-2xl font-semibold mb-4">Student Details</h1>
//             <div className="flex space-x-4 mb-4">
//                 <button onClick={() => { navigate('/studentdetails/addstudent') }} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
//                     Add Student
//                 </button>
//             </div>
//             <div className="justify-between items-center p-4 mt-4">
//                 {/* <SearchBar
//                     searchTerm={searchTerm}
//                     setSearchTerm={setSearchTerm}
//                     handleSearch={handleSearch}
//                 /> */}
//                 {/* {searchTerm && (
//                         <div className="mt-2 text-sm text-gray-500">
//                             Showing {searchResults.length} results
//                         </div>
//                     )} */}
//             </div>
//             <div className="overflow-x-auto">
//                 <table className="table-data table">
//                     <thead className="table-secondary">
//                         <tr>
//                             <th>First Name</th>
//                             <th>Last Name</th>
//                             <th>Email</th>
//                             <th>Phone</th>
//                             <th>DOB</th>
//                             <th>Admission Date</th>
//                             <th>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                         {students.length > 0 ? (
//                             <>
//                                 {(searchResults.length > 0 ? searchResults : students).map(student => (
//                                     <tr key={student.id}>
//                                         <td className="cursor-pointer" onClick={() => navigate(`/studentdetails/studentinfo/${student.id}`)}>
//                                             {student.first_name}
//                                         </td>
//                                         <td className="cursor-pointer" onClick={() => navigate(`/studentdetails/studentinfo/${student.id}`)}>
//                                             {student.last_name}
//                                         </td>
//                                         <td className="cursor-pointer" onClick={() => navigate(`/studentdetails/studentinfo/${student.id}`)}>
//                                             {student.email}
//                                         </td>
//                                         <td className="cursor-pointer" onClick={() => navigate(`/studentdetails/studentinfo/${student.id}`)}>
//                                             {student.phone}
//                                         </td>
//                                         <td className="cursor-pointer" onClick={() => navigate(`/studentdetails/studentinfo/${student.id}`)}>
//                                             {formatDate(student.date_of_birth)}
//                                         </td>
//                                         <td className="cursor-pointer" onClick={() => navigate(`/studentdetails/studentinfo/${student.id}`)}>
//                                             {formatDate(student.admission_date)}
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
//                                             <button onClick={() => handleDelete(student.id)} className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Delete</button>
//                                             {/* <button
//                                                 onClick={(student) => handleOpen(student)}
//                                                 className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
//                                             >
//                                                 Delete
//                                             </button> */}
//                                             <button onClick={() => onEdit(student)} className="ml-2 btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Update</button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                                 {searchResults.length === 0 && searchTerm && (
//                                     <tr>
//                                         <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No students found for this search.</td>
//                                     </tr>
//                                 )}
//                             </>
//                         ) : (
//                             <tr>
//                                 <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No students found.</td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//             {isAddStudentOpen && (<AddStudent />)}
//             {isEditStudentOpen && studentToEdit && (<EditStudent />)}

          
//         </div>
//     );
// }


// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
// import { db } from "./components/firebase";
// import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";

// export default function StudentDetails() {
//     const { adminId } = useParams();
//     const [students, setStudents] = useState([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [searchResults, setSearchResults] = useState([]);
//     const navigate = useNavigate();

//     const [openDelete, setOpenDelete] = useState(false);
//     const [deleteId, setDeleteId] = useState(null);

//     useEffect(() => {
//         fetchStudents();
//     }, []);

//     const fetchStudents = async () => {
//         const snapshot = await getDocs(collection(db, "student"));
//         const studentData = snapshot.docs.map(doc => ({
//             id: doc.id,
//             ...doc.data(),
//         }));
//         setStudents(studentData);
//     };

//     const handleOpenDelete = (id) => {
//         setDeleteId(id);
//         setOpenDelete(true);
//     };

//     const handleDelete = async () => {
//         if (deleteId) {
//             try {
//                 await deleteDoc(doc(db, "student", deleteId));
//                 fetchStudents(); // Refresh the list
//             } catch (err) {
//                 console.error("Error deleting student:", err);
//             }
//         }
//         setOpenDelete(false);
//     };

//     const formatDate = (timestamp) => {
//         if (timestamp && timestamp.seconds) {
//             return new Date(timestamp.seconds * 1000).toLocaleDateString();
//         }
//         return timestamp;
//     };

//     return (

//         <div className="container ml-80 p-4">
//         {/* //             <h1 className="text-2xl font-semibold mb-4">Student Details</h1> */}


//         <div className="container mx-auto p-6">
//                 <div className="flex space-x-4 mb-4">
//             <h1 className="text-2xl font-bold mb-4 text-gray-800">Student Details</h1>
            
//             <button 
//                 onClick={() => navigate('/studentdetails/addstudent')}
//                 className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300"
//             >
//                 Add Student
//             </button>
//             </div>

//             <div className="overflow-x-auto mt-6">
//                 <table className="table-auto w-full border-collapse border border-gray-300 shadow-md">
//                     <thead className="bg-gray-100">
//                         <tr>
//                             <th className="border border-gray-300 px-4 py-2">First Name</th>
//                             <th className="border border-gray-300 px-4 py-2">Last Name</th>
//                             <th className="border border-gray-300 px-4 py-2">Email</th>
//                             <th className="border border-gray-300 px-4 py-2">Phone</th>
//                             <th className="border border-gray-300 px-4 py-2">DOB</th>
//                             <th className="border border-gray-300 px-4 py-2">Admission Date</th>
//                             <th className="border border-gray-300 px-4 py-2">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody className="bg-white">
//                         {students.length > 0 ? (
//                             students.map(student => (
//                                 <tr key={student.id} className="hover:bg-gray-50">
//                                     <td className="border border-gray-300 px-4 py-2 cursor-pointer" onClick={() => navigate(`/studentdetails/studentinfo/${student.id}`)}>
//                                         {student.first_name}
//                                     </td>
//                                     <td className="border border-gray-300 px-4 py-2">{student.last_name}</td>
//                                     <td className="border border-gray-300 px-4 py-2">{student.email}</td>
//                                     <td className="border border-gray-300 px-4 py-2">{student.phone}</td>
//                                     <td className="border border-gray-300 px-4 py-2">{formatDate(student.date_of_birth)}</td>
//                                     <td className="border border-gray-300 px-4 py-2">{formatDate(student.admission_date)}</td>
//                                     <td className="border border-gray-300 px-4 py-2 flex space-x-2">
//                                         <button 
//                                             onClick={() => handleOpenDelete(student.id)}
//                                             className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md transition duration-300"
//                                         >
//                                             Delete
//                                         </button>
//                                         <button 
//                                             onClick={() => navigate(`/studentdetails/updatestudent/${student.id}`)}
//                                             className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md transition duration-300"
//                                         >
//                                             Update
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan="7" className="text-center py-4 text-gray-500">
//                                     No students found.
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//             </div>

//             {/* Delete Confirmation Modal */}
//             <Dialog open={openDelete} handler={() => setOpenDelete(false)}>
//                 <DialogHeader>Confirm Deletion</DialogHeader>
//                 <DialogBody>
//                     Are you sure you want to delete this student? This action cannot be undone.
//                 </DialogBody>
//                 <DialogFooter>
//                     <Button variant="text" color="gray" onClick={() => setOpenDelete(false)}>Cancel</Button>
//                     <Button variant="filled" color="red" onClick={handleDelete}>Yes, Delete</Button>
//                 </DialogFooter>
//             </Dialog>
//         </div>
//     );
// }


// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { collection, getDocs, deleteDoc, doc, writeBatch, serverTimestamp, arrayUnion } from "firebase/firestore";
// import { db } from "./components/firebase";
// import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";


// export default function StudentDetails() {
//     const { adminId } = useParams();
//     const [students, setStudents] = useState([]);
//     const [course, setCourse] = useState([]);
//     const [selectedStudents, setSelectedStudents] = useState([]);
//     const [selectedCourse, setSelectedCourse] = useState([]);
//     const [openDelete, setOpenDelete] = useState(false);
//     const [deleteId, setDeleteId] = useState(null);
//     const navigate = useNavigate();

//     useEffect(() => {
//         fetchStudents();
//         fetchCourse();
//     }, []);

//     const fetchStudents = async () => {
//         const snapshot = await getDocs(collection(db, "student"));
//         setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//     };

//     const fetchCourse = async () => {
//         const snapshot = await getDocs(collection(db, "Course"));
//         setCourse(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//     };

//     const handleStudentSelect = (id) => {
//         setSelectedStudents(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
//     };

//     const handleCourseSelect = (id) => {
//         setSelectedCourse(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
//     };

//     // const handleBulkEnrollment = async () => {
//     //     if (selectedStudents.length === 0 || selectedCourse.length === 0) {
//     //         alert("Please select at least one student and one course.");
//     //         return;
//     //     }

//     //     try {
//     //         const batch = writeBatch(db);
            
//     //         // Create enrollment records
//     //         const enrollmentPromises = selectedStudents.flatMap(studentId => 
//     //             selectedCourse.map(async courseId => {
//     //                 const enrollmentRef = doc(collection(db, "enrollment"));
//     //                 // Find the student and course details
//     //                 const student = students.find(s => s.id === studentId);
//     //                 const courseDetails = course.find(c => c.id === courseId);
                    
//     //                 // Update student document with course details
//     //                 const studentRef = doc(db, "student", studentId);
//     //                 const enrollmentTimestamp = serverTimestamp();
//     //                 batch.update(studentRef, {
//     //                     course_details: arrayUnion({
//     //                         courseId: courseId,
//     //                         courseName: courseDetails.name,
//     //                         enrolledAt: enrollmentTimestamp
//     //                     })
//     //                 });

//     //                 // Create enrollment record
//     //                 batch.set(enrollmentRef, {
//     //                     studentId,
//     //                     studentName: `${student.first_name} ${student.last_name}`,
//     //                     studentEmail: student.email,
//     //                     courseId,
//     //                     courseName: courseDetails.name,
//     //                     enrolledAt: serverTimestamp(),
//     //                     status: 'active',
//     //                     lastUpdated: serverTimestamp()
//     //                 });
//     //             })
//     //         );

//     //         // Execute batch write
//     //         await Promise.all(enrollmentPromises);
//     //         await batch.commit();
            
//     //         // Refresh data and show success
//     //         await fetchStudents();
//     //         alert(`${selectedStudents.length} students enrolled in ${selectedCourse.length} courses successfully!`);
            
//     //         // Reset selections
//     //         setSelectedStudents([]);
//     //         setSelectedCourse([]);
//     //     } catch (error) {
//     //         console.error("Error enrolling students:", error);
//     //         alert("Failed to enroll students. Please try again.");
//     //     }
//     // };

//     const handleBulkEnrollment = async () => {
//         if (selectedStudents.length === 0 || selectedCourse.length === 0) {
//             alert("Please select at least one student and one course.");
            
//             return;
//         }
    
//         try {
//             const batch = writeBatch(db);
//             const enrollmentTimestamp = new Date(); // Generate timestamp manually
    
//             selectedStudents.forEach(studentId => {
//                 selectedCourse.forEach(courseId => {
//                     const enrollmentRef = doc(collection(db, "enrollment"));
    
//                     // Find student and course details
//                     const student = students.find(s => s.id === studentId);
//                     const courseDetails = course.find(c => c.id === courseId);
    
//                     if (!student || !courseDetails) {
//                         console.error("Invalid student or course selection");
//                         return;
//                     }
    
//                     // Update student document with course details
//                     const studentRef = doc(db, "student", studentId);
//                     batch.update(studentRef, {
//                         course_details: arrayUnion({
//                             courseId: courseId,
//                             courseName: courseDetails.name,
//                             enrolledAt: enrollmentTimestamp, // Use manually created timestamp
//                         })
//                     });
    
//                     // Create enrollment record
//                     batch.set(enrollmentRef, {
//                         studentId,
//                         studentName: `${student.first_name} ${student.last_name}`,
//                         studentEmail: student.email,
//                         courseId,
//                         courseName: courseDetails.name,
//                         enrolledAt: enrollmentTimestamp,
//                         status: 'active',
//                         lastUpdated: enrollmentTimestamp
//                     });
//                 });
//             });
    
//             // Execute batch write
//             await batch.commit();
    
//             // Refresh student data and show success
//             await fetchStudents();
//             // alert(`${selectedStudents.length} students enrolled in ${selectedCourse.length} courses successfully!`);
//             toast.success(`${selectedStudents.length} students enrolled in ${selectedCourse.length} courses successfully!`);
// <ToastContainer position="top-right" autoClose={3000} />

//             // Reset selections
//             setSelectedStudents([]);
//             setSelectedCourse([]);
//         } catch (error) {
//             console.error("Error enrolling students:", error);
//             alert("Failed to enroll students. Please try again.");
//         }
//     };

//     return (
//         <div className="container ml-80 p-4">
//             <h1 className="text-2xl font-bold mb-4">Student Details</h1>
//             <button onClick={() => navigate('/studentdetails/addstudent')} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
//                 Add Student
//             </button>
//             <div className="overflow-x-auto mt-6">
//                 <table className="table-auto w-full border-collapse border border-gray-300">
//                     <thead>
//                         <tr>
//                             <th>Select</th>
//                             <th>First Name</th>
//                             <th>Last Name</th>
//                             <th>Email</th>
//                             <th>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {students.map(student => (
//                             <tr key={student.id}>
//                                 <td>
//                                     <input type="checkbox" onChange={() => handleStudentSelect(student.id)} />
//                                 </td>
//                                 <td>{student.first_name}</td>
//                                 <td>{student.last_name}</td>
//                                 <td>{student.email}</td>
//                                 <td>
//                                     <button onClick={() => handleOpenDelete(student.id)} className="bg-red-500 text-white px-3 py-1">Delete</button>
//                                     <button onClick={() => navigate(`/studentdetails/updatestudent/${student.id}`)} className="bg-blue-500 text-white px-3 py-1">Update</button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//             <h2 className="text-xl font-bold mt-6">Select Courses</h2>
//             <div>
//                 {course.map(course => (
//                     <label key={course.id} className="block">
//                         <input type="checkbox" onChange={() => handleCourseSelect(course.id)} /> {course.name}
//                     </label>
//                 ))}
//             </div>
//             <button 
//                 onClick={handleBulkEnrollment} 
//                 className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 mt-4 rounded-md transition duration-300"
//                 disabled={selectedStudents.length === 0 || selectedCourse.length === 0}
//             >
//                 Enroll Selected Students ({selectedStudents.length} students, {selectedCourse.length} courses)
//             </button>
//         </div>
//     );
// }


// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { collection, getDocs, doc, writeBatch, serverTimestamp, arrayUnion } from "firebase/firestore";
// import { db } from "./components/firebase";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function StudentDetails() {
//     const { adminId } = useParams();
//     const [students, setStudents] = useState([]);
//     const [course, setCourse] = useState([]);
//     const [selectedStudents, setSelectedStudents] = useState([]);
//     const [selectedCourse, setSelectedCourse] = useState([]);
//     const navigate = useNavigate();

//     useEffect(() => {
//         fetchStudents();
//         fetchCourse();
//     }, []);

//     const fetchStudents = async () => {
//         const snapshot = await getDocs(collection(db, "student"));
//         setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//     };

//     const fetchCourse = async () => {
//         const snapshot = await getDocs(collection(db, "Course"));
//         setCourse(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//     };

//     const handleStudentSelect = (id) => {
//         setSelectedStudents(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
//     };

//     const handleCourseSelect = (id) => {
//         setSelectedCourse(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
//     };

//     const handleBulkEnrollment = async () => {
//         if (selectedStudents.length === 0 || selectedCourse.length === 0) {
//             toast.error("Please select at least one student and one course.");
//             return;
//         }

//         try {
//             const batch = writeBatch(db);
//             const enrollmentTimestamp = new Date(); // Generate timestamp manually

//             selectedStudents.forEach(studentId => {
//                 selectedCourse.forEach(courseId => {
//                     const enrollmentRef = doc(collection(db, "enrollment"));

//                     // Find student and course details
//                     const student = students.find(s => s.id === studentId);
//                     const courseDetails = course.find(c => c.id === courseId);

//                     if (!student || !courseDetails) {
//                         console.error("Invalid student or course selection");
//                         return;
//                     }

//                     // Update student document with course details
//                     const studentRef = doc(db, "student", studentId);
//                     batch.update(studentRef, {
//                         course_details: arrayUnion({
//                             courseId: courseId,
//                             courseName: courseDetails.name,
//                             enrolledAt: enrollmentTimestamp, // Use manually created timestamp
//                         })
//                     });

//                     // Create enrollment record
//                     batch.set(enrollmentRef, {
//                         studentId,
//                         studentName: `${student.first_name} ${student.last_name}`,
//                         studentEmail: student.email,
//                         courseId,
//                         courseName: courseDetails.name,
//                         enrolledAt: enrollmentTimestamp,
//                         status: 'active',
//                         lastUpdated: enrollmentTimestamp
//                     });
//                 });
//             });

//             // Execute batch write
//             await batch.commit();

//             // Refresh student data and show success
//             await fetchStudents();
//             toast.success(`${selectedStudents.length} students enrolled in ${selectedCourse.length} courses successfully!`);

//             // Reset selections
//             setSelectedStudents([]);
//             setSelectedCourse([]);
//         } catch (error) {
//             console.error("Error enrolling students:", error);
//             toast.error("Failed to enroll students. Please try again.");
//         }
//     };

//     return (
//         <div className="container ml-80 p-4">
//             <ToastContainer position="top-right" autoClose={3000} />
//             <h1 className="text-2xl font-bold mb-4">Student Details</h1>
//             <button onClick={() => navigate('/studentdetails/addstudent')} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
//                 Add Student
//             </button>
//             <div className="overflow-x-auto mt-6">
//                 <table className="table-auto w-full border-collapse border border-gray-300">
//                     <thead>
//                         <tr>
//                             <th>Select</th>
//                             <th>First Name</th>
//                             <th>Last Name</th>
//                             <th>Email</th>
//                             <th>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {students.map(student => (
//                             <tr key={student.id}>
//                                 <td>
//                                     <input type="checkbox" onChange={() => handleStudentSelect(student.id)} />
//                                 </td>
//                                 <td>{student.first_name}</td>
//                                 <td>{student.last_name}</td>
//                                 <td>{student.email}</td>
//                                 <td>
//                                     <button className="bg-red-500 text-white px-3 py-1">Delete</button>
//                                     <button onClick={() => navigate(`/studentdetails/updatestudent/${student.id}`)} className="bg-blue-500 text-white px-3 py-1">Update</button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//             <h2 className="text-xl font-bold mt-6">Select Courses</h2>
//             <div>
//                 {course.map(course => (
//                     <label key={course.id} className="block">
//                         <input type="checkbox" onChange={() => handleCourseSelect(course.id)} /> {course.name}
//                     </label>
//                 ))}
//             </div>
//             <button 
//                 onClick={handleBulkEnrollment} 
//                 className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 mt-4 rounded-md transition duration-300"
//                 disabled={selectedStudents.length === 0 || selectedCourse.length === 0}
//             >
//                 Enroll Selected Students ({selectedStudents.length} students, {selectedCourse.length} courses)
//             </button>
//         </div>
//     );
// }


import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, getDocs, doc, writeBatch, arrayUnion } from "firebase/firestore";
import { db } from "./components/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function StudentDetails() {
    const { adminId } = useParams();
    const [students, setStudents] = useState([]);
    const [course, setCourse] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStudents();
        fetchCourse();
    }, []);

    const fetchStudents = async () => {
        const snapshot = await getDocs(collection(db, "student"));
        setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const fetchCourse = async () => {
        const snapshot = await getDocs(collection(db, "Course"));
        setCourse(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const handleStudentSelect = (id) => {
        setSelectedStudents(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    };

    const handleCourseSelect = (id) => {
        setSelectedCourse(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
    };

    const handleBulkEnrollment = async () => {
        if (selectedStudents.length === 0 || selectedCourse.length === 0) {
            toast.error("Please select at least one student and one course.");
            return;
        }

        try {
            const batch = writeBatch(db);
            let studentsSkipped = 0;

            for (const studentId of selectedStudents) {
                const student = students.find(s => s.id === studentId);
                if (!student) continue;

                const existingCourses = student.course_details ? student.course_details.map(c => c.courseId) : [];
                const newCourses = selectedCourse.filter(courseId => !existingCourses.includes(courseId));

                if (newCourses.length === 0) {
                    studentsSkipped++;
                    continue;
                }

                for (const courseId of newCourses) {
                    const enrollmentRef = doc(collection(db, "enrollment"));
                    const courseDetails = course.find(c => c.id === courseId);
                    if (!courseDetails) continue;

                    const studentRef = doc(db, "student", studentId);
                    batch.update(studentRef, {
                        course_details: arrayUnion({
                            courseId: courseId,
                            courseName: courseDetails.name,
                            enrolledAt: new Date(),
                        })
                    });

                    batch.set(enrollmentRef, {
                        studentId,
                        studentName: `${student.first_name} ${student.last_name}`,
                        studentEmail: student.email,
                        courseId,
                        courseName: courseDetails.name,
                        enrolledAt: new Date(),
                        status: 'active',
                        lastUpdated: new Date(),
                    });
                }
            }

            await batch.commit();
            await fetchStudents();

            if (studentsSkipped > 0) {
                toast.warn(`${studentsSkipped} students were already enrolled in the selected courses.`);
            }

            toast.success(`${selectedStudents.length - studentsSkipped} students enrolled successfully!`);

            setSelectedStudents([]);
            setSelectedCourse([]);
        } catch (error) {
            console.error("Error enrolling students:", error);
            toast.error("Failed to enroll students. Please try again.");
        }
    };

    return (
        <div className="container ml-80 p-4">
            <ToastContainer position="top-right" autoClose={3000} />
            <h1 className="text-2xl font-bold mb-4">Student Details</h1>
            <button onClick={() => navigate('/studentdetails/addstudent')} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
                Add Student
            </button>
            <div className="overflow-x-auto mt-6">
                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th>Select</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student.id}>
                                <td>
                                    <input type="checkbox" onChange={() => handleStudentSelect(student.id)} />
                                </td>
                                <td>{student.first_name}</td>
                                <td>{student.last_name}</td>
                                <td>{student.email}</td>
                                <td>
                                    <button className="bg-red-500 text-white px-3 py-1">Delete</button>
                                    <button onClick={() => navigate(`/studentdetails/updatestudent/${student.id}`)} className="bg-blue-500 text-white px-3 py-1">Update</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <h2 className="text-xl font-bold mt-6">Select Courses</h2>
            <div>
                {course.map(course => (
                    <label key={course.id} className="block">
                        <input type="checkbox" onChange={() => handleCourseSelect(course.id)} /> {course.name}
                    </label>
                ))}
            </div>
            <button 
                onClick={handleBulkEnrollment} 
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 mt-4 rounded-md transition duration-300"
                disabled={selectedStudents.length === 0 || selectedCourse.length === 0}
            >
                Enroll Selected Students ({selectedStudents.length} students, {selectedCourse.length} courses)
            </button>
        </div>
    );
}
