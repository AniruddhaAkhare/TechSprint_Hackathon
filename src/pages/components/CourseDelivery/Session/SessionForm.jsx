import React from "react";
import { FaTimes } from "react-icons/fa";

const SessionForm = ({
  sessionId,
  sessionName,
  setSessionName,
  sessionType,
  setSessionType,
  date,
  setDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  sessionMode,
  setSessionMode,
  meetingPlatform,
  setMeetingPlatform,
  sessionLink,
  setSessionLink,
  venue,
  setVenue,
  preFeedbackForm,
  setPreFeedbackForm,
  postFeedbackForm,
  setPostFeedbackForm,
  templates,
  handleSubmit,
  toggleSidebar,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-lg sm:text-xl font-bold text-gray-800">
          {sessionId ? "Edit Session" : "Create Session"}
        </h1>
        <button
          type="button"
          onClick={toggleSidebar}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-200"
        >
          <FaTimes className="w-5 h-5" />
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Session Name</label>
        <input
          type="text"
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
          required
          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Session Type</label>
        <div className="flex flex-col sm:flex-row gap-4 mt-1">
          <label className="flex items-center">
            <input
              type="radio"
              name="sessionType"
              value="batch"
              checked={sessionType === "batch"}
              onChange={() => setSessionType("batch")}
              className="mr-2 h-4 w-4 text-blue-600"
            />
            <span className="text-gray-700">By Batch</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="sessionType"
              value="subject"
              checked={sessionType === "subject"}
              onChange={() => setSessionType("subject")}
              className="mr-2 h-4 w-4 text-blue-600"
            />
            <span className="text-gray-700">By Student</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            min="2025-04-28"
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Pre Feedback Form</label>
        <select
          value={preFeedbackForm}
          onChange={(e) => setPreFeedbackForm(e.target.value)}
          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a Pre Feedback Form</option>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Post Feedback Form</label>
        <select
          value={postFeedbackForm}
          onChange={(e) => setPostFeedbackForm(e.target.value)}
          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a Post Feedback Form</option>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Session Mode</label>
        <div className="flex flex-col sm:flex-row gap-4 mt-1">
          <label className="flex items-center">
            <input
              type="radio"
              name="sessionMode"
              value="Online"
              checked={sessionMode === "Online"}
              onChange={() => setSessionMode("Online")}
              className="mr-2 h-4 w-4 text-blue-600"
            />
            <span className="text-gray-700">Online</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="sessionMode"
              value="Offline"
              checked={sessionMode === "Offline"}
              onChange={() => setSessionMode("Offline")}
              className="mr-2 h-4 w-4 text-blue-600"
            />
            <span className="text-gray-700">Offline</span>
          </label>
        </div>
      </div>

      {sessionMode === "Online" && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">Meeting Platform</label>
            <select
              value={meetingPlatform}
              onChange={(e) => setMeetingPlatform(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={sessionMode === "Online"}
            >
              <option value="">Select a platform</option>
              <option value="Zoom">Zoom</option>
              <option value="Google">Google Meet</option>
              <option value="Teams">Microsoft Teams</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Session Link</label>
            <input
              type="url"
              value={sessionLink}
              onChange={(e) => setSessionLink(e.target.value)}
              required={sessionMode === "Online"}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter session link"
            />
          </div>
        </>
      )}

      {sessionMode === "Offline" && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Venue</label>
          <input
            type="text"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            required={sessionMode === "Offline"}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter venue"
          />
        </div>
      )}

      <div className="flex justify-end mt-4">
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200 w-full sm:w-auto"
        >
          {sessionId ? "Update Session" : "Save Session"}
        </button>
      </div>
    </form>
  );
};

export default SessionForm;