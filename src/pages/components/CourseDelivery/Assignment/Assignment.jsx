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
    <div className="p-6 md:ml-64 bg-gray-50 min-h-screen">
  <div className="bg-white shadow-lg rounded-xl p-6">
   <div className="flex justify-between items-center mb-6">
  <h2 className="text-2xl font-bold text-[#333333] font-sans">Assignments</h2>
  <button
    onClick={handleCreateAssignment}
    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
  >
   + Create Assignment
  </button>
</div>


    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-700 text-sm uppercase">
            <th className="px-6 py-3 text-left">Curriculum</th>
            <th className="px-6 py-3 text-left">Due Date</th>
            <th className="px-6 py-3 text-left">Document</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment, index) => (
            <tr key={assignment.id} className={`text-gray-700 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
              <td className="px-6 py-4">{assignment.curriculum}</td>
              <td className="px-6 py-4">{assignment.dueDate}</td>
              <td className="px-6 py-4">
                <a
                  href={assignment.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Document
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>

    );
}
