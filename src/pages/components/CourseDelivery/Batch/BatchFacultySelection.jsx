import React from "react";

const BatchFacultySelection = ({
  availableBatchFaculty,
  selectedBatchFaculty,
  batchFaculty,
  handleAddBatchFaculty,
  handleRemoveBatchFaculty,
}) => {
  return (
    <div className="mt-4">
      <label className="block text-base font-medium text-gray-700 mb-1">
        Select Batch Faculty
      </label>
      <select
        onChange={(e) => handleAddBatchFaculty(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base"
      >
        <option value="">Select a Batch Faculty</option>
        {availableBatchFaculty.map((faculty) => (
          <option key={faculty.id} value={faculty.id}>
            {faculty.displayName}
          </option>
        ))}
      </select>

      {selectedBatchFaculty.length > 0 && (
        <div className="mt-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sr No
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batch Faculty Name
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {selectedBatchFaculty.map((facultyId, index) => {
                const BF = batchFaculty.find((c) => c.id === facultyId);
                return (
                  <tr key={facultyId}>
                    <td className="px-4 py-2 whitespace-nowrap text-base text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-base text-gray-900">
                      {BF?.displayName}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleRemoveBatchFaculty(facultyId)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BatchFacultySelection;