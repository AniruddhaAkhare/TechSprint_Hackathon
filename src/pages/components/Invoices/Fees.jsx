import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../config/firebase';

export default function  Fees ()  {
    const [invoices, setInvoices] = useState([]);
    const [students, setStudents] = useState([]);

    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const invoicesRef = collection(db, 'invoices');
                const invoicesSnapshot = await getDocs(invoicesRef);
                const invoicesList = invoicesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setInvoices(invoicesList);

                const studentsRef = collection(db, 'students');
                const studentsSnapshot = await getDocs(studentsRef);
                const studentsList = studentsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setStudents(studentsList);
            } catch (error) {
                console.error("Error fetching invoices or students:", error);
            }
        };

        fetchData();
    }, []);

    const combinedData = invoices.map(invoice => {
        const student = students.find(s => s.id === invoice.student_id);
        return {
            ...invoice,
            studentName: student ? `${student.first_name} ${student.last_name}` : "Unknown",
        };
    });

    const calculateGrandTotal = (items) => {
        return items.reduce((total, item) => {
            return total + (item.total || 0); 
        }, 0);
    };

    return (
        <div className="container ml-80 p-4">
            <h1>Fees Overview</h1>
            <div className="table-container">
                <table className='table-data table'>
                    <thead className='table-secondary'>
                        <tr>
                            <th>Subject</th>
                            <th>Invoice Date</th>
                            <th>Due Date</th>
                            <th>Grand Total</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {combinedData.length > 0 ? (
                            combinedData.map((invoice) => (
                                <tr key={invoice.id}>
                                    <td>{invoice.subject}</td>
                                    <td>{invoice.invoice_date}</td>
                                    <td>{invoice.due_date}</td>
                                    <td>{calculateGrandTotal(invoice.items)}</td>
                                    <td>{invoice.status}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No fees data found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};