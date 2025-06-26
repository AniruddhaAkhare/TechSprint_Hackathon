import React, { useState, useEffect } from 'react';
import { X, FileText, Upload, Save, Edit2 } from 'lucide-react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../config/firebase';

const Submissions = ({ assignment, onClose }) => {
  const [submissions, setSubmissions] = useState([]);
  const [students, setStudents] = useState({});
  const [loading, setLoading] = useState(true);
  const [remarkInputs, setRemarkInputs] = useState({});
  const [editingRemarks, setEditingRemarks] = useState({}); // State to track which remarks are being edited

  // Fetch submissions and students
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch submissions
        const submissionSnapshot = await getDocs(collection(db, 'Submissions'));
        const submissionList = submissionSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(sub => sub.assignmentId === assignment.id);

        // Fetch students
        const studentSnapshot = await getDocs(collection(db, 'student'));
        const studentMap = {};
        studentSnapshot.docs.forEach(doc => {
          const data = doc.data();
          studentMap[doc.id] = data.Name || 'Unknown';
        });

        setSubmissions(submissionList);
        setStudents(studentMap);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to fetch data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (assignment?.id) {
      fetchData();
    }
  }, [assignment?.id]);

  // Handle remark input change
  const handleRemarkChange = (submissionId, value) => {
    setRemarkInputs(prev => ({
      ...prev,
      [submissionId]: value
    }));
  };

  // Handle saving remark (for both new and edited remarks)
  const handleSaveRemark = async (submissionId) => {
    const remark = remarkInputs[submissionId]?.trim();
    if (!remark) {
      alert('Please enter a remark before saving.');
      return;
    }

    try {
      const submissionRef = doc(db, 'Submissions', submissionId);
      await updateDoc(submissionRef, { remarks: remark });

      // Update local state
      setSubmissions(prev =>
        prev.map(sub =>
          sub.id === submissionId ? { ...sub, remarks: remark } : sub
        )
      );
      setRemarkInputs(prev => ({
        ...prev,
        [submissionId]: '' // Clear input after saving
      }));
      setEditingRemarks(prev => ({
        ...prev,
        [submissionId]: false // Exit edit mode
      }));
      alert('Remark saved successfully!');
    } catch (error) {
      console.error('Error saving remark:', error);
      alert('Failed to save remark. Please try again.');
    }
  };

  // Handle edit remark button click
  const handleEditRemark = (submissionId, currentRemark) => {
    setEditingRemarks(prev => ({
      ...prev,
      [submissionId]: true
    }));
    setRemarkInputs(prev => ({
      ...prev,
      [submissionId]: currentRemark
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Submissions</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          {/* Assignment Info */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900">{assignment.title}</h3>
            <p className="text-sm text-gray-600 mt-1">Total Submissions: {submissions.length}</p>
          </div>

          {/* Submissions List */}
          <div className="space-y-4">
            {loading ? (
              <p className="text-gray-500 text-center py-8">Loading submissions...</p>
            ) : submissions.length > 0 ? (
              submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Student Name:</span>
                      <span className="text-sm text-gray-900">{students[submission.studentId] || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">Submitted:</span>
                      <span className="text-sm text-gray-900">{formatDate(submission.submittedAt)}</span>
                    </div>
                    {submission.fileUrl && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">File:</span>
                        <a
                          href={submission.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <Upload size={14} />
                          View Submission
                        </a>
                      </div>
                    )}
                    <div>
                      <span className="text-sm font-medium text-gray-700">Remarks:</span>
                      {submission.remarks && !editingRemarks[submission.id] ? (
                        <div className="flex items-start gap-2 mt-1">
                          <p className="text-sm text-gray-900 flex-1">{submission.remarks}</p>
                          <button
                            onClick={() => handleEditRemark(submission.id, submission.remarks)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Edit Remark"
                          >
                            <Edit2 size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="mt-1 flex items-center gap-2">
                          <textarea
                            value={remarkInputs[submission.id] || ''}
                            onChange={(e) => handleRemarkChange(submission.id, e.target.value)}
                            placeholder="Add a remark..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            rows={2}
                          />
                          <button
                            onClick={() => handleSaveRemark(submission.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md flex items-center transition-colors"
                            title={editingRemarks[submission.id] ? "Save Edited Remark" : "Save Remark"}
                          >
                            <Save size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No submissions yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Submissions;