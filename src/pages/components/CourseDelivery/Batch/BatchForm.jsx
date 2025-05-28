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
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isEdit ? "Edit Batch" : "Create Batch"}
        </h1>
        <button
          type="button"
          onClick={toggleSidebar}
          className="bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 transition duration-200 text-base font-medium"
        >
          Back
        </button>
      </div>

      <div>
        <label htmlFor="batchName" className="block text-base font-medium text-gray-700 mb-1">
          Batch Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={batchName}
          onChange={(e) => setBatchName(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base"
          placeholder="Enter Batch Name"
        />
      </div>

      <div>
        <label htmlFor="startDate" className="block text-base font-medium text-gray-700 mb-1">
          Start Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          min="2025-04-30"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base"
        />
      </div>

      <div>
        <label htmlFor="endDate" className="block text-base font-medium text-gray-700 mb-1">
          End Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base"
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-base font-medium text-gray-700 mb-1">
          Status <span className="text-red-500">*</span>
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div>
        <label htmlFor="preFeedbackForm" className="block text-base font-medium text-gray-700 mb-1">
          Pre Feedback Form
        </label>
        <select
          value={preFeedbackForm}
          onChange={(e) => setPreFeedbackForm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base"
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
        <label htmlFor="postFeedbackForm" className="block text-base font-medium text-gray-700 mb-1">
          Post Feedback Form
        </label>
        <select
          value={postFeedbackForm}
          onChange={(e) => setPostFeedbackForm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base"
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