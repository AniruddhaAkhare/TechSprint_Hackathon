import React, { useState, useEffect } from "react";
import { db } from "../../../../config/firebase";
import { getDocs, collection, deleteDoc, doc, query, orderBy, addDoc } from "firebase/firestore";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";
import { useAuth } from "../../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddJobOpening from "./AddJobOpening";
import ApplicationManagement from "./ApplicationManagement";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function JobOpenings() {
  const navigate = useNavigate();
  const { user, rolePermissions } = useAuth();
  const [jobOpenings, setJobOpenings] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("Are you sure you want to delete this job opening? This action cannot be undone.");

  const JobCollectionRef = collection(db, "JobOpenings");

  const canCreate = rolePermissions?.JobOpenings?.create || false;
  const canUpdate = rolePermissions?.JobOpenings?.update || false;
  const canDelete = rolePermissions?.JobOpenings?.delete || false;
  const canDisplay = rolePermissions?.JobOpenings?.display || false;

  const logActivity = async (action, details) => {
    try {
      const activityLog = {
        action,
        details,
        timestamp: new Date().toISOString(),
        userEmail: user?.email || "anonymous",
        userId: user.uid,
      };
      await addDoc(collection(db, "activityLogs"), activityLog);
    } catch (error) {
      console.error("Error logging activity:", error);
    }
  };

  const toggleAddSidebar = () => setIsAddOpen((prev) => !prev);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    const results = jobOpenings.filter(
      (job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setSearchResults(results);
  };

  useEffect(() => {
    if (searchTerm) handleSearch();
    else setSearchResults([]);
  }, [searchTerm, jobOpenings]);

  const fetchJobOpenings = async () => {
    try {
      setLoading(true);
      const q = query(JobCollectionRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const jobData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobOpenings(jobData);
      if (jobData.length > 0 && !selectedJob) {
        setSelectedJob(jobData[0]);
      }
    } catch (err) {
      console.error("Error fetching job openings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!canDisplay) {
      navigate("/unauthorized");
      return;
    }
    fetchJobOpenings();
  }, [canDisplay, navigate]);

  const handleCreateJobClick = () => {
    if (!canCreate) return;
    setSelectedJob(null);
    toggleAddSidebar();
    logActivity("OPEN_ADD_JOB", {});
  };

  const handleEditClick = (job) => {
    if (!canUpdate) return;
    setSelectedJob(job);
    setIsAddOpen(true);
    logActivity("OPEN_EDIT_JOB", { jobId: job.id, title: job.title });
  };

  const handleDeleteClick = (jobId) => {
    if (!canDelete) return;
    setDeleteId(jobId);
    setOpenDelete(true);
    logActivity("OPEN_DELETE_JOB", { jobId });
  };

  const handleClose = () => {
    setIsAddOpen(false);
    fetchJobOpenings();
  };

  const deleteJob = async () => {
    if (!canDelete || !deleteId) return;
    try {
      await deleteDoc(doc(db, "JobOpenings", deleteId));
      fetchJobOpenings();
      setSelectedJob(null);
      setOpenDelete(false);
      setDeleteMessage("Are you sure you want to delete this job opening? This action cannot be undone.");
      logActivity("DELETE_JOB", { jobId: deleteId });
    } catch (err) {
      console.error("Error deleting job:", err);
      setDeleteMessage("An error occurred while trying to delete the job opening.");
    }
  };

  const exportToExcel = async (jobId) => {
    try {
      const snapshot = await getDocs(collection(db, `JobOpenings/${jobId}/Applications`));
      const applications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const ws = XLSX.utils.json_to_sheet(
        applications.map((app) => ({
          "Student Name": app.studentName,
          Course: app.course,
          Status: app.status,
          Rating: app.rating || "N/A",
          Skills: app.skills.join(", "),
          Remarks: app.remarks || "N/A",
        }))
      );
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Applications");
      XLSX.writeFile(wb, `Applications_${jobId}.xlsx`);
      logActivity("EXPORT_EXCEL", { jobId });
    } catch (err) {
      console.error("Error exporting to Excel:", err);
      toast.error("Failed to export applications.");
    }
  };

  const exportToPDF = async (jobId) => {
    try {
      const snapshot = await getDocs(collection(db, `JobOpenings/${jobId}/Applications`));
      const applications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const doc = new jsPDF();
      doc.text("Job Applications", 20, 10);
      doc.autoTable({
        startY: 20,
        head: [["Student Name", "Course", "Status", "Rating", "Skills", "Remarks"]],
        body: applications.map((app) => [
          app.studentName,
          app.course,
          app.status,
          app.rating || "N/A",
          app.skills.join(", "),
          app.remarks || "N/A",
        ]),
      });
      doc.save(`Applications_${jobId}.pdf`);
      logActivity("EXPORT_PDF", { jobId });
    } catch (err) {
      console.error("Error exporting to PDF:", err);
      toast.error("Failed to export applications.");
    }
  };

  if (!canDisplay) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">Loading...</div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-4 fixed inset-0 left-[300px]">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Job Openings</h1>
        {canCreate && (
          <button
            type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition duration-200"
            onClick={handleCreateJobClick}
          >
            + Add Job Opening
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Panel: Job Openings List */}
        <div className="md:w-1/3 bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search jobs by title, company, or skills..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="max-h-[70vh] overflow-y-auto">
            {(searchResults.length > 0 ? searchResults : jobOpenings).map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={`p-4 mb-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                  selectedJob?.id === job.id ? "bg-blue-100" : ""
                }`}
              >
                <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
                <p className="text-gray-600">{job.companyName}</p>
                <p className="text-gray-500">{job.locationType} | {job.jobType}</p>
                {(canUpdate || canDelete) && (
                  <div className="mt-2">
                    {canUpdate && (
                      <button
                        onClick={() => handleEditClick(job)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        Edit
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => handleDeleteClick(job.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
            {(searchResults.length > 0 ? searchResults : jobOpenings).length === 0 && (
              <p className="text-gray-500 text-center">No job openings found</p>
            )}
          </div>
        </div>

        {/* Right Panel: Job Details and Applications */}
        <div className="md:w-2/3 bg-white p-6 rounded-lg shadow-md">
          {selectedJob ? (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{selectedJob.title}</h2>
              <div className="mb-6">
                <p><strong>Company:</strong> {selectedJob.companyName}</p>
                <p><strong>Job Type:</strong> {selectedJob.jobType}</p>
                <p><strong>Experience:</strong> {selectedJob.experience}</p>
                <p><strong>Salary/Stipend:</strong> {selectedJob.salary} {selectedJob.currency}</p>
                {selectedJob.duration && <p><strong>Duration:</strong> {selectedJob.duration}</p>}
                <p><strong>Location:</strong> {selectedJob.locationType} {selectedJob.city ? `(${selectedJob.city})` : ""}</p>
                <p><strong>Skills:</strong> {selectedJob.skills.join(", ")}</p>
                <p><strong>POC:</strong> {selectedJob.poc.name} ({selectedJob.poc.email})</p>
                <div className="mt-4">
                  <strong>Job Description:</strong>
                  <div dangerouslySetInnerHTML={{ __html: selectedJob.description }} className="prose" />
                </div>
              </div>
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => exportToExcel(selectedJob.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Export to Excel
                </button>
                <button
                  onClick={() => exportToPDF(selectedJob.id)}
                  className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
                >
                  Export to PDF
                </button>
              </div>
              <ApplicationManagement jobId={selectedJob.id} jobSkills={selectedJob.skills} />
            </>
          ) : (
            <p className="text-gray-500">Select a job opening to view details and applications</p>
          )}
        </div>
      </div>

      {/* Backdrop for Sidebar */}
      {(canCreate || canUpdate) && isAddOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleClose}
        />
      )}

      {/* Sidebar (AddJobOpening) */}
      {(canCreate || canUpdate) && (
        <AddJobOpening
          isOpen={isAddOpen}
          toggleSidebar={handleClose}
          job={selectedJob}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {canDelete && openDelete && (
        <Dialog
          open={openDelete}
          handler={() => setOpenDelete(false)}
          className="rounded-lg shadow-lg"
        >
          <DialogHeader className="text-gray-800 font-semibold">Confirm Deletion</DialogHeader>
          <DialogBody className="text-gray-600">{deleteMessage}</DialogBody>
          <DialogFooter className="space-x-4">
            <Button
              variant="text"
              color="gray"
              onClick={() => setOpenDelete(false)}
            >
              Cancel
            </Button>
            {deleteMessage === "Are you sure you want to delete this job opening? This action cannot be undone." && (
              <Button
                variant="filled"
                color="red"
                onClick={deleteJob}
              >
                Yes, Delete
              </Button>
            )}
          </DialogFooter>
        </Dialog>
      )}
    </div>
  );
}