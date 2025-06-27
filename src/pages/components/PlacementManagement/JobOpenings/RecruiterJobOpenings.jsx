import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../../../config/firebase";
import { useAuth } from "../../../../context/AuthContext";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  BriefcaseIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  PencilIcon,
  TrashIcon,
  DocumentArrowDownIcon,
  XMarkIcon,
  CheckIcon,
  PlusIcon,
  ArrowPathIcon,
  CalendarIcon,
  UsersIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";

const badgeColors = {
  status: {
    Open: "bg-green-100 text-green-800",
    Closed: "bg-red-100 text-red-800",
    "On Hold": "bg-yellow-100 text-yellow-800",
    default: "bg-gray-100 text-gray-800",
  },
  jobType: {
    "Full-time": "bg-blue-100 text-blue-800",
    Internship: "bg-purple-100 text-purple-800",
    Contract: "bg-orange-100 text-orange-800",
    "Part-time": "bg-teal-100 text-teal-800",
    default: "bg-gray-100 text-gray-800",
  },
  location: {
    Remote: "bg-indigo-100 text-indigo-800",
    Hybrid: "bg-amber-100 text-amber-800",
    "On-site": "bg-rose-100 text-rose-800",
    default: "bg-gray-100 text-gray-800",
  },
};

export default function RecruiterJobOpenings() {
  const [state, setState] = useState({
    jobOpenings: [],
    companies: [],
    poc: "",
    pocs: [],
    loading: true,
    selectedJob: null,
    isEditing: false,
    newSkill: "",
    isAddingSkill: false,
    isAddingJob: false,
    newJobTitle: "",
    formData: {
      title: "",
      companyName: "",
      status: "Open",
      locationType: "",
      jobType: "",
      experience: "",
      salary: "",
      description: "",
      city: "",
      location: "",
      department: "",
      currency: "USD",
      closingDate: "",
      skills: [],
      duration: "",
      poc: { name: "", email: "" },
      history: [],
    },
  });

  const { user, rolePermissions } = useAuth();
  const navigate = useNavigate();
  const canCreate = rolePermissions.JobOpenings?.create || false;
  const canUpdate = rolePermissions.JobOpenings?.update || false;

  const setFormData = (data) =>
    setState((prev) => ({ ...prev, formData: data }));
  const setLoading = (loading) => setState((prev) => ({ ...prev, loading }));
  const setJobOpenings = (jobs) =>
    setState((prev) => ({ ...prev, jobOpenings: jobs }));
  const setCompanies = (companies) =>
    setState((prev) => ({ ...prev, companies }));
  const setPoc = (poc) => setState((prev) => ({ ...prev, poc }));
  const setPocs = (pocs) => setState((prev) => ({ ...prev, pocs }));
  const setSelectedJob = (job) =>
    setState((prev) => ({ ...prev, selectedJob: job }));
  const setIsEditing = (editing) =>
    setState((prev) => ({ ...prev, isEditing: editing }));
  const setNewSkill = (skill) =>
    setState((prev) => ({ ...prev, newSkill: skill }));
  const setIsAddingSkill = (adding) =>
    setState((prev) => ({ ...prev, isAddingSkill: adding }));
  const setIsAddingJob = (adding) =>
    setState((prev) => ({ ...prev, isAddingJob: adding }));
  const setNewJobTitle = (title) =>
    setState((prev) => ({ ...prev, newJobTitle: title }));

  const handleAddSkill = () => {
    if (
      state.newSkill.trim() &&
      !state.formData.skills.includes(state.newSkill.trim())
    ) {
      setFormData({
        ...state.formData,
        skills: [...state.formData.skills, state.newSkill.trim()],
      });
      setNewSkill("");
      setIsAddingSkill(false);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...state.formData,
      skills: state.formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const exportToPDF = async (jobId, jobTitle) => {
    try {
      const loadingToast = toast.loading("Preparing PDF export...");
      const snapshot = await getDocs(
        collection(db, `JobOpenings/${jobId}/Applications`)
      );
      const applications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (applications.length === 0) {
        toast.dismiss(loadingToast);
        toast.info("No applications found to export.");
        return;
      }

      const doc = new jsPDF();
      doc.text(`Applications for: ${jobTitle}`, 20, 10);
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
      doc.save(`Applications_${jobTitle.replace(/\s+/g, "_")}.pdf`);
      toast.dismiss(loadingToast);
      toast.success("Applications exported to PDF!");
    } catch (error) {
      console.error("PDF Export Error:", error);
      toast.error("Failed to export to PDF");
    }
  };

  const exportToExcel = async (jobId, jobTitle) => {
    try {
      const loadingToast = toast.loading("Preparing Excel export...");
      const snapshot = await getDocs(
        collection(db, `JobOpenings/${jobId}/Applications`)
      );
      const applications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (applications.length === 0) {
        toast.dismiss(loadingToast);
        toast.info("No applications found to export.");
        return;
      }

      const ws = XLSX.utils.json_to_sheet(
        applications.map((app) => ({
          "Student Name": app.studentName || "N/A",
          Email: app.studentEmail || "N/A",
          Status: app.status || "N/A",
          Remarks: app.remarks || "N/A",
          "Applied Date": app.appliedAt
            ? new Date(app.appliedAt.seconds * 1000).toLocaleDateString()
            : "N/A",
        }))
      );
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Applications");
      XLSX.writeFile(wb, `Applications_${jobTitle.replace(/\s+/g, "_")}.xlsx`);
      toast.dismiss(loadingToast);
      toast.success("Applications exported to Excel!");
    } catch (error) {
      console.error("Excel Export Error:", error);
      toast.error("Failed to export to Excel");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const email = localStorage.getItem("recruiterEmailForSignIn");
      if (!email) {
        toast.error("Please sign in to access this page.");
        navigate("/recruiter/unauthorized");
        return;
      }

      try {
        const companiesSnapshot = await getDocs(collection(db, "Companies"));
        const companyList = companiesSnapshot.docs
          .filter((doc) => {
            const data = doc.data();
            return data.pointsOfContact?.some(
              (poc) => poc.email?.toLowerCase() === email.toLowerCase()
            );
          })
          .map((doc) => doc.data().name);

        if (companyList.length === 0) {
          toast.error("No associated company found.");
          navigate("/recruiter/unauthorized");
          return;
        }

        setCompanies(companyList);
        if (companyList.length > 0 && !state.selectedJob) {
          setFormData((prev) => ({ ...prev, companyName: companyList[0] }));
        }

        const q = query(
          collection(db, "JobOpenings"),
          where("poc.email", "==", email.toLowerCase())
        );
        const snapshot = await getDocs(q);
        setJobOpenings(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleAddJob = async () => {
    if (!state.newJobTitle.trim()) {
      toast.error("Job title cannot be empty");
      return;
    }

    try {
      const loadingToast = toast.loading("Adding new job...");
      const recruiterEmail = localStorage.getItem("recruiterEmailForSignIn");
      const recruiterName = recruiterEmail.split("@")[0];

      await addDoc(collection(db, "JobOpenings"), {
        title: state.newJobTitle.trim(),
        companyName: state.companies[0] || "Your Company",
        status: "Open",
        poc: { email: recruiterEmail, name: recruiterName },
        history: [
          {
            action: "Created",
            performedBy: recruiterName,
            timestamp: new Date().toISOString(),
          },
        ],
        createdAt: serverTimestamp(),
        locationType: "",
        jobType: "",
        experience: "",
        salary: "",
        description: "",
        city: "",
        location: "",
        department: "",
        currency: "USD",
        closingDate: "",
        skills: [],
        duration: "",
      });

      toast.dismiss(loadingToast);
      toast.success("Job added successfully!");
      setIsAddingJob(false);
      setNewJobTitle("");
      refreshJobs();
    } catch (error) {
      console.error("Error adding job:", error);
      toast.error("Failed to add job. Please try again.");
    }
  };

  const refreshJobs = async () => {
    const q = query(
      collection(db, "JobOpenings"),
      where(
        "poc.email",
        "==",
        localStorage.getItem("recruiterEmailForSignIn").toLowerCase()
      )
    );
    const snapshot = await getDocs(q);
    setJobOpenings(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const handleEditJob = (job) => {
    setSelectedJob(job);
    setIsEditing(true);
    setFormData({
      title: job.title || "",
      companyName: job.companyName || "",
      status: job.status || "Open",
      locationType: job.locationType || "",
      jobType: job.jobType || "",
      experience: job.experience || "",
      salary: job.salary || "",
      description: job.description || "",
      city: job.city || "",
      location: job.location || "",
      department: job.department || "",
      currency: job.currency || "USD",
      closingDate: job.closingDate || "",
      skills: job.skills || [],
      duration: job.duration || "",
      // poc: job.poc || { name: "", email: "" },
      history: job.history || [],
    });
  };

  const handleUpdateJob = async () => {
    if (!state.selectedJob) return;

    try {
      const loadingToast = toast.loading("Updating job...");
      const recruiterEmail = localStorage.getItem("recruiterEmailForSignIn");
      const recruiterName = recruiterEmail.split("@")[0];

      await updateDoc(doc(db, "JobOpenings", state.selectedJob.id), {
        ...state.formData,
        history: arrayUnion({
          action: "Updated",
          performedBy: recruiterName,
          timestamp: new Date().toISOString(),
        }),
        updatedAt: serverTimestamp(),
      });

      toast.dismiss(loadingToast);
      toast.success("Job updated successfully!");
      setIsEditing(false);
      setSelectedJob(null);
      refreshJobs();
    } catch (error) {
      console.error("Error updating job:", error);
      toast.error("Failed to update job. Please try again.");
    }
  };

  const handleDeleteJob = async (jobId, jobTitle) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${jobTitle}"? This action cannot be undone.`
      )
    )
      return;

    try {
      const loadingToast = toast.loading("Deleting job...");
      await deleteDoc(doc(db, "JobOpenings", jobId));
      toast.dismiss(loadingToast);
      toast.success("Job deleted successfully!");
      refreshJobs();
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job. Please try again.");
    }
  };

  if (state.loading) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <div className="flex flex-col items-center">
          <ArrowPathIcon className="h-12 w-12 text-indigo-600 animate-spin" />
          <p className="mt-4 text-lg font-medium text-gray-600">
            Loading your job openings...
          </p>
        </div>
      </div>
    );
  }

  const renderBadge = (type, value) => (
    <span
      className={`px-2 py-0.5 text-xs font-medium rounded-full ${
        badgeColors[type][value] || badgeColors[type].default
      }`}
    >
      {value}
    </span>
  );

  const renderJobCard = (job) => (
    <div
      key={job.id}
      className="bg-white border border-gray-200 rounded-2xl shadow-sm transform transition-all duration-300 hover:shadow-lg hover:scale-[1.01]"
    >
      <div className="px-6 py-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
            <p className="mt-1 flex items-center text-sm text-gray-500">
              <BuildingOfficeIcon className="h-4 w-4 mr-1.5 text-gray-400" />
              {job.companyName}
            </p>
          </div>
          {renderBadge("status", job.status)}
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-600">
          {job.jobType && (
            <div className="flex items-center">
              <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
              {renderBadge("jobType", job.jobType)}
            </div>
          )}
          {job.locationType && (
            <div className="flex items-center">
              <MapPinIcon className="h-4 w-4 mr-1 text-gray-400" />
              {renderBadge("location", job.locationType)}
            </div>
          )}
          {job.salary && (
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-4 w-4 mr-1 text-gray-400" />
              <span>{job.salary}</span>
            </div>
          )}
          {job.description && (
            <div className="flex items-center">
              <BookOpenIcon className="h-4 w-4 mr-1 text-gray-400" />
              <span>{job.description}</span>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => navigate(`/recruiter-view/${job.id}`)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-xs font-medium rounded-full hover:bg-indigo-700 transition"
          >
            View Applications
          </button>

          <button
            onClick={() => exportToExcel(job.id, job.title)}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs rounded-md text-gray-700 bg-white hover:bg-gray-100"
          >
            <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
            Excel
          </button>

          <button
            onClick={() => exportToPDF(job.id, job.title)}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs rounded-md text-gray-700 bg-white hover:bg-gray-100"
          >
            <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
            PDF
          </button>
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-4 flex items-center justify-between rounded-b-2xl">
        <span className="text-sm text-gray-500">
          Created:{" "}
          {job.createdAt
            ? new Date(job.createdAt.seconds * 1000).toLocaleDateString()
            : "N/A"}
        </span>
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditJob(job)}
            className="text-indigo-600 hover:text-indigo-800"
            title="Edit"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleDeleteJob(job.id, job.title)}
            className="text-red-600 hover:text-red-800"
            title="Delete"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Your Job Openings
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage all your job postings in one place
            </p>
          </div>
          <button
            onClick={() => setIsAddingJob(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Add New Job
          </button>
        </div>

        {state.isAddingJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Add New Job
                </h3>
                <button
                  onClick={() => {
                    setIsAddingJob(false);
                    setNewJobTitle("");
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="jobTitle"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Job Title*
                </label>
                <input
                  type="text"
                  id="jobTitle"
                  value={state.newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  placeholder="e.g. Software Engineer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsAddingJob(false);
                    setNewJobTitle("");
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddJob}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Job
                </button>
              </div>
            </div>
          </div>
        )}

        {state.jobOpenings.length === 0 ? (
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6 text-center">
              <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No job openings yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first job opening.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setIsAddingJob(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                  Add Job
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {state.jobOpenings.map(renderJobCard)}
            </div>
          </div>
        )}

        {state.isEditing && state.selectedJob && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-start p-6 overflow-y-auto transition-all hover:bg-gray-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mt-10 overflow-hidden">
              <div className="flex items-center justify-between border-b px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Edit Job: {state.selectedJob.title}
                </h3>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedJob(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="px-6 py-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    { id: "title", label: "Job Title*", type: "text" },
                    {
                      id: "companyName",
                      label: "Company*",
                      type: "select",
                      options: state.companies,
                    },
                    {
                      id: "status",
                      label: "Status*",
                      type: "select",
                      options: ["Open", "Closed", "On Hold"],
                    },
                    {
                      id: "locationType",
                      label: "Location Type*",
                      type: "select",
                      options: ["", "On-site", "Hybrid", "Remote"],
                    },
                    {
                      id: "jobType",
                      label: "Job Type*",
                      type: "select",
                      options: [
                        "",
                        "Full-time",
                        "Internship",
                        "Contract",
                        "Part-time",
                      ],
                    },
                    {
                      id: "experience",
                      label: "Experience",
                      type: "text",
                      placeholder: "e.g. 2-4 years",
                    },
                    {
                      id: "salary",
                      label: "Salary",
                      type: "text",
                      placeholder: "e.g. $70,000 - $90,000",
                    },
                    { id: "city", label: "City", type: "text" },
                    { id: "location", label: "Location", type: "text" },
                    { id: "department", label: "Department", type: "text" },
                    {
                      id: "currency",
                      label: "Currency",
                      type: "select",
                      options: ["USD", "INR", "EUR", "GBP"],
                    },
                    { id: "closingDate", label: "Closing Date", type: "date" },
                    {
                      id: "duration",
                      label: "Duration",
                      type: "text",
                      placeholder: "e.g. 6 months",
                    },
                  ].map((field) => (
                    <div key={field.id}>
                      <label
                        htmlFor={field.id}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {field.label}
                      </label>
                      {field.type === "select" ? (
                        <select
                          id={field.id}
                          value={state.formData[field.id]}
                          onChange={(e) =>
                            setFormData({
                              ...state.formData,
                              [field.id]: e.target.value,
                            })
                          }
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          {field.options.map((option, i) => (
                            <option key={i} value={option}>
                              {option || "Select"}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          id={field.id}
                          value={state.formData[field.id]}
                          onChange={(e) =>
                            setFormData({
                              ...state.formData,
                              [field.id]: e.target.value,
                            })
                          }
                          placeholder={field.placeholder || ""}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Job Description*
                  </label>
                  <textarea
                    id="description"
                    rows={5}
                    value={state.formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...state.formData,
                        description: e.target.value,
                      })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter detailed job description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Required Skills
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {state.formData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-1.5 text-indigo-600 hover:text-indigo-900"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  {state.isAddingSkill ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={state.newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Enter skill"
                        className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        <CheckIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingSkill(false)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-100"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsAddingSkill(true)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <PlusIcon className="-ml-1 mr-1 h-4 w-4" />
                      Add Skill
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 border-t px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedJob(null);
                  }}
                  className="px-4 py-2 rounded-md border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateJob}
                  className="px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
