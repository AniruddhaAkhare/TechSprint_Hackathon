// New file: AddMaterial.jsx
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
    if (!youtubeLink) return alert("Please provide a YouTube link");

    const sectionRef = doc(db, "curriculum", curriculumId, "sections", sectionId);
    await updateDoc(sectionRef, {
      youtubeLinks: arrayUnion(youtubeLink),
    });

    setYoutubeLink("");
    alert("YouTube link added!");
    navigate(`/curriculum/${curriculumId}/section/${sectionId}`);
  };

  return (
    <div className="flex-col w-screen ml-80 p-4">
    {/* // <div className="p-4"> */}
      <button 
        onClick={() => navigate(`/curriculum/${curriculumId}/section/${sectionId}`)} 
        className="mb-4 px-4 py-2 bg-gray-300 rounded"
      >
        ← Back to Section
      </button>

      <h2 className="text-2xl font-bold mb-4">Add Material</h2>

      <div className="space-y-4">
        <button 
          className="bg-purple-500 text-white px-4 py-2 rounded"
          onClick={() => setIsMCQModalOpen(true)}
        >
          Add MCQs
        </button>

        <div>
          <input 
            type="file" 
            id="pdfUpload" 
            hidden 
            onChange={(e) => handleFileUpload(e.target.files[0], "pdfs")} 
          />
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => document.getElementById("pdfUpload").click()}
          >
            Upload PDF
          </button>
        </div>

        <div>
          <input 
            type="file" 
            id="videoUpload" 
            hidden 
            onChange={(e) => handleFileUpload(e.target.files[0], "videos")} 
          />
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => document.getElementById("videoUpload").click()}
          >
            Upload Video
          </button>
        </div>

        <div>
          <input 
            type="text" 
            value={youtubeLink} 
            onChange={(e) => setYoutubeLink(e.target.value)} 
            placeholder="Enter YouTube URL" 
            className="border p-2 mr-2"
          />
          <button 
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={handleAddYouTubeLink}
          >
            Add YouTube Link
          </button>
        </div>
      </div>

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