// import React from "react";
// import {
//   Select,
//   MenuItem,
//   Button,
//   Typography,
//   TextField,
// } from "@mui/material";
// import FullFeesForm from "./FullFeesForm";
// import InstallmentsForm from "./InstallmentsForm";
// import FinanceForm from "./FinanceForm";

// const CourseEntryForm = ({
//   courseIndex,
//   entry,
//   courses,
//   financePartners,
//   handleChange,
//   handleFullFeesChange,
//   handleRegistrationChange,
//   handleInstallmentChange,
//   handleFinanceChange,
//   handleFileChange,
//   addInstallment,
//   removeInstallment,
//   removeCourseEntry,
//   canUpdate,
//   canDelete,
//   user,
//   studentId,
//   getFilteredCourses,
// }) => {
//   return (
//     <div className="mb-8 bg-white rounded-lg shadow-md p-6">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//         <Select
//           value={entry.mode || ""}
//           onChange={(e) => handleChange(courseIndex, "mode", e.target.value)}
//           displayEmpty
//           className="w-full bg-gray-100 rounded-lg"
//           renderValue={(selected) =>
//             selected || <span className="text-gray-400">Select Mode</span>
//           }
//           disabled={!canUpdate}
//         >
//           <MenuItem value="Online">Online</MenuItem>
//           <MenuItem value="Offline">Offline</MenuItem>
//           <MenuItem value="Hybrid">Hybrid</MenuItem>
//         </Select>
//         <Select
//           value={entry.selectedCourse || ""}
//           onChange={(e) => handleChange(courseIndex, "selectedCourse", e.target.value)}
//           displayEmpty
//           className="w-full bg-gray-100 rounded-lg"
//           renderValue={(selected) =>
//             selected ? selected.name : <span className="text-gray-400">Select Course</span>
//           }
//           disabled={!entry.mode || !canUpdate}
//         >
//           {getFilteredCourses(entry.mode).map((course) => (
//             <MenuItem key={course.id} value={course}>
//               {course.name}
//             </MenuItem>
//           ))}
//         </Select>
//         <Select
//           value={entry.feeTemplate || ""}
//           onChange={(e) => handleChange(courseIndex, "feeTemplate", e.target.value)}
//           displayEmpty
//           className="w-full bg-gray-100 rounded-lg"
//           renderValue={(selected) =>
//             selected || <span className="text-gray-400">Select Fee Template</span>
//           }
//           disabled={!canUpdate}
//         >
//           <MenuItem value="Installments">Installments</MenuItem>
//           <MenuItem value="Finance">Finance</MenuItem>
//           <MenuItem value="FullFees">Full Fees</MenuItem>
//           <MenuItem value="Free">Free</MenuItem>
//         </Select>
//       </div>

//       {entry.feeTemplate === "FullFees" && (
//         <FullFeesForm
//           courseIndex={courseIndex}
//           fullFeesDetails={entry.fullFeesDetails}
//           handleFullFeesChange={handleFullFeesChange}
//           canUpdate={canUpdate}
//           user={user}
//           studentId={studentId}
//         />
//       )}

//       {entry.feeTemplate === "Installments" && (
//         <InstallmentsForm
//           courseIndex={courseIndex}
//           fullFeesDetails={entry.fullFeesDetails}
//           registration={entry.registration}
//           installmentDetails={entry.installmentDetails}
//           handleFullFeesChange={handleFullFeesChange}
//           handleRegistrationChange={handleRegistrationChange}
//           handleInstallmentChange={handleInstallmentChange}
//           addInstallment={addInstallment}
//           removeInstallment={removeInstallment}
//           canUpdate={canUpdate}
//           user={user}
//           studentId={studentId}
//         />
//       )}

//       {entry.feeTemplate === "Free" && (
//         <div className="space-y-4">
//           <Typography className="text-gray-600 mt-4">
//             This is a free course
//           </Typography>
//           <TextField
//             label="Reason for Free Course"
//             value={entry.freeReason || ""}
//             onChange={(e) => handleChange(courseIndex, "freeReason", e.target.value)}
//             variant="outlined"
//             size="small"
//             fullWidth
//             disabled={!canUpdate}
//           />
//         </div>
//       )}

//       {entry.feeTemplate === "Finance" && (
//         <FinanceForm
//           courseIndex={courseIndex}
//           fullFeesDetails={entry.fullFeesDetails}
//           financeDetails={entry.financeDetails}
//           handleFinanceChange={handleFinanceChange}
//           handleFileChange={handleFileChange}
//           financePartners={financePartners}
//           canUpdate={canUpdate}
//           user={user}
//           studentId={studentId}
//         />
//       )}

//       {canDelete && (
//         <Button
//           variant="text"
//           color="error"
//           onClick={() => removeCourseEntry(courseIndex)}
//           className="mt-4 text-red-500 hover:text-red-700"
//           disabled={!canDelete}
//         >
//           Remove Course
//         </Button>
//       )}
//     </div>
//   );
// };

// export default CourseEntryForm;


import React, { useEffect } from "react";
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
  uploadProgress,
}) => {
  // Debugging logs
  useEffect(() => {
    console.log("CourseEntryForm props:", {
      courseIndex,
      entry,
      coursesLength: courses?.length,
      entryMode: entry?.mode,
      entrySelectedCourse: entry?.selectedCourse,
      entryFeeTemplate: entry?.feeTemplate,
    });
    console.log("Filtered courses:", getFilteredCourses(entry?.mode || ""));
  }, [entry, courses, getFilteredCourses]);

  // Ensure entry is initialized
  const safeEntry = {
    mode: "",
    selectedCourse: null,
    feeTemplate: "",
    fullFeesDetails: {},
    registration: {},
    installmentDetails: [],
    financeDetails: {},
    freeReason: "",
    ...entry,
  };

  // Handle course selection to ensure object is passed
  const handleCourseChange = (e) => {
    const selectedCourse = courses.find((course) => course.id === e.target.value.id) || null;
    console.log("Selected course:", selectedCourse);
    handleChange(courseIndex, "selectedCourse", selectedCourse);
  };

  return (
    <div className="mb-8 bg-white rounded-lg shadow-md p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Select
          value={safeEntry.mode || ""}
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
          value={safeEntry.selectedCourse || ""}
          onChange={handleCourseChange}
          displayEmpty
          className="w-full bg-gray-100 rounded-lg"
          renderValue={(selected) =>
            selected?.name ? selected.name : <span className="text-gray-400">Select Course</span>
          }
          disabled={!safeEntry.mode || !canUpdate}
        >
          {getFilteredCourses(safeEntry.mode || "").length > 0 ? (
            getFilteredCourses(safeEntry.mode || "").map((course) => (
              <MenuItem key={course.id} value={course}>
                {course.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No courses available</MenuItem>
          )}
        </Select>
        <Select
          value={safeEntry.feeTemplate || ""}
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

      {safeEntry.feeTemplate === "FullFees" && (
        <FullFeesForm
          courseIndex={courseIndex}
          fullFeesDetails={safeEntry.fullFeesDetails}
          handleFullFeesChange={handleFullFeesChange}
          canUpdate={canUpdate}
          user={user}
          studentId={studentId}
        />
      )}

      {safeEntry.feeTemplate === "Installments" && (
        <InstallmentsForm
          courseIndex={courseIndex}
          fullFeesDetails={safeEntry.fullFeesDetails}
          registration={safeEntry.registration}
          installmentDetails={safeEntry.installmentDetails}
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

      {safeEntry.feeTemplate === "Free" && (
        <div className="space-y-4">
          <Typography className="text-gray-600 mt-4">
            This is a free course
          </Typography>
          <TextField
            label="Reason for Free Course"
            value={safeEntry.freeReason || ""}
            onChange={(e) => handleChange(courseIndex, "freeReason", e.target.value)}
            variant="outlined"
            size="small"
            fullWidth
            disabled={!canUpdate}
          />
        </div>
      )}

      {safeEntry.feeTemplate === "Finance" && (
        <FinanceForm
          courseIndex={courseIndex}
          fullFeesDetails={safeEntry.fullFeesDetails}
          financeDetails={safeEntry.financeDetails}
          handleFinanceChange={handleFinanceChange}
          handleFileChange={handleFileChange}
          financePartners={financePartners}
          canUpdate={canUpdate}
          user={user}
          studentId={studentId}
          uploadProgress={uploadProgress}
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