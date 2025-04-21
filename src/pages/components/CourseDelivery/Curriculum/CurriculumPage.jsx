import React, { useState, useEffect } from "react";
import CreateCurriculum from "./CreateCurriculum";
import { db, auth } from "../../../../config/firebase"; // Adjust path as needed
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../../../context/AuthContext";

const CurriculumPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, rolePermissions } = useAuth();

  const canCreateCurriculum = rolePermissions?.curriculums?.create || false;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        console.log("No authenticated user found");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Define logActivity function
  const logActivity = async (action, details) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error("No authenticated user, cannot log activity");
      return;
    }

    try {
      await addDoc(collection(db, "activityLogs"), {
        userId: currentUser.uid,
        action,
        details: typeof details === "object" ? JSON.stringify(details) : details,
        timestamp: serverTimestamp(),
      });
      console.log(`Activity logged: ${action} - ${JSON.stringify(details)}`);
    } catch (error) {
      console.error("Error logging activity:", error);
    }
  };

  const handleOpenModal = () => {
    if (!canCreateCurriculum) {
      alert("You don't have permission to create a curriculum");
      // logActivity("access_denied", "Attempted to open curriculum creation modal without permission");
      return;
    }
    setIsModalOpen(true);
    // logActivity("open_modal", "Opened curriculum creation modal");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // logActivity("close_modal", "Closed curriculum creation modal");
  };

  const handleSubmit = (data) => {
    if (!canCreateCurriculum) {
      alert("You don't have permission to create a curriculum");
      // logActivity("access_denied", "Attempted to submit curriculum without permission");
      return;
    }
    console.log("New Curriculum:", data);
    // Logging is handled in CreateCurriculum on successful save
    setIsModalOpen(false);
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center w-full p-4 sm:p-6 min-h-screen bg-gray-50">
      {canCreateCurriculum && (
        <button
          onClick={handleOpenModal}
          className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200 text-sm sm:text-base"
        >
          Open Curriculum Modal
        </button>
      )}

      {isModalOpen && (
        <CreateCurriculum
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          logActivity={logActivity} // Pass logActivity as a prop
        />
      )}
    </div>
  );
};

export default CurriculumPage;