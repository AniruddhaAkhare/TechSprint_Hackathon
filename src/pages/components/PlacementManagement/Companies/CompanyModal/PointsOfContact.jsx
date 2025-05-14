import React, { useState } from "react";

const PointsOfContact = ({
  pointsOfContact,
  newPOC,
  handlePOCChange,
  handleAddPOC,
  handleRemovePOC,
  isEditing,
  countryCodes,
  canUpdate,
  canCreate,
  company,
  onUpdatePOC, // New prop to handle POC updates
}) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editPOC, setEditPOC] = useState({});

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePOCMobile = (mobile) => {
    return /^\d{7,15}$/.test(mobile);
  };

  const handleEditPOC = (index) => {
    setEditingIndex(index);
    setEditPOC({ ...pointsOfContact[index] });
  };

  const handleEditChange = (field, value) => {
    if (field === "mobile") {
      value = value.replace(/\D/g, "").slice(0, 15);
    }
    setEditPOC((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async (index) => {
    if (!canUpdate && company) {
      alert("You don't have permission to update points of contact");
      return;
    }
    if (!canCreate && !company) {
      alert("You don't have permission to create points of contact");
      return;
    }

    // Validate edited POC
    if (
      !editPOC.name.trim() ||
      !validatePOCMobile(editPOC.mobile) ||
      !validateEmail(editPOC.email)
    ) {
      alert(
        "Please fill in all POC details correctly. Mobile number must be 7-15 digits, and email must be valid."
      );
      return;
    }

    try {
      const updatedPOCs = [...pointsOfContact];
      updatedPOCs[index] = editPOC;
      await onUpdatePOC(updatedPOCs); // Call parent function to update Firestore
      setEditingIndex(null);
      setEditPOC({});
    } catch (error) {
      alert(`Failed to update point of contact: ${error.message}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditPOC({});
  };

  return (
    <div className="overflow-x-auto">
      <h3 className="text-base sm:text-lg font-medium mb-2">Points of Contact</h3>
      {isEditing && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Add New Point of Contact</h4>
          <div className="flex flex-col sm:flex-row gap-4 mb-4 overflow-x-auto">
            <input
              type="text"
              value={newPOC.name}
              onChange={(e) => handlePOCChange("name", e.target.value)}
              placeholder="Contact Name (Required)"
              disabled={(!canUpdate && company) || (!canCreate && !company)}
              className="w-full min-w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 disabled:bg-gray-100"
            />
            <input
              type="email"
              value={newPOC.email}
              onChange={(e) => handlePOCChange("email", e.target.value)}
              placeholder="Email Address (Required)"
              disabled={(!canUpdate && company) || (!canCreate && !company)}
              className="w-full min-w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 disabled:bg-gray-100"
            />
            <select
              value={newPOC.countryCode}
              onChange={(e) => handlePOCChange("countryCode", e.target.value)}
              disabled={(!canUpdate && company) || (!canCreate && !company)}
              className="w-full min-w-40 sm:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 disabled:bg-gray-100"
            >
              {countryCodes.map((country) => (
                <option key={country.code + country.label} value={country.code}>
                  {country.label}
                </option>
              ))}
            </select>
            <input
              type="tel"
              value={newPOC.mobile}
              onChange={(e) => handlePOCChange("mobile", e.target.value)}
              placeholder="Mobile Number (Required)"
              disabled={(!canUpdate && company) || (!canCreate && !company)}
              className="w-full min-w-40 sm:w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 disabled:bg-gray-100"
            />
            <input
              type="url"
              value={newPOC.linkedinProfile || ""}
              onChange={(e) => handlePOCChange("linkedinProfile", e.target.value)}
              placeholder="LinkedIn Profile (Optional)"
              disabled={(!canUpdate && company) || (!canCreate && !company)}
              className="w-full min-w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 disabled:bg-gray-100"
            />
            <input
              type="text"
              value={newPOC.designation || ""}
              onChange={(e) => handlePOCChange("designation", e.target.value)}
              placeholder="Designation (Optional)"
              disabled={(!canUpdate && company) || (!canCreate && !company)}
              className="w-full min-w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 disabled:bg-gray-100"
            />
          </div>
          <button
            type="button"
            onClick={handleAddPOC}
            disabled={(!canUpdate && company) || (!canCreate && !company)}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200 w-full sm:w-auto disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Add POC
          </button>
        </div>
      )}
      <div>
        <h4 className="text-sm font-medium mb-2">Existing Points of Contact</h4>
        {pointsOfContact.length > 0 ? (
          <div className="mt-4 max-h-40 overflow-y-auto border border-gray-300 rounded-md">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-200 text-gray-700 sticky top-0">
                <tr>
                  <th className="p-3 text-sm font-semibold min-w-40">Sr No</th>
                  <th className="p-3 text-sm font-semibold min-w-40">Name</th>
                  <th className="p-3 text-sm font-semibold min-w-40">Designation</th>
                  <th className="p-3 text-sm font-semibold min-w-40">Email</th>
                  <th className="p-3 text-sm font-semibold min-w-40">Mobile</th>
                  <th className="p-3 text-sm font-semibold min-w-40">LinkedIn</th>
                  {isEditing && <th className="p-3 text-sm font-semibold min-w-40">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {pointsOfContact.map((poc, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-gray-600">{index + 1}</td>
                    {editingIndex === index ? (
                      <>
                        <td className="p-3">
                          <input
                            type="text"
                            value={editPOC.name || ""}
                            onChange={(e) => handleEditChange("name", e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md min-w-60"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="text"
                            value={editPOC.designation || ""}
                            onChange={(e) => handleEditChange("designation", e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md min-w-60"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="email"
                            value={editPOC.email || ""}
                            onChange={(e) => handleEditChange("email", e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md min-w-60"
                          />
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <select
                              value={editPOC.countryCode || ""}
                              onChange={(e) => handleEditChange("countryCode", e.target.value)}
                              className="w-1/3 px-2 py-1 border border-gray-300 rounded-md min-w-40"
                            >
                              {countryCodes.map((country) => (
                                <option key={country.code + country.label} value={country.code}>
                                  {country.label}
                                </option>
                              ))}
                            </select>
                            <input
                              type="tel"
                              value={editPOC.mobile || ""}
                              onChange={(e) => handleEditChange("mobile", e.target.value)}
                              className="w-2/3 px-2 py-1 border border-gray-300 rounded-md min-w-60"
                            />
                          </div>
                        </td>
                        <td className="p-3">
                          <input
                            type="url"
                            value={editPOC.linkedinProfile || ""}
                            onChange={(e) => handleEditChange("linkedinProfile", e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md min-w-60"
                          />
                        </td>
                        <td className="p-3 flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(index)}
                            className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={(!canUpdate && company) || (!canCreate && !company)}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="bg-gray-500 text-white px-2 py-1 rounded-md hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemovePOC(index)}
                            disabled={(!canUpdate && company) || (!canCreate && !company)}
                            className="text-red-500 hover:text-red-700 font-bold disabled:text-gray-400 disabled:cursor-not-allowed"
                          >
                            ✕
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="p-3 text-gray-600">{poc.name || "Not Provided"}</td>
                        <td className="p-3 text-gray-600">{poc.designation || "Not Provided"}</td>
                        <td className="p-3 text-gray-600">{poc.email || "Not Provided"}</td>
                        <td className="p-3 text-gray-600">
                          {poc.mobile ? `${poc.countryCode} ${poc.mobile}` : "Not Provided"}
                        </td>
                        <td className="p-3 text-gray-600">
                          {poc.linkedinProfile ? (
                            <a
                              href={poc.linkedinProfile}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              Profile
                            </a>
                          ) : (
                            "Not Provided"
                          )}
                        </td>
                        {isEditing && (
                          <td className="p-3 flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditPOC(index)}
                              disabled={(!canUpdate && company) || (!canCreate && !company)}
                              className="text-blue-500 hover:text-blue-700 font-bold disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                              ✎
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemovePOC(index)}
                              disabled={(!canUpdate && company) || (!canCreate && !company)}
                              className="text-red-500 hover:text-red-700 font-bold disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                              ✕
                            </button>
                          </td>
                        )}
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-gray-500">No points of contact available.</p>
        )}
      </div>
    </div>
  );
};

export default PointsOfContact;