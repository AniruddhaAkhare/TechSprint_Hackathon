// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { doc, getDoc, updateDoc } from "firebase/firestore";
// import { db } from "../../../config/firebase";
// import { Input } from "../../../components/ui/Input";
// import Select from "../../../components/ui/Select";
// import Button from "../../../components/ui/Button";

// export default function UpdateInvoice() {
//   const { id } = useParams(); // Get invoice ID from URL
//   const navigate = useNavigate();

//   const [invoice, setInvoice] = useState({
//     student: "",
//     status: "",
//     date: "",
//     expiryDate: "",
//     note: "",
//   });

//   useEffect(() => {
//     const fetchInvoice = async () => {
//       try {
//         const invoiceRef = doc(db, "invoices", id);
//         const invoiceSnap = await getDoc(invoiceRef);
//         if (invoiceSnap.exists()) {
//           setInvoice(invoiceSnap.data());
//         } else {
//           console.error("Invoice not found!");
//         }
//       } catch (error) {
//         console.error("Error fetching invoice:", error);
//       }
//     };
//     fetchInvoice();
//   }, [id]);

//   const handleChange = (e) => {
//     setInvoice({ ...invoice, [e.target.name]: e.target.value });
//   };

//   const handleUpdate = async () => {
//     try {
//       const invoiceRef = doc(db, "invoices", id);
//       await updateDoc(invoiceRef, invoice);
//       alert("Invoice updated successfully!");
//       navigate("/invoices"); // Redirect to invoices page
//     } catch (error) {
//       console.error("Error updating invoice:", error);
//     }
//   };

//   return (
//     <div className="p-6 bg-white shadow-md rounded-md max-w-3xl mx-auto">
//       <h2 className="text-xl font-bold mb-4">Update Invoice</h2>

//       <Input name="student" value={invoice.student} onChange={handleChange} placeholder="Student Name" />
//       <Select name="status" value={invoice.status} onChange={handleChange}>
//         <option value="Draft">Draft</option>
//         <option value="Pending">Pending</option>
//         <option value="Sent">Sent</option>
//       </Select>
//       <Input type="date" name="date" value={invoice.date} onChange={handleChange} />
//       <Input type="date" name="expiryDate" value={invoice.expiryDate} onChange={handleChange} />
//       <Input name="note" value={invoice.note} onChange={handleChange} placeholder="Note" />

//       <Button onClick={handleUpdate} className="mt-4 p-2 bg-green-500 text-white rounded">Update Invoice</Button>
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../config/firebase";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";

export default function UpdateInvoice() {
  const { id } = useParams(); // Get invoice ID from URL
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState({
    student: "",
    number: "",
    year: "",
    currency: "",
    status: "",
    date: "",
    expiryDate: "",
    note: "",
    items: [],
    subtotal: 0,
    tax: 0,
    taxAmount: 0,
    totalAmount: 0,
    timestamp: new Date(),
  });

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const invoiceRef = doc(db, "invoices", id);
        const invoiceSnap = await getDoc(invoiceRef);
        if (invoiceSnap.exists()) {
          setInvoice(invoiceSnap.data());
        } else {
          console.error("Invoice not found!");
        }
      } catch (error) {
        console.error("Error fetching invoice:", error);
      }
    };
    fetchInvoice();
  }, [id]);

  const handleChange = (e) => {
    setInvoice({ ...invoice, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...invoice.items];
    updatedItems[index][field] = value;
    setInvoice({ ...invoice, items: updatedItems });
  };

  const calculateTotals = () => {
    const subtotal = invoice.items.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0);
    const taxAmount = (subtotal * (invoice.tax || 0)) / 100;
    const totalAmount = subtotal + taxAmount;
    setInvoice({ ...invoice, subtotal, taxAmount, totalAmount });
  };

  useEffect(() => {
    calculateTotals();
  }, [invoice.items, invoice.tax]);

  const handleUpdate = async () => {
    try {
      const invoiceRef = doc(db, "invoices", id);
      await updateDoc(invoiceRef, { ...invoice, timestamp: new Date() });
      alert("Invoice updated successfully!");
      navigate("/invoices"); // Redirect to invoices page
    } catch (error) {
      console.error("Error updating invoice:", error);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Update Invoice</h2>

      <Input name="student" value={invoice.student} onChange={handleChange} placeholder="Student Name" />
      <Input name="number" type="text" value={invoice.number} onChange={handleChange} placeholder="Invoice Number" />
      <Input name="year" type="number" value={invoice.year} onChange={handleChange} placeholder="Year" />
      <Input name="currency" value={invoice.currency} onChange={handleChange} placeholder="Currency" />
      <Select name="status" value={invoice.status} onChange={handleChange}>
        <option value="Draft">Draft</option>
        <option value="Pending">Pending</option>
        <option value="Sent">Sent</option>
      </Select>
      <Input type="date" name="date" value={invoice.date} onChange={handleChange} />
      <Input type="date" name="expiryDate" value={invoice.expiryDate} onChange={handleChange} />
      <Input name="note" value={invoice.note} onChange={handleChange} placeholder="Note" />

      <h3 className="font-semibold mt-4">Items</h3>
      {invoice.items.map((item, index) => (
        <div key={index} className="flex space-x-2">
          <Input
            type="text"
            value={item.name || ""}
            onChange={(e) => handleItemChange(index, "name", e.target.value)}
            placeholder="Item Name"
          />
          <Input
            type="number"
            value={item.price || ""}
            onChange={(e) => handleItemChange(index, "price", Number(e.target.value))}
            placeholder="Price"
          />
          <Input
            type="number"
            value={item.quantity || ""}
            onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
            placeholder="Quantity"
          />
        </div>
      ))}

      <h3 className="font-semibold mt-4">Financial Details</h3>
      <Input name="subtotal" type="number" value={invoice.subtotal} readOnly placeholder="Subtotal" />
      <Input name="tax" type="number" value={invoice.tax} onChange={handleChange} placeholder="Tax (%)" />
      <Input name="taxAmount" type="number" value={invoice.taxAmount} readOnly placeholder="Tax Amount" />
      <Input name="totalAmount" type="number" value={invoice.totalAmount} readOnly placeholder="Total Amount" />

      <Button onClick={handleUpdate} className="mt-4 p-2 bg-green-500 text-white rounded">
        Update Invoice
      </Button>
    </div>
  );
}
