import { useState, useEffect } from "react";
import { db } from "../../config/firebase";  // Changed from "../../../../config/firebase"
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";  // Changed from "../../../../context/AuthContext"
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Calendar, Clock, Upload, FileText, Send, User } from "react-feather";
import { s3Client } from "../../config/aws-config";

const LeaveApplication = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    leaveType: "",
    reason: "",
    attachment: null
  });
  const [dragActive, setDragActive] = useState(false);
  const [attachmentError, setAttachmentError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const leaveTypes = ["Sick Leave", "Casual Leave", "Annual Leave", "Maternity Leave", "Paternity Leave"];

  useEffect(() => {
    // You can add any initialization or debugging here if needed
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        setAttachmentError("Invalid file format. Only PDF, JPG, and PNG are supported.");
        setFormData(prev => ({ ...prev, attachment: null }));
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setAttachmentError("File size exceeds 2MB.");
        setFormData(prev => ({ ...prev, attachment: null }));
        return;
      }
      setAttachmentError("");
      setFormData(prev => ({ ...prev, attachment: file }));
    }
  };

   const uploadToS3 = async (file) => {
    const bucket = import.meta.env.VITE_S3_BUCKET_NAME;
    if (!bucket) {
      throw new Error("S3 bucket name is not configured.");
    }
    try {
      const arrayBuffer = await file.arrayBuffer();
      const params = {
        Bucket: bucket,
        Key: `leave-attachments/${user.uid}/${Date.now()}_${file.name}`,
        Body: new Uint8Array(arrayBuffer),
        ContentType: file.type,
      };
  
      await s3Client.send(new PutObjectCommand(params));
      const url = `https://${params.Bucket}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${params.Key}`;
      return url;
    } catch (error) {
      // //console.error("Detailed S3 Upload Error:", {
      //   message: error.message,
      //   code: error.code,
      //   stack: error.stack,
      //   params,
      // });
      throw new Error(`Failed to upload attachment: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    const { startDate, endDate, leaveType, reason, attachment } = formData;

    if (!startDate || !endDate || !leaveType || !reason) {
      setError("All fields are required.");
      setIsSubmitting(false);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    if (start < today.setHours(0, 0, 0, 0)) {
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
      let attachmentUrl = "";
      if (attachment) {
        attachmentUrl = await uploadToS3(attachment);
      }

      await addDoc(collection(db, "Leaves"), {
        email: user.email,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        leaveType,
        reason,
        attachmentUrl,
        status: "Pending",
        createdAt: new Date().toISOString(),
        userId: user.uid,
      });

      setSuccess("Leave application submitted successfully!");
      setFormData({ 
        startDate: "", 
        endDate: "", 
        leaveType: "", 
        reason: "",
        attachment: null
      });
      setAttachmentError("");
    } catch (error) {
      setError(error.message || "Failed to submit leave application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto h-[50vh]">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4 shadow-lg">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Apply for Leave
        </h1>
        <p className="text-gray-600">Submit your leave request with ease</p>
      </div>

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 space-y-6"
      >
        {/* Error and Success Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            {success}
          </div>
        )}

        <div className="space-y-6">
          {/* Date Fields */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 bg-white/50 backdrop-blur-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 bg-white/50 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Leave Type */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <Clock className="w-4 h-4 mr-2 text-indigo-500" />
              Leave Type
            </label>
            <div className="relative">
              <select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none cursor-pointer"
              >
                <option value="">Select Leave Type</option>
                {leaveTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-indigo-500">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Reason Textarea */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <User className="w-4 h-4 mr-2 text-indigo-500" />
              Reason for Leave
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              required
              rows="4"
              maxLength="500"
              placeholder="Provide your reason for leave"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 bg-white/50 backdrop-blur-sm resize-none"
            />
          </div>

          {/* Attachment Upload */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <Upload className="w-4 h-4 mr-2 text-indigo-500" />
              Attach Supporting Document (optional)
            </label>

            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`relative flex items-center justify-center w-full h-24 rounded-xl border-2 border-dashed ${
                dragActive ? "border-indigo-500 bg-indigo-50/40" : "border-gray-300 bg-white/30"
              } cursor-pointer transition-colors duration-300`}
              onClick={() => document.getElementById("attachmentInput").click()}
            >
              {formData.attachment ? (
                <p className="text-indigo-700 font-semibold">
                  {formData.attachment.name} ({(formData.attachment.size / 1024).toFixed(2)} KB)
                </p>
              ) : (
                <p className="text-gray-600">Drag & drop file here, or click to select file (PDF, JPG, PNG, max 2MB)</p>
              )}
              <input
                type="file"
                id="attachmentInput"
                name="attachment"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files[0])}
              />
            </div>
            {attachmentError && <p className="text-red-600 text-xs">{attachmentError}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
            <span>{isSubmitting ? "Submitting..." : "Submit Application"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeaveApplication;
