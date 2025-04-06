// // // // // // // import React, { useState, useEffect } from "react";
// // // // // // // import { db } from "../config/firebase";
// // // // // // // import { collection, getDocs, query, Timestamp, updateDoc, doc } from "firebase/firestore";

// // // // // // // export default function InstallmentReport() {
// // // // // // //     const [installments, setInstallments] = useState([]);
// // // // // // //     const [loading, setLoading] = useState(true);
// // // // // // //     const [filter, setFilter] = useState("thisMonth");


// // // // // // //     useEffect(() => {

// // // // // // //         const fetchAllInstallments = async () => {
// // // // // // //             try {
// // // // // // //                 const studentsQuery = query(collection(db, "student"));
// // // // // // //                 const studentsSnapshot = await getDocs(studentsQuery);
// // // // // // //                 const allInstallments = [];

// // // // // // //                 for (const studentDoc of studentsSnapshot.docs) {
// // // // // // //                     const installmentsRef = collection(db, "student", studentDoc.id, "installments");
// // // // // // //                     const installmentsSnapshot = await getDocs(installmentsRef);

// // // // // // //                     installmentsSnapshot.forEach((installmentDoc) => {
// // // // // // //                         allInstallments.push({
// // // // // // //                             id: installmentDoc.id,
// // // // // // //                             studentId: studentDoc.id,
// // // // // // //                             studentData: studentDoc.data(),
// // // // // // //                             ...installmentDoc.data(),
// // // // // // //                         });
// // // // // // //                     });
// // // // // // //                 }

// // // // // // //                 setInstallments(allInstallments);
// // // // // // //                 console.log(allInstallments);
// // // // // // //                 setLoading(false);
// // // // // // //             } catch (error) {
// // // // // // //                 console.error("Error fetching installments:", error);
// // // // // // //                 setLoading(false);
// // // // // // //             }
// // // // // // //         };

// // // // // // //         fetchAllInstallments();
// // // // // // //     }, []);

// // // // // // //     const handleUpdate = async (installment, field, value) => {
// // // // // // //         try {
// // // // // // //             const updates = { [field]: value };
// // // // // // //             const installmentRef = doc(db, "student", installment.studentId, "installments", installment.id);
// // // // // // //             await updateDoc(installmentRef, updates);

// // // // // // //             setInstallments(prev => prev.map(item =>
// // // // // // //                 item.id === installment.id ? { ...item, ...updates } : item
// // // // // // //             ));
// // // // // // //         } catch (error) {
// // // // // // //             console.error("Error updating installment:", error);
// // // // // // //         }
// // // // // // //     };

// // // // // // //       const filterInstallments = () => {
// // // // // // //         console.log("filterInstallments called with filter:", filter); 
// // // // // // //         console.log("Installments before filter:", installments); 

// // // // // // //         const now = new Date();
// // // // // // //         let startDate, endDate;

// // // // // // //         switch (filter) {
// // // // // // //             case "thisMonth":
// // // // // // //                 startDate = new Date(now.getFullYear(), now.getMonth(), 1);
// // // // // // //                 endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
// // // // // // //                 console.log("thisMonth: startDate =", startDate, "endDate =", endDate);
// // // // // // //                 break;
// // // // // // //             case "lastMonth":
// // // // // // //                 startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
// // // // // // //                 endDate = new Date(now.getFullYear(), now.getMonth(), 0);
// // // // // // //                 console.log("lastMonth: startDate =", startDate, "endDate =", endDate);
// // // // // // //                 break;
// // // // // // //             case "nextMonth":
// // // // // // //                 startDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
// // // // // // //                 endDate = new Date(now.getFullYear(), now.getMonth() + 2, 0);
// // // // // // //                 console.log("nextMonth: startDate =", startDate, "endDate =", endDate);
// // // // // // //                 break;
// // // // // // //             case "thisYear":
// // // // // // //                 startDate = new Date(now.getFullYear(), 0, 1);
// // // // // // //                 endDate = new Date(now.getFullYear(), 11, 31);
// // // // // // //                 console.log("thisYear: startDate =", startDate, "endDate =", endDate);
// // // // // // //                 break;
// // // // // // //             case "lastYear":
// // // // // // //                 startDate = new Date(now.getFullYear() - 1, 0, 1);
// // // // // // //                 endDate = new Date(now.getFullYear() - 1, 11, 31);
// // // // // // //                 console.log("lastYear: startDate =", startDate, "endDate =", endDate);
// // // // // // //                 break;
// // // // // // //             default:
// // // // // // //                 console.log("default: returning all installments");
// // // // // // //                 return installments;
// // // // // // //         }

// // // // // // //         if (loading) {
// // // // // // //             console.log("Loading is true, returning empty array");
// // // // // // //             return [];
// // // // // // //         }

// // // // // // //         const filtered = installments.filter((installment) => {
// // // // // // //             const dueDate = installment.dueDate instanceof Timestamp
// // // // // // //                 ? installment.dueDate.toDate()
// // // // // // //                 : new Date(installment.dueDate);
// // // // // // //             const isInRange = dueDate >= startDate && dueDate <= endDate;
// // // // // // //             console.log("dueDate =", dueDate, "isInRange =", isInRange, "installment =", installment); // Check each installment

// // // // // // //             return isInRange;
// // // // // // //         });

// // // // // // //         console.log("Filtered installments:", filtered); // Check filtered result
// // // // // // //         return filtered;
// // // // // // //     };

// // // // // // //     if (loading) return <div>Loading installments...</div>;

// // // // // // //     const filteredInstallments = filterInstallments();
// // // // // // //     const totalAmount = filteredInstallments.reduce((acc, installment) => acc + Number(installment.dueAmount), 0);

// // // // // // //     return (
// // // // // // //         <div className="p-20">
// // // // // // //             <h1 className="text-2xl font-bold mb-4">Installment Report</h1>
// // // // // // //             <div className="mb-4">
// // // // // // //                 <select value={filter} onChange={(e) => setFilter(e.target.value)} className="p-2 border rounded">
// // // // // // //                     <option value="thisMonth">This Month</option>
// // // // // // //                     <option value="lastMonth">Last Month</option>
// // // // // // //                     <option value="nextMonth">Next Month</option>
// // // // // // //                     <option value="thisYear">This Year</option>
// // // // // // //                     <option value="lastYear">Last Year</option>
// // // // // // //                     <option value="all">All</option>

// // // // // // //                 </select>
// // // // // // //             </div>
// // // // // // //             <div className="overflow-x-auto">
// // // // // // //                 <table className="table-auto w-full">
// // // // // // //                     <thead>
// // // // // // //                         <tr className="bg-gray-200">
// // // // // // //                             <th className="px-4 py-2">Student Name</th>
// // // // // // //                             <th className="px-4 py-2">Installment No</th>
// // // // // // //                             <th className="px-4 py-2">Due Date</th>
// // // // // // //                             <th className="px-4 py-2">Amount</th>
// // // // // // //                             <th className="px-4 py-2">Status</th>
// // // // // // //                             <th className="px-4 py-2">Paid Date</th>
// // // // // // //                             <th className="px-4 py-2">Received By</th>
// // // // // // //                             <th className="px-4 py-2">Remarks</th>
// // // // // // //                         </tr>
// // // // // // //                     </thead>
// // // // // // //                     <tbody>
// // // // // // //                         {filteredInstallments.map((installment) => {
// // // // // // //                             const dueDate = installment.dueDate instanceof Timestamp
// // // // // // //                                 ? installment.dueDate.toDate()
// // // // // // //                                 : new Date(installment.dueDate);

// // // // // // //                             const paidDate = installment.paidDate instanceof Timestamp
// // // // // // //                                 ? installment.paidDate.toDate()
// // // // // // //                                 : installment.paidDate ? new Date(installment.paidDate) : null;


// // // // // // //                             return (
// // // // // // //                                 <tr key={installment.id} className="border-b">
// // // // // // //                                     <td className="px-4 py-2 text-center">
// // // // // // //                                         {installment.studentData.first_name} {installment.studentData.last_name}
// // // // // // //                                     </td>
// // // // // // //                                     <td className="px-4 py-2 text-center">{installment.number}</td>
// // // // // // //                                     <td className="px-4 py-2 text-center">
// // // // // // //                                         {dueDate.toLocaleDateString()}
// // // // // // //                                     </td>
// // // // // // //                                     <td className="px-4 py-2 text-center">₹{installment.dueAmount}</td>
// // // // // // //                                     <td className="px-4 py-2 text-center">
// // // // // // //                                         <select
// // // // // // //                                             value={installment.paid ? "Paid" : "Pending"}
// // // // // // //                                             onChange={(e) => handleUpdate(
// // // // // // //                                                 installment,
// // // // // // //                                                 "paid",
// // // // // // //                                                 e.target.value === "Paid"
// // // // // // //                                             )}
// // // // // // //                                             className="p-1 border rounded"
// // // // // // //                                         >
// // // // // // //                                             <option value="Pending">Pending</option>
// // // // // // //                                             <option value="Paid">Paid</option>
// // // // // // //                                         </select>
// // // // // // //                                     </td>
// // // // // // //                                     <td className="px-4 py-2 text-center">
// // // // // // //                                         <input
// // // // // // //                                             type="date"
// // // // // // //                                             value={paidDate ? paidDate.toISOString().split('T')[0] : ""}
// // // // // // //                                             onChange={(e) => handleUpdate(
// // // // // // //                                                 installment,
// // // // // // //                                                 "paidDate",
// // // // // // //                                                 Timestamp.fromDate(new Date(e.target.value))
// // // // // // //                                             )}
// // // // // // //                                             className="p-1 border rounded"
// // // // // // //                                             disabled={!installment.paid}
// // // // // // //                                         />
// // // // // // //                                     </td>

// // // // // // //                                     <td className="px-4 py-2 text-center">
// // // // // // //                                         <input
// // // // // // //                                             type="text"
// // // // // // //                                             value={installment.receivedBy || ""}
// // // // // // //                                             onChange={(e) => handleUpdate(
// // // // // // //                                                 installment, 
// // // // // // //                                                 "receivedBy",
// // // // // // //                                                 e.target.value
// // // // // // //                                             )}
// // // // // // //                                             className="p-1 border rounded w-32"
// // // // // // //                                             disabled={!installment.paid}
// // // // // // //                                         />
// // // // // // //                                     </td>


// // // // // // //                                     <td className="px-4 py-2 text-center">
// // // // // // //                                         <input
// // // // // // //                                             type="text"
// // // // // // //                                             value={installment.remarks || ""}
// // // // // // //                                             onChange={(e) => handleUpdate(
// // // // // // //                                                 installment,
// // // // // // //                                                 "remarks",
// // // // // // //                                                 e.target.value
// // // // // // //                                             )}
// // // // // // //                                             className="p-1 border rounded w-48"
// // // // // // //                                         />
// // // // // // //                                     </td>
// // // // // // //                                 </tr>
// // // // // // //                             );
// // // // // // //                         })}
// // // // // // //                         <tr className="bg-gray-100">
// // // // // // //                             <td colSpan="3" className="px-4 py-2 font-bold text-right">Total:</td>
// // // // // // //                             <td className="px-4 py-2 font-bold text-center">₹{totalAmount}</td>
// // // // // // //                             <td colSpan="4"></td>
// // // // // // //                         </tr>
// // // // // // //                     </tbody>
// // // // // // //                 </table>
// // // // // // //             </div>
// // // // // // //         </div>
// // // // // // //     );
// // // // // // // }



// // // import React, { useState, useEffect } from "react";
// // // import { db } from "../config/firebase";
// // // import { collection, getDocs, query, Timestamp, updateDoc, doc } from "firebase/firestore";

// // // export default function InstallmentReport() {
// // //     const [installments, setInstallments] = useState([]);
// // //     const [loading, setLoading] = useState(true);
// // //     const [filter, setFilter] = useState("thisMonth");

// // //     useEffect(() => {
// // //         const fetchAllInstallments = async () => {
// // //             try {
// // //                 const allInstallments = [];
                
// // //                 // Fetch student data
// // //                 const studentsSnapshot = await getDocs(collection(db, "student"));
// // //                 const studentMap = new Map();
// // //                 studentsSnapshot.forEach(studentDoc => {
// // //                     studentMap.set(studentDoc.id, studentDoc.data());
// // //                 });
    
// // //                 // Fetch enrollments
// // //                 const enrollmentsSnapshot = await getDocs(collection(db, "enrollments"));
                
// // //                 // SINGLE PROCESSING LOOP
// // //                 enrollmentsSnapshot.forEach(enrollmentDoc => {
// // //                     const enrollmentData = enrollmentDoc.data();
// // //                     const studentId = enrollmentDoc.id;
// // //                     const studentData = studentMap.get(studentId) || {
// // //                         first_name: "Unknown",
// // //                         last_name: ""
// // //                     };
    
// // //                     // Validate courses array
// // //                     const courses = Array.isArray(enrollmentData.courses) 
// // //                         ? enrollmentData.courses 
// // //                         : [];
    
// // //                     courses.forEach((course, courseIndex) => {
// // //                         // Validate installmentDetails array
// // //                         const installmentDetails = Array.isArray(course.installmentDetails)
// // //                             ? course.installmentDetails
// // //                             : [];
    
// // //                         installmentDetails.forEach((installment, installmentIndex) => {
// // //                             allInstallments.push({
// // //                                 id: `${studentId}-${courseIndex}-${installmentIndex}`,
// // //                                 studentId,
// // //                                 studentData,
// // //                                 feeTemplate: course.feeTemplate || "N/A",
// // //                                 courseName: course.selectedCourse?.name || "Unknown Course",
// // //                                 ...installment
// // //                             });
// // //                         });
// // //                     });
// // //                 });
    
// // //                 setInstallments(allInstallments);
// // //                 setLoading(false);
// // //             } catch (error) {
// // //                 console.error("Error fetching installments:", error);
// // //                 setLoading(false);
// // //             }
// // //         };
    
// // //         fetchAllInstallments();
// // //     }, []);
   

// // //     const handleUpdate = async (installment, field, value) => {
// // //         try {
// // //             const [studentId, courseIndex, installmentIndex] = installment.id.split('-');
// // //             const enrollmentRef = doc(db, "enrollments", studentId);

// // //             const updatePath = `courses.${courseIndex}.installmentDetails.${installmentIndex}.${field}`;
// // //             await updateDoc(enrollmentRef, {
// // //                 [updatePath]: value
// // //             });

// // //             setInstallments(prev => prev.map(item =>
// // //                 item.id === installment.id ? { ...item, [field]: value } : item
// // //             ));
// // //         } catch (error) {
// // //             console.error("Error updating installment:", error);
// // //         }
// // //     };

// // //     // const updates = { [field]: value };
// // //     // const installmentRef = doc(db, "student", installment.studentId, "installments", installment.id);
// // //     // await updateDoc(installmentRef, updates);

// // //     //         setInstallments(prev => prev.map(item =>
// // //     //             item.id === installment.id ? { ...item, ...updates } : item
// // //     //         ));
// // //     //     } catch (error) {
// // //     //         console.error("Error updating installment:", error);
// // //     //     }
// // //     // };

// // //     const filterInstallments = () => {
// // //         console.log("filterInstallments called with filter:", filter);
// // //         console.log("Installments before filter:", installments);

// // //         const now = new Date();
// // //         let startDate, endDate;

// // //         switch (filter) {
// // //             case "thisMonth":
// // //                 startDate = new Date(now.getFullYear(), now.getMonth(), 1);
// // //                 endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
// // //                 console.log("thisMonth: startDate =", startDate, "endDate =", endDate);
// // //                 break;
// // //             case "lastMonth":
// // //                 startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
// // //                 endDate = new Date(now.getFullYear(), now.getMonth(), 0);
// // //                 console.log("lastMonth: startDate =", startDate, "endDate =", endDate);
// // //                 break;
// // //             case "nextMonth":
// // //                 startDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
// // //                 endDate = new Date(now.getFullYear(), now.getMonth() + 2, 0);
// // //                 console.log("nextMonth: startDate =", startDate, "endDate =", endDate);
// // //                 break;
// // //             case "thisYear":
// // //                 startDate = new Date(now.getFullYear(), 0, 1);
// // //                 endDate = new Date(now.getFullYear(), 11, 31);
// // //                 console.log("thisYear: startDate =", startDate, "endDate =", endDate);
// // //                 break;
// // //             case "lastYear":
// // //                 startDate = new Date(now.getFullYear() - 1, 0, 1);
// // //                 endDate = new Date(now.getFullYear() - 1, 11, 31);
// // //                 console.log("lastYear: startDate =", startDate, "endDate =", endDate);
// // //                 break;
// // //             default:
// // //                 console.log("default: returning all installments");
// // //                 return installments;
// // //         }

// // //         if (loading) {
// // //             console.log("Loading is true, returning empty array");
// // //             return [];
// // //         }

// // //         const filtered = installments.filter((installment) => {
// // //             const dueDate = installment.dueDate instanceof Timestamp
// // //                 ? installment.dueDate.toDate()
// // //                 : new Date(installment.dueDate);
// // //             const isInRange = dueDate >= startDate && dueDate <= endDate;
// // //             console.log("dueDate =", dueDate, "isInRange =", isInRange, "installment =", installment); // Check each installment

// // //             return isInRange;
// // //         });

// // //         console.log("Filtered installments:", filtered); // Check filtered result
// // //         return filtered;
// // //     };

// // //     if (loading) return <div>Loading installments...</div>;

// // //     const filteredInstallments = filterInstallments();
// // //     const totalAmount = filteredInstallments.reduce((acc, installment) => acc + Number(installment.dueAmount), 0);

// // //     return (
// // //         <div className="p-20">
// // //             <h1 className="text-2xl font-bold mb-4">Installment Report</h1>
// // //             <div className="mb-4">
// // //                 <select value={filter} onChange={(e) => setFilter(e.target.value)} className="p-2 border rounded">
// // //                     <option value="thisMonth">This Month</option>
// // //                     <option value="lastMonth">Last Month</option>
// // //                     <option value="nextMonth">Next Month</option>
// // //                     <option value="thisYear">This Year</option>
// // //                     <option value="lastYear">Last Year</option>
// // //                     <option value="all">All</option>

// // //                 </select>
// // //             </div>
// // //             <div className="overflow-x-auto">
// // //                 <table className="table-auto w-full">
// // //                     <thead>
// // //                         <tr className="bg-gray-200">
// // //                             <th className="px-4 py-2">Student Name</th>
// // //                             <th className="px-4 py-2">Fee Type</th>
// // //                             <th className="px-4 py-2">Installment No</th>
// // //                             <th className="px-4 py-2">Due Date</th>
// // //                             <th className="px-4 py-2">Amount</th>
// // //                             <th className="px-4 py-2">Status</th>
// // //                             <th className="px-4 py-2">Paid Date</th>
// // //                             <th className="px-4 py-2">Received By</th>
// // //                             <th className="px-4 py-2">Remarks</th>
// // //                         </tr>
// // //                     </thead>
// // //                     <tbody>
// // //                         {filteredInstallments.map((installment) => {
// // //                             const dueDate = installment.dueDate instanceof Timestamp
// // //                                 ? installment.dueDate.toDate()
// // //                                 : new Date(installment.dueDate);

// // //                             const paidDate = installment.paidDate instanceof Timestamp
// // //                                 ? installment.paidDate.toDate()
// // //                                 : installment.paidDate ? new Date(installment.paidDate) : null;


// // //                             return (
// // //                                 <tr key={installment.id} className="border-b">
// // //                                     <td className="px-4 py-2 text-center">
// // //                                         {installment.studentData?.first_name || 'Unknown'}
// // //                                         {installment.studentData?.last_name}
// // //                                     </td>
// // //                                     {/* <td className="px-4 py-2 text-center">
// // //                                         {installment.studentData.first_name} {installment.studentData.last_name}
// // //                                     </td> */}
// // //                                     <td className="px-4 py-2 text-center">  {/* Add this cell */}
// // //                                         {installment.feeTemplate || 'N/A'}
// // //                                     </td>
// // //                                     <td className="px-4 py-2 text-center">{installment.number}</td>
// // //                                     <td className="px-4 py-2 text-center">
// // //                                         {dueDate.toLocaleDateString()}
// // //                                     </td>
// // //                                     <td className="px-4 py-2 text-center">₹{installment.dueAmount}</td>
// // //                                     <td className="px-4 py-2 text-center">
// // //                                         <select
// // //                                             value={installment.paid ? "Paid" : "Pending"}
// // //                                             onChange={(e) => handleUpdate(
// // //                                                 installment,
// // //                                                 "paidDate",
// // //                                                 e.target.value ? Timestamp.fromDate(new Date(e.target.value)) : null
// // //                                             )}
// // //                                             className="p-1 border rounded"
// // //                                         >
// // //                                             <option value="Pending">Pending</option>
// // //                                             <option value="Paid">Paid</option>
// // //                                         </select>
// // //                                     </td>
// // //                                     <td className="px-4 py-2 text-center">
// // //                                         <input
// // //                                             type="date"
// // //                                             value={paidDate ? paidDate.toISOString().split('T')[0] : ""}
// // //                                             onChange={(e) => handleUpdate(
// // //                                                 installment,
// // //                                                 "paidDate",
// // //                                                 Timestamp.fromDate(new Date(e.target.value))
// // //                                             )}
// // //                                             className="p-1 border rounded"
// // //                                             disabled={!installment.paid}
// // //                                         />
// // //                                     </td>

// // //                                     <td className="px-4 py-2 text-center">
// // //                                         <input
// // //                                             type="text"
// // //                                             value={installment.receivedBy || ""}
// // //                                             onChange={(e) => handleUpdate(
// // //                                                 installment,
// // //                                                 "receivedBy",
// // //                                                 e.target.value
// // //                                             )}
// // //                                             className="p-1 border rounded w-32"
// // //                                             disabled={!installment.paid}
// // //                                         />
// // //                                     </td>


// // //                                     <td className="px-4 py-2 text-center">
// // //                                         <input
// // //                                             type="text"
// // //                                             value={installment.remarks || ""}
// // //                                             onChange={(e) => handleUpdate(
// // //                                                 installment,
// // //                                                 "remarks",
// // //                                                 e.target.value
// // //                                             )}
// // //                                             className="p-1 border rounded w-48"
// // //                                         />
// // //                                     </td>
// // //                                 </tr>
// // //                             );
// // //                         })}
// // //                         <tr className="bg-gray-100">
// // //     <td colSpan="4" className="px-4 py-2 font-bold text-right">Total:</td>
// // //     <td className="px-4 py-2 font-bold text-center">₹{totalAmount}</td>
// // //     <td colSpan="4"></td>
// // // </tr>
// // //                         {/* <tr className="bg-gray-100">
// // //                             <td colSpan="3" className="px-4 py-2 font-bold text-right">Total:</td>
// // //                             <td className="px-4 py-2 font-bold text-center">₹{totalAmount}</td>
// // //                             <td colSpan="4"></td>
// // //                         </tr> */}
// // //                     </tbody>
// // //                 </table>
// // //             </div>
// // //         </div>
// // //     );
// // // }



// // // // import React, { useState, useEffect } from "react";
// // // // import { db } from "../config/firebase";
// // // // import { collection, getDocs, query, Timestamp, updateDoc, doc } from "firebase/firestore";

// // // // export default function InstallmentReport() {
// // // //     const [installments, setInstallments] = useState([]);
// // // //     const [loading, setLoading] = useState(true);
// // // //     const [filter, setFilter] = useState("thisMonth");

// // // //     useEffect(() => {
// // // //         const fetchAllInstallments = async () => {
// // // //             try {
// // // //                 const allInstallments = [];
// // // //                 const studentsSnapshot = await getDocs(collection(db, "student"));
// // // //                 console.log("Students found:", studentsSnapshot.size);
// // // //                 const studentMap = new Map();
// // // //                 studentsSnapshot.forEach(studentDoc => {
// // // //                     console.log("Student:", studentDoc.id, studentDoc.data());
// // // //                     studentMap.set(studentDoc.id, studentDoc.data());
// // // //                 });

// // // //                 const enrollmentsSnapshot = await getDocs(collection(db, "enrollments"));
// // // //                 console.log("Enrollments found:", enrollmentsSnapshot.size);
// // // //                 enrollmentsSnapshot.forEach(enrollmentDoc => {
// // // //                     const enrollmentData = enrollmentDoc.data();
// // // //                     console.log("Enrollment:", enrollmentDoc.id, enrollmentData);
// // // //                     const studentId = enrollmentDoc.id;
// // // //                     const studentData = studentMap.get(studentId) || {
// // // //                         first_name: "Unknown",
// // // //                         last_name: ""
// // // //                     };

// // // //                     const courses = Array.isArray(enrollmentData.courses) ? enrollmentData.courses : [];
// // // //                     console.log("Courses for", studentId, ":", courses);
// // // //                     courses.forEach((course, courseIndex) => {
// // // //                         const installmentDetails = Array.isArray(course.installmentDetails) ? course.installmentDetails : [];
// // // //                         console.log("InstallmentDetails for course", courseIndex, ":", installmentDetails);
// // // //                         installmentDetails.forEach((installment, installmentIndex) => {
// // // //                             console.log("Adding installment:", installment);
// // // //                             allInstallments.push({
// // // //                                 id: `${studentId}-${courseIndex}-${installmentIndex}`,
// // // //                                 studentId,
// // // //                                 studentData,
// // // //                                 feeTemplate: course.feeTemplate || "N/A",
// // // //                                 courseName: course.selectedCourse?.name || "Unknown Course",
// // // //                                 ...installment
// // // //                             });
// // // //                         });
// // // //                     });
// // // //                 });

// // // //                 console.log("All installments:", allInstallments);
// // // //                 setInstallments(allInstallments);
// // // //                 setLoading(false);
// // // //             } catch (error) {
// // // //                 console.error("Error fetching installments:", error);
// // // //                 setLoading(false);
// // // //             }
// // // //         };

// // // //         fetchAllInstallments();
// // // //     }, []);

// // // //     const handleUpdate = async (installment, field, value) => {
// // // //         try {
// // // //             const [studentId, courseIndex, installmentIndex] = installment.id.split('-');
// // // //             const enrollmentRef = doc(db, "enrollments", studentId);
// // // //             const updatePath = `courses.${courseIndex}.installmentDetails.${installmentIndex}.${field}`;

// // // //             let updatedValue = value;
// // // //             if (field === "paid") {
// // // //                 updatedValue = value === "Paid"; // Convert to boolean
// // // //                 await updateDoc(enrollmentRef, {
// // // //                     [updatePath]: updatedValue,
// // // //                     [`courses.${courseIndex}.installmentDetails.${installmentIndex}.paidAmount`]: updatedValue ? installment.dueAmount : "",
// // // //                     [`courses.${courseIndex}.installmentDetails.${installmentIndex}.paidDate`]: updatedValue ? new Date().toISOString().split('T')[0] : null
// // // //                 });
// // // //             } else if (field === "paidDate") {
// // // //                 updatedValue = value ? Timestamp.fromDate(new Date(value)) : null;
// // // //                 await updateDoc(enrollmentRef, {
// // // //                     [updatePath]: updatedValue
// // // //                 });
// // // //             } else {
// // // //                 await updateDoc(enrollmentRef, {
// // // //                     [updatePath]: value
// // // //                 });
// // // //             }

// // // //             setInstallments(prev => prev.map(item =>
// // // //                 item.id === installment.id ? { ...item, [field]: updatedValue } : item
// // // //             ));
// // // //         } catch (error) {
// // // //             console.error("Error updating installment:", error);
// // // //         }
// // // //     };

// // // //     const filterInstallments = () => {
// // // //         console.log("filterInstallments called with filter:", filter);
// // // //         console.log("Installments before filter:", installments);

// // // //         if (installments.length === 0) {
// // // //             console.log("No installments to filter, returning empty array");
// // // //             return [];
// // // //         }

// // // //         const now = new Date();
// // // //         let startDate, endDate;

// // // //         switch (filter) {
// // // //             case "thisMonth":
// // // //                 startDate = new Date(now.getFullYear(), now.getMonth(), 1);
// // // //                 endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
// // // //                 console.log("thisMonth: startDate =", startDate, "endDate =", endDate);
// // // //                 break;
// // // //             case "lastMonth":
// // // //                 startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
// // // //                 endDate = new Date(now.getFullYear(), now.getMonth(), 0);
// // // //                 console.log("lastMonth: startDate =", startDate, "endDate =", endDate);
// // // //                 break;
// // // //             case "nextMonth":
// // // //                 startDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
// // // //                 endDate = new Date(now.getFullYear(), now.getMonth() + 2, 0);
// // // //                 console.log("nextMonth: startDate =", startDate, "endDate =", endDate);
// // // //                 break;
// // // //             case "thisYear":
// // // //                 startDate = new Date(now.getFullYear(), 0, 1);
// // // //                 endDate = new Date(now.getFullYear(), 11, 31);
// // // //                 console.log("thisYear: startDate =", startDate, "endDate =", endDate);
// // // //                 break;
// // // //             case "lastYear":
// // // //                 startDate = new Date(now.getFullYear() - 1, 0, 1);
// // // //                 endDate = new Date(now.getFullYear() - 1, 11, 31);
// // // //                 console.log("lastYear: startDate =", startDate, "endDate =", endDate);
// // // //                 break;
// // // //             default:
// // // //                 console.log("default: returning all installments");
// // // //                 return installments;
// // // //         }

// // // //         const filtered = installments.filter((installment) => {
// // // //             const dueDateRaw = installment.dueDate || "";
// // // //             if (!dueDateRaw) {
// // // //                 console.log(`Skipping ${installment.id}: No dueDate`);
// // // //                 return false;
// // // //             }

// // // //             const dueDate = dueDateRaw instanceof Timestamp
// // // //                 ? dueDateRaw.toDate()
// // // //                 : new Date(dueDateRaw);
// // // //             const isValidDate = !isNaN(dueDate.getTime());

// // // //             if (!isValidDate) {
// // // //                 console.log(`Skipping ${installment.id}: Invalid dueDate`, dueDateRaw);
// // // //                 return false;
// // // //             }

// // // //             const isInRange = dueDate >= startDate && dueDate <= endDate;
// // // //             console.log(`Checking ${installment.id}: dueDate=${dueDate.toLocaleDateString()}, isInRange=${isInRange}`);
// // // //             return isInRange;
// // // //         });

// // // //         console.log("Filtered installments:", filtered);
// // // //         return filtered;
// // // //     };

// // // //     if (loading) return <div>Loading installments...</div>;

// // // //     const filteredInstallments = filterInstallments();
// // // //     const totalAmount = filteredInstallments.reduce((acc, installment) => acc + Number(installment.dueAmount || 0), 0);

// // // //     return (
// // // //         <div className="p-20">
// // // //             <h1 className="text-2xl font-bold mb-4">Installment Report</h1>
// // // //             <div className="mb-4">
// // // //                 <select value={filter} onChange={(e) => setFilter(e.target.value)} className="p-2 border rounded">
// // // //                     <option value="thisMonth">This Month</option>
// // // //                     <option value="lastMonth">Last Month</option>
// // // //                     <option value="nextMonth">Next Month</option>
// // // //                     <option value="thisYear">This Year</option>
// // // //                     <option value="lastYear">Last Year</option>
// // // //                     <option value="all">All</option>
// // // //                 </select>
// // // //             </div>
// // // //             <div className="overflow-x-auto">
// // // //                 {filteredInstallments.length === 0 ? (
// // // //                     <p>No installments found for the selected filter.</p>
// // // //                 ) : (
// // // //                     <table className="table-auto w-full">
// // // //                         <thead>
// // // //                             <tr className="bg-gray-200">
// // // //                                 <th className="px-4 py-2">Student Name</th>
// // // //                                 <th className="px-4 py-2">Fee Type</th>
// // // //                                 <th className="px-4 py-2">Installment No</th>
// // // //                                 <th className="px-4 py-2">Due Date</th>
// // // //                                 <th className="px-4 py-2">Amount</th>
// // // //                                 <th className="px-4 py-2">Status</th>
// // // //                                 <th className="px-4 py-2">Paid Date</th>
// // // //                                 <th className="px-4 py-2">Received By</th>
// // // //                                 <th className="px-4 py-2">Remarks</th>
// // // //                             </tr>
// // // //                         </thead>
// // // //                         <tbody>
// // // //                             {filteredInstallments.map((installment) => {
// // // //                                 const dueDate = installment.dueDate instanceof Timestamp
// // // //                                     ? installment.dueDate.toDate()
// // // //                                     : new Date(installment.dueDate);
// // // //                                 const paidDate = installment.paidDate instanceof Timestamp
// // // //                                     ? installment.paidDate.toDate()
// // // //                                     : installment.paidDate ? new Date(installment.paidDate) : null;

// // // //                                 return (
// // // //                                     <tr key={installment.id} className="border-b">
// // // //                                         <td className="px-4 py-2 text-center">
// // // //                                             {installment.studentData?.first_name || 'Unknown'} {installment.studentData?.last_name || ''}
// // // //                                         </td>
// // // //                                         <td className="px-4 py-2 text-center">
// // // //                                             {installment.feeTemplate || 'N/A'}
// // // //                                         </td>
// // // //                                         <td className="px-4 py-2 text-center">{installment.number || 'N/A'}</td>
// // // //                                         <td className="px-4 py-2 text-center">
// // // //                                             {dueDate.toLocaleDateString()}
// // // //                                         </td>
// // // //                                         <td className="px-4 py-2 text-center">₹{installment.dueAmount || 0}</td>
// // // //                                         <td className="px-4 py-2 text-center">
// // // //                                             <select
// // // //                                                 value={installment.paid ? "Paid" : "Pending"}
// // // //                                                 onChange={(e) => handleUpdate(installment, "paid", e.target.value)}
// // // //                                                 className="p-1 border rounded"
// // // //                                             >
// // // //                                                 <option value="Pending">Pending</option>
// // // //                                                 <option value="Paid">Paid</option>
// // // //                                             </select>
// // // //                                         </td>
// // // //                                         <td className="px-4 py-2 text-center">
// // // //                                             <input
// // // //                                                 type="date"
// // // //                                                 value={paidDate ? paidDate.toISOString().split('T')[0] : ""}
// // // //                                                 onChange={(e) => handleUpdate(installment, "paidDate", e.target.value)}
// // // //                                                 className="p-1 border rounded"
// // // //                                                 disabled={!installment.paid}
// // // //                                             />
// // // //                                         </td>
// // // //                                         <td className="px-4 py-2 text-center">
// // // //                                             <input
// // // //                                                 type="text"
// // // //                                                 value={installment.receivedBy || ""}
// // // //                                                 onChange={(e) => handleUpdate(installment, "receivedBy", e.target.value)}
// // // //                                                 className="p-1 border rounded w-32"
// // // //                                                 disabled={!installment.paid}
// // // //                                             />
// // // //                                         </td>
// // // //                                         <td className="px-4 py-2 text-center">
// // // //                                             <input
// // // //                                                 type="text"
// // // //                                                 value={installment.remarks || ""}
// // // //                                                 onChange={(e) => handleUpdate(installment, "remarks", e.target.value)}
// // // //                                                 className="p-1 border rounded w-48"
// // // //                                             />
// // // //                                         </td>
// // // //                                     </tr>
// // // //                                 );
// // // //                             })}
// // // //                             <tr className="bg-gray-100">
// // // //                                 <td colSpan="4" className="px-4 py-2 font-bold text-right">Total:</td>
// // // //                                 <td className="px-4 py-2 font-bold text-center">₹{totalAmount}</td>
// // // //                                 <td colSpan="4"></td>
// // // //                             </tr>
// // // //                         </tbody>
// // // //                     </table>
// // // //                 )}
// // // //             </div>
// // // //         </div>
// // // //     );
// // // // }


// // // // import React, { useState, useEffect } from "react";
// // // // import { db } from "../config/firebase";
// // // // import { collection, getDocs, query, Timestamp, updateDoc, doc } from "firebase/firestore";

// // // // export default function InstallmentReport() {
// // // //     const [installments, setInstallments] = useState([]);
// // // //     const [loading, setLoading] = useState(true);

// // // //     useEffect(() => {
// // // //         const fetchAllInstallments = async () => {
// // // //             try {
// // // //                 const allInstallments = [];
// // // //                 const studentsSnapshot = await getDocs(collection(db, "student"));
// // // //                 console.log("Students found:", studentsSnapshot.size);
// // // //                 const studentMap = new Map();
// // // //                 studentsSnapshot.forEach(studentDoc => {
// // // //                     console.log("Student:", studentDoc.id, studentDoc.data());
// // // //                     studentMap.set(studentDoc.id, studentDoc.data());
// // // //                 });

// // // //                 const enrollmentsSnapshot = await getDocs(collection(db, "enrollments"));
// // // //                 console.log("Enrollments found:", enrollmentsSnapshot.size);
// // // //                 enrollmentsSnapshot.forEach(enrollmentDoc => {
// // // //                     const enrollmentData = enrollmentDoc.data();
// // // //                     console.log("Enrollment:", enrollmentDoc.id, enrollmentData);
// // // //                     const studentId = enrollmentDoc.id;
// // // //                     const studentData = studentMap.get(studentId) || {
// // // //                         first_name: "Unknown",
// // // //                         last_name: ""
// // // //                     };

// // // //                     const courses = Array.isArray(enrollmentData.courses) ? enrollmentData.courses : [];
// // // //                     console.log("Courses for", studentId, ":", courses);
// // // //                     courses.forEach((course, courseIndex) => {
// // // //                         const installmentDetails = Array.isArray(course.installmentDetails) ? course.installmentDetails : [];
// // // //                         console.log("InstallmentDetails for course", courseIndex, ":", installmentDetails);
// // // //                         installmentDetails.forEach((installment, installmentIndex) => {
// // // //                             console.log("Adding installment:", installment);
// // // //                             allInstallments.push({
// // // //                                 id: `${studentId}-${courseIndex}-${installmentIndex}`,
// // // //                                 studentId,
// // // //                                 studentData,
// // // //                                 feeTemplate: course.feeTemplate || "N/A",
// // // //                                 courseName: course.selectedCourse?.name || "Unknown Course",
// // // //                                 ...installment
// // // //                             });
// // // //                         });
// // // //                     });
// // // //                 });

// // // //                 console.log("All installments:", allInstallments);
// // // //                 setInstallments(allInstallments);
// // // //                 setLoading(false);
// // // //             } catch (error) {
// // // //                 console.error("Error fetching installments:", error);
// // // //                 setLoading(false);
// // // //             }
// // // //         };

// // // //         fetchAllInstallments();
// // // //     }, []);

// // // //     const handleUpdate = async (installment, field, value) => {
// // // //         try {
// // // //             const [studentId, courseIndex, installmentIndex] = installment.id.split('-');
// // // //             const enrollmentRef = doc(db, "enrollments", studentId);
// // // //             const updatePath = `courses.${courseIndex}.installmentDetails.${installmentIndex}.${field}`;

// // // //             let updatedValue = value;
// // // //             if (field === "paid") {
// // // //                 updatedValue = value === "Paid"; // Convert to boolean
// // // //                 await updateDoc(enrollmentRef, {
// // // //                     [updatePath]: updatedValue,
// // // //                     [`courses.${courseIndex}.installmentDetails.${installmentIndex}.paidAmount`]: updatedValue ? installment.dueAmount : "",
// // // //                     [`courses.${courseIndex}.installmentDetails.${installmentIndex}.paidDate`]: updatedValue ? new Date().toISOString().split('T')[0] : null
// // // //                 });
// // // //             } else if (field === "paidDate") {
// // // //                 updatedValue = value ? Timestamp.fromDate(new Date(value)) : null;
// // // //                 await updateDoc(enrollmentRef, {
// // // //                     [updatePath]: updatedValue
// // // //                 });
// // // //             } else {
// // // //                 await updateDoc(enrollmentRef, {
// // // //                     [updatePath]: value
// // // //                 });
// // // //             }

// // // //             setInstallments(prev => prev.map(item =>
// // // //                 item.id === installment.id ? { ...item, [field]: updatedValue } : item
// // // //             ));
// // // //         } catch (error) {
// // // //             console.error("Error updating installment:", error);
// // // //         }
// // // //     };

// // // //     if (loading) return <div>Loading installments...</div>;

// // // //     const totalAmount = installments.reduce((acc, installment) => acc + Number(installment.dueAmount || 0), 0);

// // // //     return (
// // // //         <div className="p-20">
// // // //             <h1 className="text-2xl font-bold mb-4">Installment Report</h1>
// // // //             <div className="mb-4">
// // // //                 <p>All Installments (No Filtering)</p>
// // // //             </div>
// // // //             <div className="overflow-x-auto">
// // // //                 {installments.length === 0 ? (
// // // //                     <p>No installments found.</p>
// // // //                 ) : (
// // // //                     <table className="table-auto w-full">
// // // //                         <thead>
// // // //                             <tr className="bg-gray-200">
// // // //                                 <th className="px-4 py-2">Student Name</th>
// // // //                                 <th className="px-4 py-2">Fee Type</th>
// // // //                                 <th className="px-4 py-2">Installment No</th>
// // // //                                 <th className="px-4 py-2">Due Date</th>
// // // //                                 <th className="px-4 py-2">Amount</th>
// // // //                                 <th className="px-4 py-2">Status</th>
// // // //                                 <th className="px-4 py-2">Paid Date</th>
// // // //                                 <th className="px-4 py-2">Received By</th>
// // // //                                 <th className="px-4 py-2">Remarks</th>
// // // //                             </tr>
// // // //                         </thead>
// // // //                         <tbody>
// // // //                             {installments.map((installment) => {
// // // //                                 const dueDate = installment.dueDate instanceof Timestamp
// // // //                                     ? installment.dueDate.toDate()
// // // //                                     : installment.dueDate ? new Date(installment.dueDate) : null;
// // // //                                 const paidDate = installment.paidDate instanceof Timestamp
// // // //                                     ? installment.paidDate.toDate()
// // // //                                     : installment.paidDate ? new Date(installment.paidDate) : null;

// // // //                                 return (
// // // //                                     <tr key={installment.id} className="border-b">
// // // //                                         <td className="px-4 py-2 text-center">
// // // //                                             {installment.studentData?.first_name || 'Unknown'} {installment.studentData?.last_name || ''}
// // // //                                         </td>
// // // //                                         <td className="px-4 py-2 text-center">
// // // //                                             {installment.feeTemplate || 'N/A'}
// // // //                                         </td>
// // // //                                         <td className="px-4 py-2 text-center">{installment.number || 'N/A'}</td>
// // // //                                         <td className="px-4 py-2 text-center">
// // // //                                             {dueDate ? dueDate.toLocaleDateString() : 'N/A'}
// // // //                                         </td>
// // // //                                         <td className="px-4 py-2 text-center">₹{installment.dueAmount || 0}</td>
// // // //                                         <td className="px-4 py-2 text-center">
// // // //                                             <select
// // // //                                                 value={installment.paid ? "Paid" : "Pending"}
// // // //                                                 onChange={(e) => handleUpdate(installment, "paid", e.target.value)}
// // // //                                                 className="p-1 border rounded"
// // // //                                             >
// // // //                                                 <option value="Pending">Pending</option>
// // // //                                                 <option value="Paid">Paid</option>
// // // //                                             </select>
// // // //                                         </td>
// // // //                                         <td className="px-4 py-2 text-center">
// // // //                                             <input
// // // //                                                 type="date"
// // // //                                                 value={paidDate ? paidDate.toISOString().split('T')[0] : ""}
// // // //                                                 onChange={(e) => handleUpdate(installment, "paidDate", e.target.value)}
// // // //                                                 className="p-1 border rounded"
// // // //                                                 disabled={!installment.paid}
// // // //                                             />
// // // //                                         </td>
// // // //                                         <td className="px-4 py-2 text-center">
// // // //                                             <input
// // // //                                                 type="text"
// // // //                                                 value={installment.receivedBy || ""}
// // // //                                                 onChange={(e) => handleUpdate(installment, "receivedBy", e.target.value)}
// // // //                                                 className="p-1 border rounded w-32"
// // // //                                                 disabled={!installment.paid}
// // // //                                             />
// // // //                                         </td>
// // // //                                         <td className="px-4 py-2 text-center">
// // // //                                             <input
// // // //                                                 type="text"
// // // //                                                 value={installment.remarks || ""}
// // // //                                                 onChange={(e) => handleUpdate(installment, "remarks", e.target.value)}
// // // //                                                 className="p-1 border rounded w-48"
// // // //                                             />
// // // //                                         </td>
// // // //                                     </tr>
// // // //                                 );
// // // //                             })}
// // // //                             <tr className="bg-gray-100">
// // // //                                 <td colSpan="4" className="px-4 py-2 font-bold text-right">Total:</td>
// // // //                                 <td className="px-4 py-2 font-bold text-center">₹{totalAmount}</td>
// // // //                                 <td colSpan="4"></td>
// // // //                             </tr>
// // // //                         </tbody>
// // // //                     </table>
// // // //                 )}
// // // //             </div>
// // // //         </div>
// // // //     );
// // // // }


// // // // import React, { useState, useEffect } from "react";
// // // // import { db } from "../config/firebase";
// // // // import { collection, getDocs, query, Timestamp, updateDoc, doc } from "firebase/firestore";

// // // // export default function InstallmentReport() {
// // // //     const [installments, setInstallments] = useState([]);
// // // //     const [totalRevenue, setTotalRevenue] = useState(0);
// // // //     const [loading, setLoading] = useState(true);

// // // //     useEffect(() => {
// // // //         const fetchAllRevenue = async () => {
// // // //             try {
// // // //                 const allInstallments = [];
// // // //                 let totalRevenueCalc = 0;

// // // //                 // Fetch student data
// // // //                 const studentsSnapshot = await getDocs(collection(db, "student"));
// // // //                 console.log("Students found:", studentsSnapshot.size);
// // // //                 const studentMap = new Map();
// // // //                 studentsSnapshot.forEach(studentDoc => {
// // // //                     console.log("Student:", studentDoc.id, studentDoc.data());
// // // //                     studentMap.set(studentDoc.id, studentDoc.data());
// // // //                 });

// // // //                 // Fetch enrollments
// // // //                 const enrollmentsSnapshot = await getDocs(collection(db, "enrollments"));
// // // //                 console.log("Enrollments found:", enrollmentsSnapshot.size);
// // // //                 enrollmentsSnapshot.forEach(enrollmentDoc => {
// // // //                     const enrollmentData = enrollmentDoc.data();
// // // //                     console.log("Enrollment:", enrollmentDoc.id, enrollmentData);
// // // //                     const studentId = enrollmentDoc.id;
// // // //                     const studentData = studentMap.get(studentId) || {
// // // //                         first_name: "Unknown",
// // // //                         last_name: ""
// // // //                     };

// // // //                     const courses = Array.isArray(enrollmentData.courses) ? enrollmentData.courses : [];
// // // //                     console.log("Courses for", studentId, ":", courses);
// // // //                     courses.forEach((course, courseIndex) => {
// // // //                         const feeTemplate = course.feeTemplate || "N/A";
// // // //                         let courseRevenue = 0;

// // // //                         // Calculate revenue based on feeTemplate
// // // //                         if (feeTemplate === "Installments") {
// // // //                             const installmentDetails = Array.isArray(course.installmentDetails) ? course.installmentDetails : [];
// // // //                             console.log("InstallmentDetails for course", courseIndex, ":", installmentDetails);

// // // //                             // Sum dueAmount for installments
// // // //                             const installmentRevenue = installmentDetails.reduce((acc, installment) => {
// // // //                                 const dueAmount = Number(installment.dueAmount || 0);
// // // //                                 return acc + dueAmount;
// // // //                             }, 0);
// // // //                             courseRevenue += installmentRevenue;

// // // //                             // Add registration amount if present
// // // //                             if (course.registration && course.registration.amount) {
// // // //                                 courseRevenue += Number(course.registration.amount || 0);
// // // //                             }

// // // //                             // Add installment details to the table (as before)
// // // //                             installmentDetails.forEach((installment, installmentIndex) => {
// // // //                                 console.log("Adding installment:", installment);
// // // //                                 allInstallments.push({
// // // //                                     id: `${studentId}-${courseIndex}-${installmentIndex}`,
// // // //                                     studentId,
// // // //                                     studentData,
// // // //                                     feeTemplate,
// // // //                                     courseName: course.selectedCourse?.name || "Unknown Course",
// // // //                                     ...installment
// // // //                                 });
// // // //                             });
// // // //                         } else if (feeTemplate === "FullFees") {
// // // //                             // Use feeAfterDiscount as the revenue
// // // //                             const fullFeesDetails = course.fullFeesDetails || {};
// // // //                             courseRevenue += Number(fullFeesDetails.feeAfterDiscount || 0);

// // // //                             // Add a single entry to the table for FullFees
// // // //                             allInstallments.push({
// // // //                                 id: `${studentId}-${courseIndex}-fullfees`,
// // // //                                 studentId,
// // // //                                 studentData,
// // // //                                 feeTemplate,
// // // //                                 courseName: course.selectedCourse?.name || "Unknown Course",
// // // //                                 number: "N/A",
// // // //                                 dueDate: fullFeesDetails.finalPayment?.date || "",
// // // //                                 dueAmount: fullFeesDetails.feeAfterDiscount || "0",
// // // //                                 paid: fullFeesDetails.finalPayment?.amount ? true : false,
// // // //                                 paidDate: fullFeesDetails.finalPayment?.date || "",
// // // //                                 receivedBy: fullFeesDetails.finalPayment?.receivedBy || "",
// // // //                                 remarks: fullFeesDetails.finalPayment?.remark || ""
// // // //                             });
// // // //                         } else if (feeTemplate === "Finance") {
// // // //                             // Use feeAfterDiscount as the revenue
// // // //                             const financeDetails = course.financeDetails || {};
// // // //                             courseRevenue += Number(financeDetails.feeAfterDiscount || 0);

// // // //                             // Add registration amount if present
// // // //                             if (financeDetails.registration && financeDetails.registration.amount) {
// // // //                                 courseRevenue += Number(financeDetails.registration.amount || 0);
// // // //                             }

// // // //                             // Add a single entry to the table for Finance
// // // //                             allInstallments.push({
// // // //                                 id: `${studentId}-${courseIndex}-finance`,
// // // //                                 studentId,
// // // //                                 studentData,
// // // //                                 feeTemplate,
// // // //                                 courseName: course.selectedCourse?.name || "Unknown Course",
// // // //                                 number: "N/A",
// // // //                                 dueDate: financeDetails.downPaymentDate || "",
// // // //                                 dueAmount: financeDetails.feeAfterDiscount || "0",
// // // //                                 paid: financeDetails.loanStatus === "Disbursed" || financeDetails.loanStatus === "Completed",
// // // //                                 paidDate: financeDetails.downPaymentDate || "",
// // // //                                 receivedBy: financeDetails.registration?.receivedBy || "",
// // // //                                 remarks: financeDetails.registration?.remark || ""
// // // //                             });
// // // //                         } else if (feeTemplate === "Free") {
// // // //                             // No revenue for free courses
// // // //                             courseRevenue = 0;

// // // //                             // Add a single entry to the table for Free
// // // //                             allInstallments.push({
// // // //                                 id: `${studentId}-${courseIndex}-free`,
// // // //                                 studentId,
// // // //                                 studentData,
// // // //                                 feeTemplate,
// // // //                                 courseName: course.selectedCourse?.name || "Unknown Course",
// // // //                                 number: "N/A",
// // // //                                 dueDate: "",
// // // //                                 dueAmount: "0",
// // // //                                 paid: false,
// // // //                                 paidDate: "",
// // // //                                 receivedBy: "",
// // // //                                 remarks: course.freeReason || ""
// // // //                             });
// // // //                         }

// // // //                         totalRevenueCalc += courseRevenue;
// // // //                     });
// // // //                 });

// // // //                 console.log("All installments:", allInstallments);
// // // //                 console.log("Total Revenue:", totalRevenueCalc);
// // // //                 setInstallments(allInstallments);
// // // //                 setTotalRevenue(totalRevenueCalc);
// // // //                 setLoading(false);
// // // //             } catch (error) {
// // // //                 console.error("Error fetching revenue:", error);
// // // //                 setLoading(false);
// // // //             }
// // // //         };

// // // //         fetchAllRevenue();
// // // //     }, []);

// // // //     const handleUpdate = async (installment, field, value) => {
// // // //         try {
// // // //             const [studentId, courseIndex, installmentIndex] = installment.id.split('-');
// // // //             const enrollmentRef = doc(db, "enrollments", studentId);
// // // //             let updatePath;

// // // //             // Determine the update path based on feeTemplate
// // // //             if (installment.feeTemplate === "Installments") {
// // // //                 updatePath = `courses.${courseIndex}.installmentDetails.${installmentIndex}.${field}`;
// // // //             } else if (installment.feeTemplate === "FullFees") {
// // // //                 updatePath = `courses.${courseIndex}.fullFeesDetails.finalPayment.${field}`;
// // // //             } else if (installment.feeTemplate === "Finance") {
// // // //                 updatePath = `courses.${courseIndex}.financeDetails.registration.${field}`;
// // // //             } else {
// // // //                 updatePath = `courses.${courseIndex}.${field}`; // For remarks in Free courses
// // // //             }

// // // //             let updatedValue = value;
// // // //             if (field === "paid") {
// // // //                 updatedValue = value === "Paid"; // Convert to boolean
// // // //                 await updateDoc(enrollmentRef, {
// // // //                     [updatePath]: updatedValue,
// // // //                     ...(installment.feeTemplate === "Installments" && {
// // // //                         [`courses.${courseIndex}.installmentDetails.${installmentIndex}.paidAmount`]: updatedValue ? installment.dueAmount : "",
// // // //                         [`courses.${courseIndex}.installmentDetails.${installmentIndex}.paidDate`]: updatedValue ? new Date().toISOString().split('T')[0] : null
// // // //                     }),
// // // //                     ...(installment.feeTemplate === "FullFees" && {
// // // //                         [`courses.${courseIndex}.fullFeesDetails.finalPayment.amount`]: updatedValue ? installment.dueAmount : "",
// // // //                         [`courses.${courseIndex}.fullFeesDetails.finalPayment.date`]: updatedValue ? new Date().toISOString().split('T')[0] : null
// // // //                     })
// // // //                 });
// // // //             } else if (field === "paidDate") {
// // // //                 updatedValue = value ? Timestamp.fromDate(new Date(value)) : null;
// // // //                 await updateDoc(enrollmentRef, {
// // // //                     [updatePath]: updatedValue
// // // //                 });
// // // //             } else {
// // // //                 await updateDoc(enrollmentRef, {
// // // //                     [updatePath]: value
// // // //                 });
// // // //             }

// // // //             setInstallments(prev => prev.map(item =>
// // // //                 item.id === installment.id ? { ...item, [field]: updatedValue } : item
// // // //             ));
// // // //         } catch (error) {
// // // //             console.error("Error updating installment:", error);
// // // //         }
// // // //     };

// // // //     if (loading) return <div>Loading revenue data...</div>;

// // // //     const totalAmount = installments.reduce((acc, installment) => acc + Number(installment.dueAmount || 0), 0);

// // // //     return (
// // // //         <div className="p-20">
// // // //             <h1 className="text-2xl font-bold mb-4">Revenue Report</h1>
// // // //             <div className="mb-4">
// // // //                 <h2 className="text-xl font-semibold">
// // // //                     Total Expected Revenue: ₹{totalRevenue}
// // // //                 </h2>
// // // //             </div>
// // // //             <div className="overflow-x-auto">
// // // //                 {installments.length === 0 ? (
// // // //                     <p>No revenue data found.</p>
// // // //                 ) : (
// // // //                     <table className="table-auto w-full">
// // // //                         <thead>
// // // //                             <tr className="bg-gray-200">
// // // //                                 <th className="px-4 py-2">Student Name</th>
// // // //                                 <th className="px-4 py-2">Fee Type</th>
// // // //                                 <th className="px-4 py-2">Course Name</th>
// // // //                                 <th className="px-4 py-2">Installment No</th>
// // // //                                 <th className="px-4 py-2">Due Date</th>
// // // //                                 <th className="px-4 py-2">Amount</th>
// // // //                                 <th className="px-4 py-2">Status</th>
// // // //                                 <th className="px-4 py-2">Paid Date</th>
// // // //                                 <th className="px-4 py-2">Received By</th>
// // // //                                 <th className="px-4 py-2">Remarks</th>
// // // //                             </tr>
// // // //                         </thead>
// // // //                         <tbody>
// // // //                             {installments.map((installment) => {
// // // //                                 const dueDate = installment.dueDate instanceof Timestamp
// // // //                                     ? installment.dueDate.toDate()
// // // //                                     : installment.dueDate ? new Date(installment.dueDate) : null;
// // // //                                 const paidDate = installment.paidDate instanceof Timestamp
// // // //                                     ? installment.paidDate.toDate()
// // // //                                     : installment.paidDate ? new Date(installment.paidDate) : null;

// // // //                                 return (
// // // //                                     <tr key={installment.id} className="border-b">
// // // //                                         <td className="px-4 py-2 text-center">
// // // //                                             {installment.studentData?.first_name || 'Unknown'} {installment.studentData?.last_name || ''}
// // // //                                         </td>
// // // //                                         <td className="px-4 py-2 text-center">
// // // //                                             {installment.feeTemplate || 'N/A'}
// // // //                                         </td>
// // // //                                         <td className="px-4 py-2 text-center">
// // // //                                             {installment.courseName}
// // // //                                         </td>
// // // //                                         <td className="px-4 py-2 text-center">{installment.number || 'N/A'}</td>
// // // //                                         <td className="px-4 py-2 text-center">
// // // //                                             {dueDate ? dueDate.toLocaleDateString() : 'N/A'}
// // // //                                         </td>
// // // //                                         <td className="px-4 py-2 text-center">₹{installment.dueAmount || 0}</td>
// // // //                                         <td className="px-4 py-2 text-center">
// // // //                                             <select
// // // //                                                 value={installment.paid ? "Paid" : "Pending"}
// // // //                                                 onChange={(e) => handleUpdate(installment, "paid", e.target.value)}
// // // //                                                 className="p-1 border rounded"
// // // //                                             >
// // // //                                                 <option value="Pending">Pending</option>
// // // //                                                 <option value="Paid">Paid</option>
// // // //                                             </select>
// // // //                                         </td>
// // // //                                         <td className="px-4 py-2 text-center">
// // // //                                             <input
// // // //                                                 type="date"
// // // //                                                 value={paidDate ? paidDate.toISOString().split('T')[0] : ""}
// // // //                                                 onChange={(e) => handleUpdate(installment, "paidDate", e.target.value)}
// // // //                                                 className="p-1 border rounded"
// // // //                                                 disabled={!installment.paid}
// // // //                                             />
// // // //                                         </td>
// // // //                                         <td className="px-4 py-2 text-center">
// // // //                                             <input
// // // //                                                 type="text"
// // // //                                                 value={installment.receivedBy || ""}
// // // //                                                 onChange={(e) => handleUpdate(installment, "receivedBy", e.target.value)}
// // // //                                                 className="p-1 border rounded w-32"
// // // //                                                 disabled={!installment.paid}
// // // //                                             />
// // // //                                         </td>
// // // //                                         <td className="px-4 py-2 text-center">
// // // //                                             <input
// // // //                                                 type="text"
// // // //                                                 value={installment.remarks || ""}
// // // //                                                 onChange={(e) => handleUpdate(installment, "remarks", e.target.value)}
// // // //                                                 className="p-1 border rounded w-48"
// // // //                                             />
// // // //                                         </td>
// // // //                                     </tr>
// // // //                                 );
// // // //                             })}
// // // //                             <tr className="bg-gray-100">
// // // //                                 <td colSpan="5" className="px-4 py-2 font-bold text-right">Total Amount in Table:</td>
// // // //                                 <td className="px-4 py-2 font-bold text-center">₹{totalAmount}</td>
// // // //                                 <td colSpan="4"></td>
// // // //                             </tr>
// // // //                         </tbody>
// // // //                     </table>
// // // //                 )}
// // // //             </div>
// // // //         </div>
// // // //     );
// // // // }


// // import React, { useState, useEffect } from "react";
// // import { db } from "../config/firebase";
// // import { collection, getDocs, Timestamp, updateDoc, doc } from "firebase/firestore";

// // export default function InstallmentReport() {
// //     const [installments, setInstallments] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [filter, setFilter] = useState("thisMonth");

// //     useEffect(() => {
// //         const fetchAllInstallments = async () => {
// //             try {
// //                 const allInstallments = [];
                
// //                 // Fetch student data
// //                 const studentsSnapshot = await getDocs(collection(db, "student"));
// //                 const studentMap = new Map();
// //                 studentsSnapshot.forEach(studentDoc => {
// //                     studentMap.set(studentDoc.id, studentDoc.data());
// //                 });
    
// //                 // Fetch enrollments
// //                 const enrollmentsSnapshot = await getDocs(collection(db, "enrollments"));
                
// //                 enrollmentsSnapshot.forEach(enrollmentDoc => {
// //                     const enrollmentData = enrollmentDoc.data();
// //                     const studentId = enrollmentData.student_id;
// //                     const studentData = studentMap.get(studentId) || {
// //                         first_name: "Unknown",
// //                         last_name: ""
// //                     };
    
// //                     // Process installments array directly from enrollment data
// //                     const installmentDetails = Array.isArray(enrollmentData.installments)
// //                         ? enrollmentData.installments
// //                         : [];

// //                     installmentDetails.forEach((installment, index) => {
// //                         allInstallments.push({
// //                             id: `${studentId}-${index}`,
// //                             studentId,
// //                             studentData,
// //                             // feeTemplate: enrollmentData.fee?.type || "N/A", // Adjust based on your fee structure
// //                             ...installment
// //                         });
// //                     });
// //                 });
    
// //                 setInstallments(allInstallments);
// //                 setLoading(false);
// //             } catch (error) {
// //                 console.error("Error fetching installments:", error);
// //                 setLoading(false);
// //             }
// //         };
    
// //         fetchAllInstallments();
// //     }, []);

// //     const handleUpdate = async (installment, field, value) => {
// //         try {
// //             const [studentId, installmentIndex] = installment.id.split('-');
// //             const enrollmentRef = doc(db, "enrollments", studentId);

// //             const updatePath = `installments.${installmentIndex}.${field}`;
// //             await updateDoc(enrollmentRef, {
// //                 [updatePath]: value
// //             });

// //             setInstallments(prev => prev.map(item =>
// //                 item.id === installment.id ? { ...item, [field]: value } : item
// //             ));
// //         } catch (error) {
// //             console.error("Error updating installment:", error);
// //         }
// //     };

// //     const filterInstallments = () => {
// //         const now = new Date();
// //         let startDate, endDate;

// //         switch (filter) {
// //             case "thisMonth":
// //                 startDate = new Date(now.getFullYear(), now.getMonth(), 1);
// //                 endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
// //                 break;
// //             case "lastMonth":
// //                 startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
// //                 endDate = new Date(now.getFullYear(), now.getMonth(), 0);
// //                 break;
// //             case "nextMonth":
// //                 startDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
// //                 endDate = new Date(now.getFullYear(), now.getMonth() + 2, 0);
// //                 break;
// //             case "thisYear":
// //                 startDate = new Date(now.getFullYear(), 0, 1);
// //                 endDate = new Date(now.getFullYear(), 11, 31);
// //                 break;
// //             case "lastYear":
// //                 startDate = new Date(now.getFullYear() - 1, 0, 1);
// //                 endDate = new Date(now.getFullYear() - 1, 11, 31);
// //                 break;
// //             default:
// //                 return installments;
// //         }

// //         if (loading) return [];

// //         return installments.filter((installment) => {
// //             const dueDate = new Date(installment.dueDate);
// //             return dueDate >= startDate && dueDate <= endDate;
// //         });
// //     };

// //     if (loading) return <div>Loading installments...</div>;

// //     const filteredInstallments = filterInstallments();
// //     const totalAmount = filteredInstallments.reduce((acc, installment) => 
// //         acc + Number(installment.dueAmount), 0);

// //     return (
// //         <div className="p-20">
// //             <h1 className="text-2xl font-bold mb-4">Installment Report</h1>
// //             <div className="mb-4">
// //                 <select value={filter} onChange={(e) => setFilter(e.target.value)} 
// //                     className="p-2 border rounded">
// //                     <option value="thisMonth">This Month</option>
// //                     <option value="lastMonth">Last Month</option>
// //                     <option value="nextMonth">Next Month</option>
// //                     <option value="thisYear">This Year</option>
// //                     <option value="lastYear">Last Year</option>
// //                     <option value="all">All</option>
// //                 </select>
// //             </div>
// //             <div className="overflow-x-auto">
// //                 <table className="table-auto w-full">
// //                     <thead>
// //                         <tr className="bg-gray-200">
// //                             <th className="px-4 py-2">Student Name</th>
// //                             {/* <th className="px-4 py-2">Fee Type</th> */}
// //                             <th className="px-4 py-2">Installment No</th>
// //                             <th className="px-4 py-2">Due Date</th>
// //                             <th className="px-4 py-2">Amount</th>
// //                             <th className="px-4 py-2">Status</th>
// //                             <th className="px-4 py-2">Paid Date</th>
// //                             <th className="px-4 py-2">Received By</th>
// //                             <th className="px-4 py-2">Remarks</th>
// //                         </tr>
// //                     </thead>
// //                     <tbody>
// //                         {filteredInstallments.map((installment) => {
// //                             const dueDate = new Date(installment.dueDate);
// //                             const paidDate = installment.paidDate ? new Date(installment.paidDate) : null;

// //                             return (
// //                                 <tr key={installment.id} className="border-b">
// //                                     <td className="px-4 py-2 text-center">
// //                                         {`${installment.studentData.first_name} ${installment.studentData.last_name}`}
// //                                     </td>
// //                                     {/* <td className="px-4 py-2 text-center">
// //                                         {installment.feeTemplate}
// //                                     </td> */}
// //                                     <td className="px-4 py-2 text-center">
// //                                         {installment.number}
// //                                     </td>
// //                                     <td className="px-4 py-2 text-center">
// //                                         {dueDate.toLocaleDateString()}
// //                                     </td>
// //                                     <td className="px-4 py-2 text-center">
// //                                         ₹{installment.dueAmount}
// //                                     </td>
// //                                     <td className="px-4 py-2 text-center">
// //                                         <select
// //                                             value={installment.paidAmount ? "Paid" : "Pending"}
// //                                             onChange={(e) => handleUpdate(
// //                                                 installment,
// //                                                 "paidAmount",
// //                                                 e.target.value === "Paid" ? installment.dueAmount : ""
// //                                             )}
// //                                             className="p-1 border rounded"
// //                                         >
// //                                             <option value="Pending">Pending</option>
// //                                             <option value="Paid">Paid</option>
// //                                         </select>
// //                                     </td>
// //                                     <td className="px-4 py-2 text-center">
// //                                         <input
// //                                             type="date"
// //                                             value={paidDate ? paidDate.toISOString().split('T')[0] : ""}
// //                                             onChange={(e) => handleUpdate(
// //                                                 installment,
// //                                                 "paidDate",
// //                                                 e.target.value
// //                                             )}
// //                                             className="p-1 border rounded"
// //                                             disabled={!installment.paidAmount}
// //                                         />
// //                                     </td>
// //                                     <td className="px-4 py-2 text-center">
// //                                         <input
// //                                             type="text"
// //                                             value={installment.receivedBy || ""}
// //                                             onChange={(e) => handleUpdate(
// //                                                 installment,
// //                                                 "receivedBy",
// //                                                 e.target.value
// //                                             )}
// //                                             className="p-1 border rounded w-32"
// //                                             disabled={!installment.paidAmount}
// //                                         />
// //                                     </td>
// //                                     <td className="px-4 py-2 text-center">
// //                                         <input
// //                                             type="text"
// //                                             value={installment.remark || ""}
// //                                             onChange={(e) => handleUpdate(
// //                                                 installment,
// //                                                 "remark",
// //                                                 e.target.value
// //                                             )}
// //                                             className="p-1 border rounded w-48"
// //                                         />
// //                                     </td>
// //                                 </tr>
// //                             );
// //                         })}
// //                         <tr className="bg-gray-100">
// //                             <td colSpan="4" className="px-4 py-2 font-bold text-right">Total:</td>
// //                             <td className="px-4 py-2 font-bold text-center">₹{totalAmount}</td>
// //                             <td colSpan="4"></td>
// //                         </tr>
// //                     </tbody>
// //                 </table>
// //             </div>
// //         </div>
// //     );
// // }


// import React, { useState, useEffect } from "react";
// import { db } from "../config/firebase";
// import { collection, getDocs, Timestamp, updateDoc, doc } from "firebase/firestore";

// export default function InstallmentReport() {
//     const [installments, setInstallments] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [filter, setFilter] = useState("thisMonth");

//     useEffect(() => {
//         const fetchAllInstallments = async () => {
//             try {
//                 const allInstallments = [];
//                 const seenIds = new Set(); // To track unique installment IDs
                
//                 console.log("Fetching installments...");
                
//                 // Fetch student data
//                 const studentsSnapshot = await getDocs(collection(db, "student"));
//                 const studentMap = new Map();
//                 studentsSnapshot.forEach(studentDoc => {
//                     studentMap.set(studentDoc.id, studentDoc.data());
//                 });
//                 console.log("Number of students fetched:", studentMap.size);
    
//                 // Fetch enrollments
//                 const enrollmentsSnapshot = await getDocs(collection(db, "enrollments"));
//                 console.log("Number of enrollments fetched:", enrollmentsSnapshot.size);
                
//                 enrollmentsSnapshot.forEach(enrollmentDoc => {
//                     const enrollmentData = enrollmentDoc.data();
//                     const studentId = enrollmentData.student_id;
//                     const studentData = studentMap.get(studentId) || {
//                         first_name: "Unknown",
//                         last_name: ""
//                     };
    
//                     const installmentDetails = Array.isArray(enrollmentData.installments)
//                         ? enrollmentData.installments
//                         : [];

//                     console.log(`Processing enrollment for student ${studentId}, installments found: ${installmentDetails.length}`);

//                     installmentDetails.forEach((installment, index) => {
//                         const installmentId = `${studentId}-${index}`;
//                         if (!seenIds.has(installmentId)) {
//                             seenIds.add(installmentId);
//                             allInstallments.push({
//                                 id: installmentId,
//                                 studentId,
//                                 studentData,
//                                 feeTemplate: enrollmentData.fee?.type || "N/A",
//                                 ...installment
//                             });
//                         } else {
//                             console.log(`Duplicate installment detected: ${installmentId}`);
//                         }
//                     });
//                 });
    
//                 console.log("Total unique installments:", allInstallments.length);
//                 setInstallments(allInstallments);
//                 setLoading(false);
//             } catch (error) {
//                 console.error("Error fetching installments:", error);
//                 setLoading(false);
//             }
//         };
    
//         fetchAllInstallments();
//     }, []); // Empty dependency array ensures this runs only once on mount

//     const handleUpdate = async (installment, field, value) => {
//         try {
//             const [studentId, installmentIndex] = installment.id.split('-');
//             const enrollmentRef = doc(db, "enrollments", studentId);

//             const updatePath = `installments.${installmentIndex}.${field}`;
//             await updateDoc(enrollmentRef, {
//                 [updatePath]: value
//             });

//             setInstallments(prev => prev.map(item =>
//                 item.id === installment.id ? { ...item, [field]: value } : item
//             ));
//         } catch (error) {
//             console.error("Error updating installment:", error);
//         }
//     };

//     const filterInstallments = () => {
//         const now = new Date();
//         let startDate, endDate;

//         switch (filter) {
//             case "thisMonth":
//                 startDate = new Date(now.getFullYear(), now.getMonth(), 1);
//                 endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
//                 break;
//             case "lastMonth":
//                 startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
//                 endDate = new Date(now.getFullYear(), now.getMonth(), 0);
//                 break;
//             case "nextMonth":
//                 startDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
//                 endDate = new Date(now.getFullYear(), now.getMonth() + 2, 0);
//                 break;
//             case "thisYear":
//                 startDate = new Date(now.getFullYear(), 0, 1);
//                 endDate = new Date(now.getFullYear(), 11, 31);
//                 break;
//             case "lastYear":
//                 startDate = new Date(now.getFullYear() - 1, 0, 1);
//                 endDate = new Date(now.getFullYear() - 1, 11, 31);
//                 break;
//             default:
//                 return installments;
//         }

//         if (loading) return [];

//         return installments.filter((installment) => {
//             const dueDate = new Date(installment.dueDate);
//             return dueDate >= startDate && dueDate <= endDate;
//         });
//     };

//     if (loading) return <div>Loading installments...</div>;

//     const filteredInstallments = filterInstallments();
//     const totalAmount = filteredInstallments.reduce((acc, installment) => 
//         acc + Number(installment.dueAmount), 0);

//     return (
//         <div className="p-20">
//             <h1 className="text-2xl font-bold mb-4">Installment Report</h1>
//             <div className="mb-4">
//                 <select value={filter} onChange={(e) => setFilter(e.target.value)} 
//                     className="p-2 border rounded">
//                     <option value="thisMonth">This Month</option>
//                     <option value="lastMonth">Last Month</option>
//                     <option value="nextMonth">Next Month</option>
//                     <option value="thisYear">This Year</option>
//                     <option value="lastYear">Last Year</option>
//                     <option value="all">All</option>
//                 </select>
//             </div>
//             <div className="overflow-x-auto">
//                 <table className="table-auto w-full">
//                     <thead>
//                         <tr className="bg-gray-200">
//                             <th className="px-4 py-2">Student Name</th>
//                             <th className="px-4 py-2">Fee Type</th>
//                             <th className="px-4 py-2">Installment No</th>
//                             <th className="px-4 py-2">Due Date</th>
//                             <th className="px-4 py-2">Amount</th>
//                             <th className="px-4 py-2">Status</th>
//                             <th className="px-4 py-2">Paid Date</th>
//                             <th className="px-4 py-2">Received By</th>
//                             <th className="px-4 py-2">Remarks</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredInstallments.map((installment) => {
//                             const dueDate = new Date(installment.dueDate);
//                             const paidDate = installment.paidDate ? new Date(installment.paidDate) : null;

//                             return (
//                                 <tr key={installment.id} className="border-b">
//                                     <td className="px-4 py-2 text-center">
//                                         {`${installment.studentData.first_name} ${installment.studentData.last_name}`}
//                                     </td>
//                                     <td className="px-4 py-2 text-center">
//                                         {installment.feeTemplate}
//                                     </td>
//                                     <td className="px-4 py-2 text-center">
//                                         {installment.number}
//                                     </td>
//                                     <td className="px-4 py-2 text-center">
//                                         {dueDate.toLocaleDateString()}
//                                     </td>
//                                     <td className="px-4 py-2 text-center">
//                                         ₹{installment.dueAmount}
//                                     </td>
//                                     <td className="px-4 py-2 text-center">
//                                         <select
//                                             value={installment.paidAmount ? "Paid" : "Pending"}
//                                             onChange={(e) => handleUpdate(
//                                                 installment,
//                                                 "paidAmount",
//                                                 e.target.value === "Paid" ? installment.dueAmount : ""
//                                             )}
//                                             className="p-1 border rounded"
//                                         >
//                                             <option value="Pending">Pending</option>
//                                             <option value="Paid">Paid</option>
//                                         </select>
//                                     </td>
//                                     <td className="px-4 py-2 text-center">
//                                         <input
//                                             type="date"
//                                             value={paidDate ? paidDate.toISOString().split('T')[0] : ""}
//                                             onChange={(e) => handleUpdate(
//                                                 installment,
//                                                 "paidDate",
//                                                 e.target.value
//                                             )}
//                                             className="p-1 border rounded"
//                                             disabled={!installment.paidAmount}
//                                         />
//                                     </td>
//                                     <td className="px-4 py-2 text-center">
//                                         <input
//                                             type="text"
//                                             value={installment.receivedBy || ""}
//                                             onChange={(e) => handleUpdate(
//                                                 installment,
//                                                 "receivedBy",
//                                                 e.target.value
//                                             )}
//                                             className="p-1 border rounded w-32"
//                                             disabled={!installment.paidAmount}
//                                         />
//                                     </td>
//                                     <td className="px-4 py-2 text-center">
//                                         <input
//                                             type="text"
//                                             value={installment.remark || ""}
//                                             onChange={(e) => handleUpdate(
//                                                 installment,
//                                                 "remark",
//                                                 e.target.value
//                                             )}
//                                             className="p-1 border rounded w-48"
//                                         />
//                                     </td>
//                                 </tr>
//                             );
//                         })}
//                         <tr className="bg-gray-100">
//                             <td colSpan="4" className="px-4 py-2 font-bold text-right">Total:</td>
//                             <td className="px-4 py-2 font-bold text-center">₹{totalAmount}</td>
//                             <td colSpan="4"></td>
//                         </tr>
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }


import React, { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { collection, getDocs, Timestamp, updateDoc, doc } from "firebase/firestore";

export default function InstallmentReport() {
    const [installments, setInstallments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [filter, setFilter] = useState("thisMonth");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [feeTypeFilter, setFeeTypeFilter] = useState("all");
    const [studentSearch, setStudentSearch] = useState("");

    useEffect(() => {
        const fetchAllInstallments = async () => {
            try {
                const allInstallments = [];
                const seenIds = new Set();

                const studentsSnapshot = await getDocs(collection(db, "student"));
                const studentMap = new Map();
                studentsSnapshot.forEach(studentDoc => {
                    studentMap.set(studentDoc.id, studentDoc.data());
                });

                const enrollmentsSnapshot = await getDocs(collection(db, "enrollments"));
                enrollmentsSnapshot.forEach(enrollmentDoc => {
                    const enrollmentData = enrollmentDoc.data();
                    const studentId = enrollmentData.student_id;
                    const studentData = studentMap.get(studentId) || { first_name: "Unknown", last_name: "" };
                    const installmentDetails = Array.isArray(enrollmentData.installments) ? enrollmentData.installments : [];

                    installmentDetails.forEach((installment, index) => {
                        const installmentId = `${studentId}-${index}`;
                        if (!seenIds.has(installmentId)) {
                            seenIds.add(installmentId);
                            allInstallments.push({
                                id: installmentId,
                                studentId,
                                studentData,
                                feeTemplate: enrollmentData.fee?.type || "N/A",
                                ...installment
                            });
                        }
                    });
                });

                setInstallments(allInstallments);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching installments:", error);
                setLoading(false);
            }
        };

        fetchAllInstallments();
    }, []);

    const handleUpdate = async (installment, field, value) => {
        try {
            const [studentId, installmentIndex] = installment.id.split('-');
            const enrollmentRef = doc(db, "enrollments", studentId);
            const updatePath = `installments.${installmentIndex}.${field}`;

            await updateDoc(enrollmentRef, {
                [updatePath]: value
            });

            setInstallments(prev =>
                prev.map(item =>
                    item.id === installment.id ? { ...item, [field]: value } : item
                )
            );
        } catch (error) {
            console.error("Error updating installment:", error);
        }
    };

    const filterInstallments = () => {
        const now = new Date();
        let startDate, endDate;

        switch (filter) {
            case "thisMonth":
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                break;
            case "lastMonth":
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                endDate = new Date(now.getFullYear(), now.getMonth(), 0);
                break;
            case "nextMonth":
                startDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 2, 0);
                break;
            case "thisYear":
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = new Date(now.getFullYear(), 11, 31);
                break;
            case "lastYear":
                startDate = new Date(now.getFullYear() - 1, 0, 1);
                endDate = new Date(now.getFullYear() - 1, 11, 31);
                break;
            case "custom":
                if (fromDate && toDate) {
                    startDate = new Date(fromDate);
                    endDate = new Date(toDate);
                }
                break;
            default:
                break;
        }

        return installments.filter((installment) => {
            const dueDate = new Date(installment.dueDate);
            const matchesDate = !startDate || (dueDate >= startDate && dueDate <= endDate);
            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "paid" && installment.paidAmount) ||
                (statusFilter === "pending" && !installment.paidAmount);
            const matchesFeeType =
                feeTypeFilter === "all" ||
                installment.feeTemplate?.toLowerCase() === feeTypeFilter.toLowerCase();
            const fullName = `${installment.studentData.first_name} ${installment.studentData.last_name}`.toLowerCase();
            const matchesSearch = fullName.includes(studentSearch.toLowerCase());

            return matchesDate && matchesStatus && matchesFeeType && matchesSearch;
        });
    };

    if (loading) return <div>Loading installments...</div>;

    const filteredInstallments = filterInstallments();
    const totalAmount = filteredInstallments.reduce((acc, installment) =>
        acc + Number(installment.dueAmount), 0);

    return (
        <div className="p-20">
            <h1 className="text-2xl font-bold mb-4">Installment Report</h1>

            {/* Filters */}
            <div className="mb-4 flex flex-wrap gap-4 items-center">
                <select value={filter} onChange={(e) => setFilter(e.target.value)} className="p-2 border rounded">
                    <option value="thisMonth">This Month</option>
                    <option value="lastMonth">Last Month</option>
                    <option value="nextMonth">Next Month</option>
                    <option value="thisYear">This Year</option>
                    <option value="lastYear">Last Year</option>
                    <option value="custom">Custom Range</option>
                    <option value="all">All</option>
                </select>

                {filter === "custom" && (
                    <>
                        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="p-2 border rounded" />
                        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="p-2 border rounded" />
                    </>
                )}

                <input
                    type="text"
                    placeholder="Search by student name"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="p-2 border rounded"
                />

                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="p-2 border rounded">
                    <option value="all">All Status</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                </select>

                <select value={feeTypeFilter} onChange={(e) => setFeeTypeFilter(e.target.value)} className="p-2 border rounded">
                    <option value="all">All Fee Types</option>
                    <option value="tuition">Tuition</option>
                    <option value="exam">Exam</option>
                </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="table-auto w-full">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="px-4 py-2">Student Name</th>
                            <th className="px-4 py-2">Fee Type</th>
                            <th className="px-4 py-2">Installment No</th>
                            <th className="px-4 py-2">Due Date</th>
                            <th className="px-4 py-2">Amount</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Paid Date</th>
                            <th className="px-4 py-2">Received By</th>
                            <th className="px-4 py-2">Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInstallments.map((installment) => {
                            const dueDate = new Date(installment.dueDate);
                            const paidDate = installment.paidDate ? new Date(installment.paidDate) : null;

                            return (
                                <tr key={installment.id} className="border-b">
                                    <td className="px-4 py-2 text-center">{`${installment.studentData.first_name} ${installment.studentData.last_name}`}</td>
                                    <td className="px-4 py-2 text-center">{installment.feeTemplate}</td>
                                    <td className="px-4 py-2 text-center">{installment.number}</td>
                                    <td className="px-4 py-2 text-center">{dueDate.toLocaleDateString()}</td>
                                    <td className="px-4 py-2 text-center">₹{installment.dueAmount}</td>
                                    <td className="px-4 py-2 text-center">
                                        <select
                                            value={installment.paidAmount ? "Paid" : "Pending"}
                                            onChange={(e) => handleUpdate(
                                                installment,
                                                "paidAmount",
                                                e.target.value === "Paid" ? installment.dueAmount : ""
                                            )}
                                            className="p-1 border rounded"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Paid">Paid</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        <input
                                            type="date"
                                            value={paidDate ? paidDate.toISOString().split('T')[0] : ""}
                                            onChange={(e) => handleUpdate(installment, "paidDate", e.target.value)}
                                            className="p-1 border rounded"
                                            disabled={!installment.paidAmount}
                                        />
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        <input
                                            type="text"
                                            value={installment.receivedBy || ""}
                                            onChange={(e) => handleUpdate(installment, "receivedBy", e.target.value)}
                                            className="p-1 border rounded w-32"
                                            disabled={!installment.paidAmount}
                                        />
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        <input
                                            type="text"
                                            value={installment.remark || ""}
                                            onChange={(e) => handleUpdate(installment, "remark", e.target.value)}
                                            className="p-1 border rounded w-48"
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                        <tr className="bg-gray-100">
                            <td colSpan="4" className="px-4 py-2 font-bold text-right">Total:</td>
                            <td className="px-4 py-2 font-bold text-center">₹{totalAmount}</td>
                            <td colSpan="4"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
