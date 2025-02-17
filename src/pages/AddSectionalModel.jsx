import React, { useState } from "react";
import { db } from "../config/firebase"; // Import Firestore
import { collection, addDoc } from "firebase/firestore";

const AddSectionModal = ({ curriculumId, onClose }) => {
  const [sectionName, setSectionName] = useState("");
  const [sectionDescription, setSectionDescription] = useState("");
  const [isPrerequisite, setIsPrerequisite] = useState(false);

  const handleAddSection = async () => {
    if (!sectionName.trim()) {
      alert("Section name is required!");
      return;
    }
    const newSection = {
      name: sectionName,
      description: sectionDescription,
      prerequisite: isPrerequisite,
    };

    try {
      // Add section to the Firestore under the selected curriculum
      await addDoc(collection(db, `curriculum/${curriculumId}/sections`), newSection);
      console.log("New Section:", newSection);
      onClose(); // Close the modal after adding the section
    } catch (error) {
      console.error("Error adding section:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[400px]">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Add New Section</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label
              htmlFor="sectionName"
              className="block text-sm font-medium text-gray-700"
            >
              Section Name <span className="text-red-500">*</span>
            </label>
            <input
              id="sectionName"
              type="text"
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Section Name"
            />
          </div>
          <div>
            <label
              htmlFor="sectionDescription"
              className="block text-sm font-medium text-gray-700"
            >
              Short Description
            </label>
            <textarea
              id="sectionDescription"
              value={sectionDescription}
              onChange={(e) => setSectionDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Section Description"
              maxLength={250}
              rows={3}
            />
            <p className="text-sm text-gray-500">
              {sectionDescription.length}/250
            </p>
          </div>
          <div className="flex items-center">
            <input
              id="isPrerequisite"
              type="checkbox"
              checked={isPrerequisite}
              onChange={(e) => setIsPrerequisite(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="isPrerequisite"
              className="ml-2 text-sm text-gray-700"
            >
              Make this a prerequisite
            </label>
          </div>
        </div>
        <div className="px-6 py-4 border-t flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Back
          </button>
          <button
            onClick={handleAddSection}
            className={`px-4 py-2 rounded-md text-white ${
              sectionName.trim()
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!sectionName.trim()}
          >
            Add Section
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSectionModal;
