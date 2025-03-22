


// // // // import { useState, useEffect } from "react";
// // // // import { db } from '../../../config/firebase';
// // // // import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
// // // // import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Select, Option } from "@material-tailwind/react";
// // // // import { onSnapshot } from "firebase/firestore";

// // // // export default function Instructor() {
// // // //     const [instructorList, setInstructorList] = useState([]);
// // // //     const [centers, setCenters] = useState([]);
// // // //     const [roles, setRoles] = useState([]);
// // // //     const [searchTerm, setSearchTerm] = useState("");

// // // //     // Add Instructor States
// // // //     const [openAddInstructor, setOpenAddInstructor] = useState(false);
// // // //     const [instructorFname, setInstructorFname] = useState("");
// // // //     const [instructorLname, setInstructorLname] = useState("");
// // // //     const [instructorEmail, setInstructorEmail] = useState("");
// // // //     const [instructorPhone, setInstructorPhone] = useState("");
// // // //     const [instructorSpecialization, setInstructorSpecialization] = useState("");
// // // //     const [selectedCenter, setSelectedCenter] = useState("");
// // // //     const [selectedRole, setSelectedRole] = useState("");

// // // //     // Update Instructor States
// // // //     const [openUpdate, setOpenUpdate] = useState(false);
// // // //     const [updatingInstructorId, setUpdatingInstructorId] = useState("");
// // // //     const [updatedFname, setUpdatedFname] = useState("");
// // // //     const [updatedLname, setUpdatedLname] = useState("");
// // // //     const [updatedEmail, setUpdatedEmail] = useState("");
// // // //     const [updatedPhone, setUpdatedPhone] = useState("");
// // // //     const [updatedSpecialization, setUpdatedSpecialization] = useState("");
// // // //     const [updatedCenter, setUpdatedCenter] = useState("");
// // // //     const [updatedRole, setUpdatedRole] = useState("");

// // // //     // Delete Instructor States
// // // //     const [openDelete, setOpenDelete] = useState(false);
// // // //     const [deleteId, setDeleteId] = useState(null);

// // // //     const instructorCollectionRef = collection(db, "Instructor");
// // // //     const centerCollectionRef = collection(db, "Centers");
// // // //     const roleCollectionRef = collection(db, "roles");

// // // //     // Fetch Instructors
// // // //     const getInstructorList = async () => {
// // // //         try {
// // // //             const data = await getDocs(instructorCollectionRef);
// // // //             setInstructorList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
// // // //         } catch (err) {
// // // //             console.error(err);
// // // //         }
// // // //     };

// // // //     // Fetch Centers
// // // //     const getCentersList = async () => {
// // // //         try {
// // // //             const data = await getDocs(centerCollectionRef);
// // // //             setCenters(data.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
// // // //         } catch (err) {
// // // //             console.error(err);
// // // //         }
// // // //     };

// // // //     // Fetch Roles
// // // //     const getRolesList = async () => {
// // // //         try {
// // // //             const data = await getDocs(roleCollectionRef);
// // // //             setRoles(data.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
// // // //         } catch (err) {
// // // //             console.error(err);
// // // //         }
// // // //     };

// // // //     useEffect(() => {
// // // //         getInstructorList();
// // // //         getCentersList();
// // // //         getRolesList();

// // // //         // Listen for role updates
// // // //         const unsubscribe = onSnapshot(roleCollectionRef, (snapshot) => {
// // // //             snapshot.docChanges().forEach((change) => {
// // // //                 if (change.type === "modified") {
// // // //                     const updatedRole = change.doc.data();
// // // //                     updateInstructorRole(updatedRole.id, updatedRole.name);
// // // //                 }
// // // //             });
// // // //         });

// // // //         return () => unsubscribe(); // Cleanup listener on unmount
// // // //     }, []);


// // // //     const updateInstructorRole = async (instructorId, newRole) => {
// // // //         try {
// // // //             await updateDoc(doc(db, "Instructor", instructorId), {
// // // //                 role: newRole
// // // //             });
// // // //             console.log(`Instructor ${instructorId} role updated to ${newRole}`);
// // // //             getInstructorList();
// // // //         } catch (error) {
// // // //             console.error("Error updating instructor role:", error);
// // // //         }
// // // //     };

// // // //     // Add Instructor
// // // //     const handleOpenAddInstructor = () => setOpenAddInstructor(true);
// // // //     const handleCloseAddInstructor = () => {
// // // //         setOpenAddInstructor(false);
// // // //         setInstructorFname("");
// // // //         setInstructorLname("");
// // // //         setInstructorEmail("");
// // // //         setInstructorPhone("");
// // // //         setInstructorSpecialization("");
// // // //         setSelectedCenter("");
// // // //         setSelectedRole("");
// // // //     };

// // // //     const handleSubmitInstructor = async () => {
// // // //         if (!instructorFname || !instructorLname || !instructorEmail || !instructorPhone || !instructorSpecialization || !selectedCenter || !selectedRole) {
// // // //             alert("Please fill all fields.");
// // // //             return;
// // // //         }

// // // //         try {
// // // //             await addDoc(instructorCollectionRef, {
// // // //                 f_name: instructorFname,
// // // //                 l_name: instructorLname,
// // // //                 email: instructorEmail,
// // // //                 phone: instructorPhone,
// // // //                 specialization: instructorSpecialization,
// // // //                 center: selectedCenter,
// // // //                 role: selectedRole
// // // //             });

// // // //             getInstructorList();
// // // //             handleCloseAddInstructor();
// // // //         } catch (err) {
// // // //             console.error(err);
// // // //         }
// // // //     };

// // // //     // Open Update Dialog

// // // //     const handleOpenUpdate = (instructor) => {
// // // //         console.log("Selected Instructor for Update:", instructor);

// // // //         setUpdatingInstructorId(instructor.id);
// // // //         setUpdatedFname(instructor.f_name);
// // // //         setUpdatedLname(instructor.l_name);
// // // //         setUpdatedEmail(instructor.email);
// // // //         setUpdatedPhone(instructor.phone);
// // // //         setUpdatedSpecialization(instructor.specialization);
// // // //         setUpdatedCenter(instructor.center);
// // // //         setUpdatedRole(instructor.role);
// // // //         setOpenUpdate(true);
// // // //     };

// // // //     // const handleOpenUpdate = (instructor) => {
// // // //     //     setUpdatingInstructorId(instructor.id);
// // // //     //     setUpdatedFname(instructor.f_name);
// // // //     //     setUpdatedLname(instructor.l_name);
// // // //     //     setUpdatedEmail(instructor.email);
// // // //     //     setUpdatedPhone(instructor.phone);
// // // //     //     setUpdatedSpecialization(instructor.specialization);
// // // //     //     setUpdatedCenter(instructor.center);
// // // //     //     setOpenUpdate(true);
// // // //     // };

// // // //     // Update Instructor

// // // //     const handleUpdate = async () => {
// // // //         console.log("Updating Instructor ID:", updatingInstructorId);

// // // //         if (updatingInstructorId) {
// // // //             try {
// // // //                 await updateDoc(doc(db, "Instructor", updatingInstructorId), {
// // // //                     f_name: updatedFname,
// // // //                     l_name: updatedLname,
// // // //                     email: updatedEmail,
// // // //                     phone: updatedPhone,
// // // //                     specialization: updatedSpecialization,
// // // //                     center: updatedCenter,
// // // //                     role: updatedRole
// // // //                 });

// // // //                 console.log("Update Successful");
// // // //                 getInstructorList();  // Refresh the list after updating
// // // //                 setOpenUpdate(false); // Close the dialog
// // // //             } catch (error) {
// // // //                 console.error("Error updating instructor:", error);
// // // //             }
// // // //         } else {
// // // //             console.log("No instructor ID found");
// // // //         }
// // // //     };

// // // //     // const handleUpdate = async () => {
// // // //     //     if (updatingInstructorId) {
// // // //     //         try {
// // // //     //             await updateDoc(doc(db, "Instructor", updatingInstructorId), {
// // // //     //                 f_name: updatedFname,
// // // //     //                 l_name: updatedLname,
// // // //     //                 email: updatedEmail,
// // // //     //                 phone: updatedPhone,
// // // //     //                 specialization: updatedSpecialization,
// // // //     //                 center: updatedCenter
// // // //     //             });

// // // //     //             getInstructorList();
// // // //     //             setOpenUpdate(false);
// // // //     //         } catch (error) {
// // // //     //             console.error("Error updating instructor:", error);
// // // //     //         }
// // // //     //     }
// // // //     // };

// // // //     // Delete Instructor
// // // //     const handleOpenDelete = (id) => {
// // // //         setDeleteId(id);
// // // //         setOpenDelete(true);
// // // //     };

// // // //     const handleDelete = async () => {
// // // //         if (deleteId) {
// // // //             try {
// // // //                 await deleteDoc(doc(db, "Instructor", deleteId));
// // // //                 getInstructorList();
// // // //             } catch (err) {
// // // //                 console.error("Error deleting instructor:", err);
// // // //             }
// // // //         }
// // // //         setOpenDelete(false);
// // // //     };

// // // //     return (
// // // //         <div className="flex-col w-screen ml-80 p-4">
// // // //             <h1 className="text-2xl font-bold mb-4">Admins & Instructors</h1>
// // // //             <p className="text-gray-600 mb-6">Create and manage users with different roles on the platform.</p>

// // // //             <div className="flex items-center justify-between mb-4">
// // // //                 <input
// // // //                     type="text"
// // // //                     placeholder="Search by Name, Email, Mobile..."
// // // //                     className="p-2 border border-gray-300 rounded-lg w-1/3"
// // // //                     value={searchTerm}
// // // //                     onChange={(e) => setSearchTerm(e.target.value)}
// // // //                 />
// // // //                 <button onClick={handleOpenAddInstructor} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
// // // //                     + Add Instructor
// // // //                 </button>
// // // //             </div>

// // // //             <div className="space-y-4">
// // // //                 {instructorList.map((instructor) => (
// // // //                     <div key={instructor.id} className="border p-4 rounded-lg shadow">
// // // //                         <h2 className="text-lg font-semibold">{instructor.f_name} {instructor.l_name}</h2>
// // // //                         <p className="text-gray-600">{instructor.email}</p>
// // // //                         <p className="text-gray-600">{instructor.phone}</p>
// // // //                         <p className="text-gray-600">{instructor.specialization}</p>
// // // //                         <p className="text-gray-600"><strong>Center:</strong> {instructor.center}</p>
// // // //                         <p className="text-gray-600"><strong>Roles:</strong> {instructor.role}</p>
// // // //                         <div className="flex items-center space-x-2 mt-2">
// // // //                             <button onClick={() => handleOpenDelete(instructor.id)} className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600">
// // // //                                 Delete
// // // //                             </button>
// // // //                             <button onClick={() => handleOpenUpdate(instructor)} className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600">
// // // //                                 Update
// // // //                             </button>
// // // //                         </div>
// // // //                     </div>
// // // //                 ))}
// // // //             </div>

// // // //             {/* Add Instructor Dialog */}
// // // //             <Dialog open={openAddInstructor} handler={handleCloseAddInstructor}>
// // // //                 <DialogHeader>Add Instructor</DialogHeader>
// // // //                 <DialogBody>
// // // //                     <div className="grid grid-cols-1 gap-4">
// // // //                         <Input label="First Name" value={instructorFname} onChange={(e) => setInstructorFname(e.target.value)} />
// // // //                         <Input label="Last Name" value={instructorLname} onChange={(e) => setInstructorLname(e.target.value)} />
// // // //                         <Input label="Email" value={instructorEmail} onChange={(e) => setInstructorEmail(e.target.value)} />
// // // //                         <Input label="Phone" value={instructorPhone} onChange={(e) => setInstructorPhone(e.target.value)} />
// // // //                         <Input label="Specialization" value={instructorSpecialization} onChange={(e) => setInstructorSpecialization(e.target.value)} />
// // // //                         <Select label="Select Center" value={selectedCenter} onChange={(value) => setSelectedCenter(value)}>
// // // //                             {centers.map((center) => (
// // // //                                 <Option key={center.id} value={center.name}>{center.name}</Option>
// // // //                             ))}
// // // //                         </Select>

// // // //                         <Select label="Select Role" value={selectedRole} onChange={(value) => setSelectedRole(value)}>
// // // //                             {roles.map((role) => (
// // // //                                 <Option key={role.id} value={role.name}>{role.name}</Option>
// // // //                             ))}
// // // //                         </Select>
// // // //                     </div>
// // // //                 </DialogBody>
// // // //                 <DialogFooter>
// // // //                     <Button variant="filled" color="green" onClick={handleSubmitInstructor}>Add Instructor</Button>
// // // //                 </DialogFooter>


// // // //             </Dialog>


// // // //             {/* Update Instructor Dialog */}
// // // //             <Dialog open={openUpdate} handler={() => setOpenUpdate(false)}>
// // // //                     <DialogHeader>Update Instructor</DialogHeader>
// // // //                     <DialogBody>
// // // //                         <div className="grid grid-cols-1 gap-4">
// // // //                             <Input label="First Name" value={updatedFname} onChange={(e) => setUpdatedFname(e.target.value)} />
// // // //                             <Input label="Last Name" value={updatedLname} onChange={(e) => setUpdatedLname(e.target.value)} />
// // // //                             <Input label="Email" value={updatedEmail} onChange={(e) => setUpdatedEmail(e.target.value)} />
// // // //                             <Input label="Phone" value={updatedPhone} onChange={(e) => setUpdatedPhone(e.target.value)} />
// // // //                             <Input label="Specialization" value={updatedSpecialization} onChange={(e) => setUpdatedSpecialization(e.target.value)} />
// // // //                             <Select label="Select Center" value={updatedCenter} onChange={(value) => setUpdatedCenter(value)}>
// // // //                                 {centers.map((center) => (
// // // //                                     <Option key={center.id} value={center.name}>{center.name}</Option>
// // // //                                 ))}
// // // //                             </Select>

// // // //                             <Select label="Select Role" value={updatedRole} onChange={(value) => setUpdatedRole(value)}>
// // // //                                 {roles.map((role) => (
// // // //                                     <Option key={role.id} value={role.name}>{role.name}</Option>
// // // //                                 ))}
// // // //                             </Select>
// // // //                         </div>
// // // //                     </DialogBody>
// // // //                     <DialogFooter>
// // // //                         <Button variant="filled" color="blue" onClick={handleUpdate}>Update Instructor</Button>
// // // //                     </DialogFooter>
// // // //                 </Dialog>

// // // //         </div>
// // // //     );
// // // // }



// // // import { useState, useEffect } from "react";
// // // import { db } from '../../../config/firebase';
// // // import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';
// // // import { Button, Input, Select, Option, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";

// // // export default function Instructor() {
// // //     const [instructorList, setInstructorList] = useState([]);
// // //     const [centers, setCenters] = useState([]);
// // //     const [roles, setRoles] = useState([]);
// // //     const [searchTerm, setSearchTerm] = useState("");

// // //     // States for dialogs
// // //     const [openDialog, setOpenDialog] = useState(false);
// // //     const [openDelete, setOpenDelete] = useState(false);
// // //     const [selectedInstructor, setSelectedInstructor] = useState(null);

// // //     const instructorCollectionRef = collection(db, "Instructor");
// // //     const centerCollectionRef = collection(db, "Centers");
// // //     const roleCollectionRef = collection(db, "roles");

// // //     // Fetch data
// // //     useEffect(() => {
// // //         const fetchData = async () => {
// // //             const instructors = await getDocs(instructorCollectionRef);
// // //             setInstructorList(instructors.docs.map(doc => ({ id: doc.id, ...doc.data() })));

// // //             const centersData = await getDocs(centerCollectionRef);
// // //             setCenters(centersData.docs.map(doc => ({ id: doc.id, ...doc.data() })));

// // //             const rolesData = await getDocs(roleCollectionRef);
// // //             setRoles(rolesData.docs.map(doc => ({ id: doc.id, ...doc.data() })));
// // //         };

// // //         fetchData();
// // //         const unsubscribe = onSnapshot(roleCollectionRef, snapshot => {
// // //             snapshot.docChanges().forEach(change => {
// // //                 if (change.type === "modified") {
// // //                     fetchData();
// // //                 }
// // //             });
// // //         });

// // //         return () => unsubscribe();
// // //     }, []);

// // //     // Handle Add & Update Instructor
// // //     const handleSaveInstructor = async () => {
// // //         if (!selectedInstructor.f_name || !selectedInstructor.email || !selectedInstructor.phone || !selectedInstructor.specialization || !selectedInstructor.center || !selectedInstructor.role) {
// // //             alert("All fields are required!");
// // //             return;
// // //         }

// // //         try {
// // //             if (selectedInstructor.id) {
// // //                 await updateDoc(doc(db, "Instructor", selectedInstructor.id), selectedInstructor);
// // //             } else {
// // //                 await addDoc(instructorCollectionRef, selectedInstructor);
// // //             }
// // //             setOpenDialog(false);
// // //         } catch (error) {
// // //             console.error("Error saving instructor:", error);
// // //         }
// // //     };
// // //     const handleDeleteInstructor = async () => {
// // //         if (!selectedInstructor || !selectedInstructor.id) {
// // //             console.error("No instructor selected for deletion");
// // //             return;
// // //         }
// // //         try {
// // //             console.log("Deleting instructor:", selectedInstructor); // Debugging
// // //             await deleteDoc(doc(db, "Instructor", selectedInstructor.id));
// // //             setInstructorList(prevList => prevList.filter(inst => inst.id !== selectedInstructor.id));
// // //             setOpenDelete(false);
// // //         } catch (error) {
// // //             console.error("Error deleting instructor:", error);
// // //         }
// // //     };

// // //     return (
// // //         <div className="p-6 w-full">
// // //             <div className="flex justify-between items-center mb-4">
// // //                 <Input placeholder="Search Instructor..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-1/3" />
// // //                 <Button color="blue" onClick={() => { setSelectedInstructor({}); setOpenDialog(true); }}>+ Add Instructor</Button>
// // //             </div>

// // //             <table className="w-full border rounded-md shadow-md">
// // //                 <thead className="bg-gray-200">
// // //                     <tr>
// // //                         <th className="p-2">Name</th>
// // //                         <th className="p-2">Email</th>
// // //                         <th className="p-2">Phone</th>
// // //                         <th className="p-2">Specialization</th>
// // //                         <th className="p-2">Center</th>
// // //                         <th className="p-2">Role</th>
// // //                         <th className="p-2">Actions</th>
// // //                     </tr>
// // //                 </thead>
// // //                 <tbody>
// // //                     {instructorList.filter(i => i.f_name.toLowerCase().includes(searchTerm.toLowerCase())).map(instructor => (
// // //                         <tr key={instructor.id} className="border-b">
// // //                             <td className="p-2">{instructor.f_name} {instructor.l_name}</td>
// // //                             <td className="p-2">{instructor.email}</td>
// // //                             <td className="p-2">{instructor.phone}</td>
// // //                             <td className="p-2">{instructor.specialization}</td>
// // //                             <td className="p-2">{instructor.center}</td>
// // //                             <td className="p-2">{instructor.role}</td>
// // //                             <td className="p-2">
// // //                                 <Button size="sm" color="blue" onClick={() => { setSelectedInstructor(instructor); setOpenDialog(true); }}>Edit</Button>
// // //                                 <Button
// // //                                     size="sm"
// // //                                     color="red"
// // //                                     onClick={() => {
// // //                                         console.log("Instructor to delete:", instructor); // Debugging
// // //                                         setSelectedInstructor(instructor);
// // //                                         setOpenDelete(true);
// // //                                     }}
// // //                                 >
// // //                                     Delete
// // //                                 </Button>

// // //                                 {/* <Button size="sm" color="red" onClick={() => { setSelectedInstructor(instructor); setOpenDelete(true); }}>Delete</Button> */}
// // //                             </td>
// // //                         </tr>
// // //                     ))}
// // //                 </tbody>
// // //             </table>


// // //             <Dialog open={openDelete} handler={() => setOpenDelete(false)}>
// // //                 <DialogHeader>Confirm Deletion</DialogHeader>
// // //                 <DialogBody>Are you sure you want to delete this instructor?</DialogBody>
// // //                 <DialogFooter>
// // //                     <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
// // //                     <Button color="red" onClick={handleDeleteInstructor}>Delete</Button>
// // //                 </DialogFooter>
// // //             </Dialog>


// // //             {/* Add/Edit Instructor Dialog */}
// // //             <Dialog open={openDialog} handler={() => setOpenDialog(false)}>
// // //                 <DialogHeader>{selectedInstructor?.id ? "Edit" : "Add"} Instructor</DialogHeader>
// // //                 <DialogBody>
// // //                     <Input label="First Name" value={selectedInstructor?.f_name || ""} onChange={(e) => setSelectedInstructor({ ...selectedInstructor, f_name: e.target.value })} />
// // //                     <Input label="Last Name" value={selectedInstructor?.l_name || ""} onChange={(e) => setSelectedInstructor({ ...selectedInstructor, l_name: e.target.value })} />
// // //                     <Input label="Email" value={selectedInstructor?.email || ""} onChange={(e) => setSelectedInstructor({ ...selectedInstructor, email: e.target.value })} />
// // //                     <Input label="Phone" value={selectedInstructor?.phone || ""} onChange={(e) => setSelectedInstructor({ ...selectedInstructor, phone: e.target.value })} />
// // //                     <Input label="Specialization" value={selectedInstructor?.specialization || ""} onChange={(e) => setSelectedInstructor({ ...selectedInstructor, specialization: e.target.value })} />
// // //                     <Select label="Select Center" value={selectedInstructor?.center || ""} onChange={(value) => setSelectedInstructor({ ...selectedInstructor, center: value })}>
// // //                         {centers.map(center => <Option key={center.id} value={center.name}>{center.name}</Option>)}
// // //                     </Select>
// // //                     <Select label="Select Role" value={selectedInstructor?.role || ""} onChange={(value) => setSelectedInstructor({ ...selectedInstructor, role: value })}>
// // //                         {roles.map(role => <Option key={role.id} value={role.name}>{role.name}</Option>)}
// // //                     </Select>
// // //                 </DialogBody>
// // //                 <DialogFooter>
// // //                     <Button onClick={handleSaveInstructor}>{selectedInstructor?.id ? "Update" : "Add"}</Button>
// // //                 </DialogFooter>
// // //             </Dialog>
// // //         </div>
// // //     );
// // // }

// // import { useState, useEffect } from "react";
// // import { db } from '../../../config/firebase';
// // import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';
// // import { Button, Input, Select, Option, Dialog, DialogHeader, DialogBody, DialogFooter, Drawer } from "@material-tailwind/react";

// // export default function Instructor() {
// //     const [instructorList, setInstructorList] = useState([]);
// //     const [centers, setCenters] = useState([]);
// //     const [roles, setRoles] = useState([]);
// //     const [searchTerm, setSearchTerm] = useState("");

// //     // States for dialogs
// //     const [openDrawer, setOpenDrawer] = useState(false);
// //     const [openDelete, setOpenDelete] = useState(false);
// //     const [selectedInstructor, setSelectedInstructor] = useState(null);

// //     const instructorCollectionRef = collection(db, "Instructor");
// //     const centerCollectionRef = collection(db, "Centers");
// //     const roleCollectionRef = collection(db, "roles");

// //     // Fetch data
// //     useEffect(() => {
// //         const fetchData = async () => {
// //             const instructors = await getDocs(instructorCollectionRef);
// //             setInstructorList(instructors.docs.map(doc => ({ id: doc.id, ...doc.data() })));

// //             const centersData = await getDocs(centerCollectionRef);
// //             setCenters(centersData.docs.map(doc => ({ id: doc.id, ...doc.data() })));

// //             const rolesData = await getDocs(roleCollectionRef);
// //             setRoles(rolesData.docs.map(doc => ({ id: doc.id, ...doc.data() })));
// //         };

// //         fetchData();
// //         const unsubscribe = onSnapshot(roleCollectionRef, snapshot => {
// //             snapshot.docChanges().forEach(change => {
// //                 if (change.type === "modified") {
// //                     fetchData();
// //                 }
// //             });
// //         });

// //         return () => unsubscribe();
// //     }, []);

// //     // Handle Add & Update Instructor
// //     const handleSaveInstructor = async () => {
// //         if (!selectedInstructor.f_name || !selectedInstructor.email || !selectedInstructor.phone || !selectedInstructor.specialization || !selectedInstructor.center || !selectedInstructor.role) {
// //             alert("All fields are required!");
// //             return;
// //         }

// //         try {
// //             if (selectedInstructor.id) {
// //                 await updateDoc(doc(db, "Instructor", selectedInstructor.id), selectedInstructor);
// //             } else {
// //                 await addDoc(instructorCollectionRef, selectedInstructor);
// //             }
// //             setOpenDrawer(false);
// //         } catch (error) {
// //             console.error("Error saving instructor:", error);
// //         }
// //     };

// //     const handleDeleteInstructor = async () => {
// //         if (!selectedInstructor || !selectedInstructor.id) {
// //             console.error("No instructor selected for deletion");
// //             return;
// //         }
// //         try {
// //             await deleteDoc(doc(db, "Instructor", selectedInstructor.id));
// //             setInstructorList(prevList => prevList.filter(inst => inst.id !== selectedInstructor.id));
// //             setOpenDelete(false);
// //         } catch (error) {
// //             console.error("Error deleting instructor:", error);
// //         }
// //     };

// //     return (
// //         <div className="p-6 w-full">
// //             <div className="flex justify-between items-center mb-4">
// //                 <Input placeholder="Search Instructor..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-1/3" />
// //                 <Button color="blue" onClick={() => { setSelectedInstructor({}); setOpenDrawer(true); }}>+ Add Instructor</Button>
// //             </div>

// //             <table className="w-full border rounded-md shadow-md">
// //                 <thead className="bg-gray-200">
// //                     <tr>
// //                         <th className="p-2">Name</th>
// //                         <th className="p-2">Email</th>
// //                         <th className="p-2">Phone</th>
// //                         <th className="p-2">Specialization</th>
// //                         <th className="p-2">Center</th>
// //                         <th className="p-2">Role</th>
// //                         <th className="p-2">Actions</th>
// //                     </tr>
// //                 </thead>
// //                 <tbody>
// //                     {instructorList.filter(i => i.f_name.toLowerCase().includes(searchTerm.toLowerCase())).map(instructor => (
// //                         <tr key={instructor.id} className="border-b">
// //                             <td className="p-2">{instructor.f_name} {instructor.l_name}</td>
// //                             <td className="p-2">{instructor.email}</td>
// //                             <td className="p-2">{instructor.phone}</td>
// //                             <td className="p-2">{instructor.specialization}</td>
// //                             <td className="p-2">{instructor.center}</td>
// //                             <td className="p-2">{instructor.role}</td>
// //                             <td className="p-2">
// //                                 <Button size="sm" color="blue" onClick={() => { setSelectedInstructor(instructor); setOpenDrawer(true); }}>Edit</Button>
// //                                 <Button size="sm" color="red" onClick={() => { setSelectedInstructor(instructor); setOpenDelete(true); }}>Delete</Button>
// //                             </td>
// //                         </tr>
// //                     ))}
// //                 </tbody>
// //             </table>

// //             {/* Delete Confirmation Dialog */}
// //             <Dialog open={openDelete} handler={() => setOpenDelete(false)}>
// //                 <DialogHeader>Confirm Deletion</DialogHeader>
// //                 <DialogBody>Are you sure you want to delete this instructor?</DialogBody>
// //                 <DialogFooter>
// //                     <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
// //                     <Button color="red" onClick={handleDeleteInstructor}>Delete</Button>
// //                 </DialogFooter>
// //             </Dialog>

// //             {/* Right-Side Drawer for Add/Edit Instructor */}
// //             <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)} placement="right" size={500}>
// //                 <div className="p-6 w-full">
// //                     <h2 className="text-lg font-bold mb-4">{selectedInstructor?.id ? "Edit" : "Add"} Instructor</h2>
// //                     <Input label="First Name" value={selectedInstructor?.f_name || ""} onChange={(e) => setSelectedInstructor({ ...selectedInstructor, f_name: e.target.value })} />
// //                     <Input label="Last Name" value={selectedInstructor?.l_name || ""} onChange={(e) => setSelectedInstructor({ ...selectedInstructor, l_name: e.target.value })} />
// //                     <Input label="Email" value={selectedInstructor?.email || ""} onChange={(e) => setSelectedInstructor({ ...selectedInstructor, email: e.target.value })} />
// //                     <Input label="Phone" value={selectedInstructor?.phone || ""} onChange={(e) => setSelectedInstructor({ ...selectedInstructor, phone: e.target.value })} />
// //                     <Input label="Specialization" value={selectedInstructor?.specialization || ""} onChange={(e) => setSelectedInstructor({ ...selectedInstructor, specialization: e.target.value })} />
// //                     <Button className="mt-4" onClick={handleSaveInstructor}>{selectedInstructor?.id ? "Update" : "Add"}</Button>
// //                 </div>
// //             </Drawer>
// //         </div>
// //     );
// // }


// // import { useState, useEffect } from "react";
// // import { db } from '../../../config/firebase';
// // import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
// // import { Button, Input, Select, Option, Dialog, DialogHeader, DialogBody, DialogFooter, Drawer } from "@material-tailwind/react";

// // export default function Instructor() {
// //     const [instructorList, setInstructorList] = useState([]);
// //     const [centers, setCenters] = useState([]);
// //     const [roles, setRoles] = useState([]);
// //     const [searchTerm, setSearchTerm] = useState("");

// //     const [openDrawer, setOpenDrawer] = useState(false);
// //     const [openDelete, setOpenDelete] = useState(false);
// //     const [selectedInstructor, setSelectedInstructor] = useState(null);

// //     const instructorCollectionRef = collection(db, "Instructor");
// //     const centerCollectionRef = collection(db, "Centers");
// //     const roleCollectionRef = collection(db, "roles");

// //     useEffect(() => {
// //         const fetchData = async () => {
// //             const instructors = await getDocs(instructorCollectionRef);
// //             setInstructorList(instructors.docs.map(doc => ({ id: doc.id, ...doc.data() })));

// //             const centersData = await getDocs(centerCollectionRef);
// //             setCenters(centersData.docs.map(doc => ({ id: doc.id, ...doc.data() })));

// //             const rolesData = await getDocs(roleCollectionRef);
// //             setRoles(rolesData.docs.map(doc => ({ id: doc.id, ...doc.data() })));
// //         };

// //         fetchData();
// //         const unsubscribe = onSnapshot(roleCollectionRef, fetchData);
// //         return () => unsubscribe();
// //     }, []);

// //     const handleSaveInstructor = async () => {
// //         if (!selectedInstructor.f_name || !selectedInstructor.email || !selectedInstructor.phone || !selectedInstructor.specialization || !selectedInstructor.center || !selectedInstructor.role) {
// //             alert("All fields are required!");
// //             return;
// //         }

// //         try {
// //             if (selectedInstructor.id) {
// //                 await updateDoc(doc(db, "Instructor", selectedInstructor.id), selectedInstructor);
// //             } else {
// //                 await addDoc(instructorCollectionRef, selectedInstructor);
// //             }
// //             setOpenDrawer(false);
// //         } catch (error) {
// //             console.error("Error saving instructor:", error);
// //         }
// //     };

// //     const handleDeleteInstructor = async () => {
// //         if (!selectedInstructor?.id) return;
// //         try {
// //             await deleteDoc(doc(db, "Instructor", selectedInstructor.id));
// //             setInstructorList(prevList => prevList.filter(inst => inst.id !== selectedInstructor.id));
// //             setOpenDelete(false);
// //         } catch (error) {
// //             console.error("Error deleting instructor:", error);
// //         }
// //     };

// //     return (
// //         <div className="flex-col w-screen ml-80 p-4">
// //             <div className="justify-between items-center p-4 mb-4">
// //         {/* // <div className="p-6 w-full">
// //         //     <div className="flex justify-between items-center mb-4"> */}
// //                 <Input placeholder="Search Instructor..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-1/3" />
// //                 <Button color="blue" onClick={() => { setSelectedInstructor({}); setOpenDrawer(true); }}>+ Add Instructor</Button>
// //             </div>

// //             <table className="w-full border rounded-md shadow-md">
// //                 <thead className="bg-gray-200">
// //                     <tr>
// //                         <th className="p-2">Name</th>
// //                         <th className="p-2">Email</th>
// //                         <th className="p-2">Phone</th>
// //                         <th className="p-2">Specialization</th>
// //                         <th className="p-2">Center</th>
// //                         <th className="p-2">Role</th>
// //                         <th className="p-2">Actions</th>
// //                     </tr>
// //                 </thead>
// //                 <tbody>
// //                     {instructorList.filter(i => i.f_name.toLowerCase().includes(searchTerm.toLowerCase())).map(instructor => (
// //                         <tr key={instructor.id} className="border-b">
// //                             <td className="p-2">{instructor.f_name} {instructor.l_name}</td>
// //                             <td className="p-2">{instructor.email}</td>
// //                             <td className="p-2">{instructor.phone}</td>
// //                             <td className="p-2">{instructor.specialization}</td>
// //                             <td className="p-2">{instructor.center}</td>
// //                             <td className="p-2">{instructor.role}</td>
// //                             <td className="p-2">
// //                                 <Button size="sm" color="blue" onClick={() => { setSelectedInstructor(instructor); setOpenDrawer(true); }}>Edit</Button>
// //                                 <Button size="sm" color="red" onClick={() => { setSelectedInstructor(instructor); setOpenDelete(true); }}>Delete</Button>
// //                             </td>
// //                         </tr>
// //                     ))}
// //                 </tbody>
// //             </table>

// //             <Dialog open={openDelete} handler={() => setOpenDelete(false)}>
// //                 <DialogHeader>Confirm Deletion</DialogHeader>
// //                 <DialogBody>Are you sure you want to delete this instructor?</DialogBody>
// //                 <DialogFooter>
// //                     <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
// //                     <Button color="red" onClick={handleDeleteInstructor}>Delete</Button>
// //                 </DialogFooter>
// //             </Dialog>

// //             <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)} placement="right" size={500}>
// //                 <div className="p-6 w-full">
// //                     <h2 className="text-lg font-bold mb-4">{selectedInstructor?.id ? "Edit" : "Add"} Instructor</h2>
// //                     <form className="space-y-4">
// //                         <Input label="First Name" value={selectedInstructor?.f_name || ""} onChange={(e) => setSelectedInstructor({ ...selectedInstructor, f_name: e.target.value })} />
// //                         <Input label="Last Name" value={selectedInstructor?.l_name || ""} onChange={(e) => setSelectedInstructor({ ...selectedInstructor, l_name: e.target.value })} />
// //                         <Input label="Email" value={selectedInstructor?.email || ""} onChange={(e) => setSelectedInstructor({ ...selectedInstructor, email: e.target.value })} />
// //                         <Input label="Phone" value={selectedInstructor?.phone || ""} onChange={(e) => setSelectedInstructor({ ...selectedInstructor, phone: e.target.value })} />
// //                         <Input label="Specialization" value={selectedInstructor?.specialization || ""} onChange={(e) => setSelectedInstructor({ ...selectedInstructor, specialization: e.target.value })} />
// //                         <Select label="Center" value={selectedInstructor?.center || ""} onChange={(value) => setSelectedInstructor({ ...selectedInstructor, center: value })}>
// //                             {centers.map(center => <Option key={center.id} value={center.name}>{center.name}</Option>)}
// //                         </Select>
// //                         <Select label="Role" value={selectedInstructor?.role || ""} onChange={(value) => setSelectedInstructor({ ...selectedInstructor, role: value })}>
// //                             {roles.map(role => <Option key={role.id} value={role.name}>{role.name}</Option>)}
// //                         </Select>
// //                         <Button className="mt-4" onClick={handleSaveInstructor}>{selectedInstructor?.id ? "Update" : "Add"}</Button>
// //                     </form>
// //                 </div>
// //             </Drawer>
// //         </div>
// //     );
// // }


// import { useState, useEffect } from "react";
// import { db } from '../../../config/firebase';
// import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
// import { Button, Input, Select, Option, Dialog, DialogHeader, DialogBody, DialogFooter, Drawer } from "@material-tailwind/react";

// export default function Instructor() {
//     const [instructorList, setInstructorList] = useState([]);
//     const [centers, setCenters] = useState([]);
//     const [roles, setRoles] = useState([]);
//     const [searchTerm, setSearchTerm] = useState("");

//     const [openDrawer, setOpenDrawer] = useState(false);
//     const [openDelete, setOpenDelete] = useState(false);
//     const [selectedInstructor, setSelectedInstructor] = useState(null);

//     const instructorCollectionRef = collection(db, "Instructor");
//     const centerCollectionRef = collection(db, "Centers");
//     const roleCollectionRef = collection(db, "roles");

//     useEffect(() => {
//         const fetchData = async () => {
//             const instructorsQuery = query(instructorCollectionRef, orderBy("f_name")); // Order by first name
//             const instructors = await getDocs(instructorsQuery);
//             setInstructorList(instructors.docs.map(doc => ({ id: doc.id, ...doc.data() })));

//             const centersData = await getDocs(centerCollectionRef);
//             setCenters(centersData.docs.map(doc => ({ id: doc.id, ...doc.data() })));

//             const rolesData = await getDocs(roleCollectionRef);
//             setRoles(rolesData.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//         };

//         fetchData();
//         const unsubscribe = onSnapshot(query(roleCollectionRef,orderBy("name")), fetchData); // added order by to onsnapShot
//         return () => unsubscribe();
//     }, []);

//     const handleSaveInstructor = async () => {
//         if (!selectedInstructor.f_name || !selectedInstructor.email || !selectedInstructor.phone || !selectedInstructor.specialization || !selectedInstructor.center || !selectedInstructor.role) {
//             alert("All fields are required!");
//             return;
//         }

//         try {
//             if (selectedInstructor.id) {
//                 await updateDoc(doc(db, "Instructor", selectedInstructor.id), selectedInstructor);
//             } else {
//                 await addDoc(instructorCollectionRef, selectedInstructor);
//             }
//             setOpenDrawer(false);
//         } catch (error) {
//             console.error("Error saving instructor:", error);
//         }
//     };

//     const handleDeleteInstructor = async () => {
//         if (!selectedInstructor?.id) return;
//         try {
//             await deleteDoc(doc(db, "Instructor", selectedInstructor.id));
//             setInstructorList(prevList => prevList.filter(inst => inst.id !== selectedInstructor.id));
//             setOpenDelete(false);
//         } catch (error) {
//             console.error("Error deleting instructor:", error);
//         }
//     };

//     return (
//         <div className="flex-col w-screen ml-80 p-4">
//             <div className="justify-between items-center p-4 mb-4">
//                 <Input placeholder="Search Instructor..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-1/3" />
//                 <Button color="blue" onClick={() => { setSelectedInstructor({}); setOpenDrawer(true); }}>+ Add Instructor</Button>
//             </div>

//             <table className="w-full border rounded-md shadow-md">
//                 <thead className="bg-gray-200">
//                     <tr>
//                         <th className="p-2">Name</th>
//                         <th className="p-2">Email</th>
//                         <th className="p-2">Phone</th>
//                         <th className="p-2">Specialization</th>
//                         <th className="p-2">Center</th>
//                         <th className="p-2">Role</th>
//                         <th className="p-2">Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {instructorList.filter(i => i.f_name.toLowerCase().includes(searchTerm.toLowerCase())).map(instructor => (
//                         <tr key={instructor.id} className="border-b">
//                             <td className="p-2">{instructor.f_name} {instructor.l_name}</td>
//                             <td className="p-2">{instructor.email}</td>
//                             <td className="p-2">{instructor.phone}</td>
//                             <td className="p-2">{instructor.specialization}</td>
//                             <td className="p-2">{instructor.center}</td>
//                             <td className="p-2">{instructor.role}</td>
//                             <td className="p-2">
//                                 <Button size="sm" color="blue" onClick={() => { setSelectedInstructor(instructor); setOpenDrawer(true); }}>Edit</Button>
//                                 <Button size="sm" color="red" onClick={() => { setSelectedInstructor(instructor); setOpenDelete(true); }}>Delete</Button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>

//             <Dialog open={openDelete} handler={() => setOpenDelete(false)}>
//                 <DialogHeader>Confirm Deletion</DialogHeader>
//                 <DialogBody>Are you sure you want to delete this instructor?</DialogBody>
//                 <DialogFooter>
//                     <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
//                     <Button color="red" onClick={handleDeleteInstructor}>Delete</Button>
//                 </DialogFooter>
//             </Dialog>

//             <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)} placement="right" size={500}>
//                 <div className="p-6 w-full">
//                     <h2 className="text-lg font-bold mb-4">{selectedInstructor?.id ? "Edit" : "Add"} Instructor</h2>
//                     <form className="space-y-4">
//                         <Input label="First Name" value={selectedInstructor?.f_name || ""} onChange={(e) => setSelectedInstructor({ ...selectedInstructor, f_name: e.target.value })} />
//                         <Input label="Last Name" value={selectedInstructor?.l_name || ""} onChange={(e) => setSelectedInstructor({ ...selectedInstructor, l_name: e.target.value })} />
//                         <Input label="Email" value={selectedInstructor?.email || ""} onChange={(e) => setSelectedInstructor({ ...selectedInstructor, email: e.target.value })} />
//                         <Input label="Phone" value={selectedInstructor?.phone || ""} onChange={(e) => setSelectedInstructor({ ...selectedInstructor, phone: e.target.value })} />
//                         <Input label="Specialization" value={selectedInstructor?.specialization || ""} onChange={(e) => setSelectedInstructor({ ...selectedInstructor, specialization: e.target.value })} />
//                         <Select label="Center" value={selectedInstructor?.center || ""} onChange={(value) => setSelectedInstructor({ ...selectedInstructor, center: value })}>
//                             {centers.map(center => <Option key={center.id} value={center.name}>{center.name}</Option>)}
//                         </Select>
//                         <Select label="Role" value={selectedInstructor?.role || ""} onChange={(value) => setSelectedInstructor({ ...selectedInstructor, role: value })}>
//                             {roles.map(role => <Option key={role.id} value={role.name}>{role.name}</Option>)}
//                         </Select>
//                         <Button className="mt-4" onClick={handleSaveInstructor}>{selectedInstructor?.id ? "Update" : "Add"}</Button>
//                     </form>
//                 </div>
//             </Drawer>
//         </div>
//     );
// }


import { useState, useEffect } from "react";
import { db } from '../../../config/firebase';
import { getDocs, collection, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { Button, Input, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import AddInstructor from './AddInstructor';

export default function Instructor() {
    const [instructorList, setInstructorList] = useState([]);
    const [centers, setCenters] = useState([]);
    const [roles, setRoles] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [openDrawer, setOpenDrawer] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedInstructor, setSelectedInstructor] = useState(null);

    const instructorCollectionRef = collection(db, "Instructor");
    const centerCollectionRef = collection(db, "Centers");
    const roleCollectionRef = collection(db, "roles");

    useEffect(() => {
        const fetchData = async () => {
            const instructorsQuery = query(instructorCollectionRef, orderBy("f_name"));
            const instructors = await getDocs(instructorsQuery);
            setInstructorList(instructors.docs.map(doc => ({ id: doc.id, ...doc.data() })));

            const centersData = await getDocs(centerCollectionRef);
            setCenters(centersData.docs.map(doc => ({ id: doc.id, ...doc.data() })));

            const rolesData = await getDocs(roleCollectionRef);
            setRoles(rolesData.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };

        fetchData();
    }, []);

    const handleDeleteInstructor = async () => {
        if (!selectedInstructor?.id) return;
        try {
            await deleteDoc(doc(db, "Instructor", selectedInstructor.id));
            setInstructorList(prevList => prevList.filter(inst => inst.id !== selectedInstructor.id));
            setOpenDelete(false);
        } catch (error) {
            console.error("Error deleting instructor:", error);
        }
    };

    return (
        <div className="flex-col w-screen ml-80 p-4">
            <div className="justify-between items-center p-4 mb-4">
                <Input 
                    placeholder="Search Instructor..." 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)} 
                    className="w-1/3" 
                />
                <Button 
                    color="blue" 
                    onClick={() => { setSelectedInstructor({}); setOpenDrawer(true); }}
                >
                    + Add Instructor
                </Button>
            </div>

            <table className="w-full border rounded-md shadow-md">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="p-2">Name</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Phone</th>
                        <th className="p-2">Specialization</th>
                        <th className="p-2">Center</th>
                        <th className="p-2">Role</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {instructorList
                        .filter(i => i.f_name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map(instructor => (
                            <tr key={instructor.id} className="border-b">
                                <td className="p-2">{instructor.f_name} {instructor.l_name}</td>
                                <td className="p-2">{instructor.email}</td>
                                <td className="p-2">{instructor.phone}</td>
                                <td className="p-2">{instructor.specialization}</td>
                                <td className="p-2">{instructor.center}</td>
                                <td className="p-2">{instructor.role}</td>
                                <td className="p-2">
                                    <Button 
                                        size="sm" 
                                        color="blue" 
                                        onClick={() => { setSelectedInstructor(instructor); setOpenDrawer(true); }}
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        color="red" 
                                        onClick={() => { setSelectedInstructor(instructor); setOpenDelete(true); }}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>

            <Dialog open={openDelete} handler={() => setOpenDelete(false)}>
                <DialogHeader>Confirm Deletion</DialogHeader>
                <DialogBody>Are you sure you want to delete this instructor?</DialogBody>
                <DialogFooter>
                    <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
                    <Button color="red" onClick={handleDeleteInstructor}>Delete</Button>
                </DialogFooter>
            </Dialog>

            <AddInstructor 
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                instructor={selectedInstructor}
                centers={centers}
                roles={roles}
                setInstructorList={setInstructorList}
            />
        </div>
    );
}