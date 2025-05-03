import React from "react";

const BatchManagerSelection = ({
  availableBatchManager,
  selectedBatchManager,
  batchManager,
  handleAddBatchManager,
  handleRemoveBatchManager,
}) => {
  return (
    <div className="mt-4">
      <label className="block text-base font-medium text-gray-700 mb-1">
        Select Batch Manager
      </label>
      <select
        onChange={(e) => handleAddBatchManager(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base"
      >
        <option value="">Select a Batch Manager</option>
        {availableBatchManager.map((manager) => (
          <option key={manager.id} value={manager.id}>
            {manager.first_name || manager.f_name}
          </option>
        ))}
      </select>

      {selectedBatchManager.length > 0 && (
        <div className="mt-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sr No
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batch Manager
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {selectedBatchManager.map((managerId, index) => {
                const BM = batchManager.find((c) => c.id === managerId);
                return (
                  <tr key={managerId}>
                    <td className="px-4 py-2 whitespace-nowrap text-base text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-base text-gray-900">
                      {BM?.first_name || BM?.f_name}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleRemoveBatchManager(managerId)}
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

export default BatchManagerSelection;