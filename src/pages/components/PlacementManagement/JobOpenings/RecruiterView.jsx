import React, { useState, useEffect } from "react";
import { db } from "../../../../config/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const statuses = ["Pending", "Applied", "Rejected", "Shortlisted", "Interviewed"];
const ratings = [1, 2, 3, 4, 5];

export default function RecruiterView() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canUpdate, setCanUpdate] = useState(false); 

  useEffect(() => {
    const fetchJobAndApplications = async () => {
      try {
        setLoading(true);
        // Fetch job details
        const jobDoc = await getDocs(collection(db, "JobOpenings"));
        const jobData = jobDoc.docs.find((doc) => doc.id === jobId);
        if (jobData) {
          setJob({ id: jobData.id, ...jobData.data() });
        } else {
          throw new Error("Job not found");
        }

        // Fetch applications
        const snapshot = await getDocs(collection(db, `JobOpenings/${jobId}/Applications`));
        const appData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setApplications(appData);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load job or applications.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobAndApplications();
    // Pseudo-code: Check token or permissions for update rights
    // setCanUpdate(checkRecruiterPermissions());
  }, [jobId]);

  const handleUpdateApplication = async (id, updates) => {
    if (!canUpdate) {
      toast.error("You don't have permission to update applications");
      return;
    }
    try {
      await updateDoc(doc(db, `JobOpenings/${jobId}/Applications`, id), updates);
      setApplications(applications.map((app) => (app.id === id ? { ...app, ...updates } : app)));
      toast.success("Application updated successfully!");
    } catch (err) {
      console.error("Error updating application:", err);
      toast.error("Failed to update application.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">Loading...</div>
    );
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">Job not found</div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Job Applications: {job.title}</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{job.title}</h2>
        <div className="mb-6">
          <p><strong>Company:</strong> {job.companyName}</p>
          <p><strong>Job Type:</strong> {job.jobType}</p>
          <p><strong>Skills:</strong> {job.skills.join(", ")}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Student Name</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Course</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Rating</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Skills</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-800">{app.studentName}</td>
                  <td className="px-4 py-3 text-gray-800">{app.course}</td>
                  <td className="px-4 py-3 text-gray-800">
                    {canUpdate ? (
                      <select
                        value={app.status}
                        onChange={(e) => handleUpdateApplication(app.id, { status: e.target.value })}
                        className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    ) : (
                      app.status
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-800">
                    {canUpdate ? (
                      <select
                        value={app.rating || ""}
                        onChange={(e) => handleUpdateApplication(app.id, { rating: parseInt(e.target.value) })}
                        className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">No Rating</option>
                        {ratings.map((rating) => (
                          <option key={rating} value={rating}>
                            {rating} Stars
                          </option>
                        ))}
                      </select>
                    ) : (
                      app.rating || "N/A"
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-800">{app.skills.join(", ")}</td>
                  <td className="px-4 py-3 text-gray-800">
                    {canUpdate ? (
                      <input
                        type="text"
                        value={app.remarks || ""}
                        onChange={(e) => handleUpdateApplication(app.id, { remarks: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      app.remarks || "N/A"
                    )}
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-3 text-center text-gray-500">
                    No applications found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}