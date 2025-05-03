import React from "react";
import {
  Select,
  MenuItem,
  Button,
  Typography,
  TextField,
} from "@mui/material";
import FullFeesForm from "./FullFeesForm";
import InstallmentsForm from "./InstallmentsForm";
import FinanceForm from "./FinanceForm";

const CourseEntryForm = ({
  courseIndex,
  entry,
  courses,
  financePartners,
  handleChange,
  handleFullFeesChange,
  handleRegistrationChange,
  handleInstallmentChange,
  handleFinanceChange,
  handleFileChange,
  addInstallment,
  removeInstallment,
  removeCourseEntry,
  canUpdate,
  canDelete,
  user,
  studentId,
  getFilteredCourses,
}) => {
  return (
    <div className="mb-8 bg-white rounded-lg shadow-md p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Select
          value={entry.mode || ""}
          onChange={(e) => handleChange(courseIndex, "mode", e.target.value)}
          displayEmpty
          className="w-full bg-gray-100 rounded-lg"
          renderValue={(selected) =>
            selected || <span className="text-gray-400">Select Mode</span>
          }
          disabled={!canUpdate}
        >
          <MenuItem value="Online">Online</MenuItem>
          <MenuItem value="Offline">Offline</MenuItem>
          <MenuItem value="Hybrid">Hybrid</MenuItem>
        </Select>
        <Select
          value={entry.selectedCourse || ""}
          onChange={(e) => handleChange(courseIndex, "selectedCourse", e.target.value)}
          displayEmpty
          className="w-full bg-gray-100 rounded-lg"
          renderValue={(selected) =>
            selected ? selected.name : <span className="text-gray-400">Select Course</span>
          }
          disabled={!entry.mode || !canUpdate}
        >
          {getFilteredCourses(entry.mode).map((course) => (
            <MenuItem key={course.id} value={course}>
              {course.name}
            </MenuItem>
          ))}
        </Select>
        <Select
          value={entry.feeTemplate || ""}
          onChange={(e) => handleChange(courseIndex, "feeTemplate", e.target.value)}
          displayEmpty
          className="w-full bg-gray-100 rounded-lg"
          renderValue={(selected) =>
            selected || <span className="text-gray-400">Select Fee Template</span>
          }
          disabled={!canUpdate}
        >
          <MenuItem value="Installments">Installments</MenuItem>
          <MenuItem value="Finance">Finance</MenuItem>
          <MenuItem value="FullFees">Full Fees</MenuItem>
          <MenuItem value="Free">Free</MenuItem>
        </Select>
      </div>

      {entry.feeTemplate === "FullFees" && (
        <FullFeesForm
          courseIndex={courseIndex}
          fullFeesDetails={entry.fullFeesDetails}
          handleFullFeesChange={handleFullFeesChange}
          canUpdate={canUpdate}
          user={user}
          studentId={studentId}
        />
      )}

      {entry.feeTemplate === "Installments" && (
        <InstallmentsForm
          courseIndex={courseIndex}
          fullFeesDetails={entry.fullFeesDetails}
          registration={entry.registration}
          installmentDetails={entry.installmentDetails}
          handleFullFeesChange={handleFullFeesChange}
          handleRegistrationChange={handleRegistrationChange}
          handleInstallmentChange={handleInstallmentChange}
          addInstallment={addInstallment}
          removeInstallment={removeInstallment}
          canUpdate={canUpdate}
          user={user}
          studentId={studentId}
        />
      )}

      {entry.feeTemplate === "Free" && (
        <div className="space-y-4">
          <Typography className="text-gray-600 mt-4">
            This is a free course
          </Typography>
          <TextField
            label="Reason for Free Course"
            value={entry.freeReason || ""}
            onChange={(e) => handleChange(courseIndex, "freeReason", e.target.value)}
            variant="outlined"
            size="small"
            fullWidth
            disabled={!canUpdate}
          />
        </div>
      )}

      {entry.feeTemplate === "Finance" && (
        <FinanceForm
          courseIndex={courseIndex}
          fullFeesDetails={entry.fullFeesDetails}
          financeDetails={entry.financeDetails}
          handleFinanceChange={handleFinanceChange}
          handleFileChange={handleFileChange}
          financePartners={financePartners}
          canUpdate={canUpdate}
          user={user}
          studentId={studentId}
        />
      )}

      {canDelete && (
        <Button
          variant="text"
          color="error"
          onClick={() => removeCourseEntry(courseIndex)}
          className="mt-4 text-red-500 hover:text-red-700"
          disabled={!canDelete}
        >
          Remove Course
        </Button>
      )}
    </div>
  );
};

export default CourseEntryForm;