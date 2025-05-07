// import { useState, useEffect, useCallback } from "react";
// import { db } from '../../../../config/firebase';
// import { getDocs, collection, deleteDoc, doc, query, orderBy, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
// import CreateCourses from "./CreateCourses";
// import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";
// import LearnerList from "./LearnerList";
// import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
// import { useAuth } from '../../../../context/AuthContext';

// export default function Courses() {
//   const { user, rolePermissions } = useAuth();
//   const [currentCourse, setCurrentCourse] = useState(null);
//   const [courses, setCourses] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const [openDelete, setOpenDelete] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);
//   const [deleteMessage, setDeleteMessage] = useState("Are you sure you want to delete this course? This action cannot be undone.");
//   const [openLearnersDialog, setOpenLearnersDialog] = useState(false);
//   const [selectedCourseId, setSelectedCourseId] = useState(null);
//   const [statusFilter, setStatusFilter] = useState("Active");
//   const [openLogsDialog, setOpenLogsDialog] = useState(false);
//   const [logs, setLogs] = useState([]);

//   console.log("User:", user);
//   console.log("Role Permissions:", rolePermissions);

//   // Permission checks for 'Course' section (capitalized to match DB name)
//   const canCreate = rolePermissions?.Course?.create || false;
//   const canUpdate = rolePermissions?.Course?.update || false;
//   const canDelete = rolePermissions?.Course?.delete || false;
//   const canDisplay = rolePermissions?.Course?.display || false;
//   const isAdmin = rolePermissions?.role === 'Admin';

//   console.log("Permissions - Create:", canCreate, "Update:", canUpdate, "Delete:", canDelete, "Display:", canDisplay, "Admin:", isAdmin);

//   const CourseCollectionRef = collection(db, "Course");
//   const StudentCollectionRef = collection(db, "student");
//   const EnrollmentsCollectionRef = collection(db, "enrollments");
//   const LogsCollectionRef = collection(db, "activityLogs");

//   const toggleSidebar = () => setIsOpen(prev => !prev);

//   const handleLearnersClick = (courseId) => {
//     setSelectedCourseId(courseId);
//     setOpenLearnersDialog(true);
//   };

//   const logActivity = async (action, details) => {
//     if (!user) return;
//     try {
//       await addDoc(LogsCollectionRef, {
//         timestamp: serverTimestamp(),
//         userId: user.uid,
//         userEmail: user.email,
//         action,
//         details
//       });
//       console.log("Activity logged:", action);
//     } catch (err) {
//       console.error("Error logging activity:", err);
//     }
//   };

//   const fetchLogs = useCallback(() => {
//     if (!isAdmin) return;
//     const logsQuery = query(LogsCollectionRef, orderBy('timestamp', 'desc'));
//     const unsubscribe = onSnapshot(logsQuery, (snapshot) => {
//       const logsData = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//       setLogs(logsData);
//     }, (err) => console.error("Logs fetch error:", err));
//     return unsubscribe;
//   }, [isAdmin]);

//   const fetchStudents = useCallback(async () => {
//     if (!canDisplay) return;
//     try {
//       const snapshot = await getDocs(StudentCollectionRef);
//       const studentData = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setStudents(studentData);
//     } catch (err) {
//       console.error("Error fetching students:", err);
//     }
//   }, [canDisplay]);

//   const fetchCourses = useCallback(async () => {
//     if (!canDisplay) return;
//     try {
//       const q = query(CourseCollectionRef, orderBy('createdAt', 'asc'));
//       const snapshot = await getDocs(q);
//       const courseData = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data(),
//         status: doc.data().status || "Active",
//       }));

//       let filteredCourses = statusFilter === "All" ? courseData : courseData.filter(course => course.status === statusFilter);
//       setCourses(filteredCourses);
//       setSearchResults(filteredCourses);
//     } catch (err) {
//       console.error("Error fetching courses:", err.message);
//     }
//   }, [canDisplay, statusFilter]);

//   const handleSearch = useCallback((term) => {
//     if (!term.trim()) {
//       setSearchResults(courses);
//       return;
//     }
//     const results = courses.filter(course => 
//       course.name?.toLowerCase().includes(term.toLowerCase())
//     );
//     setSearchResults(results);
//   }, [courses]);

//   useEffect(() => {
//     fetchCourses();
//     fetchStudents();
//     if (isAdmin) fetchLogs();
//   }, [fetchCourses, fetchStudents, fetchLogs]);

//   useEffect(() => {
//     handleSearch(searchTerm);
//   }, [searchTerm, handleSearch]);

//   const handleCreateCourseClick = () => {
//     if (!canCreate) {
//       alert("You do not have permission to create courses.");
//       return;
//     }
//     setCurrentCourse(null);
//     toggleSidebar();
//   };

//   const handleEditClick = (course) => {
//     if (!canUpdate) {
//       alert("You do not have permission to update courses.");
//       return;
//     }
//     setCurrentCourse(course);
//     setIsOpen(true);
//   };

//   const handleClose = () => {
//     setIsOpen(false);
//     setCurrentCourse(null);
//     fetchCourses();
//   };

//   const checkStudentsInCourse = async (courseId) => {
//     try {
//       const enrollmentSnapshot = await getDocs(EnrollmentsCollectionRef);
//       const allEnrollments = enrollmentSnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));

//       const hasStudents = allEnrollments.some(enrollment => 
//         (enrollment.courses || []).some(course => 
//           course.selectedCourse?.id === courseId
//         )
//       );
//       return hasStudents;
//     } catch (err) {
//       console.error("Error checking students in course:", err);
//       return false;
//     }
//   };

//   const deleteCourse = async () => {
//     if (!deleteId || !canDelete) {
//       if (!canDelete) alert("You do not have permission to delete courses.");
//       return;
//     }
//     try {
//       const hasStudents = await checkStudentsInCourse(deleteId);
//       if (hasStudents) {
//         setDeleteMessage("This course cannot be deleted because students are enrolled in it.");
//         return;
//       }
//       const courseRef = doc(db, "Course", deleteId);
//       const courseSnapshot = await getDocs(query(CourseCollectionRef));
//       const courseData = courseSnapshot.docs.find(doc => doc.id === deleteId)?.data() || {};
//       await deleteDoc(courseRef);
//       await logActivity("Deleted course", { courseId: deleteId, name: courseData.name || 'Unknown' });
//       await fetchCourses();
//       setOpenDelete(false);
//       setDeleteMessage("Are you sure you want to delete this course? This action cannot be undone.");
//     } catch (err) {
//       console.error("Error deleting course:", err.message);
//       setDeleteMessage("An error occurred while trying to delete the course.");
//     }
//   };

//   const getStudentNamesForCourse = async (courseId) => {
//     try {
//       const enrollmentSnapshot = await getDocs(EnrollmentsCollectionRef);
//       const allEnrollments = enrollmentSnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));

//       const matchedEnrollments = allEnrollments.filter(enrollment => 
//         (enrollment.courses || []).some(course => 
//           course.selectedCourse?.id === courseId
//         )
//       );

//       const studentSnapshot = await getDocs(StudentCollectionRef);
//       const allStudents = studentSnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));

//       const studentNames = matchedEnrollments.map(enrollment => {
//         const student = allStudents.find(s => s.id === enrollment.id);
//         return `${student?.first_name || student?.f_name || 'Unknown'} ${student?.last_name || student?.l_name || ''}`.trim();
//       });

//       return studentNames.join(', ') || 'None';
//     } catch (err) {
//       console.error("Error fetching student names:", err);
//       return 'None';
//     }
//   };

//   if (!canDisplay) {
//     return (
//       <div className="p-4 text-red-600 text-center">
//         Access Denied: You do not have permission to view courses.
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col w-full min-h-screen bg-gray-50 p-2">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-semibold text-gray-800">Courses</h1>
//         <div className="flex space-x-4">
//           {isAdmin && (
//             <button
//               type="button"
//               className="bg-gray-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-700"
//               onClick={() => setOpenLogsDialog(true)}
//             >
//               View Logs
//             </button>
//           )}
//           {canCreate && (
//             <button
//               type="button"
//               className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700"
//               onClick={handleCreateCourseClick}
//             >
//               + Create Course
//             </button>
//           )}
//         </div>
//       </div>

//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <div className="mb-6 flex items-center space-x-4">
//           <input
//             type="text"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             placeholder="Search courses by name..."
//             className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <FormControl sx={{ minWidth: 200 }} size="small">
//             <InputLabel id="status-filter-label">Filter by Status</InputLabel>
//             <Select
//               labelId="status-filter-label"
//               value={statusFilter}
//               label="Filter by Status"
//               onChange={(e) => setStatusFilter(e.target.value)}
//             >
//               <MenuItem value="All">All Courses</MenuItem>
//               <MenuItem value="Active">Active Courses</MenuItem>
//               <MenuItem value="Inactive">Inactive Courses</MenuItem>
//             </Select>
//           </FormControl>
//         </div>

//         <div className="rounded-lg shadow-md overflow-x-auto">
//           <table className="w-full table-auto">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Sr No</th>
//                 <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Course Name</th>
//                 <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Fee (₹)</th>
//                 <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Duration</th>
//                 <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Mode</th>
//                 <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Status</th>
//                 <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {(searchResults.length > 0 || searchTerm.trim() ? searchResults : courses).length > 0 ? (
//                 (searchResults.length > 0 || searchTerm.trim() ? searchResults : courses).map((course, index) => (
//                   <tr key={course.id} className="border-b hover:bg-gray-50">
//                     <td className="px-4 py-3 text-gray-600">{index + 1}</td>
//                     <td className="px-4 py-3 text-gray-800">{course.name || 'N/A'}</td>
//                     <td className="px-4 py-3 text-gray-600">{course.fee || 'N/A'}</td>
//                     <td className="px-4 py-3 text-gray-600">{course.duration || 'N/A'}</td>
//                     <td className="px-4 py-3 text-gray-600">{course.mode || 'N/A'}</td>
//                     <td className="px-4 py-3 text-gray-600">{course.status || 'Active'}</td>
//                     <td className="px-4 py-3">
//                       <FormControl size="small">
//                         <Select
//                           value=""
//                           onChange={(e) => {
//                             const action = e.target.value;
//                             if (action === 'delete' && canDelete) {
//                               setDeleteId(course.id);
//                               setOpenDelete(true);
//                               setDeleteMessage("Are you sure you want to delete this course? This action cannot be undone.");
//                             } else if (action === 'update' && canUpdate) {
//                               handleEditClick(course);
//                             } else if (action === 'learners') {
//                               handleLearnersClick(course.id);
//                             }
//                           }}
//                           displayEmpty
//                           renderValue={() => "Actions"}
//                           disabled={!canUpdate && !canDelete}
//                         >
//                           <MenuItem value="" disabled>Actions</MenuItem>
//                           {canUpdate && <MenuItem value="update">Update</MenuItem>}
//                           {canDelete && <MenuItem value="delete">Delete</MenuItem>}
//                           <MenuItem value="learners">Learners</MenuItem>
//                         </Select>
//                       </FormControl>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="7" className="px-4 py-3 text-center text-gray-600">
//                     No courses found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {isOpen && canCreate && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40"
//           onClick={handleClose}
//         />
//       )}

//       {canCreate && (
//         <div
//           className={`fixed top-0 right-0 h-full w-1/3 bg-white shadow-lg transform transition-transform duration-300 ${
//             isOpen ? "translate-x-0" : "translate-x-full"
//           } z-50 overflow-y-auto`}
//         >
//           <CreateCourses 
//             isOpen={isOpen} 
//             toggleSidebar={handleClose} 
//             course={currentCourse} 
//           />
//         </div>
//       )}

//       {canDelete && (
//         <Dialog
//           open={openDelete}
//           handler={() => setOpenDelete(false)}
//           className="rounded-lg shadow-lg"
//         >
//           <DialogHeader className="text-gray-800 font-semibold">Confirm Deletion</DialogHeader>
//           <DialogBody className="text-gray-600">{deleteMessage}</DialogBody>
//           <DialogFooter className="space-x-4">
//             <Button
//               variant="text"
//               color="gray"
//               onClick={() => setOpenDelete(false)}
//             >
//               Cancel
//             </Button>
//             {deleteMessage === "Are you sure you want to delete this course? This action cannot be undone." && (
//               <Button
//                 variant="filled"
//                 color="red"
//                 onClick={deleteCourse}
//               >
//                 Yes, Delete
//               </Button>
//             )}
//           </DialogFooter>
//         </Dialog>
//       )}

//       <LearnerList
//         courseId={selectedCourseId}
//         open={openLearnersDialog}
//         onClose={() => setOpenLearnersDialog(false)}
//       />

// {isAdmin && (
//         <Dialog
//           open={openLogsDialog}
//           handler={() => setOpenLogsDialog(false)}
//           className="rounded-lg shadow-lg max-w-4xl"
//         >
//           <DialogHeader className="text-gray-800 font-semibold">Activity Logs</DialogHeader>
//           <DialogBody className="text-gray-600 max-h-96 overflow-y-auto">
//             {logs.length > 0 ? (
//               <table className="w-full table-auto">
//                 <thead>
//                   <tr>
//                     <th className="px-2 py-1 text-left">Timestamp</th>
//                     <th className="px-2 py-1 text-left">User</th>
//                     <th className="px-2 py-1 text-left">Action</th>
//                     <th className="px-2 py-1 text-left">Details</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {logs.map(log => (
//                     <tr key={log.id} className="border-b">
//                       <td className="px-2 py-1">{log.timestamp ? new Date(log.timestamp.toDate()).toLocaleString() : 'N/A'}</td>
//                       <td className="px-2 py-1">{log.userEmail}</td>
//                       <td className="px-2 py-1">{log.action}</td>
//                       <td className="px-2 py-1">{JSON.stringify(log.details)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <p>No logs available.</p>
//             )}
//           </DialogBody>
//           <DialogFooter>
//             <Button
//               variant="text"
//               color="gray"
//               onClick={() => setOpenLogsDialog(false)}
//             >
//               Close
//             </Button>
//           </DialogFooter>
//         </Dialog>
//       )}
//     </div>
//   );
// }










import { useState, useEffect, useCallback } from "react";
import { db } from '../../../../config/firebase';
import { getDocs, collection, deleteDoc, doc, query, orderBy, addDoc, serverTimestamp, onSnapshot, updateDoc, increment, arrayUnion } from 'firebase/firestore';
import CreateCourses from "./CreateCourses";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";
import LearnerList from "./LearnerList";
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useAuth } from '../../../../context/AuthContext';
import debounce from 'lodash/debounce';

export default function Courses() {
  const { user, rolePermissions } = useAuth();
  const [currentCourse, setCurrentCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [centers, setCenters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("Are you sure you want to delete this course? This action cannot be undone.");
  const [openLearnersDialog, setOpenLearnersDialog] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [modeFilter, setModeFilter] = useState("All");
  const [centerFilter, setCenterFilter] = useState("All");
  const [openLogsDialog, setOpenLogsDialog] = useState(false);
  const [logs, setLogs] = useState([]);

  const canCreate = rolePermissions?.Course?.create || false;
  const canUpdate = rolePermissions?.Course?.update || false;
  const canDelete = rolePermissions?.Course?.delete || false;
  const canDisplay = rolePermissions?.Course?.display || false;
  const isAdmin = rolePermissions?.role === 'Admin';

  const CourseCollectionRef = collection(db, "Course");
  const EnrollmentsCollectionRef = collection(db, "enrollments");
  const LogsCollectionRef = collection(db, "activityLogs");
  const instituteId = "9z6G6BLzfDScI0mzMOlB";
  const CenterCollectionRef = collection(db, "instituteSetup", instituteId, "Center");
  console.log("CollectionRef", CenterCollectionRef);

  const toggleSidebar = () => setIsOpen(prev => !prev);

  const handleLearnersClick = (courseId) => {
    setSelectedCourseId(courseId);
    setOpenLearnersDialog(true);
  };

  const logActivity = async (action, details) => {
    if (!user) return;
    try {
      const logDocRef = doc(db, "activityLogs", "currentLog");
      const logEntry = {
        timestamp: serverTimestamp(),
        userId: user.uid,
        userEmail: user.email,
        action,
        details
      };
      await updateDoc(logDocRef, {
        logs: arrayUnion(logEntry),
        count: increment(1)
      }).catch(async (err) => {
        if (err.code === 'not-found') {
          await setDoc(logDocRef, { logs: [logEntry], count: 1 });
        } else {
          throw err;
        }
      });
    } catch (err) {
      console.error("Error logging activity:", err.message);
    }
  };

  const fetchLogs = useCallback(() => {
    if (!isAdmin) return;
    const q = query(LogsCollectionRef, orderBy('timestamp', 'desc'), limit(100));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allLogs = [];
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        (data.logs || []).forEach(log => {
          allLogs.push({ id: doc.id, ...log });
        });
      });
      allLogs.sort((a, b) => (b.timestamp?.toDate() || new Date(0)) - (a.timestamp?.toDate() || new Date(0)));
      setLogs(allLogs);
    }, (err) => console.error("Error fetching logs:", err.message));
    return unsubscribe;
  }, [isAdmin]);

  const fetchCenters = useCallback(async () => {
    if (!canDisplay) return [];
    const snapshot = await getDocs(CenterCollectionRef);
    const centerData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setCenters(centerData);
    return centerData;
  }, [canDisplay]);

  const fetchCourses = useCallback(() => {
    if (!canDisplay) return;
    const q = query(CourseCollectionRef, orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const courseData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        status: doc.data().status || "Active",
        mode: doc.data().mode || "Online",
        centerIds: doc.data().centerIds ? (Array.isArray(doc.data().centerIds) ? doc.data().centerIds : [doc.data().centerIds]) : [],
      }));

      let filteredCourses = courseData;
      if (statusFilter !== "All") {
        filteredCourses = filteredCourses.filter(course => course.status === statusFilter);
      }
      if (modeFilter !== "All") {
        filteredCourses = filteredCourses.filter(course => course.mode === modeFilter);
      }
      if (centerFilter !== "All") {
        filteredCourses = filteredCourses.filter(course => course.centerIds.includes(centerFilter));
      }

      setCourses(filteredCourses);
      setSearchResults(filteredCourses);
    }, (err) => console.error("Error fetching courses:", err.message));
    return unsubscribe;
  }, [canDisplay, statusFilter, modeFilter, centerFilter]);

  const debouncedSearch = useCallback(
    debounce((term) => {
      if (!term.trim()) {
        setSearchResults(courses);
        return;
      }
      const results = courses.filter(course =>
        course.name?.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(results);
    }, 300),
    [courses]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  useEffect(() => {
    if (!canDisplay) return;
    const unsubscribeCourses = fetchCourses();
    Promise.all([fetchCenters()]).then(() => {
      if (isAdmin) fetchLogs();
    });
    return () => unsubscribeCourses && unsubscribeCourses();
  }, [fetchCourses, fetchCenters, fetchLogs, canDisplay, isAdmin]);

  const handleCreateCourseClick = () => {
    if (!canCreate) {
      alert("You do not have permission to create courses.");
      return;
    }
    setCurrentCourse(null);
    setIsOpen(true);
  };

  const handleEditClick = (course) => {
    if (!canUpdate) {
      alert("You do not have permission to update courses.");
      return;
    }
    setCurrentCourse(course);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setCurrentCourse(null);
  };

  const checkStudentsInCourse = async (courseId) => {
    try {
      const q = query(EnrollmentsCollectionRef, where('courses.selectedCourse.id', '==', courseId));
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (err) {
      console.error("Error checking students in course:", err.message);
      return false;
    }
  };

  const deleteCourse = async () => {
    if (!deleteId || !canDelete) {
      if (!canDelete) alert("You do not have permission to delete courses.");
      return;
    }
    try {
      const hasStudents = await checkStudentsInCourse(deleteId);
      if (hasStudents) {
        setDeleteMessage("This course cannot be deleted because students are enrolled in it.");
        return;
      }
      const courseRef = doc(db, "Course", deleteId);
      const courseSnapshot = await getDoc(courseRef);
      const courseData = courseSnapshot.exists() ? courseSnapshot.data() : {};
      await deleteDoc(courseRef);
      await logActivity("Deleted course", { name: courseData.name || 'Unknown' });
      setOpenDelete(false);
      setDeleteMessage("Are you sure you want to delete this course? This action cannot be undone.");
    } catch (err) {
      console.error("Error deleting course:", err.message);
      setDeleteMessage("An error occurred while trying to delete the course.");
    }
  };

  if (!canDisplay) {
    return (
      <div className="p-4 text-red-600 text-center">
        Access Denied: You do not have permission to view courses.
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-4 fixed inset-0 left-[300px]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Courses</h1>
        <div className="flex space-x-4">
          {isAdmin && (
            <button
              type="button"
              className="bg-gray-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-700"
              onClick={() => setOpenLogsDialog(true)}
            >
              View Logs
            </button>
          )}
          {canCreate && (
            <button
              type="button"
              className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700"
              onClick={handleCreateCourseClick}
            >
              + Create Course
            </button>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6 flex items-center space-x-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search courses by name..."
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel id="status-filter-label">Filter by Status</InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              label="Filter by Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="All">All Courses</MenuItem>
              <MenuItem value="Active">Active Courses</MenuItem>
              <MenuItem value="Inactive">Inactive Courses</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel id="mode-filter-label">Filter by Mode</InputLabel>
            <Select
              labelId="mode-filter-label"
              value={modeFilter}
              label="Filter by Mode"
              onChange={(e) => setModeFilter(e.target.value)}
            >
              <MenuItem value="All">All Modes</MenuItem>
              <MenuItem value="Online">Online</MenuItem>
              <MenuItem value="Offline">Offline</MenuItem>
              <MenuItem value="Hybrid">Hybrid</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel id="center-filter-label">Filter by Center</InputLabel>
            <Select
              labelId="center-filter-label"
              value={centerFilter}
              label="Filter by Center"
              onChange={(e) => setCenterFilter(e.target.value)}
            >
              <MenuItem value="All">All Centers</MenuItem>
              {centers.map(center => (
                <MenuItem key={center.id} value={center.id}>
                  {center.name || 'Unnamed Center'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="rounded-lg shadow-md overflow-x-auto max-h-[70vh] overflow-y-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Sr No</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Course Name</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Fee (₹)</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Duration</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Mode</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Center</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {(searchResults.length > 0 || searchTerm.trim() ? searchResults : courses).map((course, index) => (
                <tr key={course.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">{index + 1}</td>
                  <td className="px-4 py-3 text-gray-800">{course.name || 'N/A'}</td>
                  <td className="px-4 py-3 text-gray-600">{course.fee || 'N/A'}</td>
                  <td className="px-4 py-3 text-gray-600">{course.duration || 'N/A'}</td>
                  <td className="px-4 py-3 text-gray-600">{course.mode || 'N/A'}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {course.centerIds.length > 0
                      ? course.centerIds
                          .map(centerId => centers.find(c => c.id === centerId)?.name || centerId)
                          .join(', ')
                      : 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{course.status || 'Active'}</td>
                  <td className="px-4 py-3">
                    <FormControl size="small">
                      <Select
                        value=""
                        onChange={(e) => {
                          const action = e.target.value;
                          if (action === 'delete' && canDelete) {
                            setDeleteId(course.id);
                            setOpenDelete(true);
                            setDeleteMessage("Are you sure you want to delete this course? This action cannot be undone.");
                          } else if (action === 'update' && canUpdate) {
                            handleEditClick(course);
                          } else if (action === 'learners') {
                            handleLearnersClick(course.id);
                          }
                        }}
                        displayEmpty
                        renderValue={() => "Actions"}
                        disabled={!canUpdate && !canDelete}
                      >
                        <MenuItem value="" disabled>Actions</MenuItem>
                        {canUpdate && <MenuItem value="update">Update</MenuItem>}
                        {canDelete && <MenuItem value="delete">Delete</MenuItem>}
                        <MenuItem value="learners">Learners</MenuItem>
                      </Select>
                    </FormControl>
                  </td>
                </tr>
              ))}
              {!(searchResults.length > 0 || searchTerm.trim() ? searchResults : courses).length && (
                <tr>
                  <td colSpan="8" className="px-4 py-3 text-center text-gray-600">
                    No courses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleClose}
        />
      )}

      {isOpen && (
        <div
          className={`fixed top-0 right-0 h-full w-1/3 bg-white shadow-lg transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"} z-50 overflow-y-auto`}
        >
          <CreateCourses
            isOpen={isOpen}
            toggleSidebar={handleClose}
            course={currentCourse}
            logActivity={logActivity}
            centers={centers}
          />
        </div>
      )}

      {canDelete && (
        <Dialog
          open={openDelete}
          handler={() => setOpenDelete(false)}
          className="rounded-lg shadow-lg w-96 max-w-[90%] mx-auto"
        >
          <DialogHeader className="text-gray-800 font-semibold text-lg p-4">
            Confirm Deletion
          </DialogHeader>
          <DialogBody className="text-gray-600 text-base p-4">
            {deleteMessage}
          </DialogBody>
          <DialogFooter className="space-x-4 p-4">
            <Button
              variant="text"
              color="gray"
              onClick={() => setOpenDelete(false)}
              className="text-sm"
            >
              Cancel
            </Button>
            {deleteMessage === "Are you sure you want to delete this course? This action cannot be undone." && (
              <Button
                variant="filled"
                color="red"
                onClick={deleteCourse}
                className="text-sm"
              >
                Yes, Delete
              </Button>
            )}
          </DialogFooter>
        </Dialog>
      )}

      {isAdmin && (
        <Dialog
          open={openLogsDialog}
          handler={() => setOpenLogsDialog(false)}
          className="rounded-lg shadow-lg max-w-4xl"
        >
          <DialogHeader className="text-gray-800 font-semibold">Activity Logs</DialogHeader>
          <DialogBody className="text-gray-600 max-h-96 overflow-y-auto">
            {logs.length > 0 ? (
              <table className="w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-2 py-1 text-left">Timestamp</th>
                    <th className="px-2 py-1 text-left">User</th>
                    <th className="px-2 py-1 text-left">Action</th>
                    <th className="px-2 py-1 text-left">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(log => (
                    <tr key={`${log.id}-${log.timestamp?.toMillis()}`} className="border-b">
                      <td className="px-2 py-1">{log.timestamp ? new Date(log.timestamp.toDate()).toLocaleString() : 'N/A'}</td>
                      <td className="px-2 py-1">{log.userEmail}</td>
                      <td className="px-2 py-1">{log.action}</td>
                      <td className="px-2 py-1">{JSON.stringify(log.details)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No logs available.</p>
            )}
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="gray"
              onClick={() => setOpenLogsDialog(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </Dialog>
      )}

      {openLearnersDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <LearnerList
              courseId={selectedCourseId}
              open={openLearnersDialog}
              onClose={() => setOpenLearnersDialog(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}