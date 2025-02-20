import { useState, useEffect } from "react";
import { db } from '../../../config/firebase'
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input } from "@material-tailwind/react";

export default function Instructor() {
    const [instructorList, setInstructorList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [openAddInstructor, setOpenAddInstructor] = useState(false);
    const [instructorFname, setInstructorFname] = useState("");
    const [instructorLname, setInstructorLname] = useState("");
    const [instructorEmail, setInstructorEmail] = useState("");
    const [instructorPhone, setInstructorPhone] = useState("");
    const [instructorSpecialization, setInstructorSpecialization] = useState("");

    const [openDelete, setOpenDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const [openUpdate, setOpenUpdate] = useState(false);
    const [updatingInstructorId, setUpdatingInstructorId] = useState("");
    const [updatedFname, setUpdatedFname] = useState("");
    const [updatedLname, setUpdatedLname] = useState("");
    const [updatedEmail, setUpdatedEmail] = useState("");
    const [updatedPhone, setUpdatedPhone] = useState("");
    const [updatedSpecialization, setUpdatedSpecialization] = useState("");

    const instructorCollectionRef = collection(db, "Instructor");

    const getInstructorList = async () => {
        try {
            const data = await getDocs(instructorCollectionRef);
            setInstructorList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getInstructorList();
    }, []);

    const handleOpenAddInstructor = () => {
        setOpenAddInstructor(true);
    };

    const handleCloseAddInstructor = () => {
        setOpenAddInstructor(false);
        setInstructorFname("");
        setInstructorLname("");
        setInstructorEmail("");
        setInstructorPhone("");
        setInstructorSpecialization("");
    };

    const handleSubmitInstructor = async () => {
        if (!instructorFname || !instructorLname || !instructorEmail || !instructorPhone || !instructorSpecialization) {
            alert("Please fill all fields.");
            return;
        }

        try {
            await addDoc(instructorCollectionRef, {
                f_name: instructorFname,
                l_name: instructorLname,
                email: instructorEmail,
                phone: instructorPhone,
                specialization: instructorSpecialization
            });

            getInstructorList();
            handleCloseAddInstructor();
        } catch (err) {
            console.error(err);
        }
    };

    const handleOpenDelete = (id) => {
        setDeleteId(id);
        setOpenDelete(true);
    };

    const handleDelete = async () => {
        if (deleteId) {
            try {
                await deleteDoc(doc(db, "Instructor", deleteId));
                getInstructorList();
            } catch (err) {
                console.error("Error deleting instructor:", err);
            }
        }
        setOpenDelete(false);
    };

    const handleOpenUpdate = (instructor) => {
        setUpdatingInstructorId(instructor.id);
        setUpdatedFname(instructor.f_name);
        setUpdatedLname(instructor.l_name);
        setUpdatedEmail(instructor.email);
        setUpdatedPhone(instructor.phone);
        setUpdatedSpecialization(instructor.specialization);
        setOpenUpdate(true);
    };

    const handleUpdate = async () => {
        if (updatingInstructorId) {
            try {
                await updateDoc(doc(db, "Instructor", updatingInstructorId), {
                    f_name: updatedFname,
                    l_name: updatedLname,
                    email: updatedEmail,
                    phone: updatedPhone,
                    specialization: updatedSpecialization,
                });

                getInstructorList();
                setOpenUpdate(false);
            } catch (error) {
                console.error("Error updating instructor:", error);
            }
        }
    };

    const filteredInstructors = instructorList.filter((instructor) => {
        const fullName = `${instructor.f_name} ${instructor.l_name}`.toLowerCase();
        return (
            fullName.includes(searchTerm.toLowerCase()) ||
            instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            instructor.phone.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div className="flex-col w-screen ml-80 p-4">
            <h1 className="text-2xl font-bold mb-4">Admins & Instructors</h1>
            <p className="text-gray-600 mb-6">Create and manage users with different roles on the platform.</p>

            <div className="flex items-center justify-between mb-4">
                <input
                    type="text"
                    placeholder="Search by Name, Email, Mobile..."
                    className="p-2 border border-gray-300 rounded-lg w-1/3"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={handleOpenAddInstructor} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                    + Add Instructor
                </button>
            </div>

            <div className="space-y-4">
                {filteredInstructors.map((instructor) => (
                    <div key={instructor.id} className="border p-4 rounded-lg shadow">
                        <h2 className="text-lg font-semibold">{instructor.f_name} {instructor.l_name}</h2>
                        <p className="text-gray-600">{instructor.email}</p>
                        <p className="text-gray-600">{instructor.phone}</p>
                        <p className="text-gray-600">{instructor.specialization}</p>
                        <div className="flex items-center space-x-2 mt-2">
                            <button onClick={() => handleOpenDelete(instructor.id)} className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600">
                                Delete
                            </button>
                            <button onClick={() => handleOpenUpdate(instructor)} className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600">
                                Update
                            </button>
                        </div>
                    </div>
                ))}

                <Dialog open={openDelete} handler={() => setOpenDelete(false)}>
                    <DialogHeader>Confirm Deletion</DialogHeader>
                    <DialogBody>Are you sure you want to delete this instructor? This action cannot be undone.</DialogBody>
                    <DialogFooter>
                        <Button variant="text" color="gray" onClick={() => setOpenDelete(false)}>Cancel</Button>
                        <Button variant="filled" color="red" onClick={handleDelete}>Yes, Delete</Button>
                    </DialogFooter>
                </Dialog>

                {/* Update Instructor Modal */}
                <Dialog open={openUpdate} handler={() => setOpenUpdate(false)}>
                    <DialogHeader>Update Instructor</DialogHeader>
                    <DialogBody>
                        <div className="grid grid-cols-1 gap-4">
                            <Input label="First Name" value={updatedFname} onChange={(e) => setUpdatedFname(e.target.value)} />
                            <Input label="Last Name" value={updatedLname} onChange={(e) => setUpdatedLname(e.target.value)} />
                            <Input label="Email" value={updatedEmail} onChange={(e) => setUpdatedEmail(e.target.value)} />
                            <Input label="Phone" value={updatedPhone} onChange={(e) => setUpdatedPhone(e.target.value)} />
                            <Input label="Specialization" value={updatedSpecialization} onChange={(e) => setUpdatedSpecialization(e.target.value)} />
                        </div>
                    </DialogBody>
                    <DialogFooter>
                        <Button variant="text" color="gray" onClick={() => setOpenUpdate(false)}>Cancel</Button>
                        <Button variant="filled" color="green" onClick={handleUpdate}>Update</Button>
                    </DialogFooter>
                </Dialog>
            </div>

            <Dialog open={openAddInstructor} handler={handleCloseAddInstructor}>
                <DialogHeader>Add Instructor</DialogHeader>
                <DialogBody>
                    <div className="grid grid-cols-1 gap-4">
                        <Input label="First Name" value={instructorFname} onChange={(e) => setInstructorFname(e.target.value)} />
                        <Input label="Last Name" value={instructorLname} onChange={(e) => setInstructorLname(e.target.value)} />
                        <Input label="Email" value={instructorEmail} onChange={(e) => setInstructorEmail(e.target.value)} />
                        <Input label="Phone" value={instructorPhone} onChange={(e) => setInstructorPhone(e.target.value)} />
                        <Input label="Specialization" value={instructorSpecialization} onChange={(e) => setInstructorSpecialization(e.target.value)} />
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="gray" onClick={handleCloseAddInstructor}>Cancel</Button>
                    <Button variant="filled" color="green" onClick={handleSubmitInstructor}>Add Instructor</Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
}
