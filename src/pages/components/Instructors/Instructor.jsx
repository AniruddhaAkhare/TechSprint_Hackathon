import { useState, useEffect } from "react";
import { db } from '../../../config/firebase';
import { getDocs, collection, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
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
        <div className="min-h-screen bg-gray-50 p-6 ml-80 w-screen justify-between items-center">
            <div className="max-w-8xl mx-auto">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Admin & Staff Details</h1>
                    <button
                        onClick={() => { setSelectedInstructor({}); setOpenDrawer(true); }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        + Add Instructor
                    </button>
                </div>

                {/* Search and Table Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">Name</th>
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">Email</th>
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">Phone</th>
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">Specialization</th>
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">Center</th>
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">Role</th>
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {instructorList
                                    .filter(i => i.f_name.toLowerCase().includes(searchTerm.toLowerCase()))
                                    .map(instructor => (
                                        <tr key={instructor.id} className="border-b hover:bg-gray-50">
                                            <td className="p-3 text-gray-700">{instructor.f_name} {instructor.l_name}</td>
                                            <td className="p-3 text-gray-700">{instructor.email || 'N/A'}</td>
                                            <td className="p-3 text-gray-700">{instructor.phone || 'N/A'}</td>
                                            <td className="p-3 text-gray-700">{instructor.specialization || 'N/A'}</td>
                                            <td className="p-3 text-gray-700">{instructor.center || 'N/A'}</td>
                                            <td className="p-3 text-gray-700">{instructor.role || 'N/A'}</td>
                                            <td className="p-3">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => { setSelectedInstructor(instructor); setOpenDrawer(true); }}
                                                        className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition duration-200"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => { setSelectedInstructor(instructor); setOpenDelete(true); }}
                                                        className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition duration-200"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Delete Confirmation Dialog */}
                {openDelete && (
                    <>
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setOpenDelete(false)} />
                        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 z-50 w-full max-w-md">
                            <h3 className="text-lg font-semibold text-gray-800">Confirm Deletion</h3>
                            <p className="text-gray-600 mt-2">Are you sure you want to delete this instructor? This action cannot be undone.</p>
                            <div className="flex justify-end space-x-2 mt-4">
                                <button
                                    onClick={() => setOpenDelete(false)}
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteInstructor}
                                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {/* Add/Edit Instructor Drawer */}
                <AddInstructor
                    open={openDrawer}
                    onClose={() => setOpenDrawer(false)}
                    instructor={selectedInstructor}
                    centers={centers}
                    roles={roles}
                    setInstructorList={setInstructorList}
                />
            </div>
        </div>
    );
}