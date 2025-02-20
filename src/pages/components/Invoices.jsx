// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
// import { db } from "./firebase";
// import './Profile.css'; 

// export default function Invoices() {
//     const navigate = useNavigate();
//     const [invoices, setInvoices] = useState([]);
//     const [studentsMap, setStudentsMap] = useState({}); 

//     useEffect(() => {
//         const fetchInvoicesAndStudents = async () => {
//             try {
//                 const studentsRef = collection(db, "student");
//                 const studentsSnapshot = await getDocs(studentsRef);
//                 const studentsList = studentsSnapshot.docs.map(doc => ({
//                     id: doc.id,
//                     ...doc.data()
//                 }));

//                 const studentsMap = {};
//                 studentsList.forEach(student => {
//                     const fullName = `${student.first_name} ${student.last_name}`;
//                     studentsMap[student.id] = fullName;
//                 });

//                 setStudentsMap(studentsMap); 
//                 const invoicesRef = collection(db, "invoices");
//                 const querySnapshot = await getDocs(invoicesRef);
//                 const invoicesList = querySnapshot.docs.map(doc => ({
//                     id: doc.id,
//                     ...doc.data(),
//                 }));

//                 const invoicesWithStudentNames = invoicesList.map(invoice => ({
//                     ...invoice,
//                     studentName: studentsMap[invoice.student_id] || "Unknown",
//                 }));

//                 setInvoices(invoicesWithStudentNames);
//             } catch (error) {
//                 console.error("Error fetching invoices or students:", error);
//             }
//         };

//         fetchInvoicesAndStudents();
//     }, []);

//     const onDelete = async (invoiceId) => {
//         const confirmDelete = window.confirm("Are you sure you want to delete this invoice?");
//         if (!confirmDelete) return;

//         try {
//             await deleteDoc(doc(db, "invoices", invoiceId));
//             setInvoices((prevInvoices) => prevInvoices.filter(invoice => invoice.id !== invoiceId));
//             alert("Invoice deleted successfully!");
//         } catch (error) {
//             console.error("Error deleting invoice: ", error);
//         }
//     };

//     const onEdit = (invoiceId) => {
//         navigate(`/invoices/update-invoice/${invoiceId}`);
//     };

//     const formatDate = (timestamp) => {
//         if (timestamp && timestamp.seconds) {
//             return new Date(timestamp.seconds * 1000).toLocaleDateString();
//         }
//         return timestamp;
//     };

//     const calculateGrandTotal = (items) => {
//         return items.reduce((total, item) => total + (item.total || 0), 0);
//     };

//     return (
//         <div className="container ml-80 p-4">
//             <h1 className="text-2xl font-semibold mb-4">Invoices</h1>
//             <button
//                 onClick={() => navigate("/studentdetails/invoices/create-invoice")}
//                 className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
//             >
//                 Create Invoice
//             </button>
//             <div className="overflow-x-auto">
//                 <table className="data-table table">
//                     <thead className="table-secondary">
//                         <tr className="bg-gray-100">
//                             <th >Subject</th>
//                             <th >Status</th>
//                             <th >Invoice Date</th>
//                             <th >Grand Total</th>
//                             <th >Student Name</th>
//                             <th >Invoice Owner</th>
//                             <th >Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {invoices.length > 0 ? (
//                             invoices.map((invoice) => (
//                                 <tr key={invoice.id} className="hover:bg-gray-50">
//                                     <td >{invoice.subject}</td>
//                                     <td >{invoice.status}</td>
//                                     <td >{formatDate(invoice.invoice_date)}</td>
//                                     <td >{calculateGrandTotal(invoice.items)}</td>
//                                     <td >{invoice.studentName}</td>
//                                     <td >{invoice.owner}</td>
//                                     <td className="py-3 px-4 border-b flex space-x-2">
//                                         <button
//                                             onClick={() => onDelete(invoice.id)}
//                                             className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
//                                         >
//                                             Delete
//                                         </button>
//                                         <button
//                                             onClick={() => onEdit(invoice.id)}
//                                             className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
//                                         >
//                                             Update
//                                         </button>
//                                         <button className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
//                                             Send mail
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan="7" className="py-4 text-center">No invoices found.</td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }
