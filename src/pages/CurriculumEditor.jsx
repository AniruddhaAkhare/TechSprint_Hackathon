import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";

const CurriculumEditor = () => {
  const { curriculumId } = useParams();
  const [curriculum, setCurriculum] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurriculum = async () => {
      const docRef = doc(db, "curriculum", curriculumId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCurriculum(docSnap.data());
      } else {
        alert("Curriculum not found!");
        navigate(-1);
      }
    };

    fetchCurriculum();
  }, [curriculumId, navigate]);

  if (!curriculum) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-300 rounded text-gray-700 hover:bg-gray-400"
      >
        &larr; Back
      </button>
      <h2 className="text-2xl font-bold mb-2">Create and Edit Your Curriculum</h2>
      <p className="text-gray-600 mb-6">{curriculum.name}</p>
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm bg-gray-200 text-gray-600 px-2 py-1 rounded">
          {curriculum.sections?.length || 0} Sections
        </span>
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          + Add Section
        </button>
      </div>
      {curriculum.sections?.map((section, index) => (
        <div key={index} className="bg-gray-100 p-4 rounded mb-4">
          <h3 className="text-lg font-semibold">
            {`${index + 1}. ${section.title || "Untitled Section"}`}
          </h3>
          <p className="text-gray-500">
            {section.materials?.length || 0} material(s) • {section.totalDuration || "0s"}
          </p>
          <button className="mt-2 text-blue-500 hover:underline">+ Add Material</button>
        </div>
      ))}
    </div>
  );
};

export default CurriculumEditor;
