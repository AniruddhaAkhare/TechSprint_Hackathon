import React, { useEffect, useState } from "react";
import { db, storage } from "../../../../config/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useParams, useNavigate } from "react-router-dom";
import AddMCQModal from "./AddMCQModal.jsx";

const SectionMaterials = () => {
  const { curriculumId, sectionId } = useParams();
  const [curriculum, setCurriculum] = useState(null);
  const [section, setSection] = useState(null);
  const [materials, setMaterials] = useState({ pdfs: [], videos: [], youtubeLinks: [], mcqs: [] });
  const [isMCQModalOpen, setIsMCQModalOpen] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const curriculumRef = doc(db, "curriculum", curriculumId);
        const sectionRef = doc(db, "curriculum", curriculumId, "sections", sectionId);
        
        const [curriculumSnap, sectionSnap] = await Promise.all([
          getDoc(curriculumRef),
          getDoc(sectionRef)
        ]);

        if (curriculumSnap.exists()) setCurriculum({ id: curriculumSnap.id, ...curriculumSnap.data() });
        if (sectionSnap.exists()) {
          const data = sectionSnap.data();
          setSection({ id: sectionSnap.id, ...data });
          setMaterials({
            pdfs: data.pdfs || [],
            videos: data.videos || [],
            youtubeLinks: data.youtubeLinks || [],
            mcqs: data.mcqs || []
          });
        }
      } catch (error) {
        // //console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [curriculumId, sectionId]);

  const handleFileUpload = async (file, type) => {
    const fileRef = ref(storage, `sections/${sectionId}/${file.name}`);
    await uploadBytes(fileRef, file);
    const fileURL = await getDownloadURL(fileRef);

    const sectionRef = doc(db, "curriculum", curriculumId, "sections", sectionId);
    await updateDoc(sectionRef, {
      [type]: arrayUnion(fileURL),
    });

    setMaterials(prev => ({ ...prev, [type]: [...prev[type], fileURL] }));
    alert(`${type === "pdfs" ? "PDF" : "Video"} uploaded successfully!`);
  };

  const handleAddYouTubeLink = async () => {
    if (!youtubeLink) return alert("Please provide a YouTube link");

    const sectionRef = doc(db, "curriculum", curriculumId, "sections", sectionId);
    await updateDoc(sectionRef, {
      youtubeLinks: arrayUnion(youtubeLink),
    });

    setMaterials(prev => ({ ...prev, youtubeLinks: [...prev.youtubeLinks, youtubeLink] }));
    setYoutubeLink("");
    alert("YouTube link added!");
  };

  return (
    <div className="flex-col w-screen ml-80 p-4">
    {/* // <div className="p-4"> */}
      <button 
        onClick={() => navigate(`/curriculum/${curriculumId}`)} 
        className="mb-4 px-4 py-2 bg-gray-300 rounded"
      >
        ← Back to Curriculum
      </button>
      
      <h1 className="text-3xl font-bold mb-2">{curriculum?.name}</h1>
      <h2 className="text-2xl font-semibold mb-4">{section?.name}</h2>

      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Materials</h3>
        
        {materials.mcqs.length > 0 && (
          <div className="mb-2">
            <strong>MCQs:</strong> {materials.mcqs.length} questions
          </div>
        )}
        
        {materials.pdfs.map((pdf, index) => (
          <div key={index} className="mb-2">
            <a href={pdf} target="_blank" className="text-blue-500">PDF {index + 1}</a>
          </div>
        ))}
        
        {materials.videos.map((video, index) => (
          <div key={index} className="mb-2">
            <a href={video} target="_blank" className="text-blue-500">Video {index + 1}</a>
          </div>
        ))}
        
        {materials.youtubeLinks.map((link, index) => (
          <div key={index} className="mb-2">
            <a href={link} target="_blank" className="text-blue-500">YouTube Video {index + 1}</a>
          </div>
        ))}
        
        {Object.values(materials).every(arr => arr.length === 0) && (
          <p>No materials available yet.</p>
        )}
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

export default SectionMaterials;