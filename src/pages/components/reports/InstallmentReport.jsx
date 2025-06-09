// import React, { useEffect, useState } from 'react';
// import { db } from '../../../config/firebase';
// import { collection, getDocs } from 'firebase/firestore';
// import { useAuth } from '../../../context/AuthContext';
// import { useNavigate } from 'react-router-dom';

// const getDateRange = (filter) => {
//   const today = new Date();
//   const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
//   const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

//   switch (filter) {
//     case 'thisMonth':
//       return { start: startOfMonth, end: endOfMonth };
//     case 'nextMonth':
//       return {
//         start: new Date(today.getFullYear(), today.getMonth() + 1, 1),
//         end: new Date(today.getFullYear(), today.getMonth() + 2, 0),
//       };
//     case 'lastMonth':
//       return {
//         start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
//         end: new Date(today.getFullYear(), today.getMonth(), 0),
//       };
//     case 'all':
//     default:
//       return { start: null, end: null };
//   }
// };

// const isDateInRange = (dateStr, start, end) => {
//   if (!dateStr || (!start && !end)) return true;
//   const date = new Date(dateStr);
//   if (isNaN(date.getTime())) return false;
//   return (!start || date >= start) && (!end || date <= end);
// };

// const toNumber = (value) => {
//   const num = Number(value);
//   return isNaN(num) ? 0 : num;
// };

// const InstallmentReport = () => {
//   const { rolePermissions } = useAuth();
//   const [feeData, setFeeData] = useState([]);
//   const [filter, setFilter] = useState('all');
//   const [totalReceived, setTotalReceived] = useState(0);
//   const [totalPending, setTotalPending] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [expandedRows, setExpandedRows] = useState({});
//   const navigate = useNavigate();

//   const canDisplayReports = rolePermissions?.enrollments?.display || false;

//   useEffect(() => {
//     const fetchFeeData = async () => {
//       if (!canDisplayReports) return;
//       try {
//         setLoading(true);
//         setFeeData([]);
//         setTotalReceived(0);
//         setTotalPending(0);

//         const studentSnapshot = await getDocs(collection(db, 'student'));
//         const studentMap = {};
//         studentSnapshot.forEach((doc) => {
//           studentMap[doc.id] = doc.data().Name || 'Unknown';
//         });

//         const enrollmentSnapshot = await getDocs(collection(db, 'enrollments'));
//         const data = [];
//         let totalReceivedAcc = 0;
//         let totalPendingAcc = 0;

//         const { start, end } = getDateRange(filter);

//         // Aggregate by student and course
//         const enrollmentMap = {};

//         for (const enrollmentDoc of enrollmentSnapshot.docs) {
//           const studentId = enrollmentDoc.id;
//           const studentName = studentMap[studentId] || 'Unknown';
//           const courses = enrollmentDoc.data().courses || [];

//           for (const course of courses) {
//             const courseName = course.selectedCourse?.name || 'Unknown Course';
//             const key = `${studentId}-${courseName}`;

//             // Initialize enrollment data
//             if (!enrollmentMap[key]) {
//               enrollmentMap[key] = {
//                 studentId,
//                 studentName,
//                 courseName,
//                 totalFees: 0,
//                 transactions: [],
//                 totalPaid: 0,
//                 remaining: 0,
//                 validationError: '',
//               };
//             }

//             // Calculate total fees
//             let totalFees = 0;
//             if (course.feeTemplate === 'Free') {
//               totalFees = 0;
//             } else if (course.feeTemplate === 'FullFees') {
//               totalFees = toNumber(course.fullFeesDetails?.feeAfterDiscount || course.fullFeesDetails?.totalFees || 0);
//             } else if (course.feeTemplate === 'Installments') {
//               const regAmount = toNumber(course.registration?.amount || 0);
//               const installmentTotal = (course.installmentDetails || []).reduce(
//                 (sum, inst) => sum + toNumber(inst.dueAmount || 0),
//                 0
//               );
//               totalFees = regAmount + installmentTotal;
//             } else if (course.feeTemplate === 'Finance') {
//               // Use feeAfterDiscount as totalFees, or sum of registration amounts
//               totalFees = toNumber(course.financeDetails?.feeAfterDiscount || 0);

//               // Validate sum of Loan Amount registrations matches loanAmount
//               const loanRegistrations = (course.financeDetails?.registrations || []).filter(
//                 (reg) => reg.amountType === 'Loan Amount'
//               );
//               const totalLoanAmount = loanRegistrations.reduce(
//                 (sum, reg) => sum + toNumber(reg.amount || 0),
//                 0
//               );
//               const expectedLoanAmount = toNumber(course.financeDetails?.loanAmount || 0);
//               if (totalLoanAmount !== expectedLoanAmount && expectedLoanAmount !== 0) {
//                 enrollmentMap[key].validationError = `Formula Error: Sum of Loan Amount registrations (${totalLoanAmount}) does not match Loan Amount (${expectedLoanAmount})`;
//               }
//             }

//             enrollmentMap[key].totalFees = totalFees;

//             // Process transactions
//             if (course.feeTemplate === 'FullFees') {
//               const { fullFeesDetails } = course;

//               if (fullFeesDetails?.registration?.amount) {
//                 const regAmount = toNumber(fullFeesDetails.registration.amount);
//                 const status = fullFeesDetails.registration.status || 'Pending';
//                 const dateField = fullFeesDetails.registration.date || null;
//                 const inRange = dateField ? isDateInRange(dateField, start, end) : false;

//                 if (inRange || (filter === 'all' && dateField)) {
//                   enrollmentMap[key].transactions.push({
//                     type: 'FullFees (Registration)',
//                     amount: regAmount,
//                     status,
//                     date: dateField,
//                     paymentMethod: fullFeesDetails.registration.paymentMethod || 'N/A',
//                     amountType: 'N/A',
//                   });
//                   if (status === 'Paid') {
//                     enrollmentMap[key].totalPaid += regAmount;
//                     totalReceivedAcc += regAmount;
//                   } else {
//                     totalPendingAcc += regAmount;
//                   }
//                 }
//               }

//               // Final Payment
//               if (fullFeesDetails?.finalPayment?.amount) {
//                 const finalAmount = toNumber(fullFeesDetails.finalPayment.amount);
//                 const status = fullFeesDetails.finalPayment.status || 'Pending';
//                 const dateField = fullFeesDetails.finalPayment.date || null;
//                 const inRange = dateField ? isDateInRange(dateField, start, end) : false;

//                 if (inRange || (filter === 'all' && dateField)) {
//                   enrollmentMap[key].transactions.push({
//                     type: 'FullFees (Final Payment)',
//                     amount: finalAmount,
//                     status,
//                     date: dateField,
//                     paymentMethod: fullFeesDetails.finalPayment.paymentMethod || 'N/A',
//                     amountType: 'N/A',
//                   });
//                   if (status === 'Paid') {
//                     enrollmentMap[key].totalPaid += finalAmount;
//                     totalReceivedAcc += finalAmount;
//                   } else {
//                     totalPendingAcc += finalAmount;
//                   }
//                 }
//               }
//             } else if (course.feeTemplate === 'Installments') {
//               const { installmentDetails, registration } = course;

//               // Registration Payment
//               if (registration?.amount) {
//                 const regAmount = toNumber(registration.amount);
//                 const status = registration.status || 'Pending';
//                 const dateField = registration.date || null;
//                 const inRange = dateField ? isDateInRange(dateField, start, end) : false;

//                 if (inRange || (filter === 'all' && dateField)) {
//                   enrollmentMap[key].transactions.push({
//                     type: 'Installments (Registration)',
//                     amount: regAmount,
//                     status,
//                     date: dateField,
//                     paymentMethod: registration.paymentMethod || 'N/A',
//                     amountType: 'N/A',
//                   });
//                   if (status === 'Paid') {
//                     enrollmentMap[key].totalPaid += regAmount;
//                     totalReceivedAcc += regAmount;
//                   } else {
//                     totalPendingAcc += regAmount;
//                   }
//                 }
//               }

//               // Installments
//               (installmentDetails || []).forEach((installment, idx) => {
//                 const dueAmount = toNumber(installment.dueAmount || 0);
//                 const paidAmount = toNumber(installment.paidAmount || 0);
//                 const status = installment.status || 'Pending';
//                 const dateField = status === 'Paid' ? installment.paidDate : installment.dueDate || null;
//                 const inRange = dateField ? isDateInRange(dateField, start, end) : false;

//                 if ((inRange || (filter === 'all' && dateField)) && (dueAmount > 0 || paidAmount > 0)) {
//                   enrollmentMap[key].transactions.push({
//                     type: `Installments (No. ${installment.number || idx + 1})`,
//                     amount: status === 'Paid' ? paidAmount : dueAmount,
//                     status,
//                     date: dateField,
//                     paymentMethod: installment.paymentMethod || 'N/A',
//                     amountType: 'N/A',
//                   });
//                   if (status === 'Paid') {
//                     enrollmentMap[key].totalPaid += paidAmount;
//                     totalReceivedAcc += paidAmount;
//                   } else {
//                     totalPendingAcc += dueAmount;
//                   }
//                 }
//               });
//             } else if (course.feeTemplate === 'Finance') {
//               const { financeDetails } = course;

//               // Process Registrations
//               (financeDetails?.registrations || []).forEach((registration, regIndex) => {
//                 const regAmount = toNumber(registration.amount || 0);
//                 const status = registration.status || 'Pending';
//                 const dateField = registration.date || null;
//                 const inRange = dateField ? isDateInRange(dateField, start, end) : false;

//                 if ((inRange || (filter === 'all' && dateField)) && regAmount > 0) {
//                   enrollmentMap[key].transactions.push({

//                     // type: `Finance ${registration.srNo}`,
//                     type: 'Finance',
//                     amount: regAmount,
//                     status,
//                     date: dateField,
//                     paymentMethod: registration.paymentMethod || 'N/A',
//                     amountType: registration.amountType || 'Non-Loan Amount',
//                   });
//                   if (status === 'Paid') {
//                     enrollmentMap[key].totalPaid += regAmount;
//                     totalReceivedAcc += regAmount;
//                   } else {
//                     totalPendingAcc += regAmount;
//                   }
//                 }

//                 // Process Loan Sub-Registrations for Loan Amount registrations
//                 if (registration.amountType === 'Loan Amount') {
//                   (registration.loanSubRegistrations || []).forEach((subReg, subIndex) => {
//                     const subRegAmount = toNumber(subReg.amount || 0);
//                     const subStatus = subReg.status || 'Pending';
//                     const subDateField = subReg.date || null;
//                     const subInRange = subDateField ? isDateInRange(subDateField, start, end) : false;

//                     // if ((subInRange || (filter === 'all' && subDateField)) && subRegAmount > 0) {
//                     //   enrollmentMap[key].transactions.push({
//                     //     type: `Finance (Loan Sub-Registration ${registration.srNo}.${subReg.srNo})`,
//                     //     amount: subRegAmount,
//                     //     status: subStatus,
//                     //     date: subDateField,
//                     //     paymentMethod: subReg.paymentMethod || 'N/A',
//                     //     amountType: 'Loan Amount',
//                     //   });
//                     //   if (subStatus === 'Paid') {
//                     //     enrollmentMap[key].totalPaid += subRegAmount;
//                     //     totalReceivedAcc += subRegAmount;
//                     //     // totalPendingAcc += (loanAmount - subRegAmount);
//                     //   } else {
//                     //     totalPendingAcc += subRegAmount;
//                     //   }
//                     // }
//                   });
//                 }
//               });
//             } else if (course.feeTemplate === 'Free' && filter === 'all') {
//               enrollmentMap[key].transactions.push({
//                 type: 'Free',
//                 amount: 0,
//                 status: 'N/A',
//                 date: null,
//                 paymentMethod: 'N/A',
//                 amountType: 'N/A',
//               });
//             }

//             // Calculate remaining balance
//             enrollmentMap[key].remaining = totalFees - enrollmentMap[key].totalPaid;
//           }
//         }

//         // Convert enrollmentMap to array
//         Object.values(enrollmentMap).forEach((enrollment) => {
//           if (enrollment.transactions.length > 0) {
//             data.push(enrollment);
//           }
//         });

//         setFeeData(data);
//         setTotalReceived(totalReceivedAcc);
//         setTotalPending(totalPendingAcc);
//       } catch (error) {
//         //console.error('Error fetching fee data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFeeData();
//   }, [filter, canDisplayReports]);

//   const handleFilterChange = (e) => {
//     setFilter(e.target.value);
//   };

//   const toggleRow = (index) => {
//     setExpandedRows((prev) => ({
//       ...prev,
//       [index]: !prev[index],
//     }));
//   };

//   if (!canDisplayReports) {
//     return (
//       <div className="p-6 text-red-600 text-center">
//         Access Denied: You do not have permission to view fee reports.
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 min-h-screen fixed inset-0 left-[300px]">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">Fee Report</h1>
//         <button
//           onClick={() => navigate('/reports-dashboard')}
//           className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
//         >
//           Analytics
//         </button>
//       </div>

//       {/* Filter Dropdown */}
//       <div className="mb-6">
//         <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-2">
//           Filter By
//         </label>
//         <select
//           id="filter"
//           value={filter}
//           onChange={handleFilterChange}
//           className="w-full max-w-xs p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//         >
//           <option value="all">All</option>
//           <option value="thisMonth">This Month</option>
//           <option value="nextMonth">Next Month</option>
//           <option value="lastMonth">Last Month</option>
//         </select>
//       </div>

//       {/* Summary */}
//       <div className="flex flex-col sm:flex-row sm:space-x-8 mb-6 bg-white p-4 rounded-lg shadow">
//         <div className="text-lg font-semibold text-gray-700">
//           Total Received: ₹{totalReceived.toFixed(2)}
//         </div>
//         <div className="text-lg font-semibold text-gray-700">
//           Total Pending: ₹{totalPending.toFixed(2)}
//         </div>
//       </div>

//       {/* Fee Data Table */}
//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//         </div>
//       ) : (
//         <div className="bg-white rounded-lg shadow overflow-x-auto overflow-y-auto max-h-[calc(100vh-350px)]">
//           <table className="w-full divide-y divide-gray-200">
//             <thead className="bg-blue-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Student Name
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Course
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Total Fees
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Total Paid
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Remaining
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Validation
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {feeData.length > 0 ? (
//                 feeData.map((row, index) => (
//                   <React.Fragment key={index}>
//                     <tr className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         <button
//                           onClick={() => toggleRow(index)}
//                           className="text-blue-600 hover:text-blue-800"
//                         >
//                           {expandedRows[index] ? '▼' : '▶'}
//                         </button>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {row.studentName}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {row.courseName}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         ₹{toNumber(row.totalFees).toFixed(2)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
//                         ₹{toNumber(row.totalPaid).toFixed(2)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
//                         ₹{toNumber(row.remaining).toFixed(2)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
//                         {row.validationError || 'Valid'}
//                       </td>
//                     </tr>
//                     {expandedRows[index] && (
//                       <tr>
//                         <td colSpan={7} className="px-6 py-4 bg-gray-50">
//                           <div className="overflow-x-auto">
//                             <table className="w-full divide-y divide-gray-200">
//                               <thead className="bg-gray-100">
//                                 <tr>
//                                   <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                     Transaction Type
//                                   </th>
//                                   <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                     Amount
//                                   </th>
//                                   <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                     Status
//                                   </th>
//                                   <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                     Date
//                                   </th>
//                                   <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                     Payment Method
//                                   </th>
//                                   <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                     Amount Type
//                                   </th>
//                                 </tr>
//                               </thead>
//                               <tbody className="bg-white divide-y divide-gray-200">
//                                 {row.transactions.map((txn, txnIndex) => (
//                                   <tr key={txnIndex}>
//                                     <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
//                                       {txn.type}
//                                     </td>
//                                     <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
//                                       ₹{toNumber(txn.amount).toFixed(2)}
//                                     </td>
//                                     <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
//                                       {txn.status}
//                                     </td>
//                                     <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
//                                       {txn.date ? new Date(txn.date).toLocaleDateString() : 'N/A'}
//                                     </td>
//                                     <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
//                                       {txn.paymentMethod}
//                                     </td>
//                                     <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
//                                       {txn.amountType}
//                                     </td>
//                                   </tr>
//                                 ))}
//                               </tbody>
//                             </table>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
//                     No fee data available.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default InstallmentReport;



import React, { useEffect, useState } from 'react';
import { db } from '../../../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const getDateRange = (filter) => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  switch (filter) {
    case 'thisMonth':
      return { start: startOfMonth, end: endOfMonth };
    case 'nextMonth':
      return {
        start: new Date(today.getFullYear(), today.getMonth() + 1, 1),
        end: new Date(today.getFullYear(), today.getMonth() + 2, 0),
      };
    case 'lastMonth':
      return {
        start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        end: new Date(today.getFullYear(), today.getMonth(), 0),
      };
    case 'all':
    default:
      return { start: null, end: null };
  }
};

const isDateInRange = (dateStr, start, end) => {
  if (!dateStr || (!start && !end)) return true;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return false;
  return (!start || date >= start) && (!end || date <= end);
};

const toNumber = (value) => {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

const InstallmentReport = () => {
  const { rolePermissions } = useAuth();
  const [feeData, setFeeData] = useState([]);
  const [filter, setFilter] = useState('all');
  const [totalReceived, setTotalReceived] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState({});
  const navigate = useNavigate();

  const canDisplayReports = rolePermissions?.enrollments?.display || false;

  useEffect(() => {
    const fetchFeeData = async () => {
      if (!canDisplayReports) return;
      try {
        setLoading(true);
        setFeeData([]);
        setTotalReceived(0);
        setTotalPending(0);

        const studentSnapshot = await getDocs(collection(db, 'student'));
        const studentMap = {};
        studentSnapshot.forEach((doc) => {
          studentMap[doc.id] = doc.data().Name || 'Unknown';
        });

        const enrollmentSnapshot = await getDocs(collection(db, 'enrollments'));
        const data = [];
        let totalReceivedAcc = 0;
        let totalPendingAcc = 0;

        const { start, end } = getDateRange(filter);

        // Aggregate by student and course
        const enrollmentMap = {};

        for (const enrollmentDoc of enrollmentSnapshot.docs) {
          const studentId = enrollmentDoc.id;
          const studentName = studentMap[studentId] || 'Unknown';
          const courses = enrollmentDoc.data().courses || [];

          for (const course of courses) {
            const courseName = course.selectedCourse?.name || 'Unknown Course';
            const key = `${studentId}-${courseName}`;

            // Initialize enrollment data
            if (!enrollmentMap[key]) {
              enrollmentMap[key] = {
                studentId,
                studentName,
                courseName,
                totalFees: 0,
                transactions: [],
                totalPaid: 0,
                remaining: 0,
                validationError: '',
              };
            }

            // Calculate total fees
            let totalFees = 0;
            if (course.feeTemplate === 'Free') {
              totalFees = 0;
            } else if (course.feeTemplate === 'FullFees') {
              totalFees = toNumber(course.fullFeesDetails?.feeAfterDiscount || course.fullFeesDetails?.totalFees || 0);
            } else if (course.feeTemplate === 'Installments') {
              const regAmount = toNumber(course.registration?.amount || 0);
              const installmentTotal = (course.installmentDetails || []).reduce(
                (sum, inst) => sum + toNumber(inst.dueAmount || 0),
                0
              );
              totalFees = regAmount + installmentTotal;
            } else if (course.feeTemplate === 'Finance') {
              totalFees = toNumber(course.financeDetails?.feeAfterDiscount || 0);

              // Validate sum of Loan Amount registrations matches loanAmount
              const loanRegistrations = (course.financeDetails?.registrations || []).filter(
                (reg) => reg.amountType === 'Loan Amount'
              );
              const totalLoanAmount = loanRegistrations.reduce(
                (sum, reg) => sum + toNumber(reg.amount || 0),
                0
              );
              const expectedLoanAmount = toNumber(course.financeDetails?.loanAmount || 0);
              if (totalLoanAmount !== expectedLoanAmount && expectedLoanAmount !== 0) {
                enrollmentMap[key].validationError = `Formula Error: Sum of Loan Amount registrations (${totalLoanAmount}) does not match Loan Amount (${expectedLoanAmount})`;
              }
            }

            enrollmentMap[key].totalFees = totalFees;

            // Process transactions
            if (course.feeTemplate === 'FullFees') {
              const { fullFeesDetails } = course;

              if (fullFeesDetails?.registration?.amount) {
                const regAmount = toNumber(fullFeesDetails.registration.amount);
                const status = fullFeesDetails.registration.status || 'Pending';
                const dateField = fullFeesDetails.registration.date || null;
                const inRange = dateField ? isDateInRange(dateField, start, end) : false;

                if (inRange || (filter === 'all' && dateField)) {
                  enrollmentMap[key].transactions.push({
                    type: 'FullFees (Registration)',
                    amount: regAmount,
                    status,
                    date: dateField,
                    paymentMethod: fullFeesDetails.registration.paymentMethod || 'N/A',
                    amountType: 'N/A',
                  });
                  if (status === 'Paid') {
                    enrollmentMap[key].totalPaid += regAmount;
                    totalReceivedAcc += regAmount;
                  } else {
                    totalPendingAcc += regAmount;
                  }
                }
              }

              // Final Payment
              if (fullFeesDetails?.finalPayment?.amount) {
                const finalAmount = toNumber(fullFeesDetails.finalPayment.amount);
                const status = fullFeesDetails.finalPayment.status || 'Pending';
                const dateField = fullFeesDetails.finalPayment.date || null;
                const inRange = dateField ? isDateInRange(dateField, start, end) : false;

                if (inRange || (filter === 'all' && dateField)) {
                  enrollmentMap[key].transactions.push({
                    type: 'FullFees (Final Payment)',
                    amount: finalAmount,
                    status,
                    date: dateField,
                    paymentMethod: fullFeesDetails.finalPayment.paymentMethod || 'N/A',
                    amountType: 'N/A',
                  });
                  if (status === 'Paid') {
                    enrollmentMap[key].totalPaid += finalAmount;
                    totalReceivedAcc += finalAmount;
                  } else {
                    totalPendingAcc += finalAmount;
                  }
                }
              }
            } else if (course.feeTemplate === 'Installments') {
              const { installmentDetails, registration } = course;

              // Registration Payment
              if (registration?.amount) {
                const regAmount = toNumber(registration.amount);
                const status = registration.status || 'Pending';
                const dateField = registration.date || null;
                const inRange = dateField ? isDateInRange(dateField, start, end) : false;

                if (inRange || (filter === 'all' && dateField)) {
                  enrollmentMap[key].transactions.push({
                    type: 'Installments (Registration)',
                    amount: regAmount,
                    status,
                    date: dateField,
                    paymentMethod: registration.paymentMethod || 'N/A',
                    amountType: 'N/A',
                  });
                  if (status === 'Paid') {
                    enrollmentMap[key].totalPaid += regAmount;
                    totalReceivedAcc += regAmount;
                  } else {
                    totalPendingAcc += regAmount;
                  }
                }
              }

              // Installments
              (installmentDetails || []).forEach((installment, idx) => {
                const dueAmount = toNumber(installment.dueAmount || 0);
                const paidAmount = toNumber(installment.paidAmount || 0);
                const status = installment.status || 'Pending';
                const dateField = status === 'Paid' ? installment.paidDate : installment.dueDate || null;
                const inRange = dateField ? isDateInRange(dateField, start, end) : false;

                if ((inRange || (filter === 'all' && dateField)) && (dueAmount > 0 || paidAmount > 0)) {
                  enrollmentMap[key].transactions.push({
                    type: `Installments (No. ${installment.number || idx + 1})`,
                    amount: status === 'Paid' ? paidAmount : dueAmount,
                    status,
                    date: dateField,
                    paymentMethod: installment.paymentMethod || 'N/A',
                    amountType: 'N/A',
                  });
                  if (status === 'Paid') {
                    enrollmentMap[key].totalPaid += paidAmount;
                    totalReceivedAcc += paidAmount;
                  } else {
                    totalPendingAcc += dueAmount;
                  }
                }
              });
            } else if (course.feeTemplate === 'Finance') {
              const { financeDetails } = course;

              // Process Registrations
              (financeDetails?.registrations || []).forEach((registration, regIndex) => {
                const regAmount = toNumber(registration.amount || 0);
                const status = registration.status || 'Pending';
                const dateField = registration.date || null;
                const inRange = dateField ? isDateInRange(dateField, start, end) : false;

                if ((inRange || (filter === 'all' && dateField)) && regAmount > 0) {
                  enrollmentMap[key].transactions.push({
                    type: `Finance (Registration ${registration.srNo})`,
                    amount: regAmount,
                    status,
                    date: dateField,
                    paymentMethod: registration.paymentMethod || 'N/A',
                    amountType: registration.amountType || 'Non-Loan Amount',
                  });
                  if (status === 'Paid') {
                    enrollmentMap[key].totalPaid += regAmount;
                    totalReceivedAcc += regAmount;
                  } else {
                    totalPendingAcc += regAmount;
                  }
                }

                // Process Loan Sub-Registrations for Loan Amount registrations
                if (registration.amountType === 'Loan Amount') {
                  (registration.loanSubRegistrations || []).forEach((subReg, subIndex) => {
                    const subRegAmount = toNumber(subReg.amount || 0);
                    const subStatus = subReg.status || 'Pending';
                    const subDateField = subReg.date || null;
                    const subInRange = subDateField ? isDateInRange(subDateField, start, end) : false;

                    if ((subInRange || (filter === 'all' && subDateField)) && subRegAmount > 0) {
                      enrollmentMap[key].transactions.push({
                        type: `Finance (Loan Downpayment ${registration.srNo}.${subReg.srNo})`,
                        amount: subRegAmount,
                        status: subStatus,
                        date: subDateField,
                        paymentMethod: subReg.paymentMethod || 'N/A',
                        amountType: 'Loan Amount',
                      });
                      if (subStatus === 'Paid') {
                        enrollmentMap[key].totalPaid += subRegAmount;
                        totalReceivedAcc += subRegAmount;
                      } else {
                        totalPendingAcc += subRegAmount;
                      }
                    }
                  });
                }
              });
            } else if (course.feeTemplate === 'Free' && filter === 'all') {
              enrollmentMap[key].transactions.push({
                type: 'Free',
                amount: 0,
                status: 'N/A',
                date: null,
                paymentMethod: 'N/A',
                amountType: 'N/A',
              });
            }

            // Calculate remaining balance
            enrollmentMap[key].remaining = totalFees - enrollmentMap[key].totalPaid;
          }
        }

        // Convert enrollmentMap to array
        Object.values(enrollmentMap).forEach((enrollment) => {
          if (enrollment.transactions.length > 0) {
            data.push(enrollment);
          }
        });

        setFeeData(data);
        setTotalReceived(totalReceivedAcc);
        setTotalPending(totalPendingAcc);
      } catch (error) {
        console.error('Error fetching fee data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeeData();
  }, [filter, canDisplayReports]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const toggleRow = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (!canDisplayReports) {
    return (
      <div className="p-6 text-red-600 text-center">
        Access Denied: You do not have permission to view fee reports.
      </div>
    );
  }

  return (
    <div className="p-4 min-h-screen fixed inset-0 left-[300px]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Fee Report</h1>
        <button
          onClick={() => navigate('/reports-dashboard')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Analytics
        </button>
      </div>

      {/* Filter Dropdown */}
      <div className="mb-6">
        <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-2">
          Filter By
        </label>
        <select
          id="filter"
          value={filter}
          onChange={handleFilterChange}
          className="w-full max-w-xs p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="all">All</option>
          <option value="thisMonth">This Month</option>
          <option value="nextMonth">Next Month</option>
          <option value="lastMonth">Last Month</option>
        </select>
      </div>

      {/* Summary */}
      <div className="flex flex-col sm:flex-row sm:space-x-8 mb-6 bg-white p-4 rounded-lg shadow">
        <div className="text-lg font-semibold text-gray-700">
          Total Received: ₹{totalReceived.toFixed(2)}
        </div>
        <div className="text-lg font-semibold text-gray-700">
          Total Pending: ₹{totalPending.toFixed(2)}
        </div>
      </div>

      {/* Fee Data Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto overflow-y-auto max-h-[calc(100vh-350px)]">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Fees
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Paid
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remaining
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Validation
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {feeData.length > 0 ? (
                feeData.map((row, index) => (
                  <React.Fragment key={index}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => toggleRow(index)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {expandedRows[index] ? '▼' : '▶'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {row.studentName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {row.courseName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{toNumber(row.totalFees).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                        ₹{toNumber(row.totalPaid).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                        ₹{toNumber(row.remaining).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                        {row.validationError || 'Valid'}
                      </td>
                    </tr>
                    {expandedRows[index] && (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 bg-gray-50">
                          <div className="overflow-x-auto">
                            <table className="w-full divide-y divide-gray-200">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Transaction Type
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Payment Method
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount Type
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {row.transactions.map((txn, txnIndex) => (
                                  <tr key={txnIndex}>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                      {txn.type}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                      ₹{toNumber(txn.amount).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                      {txn.status}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                      {txn.date ? new Date(txn.date).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                      {txn.paymentMethod}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                      {txn.amountType}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No fee data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InstallmentReport;