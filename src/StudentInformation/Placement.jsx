import React, { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { collection, getDocs, query, where, getDoc, doc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Placement = ({ studentId }) => {
  const [placements, setPlacements] = useState([]);

  useEffect(() => {
    const fetchPlacements = async () => {
      try {
        // Fetch placements for the student
        const placementsQuery = query(
          collection(db, "Placements"),
          where("studentId", "==", studentId)
        );
        const snapshot = await getDocs(placementsQuery);

        const placementData = await Promise.all(
          snapshot.docs.map(async (placementDoc) => {
            const placement = { id: placementDoc.id, ...placementDoc.data() };

            // Fetch job details
            let jobData = {};
            try {
              const jobDoc = await getDoc(doc(db, "JobOpenings", placement.jobId));
              if (jobDoc.exists()) {
                jobData = jobDoc.data();
              } else {
                console.warn(`Job with ID ${placement.jobId} not found`);
              }
            } catch (err) {
              console.error(`Error fetching job ${placement.jobId}:`, err);
            }

            // Fetch application details for createdAt
            let applicationData = {};
            try {
              const applicationQuery = query(
                collection(db, "Applications"),
                where("studentId", "==", studentId),
                where("jobId", "==", placement.jobId)
              );
              const applicationSnapshot = await getDocs(applicationQuery);
              if (!applicationSnapshot.empty) {
                applicationData = applicationSnapshot.docs[0].data();
              } else {
                console.warn(`Application for student ${studentId} and job ${placement.jobId} not found`);
              }
            } catch (err) {
              console.error(`Error fetching application for job ${placement.jobId}:`, err);
            }

            return {
              ...placement,
              jobTitle: jobData.title || "N/A",
              companyName: jobData.companyName || "N/A",
              skills: Array.isArray(jobData.skills) ? jobData.skills.join(", ") : "N/A",
              city: jobData.city || "N/A",
              jobType: jobData.jobType || "N/A",
              deadline: jobData.deadline?.toDate() || "N/A",
              salary: jobData.salary || "N/A",
              createdAt: applicationData.createdAt || placement.createdAt || null,
            };
          })
        );

        setPlacements(placementData);
      } catch (err) {
        console.error("Error fetching placements:", err);
        toast.error("Failed to fetch placements.");
      }
    };

    if (studentId) {
      fetchPlacements();
    }
  }, [studentId]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Job Title</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Company</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Skills</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Salary</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Job Type</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Deadline</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">City</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Created At</th>
              </tr>
            </thead>
            <tbody>
              {placements.map((placement) => (
                <tr key={placement.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-800">{placement.jobTitle}</td>
                  <td className="px-4 py-3 text-gray-800">{placement.companyName}</td>
                  <td className="px-4 py-3 text-gray-800">{placement.skills}</td>
                  <td className="px-4 py-3 text-gray-800">{placement.salary}</td>
                  <td className="px-4 py-3 text-gray-800">{placement.jobType}</td>
                  <td className="px-4 py-3 text-gray-800">
                    {placement.deadline instanceof Date
                      ? placement.deadline.toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-gray-800">{placement.city}</td>
                  <td className="px-4 py-3 text-gray-800">{placement.status}</td>
                  <td className="px-4 py-3 text-gray-800">
                    {placement.createdAt?.toDate
                      ? placement.createdAt.toDate().toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
              {placements.length === 0 && (
                <tr>
                  <td colSpan="9" className="px-4 py-3 text-gray-500 text-center">
                    No placements found for this student.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Placement;