<<<<<<< HEAD
import React from 'react';
=======
import React, { useState, useEffect } from "react";
import { db } from "../../../../config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const CreateCourses = ({ isOpen, toggleSidebar, course }) => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [centers, setCenters] = useState([]);
  const [batches, setBatches] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseFee, setCourseFee] = useState("");
  const [courseDuration, setCourseDuration] = useState("");
  const [coursePrerequisite, setCoursePrerequisites] = useState("");
  const [courseMode, setCourseMode] = useState("");
  const [courseBranch, setCourseBranch] = useState("");
  const [selectedInstructors, setSelectedInstructors] = useState([]);
  const [selectedCenters, setSelectedCenters] = useState([]);
  const [selectedBatches, setSelectedBatches] = useState([]);

  useEffect(() => {
    const unsubscribeCourses = onSnapshot(collection(db, "Course"), (snapshot) => {
      const courseList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCourses(courseList);
    });
    return () => unsubscribeCourses();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const instructorSnapshot = await getDocs(collection(db, "Instructor"));
      setInstructors(instructorSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      const centerSnapshot = await getDocs(collection(db, "Centers"));
      setCenters(centerSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      const batchSnapshot = await getDocs(collection(db, "Batch"));
      setBatches(batchSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (course) {
      setCourseName(course.name);
      setCourseDescription(course.description);
      setCourseFee(course.fee);
      setCourseDuration(course.duration);
      setCoursePrerequisites(course.prerequisites);
      setCourseMode(course.mode);
      setCourseBranch(course.branch);
      setSelectedInstructors(course.instructors || []);
      setSelectedCenters(course.centers || []);
      setSelectedBatches(course.batches || []);
    } else {
      setCourseName("");
      setCourseDescription("");
      setCourseFee("");
      setCourseDuration("");
      setCoursePrerequisites("");
      setCourseMode("");
      setCourseBranch("");
      setSelectedInstructors([]);
      setSelectedCenters([]);
      setSelectedBatches([]);
    }
  }, [course]);

  const handleAddCenter = (centerId) => {
    if (!selectedCenters.includes(centerId)) {
      setSelectedCenters([...selectedCenters, centerId]);
    }
  };

  const handleRemoveCenter = (centerId) => {
    setSelectedCenters(selectedCenters.filter((id) => id !== centerId));
  };


  const handleAddBatch = (batchId) => {
    if (!selectedBatches.includes(batchId)) {
      setSelectedBatches([...selectedBatches, batchId]);
    }
  };

  const handleRemoveBatch = (batchId) => {
    setSelectedBatches(selectedBatches.filter((id) => id !== batchId));
  };

  const handleCheckboxChange = (id, setter, selectedList) => {
    setter((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const onSubmitCourse = async (e) => {
    e.preventDefault();
    if (!courseName.trim() || !courseDescription.trim() || !courseFee || !courseDuration) {
      alert("Please fill in all required fields");
      return;
    }
    try {
      let courseId;
      if (course) {
        const courseDoc = doc(db, "Course", course.id);
        await updateDoc(courseDoc, {
          name: courseName,
          description: courseDescription,
          fee: courseFee,
          duration: courseDuration,
          prerequisites: coursePrerequisite,
          mode: courseMode,
          branch: courseBranch,
          instructors: selectedInstructors,
          centers: selectedCenters,
          batches: selectedBatches
        });
        courseId = course.id;
      } else {
        const docRef = await addDoc(collection(db, "Course"), {
          name: courseName,
          description: courseDescription,
          fee: courseFee,
          duration: courseDuration,
          prerequisites: coursePrerequisite,
          mode: courseMode,
          branch: courseBranch,
          instructors: selectedInstructors,
          centers: selectedCenters,
          batches: selectedBatches
        });
        courseId = docRef.id;
      }
      alert("Course successfully saved!");
      toggleSidebar();
      navigate(`/editCourse/${courseId}`);
    } catch (err) {
      console.error("Error adding course: ", err);
      alert("Error adding course!");
    }
  };

  return (
    <div className={`fixed top-0 right-0 h-full bg-white w-2/5 shadow-lg transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"} p-4 overflow-y-auto`}>
      <button type="button" onClick={toggleSidebar}>Back</button>
      <h1>{course ? "Edit Course" : "Create Course"}</h1>
      <form onSubmit={onSubmitCourse}>


        <input type="text" value={courseName} placeholder="Course Name" onChange={(e) => setCourseName(e.target.value)} required />
         <input type="text" value={courseDescription} placeholder="Course Description" onChange={(e) => setCourseDescription(e.target.value)} required />
         <input type="number" value={courseFee} placeholder="Enter Course Fee" onChange={(e) => setCourseFee(e.target.value)} required />
         <input type="text" value={courseDuration} placeholder="Enter Course Duration" onChange={(e) => setCourseDuration(e.target.value)} required />



         <select value={courseMode} onChange={(e) => setCourseMode(e.target.value)} required>
           <option value="">Select Mode</option>
           <option value="online">Online</option>
           <option value="offline">Offline</option>
           <option value="both">Both</option>
         </select>


        <select onChange={(e) => handleAddCenter(e.target.value)}>
          <option value="">Select a Center</option>
          {centers.map((center) => (
            <option key={center.id} value={center.id}>{center.name}</option>
          ))}
        </select>
        <div>
          {selectedCenters.map((centerId) => {
            const center = centers.find(c => c.id === centerId);
            return (
              <span key={centerId}>{center?.name} <button onClick={() => handleRemoveCenter(centerId)}>✕</button></span>
            );
          })}
        </div>



        <select onChange={(e) => handleAddBatch(e.target.value)}>
          <option value="">Select a Batch</option>
          {batches.map((batch) => (
            <option key={batch.id} value={batch.id}>{batch.name}</option>
          ))}
        </select>
        <div>
          {selectedBatches.map((batchId) => {
            const batch = batches.find(b => b.id === batchId);
            return (
              <span key={batchId}>{batch?.name} <button onClick={() => handleRemoveBatch(batchId)}>✕</button></span>
            );
          })}
        </div>


        <h3>Course Owners</h3>
        {instructors.map((instructor) => (
          <label key={instructor.id}>
            <input type="checkbox" checked={selectedInstructors.includes(instructor.id)} onChange={() => handleCheckboxChange(instructor.id, setSelectedInstructors, selectedInstructors)} />
            {instructor.f_name}
          </label>
        ))}


        <button type="submit">{course ? "Update" : "Create"}</button>
      </form>
    </div>
  );
};

export default CreateCourses;



// import React, { useState, useEffect } from "react";
// import { db } from "../../../../config/firebase";
// import {
//   getDocs,
//   collection,
//   addDoc,
//   updateDoc,
//   doc,
//   onSnapshot,
// } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";

// const CreateCourses = ({ isOpen, toggleSidebar, course }) => {
//   const navigate = useNavigate();

//   const [courses, setCourses] = useState([]);
//   const [instructors, setInstructors] = useState([]);
//   const [centers, setCenters] = useState([]);
//   const [batches, setBatches] = useState([]);
//   const [courseName, setCourseName] = useState("");
//   const [courseDescription, setCourseDescription] = useState("");
//   const [courseFee, setCourseFee] = useState("");
//   const [courseDuration, setCourseDuration] = useState("");
//   const [coursePrerequisite, setCoursePrerequisites] = useState("");
//   const [courseMode, setCourseMode] = useState("");
//   const [courseBranch, setCourseBranch] = useState("");
//   const [selectedInstructors, setSelectedInstructors] = useState([]);
//   const [selectedCenters, setSelectedCenters] = useState([]);
//   const [selectedBatches, setSelectedBatches] = useState([]);

//   useEffect(() => {
//     const unsubscribeCourses = onSnapshot(collection(db, "Course"), (snapshot) => {
//       const courseList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//       setCourses(courseList);
//     });
//     return () => unsubscribeCourses();
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       const instructorSnapshot = await getDocs(collection(db, "Instructor"));
//       setInstructors(instructorSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

//       const centerSnapshot = await getDocs(collection(db, "Centers"));
//       setCenters(centerSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

//       const batchSnapshot = await getDocs(collection(db, "Batch"));
//       setBatches(batchSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (course) {
//       setCourseName(course.name);
//       setCourseDescription(course.description);
//       setCourseFee(course.fee);
//       setCourseDuration(course.duration);
//       setCoursePrerequisites(course.prerequisites);
//       setCourseMode(course.mode);
//       setCourseBranch(course.branch);
//       setSelectedInstructors(course.instructors || []);
//       setSelectedCenters(course.centers || []);
//       setSelectedBatches(course.batches || []);
//     } else {
//       setCourseName("");
//       setCourseDescription("");
//       setCourseFee("");
//       setCourseDuration("");
//       setCoursePrerequisites("");
//       setCourseMode("");
//       setCourseBranch("");
//       setSelectedInstructors([]);
//       setSelectedCenters([]);
//       setSelectedBatches([]);
//     }
//   }, [course]);

//   const handleAddCenter = (centerId) => {
//     if (!selectedCenters.includes(centerId)) {
//       setSelectedCenters([...selectedCenters, centerId]);
//     }
//   };

//   const handleRemoveCenter = (centerId) => {
//     setSelectedCenters(selectedCenters.filter((id) => id !== centerId));
//   };

//   const handleAddBatch = (batchId) => {
//     if (!selectedBatches.includes(batchId)) {
//       setSelectedBatches([...selectedBatches, batchId]);
//     }
//   };

//   const handleRemoveBatch = (batchId) => {
//     setSelectedBatches(selectedBatches.filter((id) => id !== batchId));
//   };

//   const handleCheckboxChange = (id, setter, selectedList) => {
//     setter((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
//   };

//   const onSubmitCourse = async (e) => {
//     e.preventDefault();
//     if (!courseName.trim() || !courseDescription.trim() || !courseFee || !courseDuration) {
//       alert("Please fill in all required fields");
//       return;
//     }
//     try {
//       let courseId;
//       if (course) {
//         const courseDoc = doc(db, "Course", course.id);
//         await updateDoc(courseDoc, {
//           name: courseName,
//           description: courseDescription,
//           fee: courseFee,
//           duration: courseDuration,
//           prerequisites: coursePrerequisite,
//           mode: courseMode,
//           branch: courseBranch,
//           instructors: selectedInstructors,
//           centers: selectedCenters,
//           batches: selectedBatches,
//         });
//         courseId = course.id;
//       } else {
//         const docRef = await addDoc(collection(db, "Course"), {
//           name: courseName,
//           description: courseDescription,
//           fee: courseFee,
//           duration: courseDuration,
//           prerequisites: coursePrerequisite,
//           mode: courseMode,
//           branch: courseBranch,
//           instructors: selectedInstructors,
//           centers: selectedCenters,
//           batches: selectedBatches,
//         });
//         courseId = docRef.id;
//       }
//       alert("Course successfully saved!");
//       toggleSidebar();
//       navigate(`/editCourse/${courseId}`);
//     } catch (err) {
//       console.error("Error adding course: ", err);
//       alert("Error adding course!");
//     }
//   };

//   return (
//     <div
//       className={`fixed top-0 right-0 h-full bg-white w-full md:w-2/5 shadow-lg transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
//         } p-6 overflow-y-auto`}
//     >
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-semibold">{course ? "Edit Course" : "Create Course"}</h1>
//         <button
//           onClick={toggleSidebar}
//           className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
//         >
//           Back
//         </button>
//       </div>
//       <form onSubmit={onSubmitCourse} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Course Name</label>
//           <input
//             type="text"
//             value={courseName}
//             placeholder="Course Name"
//             onChange={(e) => setCourseName(e.target.value)}
//             required
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Course Description</label>
//           <textarea
//             value={courseDescription}
//             placeholder="Course Description"
//             onChange={(e) => setCourseDescription(e.target.value)}
//             required
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Course Fee</label>
//           <input
//             type="number"
//             value={courseFee}
//             placeholder="Enter Course Fee"
//             onChange={(e) => setCourseFee(e.target.value)}
//             required
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Course Duration</label>
//           <input
//             type="text"
//             value={courseDuration}
//             placeholder="Enter Course Duration"
//             onChange={(e) => setCourseDuration(e.target.value)}
//             required
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Course Mode</label>
//           <select
//             value={courseMode}
//             onChange={(e) => setCourseMode(e.target.value)} required>
//             <option value="">Select Mode</option>
//             <option value="online">Online</option>
//             <option value="offline">Offline</option>
//             <option value="both">Both</option>
//           </select>
// </div>

//           <select onChange={(e) => handleAddCenter(e.target.value)}>
//             <option value="">Select a Center</option>
//             {centers.map((center) => (
//               <option key={center.id} value={center.id}>{center.name}</option>
//             ))}
//           </select>
//           <div>
//             {selectedCenters.map((centerId) => {
//               const center = centers.find(c => c.id === centerId);
//               return (
//                 <span key={centerId}>{center?.name} <button onClick={() => handleRemoveCenter(centerId)}>✕</button></span>
//               );
//             })}
//           </div>



//           <select onChange={(e) => handleAddBatch(e.target.value)}>
//             <option value="">Select a Batch</option>
//             {batches.map((batch) => (
//               <option key={batch.id} value={batch.id}>{batch.name}</option>
//             ))}
//           </select>
//           <div>
//             {selectedBatches.map((batchId) => {
//               const batch = batches.find(b => b.id === batchId);
//               return (
//                 <span key={batchId}>{batch?.name} <button onClick={() => handleRemoveBatch(batchId)}>✕</button></span>
//               );
//             })}
//           </div>


//           <h3>Course Owners</h3>
//           {instructors.map((instructor) => (
//             <label key={instructor.id}>
//               <input type="checkbox" checked={selectedInstructors.includes(instructor.id)} onChange={() => handleCheckboxChange(instructor.id, setSelectedInstructors, selectedInstructors)} />
//               {instructor.f_name}
//             </label>
//           ))}


//           <button type="submit">{course ? "Update" : "Create"}</button>
//       </form>
//     </div>
//   );
// };

// export default CreateCourses;


// import React from 'react';
// import './CreateCourses.css'; // Create CSS file for this form
>>>>>>> c4a9abb96afb578fbf84baa5e4f5265cc4544fc6

// const CreateCourses = ({ onClose, onCreateCourse}) => {

//   const [courseName, setCourseName] = useState('');
//   const [description, setDescription] = useState('');
//   const [prettyName, setPrettyName] = useState('');
//   const [courseType, setCourseType] = useState('online');
// z
  
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const courseData = {
//       courseName,
//       description,
//       prettyName,
//       courseType,
//       // Add other relevant data you want to save
//     };
//     onCreateCourse(courseData);
//     // Reset form fields if needed
//     setCourseName('');
//     setDescription('');
//     setPrettyName('');
//     setCourseType('online');
//   };


//   return (
//     <div className="create-course-form-overlay">
//       <div className="create-course-form">
//         <div className="form-header">
//           <div className="form-title">Create Course</div>
//           <button className="close-button" onClick={onClose}>
//             X
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="form-content">
//           <div className="thumbnail-upload">
//             <div className="upload-area">
//               <span role="img" aria-label="upload icon">
//                 📁
//               </span>
//               <p>Click or drag file to this area to upload</p>
//               <p className="upload-info">
//                 Max. file size supported is 1MB. Preferred dimensions for upload
//                 is 1080px x 720px
//               </p>
//             </div>
//           </div>

//           <div className="form-group">
//             <label htmlFor="courseName">Course name</label>
//             <input
//               type="text"
//               id="courseName"
//               placeholder="Enter course name"
//               value={courseName}
//               onChange={(e) => setCourseName(e.target.value)}
//             />
//             <span className="char-count">0/100</span>
//           </div>

//           <div className="form-group">
//             <label htmlFor="description">Description</label>
//             <textarea
//               id="description"
//               placeholder="A short description of your course"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             ></textarea>
//             <span className="char-count">0/400</span>
//           </div>

//           <div className="form-group">
//             <label htmlFor="prettyName">Pretty name</label>
//             <input
//               type="text"
//               id="prettyName"
//               placeholder="Enter short course name"
//               value={prettyName}
//               onChange={(e) => setPrettyName(e.target.value)}
//             />
//             <span className="char-count">0/50</span>
//           </div>

//           <div className="form-group">
//             <label>Course Type</label>
//             <div className="course-type-options">
//               <div className="option">
//                 <input
//                   type="radio"
//                   id="online"
//                   name="courseType"
//                   value="online"
//                   checked={courseType === 'online'}
//                   onChange={(e) => setCourseType(e.target.value)}
//                 />
//                 <label htmlFor="online">Online only</label>
//                 <p>
//                   Select this if this package is intended only for online
//                   coaching.
//                 </p>
//               </div>
//               <div className="option">
//                 <input
//                   type="radio"
//                   id="classroom"
//                   name="courseType"
//                   value="classroom"
//                   checked={courseType === 'classroom'}
//                   onChange={(e) => setCourseType(e.target.value)}
//                 />
//                 <label htmlFor="classroom">Classroom Program</label>
//                 <p>
//                   Select this if the learners can enrol in this package for
//                   classroom program at your institution.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </form>

//         <div className="form-footer">
//           <button className="cancel-button" onClick={onClose}>
//             Cancel
//           </button>
//           <button className="create-button" onClick={handleSubmit}>
//             Create Course
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateCourses;