// import React, { useState, useEffect } from "react";
// import { db } from "../../../../config/firebase.js";
// import { collection, addDoc, getDocs, serverTimestamp, updateDoc, doc, query, where } from "firebase/firestore";
// import { FaTimes } from "react-icons/fa";

// const CreateSession = ({ isOpen, toggleSidebar, sessionToEdit = null }) => {
//   const [sessionId, setSessionId] = useState(null);
//   const [sessionName, setSessionName] = useState("");
//   const [curriculumID, setCurriculumID] = useState("");
//   const [selectedBatches, setSelectedBatches] = useState([]);
//   const [selectedCurriculums, setSelectedCurriculums] = useState([]);
//   const [date, setDate] = useState("");
//   const [startTime, setStartTime] = useState("");
//   const [endTime, setEndTime] = useState("");
//   const [meetingPlatform, setMeetingPlatform] = useState("");
//   const [sessionType, setSessionType] = useState("");
//   const [curriculums, setCurriculums] = useState([]);
//   const [batches, setBatches] = useState([]);
//   const [currentBatch, setCurrentBatch] = useState("");
//   const [currentCurriculum, setCurrentCurriculum] = useState("");

//   useEffect(() => {
//     if (sessionToEdit) {
//       setSessionId(sessionToEdit.id);
//       setSessionName(sessionToEdit.name || "");
//       setCurriculumID(sessionToEdit.curriculumID || "");
//       setSelectedBatches(sessionToEdit.batches || []);
//       setSelectedCurriculums(sessionToEdit.curriculums || []);
//       setDate(sessionToEdit.date || "");
//       setStartTime(sessionToEdit.startTime || "");
//       setEndTime(sessionToEdit.endTime || "");
//       setMeetingPlatform(sessionToEdit.meetingPlatform || "");
//       setSessionType(sessionToEdit.sessionType || "");
//     }
//   }, [sessionToEdit]);

//   useEffect(() => {
//     const fetchCurriculums = async () => {
//       const snapshot = await getDocs(collection(db, "curriculum"));
//       setCurriculums(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
//     };

//     const fetchBatches = async () => {
//       // Fetch only batches with status "ongoing"
//       const q = query(collection(db, "Batch"), where("status", "==", "ongoing"));
//       const snapshot = await getDocs(q);
//       setBatches(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
//     };

//     fetchCurriculums();
//     fetchBatches();
//   }, []);

//   const addBatch = () => {
//     if (currentBatch && !selectedBatches.includes(currentBatch)) {
//       setSelectedBatches([...selectedBatches, currentBatch]);
//       setCurrentBatch("");
//     }
//   };

//   const addCurriculum = () => {
//     if (currentCurriculum && !selectedCurriculums.includes(currentCurriculum)) {
//       setSelectedCurriculums([...selectedCurriculums, currentCurriculum]);
//       setCurrentCurriculum("");
//     }
//   };

//   const removeBatch = (batchId) => {
//     setSelectedBatches(selectedBatches.filter((id) => id !== batchId));
//   };

//   const removeCurriculum = (curriculumId) => {
//     setSelectedCurriculums(selectedCurriculums.filter((id) => id !== curriculumId));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const sessionData = {
//       name: sessionName,
//       curriculumID,
//       batches: sessionType === "batch" ? selectedBatches : [],
//       curriculums: sessionType === "subject" ? selectedCurriculums : [],
//       date,
//       startTime,
//       endTime,
//       sessionType,
//       meetingPlatform,
//       ...(sessionId ? {} : { createdAt: serverTimestamp() }),
//     };

//     try {
//       if (sessionId) {
//         const sessionRef = doc(db, "Sessions", sessionId);
//         await updateDoc(sessionRef, sessionData);
//         console.log("Session updated successfully", sessionData);
//       } else {
//         await addDoc(collection(db, "Sessions"), sessionData);
//         console.log("Session created successfully", sessionData);
//       }
//       resetForm();
//       toggleSidebar();
//     } catch (error) {
//       console.error("Error saving session:", error);
//     }
//   };

//   const resetForm = () => {
//     setSessionId(null);
//     setSessionName("");
//     setCurriculumID("");
//     setSelectedBatches([]);
//     setSelectedCurriculums([]);
//     setDate("");
//     setStartTime("");
//     setEndTime("");
//     setSessionType("");
//     setMeetingPlatform("");
//     setCurrentBatch("");
//     setCurrentCurriculum("");
//   };

//   return (
//     <div className={`fixed top-0 right-0 h-full bg-white w-full md:w-2/5 shadow-lg transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"} p-6 overflow-y-auto`}>
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-xl font-bold text-gray-800">
//           {sessionId ? "Edit Session" : "Create Session"}
//         </h1>
//         <button onClick={toggleSidebar} className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition duration-200">
//           Back
//         </button>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div>
//           <label className="block text-gray-700 font-medium">Session Name</label>
//           <input
//             type="text"
//             value={sessionName}
//             onChange={(e) => setSessionName(e.target.value)}
//             required
//             className="w-full mt-1 px-4 py-2 border rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200"
//             placeholder="Enter session name"
//           />
//         </div>

//         <div>
//           <label className="block text-gray-700 font-medium">Session Type</label>
//           <div className="flex gap-4">
//             <label className="flex items-center">
//               <input
//                 type="radio"
//                 name="sessionType"
//                 value="batch"
//                 checked={sessionType === "batch"}
//                 onChange={() => setSessionType("batch")}
//                 className="mr-2"
//               />
//               By Batch
//             </label>
//             <label className="flex items-center">
//               <input
//                 type="radio"
//                 name="sessionType"
//                 value="subject"
//                 checked={sessionType === "subject"}
//                 onChange={() => setSessionType("subject")}
//                 className="mr-2"
//               />
//               By Curriculum
//             </label>
//           </div>
//         </div>

//         {sessionType === "batch" && (
//           <div>
//             <label className="block text-gray-700 font-medium">Select Batches</label>
//             <div className="flex gap-2 mb-2">
//               <select
//                 value={currentBatch}
//                 onChange={(e) => setCurrentBatch(e.target.value)}
//                 className="w-full mt-1 px-4 py-2 border rounded-md"
//               >
//                 <option value="">Select a batch</option>
//                 {batches.map((batch) => (
//                   <option key={batch.id} value={batch.id}>
//                     {batch.batchName}
//                   </option>
//                 ))}
//               </select>
//               <button
//                 type="button"
//                 onClick={addBatch}
//                 className="bg-blue-500 text-white px-4 py-2 rounded-md"
//               >
//                 Add
//               </button>
//             </div>
//             <table className="w-full border-collapse">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="border p-2">Batch Name</th>
//                   <th className="border p-2">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {selectedBatches.map((batchId) => {
//                   const batch = batches.find((b) => b.id === batchId);
//                   return (
//                     <tr key={batchId}>
//                       <td className="border p-2">{batch?.batchName}</td>
//                       <td className="border p-2">
//                         <button
//                           type="button"
//                           onClick={() => removeBatch(batchId)}
//                           className="text-red-500"
//                         >
//                           Remove
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {sessionType === "subject" && (
//           <div>
//             <label className="block text-gray-700 font-medium">Select Curriculums</label>
//             <div className="flex gap-2 mb-2">
//               <select
//                 value={currentCurriculum}
//                 onChange={(e) => setCurrentCurriculum(e.target.value)}
//                 className="w-full mt-1 px-4 py-2 border rounded-md"
//               >
//                 <option value="">Select a curriculum</option>
//                 {curriculums.map((curriculum) => (
//                   <option key={curriculum.id} value={curriculum.id}>
//                     {curriculum.name}
//                   </option>
//                 ))}
//               </select>
//               <button
//                 type="button"
//                 onClick={addCurriculum}
//                 className="bg-blue-500 text-white px-4 py-2 rounded-md"
//               >
//                 Add
//               </button>
//             </div>

//             <table className="w-full border-collapse">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="border p-2">Curriculum Name</th>
//                   <th className="border p-2">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {selectedCurriculums.map((curriculumId) => {
//                   const curriculum = curriculums.find((c) => c.id === curriculumId);
//                   return (
//                     <tr key={curriculumId}>
//                       <td className="border p-2">{curriculum?.name}</td>
//                       <td className="border p-2">
//                         <button
//                           type="button"
//                           onClick={() => removeCurriculum(curriculumId)}
//                           className="text-red-500"
//                         >
//                           Remove
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}

//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block text-gray-700 font-medium">Date</label>
//             <input
//               type="date"
//               value={date}
//               onChange={(e) => setDate(e.target.value)}
//               required
//               className="w-full px-4 py-2 border rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200"
//             />
//           </div>
//           <div>
//             <label className="block text-gray-700 font-medium">Start Time</label>
//             <input
//               type="time"
//               value={startTime}
//               onChange={(e) => setStartTime(e.target.value)}
//               required
//               className="w-full px-4 py-2 border rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200"
//             />
//           </div>
//           <div>
//             <label className="block text-gray-700 font-medium">End Time</label>
//             <input
//               type="time"
//               value={endTime}
//               onChange={(e) => setEndTime(e.target.value)}
//               required
//               className="w-full px-4 py-2 border rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200"
//             />
//           </div>
//         </div>

//         <div>
//           <label className="block text-gray-700 font-medium">Meeting Platform</label>
//           <select
//             value={meetingPlatform}
//             onChange={(e) => setMeetingPlatform(e.target.value)}
//             className="w-full mt-1 px-4 py-2 border rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200"
//           >
//             <option value="">Select a platform</option>
//             <option value="Zoom">Zoom</option>
//             <option value="Google">Google Meet</option>
//             <option value="Teams">Microsoft Teams</option>
//           </select>
//         </div>
//         <div className="flex justify-end">
//           <button
//             type="submit"
//             className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200"
//           >
//             {sessionId ? "Update Session" : "Save Session"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateSession;


import React, { useState, useEffect } from "react";
import { db } from "../../../../config/firebase.js";
import { collection, addDoc, getDocs, serverTimestamp, updateDoc, doc, query, where } from "firebase/firestore";
import { FaTimes } from "react-icons/fa";

const CreateSession = ({ isOpen, toggleSidebar, sessionToEdit = null }) => {
  const [sessionId, setSessionId] = useState(null);
  const [sessionName, setSessionName] = useState("");
  const [curriculumID, setCurriculumID] = useState("");
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [selectedCurriculums, setSelectedCurriculums] = useState([]);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [meetingPlatform, setMeetingPlatform] = useState("");
  const [sessionType, setSessionType] = useState("");
  const [curriculums, setCurriculums] = useState([]);
  const [batches, setBatches] = useState([]);
  const [currentBatch, setCurrentBatch] = useState("");
  const [currentCurriculum, setCurrentCurriculum] = useState("");

  useEffect(() => {
    if (sessionToEdit) {
      setSessionId(sessionToEdit.id);
      setSessionName(sessionToEdit.name || "");
      setCurriculumID(sessionToEdit.curriculumID || "");
      setSelectedBatches(sessionToEdit.batches || []);
      setSelectedCurriculums(sessionToEdit.curriculums || []);
      setDate(sessionToEdit.date || "");
      setStartTime(sessionToEdit.startTime || "");
      setEndTime(sessionToEdit.endTime || "");
      setMeetingPlatform(sessionToEdit.meetingPlatform || "");
      setSessionType(sessionToEdit.sessionType || "");
    }
  }, [sessionToEdit]);

  useEffect(() => {
    const fetchCurriculums = async () => {
      const snapshot = await getDocs(collection(db, "curriculum"));
      setCurriculums(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    const fetchBatches = async () => {
      const q = query(collection(db, "Batch"), where("status", "==", "ongoing"));
      const snapshot = await getDocs(q);
      setBatches(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchCurriculums();
    fetchBatches();
  }, []);

  const addBatch = () => {
    if (currentBatch && !selectedBatches.includes(currentBatch)) {
      setSelectedBatches([...selectedBatches, currentBatch]);
      setCurrentBatch("");
    }
  };

  const addCurriculum = () => {
    if (currentCurriculum && !selectedCurriculums.includes(currentCurriculum)) {
      setSelectedCurriculums([...selectedCurriculums, currentCurriculum]);
      setCurrentCurriculum("");
    }
  };

  const removeBatch = (batchId) => {
    setSelectedBatches(selectedBatches.filter((id) => id !== batchId));
  };

  const removeCurriculum = (curriculumId) => {
    setSelectedCurriculums(selectedCurriculums.filter((id) => id !== curriculumId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sessionData = {
      name: sessionName,
      curriculumID,
      batches: sessionType === "batch" ? selectedBatches : [],
      curriculums: sessionType === "subject" ? selectedCurriculums : [],
      date,
      startTime,
      endTime,
      sessionType,
      meetingPlatform,
      ...(sessionId ? {} : { createdAt: serverTimestamp() }),
    };

    try {
      if (sessionId) {
        const sessionRef = doc(db, "Sessions", sessionId);
        await updateDoc(sessionRef, sessionData);
        console.log("Session updated successfully", sessionData);
      } else {
        await addDoc(collection(db, "Sessions"), sessionData);
        console.log("Session created successfully", sessionData);
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
    setCurriculumID("");
    setSelectedBatches([]);
    setSelectedCurriculums([]);
    setDate("");
    setStartTime("");
    setEndTime("");
    setSessionType("");
    setMeetingPlatform("");
    setCurrentBatch("");
    setCurrentCurriculum("");
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 bg-white w-full sm:w-3/4 md:w-2/5 shadow-lg transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } p-4 sm:p-6 overflow-y-auto`}
    >
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-lg sm:text-xl font-bold text-gray-800">
          {sessionId ? "Edit Session" : "Create Session"}
        </h1>
        <button
          onClick={toggleSidebar}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
        >
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
            placeholder="Enter session name"
          />
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
                className="mr-2"
              />
              By Batch
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="sessionType"
                value="subject"
                checked={sessionType === "subject"}
                onChange={() => setSessionType("subject")}
                className="mr-2"
              />
              By Curriculum
            </label>
          </div>
        </div>

        {sessionType === "batch" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Batches</label>
            <div className="flex flex-col sm:flex-row gap-2 mt-1 mb-2">
              <select
                value={currentBatch}
                onChange={(e) => setCurrentBatch(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a batch</option>
                {batches.map((batch) => (
                  <option key={batch.id} value={batch.id}>
                    {batch.batchName}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={addBatch}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 w-full sm:w-auto"
              >
                Add
              </button>
            </div>
            {selectedBatches.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[300px] border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left text-sm font-medium">Batch Name</th>
                      <th className="border p-2 text-left text-sm font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedBatches.map((batchId) => {
                      const batch = batches.find((b) => b.id === batchId);
                      return (
                        <tr key={batchId}>
                          <td className="border p-2 text-sm">{batch?.batchName}</td>
                          <td className="border p-2">
                            <button
                              type="button"
                              onClick={() => removeBatch(batchId)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Remove
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
        )}

        {sessionType === "subject" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Curriculums</label>
            <div className="flex flex-col sm:flex-row gap-2 mt-1 mb-2">
              <select
                value={currentCurriculum}
                onChange={(e) => setCurrentCurriculum(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a curriculum</option>
                {curriculums.map((curriculum) => (
                  <option key={curriculum.id} value={curriculum.id}>
                    {curriculum.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={addCurriculum}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 w-full sm:w-auto"
              >
                Add
              </button>
            </div>
            {selectedCurriculums.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[300px] border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left text-sm font-medium">Curriculum Name</th>
                      <th className="border p-2 text-left text-sm font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCurriculums.map((curriculumId) => {
                      const curriculum = curriculums.find((c) => c.id === curriculumId);
                      return (
                        <tr key={curriculumId}>
                          <td className="border p-2 text-sm">{curriculum?.name}</td>
                          <td className="border p-2">
                            <button
                              type="button"
                              onClick={() => removeCurriculum(curriculumId)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Remove
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
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Meeting Platform</label>
          <select
            value={meetingPlatform}
            onChange={(e) => setMeetingPlatform(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a platform</option>
            <option value="Zoom">Zoom</option>
            <option value="Google">Google Meet</option>
            <option value="Teams">Microsoft Teams</option>
          </select>
        </div>

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
  );
};

export default CreateSession;