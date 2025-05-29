import React from "react";

const BasicInformation = ({ formData, setFormData, canUpdate, editMode, toggleEditMode, handleSubmit }) => {
  const handleChange = (e) => {
    if (!canUpdate) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
 <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-100 min-h-screen">
  <div className="edit-section bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h2 className="text-2xl font-semibold text-gray-900">Basic Information</h2>
      {canUpdate && (
       <div className="flex justify-end">
  <button
    onClick={toggleEditMode}
    className={`px-5 py-2.5 rounded-lg shadow-md font-medium transition duration-200 ${
      editMode
        ? "bg-gray-500 text-white hover:bg-gray-600"
        : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
    }`}
  >
    {editMode ? "Cancel" : "Edit"}
  </button>
</div>

      )}
    </div>
  </div>
  <p className="text-sm text-gray-600 mb-6">Enter your institute's basic details</p>
  <form onSubmit={(e) => handleSubmit(e, "Logo Upload")} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Institute Name <span className="text-red-500">*</span>
        </label>
        {editMode && canUpdate ? (
          <input
            type="text"
            name="instituteName"
            value={formData.instituteName}
            onChange={handleChange}
            placeholder="Enter institute name"
            required
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-200 text-gray-700"
          />
        ) : (
          <div className="text-sm text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
            {formData.instituteName || "Not set"}
          </div>
        )}
      </div>
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Institute Type <span className="text-red-500">*</span>
        </label>
        {editMode && canUpdate ? (
          <input
            type="text"
            name="instituteType"
            value={formData.instituteType}
            onChange={handleChange}
            placeholder="School, College, University, etc."
            required
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-200 text-gray-700"
          />
        ) : (
          <div className="text-sm text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
            {formData.instituteType || "Not set"}
          </div>
        )}
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address <span className="text-red-500">*</span>
        </label>
        {editMode && canUpdate ? (
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter address"
            required
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-200 text-gray-700"
          />
        ) : (
          <div className="text-sm text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
            {formData.address || "Not set"}
          </div>
        )}
      </div>
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          City <span className="text-red-500">*</span>
        </label>
        {editMode && canUpdate ? (
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter city"
            required
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-200 text-gray-700"
          />
        ) : (
          <div className="text-sm text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
            {formData.city || "Not set"}
          </div>
        )}
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          State <span className="text-red-500">*</span>
        </label>
        {editMode && canUpdate ? (
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="Enter state"
            required
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-200 text-gray-700"
          />
        ) : (
          <div className="text-sm text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
            {formData.state || "Not set"}
          </div>
        )}
      </div>
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pincode <span className="text-red-500">*</span>
        </label>
        {editMode && canUpdate ? (
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            placeholder="Enter pincode"
            required
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-200 text-gray-700"
          />
        ) : (
          <div className="text-sm text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
            {formData.pincode || "Not set"}
          </div>
        )}
      </div>
    </div>
    {editMode && canUpdate && (
      <button
        type="submit"
        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 transition duration-200 font-medium"
      >
        Save and Next →
      </button>
    )}
  </form>
</div>
</>
  );
};

export default BasicInformation;