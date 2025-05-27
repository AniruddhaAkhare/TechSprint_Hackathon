import { db } from "../../../../config/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "../../../../context/AuthContext";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { useState } from "react";
import { useEffect } from "react";
import { s3Client } from "../../../../config/aws-config";
import { debugS3Config } from "../../../../config/aws-config";

const LeaveApplication = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    leaveType: "",
    reason: "",
  });
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [attachmentError, setAttachmentError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const leaveTypes = ["Sick Leave", "Casual Leave", "Annual Leave", "Maternity Leave", "Paternity Leave"];

  useEffect(() => {
    debugS3Config();

  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAttachmentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
     
      const validFormats = ["application/pdf", "image/jpeg", "image/png"];
      if (!validFormats.includes(file.type)) {
        setAttachmentError("Invalid file format. Only PDF, JPG, and PNG are supported.");
        setAttachmentFile(null);
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setAttachmentError("File size exceeds 2MB.");
        setAttachmentFile(null);
        return;
      }
      setAttachmentError("");
      setAttachmentFile(file);
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

    const { startDate, endDate, leaveType, reason } = formData;

    if (!startDate || !endDate || !leaveType || !reason) {
      setError("All fields are required.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    if (start < today.setHours(0, 0, 0, 0)) {
      setError("Start date cannot be in the past.");
      return;
    }

    if (end < start) {
      setError("End date cannot be before start date.");
      return;
    }

    try {
      let attachmentUrl = "";
      if (attachmentFile) {
        attachmentUrl = await uploadToS3(attachmentFile);
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
      setFormData({ startDate: "", endDate: "", leaveType: "", reason: "" });
      setAttachmentFile(null);
      setAttachmentError("");
      // sendApplicationEmail(user.email, leaveType, start, end, reason, attachmentUrl);
    } catch (error) {
      // //console.error("Error submitting leave application:", error);
      setError(error.message || "Failed to submit leave application.");
    }
  };

  // const sendApplicationEmail = async (email, leaveType, startDate, endDate, reason, attachmentUrl) => {
  //   try {
  //     await fetch("https://api.zeptomail.com/v1.1/email", {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Zoho-enczapikey ${import.meta.env.VITE_ZOHO_API_KEY}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         fromAddress: "noreply@shikshasaarathi.com",
  //         toAddress: email,
  //         subject: "Leave Application Submitted",
  //         htmlbody: `<p>You have submitted a leave application:</p>
  //                    <p><strong>Type:</strong> ${leaveType}</p>
  //                    <p><strong>From:</strong> ${startDate.toLocaleDateString()}</p>
  //                    <p><strong>To:</strong> ${endDate.toLocaleDateString()}</p>
  //                    <p><strong>Reason:</strong> ${reason}</p>
  //                    ${attachmentUrl ? `<p><strong>Attachment:</strong> <a href="${attachmentUrl}">View Attachment</a></p>` : ""}
  //                    <p>Status: Pending</p>`,
  //       }),
  //     });
  //   } catch (error) {
  //     //console.error("Error sending application email:", error);
  //   }
  // };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8 px-4 p-4 fixed inset-0 left-[300px]">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Apply for Leave
        </h3>
        {error && (
          <div className="flex items-center bg-red-100 text-red-700 p-3 rounded mb-4">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm">{error}</p>
          </div>
        )}
        {success && (
          <div className="flex items-center bg-green-100 text-green-700 p-3 rounded mb-4">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="text-sm">{success}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Leave Type
            </label>
            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            >
              <option value="">Select Leave Type</option>
              {leaveTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              rows="4"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attachment (Optional)
            </label>
            <input
              type="file"
              accept="application/pdf,image/jpeg,image/png"
              onChange={handleAttachmentChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            {attachmentFile && <p className="text-sm mt-1">Selected file: {attachmentFile.name}</p>}
            {attachmentError && <p className="text-red-700 text-sm mt-1">{attachmentError}</p>}
            <p className="text-sm text-gray-500 mt-1">
              Supported formats: PDF, JPG, PNG. Max size: 2MB.
            </p>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default LeaveApplication;