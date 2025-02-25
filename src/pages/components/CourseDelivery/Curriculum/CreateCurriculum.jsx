import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const CreateCurriculum = ({ isOpen, onClose, onSubmit }) => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [viewDuration, setViewDuration] = useState("Unlimited");
  const [totalDuration, setTotalDuration] = useState(0);
  const [multiplier, setMultiplier] = useState(0);

    const handleSubmit = () => {
        if (!name.trim()) return alert("Curriculum name is required!");
        // if (!courseId) return alert("Course ID is required!");
        const totalWatchTime = totalDuration * multiplier;
        onSubmit({ 
            name, 
            viewDuration, 
            totalWatchTime,
             
        });
        onClose();
        navigate(`/curriculum`);

    };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h3 className="text-xl font-bold mb-4">Add Curriculum</h3>
        <label className="block mb-2 font-medium">Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-4"
          maxLength="50"
          placeholder="Enter curriculum name"
        />
        <label className="block mb-2 font-medium">Maximum View Duration</label>
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="Unlimited"
              checked={viewDuration === "Unlimited"}
              onChange={(e) => setViewDuration(e.target.value)}
              className="mr-2"
            />
            Unlimited
          </label>
          <label className="inline-flex items-center ml-4">
            <input
              type="radio"
              value="Restricted"
              checked={viewDuration === "Restricted"}
              onChange={(e) => setViewDuration(e.target.value)}
              className="mr-2"
            />
            Restricted
          </label>
        </div>
        {viewDuration === "Restricted" && (
          <div className="mb-4">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block mb-1">Total Duration (seconds)</label>
                <input
                  type="number"
                  value={totalDuration}
                  onChange={(e) => setTotalDuration(Number(e.target.value))}
                  className="px-2 py-1 border rounded w-full"
                  min="0"
                />
              </div>
              <span className="text-lg">×</span>
              <div>
                <label className="block mb-1">Multiplier</label>
                <input
                  type="number"
                  value={multiplier}
                  onChange={(e) => setMultiplier(Number(e.target.value))}
                  className="px-2 py-1 border rounded w-full"
                  min="0"
                />
              </div>
              <span className="text-lg">=</span>
              <div>
                <label className="block mb-1">Total Watch Time (seconds)</label>
                <input
                  type="text"
                  value={`${totalDuration * multiplier} s`}
                  readOnly
                  className="px-2 py-1 border bg-gray-100 rounded w-full"
                />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              <strong>What is watch-time?</strong> Watch Time is the maximum duration a student can spend viewing course
              content. Once the limit is reached, access is restricted.
            </p>
          </div>
        )}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Curriculum
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCurriculum;
