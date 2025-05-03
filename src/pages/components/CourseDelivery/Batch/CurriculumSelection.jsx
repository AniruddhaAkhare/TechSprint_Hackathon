import React from "react";

const CurriculumSelection = ({
  availableCurriculum,
  selectedCurriculum,
  curriculum,
  handleAddCurriculum,
  handleRemoveCurriculum,
}) => {
  return (
    <div className="mt-4">
      <label className="block text-base font-medium text-gray-700 mb-1">
        Select Curriculum
      </label>
      <select
        onChange={(e) => handleAddCurriculum(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base"
      >
        <option value="">Select a Curriculum</option>
        {availableCurriculum.map((curriculumItem) => (
          <option key={curriculumItem.id} value={curriculumItem.id}>
            {curriculumItem.name}
          </option>
        ))}
      </select>

      {selectedCurriculum.length > 0 && (
        <div className="mt-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sr No
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Curriculum Name
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {selectedCurriculum.map((curriculumId, index) => {
                const curr = curriculum.find((c) => c.id === curriculumId);
                return (
                  <tr key={curriculumId}>
                    <td className="px-4 py-2 whitespace-nowrap text-base text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-base text-gray-900">
                      {curr?.name}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleRemoveCurriculum(curriculumId)}
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

export default CurriculumSelection;