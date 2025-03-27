


import React, { useState, useEffect } from "react";
import { db } from "../../../../config/firebase.js";
import { collection, addDoc, getDocs, serverTimestamp, updateDoc, doc, query, where } from "firebase/firestore";
import { FaTimes } from "react-icons/fa";

const CreateSession = ({ isOpen, toggleSidebar, sessionToEdit = null }) => {
  const [sessionId, setSessionId] = useState(null);
  const [sessionName, setSessionName] = useState("");
  const [centerNames, setCenterNames] = useState([]); // Selected center IDs
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
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [availableCenters, setAvailableCenters] = useState([]);
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
    }
  }, [sessionToEdit]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const institutesSnapshot = await getDocs(collection(db, "instituteSetup"));
        console.log("Institutes found:", institutesSnapshot.docs.length);

        if (institutesSnapshot.empty) {
          console.log("No institutes found in instituteSetup collection");
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
          console.log(`Centers for institute ${instituteDoc.id}:`, centersSnapshot.docs.length);

          return centersSnapshot.docs.map(doc => ({
            id: doc.id,
            instituteId: instituteDoc.id,
            ...doc.data()
          }));
        });

        const centersData = (await Promise.all(centerPromises)).flat();
        console.log("Total active centers fetched:", centersData.length);
        console.log("Centers data:", centersData);
        setAvailableCenters(centersData);

        const studentsSnapshot = await getDocs(collection(db, "student"));
        const studentData = studentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Students fetched:", studentData.length);
        setStudents(studentData);

        const q = query(collection(db, "Batch"), where("status", "==", "Active"));
        const batchesSnapshot = await getDocs(q);
        const batchData = batchesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Batches fetched:", batchData.length);
        setBatches(batchData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
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
    setSelectedBatches([]);
    setSelectedStudents([]);
  };

  // Filter students based on center names (not IDs)
  const filteredStudents = students.filter(student => {
    if (centerNames.length === 0) return true;
    const studentCenterName = student.course_details?.[0]?.center || "";
    return availableCenters.some(
      center => centerNames.includes(center.id) && center.name === studentCenterName
    );
  });

  // Filter batches based on center IDs
  const filteredBatches = batches.filter(batch => {
    if (centerNames.length === 0) return true;
    const batchCenterIds = batch.centers || [];
    return batchCenterIds.some(centerId => centerNames.includes(centerId));
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
    const allStudentIds = filteredStudents.map(student => student.id);
    setSelectedStudents(allStudentIds);
  };

  const handleSelectAllBatches = () => {
    const allBatchIds = filteredBatches.map(batch => batch.id);
    setSelectedBatches(allBatchIds);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      ...(sessionId ? {} : { createdAt: serverTimestamp() }),
    };

    try {
      if (sessionId) {
        const sessionRef = doc(db, "Sessions", sessionId);
        await updateDoc(sessionRef, sessionData);
      } else {
        await addDoc(collection(db, "Sessions"), sessionData);
      }
      resetForm();
      toggleSidebar();
    } catch (error) {
      console.error("Error saving session:", error);
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
  };

  return (
    <div className={`fixed inset-y-0 right-0 z-50 bg-white w-full sm:w-3/4 md:w-2/5 shadow-lg transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"} p-4 sm:p-6 overflow-y-auto`}>
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-lg sm:text-xl font-bold text-gray-800">
          {sessionId ? "Edit Session" : "Create Session"}
        </h1>
        <button onClick={toggleSidebar} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200">
          <FaTimes className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Session Name</label>
          <input
            type="text"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            required
            className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Center Name(s)</label>
          {loading ? (
            <p>Loading centers...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : availableCenters.length === 0 ? (
            <p>No active centers found</p>
          ) : (
            <div className="mt-1 max-h-40 overflow-y-auto border p-2 rounded-md">
              {availableCenters.map(center => (
                <label key={center.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={centerNames.includes(center.id)}
                    onChange={() => handleCenterChange(center.id)}
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span>{center.name || "Unnamed Center"}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Session Type</label>
          <div className="flex flex-col sm:flex-row gap-4 mt-1">
            <label className="flex items-center">
              <input type="radio" name="sessionType" value="batch" checked={sessionType === "batch"} onChange={() => setSessionType("batch")} className="mr-2" />
              By Batch
            </label>
            <label className="flex items-center">
              <input type="radio" name="sessionType" value="subject" checked={sessionType === "subject"} onChange={() => setSessionType("subject")} className="mr-2" />
              By Student
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
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 w-full sm:w-auto"
              >
                Select All Batches
              </button>
              <div className="mt-1 max-h-40 overflow-y-auto border p-2 rounded-md">
                {filteredBatches.length === 0 ? (
                  <p>No batches available for selected centers</p>
                ) : (
                  filteredBatches.map(batch => (
                    <label key={batch.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedBatches.includes(batch.id)}
                        onChange={() => handleBatchChange(batch.id)}
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                      <span>{batch.batchName || "Unnamed Batch"}</span>
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
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 w-full sm:w-auto"
              >
                Select All Students
              </button>
              <div className="mt-1 max-h-40 overflow-y-auto border p-2 rounded-md">
                {filteredStudents.length === 0 ? (
                  <p>No students available for selected centers</p>
                ) : (
                  filteredStudents.map(student => (
                    <label key={student.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => handleStudentChange(student.id)}
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                      <span>{`${student.first_name} ${student.last_name}`}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Time</label>
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Session Mode</label>
          <div className="flex flex-col sm:flex-row gap-4 mt-1">
            <label className="flex items-center">
              <input type="radio" name="sessionMode" value="Online" checked={sessionMode === "Online"} onChange={() => setSessionMode("Online")} className="mr-2" />
              Online
            </label>
            <label className="flex items-center">
              <input type="radio" name="sessionMode" value="Offline" checked={sessionMode === "Offline"} onChange={() => setSessionMode("Offline")} className="mr-2" />
              Offline
            </label>
          </div>
        </div>

        {sessionMode === "Online" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Meeting Platform</label>
              <select value={meetingPlatform} onChange={(e) => setMeetingPlatform(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required={sessionMode === "Online"}>
                <option value="">Select a platform</option>
                <option value="Zoom">Zoom</option>
                <option value="Google">Google Meet</option>
                <option value="Teams">Microsoft Teams</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Session Link</label>
              <input type="url" value={sessionLink} onChange={(e) => setSessionLink(e.target.value)} required={sessionMode === "Online"} className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter session link" />
            </div>
          </>
        )}

        {sessionMode === "Offline" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Venue</label>
            <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} required={sessionMode === "Offline"} className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter venue" />
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200 w-full sm:w-auto">
            {sessionId ? "Update Session" : "Save Session"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSession;