import React from "react";

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
}) => {
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
              placeholder="Email Address (Optional if mobile provided)"
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
              placeholder="Mobile Number (Optional if email provided)"
              disabled={(!canUpdate && company) || (!canCreate && !company)}
              className="w-full min-w-40 sm:w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 disabled:bg-gray-100"
            />
            <input
              type="url"
              value={newPOC.linkedinProfile}
              onChange={(e) => handlePOCChange("linkedinProfile", e.target.value)}
              placeholder="LinkedIn Profile (Optional)"
              disabled={(!canUpdate && company) || (!canCreate && !company)}
              className="w-full min-w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 disabled:bg-gray-100"
            />
            <input
              type="text"
              value={newPOC.designation}
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
                  {isEditing && <th className="p-3 text-sm font-semibold min-w-40">Action</th>}
                </tr>
              </thead>
              <tbody>
                {pointsOfContact.map((poc, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-gray-600">{index + 1}</td>
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
                      <td className="p-3">
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