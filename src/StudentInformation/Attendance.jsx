// // import React, { useState, useEffect } from 'react';
// // import * as XLSX from 'xlsx';
// // import { db } from '../config/firebase';
// // import { collection, addDoc, getDocs } from 'firebase/firestore';

// // export default function  Attendance ({studentId}) {
// //     const [attendanceData, setAttendanceData] = useState([]);
// //     const [file, setFile] = useState(null);
    
// //     const handleFileChange = (event) => {
// //         const uploadedFile = event.target.files[0];
// //         setFile(uploadedFile);
// //     };

// //     const handleFileUpload = async (e) => {
// //         const file = e.target.files[0];
// //         if (!file) return;

// //         const reader = new FileReader();

// //         reader.onload = async (event) => {
// //             const binaryStr = event.target.result;
// //             const workbook = XLSX.read(binaryStr, { type: 'binary' });
// //             const sheetName = workbook.SheetNames[0];

// //             const worksheet = workbook.Sheets[sheetName];
// //             const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// //             const formattedData = jsonData.slice(1).map(row => ({
// //                 batch_id: row[0].trim(), 
// //                 date: new Date(row[1].trim()),
// //                 status: row[2].trim(), 
// //                 student_id: row[3].trim(), 
// //                 subject_id: row[4].trim() 
// //             }));

// //             setAttendanceData(formattedData);

// //             await uploadToFirestore(formattedData);
// //         };

// //         reader.readAsBinaryString(file);
// //     };

// //     const uploadToFirestore = async (data) => {
// //         try {
// //             const attendanceCollection = collection(db, 'attendance'); 
// //             await Promise.all(data.map(async (record) => {
// //                 await addDoc(attendanceCollection, {
// //                     batch_id: { path: record.batch_id }, 
// //                     date: record.date, 
// //                     status: record.status,
// //                     student_id: { path: record.student_id }, 
// //                     subject_id: { path: record.subject_id } 
// //                 });
// //             }));
// //             alert('Attendance data uploaded successfully!');
// //         } catch (error) {
// //             console.error('Error uploading attendance data: ', error);
// //         }
// //     };

// //     const fetchAttendanceData = async () => {
// //         const attendanceCollection = collection(db, 'attendance');
// //         const snapshot = await getDocs(attendanceCollection);
// //         const fetchedData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// //         setAttendanceData(fetchedData);
// //     };

// //     useEffect(() => {
// //         fetchAttendanceData(); 
// //     }, []);

// //     return (
// //         <div className="attendance-component">            
// //             <a href="./AttendenceSheet.xlsx" download>Download Attendance Template</a> 
            
// //             <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
// //             <button onClick={handleFileUpload} className='ml-2 btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200'>Upload Attendance</button>

// //             <h2>Attendance Data</h2>
// //             <table className='table-data table'>
// //                 <thead className='table-secondary'>
// //                     <tr>
// //                         <th>Batch ID</th>
// //                         <th>Date</th>
// //                         <th>Status</th>
// //                         <th>Student ID</th>
// //                         <th>Subject ID</th>
// //                     </tr>
// //                 </thead>
// //                 <tbody>
// //                     {attendanceData.map((record, index) => (
// //                         <tr key={index}>
// //                             <td>{record.batch_id}</td>
// //                             <td>{new Date(record.date).toLocaleString()}</td>
// //                             <td>{record.status}</td>
// //                             <td>{record.student_id}</td>
// //                             <td>{record.subject_id}</td>
// //                         </tr>
// //                     ))}
// //                 </tbody>
// //             </table>
// //         </div>
// //     );
// // };

// import React, { useState, useEffect } from 'react';
// import * as XLSX from 'xlsx';
// import { db } from '../config/firebase';
// import { collection, addDoc, getDocs } from 'firebase/firestore';

// export default function Attendance({ studentId }) {
//     const [attendanceData, setAttendanceData] = useState([]);
//     const [file, setFile] = useState(null);

//     // Handle file selection
//     const handleFileChange = (event) => {
//         const uploadedFile = event.target.files[0];
//         setFile(uploadedFile);
//         if (uploadedFile) {
//             processFile(uploadedFile);
//         }
//     };

//     // Process the Excel file
//     const processFile = (file) => {
//         const reader = new FileReader();

//         reader.onload = (event) => {
//             const binaryStr = event.target.result;
//             const workbook = XLSX.read(binaryStr, { type: 'binary' });
//             const sheetName = workbook.SheetNames[0];
//             const worksheet = workbook.Sheets[sheetName];
//             const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

//             const formattedData = jsonData.slice(1).map(row => ({
//                 batch_id: row[0]?.trim() || '',
//                 date: row[1] ? new Date(row[1].trim()) : new Date(),
//                 status: row[2]?.trim() || '',
//                 student_id: row[3]?.trim() || '',
//                 subject_id: row[4]?.trim() || ''
//             }));

//             setAttendanceData(formattedData);
//         };

//         reader.readAsBinaryString(file);
//     };

//     // Upload to Firestore
//     const uploadToFirestore = async () => {
//         if (!attendanceData.length) {
//             alert('Please select a file first');
//             return;
//         }

//         try {
//             const attendanceCollection = collection(db, 'attendance');
//             await Promise.all(attendanceData.map(async (record) => {
//                 await addDoc(attendanceCollection, {
//                     batch_id: record.batch_id,
//                     date: record.date,
//                     status: record.status,
//                     student_id: record.student_id,
//                     subject_id: record.subject_id
//                 });
//             }));
//             alert('Attendance data uploaded successfully!');
//         } catch (error) {
//             console.error('Error uploading attendance data: ', error);
//             alert('Error uploading data. Check console for details.');
//         }
//     };

//     const fetchAttendanceData = async () => {
//         const attendanceCollection = collection(db, 'attendance');
//         const snapshot = await getDocs(attendanceCollection);
//         const fetchedData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         setAttendanceData(fetchedData);
//     };

//     useEffect(() => {
//         fetchAttendanceData();
//     }, []);

//     return (
//         <div className="attendance-component">
//             <a href="./AttendenceSheet.xls" download>Download Attendance Template</a>

//             <div className="mt-4">
//                 <input 
//                     type="file" 
//                     accept=".xlsx, .xls" 
//                     onChange={handleFileChange}
//                     className="mb-2"
//                 />
//                 <button 
//                     onClick={uploadToFirestore}
//                     className="ml-2 btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
//                 >
//                     Upload to Database
//                 </button>
//             </div>

//             <h2 className="mt-4">Attendance Data</h2>
//             <table className="table-data table">
//                 <thead className="table-secondary">
//                     <tr>
//                         <th>Batch ID</th>
//                         <th>Date</th>
//                         <th>Status</th>
//                         <th>Student ID</th>
//                         <th>Subject ID</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {attendanceData.length > 0 ? (
//                         attendanceData.map((record, index) => (
//                             <tr key={index}>
//                                 <td>{record.batch_id}</td>
//                                 <td>{new Date(record.date).toLocaleString()}</td>
//                                 <td>{record.status}</td>
//                                 <td>{record.student_id}</td>
//                                 <td>{record.subject_id}</td>
//                             </tr>
//                         ))
//                     ) : (
//                         <tr>
//                             <td colSpan="5">No data available. Upload an Excel file to see records.</td>
//                         </tr>
//                     )}
//                 </tbody>
//             </table>
//         </div>
//     );
// };


// import React, { useState, useEffect } from 'react';
// import * as XLSX from 'xlsx';
// import { db } from '../config/firebase';
// import { collection, addDoc, getDocs } from 'firebase/firestore';

// export default function Attendance({ studentId }) {
//     const [attendanceData, setAttendanceData] = useState([]);
//     const [file, setFile] = useState(null);

//     // Generate and download Excel template
//     const generateTemplate = () => {
//         // Define headers
//         const headers = [['Batch', 'Date', 'Student', 'Status', 'Subject']];
        
//         // Create a new workbook and worksheet
//         const ws = XLSX.utils.aoa_to_sheet(headers);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, 'Attendance');

//         // Generate and download the file
//         XLSX.writeFile(wb, 'AttendanceTemplate.xlsx');
//     };

//     const handleFileChange = (event) => {
//         const uploadedFile = event.target.files[0];
//         setFile(uploadedFile);
//         if (uploadedFile) {
//             processFile(uploadedFile);
//         }
//     };

//     const processFile = (file) => {
//         const reader = new FileReader();

//         reader.onload = (event) => {
//             const binaryStr = event.target.result;
//             const workbook = XLSX.read(binaryStr, { type: 'binary' });
//             const sheetName = workbook.SheetNames[0];
//             const worksheet = workbook.Sheets[sheetName];
//             const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: ['batch_id', 'date', 'student_id', 'status', 'subject_id'], range: 1 });

//             const formattedData = jsonData.map(row => ({
//                 batch_id: row.batch_id?.trim() || '',
//                 date: row.date ? new Date(row.date) : new Date(),
//                 status: row.status?.trim() || '',
//                 student_id: row.student_id?.trim() || '',
//                 subject_id: row.subject_id?.trim() || ''
//             }));

//             setAttendanceData(formattedData);
//         };

//         reader.readAsBinaryString(file);
//     };

//     const uploadToFirestore = async () => {
//         if (!attendanceData.length) {
//             alert('Please select a file first');
//             return;
//         }

//         try {
//             const attendanceCollection = collection(db, 'attendance');
//             await Promise.all(attendanceData.map(async (record) => {
//                 await addDoc(attendanceCollection, {
//                     batch_id: record.batch_id,
//                     date: record.date,
//                     status: record.status,
//                     student_id: record.student_id,
//                     subject_id: record.subject_id
//                 });
//             }));
//             alert('Attendance data uploaded successfully!');
//         } catch (error) {
//             console.error('Error uploading attendance data: ', error);
//             alert('Error uploading data. Check console for details.');
//         }
//     };

//     const fetchAttendanceData = async () => {
//         const attendanceCollection = collection(db, 'attendance');
//         const snapshot = await getDocs(attendanceCollection);
//         const fetchedData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         setAttendanceData(fetchedData);
//     };

//     useEffect(() => {
//         fetchAttendanceData();
//     }, []);

//     return (
//         <div className="attendance-component">
//             <button 
//                 onClick={generateTemplate}
//                 className="mb-4 btn btn-secondary bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-200"
//             >
//                 Download Attendance Template
//             </button>

//             <div className="mt-4">
//                 <input 
//                     type="file" 
//                     accept=".xlsx, .xls" 
//                     onChange={handleFileChange}
//                     className="mb-2"
//                 />
//                 <button 
//                     onClick={uploadToFirestore}
//                     className="ml-2 btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
//                 >
//                     Upload to Database
//                 </button>
//             </div>

//             <h2 className="mt-4">Attendance Data</h2>
//             <table className="table-data table">
//                 <thead className="table-secondary">
//                     <tr>
//                         <th>Batch</th>
//                         <th>Date</th>
//                         <th>Status</th>
//                         <th>Student</th>
//                         <th>Subject</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {attendanceData.length > 0 ? (
//                         attendanceData.map((record, index) => (
//                             <tr key={index}>
//                                 <td>{record.batch_id}</td>
//                                 <td>{new Date(record.date).toLocaleString()}</td>
//                                 <td>{record.status}</td>
//                                 <td>{record.student_id}</td>
//                                 <td>{record.subject_id}</td>
//                             </tr>
//                         ))
//                     ) : (
//                         <tr>
//                             <td colSpan="5">No data available. Upload an Excel file to see records.</td>
//                         </tr>
//                     )}
//                 </tbody>
//             </table>
//         </div>
//     );
// };


import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { db } from '../config/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export default function Attendance({ studentId }) {
    const [attendanceData, setAttendanceData] = useState([]);
    const [file, setFile] = useState(null);

    const generateTemplate = () => {
        const headers = [['Batch', 'Date', 'Student', 'Status', 'Subject']];
        const ws = XLSX.utils.aoa_to_sheet(headers);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
        XLSX.writeFile(wb, 'AttendanceTemplate.xlsx');
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
            const workbook = XLSX.read(binaryStr, { type: 'binary', dateNF: 'mm/dd/yyyy' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
                header: ['batch_id', 'date', 'student_id', 'status', 'subject_id'], 
                range: 1,
                raw: false, // Use formatted values instead of raw numbers
                dateNF: 'mm/dd/yyyy' // Specify date format
            });

            const formattedData = jsonData.map(row => {
                let parsedDate;
                if (typeof row.date === 'number') {
                    // Convert Excel serial number to JavaScript Date
                    parsedDate = new Date((row.date - 25569) * 86400 * 1000);
                } else if (row.date) {
                    // Try parsing string date
                    parsedDate = new Date(row.date);
                } else {
                    // Fallback to current date if invalid
                    parsedDate = new Date();
                }

                return {
                    batch_id: row.batch_id?.trim() || '',
                    date: parsedDate,
                    status: row.status?.trim() || '',
                    student_id: row.student_id?.trim() || '',
                    subject_id: row.subject_id?.trim() || ''
                };
            });

            setAttendanceData(formattedData);
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
            await Promise.all(attendanceData.map(async (record) => {
                await addDoc(attendanceCollection, {
                    batch_id: record.batch_id,
                    date: record.date, // Store as JavaScript Date object
                    status: record.status,
                    student_id: record.student_id,
                    subject_id: record.subject_id
                });
            }));
            alert('Attendance data uploaded successfully!');
        } catch (error) {
            console.error('Error uploading attendance data: ', error);
            alert('Error uploading data. Check console for details.');
        }
    };

    const fetchAttendanceData = async () => {
        const attendanceCollection = collection(db, 'attendance');
        const snapshot = await getDocs(attendanceCollection);
        const fetchedData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().date.toDate() // Convert Firestore timestamp to JS Date
        }));
        setAttendanceData(fetchedData);
    };

    useEffect(() => {
        fetchAttendanceData();
    }, []);

    return (
        <div className="attendance-component">
            <button 
                onClick={generateTemplate}
                className="mb-4 btn btn-secondary bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-200"
            >
                Download Attendance Template
            </button>

            <div className="mt-4">
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

            <h2 className="mt-4">Attendance Data</h2>
            <table className="table-data table">
                <thead className="table-secondary">
                    <tr>
                        <th>Batch</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Student</th>
                        <th>Subject</th>
                    </tr>
                </thead>
                <tbody>
                    {attendanceData.length > 0 ? (
                        attendanceData.map((record, index) => (
                            <tr key={index}>
                                <td>{record.batch_id}</td>
                                <td>{new Date(record.date).toLocaleDateString()}</td>
                                <td>{record.status}</td>
                                <td>{record.student_id}</td>
                                <td>{record.subject_id}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No data available. Upload an Excel file to see records.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};