import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Adjust path as per your project structure

const CurriculumDetails = () => {
  const { curriculumId } = useParams();
  const { user, rolePermissions } = useAuth();
  const [sections, setSections] = useState([]);
  const [curriculumName, setCurriculumName] = useState(""); // To log curriculum name
  const navigate = useNavigate();

  // Permission checks
  const canDisplay = rolePermissions?.curriculums?.display || false;
  const canUpdate = rolePermissions?.curriculums?.update || false;

  useEffect(() => {
    if (!canDisplay || !user) {
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch curriculum name for logging
        const curriculumDoc = await getDocs(collection(db, "curriculums"));
        const curriculum = curriculumDoc.docs.find(doc => doc.id === curriculumId);
        if (curriculum) {
          setCurriculumName(curriculum.data().name || "Unknown");
        }

        // Fetch sections
        const sectionsSnapshot = await getDocs(collection(db, `curriculums/${curriculumId}/sections`));
        const sectionsList = sectionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSections(sectionsList);

        // Log viewing the curriculum details
        await logActivity("Viewed curriculum details", {
          curriculumId,
          name: curriculum?.data().name || "Unknown"
        });
      } catch (error) {
        console.error("Error fetching curriculum data:", error);
      }
    };

    fetchData();
  }, [curriculumId, canDisplay, user]);

  const logActivity = async (action, details) => {
    if (!user) {
      console.error("No user logged in for logging activity");
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
      console.log("Activity logged:", action, details);
    } catch (err) {
      console.error("Error logging activity:", err.message);
    }
  };

  const handleAddMaterialClick = async (sectionId) => {
    if (!canUpdate) {
      alert("You do not have permission to update curriculums or add materials.");
      return;
    }
    try {
      const section = sections.find(s => s.id === sectionId);
      await logActivity("Navigated to add material", {
        curriculumId,
        sectionId,
        sectionName: section?.name || "Unknown"
      });
      navigate(`/curriculum/${curriculumId}/section/${sectionId}/add-material`);
    } catch (error) {
      console.error("Error logging navigation to add material:", error);
    }
  };

  if (!canDisplay) {
    return (
      <div className="flex items-center justify-center h-screen">
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
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Sections {curriculumName ? `- ${curriculumName}` : ""}</h2>
        <button
          onClick={() => navigate(-1)}
          className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-200"
        >
          ← Back
        </button>
      </div>

      {/* Sections List */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <ul className="space-y-4">
          {sections.length > 0 ? (
            sections.map(section => (
              <li
                key={section.id}
                className="border-b py-2 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="text-sm sm:text-base">
                  <div className="font-medium text-gray-900">{section.name}</div>
                  <div className="text-gray-600">
                    Total Watch Time: {section.totalWatchTime || 0} seconds
                  </div>
                  <div className="text-gray-600">
                    View Duration: {section.viewDuration || "N/A"}
                  </div>
                </div>
                <button
                  onClick={() => handleAddMaterialClick(section.id)}
                  className={`w-full sm:w-auto px-3 py-1 text-blue-500 border border-blue-500 rounded-md hover:bg-blue-50 hover:text-blue-600 transition duration-200 text-sm sm:text-base ${
                    !canUpdate ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={!canUpdate}
                >
                  Add Material
                </button>
              </li>
            ))
          ) : (
            <li className="text-gray-500 text-sm sm:text-base text-center py-4">
              No sections available.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CurriculumDetails;