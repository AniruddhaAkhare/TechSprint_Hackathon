import React, { useState } from 'react';
import { setDoc, doc } from 'firebase/firestore';
import { db } from "../config/firebase.js";
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const SelectControl = ({ options, ...props }) => (
  <SelectContainer>
    <Select options={options} {...props} />
  </SelectContainer>
);

const CreateSession = () => {
  const [sessionName, setSessionName] = useState('');
  const [sessionDetails, setSessionDetails] = useState('');
  const [sessionType, setSessionType] = useState('batch');
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [instructor, setInstructor] = useState(null);
  const [mode, setMode] = useState('online');
  const [meetingPlatform, setMeetingPlatform] = useState('zoom');
  const [approvalRequired, setApprovalRequired] = useState(false);
  const [shareableLink, setShareableLink] = useState(false);
  const [allowGuests, setAllowGuests] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [generateLink, setGenerateLink] = useState(false);
  const [allowWithoutLogin, setAllowWithoutLogin] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sessionData = {
        name: sessionName,
        details: sessionDetails,
        scheduledBy: sessionType,
        instructor,
        mode,
        startTime,
        endTime,
        sessionType,
        meetingPlatform,
        approvalRequired,
        generateLink,
        allowWithoutLogin,
      };
      await setDoc(doc(db, "Sessions", sessionName), sessionData);
      console.log("Session created successfully", sessionData);
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <button
          type="button"
          className="text-blue-500 underline mb-4"
          onClick={() => history.goBack()}
        >
          Back
        </button>

        <h1 className="text-xl font-bold mb-6">Create Session</h1>

        <div className="mb-6">
          <label htmlFor="sessionName" className="block text-gray-700">Session name</label>
          <input
            type="text"
            id="sessionName"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            maxLength="100"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700">Session Timings</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
            className="mt-4 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="instructor" className="block text-gray-700">Instructor</label>
          <select
            id="instructor"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          >
            <option value="">Select an Instructor</option>
            <option value="instructor1">Instructor 1</option>
            <option value="instructor2">Instructor 2</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700">Session Type</label>
          <div className="flex items-center mt-2">
            <label className="mr-4">
              <input
                type="radio"
                name="sessionType"
                value="batch"
                checked={sessionType === "batch"}
                onChange={() => setSessionType("batch")}
                className="mr-1"
              />
              Schedule by Batch
            </label>
            <label>
              <input
                type="radio"
                name="sessionType"
                value="subject"
                checked={sessionType === "subject"}
                onChange={() => setSessionType("subject")}
                className="mr-1"
              />
              Schedule by Subject
            </label>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700">Mode of Conducting</label>
          <div className="flex items-center mt-2">
            <label className="mr-4">
              <input
                type="radio"
                name="mode"
                value="online"
                checked={mode === "online"}
                onChange={() => setMode("online")}
                className="mr-1"
              />
              Online Session
            </label>
            <label>
              <input
                type="radio"
                name="mode"
                value="offline"
                checked={mode === "offline"}
                onChange={() => setMode("offline")}
                className="mr-1"
              />
              Offline Session
            </label>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700">Meeting Platform</label>
          <select
            value={meetingPlatform}
            onChange={(e) => setMeetingPlatform(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          >
            <option value="Zoom">Zoom Meetings</option>
            <option value="Google">Google Meet</option>
            <option value="Teams">Microsoft Teams</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={approvalRequired}
              onChange={(e) => setApprovalRequired(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2">Approval required to join</span>
          </label>
        </div>

        <div className="mb-6">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={generateLink}
              onChange={(e) => setGenerateLink(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2">Generate shareable link</span>
          </label>
          {generateLink && (
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={allowWithoutLogin}
                  onChange={(e) => setAllowWithoutLogin(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2">Allow learners to join the session without logging in</span>
              </label>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 mt-4">
          <button
            type="submit"
            className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
          >
            Save Session
          </button>
          <button
            type="button"
            onClick={() => console.log("Session Saved & Published")}
            className="py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
          >
            Save and Publish
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSession; 