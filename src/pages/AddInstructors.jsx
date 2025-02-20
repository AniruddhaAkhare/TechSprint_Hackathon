// import React, { useState } from "react";

// const AddInstructors = () => {
//   const [mode, setMode] = useState("manual");
//   const [instructors, setInstructors] = useState([
//     { name: "", email: "", mobile: "", password: "", branch: "" },
//   ]);

//   const handleInputChange = (index, field, value) => {
//     const updatedInstructors = [...instructors];
//     updatedInstructors[index][field] = value;
//     setInstructors(updatedInstructors);
//   };

//   const addInstructorRow = () => {
//     setInstructors([
//       ...instructors,
//       { name: "", email: "", mobile: "", password: "", branch: "" },
//     ]);
//   };

//   const removeInstructorRow = (index) => {
//     const updatedInstructors = instructors.filter((_, i) => i !== index);
//     setInstructors(updatedInstructors);
//   };

//   const handleModeChange = (newMode) => setMode(newMode);

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-md">
//       <button className="mb-4 text-blue-500 flex items-center font-bold">
//         <span className="mr-2">&larr;</span> Back
//       </button>
//       <h1 className="text-2xl font-bold mb-4">Add Instructors</h1>

//       <div className="flex space-x-4 mb-6">
//         <button
//           className={`p-2 border rounded-lg ${
//             mode === "manual" ? "border-blue-500 text-blue-500" : "border-gray-300"
//           }`}
//           onClick={() => handleModeChange("manual")}
//         >
//           Enter details manually
//           <p className="text-sm text-gray-500">
//             Enter the details of one or more instructors manually
//           </p>
//         </button>
//         <button
//           className={`p-2 border rounded-lg ${
//             mode === "upload" ? "border-blue-500 text-blue-500" : "border-gray-300"
//           }`}
//           onClick={() => handleModeChange("upload")}
//         >
//           Upload file
//           <p className="text-sm text-gray-500">
//             Upload a file with the instructor's details
//           </p>
//         </button>
//       </div>

//       {mode === "manual" && (
//         <>
//           <table className="w-full border-collapse bg-white shadow-sm rounded-lg mb-4">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-3 text-left">Name</th>
//                 <th className="p-3 text-left">Email</th>
//                 <th className="p-3 text-left">Mobile Number</th>
//                 <th className="p-3 text-left">Password</th>
//                 <th className="p-3 text-left">Branch</th>
//                 <th className="p-3 text-left">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {instructors.map((instructor, index) => (
//                 <tr key={index} className="border-b">
//                   <td className="p-3">
//                     <input
//                       type="text"
//                       placeholder="Enter name"
//                       className="p-2 border rounded-lg w-full"
//                       value={instructor.name}
//                       onChange={(e) =>
//                         handleInputChange(index, "name", e.target.value)
//                       }
//                     />
//                   </td>
//                   <td className="p-3">
//                     <input
//                       type="email"
//                       placeholder="Enter email address"
//                       className="p-2 border rounded-lg w-full"
//                       value={instructor.email}
//                       onChange={(e) =>
//                         handleInputChange(index, "email", e.target.value)
//                       }
//                     />
//                   </td>
//                   <td className="p-3">
//                     <div className="flex items-center space-x-2">
//                       <span className="border p-2 rounded-lg">+91</span>
//                       <input
//                         type="text"
//                         placeholder="Enter mobile number"
//                         className="p-2 border rounded-lg w-full"
//                         value={instructor.mobile}
//                         onChange={(e) =>
//                           handleInputChange(index, "mobile", e.target.value)
//                         }
//                       />
//                     </div>
//                   </td>
//                   <td className="p-3">
//                     <input
//                       type="password"
//                       placeholder="Enter password"
//                       className="p-2 border rounded-lg w-full"
//                       value={instructor.password}
//                       onChange={(e) =>
//                         handleInputChange(index, "password", e.target.value)
//                       }
//                     />
//                   </td>
//                   <td className="p-3">
//                     <select
//                       className="p-2 border rounded-lg w-full"
//                       value={instructor.branch}
//                       onChange={(e) =>
//                         handleInputChange(index, "branch", e.target.value)
//                       }
//                     >
//                       <option value="">Select Branch</option>
//                       <option value="Fireblaze">Fireblaze</option>
//                       <option value="Techspire">Techspire</option>
//                     </select>
//                   </td>
//                   <td className="p-3">
//                     {instructors.length > 1 && (
//                       <button
//                         className="text-red-500 hover:underline"
//                         onClick={() => removeInstructorRow(index)}
//                       >
//                         Remove
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <button
//             className="text-blue-500 hover:underline"
//             onClick={addInstructorRow}
//           >
//             + Add Another Instructor
//           </button>
//         </>
//       )}

//       {mode === "upload" && (
//         <div className="border rounded-lg p-6 bg-gray-50 text-gray-600">
//           <p className="mb-2">Upload a CSV file with instructor details.</p>
//           <input type="file" className="p-2 border rounded-lg w-full" />
//         </div>
//       )}

//       <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg">
//         Register Instructors
//       </button>
//     </div>
//   );
// };

// export default AddInstructors;
