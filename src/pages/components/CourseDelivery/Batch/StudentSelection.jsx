import React from "react";

const StudentSelection = ({
  availableStudents,
  selectedStudents,
  students,
  handleAddStudent,
  handleRemoveStudent,
  handleSelectAllStudents,
}) => {
  return (
    <div className="mt-4">
      <label className="block text-base font-medium text-gray-700 mb-1">
        Select Students
      </label>
      <div className="flex items-center space-x-4">
        <select
          onChange={(e) => handleAddStudent(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base"
        >
          <option value="">Select Students</option>
          {availableStudents.map((student) => (
            <option key={student.id} value={student.id}>
              {student.first_name} {student.last_name} ({student.email})
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleSelectAllStudents}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200 text-base font-medium min-w-40"
          disabled={availableStudents.length === 0}
        >
          Select All
        </button>
      </div>

      {selectedStudents.length > 0 && (
        <div className="mt-4">
          <div className="bg-gray-100 p-3 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Selected Students ({selectedStudents.length})
            </h3>
            <div className="max-h-40 overflow-y-auto">
              {selectedStudents.map((studentId) => {
                const student = students.find((s) => s.id === studentId);
                return (
                  <div
                    key={studentId}
                    className="flex items-center justify-between bg-white p-2 mb-2 rounded-md shadow-sm"
                  >
                    <span className="text-sm text-gray-900">
                      {student?.Name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveStudent(studentId)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="mt-2">
        <label className="block text-base font-medium text-gray-700 mb-1">
          Total Students: {selectedStudents.length}
        </label>
      </div>
    </div>
  );
};

export default StudentSelection;