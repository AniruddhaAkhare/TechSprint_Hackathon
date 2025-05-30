import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Pie, Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, BarElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, LineElement, BarElement, CategoryScale, LinearScale, PointElement);

export default function AttendanceDashboard() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [batches, setBatches] = useState([]);
  const [studentsByBatch, setStudentsByBatch] = useState({});
  const [batchDetails, setBatchDetails] = useState({});
  const [centers, setCenters] = useState([]);
  const [filters, setFilters] = useState({
    centers: [],
    batchStatus: 'Active',
    dateRange: { start: '', end: '' },
    batches: [],
    studentName: '',
    attendanceStatus: 'All',
  });
  const [analytics, setAnalytics] = useState({
    overallAttendance: { Present: 0, Absent: 0, Leave: 0 },
    batchTrends: {},
    studentSummary: {},
    centerComparison: {},
  });
  const [loading, setLoading] = useState(false);
  const { user, rolePermissions } = useAuth();
  const dashboardRef = useRef(null);

  // Define permissions
  const canView = rolePermissions?.attendance?.display || false;

  // Logging function
  const logActivity = async (action, details) => {
    if (!canView) return;
    try {
        const activityLog = {
            action,
            details,
            timestamp: new Date().toISOString(),
            user: user?.email || 'currentUser@example.com',
            centerId: filters.centers.join(', ') || 'All',
            batchId: filters.batches.join(', ') || 'All',
        };
        await addDoc(collection(db, 'activityLogs'), activityLog);
    } catch (error) {
        //console.error('Error logging activity:', error);
    }
};

  // Fetch centers
  const fetchCenters = async () => {
    if (!canView) return;
    try {
      const centersCollection = collection(db, 'instituteSetup');
      const centersSnapshot = await getDocs(centersCollection);
      const centersData = await Promise.all(
        centersSnapshot.docs.map(async (doc) => {
          const branchesCollection = collection(db, 'instituteSetup', doc.id, 'Center');
          const branchesSnapshot = await getDocs(branchesCollection);
          return branchesSnapshot.docs.map((branchDoc) => ({
            id: branchDoc.id,
            ...branchDoc.data(),
          }));
        })
      );
      const allCenters = centersData.flat();
      setCenters(allCenters);
      // logActivity('Fetch Centers', { centerCount: allCenters.length });
    } catch (error) {
      //console.error('Error fetching centers:', error);
      alert('Failed to fetch centers.');
    }
  };

  // Fetch batches and students
  const fetchBatchesAndStudents = async () => {
    if (!canView) return;
    setLoading(true);
    try {
      let batchesQuery =
        filters.batchStatus === 'All'
          ? collection(db, 'Batch')
          : query(collection(db, 'Batch'), where('status', '==', filters.batchStatus));
      const batchesSnapshot = await getDocs(batchesQuery);
      let batchData = batchesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (filters.centers.length > 0) {
        batchData = batchData.filter((batch) =>
          batch.centers && Array.isArray(batch.centers) && batch.centers.some((c) => filters.centers.includes(c))
        );
      }

      if (filters.dateRange.start && filters.dateRange.end) {
        const start = new Date(filters.dateRange.start);
        const end = new Date(filters.dateRange.end);
        batchData = batchData.filter((batch) => {
          const batchStart = batch.startDate?.toDate ? batch.startDate.toDate() : new Date(batch.startDate);
          const batchEnd = batch.endDate?.toDate ? batch.endDate.toDate() : new Date(batch.endDate);
          return !isNaN(batchStart) && !isNaN(batchEnd) && batchStart <= end && batchEnd >= start;
        });
      }

      if (filters.batches.length > 0) {
        batchData = batchData.filter((batch) => filters.batches.includes(batch.id));
      }

      const batchMap = {};
      batchData.forEach((batch) => {
        const startDate = batch.startDate?.toDate ? batch.startDate.toDate() : new Date(batch.startDate);
        const endDate = batch.endDate?.toDate ? batch.endDate.toDate() : new Date(batch.endDate);
        if (!isNaN(startDate) && !isNaN(endDate)) {
          batchMap[batch.id] = {
            batchName: batch.batchName || 'Unnamed Batch',
            startDate,
            endDate,
            centers: batch.centers || [],
            status: batch.status || 'Active',
          };
        }
      });
      setBatchDetails(batchMap);
      setBatches(batchData);

      const studentsByBatchMap = {};
      await Promise.all(
        batchData.map(async (batch) => {
          const batchId = batch.id;
          const studentIds = batch.students && Array.isArray(batch.students) ? batch.students : [];
          studentsByBatchMap[batchId] = [];

          for (const studentId of studentIds) {
            try {
              const studentDocRef = doc(db, 'student', studentId);
              const studentDoc = await getDoc(studentDocRef);
              if (studentDoc.exists()) {
                const studentData = studentDoc.data();
                if (
                  filters.studentName &&
                  !`${studentData.first_name} ${studentData.last_name}`.toLowerCase().includes(filters.studentName.toLowerCase())
                ) {
                  continue;
                }
                studentsByBatchMap[batchId].push({
                  id: studentId,
                  first_name: studentData.first_name || 'Unknown',
                  last_name: studentData.last_name || '',
                });
              }
            } catch (error) {
              //console.error(`Error fetching student ${studentId}:`, error);
            }
          }
        })
      );

      setStudentsByBatch(studentsByBatchMap);
      // logActivity('Fetch Batches and Students', {
      //   batchCount: batchData.length,
      //   studentCount: Object.values(studentsByBatchMap).flat().length,
      // });
    } catch (error) {
      //console.error('Error fetching batches and students:', error);
      alert('Failed to load batches and students.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch attendance data
  const fetchAttendanceData = async () => {
    if (!canView) return;
    try {
      let attendanceQuery = collection(db, 'attendance');
      if (filters.centers.length > 0) {
        attendanceQuery = query(attendanceQuery, where('centerId', 'in', filters.centers));
      }
      if (filters.batches.length > 0) {
        attendanceQuery = query(attendanceQuery, where('batch_id', 'in', filters.batches));
      }
      if (filters.attendanceStatus !== 'All') {
        attendanceQuery = query(attendanceQuery, where('status', '==', filters.attendanceStatus));
      }
      const snapshot = await getDocs(attendanceQuery);
      const fetchedData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate ? doc.data().date.toDate() : new Date(doc.data().date),
        student_name: doc.data().student_name || 'Unknown',
      }));

      let filteredData = fetchedData;
      if (filters.dateRange.start && filters.dateRange.end) {
        const start = new Date(filters.dateRange.start);
        const end = new Date(filters.dateRange.end);
        filteredData = fetchedData.filter((record) => {
          const recordDate = new Date(record.date);
          return !isNaN(recordDate) && recordDate >= start && recordDate <= end;
        });
      }

      setAttendanceData(filteredData);
      // logActivity('Fetch Attendance', { recordCount: filteredData.length });
    } catch (error) {
      //console.error('Error fetching attendance:', error);
      alert('Failed to fetch attendance data.');
    }
  };

  // Generate date range
  const generateDateRange = (startDate, endDate) => {
    if (!startDate || !endDate || isNaN(new Date(startDate).getTime()) || isNaN(new Date(endDate).getTime())) {
      console.warn('Invalid date range:', { startDate, endDate });
      return [];
    }
    const dates = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);
    while (currentDate <= end) {
      dates.push(new Date(currentDate).toLocaleDateString('en-US'));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  // Calculate analytics
  const calculateAnalytics = () => {
    if (!attendanceData.length || !Object.keys(batchDetails).length || !batches.length) {
      console.warn('Insufficient data for analytics:', {
        attendanceData: attendanceData.length,
        batchDetails: Object.keys(batchDetails).length,
        batches: batches.length,
      });
      return;
    }

    const overallAttendance = { Present: 0, Absent: 0, Leave: 0 };
    const batchTrends = {};
    const studentSummary = {};
    const centerComparison = {};

    // Overall attendance
    attendanceData.forEach((record) => {
      if (record.status in overallAttendance) {
        overallAttendance[record.status]++;
      }
    });

    // Batch trends
    batches.forEach((batch) => {
      const batchAttendance = attendanceData.filter((r) => r.batch_id === batch.id);
      const startDate = filters.dateRange.start
        ? new Date(filters.dateRange.start)
        : batchDetails[batch.id]?.startDate;
      const endDate = filters.dateRange.end
        ? new Date(filters.dateRange.end)
        : batchDetails[batch.id]?.endDate;
      if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.warn(`Invalid dates for batch ${batch.id}:`, { startDate, endDate });
        batchTrends[batch.id] = [];
        return;
      }
      const dates = generateDateRange(startDate, endDate);
      batchTrends[batch.id] = dates.map((date) => {
        const dayRecords = batchAttendance.filter(
          (r) => new Date(r.date).toLocaleDateString('en-US') === date
        );
        const present = dayRecords.filter((r) => r.status === 'Present').length;
        const total = dayRecords.length || 1;
        return (present / total) * 100;
      });
    });

    // Student summary
    Object.keys(studentsByBatch).forEach((batchId) => {
      studentsByBatch[batchId].forEach((student) => {
        const studentName = `${student.first_name} ${student.last_name}`.trim();
        const studentRecords = attendanceData.filter(
          (r) => r.student_name === studentName && r.batch_id === batchId
        );
        const present = studentRecords.filter((r) => r.status === 'Present').length;
        const total = studentRecords.length || 1;
        studentSummary[studentName] = (present / total) * 100;
      });
    });

    // Center comparison
    centers.forEach((center) => {
      const centerAttendance = attendanceData.filter((r) => r.centerId === center.id);
      centerComparison[center.name || center.id] = {
        Present: centerAttendance.filter((r) => r.status === 'Present').length,
        Absent: centerAttendance.filter((r) => r.status === 'Absent').length,
        Leave: centerAttendance.filter((r) => r.status === 'Leave').length,
      };
    });

    setAnalytics({ overallAttendance, batchTrends, studentSummary, centerComparison });
    //  logActivity('Calculate Analytics', {
    //   batches: batches.length,
    //   students: Object.values(studentsByBatch).flat().length,
    // });
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Batch Name', 'Student Name', 'Date', 'Status', 'Center ID'];
    const data = attendanceData.map((record) => [
      batchDetails[record.batch_id]?.batchName || 'Unknown',
      record.student_name,
      new Date(record.date).toLocaleDateString('en-US'),
      record.status,
      record.centerId,
    ]);
    const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
    XLSX.writeFile(wb, 'Attendance_Analytics.csv');
    logActivity('Export CSV', { recordCount: data.length });
  };

  // Export to PDF
  const exportToPDF = async () => {
    if (!dashboardRef.current) {
      alert('Dashboard reference not found.');
      return;
    }
    try {
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        useCORS: true,
        logging: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save('Attendance_Dashboard.pdf');
      logActivity('Export PDF', {});
    } catch (error) {
      //console.error('PDF Export Error:', error);
      alert('Failed to export PDF.');
    }
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    logActivity('Update Filter', { filter: key, value });
  };

  useEffect(() => {
    if (canView) {
      fetchCenters();
      fetchBatchesAndStudents();
      fetchAttendanceData();
    }
  }, [filters.centers, filters.batchStatus, filters.batches, filters.dateRange, filters.studentName, filters.attendanceStatus, canView]);

  useEffect(() => {
    if (attendanceData.length > 0 && Object.keys(batchDetails).length > 0 && batches.length > 0) {
      calculateAnalytics();
    }
  }, [attendanceData, batchDetails, studentsByBatch, batches]);

  // Chart data
  const pieChartData = {
    labels: ['Present', 'Absent', 'Leave'],
    datasets: [
      {
        data: [
          analytics.overallAttendance.Present || 0,
          analytics.overallAttendance.Absent || 0,
          analytics.overallAttendance.Leave || 0,
        ],
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
      },
    ],
  };

  const lineChartData = (batchId) => {
    const startDate = filters.dateRange.start ? new Date(filters.dateRange.start) : batchDetails[batchId]?.startDate;
    const endDate = filters.dateRange.end ? new Date(filters.dateRange.end) : batchDetails[batchId]?.endDate;
    return {
      labels: generateDateRange(startDate, endDate),
      datasets: [
        {
          label: 'Attendance Rate (%)',
          data: analytics.batchTrends[batchId] || [],
          borderColor: '#36A2EB',
          fill: false,
        },
      ],
    };
  };

  const barChartData = {
    labels: Object.keys(analytics.studentSummary),
    datasets: [
      {
        label: 'Attendance Rate (%)',
        data: Object.values(analytics.studentSummary),
        backgroundColor: '#36A2EB',
      },
    ],
  };

  const centerBarChartData = {
    labels: Object.keys(analytics.centerComparison),
    datasets: [
      {
        label: 'Present',
        data: Object.values(analytics.centerComparison).map((c) => c.Present || 0),
        backgroundColor: '#36A2EB',
      },
      {
        label: 'Absent',
        data: Object.values(analytics.centerComparison).map((c) => c.Absent || 0),
        backgroundColor: '#FF6384',
      },
      {
        label: 'Leave',
        data: Object.values(analytics.centerComparison).map((c) => c.Leave || 0),
        backgroundColor: '#FFCE56',
      },
    ],
  };

  if (!canView) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="bg-red-100 p-6 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-800 mb-4">Access Denied</h2>
          <p className="text-red-600">You do not have permission to view the Attendance Dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 fixed inset-0 left-[300px] overflow-y-auto" ref={dashboardRef}>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Attendance Analytics Dashboard</h2>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Centers</label>
            <select
              multiple
              value={filters.centers}
              onChange={(e) => handleFilterChange('centers', Array.from(e.target.selectedOptions, (option) => option.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              {centers.map((center) => (
                <option key={center.id} value={center.id}>
                  {center.name || 'Unnamed Center'}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Batch Status</label>
            <select
              value={filters.batchStatus}
              onChange={(e) => handleFilterChange('batchStatus', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="All">All</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date Range</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Batches</label>
            <select
              multiple
              value={filters.batches}
              onChange={(e) => handleFilterChange('batches', Array.from(e.target.selectedOptions, (option) => option.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              {batches.map((batch) => (
                <option key={batch.id} value={batch.id}>
                  {batch.batchName || 'Unnamed Batch'}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Student Name</label>
            <input
              type="text"
              value={filters.studentName}
              onChange={(e) => handleFilterChange('studentName', e.target.value)}
              placeholder="Search by name..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Attendance Status</label>
            <select
              value={filters.attendanceStatus}
              onChange={(e) => handleFilterChange('attendanceStatus', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              <option value="All">All</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Leave">Leave</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-600 text-center">Loading...</p>
      ) : (
        <div className="space-y-8">
          {/* Overall Attendance Pie Chart */}
          {analytics.overallAttendance.Present > 0 ||
          analytics.overallAttendance.Absent > 0 ||
          analytics.overallAttendance.Leave > 0 ? (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Overall Attendance</h3>
              <div className="max-w-md mx-auto">
                <Pie data={pieChartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
              </div>
            </div>
          ) : (
            <p className="text-gray-600 text-center">No overall attendance data available.</p>
          )}

          {/* Batch Attendance Trends */}
          {batches.map((batch) => {
            const chartData = lineChartData(batch.id);
            return chartData.labels.length > 0 && chartData.datasets[0].data.length > 0 ? (
              <div key={batch.id} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{batch.batchName} Attendance Trend</h3>
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    scales: { y: { beginAtZero: true, max: 100, title: { display: true, text: 'Attendance Rate (%)' } } },
                  }}
                />
              </div>
            ) : (
              <p key={batch.id} className="text-gray-600 text-center">
                No attendance trend data for {batch.batchName}.
              </p>
            );
          })}

          {/* Student Attendance Summary */}
          {Object.keys(analytics.studentSummary).length > 0 ? (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Student Attendance Summary</h3>
              <Bar data={barChartData} options={{ responsive: true, scales: { y: { beginAtZero: true, max: 100 } } }} />
            </div>
          ) : (
            <p className="text-gray-600 text-center">No student attendance data available.</p>
          )}

          {/* Center Comparison */}
          {Object.keys(analytics.centerComparison).length > 0 ? (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Center Comparison</h3>
              <Bar
                data={centerBarChartData}
                options={{
                  responsive: true,
                  scales: { x: { stacked: true }, y: { stacked: true, title: { display: true, text: 'Count' } } },
                }}
              />
            </div>
          ) : (
            <p className="text-gray-600 text-center">No center comparison data available.</p>
          )}

          {/* Batch Summary Table */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Batch Summary</h3>
            <table className="w-full border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">Batch Name</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">Total Students</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">Attendance Rate (%)</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">Avg. Daily Attendance</th>
                </tr>
              </thead>
              <tbody>
                {batches.length > 0 ? (
                  batches.map((batch) => {
                    const batchAttendance = attendanceData.filter((r) => r.batch_id === batch.id);
                    const present = batchAttendance.filter((r) => r.status === 'Present').length;
                    const total = batchAttendance.length || 1;
                    const students = studentsByBatch[batch.id]?.length || 0;
                    const dates = generateDateRange(
                      batchDetails[batch.id]?.startDate,
                      batchDetails[batch.id]?.endDate
                    );
                    const avgDaily = dates.length ? present / dates.length : 0;
                    return (
                      <tr key={batch.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-gray-600">{batch.batchName || 'Unnamed Batch'}</td>
                        <td className="p-3 text-gray-600">{students}</td>
                        <td className="p-3 text-gray-600">{((present / total) * 100).toFixed(2)}%</td>
                        <td className="p-3 text-gray-600">{avgDaily.toFixed(2)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="p-3 text-gray-600 text-center">
                      No batches available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Student Attendance Details */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Student Attendance Details</h3>
            {batches.length > 0 ? (
              batches.map((batch) => {
                const { students, dates, attendanceMap } = {
                  students: studentsByBatch[batch.id]?.map((s) => `${s.first_name} ${s.last_name}`.trim()) || [],
                  dates: generateDateRange(batchDetails[batch.id]?.startDate, batchDetails[batch.id]?.endDate),
                  attendanceMap: attendanceData
                    .filter((r) => r.batch_id === batch.id)
                    .reduce((map, r) => {
                      const dateStr = new Date(r.date).toLocaleDateString('en-US');
                      map[`${r.student_name}-${dateStr}`] = r.status;
                      return map;
                    }, {}),
                };
                return (
                  <div key={batch.id} className="mb-6">
                    <h4 className="font-semibold text-gray-700 mb-2">{batch.batchName || 'Unnamed Batch'}</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead className="bg-gray-200">
                          <tr>
                            <th className="p-3 text-left text-sm font-semibold text-gray-700">Student Name</th>
                            {dates.map((date, index) => (
                              <th key={index} className="p-3 text-left text-sm font-semibold text-gray-700">
                                {date}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {students.length > 0 ? (
                            students.map((student, index) => (
                              <tr key={index} className="border-b hover:bg-gray-50">
                                <td className="p-3 text-gray-600">{student || 'Unknown'}</td>
                                {dates.map((date, dateIndex) => (
                                  <td key={dateIndex} className="p-3 text-gray-600">
                                    {attendanceMap[`${student}-${date}`] || '-'}
                                  </td>
                                ))}
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={dates.length + 1} className="p-3 text-gray-600 text-center">
                                No students assigned to this batch.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-600 text-center">No student attendance details available.</p>
            )}
          </div>

          {/* Export Buttons */}
          <div className="flex gap-4">
            <button
              onClick={exportToCSV}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Export to CSV
            </button>
            <button
              onClick={exportToPDF}
              className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
            >
              Export to PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}