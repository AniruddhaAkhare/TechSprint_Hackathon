import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Eye,
  Download,
  Filter,
  Search,
  Plus,
  Check,
  X
} from 'lucide-react';
import { collection, getDocs, query, where, doc, updateDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../../../config/firebase';

const LeaveApplications = () => {
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch current user
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setCurrentUser({
        uid: user.uid,
        displayName: user.displayName || 'Unknown Approver'
      });
    } else {
      setError('No user is signed in');
    }
  }, []);

  // Fetch leave applications and employee name from Firestore
  useEffect(() => {
    const fetchLeaveApplications = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch leave applications
        const leaveApplicationsRef = collection(db, 'LeaveApplication');
        const q = query(
          leaveApplicationsRef,
          where('User_id', '==', 'aO6wOIhyTxeu6hxNGCoxVXuaVQL2')
        );
        const snapshot = await getDocs(q);

        // Fetch employee name from Users collection
        const userRef = doc(db, 'Users', 'aO6wOIhyTxeu6hxNGCoxVXuaVQL2');
        const userSnap = await getDoc(userRef);
        const employeeName = userSnap.exists() ? userSnap.data().displayName || 'Unknown User' : 'Unknown User';

        const applications = snapshot.docs.map(doc => ({
          id: doc.id,
          employee_id: doc.data().User_id,
          employee_name: employeeName,
          leave_type_name: doc.data().leaveType,
          leave_start_date: doc.data().startDate,
          leave_end_date: doc.data().endDate,
          total_days: doc.data().totalDays,
          reason_for_leave: doc.data().reasonForLeave,
          document_url: doc.data().supportingDocuments ? `/documents/${doc.data().supportingDocuments}` : null,
          status: doc.data().status,
          applied_on: doc.data().createdAt,
          approved_by: doc.data().approved_by || null,
          approver_name: doc.data().approver_name || null,
          approval_date: doc.data().approval_date || null
        }));
        setLeaveApplications(applications);
      } catch (err) {
        setError('Failed to fetch leave applications or user data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaveApplications();
  }, []);

  // Handle Approve/Reject actions
  const handleStatusUpdate = async (applicationId, newStatus) => {
    if (!currentUser) {
      setError('You must be signed in to approve or reject applications');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const applicationRef = doc(db, 'LeaveApplication', applicationId);
      await updateDoc(applicationRef, {
        status: newStatus,
        approved_by: currentUser.uid,
        approver_name: currentUser.displayName,
        approval_date: new Date().toISOString()
      });

      // Update local state
      setLeaveApplications(prev =>
        prev.map(app =>
          app.id === applicationId
            ? {
                ...app,
                status: newStatus,
                approved_by: currentUser.uid,
                approver_name: currentUser.displayName,
                approval_date: new Date().toISOString()
              }
            : app
        )
      );
      alert(`Application ${newStatus} successfully!`);
    } catch (err) {
      setError(`Failed to update status: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'Pending':
        return <Clock className="h-4 w-4" />;
      case 'Rejected':
        return <XCircle className="h-4 w-4" />;
      case 'Cancelled':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredApplications = leaveApplications.filter(app => {
    const matchesSearch = app.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.reason_for_leave.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Leave Applications</h1>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200">
            <Plus className="h-5 w-5" />
            New Application
          </button>
        </div>
        <p className="text-gray-600">Manage and track all leave applications</p>
        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by employee name or reason..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-600">Loading applications...</div>
        ) : filteredApplications.length === 0 ? (
          <div className="p-6 text-center text-gray-600">No applications found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Employee</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Leave Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Duration</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Days</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Applied On</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <div className="font-medium text-gray-900">{application.employee_name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{application.leave_type_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <div>{formatDate(application.leave_start_date)}</div>
                          <div className="text-gray-500">to {formatDate(application.leave_end_date)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">{application.total_days}</span>
                      <span className="text-sm text-gray-500 ml-1">
                        {application.total_days === 1 ? 'day' : 'days'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {application.status === 'Pending' ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStatusUpdate(application.id, 'Approved')}
                            className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 flex items-center gap-1 text-sm"
                            disabled={loading}
                          >
                            <Check className="h-4 w-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(application.id, 'Rejected')}
                            className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 flex items-center gap-1 text-sm"
                            disabled={loading}
                          >
                            <X className="h-4 w-4" />
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          {application.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{formatDateTime(application.applied_on)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="text-indigo-600 hover:text-indigo-800 p-1 rounded transition-colors duration-150">
                          <Eye className="h-4 w-4" />
                        </button>
                        {application.document_url && (
                          <button className="text-green-600 hover:text-green-800 p-1 rounded transition-colors duration-150">
                            <Download className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detailed View Cards (Alternative to table for mobile) */}
      <div className="mt-8 lg:hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-600">Loading applications...</div>
        ) : filteredApplications.length === 0 ? (
          <div className="p-6 text-center text-gray-600">No applications found</div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <div key={application.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  {application.status === 'Pending' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStatusUpdate(application.id, 'Approved')}
                        className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 flex items-center gap-1 text-sm"
                        disabled={loading}
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(application.id, 'Rejected')}
                        className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 flex items-center gap-1 text-sm"
                        disabled={loading}
                      >
                        <X className="h-4 w-4" />
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(application.status)}`}>
                      {getStatusIcon(application.status)}
                      {application.status}
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Employee</p>
                    <p className="font-medium">{application.employee_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Leave Type</p>
                    <p className="font-medium">{application.leave_type_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-medium">{formatDate(application.leave_start_date)} - {formatDate(application.leave_end_date)}</p>
                    <p className="text-sm text-gray-500">{application.total_days} days</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Applied On</p>
                    <p className="font-medium">{formatDateTime(application.applied_on)}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Reason</p>
                  <p className="text-gray-900">{application.reason_for_leave}</p>
                </div>

                {application.approved_by && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Approved By</p>
                    <p className="font-medium">{application.approver_name || application.approved_by}</p>
                    <p className="text-sm text-gray-500">{formatDateTime(application.approval_date)}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    {application.document_url && (
                      <span className="text-sm text-green-600 flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        Document attached
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-indigo-600 hover:text-indigo-800 p-2 rounded transition-colors duration-150">
                      <Eye className="h-4 w-4" />
                    </button>
                    {application.document_url && (
                      <button className="text-green-600 hover:text-green-800 p-2 rounded transition-colors duration-150">
                        <Download className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-2xl font-bold text-indigo-600">
            {leaveApplications.length}
          </div>
          <div className="text-sm text-gray-600">Total Applications</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {leaveApplications.filter(app => app.status === 'Pending').length}
          </div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-2xl font-bold text-green-600">
            {leaveApplications.filter(app => app.status === 'Approved').length}
          </div>
          <div className="text-sm text-gray-600">Approved</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-2xl font-bold text-red-600">
            {leaveApplications.filter(app => app.status === 'Rejected').length}
          </div>
          <div className="text-sm text-gray-600">Rejected</div>
        </div>
      </div>
    </div>
  );
};

export default LeaveApplications;