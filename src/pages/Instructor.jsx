import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from '../config/firebase';
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import Auth from "../components/Auth.jsx";

export default function Instructor() {
    const [instructorList, setInstructorList] = useState([]);
    const [instructorFname, setInstructorFname] = useState("");
    const [instructorLname, setInstructorLname] = useState("");
    const [instructorEmail, setInstructorEmail] = useState("");
    const [instructorPhone, setInstructorPhone] = useState("");
    const [instructorSpecialization, setInstructorSpecialization] = useState("");
    const [updatedFname, setUpdatedFname] = useState("");
    const [updatedLname, setUpdatedLname] = useState("");
    const [updatedEmail, setUpdatedEmail] = useState("");
    const [updatedPhone, setUpdatedPhone] = useState("");
    const [updatedSpecialization, setUpdatedSpecialization] = useState("");
    const [updatingInstructorId, setUpdatingInstructorId] = useState("");
    const instructorCollectionRef = collection(db, "Instructor");
    const [searchTerm, setSearchTerm] = useState("");

    const getInstructorList = async () => {
        try {
            const data = await getDocs(instructorCollectionRef);
            const filteredData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setInstructorList(filteredData);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getInstructorList();
    }, []);

    const onSubmitInstructor = async () => {
        try {
            await addDoc(instructorCollectionRef, {
                f_name: instructorFname,
                l_name: instructorLname,
                email: instructorEmail,
                phone: instructorPhone,
                specialization: instructorSpecialization
            });
            getInstructorList();
        } catch (err) {
            console.error(err);
        }
    };

    const deleteInstructor = async (id) => {
        const instructorDoc = doc(db, "Instructor", id);
        await deleteDoc(instructorDoc);
        getInstructorList(); // Refresh the list after deletion
    };

    const updateInstructor = async (id) => {
        try {
            const instructorDoc = doc(db, "Instructor", id);
            await updateDoc(instructorDoc, {
                f_name: updatedFname,
                l_name: updatedLname,
                email: updatedEmail,
                phone: updatedPhone,
                specialization: updatedSpecialization,
            });

            getInstructorList();
            setUpdatingInstructorId(null);
            setUpdatedFname("");
            setUpdatedLname("");
            setUpdatedEmail("");
            setUpdatedPhone("");
            setUpdatedSpecialization("");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex-col w-screen ml-80 pd-4">
            <h1 className="text-2xl font-bold mb-4">Admins & Instructors</h1>
            <p className="text-gray-600 mb-6">
                Create and manage users with different roles on the platform.
            </p>

            <div className="flex items-center justify-between mb-4">
                <input
                    type="text"
                    placeholder="Search by Name, Email, Mobile..."
                    className="p-2 border border-gray-300 rounded-lg w-1/3"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                    + Add Instructors
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <input placeholder="First Name" value={instructorFname} onChange={(e) => setInstructorFname(e.target.value)} className="p-2 border border-gray-300 rounded-lg" />
                <input placeholder="Last Name" value={instructorLname} onChange={(e) => setInstructorLname(e.target.value)} className="p-2 border border-gray-300 rounded-lg" />
                <input placeholder="Email" value={instructorEmail} onChange={(e) => setInstructorEmail(e.target.value)} className="p-2 border border-gray-300 rounded-lg" />
                <input placeholder="Phone" value={instructorPhone} onChange={(e) => setInstructorPhone(e.target.value)} className="p-2 border border-gray-300 rounded-lg" />
                <input placeholder="Specialization" value={instructorSpecialization} onChange={(e) => setInstructorSpecialization(e.target.value)} className="p-2 border border-gray-300 rounded-lg" />
                <button onClick={onSubmitInstructor} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Submit</button>
            </div>

            <div className="space-y-4">
                {instructorList.map((instructor) => (
                    <div key={instructor.id} className="border p-4 rounded-lg shadow">
                        <h2 className="text-lg font-semibold">{instructor.f_name} {instructor.l_name}</h2>
                        <p className="text-gray-600">{instructor.email}</p>
                        <p className="text-gray-600">{instructor.phone}</p>
                        <p className="text-gray-600">{instructor.specialization}</p>
                        <div className="flex items-center space-x-2 mt-2">
                            <button onClick={() => deleteInstructor(instructor.id)} className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600">Delete</button>
                            <input placeholder="New First Name" onChange={(e) => setUpdatedFname(e.target.value)} className="p-1 border border-gray-300 rounded" />
                            <input placeholder="New Last Name" onChange={(e) => setUpdatedLname(e.target.value)} className="p-1 border border-gray-300 rounded" />
                            <input placeholder="New Email" onChange={(e) => setUpdatedEmail(e.target.value)} className="p-1 border border-gray-300 rounded" />
                            <input placeholder="New Phone" onChange={(e) => setUpdatedPhone(e.target.value)} className="p-1 border border-gray-300 rounded" />
                            <input placeholder="New Specialization" onChange={(e) => setUpdatedSpecialization(e.target.value)} className="p-1 border border-gray-300 rounded" />
                            <button onClick={() => updateInstructor(instructor.id)} className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600">Update</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}