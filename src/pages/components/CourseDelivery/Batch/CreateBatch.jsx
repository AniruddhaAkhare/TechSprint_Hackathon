import React, { useState, useEffect } from "react";
import { db } from "../../../../config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import sendBatchEnrollmentEmail from "../../../../services/sendBatchEnrollmentMail";
import BatchForm from "./BatchForm";
import CenterSelection from "./CenterSelection";
import CurriculumSelection from "./CurriculumSelection";
import BatchManagerSelection from "./BatchManagerSelection";
import BatchFacultySelection from "./BatchFacultySelection";
import StudentSelection from "./StudentSelection";

const CreateBatch = ({ isOpen, toggleSidebar, batch, onSubmit, logActivity, user }) => {
  const [batchName, setBatchName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState(batch?.status || "Active");
  const [preFeedbackForm, setPreFeedbackForm] = useState(batch?.preFeedbackForm || "");
  const [postFeedbackForm, setPostFeedbackForm] = useState(batch?.postFeedbackForm || "");
  const [centers, setCenters] = useState([]);
  const [selectedCenters, setSelectedCenters] = useState([]);
  const [availableCenters, setAvailableCenters] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [curriculum, setCurriculum] = useState([]);
  const [selectedCurriculum, setSelectedCurriculum] = useState([]);
  const [availableCurriculum, setAvailableCurriculum] = useState([]);
  const [batchManager, setBatchManager] = useState([]);
  const [selectedBatchManager, setSelectedBatchManager] = useState([]);
  const [availableBatchManager, setAvailableBatchManager] = useState([]);
  const [batchFaculty, setBatchFaculty] = useState([]);
  const [selectedBatchFaculty, setSelectedBatchFaculty] = useState([]);
  const [availableBatchFaculty, setAvailableBatchFaculty] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [availableTemplates, setAvailableTemplates] = useState([]);

  const capitalizeFirstLetter = (str) => {
    if (!str || typeof str !== "string") return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Centers
        const instituteSnapshot = await getDocs(collection(db, "instituteSetup"));
        if (instituteSnapshot.empty) {
          return;
        }
        const instituteId = instituteSnapshot.docs[0].id;
        const centerQuery = query(
          collection(db, "instituteSetup", instituteId, "Center"),
          where("isActive", "==", true)
        );
        const centerSnapshot = await getDocs(centerQuery);
        const centersList = centerSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCenters(centersList);
        setAvailableCenters(centersList);

        // Fetch Courses
        const courseSnapshot = await getDocs(collection(db, "Course"));
        const coursesList = courseSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCourses(coursesList);
        setAvailableCourses(coursesList);

        // Fetch Curriculum
        const curriculumSnapshot = await getDocs(collection(db, "curriculums"));
        const curriculumList = curriculumSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCurriculum(curriculumList);
        setAvailableCurriculum(curriculumList);

        // Fetch Batch Manager
        const batchManagerSnapshot = await getDocs(collection(db, "Instructor"));
        const batchManagersList = batchManagerSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBatchManager(batchManagersList);
        setAvailableBatchManager(batchManagersList);

        // Fetch Batch Faculty
        const batchFacultySnapshot = await getDocs(collection(db, "Instructor"));
        const batchFacultyList = batchFacultySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBatchFaculty(batchFacultyList);
        setAvailableBatchFaculty(batchFacultyList);

        // Fetch Students
        const studentSnapshot = await getDocs(collection(db, "student"));
        const studentsList = studentSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setStudents(studentsList);
        setAvailableStudents(studentsList);

        // Fetch Templates
        const templateSnapshot = await getDocs(collection(db, "templates"));
        const templatesList = templateSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTemplates(templatesList);
        setAvailableTemplates(templatesList);
      } catch (error) {
        await logActivity("FETCH_DATA_ERROR", { error: error.message }, user);
      }
    };
    fetchData();
  }, [logActivity, user]);

  useEffect(() => {
    if (batch) {
      setBatchName(batch.batchName || "");
      setStartDate(
        batch.startDate?.toDate?.().toISOString().split("T")[0] ||
          new Date(batch.startDate).toISOString().split("T")[0] ||
          ""
      );
      setEndDate(
        batch.endDate?.toDate?.().toISOString().split("T")[0] ||
          new Date(batch.endDate).toISOString().split("T")[0] ||
          ""
      );
      setStatus(batch.status || "Active");
      setPreFeedbackForm(batch.preFeedbackForm || "");
      setPostFeedbackForm(batch.postFeedbackForm || "");
      setSelectedCenters(batch.centers || []);
      setAvailableCenters(centers.filter((c) => !batch.centers?.includes(c.id)));
      setSelectedCourses(batch.courses || []);
      setAvailableCourses(courses.filter((c) => !batch.courses?.includes(c.id)));
      setSelectedCurriculum(batch.curriculum || []);
      setAvailableCurriculum(curriculum.filter((c) => !batch.curriculum?.includes(c.id)));
      setSelectedBatchManager(batch.batchManager || []);
      setAvailableBatchManager(batchManager.filter((c) => !batch.batchManager?.includes(c.id)));
      setSelectedBatchFaculty(batch.batchFaculty || []);
      setAvailableBatchFaculty(batchFaculty.filter((c) => !batch.batchFaculty?.includes(c.id)));
      setSelectedStudents(batch.students || []);
      setAvailableStudents(students.filter((s) => !batch.students?.includes(s.id)));
    }
  }, [batch, centers, courses, curriculum, batchManager, batchFaculty, students]);

  const handleAddCenter = (centerId) => {
    if (centerId && !selectedCenters.includes(centerId)) {
      setSelectedCenters([...selectedCenters, centerId]);
      setAvailableCenters(availableCenters.filter((c) => c.id !== centerId));
    }
  };

  const handleRemoveCenter = (centerId) => {
    setSelectedCenters(selectedCenters.filter((id) => id !== centerId));
    const removedCenter = centers.find((c) => c.id === centerId);
    if (removedCenter) setAvailableCenters([...availableCenters, removedCenter]);
  };

  const handleAddCourse = (courseId) => {
    if (courseId && !selectedCourses.includes(courseId)) {
      setSelectedCourses([...selectedCourses, courseId]);
      setAvailableCourses(availableCourses.filter((c) => c.id !== courseId));
    }
  };

  const handleRemoveCourse = (courseId) => {
    setSelectedCourses(selectedCourses.filter((id) => id !== courseId));
    const removedCourse = courses.find((c) => c.id === courseId);
    if (removedCourse) setAvailableCourses([...availableCourses, removedCourse]);
  };

  const handleAddCurriculum = (curriculumId) => {
    if (curriculumId && !selectedCurriculum.includes(curriculumId)) {
      setSelectedCurriculum([...selectedCurriculum, curriculumId]);
      setAvailableCurriculum(availableCurriculum.filter((c) => c.id !== curriculumId));
    }
  };

  const handleRemoveCurriculum = (curriculumId) => {
    setSelectedCurriculum(selectedCurriculum.filter((id) => id !== curriculumId));
    const removedCurriculum = curriculum.find((c) => c.id === curriculumId);
    if (removedCurriculum) setAvailableCurriculum([...availableCurriculum, removedCurriculum]);
  };

  const handleAddBatchManager = (batchManagerId) => {
    if (batchManagerId && !selectedBatchManager.includes(batchManagerId)) {
      setSelectedBatchManager([...selectedBatchManager, batchManagerId]);
      setAvailableBatchManager(availableBatchManager.filter((c) => c.id !== batchManagerId));
    }
  };

  const handleRemoveBatchManager = (batchManagerId) => {
    setSelectedBatchManager(selectedBatchManager.filter((id) => id !== batchManagerId));
    const removedBatchManager = batchManager.find((c) => c.id === batchManagerId);
    if (removedBatchManager)
      setAvailableBatchManager([...availableBatchManager, removedBatchManager]);
  };

  const handleAddBatchFaculty = (batchFacultyId) => {
    if (batchFacultyId && !selectedBatchFaculty.includes(batchFacultyId)) {
      setSelectedBatchFaculty([...selectedBatchFaculty, batchFacultyId]);
      setAvailableBatchFaculty(availableBatchFaculty.filter((c) => c.id !== batchFacultyId));
    }
  };

  const handleRemoveBatchFaculty = (batchFacultyId) => {
    setSelectedBatchFaculty(selectedBatchFaculty.filter((id) => id !== batchFacultyId));
    const removedBatchFaculty = batchFaculty.find((c) => c.id === batchFacultyId);
    if (removedBatchFaculty)
      setAvailableBatchFaculty([...availableBatchFaculty, removedBatchFaculty]);
  };

  const handleAddStudent = (studentId) => {
    if (studentId && !selectedStudents.includes(studentId)) {
      setSelectedStudents([...selectedStudents, studentId]);
      setAvailableStudents(availableStudents.filter((s) => s.id !== studentId));
    }
  };

  const handleRemoveStudent = (studentId) => {
    setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
    const removedStudent = students.find((s) => s.id === studentId);
    if (removedStudent) setAvailableStudents([...availableStudents, removedStudent]);
  };

  const handleSelectAllStudents = () => {
    const allStudentIds = availableStudents.map((student) => student.id);
    setSelectedStudents((prev) => [...new Set([...prev, ...allStudentIds])]);
    setAvailableStudents([]);
  };

  const resetForm = () => {
    setBatchName("");
    setStartDate("");
    setEndDate("");
    setStatus("Active");
    setPreFeedbackForm("");
    setPostFeedbackForm("");
    setSelectedCenters([]);
    setAvailableCenters(centers);
    setSelectedCourses([]);
    setAvailableCourses(courses);
    setSelectedCurriculum([]);
    setAvailableCurriculum(curriculum);
    setSelectedBatchManager([]);
    setAvailableBatchManager(batchManager);
    setSelectedBatchFaculty([]);
    setAvailableBatchFaculty(batchFaculty);
    setSelectedStudents([]);
    setAvailableStudents(students);
    setAvailableTemplates(templates);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate dates
    const currentDate = new Date("2025-04-30"); // Current date as per system context
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start < currentDate.setHours(0, 0, 0, 0)) {
      alert("Start date cannot be in the past.");
      return;
    }
    if (end < start) {
      alert("End date must be after start date.");
      return;
    }

    const batchData = {
      batchName: capitalizeFirstLetter(batchName),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status,
      preFeedbackForm: preFeedbackForm || null,
      postFeedbackForm: postFeedbackForm || null,
      centers: selectedCenters,
      courses: selectedCourses,
      curriculum: selectedCurriculum,
      batchManager: selectedBatchManager,
      batchFaculty: selectedBatchFaculty,
      students: selectedStudents,
      lastUpdated: serverTimestamp(),
    };

    try {
      let batchId;
      let newlyAddedStudents = selectedStudents;

      if (batch) {
        // Update existing batch
        const batchRef = doc(db, "Batch", batch.id);
        await updateDoc(batchRef, { ...batchData, statusChangeDate: serverTimestamp() });
        batchId = batch.id;
        // Identify newly added students
        newlyAddedStudents = selectedStudents.filter(
          (studentId) => !batch.students?.includes(studentId)
        );
        await logActivity(
          "UPDATE_BATCH",
          {
            batchId: batch.id,
            name: batchData.batchName,
            changes: {
              oldName: batch.batchName,
              newName: batchData.batchName,
              oldStatus: batch.status,
              newStatus: batchData.status,
            },
          },
          user
        );
        alert("Batch updated successfully!");
      } else {
        // Create new batch
        const docRef = await addDoc(collection(db, "Batch"), {
          ...batchData,
          createdAt: serverTimestamp(),
        });
        batchId = docRef.id;
        await logActivity(
          "CREATE_BATCH",
          {
            batchId: docRef.id,
            name: batchData.batchName,
          },
          user
        );
        alert("Batch created successfully!");
      }

      // Update student documents with enrolledBatch
      for (const studentId of selectedStudents) {
        await updateDoc(doc(db, "student", studentId), {
          enrolledBatch: batchId,
        });
      }

      // Send emails to newly added students
      const studentsToEmail = students.filter((student) =>
        newlyAddedStudents.includes(student.id)
      );
      for (const student of studentsToEmail) {
        const studentEmail = student.email || "";
        const studentName = `${student.first_name || ""} ${student.last_name || ""}`.trim();
        if (studentEmail) {
          try {
            await sendBatchEnrollmentEmail(studentEmail, studentName, {
              batchName: batchData.batchName,
            });
            await logActivity(
              "SEND_BATCH_ENROLLMENT_EMAIL_SUCCESS",
              {
                batchId,
                email: studentEmail,
                studentName,
                batchName: batchData.batchName,
              },
              user
            );
          } catch (emailError) {
            await logActivity(
              "SEND_BATCH_ENROLLMENT_EMAIL_ERROR",
              {
                batchId,
                email: studentEmail,
                studentName,
                batchName: batchData.batchName,
                error: emailError.message,
              },
              user
            );
          }
        }
      }

      // Call onSubmit to notify parent component
      if (typeof onSubmit === "function") {
        await onSubmit({ ...batchData, id: batchId });
      }

      resetForm();
      toggleSidebar();
    } catch (error) {
      alert("Failed to save batch. Please try again.");
      await logActivity("SAVE_BATCH_ERROR", { error: error.message, batchId }, user);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full bg-white w-full shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } p-6 overflow-y-auto z-50`}
      >
        <BatchForm
          batchName={batchName}
          setBatchName={setBatchName}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          status={status}
          setStatus={setStatus}
          preFeedbackForm={preFeedbackForm}
          setPreFeedbackForm={setPreFeedbackForm}
          postFeedbackForm={postFeedbackForm}
          setPostFeedbackForm={setPostFeedbackForm}
          availableTemplates={availableTemplates}
          toggleSidebar={toggleSidebar}
          isEdit={!!batch}
        />
        <CenterSelection
          availableCenters={availableCenters}
          selectedCenters={selectedCenters}
          centers={centers}
          handleAddCenter={handleAddCenter}
          handleRemoveCenter={handleRemoveCenter}
        />
        <CurriculumSelection
          availableCurriculum={availableCurriculum}
          selectedCurriculum={selectedCurriculum}
          curriculum={curriculum}
          handleAddCurriculum={handleAddCurriculum}
          handleRemoveCurriculum={handleRemoveCurriculum}
        />
        <BatchManagerSelection
          availableBatchManager={availableBatchManager}
          selectedBatchManager={selectedBatchManager}
          batchManager={batchManager}
          handleAddBatchManager={handleAddBatchManager}
          handleRemoveBatchManager={handleRemoveBatchManager}
        />
        <BatchFacultySelection
          availableBatchFaculty={availableBatchFaculty}
          selectedBatchFaculty={selectedBatchFaculty}
          batchFaculty={batchFaculty}
          handleAddBatchFaculty={handleAddBatchFaculty}
          handleRemoveBatchFaculty={handleRemoveBatchFaculty}
        />
        <StudentSelection
          availableStudents={availableStudents}
          selectedStudents={selectedStudents}
          students={students}
          handleAddStudent={handleAddStudent}
          handleRemoveStudent={handleRemoveStudent}
          handleSelectAllStudents={handleSelectAllStudents}
        />
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200 text-base font-medium"
          >
            {batch ? "Update Batch" : "Create Batch"}
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateBatch;