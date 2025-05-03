import React, { useState } from "react";
import { db } from "../../../../config/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "../../../../context/AuthContext";

const LeaveApplication = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    leaveType: "",
    reason: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const leaveTypes = ["Sick Leave", "Casual Leave", "Annual Leave", "Maternity Leave", "Paternity Leave"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      await addDoc(collection(db, "Leaves"), {
        email: user.email,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        leaveType,
        reason,
        status: "Pending",
        createdAt: new Date().toISOString(),
        userId: user.uid,
      });
      setSuccess("Leave application submitted successfully!");
      setFormData({ startDate: "", endDate: "", leaveType: "", reason: "" });
      sendApplicationEmail(user.email, leaveType, start, end, reason);
    } catch (error) {
      console.error("Error submitting leave application:", error);
      setError("Failed to submit leave application.");
    }
  };

  const sendApplicationEmail = async (email, leaveType, startDate, endDate, reason) => {
    try {
      await fetch("https://api.zeptomail.com/v1.1/email", {
        method: "POST",
        headers: {
          Authorization: `Zoho-enczapikey ${import.meta.env.VITE_ZOHO_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromAddress: "noreply@shikshasaarathi.com",
          toAddress: email,
          subject: "Leave Application Submitted",
          htmlbody: `<p>You have submitted a leave application:</p>
                     <p><strong>Type:</strong> ${leaveType}</p>
                     <p><strong>From:</strong> ${startDate.toLocaleDateString()}</p>
                     <p><strong>To:</strong> ${endDate.toLocaleDateString()}</p>
                     <p><strong>Reason:</strong> ${reason}</p>
                     <p>Status: Pending</p>`,
        }),
      });
    } catch (error) {
      console.error("Error sending application email:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8 px-4">
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