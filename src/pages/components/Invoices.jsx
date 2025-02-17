import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import './Profile.css'; // You can keep this CSS file if needed.

export default function Invoices() {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [studentsMap, setStudentsMap] = useState({}); // Holds student id to name mapping

    useEffect(() => {
        const fetchInvoicesAndStudents = async () => {
            try {
                // Fetch students first to create a mapping
                const studentsRef = collection(db, "student");
                const studentsSnapshot = await getDocs(studentsRef);
                const studentsList = studentsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Create a map of student id to full name
                const studentsMap = {};
                studentsList.forEach(student => {
                    const fullName = `${student.first_name} ${student.last_name}`;
                    studentsMap[student.id] = fullName;
                });

                setStudentsMap(studentsMap); // Store the mapping in state

                // Fetch invoices
                const invoicesRef = collection(db, "invoices");
                const querySnapshot = await getDocs(invoicesRef);
                const invoicesList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                const invoicesWithStudentNames = invoicesList.map(invoice => ({
                    ...invoice,
                    studentName: studentsMap[invoice.student_id] || "Unknown",
                }));

                setInvoices(invoicesWithStudentNames);
            } catch (error) {
                console.error("Error fetching invoices or students:", error);
            }
        };

        fetchInvoicesAndStudents();
    }, []);

    const onDelete = async (invoiceId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this invoice?");
        if (!confirmDelete) return;

        try {
            await deleteDoc(doc(db, "invoices", invoiceId));
            setInvoices((prevInvoices) => prevInvoices.filter(invoice => invoice.id !== invoiceId));
            alert("Invoice deleted successfully!");
        } catch (error) {
            console.error("Error deleting invoice: ", error);
        }
    };

    const onEdit = (invoiceId) => {
        navigate(`/invoices/update-invoice/${invoiceId}`);
    };

    const formatDate = (timestamp) => {
        if (timestamp && timestamp.seconds) {
            return new Date(timestamp.seconds * 1000).toLocaleDateString();
        }
        return timestamp;
    };

    // Function to calculate the grand total from invoice items
    const calculateGrandTotal = (items) => {
        return items.reduce((total, item) => total + (item.total || 0), 0);
    };

    return (
        <div className="container ml-80 p-4">
            <h1 className="text-2xl font-semibold mb-4">Invoices</h1>
            <button
                onClick={() => navigate("/studentdetails/invoices/create-invoice")}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
                Create Invoice
            </button>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-3 px-4 border-b text-left text-gray-600 font-semibold">Subject</th>
                            <th className="py-3 px-4 border-b text-left text-gray-600 font-semibold">Status</th>
                            <th className="py-3 px-4 border-b text-left text-gray-600 font-semibold">Invoice Date</th>
                            <th className="py-3 px-4 border-b text-left text-gray-600 font-semibold">Grand Total</th>
                            <th className="py-3 px-4 border-b text-left text-gray-600 font-semibold">Student Name</th>
                            <th className="py-3 px-4 border-b text-left text-gray-600 font-semibold">Invoice Owner</th>
                            <th className="py-3 px-4 border-b text-left text-gray-600 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.length > 0 ? (
                            invoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4 border-b">{invoice.subject}</td>
                                    <td className="py-3 px-4 border-b">{invoice.status}</td>
                                    <td className="py-3 px-4 border-b">{formatDate(invoice.invoice_date)}</td>
                                    <td className="py-3 px-4 border-b">{calculateGrandTotal(invoice.items)}</td>
                                    <td className="py-3 px-4 border-b">{invoice.studentName}</td>
                                    <td className="py-3 px-4 border-b">{invoice.owner}</td>
                                    <td className="py-3 px-4 border-b flex space-x-2">
                                        <button
                                            onClick={() => onDelete(invoice.id)}
                                            className="text-white"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => onEdit(invoice.id)}
                                            className="text-white"
                                        >
                                            Update
                                        </button>
                                        <button className="text-white">
                                            Send mail
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="py-4 text-center">No invoices found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
