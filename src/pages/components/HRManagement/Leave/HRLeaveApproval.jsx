// import React, { useState, useEffect } from "react";
// import { db } from "../../../../config/firebase";
// import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
// import { useAuth } from "../../../../context/AuthContext";
// import { toast } from "react-toastify"; // For notifications

// const HRLeaveApproval = () => {
//   const { user } = useAuth();
//   const [leaves, setLeaves] = useState([]);
//   const [filter, setFilter] = useState("Pending");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkHRRoleAndFetchLeaves = async () => {
//       try {
//         if (!user) {
//           setError("Please log in to view this page.");
//           setLoading(false);
//           return;
//         }

//         // const userRef = doc(db, "Users", user.uid);
//         // const userSnap = await getDoc(userRef);
//         // if (!userSnap.exists() || !userSnap.data().isHR) {
//         //   setError("You are not authorized to view this page.");
//         //   setLoading(false);
//         //   return;
//         // }

//         const leavesSnapshot = await getDocs(collection(db, "Leaves"));
//         const leaveList = leavesSnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setLeaves(leaveList);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setError("Failed to load leave applications.");
//         setLoading(false);
//       }
//     };

//     checkHRRoleAndFetchLeaves();
//   }, [user]);

//   const handleStatusUpdate = async (leaveId, newStatus) => {
//     try {
//       const leaveRef = doc(db, "Leaves", leaveId);
//       await updateDoc(leaveRef, {
//         status: newStatus,
//         updatedAt: new Date().toISOString(),
//       });
//       setLeaves((prev) =>
//         prev.map((leave) =>
//           leave.id === leaveId ? { ...leave, status: newStatus } : leave
//         )
//       );
//       await sendStatusEmail(leaveId, newStatus);
//       toast.success(`Leave ${newStatus.toLowerCase()} successfully!`);
//     } catch (error) {
//       console.error(`Error updating leave status to ${newStatus}:`, error);
//       setError(`Failed to update leave status: ${error.message}`);
//       toast.error(`Failed to update leave status.`);
//     }
//   };

//   const sendStatusEmail = async (leaveId, status) => {
//     try {
//       const leaveRef = doc(db, "Leaves", leaveId);
//       const leaveSnap = await getDoc(leaveRef);
//       if (!leaveSnap.exists()) {
//         throw new Error("Leave document not found");
//       }

//       const { email, startDate, endDate, leaveType } = leaveSnap.data();
//       if (!email || !startDate || !endDate || !leaveType) {
//         throw new Error("Missing required fields in leave document");
//       }
//       if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//         throw new Error(`Invalid email format: ${email}`);
//       }

//       const payload = {
//         toEmail: email,
//         subject: `Leave Application ${status}`,
//         htmlContent: `<p>Your ${leaveType} leave request from ${new Date(
//           startDate
//         ).toLocaleDateString()} to ${new Date(
//           endDate
//         ).toLocaleDateString()} has been ${status.toLowerCase()}.</p>`,
//       };
//       console.log("Sending email payload:", payload);

//       const response = await fetch(
//         "http://localhost:5001/fireblaze-ignite/us-central1/sendEmail",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       const result = await response.json();
//       if (!response.ok) {
//         throw new Error(result.message || "Failed to send email");
//       }
//     } catch (error) {
//       console.error("Error sending status email:", error);
//       throw error; // Propagate error to handleStatusUpdate
//     }
//   };

//   const filteredLeaves = leaves.filter((leave) =>
//     filter === "All" ? true : leave.status === filter
//   );

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto bg-gray-50 min-h-screen p-4 fixed inset-0 left-[300px]">
//       <h3 className="text-3xl font-semibold text-gray-800 mb-6">
//         Leave Approval Dashboard
//       </h3>
//       {error && (
//         <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
//           {error}
//         </div>
//       )}
//       <div className="flex justify-between items-center mb-6">
//         <div className="flex items-center space-x-4">
//           <label className="text-gray-700 font-medium">Filter by Status:</label>
//           <select
//             className="border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={filter}
//             onChange={(e) => setFilter(e.target.value)}
//           >
//             <option value="All">All</option>
//             <option value="Pending">Pending</option>
//             <option value="Approved">Approved</option>
//             <option value="Rejected">Rejected</option>
//           </select>
//         </div>
//       </div>
//       <div className="bg-white shadow-lg rounded-lg overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
//                   Employee Email
//                 </th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
//                   Leave Type
//                 </th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
//                   Start Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
//                   End Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
//                   Reason
//                 </th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {filteredLeaves.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan="7"
//                     className="px-6 py-4 text-center text-gray-500"
//                   >
//                     No leave applications found.
//                   </td>
//                 </tr>
//               ) : (
//                 filteredLeaves.map((leave) => (
//                   <tr key={leave.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 text-gray-600">{leave.email}</td>
//                     <td className="px-6 py-4 text-gray-600">
//                       {leave.leaveType}
//                     </td>
//                     <td className="px-6 py-4 text-gray-600">
//                       {new Date(leave.startDate).toLocaleDateString()}
//                     </td>
//                     <td className="px-6 py-4 text-gray-600">
//                       {new Date(leave.endDate).toLocaleDateString()}
//                     </td>
//                     <td className="px-6 py-4 text-gray-600">{leave.reason}</td>
//                     <td className="px-6 py-4">
//                       <span
//                         className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                           leave.status === "Approved"
//                             ? "bg-green-100 text-green-800"
//                             : leave.status === "Rejected"
//                             ? "bg-red-100 text-red-800"
//                             : "bg-yellow-100 text-yellow-800"
//                         }`}
//                       >
//                         {leave.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       {leave.status === "Pending" && (
//                         <div className="flex space-x-3">
//                           <button
//                             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
//                             onClick={() =>
//                               handleStatusUpdate(leave.id, "Approved")
//                             }
//                           >
//                             Approve
//                           </button>
//                           <button
//                             className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
//                             onClick={() =>
//                               handleStatusUpdate(leave.id, "Rejected")
//                             }
//                           >
//                             Reject
//                           </button>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HRLeaveApproval;

import React, { useState, useEffect } from "react";
import { db } from "../../../../config/firebase";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../../../context/AuthContext";
import { toast } from "react-toastify";

const HRLeaveApproval = () => {
  const { user, rolePermissions } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [filter, setFilter] = useState("Pending");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Define permissions
  const canView = rolePermissions?.Leaves?.display || false;
  const canCreate = rolePermissions?.Leaves?.create || false; // Reserved for future use
  const canUpdate = rolePermissions?.Leaves?.update || false;
  const canDelete = rolePermissions?.Leaves?.delete || false; // Reserved for future use

  useEffect(() => {
    const checkPermissionsAndFetchLeaves = async () => {
      if (!user) {
        setError("Please log in to view this page.");
        setLoading(false);
        return;
      }

      if (!canView) {
        setError("You do not have permission to view leave applications.");
        setLoading(false);
        return;
      }

      try {
        const leavesSnapshot = await getDocs(collection(db, "Leaves"));
        const leaveList = leavesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLeaves(leaveList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load leave applications.");
        setLoading(false);
      }
    };

    checkPermissionsAndFetchLeaves();
  }, [user, canView]);

  const handleStatusUpdate = async (leaveId, newStatus) => {
    if (!canUpdate) {
      toast.error("You do not have permission to update leave statuses.");
      return;
    }

    try {
      const leaveRef = doc(db, "Leaves", leaveId);
      await updateDoc(leaveRef, {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
      setLeaves((prev) =>
        prev.map((leave) =>
          leave.id === leaveId ? { ...leave, status: newStatus } : leave
        )
      );
      await sendStatusEmail(leaveId, newStatus);
      toast.success(`Leave ${newStatus.toLowerCase()} successfully!`);
    } catch (error) {
      console.error(`Error updating leave status to ${newStatus}:`, error);
      setError(`Failed to update leave status: ${error.message}`);
      toast.error(`Failed to update leave status.`);
    }
  };

  const sendStatusEmail = async (leaveId, status) => {
    try {
      const leaveRef = doc(db, "Leaves", leaveId);
      const leaveSnap = await getDoc(leaveRef);
      if (!leaveSnap.exists()) {
        throw new Error("Leave document not found");
      }

      const { email, startDate, endDate, leaveType } = leaveSnap.data();
      if (!email || !startDate || !endDate || !leaveType) {
        throw new Error("Missing required fields in leave document");
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error(`Invalid email format: ${email}`);
      }

      const payload = {
        toEmail: email,
        subject: `Leave Application ${status}`,
        htmlContent: `<p>Your ${leaveType} leave request from ${new Date(
          startDate
        ).toLocaleDateString()} to ${new Date(
          endDate
        ).toLocaleDateString()} has been ${status.toLowerCase()}.</p>`,
      };
      console.log("Sending email payload:", payload);

      const response = await fetch(
        "http://localhost:5001/fireblaze-ignite/us-central1/sendEmail",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to send email");
      }
    } catch (error) {
      console.error("Error sending status email:", error);
      throw error;
    }
  };

  const handleFilterChange = (e) => {
    if (!canView) {
      toast.error("You do not have permission to change the status filter.");
      return;
    }
    setFilter(e.target.value);
  };

  const filteredLeaves = leaves.filter((leave) =>
    filter === "All" ? true : leave.status === filter
  );

  if (!canView) {
    return (
      <div className="p-4 text-red-600 text-center">
        Access Denied: You do not have permission to view leave applications.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto bg-gray-50 min-h-screen p-4 fixed inset-0 left-[300px]">
      <h3 className="text-3xl font-semibold text-gray-800 mb-6">
        Leave Approval Dashboard
      </h3>
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <label className="text-gray-700 font-medium">Filter by Status:</label>
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filter}
            onChange={handleFilterChange}
            disabled={!canView}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Employee Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Leave Type
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  End Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLeaves.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No leave applications found.
                  </td>
                </tr>
              ) : (
                filteredLeaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-600">{leave.email}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {leave.leaveType}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(leave.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(leave.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{leave.reason}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          leave.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : leave.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {leave.status === "Pending" && canUpdate && (
                        <div className="flex space-x-3">
                          <button
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                            onClick={() =>
                              handleStatusUpdate(leave.id, "Approved")
                            }
                          >
                            Approve
                          </button>
                          <button
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                            onClick={() =>
                              handleStatusUpdate(leave.id, "Rejected")
                            }
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HRLeaveApproval;