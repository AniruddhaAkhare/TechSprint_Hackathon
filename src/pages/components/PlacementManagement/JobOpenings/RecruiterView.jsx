import React, { useState, useEffect, useRef } from "react";
import { db } from "../../../../config/firebase";
import { collection, getDocs, updateDoc, doc, getDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { ArrowLeft, Users, Building, MapPin, Calendar, Clock, Filter, Search } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const statuses = ["Pending", "Applied", "Rejected", "Shortlisted", "Interviewed"];
const ratings = [1, 2, 3, 4, 5];

export default function RecruiterView() {
  const params = useParams();
  const navigate = useNavigate();
  const { id } = params;
  
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
    rejected: 0
  });

  useEffect(() => {
    const fetchJobAndApplications = async () => {
      try {
        setLoading(true);
        
        if (!id) {
          throw new Error("No job ID provided");
        }
        
        // Fetch job details
        const jobDocRef = doc(db, "JobOpenings", id);
        const jobDoc = await getDoc(jobDocRef);
        
        if (!jobDoc.exists()) {
          throw new Error("Job not found");
        }
        
        const jobData = jobDoc.data();
        setJob({ 
          id: jobDoc.id, 
          ...jobData,
          skills: Array.isArray(jobData.skills) ? jobData.skills : []
        });

        // Fetch applications
        const applicationsRef = collection(db, `JobOpenings/${id}/Applications`);
        const snapshot = await getDocs(applicationsRef);
        
        const appData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            skills: Array.isArray(data.skills) ? data.skills : [],
            appliedAt: data.appliedAt || data.createdAt || null
          };
        });
        
        setApplications(appData);
        setFilteredApplications(appData);
        
        // Initialize local remarks state
        const remarksState = {};
        appData.forEach(app => {
          remarksState[app.id] = app.remarks || "";
        });
        setLocalRemarks(remarksState);
        
        // Calculate stats
        const newStats = {
          total: appData.length,
          pending: appData.filter(app => app.status === 'Pending' || !app.status).length,
          shortlisted: appData.filter(app => app.status === 'Shortlisted').length,
          interviewed: appData.filter(app => app.status === 'Interviewed').length,
          rejected: appData.filter(app => app.status === 'Rejected').length
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
      filtered = filtered.filter(app => 
        app.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.course?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "All") {
      filtered = filtered.filter(app => 
        statusFilter === "Pending" ? (!app.status || app.status === "Pending") : app.status === statusFilter
      );
    }
    
    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter]);

  const handleUpdateApplication = async (applicationId, updates) => {
    if (!canUpdate) {
      toast.error("You don't have permission to update applications");
      return;
    }
    
    try {
      const applicationRef = doc(db, `JobOpenings/${id}/Applications`, applicationId);
      await updateDoc(applicationRef, {
        ...updates,
        updatedAt: new Date()
      });
      
      const updatedApps = applications.map((app) => 
        app.id === applicationId ? { ...app, ...updates } : app
      );
      
      setApplications(updatedApps);
      
      // Only show toast for non-remarks updates (to avoid spam)
      if (!updates.hasOwnProperty('remarks')) {
        toast.success("Application updated successfully!");
      }
      
      // Recalculate stats if status was updated
      if (updates.status) {
        const newStats = {
          total: updatedApps.length,
          pending: updatedApps.filter(app => app.status === 'Pending' || !app.status).length,
          shortlisted: updatedApps.filter(app => app.status === 'Shortlisted').length,
          interviewed: updatedApps.filter(app => app.status === 'Interviewed').length,
          rejected: updatedApps.filter(app => app.status === 'Rejected').length,
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
    // Update local state immediately for responsive UI
    setLocalRemarks(prev => ({
      ...prev,
      [applicationId]: value
    }));

    // Clear existing timer
    if (remarksTimers.current[applicationId]) {
      clearTimeout(remarksTimers.current[applicationId]);
    }

    // Set new timer to update database after 1.5 seconds of no typing
    remarksTimers.current[applicationId] = setTimeout(() => {
      handleUpdateApplication(applicationId, { remarks: value });
      delete remarksTimers.current[applicationId];
    }, 1500);
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(remarksTimers.current).forEach(timer => {
        if (timer) clearTimeout(timer);
      });
    };
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'Applied': return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'Shortlisted': return 'text-green-700 bg-green-100 border-green-200';
      case 'Interviewed': return 'text-purple-700 bg-purple-100 border-purple-200';
      case 'Rejected': return 'text-red-700 bg-red-100 border-red-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="ml-0 md:ml-64 min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading job applications...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="ml-0 md:ml-64 min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Job Not Found</h2>
            <p className="text-gray-600 mb-4">The requested job could not be found.</p>
            <button 
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-0 md:ml-64 min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Fixed Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-800">
                  {job.title || 'Untitled Job'}
                </h1>
                <p className="text-gray-600 text-sm mt-1">Applications Management</p>
              </div>
            </div>
            
            {/* Stats Cards - Responsive */}
            <div className="grid grid-cols-3 lg:flex gap-2 lg:gap-4">
              <div className="bg-blue-50 px-3 py-2 rounded-lg text-center">
                <div className="text-lg lg:text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-xs text-blue-600">Total</div>
              </div>
              <div className="bg-yellow-50 px-3 py-2 rounded-lg text-center">
                <div className="text-lg lg:text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <div className="text-xs text-yellow-600">Pending</div>
              </div>
              <div className="bg-green-50 px-3 py-2 rounded-lg text-center">
                <div className="text-lg lg:text-2xl font-bold text-green-600">{stats.shortlisted}</div>
                <div className="text-xs text-green-600">Shortlisted</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Job Details Card - More Compact */}
        <div className="bg-white rounded-lg shadow-sm border mb-6 p-4 lg:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <Building className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm text-gray-500">Company</p>
                <p className="font-medium truncate">{job.companyName || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium truncate">{job.location || job.locationType || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm text-gray-500">Job Type</p>
                <p className="font-medium truncate">{job.jobType || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm text-gray-500">Applications</p>
                <p className="font-medium">{applications.length}</p>
              </div>
            </div>
          </div>
          
          {job.skills && job.skills.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500 mb-2">Required Skills</p>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border mb-6 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, email, or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="All">All Status</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
          
          {filteredApplications.length !== applications.length && (
            <div className="mt-3 text-sm text-gray-600">
              Showing {filteredApplications.length} of {applications.length} applications
            </div>
          )}
        </div>

        {/* Applications Table - Better Mobile Responsive */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-4 lg:px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">
              Applications ({filteredApplications.length})
            </h2>
          </div>
          
          {filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                {applications.length === 0 ? "No Applications Yet" : "No Applications Match Your Filter"}
              </h3>
              <p className="text-gray-600">
                {applications.length === 0 
                  ? "Applications will appear here once students start applying."
                  : "Try adjusting your search or filter criteria."
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Skills
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied Date
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remarks
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-4 lg:px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {app.studentName || 'N/A'}
                        </div>
                        {app.email && (
                          <div className="text-sm text-gray-500 truncate max-w-[200px]">{app.email}</div>
                        )}
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-sm text-gray-900">
                        {app.course || 'N/A'}
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        {canUpdate ? (
                          <select
                            value={app.status || 'Pending'}
                            onChange={(e) => handleUpdateApplication(app.id, { status: e.target.value })}
                            className={`text-sm rounded-lg px-3 py-1 border focus:ring-2 focus:ring-blue-500 ${getStatusColor(app.status || 'Pending')}`}
                          >
                            {statuses.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className={`inline-flex px-3 py-1 text-sm rounded-lg border ${getStatusColor(app.status || 'Pending')}`}>
                            {app.status || 'Pending'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        {canUpdate ? (
                          <select
                            value={app.rating || ""}
                            onChange={(e) => handleUpdateApplication(app.id, { rating: parseInt(e.target.value) })}
                            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">No Rating</option>
                            {ratings.map((rating) => (
                              <option key={rating} value={rating}>
                                {rating} ⭐
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-sm text-gray-900">
                            {app.rating ? `${app.rating} ⭐` : "N/A"}
                          </span>
                        )}
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {app.skills && app.skills.length > 0 ? (
                            app.skills.slice(0, 2).map((skill, index) => (
                              <span 
                                key={index}
                                className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded"
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500">No skills</span>
                          )}
                          {app.skills && app.skills.length > 2 && (
                            <span className="text-xs text-gray-500">+{app.skills.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-sm text-gray-500">
                        <div className="max-w-[120px]">
                          {formatDate(app.appliedAt)}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        {canUpdate ? (
                          <input
                            type="text"
                            value={localRemarks[app.id] || ""}
                            onChange={(e) => handleRemarksChange(app.id, e.target.value)}
                            className="w-full min-w-[150px] px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Add remarks..."
                          />
                        ) : (
                          <span className="text-sm text-gray-900">{app.remarks || "N/A"}</span>
                        )}
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