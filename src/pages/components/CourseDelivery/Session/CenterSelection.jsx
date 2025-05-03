import React from "react";

const CenterSelection = ({ availableCenters, centerNames, handleCenterChange, loading, error }) => {
  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700">Center Name(s)</label>
      {loading ? (
        <p className="text-gray-500">Loading centers...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : availableCenters.length === 0 ? (
        <p className="text-gray-500">No active centers found</p>
      ) : (
        <div className="mt-1 max-h-40 overflow-y-auto border border-gray-300 p-2 rounded-md">
          {availableCenters.map((center) => (
            <label key={center.id} className="flex items-center space-x-2 py-1">
              <input
                type="checkbox"
                checked={centerNames.includes(center.id)}
                onChange={() => handleCenterChange(center.id)}
                className="form-checkbox h-4 w-4 text-blue-600 rounded"
              />
              <span className="text-gray-700">{center.name || "Unnamed Center"}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default CenterSelection;