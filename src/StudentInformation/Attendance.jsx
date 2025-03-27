

import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore'; // Added 'query' and 'where'

export default function Attendance() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [file, setFile] = useState(null);
  const [batches, setBatches] = useState([]);
  const [expandedBatch, setExpandedBatch] = useState(null);
  const [studentsByBatch, setStudentsByBatch] = useState({});
  const [batchDetails, setBatchDetails] = useState({});
  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState('');

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
            ...branchDoc.data()
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
      // Fetch only active batches
      const batchesQuery = query(collection(db, 'Batch'), where("status", "==", "Active"));
      const batchesSnapshot = await getDocs(batchesQuery);
      let batchData = batchesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Filter batches by selected center if centerId is provided
      if (centerId) {
        batchData = batchData.filter(batch => 
          batch.centers && Array.isArray(batch.centers) && batch.centers.includes(centerId)
        );
      }

      const batchMap = {};
      batchData.forEach(batch => {
        batchMap[batch.batchName] = {
          startDate: new Date(batch.startDate),
          endDate: new Date(batch.endDate),
          centers: batch.centers || [] // Store centers array for reference
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
            if (batchMap[batchName]) { // Only include students from filtered batches
              if (!studentsByBatchMap[batchName]) {
                studentsByBatchMap[batchName] = [];
              }
              studentsByBatchMap[batchName].push(student);
            }
          });
        }
      });

      setStudentsByBatch(studentsByBatchMap);
      console.log('Filtered Active Batches:', Object.keys(batchMap));
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
      console.log("Excel Headers:", headers);

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
            centerId: selectedCenter
          };
        });
      }).filter(record => record.student_name !== "Unknown");

      console.log("Processed attendance data:", formattedData);
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
            centerId: record.centerId
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
    console.log('Fetched attendance data:', fetchedData);
  };

  useEffect(() => {
    fetchCenters();
    fetchBatchesAndStudents(); // Initially fetch active batches
  }, []);

  const handleCenterChange = (e) => {
    const centerId = e.target.value;
    setSelectedCenter(centerId);
    fetchBatchesAndStudents(centerId); // Fetch active batches filtered by selected center
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
      console.log(`No attendance data found for batch: ${batchName}`);
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

    console.log('Attendance table data:', { batchName, students, dates, attendanceMap });
    return { students, dates, attendanceMap };
  };

  return (
    <div className="p-20">
      <h2 className="text-xl font-bold mb-4">Attendance Management</h2>
      <div className="mb-4">
        <label htmlFor="centerSelect" className="block text-sm font-medium text-gray-700">Select Center</label>
        <select
          id="centerSelect"
          value={selectedCenter}
          onChange={handleCenterChange}
          className="mt-1 block w-1/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">All Centers</option>
          {centers.map(center => (
            <option key={center.id} value={center.id}>{center.name}</option>
          ))}
        </select>
      </div>
      <h3 className="text-lg font-semibold mb-2">Active Batch List</h3> {/* Updated label */}
      <div className="space-y-2 batch-container">
        {batches.length > 0 ? (
          batches.map(batchName => (
            <div key={batchName} className="border rounded-md">
              <button
                onClick={() => toggleBatch(batchName)}
                className="w-full text-left p-2 bg-blue-100 hover:bg-blue-200 flex justify-between items-center"
              >
                <span>{batchName}</span>
                <span>{expandedBatch === batchName ? '▼' : '▶'}</span>
              </button>
              {expandedBatch === batchName && (
                <div className="p-4 bg-white">
                  <button
                    onClick={() => generateTemplate(batchName)}
                    className="mb-4 btn btn-secondary bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-200"
                  >
                    Download Attendance Template
                  </button>
                  <div className="mt-4 mb-4">
                    <input
                      type="file"
                      accept=".xlsx, .xls"
                      onChange={handleFileChange}
                      className="mb-2"
                    />
                    <button
                      onClick={uploadToFirestore}
                      className="ml-2 btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                    >
                      Upload to Database
                    </button>
                  </div>
                  <h3 className="font-semibold mb-2">Attendance Data for {batchName}</h3>
                  <table className="table-data table w-full">
                    <thead className="table-secondary">
                      <tr>
                        <th>Student Name</th>
                        {batchDetails[batchName] ? (
                          generateDateRange(batchDetails[batchName].startDate, batchDetails[batchName].endDate).map((date, index) => (
                            <th key={index}>{date}</th>
                          ))
                        ) : (
                          <th>No dates available</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const { students, dates, attendanceMap } = getAttendanceTableData(batchName);
                        console.log('Rendering table with:', { students, dates, attendanceMap });
                        if (!batchDetails[batchName]) {
                          return (
                            <tr>
                              <td colSpan="2">Batch details not found.</td>
                            </tr>
                          );
                        }
                        return students.length > 0 ? (
                          students.map((student, index) => (
                            <tr key={index}>
                              <td>{student || 'Unknown Student'}</td>
                              {dates.map((date, dateIndex) => (
                                <td key={dateIndex}>
                                  {attendanceMap[`${student}-${date}`] || '-'}
                                </td>
                              ))}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={dates.length + 1}>No attendance data available for this batch.</td>
                          </tr>
                        );
                      })()}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No active batches available for the selected center.</p>
        )}
      </div>
    </div>
  );
}