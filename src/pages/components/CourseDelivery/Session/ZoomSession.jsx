// // import React from 'react';
// // import { useLocation } from 'react-router-dom';

// // const ZoomSession = () => {
// //     const location = useLocation();
// //     const { sessionData } = location.state || {};

// //     if (!sessionData) {
// //         return <p>No session data found.</p>;
// //     }

// //     // Generate Zoom Meeting Link (Placeholder)
// //     const zoomMeetingLink = `https://zoom.us/j/${Math.floor(1000000000 + Math.random() * 9000000000)}`;

// //     return (
// //         <div className="flex-col w-screen ml-80 p-4">
// //         <div className="justify-between items-center p-4 mb-4">
// //         {/* <div className="p-6"> */}
// //             <h1 className="text-xl font-bold">Zoom Meeting Details</h1>
// //             <p><strong>Session Name:</strong> {sessionData.name}</p>
// //             <p><strong>Date:</strong> {sessionData.date}</p>
// //             <p><strong>Time:</strong> {sessionData.startTime} - {sessionData.endTime}</p>
// //             <p><strong>Meeting Link:</strong> <a href={zoomMeetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-500">{zoomMeetingLink}</a></p>

// //             <h2 className="mt-4 font-bold">Instructors</h2>
// //             <ul>
// //                 {sessionData.instructors.map(inst => (
// //                     <li key={inst.id}>{inst.f_name} - {inst.email}</li>
// //                 ))}
// //             </ul>

// //             <h2 className="mt-4 font-bold">Students</h2>
// //             <ul>
// //                 {sessionData.students.map(student => (
// //                     <li key={student.id}>{student.first_name} - {student.email}</li>
// //                 ))}
// //             </ul>
// //         </div>
// //         </div>
// //     );
// // };

// // export default ZoomSession;


// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { db } from '../../../../config/firebase' // Import Firestore
// import { collection, query, where, getDocs } from 'firebase/firestore';

// const ZoomSession = () => {
//     const location = useLocation();
//     const { sessionData } = location.state || {};

//     const [studentsData, setStudentsData] = useState([]);
//     const [instructorsData, setInstructorsData] = useState([]);

//     if (!sessionData) {
//         return <p>No session data found.</p>;
//     }

//     // 🔹 Fetch user details from Firestore
//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 // Fetch instructors' data
//                 if (sessionData.instructors.length > 0) {
//                     const instructorQuery = query(
//                         collection(db, 'Instructor'),
//                         where('email', 'in', sessionData.instructors)
//                     );
//                     const instructorSnapshot = await getDocs(instructorQuery);
//                     setInstructorsData(instructorSnapshot.docs.map(doc => doc.data()));
//                 }

//                 // Fetch students' data
//                 if (sessionData.students.length > 0) {
//                     const studentQuery = query(
//                         collection(db, 'Students'),
//                         where('email', 'in', sessionData.students)
//                     );
//                     const studentSnapshot = await getDocs(studentQuery);
//                     setStudentsData(studentSnapshot.docs.map(doc => doc.data()));
//                 }
//             } catch (error) {
//                 console.error("Error fetching user details:", error);
//             }
//         };

//         fetchUsers();
//     }, [sessionData]);

//     // Generate Zoom Meeting Link (Placeholder)
//     const zoomMeetingLink = `https://zoom.us/j/${Math.floor(1000000000 + Math.random() * 9000000000)}`;

//     return (
//         <div className="flex-col w-screen ml-80 p-4">
//             <div className="justify-between items-center p-4 mb-4">
//                 <h1 className="text-xl font-bold">Zoom Meeting Details</h1>
//                 <p><strong>Session Name:</strong> {sessionData.name}</p>
//                 <p><strong>Date:</strong> {sessionData.date}</p>
//                 <p><strong>Time:</strong> {sessionData.startTime} - {sessionData.endTime}</p>
//                 <p><strong>Meeting Link:</strong> <a href={zoomMeetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-500">{zoomMeetingLink}</a></p>

//                 {/* Instructors List */}
//                 <h2 className="mt-4 font-bold">Instructors</h2>
//                 <ul>
//                     {instructorsData.map((inst, index) => (
//                         <li key={index}>{inst.f_name} {inst.l_name} - {inst.email}</li>
//                     ))}
//                 </ul>

//                 {/* Students List */}
//                 <h2 className="mt-4 font-bold">Students</h2>
//                 <ul>
//                     {studentsData.map((student, index) => (
//                         <li key={index}>{student.first_name} {student.last_name} - {student.email}</li>
//                     ))}
//                 </ul>
//             </div>
//         </div>
//     );
// };

// export default ZoomSession;


import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { db } from '../../../../config/firebase'; // Import Firestore
import { collection, query, where, getDocs } from 'firebase/firestore';

const ZoomSession = () => {
    const location = useLocation();
    const { sessionData } = location.state || {};

    const [studentsData, setStudentsData] = useState([]);
    const [instructorsData, setInstructorsData] = useState([]);

    if (!sessionData) {
        return <p>No session data found.</p>;
    }

    // 🔹 Fetch selected users' names from Firestore
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Fetch selected instructors
                if (sessionData.instructors.length > 0) {
                    const instructorQuery = query(
                        collection(db, 'Instructor'),
                        where('email', 'in', sessionData.instructors)
                    );
                    const instructorSnapshot = await getDocs(instructorQuery);
                    setInstructorsData(instructorSnapshot.docs.map(doc => doc.data().f_name + " " + doc.data().l_name + " - " + doc.data().email));
                }

                // Fetch selected students
                if (sessionData.students.length > 0) {
                    const studentQuery = query(
                        collection(db, 'student'),
                        where('email', 'in', sessionData.students)
                    );
                    const studentSnapshot = await getDocs(studentQuery);
                    setStudentsData(studentSnapshot.docs.map(doc => doc.data().first_name + " " + doc.data().last_name+ " - " + doc.data().email));
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        fetchUsers();
    }, [sessionData]);

    // Generate Zoom Meeting Link (Placeholder)
    const zoomMeetingLink = `https://zoom.us/j/${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    return (
        <div className="flex-col w-screen ml-80 p-4">
            <div className="justify-between items-center p-4 mb-4">
                <h1 className="text-xl font-bold">Zoom Meeting Details</h1>
                <p><strong>Session Name:</strong> {sessionData.name}</p>
                <p><strong>Date:</strong> {sessionData.date}</p>
                <p><strong>Time:</strong> {sessionData.startTime} - {sessionData.endTime}</p>
                <p><strong>Meeting Link:</strong> <a href={zoomMeetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-500">{zoomMeetingLink}</a></p>

                {/* Instructors List */}
                <h2 className="mt-4 font-bold">Instructors</h2>
                <ul>
                    {instructorsData.map((name, index, email) => (
                        <li key={index}>{name}</li>
                    ))}
                </ul>

                {/* Students List */}
                <h2 className="mt-4 font-bold">Students</h2>
                <ul>
                    {studentsData.map((first_name, index) => (
                        <li key={index}>{first_name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ZoomSession;
