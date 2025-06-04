import { useState } from "react";
import {
  Calendar,
  Clock,
  Upload,
  FileText,
  Send,
  User,
  X,
} from "lucide-react";
import { db, storage } from "../../../config/firebase"; // Adjust the path to your Firebase config file
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const LeaveApplication = () => {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    leaveType: "",
    reason: "",
    attachment: null,
  });
  const [dragActive, setDragActive] = useState(false);
  const [attachmentError, setAttachmentError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const leaveTypes = [
    "Sick Leave",
    "Casual Leave",
    "Annual Leave",
    "Maternity Leave",
    "Paternity Leave",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file) => {
    if (file) {
      const validFormats = ["application/pdf", "image/jpeg", "image/png"];
      if (!validFormats.includes(file.type)) {
        setAttachmentError(
          "Invalid file format. Only PDF, JPG, and PNG are supported."
        );
        setFormData((prev) => ({ ...prev, attachment: null }));
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setAttachmentError("File size exceeds 2MB.");
        setFormData((prev) => ({ ...prev, attachment: null }));
        return;
      }
      setAttachmentError("");
      setFormData((prev) => ({ ...prev, attachment: file }));
    }
  };

  const removeAttachment = () => {
    setFormData((prev) => ({ ...prev, attachment: null }));
    setAttachmentError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    const { startDate, endDate, leaveType, reason, attachment } = formData;

    // Validation checks
    if (!startDate || !endDate || !leaveType || !reason) {
      setError("All fields are required.");
      setIsSubmitting(false);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      setError("Start date cannot be in the past.");
      setIsSubmitting(false);
      return;
    }

    if (end < start) {
      setError("End date cannot be before start date.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare data to save
      let attachmentUrl = null;

      // If there's an attachment, upload it to Firebase Storage
      if (attachment) {
        const storageRef = ref(storage, `leave-attachments/${attachment.name}`);
        await uploadBytes(storageRef, attachment);
        attachmentUrl = await getDownloadURL(storageRef);
      }

      // Save data to Firestore
      await addDoc(collection(db, "Leaves"), {
        startDate,
        endDate,
        leaveType,
        reason,
        attachmentUrl,
        createdAt: new Date(),
        // Optionally, add user ID if authentication is implemented
        // userId: auth.currentUser?.uid,
      });

      // Success
      setSuccess("Leave application submitted successfully!");
      setFormData({
        startDate: "",
        endDate: "",
        leaveType: "",
        reason: "",
        attachment: null,
      });
      setAttachmentError("");
    } catch (err) {
      console.error("Error submitting leave application:", err);
      setError("Failed to submit leave application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen bg-gray-50 p-4 fixed inset-0 left-[300px] overflow-auto"
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6 mb-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl mb-4 shadow-lg">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
            Leave Application
          </h1>
          <p className="text-slate-600">Submit your leave request</p>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 flex items-center">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6">
            {/* Dates */}
            <div className="bg-slate-50/50 rounded-xl p-5 border border-slate-200/30">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Leave Dates
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Leave Type */}
            <div className="bg-slate-50/50 rounded-xl p-5 border border-slate-200/30">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                Leave Type
              </h3>
              <div className="relative">
                <select
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-white appearance-none cursor-pointer"
                >
                  <option value="">Select Leave Type</option>
                  {leaveTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Reason */}
            <div className="bg-slate-50/50 rounded-xl p-5 border border-slate-200/30">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Reason
              </h3>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                required
                rows="4"
                maxLength="500"
                placeholder="Please provide your reason for leave..."
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-white resize-none"
              />
              <div className="text-right text-xs text-slate-500 mt-1">
                {formData.reason.length}/500
              </div>
            </div>

            {/* Attachment */}
            <div className="bg-slate-50/50 rounded-xl p-5 border border-slate-200/30">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <Upload className="w-5 h-5 mr-2 text-blue-600" />
                Supporting Document{" "}
                <span className="text-sm font-normal text-slate-500 ml-1">
                  (optional)
                </span>
              </h3>
              {formData.attachment ? (
                <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {formData.attachment.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {(formData.attachment.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeAttachment}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div
                  className={`border-2 ${
                    dragActive
                      ? "border-blue-400 bg-blue-50"
                      : "border-slate-300 bg-white"
                  } border-dashed rounded-lg p-6 text-center cursor-pointer`}
                >
                  <label className="text-slate-500 text-sm">
                    Drag and drop your file here or{" "}
                    <span className="text-blue-600 underline">browse</span>
                    <input
                      type="file"
                      onChange={(e) =>
                        handleFileSelect(e.target.files[0])
                      }
                      className="hidden"
                    />
                  </label>
                </div>
              )}
              {attachmentError && (
                <p className="text-sm text-red-500 mt-2">{attachmentError}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl shadow-md transition-colors ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                }`}
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveApplication;