import React, { useState, useEffect } from "react";
import { db } from '../../../../config/firebase'
import { collection, addDoc, getDocs, serverTimestamp, updateDoc, doc, query, where } from "firebase/firestore";
import { FaTimes } from "react-icons/fa";

const CreateSession = ({ isOpen, toggleSidebar, sessionToEdit = null, onSubmit, logActivity }) => {
  const [sessionId, setSessionId] = useState(null);
  const [sessionName, setSessionName] = useState("");
  const [centerNames, setCenterNames] = useState([]);
  const [curriculumID, setCurriculumID] = useState("");
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [meetingPlatform, setMeetingPlatform] = useState("");
  const [sessionType, setSessionType] = useState("");
  const [sessionMode, setSessionMode] = useState("Online");
  const [sessionLink, setSessionLink] = useState("");
  const [venue, setVenue] = useState("");
  const [preFeedbackForm, setPreFeedbackForm] = useState("");
  const [postFeedbackForm, setPostFeedbackForm] = useState("");
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [availableCenters, setAvailableCenters] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const capitalizeFirstLetter = (str) => {
    if (!str || typeof str !== "string") return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  useEffect(() => {
    if (sessionToEdit) {
      setSessionId(sessionToEdit.id);
      setSessionName(sessionToEdit.name || "");
      setCenterNames(sessionToEdit.centerNames || []);
      setCurriculumID(sessionToEdit.curriculumID || "");
      setSelectedBatches(sessionToEdit.batches || []);
      setSelectedStudents(sessionToEdit.students || []);
      setDate(sessionToEdit.date || "");
      setStartTime(sessionToEdit.startTime || "");
      setEndTime(sessionToEdit.endTime || "");
      setMeetingPlatform(sessionToEdit.meetingPlatform || "");
      setSessionType(sessionToEdit.sessionType || "");
      setSessionMode(sessionToEdit.sessionMode || "Online");
      setSessionLink(sessionToEdit.sessionLink || "");
      setVenue(sessionToEdit.venue || "");
      setPreFeedbackForm(sessionToEdit.preFeedbackForm || "");
      setPostFeedbackForm(sessionToEdit.postFeedbackForm || "");
    }
  }, [sessionToEdit]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch Centers
        const institutesSnapshot = await getDocs(collection(db, "instituteSetup"));
        if (institutesSnapshot.empty) {
          setAvailableCenters([]);
          setLoading(false);
          return;
        }

        const centerPromises = institutesSnapshot.docs.map(async (instituteDoc) => {
          const centersQuery = query(
            collection(db, "instituteSetup", instituteDoc.id, "Center"),
            where("isActive", "==", true)
          );
          const centersSnapshot = await getDocs(centersQuery);
          return centersSnapshot.docs.map(doc => ({
            id: doc.id,
            instituteId: instituteDoc.id,
            ...doc.data()
          }));
        });

        const centersData = (await Promise.all(centerPromises)).flat();
        setAvailableCenters(centersData);

        // Fetch Students
        const studentsSnapshot = await getDocs(collection(db, "student"));
        const studentData = studentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStudents(studentData);

        // Fetch Batches
        const q = query(collection(db, "Batch"), where("status", "==", "Active"));
        const batchesSnapshot = await getDocs(q);
        const batchData = batchesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBatches(batchData);

        // Fetch Templates
        const templateSnapshot = await getDocs(collection(db, "templates"));
        const templatesList = templateSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTemplates(templatesList);

        setLoading(false);
      } catch (error) {
        // //console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCenterChange = (centerId) => {
    setCenterNames(prev =>
      prev.includes(centerId)
        ? prev.filter(id => id !== centerId)
        : [...prev, centerId]
    );
    // Clear selected batches and students when centers change
    setSelectedBatches([]);
    setSelectedStudents([]);
  };

  // Filter batches to only those assigned to selected centers
  const filteredBatches = batches.filter(batch => {
    if (centerNames.length === 0) return true;
    const batchCenterIds = batch.centers || [];
    return centerNames.some(centerId => batchCenterIds.includes(centerId));
  });

  // Filter students to only those with at least one preferred center matching selected centers
  const filteredStudents = students.filter(student => {
    if (centerNames.length === 0) return true;
    const studentCenters = student.preferred_centers || [];
    return studentCenters.some(centerId => centerNames.includes(centerId));
  });

  const handleBatchChange = (batchId) => {
    setSelectedBatches(prev =>
      prev.includes(batchId)
        ? prev.filter(id => id !== batchId)
        : [...prev, batchId]
    );
  };

  const handleStudentChange = (studentId) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAllStudents = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      const allStudentIds = filteredStudents.map(student => student.id);
      setSelectedStudents(allStudentIds);
    }
  };

  const handleSelectAllBatches = () => {
    if (selectedBatches.length === filteredBatches.length) {
      setSelectedBatches([]);
    } else {
      const allBatchIds = filteredBatches.map(batch => batch.id);
      setSelectedBatches(allBatchIds);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate Date (No backdated sessions)
    const currentDate = new Date('2025-04-18'); // Current date as per system context
    const sessionDate = new Date(date);
    if (sessionDate < currentDate.setHours(0, 0, 0, 0)) {
      alert("Session date cannot be in the past. Please select a future date.");
      return;
    }

    // Validate End Time > Start Time
    if (startTime && endTime) {
      const start = new Date(`1970-01-01T${startTime}:00`);
      const end = new Date(`1970-01-01T${endTime}:00`);
      if (end <= start) {
        alert("End time must be later than start time.");
        return;
      }
    }

    const sessionData = {
      name: capitalizeFirstLetter(sessionName),
      centerNames,
      curriculumID,
      batches: sessionType === "batch" ? selectedBatches : [],
      students: sessionType === "subject" ? selectedStudents : [],
      date,
      startTime,
      endTime,
      sessionType,
      sessionMode,
      meetingPlatform: sessionMode === "Online" ? meetingPlatform : "",
      sessionLink: sessionMode === "Online" ? sessionLink : "",
      venue: sessionMode === "Offline" ? venue : "",
      preFeedbackForm: preFeedbackForm || null,
      postFeedbackForm: postFeedbackForm || null,
      ...(sessionId ? { lastUpdated: serverTimestamp() } : { createdAt: serverTimestamp() }),
    };

    try {
      let sessionIdResult;
      if (sessionId) {
        // Update existing session
        const sessionRef = doc(db, "Sessions", sessionId);
        await updateDoc(sessionRef, sessionData);
        sessionIdResult = sessionId;
        // Log update activity
        await logActivity("Session updated", {
          // sessionId: sessionId,
          name: sessionData.name,
          changes: {
            oldName: sessionToEdit?.name,
            newName: sessionData.name,
            oldDate: sessionToEdit?.date,
            newDate: sessionData.date,
            oldPreFeedbackForm: sessionToEdit?.preFeedbackForm,
            newPreFeedbackForm: sessionData.preFeedbackForm,
            oldPostFeedbackForm: sessionToEdit?.postFeedbackForm,
            newPostFeedbackForm: sessionData.postFeedbackForm,
          },
        });
        alert("Session updated successfully!");
      } else {
        // Create new session
        const docRef = await addDoc(collection(db, "Sessions"), sessionData);
        sessionIdResult = docRef.id;
        // Log create activity
        await logActivity("Session created", {
          // sessionId: docRef.id,
          name: sessionData.name,
          // preFeedbackForm: sessionData.preFeedbackForm,
          // postFeedbackForm: sessionData.postFeedbackForm,
        });
        alert("Session created successfully!");
      }

      // Call onSubmit to notify parent component (Sessions)
      if (typeof onSubmit === "function") {
        await onSubmit(sessionData);
      }

      resetForm();
      toggleSidebar();
    } catch (error) {
      // //console.error("Error saving session:", error);
      alert("Failed to save session. Please try again.");
    }
  };

  const resetForm = () => {
    setSessionId(null);
    setSessionName("");
    setCenterNames([]);
    setCurriculumID("");
    setSelectedBatches([]);
    setSelectedStudents([]);
    setDate("");
    setStartTime("");
    setEndTime("");
    setSessionType("");
    setMeetingPlatform("");
    setSessionMode("Online");
    setSessionLink("");
    setVenue("");
    setPreFeedbackForm("");
    setPostFeedbackForm("");
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
        className={`fixed inset-y-0 right-0 z-50 bg-white w-full shadow-lg transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"} p-4 sm:p-6 overflow-y-auto`}
      >
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">
            {sessionId ? "Edit Session" : "Create Session"}
          </h1>
          <button
            onClick={toggleSidebar}
            className="bg-indigo-600 text-white px-1 py-1 rounded-md hover:bg-indigo-700 flex items-center gap-2"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

      <form
  onSubmit={handleSubmit}
  className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-6"
>
  <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">Create Session</h2>

  {/* Session Name */}
  <div>
    <label className="block text-sm font-medium text-gray-700">
      Session Name <span className="text-red-500">*</span>
    </label>
    <input
      type="text"
      value={sessionName}
      onChange={(e) => setSessionName(e.target.value)}
      required
      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
    />
  </div>

  {/* Center Names */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Center Name(s)</label>
    {loading ? (
      <p className="text-gray-500">Loading centers...</p>
    ) : error ? (
      <p className="text-red-500">{error}</p>
    ) : availableCenters.length === 0 ? (
      <p className="text-gray-500">No active centers found</p>
    ) : (
      <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
        {availableCenters.map((center) => (
          <label key={center.id} className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              checked={centerNames.includes(center.id)}
              onChange={() => handleCenterChange(center.id)}
              className="accent-blue-600 h-4 w-4"
            />
            <span className="text-gray-700">{center.name || "Unnamed Center"}</span>
          </label>
        ))}
      </div>
    )}
  </div>

  {/* Session Type */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Session Type</label>
    <div className="flex gap-6">
      {["batch", "subject"].map((type) => (
        <label key={type} className="inline-flex items-center gap-2">
          <input
            type="radio"
            name="sessionType"
            value={type}
            checked={sessionType === type}
            onChange={() => setSessionType(type)}
            className="accent-blue-600"
          />
          <span className="text-gray-700 capitalize">
            {type === "batch" ? "By Batch" : "By Student"}
          </span>
        </label>
      ))}
    </div>
  </div>

  {/* Conditional: Batch Selection */}
  {sessionType === "batch" && (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Select Batches</label>
      <button
        type="button"
        onClick={handleSelectAllBatches}
        disabled={filteredBatches.length === 0}
        className={`mb-2 px-4 py-2 rounded-lg font-medium transition-all text-white ${
          filteredBatches.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : selectedBatches.length === filteredBatches.length
            ? "bg-red-500 hover:bg-red-600"
            : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {selectedBatches.length === filteredBatches.length && filteredBatches.length > 0
          ? "Deselect All Batches"
          : "Select All Batches"}
      </button>

      <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
        {filteredBatches.length === 0 ? (
          <p className="text-gray-500">No batches available for selected centers</p>
        ) : (
          filteredBatches.map((batch) => (
            <label key={batch.id} className="flex items-center gap-2 py-1">
              <input
                type="checkbox"
                checked={selectedBatches.includes(batch.id)}
                onChange={() => handleBatchChange(batch.id)}
                className="accent-blue-600 h-4 w-4"
              />
              <span className="text-gray-700">{batch.batchName || "Unnamed Batch"}</span>
            </label>
          ))
        )}
      </div>
    </div>
  )}

  {/* Conditional: Student Selection */}
  {sessionType === "subject" && (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Select Students</label>
      <button
        type="button"
        onClick={handleSelectAllStudents}
        disabled={filteredStudents.length === 0}
        className={`mb-2 px-4 py-2 rounded-lg font-medium transition-all text-white ${
          filteredStudents.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : selectedStudents.length === filteredStudents.length
            ? "bg-red-500 hover:bg-red-600"
            : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {selectedStudents.length === filteredStudents.length && filteredStudents.length > 0
          ? "Deselect All Students"
          : "Select All Students"}
      </button>

      <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
        {filteredStudents.length === 0 ? (
          <p className="text-gray-500">No students available for selected centers</p>
        ) : (
          filteredStudents.map((student) => (
            <label key={student.id} className="flex items-center gap-2 py-1">
              <input
                type="checkbox"
                checked={selectedStudents.includes(student.id)}
                onChange={() => handleStudentChange(student.id)}
                className="accent-blue-600 h-4 w-4"
              />
              <span className="text-gray-700">{student.Name}</span>
            </label>
          ))
        )}
      </div>
    </div>
  )}

  {/* Date and Time */}
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">Date <span className="text-red-500">*</span></label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        min="2025-04-18"
        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Start Time <span className="text-red-500">*</span></label>
      <input
        type="time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        required
        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">End Time <span className="text-red-500">*</span></label>
      <input
        type="time"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        required
        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  </div>

  {/* Feedback Forms */}
  <div>
    <label className="block text-sm font-medium text-gray-700">Pre Feedback Form</label>
    <select
      value={preFeedbackForm}
      onChange={(e) => setPreFeedbackForm(e.target.value)}
      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
    >
      <option value="">Select a Pre Feedback Form</option>
      {templates.map((template) => (
        <option key={template.id} value={template.id}>
          {template.name}
        </option>
      ))}
    </select>
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700">Post Feedback Form</label>
    <select
      value={postFeedbackForm}
      onChange={(e) => setPostFeedbackForm(e.target.value)}
      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
    >
      <option value="">Select a Post Feedback Form</option>
      {templates.map((template) => (
        <option key={template.id} value={template.id}>
          {template.name}
        </option>
      ))}
    </select>
  </div>

  {/* Session Mode */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Session Mode <span className="text-red-500">*</span></label>
    <div className="flex gap-6">
      {["Online", "Offline"].map((mode) => (
        <label key={mode} className="inline-flex items-center gap-2">
          <input
            type="radio"
            name="sessionMode"
            value={mode}
            checked={sessionMode === mode}
            onChange={() => setSessionMode(mode)}
            className="accent-blue-600"
          />
          <span className="text-gray-700">{mode}</span>
        </label>
      ))}
    </div>
  </div>

  {/* Meeting Platform if Online */}
  {sessionMode === "Online" && (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Meeting Platform <span className="text-red-500">*</span>
      </label>
      <select
        value={meetingPlatform}
        onChange={(e) => setMeetingPlatform(e.target.value)}
        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <option value="">Select Platform</option>
        <option value="Zoom">Zoom</option>
        <option value="Google Meet">Google Meet</option>
        <option value="Microsoft Teams">Microsoft Teams</option>
        {/* Add more options if needed */}
      </select>
    </div>
  )}

  {/* Submit Button */}
<div className="flex justify-end">
  <button
    type="submit"
    className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2 max-w-max"
  >
    Submit Session
  </button>
</div>

</form>

      </div>
    </>
  );
};

export default CreateSession;