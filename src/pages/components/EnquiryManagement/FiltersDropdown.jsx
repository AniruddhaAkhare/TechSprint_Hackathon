// // // import React, { useState, useRef, useEffect } from "react";
// // // import { FaFilter } from "react-icons/fa";

// // // const FiltersDropdown = ({ filters, setFilters, availableTags, branches, courses, initialColumns }) => {
// // //   const [isFiltersOpen, setIsFiltersOpen] = useState(false);
// // //   const filtersRef = useRef(null);

// // //   useEffect(() => {
// // //     const handleClickOutside = (event) => {
// // //       if (filtersRef.current && !filtersRef.current.contains(event.target)) {
// // //         setIsFiltersOpen(false);
// // //       }
// // //     };
// // //     document.addEventListener("mousedown", handleClickOutside);
// // //     return () => document.removeEventListener("mousedown", handleClickOutside);
// // //   }, []);

// // //   const handleFilterChange = (key, value) => {
// // //     setFilters((prev) => ({ ...prev, [key]: value }));
// // //   };

// // //   return (
// // //     <div className="relative" ref={filtersRef}>
// // //       <button
// // //         onClick={() => setIsFiltersOpen(!isFiltersOpen)}
// // //         className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 w-full sm:w-auto hover:bg-gray-100"
// // //       >
// // //         <FaFilter />
// // //         Filters
// // //       </button>
// // //       {isFiltersOpen && (
// // //         <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-10 p-4">
// // //           <h3 className="text-sm font-medium text-gray-700 mb-2">Apply Filters</h3>
// // //           <div className="mb-4">
// // //             <label className="block text-sm font-medium text-gray-700">Tags</label>
// // //             <select
// // //               multiple
// // //               value={filters.tags}
// // //               onChange={(e) => handleFilterChange("tags", Array.from(e.target.selectedOptions, (option) => option.value))}
// // //               className="mt-1 p-2 w-full border border-gray-300 rounded-md"
// // //             >
// // //               {availableTags.map((tag) => (
// // //                 <option key={tag} value={tag}>{tag}</option>
// // //               ))}
// // //             </select>
// // //           </div>
// // //           <div className="mb-4">
// // //             <label className="block text-sm font-medium text-gray-700">Stage</label>
// // //             <select
// // //               value={filters.stage}
// // //               onChange={(e) => handleFilterChange("stage", e.target.value)}
// // //               className="mt-1 p-2 w-full border border-gray-300 rounded-md"
// // //             >
// // //               <option value="">All Stages</option>
// // //               {Object.entries(initialColumns).map(([stageId, { name }]) => (
// // //                 <option key={stageId} value={stageId}>{name}</option>
// // //               ))}
// // //             </select>
// // //           </div>
// // //           <div className="mb-4">
// // //             <label className="block text-sm font-medium text-gray-700">Branch</label>
// // //             <select
// // //               value={filters.branch}
// // //               onChange={(e) => handleFilterChange("branch", e.target.value)}
// // //               className="mt-1 p-2 w-full border border-gray-300 rounded-md"
// // //             >
// // //               <option value="">All Branches</option>
// // //               {branches.map((branch) => (
// // //                 <option key={branch.id} value={branch.name}>{branch.name}</option>
// // //               ))}
// // //             </select>
// // //           </div>
// // //           <div className="mb-4">
// // //             <label className="block text-sm font-medium text-gray-700">Course</label>
// // //             <select
// // //               value={filters.course}
// // //               onChange={(e) => handleFilterChange("course", e.target.value)}
// // //               className="mt-1 p-2 w-full border border-gray-300 rounded-md"
// // //             >
// // //               <option value="">All Courses</option>
// // //               {courses.map((course) => (
// // //                 <option key={course.id} value={course.name}>{course.name}</option>
// // //               ))}
// // //             </select>
// // //           </div>
// // //           <div className="flex justify-end gap-2">
// // //             <button
// // //               onClick={() => setFilters({ tags: [], stage: "", branch: "", course: "" })}
// // //               className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
// // //             >
// // //               Clear
// // //             </button>
// // //             <button
// // //               onClick={() => setIsFiltersOpen(false)}
// // //               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
// // //             >
// // //               Apply
// // //             </button>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default FiltersDropdown;


// // import React, { useState, useRef, useEffect } from "react";
// // import { FaFilter } from "react-icons/fa";

// // const FiltersDropdown = ({ filters, setFilters, availableTags, branches, courses, instructors, initialColumns }) => {
// //   const [isFiltersOpen, setIsFiltersOpen] = useState(false);
// //   const filtersRef = useRef(null);

// //   useEffect(() => {
// //     const handleClickOutside = (event) => {
// //       if (filtersRef.current && !filtersRef.current.contains(event.target)) {
// //         setIsFiltersOpen(false);
// //       }
// //     };
// //     document.addEventListener("mousedown", handleClickOutside);
// //     return () => document.removeEventListener("mousedown", handleClickOutside);
// //   }, []);

// //   const handleFilterChange = (key, value) => {
// //     setFilters((prev) => ({ ...prev, [key]: value }));
// //   };

// //   return (
// //     <div className="relative" ref={filtersRef}>
// //       <button
// //         onClick={() => setIsFiltersOpen(!isFiltersOpen)}
// //         className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 w-full sm:w-auto hover:bg-gray-100"
// //       >
// //         <FaFilter />
// //         Filters
// //       </button>
// //       {isFiltersOpen && (
// //         <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-10 p-4">
// //           <h3 className="text-sm font-medium text-gray-700 mb-2">Apply Filters</h3>
// //           <div className="mb-4">
// //             <label className="block text-sm font-medium text-gray-700">Tags</label>
// //             <select
// //               multiple
// //               value={filters.tags}
// //               onChange={(e) => handleFilterChange("tags", Array.from(e.target.selectedOptions, (option) => option.value))}
// //               className="mt-1 p-2 w-full border border-gray-300 rounded-md"
// //             >
// //               {availableTags.map((tag) => (
// //                 <option key={tag} value={tag}>{tag}</option>
// //               ))}
// //             </select>
// //           </div>
// //           <div className="mb-4">
// //             <label className="block text-sm font-medium text-gray-700">Stage</label>
// //             <select
// //               value={filters.stage}
// //               onChange={(e) => handleFilterChange("stage", e.target.value)}
// //               className="mt-1 p-2 w-full border border-gray-300 rounded-md"
// //             >
// //               <option value="">All Stages</option>
// //               {Object.entries(initialColumns).map(([stageId, { name }]) => (
// //                 <option key={stageId} value={stageId}>{name}</option>
// //               ))}
// //             </select>
// //           </div>
// //           <div className="mb-4">
// //             <label className="block text-sm font-medium text-gray-700">Branch</label>
// //             <select
// //               value={filters.branch}
// //               onChange={(e) => handleFilterChange("branch", e.target.value)}
// //               className="mt-1 p-2 w-full border border-gray-300 rounded-md"
// //             >
// //               <option value="">All Branches</option>
// //               {branches.map((branch) => (
// //                 <option key={branch.id} value={branch.name}>{branch.name}</option>
// //               ))}
// //             </select>
// //           </div>
// //           <div className="mb-4">
// //             <label className="block text-sm font-medium text-gray-700">Course</label>
// //             <select
// //               value={filters.course}
// //               onChange={(e) => handleFilterChange("course", e.target.value)}
// //               className="mt-1 p-2 w-full border border-gray-300 rounded-md"
// //             >
// //               <option value="">All Courses</option>
// //               {courses.map((course) => (
// //                 <option key={course.id} value={course.name}>{course.name}</option>
// //               ))}
// //             </select>
// //           </div>
// //           <div className="mb-4">
// //             <label className="block text-sm font-medium text-gray-700">Instructor</label>
// //             <select
// //               value={filters.instructor}
// //               onChange={(e) => handleFilterChange("instructor", e.target.value)}
// //               className="mt-1 p-2 w-full border border-gray-300 rounded-md"
// //             >
// //               <option value="">All Instructors</option>
// //               {instructors.map((instructor) => (
// //                 <option key={instructor.id} value={instructor.f_name}>{instructor.f_name} {instructor.l_name}</option>
// //               ))}
// //             </select>
// //           </div>
// //           <div className="flex justify-end gap-2">
// //             <button
// //               onClick={() => setFilters({ tags: [], stage: "", branch: "", course: "", instructor: "" })}
// //               className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
// //             >
// //               Clear
// //             </button>
// //             <button
// //               onClick={() => setIsFiltersOpen(false)}
// //               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
// //             >
// //               Apply
// //             </button>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default FiltersDropdown;

// import React, { useState, useRef, useEffect } from "react";
// import { FaFilter } from "react-icons/fa";

// const FiltersDropdown = ({ filters, setFilters, availableTags, branches, courses, instructors, initialColumns }) => {
//   const [isFiltersOpen, setIsFiltersOpen] = useState(false);
//   const filtersRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (filtersRef.current && !filtersRef.current.contains(event.target)) {
//         setIsFiltersOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleFilterChange = (key, value) => {
//     setFilters((prev) => ({ ...prev, [key]: value }));
//   };

//   return (
//     <div className="relative" ref={filtersRef}>
//       <button
//         onClick={() => setIsFiltersOpen(!isFiltersOpen)}
//         className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 w-full sm:w-auto hover:bg-gray-100"
//       >
//         <FaFilter />
//         Filters
//       </button>
//       {isFiltersOpen && (
//         <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-10 p-4">
//           <h3 className="text-sm font-medium text-gray-700 mb-2">Apply Filters</h3>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">Tags</label>
//             <select
//               multiple
//               value={filters.tags}
//               onChange={(e) => handleFilterChange("tags", Array.from(e.target.selectedOptions, (option) => option.value))}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md"
//             >
//               {availableTags?.map((tag) => (
//                 <option key={tag} value={tag}>{tag}</option>
//               ))}
//             </select>
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">Stage</label>
//             <select
//               value={filters.stage}
//               onChange={(e) => handleFilterChange("stage", e.target.value)}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md"
//             >
//               <option value="">All Stages</option>
//               {Object.entries(initialColumns)?.map(([stageId, { name }]) => (
//                 <option key={stageId} value={stageId}>{name}</option>
//               ))}
//             </select>
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">Branch</label>
//             <select
//               value={filters.branch}
//               onChange={(e) => handleFilterChange("branch", e.target.value)}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md"
//             >
//               <option value="">All Branches</option>
//               {branches?.map((branch) => (
//                 <option key={branch.id} value={branch.name}>{branch.name}</option>
//               ))}
//             </select>
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">Course</label>
//             <select
//               value={filters.course}
//               onChange={(e) => handleFilterChange("course", e.target.value)}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md"
//             >
//               <option value="">All Courses</option>
//               {courses?.map((course) => (
//                 <option key={course.id} value={course.name}>{course.name}</option>
//               ))}
//             </select>
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">Instructor</label>
//             <select
//               value={filters.instructor}
//               onChange={(e) => handleFilterChange("instructor", e.target.value)}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md"
//             >
//               <option value="">All Instructors</option>
//               {instructors?.map((instructor) => (
//                 <option key={instructor.id} value={instructor.f_name}>{instructor.f_name} {instructor.l_name}</option>
//               ))}
//             </select>
//           </div>
//           <div className="flex justify-end gap-2">
//             <button
//               onClick={() => setFilters({ tags: [], stage: "", branch: "", course: "", instructor: "" })}
//               className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
//             >
//               Clear
//             </button>
//             <button
//               onClick={() => setIsFiltersOpen(false)}
//               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//             >
//               Apply
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FiltersDropdown;

import React, { useState, useRef, useEffect } from "react";
import { FaFilter } from "react-icons/fa";

const FiltersDropdown = ({ filters, setFilters, availableTags, branches, courses, instructors, initialColumns }) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const filtersRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target)) {
        setIsFiltersOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    console.log("Instructors:", instructors); // Debug log
  }, [instructors]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="relative" ref={filtersRef}>
      <button
        onClick={() => setIsFiltersOpen(!isFiltersOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 w-full sm:w-auto hover:bg-gray-100"
      >
        <FaFilter />
        Filters
      </button>
      {isFiltersOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-10 p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Apply Filters</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Tags</label>
            <select
              multiple
              value={filters.tags}
              onChange={(e) => handleFilterChange("tags", Array.from(e.target.selectedOptions, (option) => option.value))}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            >
              {availableTags?.map((tag) => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Stage</label>
            <select
              value={filters.stage}
              onChange={(e) => handleFilterChange("stage", e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            >
              <option value="">All Stages</option>
              {Object.entries(initialColumns)?.map(([stageId, { name }]) => (
                <option key={stageId} value={stageId}>{name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Branch</label>
            <select
              value={filters.branch}
              onChange={(e) => handleFilterChange("branch", e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            >
              <option value="">All Branches</option>
              {branches?.map((branch) => (
                <option key={branch.id} value={branch.name}>{branch.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Course</label>
            <select
              value={filters.course}
              onChange={(e) => handleFilterChange("course", e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            >
              <option value="">All Courses</option>
              {courses?.map((course) => (
                <option key={course.id} value={course.name}>{course.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Instructor</label>
            <select
              value={filters.instructor}
              onChange={(e) => handleFilterChange("instructor", e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            >
              <option value="">All Instructors</option>
              {instructors && instructors.length > 0 ? (
                instructors.map((instructor) => (
                  <option key={instructor.id} value={instructor.f_name}>
                    {instructor.f_name} {instructor.l_name || ""}
                  </option>
                ))
              ) : (
                <option disabled>No instructors available</option>
              )}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setFilters({ tags: [], stage: "", branch: "", course: "", instructor: "" })}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Clear
            </button>
            <button
              onClick={() => setIsFiltersOpen(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltersDropdown;