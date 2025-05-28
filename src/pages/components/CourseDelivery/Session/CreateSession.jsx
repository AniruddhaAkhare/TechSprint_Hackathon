import React, { useState, useEffect } from "react";
import { db } from "../../../../config/firebase.js";
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
        await logActivity("Updated session", {
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
        await logActivity("Created session", {
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
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-200"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Session Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Center Name(s)</label>
            {loading ? (
              <p className="text-gray-500">Loading centers...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : availableCenters.length === 0 ? (
              <p className="text-gray-500">No active centers found</p>
            ) : (
              <div className="mt-1 max-h-40 overflow-y-auto border border-gray-300 p-2 rounded-md">
                {availableCenters.map(center => (
                  <label key={center.id} className="flex items-center space-x-2 py-1">
                    <input
                      type="checkbox"
                      checked={centerNames.includes(center.id)}
                      onChange={() => handleCenterChange(center.id)}
                      className="form-checkbox h-4 w-4 text-blue-600 rounded"
                    />
                    <span className="text-gray-700">{center.name || "Unnamed Center"}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Session Type</label>
            <div className="flex flex-col sm:flex-row gap-4 mt-1">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="sessionType"
                  value="batch"
                  checked={sessionType === "batch"}
                  onChange={() => setSessionType("batch")}
                  className="mr-2 h-4 w-4 text-blue-600"
                />
                <span className="text-gray-700">By Batch</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="sessionType"
                  value="subject"
                  checked={sessionType === "subject"}
                  onChange={() => setSessionType("subject")}
                  className="mr-2 h-4 w-4 text-blue-600"
                />
                <span className="text-gray-700">By Student</span>
              </label>
            </div>
          </div>

          {sessionType === "batch" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Batches</label>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleSelectAllBatches}
                  className={`w-full sm:w-auto px-4 py-2 rounded-md text-white font-medium transition duration-200 ${
                    filteredBatches.length === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : selectedBatches.length === filteredBatches.length
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                  disabled={filteredBatches.length === 0}
                >
                  {selectedBatches.length === filteredBatches.length && filteredBatches.length > 0
                    ? "Deselect All Batches"
                    : "Select All Batches"}
                </button>
                <div className="mt-1 max-h-40 overflow-y-auto border border-gray-300 p-2 rounded-md">
                  {filteredBatches.length === 0 ? (
                    <p className="text-gray-500">No batches available for selected centers</p>
                  ) : (
                    filteredBatches.map(batch => (
                      <label key={batch.id} className="flex items-center space-x-2 py-1">
                        <input
                          type="checkbox"
                          checked={selectedBatches.includes(batch.id)}
                          onChange={() => handleBatchChange(batch.id)}
                          className="form-checkbox h-4 w-4 text-blue-600 rounded"
                        />
                        <span className="text-gray-700">{batch.batchName || "Unnamed Batch"}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {sessionType === "subject" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Students</label>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleSelectAllStudents}
                  className={`w-full sm:w-auto px-4 py-2 rounded-md text-white font-medium transition duration-200 ${
                    filteredStudents.length === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : selectedStudents.length === filteredStudents.length
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                  disabled={filteredStudents.length === 0}
                >
                  {selectedStudents.length === filteredStudents.length && filteredStudents.length > 0
                    ? "Deselect All Students"
                    : "Select All Students"}
                </button>
                <div className="mt-1 max-h-40 overflow-y-auto border border-gray-300 p-2 rounded-md">
                  {filteredStudents.length === 0 ? (
                    <p className="text-gray-500">No students available for selected centers</p>
                  ) : (
                    filteredStudents.map(student => (
                      <label key={student.id} className="flex items-center space-x-2 py-1">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => handleStudentChange(student.id)}
                          className="form-checkbox h-4 w-4 text-blue-600 rounded"
                        />
                        <span className="text-gray-700">{`${student.Name}`}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                min="2025-04-18"
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Time <span className="text-red-500">*</span></label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Time <span className="text-red-500">*</span></label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Pre Feedback Form</label>
            <select
              value={preFeedbackForm}
              onChange={(e) => setPreFeedbackForm(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a Post Feedback Form</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Session Mode <span className="text-red-500">*</span></label>
            <div className="flex flex-col sm:flex-row gap-4 mt-1">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="sessionMode"
                  value="Online"
                  checked={sessionMode === "Online"}
                  onChange={() => setSessionMode("Online")}
                  className="mr-2 h-4 w-4 text-blue-600"
                />
                <span className="text-gray-700">Online</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="sessionMode"
                  value="Offline"
                  checked={sessionMode === "Offline"}
                  onChange={() => setSessionMode("Offline")}
                  className="mr-2 h-4 w-4 text-blue-600"
                />
                <span className="text-gray-700">Offline</span>
              </label>
            </div>
          </div>

          {sessionMode === "Online" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Meeting Platform <span className="text-red-500">*</span></label>
                <select
                  value={meetingPlatform}
                  onChange={(e) => setMeetingPlatform(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={sessionMode === "Online"}
                >
                  <option value="">Select a platform</option>
                  <option value="Zoom">Zoom</option>
                  <option value="Google">Google Meet</option>
                  <option value="Teams">Microsoft Teams</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Session Link <span className="text-red-500">*</span></label>
                <input
                  type="url"
                  value={sessionLink}
                  onChange={(e) => setSessionLink(e.target.value)}
                  required={sessionMode === "Online"}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter session link"
                />
              </div>
            </>
          )}

          {sessionMode === "Offline" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Venue <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                required={sessionMode === "Offline"}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter venue"
              />
            </div>
          )}

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200 w-full sm:w-auto"
            >
              {sessionId ? "Update Session" : "Save Session"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateSession;