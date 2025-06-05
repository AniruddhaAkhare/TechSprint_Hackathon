// // import React, { useState, useEffect } from "react";
// // import { collection, query, getDocs } from "firebase/firestore";
// // import { db } from "../../../config/firebase";

// // const DetailedForm = ({
// //   newTodo,
// //   setNewTodo,
// //   onSubmit,
// //   onClose,
// //   setIsDetailedForm,
// //   formatDateSafely,
// //   isDatePickerOpen,
// //   setIsDatePickerOpen,
// //   predefinedDates,
// //   selectedMonth,
// //   setSelectedMonth,
// //   selectedYear,
// //   setSelectedYear,
// //   daysInMonth,
// //   firstDayOfMonth,
// //   days,
// //   emptyDays,
// //   handleDateSelect,
// //   handlePredefinedDateSelect,
// //   handleMonthChange,
// //   error,
// // }) => {
// //   const [users, setUsers] = useState([]);
// //   const [enquiries, setEnquiries] = useState([]);
// //   const [companies, setCompanies] = useState([]);
// //   const [students, setStudents] = useState([]);
// //   const currentUser = { uid: "user123", displayName: "Current User" };

// //   // Fetch dropdown data from Firestore
// //   const fetchDropdownData = async () => {
// //     try {
// //       const usersQuery = query(collection(db, "Users"));
// //       const usersSnapshot = await getDocs(usersQuery);
// //       setUsers(usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

// //       const enquiriesQuery = query(collection(db, "enquiries"));
// //       const enquiriesSnapshot = await getDocs(enquiriesQuery);
// //       setEnquiries(enquiriesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

// //       const companiesQuery = query(collection(db, "Companies"));
// //       const companiesSnapshot = await getDocs(companiesQuery);
// //       setCompanies(companiesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

// //       const studentsQuery = query(collection(db, "student"));
// //       const studentsSnapshot = await getDocs(studentsQuery);
// //       setStudents(studentsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
// //     } catch (error) {
// //       console.error(`Failed to fetch dropdown data: ${error.message}`);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchDropdownData();
// //   }, []);

// //   const handleTodoChange = (e) => {
// //     const { name, value, type, checked } = e.target;
// //     setNewTodo((prev) => ({
// //       ...prev,
// //       [name]: type === "checkbox" ? checked : value,
// //     }));
// //   };

// //   const handleAddAnother = async (e) => {
// //     e.preventDefault();
// //     await onSubmit(e);
// //     setNewTodo({
// //       description: "",
// //       module: "self",
// //       assignedTo: currentUser.displayName,
// //       dueDate: "",
// //       hotlead: false,
// //       createdBy: currentUser.displayName,
// //       enquiry: "",
// //       company: "",
// //       student: "",
// //     });
// //   };

// //   return (
// //     <form onSubmit={onSubmit} className="space-y-4">
// //       {error && (
// //         <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">
// //           {error}
// //         </div>
// //       )}
// //       <div>
// //         <label className="block text-sm font-medium text-gray-700">Task name</label>
// //         <input
// //           type="text"
// //           name="description"
// //           value={newTodo.description}
// //           onChange={handleTodoChange}
// //           className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
// //           placeholder="Enter task name"
// //         />
// //       </div>
// //       <div>
// //         <label className="block text-sm font-medium text-gray-700">Description</label>
// //         <textarea
// //           name="descriptionDetail"
// //           value={newTodo.description}
// //           onChange={(e) =>
// //             setNewTodo((prev) => ({ ...prev, description: e.target.value }))
// //           }
// //           className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
// //           placeholder="Enter task description"
// //         />
// //       </div>
// //       <div>
// //         <label className="block text-sm font-medium text-gray-700">Assignee</label>
// //         <div className="flex items-center gap-2">
// //           <select
// //             name="assignedTo"
// //             value={newTodo.assignedTo}
// //             onChange={handleTodoChange}
// //             className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
// //           >
// //             {users.map((user) => (
// //               <option key={user.id} value={user.displayName}>
// //                 {user.displayName}
// //               </option>
// //             ))}
// //           </select>
// //           <button type="button" className="text-blue-600 hover:text-blue-700 text-sm">
// //             + Add more
// //           </button>
// //         </div>
// //       </div>
// //       <div>
// //         <label className="block text-sm font-medium text-gray-700">Created by</label>
// //         <div className="flex items-center gap-2">
// //           <select
// //             name="createdBy"
// //             value={newTodo.createdBy}
// //             onChange={handleTodoChange}
// //             className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
// //           >
// //             {users.map((user) => (
// //               <option key={user.id} value={user.displayName}>
// //                 {user.displayName}
// //               </option>
// //             ))}
// //           </select>
// //           <button type="button" className="text-blue-600 hover:text-blue-700 text-sm">
// //             Change
// //           </button>
// //         </div>
// //       </div>
// //       <div className="relative">
// //         <label className="block text-sm font-medium text-gray-700">Deadline</label>
// //         <input
// //           type="text"
// //           value={newTodo.dueDate ? formatDateSafely(newTodo.dueDate) : "No deadline"}
// //           onClick={() => setIsDatePickerOpen(true)}
// //           className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm cursor-pointer"
// //           readOnly
// //         />
// //         {isDatePickerOpen && (
// //           <div className="absolute z-10 bg-white border border-gray-300 rounded-lg p-4 mt-1 w-72 shadow-lg">
// //             <div className="mb-4">
// //               {predefinedDates.map((option, index) => (
// //                 <button
// //                   key={index}
// //                   type="button"
// //                   onClick={() => handlePredefinedDateSelect(option.date)}
// //                   className="block w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
// //                 >
// //                   {option.label}, {format(option.date, "EEEE, MMM d")}
// //                 </button>
// //               ))}
// //             </div>
// //             <div className="flex justify-between items-center mb-2">
// //               <button
// //                 type="button"
// //                 onClick={() => handleMonthChange("prev")}
// //                 className="text-gray-500 hover:text-gray-700"
// //               >
// //                 &lt;
// //               </button>
// //               <span className="text-sm font-medium">
// //                 {format(new Date(selectedYear, selectedMonth), "MMM yyyy")}
// //               </span>
// //               <button
// //                 type="button"
// //                 onClick={() => handleMonthChange("next")}
// //                 className="text-gray-500 hover:text-gray-700"
// //               >
// //                 &gt;
// //               </button>
// //             </div>
// //             <div className="grid grid-cols-7 gap-1 text-center text-sm">
// //               {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
// //                 <div key={index} className="text-gray-500 font-medium">
// //                   {day}
// //                 </div>
// //               ))}
// //               {emptyDays.map((_, index) => (
// //                 <div key={`empty-${index}`} />
// //               ))}
// //               {days.map((day) => (
// //                 <button
// //                   key={day}
// //                   type="button"
// //                   onClick={() => handleDateSelect(new Date(selectedYear, selectedMonth, day))}
// //                   className={`p-1 rounded-full hover:bg-blue-100 ${
// //                     day === new Date().getDate() &&
// //                     selectedMonth === new Date().getMonth() &&
// //                     selectedYear === new Date().getFullYear()
// //                       ? "bg-blue-500 text-white"
// //                       : "text-gray-700"
// //                   }`}
// //                 >
// //                   {day}
// //                 </button>
// //               ))}
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //       <div>
// //         <label className="block text-sm font-medium text-gray-700">Module</label>
// //         <select
// //           name="module"
// //           value={newTodo.module}
// //           onChange={handleTodoChange}
// //           className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
// //         >
// //           <option value="self">Self</option>
// //           <option value="enquiry">Enquiry</option>
// //           <option value="company">Company</option>
// //           <option value="student">Student</option>
// //         </select>
// //       </div>
// //       {newTodo.module === "enquiry" && (
// //         <div>
// //           <label className="block text-sm font-medium text-gray-700">Enquiry</label>
// //           <select
// //             name="enquiry"
// //             value={newTodo.enquiry}
// //             onChange={handleTodoChange}
// //             className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
// //           >
// //             <option value="">Select Enquiry</option>
// //             {enquiries.map((enquiry) => (
// //               <option key={enquiry.id} value={enquiry.name}>
// //                 {enquiry.name}
// //               </option>
// //             ))}
// //           </select>
// //         </div>
// //       )}
// //       {newTodo.module === "company" && (
// //         <div>
// //           <label className="block text-sm font-medium text-gray-700">Company</label>
// //           <select
// //             name="company"
// //             value={newTodo.company}
// //             onChange={handleTodoChange}
// //             className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
// //           >
// //             <option value="">Select Company</option>
// //             {companies.map((company) => (
// //               <option key={company.id} value={company.name}>
// //                 {company.name}
// //               </option>
// //             ))}
// //           </select>
// //         </div>
// //       )}
// //       {newTodo.module === "student" && (
// //         <div>
// //           <label className="block text-sm font-medium text-gray-700">Student</label>
// //           <select
// //             name="student"
// //             value={newTodo.student}
// //             onChange={handleTodoChange}
// //             className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
// //           >
// //             <option value="">Select Student</option>
// //             {students.map((student) => (
// //               <option key={student.id} value={student.Name}>
// //                 {student.Name}
// //               </option>
// //             ))}
// //           </select>
// //         </div>
// //       )}
// //       {newTodo.module === "self" && (
// //         <div>
// //           <label className="block text-sm font-medium text-gray-700">Self</label>
// //           <input
// //             type="text"
// //             value={currentUser.displayName}
// //             readOnly
// //             className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm bg-gray-100"
// //           />
// //         </div>
// //       )}
// //       <div>
// //         <label className="flex items-center gap-2">
// //           <input
// //             type="checkbox"
// //             name="hotlead"
// //             checked={newTodo.hotlead}
// //             onChange={handleTodoChange}
// //             className="h-4 w-4 text-blue-600 border-gray-300 rounded"
// //           />
// //           <span className="text-sm font-medium text-gray-700">Hotlead</span>
// //         </label>
// //       </div>
// //       <div className="flex gap-2 flex-wrap">
// //         <button
// //           type="submit"
// //           className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
// //         >
// //           Add task
// //         </button>
// //         <button
// //           type="button"
// //           onClick={handleAddAnother}
// //           className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
// //         >
// //           Add task & create another one
// //         </button>
// //         <button
// //           type="button"
// //           onClick={() => {
// //             onClose();
// //             setIsDetailedForm(false);
// //           }}
// //           className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
// //         >
// //           Cancel
// //         </button>
// //         <button
// //           type="button"
// //           onClick={() => setIsDetailedForm(false)}
// //           className="px-4 py-2 text-blue-600 hover:text-blue-700 text-sm"
// //         >
// //           Simple form
// //         </button>
// //       </div>
// //     </form>
// //   );
// // };

// // export default DetailedForm;






// import React, { useState, useEffect } from "react";
// import { collection, query, getDocs } from "firebase/firestore";
// import { db } from "../../../config/firebase";

// const DetailedForm = ({
//   newTodo,
//   setNewTodo,
//   onSubmit,
//   onClose,
//   setIsDetailedForm,
//   formatDateSafely,
//   isDatePickerOpen,
//   setIsDatePickerOpen,
//   predefinedDates,
//   selectedMonth,
//   setSelectedMonth,
//   selectedYear,
//   setSelectedYear,
//   daysInMonth,
//   firstDayOfMonth,
//   days,
//   emptyDays,
//   handleDateSelect,
//   handlePredefinedDateSelect,
//   handleMonthChange,
//   error,
// }) => {
//   const [users, setUsers] = useState([]);
//   const [enquiries, setEnquiries] = useState([]);
//   const [companies, setCompanies] = useState([]);
//   const [students, setStudents] = useState([]);
//   const currentUser = { uid: "user123", displayName: "Current User" };

//   // Fetch dropdown data from Firestore
//   const fetchDropdownData = async () => {
//     try {
//       const usersQuery = query(collection(db, "Users"));
//       const usersSnapshot = await getDocs(usersQuery);
//       setUsers(usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

//       const enquiriesQuery = query(collection(db, "enquiries"));
//       const enquiriesSnapshot = await getDocs(enquiriesQuery);
//       setEnquiries(enquiriesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

//       const companiesQuery = query(collection(db, "Companies"));
//       const companiesSnapshot = await getDocs(companiesQuery);
//       setCompanies(companiesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

//       const studentsQuery = query(collection(db, "student"));
//       const studentsSnapshot = await getDocs(studentsQuery);
//       setStudents(studentsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
//     } catch (error) {
//       console.error(`Failed to fetch dropdown data: ${error.message}`);
//     }
//   };

//   useEffect(() => {
//     fetchDropdownData();
//   }, []);

//   const handleTodoChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setNewTodo((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleAddAnother = async (e) => {
//     e.preventDefault();
//     await onSubmit(e);
//     setNewTodo({
//       description: "",
//       module: "self",
//       assignedTo: currentUser.displayName,
//       dueDate: "",
//       hotlead: false,
//       createdBy: currentUser.displayName,
//       enquiry: "",
//       company: "",
//       student: "",
//     });
//   };

//   return (
//     <form onSubmit={onSubmit} className="space-y-6">
//       {/* Error Message */}
//       {error && (
//         <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
//           {error}
//         </div>
//       )}

//       {/* Task Name and Description */}
//       <div className="space-y-4">
//         <div>
//           <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
//             Task name <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             id="description"
//             name="description"
//             value={newTodo.description}
//             onChange={handleTodoChange}
//             className="p-3 w-full border border-gray-300 rounded-md text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//             placeholder="Enter task name"
//           />
//         </div>
//         <div>
//           <label htmlFor="descriptionDetail" className="block text-sm font-medium text-gray-700 mb-1">
//             Description
//           </label>
//           <textarea
//             id="descriptionDetail"
//             name="descriptionDetail"
//             value={newTodo.description}
//             onChange={(e) =>
//               setNewTodo((prev) => ({ ...prev, description: e.target.value }))
//             }
//             className="p-3 w-full border border-gray-300 rounded-md text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 h-24 resize-y"
//             placeholder="Enter task description"
//           />
//         </div>
//       </div>

//       {/* Assignee and Created By */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <div>
//           <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">
//             Assignee
//           </label>
//           <div className="flex items-center gap-2">
//             <select
//               id="assignedTo"
//               name="assignedTo"
//               value={newTodo.assignedTo}
//               onChange={handleTodoChange}
//               className="p-3 w-full border border-gray-300 rounded-md text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//             >
//               {users.map((user) => (
//                 <option key={user.id} value={user.displayName}>
//                   {user.displayName}
//                 </option>
//               ))}
//             </select>
//             <button type="button" className="text-blue-600 hover:text-blue-700 text-sm whitespace-nowrap">
//               + Add more
//             </button>
//           </div>
//         </div>
//         <div>
//           <label htmlFor="createdBy" className="block text-sm font-medium text-gray-700 mb-1">
//             Created by
//           </label>
//           <div className="flex items-center gap-2">
//             <select
//               id="createdBy"
//               name="createdBy"
//               value={newTodo.createdBy}
//               onChange={handleTodoChange}
//               className="p-3 w-full border border-gray-300 rounded-md text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//             >
//               {users.map((user) => (
//                 <option key={user.id} value={user.displayName}>
//                   {user.displayName}
//                 </option>
//               ))}
//             </select>
//             <button type="button" className="text-blue-600 hover:text-blue-700 text-sm whitespace-nowrap">
//               Change
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Deadline and Module */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <div className="relative">
//           <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
//             Deadline
//           </label>
//           <input
//             type="text"
//             id="dueDate"
//             value={newTodo.dueDate ? formatDateSafely(newTodo.dueDate) : "No deadline"}
//             onClick={() => setIsDatePickerOpen(true)}
//             className="p-3 w-full border border-gray-300 rounded-md text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
//             readOnly
//           />
//           {isDatePickerOpen && (
//             <div className="absolute z-10 bg-white border border-gray-300 rounded-lg p-4 mt-1 w-72 shadow-lg">
//               <div className="mb-4">
//                 {predefinedDates.map((option, index) => (
//                   <button
//                     key={index}
//                     type="button"
//                     onClick={() => handlePredefinedDateSelect(option.date)}
//                     className="block w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
//                   >
//                     {option.label}, {format(option.date, "EEEE, MMM d")}
//                   </button>
//                 ))}
//               </div>
//               <div className="flex justify-between items-center mb-2">
//                 <button
//                   type="button"
//                   onClick={() => handleMonthChange("prev")}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   &lt;
//                 </button>
//                 <span className="text-sm font-medium">
//                   {format(new Date(selectedYear, selectedMonth), "MMM yyyy")}
//                 </span>
//                 <button
//                   type="button"
//                   onClick={() => handleMonthChange("next")}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   &gt;
//                 </button>
//               </div>
//               <div className="grid grid-cols-7 gap-1 text-center text-sm">
//                 {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
//                   <div key={index} className="text-gray-500 font-medium">
//                     {day}
//                   </div>
//                 ))}
//                 {emptyDays.map((_, index) => (
//                   <div key={`empty-${index}`} />
//                 ))}
//                 {days.map((day) => (
//                   <button
//                     key={day}
//                     type="button"
//                     onClick={() => handleDateSelect(new Date(selectedYear, selectedMonth, day))}
//                     className={`p-1 rounded-full hover:bg-blue-100 ${
//                       day === new Date().getDate() &&
//                       selectedMonth === new Date().getMonth() &&
//                       selectedYear === new Date().getFullYear()
//                         ? "bg-blue-500 text-white"
//                         : "text-gray-700"
//                     }`}
//                   >
//                     {day}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//         <div>
//           <label htmlFor="module" className="block text-sm font-medium text-gray-700 mb-1">
//             Module
//           </label>
//           <select
//             id="module"
//             name="module"
//             value={newTodo.module}
//             onChange={handleTodoChange}
//             className="p-3 w-full border border-gray-300 rounded-md text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//           >
//             <option value="self">Self</option>
//             <option value="enquiry">Enquiry</option>
//             <option value="company">Company</option>
//             <option value="student">Student</option>
//           </select>
//         </div>
//       </div>

//       {/* Module-Specific Dropdowns */}
//       <div className="space-y-4">
//         {newTodo.module === "enquiry" && (
//           <div>
//             <label htmlFor="enquiry" className="block text-sm font-medium text-gray-700 mb-1">
//               Enquiry
//             </label>
//             <select
//               id="enquiry"
//               name="enquiry"
//               value={newTodo.enquiry}
//               onChange={handleTodoChange}
//               className="p-3 w-full border border-gray-300 rounded-md text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="">Select Enquiry</option>
//               {enquiries.map((enquiry) => (
//                 <option key={enquiry.id} value={enquiry.name}>
//                   {enquiry.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}
//         {newTodo.module === "company" && (
//           <div>
//             <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
//               Company
//             </label>
//             <select
//               id="company"
//               name="company"
//               value={newTodo.company}
//               onChange={handleTodoChange}
//               className="p-3 w-full border border-gray-300 rounded-md text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="">Select Company</option>
//               {companies.map((company) => (
//                 <option key={company.id} value={company.name}>
//                   {company.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}
//         {newTodo.module === "student" && (
//           <div>
//             <label htmlFor="student" className="block text-sm font-medium text-gray-700 mb-1">
//               Student
//             </label>
//             <select
//               id="student"
//               name="student"
//               value={newTodo.student}
//               onChange={handleTodoChange}
//               className="p-3 w-full border border-gray-300 rounded-md text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="">Select Student</option>
//               {students.map((student) => (
//                 <option key={student.id} value={student.Name}>
//                   {student.Name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}
//         {newTodo.module === "self" && (
//           <div>
//             <label htmlFor="self" className="block text-sm font-medium text-gray-700 mb-1">
//               Self
//             </label>
//             <input
//               id="self"
//               type="text"
//               value={currentUser.displayName}
//               readOnly
//               className="p-3 w-full border border-gray-300 rounded-md text-sm bg-gray-100 shadow-sm"
//             />
//           </div>
//         )}
//       </div>

//       {/* Hotlead */}
//       <div>
//         <label className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             name="hotlead"
//             checked={newTodo.hotlead}
//             onChange={handleTodoChange}
//             className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//           />
//           <span className="text-sm font-medium text-gray-700">Hotlead</span>
//         </label>
//       </div>

//       {/* Buttons */}
//       <div className="flex flex-wrap gap-2 justify-between items-center border-t pt-4">
//         <div className="flex gap-2">
//           <button
//             type="submit"
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
//           >
//             Add task
//           </button>
//           <button
//             type="button"
//             onClick={handleAddAnother}
//             className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
//           >
//             Add task & create another one
//           </button>
//           <button
//             type="button"
//             onClick={() => {
//               onClose();
//               setIsDetailedForm(false);
//             }}
//             className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium"
//           >
//             Cancel
//           </button>
//         </div>
//         <button
//           type="button"
//           onClick={() => setIsDetailedForm(false)}
//           className="text-blue-600 hover:text-blue-700 text-sm font-medium"
//         >
//           Simple form
//         </button>
//       </div>
//     </form>
//   );
// };

// export default DetailedForm;


import React, { useState, useEffect } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../../../config/firebase";

const DetailedForm = ({
  newTodo,
  setNewTodo,
  onSubmit,
  onClose,
  setIsDetailedForm,
  formatDateSafely,
  isDatePickerOpen,
  setIsDatePickerOpen,
  predefinedDates,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  daysInMonth,
  firstDayOfMonth,
  days,
  emptyDays,
  handleDateSelect,
  handlePredefinedDateSelect,
  handleMonthChange,
  error,
}) => {
  const [users, setUsers] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [students, setStudents] = useState([]);
  const currentUser = { uid: "user123", displayName: "Current User" };

  // Fetch dropdown data from Firestore
  const fetchDropdownData = async () => {
    try {
      const usersQuery = query(collection(db, "Users"));
      const usersSnapshot = await getDocs(usersQuery);
      setUsers(usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      const enquiriesQuery = query(collection(db, "enquiries"));
      const enquiriesSnapshot = await getDocs(enquiriesQuery);
      setEnquiries(enquiriesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      const companiesQuery = query(collection(db, "Companies"));
      const companiesSnapshot = await getDocs(companiesQuery);
      setCompanies(companiesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      const studentsQuery = query(collection(db, "student"));
      const studentsSnapshot = await getDocs(studentsQuery);
      setStudents(studentsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error(`Failed to fetch dropdown data: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const handleTodoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewTodo((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      // Sync name and description
      ...(name === "name" && { description: value }),
      ...(name === "description" && { name: value }),
    }));
  };

  const handleAddAnother = async (e) => {
    e.preventDefault();
    await onSubmit(e);
    setNewTodo({
      name: "",
      description: "",
      module: "self",
      assignedTo: currentUser.displayName,
      dueDate: "",
      hotlead: false,
      createdBy: currentUser.displayName,
      enquiry: "",
      company: "",
      student: "",
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-50 flex items-center justify-center z-50 p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            {newTodo.id ? "Edit Task" : "Create Task"}
          </h2>
          <button
            onClick={() => {
              onClose();
              setIsDetailedForm(false);
            }}
            className="text-gray-500 hover:text-gray-700 text-lg"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Task Name and Description */}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Task name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newTodo.name}
                onChange={handleTodoChange}
                className="p-3 w-full border border-gray-300 rounded-md text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter task name"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={newTodo.description}
                onChange={handleTodoChange}
                className="p-3 w-full border border-gray-300 rounded-md text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 h-24 resize-y"
                placeholder="Enter task description"
              />
            </div>
          </div>

          {/* Assignee and Created By */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">
                Assignee
              </label>
              <div className="flex items-center gap-2">
                <select
                  id="assignedTo"
                  name="assignedTo"
                  value={newTodo.assignedTo}
                  onChange={handleTodoChange}
                  className="p-3 w-full border border-gray-300 rounded-md text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  {users.map((user) => (
                    <option key={user.id} value={user.displayName}>
                      {user.displayName}
                    </option>
                  ))}
                </select>
                <button type="button" className="text-blue-600 hover:text-blue-700 text-sm whitespace-nowrap">
                  + Add more
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="createdBy" className="block text-sm font-medium text-gray-700 mb-1">
                Created by
              </label>
              <div className="flex items-center gap-2">
                <select
                  id="createdBy"
                  name="createdBy"
                  value={newTodo.createdBy}
                  onChange={handleTodoChange}
                  className="p-3 w-full border border-gray-300 rounded-md text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  {users.map((user) => (
                    <option key={user.id} value={user.displayName}>
                      {user.displayName}
                    </option>
                  ))}
                </select>
                <button type="button" className="text-blue-600 hover:text-blue-700 text-sm whitespace-nowrap">
                  Change
                </button>
              </div>
            </div>
          </div>

          {/* Deadline and Module */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Deadline
              </label>
              <input
                type="text"
                id="dueDate"
                value={newTodo.dueDate ? formatDateSafely(newTodo.dueDate) : "No deadline"}
                onClick={() => setIsDatePickerOpen(true)}
                className="p-3 w-full border border-gray-300 rounded-md text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                readOnly
              />
              {isDatePickerOpen && (
                <div className="absolute z-10 bg-white border border-gray-300 rounded-lg p-4 mt-1 w-72 shadow-lg">
                  <div className="mb-4">
                    {predefinedDates.map((option, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handlePredefinedDateSelect(option.date)}
                        className="block w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      >
                        {option.label}, {format(option.date, "EEEE, MMM d")}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <button
                      type="button"
                      onClick={() => handleMonthChange("prev")}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      &lt;
                    </button>
                    <span className="text-sm font-medium">
                      {format(new Date(selectedYear, selectedMonth), "MMM yyyy")}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleMonthChange("next")}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      &gt;
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-sm">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                      <div key={index} className="text-gray-500 font-medium">
                        {day}
                      </div>
                    ))}
                    {emptyDays.map((_, index) => (
                      <div key={`empty-${index}`} />
                    ))}
                    {days.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleDateSelect(new Date(selectedYear, selectedMonth, day))}
                        className={`p-1 rounded-full hover:bg-blue-100 ${
                          day === new Date().getDate() &&
                          selectedMonth === new Date().getMonth() &&
                          selectedYear === new Date().getFullYear()
                            ? "bg-blue-500 text-white"
                            : "text-gray-700"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="module" className="block text-sm font-medium text-gray-700 mb-1">
                Module
              </label>
              <select
                id="module"
                name="module"
                value={newTodo.module}
                onChange={handleTodoChange}
                className="p-3 w-full border border-gray-300 rounded-md text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="self">Self</option>
                <option value="enquiry">Enquiry</option>
                <option value="company">Company</option>
                <option value="student">Student</option>
              </select>
            </div>
          </div>

          {/* Module-Specific Dropdowns */}
          <div className="space-y-4">
            {newTodo.module === "enquiry" && (
              <div>
                <label htmlFor="enquiry" className="block text-sm font-medium text-gray-700 mb-1">
                  Enquiry
                </label>
                <select
                  id="enquiry"
                  name="enquiry"
                  value={newTodo.enquiry}
                  onChange={handleTodoChange}
                  className="p-3 w-full border border-gray-300 rounded-md text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Enquiry</option>
                  {enquiries.map((enquiry) => (
                    <option key={enquiry.id} value={enquiry.name}>
                      {enquiry.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {newTodo.module === "company" && (
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <select
                  id="company"
                  name="company"
                  value={newTodo.company}
                  onChange={handleTodoChange}
                  className="p-3 w-full border border-gray-300 rounded-md text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Company</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.name}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {newTodo.module === "student" && (
              <div>
                <label htmlFor="student" className="block text-sm font-medium text-gray-700 mb-1">
                  Student
                </label>
                <select
                  id="student"
                  name="student"
                  value={newTodo.student}
                  onChange={handleTodoChange}
                  className="p-3 w-full border border-gray-300 rounded-md text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.Name}>
                      {student.Name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {newTodo.module === "self" && (
              <div>
                <label htmlFor="self" className="block text-sm font-medium text-gray-700 mb-1">
                  Self
                </label>
                <input
                  id="self"
                  type="text"
                  value={currentUser.displayName}
                  readOnly
                  className="p-3 w-full border border-gray-300 rounded-md text-sm bg-gray-100 shadow-sm"
                />
              </div>
            )}
          </div>

          {/* Hotlead */}
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="hotlead"
                checked={newTodo.hotlead}
                onChange={handleTodoChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Hotlead</span>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-2 justify-between items-center border-t pt-4">
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
              >
                {newTodo.id ? "Update task" : "Add task"}
              </button>
              {!newTodo.id && (
                <button
                  type="button"
                  onClick={handleAddAnother}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
                >
                  Add task & create another one
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setIsDetailedForm(false);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium"
              >
                Cancel
              </button>
            </div>
            {!newTodo.id && (
              <button
                type="button"
                onClick={() => setIsDetailedForm(false)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Simple form
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default DetailedForm;