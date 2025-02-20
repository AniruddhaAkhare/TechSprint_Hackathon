// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
// import { db } from "../pages/components/firebase";

// export default function MyProfile() {
//     const { id } = useParams();
//     const [instructor, setInstructor] = useState(null);

//     useEffect(() => {
//         const fetchInstructorData = async () => {
//             try {
//                 const instructorRef = collection(db, "Instructor");
//                 const q = query(instructorRef, where("uid", "==", id));
//                 const querySnapshot = await getDocs(q);

//                 if (!querySnapshot.empty) {
//                     setInstructor(querySnapshot.docs[0].data());
//                 } else {
//                     console.log("Instructor not found");
//                 }
//             } catch (error) {
//                 console.error("Error fetching instructor data:", error);
//             }
//         };
        
//         fetchInstructorData();
//     }, [id]);

//     if (!instructor) {
//         return <div className="text-center mt-10">Loading...</div>;
//     }

//     return (
//         <div className="ml-[20rem] max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
//             <h2 className="text-2xl font-bold mb-4">My Profile</h2>
//             {instructor ? (
//                 <>
//                     <p><strong>First Name:</strong> {instructor.f_name}</p>
//                     <p><strong>Last Name:</strong> {instructor.l_name}</p>
//                     <p><strong>Email:</strong> {instructor.email}</p>
//                     {instructor.phone && <p><strong>Phone:</strong> {instructor.phone}</p>}
//                     {instructor.specialization && <p><strong>Specialization:</strong> {instructor.specialization}</p>}
//                 </>
//             ) : (
//                 <p className="text-red-500">Profile information not available</p>
//             )}
//         </div>

//     );
// }
