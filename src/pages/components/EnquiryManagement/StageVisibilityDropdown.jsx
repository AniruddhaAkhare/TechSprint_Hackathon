

import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

const StageVisibilityDropdown = ({ stageVisibility, setStageVisibility, initialColumns }) => {
  const [isStageVisibilityOpen, setIsStageVisibilityOpen] = useState(false);
  const stageVisibilityRef = useRef(null);

  // Load stage visibility from localStorage on component mount
  useEffect(() => {
    const savedVisibility = localStorage.getItem("stageVisibility");
    if (savedVisibility) {
      setStageVisibility(JSON.parse(savedVisibility));
    }
  }, [setStageVisibility]);

  // Save stage visibility to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("stageVisibility", JSON.stringify(stageVisibility));
  }, [stageVisibility]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (stageVisibilityRef.current && !stageVisibilityRef.current.contains(event.target)) {
        setIsStageVisibilityOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleStageVisibility = (stage) => {
    setStageVisibility((prev) => ({ ...prev, [stage]: !prev[stage] }));
  };

  return (
    <div className="relative w-full sm:w-auto" ref={stageVisibilityRef}>
      <button
        onClick={() => setIsStageVisibilityOpen(!isStageVisibilityOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 w-full hover:bg-gray-100"
      >
        <FaChevronDown />
        Stage Visibility
      </button>
      {isStageVisibilityOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-10">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Show/Hide Stages</h3>
            {Object.keys(initialColumns).map((stage) => (
              <div key={stage} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  {initialColumns[stage].icon}
                  <span>{initialColumns[stage].name}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stageVisibility[stage]}
                    onChange={() => toggleStageVisibility(stage)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peerChecked:bg-blue-600">
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                        stageVisibility[stage] ? "translate-x-5" : "translate-x-1"
                      }`}
                    ></div>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StageVisibilityDropdown;