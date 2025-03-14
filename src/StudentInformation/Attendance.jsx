import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { db } from '../config/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export default function  Attendance ({studentId}) {
    const [attendanceData, setAttendanceData] = useState([]);
    const [file, setFile] = useState(null);
    
    const handleFileChange = (event) => {
        const uploadedFile = event.target.files[0];
        setFile(uploadedFile);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = async (event) => {
            const binaryStr = event.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];

            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            const formattedData = jsonData.slice(1).map(row => ({
                batch_id: row[0].trim(), 
                date: new Date(row[1].trim()),
                status: row[2].trim(), 
                student_id: row[3].trim(), 
                subject_id: row[4].trim() 
            }));

            setAttendanceData(formattedData);

            await uploadToFirestore(formattedData);
        };

        reader.readAsBinaryString(file);
    };

    const uploadToFirestore = async (data) => {
        try {
            const attendanceCollection = collection(db, 'attendance'); 
            await Promise.all(data.map(async (record) => {
                await addDoc(attendanceCollection, {
                    batch_id: { path: record.batch_id }, 
                    date: record.date, 
                    status: record.status,
                    student_id: { path: record.student_id }, 
                    subject_id: { path: record.subject_id } 
                });
            }));
            alert('Attendance data uploaded successfully!');
        } catch (error) {
            console.error('Error uploading attendance data: ', error);
        }
    };

    const fetchAttendanceData = async () => {
        const attendanceCollection = collection(db, 'attendance');
        const snapshot = await getDocs(attendanceCollection);
        const fetchedData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAttendanceData(fetchedData);
    };

    useEffect(() => {
        fetchAttendanceData(); 
    }, []);

    return (
        <div className="attendance-component">            
            <a href="./AttendenceSheet.xlsx" download>Download Attendance Template</a> 
            
            <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
            <button onClick={handleFileUpload} className='ml-2 btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200'>Upload Attendance</button>

            <h2>Attendance Data</h2>
            <table className='table-data table'>
                <thead className='table-secondary'>
                    <tr>
                        <th>Batch ID</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Student ID</th>
                        <th>Subject ID</th>
                    </tr>
                </thead>
                <tbody>
                    {attendanceData.map((record, index) => (
                        <tr key={index}>
                            <td>{record.batch_id}</td>
                            <td>{new Date(record.date).toLocaleString()}</td>
                            <td>{record.status}</td>
                            <td>{record.student_id}</td>
                            <td>{record.subject_id}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};