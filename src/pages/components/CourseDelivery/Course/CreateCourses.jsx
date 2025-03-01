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