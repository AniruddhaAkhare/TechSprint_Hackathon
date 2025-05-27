import { useState, useEffect } from 'react';
import { db } from '../../../../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Button from '../../../../components/ui/Button';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function Assignments() {
    const [assignments, setAssignments] = useState([]);
    // const [permissions, setPermissions] = useState({});
    const navigate = useNavigate(); // Initialize navigation hook

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteBatch(deleteId);
            fetchBatches();
            alert('Batch deleted successfully!');
        } catch (err) {
            alert('Failed to delete batch. Please try again.');
        } finally {
            setOpenDelete(false);
            setDeleteId(null);
        }
    };

    // useEffect(() => {
    //     const loadPermissions = async () => {
    //         const perms = await fetchUserPermissions(currentUserId);
    //         setPermissions(perms);
    //     };
    //     loadPermissions();
    // }, []);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const assignmentsCollection = collection(db, "assignments");
                const snapshot = await getDocs(assignmentsCollection);
                const assignmentList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setAssignments(assignmentList);
            } catch (error) {
            }
        };

        fetchAssignments();
    }, []);

    // Function to handle navigation to Create Assignment page
    const handleCreateAssignment = () => {
        navigate('/createAssignment');
    };

    return (
        <div className="p-20">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Assignments</h2>
                <Button
                    onClick={handleCreateAssignment}
                    // disabled={!permissions?.Courses?.Create} // Optional: Disable based on permissions
                >
                    Create Assignment
                </Button>
            </div>
            <table className="w-full border-collapse border border-gray-300 mt-4">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Curriculum</th>
                        <th className="border p-2">Due Date</th>
                        <th className="border p-2">Document</th>
                    </tr>
                </thead>
                <tbody>
                    {assignments.map((assignment) => (
                        <tr key={assignment.id} className="text-center">
                            <td className="border p-2">{assignment.curriculum}</td>
                            <td className="border p-2">{assignment.dueDate}</td>
                            <td className="border p-2">
                                <a href={assignment.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                                    View Document
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
