import React, { useEffect, useState } from "react";
import { db } from "../../../../config/firebase";
import { doc, getDoc, getDocs, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import AddSectionalModal from "./AddSectionalModel.jsx";

const CurriculumEditor = () => {
  const { curriculumId } = useParams();
  const { user, rolePermissions } = useAuth();
  const [curriculum, setCurriculum] = useState(null);
  const [sections, setSections] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Permission checks
  const canDisplay = rolePermissions?.curriculums?.display || false;
  const canCreate = rolePermissions?.curriculums?.create || false;
  const canUpdate = rolePermissions?.curriculums?.update || false;

  useEffect(() => {
    if (!canDisplay || !user) {
      return;
    }

    const fetchCurriculum = async () => {
      try {
        const docRef = doc(db, "curriculums", curriculumId); // Fixed collection name typo
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCurriculum({ id: docSnap.id, ...docSnap.data() });
        } else {
          alert("Curriculum not found!");
          navigate(-1);
          return;
        }

        const sectionsCollection = collection(db, "curriculums", curriculumId, "sections");
        const sectionsSnapshot = await getDocs(sectionsCollection);
        const sectionsData = sectionsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setSections(sectionsData);

        // Log viewing the curriculum
        // await logActivity("Viewed curriculum editor", {
        //   curriculumId,
        //   name: docSnap.data().name || "Unknown"
        // });
      } catch (error) {
        // //console.error("Error fetching curriculum:", error);
      }
    };

    fetchCurriculum();
  }, [curriculumId, navigate, canDisplay, user]);

  const logActivity = async (action, details) => {
    if (!user) {
      // //console.error("No user logged in for logging activity");
      return;
    }
    try {
      await addDoc(collection(db, "activityLogs"), {
        timestamp: serverTimestamp(),
        userId: user.uid,
        userEmail: user.email,
        action,
        details
      });
    } catch (err) {
      // //console.error("Error logging activity:", err.message);
    }
  };

  const handleSectionClick = (sectionId) => {
    if (canDisplay) {
      navigate(`/curriculum/${curriculumId}/section/${sectionId}`);
    }
  };

  const handleAddSectionClick = () => {
    if (!canCreate) {
      alert("You do not have permission to create sections.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleAddMaterialClick = async (sectionId, e) => {
    e.stopPropagation();
    if (!canUpdate) {
      alert("You do not have permission to update sections or add materials.");
      return;
    }
    try {
      const section = sections.find(s => s.id === sectionId);
      // await logActivity("Navigated to add material", {
        // curriculumId,
        // sectionId,
        // sectionName: section?.name || "Unknown"
      // });
      navigate(`/curriculum/${curriculumId}/section/${sectionId}/add-material`);
    } catch (error) {
      // //console.error("Error logging navigation to add material:", error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    // Refresh sections after modal closes
    const fetchSections = async () => {
      const sectionsCollection = collection(db, "curriculums", curriculumId, "sections");
      const sectionsSnapshot = await getDocs(sectionsCollection);
      const sectionsData = sectionsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSections(sectionsData);
    };
    fetchSections();
  };

  if (!canDisplay) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-red-600 text-lg font-semibold">
          Access Denied: You do not have permission to view curriculum details.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full p-4 sm:p-6 md:ml-80 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-200"
          >
            ← Back
          </button>
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Create and Edit Your Curriculum
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mt-1">
            {curriculum?.name || "Loading..."}
          </p>
        </div>
      </div>

      {/* Add Section Button */}
      <div className="mb-6">
        <button
          className={`w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200 ${
            !canCreate ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleAddSectionClick}
          disabled={!canCreate}
        >
          + Add Section
        </button>
      </div>

      {/* Sections Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full min-w-[400px] border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left text-sm font-semibold text-gray-700">Section Name</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sections.length > 0 ? (
              sections.map((section) => (
                <tr
                  key={section.id}
                  className="border-b hover:bg-gray-50 cursor-pointer transition duration-150"
                  onClick={() => handleSectionClick(section.id)}
                >
                  <td className="p-3 text-sm sm:text-base text-gray-700">{section.name}</td>
                  <td className="p-3">
                    <button
                      className={`w-full sm:w-auto px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200 text-sm ${
                        !canUpdate ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={(e) => handleAddMaterialClick(section.id, e)}
                      disabled={!canUpdate}
                    >
                      Add Material
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="p-4 text-center text-gray-500 text-sm sm:text-base">
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
          isOpen={isModalOpen}
          curriculumId={curriculumId}
          onClose={handleModalClose}
          sectionToEdit={null} 
          logActivity={logActivity}
        />
      )}
    </div>
  );
};

export default CurriculumEditor;