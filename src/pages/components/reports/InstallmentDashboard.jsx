import React, { useState, useEffect } from "react";
import { db } from "../../../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

// Utility functions
const getDateRange = (filter) => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  switch (filter) {
    case "thisMonth":
      return { start: startOfMonth, end: endOfMonth };
    case "nextMonth":
      return {
        start: new Date(today.getFullYear(), today.getMonth() + 1, 1),
        end: new Date(today.getFullYear(), today.getMonth() + 2, 0),
      };
    case "lastMonth":
      return {
        start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        end: new Date(today.getFullYear(), today.getMonth(), 0),
      };
    case "thisYear":
      return {
        start: new Date(today.getFullYear(), 0, 1),
        end: new Date(today.getFullYear(), 11, 31),
      };
    case "lastYear":
      return {
        start: new Date(today.getFullYear() - 1, 0, 1),
        end: new Date(today.getFullYear() - 1, 11, 31),
      };
    case "all":
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

export default function InstallmentDashboard() {
  const { rolePermissions } = useAuth();
  const navigate = useNavigate();
  const [feeData, setFeeData] = useState([]);
  const [filter, setFilter] = useState("thisMonth");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [totalReceived, setTotalReceived] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [expandedRows, setExpandedRows] = useState({});

  const canDisplayReports = rolePermissions?.enrollments?.display || false;

  useEffect(() => {
    const fetchFeeData = async () => {
      if (!canDisplayReports) return;
      try {
        setLoading(true);
        setFeeData([]);
        setTotalReceived(0);
        setTotalPending(0);

        const studentSnapshot = await getDocs(collection(db, "student"));
        const studentMap = {};
        studentSnapshot.forEach((doc) => {
          studentMap[doc.id] = doc.data().Name || "Unknown";
        });

        const enrollmentSnapshot = await getDocs(collection(db, "enrollments"));
        const data = [];
        let totalReceivedAcc = 0;
        let totalPendingAcc = 0;

        const { start, end } = startDate || endDate ? { start: startDate ? new Date(startDate) : null, end: endDate ? new Date(endDate) : null } : getDateRange(filter);

        const enrollmentMap = {};

        for (const enrollmentDoc of enrollmentSnapshot.docs) {
          const studentId = enrollmentDoc.id;
          const studentName = studentMap[studentId] || "Unknown";
          const courses = enrollmentDoc.data().courses || [];

          for (const course of courses) {
            const courseName = course.selectedCourse?.name || "Unknown Course";
            const key = `${studentId}-${courseName}`;

            if (!enrollmentMap[key]) {
              enrollmentMap[key] = {
                studentId,
                studentName,
                courseName,
                totalFees: 0,
                transactions: [],
                totalPaid: 0,
                remaining: 0,
                validationError: "",
              };
            }

            let totalFees = 0;
            if (course.feeTemplate === "Free") {
              totalFees = 0;
            } else if (course.feeTemplate === "FullFees") {
              totalFees = toNumber(course.fullFeesDetails?.feeAfterDiscount || course.fullFeesDetails?.totalFees || 0);
            } else if (course.feeTemplate === "Installments") {
              const regAmount = toNumber(course.registration?.amount || 0);
              const installmentTotal = (course.installmentDetails || []).reduce(
                (sum, inst) => sum + toNumber(inst.dueAmount || 0),
                0
              );
              totalFees = regAmount + installmentTotal;
            } else if (course.feeTemplate === "Finance") {
              totalFees = toNumber(course.financeDetails?.feeAfterDiscount || 0);
              const loanRegistrations = (course.financeDetails?.registrations || []).filter(
                (reg) => reg.amountType === "Loan Amount"
              );
              const totalLoanAmount = loanRegistrations.reduce(
                (sum, reg) => sum + toNumber(reg.amount || 0),
                0
              );
              const totalLoanSubAmount = loanRegistrations.reduce(
                (sum, reg) => sum + (reg.loanSubRegistrations || []).reduce(
                  (subSum, subReg) => subSum + toNumber(subReg.amount || 0),
                  0
                ),
                0
              );
              const expectedLoanAmount = toNumber(course.financeDetails?.loanAmount || 0);
              if (totalLoanAmount !== expectedLoanAmount && expectedLoanAmount !== 0) {
                enrollmentMap[key].validationError = `Formula Error: Sum of Loan Amount registrations (${totalLoanAmount}) does not match Loan Amount (${expectedLoanAmount})`;
              }
              if (totalLoanSubAmount !== totalLoanAmount && totalLoanAmount !== 0) {
                enrollmentMap[key].validationError += `; Sub-registration sum (${totalLoanSubAmount}) does not match registration amount (${totalLoanAmount})`;
              }
            }

            enrollmentMap[key].totalFees = totalFees;

            if (course.feeTemplate === "FullFees") {
              const { fullFeesDetails } = course;

              if (fullFeesDetails?.registration?.amount) {
                const regAmount = toNumber(fullFeesDetails.registration.amount);
                const status = fullFeesDetails.registration.status || "Pending";
                const dateField = fullFeesDetails.registration.date || null;
                const inRange = dateField ? isDateInRange(dateField, start, end) : false;

                if (inRange || (filter === "all" && !startDate && !endDate && dateField)) {
                  enrollmentMap[key].transactions.push({
                    type: "FullFees (Registration)",
                    amount: regAmount,
                    status,
                    date: dateField,
                    paymentMethod: fullFeesDetails.registration.paymentMethod || "N/A",
                    amountType: "N/A",
                  });
                  if (status === "Paid") {
                    enrollmentMap[key].totalPaid += regAmount;
                    totalReceivedAcc += regAmount;
                  } else {
                    totalPendingAcc += regAmount;
                  }
                }
              }

              if (fullFeesDetails?.finalPayment?.amount) {
                const finalAmount = toNumber(fullFeesDetails.finalPayment.amount);
                const status = fullFeesDetails.finalPayment.status || "Pending";
                const dateField = fullFeesDetails.finalPayment.date || null;
                const inRange = dateField ? isDateInRange(dateField, start, end) : false;

                if (inRange || (filter === "all" && !startDate && !endDate && dateField)) {
                  enrollmentMap[key].transactions.push({
                    type: "FullFees (Final Payment)",
                    amount: finalAmount,
                    status,
                    date: dateField,
                    paymentMethod: fullFeesDetails.finalPayment.paymentMethod || "N/A",
                    amountType: "N/A",
                  });
                  if (status === "Paid") {
                    enrollmentMap[key].totalPaid += finalAmount;
                    totalReceivedAcc += finalAmount;
                  } else {
                    totalPendingAcc += finalAmount;
                  }
                }
              }
            } else if (course.feeTemplate === "Installments") {
              const { installmentDetails, registration } = course;

              if (registration?.amount) {
                const regAmount = toNumber(registration.amount);
                const status = registration.status || "Pending";
                const dateField = registration.date || null;
                const inRange = dateField ? isDateInRange(dateField, start, end) : false;

                if (inRange || (filter === "all" && !startDate && !endDate && dateField)) {
                  enrollmentMap[key].transactions.push({
                    type: "Installments (Registration)",
                    amount: regAmount,
                    status,
                    date: dateField,
                    paymentMethod: registration.paymentMethod || "N/A",
                    amountType: "N/A",
                  });
                  if (status === "Paid") {
                    enrollmentMap[key].totalPaid += regAmount;
                    totalReceivedAcc += regAmount;
                  } else {
                    totalPendingAcc += regAmount;
                  }
                }
              }

              (installmentDetails || []).forEach((installment, idx) => {
                const dueAmount = toNumber(installment.dueAmount || 0);
                const paidAmount = toNumber(installment.paidAmount || 0);
                const status = installment.status || "Pending";
                const dateField = status === "Paid" ? installment.paidDate : installment.dueDate || null;
                const inRange = dateField ? isDateInRange(dateField, start, end) : false;

                if ((inRange || (filter === "all" && !startDate && !endDate && dateField)) && (dueAmount > 0 || paidAmount > 0)) {
                  enrollmentMap[key].transactions.push({
                    type: `Installments (No. ${installment.number || idx + 1})`,
                    amount: status === "Paid" ? paidAmount : dueAmount,
                    status,
                    date: dateField,
                    paymentMethod: installment.paymentMethod || "N/A",
                    amountType: "N/A",
                  });
                  if (status === "Paid") {
                    enrollmentMap[key].totalPaid += paidAmount;
                    totalReceivedAcc += paidAmount;
                  } else {
                    totalPendingAcc += dueAmount;
                  }
                }
              });
            } else if (course.feeTemplate === "Finance") {
              const { financeDetails } = course;

              if (financeDetails?.registration?.amount) {
                const regAmount = toNumber(financeDetails.registration.amount);
                const status = financeDetails.registration.status || "Pending";
                const dateField = financeDetails.registration.date || null;
                const inRange = dateField ? isDateInRange(dateField, start, end) : false;

                if ((inRange || (filter === "all" && !startDate && !endDate && dateField)) && regAmount > 0) {
                  enrollmentMap[key].transactions.push({
                    type: "Finance (Registration)",
                    amount: regAmount,
                    status,
                    date: dateField,
                    paymentMethod: financeDetails.registration.paymentMethod || "N/A",
                    amountType: "Non-Loan Amount",
                  });
                  if (status === "Paid") {
                    enrollmentMap[key].totalPaid += regAmount;
                    totalReceivedAcc += regAmount;
                  } else {
                    totalPendingAcc += regAmount;
                  }
                }
              }

              if (financeDetails?.downPayment) {
                const downPayment = toNumber(financeDetails.downPayment);
                const status = financeDetails.downPaymentDate ? "Paid" : "Pending";
                const dateField = financeDetails.downPaymentDate || null;
                const inRange = dateField ? isDateInRange(dateField, start, end) : false;

                if ((inRange || (filter === "all" && !startDate && !endDate && dateField)) && downPayment > 0) {
                  enrollmentMap[key].transactions.push({
                    type: "Finance (Down Payment)",
                    amount: downPayment,
                    status,
                    date: dateField,
                    paymentMethod: "N/A",
                    amountType: "Non-Loan Amount",
                  });
                  if (status === "Paid") {
                    enrollmentMap[key].totalPaid += downPayment;
                    totalReceivedAcc += downPayment;
                  } else {
                    totalPendingAcc += downPayment;
                  }
                }
              }

              (financeDetails?.registrations || []).forEach((registration, regIndex) => {
                const regAmount = toNumber(registration.amount || 0);
                const status = registration.status || "Pending";
                const dateField = registration.date || null;
                const inRange = dateField ? isDateInRange(dateField, start, end) : false;

                if ((inRange || (filter === "all" && !startDate && !endDate && dateField)) && regAmount > 0) {
                  enrollmentMap[key].transactions.push({
                    type: `Finance (Registration ${registration.srNo})`,
                    amount: regAmount,
                    status,
                    date: dateField,
                    paymentMethod: registration.paymentMethod || "N/A",
                    amountType: registration.amountType || "Non-Loan Amount",
                  });
                  if (status === "Paid") {
                    enrollmentMap[key].totalPaid += regAmount;
                    totalReceivedAcc += regAmount;
                  } else {
                    totalPendingAcc += regAmount;
                  }
                }

                if (registration.amountType === "Loan Amount") {
                  (registration.loanSubRegistrations || []).forEach((subReg, subIndex) => {
                    const subRegAmount = toNumber(subReg.amount || 0);
                    const subStatus = subReg.status || "Pending";
                    const subDateField = subReg.date || null;
                    const subInRange = subDateField ? isDateInRange(subDateField, start, end) : false;

                    if ((subInRange || (filter === "all" && !startDate && !endDate && subDateField)) && subRegAmount > 0) {
                      enrollmentMap[key].transactions.push({
                        type: `Finance (Loan Sub-Registration ${registration.srNo}.${subReg.srNo})`,
                        amount: subRegAmount,
                        status: subStatus,
                        date: subDateField,
                        paymentMethod: subReg.paymentMethod || "N/A",
                        amountType: "Loan Amount",
                      });
                      if (subStatus === "Paid") {
                        enrollmentMap[key].totalPaid += subRegAmount;
                        totalReceivedAcc += subRegAmount;
                      } else {
                        totalPendingAcc += subRegAmount;
                      }
                    }
                  });
                }
              });
            } else if (course.feeTemplate === "Free" && (filter === "all" || (startDate && endDate))) {
              enrollmentMap[key].transactions.push({
                type: "Free",
                amount: 0,
                status: "N/A",
                date: null,
                paymentMethod: "N/A",
                amountType: "N/A",
              });
            }

            enrollmentMap[key].remaining = totalFees - enrollmentMap[key].totalPaid;
          }
        }

        Object.values(enrollmentMap).forEach((enrollment) => {
          if (enrollment.transactions.length > 0) {
            data.push(enrollment);
          }
        });

        setFeeData(data);
        setTotalReceived(totalReceivedAcc);
        setTotalPending(totalPendingAcc);
      } catch (error) {
        console.error("Error fetching fee data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeeData();
  }, [filter, startDate, endDate, canDisplayReports]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    if (e.target.value !== "all") {
      setStartDate("");
      setEndDate("");
    }
  };

  const resetFilters = () => {
    setFilter("thisMonth");
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
  };

  const toggleRow = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const filterFeeData = () => {
    let filtered = feeData;

    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.studentName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const calculateAnalytics = (data) => {
    const totalDue = data.reduce(
      (acc, item) => acc + toNumber(item.remaining),
      0
    );
    const totalPaid = data.reduce(
      (acc, item) => acc + toNumber(item.totalPaid),
      0
    );
    const pendingCount = data.reduce(
      (acc, item) => acc + item.transactions.filter((txn) => txn.status === "Pending").length,
      0
    );
    const paidCount = data.reduce(
      (acc, item) => acc + item.transactions.filter((txn) => txn.status === "Paid").length,
      0
    );

    const studentPending = data.reduce((acc, item) => {
      acc[item.studentName] = (acc[item.studentName] || 0) + toNumber(item.remaining);
      return acc;
    }, {});
    const topPendingStudents = Object.entries(studentPending)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const paymentMethods = data.reduce((acc, item) => {
      item.transactions.forEach((txn) => {
        if (txn.status === "Paid" && txn.paymentMethod && txn.paymentMethod !== "N/A") {
          acc[txn.paymentMethod] = (acc[txn.paymentMethod] || 0) + toNumber(txn.amount);
        }
      });
      return acc;
    }, {});

    return {
      totalDue,
      totalPaid,
      pendingCount,
      paidCount,
      topPendingStudents,
      paymentMethods,
    };
  };

  const prepareChartData = (data) => {
    const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"];
    const hoverColors = ["#FF4D70", "#2A8BCF", "#FFBB33", "#3AA8A8"];

    const statusData = {
      labels: ["Paid", "Pending"],
      datasets: [
        {
          data: [
            data.reduce((acc, item) => acc + item.transactions.filter((txn) => txn.status === "Paid").length, 0),
            data.reduce((acc, item) => acc + item.transactions.filter((txn) => txn.status === "Pending").length, 0),
          ],
          backgroundColor: [colors[0], colors[1]],
          hoverBackgroundColor: [hoverColors[0], hoverColors[1]],
        },
      ],
    };

    const feeTypeData = {
      labels: ["FullFees", "Installments", "Finance", "Free"],
      datasets: [
        {
          data: [
            data.reduce((acc, item) => acc + item.transactions.filter((txn) => txn.type.includes("FullFees")).length, 0),
            data.reduce((acc, item) => acc + item.transactions.filter((txn) => txn.type.includes("Installments")).length, 0),
            data.reduce((acc, item) => acc + item.transactions.filter((txn) => txn.type.includes("Finance")).length, 0),
            data.reduce((acc, item) => acc + item.transactions.filter((txn) => txn.type === "Free").length, 0),
          ],
          backgroundColor: colors,
          hoverBackgroundColor: hoverColors,
        },
      ],
    };

    const monthlyData = {};
    data.forEach((item) => {
      item.transactions.forEach((txn) => {
        const date = txn.date;
        if (!date) return;
        const dueDate = new Date(date);
        const monthYear = `${dueDate.getFullYear()}-${String(dueDate.getMonth() + 1).padStart(2, "0")}`;
        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = { due: 0, paid: 0 };
        }
        if (txn.status === "Pending") {
          monthlyData[monthYear].due += toNumber(txn.amount);
        } else if (txn.status === "Paid") {
          monthlyData[monthYear].paid += toNumber(txn.amount);
        }
      });
    });

    const barData = {
      labels: Object.keys(monthlyData).sort(),
      datasets: [
        {
          label: "Total Due",
          data: Object.values(monthlyData).map((item) => item.due),
          backgroundColor: colors[1],
          hoverBackgroundColor: hoverColors[1],
        },
        {
          label: "Total Paid",
          data: Object.values(monthlyData).map((item) => item.paid),
          backgroundColor: colors[0],
          hoverBackgroundColor: hoverColors[0],
        },
      ],
    };

    const stackedBarData = {
      labels: ["FullFees", "Installments", "Finance", "Free"],
      datasets: [
        {
          label: "Paid",
          data: [
            data.reduce((acc, item) => acc + item.transactions
              .filter((txn) => txn.type.includes("FullFees") && txn.status === "Paid")
              .reduce((sum, txn) => sum + toNumber(txn.amount), 0), 0),
            data.reduce((acc, item) => acc + item.transactions
              .filter((txn) => txn.type.includes("Installments") && txn.status === "Paid")
              .reduce((sum, txn) => sum + toNumber(txn.amount), 0), 0),
            data.reduce((acc, item) => acc + item.transactions
              .filter((txn) => txn.type.includes("Finance") && txn.status === "Paid")
              .reduce((sum, txn) => sum + toNumber(txn.amount), 0), 0),
            data.reduce((acc, item) => acc + item.transactions
              .filter((txn) => txn.type === "Free" && txn.status === "Paid")
              .reduce((sum, txn) => sum + toNumber(txn.amount), 0), 0),
          ],
          backgroundColor: colors[0],
          hoverBackgroundColor: hoverColors[0],
        },
        {
          label: "Pending",
          data: [
            data.reduce((acc, item) => acc + item.transactions
              .filter((txn) => txn.type.includes("FullFees") && txn.status === "Pending")
              .reduce((sum, txn) => sum + toNumber(txn.amount), 0), 0),
            data.reduce((acc, item) => acc + item.transactions
              .filter((txn) => txn.type.includes("Installments") && txn.status === "Pending")
              .reduce((sum, txn) => sum + toNumber(txn.amount), 0), 0),
            data.reduce((acc, item) => acc + item.transactions
              .filter((txn) => txn.type.includes("Finance") && txn.status === "Pending")
              .reduce((sum, txn) => sum + toNumber(txn.amount), 0), 0),
            data.reduce((acc, item) => acc + item.transactions
              .filter((txn) => txn.type === "Free" && txn.status === "Pending")
              .reduce((sum, txn) => sum + toNumber(txn.amount), 0), 0),
          ],
          backgroundColor: colors[1],
          hoverBackgroundColor: hoverColors[1],
        },
      ],
    };

    const lineData = {
      labels: Object.keys(monthlyData).sort(),
      datasets: [
        {
          label: "Paid Amount Over Time",
          data: Object.values(monthlyData).map((item) => item.paid),
          borderColor: colors[0],
          backgroundColor: colors[0],
          fill: false,
          tension: 0.1,
          pointHoverBackgroundColor: hoverColors[0],
        },
      ],
    };

    return { statusData, feeTypeData, barData, stackedBarData, lineData };
  };

  if (!canDisplayReports) {
    return (
      <div className="p-6 text-red-600 text-center">
        Access Denied: You do not have permission to view fee reports.
      </div>
    );
  }

  const filteredFeeData = filterFeeData();
  const { totalDue, totalPaid, pendingCount, paidCount, topPendingStudents, paymentMethods } =
    calculateAnalytics(filteredFeeData);
  const { statusData, feeTypeData, barData, stackedBarData, lineData } = prepareChartData(filteredFeeData);

  return (
    <div className="min-h-screen bg-gray-100 p-4 fixed inset-0 left-[300px] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Fee Analytics Dashboard</h1>
        <button
          onClick={() => navigate("/reports")}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Back to Reports
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
        <select
          value={filter}
          onChange={handleFilterChange}
          className="w-full sm:w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All</option>
          <option value="thisMonth">This Month</option>
          <option value="nextMonth">Next Month</option>
          <option value="lastMonth">Last Month</option>
          <option value="thisYear">This Year</option>
          <option value="lastYear">Last Year</option>
        </select>
        <input
          type="text"
          placeholder="Search by student name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-64 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="flex gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full sm:w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full sm:w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={resetFilters}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Reset Filters
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Total Due</h2>
          <p className="text-2xl font-bold text-blue-600">₹{totalDue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Total Paid</h2>
          <p className="text-2xl font-bold text-green-600">₹{totalPaid.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Pending Transactions</h2>
          <p className="text-2xl font-bold text-red-600">{pendingCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Paid Transactions</h2>
          <p className="text-2xl font-bold text-green-600">{paidCount}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Payment Status Breakdown</h2>
          <div className="h-64">
            <Pie
              data={statusData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "top" } },
              }}
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Fee Type Distribution</h2>
          <div className="h-64">
            <Pie
              data={feeTypeData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "top" } },
              }}
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Monthly Due vs Paid</h2>
          <div className="h-64">
            <Bar
              data={barData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "top" } },
                scales: {
                  y: { beginAtZero: true, title: { display: true, text: "Amount (₹)" } },
                  x: { title: { display: true, text: "Month" } },
                },
              }}
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Status by Fee Type</h2>
          <div className="h-64">
            <Bar
              data={stackedBarData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "top" } },
                scales: {
                  x: { stacked: true, title: { display: true, text: "Fee Type" } },
                  y: { stacked: true, beginAtZero: true, title: { display: true, text: "Amount (₹)" } },
                },
              }}
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Payment Trend Over Time</h2>
          <div className="h-64">
            <Line
              data={lineData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "top" } },
                scales: {
                  y: { beginAtZero: true, title: { display: true, text: "Amount (₹)" } },
                  x: { title: { display: true, text: "Month" } },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Top 5 Students by Pending Amount</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topPendingStudents.map(([name, amount], index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">₹{amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Payment Method Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(paymentMethods).map(([method, amount], index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{method}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">₹{amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Fee Data Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Fees</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Paid</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validation</th> */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFeeData.length > 0 ? (
                filteredFeeData.map((row, index) => (
                  <React.Fragment key={index}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => toggleRow(index)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {expandedRows[index] ? "▼" : "▶"}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.studentName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.courseName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{toNumber(row.totalFees).toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">₹{toNumber(row.totalPaid).toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">₹{toNumber(row.remaining).toFixed(2)}</td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{row.validationError || "Valid"}</td> */}
                    </tr>
                    {expandedRows[index] && (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 bg-gray-50">
                          <div className="overflow-x-auto">
                            <table className="w-full divide-y divide-gray-200">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Type</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Type</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {row.transactions.map((txn, txnIndex) => (
                                  <tr key={txnIndex}>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{txn.type}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">₹{toNumber(txn.amount).toFixed(2)}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{txn.status}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                      {txn.date ? new Date(txn.date).toLocaleDateString() : "N/A"}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{txn.paymentMethod}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{txn.amountType}</td>
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
}