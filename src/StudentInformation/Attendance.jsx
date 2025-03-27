// // // // // // // // // // // // // // import React, { useState, useEffect } from 'react';
// // // // // // // // // // // // // // import * as XLSX from 'xlsx';
// // // // // // // // // // // // // // import { db } from '../config/firebase';
// // // // // // // // // // // // // // import { collection, addDoc, getDocs } from 'firebase/firestore';

// // // // // // // // // // // // // // export default function Attendance() {
// // // // // // // // // // // // // //     const [attendanceData, setAttendanceData] = useState([]);
// // // // // // // // // // // // // //     const [file, setFile] = useState(null);

// // // // // // // // // // // // // //     const generateTemplate = () => {
// // // // // // // // // // // // // //         const headers = [['Batch', 'Date', 'Student', 'Status', 'Subject']];
// // // // // // // // // // // // // //         const ws = XLSX.utils.aoa_to_sheet(headers);
// // // // // // // // // // // // // //         const wb = XLSX.utils.book_new();
// // // // // // // // // // // // // //         XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
// // // // // // // // // // // // // //         XLSX.writeFile(wb, 'AttendanceTemplate.xlsx');
// // // // // // // // // // // // // //     };

// // // // // // // // // // // // // //     const handleFileChange = (event) => {
// // // // // // // // // // // // // //         const uploadedFile = event.target.files[0];
// // // // // // // // // // // // // //         setFile(uploadedFile);
// // // // // // // // // // // // // //         if (uploadedFile) {
// // // // // // // // // // // // // //             processFile(uploadedFile);
// // // // // // // // // // // // // //         }
// // // // // // // // // // // // // //     };

// // // // // // // // // // // // // //     const processFile = (file) => {
// // // // // // // // // // // // // //         const reader = new FileReader();

// // // // // // // // // // // // // //         reader.onload = (event) => {
// // // // // // // // // // // // // //             const binaryStr = event.target.result;
// // // // // // // // // // // // // //             const workbook = XLSX.read(binaryStr, { type: 'binary', dateNF: 'mm/dd/yyyy' });
// // // // // // // // // // // // // //             const sheetName = workbook.SheetNames[0];
// // // // // // // // // // // // // //             const worksheet = workbook.Sheets[sheetName];
// // // // // // // // // // // // // //             const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
// // // // // // // // // // // // // //                 header: ['batch_id', 'date', 'student_id', 'status', 'subject_id'], 
// // // // // // // // // // // // // //                 range: 1,
// // // // // // // // // // // // // //                 raw: false, // Use formatted values instead of raw numbers
// // // // // // // // // // // // // //                 dateNF: 'mm/dd/yyyy' // Specify date format
// // // // // // // // // // // // // //             });

// // // // // // // // // // // // // //             const formattedData = jsonData.map(row => {
// // // // // // // // // // // // // //                 let parsedDate;
// // // // // // // // // // // // // //                 if (typeof row.date === 'number') {
// // // // // // // // // // // // // //                     // Convert Excel serial number to JavaScript Date
// // // // // // // // // // // // // //                     parsedDate = new Date((row.date - 25569) * 86400 * 1000);
// // // // // // // // // // // // // //                 } else if (row.date) {
// // // // // // // // // // // // // //                     // Try parsing string date
// // // // // // // // // // // // // //                     parsedDate = new Date(row.date);
// // // // // // // // // // // // // //                 } else {
// // // // // // // // // // // // // //                     // Fallback to current date if invalid
// // // // // // // // // // // // // //                     parsedDate = new Date();
// // // // // // // // // // // // // //                 }

// // // // // // // // // // // // // //                 return {
// // // // // // // // // // // // // //                     batch_id: row.batch_id?.trim() || '',
// // // // // // // // // // // // // //                     date: parsedDate,
// // // // // // // // // // // // // //                     status: row.status?.trim() || '',
// // // // // // // // // // // // // //                     student_id: row.student_id?.trim() || '',
// // // // // // // // // // // // // //                     subject_id: row.subject_id?.trim() || ''
// // // // // // // // // // // // // //                 };
// // // // // // // // // // // // // //             });

// // // // // // // // // // // // // //             setAttendanceData(formattedData);
// // // // // // // // // // // // // //         };

// // // // // // // // // // // // // //         reader.readAsBinaryString(file);
// // // // // // // // // // // // // //     };

// // // // // // // // // // // // // //     const uploadToFirestore = async () => {
// // // // // // // // // // // // // //         if (!attendanceData.length) {
// // // // // // // // // // // // // //             alert('Please select a file first');
// // // // // // // // // // // // // //             return;
// // // // // // // // // // // // // //         }

// // // // // // // // // // // // // //         try {
// // // // // // // // // // // // // //             const attendanceCollection = collection(db, 'attendance');
// // // // // // // // // // // // // //             await Promise.all(attendanceData.map(async (record) => {
// // // // // // // // // // // // // //                 await addDoc(attendanceCollection, {
// // // // // // // // // // // // // //                     batch_id: record.batch_id,
// // // // // // // // // // // // // //                     date: record.date, // Store as JavaScript Date object
// // // // // // // // // // // // // //                     status: record.status,
// // // // // // // // // // // // // //                     student_id: record.student_id,
// // // // // // // // // // // // // //                     subject_id: record.subject_id
// // // // // // // // // // // // // //                 });
// // // // // // // // // // // // // //             }));
// // // // // // // // // // // // // //             alert('Attendance data uploaded successfully!');
// // // // // // // // // // // // // //         } catch (error) {
// // // // // // // // // // // // // //             console.error('Error uploading attendance data: ', error);
// // // // // // // // // // // // // //             alert('Error uploading data. Check console for details.');
// // // // // // // // // // // // // //         }
// // // // // // // // // // // // // //     };

// // // // // // // // // // // // // //     const fetchAttendanceData = async () => {
// // // // // // // // // // // // // //         const attendanceCollection = collection(db, 'attendance');
// // // // // // // // // // // // // //         const snapshot = await getDocs(attendanceCollection);
// // // // // // // // // // // // // //         const fetchedData = snapshot.docs.map(doc => ({
// // // // // // // // // // // // // //             id: doc.id,
// // // // // // // // // // // // // //             ...doc.data(),
// // // // // // // // // // // // // //             date: doc.data().date.toDate() // Convert Firestore timestamp to JS Date
// // // // // // // // // // // // // //         }));
// // // // // // // // // // // // // //         setAttendanceData(fetchedData);
// // // // // // // // // // // // // //     };

// // // // // // // // // // // // // //     useEffect(() => {
// // // // // // // // // // // // // //         fetchAttendanceData();
// // // // // // // // // // // // // //     }, []);

// // // // // // // // // // // // // //     return (
// // // // // // // // // // // // // //         <div className="attendance-component flex-col w-screen ml-80 p-4">
// // // // // // // // // // // // // //             <button 
// // // // // // // // // // // // // //                 onClick={generateTemplate}
// // // // // // // // // // // // // //                 className="mb-4 btn btn-secondary bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-200"
// // // // // // // // // // // // // //             >
// // // // // // // // // // // // // //                 Download Attendance Template
// // // // // // // // // // // // // //             </button>

// // // // // // // // // // // // // //             <div className="mt-4">
// // // // // // // // // // // // // //                 <input 
// // // // // // // // // // // // // //                     type="file" 
// // // // // // // // // // // // // //                     accept=".xlsx, .xls" 
// // // // // // // // // // // // // //                     onChange={handleFileChange}
// // // // // // // // // // // // // //                     className="mb-2"
// // // // // // // // // // // // // //                 />
// // // // // // // // // // // // // //                 <button 
// // // // // // // // // // // // // //                     onClick={uploadToFirestore}
// // // // // // // // // // // // // //                     className="ml-2 btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
// // // // // // // // // // // // // //                 >
// // // // // // // // // // // // // //                     Upload to Database
// // // // // // // // // // // // // //                 </button>
// // // // // // // // // // // // // //             </div>

// // // // // // // // // // // // // //             <h2 className="mt-4">Attendance Data</h2>
// // // // // // // // // // // // // //             <table className="table-data table">
// // // // // // // // // // // // // //                 <thead className="table-secondary">
// // // // // // // // // // // // // //                     <tr>
// // // // // // // // // // // // // //                         <th>Batch</th>
// // // // // // // // // // // // // //                         <th>Date</th>
// // // // // // // // // // // // // //                         <th>Status</th>
// // // // // // // // // // // // // //                         <th>Student</th>
// // // // // // // // // // // // // //                         <th>Subject</th>
// // // // // // // // // // // // // //                     </tr>
// // // // // // // // // // // // // //                 </thead>
// // // // // // // // // // // // // //                 <tbody>
// // // // // // // // // // // // // //                     {attendanceData.length > 0 ? (
// // // // // // // // // // // // // //                         attendanceData.map((record, index) => (
// // // // // // // // // // // // // //                             <tr key={index}>
// // // // // // // // // // // // // //                                 <td>{record.batch_id}</td>
// // // // // // // // // // // // // //                                 <td>{new Date(record.date).toLocaleDateString()}</td>
// // // // // // // // // // // // // //                                 <td>{record.status}</td>
// // // // // // // // // // // // // //                                 <td>{record.student_id}</td>
// // // // // // // // // // // // // //                                 <td>{record.subject_id}</td>
// // // // // // // // // // // // // //                             </tr>
// // // // // // // // // // // // // //                         ))
// // // // // // // // // // // // // //                     ) : (
// // // // // // // // // // // // // //                         <tr>
// // // // // // // // // // // // // //                             <td colSpan="5">No data available. Upload an Excel file to see records.</td>
// // // // // // // // // // // // // //                         </tr>
// // // // // // // // // // // // // //                     )}
// // // // // // // // // // // // // //                 </tbody>
// // // // // // // // // // // // // //             </table>
// // // // // // // // // // // // // //         </div>
// // // // // // // // // // // // // //     );
// // // // // // // // // // // // // // };


// // // // // // // // // // // // // import React, { useState, useEffect } from 'react';
// // // // // // // // // // // // // import * as XLSX from 'xlsx';
// // // // // // // // // // // // // import { db } from '../config/firebase';
// // // // // // // // // // // // // import { collection, addDoc, getDocs } from 'firebase/firestore';

// // // // // // // // // // // // // export default function Attendance() {
// // // // // // // // // // // // //     const [attendanceData, setAttendanceData] = useState([]);
// // // // // // // // // // // // //     const [file, setFile] = useState(null);
// // // // // // // // // // // // //     const [batch, setBatch] = useState('');
// // // // // // // // // // // // //     const [date, setDate] = useState('');

// // // // // // // // // // // // //     const generateTemplate = () => {
// // // // // // // // // // // // //         if (!batch || !date) {
// // // // // // // // // // // // //             alert('Please enter both batch and date');
// // // // // // // // // // // // //             return;
// // // // // // // // // // // // //         }

// // // // // // // // // // // // //         const headers = [['Student Name', 'Status']];
// // // // // // // // // // // // //         const ws = XLSX.utils.aoa_to_sheet(headers);
// // // // // // // // // // // // //         const wb = XLSX.utils.book_new();
// // // // // // // // // // // // //         XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
// // // // // // // // // // // // //         XLSX.writeFile(wb, `Attendance_${batch}_${date}.xlsx`);
// // // // // // // // // // // // //     };

// // // // // // // // // // // // //     const handleFileChange = (event) => {
// // // // // // // // // // // // //         const uploadedFile = event.target.files[0];
// // // // // // // // // // // // //         setFile(uploadedFile);
// // // // // // // // // // // // //         if (uploadedFile) {
// // // // // // // // // // // // //             processFile(uploadedFile);
// // // // // // // // // // // // //         }
// // // // // // // // // // // // //     };

// // // // // // // // // // // // //     const processFile = (file) => {
// // // // // // // // // // // // //         const reader = new FileReader();

// // // // // // // // // // // // //         reader.onload = (event) => {
// // // // // // // // // // // // //             const binaryStr = event.target.result;
// // // // // // // // // // // // //             const workbook = XLSX.read(binaryStr, { type: 'binary' });
// // // // // // // // // // // // //             const sheetName = workbook.SheetNames[0];
// // // // // // // // // // // // //             const worksheet = workbook.Sheets[sheetName];
// // // // // // // // // // // // //             const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
// // // // // // // // // // // // //                 header: ['student_name', 'status'], 
// // // // // // // // // // // // //                 range: 1,
// // // // // // // // // // // // //                 raw: false
// // // // // // // // // // // // //             });

// // // // // // // // // // // // //             const formattedData = jsonData.map(row => ({
// // // // // // // // // // // // //                 batch_id: batch,
// // // // // // // // // // // // //                 date: new Date(date),
// // // // // // // // // // // // //                 student_name: row.student_name?.trim() || '',
// // // // // // // // // // // // //                 status: row.status?.trim() || ''
// // // // // // // // // // // // //             }));

// // // // // // // // // // // // //             setAttendanceData(formattedData);
// // // // // // // // // // // // //         };

// // // // // // // // // // // // //         reader.readAsBinaryString(file);
// // // // // // // // // // // // //     };

// // // // // // // // // // // // //     const uploadToFirestore = async () => {
// // // // // // // // // // // // //         if (!attendanceData.length) {
// // // // // // // // // // // // //             alert('Please select a file first');
// // // // // // // // // // // // //             return;
// // // // // // // // // // // // //         }

// // // // // // // // // // // // //         try {
// // // // // // // // // // // // //             const attendanceCollection = collection(db, 'attendance');
// // // // // // // // // // // // //             await Promise.all(attendanceData.map(async (record) => {
// // // // // // // // // // // // //                 await addDoc(attendanceCollection, {
// // // // // // // // // // // // //                     batch_id: record.batch_id,
// // // // // // // // // // // // //                     date: record.date,
// // // // // // // // // // // // //                     student_name: record.student_name,
// // // // // // // // // // // // //                     status: record.status
// // // // // // // // // // // // //                 });
// // // // // // // // // // // // //             }));
// // // // // // // // // // // // //             alert('Attendance data uploaded successfully!');
// // // // // // // // // // // // //             setBatch('');
// // // // // // // // // // // // //             setDate('');
// // // // // // // // // // // // //             setFile(null);
// // // // // // // // // // // // //             fetchAttendanceData(); // Refresh the displayed data
// // // // // // // // // // // // //         } catch (error) {
// // // // // // // // // // // // //             console.error('Error uploading attendance data: ', error);
// // // // // // // // // // // // //             alert('Error uploading data. Check console for details.');
// // // // // // // // // // // // //         }
// // // // // // // // // // // // //     };

// // // // // // // // // // // // //     const fetchAttendanceData = async () => {
// // // // // // // // // // // // //         const attendanceCollection = collection(db, 'attendance');
// // // // // // // // // // // // //         const snapshot = await getDocs(attendanceCollection);
// // // // // // // // // // // // //         const fetchedData = snapshot.docs.map(doc => ({
// // // // // // // // // // // // //             id: doc.id,
// // // // // // // // // // // // //             ...doc.data(),
// // // // // // // // // // // // //             date: doc.data().date.toDate()
// // // // // // // // // // // // //         }));
// // // // // // // // // // // // //         setAttendanceData(fetchedData);
// // // // // // // // // // // // //     };

// // // // // // // // // // // // //     useEffect(() => {
// // // // // // // // // // // // //         fetchAttendanceData();
// // // // // // // // // // // // //     }, []);

// // // // // // // // // // // // //     return (
// // // // // // // // // // // // //         <div className="attendance-component flex-col w-screen ml-80 p-4">
// // // // // // // // // // // // //             <div className="flex flex-col gap-4 mb-4">
// // // // // // // // // // // // //                 <div>
// // // // // // // // // // // // //                     <label className="block text-sm font-medium text-gray-700">Batch</label>
// // // // // // // // // // // // //                     <input
// // // // // // // // // // // // //                         type="text"
// // // // // // // // // // // // //                         value={batch}
// // // // // // // // // // // // //                         onChange={(e) => setBatch(e.target.value)}
// // // // // // // // // // // // //                         className="mt-1 block w-1/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
// // // // // // // // // // // // //                         placeholder="Enter batch ID"
// // // // // // // // // // // // //                     />
// // // // // // // // // // // // //                 </div>
// // // // // // // // // // // // //                 <div>
// // // // // // // // // // // // //                     <label className="block text-sm font-medium text-gray-700">Date</label>
// // // // // // // // // // // // //                     <input
// // // // // // // // // // // // //                         type="date"
// // // // // // // // // // // // //                         value={date}
// // // // // // // // // // // // //                         onChange={(e) => setDate(e.target.value)}
// // // // // // // // // // // // //                         className="mt-1 block w-1/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
// // // // // // // // // // // // //                     />
// // // // // // // // // // // // //                 </div>
// // // // // // // // // // // // //             </div>

// // // // // // // // // // // // //             <button 
// // // // // // // // // // // // //                 onClick={generateTemplate}
// // // // // // // // // // // // //                 className="mb-4 btn btn-secondary bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-200"
// // // // // // // // // // // // //             >
// // // // // // // // // // // // //                 Download Attendance Template
// // // // // // // // // // // // //             </button>

// // // // // // // // // // // // //             <div className="mt-4">
// // // // // // // // // // // // //                 <input 
// // // // // // // // // // // // //                     type="file" 
// // // // // // // // // // // // //                     accept=".xlsx, .xls" 
// // // // // // // // // // // // //                     onChange={handleFileChange}
// // // // // // // // // // // // //                     className="mb-2"
// // // // // // // // // // // // //                 />
// // // // // // // // // // // // //                 <button 
// // // // // // // // // // // // //                     onClick={uploadToFirestore}
// // // // // // // // // // // // //                     className="ml-2 btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
// // // // // // // // // // // // //                 >
// // // // // // // // // // // // //                     Upload to Database
// // // // // // // // // // // // //                 </button>
// // // // // // // // // // // // //             </div>

// // // // // // // // // // // // //             <h2 className="mt-4">Attendance Data</h2>
// // // // // // // // // // // // //             <table className="table-data table w-full">
// // // // // // // // // // // // //                 <thead className="table-secondary">
// // // // // // // // // // // // //                     <tr>
// // // // // // // // // // // // //                         <th>Batch</th>
// // // // // // // // // // // // //                         <th>Date</th>
// // // // // // // // // // // // //                         <th>Student Name</th>
// // // // // // // // // // // // //                         <th>Status</th>
// // // // // // // // // // // // //                     </tr>
// // // // // // // // // // // // //                 </thead>
// // // // // // // // // // // // //                 <tbody>
// // // // // // // // // // // // //                     {attendanceData.length > 0 ? (
// // // // // // // // // // // // //                         attendanceData.map((record, index) => (
// // // // // // // // // // // // //                             <tr key={index}>
// // // // // // // // // // // // //                                 <td>{record.batch_id}</td>
// // // // // // // // // // // // //                                 <td>{new Date(record.date).toLocaleDateString()}</td>
// // // // // // // // // // // // //                                 <td>{record.student_name || record.student_id}</td>
// // // // // // // // // // // // //                                 <td>{record.status}</td>
// // // // // // // // // // // // //                             </tr>
// // // // // // // // // // // // //                         ))
// // // // // // // // // // // // //                     ) : (
// // // // // // // // // // // // //                         <tr>
// // // // // // // // // // // // //                             <td colSpan="4">No data available. Upload an Excel file to see records.</td>
// // // // // // // // // // // // //                         </tr>
// // // // // // // // // // // // //                     )}
// // // // // // // // // // // // //                 </tbody>
// // // // // // // // // // // // //             </table>
// // // // // // // // // // // // //         </div>
// // // // // // // // // // // // //     );
// // // // // // // // // // // // // }


// // // // // // // // // // // // import React, { useState, useEffect } from 'react';
// // // // // // // // // // // // import * as XLSX from 'xlsx';
// // // // // // // // // // // // import { db } from '../config/firebase';
// // // // // // // // // // // // import { collection, addDoc, getDocs } from 'firebase/firestore';

// // // // // // // // // // // // export default function Attendance() {
// // // // // // // // // // // //     const [attendanceData, setAttendanceData] = useState([]);
// // // // // // // // // // // //     const [file, setFile] = useState(null);
// // // // // // // // // // // //     const [batch, setBatch] = useState('');

// // // // // // // // // // // //     const generateTemplate = () => {
// // // // // // // // // // // //         if (!batch) {
// // // // // // // // // // // //             alert('Please enter a batch name');
// // // // // // // // // // // //             return;
// // // // // // // // // // // //         }

// // // // // // // // // // // //         // Sample student names (you might want to fetch these from your database)
// // // // // // // // // // // //         const sampleStudents = [
// // // // // // // // // // // //             'John Doe',
// // // // // // // // // // // //             'Jane Smith',
// // // // // // // // // // // //             'Mike Johnson',
// // // // // // // // // // // //             'Sarah Williams'
// // // // // // // // // // // //         ];

// // // // // // // // // // // //         // Create headers with placeholder dates
// // // // // // // // // // // //         const headers = ['Student Name', 'Date 1', 'Date 2', 'Date 3']; // Users can modify these dates
// // // // // // // // // // // //         const data = sampleStudents.map(student => [student, '', '', '']); // Empty status for each date

// // // // // // // // // // // //         const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
// // // // // // // // // // // //         const wb = XLSX.utils.book_new();
// // // // // // // // // // // //         XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
// // // // // // // // // // // //         XLSX.writeFile(wb, `Attendance_${batch}.xlsx`);
// // // // // // // // // // // //     };

// // // // // // // // // // // //     const handleFileChange = (event) => {
// // // // // // // // // // // //         const uploadedFile = event.target.files[0];
// // // // // // // // // // // //         setFile(uploadedFile);
// // // // // // // // // // // //         if (uploadedFile) {
// // // // // // // // // // // //             processFile(uploadedFile);
// // // // // // // // // // // //         }
// // // // // // // // // // // //     };

// // // // // // // // // // // //     const processFile = (file) => {
// // // // // // // // // // // //         const reader = new FileReader();

// // // // // // // // // // // //         reader.onload = (event) => {
// // // // // // // // // // // //             const binaryStr = event.target.result;
// // // // // // // // // // // //             const workbook = XLSX.read(binaryStr, { type: 'binary', dateNF: 'mm/dd/yyyy' });
// // // // // // // // // // // //             const sheetName = workbook.SheetNames[0];
// // // // // // // // // // // //             const worksheet = workbook.Sheets[sheetName];

// // // // // // // // // // // //             // Get headers (dates) from the first row
// // // // // // // // // // // //             const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];
// // // // // // // // // // // //             const dateHeaders = headers.slice(1); // Remove 'Student Name' from headers

// // // // // // // // // // // //             // Convert sheet to JSON starting from row 2
// // // // // // // // // // // //             const jsonData = XLSX.utils.sheet_to_json(worksheet, { range: 1 });

// // // // // // // // // // // //             const formattedData = jsonData.flatMap(row => {
// // // // // // // // // // // //                 const studentName = row['Student Name'];
// // // // // // // // // // // //                 return dateHeaders.map(date => ({
// // // // // // // // // // // //                     batch_id: batch,
// // // // // // // // // // // //                     date: new Date(date), // Convert date string to Date object
// // // // // // // // // // // //                     student_name: studentName?.trim() || '',
// // // // // // // // // // // //                     status: (row[date] || '').toString().trim() || ''
// // // // // // // // // // // //                 }));
// // // // // // // // // // // //             });

// // // // // // // // // // // //             setAttendanceData(formattedData);
// // // // // // // // // // // //         };

// // // // // // // // // // // //         reader.readAsBinaryString(file);
// // // // // // // // // // // //     };

// // // // // // // // // // // //     const uploadToFirestore = async () => {
// // // // // // // // // // // //         if (!attendanceData.length) {
// // // // // // // // // // // //             alert('Please select a file first');
// // // // // // // // // // // //             return;
// // // // // // // // // // // //         }

// // // // // // // // // // // //         try {
// // // // // // // // // // // //             const attendanceCollection = collection(db, 'attendance');
// // // // // // // // // // // //             await Promise.all(attendanceData.map(async (record) => {
// // // // // // // // // // // //                 await addDoc(attendanceCollection, {
// // // // // // // // // // // //                     batch_id: record.batch_id,
// // // // // // // // // // // //                     date: record.date,
// // // // // // // // // // // //                     student_name: record.student_name,
// // // // // // // // // // // //                     status: record.status
// // // // // // // // // // // //                 });
// // // // // // // // // // // //             }));
// // // // // // // // // // // //             alert('Attendance data uploaded successfully!');
// // // // // // // // // // // //             setBatch('');
// // // // // // // // // // // //             setFile(null);
// // // // // // // // // // // //             fetchAttendanceData();
// // // // // // // // // // // //         } catch (error) {
// // // // // // // // // // // //             console.error('Error uploading attendance data: ', error);
// // // // // // // // // // // //             alert('Error uploading data. Check console for details.');
// // // // // // // // // // // //         }
// // // // // // // // // // // //     };

// // // // // // // // // // // //     const fetchAttendanceData = async () => {
// // // // // // // // // // // //         const attendanceCollection = collection(db, 'attendance');
// // // // // // // // // // // //         const snapshot = await getDocs(attendanceCollection);
// // // // // // // // // // // //         const fetchedData = snapshot.docs.map(doc => ({
// // // // // // // // // // // //             id: doc.id,
// // // // // // // // // // // //             ...doc.data(),
// // // // // // // // // // // //             date: doc.data().date.toDate()
// // // // // // // // // // // //         }));
// // // // // // // // // // // //         setAttendanceData(fetchedData);
// // // // // // // // // // // //     };

// // // // // // // // // // // //     useEffect(() => {
// // // // // // // // // // // //         fetchAttendanceData();
// // // // // // // // // // // //     }, []);

// // // // // // // // // // // //     return (
// // // // // // // // // // // //         <div className="attendance-component flex-col w-screen ml-80 p-4">
// // // // // // // // // // // //             <div className="flex flex-col gap-4 mb-4">
// // // // // // // // // // // //                 <div>
// // // // // // // // // // // //                     <label className="block text-sm font-medium text-gray-700">Batch Name</label>
// // // // // // // // // // // //                     <input
// // // // // // // // // // // //                         type="text"
// // // // // // // // // // // //                         value={batch}
// // // // // // // // // // // //                         onChange={(e) => setBatch(e.target.value)}
// // // // // // // // // // // //                         className="mt-1 block w-1/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
// // // // // // // // // // // //                         placeholder="Enter batch name"
// // // // // // // // // // // //                     />
// // // // // // // // // // // //                 </div>
// // // // // // // // // // // //             </div>

// // // // // // // // // // // //             <button 
// // // // // // // // // // // //                 onClick={generateTemplate}
// // // // // // // // // // // //                 className="mb-4 btn btn-secondary bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-200"
// // // // // // // // // // // //             >
// // // // // // // // // // // //                 Download Attendance Template
// // // // // // // // // // // //             </button>

// // // // // // // // // // // //             <div className="mt-4">
// // // // // // // // // // // //                 <input 
// // // // // // // // // // // //                     type="file" 
// // // // // // // // // // // //                     accept=".xlsx, .xls" 
// // // // // // // // // // // //                     onChange={handleFileChange}
// // // // // // // // // // // //                     className="mb-2"
// // // // // // // // // // // //                 />
// // // // // // // // // // // //                 <button 
// // // // // // // // // // // //                     onClick={uploadToFirestore}
// // // // // // // // // // // //                     className="ml-2 btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
// // // // // // // // // // // //                 >
// // // // // // // // // // // //                     Upload to Database
// // // // // // // // // // // //                 </button>
// // // // // // // // // // // //             </div>

// // // // // // // // // // // //             <h2 className="mt-4">Attendance Data</h2>
// // // // // // // // // // // //             <table className="table-data table w-full">
// // // // // // // // // // // //                 <thead className="table-secondary">
// // // // // // // // // // // //                     <tr>
// // // // // // // // // // // //                         <th>Batch</th>
// // // // // // // // // // // //                         <th>Date</th>
// // // // // // // // // // // //                         <th>Student Name</th>
// // // // // // // // // // // //                         <th>Status</th>
// // // // // // // // // // // //                     </tr>
// // // // // // // // // // // //                 </thead>
// // // // // // // // // // // //                 <tbody>
// // // // // // // // // // // //                     {attendanceData.length > 0 ? (
// // // // // // // // // // // //                         attendanceData.map((record, index) => (
// // // // // // // // // // // //                             <tr key={index}>
// // // // // // // // // // // //                                 <td>{record.batch_id}</td>
// // // // // // // // // // // //                                 <td>{new Date(record.date).toLocaleDateString()}</td>
// // // // // // // // // // // //                                 <td>{record.student_name}</td>
// // // // // // // // // // // //                                 <td>{record.status}</td>
// // // // // // // // // // // //                             </tr>
// // // // // // // // // // // //                         ))
// // // // // // // // // // // //                     ) : (
// // // // // // // // // // // //                         <tr>
// // // // // // // // // // // //                             <td colSpan="4">No data available. Upload an Excel file to see records.</td>
// // // // // // // // // // // //                         </tr>
// // // // // // // // // // // //                     )}
// // // // // // // // // // // //                 </tbody>
// // // // // // // // // // // //             </table>
// // // // // // // // // // // //         </div>
// // // // // // // // // // // //     );
// // // // // // // // // // // // }


// // // // // // // // // // // import React, { useState, useEffect } from 'react';
// // // // // // // // // // // import * as XLSX from 'xlsx';
// // // // // // // // // // // import { db } from '../config/firebase';
// // // // // // // // // // // import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

// // // // // // // // // // // export default function Attendance() {
// // // // // // // // // // //     const [attendanceData, setAttendanceData] = useState([]);
// // // // // // // // // // //     const [file, setFile] = useState(null);
// // // // // // // // // // //     const [batch, setBatch] = useState('');
// // // // // // // // // // //     const [students, setStudents] = useState([]);

// // // // // // // // // // //     // Fetch students for a specific batch
// // // // // // // // // // //     const fetchStudentsForBatch = async (batchName) => {
// // // // // // // // // // //         if (!batchName) return;

// // // // // // // // // // //         try {
// // // // // // // // // // //             const studentsCollection = collection(db, 'student');
// // // // // // // // // // //             const q = query(studentsCollection, where('batch', '==', batchName));
// // // // // // // // // // //             const snapshot = await getDocs(q);
// // // // // // // // // // //             const studentList = snapshot.docs.map(doc => ({
// // // // // // // // // // //                 id: doc.id,
// // // // // // // // // // //                 ...doc.data()
// // // // // // // // // // //             }));
// // // // // // // // // // //             setStudents(studentList);
// // // // // // // // // // //         } catch (error) {
// // // // // // // // // // //             console.error('Error fetching students:', error);
// // // // // // // // // // //             alert('Error fetching students for this batch');
// // // // // // // // // // //         }
// // // // // // // // // // //     };

// // // // // // // // // // //     const generateTemplate = () => {
// // // // // // // // // // //         if (!batch) {
// // // // // // // // // // //             alert('Please enter a batch name');
// // // // // // // // // // //             return;
// // // // // // // // // // //         }

// // // // // // // // // // //         if (students.length === 0) {
// // // // // // // // // // //             alert('No students found for this batch. Please ensure students are enrolled.');
// // // // // // // // // // //             return;
// // // // // // // // // // //         }

// // // // // // // // // // //         // Create headers with placeholder dates
// // // // // // // // // // //         const headers = ['Student Name', 'Date 1', 'Date 2', 'Date 3'];
// // // // // // // // // // //         // Use actual student names from the fetched data
// // // // // // // // // // //         const data = students.map(student => [
// // // // // // // // // // //             `${student.first_name} ${student.last_name}`, 
// // // // // // // // // // //             '', '', ''
// // // // // // // // // // //         ]);

// // // // // // // // // // //         const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
// // // // // // // // // // //         const wb = XLSX.utils.book_new();
// // // // // // // // // // //         XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
// // // // // // // // // // //         XLSX.writeFile(wb, `Attendance_${batch}.xlsx`);
// // // // // // // // // // //     };

// // // // // // // // // // //     const handleFileChange = (event) => {
// // // // // // // // // // //         const uploadedFile = event.target.files[0];
// // // // // // // // // // //         setFile(uploadedFile);
// // // // // // // // // // //         if (uploadedFile) {
// // // // // // // // // // //             processFile(uploadedFile);
// // // // // // // // // // //         }
// // // // // // // // // // //     };

// // // // // // // // // // //     const processFile = (file) => {
// // // // // // // // // // //         const reader = new FileReader();

// // // // // // // // // // //         reader.onload = (event) => {
// // // // // // // // // // //             const binaryStr = event.target.result;
// // // // // // // // // // //             const workbook = XLSX.read(binaryStr, { type: 'binary', dateNF: 'mm/dd/yyyy' });
// // // // // // // // // // //             const sheetName = workbook.SheetNames[0];
// // // // // // // // // // //             const worksheet = workbook.Sheets[sheetName];

// // // // // // // // // // //             // Get headers (dates) from the first row
// // // // // // // // // // //             const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];
// // // // // // // // // // //             const dateHeaders = headers.slice(1); // Remove 'Student Name'

// // // // // // // // // // //             // Convert sheet to JSON starting from row 2
// // // // // // // // // // //             const jsonData = XLSX.utils.sheet_to_json(worksheet, { range: 1 });

// // // // // // // // // // //             const formattedData = jsonData.flatMap(row => {
// // // // // // // // // // //                 const studentName = row['Student Name'];
// // // // // // // // // // //                 return dateHeaders.map(date => ({
// // // // // // // // // // //                     batch_id: batch,
// // // // // // // // // // //                     date: new Date(date),
// // // // // // // // // // //                     student_name: studentName?.trim() || '',
// // // // // // // // // // //                     status: (row[date] || '').toString().trim() || ''
// // // // // // // // // // //                 }));
// // // // // // // // // // //             });

// // // // // // // // // // //             setAttendanceData(formattedData);
// // // // // // // // // // //         };

// // // // // // // // // // //         reader.readAsBinaryString(file);
// // // // // // // // // // //     };

// // // // // // // // // // //     const uploadToFirestore = async () => {
// // // // // // // // // // //         if (!attendanceData.length) {
// // // // // // // // // // //             alert('Please select a file first');
// // // // // // // // // // //             return;
// // // // // // // // // // //         }

// // // // // // // // // // //         try {
// // // // // // // // // // //             const attendanceCollection = collection(db, 'attendance');
// // // // // // // // // // //             await Promise.all(attendanceData.map(async (record) => {
// // // // // // // // // // //                 await addDoc(attendanceCollection, {
// // // // // // // // // // //                     batch_id: record.batch_id,
// // // // // // // // // // //                     date: record.date,
// // // // // // // // // // //                     student_name: record.student_name,
// // // // // // // // // // //                     status: record.status
// // // // // // // // // // //                 });
// // // // // // // // // // //             }));
// // // // // // // // // // //             alert('Attendance data uploaded successfully!');
// // // // // // // // // // //             setBatch('');
// // // // // // // // // // //             setFile(null);
// // // // // // // // // // //             setStudents([]);
// // // // // // // // // // //             fetchAttendanceData();
// // // // // // // // // // //         } catch (error) {
// // // // // // // // // // //             console.error('Error uploading attendance data: ', error);
// // // // // // // // // // //             alert('Error uploading data. Check console for details.');
// // // // // // // // // // //         }
// // // // // // // // // // //     };

// // // // // // // // // // //     const fetchAttendanceData = async () => {
// // // // // // // // // // //         const attendanceCollection = collection(db, 'attendance');
// // // // // // // // // // //         const snapshot = await getDocs(attendanceCollection);
// // // // // // // // // // //         const fetchedData = snapshot.docs.map(doc => ({
// // // // // // // // // // //             id: doc.id,
// // // // // // // // // // //             ...doc.data(),
// // // // // // // // // // //             date: doc.data().date.toDate()
// // // // // // // // // // //         }));
// // // // // // // // // // //         setAttendanceData(fetchedData);
// // // // // // // // // // //     };

// // // // // // // // // // //     useEffect(() => {
// // // // // // // // // // //         fetchAttendanceData();
// // // // // // // // // // //     }, []);

// // // // // // // // // // //     // Fetch students when batch name changes
// // // // // // // // // // //     const handleBatchChange = (e) => {
// // // // // // // // // // //         const batchName = e.target.value;
// // // // // // // // // // //         setBatch(batchName);
// // // // // // // // // // //         fetchStudentsForBatch(batchName);
// // // // // // // // // // //     };

// // // // // // // // // // //     return (
// // // // // // // // // // //         <div className="attendance-component flex-col w-screen ml-80 p-4">
// // // // // // // // // // //             <div className="flex flex-col gap-4 mb-4">
// // // // // // // // // // //                 <div>
// // // // // // // // // // //                     <label className="block text-sm font-medium text-gray-700">Batch Name</label>
// // // // // // // // // // //                     <input
// // // // // // // // // // //                         type="text"
// // // // // // // // // // //                         value={batch}
// // // // // // // // // // //                         onChange={handleBatchChange}
// // // // // // // // // // //                         className="mt-1 block w-1/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
// // // // // // // // // // //                         placeholder="Enter batch name"
// // // // // // // // // // //                     />
// // // // // // // // // // //                 </div>
// // // // // // // // // // //             </div>

// // // // // // // // // // //             <button 
// // // // // // // // // // //                 onClick={generateTemplate}
// // // // // // // // // // //                 className="mb-4 btn btn-secondary bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-200"
// // // // // // // // // // //             >
// // // // // // // // // // //                 Download Attendance Template
// // // // // // // // // // //             </button>

// // // // // // // // // // //             <div className="mt-4">
// // // // // // // // // // //                 <input 
// // // // // // // // // // //                     type="file" 
// // // // // // // // // // //                     accept=".xlsx, .xls" 
// // // // // // // // // // //                     onChange={handleFileChange}
// // // // // // // // // // //                     className="mb-2"
// // // // // // // // // // //                 />
// // // // // // // // // // //                 <button 
// // // // // // // // // // //                     onClick={uploadToFirestore}
// // // // // // // // // // //                     className="ml-2 btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
// // // // // // // // // // //                 >
// // // // // // // // // // //                     Upload to Database
// // // // // // // // // // //                 </button>
// // // // // // // // // // //             </div>

// // // // // // // // // // //             <h2 className="mt-4">Attendance Data</h2>
// // // // // // // // // // //             <table className="table-data table w-full">
// // // // // // // // // // //                 <thead className="table-secondary">
// // // // // // // // // // //                     <tr>
// // // // // // // // // // //                         <th>Batch</th>
// // // // // // // // // // //                         <th>Date</th>
// // // // // // // // // // //                         <th>Student Name</th>
// // // // // // // // // // //                         <th>Status</th>
// // // // // // // // // // //                     </tr>
// // // // // // // // // // //                 </thead>
// // // // // // // // // // //                 <tbody>
// // // // // // // // // // //                     {attendanceData.length > 0 ? (
// // // // // // // // // // //                         attendanceData.map((record, index) => (
// // // // // // // // // // //                             <tr key={index}>
// // // // // // // // // // //                                 <td>{record.batch_id}</td>
// // // // // // // // // // //                                 <td>{new Date(record.date).toLocaleDateString()}</td>
// // // // // // // // // // //                                 <td>{record.student_name}</td>
// // // // // // // // // // //                                 <td>{record.status}</td>
// // // // // // // // // // //                             </tr>
// // // // // // // // // // //                         ))
// // // // // // // // // // //                     ) : (
// // // // // // // // // // //                         <tr>
// // // // // // // // // // //                             <td colSpan="4">No data available. Upload an Excel file to see records.</td>
// // // // // // // // // // //                         </tr>
// // // // // // // // // // //                     )}
// // // // // // // // // // //                 </tbody>
// // // // // // // // // // //             </table>
// // // // // // // // // // //         </div>
// // // // // // // // // // //     );
// // // // // // // // // // // }


// // // // // // // // // // import React, { useState, useEffect } from 'react';
// // // // // // // // // // import * as XLSX from 'xlsx';
// // // // // // // // // // import { db } from '../config/firebase';
// // // // // // // // // // import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

// // // // // // // // // // export default function Attendance() {
// // // // // // // // // //     const [attendanceData, setAttendanceData] = useState([]);
// // // // // // // // // //     const [file, setFile] = useState(null);
// // // // // // // // // //     const [batch, setBatch] = useState('');
// // // // // // // // // //     const [students, setStudents] = useState([]);

// // // // // // // // // //     // Fetch students for a specific batch from course_details
// // // // // // // // // //     const fetchStudentsForBatch = async (batchName) => {
// // // // // // // // // //         if (!batchName) {
// // // // // // // // // //             setStudents([]);
// // // // // // // // // //             return;
// // // // // // // // // //         }

// // // // // // // // // //         try {
// // // // // // // // // //             const studentsCollection = collection(db, 'student');
// // // // // // // // // //             // Query students where course_details array contains an object with the specified batch
// // // // // // // // // //             const q = query(studentsCollection, where('course_details', 'array-contains', { batch: batchName }));
// // // // // // // // // //             const snapshot = await getDocs(q);
// // // // // // // // // //             const studentList = snapshot.docs.map(doc => ({
// // // // // // // // // //                 id: doc.id,
// // // // // // // // // //                 ...doc.data()
// // // // // // // // // //             })).filter(student => 
// // // // // // // // // //                 student.course_details.some(course => course.batch === batchName)
// // // // // // // // // //             );
// // // // // // // // // //             setStudents(studentList);
// // // // // // // // // //         } catch (error) {
// // // // // // // // // //             console.error('Error fetching students:', error);
// // // // // // // // // //             alert('Error fetching students for this batch');
// // // // // // // // // //         }
// // // // // // // // // //     };

// // // // // // // // // //     const generateTemplate = () => {
// // // // // // // // // //         if (!batch) {
// // // // // // // // // //             alert('Please enter a batch name');
// // // // // // // // // //             return;
// // // // // // // // // //         }

// // // // // // // // // //         if (students.length === 0) {
// // // // // // // // // //             alert('No students found for this batch. Please ensure students are enrolled.');
// // // // // // // // // //             return;
// // // // // // // // // //         }

// // // // // // // // // //         // Create headers with placeholder dates
// // // // // // // // // //         const headers = ['Student Name', 'Date 1', 'Date 2', 'Date 3'];
// // // // // // // // // //         // Use actual student names from the fetched data
// // // // // // // // // //         const data = students.map(student => [
// // // // // // // // // //             `${student.first_name} ${student.last_name}`, 
// // // // // // // // // //             '', '', ''
// // // // // // // // // //         ]);

// // // // // // // // // //         const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
// // // // // // // // // //         const wb = XLSX.utils.book_new();
// // // // // // // // // //         XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
// // // // // // // // // //         XLSX.writeFile(wb, `Attendance_${batch}.xlsx`);
// // // // // // // // // //     };

// // // // // // // // // //     const handleFileChange = (event) => {
// // // // // // // // // //         const uploadedFile = event.target.files[0];
// // // // // // // // // //         setFile(uploadedFile);
// // // // // // // // // //         if (uploadedFile) {
// // // // // // // // // //             processFile(uploadedFile);
// // // // // // // // // //         }
// // // // // // // // // //     };

// // // // // // // // // //     const processFile = (file) => {
// // // // // // // // // //         const reader = new FileReader();

// // // // // // // // // //         reader.onload = (event) => {
// // // // // // // // // //             const binaryStr = event.target.result;
// // // // // // // // // //             const workbook = XLSX.read(binaryStr, { type: 'binary', dateNF: 'mm/dd/yyyy' });
// // // // // // // // // //             const sheetName = workbook.SheetNames[0];
// // // // // // // // // //             const worksheet = workbook.Sheets[sheetName];

// // // // // // // // // //             // Get headers (dates) from the first row
// // // // // // // // // //             const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];
// // // // // // // // // //             const dateHeaders = headers.slice(1); // Remove 'Student Name'

// // // // // // // // // //             // Convert sheet to JSON starting from row 2
// // // // // // // // // //             const jsonData = XLSX.utils.sheet_to_json(worksheet, { range: 1 });

// // // // // // // // // //             const formattedData = jsonData.flatMap(row => {
// // // // // // // // // //                 const studentName = row['Student Name'];
// // // // // // // // // //                 return dateHeaders.map(date => ({
// // // // // // // // // //                     batch_id: batch,
// // // // // // // // // //                     date: new Date(date),
// // // // // // // // // //                     student_name: studentName?.trim() || '',
// // // // // // // // // //                     status: (row[date] || '').toString().trim() || ''
// // // // // // // // // //                 }));
// // // // // // // // // //             });

// // // // // // // // // //             setAttendanceData(formattedData);
// // // // // // // // // //         };

// // // // // // // // // //         reader.readAsBinaryString(file);
// // // // // // // // // //     };

// // // // // // // // // //     const uploadToFirestore = async () => {
// // // // // // // // // //         if (!attendanceData.length) {
// // // // // // // // // //             alert('Please select a file first');
// // // // // // // // // //             return;
// // // // // // // // // //         }

// // // // // // // // // //         try {
// // // // // // // // // //             const attendanceCollection = collection(db, 'attendance');
// // // // // // // // // //             await Promise.all(attendanceData.map(async (record) => {
// // // // // // // // // //                 await addDoc(attendanceCollection, {
// // // // // // // // // //                     batch_id: record.batch_id,
// // // // // // // // // //                     date: record.date,
// // // // // // // // // //                     student_name: record.student_name,
// // // // // // // // // //                     status: record.status
// // // // // // // // // //                 });
// // // // // // // // // //             }));
// // // // // // // // // //             alert('Attendance data uploaded successfully!');
// // // // // // // // // //             setBatch('');
// // // // // // // // // //             setFile(null);
// // // // // // // // // //             setStudents([]);
// // // // // // // // // //             fetchAttendanceData();
// // // // // // // // // //         } catch (error) {
// // // // // // // // // //             console.error('Error uploading attendance data: ', error);
// // // // // // // // // //             alert('Error uploading data. Check console for details.');
// // // // // // // // // //         }
// // // // // // // // // //     };

// // // // // // // // // //     const fetchAttendanceData = async () => {
// // // // // // // // // //         const attendanceCollection = collection(db, 'attendance');
// // // // // // // // // //         const snapshot = await getDocs(attendanceCollection);
// // // // // // // // // //         const fetchedData = snapshot.docs.map(doc => ({
// // // // // // // // // //             id: doc.id,
// // // // // // // // // //             ...doc.data(),
// // // // // // // // // //             date: doc.data().date.toDate()
// // // // // // // // // //         }));
// // // // // // // // // //         setAttendanceData(fetchedData);
// // // // // // // // // //     };

// // // // // // // // // //     useEffect(() => {
// // // // // // // // // //         fetchAttendanceData();
// // // // // // // // // //     }, []);

// // // // // // // // // //     const handleBatchChange = (e) => {
// // // // // // // // // //         const batchName = e.target.value;
// // // // // // // // // //         setBatch(batchName);
// // // // // // // // // //         fetchStudentsForBatch(batchName);
// // // // // // // // // //     };

// // // // // // // // // //     return (
// // // // // // // // // //         <div className="attendance-component flex-col w-screen ml-80 p-4">
// // // // // // // // // //             <div className="flex flex-col gap-4 mb-4">
// // // // // // // // // //                 <div>
// // // // // // // // // //                     <label className="block text-sm font-medium text-gray-700">Batch Name</label>
// // // // // // // // // //                     <input
// // // // // // // // // //                         type="text"
// // // // // // // // // //                         value={batch}
// // // // // // // // // //                         onChange={handleBatchChange}
// // // // // // // // // //                         className="mt-1 block w-1/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
// // // // // // // // // //                         placeholder="Enter batch name"
// // // // // // // // // //                     />
// // // // // // // // // //                 </div>
// // // // // // // // // //             </div>

// // // // // // // // // //             <button 
// // // // // // // // // //                 onClick={generateTemplate}
// // // // // // // // // //                 className="mb-4 btn btn-secondary bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-200"
// // // // // // // // // //             >
// // // // // // // // // //                 Download Attendance Template
// // // // // // // // // //             </button>

// // // // // // // // // //             <div className="mt-4">
// // // // // // // // // //                 <input 
// // // // // // // // // //                     type="file" 
// // // // // // // // // //                     accept=".xlsx, .xls" 
// // // // // // // // // //                     onChange={handleFileChange}
// // // // // // // // // //                     className="mb-2"
// // // // // // // // // //                 />
// // // // // // // // // //                 <button 
// // // // // // // // // //                     onClick={uploadToFirestore}
// // // // // // // // // //                     className="ml-2 btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
// // // // // // // // // //                 >
// // // // // // // // // //                     Upload to Database
// // // // // // // // // //                 </button>
// // // // // // // // // //             </div>

// // // // // // // // // //             <h2 className="mt-4">Attendance Data</h2>
// // // // // // // // // //             <table className="table-data table w-full">
// // // // // // // // // //                 <thead className="table-secondary">
// // // // // // // // // //                     <tr>
// // // // // // // // // //                         <th>Batch</th>
// // // // // // // // // //                         <th>Date</th>
// // // // // // // // // //                         <th>Student Name</th>
// // // // // // // // // //                         <th>Status</th>
// // // // // // // // // //                     </tr>
// // // // // // // // // //                 </thead>
// // // // // // // // // //                 <tbody>
// // // // // // // // // //                     {attendanceData.length > 0 ? (
// // // // // // // // // //                         attendanceData.map((record, index) => (
// // // // // // // // // //                             <tr key={index}>
// // // // // // // // // //                                 <td>{record.batch_id}</td>
// // // // // // // // // //                                 <td>{new Date(record.date).toLocaleDateString()}</td>
// // // // // // // // // //                                 <td>{record.student_name}</td>
// // // // // // // // // //                                 <td>{record.status}</td>
// // // // // // // // // //                             </tr>
// // // // // // // // // //                         ))
// // // // // // // // // //                     ) : (
// // // // // // // // // //                         <tr>
// // // // // // // // // //                             <td colSpan="4">No data available. Upload an Excel file to see records.</td>
// // // // // // // // // //                         </tr>
// // // // // // // // // //                     )}
// // // // // // // // // //                 </tbody>
// // // // // // // // // //             </table>
// // // // // // // // // //         </div>
// // // // // // // // // //     );
// // // // // // // // // // }

// // // // // // // // // import React, { useState, useEffect } from 'react';
// // // // // // // // // import * as XLSX from 'xlsx';
// // // // // // // // // import { db } from '../config/firebase';
// // // // // // // // // import { collection, addDoc, getDocs } from 'firebase/firestore';

// // // // // // // // // export default function Attendance() {
// // // // // // // // //     const [attendanceData, setAttendanceData] = useState([]);
// // // // // // // // //     const [file, setFile] = useState(null);
// // // // // // // // //     const [batch, setBatch] = useState('');
// // // // // // // // //     const [students, setStudents] = useState([]);

// // // // // // // // //     // Fetch students for a specific batch from course_details
// // // // // // // // //     const fetchStudentsForBatch = async (batchName) => {
// // // // // // // // //         if (!batchName) {
// // // // // // // // //             setStudents([]);
// // // // // // // // //             return;
// // // // // // // // //         }

// // // // // // // // //         try {
// // // // // // // // //             const studentsCollection = collection(db, 'student');
// // // // // // // // //             const snapshot = await getDocs(studentsCollection); // Fetch all students
// // // // // // // // //             const studentList = snapshot.docs
// // // // // // // // //                 .map(doc => ({
// // // // // // // // //                     id: doc.id,
// // // // // // // // //                     ...doc.data()
// // // // // // // // //                 }))
// // // // // // // // //                 .filter(student => 
// // // // // // // // //                     student.course_details && 
// // // // // // // // //                     student.course_details.some(course => course.batch === batchName)
// // // // // // // // //                 );
// // // // // // // // //             setStudents(studentList);
// // // // // // // // //             console.log('Fetched students:', studentList); // Debug log
// // // // // // // // //         } catch (error) {
// // // // // // // // //             console.error('Error fetching students:', error);
// // // // // // // // //             alert('Error fetching students for this batch');
// // // // // // // // //         }
// // // // // // // // //     };

// // // // // // // // //     const generateTemplate = () => {
// // // // // // // // //         if (!batch) {
// // // // // // // // //             alert('Please enter a batch name');
// // // // // // // // //             return;
// // // // // // // // //         }

// // // // // // // // //         if (students.length === 0) {
// // // // // // // // //             alert('No students found for this batch. Please ensure students are enrolled and the batch name is correct.');
// // // // // // // // //             return;
// // // // // // // // //         }

// // // // // // // // //         const headers = ['Student Name', 'Date 1', 'Date 2', 'Date 3'];
// // // // // // // // //         const data = students.map(student => [
// // // // // // // // //             `${student.first_name} ${student.last_name}`, 
// // // // // // // // //             '', '', ''
// // // // // // // // //         ]);

// // // // // // // // //         const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
// // // // // // // // //         const wb = XLSX.utils.book_new();
// // // // // // // // //         XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
// // // // // // // // //         XLSX.writeFile(wb, `Attendance_${batch}.xlsx`);
// // // // // // // // //     };

// // // // // // // // //     const handleFileChange = (event) => {
// // // // // // // // //         const uploadedFile = event.target.files[0];
// // // // // // // // //         setFile(uploadedFile);
// // // // // // // // //         if (uploadedFile) {
// // // // // // // // //             processFile(uploadedFile);
// // // // // // // // //         }
// // // // // // // // //     };

// // // // // // // // //     const processFile = (file) => {
// // // // // // // // //         const reader = new FileReader();

// // // // // // // // //         reader.onload = (event) => {
// // // // // // // // //             const binaryStr = event.target.result;
// // // // // // // // //             const workbook = XLSX.read(binaryStr, { type: 'binary', dateNF: 'mm/dd/yyyy' });
// // // // // // // // //             const sheetName = workbook.SheetNames[0];
// // // // // // // // //             const worksheet = workbook.Sheets[sheetName];

// // // // // // // // //             const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];
// // // // // // // // //             const dateHeaders = headers.slice(1);

// // // // // // // // //             const jsonData = XLSX.utils.sheet_to_json(worksheet, { range: 1 });

// // // // // // // // //             const formattedData = jsonData.flatMap(row => {
// // // // // // // // //                 const studentName = row['Student Name'];
// // // // // // // // //                 return dateHeaders.map(date => ({
// // // // // // // // //                     batch_id: batch,
// // // // // // // // //                     date: new Date(date),
// // // // // // // // //                     student_name: studentName?.trim() || '',
// // // // // // // // //                     status: (row[date] || '').toString().trim() || ''
// // // // // // // // //                 }));
// // // // // // // // //             });

// // // // // // // // //             setAttendanceData(formattedData);
// // // // // // // // //         };

// // // // // // // // //         reader.readAsBinaryString(file);
// // // // // // // // //     };

// // // // // // // // //     const uploadToFirestore = async () => {
// // // // // // // // //         if (!attendanceData.length) {
// // // // // // // // //             alert('Please select a file first');
// // // // // // // // //             return;
// // // // // // // // //         }

// // // // // // // // //         try {
// // // // // // // // //             const attendanceCollection = collection(db, 'attendance');
// // // // // // // // //             await Promise.all(attendanceData.map(async (record) => {
// // // // // // // // //                 await addDoc(attendanceCollection, {
// // // // // // // // //                     batch_id: record.batch_id,
// // // // // // // // //                     date: record.date,
// // // // // // // // //                     student_name: record.student_name,
// // // // // // // // //                     status: record.status
// // // // // // // // //                 });
// // // // // // // // //             }));
// // // // // // // // //             alert('Attendance data uploaded successfully!');
// // // // // // // // //             setBatch('');
// // // // // // // // //             setFile(null);
// // // // // // // // //             setStudents([]);
// // // // // // // // //             fetchAttendanceData();
// // // // // // // // //         } catch (error) {
// // // // // // // // //             console.error('Error uploading attendance data: ', error);
// // // // // // // // //             alert('Error uploading data. Check console for details.');
// // // // // // // // //         }
// // // // // // // // //     };

// // // // // // // // //     const fetchAttendanceData = async () => {
// // // // // // // // //         const attendanceCollection = collection(db, 'attendance');
// // // // // // // // //         const snapshot = await getDocs(attendanceCollection);
// // // // // // // // //         const fetchedData = snapshot.docs.map(doc => ({
// // // // // // // // //             id: doc.id,
// // // // // // // // //             ...doc.data(),
// // // // // // // // //             date: doc.data().date.toDate()
// // // // // // // // //         }));
// // // // // // // // //         setAttendanceData(fetchedData);
// // // // // // // // //     };

// // // // // // // // //     useEffect(() => {
// // // // // // // // //         fetchAttendanceData();
// // // // // // // // //     }, []);

// // // // // // // // //     const handleBatchChange = (e) => {
// // // // // // // // //         const batchName = e.target.value;
// // // // // // // // //         setBatch(batchName);
// // // // // // // // //         fetchStudentsForBatch(batchName);
// // // // // // // // //     };

// // // // // // // // //     return (
// // // // // // // // //         <div className="attendance-component flex-col w-screen ml-80 p-4">
// // // // // // // // //             <div className="flex flex-col gap-4 mb-4">
// // // // // // // // //                 <div>
// // // // // // // // //                     <label className="block text-sm font-medium text-gray-700">Batch Name</label>
// // // // // // // // //                     <input
// // // // // // // // //                         type="text"
// // // // // // // // //                         value={batch}
// // // // // // // // //                         onChange={handleBatchChange}
// // // // // // // // //                         className="mt-1 block w-1/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
// // // // // // // // //                         placeholder="Enter batch name"
// // // // // // // // //                     />
// // // // // // // // //                 </div>
// // // // // // // // //             </div>

// // // // // // // // //             <button 
// // // // // // // // //                 onClick={generateTemplate}
// // // // // // // // //                 className="mb-4 btn btn-secondary bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-200"
// // // // // // // // //             >
// // // // // // // // //                 Download Attendance Template
// // // // // // // // //             </button>

// // // // // // // // //             <div className="mt-4">
// // // // // // // // //                 <input 
// // // // // // // // //                     type="file" 
// // // // // // // // //                     accept=".xlsx, .xls" 
// // // // // // // // //                     onChange={handleFileChange}
// // // // // // // // //                     className="mb-2"
// // // // // // // // //                 />
// // // // // // // // //                 <button 
// // // // // // // // //                     onClick={uploadToFirestore}
// // // // // // // // //                     className="ml-2 btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
// // // // // // // // //                 >
// // // // // // // // //                     Upload to Database
// // // // // // // // //                 </button>
// // // // // // // // //             </div>

// // // // // // // // //             <h2 className="mt-4">Attendance Data</h2>
// // // // // // // // //             <table className="table-data table w-full">
// // // // // // // // //                 <thead className="table-secondary">
// // // // // // // // //                     <tr>
// // // // // // // // //                         <th>Batch</th>
// // // // // // // // //                         <th>Date</th>
// // // // // // // // //                         <th>Student Name</th>
// // // // // // // // //                         <th>Status</th>
// // // // // // // // //                     </tr>
// // // // // // // // //                 </thead>
// // // // // // // // //                 <tbody>
// // // // // // // // //                     {attendanceData.length > 0 ? (
// // // // // // // // //                         attendanceData.map((record, index) => (
// // // // // // // // //                             <tr key={index}>
// // // // // // // // //                                 <td>{record.batch_id}</td>
// // // // // // // // //                                 <td>{new Date(record.date).toLocaleDateString()}</td>
// // // // // // // // //                                 <td>{record.student_name}</td>
// // // // // // // // //                                 <td>{record.status}</td>
// // // // // // // // //                             </tr>
// // // // // // // // //                         ))
// // // // // // // // //                     ) : (
// // // // // // // // //                         <tr>
// // // // // // // // //                             <td colSpan="4">No data available. Upload an Excel file to see records.</td>
// // // // // // // // //                         </tr>
// // // // // // // // //                     )}
// // // // // // // // //                 </tbody>
// // // // // // // // //             </table>
// // // // // // // // //         </div>
// // // // // // // // //     );
// // // // // // // // // }


// // // // // // // // import React, { useState, useEffect } from 'react';
// // // // // // // // import * as XLSX from 'xlsx';
// // // // // // // // import { db } from '../config/firebase';
// // // // // // // // import { collection, addDoc, getDocs } from 'firebase/firestore';

// // // // // // // // export default function Attendance() {
// // // // // // // //     const [attendanceData, setAttendanceData] = useState([]);
// // // // // // // //     const [file, setFile] = useState(null);
// // // // // // // //     const [batches, setBatches] = useState([]);
// // // // // // // //     const [expandedBatch, setExpandedBatch] = useState(null);
// // // // // // // //     const [studentsByBatch, setStudentsByBatch] = useState({});

// // // // // // // //     // Fetch all unique batches and students
// // // // // // // //     const fetchBatchesAndStudents = async () => {
// // // // // // // //         try {
// // // // // // // //             const studentsCollection = collection(db, 'student');
// // // // // // // //             const snapshot = await getDocs(studentsCollection);
// // // // // // // //             const allStudents = snapshot.docs.map(doc => ({
// // // // // // // //                 id: doc.id,
// // // // // // // //                 ...doc.data()
// // // // // // // //             }));

// // // // // // // //             // Extract unique batch names and group students by batch
// // // // // // // //             const batchMap = {};
// // // // // // // //             allStudents.forEach(student => {
// // // // // // // //                 if (student.course_details && Array.isArray(student.course_details)) {
// // // // // // // //                     student.course_details.forEach(course => {
// // // // // // // //                         const batchName = course.batch;
// // // // // // // //                         if (!batchMap[batchName]) {
// // // // // // // //                             batchMap[batchName] = [];
// // // // // // // //                         }
// // // // // // // //                         batchMap[batchName].push(student);
// // // // // // // //                     });
// // // // // // // //                 }
// // // // // // // //             });

// // // // // // // //             setBatches(Object.keys(batchMap));
// // // // // // // //             setStudentsByBatch(batchMap);
// // // // // // // //             console.log('Batches:', Object.keys(batchMap));
// // // // // // // //             console.log('Students by batch:', batchMap);
// // // // // // // //         } catch (error) {
// // // // // // // //             console.error('Error fetching batches and students:', error);
// // // // // // // //             alert('Error fetching data. Check console for details.');
// // // // // // // //         }
// // // // // // // //     };

// // // // // // // //     const generateTemplate = (batchName) => {
// // // // // // // //         const students = studentsByBatch[batchName] || [];
// // // // // // // //         if (students.length === 0) {
// // // // // // // //             alert('No students found for this batch.');
// // // // // // // //             return;
// // // // // // // //         }

// // // // // // // //         const headers = ['Student Name', 'Date 1', 'Date 2', 'Date 3'];
// // // // // // // //         const data = students.map(student => [
// // // // // // // //             `${student.first_name} ${student.last_name}`,
// // // // // // // //             '', '', ''
// // // // // // // //         ]);

// // // // // // // //         const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
// // // // // // // //         const wb = XLSX.utils.book_new();
// // // // // // // //         XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
// // // // // // // //         XLSX.writeFile(wb, `Attendance_${batchName}.xlsx`);
// // // // // // // //     };

// // // // // // // //     const handleFileChange = (event) => {
// // // // // // // //         const uploadedFile = event.target.files[0];
// // // // // // // //         setFile(uploadedFile);
// // // // // // // //         if (uploadedFile) {
// // // // // // // //             processFile(uploadedFile);
// // // // // // // //         }
// // // // // // // //     };

// // // // // // // //     const processFile = (file) => {
// // // // // // // //         const reader = new FileReader();

// // // // // // // //         reader.onload = (event) => {
// // // // // // // //             const binaryStr = event.target.result;
// // // // // // // //             const workbook = XLSX.read(binaryStr, { type: 'binary', dateNF: 'mm/dd/yyyy' });
// // // // // // // //             const sheetName = workbook.SheetNames[0];
// // // // // // // //             const worksheet = workbook.Sheets[sheetName];

// // // // // // // //             const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];
// // // // // // // //             const dateHeaders = headers.slice(1);

// // // // // // // //             const jsonData = XLSX.utils.sheet_to_json(worksheet, { range: 1 });

// // // // // // // //             const formattedData = jsonData.flatMap(row => {
// // // // // // // //                 const studentName = row['Student Name'];
// // // // // // // //                 return dateHeaders.map(date => ({
// // // // // // // //                     batch_id: expandedBatch, // Use the currently expanded batch
// // // // // // // //                     date: new Date(date),
// // // // // // // //                     student_name: studentName?.trim() || '',
// // // // // // // //                     status: (row[date] || '').toString().trim() || ''
// // // // // // // //                 }));
// // // // // // // //             });

// // // // // // // //             setAttendanceData(formattedData);
// // // // // // // //         };

// // // // // // // //         reader.readAsBinaryString(file);
// // // // // // // //     };

// // // // // // // //     const uploadToFirestore = async () => {
// // // // // // // //         if (!attendanceData.length) {
// // // // // // // //             alert('Please select a file first');
// // // // // // // //             return;
// // // // // // // //         }

// // // // // // // //         try {
// // // // // // // //             const attendanceCollection = collection(db, 'attendance');
// // // // // // // //             await Promise.all(attendanceData.map(async (record) => {
// // // // // // // //                 await addDoc(attendanceCollection, {
// // // // // // // //                     batch_id: record.batch_id,
// // // // // // // //                     date: record.date,
// // // // // // // //                     student_name: record.student_name,
// // // // // // // //                     status: record.status
// // // // // // // //                 });
// // // // // // // //             }));
// // // // // // // //             alert('Attendance data uploaded successfully!');
// // // // // // // //             setFile(null);
// // // // // // // //             setExpandedBatch(null);
// // // // // // // //             fetchAttendanceData();
// // // // // // // //         } catch (error) {
// // // // // // // //             console.error('Error uploading attendance data: ', error);
// // // // // // // //             alert('Error uploading data. Check console for details.');
// // // // // // // //         }
// // // // // // // //     };

// // // // // // // //     const fetchAttendanceData = async () => {
// // // // // // // //         const attendanceCollection = collection(db, 'attendance');
// // // // // // // //         const snapshot = await getDocs(attendanceCollection);
// // // // // // // //         const fetchedData = snapshot.docs.map(doc => ({
// // // // // // // //             id: doc.id,
// // // // // // // //             ...doc.data(),
// // // // // // // //             date: doc.data().date.toDate()
// // // // // // // //         }));
// // // // // // // //         setAttendanceData(fetchedData);
// // // // // // // //     };

// // // // // // // //     useEffect(() => {
// // // // // // // //         fetchBatchesAndStudents();
// // // // // // // //         fetchAttendanceData();
// // // // // // // //     }, []);

// // // // // // // //     const toggleBatch = (batchName) => {
// // // // // // // //         setExpandedBatch(expandedBatch === batchName ? null : batchName);
// // // // // // // //         setFile(null); // Reset file input when switching batches
// // // // // // // //     };

// // // // // // // //     return (
// // // // // // // //         <div className="attendance-component flex-col w-screen ml-80 p-4">
// // // // // // // //             <h2 className="text-xl font-bold mb-4">Batch List</h2>
// // // // // // // //             <div className="space-y-2">
// // // // // // // //                 {batches.map(batchName => (
// // // // // // // //                     <div key={batchName} className="border rounded-md">
// // // // // // // //                         <button
// // // // // // // //                             onClick={() => toggleBatch(batchName)}
// // // // // // // //                             className="w-full text-left p-2 bg-gray-100 hover:bg-gray-200 flex justify-between items-center"
// // // // // // // //                         >
// // // // // // // //                             <span>{batchName}</span>
// // // // // // // //                             <span>{expandedBatch === batchName ? '▼' : '▶'}</span>
// // // // // // // //                         </button>
// // // // // // // //                         {expandedBatch === batchName && (
// // // // // // // //                             <div className="p-4 bg-white">
// // // // // // // //                                 <h3 className="font-semibold">Students in {batchName}</h3>
// // // // // // // //                                 <ul className="list-disc pl-5 mb-4">
// // // // // // // //                                     {studentsByBatch[batchName].map(student => (
// // // // // // // //                                         <li key={student.id}>
// // // // // // // //                                             {student.first_name} {student.last_name}
// // // // // // // //                                         </li>
// // // // // // // //                                     ))}
// // // // // // // //                                 </ul>
// // // // // // // //                                 <button
// // // // // // // //                                     onClick={() => generateTemplate(batchName)}
// // // // // // // //                                     className="mb-4 btn btn-secondary bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-200"
// // // // // // // //                                 >
// // // // // // // //                                     Download Attendance Template
// // // // // // // //                                 </button>
// // // // // // // //                                 <div className="mt-4">
// // // // // // // //                                     <input
// // // // // // // //                                         type="file"
// // // // // // // //                                         accept=".xlsx, .xls"
// // // // // // // //                                         onChange={handleFileChange}
// // // // // // // //                                         className="mb-2"
// // // // // // // //                                     />
// // // // // // // //                                     <button
// // // // // // // //                                         onClick={uploadToFirestore}
// // // // // // // //                                         className="ml-2 btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
// // // // // // // //                                     >
// // // // // // // //                                         Upload to Database
// // // // // // // //                                     </button>
// // // // // // // //                                 </div>
// // // // // // // //                             </div>
// // // // // // // //                         )}
// // // // // // // //                     </div>
// // // // // // // //                 ))}
// // // // // // // //             </div>

// // // // // // // //             <h2 className="mt-8">Attendance Data</h2>
// // // // // // // //             <table className="table-data table w-full">
// // // // // // // //                 <thead className="table-secondary">
// // // // // // // //                     <tr>
// // // // // // // //                         <th>Batch</th>
// // // // // // // //                         <th>Date</th>
// // // // // // // //                         <th>Student Name</th>
// // // // // // // //                         <th>Status</th>
// // // // // // // //                     </tr>
// // // // // // // //                 </thead>
// // // // // // // //                 <tbody>
// // // // // // // //                     {attendanceData.length > 0 ? (
// // // // // // // //                         attendanceData.map((record, index) => (
// // // // // // // //                             <tr key={index}>
// // // // // // // //                                 <td>{record.batch_id}</td>
// // // // // // // //                                 <td>{new Date(record.date).toLocaleDateString()}</td>
// // // // // // // //                                 <td>{record.student_name}</td>
// // // // // // // //                                 <td>{record.status}</td>
// // // // // // // //                             </tr>
// // // // // // // //                         ))
// // // // // // // //                     ) : (
// // // // // // // //                         <tr>
// // // // // // // //                             <td colSpan="4">No data available. Upload an Excel file to see records.</td>
// // // // // // // //                         </tr>
// // // // // // // //                     )}
// // // // // // // //                 </tbody>
// // // // // // // //             </table>
// // // // // // // //         </div>
// // // // // // // //     );
// // // // // // // // }


// // // // // // // import React, { useState, useEffect } from 'react';
// // // // // // // import * as XLSX from 'xlsx';
// // // // // // // import { db } from '../config/firebase';
// // // // // // // import { collection, addDoc, getDocs } from 'firebase/firestore';

// // // // // // // export default function Attendance() {
// // // // // // //     const [attendanceData, setAttendanceData] = useState([]);
// // // // // // //     const [file, setFile] = useState(null);
// // // // // // //     const [batches, setBatches] = useState([]);
// // // // // // //     const [expandedBatch, setExpandedBatch] = useState(null);
// // // // // // //     const [studentsByBatch, setStudentsByBatch] = useState({});

// // // // // // //     // Fetch all unique batches and students
// // // // // // //     const fetchBatchesAndStudents = async () => {
// // // // // // //         try {
// // // // // // //             const studentsCollection = collection(db, 'student');
// // // // // // //             const snapshot = await getDocs(studentsCollection);
// // // // // // //             const allStudents = snapshot.docs.map(doc => ({
// // // // // // //                 id: doc.id,
// // // // // // //                 ...doc.data()
// // // // // // //             }));

// // // // // // //             // Extract unique batch names and group students by batch
// // // // // // //             const batchMap = {};
// // // // // // //             allStudents.forEach(student => {
// // // // // // //                 if (student.course_details && Array.isArray(student.course_details)) {
// // // // // // //                     student.course_details.forEach(course => {
// // // // // // //                         const batchName = course.batch;
// // // // // // //                         if (!batchMap[batchName]) {
// // // // // // //                             batchMap[batchName] = [];
// // // // // // //                         }
// // // // // // //                         batchMap[batchName].push(student);
// // // // // // //                     });
// // // // // // //                 }
// // // // // // //             });

// // // // // // //             setBatches(Object.keys(batchMap));
// // // // // // //             setStudentsByBatch(batchMap);
// // // // // // //             console.log('Batches:', Object.keys(batchMap));
// // // // // // //             console.log('Students by batch:', batchMap);
// // // // // // //         } catch (error) {
// // // // // // //             console.error('Error fetching batches and students:', error);
// // // // // // //             alert('Error fetching data. Check console for details.');
// // // // // // //         }
// // // // // // //     };

// // // // // // //     const generateTemplate = (batchName) => {
// // // // // // //         const students = studentsByBatch[batchName] || [];
// // // // // // //         if (students.length === 0) {
// // // // // // //             alert('No students found for this batch.');
// // // // // // //             return;
// // // // // // //         }

// // // // // // //         const headers = ['Student Name', '20/03/2025', '21/03/2025', '22/03/2025'];
// // // // // // //         const data = students.map(student => [
// // // // // // //             `${student.first_name} ${student.last_name}`,
// // // // // // //             '', '', ''
// // // // // // //         ]);

// // // // // // //         const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
// // // // // // //         const wb = XLSX.utils.book_new();
// // // // // // //         XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
// // // // // // //         XLSX.writeFile(wb, `Attendance_${batchName}.xlsx`);
// // // // // // //     };

// // // // // // //     const handleFileChange = (event) => {
// // // // // // //         const uploadedFile = event.target.files[0];
// // // // // // //         setFile(uploadedFile);
// // // // // // //         if (uploadedFile) {
// // // // // // //             processFile(uploadedFile);
// // // // // // //         }
// // // // // // //     };

// // // // // // //     const processFile = (file) => {
// // // // // // //         const reader = new FileReader();

// // // // // // //         reader.onload = (event) => {
// // // // // // //             const binaryStr = event.target.result;
// // // // // // //             const workbook = XLSX.read(binaryStr, { type: 'binary', dateNF: 'mm/dd/yyyy' });
// // // // // // //             const sheetName = workbook.SheetNames[0];
// // // // // // //             const worksheet = workbook.Sheets[sheetName];

// // // // // // //             const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];
// // // // // // //             const dateHeaders = headers.slice(1);

// // // // // // //             const jsonData = XLSX.utils.sheet_to_json(worksheet, { range: 1 });

// // // // // // //             const formattedData = jsonData.flatMap(row => {
// // // // // // //                 const studentName = row['Student Name'];
// // // // // // //                 return dateHeaders.map(date => ({
// // // // // // //                     batch_id: expandedBatch,
// // // // // // //                     date: new Date(date),
// // // // // // //                     student_name: studentName?.trim() || '',
// // // // // // //                     status: (row[date] || '').toString().trim() || ''
// // // // // // //                 }));
// // // // // // //             });

// // // // // // //             setAttendanceData(prevData => [...prevData, ...formattedData]); // Append new data
// // // // // // //         };

// // // // // // //         reader.readAsBinaryString(file);
// // // // // // //     };

// // // // // // //     const uploadToFirestore = async () => {
// // // // // // //         if (!attendanceData.length) {
// // // // // // //             alert('Please select a file first');
// // // // // // //             return;
// // // // // // //         }

// // // // // // //         try {
// // // // // // //             const attendanceCollection = collection(db, 'attendance');
// // // // // // //             const newRecords = attendanceData.filter(record => !record.id); // Only upload new records
// // // // // // //             await Promise.all(newRecords.map(async (record) => {
// // // // // // //                 await addDoc(attendanceCollection, {
// // // // // // //                     batch_id: record.batch_id,
// // // // // // //                     date: record.date,
// // // // // // //                     student_name: record.student_name,
// // // // // // //                     status: record.status
// // // // // // //                 });
// // // // // // //             }));
// // // // // // //             alert('Attendance data uploaded successfully!');
// // // // // // //             setFile(null);
// // // // // // //             fetchAttendanceData(); // Refresh the full attendance data
// // // // // // //         } catch (error) {
// // // // // // //             console.error('Error uploading attendance data: ', error);
// // // // // // //             alert('Error uploading data. Check console for details.');
// // // // // // //         }
// // // // // // //     };

// // // // // // //     const fetchAttendanceData = async () => {
// // // // // // //         const attendanceCollection = collection(db, 'attendance');
// // // // // // //         const snapshot = await getDocs(attendanceCollection);
// // // // // // //         const fetchedData = snapshot.docs.map(doc => ({
// // // // // // //             id: doc.id,
// // // // // // //             ...doc.data(),
// // // // // // //             date: doc.data().date.toDate()
// // // // // // //         }));
// // // // // // //         setAttendanceData(fetchedData);
// // // // // // //     };

// // // // // // //     useEffect(() => {
// // // // // // //         fetchBatchesAndStudents();
// // // // // // //         fetchAttendanceData();
// // // // // // //     }, []);

// // // // // // //     const toggleBatch = (batchName) => {
// // // // // // //         setExpandedBatch(expandedBatch === batchName ? null : batchName);
// // // // // // //         setFile(null); // Reset file input when switching batches
// // // // // // //     };

// // // // // // //     return (
// // // // // // //         <div className="attendance-component flex-col w-screen ml-80 p-4">
// // // // // // //             <h2 className="text-xl font-bold mb-4">Batch List</h2>
// // // // // // //             <div className="space-y-2">
// // // // // // //                 {batches.map(batchName => (
// // // // // // //                     <div key={batchName} className="border rounded-md">
// // // // // // //                         <button
// // // // // // //                             onClick={() => toggleBatch(batchName)}
// // // // // // //                             className="w-full text-left p-2 bg-blue-100 hover:bg-blue-200 flex justify-between items-center"
// // // // // // //                         >
// // // // // // //                             <span>{batchName}</span>
// // // // // // //                             <span>{expandedBatch === batchName ? '▼' : '▶'}</span>
// // // // // // //                         </button>
// // // // // // //                         {expandedBatch === batchName && (
// // // // // // //                             <div className="p-4 bg-white">
// // // // // // //                                 {/* <h3 className="font-semibold">Students in {batchName}</h3>
// // // // // // //                                 <ul className="list-disc pl-5 mb-4">
// // // // // // //                                     {studentsByBatch[batchName].map(student => (
// // // // // // //                                         <li key={student.id}>
// // // // // // //                                             {student.first_name} {student.last_name}
// // // // // // //                                         </li>
// // // // // // //                                     ))}
// // // // // // //                                 </ul> */}
// // // // // // //                                 <button
// // // // // // //                                     onClick={() => generateTemplate(batchName)}
// // // // // // //                                     className="mb-4 btn btn-secondary bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-200"
// // // // // // //                                 >
// // // // // // //                                     Download Attendance Template
// // // // // // //                                 </button>
// // // // // // //                                 <div className="mt-4 mb-4">
// // // // // // //                                     <input
// // // // // // //                                         type="file"
// // // // // // //                                         accept=".xlsx, .xls"
// // // // // // //                                         onChange={handleFileChange}
// // // // // // //                                         className="mb-2"
// // // // // // //                                     />
// // // // // // //                                     <button
// // // // // // //                                         onClick={uploadToFirestore}
// // // // // // //                                         className="ml-2 btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
// // // // // // //                                     >
// // // // // // //                                         Upload to Database
// // // // // // //                                     </button>
// // // // // // //                                 </div>
// // // // // // //                                 <h3 className="font-semibold mb-2">Attendance Data for {batchName}</h3>
// // // // // // //                                 <table className="table-data table w-full">
// // // // // // //                                     <thead className="table-secondary">
// // // // // // //                                         <tr>
// // // // // // //                                             <th>Date</th>
// // // // // // //                                             <th>Student Name</th>
// // // // // // //                                             <th>Status</th>
// // // // // // //                                         </tr>
// // // // // // //                                     </thead>
// // // // // // //                                     <tbody>
// // // // // // //                                         {attendanceData
// // // // // // //                                             .filter(record => record.batch_id === batchName)
// // // // // // //                                             .length > 0 ? (
// // // // // // //                                             attendanceData
// // // // // // //                                                 .filter(record => record.batch_id === batchName)
// // // // // // //                                                 .map((record, index) => (
// // // // // // //                                                     <tr key={index}>
// // // // // // //                                                         <td>{new Date(record.date).toLocaleDateString()}</td>
// // // // // // //                                                         <td>{record.student_first_name}</td>
// // // // // // //                                                         <td>{record.status}</td>
// // // // // // //                                                     </tr>
// // // // // // //                                                 ))
// // // // // // //                                         ) : (
// // // // // // //                                             <tr>
// // // // // // //                                                 <td colSpan="3">No attendance data available for this batch.</td>
// // // // // // //                                             </tr>
// // // // // // //                                         )}
// // // // // // //                                     </tbody>
// // // // // // //                                 </table>
// // // // // // //                             </div>
// // // // // // //                         )}
// // // // // // //                     </div>
// // // // // // //                 ))}
// // // // // // //             </div>

// // // // // // //             <h2 className="mt-8">All Attendance Data</h2>
// // // // // // //             <table className="table-data table w-full">
// // // // // // //                 <thead className="table-secondary">
// // // // // // //                     <tr>
// // // // // // //                         <th>Batch</th>
// // // // // // //                         <th>Date</th>
// // // // // // //                         <th>Student Name</th>
// // // // // // //                         <th>Status</th>
// // // // // // //                     </tr>
// // // // // // //                 </thead>
// // // // // // //                 <tbody>
// // // // // // //                     {attendanceData.length > 0 ? (
// // // // // // //                         attendanceData.map((record, index) => (
// // // // // // //                             <tr key={index}>
// // // // // // //                                 <td>{record.batch_id}</td>
// // // // // // //                                 <td>{new Date(record.date).toLocaleDateString()}</td>
// // // // // // //                                 <td>{record.student_name}</td>
// // // // // // //                                 <td>{record.status}</td>
// // // // // // //                             </tr>
// // // // // // //                         ))
// // // // // // //                     ) : (
// // // // // // //                         <tr>
// // // // // // //                             <td colSpan="4">No data available. Upload an Excel file to see records.</td>
// // // // // // //                         </tr>
// // // // // // //                     )}
// // // // // // //                 </tbody>
// // // // // // //             </table>
// // // // // // //         </div>
// // // // // // //     );
// // // // // // // }


// // // // // // import React, { useState, useEffect } from 'react';
// // // // // // import * as XLSX from 'xlsx';
// // // // // // import { db } from '../config/firebase';
// // // // // // import { collection, addDoc, getDocs } from 'firebase/firestore';

// // // // // // export default function Attendance() {
// // // // // //     const [attendanceData, setAttendanceData] = useState([]);
// // // // // //     const [file, setFile] = useState(null);
// // // // // //     const [batches, setBatches] = useState([]);
// // // // // //     const [expandedBatch, setExpandedBatch] = useState(null);
// // // // // //     const [studentsByBatch, setStudentsByBatch] = useState({});
// // // // // //     const [batchDetails, setBatchDetails] = useState({}); // Store batch startDate and endDate

// // // // // //     // Fetch all unique batches, students, and batch details
// // // // // //     const fetchBatchesAndStudents = async () => {
// // // // // //         try {
// // // // // //             // Fetch batches
// // // // // //             const batchesCollection = collection(db, 'Batch');
// // // // // //             const batchesSnapshot = await getDocs(batchesCollection);
// // // // // //             const batchData = batchesSnapshot.docs.map(doc => ({
// // // // // //                 id: doc.id,
// // // // // //                 ...doc.data(),
// // // // // //             }));
// // // // // //             const batchMap = {};
// // // // // //             batchData.forEach(batch => {
// // // // // //                 batchMap[batch.batchName] = {
// // // // // //                     startDate: new Date(batch.startDate), // Parse string to Date
// // // // // //                     endDate: new Date(batch.endDate),     // Parse string to Date
// // // // // //                 };
// // // // // //             });
// // // // // //             setBatchDetails(batchMap);
// // // // // //             setBatches(Object.keys(batchMap));

// // // // // //             // Rest of the function remains unchanged
// // // // // //             const studentsCollection = collection(db, 'student');
// // // // // //             const studentsSnapshot = await getDocs(studentsCollection);
// // // // // //             const allStudents = studentsSnapshot.docs.map(doc => ({
// // // // // //                 id: doc.id,
// // // // // //                 ...doc.data(),
// // // // // //             }));

// // // // // //             const studentsByBatchMap = {};
// // // // // //             allStudents.forEach(student => {
// // // // // //                 if (student.course_details && Array.isArray(student.course_details)) {
// // // // // //                     student.course_details.forEach(course => {
// // // // // //                         const batchName = course.batch;
// // // // // //                         if (!studentsByBatchMap[batchName]) {
// // // // // //                             studentsByBatchMap[batchName] = [];
// // // // // //                         }
// // // // // //                         studentsByBatchMap[batchName].push(student);
// // // // // //                     });
// // // // // //                 }
// // // // // //             });

// // // // // //             setStudentsByBatch(studentsByBatchMap);
// // // // // //             console.log('Batches:', Object.keys(batchMap));
// // // // // //             console.log('Students by batch:', studentsByBatchMap);
// // // // // //         } catch (error) {
// // // // // //             console.error('Error fetching batches and students:', error);
// // // // // //             alert('Error fetching data. Check console for details.');
// // // // // //         }
// // // // // //     };
// // // // // //     // const fetchBatchesAndStudents = async () => {
// // // // // //     //     try {
// // // // // //     //         // Fetch batches
// // // // // //     //         const batchesCollection = collection(db, 'Batch');
// // // // // //     //         const batchesSnapshot = await getDocs(batchesCollection);
// // // // // //     //         const batchData = batchesSnapshot.docs.map(doc => ({
// // // // // //     //             id: doc.id,
// // // // // //     //             ...doc.data(),
// // // // // //     //         }));
// // // // // //     //         const batchMap = {};
// // // // // //     //         batchData.forEach(batch => {
// // // // // //     //             batchMap[batch.batchName] = {
// // // // // //     //                 startDate: batch.startDate.toDate(), // Convert Firestore Timestamp to JS Date
// // // // // //     //                 endDate: batch.endDate.toDate(),
// // // // // //     //             };
// // // // // //     //         });
// // // // // //     //         setBatchDetails(batchMap);
// // // // // //     //         setBatches(Object.keys(batchMap));

// // // // // //     //         // Fetch students
// // // // // //     //         const studentsCollection = collection(db, 'student');
// // // // // //     //         const studentsSnapshot = await getDocs(studentsCollection);
// // // // // //     //         const allStudents = studentsSnapshot.docs.map(doc => ({
// // // // // //     //             id: doc.id,
// // // // // //     //             ...doc.data(),
// // // // // //     //         }));

// // // // // //     //         // Group students by batch
// // // // // //     //         const studentsByBatchMap = {};
// // // // // //     //         allStudents.forEach(student => {
// // // // // //     //             if (student.course_details && Array.isArray(student.course_details)) {
// // // // // //     //                 student.course_details.forEach(course => {
// // // // // //     //                     const batchName = course.batch;
// // // // // //     //                     if (!studentsByBatchMap[batchName]) {
// // // // // //     //                         studentsByBatchMap[batchName] = [];
// // // // // //     //                     }
// // // // // //     //                     studentsByBatchMap[batchName].push(student);
// // // // // //     //                 });
// // // // // //     //             }
// // // // // //     //         });

// // // // // //     //         setStudentsByBatch(studentsByBatchMap);
// // // // // //     //         console.log('Batches:', Object.keys(batchMap));
// // // // // //     //         console.log('Students by batch:', studentsByBatchMap);
// // // // // //     //     } catch (error) {
// // // // // //     //         console.error('Error fetching batches and students:', error);
// // // // // //     //         alert('Error fetching data. Check console for details.');
// // // // // //     //     }
// // // // // //     // };

// // // // // //     // Generate date range from startDate to endDate
// // // // // //     const generateDateRange = (startDate, endDate) => {
// // // // // //         const dates = [];
// // // // // //         let currentDate = new Date(startDate);
// // // // // //         while (currentDate <= endDate) {
// // // // // //             dates.push(new Date(currentDate).toLocaleDateString('en-US')); // Format: MM/DD/YYYY
// // // // // //             currentDate.setDate(currentDate.getDate() + 1);
// // // // // //         }
// // // // // //         return dates;
// // // // // //     };

// // // // // //     const generateTemplate = (batchName) => {
// // // // // //         const students = studentsByBatch[batchName] || [];
// // // // // //         if (students.length === 0) {
// // // // // //             alert('No students found for this batch.');
// // // // // //             return;
// // // // // //         }

// // // // // //         const batch = batchDetails[batchName];
// // // // // //         if (!batch || !batch.startDate || !batch.endDate) {
// // // // // //             alert('Batch details (startDate or endDate) not found.');
// // // // // //             return;
// // // // // //         }

// // // // // //         // Generate headers with date range
// // // // // //         const dateHeaders = generateDateRange(batch.startDate, batch.endDate);
// // // // // //         const headers = ['Student Name', ...dateHeaders];

// // // // // //         // Create data rows
// // // // // //         const data = students.map(student => [
// // // // // //             `${student.first_name} ${student.last_name}`,
// // // // // //             ...dateHeaders.map(() => ''), // Empty cells for each date
// // // // // //         ]);

// // // // // //         const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
// // // // // //         const wb = XLSX.utils.book_new();
// // // // // //         XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
// // // // // //         XLSX.writeFile(wb, `Attendance_${batchName}.xlsx`);
// // // // // //     };

// // // // // //     const handleFileChange = (event) => {
// // // // // //         const uploadedFile = event.target.files[0];
// // // // // //         setFile(uploadedFile);
// // // // // //         if (uploadedFile) {
// // // // // //             processFile(uploadedFile);
// // // // // //         }
// // // // // //     };

// // // // // //     const processFile = (file) => {
// // // // // //         const reader = new FileReader();

// // // // // //         reader.onload = (event) => {
// // // // // //             const binaryStr = event.target.result;
// // // // // //             const workbook = XLSX.read(binaryStr, { type: 'binary', dateNF: 'mm/dd/yyyy' });
// // // // // //             const sheetName = workbook.SheetNames[0];
// // // // // //             const worksheet = workbook.Sheets[sheetName];

// // // // // //             const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];
// // // // // //             const dateHeaders = headers.slice(1);

// // // // // //             const jsonData = XLSX.utils.sheet_to_json(worksheet, { range: 1 });

// // // // // //             const formattedData = jsonData.flatMap(row => {
// // // // // //                 const studentName = row['Student Name'];
// // // // // //                 return dateHeaders.map(date => ({
// // // // // //                     batch_id: expandedBatch,
// // // // // //                     date: new Date(date),
// // // // // //                     student_name: studentName?.trim() || '',
// // // // // //                     status: (row[date] || '').toString().trim() || '',
// // // // // //                 }));
// // // // // //             });

// // // // // //             setAttendanceData(prevData => [...prevData, ...formattedData]);
// // // // // //         };

// // // // // //         reader.readAsBinaryString(file);
// // // // // //     };

// // // // // //     const uploadToFirestore = async () => {
// // // // // //         if (!attendanceData.length) {
// // // // // //             alert('Please select a file first');
// // // // // //             return;
// // // // // //         }

// // // // // //         try {
// // // // // //             const attendanceCollection = collection(db, 'attendance');
// // // // // //             const newRecords = attendanceData.filter(record => !record.id);
// // // // // //             await Promise.all(
// // // // // //                 newRecords.map(async (record) => {
// // // // // //                     await addDoc(attendanceCollection, {
// // // // // //                         batch_id: record.batch_id,
// // // // // //                         date: record.date,
// // // // // //                         student_name: record.student_name,
// // // // // //                         status: record.status,
// // // // // //                     });
// // // // // //                 })
// // // // // //             );
// // // // // //             alert('Attendance data uploaded successfully!');
// // // // // //             setFile(null);
// // // // // //             fetchAttendanceData();
// // // // // //         } catch (error) {
// // // // // //             console.error('Error uploading attendance data: ', error);
// // // // // //             alert('Error uploading data. Check console for details.');
// // // // // //         }
// // // // // //     };

// // // // // //     const fetchAttendanceData = async () => {
// // // // // //         const attendanceCollection = collection(db, 'attendance');
// // // // // //         const snapshot = await getDocs(attendanceCollection);
// // // // // //         const fetchedData = snapshot.docs.map(doc => ({
// // // // // //             id: doc.id,
// // // // // //             ...doc.data(),
// // // // // //             date: doc.data().date.toDate(),
// // // // // //         }));
// // // // // //         setAttendanceData(fetchedData);
// // // // // //     };

// // // // // //     useEffect(() => {
// // // // // //         fetchBatchesAndStudents();
// // // // // //         fetchAttendanceData();
// // // // // //     }, []);

// // // // // //     const toggleBatch = (batchName) => {
// // // // // //         setExpandedBatch(expandedBatch === batchName ? null : batchName);
// // // // // //         setFile(null);
// // // // // //     };

// // // // // //     return (
// // // // // //         <div className="attendance-component flex-col w-screen ml-80 p-4">
// // // // // //             <h2 className="text-xl font-bold mb-4">Batch List</h2>
// // // // // //             <div className="space-y-2">
// // // // // //                 {batches.map(batchName => (
// // // // // //                     <div key={batchName} className="border rounded-md">
// // // // // //                         <button
// // // // // //                             onClick={() => toggleBatch(batchName)}
// // // // // //                             className="w-full text-left p-2 bg-blue-100 hover:bg-blue-200 flex justify-between items-center"
// // // // // //                         >
// // // // // //                             <span>{batchName}</span>
// // // // // //                             <span>{expandedBatch === batchName ? '▼' : '▶'}</span>
// // // // // //                         </button>
// // // // // //                         {expandedBatch === batchName && (
// // // // // //                             <div className="p-4 bg-white">
// // // // // //                                 <button
// // // // // //                                     onClick={() => generateTemplate(batchName)}
// // // // // //                                     className="mb-4 btn btn-secondary bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-200"
// // // // // //                                 >
// // // // // //                                     Download Attendance Template
// // // // // //                                 </button>
// // // // // //                                 <div className="mt-4 mb-4">
// // // // // //                                     <input
// // // // // //                                         type="file"
// // // // // //                                         accept=".xlsx, .xls"
// // // // // //                                         onChange={handleFileChange}
// // // // // //                                         className="mb-2"
// // // // // //                                     />
// // // // // //                                     <button
// // // // // //                                         onClick={uploadToFirestore}
// // // // // //                                         className="ml-2 btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
// // // // // //                                     >
// // // // // //                                         Upload to Database
// // // // // //                                     </button>
// // // // // //                                 </div>
// // // // // //                                 <h3 className="font-semibold mb-2">Attendance Data for {batchName}</h3>
// // // // // //                                 <table className="table-data table w-full">
// // // // // //                                     <thead className="table-secondary">
// // // // // //                                         <tr>
// // // // // //                                             <th>Student Name</th>
// // // // // //                                             {/* Show the date from the first record as an example; adjust as needed */}
// // // // // //                                             <th>
// // // // // //                                                 {attendanceData
// // // // // //                                                     .filter(record => record.batch_id === batchName)[0]?.date
// // // // // //                                                     ? new Date(attendanceData.filter(record => record.batch_id === batchName)[0].date).toLocaleDateString()
// // // // // //                                                     : 'Date'}
// // // // // //                                             </th>
// // // // // //                                         </tr>
// // // // // //                                     </thead>
// // // // // //                                     <tbody>
// // // // // //                                         {attendanceData
// // // // // //                                             .filter(record => record.batch_id === batchName)
// // // // // //                                             .length > 0 ? (
// // // // // //                                             attendanceData
// // // // // //                                                 .filter(record => record.batch_id === batchName)
// // // // // //                                                 .map((record, index) => (
// // // // // //                                                     <tr key={index}>
// // // // // //                                                         <td>{record.student_name}</td>
// // // // // //                                                         <td>{record.status}</td>
// // // // // //                                                     </tr>
// // // // // //                                                 ))
// // // // // //                                         ) : (
// // // // // //                                             <tr>
// // // // // //                                                 <td colSpan="2">No attendance data available for this batch.</td>
// // // // // //                                             </tr>
// // // // // //                                         )}
// // // // // //                                     </tbody>
// // // // // //                                 </table>
// // // // // //                                 {/* <h3 className="font-semibold mb-2">Attendance Data for {batchName}</h3>
// // // // // //                                 <table className="table-data table w-full">
// // // // // //                                     <thead className="table-secondary">
// // // // // //                                         <tr>
// // // // // //                                             <th>Student Name</th>
// // // // // //                                             <th>{new Date(record.date).toLocaleDateString()}</th>
// // // // // //                                             <th>Date</th>
// // // // // //                                             <th>Status</th>
// // // // // //                                         </tr>
// // // // // //                                     </thead>
// // // // // //                                     <tbody>
// // // // // //                                         {attendanceData
// // // // // //                                             .filter(record => record.batch_id === batchName)
// // // // // //                                             .length > 0 ? (
// // // // // //                                             attendanceData
// // // // // //                                                 .filter(record => record.batch_id === batchName)
// // // // // //                                                 .map((record, index) => (
// // // // // //                                                     <tr key={index}>
// // // // // //                                                         <td>{record.student_name}</td>
// // // // // //                                                         <td>{record.status}</td>
// // // // // //                                                     </tr>
// // // // // //                                                 ))
// // // // // //                                         ) : (
// // // // // //                                             <tr>
// // // // // //                                                 <td colSpan="3">No attendance data available for this batch.</td>
// // // // // //                                             </tr>
// // // // // //                                         )}
// // // // // //                                     </tbody>
// // // // // //                                 </table> */}
// // // // // //                             </div>
// // // // // //                         )}
// // // // // //                     </div>
// // // // // //                 ))}
// // // // // //             </div>

// // // // // //             {/* <h2 className="mt-8">All Attendance Data</h2>
// // // // // //             <table className="table-data table w-full">
// // // // // //                 <thead className="table-secondary">
// // // // // //                     <tr>
// // // // // //                         <th>Batch</th>
// // // // // //                         <th>Date</th>
// // // // // //                         <th>Student Name</th>
// // // // // //                         <th>Status</th>
// // // // // //                     </tr>
// // // // // //                 </thead>
// // // // // //                 <tbody>
// // // // // //                     {attendanceData.length > 0 ? (
// // // // // //                         attendanceData.map((record, index) => (
// // // // // //                             <tr key={index}>
// // // // // //                                 <td>{record.batch_id}</td>
// // // // // //                                 <td>{new Date(record.date).toLocaleDateString()}</td>
// // // // // //                                 <td>{record.student_name}</td>
// // // // // //                                 <td>{record.status}</td>
// // // // // //                             </tr>
// // // // // //                         ))
// // // // // //                     ) : (
// // // // // //                         <tr>
// // // // // //                             <td colSpan="4">No data available. Upload an Excel file to see records.</td>
// // // // // //                         </tr>
// // // // // //                     )}
// // // // // //                 </tbody>
// // // // // //             </table> */}
// // // // // //         </div>
// // // // // //     );
// // // // // // }

// // // // // import React, { useState, useEffect } from 'react';
// // // // // import * as XLSX from 'xlsx';
// // // // // import { db } from '../config/firebase';
// // // // // import { collection, addDoc, getDocs } from 'firebase/firestore';

// // // // // export default function Attendance() {
// // // // //     const [attendanceData, setAttendanceData] = useState([]);
// // // // //     const [file, setFile] = useState(null);
// // // // //     const [batches, setBatches] = useState([]);
// // // // //     const [expandedBatch, setExpandedBatch] = useState(null);
// // // // //     const [studentsByBatch, setStudentsByBatch] = useState({});
// // // // //     const [batchDetails, setBatchDetails] = useState({});

// // // // //     const fetchBatchesAndStudents = async () => {
// // // // //         try {
// // // // //             const batchesCollection = collection(db, 'Batch');
// // // // //             const batchesSnapshot = await getDocs(batchesCollection);
// // // // //             const batchData = batchesSnapshot.docs.map(doc => ({
// // // // //                 id: doc.id,
// // // // //                 ...doc.data(),
// // // // //             }));
// // // // //             const batchMap = {};
// // // // //             batchData.forEach(batch => {
// // // // //                 batchMap[batch.batchName] = {
// // // // //                     startDate: new Date(batch.startDate),
// // // // //                     endDate: new Date(batch.endDate),
// // // // //                 };
// // // // //             });
// // // // //             setBatchDetails(batchMap);
// // // // //             setBatches(Object.keys(batchMap));

// // // // //             const studentsCollection = collection(db, 'student');
// // // // //             const studentsSnapshot = await getDocs(studentsCollection);
// // // // //             const allStudents = studentsSnapshot.docs.map(doc => ({
// // // // //                 id: doc.id,
// // // // //                 ...doc.data(),
// // // // //             }));

// // // // //             const studentsByBatchMap = {};
// // // // //             allStudents.forEach(student => {
// // // // //                 if (student.course_details && Array.isArray(student.course_details)) {
// // // // //                     student.course_details.forEach(course => {
// // // // //                         const batchName = course.batch;
// // // // //                         if (!studentsByBatchMap[batchName]) {
// // // // //                             studentsByBatchMap[batchName] = [];
// // // // //                         }
// // // // //                         studentsByBatchMap[batchName].push(student);
// // // // //                     });
// // // // //                 }
// // // // //             });

// // // // //             setStudentsByBatch(studentsByBatchMap);
// // // // //             console.log('Batches:', Object.keys(batchMap));
// // // // //             console.log('Students by batch:', studentsByBatchMap);
// // // // //         } catch (error) {
// // // // //             console.error('Error fetching batches and students:', error);
// // // // //             alert('Error fetching data. Check console for details.');
// // // // //         }
// // // // //     };

// // // // //     const generateDateRange = (startDate, endDate) => {
// // // // //         const dates = [];
// // // // //         let currentDate = new Date(startDate);
// // // // //         while (currentDate <= endDate) {
// // // // //             dates.push(new Date(currentDate).toLocaleDateString('en-US'));
// // // // //             currentDate.setDate(currentDate.getDate() + 1);
// // // // //         }
// // // // //         return dates;
// // // // //     };

// // // // //     const generateTemplate = (batchName) => {
// // // // //         const students = studentsByBatch[batchName] || [];
// // // // //         if (students.length === 0) {
// // // // //             alert('No students found for this batch.');
// // // // //             return;
// // // // //         }

// // // // //         const batch = batchDetails[batchName];
// // // // //         if (!batch || !batch.startDate || !batch.endDate) {
// // // // //             alert('Batch details (startDate or endDate) not found.');
// // // // //             return;
// // // // //         }

// // // // //         const dateHeaders = generateDateRange(batch.startDate, batch.endDate);
// // // // //         const headers = ['Student Name', ...dateHeaders];
// // // // //         const data = students.map(student => [
// // // // //             `${student.first_name} ${student.last_name}`,
// // // // //             ...dateHeaders.map(() => ''),
// // // // //         ]);

// // // // //         const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
// // // // //         const wb = XLSX.utils.book_new();
// // // // //         XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
// // // // //         XLSX.writeFile(wb, `Attendance_${batchName}.xlsx`);
// // // // //     };

// // // // //     const handleFileChange = (event) => {
// // // // //         const uploadedFile = event.target.files[0];
// // // // //         setFile(uploadedFile);
// // // // //         if (uploadedFile) {
// // // // //             processFile(uploadedFile);
// // // // //         }
// // // // //     };

// // // // //     const processFile = (file) => {
// // // // //         const reader = new FileReader();
// // // // //         reader.onload = (event) => {
// // // // //             const binaryStr = event.target.result;
// // // // //             const workbook = XLSX.read(binaryStr, { type: 'binary', dateNF: 'mm/dd/yyyy' });
// // // // //             const sheetName = workbook.SheetNames[0];
// // // // //             const worksheet = workbook.Sheets[sheetName];
// // // // //             const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];
// // // // //             const dateHeaders = headers.slice(1);
// // // // //             const jsonData = XLSX.utils.sheet_to_json(worksheet, { range: 1 });

// // // // //             const formattedData = jsonData.flatMap(row => {
// // // // //                 const studentName = row['Student Name'];
// // // // //                 return dateHeaders.map(date => ({
// // // // //                     batch_id: expandedBatch,
// // // // //                     date: new Date(date),
// // // // //                     student_name: studentName?.trim() || '',
// // // // //                     status: (row[date] || '').toString().trim() || '',
// // // // //                 }));
// // // // //             });

// // // // //             setAttendanceData(prevData => [...prevData, ...formattedData]);
// // // // //             console.log('Processed attendance data:', formattedData); // Debug log
// // // // //         };
// // // // //         reader.readAsBinaryString(file);
// // // // //     };

// // // // //     const uploadToFirestore = async () => {
// // // // //         if (!attendanceData.length) {
// // // // //             alert('Please select a file first');
// // // // //             return;
// // // // //         }

// // // // //         try {
// // // // //             const attendanceCollection = collection(db, 'attendance');
// // // // //             const newRecords = attendanceData.filter(record => !record.id);
// // // // //             await Promise.all(
// // // // //                 newRecords.map(async (record) => {
// // // // //                     await addDoc(attendanceCollection, {
// // // // //                         batch_id: record.batch_id,
// // // // //                         date: record.date,
// // // // //                         student_name: record.student_name,
// // // // //                         status: record.status,
// // // // //                     });
// // // // //                 })
// // // // //             );
// // // // //             alertSubscriptions('Attendance data uploaded successfully!');
// // // // //             setFile(null);
// // // // //             fetchAttendanceData();
// // // // //         } catch (error) {
// // // // //             console.error('Error uploading attendance data: ', error);
// // // // //             alert('Error uploading data. Check console for details.');
// // // // //         }
// // // // //     };

// // // // //     const fetchAttendanceData = async () => {
// // // // //         const attendanceCollection = collection(db, 'attendance');
// // // // //         const snapshot = await getDocs(attendanceCollection);
// // // // //         const fetchedData = snapshot.docs.map(doc => ({
// // // // //             id: doc.id,
// // // // //             ...doc.data(),
// // // // //             date: doc.data().date.toDate(),
// // // // //         }));
// // // // //         setAttendanceData(fetchedData);
// // // // //         console.log('Fetched attendance data:', fetchedData); // Debug log
// // // // //     };

// // // // //     useEffect(() => {
// // // // //         fetchBatchesAndStudents();
// // // // //         fetchAttendanceData();
// // // // //     }, []);

// // // // //     const toggleBatch = (batchName) => {
// // // // //         setExpandedBatch(expandedBatch === batchName ? null : batchName);
// // // // //         setFile(null);
// // // // //     };

// // // // //     // Pivot attendance data for display
// // // // //     const getAttendanceTableData = (batchName) => {
// // // // //         const batchAttendance = attendanceData.filter(record => record.batch_id === batchName);
// // // // //         const batch = batchDetails[batchName];
// // // // //         if (!batch) return { students: [], dates: [] };

// // // // //         const dates = generateDateRange(batch.startDate, batch.endDate);
// // // // //         const students = [...new Set(batchAttendance.map(record => record.student_name))]; // Unique student names
// // // // //         const attendanceMap = {};

// // // // //         batchAttendance.forEach(record => {
// // // // //             const dateStr = new Date(record.date).toLocaleDateString('en-US');
// // // // //             attendanceMap[`${record.student_name}-${dateStr}`] = record.status;
// // // // //         });

// // // // //         return { students, dates, attendanceMap };
// // // // //     };

// // // // //     return (
// // // // //         <div className="attendance-component flex-col w-screen ml-80 p-4">
// // // // //             <h2 className="text-xl font-bold mb-4">Batch List</h2>
// // // // //             <div className="space-y-2">
// // // // //                 {batches.map(batchName => (
// // // // //                     <div key={batchName} className="border rounded-md">
// // // // //                         <button
// // // // //                             onClick={() => toggleBatch(batchName)}
// // // // //                             className="w-full text-left p-2 bg-blue-100 hover:bg-blue-200 flex justify-between items-center"
// // // // //                         >
// // // // //                             <span>{batchName}</span>
// // // // //                             <span>{expandedBatch === batchName ? '▼' : '▶'}</span>
// // // // //                         </button>
// // // // //                         {expandedBatch === batchName && (
// // // // //                             <div className="p-4 bg-white">
// // // // //                                 <button
// // // // //                                     onClick={() => generateTemplate(batchName)}
// // // // //                                     className="mb-4 btn btn-secondary bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-200"
// // // // //                                 >
// // // // //                                     Download Attendance Template
// // // // //                                 </button>
// // // // //                                 <div className="mt-4 mb-4">
// // // // //                                     <input
// // // // //                                         type="file"
// // // // //                                         accept=".xlsx, .xls"
// // // // //                                         onChange={handleFileChange}
// // // // //                                         className="mb-2"
// // // // //                                     />
// // // // //                                     <button
// // // // //                                         onClick={uploadToFirestore}
// // // // //                                         className="ml-2 btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
// // // // //                                     >
// // // // //                                         Upload to Database
// // // // //                                     </button>
// // // // //                                 </div>
// // // // //                                 <h3 className="font-semibold mb-2">Attendance Data for {batchName}</h3>
// // // // //                                 <table className="table-data table w-full">
// // // // //                                     <thead className="table-secondary">
// // // // //                                         <tr>
// // // // //                                             <th>Student Name</th>
// // // // //                                             {batchDetails[batchName] && generateDateRange(batchDetails[batchName].startDate, batchDetails[batchName].endDate).map((date, index) => (
// // // // //                                                 <th key={index}>{date}</th>
// // // // //                                             ))}
// // // // //                                         </tr>
// // // // //                                     </thead>
// // // // //                                     <tbody>
// // // // //                                         {(() => {
// // // // //                                             const { students, dates, attendanceMap } = getAttendanceTableData(batchName);
// // // // //                                             return students.length > 0 ? (
// // // // //                                                 students.map((student, index) => (
// // // // //                                                     <tr key={index}>
// // // // //                                                         <td>{student || 'Unknown Student'}</td>
// // // // //                                                         {dates.map((date, dateIndex) => (
// // // // //                                                             <td key={dateIndex}>
// // // // //                                                                 {attendanceMap[`${student}-${date}`] || '-'}
// // // // //                                                             </td>
// // // // //                                                         ))}
// // // // //                                                     </tr>
// // // // //                                                 ))
// // // // //                                             ) : (
// // // // //                                                 <tr>
// // // // //                                                     <td colSpan={dates.length + 1}>No attendance data available for this batch.</td>
// // // // //                                                 </tr>
// // // // //                                             );
// // // // //                                         })()}
// // // // //                                     </tbody>
// // // // //                                 </table>
// // // // //                             </div>
// // // // //                         )}
// // // // //                     </div>
// // // // //                 ))}
// // // // //             </div>
// // // // //         </div>
// // // // //     );
// // // // // }

// // // // import React, { useState, useEffect } from 'react';
// // // // import * as XLSX from 'xlsx';
// // // // import { db } from '../config/firebase';
// // // // import { collection, addDoc, getDocs } from 'firebase/firestore';

// // // // export default function Attendance() {
// // // //     const [attendanceData, setAttendanceData] = useState([]);
// // // //     const [file, setFile] = useState(null);
// // // //     const [batches, setBatches] = useState([]);
// // // //     const [expandedBatch, setExpandedBatch] = useState(null);
// // // //     const [studentsByBatch, setStudentsByBatch] = useState({});
// // // //     const [batchDetails, setBatchDetails] = useState({});

// // // //     const fetchBatchesAndStudents = async () => {
// // // //         try {
// // // //             const batchesCollection = collection(db, 'Batch');
// // // //             const batchesSnapshot = await getDocs(batchesCollection);
// // // //             const batchData = batchesSnapshot.docs.map(doc => ({
// // // //                 id: doc.id,
// // // //                 ...doc.data(),
// // // //             }));
// // // //             const batchMap = {};
// // // //             batchData.forEach(batch => {
// // // //                 batchMap[batch.batchName] = {
// // // //                     startDate: new Date(batch.startDate),
// // // //                     endDate: new Date(batch.endDate),
// // // //                 };
// // // //             });
// // // //             setBatchDetails(batchMap);
// // // //             setBatches(Object.keys(batchMap));

// // // //             const studentsCollection = collection(db, 'student');
// // // //             const studentsSnapshot = await getDocs(studentsCollection);
// // // //             const allStudents = studentsSnapshot.docs.map(doc => ({
// // // //                 id: doc.id,
// // // //                 ...doc.data(),
// // // //             }));

// // // //             const studentsByBatchMap = {};
// // // //             allStudents.forEach(student => {
// // // //                 if (student.course_details && Array.isArray(student.course_details)) {
// // // //                     student.course_details.forEach(course => {
// // // //                         const batchName = course.batch;
// // // //                         if (!studentsByBatchMap[batchName]) {
// // // //                             studentsByBatchMap[batchName] = [];
// // // //                         }
// // // //                         studentsByBatchMap[batchName].push(student);
// // // //                     });
// // // //                 }
// // // //             });

// // // //             setStudentsByBatch(studentsByBatchMap);
// // // //             console.log('Batches:', Object.keys(batchMap));
// // // //             console.log('Students by batch:', studentsByBatchMap);
// // // //         } catch (error) {
// // // //             console.error('Error fetching batches and students:', error);
// // // //             alert('Error fetching data. Check console for details.');
// // // //         }
// // // //     };

// // // //     const generateDateRange = (startDate, endDate) => {
// // // //         const dates = [];
// // // //         let currentDate = new Date(startDate);
// // // //         while (currentDate <= endDate) {
// // // //             dates.push(new Date(currentDate).toLocaleDateString('en-US'));
// // // //             currentDate.setDate(currentDate.getDate() + 1);
// // // //         }
// // // //         return dates;
// // // //     };

// // // //     const generateTemplate = (batchName) => {
// // // //         const students = studentsByBatch[batchName] || [];
// // // //         if (students.length === 0) {
// // // //             alert('No students found for this batch.');
// // // //             return;
// // // //         }

// // // //         const batch = batchDetails[batchName];
// // // //         if (!batch || !batch.startDate || !batch.endDate) {
// // // //             alert('Batch details (startDate or endDate) not found.');
// // // //             return;
// // // //         }

// // // //         const dateHeaders = generateDateRange(batch.startDate, batch.endDate);
// // // //         const headers = ['Student Name', ...dateHeaders];
// // // //         const data = students.map(student => [
// // // //             `${student.first_name} ${student.last_name}`,
// // // //             ...dateHeaders.map(() => ''),
// // // //         ]);

// // // //         const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
// // // //         const wb = XLSX.utils.book_new();
// // // //         XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
// // // //         XLSX.writeFile(wb, `Attendance_${batchName}.xlsx`);
// // // //     };

// // // //     const handleFileChange = (event) => {
// // // //         const uploadedFile = event.target.files[0];
// // // //         setFile(uploadedFile);
// // // //         if (uploadedFile) {
// // // //             processFile(uploadedFile);
// // // //         }
// // // //     };

// // // //     const processFile = (file) => {
// // // //         const reader = new FileReader();
// // // //         reader.onload = (event) => {
// // // //             const binaryStr = event.target.result;
// // // //             const workbook = XLSX.read(binaryStr, { type: 'binary', dateNF: 'dd/mm/yyyy' });
// // // //             const sheetName = workbook.SheetNames[0];
// // // //             const worksheet = workbook.Sheets[sheetName];
// // // //             const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
// // // //             if (!rawData || rawData.length < 2) {
// // // //                 alert("Invalid file format. Ensure the first row contains headers.");
// // // //                 return;
// // // //             }
    
// // // //             const headers = rawData[0].map(header => header.trim()); // Trim headers
// // // //             console.log("Excel Headers:", headers);
    
// // // //             const studentNameColumn = headers.find(h => h.toLowerCase().includes("name")); 
// // // //             if (!studentNameColumn) {
// // // //                 alert("No 'Student Name' column found in the Excel file.");
// // // //                 return;
// // // //             }
    
// // // //             const dateHeaders = headers.slice(1); // All columns except 'Student Name'
// // // //             const jsonData = rawData.slice(1); // Skip the header row
    
// // // //             const formattedData = jsonData.flatMap(row => {
// // // //                 const studentName = row[studentNameColumn]?.trim() || "Unknown"; // Ensure trimming
// // // //                 return dateHeaders.map(date => ({
// // // //                     batch_id: expandedBatch || "Unknown Batch",
// // // //                     date: new Date(date).toISOString(), // Store date in correct format
// // // //                     student_name: studentName,
// // // //                     status: (row[date] || '').toString().trim() || 'N/A',
// // // //                 }));
// // // //             });
    
// // // //             console.log("Processed attendance data:", formattedData);
// // // //             setAttendanceData(prevData => [...prevData, ...formattedData]);
// // // //         };
// // // //         reader.readAsBinaryString(file);
// // // //     };

// // // //     const uploadToFirestore = async () => {
// // // //         if (!attendanceData.length) {
// // // //             alert('Please select a file first');
// // // //             return;
// // // //         }
    
// // // //         try {
// // // //             const attendanceCollection = collection(db, 'attendance');
// // // //             await Promise.all(attendanceData.map(async (record) => {
// // // //                 if (!record.student_name || record.student_name === "Unknown") {
// // // //                     console.warn("Skipping record with unknown student name:", record);
// // // //                     return;
// // // //                 }
    
// // // //                 await addDoc(attendanceCollection, {
// // // //                     batch_id: record.batch_id,
// // // //                     date: new Date(record.date), // Ensure correct date format
// // // //                     student_name: record.student_name,
// // // //                     status: record.status,
// // // //                 });
// // // //             }));
    
// // // //             alert('Attendance data uploaded successfully!');
// // // //             setFile(null);
// // // //             fetchAttendanceData();
// // // //         } catch (error) {
// // // //             console.error('Error uploading attendance data:', error);
// // // //             alert('Error uploading data. Check console for details.');
// // // //         }
// // // //     };

    

// // // //     // const uploadToFirestore = async () => {
// // // //     //     if (!attendanceData.length) {
// // // //     //         alert('Please select a file first');
// // // //     //         return;
// // // //     //     }

// // // //     //     try {
// // // //     //         const attendanceCollection = collection(db, 'attendance');
// // // //     //         const newRecords = attendanceData.filter(record => !record.id);
// // // //     //         await Promise.all(
// // // //     //             newRecords.map(async (record) => {
// // // //     //                 await addDoc(attendanceCollection, {
// // // //     //                     batch_id: record.batch_id,
// // // //     //                     date: record.date,
// // // //     //                     student_name: record.student_name,
// // // //     //                     status: record.status,
// // // //     //                 });
// // // //     //             })
// // // //     //         );
// // // //     //         alert('Attendance data uploaded successfully!');
// // // //     //         setFile(null);
// // // //     //         fetchAttendanceData();
// // // //     //     } catch (error) {
// // // //     //         console.error('Error uploading attendance data: ', error);
// // // //     //         alert('Error uploading data. Check console for details.');
// // // //     //     }
// // // //     // };

// // // //     const fetchAttendanceData = async () => {
// // // //         const attendanceCollection = collection(db, 'attendance');
// // // //         const snapshot = await getDocs(attendanceCollection);
// // // //         const fetchedData = snapshot.docs.map(doc => ({
// // // //             id: doc.id,
// // // //             ...doc.data(),
// // // //             date: doc.data().date.toDate().toLocaleDateString('en-US'), // Convert Firestore timestamp to string
// // // //         }));
// // // //         setAttendanceData(fetchedData);
// // // //         console.log('Fetched attendance data:', fetchedData);
// // // //     };

// // // //     useEffect(() => {
// // // //         fetchBatchesAndStudents();
// // // //         fetchAttendanceData();
// // // //     }, []);

// // // //     const toggleBatch = (batchName) => {
// // // //         setExpandedBatch(expandedBatch === batchName ? null : batchName);
// // // //         setFile(null);
// // // //     };

// // // //     const getAttendanceTableData = (batchName) => {
// // // //         const batchAttendance = attendanceData.filter(record => record.batch_id === batchName);
// // // //         if (!batchAttendance.length) {
// // // //             console.log(`No attendance data found for batch: ${batchName}`);
// // // //             return { students: [], dates: [], attendanceMap: {} };
// // // //         }
    
// // // //         const batch = batchDetails[batchName];
// // // //         if (!batch) return { students: [], dates: [] };
    
// // // //         const dates = generateDateRange(batch.startDate, batch.endDate);
// // // //         const students = [...new Set(batchAttendance.map(record => record.student_name))];
// // // //         const attendanceMap = {};
    
// // // //         batchAttendance.forEach(record => {
// // // //             const dateStr = new Date(record.date).toLocaleDateString('en-US');
// // // //             attendanceMap[`${record.student_name}-${dateStr}`] = record.status;
// // // //         });
    
// // // //         return { students, dates, attendanceMap };
// // // //     };
    
// // // //     return (
// // // //         <div className="attendance-component flex-col w-screen ml-80 p-4">
// // // //             <h2 className="text-xl font-bold mb-4">Batch List</h2>
// // // //             <div className="space-y-2">
// // // //                 {batches.map(batchName => (
// // // //                     <div key={batchName} className="border rounded-md">
// // // //                         <button
// // // //                             onClick={() => toggleBatch(batchName)}
// // // //                             className="w-full text-left p-2 bg-blue-100 hover:bg-blue-200 flex justify-between items-center"
// // // //                         >
// // // //                             <span>{batchName}</span>
// // // //                             <span>{expandedBatch === batchName ? '▼' : '▶'}</span>
// // // //                         </button>
// // // //                         {expandedBatch === batchName && (
// // // //                             <div className="p-4 bg-white">
// // // //                                 <button
// // // //                                     onClick={() => generateTemplate(batchName)}
// // // //                                     className="mb-4 btn btn-secondary bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-200"
// // // //                                 >
// // // //                                     Download Attendance Template
// // // //                                 </button>
// // // //                                 <div className="mt-4 mb-4">
// // // //                                     <input
// // // //                                         type="file"
// // // //                                         accept=".xlsx, .xls"
// // // //                                         onChange={handleFileChange}
// // // //                                         className="mb-2"
// // // //                                     />
// // // //                                     <button
// // // //                                         onClick={uploadToFirestore}
// // // //                                         className="ml-2 btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
// // // //                                     >
// // // //                                         Upload to Database
// // // //                                     </button>
// // // //                                 </div>
// // // //                                 <h3 className="font-semibold mb-2">Attendance Data for {batchName}</h3>
// // // //                                 <table className="table-data table w-full">
// // // //                                     <thead className="table-secondary">
// // // //                                         <tr>
// // // //                                             <th>Student Name</th>
// // // //                                             {batchDetails[batchName] ? (
// // // //                                                 generateDateRange(batchDetails[batchName].startDate, batchDetails[batchName].endDate).map((date, index) => (
// // // //                                                     <th key={index}>{date}</th>
// // // //                                                 ))
// // // //                                             ) : (
// // // //                                                 <th>No dates available</th>
// // // //                                             )}
// // // //                                         </tr>
// // // //                                     </thead>
// // // //                                     <tbody>
// // // //                                         {(() => {
// // // //                                             const { students, dates, attendanceMap } = getAttendanceTableData(batchName);
// // // //                                             console.log('Rendering table with:', { students, dates, attendanceMap }); // Debug log
// // // //                                             if (!batchDetails[batchName]) {
// // // //                                                 return (
// // // //                                                     <tr>
// // // //                                                         <td colSpan="2">Batch details not found.</td>
// // // //                                                     </tr>
// // // //                                                 );
// // // //                                             }
// // // //                                             return students.length > 0 ? (
// // // //                                                 students.map((student, index) => (
// // // //                                                     <tr key={index}>
// // // //                                                         <td>{student || 'Unknown Student'}</td>
// // // //                                                         {dates.map((date, dateIndex) => (
// // // //                                                             <td key={dateIndex}>
// // // //                                                                 {attendanceMap[`${student}-${date}`] || '-'}
// // // //                                                             </td>
// // // //                                                         ))}
// // // //                                                     </tr>
// // // //                                                 ))
// // // //                                             ) : (
// // // //                                                 <tr>
// // // //                                                     <td colSpan={dates.length + 1}>No attendance data available for this batch.</td>
// // // //                                                 </tr>
// // // //                                             );
// // // //                                         })()}
// // // //                                     </tbody>
// // // //                                 </table>
// // // //                                 {/* <table className="table-data table w-full">
// // // //                                     <thead className="table-secondary">
// // // //                                         <tr>
// // // //                                             <th>Student Name</th>
// // // //                                             {batchDetails[batchName] && generateDateRange(batchDetails[batchName].startDate, batchDetails[batchName].endDate).map((date, index) => (
// // // //                                                 <th key={index}>{date}</th>
// // // //                                             ))}
// // // //                                         </tr>
// // // //                                     </thead>
// // // //                                     <tbody>
// // // //                                         {(() => {
// // // //                                             const { students, dates, attendanceMap } = getAttendanceTableData(batchName);
// // // //                                             return students.length > 0 ? (
// // // //                                                 students.map((student, index) => (
// // // //                                                     <tr key={index}>
// // // //                                                         <td>{student || 'Unknown Student'}</td>
// // // //                                                         {dates.map((date, dateIndex) => (
// // // //                                                             <td key={dateIndex}>
// // // //                                                                 {attendanceMap[`${student}-${date}`] || '-'}
// // // //                                                             </td>
// // // //                                                         ))}
// // // //                                                     </tr>
// // // //                                                 ))
// // // //                                             ) : (
// // // //                                                 <tr>
// // // //                                                     <td colSpan={(batchDetails[batchName] ? generateDateRange(batchDetails[batchName].startDate, batchDetails[batchName].endDate).length : 0) + 1}>
// // // //                                                         No attendance data available for this batch.
// // // //                                                     </td>
// // // //                                                 </tr>
// // // //                                             );
// // // //                                         })()}
// // // //                                     </tbody>
// // // //                                 </table> */}
// // // //                             </div>
// // // //                         )}
// // // //                     </div>
// // // //                 ))}
// // // //             </div>
// // // //         </div>
// // // //     );
// // // // }


// // // import React, { useState, useEffect } from 'react';
// // // import * as XLSX from 'xlsx';
// // // import { db } from '../config/firebase';
// // // import { collection, addDoc, getDocs } from 'firebase/firestore';

// // // export default function Attendance() {
// // //     const [attendanceData, setAttendanceData] = useState([]);
// // //     const [file, setFile] = useState(null);
// // //     const [batches, setBatches] = useState([]);
// // //     const [expandedBatch, setExpandedBatch] = useState(null);
// // //     const [studentsByBatch, setStudentsByBatch] = useState({});
// // //     const [batchDetails, setBatchDetails] = useState({});

// // //     const fetchBatchesAndStudents = async () => {
// // //         try {
// // //             const batchesCollection = collection(db, 'Batch');
// // //             const batchesSnapshot = await getDocs(batchesCollection);
// // //             const batchData = batchesSnapshot.docs.map(doc => ({
// // //                 id: doc.id,
// // //                 ...doc.data(),
// // //             }));
// // //             const batchMap = {};
// // //             batchData.forEach(batch => {
// // //                 batchMap[batch.batchName] = {
// // //                     startDate: new Date(batch.startDate),
// // //                     endDate: new Date(batch.endDate),
// // //                 };
// // //             });
// // //             setBatchDetails(batchMap);
// // //             setBatches(Object.keys(batchMap));

// // //             const studentsCollection = collection(db, 'student');
// // //             const studentsSnapshot = await getDocs(studentsCollection);
// // //             const allStudents = studentsSnapshot.docs.map(doc => ({
// // //                 id: doc.id,
// // //                 ...doc.data(),
// // //             }));

// // //             const studentsByBatchMap = {};
// // //             allStudents.forEach(student => {
// // //                 if (student.course_details && Array.isArray(student.course_details)) {
// // //                     student.course_details.forEach(course => {
// // //                         const batchName = course.batch;
// // //                         if (!studentsByBatchMap[batchName]) {
// // //                             studentsByBatchMap[batchName] = [];
// // //                         }
// // //                         studentsByBatchMap[batchName].push(student);
// // //                     });
// // //                 }
// // //             });

// // //             setStudentsByBatch(studentsByBatchMap);
// // //             console.log('Batches:', Object.keys(batchMap));
// // //             console.log('Students by batch:', studentsByBatchMap);
// // //         } catch (error) {
// // //             console.error('Error fetching batches and students:', error);
// // //             alert('Error fetching data. Check console for details.');
// // //         }
// // //     };

// // //     const generateDateRange = (startDate, endDate) => {
// // //         const dates = [];
// // //         let currentDate = new Date(startDate);
// // //         while (currentDate <= endDate) {
// // //             dates.push(new Date(currentDate).toLocaleDateString('en-US'));
// // //             currentDate.setDate(currentDate.getDate() + 1);
// // //         }
// // //         return dates;
// // //     };

// // //     const generateTemplate = (batchName) => {
// // //         const students = studentsByBatch[batchName] || [];
// // //         if (students.length === 0) {
// // //             alert('No students found for this batch.');
// // //             return;
// // //         }

// // //         const batch = batchDetails[batchName];
// // //         if (!batch || !batch.startDate || !batch.endDate) {
// // //             alert('Batch details (startDate or endDate) not found.');
// // //             return;
// // //         }

// // //         const dateHeaders = generateDateRange(batch.startDate, batch.endDate);
// // //         const headers = ['Student Name', ...dateHeaders];
// // //         const data = students.map(student => [
// // //             `${student.first_name} ${student.last_name}`,
// // //             ...dateHeaders.map(() => ''),
// // //         ]);

// // //         const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
// // //         const wb = XLSX.utils.book_new();
// // //         XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
// // //         XLSX.writeFile(wb, `Attendance_${batchName}.xlsx`);
// // //     };

// // //     const handleFileChange = (event) => {
// // //         const uploadedFile = event.target.files[0];
// // //         setFile(uploadedFile);
// // //         if (uploadedFile) {
// // //             processFile(uploadedFile);
// // //         }
// // //     };

// // //     const processFile = (file) => {
// // //         const reader = new FileReader();
// // //         reader.onload = (event) => {
// // //             const binaryStr = event.target.result;
// // //             const workbook = XLSX.read(binaryStr, { type: 'binary', dateNF: 'dd/mm/yyyy' });
// // //             const sheetName = workbook.SheetNames[0];
// // //             const worksheet = workbook.Sheets[sheetName];
// // //             const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// // //             if (!rawData || rawData.length < 2) {
// // //                 alert("Invalid file format. Ensure the first row contains headers.");
// // //                 return;
// // //             }

// // //             const headers = rawData[0].map(header => header.toString().trim());
// // //             console.log("Excel Headers:", headers);

// // //             const studentNameIndex = headers.findIndex(h => h.toLowerCase().includes("name"));
// // //             if (studentNameIndex === -1) {
// // //                 alert("No 'Student Name' column found in the Excel file.");
// // //                 return;
// // //             }

// // //             const dateHeaders = headers.slice(1);
// // //             const jsonData = rawData.slice(1);

// // //             const formattedData = jsonData.flatMap((row, rowIndex) => {
// // //                 const studentName = row[studentNameIndex]?.toString().trim();
// // //                 if (!studentName) {
// // //                     console.warn(`Row ${rowIndex + 2}: Missing student name`, row);
// // //                     return [];
// // //                 }

// // //                 return dateHeaders.map((date, dateIndex) => {
// // //                     const status = row[dateIndex + 1]?.toString().trim();
// // //                     return {
// // //                         batch_id: expandedBatch || "Unknown Batch",
// // //                         date: new Date(date).toISOString(),
// // //                         student_name: studentName,
// // //                         status: status || "N/A",
// // //                     };
// // //                 });
// // //             }).filter(record => record.student_name !== "Unknown");

// // //             console.log("Processed attendance data:", formattedData);
// // //             setAttendanceData(prevData => [...prevData, ...formattedData]);
// // //         };
// // //         reader.readAsBinaryString(file);
// // //     };

// // //     const uploadToFirestore = async () => {
// // //         if (!attendanceData.length) {
// // //             alert('Please select a file first');
// // //             return;
// // //         }

// // //         try {
// // //             const attendanceCollection = collection(db, 'attendance');
// // //             const validRecords = attendanceData.filter(record => 
// // //                 record.student_name && record.student_name !== "Unknown" && record.status !== "N/A"
// // //             );
// // //             if (!validRecords.length) {
// // //                 alert('No valid attendance data to upload.');
// // //                 return;
// // //             }

// // //             await Promise.all(
// // //                 validRecords.map(async (record) => {
// // //                     await addDoc(attendanceCollection, {
// // //                         batch_id: record.batch_id,
// // //                         date: new Date(record.date),
// // //                         student_name: record.student_name,
// // //                         status: record.status,
// // //                     });
// // //                 })
// // //             );

// // //             alert('Attendance data uploaded successfully!');
// // //             setFile(null);
// // //             fetchAttendanceData();
// // //         } catch (error) {
// // //             console.error('Error uploading attendance data:', error);
// // //             alert('Error uploading data. Check console for details.');
// // //         }
// // //     };

// // //     const fetchAttendanceData = async () => {
// // //         const attendanceCollection = collection(db, 'attendance');
// // //         const snapshot = await getDocs(attendanceCollection);
// // //         const fetchedData = snapshot.docs.map(doc => ({
// // //             id: doc.id,
// // //             ...doc.data(),
// // //             date: doc.data().date.toDate(),
// // //         }));
// // //         setAttendanceData(fetchedData);
// // //         console.log('Fetched attendance data:', fetchedData);
// // //     };

// // //     useEffect(() => {
// // //         fetchBatchesAndStudents();
// // //         fetchAttendanceData();
// // //     }, []);

// // //     const toggleBatch = (batchName) => {
// // //         setExpandedBatch(expandedBatch === batchName ? null : batchName);
// // //         setFile(null);
// // //     };

// // //     const getAttendanceTableData = (batchName) => {
// // //         const batchAttendance = attendanceData.filter(record => record.batch_id === batchName);
// // //         if (!batchAttendance.length) {
// // //             console.log(`No attendance data found for batch: ${batchName}`);
// // //             return { students: [], dates: [], attendanceMap: {} };
// // //         }

// // //         const batch = batchDetails[batchName];
// // //         if (!batch) return { students: [], dates: [] };

// // //         const dates = generateDateRange(batch.startDate, batch.endDate);
// // //         const students = [...new Set(batchAttendance.map(record => record.student_name))];
// // //         const attendanceMap = {};

// // //         batchAttendance.forEach(record => {
// // //             const dateStr = new Date(record.date).toLocaleDateString('en-US');
// // //             attendanceMap[`${record.student_name}-${dateStr}`] = record.status;
// // //         });

// // //         console.log('Attendance table data:', { batchName, students, dates, attendanceMap });
// // //         return { students, dates, attendanceMap };
// // //     };

// // //     return (
// // //         <div className="p-20">
// // //             <h2 className="text-xl font-bold mb-4">Batch List</h2>
// // //             <div className="space-y-2">
// // //                 {batches.map(batchName => (
// // //                     <div key={batchName} className="border rounded-md">
// // //                         <button
// // //                             onClick={() => toggleBatch(batchName)}
// // //                             className="w-full text-left p-2 bg-blue-100 hover:bg-blue-200 flex justify-between items-center"
// // //                         >
// // //                             <span>{batchName}</span>
// // //                             <span>{expandedBatch === batchName ? '▼' : '▶'}</span>
// // //                         </button>
// // //                         {expandedBatch === batchName && (
// // //                             <div className="p-4 bg-white">
// // //                                 <button
// // //                                     onClick={() => generateTemplate(batchName)}
// // //                                     className="mb-4 btn btn-secondary bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-200"
// // //                                 >
// // //                                     Download Attendance Template
// // //                                 </button>
// // //                                 <div className="mt-4 mb-4">
// // //                                     <input
// // //                                         type="file"
// // //                                         accept=".xlsx, .xls"
// // //                                         onChange={handleFileChange}
// // //                                         className="mb-2"
// // //                                     />
// // //                                     <button
// // //                                         onClick={uploadToFirestore}
// // //                                         className="ml-2 btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
// // //                                     >
// // //                                         Upload to Database
// // //                                     </button>
// // //                                 </div>
// // //                                 <h3 className="font-semibold mb-2">Attendance Data for {batchName}</h3>
// // //                                 <table className="table-data table w-full">
// // //                                     <thead className="table-secondary">
// // //                                         <tr>
// // //                                             <th>Student Name</th>
// // //                                             {batchDetails[batchName] ? (
// // //                                                 generateDateRange(batchDetails[batchName].startDate, batchDetails[batchName].endDate).map((date, index) => (
// // //                                                     <th key={index}>{date}</th>
// // //                                                 ))
// // //                                             ) : (
// // //                                                 <th>No dates available</th>
// // //                                             )}
// // //                                         </tr>
// // //                                     </thead>
// // //                                     <tbody>
// // //                                         {(() => {
// // //                                             const { students, dates, attendanceMap } = getAttendanceTableData(batchName);
// // //                                             console.log('Rendering table with:', { students, dates, attendanceMap });
// // //                                             if (!batchDetails[batchName]) {
// // //                                                 return (
// // //                                                     <tr>
// // //                                                         <td colSpan="2">Batch details not found.</td>
// // //                                                     </tr>
// // //                                                 );
// // //                                             }
// // //                                             return students.length > 0 ? (
// // //                                                 students.map((student, index) => (
// // //                                                     <tr key={index}>
// // //                                                         <td>{student || 'Unknown Student'}</td>
// // //                                                         {dates.map((date, dateIndex) => (
// // //                                                             <td key={dateIndex}>
// // //                                                                 {attendanceMap[`${student}-${date}`] || '-'}
// // //                                                             </td>
// // //                                                         ))}
// // //                                                     </tr>
// // //                                                 ))
// // //                                             ) : (
// // //                                                 <tr>
// // //                                                     <td colSpan={dates.length + 1}>No attendance data available for this batch.</td>
// // //                                                 </tr>
// // //                                             );
// // //                                         })()}
// // //                                     </tbody>
// // //                                 </table>
// // //                             </div>
// // //                         )}
// // //                     </div>
// // //                 ))}
// // //             </div>
// // //         </div>
// // //     );
// // // }


// // import React, { useState, useEffect } from 'react';
// // import * as XLSX from 'xlsx';
// // import { db } from '../config/firebase';
// // import { collection, addDoc, getDocs } from 'firebase/firestore';

// // export default function Attendance() {
// //   const [attendanceData, setAttendanceData] = useState([]);
// //   const [file, setFile] = useState(null);
// //   const [batches, setBatches] = useState([]);
// //   const [expandedBatch, setExpandedBatch] = useState(null);
// //   const [studentsByBatch, setStudentsByBatch] = useState({});
// //   const [batchDetails, setBatchDetails] = useState({});

// //   const fetchBatchesAndStudents = async () => {
// //     try {
// //       const batchesCollection = collection(db, 'Batch');
// //       const batchesSnapshot = await getDocs(batchesCollection);
// //       const batchData = batchesSnapshot.docs.map(doc => ({
// //         id: doc.id,
// //         ...doc.data(),
// //       }));
// //       const batchMap = {};
// //       batchData.forEach(batch => {
// //         batchMap[batch.batchName] = {
// //           startDate: new Date(batch.startDate),
// //           endDate: new Date(batch.endDate),
// //         };
// //       });
// //       setBatchDetails(batchMap);
// //       setBatches(Object.keys(batchMap));

// //       const studentsCollection = collection(db, 'student');
// //       const studentsSnapshot = await getDocs(studentsCollection);
// //       const allStudents = studentsSnapshot.docs.map(doc => ({
// //         id: doc.id,
// //         ...doc.data(),
// //       }));

// //       const studentsByBatchMap = {};
// //       allStudents.forEach(student => {
// //         if (student.course_details && Array.isArray(student.course_details)) {
// //           student.course_details.forEach(course => {
// //             const batchName = course.batch;
// //             if (!studentsByBatchMap[batchName]) {
// //               studentsByBatchMap[batchName] = [];
// //             }
// //             studentsByBatchMap[batchName].push(student);
// //           });
// //         }
// //       });

// //       setStudentsByBatch(studentsByBatchMap);
// //       console.log('Batches:', Object.keys(batchMap));
// //       console.log('Students by batch:', studentsByBatchMap);
// //     } catch (error) {
// //       console.error('Error fetching batches and students:', error);
// //       alert('Error fetching data. Check console for details.');
// //     }
// //   };

// //   const generateDateRange = (startDate, endDate) => {
// //     const dates = [];
// //     let currentDate = new Date(startDate);
// //     while (currentDate <= endDate) {
// //       dates.push(new Date(currentDate).toLocaleDateString('en-US'));
// //       currentDate.setDate(currentDate.getDate() + 1);
// //     }
// //     return dates;
// //   };

// //   const generateTemplate = (batchName) => {
// //     const students = studentsByBatch[batchName] || [];
// //     if (students.length === 0) {
// //       alert('No students found for this batch.');
// //       return;
// //     }

// //     const batch = batchDetails[batchName];
// //     if (!batch || !batch.startDate || !batch.endDate) {
// //       alert('Batch details (startDate or endDate) not found.');
// //       return;
// //     }

// //     const dateHeaders = generateDateRange(batch.startDate, batch.endDate);
// //     const headers = ['Student Name', ...dateHeaders];
// //     const data = students.map(student => [
// //       `${student.first_name} ${student.last_name}`,
// //       ...dateHeaders.map(() => ''),
// //     ]);

// //     const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
// //     const wb = XLSX.utils.book_new();
// //     XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
// //     XLSX.writeFile(wb, `Attendance_${batchName}.xlsx`);
// //   };

// //   const handleFileChange = (event) => {
// //     const uploadedFile = event.target.files[0];
// //     setFile(uploadedFile);
// //     if (uploadedFile) {
// //       processFile(uploadedFile);
// //     }
// //   };

// //   const processFile = (file) => {
// //     const reader = new FileReader();
// //     reader.onload = (event) => {
// //       const binaryStr = event.target.result;
// //       const workbook = XLSX.read(binaryStr, { type: 'binary', dateNF: 'dd/mm/yyyy' });
// //       const sheetName = workbook.SheetNames[0];
// //       const worksheet = workbook.Sheets[sheetName];
// //       const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// //       if (!rawData || rawData.length < 2) {
// //         alert("Invalid file format. Ensure the first row contains headers.");
// //         return;
// //       }

// //       const headers = rawData[0].map(header => header.toString().trim());
// //       console.log("Excel Headers:", headers);

// //       const studentNameIndex = headers.findIndex(h => h.toLowerCase().includes("name"));
// //       if (studentNameIndex === -1) {
// //         alert("No 'Student Name' column found浅in the Excel file.");
// //         return;
// //       }

// //       const dateHeaders = headers.slice(1);
// //       const jsonData = rawData.slice(1);

// //       const formattedData = jsonData.flatMap((row, rowIndex) => {
// //         const studentName = row[studentNameIndex]?.toString().trim();
// //         if (!studentName) {
// //           console.warn(`Row ${rowIndex + 2}: Missing student name`, row);
// //           return [];
// //         }

// //         return dateHeaders.map((date, dateIndex) => {
// //           const status = row[dateIndex + 1]?.toString().trim();
// //           return {
// //             batch_id: expandedBatch || "Unknown Batch",
// //             date: new Date(date).toISOString(),
// //             student_name: studentName,
// //             status: status || "N/A",
// //           };
// //         });
// //       }).filter(record => record.student_name !== "Unknown");

// //       console.log("Processed attendance data:", formattedData);
// //       setAttendanceData(prevData => [...prevData, ...formattedData]);
// //     };
// //     reader.readAsBinaryString(file);
// //   };

// //   const uploadToFirestore = async () => {
// //     if (!attendanceData.length) {
// //       alert('Please select a file first');
// //       return;
// //     }

// //     try {
// //       const attendanceCollection = collection(db, 'attendance');
// //       const validRecords = attendanceData.filter(record => 
// //         record.student_name && record.student_name !== "Unknown" && record.status !== "N/A"
// //       );
// //       if (!validRecords.length) {
// //         alert('No valid attendance data to upload.');
// //         return;
// //       }

// //       await Promise.all(
// //         validRecords.map(async (record) => {
// //           await addDoc(attendanceCollection, {
// //             batch_id: record.batch_id,
// //             date: new Date(record.date),
// //             student_name: record.student_name,
// //             status: record.status,
// //           });
// //         })
// //       );

// //       alert('Attendance data uploaded successfully!');
// //       setFile(null);
// //       fetchAttendanceData();
// //     } catch (error) {
// //       console.error('Error uploading attendance data:', error);
// //       alert('Error uploading data. Check console for details.');
// //     }
// //   };

// //   const fetchAttendanceData = async () => {
// //     const attendanceCollection = collection(db, 'attendance');
// //     const snapshot = await getDocs(attendanceCollection);
// //     const fetchedData = snapshot.docs.map(doc => ({
// //       id: doc.id,
// //       ...doc.data(),
// //       date: doc.data().date.toDate(),
// //     }));
// //     setAttendanceData(fetchedData);
// //     console.log('Fetched attendance data:', fetchedData);
// //   };

// //   useEffect(() => {
// //     fetchBatchesAndStudents();
// //     fetchAttendanceData();
// //   }, []);

// //   const toggleBatch = (batchName) => {
// //     setExpandedBatch(prev => (prev === batchName ? null : batchName));
// //     setFile(null);
// //   };

// //   const getAttendanceTableData = (batchName) => {
// //     const batchAttendance = attendanceData.filter(record => record.batch_id === batchName);
// //     if (!batchAttendance.length) {
// //       console.log(`No attendance data found for batch: ${batchName}`);
// //       return { students: [], dates: [], attendanceMap: {} };
// //     }

// //     const batch = batchDetails[batchName];
// //     if (!batch) return { students: [], dates: [] };

// //     const dates = generateDateRange(batch.startDate, batch.endDate);
// //     const students = [...new Set(batchAttendance.map(record => record.student_name))];
// //     const attendanceMap = {};

// //     batchAttendance.forEach(record => {
// //       const dateStr = new Date(record.date).toLocaleDateString('en-US');
// //       attendanceMap[`${record.student_name}-${dateStr}`] = record.status;
// //     });

// //     console.log('Attendance table data:', { batchName, students, dates, attendanceMap });
// //     return { students, dates, attendanceMap };
// //   };

// //   return (
// //     <div className="p-20">
// //       <h2 className="text-xl font-bold mb-4">Batch List</h2>
// //       <div className="space-y-2 batch-container">
// //         {batches.map(batchName => (
// //           <div key={batchName} className="border rounded-md">
// //             <button
// //               onClick={() => toggleBatch(batchName)}
// //               className="w-full text-left p-2 bg-blue-100 hover:bg-blue-200 flex justify-between items-center"
// //             >
// //               <span>{batchName}</span>
// //               <span>{expandedBatch === batchName ? '▼' : '▶'}</span>
// //             </button>
// //             {expandedBatch === batchName && (
// //               <div className="p-4 bg-white">
// //                 <button
// //                   onClick={() => generateTemplate(batchName)}
// //                   className="mb-4 btn btn-secondary bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-200"
// //                 >
// //                   Download Attendance Template
// //                 </button>
// //                 <div className="mt-4 mb-4">
// //                   <input
// //                     type="file"
// //                     accept=".xlsx, .xls"
// //                     onChange={handleFileChange}
// //                     className="mb-2"
// //                   />
// //                   <button
// //                     onClick={uploadToFirestore}
// //                     className="ml-2 btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
// //                   >
// //                     Upload to Database
// //                   </button>
// //                 </div>
// //                 <h3 className="font-semibold mb-2">Attendance Data for {batchName}</h3>
// //                 <table className="table-data table w-full">
// //                   <thead className="table-secondary">
// //                     <tr>
// //                       <th>Student Name</th>
// //                       {batchDetails[batchName] ? (
// //                         generateDateRange(batchDetails[batchName].startDate, batchDetails[batchName].endDate).map((date, index) => (
// //                           <th key={index}>{date}</th>
// //                         ))
// //                       ) : (
// //                         <th>No dates available</th>
// //                       )}
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {(() => {
// //                       const { students, dates, attendanceMap } = getAttendanceTableData(batchName);
// //                       console.log('Rendering table with:', { students, dates, attendanceMap });
// //                       if (!batchDetails[batchName]) {
// //                         return (
// //                           <tr>
// //                             <td colSpan="2">Batch details not found.</td>
// //                           </tr>
// //                         );
// //                       }
// //                       return students.length > 0 ? (
// //                         students.map((student, index) => (
// //                           <tr key={index}>
// //                             <td>{student || 'Unknown Student'}</td>
// //                             {dates.map((date, dateIndex) => (
// //                               <td key={dateIndex}>
// //                                 {attendanceMap[`${student}-${date}`] || '-'}
// //                               </td>
// //                             ))}
// //                           </tr>
// //                         ))
// //                       ) : (
// //                         <tr>
// //                           <td colSpan={dates.length + 1}>No attendance data available for this batch.</td>
// //                         </tr>
// //                       );
// //                     })()}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             )}
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }


// import React, { useState, useEffect } from 'react';
// import * as XLSX from 'xlsx';
// import { db } from '../config/firebase';
// import { collection, addDoc, getDocs } from 'firebase/firestore';

// export default function Attendance() {
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [file, setFile] = useState(null);
//   const [batches, setBatches] = useState([]);
//   const [expandedBatch, setExpandedBatch] = useState(null);
//   const [studentsByBatch, setStudentsByBatch] = useState({});
//   const [batchDetails, setBatchDetails] = useState({});
//   const [centers, setCenters] = useState([]);
//   const [selectedCenter, setSelectedCenter] = useState('');

//   const fetchCenters = async () => {
//     try {
//       const centersCollection = collection(db, 'instituteSetup');
//       const centersSnapshot = await getDocs(centersCollection);
//       const centersData = await Promise.all(
//         centersSnapshot.docs.map(async (doc) => {
//           const branchesCollection = collection(db, 'instituteSetup', doc.id, 'Center');
//           const branchesSnapshot = await getDocs(branchesCollection);
//           return branchesSnapshot.docs.map(branchDoc => ({
//             id: branchDoc.id,
//             ...branchDoc.data()
//           }));
//         })
//       );
//       const allCenters = centersData.flat();
//       setCenters(allCenters);
//     } catch (error) {
//       console.error('Error fetching centers:', error);
//       alert('Error fetching centers. Check console for details.');
//     }
//   };

//   const fetchBatchesAndStudents = async (centerId) => {
//     try {
//       const batchesCollection = collection(db, 'Batch');
//       const batchesSnapshot = await getDocs(batchesCollection);
//       let batchData = batchesSnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data(),
//       }));

//       // Filter batches by selected center if centerId is provided
//       if (centerId) {
//         batchData = batchData.filter(batch => 
//           batch.centers && Array.isArray(batch.centers) && batch.centers.includes(centerId)
//         );
//       }

//       const batchMap = {};
//       batchData.forEach(batch => {
//         batchMap[batch.batchName] = {
//           startDate: new Date(batch.startDate),
//           endDate: new Date(batch.endDate),
//           centers: batch.centers || [] // Store centers array for reference
//         };
//       });
//       setBatchDetails(batchMap);
//       setBatches(Object.keys(batchMap));

//       const studentsCollection = collection(db, 'student');
//       const studentsSnapshot = await getDocs(studentsCollection);
//       const allStudents = studentsSnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data(),
//       }));

//       const studentsByBatchMap = {};
//       allStudents.forEach(student => {
//         if (student.course_details && Array.isArray(student.course_details)) {
//           student.course_details.forEach(course => {
//             const batchName = course.batch;
//             if (batchMap[batchName]) { // Only include students from filtered batches
//               if (!studentsByBatchMap[batchName]) {
//                 studentsByBatchMap[batchName] = [];
//               }
//               studentsByBatchMap[batchName].push(student);
//             }
//           });
//         }
//       });

//       setStudentsByBatch(studentsByBatchMap);
//       console.log('Filtered Batches:', Object.keys(batchMap));
//       console.log('Students by batch:', studentsByBatchMap);
//     } catch (error) {
//       console.error('Error fetching batches and students:', error);
//       alert('Error fetching data. Check console for details.');
//     }
//   };

//   const generateDateRange = (startDate, endDate) => {
//     const dates = [];
//     let currentDate = new Date(startDate);
//     while (currentDate <= endDate) {
//       dates.push(new Date(currentDate).toLocaleDateString('en-US'));
//       currentDate.setDate(currentDate.getDate() + 1);
//     }
//     return dates;
//   };

//   const generateTemplate = (batchName) => {
//     const students = studentsByBatch[batchName] || [];
//     if (students.length === 0) {
//       alert('No students found for this batch.');
//       return;
//     }

//     const batch = batchDetails[batchName];
//     if (!batch || !batch.startDate || !batch.endDate) {
//       alert('Batch details (startDate or endDate) not found.');
//       return;
//     }

//     const dateHeaders = generateDateRange(batch.startDate, batch.endDate);
//     const headers = ['Student Name', ...dateHeaders];
//     const data = students.map(student => [
//       `${student.first_name} ${student.last_name}`,
//       ...dateHeaders.map(() => ''),
//     ]);

//     const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
//     XLSX.writeFile(wb, `Attendance_${batchName}.xlsx`);
//   };

//   const handleFileChange = (event) => {
//     const uploadedFile = event.target.files[0];
//     setFile(uploadedFile);
//     if (uploadedFile) {
//       processFile(uploadedFile);
//     }
//   };

//   const processFile = (file) => {
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const binaryStr = event.target.result;
//       const workbook = XLSX.read(binaryStr, { type: 'binary', dateNF: 'dd/mm/yyyy' });
//       const sheetName = workbook.SheetNames[0];
//       const worksheet = workbook.Sheets[sheetName];
//       const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

//       if (!rawData || rawData.length < 2) {
//         alert("Invalid file format. Ensure the first row contains headers.");
//         return;
//       }

//       const headers = rawData[0].map(header => header.toString().trim());
//       console.log("Excel Headers:", headers);

//       const studentNameIndex = headers.findIndex(h => h.toLowerCase().includes("name"));
//       if (studentNameIndex === -1) {
//         alert("No 'Student Name' column found in the Excel file.");
//         return;
//       }

//       const dateHeaders = headers.slice(1);
//       const jsonData = rawData.slice(1);

//       const formattedData = jsonData.flatMap((row, rowIndex) => {
//         const studentName = row[studentNameIndex]?.toString().trim();
//         if (!studentName) {
//           console.warn(`Row ${rowIndex + 2}: Missing student name`, row);
//           return [];
//         }

//         return dateHeaders.map((date, dateIndex) => {
//           const status = row[dateIndex + 1]?.toString().trim();
//           return {
//             batch_id: expandedBatch || "Unknown Batch",
//             date: new Date(date).toISOString(),
//             student_name: studentName,
//             status: status || "N/A",
//             centerId: selectedCenter // Include selected center in the record
//           };
//         });
//       }).filter(record => record.student_name !== "Unknown");

//       console.log("Processed attendance data:", formattedData);
//       setAttendanceData(prevData => [...prevData, ...formattedData]);
//     };
//     reader.readAsBinaryString(file);
//   };

//   const uploadToFirestore = async () => {
//     if (!attendanceData.length) {
//       alert('Please select a file first');
//       return;
//     }

//     try {
//       const attendanceCollection = collection(db, 'attendance');
//       const validRecords = attendanceData.filter(record => 
//         record.student_name && record.student_name !== "Unknown" && record.status !== "N/A"
//       );
//       if (!validRecords.length) {
//         alert('No valid attendance data to upload.');
//         return;
//       }

//       await Promise.all(
//         validRecords.map(async (record) => {
//           await addDoc(attendanceCollection, {
//             batch_id: record.batch_id,
//             date: new Date(record.date),
//             student_name: record.student_name,
//             status: record.status,
//             centerId: record.centerId // Store centerId with attendance
//           });
//         })
//       );

//       alert('Attendance data uploaded successfully!');
//       setFile(null);
//       fetchAttendanceData();
//     } catch (error) {
//       console.error('Error uploading attendance data:', error);
//       alert('Error uploading data. Check console for details.');
//     }
//   };

//   const fetchAttendanceData = async () => {
//     const attendanceCollection = collection(db, 'attendance');
//     const snapshot = await getDocs(attendanceCollection);
//     const fetchedData = snapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data(),
//       date: doc.data().date.toDate(),
//     }));
//     setAttendanceData(fetchedData);
//     console.log('Fetched attendance data:', fetchedData);
//   };

//   useEffect(() => {
//     fetchCenters();
//     fetchBatchesAndStudents(); // Initially fetch all batches
//   }, []);

//   const handleCenterChange = (e) => {
//     const centerId = e.target.value;
//     setSelectedCenter(centerId);
//     fetchBatchesAndStudents(centerId); // Fetch batches filtered by selected center
//   };

//   const toggleBatch = (batchName) => {
//     setExpandedBatch(prev => (prev === batchName ? null : batchName));
//     setFile(null);
//   };

//   const getAttendanceTableData = (batchName) => {
//     const batchAttendance = attendanceData.filter(record => 
//       record.batch_id === batchName && (!selectedCenter || record.centerId === selectedCenter)
//     );
//     if (!batchAttendance.length) {
//       console.log(`No attendance data found for batch: ${batchName}`);
//       return { students: [], dates: [], attendanceMap: {} };
//     }

//     const batch = batchDetails[batchName];
//     if (!batch) return { students: [], dates: [] };

//     const dates = generateDateRange(batch.startDate, batch.endDate);
//     const students = [...new Set(batchAttendance.map(record => record.student_name))];
//     const attendanceMap = {};

//     batchAttendance.forEach(record => {
//       const dateStr = new Date(record.date).toLocaleDateString('en-US');
//       attendanceMap[`${record.student_name}-${dateStr}`] = record.status;
//     });

//     console.log('Attendance table data:', { batchName, students, dates, attendanceMap });
//     return { students, dates, attendanceMap };
//   };

//   return (
//     <div className="p-20">
//       <h2 className="text-xl font-bold mb-4">Attendance Management</h2>
//       <div className="mb-4">
//         <label htmlFor="centerSelect" className="block text-sm font-medium text-gray-700">Select Center</label>
//         <select
//           id="centerSelect"
//           value={selectedCenter}
//           onChange={handleCenterChange}
//           className="mt-1 block w-1/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//         >
//           <option value="">All Centers</option>
//           {centers.map(center => (
//             <option key={center.id} value={center.id}>{center.name}</option>
//           ))}
//         </select>
//       </div>
//       <h3 className="text-lg font-semibold mb-2">Batch List</h3>
//       <div className="space-y-2 batch-container">
//         {batches.length > 0 ? (
//           batches.map(batchName => (
//             <div key={batchName} className="border rounded-md">
//               <button
//                 onClick={() => toggleBatch(batchName)}
//                 className="w-full text-left p-2 bg-blue-100 hover:bg-blue-200 flex justify-between items-center"
//               >
//                 <span>{batchName}</span>
//                 <span>{expandedBatch === batchName ? '▼' : '▶'}</span>
//               </button>
//               {expandedBatch === batchName && (
//                 <div className="p-4 bg-white">
//                   <button
//                     onClick={() => generateTemplate(batchName)}
//                     className="mb-4 btn btn-secondary bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-200"
//                   >
//                     Download Attendance Template
//                   </button>
//                   <div className="mt-4 mb-4">
//                     <input
//                       type="file"
//                       accept=".xlsx, .xls"
//                       onChange={handleFileChange}
//                       className="mb-2"
//                     />
//                     <button
//                       onClick={uploadToFirestore}
//                       className="ml-2 btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
//                     >
//                       Upload to Database
//                     </button>
//                   </div>
//                   <h3 className="font-semibold mb-2">Attendance Data for {batchName}</h3>
//                   <table className="table-data table w-full">
//                     <thead className="table-secondary">
//                       <tr>
//                         <th>Student Name</th>
//                         {batchDetails[batchName] ? (
//                           generateDateRange(batchDetails[batchName].startDate, batchDetails[batchName].endDate).map((date, index) => (
//                             <th key={index}>{date}</th>
//                           ))
//                         ) : (
//                           <th>No dates available</th>
//                         )}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {(() => {
//                         const { students, dates, attendanceMap } = getAttendanceTableData(batchName);
//                         console.log('Rendering table with:', { students, dates, attendanceMap });
//                         if (!batchDetails[batchName]) {
//                           return (
//                             <tr>
//                               <td colSpan="2">Batch details not found.</td>
//                             </tr>
//                           );
//                         }
//                         return students.length > 0 ? (
//                           students.map((student, index) => (
//                             <tr key={index}>
//                               <td>{student || 'Unknown Student'}</td>
//                               {dates.map((date, dateIndex) => (
//                                 <td key={dateIndex}>
//                                   {attendanceMap[`${student}-${date}`] || '-'}
//                                 </td>
//                               ))}
//                             </tr>
//                           ))
//                         ) : (
//                           <tr>
//                             <td colSpan={dates.length + 1}>No attendance data available for this batch.</td>
//                           </tr>
//                         );
//                       })()}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           ))
//         ) : (
//           <p>No batches available for the selected center.</p>
//         )}
//       </div>
//     </div>
//   );
// }


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