import React, { useState, useEffect, useRef } from "react";
import { db } from "../../../../config/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  ArrowLeft,
  Users,
  Building,
  MapPin,
  Calendar,
  Clock,
  Filter,
  Search,
  Download,
  Star,
  Eye,
  TrendingUp,
  UserCheck,
  MessageSquare,
  Briefcase,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import generateResumeLink from "../../../../utils/resumeDownloader";

// Application status options
const statuses = [
  "Pending",
  "Applied",
  "Rejected",
  "Shortlisted",
  "Interviewed",
];
const ratings = [1, 2, 3, 4, 5];

export default function RecruiterView() {
  const params = useParams();
  const navigate = useNavigate();
  const { id } = params;

  // State
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canUpdate, setCanUpdate] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [localRemarks, setLocalRemarks] = useState({}); // Local state for remarks
  const remarksTimers = useRef({}); // Timers for debouncing remarks

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    shortlisted: 0,
    interviewed: 0,
    rejected: 0,
  });

  // Fetch job and applications
  useEffect(() => {
    const fetchJobAndApplications = async () => {
      try {
        setLoading(true);
        if (!id) throw new Error("No job ID provided");

        // Fetch job details
        const jobDocRef = doc(db, "JobOpenings", id);
        const jobDoc = await getDoc(jobDocRef);

        if (!jobDoc.exists()) throw new Error("Job not found");

        const jobData = jobDoc.data();
        setJob({
          id: jobDoc.id,
          ...jobData,
          skills: Array.isArray(jobData.skills) ? jobData.skills : [],
        });

        // Fetch applications
        const applicationsRef = collection(
          db,
          "JobOpenings",
          id,
          "Applications"
        );
        const snapshot = await getDocs(applicationsRef);

        const appData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            skills: Array.isArray(data.skills) ? data.skills : [],
            appliedAt: data.appliedAt || data.createdAt || null,
          };
        });

        setApplications(
          appData.filter((app) => app.source === "student" || !app.source)
        );
        setFilteredApplications(appData);

        // Initialize local remarks state
        const remarksState = {};
        appData.forEach((app) => {
          remarksState[app.id] = app.remarks || "";
        });
        setLocalRemarks(remarksState);

        // Calculate stats
        const newStats = {
          total: appData.length,
          pending: appData.filter(
            (app) => app.status === "Pending" || !app.status
          ).length,
          shortlisted: appData.filter((app) => app.status === "Shortlisted")
            .length,
          interviewed: appData.filter((app) => app.status === "Interviewed")
            .length,
          rejected: appData.filter((app) => app.status === "Rejected").length,
        };
        setStats(newStats);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error(`Failed to load job or applications: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchJobAndApplications();
  }, [id]);

  // Filter applications based on search and status
  useEffect(() => {
    let filtered = applications;
    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.course?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((app) =>
        statusFilter === "Pending"
          ? !app.status || app.status === "Pending"
          : app.status === statusFilter
      );
    }

    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter]);

  // Update application
  const handleUpdateApplication = async (applicationId, updates) => {
    if (!canUpdate) {
      toast.error("You don't have permission to update applications");
      return;
    }

    try {
      const applicationRef = doc(
        db,
        "JobOpenings",
        id,
        "Applications",
        applicationId
      );
      await updateDoc(applicationRef, {
        ...updates,
        updatedAt: new Date(),
      });

      const updatedApps = applications.map((app) =>
        app.id === applicationId ? { ...app, ...updates } : app
      );

      setApplications(updatedApps);

      if (!updates.hasOwnProperty("remarks")) {
        toast.success("Application updated successfully!");
      }

      // Recalculate stats if status was updated
      if (updates.status) {
        const newStats = {
          total: updatedApps.length,
          pending: updatedApps.filter(
            (app) => app.status === "Pending" || !app.status
          ).length,
          shortlisted: updatedApps.filter((app) => app.status === "Shortlisted")
            .length,
          interviewed: updatedApps.filter((app) => app.status === "Interviewed")
            .length,
          rejected: updatedApps.filter((app) => app.status === "Rejected")
            .length,
        };
        setStats(newStats);
      }
    } catch (err) {
      console.error("Error updating application:", err);
      toast.error("Failed to update application.");
    }
  };

  // Debounced remarks update function
  const handleRemarksChange = (applicationId, value) => {
    setLocalRemarks((prev) => ({
      ...prev,
      [applicationId]: value,
    }));

    if (remarksTimers.current[applicationId]) {
      clearTimeout(remarksTimers.current[applicationId]);
    }

    remarksTimers.current[applicationId] = setTimeout(() => {
      handleUpdateApplication(applicationId, { remarks: value });
      delete remarksTimers.current[applicationId];
    }, 1500);
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(remarksTimers.current).forEach((timer) => {
        if (timer) clearTimeout(timer);
      });
    };
  }, []);

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Status color classes
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-amber-700 bg-amber-50 border-amber-200 ring-amber-200";
      case "Applied":
        return "text-blue-700 bg-blue-50 border-blue-200 ring-blue-200";
      case "Shortlisted":
        return "text-emerald-700 bg-emerald-50 border-emerald-200 ring-emerald-200";
      case "Interviewed":
        return "text-purple-700 bg-purple-50 border-purple-200 ring-purple-200";
      case "Rejected":
        return "text-red-700 bg-red-50 border-red-200 ring-red-200";
      default:
        return "text-slate-700 bg-slate-50 border-slate-200 ring-slate-200";
    }
  };

  const handleDownloadResume = async (resumePath) => {
    try {
      const response = await fetch('http://localhost:3001/api/generate-resume-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resumePath }),
      });

      if (!response.ok) {
        // If the server responded with an error, show it.
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch resume URL.');
      }

      const data = await response.json();
      window.open(data.url, "_blank");

    } catch (err) {
      console.error("Error fetching resume URL:", err);
      toast.error(err.message || "Could not retrieve resume.");
    }
  };

  const renderStarRating = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="ml-0 md:ml-64 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="relative mx-auto mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Loading Applications
            </h3>
            <p className="text-slate-600">
              Please wait while we fetch the data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="ml-0 md:ml-64 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Job Not Found
            </h2>
            <p className="text-slate-600 mb-6">
              The requested job could not be found or may have been removed.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-0 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        className="mt-16"
        toastClassName="rounded-xl shadow-lg"
      />

      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/60 sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-3 rounded-xl hover:bg-slate-100 transition-all duration-200 group"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:text-slate-800" />
              </button>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-1">
                  {job.title || "Untitled Job"}
                </h1>
                <p className="text-slate-600 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Applications Management
                </p>
              </div>
            </div>

            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-3 lg:flex gap-3 lg:gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-3 rounded-xl border border-blue-200/50 text-center group hover:shadow-lg transition-all duration-200">
                <div className="text-2xl lg:text-3xl font-bold text-blue-700 mb-1">
                  {stats.total}
                </div>
                <div className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                  Total
                </div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 px-4 py-3 rounded-xl border border-amber-200/50 text-center group hover:shadow-lg transition-all duration-200">
                <div className="text-2xl lg:text-3xl font-bold text-amber-700 mb-1">
                  {stats.pending}
                </div>
                <div className="text-xs font-medium text-amber-600 uppercase tracking-wide">
                  Pending
                </div>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 px-4 py-3 rounded-xl border border-emerald-200/50 text-center group hover:shadow-lg transition-all duration-200">
                <div className="text-2xl lg:text-3xl font-bold text-emerald-700 mb-1">
                  {stats.shortlisted}
                </div>
                <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide">
                  Shortlisted
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Job Details Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Job Details
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-500 mb-1">
                    Company
                  </p>
                  <p className="font-semibold text-slate-900 truncate">
                    {job.companyName || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-500 mb-1">
                    Location
                  </p>
                  <p className="font-semibold text-slate-900 truncate">
                    {job.location || job.locationType || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-500 mb-1">
                    Job Type
                  </p>
                  <p className="font-semibold text-slate-900 truncate">
                    {job.jobType || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-orange-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-500 mb-1">
                    Applications
                  </p>
                  <p className="font-semibold text-slate-900">
                    {applications.length}
                  </p>
                </div>
              </div>
            </div>

            {job.skills && job.skills.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <p className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Required Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 text-sm font-medium rounded-lg border border-blue-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 mb-8 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80 placeholder-slate-400"
              />
            </div>
            <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-200">
              <Filter className="w-5 h-5 text-slate-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent border-none focus:ring-0 focus:outline-none text-slate-700 font-medium"
              >
                <option value="All">All Status</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredApplications.length !== applications.length && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700 font-medium">
                Showing {filteredApplications.length} of {applications.length}{" "}
                applications
              </p>
            </div>
          )}
        </div>

        {/* Enhanced Applications Table */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Applications ({filteredApplications.length})
            </h2>
          </div>

          {filteredApplications.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                {applications.length === 0
                  ? "No Applications Yet"
                  : "No Applications Match Your Filter"}
              </h3>
              <p className="text-slate-600 max-w-md mx-auto">
                {applications.length === 0
                  ? "Applications will appear here once students start applying to this position."
                  : "Try adjusting your search terms or filter criteria to find specific applications."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Student Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Skills
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Applied Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Remarks
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Resume
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredApplications.map((app, index) => (
                    <tr
                      key={app.id}
                      className={`hover:bg-slate-50 transition-colors duration-150 ${
                        index % 2 === 0 ? "bg-white" : "bg-slate-25"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {(app.studentName || "?").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-900">
                              {app.studentName || "N/A"}
                            </div>
                            {app.email && (
                              <div className="text-sm text-slate-500 truncate max-w-[200px]">
                                {app.email}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-900">
                          {app.course || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {canUpdate ? (
                          <select
                            value={app.status || "Pending"}
                            onChange={(e) =>
                              handleUpdateApplication(app.id, {
                                status: e.target.value,
                              })
                            }
                            className={`text-sm rounded-lg px-3 py-2 border-2 focus:ring-2 focus:ring-offset-1 transition-all duration-200 font-medium ${getStatusColor(
                              app.status || "Pending"
                            )}`}
                          >
                            {statuses.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span
                            className={`inline-flex px-3 py-2 text-sm font-medium rounded-lg border-2 ${getStatusColor(
                              app.status || "Pending"
                            )}`}
                          >
                            {app.status || "Pending"}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {canUpdate ? (
                          <select
                            value={app.rating || ""}
                            onChange={(e) =>
                              handleUpdateApplication(app.id, {
                                rating: parseInt(e.target.value),
                              })
                            }
                            className="text-sm border-2 border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          >
                            <option value="">No Rating</option>
                            {ratings.map((rating) => (
                              <option key={rating} value={rating}>
                                {rating} Star{rating !== 1 ? "s" : ""}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="flex items-center gap-2">
                            {app.rating ? (
                              renderStarRating(app.rating)
                            ) : (
                              <span className="text-sm text-slate-500">
                                No rating
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {app.skills && app.skills.length > 0 ? (
                            <>
                              {app.skills.slice(0, 2).map((skill, index) => (
                                <span
                                  key={index}
                                  className="inline-flex px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-md border border-slate-200"
                                >
                                  {skill}
                                </span>
                              ))}
                              {app.skills.length > 2 && (
                                <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-md border border-blue-200">
                                  +{app.skills.length - 2} more
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-sm text-slate-500 italic">
                              No skills listed
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600 font-medium">
                          {formatDate(app.appliedAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {canUpdate ? (
                          <div className="relative">
                            <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                              type="text"
                              value={localRemarks[app.id] || ""}
                              onChange={(e) =>
                                handleRemarksChange(app.id, e.target.value)
                              }
                              className="w-full min-w-[180px] pl-10 pr-3 py-2 text-sm border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              placeholder="Add remarks..."
                            />
                          </div>
                        ) : (
                          <span className="text-sm text-slate-700">
                            {app.remarks || "No remarks"}
                          </span>
                        )}
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <a
                          onClick={(e) => {
                            e.preventDefault();
                            handleDownloadResume(app.resumePath);
                          }}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded hover:bg-green-200 transition-colors cursor-pointer"
                        >
                          View Resume
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
