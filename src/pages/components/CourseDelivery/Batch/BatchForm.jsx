import React from "react";

const BatchForm = ({
  batchName,
  setBatchName,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  status,
  setStatus,
  preFeedbackForm,
  setPreFeedbackForm,
  postFeedbackForm,
  setPostFeedbackForm,
  availableTemplates,
  toggleSidebar,
  isEdit,
}) => {
  return (
<div className="space-y-6 max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
  <div className="flex justify-between items-center mb-4">
    <h1 className="text-2xl font-semibold text-gray-800">
      {isEdit ? "Edit Batch" : "Create Batch"}
    </h1>
    <button
      type="button"
      onClick={toggleSidebar}
      className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition duration-200 font-medium"
    >
      Back
    </button>
  </div>

  <div>
    <label htmlFor="batchName" className="block text-gray-700 font-medium mb-2">
      Batch Name <span className="text-red-500">*</span>
    </label>
    <input
      type="text"
      id="batchName"
      value={batchName}
      onChange={(e) => setBatchName(e.target.value)}
      required
      placeholder="Enter Batch Name"
      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-base"
    />
  </div>

  <div>
    <label htmlFor="startDate" className="block text-gray-700 font-medium mb-2">
      Start Date <span className="text-red-500">*</span>
    </label>
    <input
      type="date"
      id="startDate"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      required
      min="2025-04-30"
      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-base"
    />
  </div>

  <div>
    <label htmlFor="endDate" className="block text-gray-700 font-medium mb-2">
      End Date <span className="text-red-500">*</span>
    </label>
    <input
      type="date"
      id="endDate"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      required
      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-base"
    />
  </div>

  <div>
    <label htmlFor="status" className="block text-gray-700 font-medium mb-2">
      Status <span className="text-red-500">*</span>
    </label>
    <select
      id="status"
      value={status}
      onChange={(e) => setStatus(e.target.value)}
      required
      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-base"
    >
      <option value="Active">Active</option>
      <option value="Inactive">Inactive</option>
    </select>
  </div>

  <div>
    <label htmlFor="preFeedbackForm" className="block text-gray-700 font-medium mb-2">
      Pre Feedback Form
    </label>
    <select
      id="preFeedbackForm"
      value={preFeedbackForm}
      onChange={(e) => setPreFeedbackForm(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-base"
    >
      <option value="">Select a Pre Feedback Form</option>
      {availableTemplates.map((template) => (
        <option key={template.id} value={template.id}>
          {template.name}
        </option>
      ))}
    </select>
  </div>

  <div>
    <label htmlFor="postFeedbackForm" className="block text-gray-700 font-medium mb-2">
      Post Feedback Form
    </label>
    <select
      id="postFeedbackForm"
      value={postFeedbackForm}
      onChange={(e) => setPostFeedbackForm(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-base"
    >
      <option value="">Select a Post Feedback Form</option>
      {availableTemplates.map((template) => (
        <option key={template.id} value={template.id}>
          {template.name}
        </option>
      ))}
    </select>
  </div>
</div>

  );
};

export default BatchForm;