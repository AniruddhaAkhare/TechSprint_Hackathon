// import React, { useState, useEffect } from "react";
// import { db } from "../../../../config/firebase";
// import { getDocs, collection, addDoc, updateDoc, doc, serverTimestamp, getDoc } from "firebase/firestore";

// const CreateCourses = ({ isOpen, toggleSidebar, course, logActivity }) => {
//   const [instructors, setInstructors] = useState([]);
//   const [centers, setCenters] = useState([]);
//   const [owners, setOwners] = useState([]);

//   const [courseName, setCourseName] = useState("");
//   const [courseDescription, setCourseDescription] = useState("");
//   const [courseFee, setCourseFee] = useState("");
//   const [courseDuration, setCourseDuration] = useState("");
//   const [courseMode, setCourseMode] = useState("");
//   const [courseStatus, setCourseStatus] = useState("Active");

//   const [centerAssignments, setCenterAssignments] = useState([]);
//   const [selectedOwners, setSelectedOwners] = useState([]);
//   const [totalStudentCount, setTotalStudentCount] = useState(0);

//   const [availableCenters, setAvailableCenters] = useState([]);
//   const [availableOwners, setAvailableOwners] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch Instructors
//         const instructorSnapshot = await getDocs(collection(db, "Instructor"));
//         setInstructors(instructorSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

//         // Fetch Centers from instituteSetup -> Center (only active ones)
//         const instituteSnapshot = await getDocs(collection(db, "instituteSetup"));
//         if (!instituteSnapshot.empty) {
//           const instituteId = instituteSnapshot.docs[0].id; // Assuming single institute
//           const centerSnapshot = await getDocs(collection(db, "instituteSetup", instituteId, "Center"));
//           const activeCenters = centerSnapshot.docs
//             .map((doc) => ({ id: doc.id, ...doc.data() }))
//             .filter((center) => center.isActive); // Filter only active centers
//           setCenters(activeCenters);
//           setAvailableCenters(activeCenters);
//         }
//         const ownerSnapshot = await getDocs(collection(db, "Instructor"));
//         const ownersList = ownerSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//         setOwners(ownersList);
//         setAvailableOwners(ownersList);



//         // Fetch student count and batch student counts if editing a course
//         if (course) {
//           const enrollmentsRef = collection(db, "enrollments");
//           const enrollmentSnapshot = await getDocs(enrollmentsRef);
//           const allEnrollments = enrollmentSnapshot.docs.map(doc => ({
//             id: doc.id,
//             ...doc.data()
//           }));
//           const matchedLearners = allEnrollments.filter(enrollment =>
//             enrollment.courses?.some(c => c.selectedCourse?.id === course.id)
//           );
//           setTotalStudentCount(matchedLearners.length);
//         }
//       } catch (err) {
//         console.error("Error fetching data in CreateCourses:", err.message);
//       }
//     };
//     fetchData();
//   }, [course]);

//   useEffect(() => {
//     if (course) {
//       console.log("Loading course for edit:", course);
//       setCourseName(course.name || "");
//       setCourseDescription(course.description || "");
//       setCourseFee(course.fee || "");
//       setCourseDuration(course.duration || "");
//       setCourseMode(course.mode || "");
//       setCourseStatus(course.status || "Active");
//       setCenterAssignments(course.centers?.map(c => typeof c === "string" ? { centerId: c, status: "Active" } : c) || []);
//       setSelectedOwners(course.owners || []);
//       setAvailableCenters(centers.filter(c => !course.centers?.some(ca => ca.centerId === c.id)));
//       setAvailableOwners(owners.filter(o => !course.owners?.includes(o.id)));
//     } else {
//       resetForm();
//     }
//   }, [course, centers, owners]);

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
//       owners: selectedOwners,
//       createdAt: serverTimestamp(),
//     };

//     try {
//       if (course) {
//         const courseRef = doc(db, "Course", course.id);
//         const oldData = (await getDoc(courseRef)).data() || {};
//         console.log("Old data:", oldData);
//         console.log("New data:", courseData);

//         await updateDoc(courseRef, courseData);
//         const changes = Object.keys(courseData).reduce((acc, key) => {
//           if (key !== 'createdAt' && JSON.stringify(oldData[key]) !== JSON.stringify(courseData[key])) {
//             acc[key] = { oldValue: oldData[key], newValue: courseData[key] };
//           }
//           return acc;
//         }, {});
        
//         if (Object.keys(changes).length > 0) {
//           await logActivity("Updated course", { name: courseName, changes });
//           console.log("Logged changes:", changes);
//         } else {
//           console.log("No changes detected for update.");
//         }
//         alert("Course updated successfully!");
//       } else {
//         const docRef = await addDoc(collection(db, "Course"), courseData);
//         await logActivity("Created course", { name: courseName });
//         alert("Course created successfully!");
//       }
//       resetForm();
//       toggleSidebar();
//     } catch (error) {
//       console.error("Error saving course:", error.message);
//       alert(`Failed to save course: ${error.message}`);
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
//     setSelectedOwners([]);
//     setTotalStudentCount(0);
//     setAvailableCenters(centers);
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
//       className={`fixed top-0 right-0 h-full bg-white w-full shadow-lg transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
//         } p-6 overflow-y-auto`}
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

//         <h3 className="text-lg font-semibold text-gray-800">Total Students: {totalStudentCount}</h3>

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
//             <div className="mt-4 overflow-x-auto max-w-[calc(100vw-350px)]">
//               <table className="divide-y divide-gray-200 overflow-x-auto">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr No</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Center Name</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-full">Status</th>
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
//                             className="block min-w-full px-3 py-1 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 base:text-base"
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



import React, { useState, useEffect } from "react";
import { db } from "../../../../config/firebase";
import { getDocs, collection, addDoc, updateDoc, doc, serverTimestamp, getDoc, deleteField } from "firebase/firestore";

const CreateCourses = ({ isOpen, toggleSidebar, course, logActivity, centers: propCenters }) => {
  const [instructors, setInstructors] = useState([]);
  const [centers, setCenters] = useState([]);
  const [owners, setOwners] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseFee, setCourseFee] = useState("");
  const [courseDuration, setCourseDuration] = useState("");
  const [courseMode, setCourseMode] = useState("");
  const [courseStatus, setCourseStatus] = useState("Active");
  const [centerIds, setCenterIds] = useState([]); // Changed from centerAssignments
  const [selectedOwners, setSelectedOwners] = useState([]);
  const [totalStudentCount, setTotalStudentCount] = useState(0);
  const [availableCenters, setAvailableCenters] = useState([]);
  const [availableOwners, setAvailableOwners] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use propCenters if provided, otherwise fetch centers
        if (propCenters && propCenters.length > 0) {
          const normalizedCenters = propCenters.map((center) => ({
            id: center.id || center.centerId,
            name: center.name || `Center ${center.id || center.centerId}`,
            isActive: center.isActive || center.status === "Active",
          }));
          setCenters(normalizedCenters);
          setAvailableCenters(normalizedCenters);
        } else {
          const instituteSnapshot = await getDocs(collection(db, "instituteSetup"));
          if (!instituteSnapshot.empty) {
            const instituteId = instituteSnapshot.docs[0].id;
            const centerSnapshot = await getDocs(collection(db, "instituteSetup", instituteId, "Center"));
            const activeCenters = centerSnapshot.docs
              .map((doc) => ({
                id: doc.id,
                name: doc.data().name || `Center ${doc.id}`,
                isActive: doc.data().isActive || false,
              }))
              .filter((center) => center.isActive);
            setCenters(activeCenters);
            setAvailableCenters(activeCenters);
          }
        }

        // Fetch Instructors/Owners
        const ownerSnapshot = await getDocs(collection(db, "Instructor"));
        const ownersList = ownerSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setOwners(ownersList);
        setAvailableOwners(ownersList);

        // Fetch student count if editing a course
        if (course) {
          const enrollmentsRef = collection(db, "enrollments");
          const enrollmentSnapshot = await getDocs(enrollmentsRef);
          const allEnrollments = enrollmentSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          const matchedLearners = allEnrollments.filter((enrollment) =>
            enrollment.courses?.some((c) => c.selectedCourse?.id === course.id)
          );
          setTotalStudentCount(matchedLearners.length);
        }
      } catch (err) {
        console.error("Error fetching data in CreateCourses:", err.message);
      }
    };
    fetchData();
  }, [course, propCenters]);

  useEffect(() => {
    if (course) {
      console.log("Loading course for edit:", course);
      setCourseName(course.name || "");
      setCourseDescription(course.description || "");
      setCourseFee(course.fee || "");
      setCourseDuration(course.duration || "");
      setCourseMode(course.mode || "");
      setCourseStatus(course.status || "Active");
      // Handle centers, centerIds, or centerId
      setCenterIds(
        course.centerIds ||
        (course.centers?.map((c) => c.centerId) || []) ||
        (course.centerId ? [course.centerId] : [])
      );
      setSelectedOwners(course.owners || []);
      setAvailableCenters(centers.filter((c) => !course.centerIds?.includes(c.id) && !course.centers?.some((ca) => ca.centerId === c.id)));
      setAvailableOwners(owners.filter((o) => !course.owners?.includes(o.id)));
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
      centerIds, // Save as array of strings
      owners: selectedOwners,
      createdAt: serverTimestamp(),
    };

    console.log("Saving course with centerIds:", courseData.centerIds);

    try {
      if (course) {
        const courseRef = doc(db, "Course", course.id);
        const oldData = (await getDoc(courseRef)).data() || {};
        console.log("Old data:", oldData);
        console.log("New data:", courseData);

        await updateDoc(courseRef, { ...courseData, centers: deleteField() }); // Remove old centers field
        const changes = Object.keys(courseData).reduce((acc, key) => {
          if (key !== "createdAt" && JSON.stringify(oldData[key]) !== JSON.stringify(courseData[key])) {
            acc[key] = { oldValue: oldData[key], newValue: courseData[key] };
          }
          return acc;
        }, {});
        if (Object.keys(changes).length > 0) {
          await logActivity("Updated course", { name: courseName, changes });
          console.log("Logged changes:", changes);
        }
        alert("Course updated successfully!");
      } else {
        await addDoc(collection(db, "Course"), courseData);
        await logActivity("Created course", { name: courseName });
        alert("Course created successfully!");
      }
      resetForm();
      toggleSidebar();
    } catch (error) {
      console.error("Error saving course:", error.message);
      alert(`Failed to save course: ${error.message}`);
    }
  };

  const resetForm = () => {
    setCourseName("");
    setCourseDescription("");
    setCourseFee("");
    setCourseDuration("");
    setCourseMode("");
    setCourseStatus("Active");
    setCenterIds([]);
    setSelectedOwners([]);
    setTotalStudentCount(0);
    setAvailableCenters(centers);
    setAvailableOwners(owners);
  };

  const handleAddCenter = (centerId) => {
    if (centerId && !centerIds.includes(centerId)) {
      setCenterIds([...centerIds, centerId]);
      setAvailableCenters(availableCenters.filter((c) => c.id !== centerId));
    }
  };

  const handleRemoveCenter = (centerId) => {
    setCenterIds(centerIds.filter((id) => id !== centerId));
    const removedCenter = centers.find((c) => c.id === centerId);
    if (removedCenter) setAvailableCenters([...availableCenters, removedCenter]);
  };

  const handleAddOwner = (ownerId) => {
    if (ownerId && !selectedOwners.includes(ownerId)) {
      setSelectedOwners([...selectedOwners, ownerId]);
      setAvailableOwners(availableOwners.filter((o) => o.id !== ownerId));
    }
  };

  const handleRemoveOwner = (ownerId) => {
    setSelectedOwners(selectedOwners.filter((id) => id !== ownerId));
    const removedOwner = owners.find((o) => o.id === ownerId);
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
          <label htmlFor="centers" className="block text-base font-medium text-gray-700">
            Centers
          </label>
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

          {centerIds.length > 0 && (
            <div className="mt-4 overflow-x-auto max-w-[calc(100vw-350px)]">
              <table className="divide-y divide-gray-200 overflow-x-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Center Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {centerIds.map((centerId, index) => {
                    const center = centers.find((c) => c.id === centerId);
                    return (
                      <tr key={centerId}>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">{center?.name || `Center ${centerId}`}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
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

        <div>
          <label htmlFor="owners" className="block text-base font-medium text-gray-700">
            Owners
          </label>
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