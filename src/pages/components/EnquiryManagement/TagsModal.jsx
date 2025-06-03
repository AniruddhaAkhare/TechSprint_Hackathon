import React, { useState } from "react";
import Modal from "react-modal";
import { db } from "../../../config/firebase";
import { addDoc, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { FaTimes, FaTrash, FaCircle } from "react-icons/fa";

Modal.setAppElement("#root");

const TagsModal = ({ isOpen, onRequestClose, availableTags, setAvailableTags }) => {
  const [newTag, setNewTag] = useState("");

  const handleAddTag = async () => {
    if (newTag.trim() && !availableTags.includes(newTag.trim())) {
      try {
        await addDoc(collection(db, "tags"), { name: newTag.trim() });
        setNewTag("");
      } catch (error) {
        // //console.error("Error adding tag:", error);
        alert("Failed to add tag");
      }
    }
  };

  const handleDeleteTag = async (tag) => {
    try {
      const tagQuery = query(collection(db, "tags"), where("name", "==", tag));
      const tagSnapshot = await getDocs(tagQuery);
      tagSnapshot.forEach(async (doc) => await deleteDoc(doc.ref));
    } catch (error) {
      // //console.error("Error deleting tag:", error);
      alert("Failed to delete tag");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="bg-white rounded-lg shadow-lg p-6 w-[95%] max-w-md mx-auto mt-20 max-h-[80vh] overflow-y-auto border border-gray-200"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Manage Tags</h2>
        <button onClick={onRequestClose} className="text-gray-500 hover:text-gray-700">
          <FaTimes />
        </button>
      </div>
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">Create New Tag</h3>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Tag name"
            className="p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={handleAddTag}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            + Add
          </button>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Existing Tags</h3>
        {availableTags.length === 0 ? (
          <p className="text-gray-500">No tags available</p>
        ) : (
          <div className="space-y-2">
            {availableTags.map((tag) => (
              <div key={tag} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <FaCircle className="text-gray-500" />
                  <span className="text-sm">{tag}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleDeleteTag(tag)} className="text-red-500 hover:text-red-700">
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default TagsModal;