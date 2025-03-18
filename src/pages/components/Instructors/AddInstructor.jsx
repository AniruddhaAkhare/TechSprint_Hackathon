// import { useState } from "react";
// import { db } from '../../../config/firebase';
// import { addDoc, updateDoc, doc, collection } from 'firebase/firestore';
// import { Button, Input, Select, Option, Drawer } from "@material-tailwind/react";

// export default function AddInstructor({ open, onClose, instructor, centers, roles, setInstructorList }) {
//     const [selectedInstructor, setSelectedInstructor] = useState(instructor || {});

//     const instructorCollectionRef = collection(db, "Instructor");

//     const handleSaveInstructor = async () => {
//         if (!selectedInstructor.f_name || !selectedInstructor.email || !selectedInstructor.phone || 
//             !selectedInstructor.specialization || !selectedInstructor.center || !selectedInstructor.role) {
//             alert("All fields are required!");
//             return;
//         }

//         try {
//             if (selectedInstructor.id) {
//                 await updateDoc(doc(db, "Instructor", selectedInstructor.id), selectedInstructor);
//                 setInstructorList(prev => prev.map(i => i.id === selectedInstructor.id ? selectedInstructor : i));
//             } else {
//                 const newDoc = await addDoc(instructorCollectionRef, selectedInstructor);
//                 setInstructorList(prev => [...prev, { id: newDoc.id, ...selectedInstructor }]);
//             }
//             onClose();
//         } catch (error) {
//             console.error("Error saving instructor:", error);
//         }
//     };

//     return (
//         <Drawer open={open} onClose={onClose} placement="right" size={500}>
//             <div className="p-6 w-full">
//                 <h2 className="text-lg font-bold mb-4">{selectedInstructor?.id ? "Edit" : "Add"} Instructor</h2>
//                 <form className="space-y-4">
//                     <Input 
//                         label="First Name" 
//                         value={selectedInstructor?.f_name || ""} 
//                         onChange={(e) => setSelectedInstructor({ ...selectedInstructor, f_name: e.target.value })} 
//                     />
//                     <Input 
//                         label="Last Name" 
//                         value={selectedInstructor?.l_name || ""} 
//                         onChange={(e) => setSelectedInstructor({ ...selectedInstructor, l_name: e.target.value })} 
//                     />
//                     <Input 
//                         label="Email" 
//                         value={selectedInstructor?.email || ""} 
//                         onChange={(e) => setSelectedInstructor({ ...selectedInstructor, email: e.target.value })} 
//                     />
//                     <Input 
//                         label="Phone" 
//                         value={selectedInstructor?.phone || ""} 
//                         onChange={(e) => setSelectedInstructor({ ...selectedInstructor, phone: e.target.value })} 
//                     />
//                     <Input 
//                         label="Specialization" 
//                         value={selectedInstructor?.specialization || ""} 
//                         onChange={(e) => setSelectedInstructor({ ...selectedInstructor, specialization: e.target.value })} 
//                     />
//                     <Select 
//                         label="Center" 
//                         value={selectedInstructor?.center || ""} 
//                         onChange={(value) => setSelectedInstructor({ ...selectedInstructor, center: value })}
//                     >
//                         {centers.map(center => (
//                             <Option key={center.id} value={center.name}>{center.name}</Option>
//                         ))}
//                     </Select>
//                     <Select 
//                         label="Role" 
//                         value={selectedInstructor?.role || ""} 
//                         onChange={(value) => setSelectedInstructor({ ...selectedInstructor, role: value })}
//                     >
//                         {roles.map(role => (
//                             <Option key={role.id} value={role.name}>{role.name}</Option>
//                         ))}
//                     </Select>
//                     <Button className="mt-4" onClick={handleSaveInstructor}>
//                         {selectedInstructor?.id ? "Update" : "Add"}
//                     </Button>
//                 </form>
//             </div>
//         </Drawer>
//     );
// }


import { useState, useEffect } from "react";
import { db } from '../../../config/firebase';
import { addDoc, updateDoc, doc, collection } from 'firebase/firestore';

const AddInstructor = ({ open, onClose, instructor, centers, roles, setInstructorList }) => {
    const [selectedInstructor, setSelectedInstructor] = useState(instructor || {
        f_name: "",
        l_name: "",
        email: "",
        phone: "",
        specialization: "",
        center: "",
        role: ""
    });

    const instructorCollectionRef = collection(db, "Instructor");

    // Update selectedInstructor when the instructor prop changes (for edit mode)
    useEffect(() => {
        if (instructor) {
            setSelectedInstructor(instructor);
        } else {
            setSelectedInstructor({
                f_name: "",
                l_name: "",
                email: "",
                phone: "",
                specialization: "",
                center: "",
                role: ""
            });
        }
    }, [instructor]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedInstructor.f_name || !selectedInstructor.email || !selectedInstructor.phone || 
            !selectedInstructor.specialization || !selectedInstructor.center || !selectedInstructor.role) {
            alert("All fields are required!");
            return;
        }

        try {
            if (selectedInstructor.id) {
                await updateDoc(doc(db, "Instructor", selectedInstructor.id), selectedInstructor);
                setInstructorList(prev => prev.map(i => i.id === selectedInstructor.id ? selectedInstructor : i));
                alert("Instructor updated successfully!");
            } else {
                const newDoc = await addDoc(instructorCollectionRef, selectedInstructor);
                setInstructorList(prev => [...prev, { id: newDoc.id, ...selectedInstructor }]);
                alert("Instructor created successfully!");
            }
            resetForm();
            onClose();
        } catch (error) {
            console.error("Error saving instructor:", error);
            alert("Failed to save instructor. Please try again.");
        }
    };

    const resetForm = () => {
        setSelectedInstructor({
            f_name: "",
            l_name: "",
            email: "",
            phone: "",
            specialization: "",
            center: "",
            role: ""
        });
    };

    return (
        <div
            className={`fixed top-0 right-0 h-full bg-white w-2/5 shadow-lg transform transition-transform duration-300 ${
                open ? "translate-x-0" : "translate-x-full"
            } p-4 overflow-y-auto`}
        >
            <button 
                type="button" 
                onClick={onClose} 
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition duration-200"
            >
                Back
            </button>
            <h1>{selectedInstructor?.id ? "Edit Instructor" : "Add Instructor"}</h1>

            <form onSubmit={handleSubmit}>
                <label htmlFor="f_name">First Name:</label>
                <input 
                    type="text" 
                    value={selectedInstructor.f_name} 
                    placeholder="First Name" 
                    onChange={(e) => setSelectedInstructor({ ...selectedInstructor, f_name: e.target.value })} 
                    required 
                />

                <label htmlFor="l_name">Last Name:</label>
                <input 
                    type="text" 
                    value={selectedInstructor.l_name} 
                    placeholder="Last Name" 
                    onChange={(e) => setSelectedInstructor({ ...selectedInstructor, l_name: e.target.value })} 
                    required 
                />

                <label htmlFor="email">Email:</label>
                <input 
                    type="email" 
                    value={selectedInstructor.email} 
                    placeholder="Email" 
                    onChange={(e) => setSelectedInstructor({ ...selectedInstructor, email: e.target.value })} 
                    required 
                />

                <label htmlFor="phone">Phone:</label>
                <input 
                    type="text" 
                    value={selectedInstructor.phone} 
                    placeholder="Phone" 
                    onChange={(e) => setSelectedInstructor({ ...selectedInstructor, phone: e.target.value })} 
                    required 
                />

                <label htmlFor="specialization">Specialization:</label>
                <input 
                    type="text" 
                    value={selectedInstructor.specialization} 
                    placeholder="Specialization" 
                    onChange={(e) => setSelectedInstructor({ ...selectedInstructor, specialization: e.target.value })} 
                    required 
                />

                <label htmlFor="center">Center:</label>
                <select 
                    value={selectedInstructor.center} 
                    onChange={(e) => setSelectedInstructor({ ...selectedInstructor, center: e.target.value })} 
                    required
                >
                    <option value="">Select a Center</option>
                    {centers.map(center => (
                        <option key={center.id} value={center.name}>{center.name}</option>
                    ))}
                </select>

                <label htmlFor="role">Role:</label>
                <select 
                    value={selectedInstructor.role} 
                    onChange={(e) => setSelectedInstructor({ ...selectedInstructor, role: e.target.value })} 
                    required
                >
                    <option value="">Select a Role</option>
                    {roles.map(role => (
                        <option key={role.id} value={role.name}>{role.name}</option>
                    ))}
                </select>

                <div className="flex justify-end">
                    <button 
                        type="submit" 
                        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200"
                    >
                        {selectedInstructor?.id ? "Update Instructor" : "Add Instructor"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddInstructor;