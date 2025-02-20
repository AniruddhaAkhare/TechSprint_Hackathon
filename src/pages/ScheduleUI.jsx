// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import React, { useState } from 'react';
// import { setDoc, doc } from 'firebase/firestore';
// import { db } from "../config/firebase.js"; // Correct path
// import { auth } from '../config/firebase.js';

// export default function RegisterForm() {
//     const [f_name, setFirstName] = useState('');
//     const [l_name, setLastName] = useState('');
//     const [email, setEmail] = useState('');
//     const [phone, setPhone] = useState('');
//     const [specialization, setSpecialization] = useState('');
//     const [password, setPassword] = useState('');

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!f_name || !email || !phone || !password || !phone || !l_name) {
//             console.error("All fields are required.");
//             return;
//         }

//         try {
//             const adminCredential = await createUserWithEmailAndPassword(auth, email, password);
//             const admin = adminCredential.user;

//             console.log("Admin registered:", admin);

//             if (admin) {
//                 await setDoc(doc(db, "Instructor", admin.uid), {
//                     f_name: f_name,
//                     l_name: l_name,
//                     email: admin.email,
//                     phone: phone,
//                     specialization: specialization
//                 });
//                 console.log("Admin data stored in Firestore.");
//             }
//             alert("Admin registered successfully");
//             window.location.href = "/";
//             console.log("Admin registered successfully");

//         } catch (err) {
//             alert("Admin already registered")
//             console.log("Admin already registered");
//         }
//     };

//     return (
//         <div className='h-screen flex items-center justify-center min-h-screen bg-gray-100 w-screen'>
//             <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
//                 <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
//                 <input
//                     className="border border-gray-300 bg-white p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     type="text"
//                     value={f_name}
//                     onChange={(e) => setFirstName(e.target.value)}
//                     required
//                 />
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
//                 <input
//                     className="border border-gray-300 bg-white p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     type="text"
//                     value={l_name}
//                     onChange={(e) => setLastName(e.target.value)}
//                     required
//                 />
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                 <input
//                     className="border border-gray-300 bg-white p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                 />
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
//                 <input
//                     className="border border-gray-300 bg-white p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     type="tel"
//                     value={phone}
//                     onChange={(e) => setPhone(e.target.value)}
//                     required
//                 />
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
//                 <input
//                     className="border border-gray-300 bg-white p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     type="text"
//                     value={specialization}
//                     onChange={(e) => setSpecialization(e.target.value)}
//                 />
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//                 <input
//                     className="border border-gray-300 bg-white p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                 />
//                 <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200">Register</button>
//                 <p className="mt-4 text-center text-sm text-gray-600">Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login here</a></p>
//             </form>
//         </div>
//     );
// }
