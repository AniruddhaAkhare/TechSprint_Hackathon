// // import { useState, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import React from 'react';
// // import { db } from '../config/firebase';
// // import { getDocs, collection, addDoc } from 'firebase/firestore';
// // import Auth from "../components/Auth.jsx";

// // const Attendence = () => {
// //     const [students, setStudents] = useState([]);
// //     const [sessionDate, setSessionDate] = useState("");
// //     const [attendance, setAttendance] = useState({});
// //     const [sessions, setSessions] = useState([]);

// //     useEffect(() => {
// //         const fetchStudents = async () => {
// //             const studentCollection = collection(db, "students");
// //             const studentSnapshot = await getDocs(studentCollection);
// //             const studentList = studentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// //             setStudents(studentList);
// //         };
// //         fetchStudents();
// //     }, []);

// //     const handleAttendanceChange = (studentId, status) => {
// //         setAttendance(prev => ({ ...prev, [studentId]: status }));
// //     };

// //     const handleAddSession = () => {
// //         setSessions(prev => [...prev, { date: sessionDate, attendance }]);
// //         setSessionDate("");
// //         setAttendance({});
// //     };

// //     const handleSubmit = async (e) => {
// //         e.preventDefault();
// //         const attendanceData = {
// //             date: sessionDate,
// //             attendance: attendance,
// //         };
// //         await addDoc(collection(db, "attendance"), attendanceData);
// //         alert("Attendance recorded successfully!");
// //     };

// //     return (
// //         <div>
// //             <h1>Attendance Management</h1>
// //             <form onSubmit={handleSubmit}>
// //                 <label>
// //                     Session Date:
// //                     <input type="date" value={sessionDate} onChange={(e) => setSessionDate(e.target.value)} required />
// //                 </label>
// //                 <button type="button" onClick={handleAddSession}>Add Session</button>
// //                 <table>
// //                     <thead>
// //                         <tr>
// //                             <th>Student ID</th>
// //                             <th>Student Name</th>
// //                             <th>Sessions</th>
// //                             <th>Present/Absent</th>
// //                         </tr>
// //                     </thead>
// //                     <tbody>
// //                         {students.map(student => (
// //                             <tr key={student.id}>
// //                                 <td>{student.id}</td>
// //                                 <td>{student.name}</td>
// //                                 <td>
// //                                     <select onChange={(e) => handleAttendanceChange(student.id, e.target.value)} defaultValue="">
// //                                         <option value="" disabled>Select</option>
// //                                         <option value="Present">Present</option>
// //                                         <option value="Absent">Absent</option>
// //                                     </select>
// //                                 </td>
// //                             </tr>
// //                         ))}
// //                     </tbody>
// //                 </table>
// //                 <button type="submit">Submit Attendance</button>
// //             </form>
// //         </div>
// //     );
// // };

// // export default Attendence;


// import React, { useState, useEffect } from "react";
// import { db } from "../config/firebase"; // Ensure you have a firebase.js config file
// import { collection, getDocs, updateDoc, doc, setDoc } from "firebase/firestore";
// // import { Button, Table } from "../components/ui";
// import { Button, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

// const Attendance = () => {
//   const [students, setStudents] = useState([]);
//   const [sessions, setSessions] = useState([]);

//   useEffect(() => {
//     const fetchStudents = async () => {
//       const querySnapshot = await getDocs(collection(db, "attendance"));
//       const studentList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//       setStudents(studentList);
//     };
//     fetchStudents();
//   }, []);

//   const handleInputChange = (studentId, sessionIndex, value) => {
//     const updatedStudents = students.map((student) => {
//       if (student.id === studentId) {
//         const updatedSessions = [...student.sessions];
//         updatedSessions[sessionIndex] = value;
//         return { ...student, sessions: updatedSessions };
//       }
//       return student;
//     });
//     setStudents(updatedStudents);
//   };

//   const addSession = () => {
//     setSessions((prevSessions) => [...prevSessions, `Session ${prevSessions.length + 1}`]);
//     setStudents((prevStudents) =>
//       prevStudents.map((s) => ({ ...s, sessions: [...s.sessions, ""] }))
//     );
//   };

//   const saveAttendance = async (student) => {
//     const studentRef = doc(db, "attendance", student.id);
//     await setDoc(studentRef, { sessions: student.sessions }, { merge: true });
//   };

//   return (
//     <div className="p-4">
//       <Table>
//         <thead>
//           <tr>
//             <th>Student ID</th>
//             <th>Student Name</th>
//             {sessions.map((session, index) => (
//               <th key={index}>{session}</th>
//             ))}
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {students.map((student) => (
//             <tr key={student.id}>
//               <td>{student.id}</td>
//               <td>{student.student_name}</td>
//               {sessions.map((_, index) => (
//                 <td key={index}>
//                   <input
//                     type="text"
//                     value={student.sessions[index] || ""}
//                     onChange={(e) => handleInputChange(student.id, index, e.target.value)}
//                   />
//                 </td>
//               ))}
//               <td>
//                 <Button onClick={() => saveAttendance(student)}>Save</Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//       <Button onClick={addSession} className="mt-4">Add Session</Button>
//     </div>
//   );
// };

// export default Attendance;


// import React, { useState, useEffect } from "react";
// import { db } from "../config/firebase"; // Ensure you have a firebase.js config file
// import { collection, getDocs, updateDoc, doc, setDoc } from "firebase/firestore";
// import * as XLSX from "xlsx";
// import Button from "../components/ui/Button"

// const Attendance = () => {
//   const [students, setStudents] = useState([]);

//   useEffect(() => {
//     const fetchStudents = async () => {
//       const querySnapshot = await getDocs(collection(db, "attendance"));
//       const studentList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//       setStudents(studentList);
//     };
//     fetchStudents();
//   }, []);

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     const reader = new FileReader();

//     reader.onload = (e) => {
//       const data = new Uint8Array(e.target.result);
//       const workbook = XLSX.read(data, { type: "array" });
//       const sheetName = workbook.SheetNames[0];
//       const sheet = workbook.Sheets[sheetName];
//       const parsedData = XLSX.utils.sheet_to_json(sheet);

//       parsedData.forEach(async (student) => {
//         const studentRef = doc(db, "attendance", student.student_id.toString());
//         await setDoc(studentRef, student, { merge: true });
//       });
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   return (
//     <div className="p-4">
//       <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="mb-4" />
//       <Button as="label" htmlFor="file-input" className="mt-4 cursor-pointer">
//         Upload Attendance File
//       </Button>
//     </div>
//   );
// };

// export default Attendance;


import React, { useState, useEffect } from "react";
import { db } from "../config/firebase"; // Ensure you have a firebase.js config file
import { collection, getDocs, updateDoc, doc, setDoc } from "firebase/firestore";
import Button from "../components/ui/Button";

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    const fetchStudents = async () => {
      const querySnapshot = await getDocs(collection(db, "attendance"));
      const studentList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setStudents(studentList);
      const initialAttendance = studentList.reduce((acc, student) => {
        acc[student.id] = "Absent";
        return acc;
      }, {});
      setAttendance(initialAttendance);
    };
    fetchStudents();
  }, []);
//   console.log({student.first_name});
  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const submitAttendance = async () => {
    for (const studentId in attendance) {
      const studentRef = doc(db, "attendance", studentId);
      await updateDoc(studentRef, { status: attendance[studentId] });
    }
    alert("Attendance submitted successfully!");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Student Attendance</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Student Name</th>
            <th className="border border-gray-300 px-4 py-2">Attendance</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
              <tr key={student.id}>
                
              <td className="border border-gray-300 px-4 py-2">{student.first_name}</td>
              <td className="border border-gray-300 px-4 py-2">
                <select
                  value={attendance[student.id]}
                  onChange={(e) => handleAttendanceChange(student.id, e.target.value)}
                  className="px-2 py-1 border rounded"
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button onClick={submitAttendance} className="mt-4">Submit Attendance</Button>
    </div>
  );
};

export default Attendance;