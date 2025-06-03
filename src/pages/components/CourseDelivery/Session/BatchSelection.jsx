import React from "react";

const BatchSelection = ({
  batches,
  centerNames,
  selectedBatches,
  handleBatchChange,
  handleSelectAllBatches,
}) => {
  const filteredBatches = batches.filter((batch) =>
    centerNames.length === 0
      ? true
      : (batch.centers || []).some((centerId) => centerNames.includes(centerId))
  );

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700">Select Batches</label>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={handleSelectAllBatches}
          className={`w-full sm:w-auto px-4 py-2 rounded-md text-white font-medium transition duration-200 ${
            filteredBatches.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : selectedBatches.length === filteredBatches.length
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
          disabled={filteredBatches.length === 0}
        >
          {selectedBatches.length === filteredBatches.length && filteredBatches.length > 0
            ? "Deselect All Batches"
            : "Select All Batches"}
        </button>
        <div className="mt-1 max-h-40 overflow-y-auto border border-gray-300 p-2 rounded-md">
          {filteredBatches.length === 0 ? (
            <p className="text-gray-500">No batches available for selected centers</p>
          ) : (
            filteredBatches.map((batch) => (
              <label key={batch.id} className="flex items-center space-x-2 py-1">
                <input
                  type="checkbox"
                  checked={selectedBatches.includes(batch.id)}
                  onChange={() => handleBatchChange(batch.id)}
                  className="form-checkbox h-4 w-4 text-blue-600 rounded"
                />
                <span className="text-gray-700">{batch.batchName || "Unnamed Batch"}</span>
              </label>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BatchSelection;