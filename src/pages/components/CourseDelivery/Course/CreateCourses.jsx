

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
  const [courseCode, setCourseCode] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseFee, setCourseFee] = useState("");
  const [courseDuration, setCourseDuration] = useState("");
  const [courseMode, setCourseMode] = useState("");
  const [courseStatus, setCourseStatus] = useState("Ongoing");

  const [centerAssignments, setCenterAssignments] = useState([]);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [selectedOwners, setSelectedOwners] = useState([]);
  const [studentCount, setStudentCount] = useState(0);
  const [batchStudentCounts, setBatchStudentCounts] = useState({});

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
        const studentSnapshot = await getDocs(collection(db, `Course/${course.id}/Students`));
        setStudentCount(studentSnapshot.docs.length);

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
      setCourseCode(course.code);
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
      code:courseCode,
      description: courseDescription,
      fee: courseFee,
      duration: courseDuration,
      mode: courseMode,
      status: courseStatus,
      centers: centerAssignments,
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
    setCourseCode("");
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
      className={`fixed inset-y-0 right-0 z-50 bg-white w-full sm:w-3/4 md:w-2/5 shadow-lg transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } p-4 overflow-y-auto`}
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl md:text-2xl font-semibold">
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="courseName" className="block text-sm font-medium">Course Name:</label>
          <input
            type="text"
            value={courseName}
            placeholder="Course Name"
            onChange={(e) => setCourseName(e.target.value)}
            required
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="courseCode" className="block text-sm font-medium">Course Code:</label>
          <input
            type="text"
            value={courseCode}
            placeholder="Course Name"
            onChange={(e) => setCourseCode(e.target.value)}
            required
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="courseDescription" className="block text-sm font-medium">Course Description:</label>
          <input
            type="text"
            value={courseDescription}
            placeholder="Course Description"
            onChange={(e) => setCourseDescription(e.target.value)}
            required
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="courseFee" className="block text-sm font-medium">Fee:</label>
          <input
            type="number"
            value={courseFee}
            placeholder="Enter Course Fee"
            onChange={(e) => setCourseFee(e.target.value)}
            required
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="courseDuration" className="block text-sm font-medium">Duration:</label>
          <input
            type="text"
            value={courseDuration}
            placeholder="Enter Course Duration"
            onChange={(e) => setCourseDuration(e.target.value)}
            required
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="courseMode" className="block text-sm font-medium">Mode:</label>
          <select
            value={courseMode}
            onChange={(e) => setCourseMode(e.target.value)}
            required
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Mode</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="both">Both</option>
          </select>
        </div>

        <div>
          <label htmlFor="courseStatus" className="block text-sm font-medium">Status:</label>
          <select
            value={courseStatus}
            onChange={(e) => setCourseStatus(e.target.value)}
            required
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Ongoing">Ongoing</option>
            <option value="Archive">Archive</option>
          </select>
        </div>

        <h3 className="text-lg font-medium">Total Students: {studentCount}</h3>

        <div>
          <label className="block text-sm font-medium">Add Center:</label>
          <select
            onChange={(e) => handleAddCenter(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a Center</option>
            {availableCenters.map((center) => (
              <option key={center.id} value={center.id}>{center.name}</option>
            ))}
          </select>
        </div>

        {centerAssignments.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left text-sm font-medium">Sr No</th>
                  <th className="p-2 text-left text-sm font-medium">Center Name</th>
                  <th className="p-2 text-left text-sm font-medium">Status</th>
                  <th className="p-2 text-left text-sm font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {centerAssignments.map((ca, index) => {
                  const center = centers.find(c => c.id === ca.centerId);
                  return (
                    <tr key={ca.centerId}>
                      <td className="p-2 text-sm">{index + 1}</td>
                      <td className="p-2 text-sm">{center?.name}</td>
                      <td className="p-2">
                        <select
                          value={ca.status}
                          onChange={(e) => handleCenterStatusChange(ca.centerId, e.target.value)}
                          className="w-full p-1 border rounded-md text-sm"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <button
                          type="button"
                          onClick={() => handleRemoveCenter(ca.centerId)}
                          className="text-red-500 hover:text-red-700 text-sm"
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

        <div>
          <label className="block text-sm font-medium">Add Batch:</label>
          <select
            onChange={(e) => handleAddBatch(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a Batch</option>
            {availableBatches.map((batch) => (
              <option key={batch.id} value={batch.id}>{batch.batchName}</option>
            ))}
          </select>
        </div>

        {selectedBatches.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left text-sm font-medium">Sr No</th>
                  <th className="p-2 text-left text-sm font-medium">Batch Name</th>
                  <th className="p-2 text-left text-sm font-medium">Student Count</th>
                  <th className="p-2 text-left text-sm font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {selectedBatches.map((batchId, index) => {
                  const batch = batches.find(b => b.id === batchId);
                  return (
                    <tr key={batchId}>
                      <td className="p-2 text-sm">{index + 1}</td>
                      <td className="p-2 text-sm">{batch?.batchName}</td>
                      <td className="p-2 text-sm">{batchStudentCounts[batchId] || 0}</td>
                      <td className="p-2">
                        <button
                          type="button"
                          onClick={() => handleRemoveBatch(batchId)}
                          className="text-red-500 hover:text-red-700 text-sm"
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

        <div>
          <label className="block text-sm font-medium">Add Owner:</label>
          <select
            onChange={(e) => handleAddOwner(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select an Owner</option>
            {availableOwners.map((owner) => (
              <option key={owner.id} value={owner.id}>{owner.f_name}</option>
            ))}
          </select>
        </div>

        {selectedOwners.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px] border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left text-sm font-medium">Sr No</th>
                  <th className="p-2 text-left text-sm font-medium">Owner Name</th>
                  <th className="p-2 text-left text-sm font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {selectedOwners.map((ownerId, index) => {
                  const owner = owners.find(o => o.id === ownerId);
                  return (
                    <tr key={ownerId}>
                      <td className="p-2 text-sm">{index + 1}</td>
                      <td className="p-2 text-sm">{owner?.f_name}</td>
                      <td className="p-2">
                        <button
                          type="button"
                          onClick={() => handleRemoveOwner(ownerId)}
                          className="text-red-500 hover:text-red-700 text-sm"
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

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200 w-full sm:w-auto"
          >
            {course ? "Update course" : "Create course"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCourses;