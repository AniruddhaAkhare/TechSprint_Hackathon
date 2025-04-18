import React, { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
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

// Utility function to ensure a value is a number
const toNumber = (value) => {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

// Utility function to get date ranges for filtering
const getDateRange = (filter) => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  switch (filter) {
    case "thisMonth":
      return { start: startOfMonth, end: endOfMonth };
    case "lastMonth":
      return {
        start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        end: new Date(today.getFullYear(), today.getMonth(), 0),
      };
    case "nextMonth":
      return {
        start: new Date(today.getFullYear(), today.getMonth() + 1, 1),
        end: new Date(today.getFullYear(), today.getMonth() + 2, 0),
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

// Utility function to check if a date is within a range
const isDateInRange = (dateStr, start, end) => {
  if (!dateStr || (!start && !end)) return true;
  const date = new Date(dateStr);
  return (!start || date >= start) && (!end || date <= end);
};

// Utility function to calculate days difference
const getDaysDifference = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.round((end - start) / (1000 * 60 * 60 * 24));
};

export default function InstallmentDashboard() {
  const [feeData, setFeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("thisMonth");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchFeeData = async () => {
      try {
        setLoading(true);

        const studentSnapshot = await getDocs(collection(db, "student"));
        const studentMap = {};
        studentSnapshot.forEach((doc) => {
          studentMap[doc.id] = `${doc.data().first_name} ${doc.data().last_name}` || "Unknown";
        });

        const enrollmentSnapshot = await getDocs(collection(db, "enrollments"));
        const data = [];
        const seenIds = new Set();

        for (const enrollmentDoc of enrollmentSnapshot.docs) {
          const studentId = enrollmentDoc.id;
          const studentName = studentMap[studentId] || "Unknown";
          const courses = enrollmentDoc.data().courses || [];

          courses.forEach((course, courseIndex) => {
            const courseName = course.selectedCourse?.name || "Unknown";
            const totalFees =
              course.feeTemplate === "Free"
                ? 0
                : toNumber(
                    course.fullFeesDetails?.feeAfterDiscount ||
                      course.fullFeesDetails?.totalFees ||
                      course.financeDetails?.feeAfterDiscount ||
                      0
                  );

            if (course.feeTemplate === "FullFees") {
              const { fullFeesDetails } = course;
              if (fullFeesDetails?.registration?.amount) {
                const regId = `${studentId}-${courseIndex}-reg`;
                if (!seenIds.has(regId)) {
                  seenIds.add(regId);
                  const regAmount = toNumber(fullFeesDetails.registration.amount);
                  const status = fullFeesDetails.registration.status || "Pending";
                  data.push({
                    id: regId,
                    studentId,
                    studentName,
                    courseName,
                    feeTemplate: "FullFees (Registration)",
                    totalFees,
                    amount: regAmount,
                    dueDate: fullFeesDetails.registration.date || "",
                    paidDate: status === "Paid" ? fullFeesDetails.registration.date : "",
                    status,
                    receivedBy: fullFeesDetails.registration.receivedBy || "",
                    remark: fullFeesDetails.registration.remark || "",
                    paymentMethod: fullFeesDetails.registration.paymentMethod || "",
                  });
                }
              }
              if (fullFeesDetails?.finalPayment?.amount) {
                const finalId = `${studentId}-${courseIndex}-final`;
                if (!seenIds.has(finalId)) {
                  seenIds.add(finalId);
                  const finalAmount = toNumber(fullFeesDetails.finalPayment.amount);
                  const status = fullFeesDetails.finalPayment.status || "Pending";
                  data.push({
                    id: finalId,
                    studentId,
                    studentName,
                    courseName,
                    feeTemplate: "FullFees (Final Payment)",
                    totalFees,
                    amount: finalAmount,
                    dueDate: fullFeesDetails.finalPayment.date || "",
                    paidDate: status === "Paid" ? fullFeesDetails.finalPayment.date : "",
                    status,
                    receivedBy: fullFeesDetails.finalPayment.receivedBy || "",
                    remark: fullFeesDetails.finalPayment.remark || "",
                    paymentMethod: fullFeesDetails.finalPayment.paymentMethod || "",
                  });
                }
              }
            } else if (course.feeTemplate === "Installments") {
              const { installmentDetails, registration } = course;
              if (registration?.amount) {
                const regId = `${studentId}-${courseIndex}-reg`;
                if (!seenIds.has(regId)) {
                  seenIds.add(regId);
                  const regAmount = toNumber(registration.amount);
                  const status = registration.status || "Pending";
                  data.push({
                    id: regId,
                    studentId,
                    studentName,
                    courseName,
                    feeTemplate: "Installments (Registration)",
                    totalFees,
                    amount: regAmount,
                    dueDate: registration.date || "",
                    paidDate: status === "Paid" ? registration.date : "",
                    status,
                    receivedBy: registration.receivedBy || "",
                    remark: registration.remark || "",
                    paymentMethod: registration.paymentMethod || "",
                  });
                }
              }
              (installmentDetails || []).forEach((installment, idx) => {
                const instId = `${studentId}-${courseIndex}-inst-${idx}`;
                if (!seenIds.has(instId)) {
                  seenIds.add(instId);
                  const dueAmount = toNumber(installment.dueAmount);
                  const paidAmount = toNumber(installment.paidAmount);
                  const status = installment.status || "Pending";
                  data.push({
                    id: instId,
                    studentId,
                    studentName,
                    courseName,
                    feeTemplate: `Installments (No. ${installment.number || idx + 1})`,
                    totalFees,
                    amount: status === "Paid" ? (paidAmount || dueAmount) : dueAmount,
                    dueDate: installment.dueDate || "",
                    paidDate: status === "Paid" ? installment.paidDate : "",
                    status,
                    receivedBy: installment.receivedBy || "",
                    remark: installment.remark || "",
                    paymentMethod: installment.paymentMode || "",
                  });
                }
              });
            } else if (course.feeTemplate === "Finance") {
              const { financeDetails } = course;
              if (financeDetails?.registration?.amount) {
                const regId = `${studentId}-${courseIndex}-reg`;
                if (!seenIds.has(regId)) {
                  seenIds.add(regId);
                  const regAmount = toNumber(financeDetails.registration.amount);
                  const status = financeDetails.registration.status || "Pending";
                  data.push({
                    id: regId,
                    studentId,
                    studentName,
                    courseName,
                    feeTemplate: "Finance (Registration)",
                    totalFees,
                    amount: regAmount,
                    dueDate: financeDetails.registration.date || "",
                    paidDate: status === "Paid" ? financeDetails.registration.date : "",
                    status,
                    receivedBy: financeDetails.registration.receivedBy || "",
                    remark: financeDetails.registration.remark || "",
                    paymentMethod: financeDetails.registration.paymentMethod || "",
                  });
                }
              }
              if (financeDetails?.downPayment) {
                const dpId = `${studentId}-${courseIndex}-dp`;
                if (!seenIds.has(dpId)) {
                  seenIds.add(dpId);
                  const downPayment = toNumber(financeDetails.downPayment);
                  const status = financeDetails.downPaymentDate ? "Paid" : "Pending";
                  data.push({
                    id: dpId,
                    studentId,
                    studentName,
                    courseName,
                    feeTemplate: "Finance (Down Payment)",
                    totalFees,
                    amount: downPayment,
                    dueDate: financeDetails.downPaymentDate || "",
                    paidDate: status === "Paid" ? financeDetails.downPaymentDate : "",
                    status,
                    receivedBy: "",
                    remark: "",
                    paymentMethod: "",
                  });
                }
              }
              if (financeDetails?.loanAmount) {
                const loanId = `${studentId}-${courseIndex}-loan`;
                if (!seenIds.has(loanId)) {
                  seenIds.add(loanId);
                  const loanAmount = toNumber(financeDetails.loanAmount);
                  const status = financeDetails.loanStatus === "Disbursed" ? "Paid" : "Pending";
                  data.push({
                    id: loanId,
                    studentId,
                    studentName,
                    courseName,
                    feeTemplate: "Finance (Loan)",
                    totalFees,
                    amount: loanAmount,
                    dueDate: financeDetails.downPaymentDate || "",
                    paidDate: status === "Paid" ? financeDetails.downPaymentDate : "",
                    status,
                    receivedBy: "",
                    remark: "",
                    paymentMethod: "",
                  });
                }
              }
            } else if (course.feeTemplate === "Free") {
              const freeId = `${studentId}-${courseIndex}-free`;
              if (!seenIds.has(freeId)) {
                seenIds.add(freeId);
                data.push({
                  id: freeId,
                  studentId,
                  studentName,
                  courseName,
                  feeTemplate: "Free",
                  totalFees: 0,
                  amount: 0,
                  dueDate: "",
                  paidDate: "",
                  status: "Paid",
                  receivedBy: "",
                  remark: course.freeReason || "",
                  paymentMethod: "",
                });
              }
            }
          });
        }

        setFeeData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching fee data:", error);
        setLoading(false);
      }
    };

    fetchFeeData();
  }, []);

  const handleUpdate = async (item, field, value) => {
    try {
      const [studentId, courseIndex, type, idx] = item.id.split("-");
      const enrollmentRef = doc(db, "enrollments", studentId);
      let updatePath = "";
      let updateValue = value;

      if (type === "reg") {
        if (item.feeTemplate.includes("FullFees")) {
          updatePath = `courses.${courseIndex}.fullFeesDetails.registration.${field}`;
        } else if (item.feeTemplate.includes("Installments")) {
          updatePath = `courses.${courseIndex}.registration.${field}`;
        } else if (item.feeTemplate.includes("Finance")) {
          updatePath = `courses.${courseIndex}.financeDetails.registration.${field}`;
        }
      } else if (type === "final") {
        updatePath = `courses.${courseIndex}.fullFeesDetails.finalPayment.${field}`;
      } else if (type === "inst") {
        updatePath = `courses.${courseIndex}.installmentDetails.${idx}.${field}`;
      } else if (type === "dp") {
        updatePath = `courses.${courseIndex}.financeDetails.downPayment${field === "paidDate" ? "Date" : ""}`;
        updateValue = field === "status" ? (value === "Paid" ? new Date().toISOString().split("T")[0] : "") : value;
      } else if (type === "loan") {
        updatePath = `courses.${courseIndex}.financeDetails.loanStatus`;
        updateValue = value === "Paid" ? "Disbursed" : "Pending";
      }

      if (field === "status" && type !== "loan" && type !== "dp") {
        updatePath = updatePath.replace("status", "status");
        updateValue = value;
        if (value === "Paid" && !item.paidDate) {
          await updateDoc(enrollmentRef, {
            [updatePath]: value,
            [`${updatePath.replace("status", "date")}`]: new Date().toISOString().split("T")[0],
          });
        } else {
          await updateDoc(enrollmentRef, { [updatePath]: updateValue });
        }
      } else {
        await updateDoc(enrollmentRef, { [updatePath]: updateValue });
      }

      setFeeData((prev) =>
        prev.map((dataItem) =>
          dataItem.id === item.id
            ? {
                ...dataItem,
                [field]: value,
                ...(field === "status" && value === "Paid" && !dataItem.paidDate
                  ? { paidDate: new Date().toISOString().split("T")[0] }
                  : {}),
                ...(field === "status" && type === "dp"
                  ? { paidDate: value === "Paid" ? new Date().toISOString().split("T")[0] : "" }
                  : {}),
              }
            : dataItem
        )
      );
    } catch (error) {
      console.error("Error updating fee data:", error);
    }
  };

  const resetFilters = () => {
    setFilter("thisMonth");
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
  };

  const filterFeeData = () => {
    let filtered = feeData;

    // Apply custom date range if startDate or endDate is set
    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      filtered = filtered.filter((item) => {
        const date = item.status === "Paid" ? item.paidDate : item.dueDate;
        return isDateInRange(date, start, end);
      });
    } else {
      // Apply predefined date range if no custom date range is set
      const { start, end } = getDateRange(filter);
      if (start && end) {
        filtered = filtered.filter((item) => {
          const date = item.status === "Paid" ? item.paidDate : item.dueDate;
          return isDateInRange(date, start, end);
        });
      }
    }

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.studentName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const calculateAnalytics = (data) => {
    const totalDue = data.reduce(
      (acc, item) => acc + (item.status === "Pending" ? toNumber(item.amount) : 0),
      0
    );
    const totalPaid = data.reduce(
      (acc, item) => acc + (item.status === "Paid" ? toNumber(item.amount) : 0),
      0
    );
    const pendingCount = data.filter((item) => item.status === "Pending").length;
    const paidCount = data.filter((item) => item.status === "Paid").length;

    const paidItemsWithDates = data.filter(
      (item) => item.status === "Paid" && item.dueDate && item.paidDate
    );
    const avgDelay =
      paidItemsWithDates.length > 0
        ? paidItemsWithDates.reduce(
            (acc, item) => acc + getDaysDifference(item.dueDate, item.paidDate),
            0
          ) / paidItemsWithDates.length
        : 0;

    const studentPending = data.reduce((acc, item) => {
      if (item.status === "Pending") {
        acc[item.studentName] = (acc[item.studentName] || 0) + toNumber(item.amount);
      }
      return acc;
    }, {});
    const topPendingStudents = Object.entries(studentPending)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const paymentMethods = data.reduce((acc, item) => {
      if (item.status === "Paid" && item.paymentMethod) {
        acc[item.paymentMethod] = (acc[item.paymentMethod] || 0) + toNumber(item.amount);
      }
      return acc;
    }, {});

    return {
      totalDue,
      totalPaid,
      pendingCount,
      paidCount,
      avgDelay,
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
            data.filter((item) => item.status === "Paid").length,
            data.filter((item) => item.status === "Pending").length,
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
            data.filter((item) => item.feeTemplate.includes("FullFees")).length,
            data.filter((item) => item.feeTemplate.includes("Installments")).length,
            data.filter((item) => item.feeTemplate.includes("Finance")).length,
            data.filter((item) => item.feeTemplate === "Free").length,
          ],
          backgroundColor: colors,
          hoverBackgroundColor: hoverColors,
        },
      ],
    };

    const monthlyData = {};
    data.forEach((item) => {
      const date = item.status === "Paid" ? item.paidDate : item.dueDate;
      if (!date) return;
      const dueDate = new Date(date);
      const monthYear = `${dueDate.getFullYear()}-${String(dueDate.getMonth() + 1).padStart(2, "0")}`;
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { due: 0, paid: 0 };
      }
      if (item.status === "Pending") {
        monthlyData[monthYear].due += toNumber(item.amount);
      } else {
        monthlyData[monthYear].paid += toNumber(item.amount);
      }
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
            data
              .filter((item) => item.feeTemplate.includes("FullFees") && item.status === "Paid")
              .reduce((acc, item) => acc + toNumber(item.amount), 0),
            data
              .filter((item) => item.feeTemplate.includes("Installments") && item.status === "Paid")
              .reduce((acc, item) => acc + toNumber(item.amount), 0),
            data
              .filter((item) => item.feeTemplate.includes("Finance") && item.status === "Paid")
              .reduce((acc, item) => acc + toNumber(item.amount), 0),
            data
              .filter((item) => item.feeTemplate === "Free" && item.status === "Paid")
              .reduce((acc, item) => acc + toNumber(item.amount), 0),
          ],
          backgroundColor: colors[0],
          hoverBackgroundColor: hoverColors[0],
        },
        {
          label: "Pending",
          data: [
            data
              .filter((item) => item.feeTemplate.includes("FullFees") && item.status === "Pending")
              .reduce((acc, item) => acc + toNumber(item.amount), 0),
            data
              .filter((item) => item.feeTemplate.includes("Installments") && item.status === "Pending")
              .reduce((acc, item) => acc + toNumber(item.amount), 0),
            data
              .filter((item) => item.feeTemplate.includes("Finance") && item.status === "Pending")
              .reduce((acc, item) => acc + toNumber(item.amount), 0),
            data
              .filter((item) => item.feeTemplate === "Free" && item.status === "Pending")
              .reduce((acc, item) => acc + toNumber(item.amount), 0),
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold text-gray-600 animate-pulse">
          Loading dashboard...
        </div>
      </div>
    );
  }

  const filteredFeeData = filterFeeData();
  const { totalDue, totalPaid, pendingCount, paidCount, avgDelay, topPendingStudents, paymentMethods } =
    calculateAnalytics(filteredFeeData);
  const { statusData, feeTypeData, barData, stackedBarData, lineData } = prepareChartData(filteredFeeData);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 w-[calc(100vw-360px)]">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Fee Analytics Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Total Due</h2>
          <p className="text-2xl font-bold text-blue-600">₹{totalDue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Total Paid</h2>
          <p className="text-2xl font-bold text-green-600">₹{totalPaid.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Pending</h2>
          <p className="text-2xl font-bold text-red-600">{pendingCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Paid</h2>
          <p className="text-2xl font-bold text-green-600">{paidCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Avg. Delay (Days)</h2>
          <p className="text-2xl font-bold text-purple-600">{avgDelay.toFixed(1)}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full sm:w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
        >
          <option value="thisMonth">This Month</option>
          <option value="lastMonth">Last Month</option>
          <option value="nextMonth">Next Month</option>
          <option value="thisYear">This Year</option>
          <option value="lastYear">Last Year</option>
          <option value="all">All</option>
        </select>
        <input
          type="text"
          placeholder="Search by student name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-64 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
        />
        <div className="flex gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
            className="w-full sm:w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
            className="w-full sm:w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
          />
        </div>
        <button
          onClick={resetFilters}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-150 ease-in-out"
        >
          Reset Filters
        </button>
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

      {/* Table */}
      <div className="bg-white shadow-md rounded-lg">
        <div className="overflow-x-auto max-w-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-48">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-48">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-48">Fee Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-48">Total Fees</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-48">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-48">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-48">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-48">Paid Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-48">Received By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-48">Remarks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-48">Payment Method</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFeeData.map((item, index) => {
                const dueDate = item.dueDate ? new Date(item.dueDate) : null;
                const paidDate = item.paidDate ? new Date(item.paidDate) : null;

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.studentName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.courseName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.feeTemplate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{toNumber(item.totalFees).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{toNumber(item.amount).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {dueDate ? dueDate.toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <select
                        value={item.status}
                        onChange={(e) => handleUpdate(item, "status", e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <input
                        type="date"
                        value={paidDate ? paidDate.toISOString().split("T")[0] : ""}
                        onChange={(e) => handleUpdate(item, "paidDate", e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        disabled={item.status !== "Paid"}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <input
                        type="text"
                        value={item.receivedBy || ""}
                        onChange={(e) => handleUpdate(item, "receivedBy", e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        disabled={item.status !== "Paid"}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <input
                        type="text"
                        value={item.remark || ""}
                        onChange={(e) => handleUpdate(item, "remark", e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.paymentMethod || "N/A"}</td>
                  </tr>
                );
              })}
              <tr className="bg-gray-100">
                <td colSpan="4" className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  Total:
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  ₹{filteredFeeData.reduce((acc, item) => acc + toNumber(item.amount), 0).toFixed(2)}
                </td>
                <td colSpan="6" className="px-6 py-4"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}