import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { runTransaction } from 'firebase/firestore';

export default function Attendance() {
  const navigate = useNavigate();
  const { user, rolePermissions } = useAuth();
  const [attendanceData, setAttendanceData] = useState([]);
  const [file, setFile] = useState(null);
  const [batches, setBatches] = useState([]);
  const [expandedBatch, setExpandedBatch] = useState(null);
  const [studentsByBatch, setStudentsByBatch] = useState({});
  const [batchDetails, setBatchDetails] = useState({});
  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState('');
  const [batchStatusFilter, setBatchStatusFilter] = useState('Active');
  const [startDateFilter, setStartDateFilter] = useState('');

  // Define permissions
  const canView = rolePermissions?.attendance?.display|| false;
  const canCreate = rolePermissions?.attendance?.create || false;
  // const canUpdate = rolePermissions?.attendance?.update || false; // Reserved for future use
  // const canDelete = rolePermissions?.attendance?.delete || false; // Reserved for future use
  // const canViewAnalytics = rolePermissions?.attendance?.viewAnalytics || false;

const logActivity = async (action, details) => {
    if (!user?.email) {
      console.warn("No user email found, skipping activity log");
      return;
    }

    const activityLogRef = doc(db, "activityLogs", "logDocument");

    const logEntry = {
      action,
      details,
      timestamp: new Date().toISOString(),
      userEmail: user.email,
      userId: user.uid,
      section:"Attendance"
      // adminId: adminId || "N/A",
    };

    try {
      await runTransaction(db, async (transaction) => {
        const logDoc = await transaction.get(activityLogRef);
        let logs = logDoc.exists() ? logDoc.data().logs || [] : [];

        if (!Array.isArray(logs)) {
          logs = [];
        }

        logs.push(logEntry);

        if (logs.length > 1000) {
          logs = logs.slice(-1000);
        }

        transaction.set(activityLogRef, { logs }, { merge: true });
      });
      console.log("Activity logged successfully:", action);
    } catch (error) {
      console.error("Error logging activity:", error);
      // toast.error("Failed to log activity");
    }
  };


  const fetchCenters = async () => {
    if (!canView) return;
    try {
      const centersCollection = collection(db, 'instituteSetup');
      const centersSnapshot = await getDocs(centersCollection);
      const centersData = await Promise.all(
        centersSnapshot.docs.map(async (doc) => {
          const branchesCollection = collection(db, 'Branch');
          const branchesSnapshot = await getDocs(branchesCollection);
          return branchesSnapshot.docs.map((branchDoc) => ({
            id: branchDoc.id,
            ...branchDoc.data(),
          }));
        })
      );
      const allCenters = centersData.flat();
      setCenters(allCenters);
    } catch (error) {
      //console.error('Error fetching centers:', error);
      alert('Failed to fetch centers. Please check your permissions or network.');
    }
  };

  const fetchBatchesAndStudents = async (centerId) => {
    if (!canView) return;
    try {
      let batchesQuery =
        batchStatusFilter === 'All'
          ? collection(db, 'Batch')
          : query(collection(db, 'Batch'), where('status', '==', batchStatusFilter));
      const batchesSnapshot = await getDocs(batchesQuery);
      let batchData = batchesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (centerId) {
        batchData = batchData.filter(
          (batch) => batch.centers && Array.isArray(batch.centers) && batch.centers.includes(centerId)
        );
      }

      if (startDateFilter) {
        const start = new Date(startDateFilter);
        batchData = batchData.filter((batch) => {
          const batchStart = batch.startDate?.toDate
            ? batch.startDate.toDate()
            : new Date(batch.startDate);
          return !isNaN(batchStart) && batchStart >= start;
        });
      }

      const batchMap = {};
      batchData.forEach((batch) => {
        const startDate = batch.startDate?.toDate
          ? batch.startDate.toDate()
          : new Date(batch.startDate);
        const endDate = batch.endDate?.toDate
          ? batch.endDate.toDate()
          : new Date(batch.endDate);
        if (!isNaN(startDate) && !isNaN(endDate)) {
          batchMap[batch.id] = {
            batchName: batch.batchName || 'Unnamed Batch',
            startDate,
            endDate,
            centers: batch.centers || [],
            status: batch.status || 'Active',
          };
        } else {
          console.warn(`Batch ${batch.id} has invalid dates`, batch);
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

          if (studentIds.length === 0) {
            return;
          }

          for (const studentId of studentIds) {
            try {
              const studentDocRef = doc(db, 'student', studentId);
              const studentDoc = await getDoc(studentDocRef);
              if (studentDoc.exists()) {
                const studentData = studentDoc.data();
                studentsByBatchMap[batchId].push({
                  id: studentId,
                  first_name: studentData.Name|| 'Unknown',
                  
                });
              } else {
                console.warn(`Student ${studentId} not found in student collection for batch ${batchId}`);
              }
            } catch (error) {
              //console.error(`Error fetching student ${studentId} for batch ${batchId}:`, error);
            }
          }
        })
      );

      setStudentsByBatch(studentsByBatchMap);
    } catch (error) {
      //console.error('Error fetching batches and students:', error);
      alert('Failed to load batches or students. Check console for details.');
    }
  };

  const generateDateRange = (startDate, endDate) => {
    if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
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

  const generateTemplate = (batchId) => {
    if (!canView) {
      alert('You do not have permission to download attendance templates.');
      return;
    }
    const students = studentsByBatch[batchId] || [];
    if (students.length === 0) {
      alert('No students found for this batch.');
      return;
    }

    const batch = batchDetails[batchId];
    if (!batch || !batch.startDate || !batch.endDate) {
      alert('Batch details (startDate or endDate) not found.');
      return;
    }

    const dateHeaders = generateDateRange(batch.startDate, batch.endDate);
    if (!dateHeaders.length) {
      alert('Invalid date range for this batch.');
      return;
    }

    const headers = ['Student Name', ...dateHeaders];
    const data = students.map((student) => [
      `${student.Name}`.trim(),
      ...dateHeaders.map(() => ''),
    ]);

    const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
    XLSX.writeFile(wb, `Attendance_${batch.batchName || 'Batch'}.xlsx`);

    logActivity('Template downloaded', { batchId, batchName: batch.batchName, studentCount: students.length });
  };

  const handleFileChange = (event) => {
    if (!canCreate) {
      alert('You do not have permission to upload attendance data.');
      return;
    }
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
    if (uploadedFile) {
      processFile(uploadedFile);
    }
  };

  const processFile = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary', dateNF: 'mm/dd/yyyy' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (!rawData || rawData.length < 2) {
          alert('Invalid file format. Ensure the first row contains headers.');
          return;
        }

        const headers = rawData[0].map((header) => header.toString().trim());
        const studentNameIndex = headers.findIndex((h) => h.toLowerCase().includes('name'));
        if (studentNameIndex === -1) {
          alert("No 'Student Name' column found in the Excel file.");
          return;
        }

        const dateHeaders = headers.slice(1);
        const jsonData = rawData.slice(1);

        const formattedData = jsonData.flatMap((row, rowIndex) => {
          const studentName = row[studentNameIndex]?.toString().trim();
          if (!studentName) {
            console.warn(`Row ${rowIndex + 2}: Missing student name`, row);
            return [];
          }

          return dateHeaders.map((date, dateIndex) => {
            const status = row[dateIndex + 1]?.toString().trim();
            const parsedDate = new Date(date);
            return {
              batch_id: expandedBatch || 'Unknown Batch',
              date: parsedDate.toISOString(),
              student_name: studentName,
              status: status || 'N/A',
              centerId: selectedCenter || 'Unknown',
            };
          });
        }).filter((record) => record.student_name !== 'Unknown' && !isNaN(new Date(record.date).getTime()));

        setAttendanceData(formattedData);
      } catch (error) {
        //console.error('Error processing file:', error);
        alert('Failed to process Excel file. Ensure correct format.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const uploadToFirestore = async () => {
    if (!canCreate) {
      alert('You do not have permission to upload attendance data.');
      return;
    }
    if (!attendanceData.length) {
      alert('No attendance data to upload. Please select a file.');
      return;
    }

    try {
      const attendanceCollection = collection(db, 'attendance');
      const validRecords = attendanceData.filter(
        (record) => record.student_name && record.student_name !== 'Unknown' && record.status !== 'N/A'
      );
      if (!validRecords.length) {
        alert('No valid attendance data to upload.');
        return;
      }

      await Promise.all(
        validRecords.map(async (record) => {
          await addDoc(attendanceCollection, {
            batch_id: record.batch_id,
            date: new Date(record.date),
            student_name: record.student_name,
            status: record.status,
            centerId: record.centerId,
          });
        })
      );

      logActivity('Attendance uploaded', {
        batchId: expandedBatch,
        batchName: batchDetails[expandedBatch]?.batchName || 'Unknown',
        recordCount: validRecords.length,
        fileName: file?.name || 'Unknown',
      });

      alert('Attendance data uploaded successfully!');
      setFile(null);
      setAttendanceData([]);
      fetchAttendanceData();
    } catch (error) {
      //console.error('Error uploading attendance data:', error);
      alert('Failed to upload attendance data. Check console for details.');
    }
  };

  const fetchAttendanceData = async () => {
    if (!canView) return;
    try {
      const attendanceCollection = collection(db, 'attendance');
      const snapshot = await getDocs(attendanceCollection);
      const fetchedData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate ? doc.data().date.toDate() : new Date(doc.data().date),
      }));
      setAttendanceData(fetchedData);
    } catch (error) {
      //console.error('Error fetching attendance data:', error);
      alert('Failed to fetch attendance data.');
    }
  };

  useEffect(() => {
    if (canView) {
      fetchCenters();
      fetchBatchesAndStudents(selectedCenter);
      fetchAttendanceData();
    }
  }, [batchStatusFilter, startDateFilter, selectedCenter, canView]);

  const handleCenterChange = (e) => {
    if (!canView) {
      alert('You do not have permission to change center filters.');
      return;
    }
    const centerId = e.target.value;
    setSelectedCenter(centerId);
    // logActivity('Change Center Filter', { centerId });
  };

  const toggleBatch = (batchId) => {
    if (!canView) {
      alert('You do not have permission to view batch details.');
      return;
    }
    setExpandedBatch((prev) => (prev === batchId ? null : batchId));
    setFile(null);
  };

  const getAttendanceTableData = (batchId) => {
    const batch = batchDetails[batchId];
    const students = studentsByBatch[batchId] || [];
    const batchAttendance = attendanceData.filter(
      (record) => record.batch_id === batchId && (!selectedCenter || record.centerId === selectedCenter)
    );

    if (!batch || !batch.startDate || !batch.endDate) {
      console.warn(`Batch ${batchId}: Missing details`, batch);
      return { students: [], dates: [], attendanceMap: {} };
    }

    const dates = generateDateRange(batch.startDate, batch.endDate);
    const studentNames = students.map((s) => `${s.first_name}`.trim());
    const attendanceMap = {};

    batchAttendance.forEach((record) => {
      const dateStr = new Date(record.date).toLocaleDateString('en-US');
      attendanceMap[`${record.student_name}-${dateStr}`] = record.status;
    });

    return { students: studentNames, dates, attendanceMap };
  };

  const handleAnalyticsClick = () => {
    // if (!canViewAnalytics) {
    //   alert('You do not have permission to view analytics.');
    //   return;
    // }
    navigate('/attendance-dashboard');
    // logActivity('Navigate to Analytics', { destination: 'attendance-dashboard' });
  };

  if (!canView) {
    return (
      <div className="p-4 text-red-600 text-center">
        Access Denied: You do not have permission to view attendance data.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 sm:p-6 md:p-8 p-4 fixed inset-0 left-[300px] overflow-y-auto">
      {/* Header with Analytics Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Attendance Management</h2>
        {/* {canViewAnalytics && ( */}
          <button
            onClick={handleAnalyticsClick}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
          >
            Analytics
          </button>
        {/* )} */}
      </div>

      {/* Filters */}
     
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-4 bg-white rounded-lg shadow-md">
  <div>
    <label htmlFor="centerSelect" className="block text-sm font-semibold text-gray-800 mb-2">
      Select Center
    </label>
    <select
      id="centerSelect"
      value={selectedCenter}
      onChange={handleCenterChange}
      className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm 
                 transition duration-200 ease-in-out
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
      disabled={!canView}
    >
      <option value="">All Centers</option>
      {centers.map((center) => (
        <option key={center.id} value={center.id}>
          {center.name || 'Unnamed Center'}
        </option>
      ))}
    </select>
  </div>

  <div>
    <label htmlFor="statusFilter" className="block text-sm font-semibold text-gray-800 mb-2">
      Batch Status
    </label>
    <select
      id="statusFilter"
      value={batchStatusFilter}
      onChange={(e) => {
        setBatchStatusFilter(e.target.value);
        // logActivity('Change Batch Status Filter', { status: e.target.value });
      }}
      className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm 
                 transition duration-200 ease-in-out
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
      disabled={!canView}
    >
      <option value="Active">Active</option>
      <option value="Inactive">Inactive</option>
      <option value="All">All</option>
    </select>
  </div>

  <div>
    <label htmlFor="startDate" className="block text-sm font-semibold text-gray-800 mb-2">
      Start Date From
    </label>
    <input
      type="date"
      id="startDate"
      value={startDateFilter}
      onChange={(e) => {
        setStartDateFilter(e.target.value);
        // logActivity('Change Start Date Filter', { startDate: e.target.value });
      }}
      className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm 
                 transition duration-200 ease-in-out
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
      disabled={!canView}
    />
  </div>
</div>

  

      {/* Batch List */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {batchStatusFilter === 'All' ? 'All Batches' : `${batchStatusFilter} Batches`}
        </h3>
        <div className="space-y-4">
          {batches.length > 0 ? (
            batches.map((batch) => (
              <div key={batch.id} className="border rounded-md">
                <button
                  onClick={() => toggleBatch(batch.id)}
                  className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 flex justify-between items-center rounded-t-md transition duration-200"
                >
                  <span className="font-medium text-gray-700">{batch.batchName || 'Unnamed Batch'}</span>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-sm ${
                        batchDetails[batch.id]?.status === 'Active' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {batchDetails[batch.id]?.status || 'Unknown'}
                    </span>
                    <span>{expandedBatch === batch.id ? '▼' : '▶'}</span>
                  </div>
                </button>
                {expandedBatch === batch.id && (
                  <div className="p-4 bg-gray-50 rounded-b-md">
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                      {canView && (
                        <button
                          onClick={() => generateTemplate(batch.id)}
                          className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-200"
                        >
                          Download Template
                        </button>
                      )}
                      {canCreate && (
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleFileChange}
                            className="text-sm text-gray-600"
                          />
                          <button
                            onClick={uploadToFirestore}
                            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                          >
                            Upload
                          </button>
                        </div>
                      )}
                    </div>
                    <h4 className="font-semibold text-gray-700 mb-2">Attendance for {batch.batchName || 'Batch'}</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead className="bg-gray-200">
                          <tr>
                            <th className="p-3 text-left text-sm font-semibold text-gray-700">Student Name</th>
                            {batchDetails[batch.id] ? (
                              generateDateRange(batchDetails[batch.id].startDate, batchDetails[batch.id].endDate).map(
                                (date, index) => (
                                  <th key={index} className="p-3 text-left text-sm font-semibold text-gray-700">
                                    {date}
                                  </th>
                                )
                              )
                            ) : (
                              <th className="p-3 text-left text-sm font-semibold text-gray-700">
                                No dates available
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            const { students, dates, attendanceMap } = getAttendanceTableData(batch.id);
                            if (!batchDetails[batch.id]) {
                              return (
                                <tr>
                                  <td colSpan="2" className="p-3 text-gray-600">
                                    Batch details not found.
                                  </td>
                                </tr>
                              );
                            }
                            return students.length > 0 ? (
                              students.map((student, index) => (
                                <tr key={index} className="border-b hover:bg-gray-50">
                                  <td className="p-3 text-gray-600">{student || 'Unknown Student'}</td>
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
                            );
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600">No batches available for the selected filters.</p>
          )}
        </div>
      </div>
    </div>
  );
}