import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

export default function Attendance() {
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

  const fetchCenters = async () => {
    try {
      const centersCollection = collection(db, 'instituteSetup');
      const centersSnapshot = await getDocs(centersCollection);
      const centersData = await Promise.all(
        centersSnapshot.docs.map(async (doc) => {
          const branchesCollection = collection(db, 'instituteSetup', doc.id, 'Center');
          const branchesSnapshot = await getDocs(branchesCollection);
          return branchesSnapshot.docs.map(branchDoc => ({
            id: branchDoc.id,
            ...branchDoc.data(),
          }));
        })
      );
      const allCenters = centersData.flat();
      setCenters(allCenters);
    } catch (error) {
      console.error('Error fetching centers:', error);
      alert('Error fetching centers. Check console for details.');
    }
  };

  const fetchBatchesAndStudents = async (centerId) => {
    try {
      // Fetch batches based on status filter
      let batchesQuery;
      if (batchStatusFilter === 'All') {
        batchesQuery = collection(db, 'Batch'); // All batches
      } else {
        batchesQuery = query(collection(db, 'Batch'), where("status", "==", batchStatusFilter)); // Active or Inactive
      }
      const batchesSnapshot = await getDocs(batchesQuery);
      let batchData = batchesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Filter by center if selected
      if (centerId) {
        batchData = batchData.filter(batch => 
          batch.centers && Array.isArray(batch.centers) && batch.centers.includes(centerId)
        );
      }

      // Filter by start date if provided
      if (startDateFilter) {
        const start = new Date(startDateFilter);
        batchData = batchData.filter(batch => {
          const batchStart = new Date(batch.startDate);
          return batchStart >= start;
        });
      }

      const batchMap = {};
      batchData.forEach(batch => {
        batchMap[batch.batchName] = {
          startDate: new Date(batch.startDate),
          endDate: new Date(batch.endDate),
          centers: batch.centers || [],
          status: batch.status || 'Active', // Include status for display
        };
      });
      setBatchDetails(batchMap);
      setBatches(Object.keys(batchMap));

      const studentsCollection = collection(db, 'student');
      const studentsSnapshot = await getDocs(studentsCollection);
      const allStudents = studentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const studentsByBatchMap = {};
      allStudents.forEach(student => {
        if (student.course_details && Array.isArray(student.course_details)) {
          student.course_details.forEach(course => {
            const batchName = course.batch;
            if (batchMap[batchName]) {
              if (!studentsByBatchMap[batchName]) {
                studentsByBatchMap[batchName] = [];
              }
              studentsByBatchMap[batchName].push(student);
            }
          });
        }
      });

      setStudentsByBatch(studentsByBatchMap);
      console.log('Filtered Batches:', Object.keys(batchMap));
      console.log('Students by batch:', studentsByBatchMap);
    } catch (error) {
      console.error('Error fetching batches and students:', error);
      alert('Error fetching data. Check console for details.');
    }
  };

  const generateDateRange = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate).toLocaleDateString('en-US'));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const generateTemplate = (batchName) => {
    const students = studentsByBatch[batchName] || [];
    if (students.length === 0) {
      alert('No students found for this batch.');
      return;
    }

    const batch = batchDetails[batchName];
    if (!batch || !batch.startDate || !batch.endDate) {
      alert('Batch details (startDate or endDate) not found.');
      return;
    }

    const dateHeaders = generateDateRange(batch.startDate, batch.endDate);
    const headers = ['Student Name', ...dateHeaders];
    const data = students.map(student => [
      `${student.first_name} ${student.last_name}`,
      ...dateHeaders.map(() => ''),
    ]);

    const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
    XLSX.writeFile(wb, `Attendance_${batchName}.xlsx`);
  };

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
    if (uploadedFile) {
      processFile(uploadedFile);
    }
  };

  const processFile = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary', dateNF: 'dd/mm/yyyy' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (!rawData || rawData.length < 2) {
        alert("Invalid file format. Ensure the first row contains headers.");
        return;
      }

      const headers = rawData[0].map(header => header.toString().trim());
      const studentNameIndex = headers.findIndex(h => h.toLowerCase().includes("name"));
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
          return {
            batch_id: expandedBatch || "Unknown Batch",
            date: new Date(date).toISOString(),
            student_name: studentName,
            status: status || "N/A",
            centerId: selectedCenter,
          };
        });
      }).filter(record => record.student_name !== "Unknown");

      setAttendanceData(prevData => [...prevData, ...formattedData]);
    };
    reader.readAsBinaryString(file);
  };

  const uploadToFirestore = async () => {
    if (!attendanceData.length) {
      alert('Please select a file first');
      return;
    }

    try {
      const attendanceCollection = collection(db, 'attendance');
      const validRecords = attendanceData.filter(record => 
        record.student_name && record.student_name !== "Unknown" && record.status !== "N/A"
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

      alert('Attendance data uploaded successfully!');
      setFile(null);
      fetchAttendanceData();
    } catch (error) {
      console.error('Error uploading attendance data:', error);
      alert('Error uploading data. Check console for details.');
    }
  };

  const fetchAttendanceData = async () => {
    const attendanceCollection = collection(db, 'attendance');
    const snapshot = await getDocs(attendanceCollection);
    const fetchedData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(),
    }));
    setAttendanceData(fetchedData);
  };

  useEffect(() => {
    fetchCenters();
    fetchBatchesAndStudents(); // Fetch active batches by default
  }, [batchStatusFilter, startDateFilter]); // Re-fetch when status or start date changes

  const handleCenterChange = (e) => {
    const centerId = e.target.value;
    setSelectedCenter(centerId);
    fetchBatchesAndStudents(centerId);
  };

  const toggleBatch = (batchName) => {
    setExpandedBatch(prev => (prev === batchName ? null : batchName));
    setFile(null);
  };

  const getAttendanceTableData = (batchName) => {
    const batchAttendance = attendanceData.filter(record => 
      record.batch_id === batchName && (!selectedCenter || record.centerId === selectedCenter)
    );
    if (!batchAttendance.length) {
      return { students: [], dates: [], attendanceMap: {} };
    }

    const batch = batchDetails[batchName];
    if (!batch) return { students: [], dates: [] };

    const dates = generateDateRange(batch.startDate, batch.endDate);
    const students = [...new Set(batchAttendance.map(record => record.student_name))];
    const attendanceMap = {};

    batchAttendance.forEach(record => {
      const dateStr = new Date(record.date).toLocaleDateString('en-US');
      attendanceMap[`${record.student_name}-${dateStr}`] = record.status;
    });

    return { students, dates, attendanceMap };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Attendance Management</h2>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Center Selector */}
          <div>
            <label htmlFor="centerSelect" className="block text-sm font-medium text-gray-700">Select Center</label>
            <select
              id="centerSelect"
              value={selectedCenter}
              onChange={handleCenterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              <option value="">All Centers</option>
              {centers.map(center => (
                <option key={center.id} value={center.id}>{center.name}</option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700">Batch Status</label>
            <select
              id="statusFilter"
              value={batchStatusFilter}
              onChange={(e) => setBatchStatusFilter(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="All">All</option>
            </select>
          </div>

          {/* Start Date Filter */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date From</label>
            <input
              type="date"
              id="startDate"
              value={startDateFilter}
              onChange={(e) => setStartDateFilter(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
        </div>
      </div>

      {/* Batch List */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {batchStatusFilter === 'All' ? 'All Batches' : `${batchStatusFilter} Batches`}
        </h3>
        <div className="space-y-4">
          {batches.length > 0 ? (
            batches.map(batchName => (
              <div key={batchName} className="border rounded-md">
                <button
                  onClick={() => toggleBatch(batchName)}
                  className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 flex justify-between items-center rounded-t-md transition duration-200"
                >
                  <span className="font-medium text-gray-700">{batchName}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm ${batchDetails[batchName]?.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                      {batchDetails[batchName]?.status}
                    </span>
                    <span>{expandedBatch === batchName ? '▼' : '▶'}</span>
                  </div>
                </button>
                {expandedBatch === batchName && (
                  <div className="p-4 bg-gray-50 rounded-b-md">
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                      <button
                        onClick={() => generateTemplate(batchName)}
                        className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-200"
                      >
                        Download Template
                      </button>
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
                    </div>
                    <h4 className="font-semibold text-gray-700 mb-2">Attendance for {batchName}</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead className="bg-gray-200">
                          <tr>
                            <th className="p-3 text-left text-sm font-semibold text-gray-700">Student Name</th>
                            {batchDetails[batchName] ? (
                              generateDateRange(batchDetails[batchName].startDate, batchDetails[batchName].endDate).map((date, index) => (
                                <th key={index} className="p-3 text-left text-sm font-semibold text-gray-700">{date}</th>
                              ))
                            ) : (
                              <th className="p-3 text-left text-sm font-semibold text-gray-700">No dates available</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            const { students, dates, attendanceMap } = getAttendanceTableData(batchName);
                            if (!batchDetails[batchName]) {
                              return (
                                <tr>
                                  <td colSpan="2" className="p-3 text-gray-600">Batch details not found.</td>
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
                                  No attendance data available for this batch.
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