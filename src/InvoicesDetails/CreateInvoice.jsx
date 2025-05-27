


import React, { useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { saveAs } from "file-saver";

export default function CreateInvoice() {

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
            

          
    
            // Save and download PDF
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            saveAs(blob, "Updated_Invoice.pdf");
    
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };
    


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
