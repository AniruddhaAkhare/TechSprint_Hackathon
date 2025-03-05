// // // // // // import { useState } from "react";

// // // // // // export default function CreateInvoice() {
// // // // // //     const [items, setItems] = useState([{ name: "", description: "", quantity: 1, price: 0, total: 0 }]);
    
// // // // // //     const addItem = () => {
// // // // // //         setItems([...items, { name: "", description: "", quantity: 1, price: 0, total: 0 }]);
// // // // // //     };
    
// // // // // //     const handleChange = (index, field, value) => {
// // // // // //         const updatedItems = [...items];
// // // // // //         updatedItems[index][field] = value;
// // // // // //         updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].price;
// // // // // //         setItems(updatedItems);
// // // // // //     };
    
// // // // // //     const removeItem = (index) => {
// // // // // //         setItems(items.filter((_, i) => i !== index));
// // // // // //     };
    
// // // // // //     const calculateSubtotal = () => {
// // // // // //         return items.reduce((acc, item) => acc + item.total, 0).toFixed(2);
// // // // // //     };
    
// // // // // //     return (
// // // // // //         <div className="p-6 bg-white rounded shadow-md w-full max-w-4xl mx-auto">
// // // // // //             <h2 className="text-2xl font-semibold mb-4">New Invoice <span className="text-gray-500 text-sm">Draft</span></h2>
// // // // // //             <div className="grid grid-cols-2 gap-4 mb-4">
// // // // // //                 <div>
// // // // // //                     <label className="block text-sm font-semibold">Client</label>
// // // // // //                     <input type="text" className="w-full border rounded p-2" placeholder="Search" />
// // // // // //                 </div>
// // // // // //                 <div>
// // // // // //                     <label className="block text-sm font-semibold">Number</label>
// // // // // //                     <input type="text" className="w-full border rounded p-2" value="1" readOnly />
// // // // // //                 </div>
// // // // // //                 <div>
// // // // // //                     <label className="block text-sm font-semibold">Year</label>
// // // // // //                     <input type="text" className="w-full border rounded p-2" value="2025" readOnly />
// // // // // //                 </div>
// // // // // //                 <div>
// // // // // //                     <label className="block text-sm font-semibold">Currency</label>
// // // // // //                     <select className="w-full border rounded p-2">
// // // // // //                         <option>US $ (US Dollar)</option>
// // // // // //                     </select>
// // // // // //                 </div>
// // // // // //             </div>
            
// // // // // //             <div className="grid grid-cols-2 gap-4 mb-4">
// // // // // //                 <div>
// // // // // //                     <label className="block text-sm font-semibold">Date</label>
// // // // // //                     <input type="date" className="w-full border rounded p-2" />
// // // // // //                 </div>
// // // // // //                 <div>
// // // // // //                     <label className="block text-sm font-semibold">Expire Date</label>
// // // // // //                     <input type="date" className="w-full border rounded p-2" />
// // // // // //                 </div>
// // // // // //             </div>
            
// // // // // //             <div className="mb-4">
// // // // // //                 <label className="block text-sm font-semibold">Note</label>
// // // // // //                 <input type="text" className="w-full border rounded p-2" placeholder="Note" />
// // // // // //             </div>
            
// // // // // //             <table className="w-full border mt-4">
// // // // // //                 <thead>
// // // // // //                     <tr className="bg-gray-100">
// // // // // //                         <th className="p-2">Item</th>
// // // // // //                         <th className="p-2">Description</th>
// // // // // //                         <th className="p-2">Quantity</th>
// // // // // //                         <th className="p-2">Price</th>
// // // // // //                         <th className="p-2">Total</th>
// // // // // //                         <th className="p-2">Action</th>
// // // // // //                     </tr>
// // // // // //                 </thead>
// // // // // //                 <tbody>
// // // // // //                     {items.map((item, index) => (
// // // // // //                         <tr key={index} className="border-b">
// // // // // //                             <td><input type="text" className="border p-2 w-full" onChange={(e) => handleChange(index, 'name', e.target.value)} /></td>
// // // // // //                             <td><input type="text" className="border p-2 w-full" onChange={(e) => handleChange(index, 'description', e.target.value)} /></td>
// // // // // //                             <td><input type="number" className="border p-2 w-full" value={item.quantity} onChange={(e) => handleChange(index, 'quantity', Number(e.target.value))} /></td>
// // // // // //                             <td><input type="number" className="border p-2 w-full" value={item.price} onChange={(e) => handleChange(index, 'price', Number(e.target.value))} /></td>
// // // // // //                             <td className="p-2">${item.total.toFixed(2)}</td>
// // // // // //                             <td><button onClick={() => removeItem(index)} className="text-red-500">🗑</button></td>
// // // // // //                         </tr>
// // // // // //                     ))}
// // // // // //                 </tbody>
// // // // // //             </table>
// // // // // //             <button onClick={addItem} className="mt-2 text-blue-500">+ Add Field</button>
            
// // // // // //             <div className="mt-4 text-right">
// // // // // //                 <div>Sub Total: ${calculateSubtotal()}</div>
// // // // // //                 <div>Total: ${calculateSubtotal()}</div>
// // // // // //             </div>
            
// // // // // //             <div className="flex justify-between mt-6">
// // // // // //                 <button className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
// // // // // //                 <button className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
// // // // // //             </div>
// // // // // //         </div>
// // // // // //     );
// // // // // // }

// // // // // import React, { useState } from "react";
// // // // // import Button from "../../../components/ui/Button";
// // // // // import { Input} from "../../../components/ui/Input";
// // // // // import Select from "../../../components/ui/Select";
// // // // // import { Calendar } from "@/components/ui/Calendar";

// // // // // // import { Button, Input, Select } from "../../ui";
// // // // // // import { Calendar } from "../../ui/calendar";


// // // // // const CreateInvoice = () => {
// // // // //   const [items, setItems] = useState([{ name: "", description: "", quantity: "", price: "", total: 0 }]);

// // // // //   const addItem = () => {
// // // // //     setItems([...items, { name: "", description: "", quantity: "", price: "", total: 0 }]);
// // // // //   };

// // // // //   const removeItem = (index) => {
// // // // //     setItems(items.filter((_, i) => i !== index));
// // // // //   };

// // // // //   return (
// // // // //     <div className="p-6 bg-white shadow-md rounded-md max-w-4xl mx-auto">
// // // // //       <h2 className="text-lg font-semibold">New <span className="text-sm bg-gray-200 px-2 py-1 rounded">Draft</span></h2>
// // // // //       <div className="grid grid-cols-2 gap-4 mt-4">
// // // // //         <div>
// // // // //           <label className="block text-sm font-medium">Client *</label>
// // // // //           <Select>
// // // // //             <option>Search</option>
// // // // //           </Select>
// // // // //         </div>
// // // // //         <div>
// // // // //           <label className="block text-sm font-medium">Number *</label>
// // // // //           <Input type="number" value="1" readOnly />
// // // // //         </div>
// // // // //         <div>
// // // // //           <label className="block text-sm font-medium">Year *</label>
// // // // //           <Input type="number" value="2025" readOnly />
// // // // //         </div>
// // // // //         <div>
// // // // //           <label className="block text-sm font-medium">Currency *</label>
// // // // //           <Select options={[{ value: "INR", label: "₹ (Indian Rupee)" }]} />

// // // // //           {/* <Select>
// // // // //             <option>₹ (Indian Rupee)</option>
// // // // //           </Select> */}
// // // // //         </div>
// // // // //       </div>
// // // // //       <div className="grid grid-cols-2 gap-4 mt-4">
// // // // //         <div>
// // // // //           <label className="block text-sm font-medium">Date *</label>
// // // // //           <Calendar />
// // // // //         </div>
// // // // //         <div>
// // // // //           <label className="block text-sm font-medium">Expire Date *</label>
// // // // //           <Calendar />
// // // // //         </div>
// // // // //       </div>
// // // // //       <div className="mt-6 border-t pt-4">
// // // // //         <h3 className="text-md font-semibold">Items</h3>
// // // // //         {items.map((item, index) => (
// // // // //           <div key={index} className="grid grid-cols-5 gap-2 mt-2 items-center">
// // // // //             <Input placeholder="Item Name" />
// // // // //             <Input placeholder="Description" />
// // // // //             <Input placeholder="Quantity" type="number" />
// // // // //             <Input placeholder="Price" type="number" />
// // // // //             <div className="flex justify-between">
// // // // //               <Input value={`₹ ${item.total.toFixed(2)}`} readOnly />
// // // // //               <button onClick={() => removeItem(index)} className="text-red-500">🗑</button>
// // // // //             </div>
// // // // //           </div>
// // // // //         ))}
// // // // //         <Button onClick={addItem} className="mt-4">+ Add Field</Button>
// // // // //       </div>
// // // // //       <div className="mt-6 border-t pt-4 flex justify-between">
// // // // //         <span>Sub Total: ₹ 0.00</span>
// // // // //         <span>Total: ₹ 0.00</span>
// // // // //       </div>
// // // // //       <div className="flex justify-end mt-4">
// // // // //         <Button className="mr-2">Cancel</Button>
// // // // //         <Button className="bg-blue-600 text-white">Save</Button>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default CreateInvoice;


// // // // import React, { useState } from "react";
// // // // import Button from "../../../components/ui/Button";
// // // // import { Input} from "../../../components/ui/Input";
// // // // import Select from "../../../components/ui/Select";
// // // // import { Calendar } from "@/components/ui/Calendar";
// // // // // import { Input, Select, Calendar } from "@/components/ui";

// // // // export const CreateInvoice = () => {
// // // //   const [number, setNumber] = useState("1");
// // // //   const [year, setYear] = useState("2025");
// // // //   const [status, setStatus] = useState("Draft");
// // // //   const [tax, setTax] = useState(0);
// // // //   const [items, setItems] = useState([
// // // //     { item: "", description: "", quantity: 1, price: "", total: 0 }
// // // //   ]);

// // // //   const handleItemChange = (index, field, value) => {
// // // //     const updatedItems = [...items];
// // // //     updatedItems[index][field] = value;
// // // //     if (field === "quantity" || field === "price") {
// // // //       updatedItems[index].total =
// // // //         (parseFloat(updatedItems[index].quantity) || 0) *
// // // //         (parseFloat(updatedItems[index].price) || 0);
// // // //     }
// // // //     setItems(updatedItems);
// // // //   };

// // // //   const addItem = () => {
// // // //     setItems([...items, { item: "", description: "", quantity: 1, price: "", total: 0 }]);
// // // //   };

  
// // // //   const removeItem = (index) => {
// // // //     const updatedItems = items.filter((_, i) => i !== index);
// // // //     setItems(updatedItems);
// // // //   };

// // // //   const subtotal = items.reduce((sum, item) => sum + item.total, 0);
// // // //   const taxAmount = (subtotal * tax) / 100;
// // // //   const totalAmount = subtotal + taxAmount;

// // // //   return (
// // // //     <div className="p-6 bg-white shadow-md rounded-md max-w-4xl mx-auto">
// // // //       <h2 className="text-xl font-bold">New Invoice</h2>
// // // //       <div className="grid grid-cols-3 gap-4 mt-4">
// // // //         <Input type="text" placeholder="Client" />
// // // //         <Input type="number" value={number} onChange={(e) => setNumber(e.target.value)} />
// // // //         <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} />
// // // //         <Select
// // // //           options={[{ value: "INR", label: "₹ (Indian Rupee)" }]}
// // // //         />
// // // //         <Select
// // // //           value={status}
// // // //           onChange={(e) => setStatus(e.target.value)}
// // // //           options={[
// // // //             { value: "Draft", label: "Draft" },
// // // //             { value: "Pending", label: "Pending" },
// // // //             { value: "Sent", label: "Sent" }
// // // //           ]}
// // // //         />
// // // //       </div>

// // // //       <div className="mt-4">
// // // //         <div className="grid grid-cols-5 gap-2 font-bold">
// // // //           <span>Item</span><span>Description</span><span>Quantity</span><span>Price</span><span>Total</span>
// // // //         </div>
// // // //         {items.map((item, index) => (
// // // //           <div key={index} className="grid grid-cols-5 gap-2 mt-2">
// // // //             <Input value={item.item} onChange={(e) => handleItemChange(index, "item", e.target.value)} />
// // // //             <Input value={item.description} onChange={(e) => handleItemChange(index, "description", e.target.value)} />
// // // //             <Input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", e.target.value)} />
// // // //             <Input type="number" value={item.price} onChange={(e) => handleItemChange(index, "price", e.target.value)} />
// // // //             <Input type="text" value={`₹ ${item.total.toFixed(2)}`} disabled />
// // // //             <button onClick={() => removeItem(index)}>🗑</button>
// // // //           </div>
// // // //         ))}
// // // //         <button onClick={addItem} className="mt-2 p-2 bg-blue-500 text-white rounded">+ Add Field</button>
// // // //       </div>
      
// // // //       <div className="mt-4">
// // // //         <div className="grid grid-cols-2 gap-4">
// // // //           <span>Sub Total:</span> <span>₹ {subtotal.toFixed(2)}</span>
// // // //           <Select
// // // //             value={tax}
// // // //             onChange={(e) => setTax(parseFloat(e.target.value))}
// // // //             options={[
// // // //               { value: 0, label: "Select Tax Value" },
// // // //               { value: 9, label: "9%" },
// // // //               { value: 18, label: "18%" }
// // // //             ]}
// // // //           />
// // // //           <span>Tax:</span> <span>₹ {taxAmount.toFixed(2)}</span>
// // // //           <span>Total:</span> <span>₹ {totalAmount.toFixed(2)}</span>
// // // //         </div>
// // // //       </div>

// // // //       <button onClick={saveInvoice} className="mt-2 p-2 bg-blue-500 text-white rounded">Save</button>
// // // //     </div>
// // // //   );
// // // // };


// // // import React, { useState, useEffect } from "react";
// // // // import { Input, Select, Calendar, Button } from "@/components/ui";
// // // import Button from "../../../components/ui/Button";
// // // import { Input} from "../../../components/ui/Input";
// // // import Select from "../../../components/ui/Select";
// // // import { Calendar } from "@/components/ui/Calendar";
// // // import { db } from "../../../config/firebase";
// // // import { collection, addDoc } from "firebase/firestore";

// // // export default function CreateInvoice () {

// // // const [students, setStudent] = useState([]);
// // // const [selectedStudent, setSelectedStudent] = useState("");
// // //   const [number, setNumber] = useState("1");
// // //   const [year, setYear] = useState("2025");
// // //   const [status, setStatus] = useState("Draft");
// // //   const [tax, setTax] = useState(0);
// // //   const [items, setItems] = useState([
// // //     { item: "", description: "", quantity: 1, price: "", total: 0 }
// // //   ]);

// // //   const handleItemChange = (index, field, value) => {
// // //     const updatedItems = [...items];
// // //     updatedItems[index][field] = value;
// // //     if (field === "quantity" || field === "price") {
// // //       updatedItems[index].total =
// // //         (parseFloat(updatedItems[index].quantity) || 0) *
// // //         (parseFloat(updatedItems[index].price) || 0);
// // //     }
// // //     setItems(updatedItems);
// // //   };

// // //   const addItem = () => {
// // //     setItems([...items, { item: "", description: "", quantity: 1, price: "", total: 0 }]);
// // //   };

// // //   const removeItem = (index) => {
// // //     const updatedItems = items.filter((_, i) => i !== index);
// // //     setItems(updatedItems);
// // //   };

// // //   const subtotal = items.reduce((sum, item) => sum + item.total, 0);
// // //   const taxAmount = (subtotal * tax) / 100;
// // //   const totalAmount = subtotal + taxAmount;

// // //   const saveInvoice = async () => {
// // //     try {
// // //       await addDoc(collection(db, "invoices"), {
// // //         number,
// // //         year,
// // //         status,
// // //         items,
// // //         subtotal,
// // //         tax,
// // //         taxAmount,
// // //         totalAmount,
// // //         timestamp: new Date()
// // //       });
// // //       alert("Invoice saved successfully!");
      
// // //     } catch (error) {
// // //       console.error("Error saving invoice: ", error);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     const fetchStudents = async () => {
// // //         try {
// // //             const studentsCollection = collection(db, "student"); // Adjust collection name
// // //             const studentSnapshot = await getDocs(studentsCollection);
// // //             const studentList = studentSnapshot.docs.map(doc => ({
// // //                 id: doc.id,
// // //                 first_name: doc.data().first_name, // Ensure Firestore has "name" field
// // //             }));
// // //             setStudent(studentList);
// // //         } catch (error) {
// // //             console.error("Error fetching students:", error);
// // //         }
// // //     };

// // //     fetchStudents();
// // // }, []);

// // //   return (
// // //     <div className="p-6 bg-white shadow-md rounded-md max-w-4xl mx-auto">
// // //       <h2 className="text-xl font-bold">New Invoice</h2>
// // //       <div className="grid grid-cols-3 gap-4 mt-4">
// // //       <Select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
// // //             <option value="" disabled>Select Student</option>
// // //             {students.map(student => (
// // //                 <option key={student.id} value={student.first_name}>{student.last_name}</option>
// // //             ))}
// // //         </Select>
// // //         {/* <Input type="text" placeholder="Client" /> */}
// // //         <Input type="number" value={number} onChange={(e) => setNumber(e.target.value)} />
// // //         <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} />
// // //         <Select
// // //           options={[{ value: "INR", label: "₹ (Indian Rupee)" }]}
// // //         />
// // //         <Select
// // //           value={status}
// // //           onChange={(e) => setStatus(e.target.value)}

// // //         //   options={[
// // //         //                   { value: 0, label: "Select Tax Value" },
// // //         //                   { value: 9, label: "9%" },
// // //         //                   { value: 18, label: "18%" }
// // //         //                 ]}


// // //           options={[
// // //             { value: "Draft", label: "Draft" },
// // //             { value: "Pending", label: "Pending" },
// // //             { value: "Sent", label: "Sent" }
// // //           ]}
// // //         />
// // //       </div>

// // //       <div className="mt-4">
// // //         <div className="grid grid-cols-5 gap-2 font-bold">
// // //           <span>Item</span><span>Description</span><span>Quantity</span><span>Price</span><span>Total</span>
// // //         </div>
// // //         {items.map((item, index) => (
// // //           <div key={index} className="grid grid-cols-5 gap-2 mt-2">
// // //             <Input value={item.item} onChange={(e) => handleItemChange(index, "item", e.target.value)} />
// // //             <Input value={item.description} onChange={(e) => handleItemChange(index, "description", e.target.value)} />
// // //             <Input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", e.target.value)} />
// // //             <Input type="number" value={item.price} onChange={(e) => handleItemChange(index, "price", e.target.value)} />
// // //             <Input type="text" value={`₹ ${item.total.toFixed(2)}`} disabled />
// // //             <button onClick={() => removeItem(index)}>🗑</button>
// // //           </div>
// // //         ))}
// // //         <button onClick={addItem} className="mt-2 p-2 bg-blue-500 text-white rounded">+ Add Field</button>
// // //       </div>
      
// // //       <div className="mt-4">
// // //         <div className="grid grid-cols-2 gap-4">
// // //           <span>Sub Total:</span> <span>₹ {subtotal.toFixed(2)}</span>
// // //           <Select
// // //             value={tax}
// // //             onChange={(e) => setTax(parseFloat(e.target.value))}
// // //             options={[
// // //               { value: 0, label: "Select Tax Value" },
// // //               { value: 9, label: "9%" },
// // //               { value: 18, label: "18%" }
// // //             ]}
// // //           />
// // //           <span>Tax:</span> <span>₹ {taxAmount.toFixed(2)}</span>
// // //           <span>Total:</span> <span>₹ {totalAmount.toFixed(2)}</span>
// // //         </div>
// // //       </div>

// // //       <Button onClick={saveInvoice} className="mt-4 p-2 bg-green-500 text-white rounded">Save</Button>
// // //     </div>
// // //   );
// // // };


// // import React, { useState, useEffect } from "react";
// // import { db } from "../../../config/firebase";
// // import { collection, getDocs, addDoc } from "firebase/firestore";
// // import Button from "../../../components/ui/Button";
// // import { Input } from "../../../components/ui/Input";
// // import Select from "../../../components/ui/Select";

// // export default function CreateInvoice() {
// //   const [students, setStudents] = useState([]);
// //   const [selectedStudent, setSelectedStudent] = useState("");
// //   const [number, setNumber] = useState("1");
// //   const [year, setYear] = useState("2025");
// //   const [status, setStatus] = useState("Draft");
// //   const [tax, setTax] = useState(0);
// //   const [items, setItems] = useState([
// //     { item: "", description: "", quantity: 1, price: "", total: 0 }
// //   ]);

// //   useEffect(() => {
// //     const fetchStudents = async () => {
// //       try {
// //         const studentsCollection = collection(db, "student"); // Firestore collection name
// //         const studentSnapshot = await getDocs(studentsCollection);
// //         const studentList = studentSnapshot.docs.map(doc => ({
// //           id: doc.id,
// //           name: `${doc.data().first_name} ${doc.data().last_name}`, // Combine first and last name
// //         }));
// //         setStudents(studentList);
// //       } catch (error) {
// //         console.error("Error fetching students:", error);
// //       }
// //     };

// //     fetchStudents();
// //   }, []);

// //   const handleItemChange = (index, field, value) => {
// //     const updatedItems = [...items];
// //     updatedItems[index][field] = value;
// //     if (field === "quantity" || field === "price") {
// //       updatedItems[index].total =
// //         (parseFloat(updatedItems[index].quantity) || 0) *
// //         (parseFloat(updatedItems[index].price) || 0);
// //     }
// //     setItems(updatedItems);
// //   };

// //   const addItem = () => {
// //     setItems([...items, { item: "", description: "", quantity: 1, price: "", total: 0 }]);
// //   };

// //   const removeItem = (index) => {
// //     const updatedItems = items.filter((_, i) => i !== index);
// //     setItems(updatedItems);
// //   };

// //   const subtotal = items.reduce((sum, item) => sum + item.total, 0);
// //   const taxAmount = (subtotal * tax) / 100;
// //   const totalAmount = subtotal + taxAmount;

// //   const saveInvoice = async () => {
// //     try {
// //       await addDoc(collection(db, "invoices"), {
// //         client: selectedStudent,
// //         number,
// //         year,
// //         status,
// //         items,
// //         subtotal,
// //         tax,
// //         taxAmount,
// //         totalAmount,
// //         timestamp: new Date()
// //       });
// //       alert("Invoice saved successfully!");
// //     } catch (error) {
// //       console.error("Error saving invoice: ", error);
// //     }
// //   };

// //   return (
// //     <div className="p-6 bg-white shadow-md rounded-md max-w-4xl mx-auto">
// //       <h2 className="text-xl font-bold">New Invoice</h2>
// //       <div className="grid grid-cols-3 gap-4 mt-4">
// //         {/* Student Dropdown */}
// //         <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
// //           <option value="" disabled>Select Student</option>
// //           {students.map(student => (
// //             <option key={student.id} value={student.name}>{student.name}</option>
// //           ))}
// //         </select>

// //         <Input type="number" value={number} onChange={(e) => setNumber(e.target.value)} />
// //         <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} />
        
// //         {/* Status Dropdown */}
// //         <select value={status} onChange={(e) => setStatus(e.target.value)}>
// //           <option value="Draft">Draft</option>
// //           <option value="Pending">Pending</option>
// //           <option value="Sent">Sent</option>
// //         </select>
// //       </div>

// //       <div className="mt-4">
// //         <div className="grid grid-cols-5 gap-2 font-bold">
// //           <span>Item</span><span>Description</span><span>Quantity</span><span>Price</span><span>Total</span>
// //         </div>
// //         {items.map((item, index) => (
// //           <div key={index} className="grid grid-cols-5 gap-2 mt-2">
// //             <Input value={item.item} onChange={(e) => handleItemChange(index, "item", e.target.value)} />
// //             <Input value={item.description} onChange={(e) => handleItemChange(index, "description", e.target.value)} />
// //             <Input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", e.target.value)} />
// //             <Input type="number" value={item.price} onChange={(e) => handleItemChange(index, "price", e.target.value)} />
// //             <Input type="text" value={`₹ ${item.total.toFixed(2)}`} disabled />
// //             <button onClick={() => removeItem(index)}>🗑</button>
// //           </div>
// //         ))}
// //         <button onClick={addItem} className="mt-2 p-2 bg-blue-500 text-white rounded">+ Add Field</button>
// //       </div>
      
// //       <div className="mt-4">
// //         <div className="grid grid-cols-2 gap-4">
// //           <span>Sub Total:</span> <span>₹ {subtotal.toFixed(2)}</span>
// //           <select value={tax} onChange={(e) => setTax(parseFloat(e.target.value))}>
// //             <option value={0}>Select Tax Value</option>
// //             <option value={9}>9%</option>
// //             <option value={18}>18%</option>
// //           </select>
// //           <span>Tax:</span> <span>₹ {taxAmount.toFixed(2)}</span>
// //           <span>Total:</span> <span>₹ {totalAmount.toFixed(2)}</span>
// //         </div>
// //       </div>

// //       <Button onClick={saveInvoice} className="mt-4 p-2 bg-green-500 text-white rounded">Save</Button>
// //     </div>
// //   );
// // };


// import React, { useState, useEffect } from "react";
// import { db } from "../../../config/firebase";
// import { collection, getDocs, addDoc } from "firebase/firestore";
// import Button from "../../../components/ui/Button";
// import { Input } from "../../../components/ui/Input";
// import Select from "../../../components/ui/Select";

// export default function CreateInvoice() {
//   const [students, setStudents] = useState([]);
//   const [selectedStudent, setSelectedStudent] = useState("");
//   const [number, setNumber] = useState("1");
//   const [year, setYear] = useState("2025");
//   const [status, setStatus] = useState("Draft");
//   const [tax, setTax] = useState(0);
//   const [items, setItems] = useState([
//     { item: "", description: "", quantity: 1, price: "", total: 0 }
//   ]);

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         const studentsCollection = collection(db, "student"); // Firestore collection name
//         const studentSnapshot = await getDocs(studentsCollection);
//         const studentList = studentSnapshot.docs.map(doc => ({
//           id: doc.id,
//           name: `${doc.data().first_name} ${doc.data().last_name}`, // Combine first and last name
//         }));
//         setStudents(studentList);
//       } catch (error) {
//         console.error("Error fetching students:", error);
//       }
//     };

//     fetchStudents();
//   }, []);

//   const handleItemChange = (index, field, value) => {
//     const updatedItems = [...items];
//     updatedItems[index][field] = value;
//     if (field === "quantity" || field === "price") {
//       updatedItems[index].total =
//         (parseFloat(updatedItems[index].quantity) || 0) *
//         (parseFloat(updatedItems[index].price) || 0);
//     }
//     setItems(updatedItems);
//   };

//   const addItem = () => {
//     setItems([...items, { item: "", description: "", quantity: 1, price: "", total: 0 }]);
//   };

//   const removeItem = (index) => {
//     const updatedItems = items.filter((_, i) => i !== index);
//     setItems(updatedItems);
//   };

//   const subtotal = items.reduce((sum, item) => sum + item.total, 0);
//   const taxAmount = (subtotal * tax) / 100;
//   const totalAmount = subtotal + taxAmount;

//   const saveInvoice = async () => {
//     try {
//       await addDoc(collection(db, "invoices"), {
//         client: selectedStudent,
//         number,
//         year,
//         status,
//         items,
//         subtotal,
//         tax,
//         taxAmount,
//         totalAmount,
//         timestamp: new Date()
//       });
//       alert("Invoice saved successfully!");
//     } catch (error) {
//       console.error("Error saving invoice: ", error);
//     }
//   };

//   return (
//     <div className="p-6 bg-white shadow-md rounded-md max-w-4xl mx-auto">
//       <h2 className="text-xl font-bold">New Invoice</h2>
//       <div className="grid grid-cols-3 gap-4 mt-4">
//         {/* Student Dropdown */}
//         <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
//           <option value="" disabled>Select Student</option>
//           {students.map(student => (
//             <option key={student.id} value={student.name}>{student.name}</option>
//           ))}
//         </select>

//         <Input type="number" value={number} onChange={(e) => setNumber(e.target.value)} />
//         <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} />
        
//         {/* Status Dropdown */}
//         <select value={status} onChange={(e) => setStatus(e.target.value)}>
//           <option value="Draft">Draft</option>
//           <option value="Pending">Pending</option>
//           <option value="Sent">Sent</option>
//         </select>
//       </div>

//       <div className="mt-4">
//         <div className="grid grid-cols-5 gap-2 font-bold">
//           <span>Item</span><span>Description</span><span>Quantity</span><span>Price</span><span>Total</span>
//         </div>
//         {items.map((item, index) => (
//           <div key={index} className="grid grid-cols-5 gap-2 mt-2">
//             <Input value={item.item} onChange={(e) => handleItemChange(index, "item", e.target.value)} />
//             <Input value={item.description} onChange={(e) => handleItemChange(index, "description", e.target.value)} />
//             <Input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", e.target.value)} />
//             <Input type="number" value={item.price} onChange={(e) => handleItemChange(index, "price", e.target.value)} />
//             <Input type="text" value={`₹ ${item.total.toFixed(2)}`} disabled />
//             <button onClick={() => removeItem(index)}>🗑</button>
//           </div>
//         ))}
//         <button onClick={addItem} className="mt-2 p-2 bg-blue-500 text-white rounded">+ Add Field</button>
//       </div>
      
//       <div className="mt-4">
//         <div className="grid grid-cols-2 gap-4">
//           <span>Sub Total:</span> <span>₹ {subtotal.toFixed(2)}</span>
//           <select value={tax} onChange={(e) => setTax(parseFloat(e.target.value))}>
//             <option value={0}>Select Tax Value</option>
//             <option value={9}>9%</option>
//             <option value={18}>18%</option>
//           </select>
//           <span>Tax:</span> <span>₹ {taxAmount.toFixed(2)}</span>
//           <span>Total:</span> <span>₹ {totalAmount.toFixed(2)}</span>
//         </div>
//       </div>

//       <Button onClick={saveInvoice} className="mt-4 p-2 bg-green-500 text-white rounded">Save</Button>
//     </div>
//   );
// };


import React, { useState, useEffect } from "react";
import Button from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import { Calendar } from "../../../components/ui/Calendar";
import { db } from "../../../config/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore"; 

export default function CreateInvoice() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");

  const [courses, setCourse] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState("");

  const [instructors, setInstructor] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState("");

  const [number, setNumber] = useState("1");
  const [year, setYear] = useState("2025");
  const [currency, setCurrency] = useState("USD");
  const [status, setStatus] = useState("Draft");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Default to today
  const [expiryDate, setExpiryDate] = useState("");
  const [note, setNote] = useState("");
  const [tax, setTax] = useState(0);
  const [items, setItems] = useState([{ item: "", description: "", quantity: 1, price: "", total: 0 }]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsCollection = collection(db, "student");
        const studentSnapshot = await getDocs(studentsCollection);
        const studentList = studentSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setStudents(studentList);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();


    const fetchInstructor = async () => {
        try {
          const instructorCollection = collection(db, "Instructor");
          const instructorSnapshot = await getDocs(instructorCollection);
          const instructorList = instructorSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setInstructor(instructorList);
        } catch (error) {
          console.error("Error fetching instructor:", error);
        }
      };
      fetchInstructor();


      const fetchCourses = async () => {
        try {
          const courseCollection = collection(db, "Course");
          const courseSnapshot = await getDocs(courseCollection);
          const courseList = courseSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setCourse(courseList);
        } catch (error) {
          console.error("Error fetching Courses:", error);
        }
      };
      fetchCourses();
  }, []);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    if (field === "quantity" || field === "price") {
      updatedItems[index].total = (parseFloat(updatedItems[index].quantity) || 0) * (parseFloat(updatedItems[index].price) || 0);
    }
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([...items, { item: "", description: "", quantity: 1, price: "", total: 0 }]);
  };

  const removeItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = (subtotal * tax) / 100;
  const totalAmount = subtotal + taxAmount;

  const saveInvoice = async () => {
    try {
      await addDoc(collection(db, "invoices"), {
        student: selectedStudent,
        instructor: selectedInstructor,
        course: selectedCourses,
        // owner: selectedOwner,
        // course: selectedCourse,
        number,
        year,
        currency,
        status,
        date,
        expiryDate,
        note,
        items,
        subtotal,
        tax,
        taxAmount,
        totalAmount,
        timestamp: new Date()
      });
      alert("Invoice saved successfully!");
    } catch (error) {
      console.error("Error saving invoice: ", error);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md max-w-4xl mx-auto">
      <h2 className="text-xl font-bold">New Invoice</h2>
      
      {/* Invoice Fields */}
      <div className="grid grid-cols-2 gap-4 mt-4">


      <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
           <option value="" disabled>Select Student</option>
           {students.map(student => (
             <option key={student.id} value={student.name}>{student.first_name}</option>
           ))}
         </select>


         <select value={selectedInstructor} onChange={(e) => setSelectedInstructor(e.target.value)}>
           <option value="" disabled>Select Owner</option>
           {instructors.map(instructor => (
             <option key={instructor.id} value={instructor.f_name}>{instructor.f_name}</option>
           ))}
         </select>


         <select value={selectedCourses} onChange={(e) => setSelectedCourses(e.target.value)}>
           <option value="" disabled>Select Course</option>
           {courses.map(course => (
             <option key={course.id} value={course.name}>{course.name}</option>
           ))}
         </select>


        {/* // <Select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
        //   <option value="" disabled>Select Student</option>
        //   {students.map(student => ( */}
        {/* //     <option key={student.id} value={student.id}>
        //       {student.first_name} {student.last_name}
        //     </option>
        //   ))}
        // </Select> */}
        <Input type="number" value={number} onChange={(e) => setNumber(e.target.value)} />
        <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} />
        {/* <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="USD">US Dollar ($)</option>
          <option value="INR">Indian Rupee (₹)</option>
        </Select> */}
        <Select
           options={[{ value: "INR", label: "₹ (Indian Rupee)" }]}
         />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
           <option value="Draft">Draft</option>
           <option value="Pending">Pending</option>
           <option value="Sent">Sent</option>
         </select>
        {/* <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Draft">Draft</option>
          <option value="Pending">Pending</option>
          <option value="Sent">Sent</option>
        </Select> */}
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <Input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
        <Input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note" />
      </div>

      {/* Invoice Items */}
      <div className="mt-4">
        <div className="grid grid-cols-5 gap-2 font-bold">
          <span>Item</span><span>Description</span><span>Quantity</span><span>Price</span><span>Total</span>
        </div>
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-5 gap-2 mt-2">
            <Input value={item.item} onChange={(e) => handleItemChange(index, "item", e.target.value)} />
            <Input value={item.description} onChange={(e) => handleItemChange(index, "description", e.target.value)} />
            <Input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", e.target.value)} />
            <Input type="number" value={item.price} onChange={(e) => handleItemChange(index, "price", e.target.value)} />
            <Input type="text" value={`₹ ${item.total.toFixed(2)}`} />
            <button onClick={() => removeItem(index)}>🗑</button>
          </div>
        ))}
        <button onClick={addItem} className="mt-2 p-2 bg-blue-500 text-white rounded">+ Add Item</button>
      </div>
      
      {/* Tax & Total */}
      <div className="mt-4">
        <div className="grid grid-cols-2 gap-4">
          <span>Sub Total:</span> <span>$ {subtotal.toFixed(2)}</span>
          {/* <Select value={tax} onChange={(e) => setTax(parseFloat(e.target.value))}>
            <option value={0}>Select Tax Value</option>
            <option value={9}>9%</option>
            <option value={18}>18%</option>
          </Select> */}

{/* <select value={status} onChange={(e) => setStatus(e.target.value)}>
           <option value="Draft">Draft</option>
           <option value="Pending">Pending</option>
           <option value="Sent">Sent</option>
         </select> */}

<select value={tax} onChange={(e) => setTax(parseFloat(e.target.value))}>
             <option value={0}>Select Tax Value</option>
             <option value={9}>9%</option>
             <option value={18}>18%</option>
           </select>


          <span>Tax:</span> <span> {taxAmount.toFixed(2)}</span>
          <span>Total:</span> <span>₹ {totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Save Button */}
      <Button onClick={saveInvoice} className="mt-4 p-2 bg-green-500 text-white rounded">Save</Button>
    </div>
  );
}
