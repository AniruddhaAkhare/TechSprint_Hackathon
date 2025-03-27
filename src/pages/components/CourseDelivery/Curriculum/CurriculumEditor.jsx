
import React, { useEffect, useState } from "react";
import { db } from "../../../../config/firebase";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import AddSectionalModal from "./AddSectionalModel.jsx"; // Fixed typo in import

const CurriculumEditor = () => {
  const { curriculumId } = useParams();
  const [curriculum, setCurriculum] = useState(null);
  const [sections, setSections] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        const docRef = doc(db, "curriculum", curriculumId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCurriculum({ id: docSnap.id, ...docSnap.data() });
        } else {
          alert("Curriculum not found!");
          navigate(-1);
          return;
        }

        const sectionsCollection = collection(db, "curriculum", curriculumId, "sections");
        const sectionsSnapshot = await getDocs(sectionsCollection);
        const sectionsData = sectionsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setSections(sectionsData);
      } catch (error) {
        console.error("Error fetching curriculum:", error);
      }
    };

    fetchCurriculum();
  }, [curriculumId, navigate]);

  const handleSectionClick = (sectionId) => {
    navigate(`/curriculum/${curriculumId}/section/${sectionId}`);
  };

  return (
    <div className="flex flex-col w-full p-4 sm:p-6 md:ml-80">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-200 mb-4 sm:mb-0"
          >
            ← Back
          </button>
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Create and Edit Your Curriculum</h2>
          <p className="text-gray-600 text-sm sm:text-base mt-1">{curriculum?.name || "Loading..."}</p>
        </div>
      </div>

      {/* Add Section Button */}
      <div className="mb-6">
        <button
          className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
          onClick={() => setIsModalOpen(true)}
        >
          + Add Section
        </button>
      </div>

      {/* Sections Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[400px] border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-left text-sm font-medium">Section Name</th>
              <th className="border p-2 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sections.length > 0 ? (
              sections.map((section) => (
                <tr
                  key={section.id}
                  className="border-b cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSectionClick(section.id)}
                >
                  <td className="border p-2 text-sm sm:text-base">{section.name}</td>
                  <td className="border p-2">
                    <button
                      className="w-full sm:w-auto bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition duration-200 text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/curriculum/${curriculumId}/section/${section.id}/add-material`);
                      }}
                    >
                      Add Material
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="border p-2 text-center text-gray-500 text-sm sm:text-base">
                  No sections available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AddSectionalModal
          curriculumId={curriculumId}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default CurriculumEditor;