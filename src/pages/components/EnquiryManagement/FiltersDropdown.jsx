
import React, { useState, useRef, useEffect } from "react";
import { FaFilter } from "react-icons/fa";

const FiltersDropdown = ({ filters, setFilters, availableTags, branches, courses, instructors, owners, initialColumns }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFilterChange = (key, value) => {
    if (key === "tags") {
      setFilters((prev) => ({
        ...prev,
        tags: prev.tags.includes(value)
          ? prev.tags.filter((tag) => tag !== value)
          : [...prev.tags, value],
      }));
    } else if (key === "createdAtRange" || key === "lastTouchedRange") {
      setFilters((prev) => ({
        ...prev,
        [key]: { ...prev[key], ...value },
      }));
    } else {
      setFilters((prev) => ({ ...prev, [key]: value }));
    }
  };

  const clearFilters = () => {
    setFilters({
      tags: [],
      stage: "",
      branch: "",
      course: "",
      owner: "",
      createdAtRange: { startDate: "", endDate: "" },
      lastTouchedRange: { startDate: "", endDate: "" },
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
      >
        <FaFilter />
        Filters
      </button>
      {isOpen && (
        <div className="absolute top-full right-2 mt-2 bg-white rounded-lg shadow-lg p-4 w-96 z-50 max-h-[60vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Filter Enquiries</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Branch</label>
            <select
              value={filters.branch}
              onChange={(e) => handleFilterChange("branch", e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Branches</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.name}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Owner</label>
            <select
              value={filters.owner}
              onChange={(e) => handleFilterChange("owner", e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Owners</option>
              {owners.map((owner) => (
                <option key={owner} value={owner}>
                  {owner}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Course</label>
            <select
              value={filters.course}
              onChange={(e) => handleFilterChange("course", e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Courses</option>
              {courses.map((course) => (
                <option key={course.id} value={course.name}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Stage</label>
            <select
              value={filters.stage}
              onChange={(e) => handleFilterChange("stage", e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Stages</option>
              {Object.entries(initialColumns).map(([stageId, stage]) => (
                <option key={stageId} value={stageId}>
                  {stage.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Tags</label>
            <div className="mt-1 flex flex-wrap gap-2 max-h-24 overflow-y-auto border border-gray-300 rounded-md p-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleFilterChange("tags", tag)}
                  className={`px-2 py-1 rounded-full text-sm ${
                    filters.tags.includes(tag)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Creation Time</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={filters.createdAtRange.startDate}
                onChange={(e) => handleFilterChange("createdAtRange", { startDate: e.target.value })}
                className="p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <span className="self-center">to</span>
              <input
                type="date"
                value={filters.createdAtRange.endDate}
                onChange={(e) => handleFilterChange("createdAtRange", { endDate: e.target.value })}
                className="p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Last Touched</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={filters.lastTouchedRange.startDate}
                onChange={(e) => handleFilterChange("lastTouchedRange", { startDate: e.target.value })}
                className="p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <span className="self-center">to</span>
              <input
                type="date"
                value={filters.lastTouchedRange.endDate}
                onChange={(e) => handleFilterChange("lastTouchedRange", { endDate: e.target.value })}
                className="p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={clearFilters}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Clear Filters
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltersDropdown;