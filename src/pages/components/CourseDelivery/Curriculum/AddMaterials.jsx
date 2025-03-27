
import React, { useState } from "react";
import { db, storage } from "../../../../config/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useParams, useNavigate } from "react-router-dom";
import AddMCQModal from "./AddMCQModal.jsx";

const AddMaterial = () => {
  const { curriculumId, sectionId } = useParams();
  const [youtubeLink, setYoutubeLink] = useState("");
  const [isMCQModalOpen, setIsMCQModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = async (file, type) => {
    if (!file) return;
    const fileRef = ref(storage, `sections/${sectionId}/${file.name}`);
    await uploadBytes(fileRef, file);
    const fileURL = await getDownloadURL(fileRef);

    const sectionRef = doc(db, "curriculum", curriculumId, "sections", sectionId);
    await updateDoc(sectionRef, {
      [type]: arrayUnion(fileURL),
    });

    alert(`${type === "pdfs" ? "PDF" : "Video"} uploaded successfully!`);
    navigate(`/curriculum/${curriculumId}/section/${sectionId}`);
  };

  const handleAddYouTubeLink = async () => {
    if (!youtubeLink.trim()) return alert("Please provide a YouTube link");

    const sectionRef = doc(db, "curriculum", curriculumId, "sections", sectionId);
    await updateDoc(sectionRef, {
      youtubeLinks: arrayUnion(youtubeLink),
    });

    setYoutubeLink("");
    alert("YouTube link added!");
    navigate(`/curriculum/${curriculumId}/section/${sectionId}`);
  };

  return (
    <div className="flex flex-col w-full p-4 md:ml-80">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">Add Material</h2>
        <button
          onClick={() => navigate(`/curriculum/${curriculumId}/section/${sectionId}`)}
          className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-200"
        >
          ← Back to Section
        </button>
      </div>

      {/* Material Inputs */}
      <div className="space-y-4">
        {/* Add MCQs */}
        <div>
          <button
            className="w-full sm:w-auto bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition duration-200"
            onClick={() => setIsMCQModalOpen(true)}
          >
            Add MCQs
          </button>
        </div>

        {/* Upload PDF */}
        <div>
          <input
            type="file"
            id="pdfUpload"
            hidden
            accept=".pdf"
            onChange={(e) => handleFileUpload(e.target.files[0], "pdfs")}
          />
          <button
            className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
            onClick={() => document.getElementById("pdfUpload").click()}
          >
            Upload PDF
          </button>
        </div>

        {/* Upload Video */}
        <div>
          <input
            type="file"
            id="videoUpload"
            hidden
            accept="video/*"
            onChange={(e) => handleFileUpload(e.target.files[0], "videos")}
          />
          <button
            className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
            onClick={() => document.getElementById("videoUpload").click()}
          >
            Upload Video
          </button>
        </div>

        {/* Add YouTube Link */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
            placeholder="Enter YouTube URL"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            className="w-full sm:w-auto bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
            onClick={handleAddYouTubeLink}
          >
            Add YouTube Link
          </button>
        </div>
      </div>

      {/* MCQ Modal */}
      {isMCQModalOpen && (
        <AddMCQModal
          curriculumId={curriculumId}
          sectionId={sectionId}
          onClose={() => setIsMCQModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AddMaterial;