// import React, { useEffect, useState } from 'react';
// import { collection, getDocs, addDoc } from 'firebase/firestore';
// import { db } from '../firebase';
// import { useNavigate } from 'react-router-dom';

// const CreateInvoice = () => {
//     const [students, setStudents] = useState([]);
//     const [owner, setOwner] = useState([]);
//     const [selectedStudent, setSelectedStudent] = useState('');
//     const [invoiceDate, setInvoiceDate] = useState('');
//     const [dueDate, setDueDate] = useState('');
//     const [subject, setSubject] = useState('');
//     const [status, setStatus] = useState('');
//     const [billingAddress, setBillingAddress] = useState('');
//     const [invoiceItems, setInvoiceItems] = useState([{ productName: '', discount: 0, tax: 0, amount: 0, total: 0 }]);
//     const navigate = useNavigate();
//     useEffect(() => {
//             const today = new Date().toISOString().split("T")[0];
//             setInvoiceDate(today);
//     }, []);

//     useEffect(() => {
//         const fetchStudents = async () => {
//             try {
//                 const studentsRef = collection(db, 'student');
//                 const snapshot = await getDocs(studentsRef);
//                 const studentsList = snapshot.docs.map((doc) => ({
//                     id: doc.id,
//                     ...doc.data(),
//                 }));
//                 setStudents(studentsList);
//             } catch (error) {
//                 console.error("Error fetching students:", error);
//             }
//         };

//         fetchStudents();
//     }, []);


//     const handleStudentChange = (e) => {
//         const studentId = e.target.value;
//         setSelectedStudent(studentId);

//         const student = students.find(student => student.id === studentId);
     
//         if (student) {
//             setBillingAddress(student.billing_address.area +" "+ student.billing_address.street +" "+ student.billing_address.city +" "+ student.billing_address.state +" "+ student.billing_address.country +" " + student.billing_address.zip); // Assuming 'billingAddress' is a field in student doc
//         } else {
//             setBillingAddress('');  
//         }
//     };

//     const handleAddItem = () => {
//         setInvoiceItems([...invoiceItems, { productName: '', discount: 0, tax: 0, amount: 0, total: 0 }]);
//     };

//     const handleRemoveItem = (index) => {
//         const newItems = [...invoiceItems];
//         newItems.splice(index, 1);
//         setInvoiceItems(newItems);
//     };

//     const handleItemChange = (index, field, value) => {
//         const newItems = [...invoiceItems];
//         newItems[index][field] = value;

//         if (field === 'amount' || field === 'discount' || field === 'tax') {
//             const amount = parseFloat(newItems[index].amount) || 0;
//             const discount = parseFloat(newItems[index].discount) || 0;
//             const tax = parseFloat(newItems[index].tax) || 0;

//             const discount_price = ((discount/100)*amount);
//             newItems[index].total = (amount - discount_price) + ((tax/100)*discount_price); 
//         }

//         setInvoiceItems(newItems);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const invoiceData = {
//             subject: subject,
//             invoice_date: invoiceDate,
//             due_date: dueDate,
//             student_id: selectedStudent,
//             status: status,
//             owner: owner,
//             billing_address: billingAddress,
//             items: invoiceItems,
//         };
//         try {
//             await addDoc(collection(db, 'invoices'), invoiceData);
//             alert("Invoice created successfully!");
//             setSelectedStudent('');
//             setInvoiceDate('');
//             setDueDate('');
//             setSubject('');
//             setStatus('');
//             setOwner('');
//             setBillingAddress('');
//             setInvoiceItems([{ productName: '', discount: 0, tax: 0, amount: 0, total: 0 }]);
//         } catch (error) {
//             console.error("Error creating invoice:", error);
//         }
//     };

//     return (
//         <div className="ml-80 p-4">
//             <button onClick={()=>{navigate(-1)}} className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Back</button>
//             <h1>Create Invoice</h1>
//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <label>Owner:</label>
//                     <input
//                         type="text"
//                         value={owner}
//                         onChange={(e) => setOwner(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label>Subject:</label>
//                     <input
//                         type="text"
//                         value={subject}
//                         onChange={(e) => setSubject(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label>Invoice Date:</label>
//                     <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} required />
//                 </div>
//                 <div>
//                     <label>Due Date:</label>
//                     <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
//                 </div>
//                 <div>
//                     <label>Status:</label>
//                     <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} required />
//                 </div>
//                 <div>
//                     <label>Student Name:</label>
//                     <select value={selectedStudent} onChange={handleStudentChange} required>
//                         <option value="">Select a student</option>
//                         {students.map(student => (
//                             <option key={student.id} value={student.id}>
//                                 {`${student.first_name} ${student.last_name}`}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//                 <div>
//                     <label>Billing Address:</label>
//                     <input type="text" value={billingAddress}/>
//                 </div>
//                 <h2>Invoice Items</h2>
//                 {invoiceItems.map((item, index) => (
//                     <div key={index} className="invoice-item">
//                         <input
//                             type="text"
//                             placeholder="Product Name"
//                             value={item.productName}
//                             onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
//                             required
//                         />
//                         <input
//                             type="number"
//                             placeholder="Discount"
//                             value={item.discount}
//                             onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
//                         />
//                         <input
//                             type="number"
//                             placeholder="Tax"
//                             value={item.tax}
//                             onChange={(e) => handleItemChange(index, 'tax', e.target.value)}
//                         />
//                         <input
//                             type="number"
//                             placeholder="Amount"
//                             value={item.amount}
//                             onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
//                         />
//                         <input
//                             type="number"
//                             placeholder="Total"
//                             value={item.total}
//                             readOnly
//                         />
//                         <button type="button" onClick={() => handleRemoveItem(index)} className='btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200'>Remove</button>
//                     </div>
//                 ))}
//                 <button type="button" onClick={handleAddItem} className='btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200'>Add Item</button>
//                 <button type="submit" className='ml-2 btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200'>Submit Invoice</button>
//             </form>
//         </div>
//     );
// };

// export default CreateInvoice;



import React, { useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { saveAs } from "file-saver";

export default function CreateInvoice() {
    // const [formData, setFormData] = useState({
    //     billTo: "Kunal Umredkar",
    //     invoiceNumber: "FBT20240785",
    //     invoiceDate: "05/02/2025",
    //     placeOfSupply: "Maharashtra (27)",
    //     particulars: "Post Graduate Program in Data Science and Analytics - Full Time",
    //     hsnSac: "999293",
    //     rate: "72,033.89",
    //     cgst: "6,483.05",
    //     sgst: "6,483.05",
    //     amount: "85,000.00",
    // });
    const [formData, setFormData] = useState({
        billTo: "Kunal Umredkar",
        invoiceNumber: "FBT20240785",
        invoiceDate: "05/02/2025",
        placeOfSupply: "Maharashtra (27)",
        items: [
            { particulars: "Post Graduate Program in Data Science", hsnSac: "999293", rate: "72,033.89", cgst: "6,483.05", sgst: "6,483.05", amount: "85,000.00" }
        ]
    });

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { particulars: "", hsnSac: "", rate: "", cgst: "", sgst: "", amount: "" }]
        });
    };
    
    const handleItemChange = (index, e) => {
        const newItems = [...formData.items];
        newItems[index][e.target.name] = e.target.value;
        setFormData({ ...formData, items: newItems });
    };
    

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const generatePDF = async () => {
        try {
            const templateUrl = "/FBT20240785_Kunal_Umredkar.pdf"; 
            const existingPdfBytes = await fetch(templateUrl).then(res => res.arrayBuffer());
    
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            const pages = pdfDoc.getPages();
            const firstPage = pages[0];
    
            // Static details
            firstPage.drawText(formData.billTo, { x: 100, y: 600, size: 12, color: rgb(0, 0, 0) });
            firstPage.drawText(formData.invoiceNumber, { x: 450, y: 750, size: 12, color: rgb(0, 0, 0) });
            firstPage.drawText(formData.invoiceDate, { x: 450, y: 730, size: 12, color: rgb(0, 0, 0) });
            firstPage.drawText(formData.placeOfSupply, { x: 100, y: 580, size: 12, color: rgb(0, 0, 0) });
    
            // Loop through items and dynamically place them
            let startY = 500; // Starting Y position for items
            // formData.items.forEach((item, index) => {
            //     firstPage.drawText(item.particulars, { x: 50, y: startY, size: 12, color: rgb(0, 0, 0) });
            //     firstPage.drawText(item.hsnSac, { x: 300, y: startY, size: 12, color: rgb(0, 0, 0) });
            //     firstPage.drawText(item.rate, { x: 400, y: startY, size: 12, color: rgb(0, 0, 0) });
            //     firstPage.drawText(item.cgst, { x: 450, y: startY, size: 12, color: rgb(0, 0, 0) });
            //     firstPage.drawText(item.sgst, { x: 500, y: startY, size: 12, color: rgb(0, 0, 0) });
            //     firstPage.drawText(item.amount, { x: 550, y: startY, size: 12, color: rgb(0, 0, 0) });
    
            //     startY -= 20; // Move up for the next item
            // });

          
    
            // Save and download PDF
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            saveAs(blob, "Updated_Invoice.pdf");
    
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };
    

    // const generatePDF = async () => {
    //     try {
    //         // Load the existing invoice PDF
    //         const templateUrl = "/FBT20240785_Kunal_Umredkar.pdf"; // Ensure correct path
    //         const existingPdfBytes = await fetch(templateUrl).then(res => res.arrayBuffer());

    //         // Load PDF Document
    //         const pdfDoc = await PDFDocument.load(existingPdfBytes);
    //         const pages = pdfDoc.getPages();
    //         const firstPage = pages[0];

    //         // Draw text in the appropriate positions (X, Y coordinates)
    //         firstPage.drawText(formData.billTo, { x: 100, y: 600, size: 12, color: rgb(0, 0, 0) });
    //         firstPage.drawText(formData.invoiceNumber, { x: 450, y: 750, size: 12, color: rgb(0, 0, 0) });
    //         firstPage.drawText(formData.invoiceDate, { x: 450, y: 730, size: 12, color: rgb(0, 0, 0) });
    //         firstPage.drawText(formData.placeOfSupply, { x: 100, y: 580, size: 12, color: rgb(0, 0, 0) });

    //         firstPage.drawText(formData.particulars, { x: 50, y: 500, size: 12, color: rgb(0, 0, 0) });
    //         firstPage.drawText(formData.hsnSac, { x: 300, y: 500, size: 12, color: rgb(0, 0, 0) });
    //         firstPage.drawText(formData.rate, { x: 400, y: 500, size: 12, color: rgb(0, 0, 0) });
    //         firstPage.drawText(formData.cgst, { x: 450, y: 500, size: 12, color: rgb(0, 0, 0) });
    //         firstPage.drawText(formData.sgst, { x: 500, y: 500, size: 12, color: rgb(0, 0, 0) });
    //         firstPage.drawText(formData.amount, { x: 550, y: 500, size: 12, color: rgb(0, 0, 0) });

    //         // Save the modified PDF
    //         const pdfBytes = await pdfDoc.save();
    //         const blob = new Blob([pdfBytes], { type: "application/pdf" });

    //         // Trigger download
    //         saveAs(blob, "Updated_Invoice.pdf");

    //     } catch (error) {
    //         console.error("Error generating PDF:", error);
    //     }
    // };

    return (
        <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-md">
            <h2 className="text-xl font-bold mb-4">Fill Invoice Details</h2>
            
            <input type="text" name="billTo" value={formData.billTo} onChange={handleChange} placeholder="Bill To" className="w-full p-2 border rounded mb-2" />
            <input type="text" name="invoiceNumber" value={formData.invoiceNumber} onChange={handleChange} placeholder="Invoice Number" className="w-full p-2 border rounded mb-2" />
            <input type="text" name="invoiceDate" value={formData.invoiceDate} onChange={handleChange} placeholder="Invoice Date" className="w-full p-2 border rounded mb-2" />
            <input type="text" name="placeOfSupply" value={formData.placeOfSupply} onChange={handleChange} placeholder="Place of Supply" className="w-full p-2 border rounded mb-2" />
            
            <input type="text" name="particulars" value={formData.particulars} onChange={handleChange} placeholder="Particulars & Description" className="w-full p-2 border rounded mb-2" />
            <input type="text" name="hsnSac" value={formData.hsnSac} onChange={handleChange} placeholder="HSN/SAC" className="w-full p-2 border rounded mb-2" />
            <input type="text" name="rate" value={formData.rate} onChange={handleChange} placeholder="Rate" className="w-full p-2 border rounded mb-2" />
            <input type="text" name="cgst" value={formData.cgst} onChange={handleChange} placeholder="CGST" className="w-full p-2 border rounded mb-2" />
            <input type="text" name="sgst" value={formData.sgst} onChange={handleChange} placeholder="SGST" className="w-full p-2 border rounded mb-2" />
            <input type="text" name="amount" value={formData.amount} onChange={handleChange} placeholder="Total Amount" className="w-full p-2 border rounded mb-2" />


            {formData.items.map((item, index) => (
                <div key={index} className="mb-4 border p-4 rounded">
                    <input type="text" name="particulars" value={item.particulars} onChange={(e) => handleItemChange(index, e)} placeholder="Particulars" className="w-full p-2 border rounded mb-2" />
                    <input type="text" name="hsnSac" value={item.hsnSac} onChange={(e) => handleItemChange(index, e)} placeholder="HSN/SAC" className="w-full p-2 border rounded mb-2" />
                    <input type="text" name="rate" value={item.rate} onChange={(e) => handleItemChange(index, e)} placeholder="Rate" className="w-full p-2 border rounded mb-2" />
                    <input type="text" name="cgst" value={item.cgst} onChange={(e) => handleItemChange(index, e)} placeholder="CGST" className="w-full p-2 border rounded mb-2" />
                    <input type="text" name="sgst" value={item.sgst} onChange={(e) => handleItemChange(index, e)} placeholder="SGST" className="w-full p-2 border rounded mb-2" />
                    <input type="text" name="amount" value={item.amount} onChange={(e) => handleItemChange(index, e)} placeholder="Amount" className="w-full p-2 border rounded mb-2" />
                </div>
            ))}
            <button onClick={addItem} className="bg-green-500 text-white p-2 rounded w-full mb-4">Add Another Item</button>
            <button onClick={generatePDF} className="bg-blue-500 text-white p-2 rounded w-full">Generate Invoice PDF</button>
            
            {/* <button onClick={generatePDF} className="bg-blue-500 text-white p-2 rounded mt-3 w-full">Generate Invoice PDF</button> */}
        </div>
    );
}
