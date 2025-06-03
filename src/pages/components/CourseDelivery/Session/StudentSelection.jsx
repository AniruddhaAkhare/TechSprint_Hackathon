import React from "react";

const StudentSelection = ({
  students,
  centerNames,
  selectedStudents,
  handleStudentChange,
  handleSelectAllStudents,
}) => {
  const filteredStudents = students.filter((student) =>
    centerNames.length === 0
      ? true
      : (student.preferred_centers || []).some((centerId) => centerNames.includes(centerId))
  );

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700">Select Students</label>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={handleSelectAllStudents}
          className={`w-full sm:w-auto px-4 py-2 rounded-md text-white font-medium transition duration-200 ${
            filteredStudents.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : selectedStudents.length === filteredStudents.length
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
          disabled={filteredStudents.length === 0}
        >
          {selectedStudents.length === filteredStudents.length && filteredStudents.length > 0
            ? "Deselect All Students"
            : "Select All Students"}
        </button>
        <div className="mt-1 max-h-40 overflow-y-auto border border-gray-300 p-2 rounded-md">
          {filteredStudents.length === 0 ? (
            <p className="text-gray-500">No students available for selected centers</p>
          ) : (
            filteredStudents.map((student) => (
              <label key={student.id} className="flex items-center space-x-2 py-1">
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student.id)}
                  onChange={() => handleStudentChange(student.id)}
                  className="form-checkbox h-4 w-4 text-blue-600 rounded"
                />
                <span className="text-gray-700">{`${student.first_name || student.firstName} ${
                  student.last_name || student.lastName
                }`}</span>
              </label>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentSelection;