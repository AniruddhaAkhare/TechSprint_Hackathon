import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Make sure your Firebase initialization is correct
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateInvoice() {
    const [students, setStudents] = useState([]);
    const [owner, setOwner] = useState('');
    const [selectedStudent, setSelectedStudent] = useState('');
    const [invoiceDate, setInvoiceDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [subject, setSubject] = useState('');
    const [status, setStatus] = useState('');
    const [billingAddress, setBillingAddress] = useState('');
    const [invoiceItems, setInvoiceItems] = useState([{ productName: '', discount: 0, tax: 0, amount: 0, total: 0 }]);

    const navigate = useNavigate();
    const { invoiceId } = useParams(); // Gets the Invoice ID from the route parameters

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const studentsRef = collection(db, 'student');
                const snapshot = await getDocs(studentsRef);
                const studentsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setStudents(studentsList);
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        };

        const fetchInvoiceData = async () => {
            try {
                // Reference to the specific invoice document based on invoiceId
                const invoiceRef = doc(db, 'invoices', invoiceId);
                const invoiceSnapshot = await getDoc(invoiceRef); // Fetch single document
                
                // Check if the invoice exists
                if (invoiceSnapshot.exists()) {
                    const invoiceData = invoiceSnapshot.data();
                    // Set the state with the fetched data
                    setOwner(invoiceData.owner);
                    setSubject(invoiceData.subject);
                    setInvoiceDate(invoiceData.invoice_date);
                    setDueDate(invoiceData.due_date);
                    setSelectedStudent(invoiceData.student_id);
                    setStatus(invoiceData.status);
                    setBillingAddress(invoiceData.billing_address);
                    setInvoiceItems(invoiceData.items);
                } else {
                    console.error("No such invoice!");
                }
            } catch (error) {
                console.error("Error fetching invoice data:", error);
            }
        };

        fetchStudents();
        fetchInvoiceData();
    }, [invoiceId]);

    const handleStudentChange = (e) => {
        const studentId = e.target.value;
        setSelectedStudent(studentId);

        const student = students.find(student => student.id === studentId);

        if (student) {
            setBillingAddress(`${student.billing_address.area} ${student.billing_address.street} ${student.billing_address.city} ${student.billing_address.state} ${student.billing_address.country} ${student.billing_address.zip}`);
        } else {
            setBillingAddress('');
        }
    };

    const handleAddItem = () => {
        setInvoiceItems([...invoiceItems, { productName: '', discount: 0, tax: 0, amount: 0, total: 0 }]);
    };

    const handleRemoveItem = (index) => {
        const newItems = [...invoiceItems];
        newItems.splice(index, 1);
        setInvoiceItems(newItems);
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...invoiceItems];
        newItems[index][field] = value;

        if (field === 'amount' || field === 'discount' || field === 'tax') {
            const amount = parseFloat(newItems[index].amount) || 0;
            const discount = parseFloat(newItems[index].discount) || 0;
            const tax = parseFloat(newItems[index].tax) || 0;
            newItems[index].total = amount - discount + tax;
        }

        setInvoiceItems(newItems);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const invoiceData = {
            subject,
            invoice_date: invoiceDate,
            due_date: dueDate,
            student_id: selectedStudent,
            status,
            owner,
            billing_address: billingAddress,
            items: invoiceItems,
        };

        try {
            const invoiceRef = doc(db, 'invoices', invoiceId);
            await updateDoc(invoiceRef, invoiceData);
            alert("Invoice updated successfully!");
            navigate(-1);
        } catch (error) {
            console.error("Error updating invoice:", error);
        }
    };

    return (
        <div className="ml-80 p-4">
            <button onClick={() => { navigate(-1); }} className='btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200'>Back</button>
            <h1>Update Invoice</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Owner:</label>
                    <input type="text" value={owner} onChange={(e) => setOwner(e.target.value)} required />
                </div>
                <div>
                    <label>Subject:</label>
                    <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required />
                </div>
                <div>
                    <label>Invoice Date:</label>
                    <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} required />
                </div>
                <div>
                    <label>Due Date:</label>
                    <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
                </div>
                <div>
                    <label>Status:</label>
                    <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} required />
                </div>
                <div>
                    <label>Student Name:</label>
                    <select value={selectedStudent} onChange={handleStudentChange} required>
                        <option value="">Select a student</option>
                        {students.map(student => (
                            <option key={student.id} value={student.id}>
                                {`${student.first_name} ${student.last_name}`}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Billing Address:</label>
                    <input type="text" value={billingAddress} readOnly />
                </div>
                <h2>Invoice Items</h2>
                {invoiceItems.map((item, index) => (
                    <div key={index} className="invoice-item">
                        <input
                            type="text"
                            placeholder="Product Name"
                            value={item.productName}
                            onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Discount"
                            value={item.discount}
                            onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Tax"
                            value={item.tax}
                            onChange={(e) => handleItemChange(index, 'tax', e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Amount"
                            value={item.amount}
                            onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Total"
                            value={item.total}
                            readOnly
                        />
                        <button type="button" onClick={() => handleRemoveItem(index)} className='btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200'>Remove</button>
                    </div>
                ))}
                <button type="button" onClick={handleAddItem} className='btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200'>Add Item</button>
                <button type="submit" className='ml-2 btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200'>Update Invoice</button>
            </form>
        </div>
    );
};