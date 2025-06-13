import React, { useState, useEffect } from "react";
import { db } from "../../../../config/firebase";
import { getDocs, collection, deleteDoc, doc, query, orderBy, addDoc, updateDoc, getDoc, arrayUnion, serverTimestamp, where, writeBatch } from "firebase/firestore";
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
import { runTransaction } from "firebase/firestore";

export default function JobOpenings() {
  const navigate = useNavigate();
  const { user, rolePermissions, userRole } = useAuth();
  const [jobOpenings, setJobOpenings] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("Are you sure you want to delete this job opening? This action cannot be undone.");
  const [userDisplayName, setUserDisplayName] = useState("");
  const [migrationInProgress, setMigrationInProgress] = useState(false);

  const JobCollectionRef = collection(db, "JobOpenings");

  const canCreate = rolePermissions?.JobOpenings?.create || false;
  const canUpdate = rolePermissions?.JobOpenings?.update || false;
  const canDelete = rolePermissions?.JobOpenings?.delete || false;
  const canDisplay = rolePermissions?.JobOpenings?.display || false;

  // Check if user is a recruiter using the correct role ID
  const RECRUITER_ROLE_ID = "sTRunlCqsvQ8PJRyRuPg";
  const isRecruiter = userRole === RECRUITER_ROLE_ID;
  const isAdmin = userRole === "admin" || rolePermissions?.isAdmin;

  // Fetch user displayName from Users collection
  useEffect(() => {
    if (!user?.uid) return;

    const fetchUserDisplayName = async () => {
      try {
        const userDocRef = doc(db, "Users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserDisplayName(userData.displayName || user.email || "Unknown User");
        } else {
          console.warn("User document not found in Users collection");
          setUserDisplayName(user.email || "Unknown User");
        }
      } catch (error) {
        toast.error(`Failed to fetch user data: ${error.message}`);
        setUserDisplayName(user.email || "Unknown User");
      }
    };

    fetchUserDisplayName();
  }, [user?.uid, user?.email]);

const logActivity = async (action, details) => {
  if (!user?.email) return;

  const activityLogRef = doc(db, "activityLogs", "logDocument");

  const logEntry = {
    action,
    details,
    timestamp: new Date().toISOString(),
    userEmail: user.email,
    userId: user.uid,
    section: "Job Opening",
    // adminId: adminId || "N/A",
  };

  try {
    await runTransaction(db, async (transaction) => {
      const logDoc = await transaction.get(activityLogRef);
      let logs = logDoc.exists() ? logDoc.data().logs || [] : [];

      // Ensure logs is an array and contains only valid data
      if (!Array.isArray(logs)) {
        logs = [];
      }

      // Append the new log entry
      logs.push(logEntry);

      // Trim to the last 1000 entries if necessary
      if (logs.length > 1000) {
        logs = logs.slice(-1000);
      }

      // Update the document with the new logs array
      transaction.set(activityLogRef, { logs }, { merge: true });
    });
    console.log("Activity logged successfully");
  } catch (error) {
    console.error("Error logging activity:", error);
    // toast.error("Failed to log activity");
  }
};
  
  // const fetchLogs = useCallback(() => {
  //   if (!isAdmin) return;
  //   const q = query(LogsCollectionRef, orderBy("timestamp", "desc"));
  //   const unsubscribe = onSnapshot(
  //     q,
  //     (snapshot) => {
  //       const allLogs = [];
  //       snapshot.docs.forEach((doc) => {
  //         const data = doc.data();
  //         (data.logs || []).forEach((log) => {
  //           allLogs.push({ id: doc.id, ...log });
  //         });
  //       });
  //       allLogs.sort(
  //         (a, b) =>
  //           (b.timestamp?.toDate() || new Date(0)) - (a.timestamp?.toDate() || new Date(0))
  //       );
  //       setLogs(allLogs);
  //     },
  //   );
  //   return unsubscribe;
  // }, [isAdmin]);
  // Helper function to check if current user performed the job creation
  const isJobPerformedByCurrentUser = (job) => {
    if (!job.history || !Array.isArray(job.history)) return false;
    
    // Find the "Created" action in history
    const createdAction = job.history.find(historyItem => 
      historyItem.action === "Created" && historyItem.performedBy === userDisplayName
    );
    
    return !!createdAction;
  };

  // Auto-migration function to add createdBy field to existing jobs (keeping for backward compatibility)
  const autoMigrateJobOpenings = async () => {
    if (!user?.uid || migrationInProgress) return;
    
    try {
      setMigrationInProgress(true);
      console.log("Checking for jobs without createdBy field...");
      
      // Get all job openings
      const allJobsQuery = query(JobCollectionRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(allJobsQuery);
      
      const jobsWithoutCreatedBy = [];
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (!data.createdBy) {
          jobsWithoutCreatedBy.push({
            id: doc.id,
            ...data
          });
        }
      });

      if (jobsWithoutCreatedBy.length === 0) {
        console.log("All jobs already have createdBy field");
        return;
      }

      console.log(`Found ${jobsWithoutCreatedBy.length} jobs without createdBy field`);
      
      // AUTO-ASSIGN TO CURRENT USER (works for both admins and recruiters)
      const batch = writeBatch(db);
      
      jobsWithoutCreatedBy.forEach((job) => {
        const jobRef = doc(db, "JobOpenings", job.id);
        batch.update(jobRef, {
          createdBy: user.uid,
          updatedAt: serverTimestamp(),
          migrationNote: `Auto-assigned to ${isAdmin ? 'admin' : 'recruiter'} ${user.email} on ${new Date().toISOString()}`
        });
      });

      await batch.commit();
      console.log(`Successfully updated ${jobsWithoutCreatedBy.length} jobs with createdBy field`);
      toast.success(`Migration completed! Assigned ${jobsWithoutCreatedBy.length} legacy job openings to you.`);
      
      // Log the migration activity
      await logActivity("AUTO_MIGRATION", {
        updatedJobs: jobsWithoutCreatedBy.length,
        assignedTo: user.uid,
        userEmail: user.email,
        userRole: isAdmin ? 'admin' : 'recruiter'
      });
      
    } catch (error) {
      console.error("Error during auto-migration:", error);
      toast.error(`Migration failed: ${error.message}`);
    } finally {
      setMigrationInProgress(false);
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
      
      // Fetch all job openings first
      const q = query(JobCollectionRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const allJobData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      console.log(`Fetched ${allJobData.length} total job openings`);
      
      let filteredJobData = allJobData;
      
      // If user is a recruiter, filter by performedBy in history
      if (isRecruiter && userDisplayName) {
        console.log("Filtering jobs for recruiter:", userDisplayName);
        filteredJobData = allJobData.filter(job => isJobPerformedByCurrentUser(job));
        console.log(`After performedBy filtering: ${filteredJobData.length} jobs for recruiter ${userDisplayName}`);
      } else if (!isAdmin) {
        // For non-admin, non-recruiter roles, also filter by performedBy
        filteredJobData = allJobData.filter(job => isJobPerformedByCurrentUser(job));
        console.log(`After performedBy filtering: ${filteredJobData.length} jobs for user ${userDisplayName}`);
      }
      // Admins see all jobs
      
      setJobOpenings(filteredJobData);
      
      // Reset selected job if it's not in the filtered results
      if (selectedJob && !filteredJobData.find(job => job.id === selectedJob.id)) {
        setSelectedJob(null);
      } else if (filteredJobData.length > 0 && !selectedJob) {
        setSelectedJob(filteredJobData[0]);
      }

      // Run auto-migration for both admins AND recruiters to assign legacy jobs
      if ((isAdmin || isRecruiter) && !migrationInProgress) {
        await autoMigrateJobOpenings();
      }
      
    } catch (err) {
      console.error("Error fetching job openings:", err);
      toast.error("Failed to fetch job openings: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!canDisplay) {
      navigate("/unauthorized");
      return;
    }
    
    // Only fetch if user is loaded and userDisplayName is available
    if (user?.uid && userDisplayName) {
      fetchJobOpenings();
    }
  }, [canDisplay, navigate, isRecruiter, user?.uid, userRole, userDisplayName]);

  const handleCreateJobClick = () => {
    if (!canCreate) {
      toast.error("You don't have permission to create job openings.");
      return;
    }
    setSelectedJob(null);
    toggleAddSidebar();
    // logActivity("OP", {});
  };

  const handleEditClick = (job) => {
    if (!canUpdate) {
      toast.error("You don't have permission to edit job openings.");
      return;
    }
    
    // CRITICAL: Check if recruiter is trying to edit a job they didn't perform
    if (isRecruiter && !isJobPerformedByCurrentUser(job)) {
      toast.error("You can only edit job openings created by you.");
      return;
    }
    
    setSelectedJob(job);
    setIsAddOpen(true);
    // logActivity("OPEN_EDIT_JOB", { jobId: job.id, title: job.title });
  };

  const handleDeleteClick = (jobId) => {
    if (!canDelete) {
      toast.error("You don't have permission to delete job openings.");
      return;
    }
    
    // CRITICAL: Check if recruiter is trying to delete a job they didn't perform
    const jobToDelete = jobOpenings.find(job => job.id === jobId);
    if (isRecruiter && !isJobPerformedByCurrentUser(jobToDelete)) {
      toast.error("You can only delete job openings created by you.");
      return;
    }
    
    console.log("Setting deleteId:", jobId);
    setDeleteId(jobId);
    setOpenDelete(true);
    // logActivity("OPEN_DELETE_JOB", { jobId });
  };

  const handleClose = () => {
    setIsAddOpen(false);
    fetchJobOpenings(); // Refresh the list after closing
  };

  const deleteJob = async () => {
    if (!canDelete || !deleteId) {
      console.log("Cannot delete: canDelete:", canDelete, "deleteId:", deleteId);
      toast.error("Cannot delete job: Missing permissions or job ID.");
      return;
    }
    
    try {
      console.log("Attempting to delete job with ID:", deleteId);
      const jobRef = doc(db, "JobOpenings", deleteId);
      const jobDoc = await getDoc(jobRef);
      
      if (!jobDoc.exists()) {
        throw new Error("Job not found");
      }
      
      const jobData = jobDoc.data();
      
      // CRITICAL: Additional security check for recruiters
      if (isRecruiter && !isJobPerformedByCurrentUser(jobData)) {
        throw new Error("You can only delete job openings created by you.");
      }
      
      const jobTitle = jobData.title;
      const companyId = jobData.companyId;
  
      // Add history entry to company document if company exists
      if (companyId) {
        const companyHistoryEntry = {
          action: `Deleted job opening: "${jobTitle}"`,
          performedBy: userDisplayName,
          timestamp: new Date().toISOString(),
        };
        
        const companyRef = doc(db, "Companies", companyId);
        const companyDoc = await getDoc(companyRef);
        
        if (companyDoc.exists()) {
          const currentCompanyHistory = Array.isArray(companyDoc.data().history) ? companyDoc.data().history : [];
          await updateDoc(companyRef, {
            history: [...currentCompanyHistory, companyHistoryEntry],
            updatedAt: serverTimestamp(),
          });
          console.log("Company history updated");
        } else {
          console.warn("Company document not found, skipping history update");
        }
      }
  
      // Delete the job
      await deleteDoc(jobRef);
      console.log("Job deleted successfully");
      
      // Refresh the job openings list
      await fetchJobOpenings();
      
      setSelectedJob(null);
      setOpenDelete(false);
      setDeleteId(null);
      setDeleteMessage("Are you sure you want to delete this job opening? This action cannot be undone.");
      toast.success("Job opening deleted successfully!");
      logActivity("Job deleted", { jobId: deleteId, title: jobTitle });
    } catch (err) {
      console.error("Error deleting job:", err);
      setDeleteMessage("An error occurred while trying to delete the job opening.");
      toast.error(`Failed to delete job opening: ${err.message}`);
    }
  };

  const exportToExcel = async (jobId) => {
    try {
      // CRITICAL: Check if recruiter can export this job's applications
      const jobToExport = jobOpenings.find(job => job.id === jobId);
      if (isRecruiter && !isJobPerformedByCurrentUser(jobToExport)) {
        toast.error("You can only export applications for job openings created by you.");
        return;
      }
      
      const snapshot = await getDocs(collection(db, `JobOpenings/${jobId}/Applications`));
      const applications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (applications.length === 0) {
        toast.info("No applications found to export.");
        return;
      }

      const ws = XLSX.utils.json_to_sheet(
        applications.map((app) => ({
          "Student Name": app.studentName || "N/A",
          Email: app.studentEmail || "N/A",
          Status: app.status || "N/A",
          Remarks: app.remarks || "N/A",
        }))
      );
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Applications");
      XLSX.writeFile(wb, `Applications_${jobId}.xlsx`);
      
      logActivity("Excel sheet exported", { jobId });
      toast.success("Applications exported to Excel!");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("Failed to export applications to Excel: " + error.message);
    }
  };

  const exportToPDF = async (jobId) => {
    try {
      // CRITICAL: Check if recruiter can export this job's applications
      const jobToExport = jobOpenings.find(job => job.id === jobId);
      if (isRecruiter && !isJobPerformedByCurrentUser(jobToExport)) {
        toast.error("You can only export applications for job openings created by you.");
        return;
      }
      
      const snapshot = await getDocs(collection(db, `JobOpenings/${jobId}/Applications`));
      const applications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (applications.length === 0) {
        toast.info("No applications found to export.");
        return;
      }

      const doc = new jsPDF();
      doc.text("Job Applications", 20, 10);
      doc.autoTable({
        startY: 20,
        head: [["Student Name", "Email", "Status", "Remarks"]],
        body: applications.map((app) => [
          app.studentName || "N/A",
          app.studentEmail || "N/A",
          app.status || "N/A",
          app.remarks || "N/A",
        ]),
      });
      doc.save(`Applications_${jobId}.pdf`);
      
      logActivity("Pdf exported", { jobId });
      toast.success("Applications exported to PDF!");
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      toast.error("Failed to export applications to PDF: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-100 min-h-screen fixed inset-0 left-[300px] overflow-y-auto">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-600">Loading job openings...</p>
          {migrationInProgress && (
            <p className="text-sm text-blue-600 mt-2">Running migration...</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-100 min-h-screen fixed inset-0 left-[300px] overflow-y-auto">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#333333] font-sans">
            Job Openings {isRecruiter && <span className="text-sm font-normal text-gray-600">(Your Jobs Only)</span>}
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Total Job Openings: {jobOpenings.length}
            {isRecruiter && " (created by you)"}
          </p>
        </div>
        {canCreate && (
          <button
            type="button"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2 mr-6"
            onClick={handleCreateJobClick}
          >
            + Add Job Opening
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Panel: Job Openings List */}
        <div className="md:w-1/3 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="mb-6">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search jobs by title, company, or skills..."
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg shadow-sm text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-200"
            />
          </div>
          <div className="max-h-[70vh] overflow-y-auto">
            {(searchResults.length > 0 ? searchResults : jobOpenings).map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={`p-4 mb-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-150 ${
                  selectedJob?.id === job.id ? "bg-blue-50 border-blue-200" : "bg-white"
                } border border-gray-200 shadow-sm`}
              >
                <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                <p className="text-sm text-gray-600">{job.companyName}</p>
                <p className="text-sm text-gray-500">{job.locationType} | {job.jobType}</p>
                <p className="text-sm text-gray-500">Status: {job.status}</p>
                {isRecruiter && isJobPerformedByCurrentUser(job) && (
                  <p className="text-xs text-blue-600 mt-1 font-medium">✓ Created by you</p>
                )}
                {job.migrationNote && (
                  <p className="text-xs text-orange-600 mt-1 font-medium">📝 Migrated job</p>
                )}

                {(canUpdate || canDelete) && (
                  <div className="mt-3 flex gap-2">
                    {canUpdate && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(job);
                        }}
                        className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-150"
                      >
                        Edit
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(job.id);
                        }}
                        className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition duration-150"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
            {(searchResults.length > 0 ? searchResults : jobOpenings).length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">
                  {isRecruiter ? "No job openings created by you yet." : "No job openings found."}
                </p>
                {isRecruiter && canCreate && (
                  <button
                    onClick={handleCreateJobClick}
                    className="mt-3 text-sm text-blue-600 hover:text-blue-700 underline"
                  >
                    Create your first job opening
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Job Details and Applications */}
        <div className="md:w-2/3 bg-white p-6 rounded-xl shadow-lg border border-gray-100 max-h-[85vh] overflow-y-auto">
          {selectedJob ? (
            <>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{selectedJob.title}</h2>
                {isRecruiter && isJobPerformedByCurrentUser(selectedJob) && (
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    Your Job Opening
                  </span>
                )}
                {selectedJob.migrationNote && (
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full ml-2">
                    Migrated Job
                  </span>
                )}
              </div>
              
              <div className="mb-6 space-y-2 text-sm text-gray-700">
                <p><span className="font-medium text-gray-900">Company:</span> {selectedJob.companyName}</p>
                <p><span className="font-medium text-gray-900">Job Type:</span> {selectedJob.jobType}</p>
                <p><span className="font-medium text-gray-900">Status:</span> {selectedJob.status}</p>
                <p><span className="font-medium text-gray-900">Experience:</span> {selectedJob.experience}</p>
                <p><span className="font-medium text-gray-900">Salary/Stipend:</span> {selectedJob.salary} {selectedJob.currency}</p>
                {selectedJob.duration && <p><span className="font-medium text-gray-900">Duration:</span> {selectedJob.duration}</p>}
                <p><span className="font-medium text-gray-900">Location:</span> {selectedJob.locationType} {selectedJob.city ? `(${selectedJob.city})` : ""}</p>
                <p><span className="font-medium text-gray-900">Skills:</span> {selectedJob.skills.join(", ")}</p>
                <p><span className="font-medium text-gray-900">POC:</span> {selectedJob.poc.name} ({selectedJob.poc.email})</p>
                <div className="mt-4">
                  <p className="font-medium text-gray-900">Job Description:</p>
                  <div dangerouslySetInnerHTML={{ __html: selectedJob.description }} className="prose prose-sm text-gray-700 mt-2" />
                </div>
              </div>
              
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => exportToExcel(selectedJob.id)}
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-2.5 rounded-lg shadow-md hover:from-green-700 hover:to-green-800 transition duration-200 font-medium"
                >
                  Export to Excel
                </button>
                <button
                  onClick={() => exportToPDF(selectedJob.id)}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-5 py-2.5 rounded-lg shadow-md hover:from-purple-700 hover:to-purple-800 transition duration-200 font-medium"
                >
                  Export to PDF
                </button>
              </div>
              
              <ApplicationManagement jobId={selectedJob.id} jobSkills={selectedJob.skills} />
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500">
                {jobOpenings.length === 0 
                  ? (isRecruiter ? "Create your first job opening to get started" : "No job openings available") 
                  : "Select a job opening to view details and applications"
                }
              </p>
            </div>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Confirm Deletion</h2>
            <p className="text-sm text-gray-600 mb-6">{deleteMessage}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setOpenDelete(false);
                  setDeleteId(null);
                  setDeleteMessage("Are you sure you want to delete this job opening? This action cannot be undone.");
                }}
                className="px-5 py-2.5 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 transition duration-200 font-medium"
              >
                Cancel
              </button>
              {deleteMessage === "Are you sure you want to delete this job opening? This action cannot be undone." && (
                <button
                  onClick={deleteJob}
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-2.5 rounded-lg shadow-md hover:from-red-700 hover:to-red-800 transition duration-200 font-medium"
                >
                  Yes, Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}