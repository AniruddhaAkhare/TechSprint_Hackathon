import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Utility function to get date ranges for filtering
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

// Utility function to check if a date is within a range
const isDateInRange = (dateStr, start, end) => {
  if (!dateStr || (!start && !end)) return true; // For 'all', include all dates
  const date = new Date(dateStr);
  return date >= start && date <= end;
};

// Utility function to ensure a value is a number
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
  const navigate = useNavigate();

  // Permission check
  const canDisplayReports = rolePermissions?.enrollments?.display || false;

  useEffect(() => {
    const fetchFeeData = async () => {
      if (!canDisplayReports) return;
      try {
        setLoading(true);

        // Fetch students
        const studentSnapshot = await getDocs(collection(db, 'student'));
        const studentMap = {};
        studentSnapshot.forEach((doc) => {
          studentMap[doc.id] = (doc.data().first_name) + " " + (doc.data().last_name) || 'Unknown';
        });

        // Fetch enrollments
        const enrollmentSnapshot = await getDocs(collection(db, 'enrollments'));
        const data = [];
        let received = 0;
        let pending = 0;

        const { start, end } = getDateRange(filter);

        for (const enrollmentDoc of enrollmentSnapshot.docs) {
          const studentId = enrollmentDoc.id;
          const studentName = studentMap[studentId] || 'Unknown';
          const courses = enrollmentDoc.data().courses || [];

          courses.forEach((course) => {
            const courseName = course.selectedCourse?.name || 'Unknown';
            const totalFees =
              course.feeTemplate === 'Free'
                ? 0
                : toNumber(
                  course.fullFeesDetails?.feeAfterDiscount ||
                  course.fullFeesDetails?.totalFees ||
                  course.financeDetails?.feeAfterDiscount ||
                  0
                );

            if (course.feeTemplate === 'FullFees') {
              const { fullFeesDetails } = course;

              // Registration
              if (fullFeesDetails?.registration?.amount) {
                const regAmount = toNumber(fullFeesDetails.registration.amount);
                const status = fullFeesDetails.registration.status || 'Pending';
                const dateField = status === 'Paid' ? fullFeesDetails.registration.date : fullFeesDetails.registration.date || new Date().toISOString().split('T')[0];
                const inRange = isDateInRange(dateField, start, end);

                if (inRange) {
                  data.push({
                    studentId,
                    studentName,
                    courseName,
                    feeTemplate: 'FullFees (Registration)',
                    totalFees,
                    received: status === 'Paid' ? regAmount : 0,
                    pending: status === 'Pending' ? regAmount : 0,
                  });
                  if (status === 'Paid') received += regAmount;
                  else pending += regAmount;
                }
              }

              // Final Payment
              if (fullFeesDetails?.finalPayment?.amount) {
                const finalAmount = toNumber(fullFeesDetails.finalPayment.amount);
                const status = fullFeesDetails.finalPayment.status || 'Pending';
                const dateField = status === 'Paid' ? fullFeesDetails.finalPayment.date : fullFeesDetails.finalPayment.date || new Date().toISOString().split('T')[0];
                const inRange = isDateInRange(dateField, start, end);

                if (inRange) {
                  data.push({
                    studentId,
                    studentName,
                    courseName,
                    feeTemplate: 'FullFees (Final Payment)',
                    totalFees,
                    received: status === 'Paid' ? finalAmount : 0,
                    pending: status === 'Pending' ? finalAmount : 0,
                  });
                  if (status === 'Paid') received += finalAmount;
                  else pending += finalAmount;
                }
              }
            } else if (course.feeTemplate === 'Installments') {
              const { installmentDetails, registration } = course;

              // Registration
              if (registration?.amount) {
                const regAmount = toNumber(registration.amount);
                const status = registration.status || 'Pending';
                const dateField = status === 'Paid' ? registration.date : registration.date || new Date().toISOString().split('T')[0];
                const inRange = isDateInRange(dateField, start, end);

                if (inRange) {
                  data.push({
                    studentId,
                    studentName,
                    courseName,
                    feeTemplate: 'Installments (Registration)',
                    totalFees,
                    received: status === 'Paid' ? regAmount : 0,
                    pending: status === 'Pending' ? regAmount : 0,
                  });
                  if (status === 'Paid') received += regAmount;
                  else pending += regAmount;
                }
              }

              // Installments
              (installmentDetails || []).forEach((installment, idx) => {
                const dueAmount = toNumber(installment.dueAmount);
                const paidAmount = toNumber(installment.paidAmount);
                const status = installment.status || 'Pending';
                const dateField = status === 'Paid' ? installment.paidDate : installment.dueDate || new Date().toISOString().split('T')[0];
                const inRange = isDateInRange(dateField, start, end);

                if (inRange && (dueAmount > 0 || paidAmount > 0)) {
                  data.push({
                    studentId,
                    studentName,
                    courseName,
                    feeTemplate: `Installments (No. ${installment.number || idx + 1})`,
                    totalFees,
                    received: status === 'Paid' ? (paidAmount || dueAmount) : 0,
                    pending: status === 'Pending' ? dueAmount : 0,
                  });
                  if (status === 'Paid') received += paidAmount || dueAmount;
                  else pending += dueAmount;
                }
              });
            } else if (course.feeTemplate === 'Finance') {
              const { financeDetails } = course;

              // Registration
              if (financeDetails?.registration?.amount) {
                const regAmount = toNumber(financeDetails.registration.amount);
                const status = financeDetails.registration.status || 'Pending';
                const dateField = status === 'Paid' ? financeDetails.registration.date : financeDetails.registration.date || new Date().toISOString().split('T')[0];
                const inRange = isDateInRange(dateField, start, end);

                if (inRange) {
                  data.push({
                    studentId,
                    studentName,
                    courseName,
                    feeTemplate: 'Finance (Registration)',
                    totalFees,
                    received: status === 'Paid' ? regAmount : 0,
                    pending: status === 'Pending' ? regAmount : 0,
                  });
                  if (status === 'Paid') received += regAmount;
                  else pending += regAmount;
                }
              }

              // Down Payment
              if (financeDetails?.downPayment) {
                const downPayment = toNumber(financeDetails.downPayment);
                // Assume downPayment is "Paid" if downPaymentDate exists, otherwise "Pending"
                const status = financeDetails.downPaymentDate ? 'Paid' : 'Pending';
                const dateField = financeDetails.downPaymentDate || new Date().toISOString().split('T')[0];
                const inRange = isDateInRange(dateField, start, end);

                if (inRange) {
                  data.push({
                    studentId,
                    studentName,
                    courseName,
                    feeTemplate: 'Finance (Down Payment)',
                    totalFees,
                    received: status === 'Paid' ? downPayment : 0,
                    pending: status === 'Pending' ? downPayment : 0,
                  });
                  if (status === 'Paid') received += downPayment;
                  else pending += downPayment;
                }
              }

              // Loan Amount (only if Disbursed)
              if (financeDetails?.loanAmount && financeDetails.loanStatus === 'Disbursed') {
                const loanAmount = toNumber(financeDetails.loanAmount);
                const status = 'Paid'; // Disbursed means received
                const dateField = financeDetails.downPaymentDate || new Date().toISOString().split('T')[0];
                const inRange = isDateInRange(dateField, start, end);

                if (inRange) {
                  data.push({
                    studentId,
                    studentName,
                    courseName,
                    feeTemplate: 'Finance (Loan)',
                    totalFees,
                    received: loanAmount,
                    pending: 0,
                  });
                  received += loanAmount;
                }
              } else if (financeDetails?.loanAmount && financeDetails.loanStatus !== 'Disbursed') {
                const loanAmount = toNumber(financeDetails.loanAmount);
                const status = 'Pending';
                const dateField = financeDetails.downPaymentDate || new Date().toISOString().split('T')[0];
                const inRange = isDateInRange(dateField, start, end);

                if (inRange) {
                  data.push({
                    studentId,
                    studentName,
                    courseName,
                    feeTemplate: 'Finance (Loan)',
                    totalFees,
                    received: 0,
                    pending: loanAmount,
                  });
                  pending += loanAmount;
                }
              }
            } else if (course.feeTemplate === 'Free') {
              data.push({
                studentId,
                studentName,
                courseName,
                feeTemplate: 'Free',
                totalFees: 0,
                received: 0,
                pending: 0,
              });
            }
          });
        }

        setFeeData(data);
        setTotalReceived(received);
        setTotalPending(pending);
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
        <div className=" bg-white rounded-lg shadow overflow-x-auto overflow-y-auto max-h-[calc(100vh-350px)]">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fee Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Fees
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Received
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pending
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {feeData.length > 0 ? (
                feeData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.studentName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.courseName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.feeTemplate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{toNumber(row.totalFees).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.discountType}+{row.discount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">₹{toNumber(row.received).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">₹{toNumber(row.pending).toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
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