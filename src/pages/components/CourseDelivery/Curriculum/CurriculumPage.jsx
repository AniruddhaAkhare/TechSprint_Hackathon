import React, { useState, useEffect } from "react";
import CreateCurriculum from "./CreateCurriculum";
import { db, auth } from "../../../../config/firebase"; // Adjust path as needed
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../../../context/AuthContext";
import { runTransaction } from "firebase/firestore";

const CurriculumPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, rolePermissions } = useAuth();

  const canCreateCurriculum = rolePermissions?.curriculums?.create || false;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Define logActivity function
const logActivity = async (action, details) => {
  if (!user?.email) return;

  const activityLogRef = doc(db, "activityLogs", "logDocument");

  const logEntry = {
    action,
    details,
    timestamp: new Date().toISOString(),
    userEmail: user.email,
    userId: user.uid,
    section: "Curriculum",
    // adminId: adminId || "N/A",
  };

  try {
    await runTransaction(db, async (transaction) => {
      const logDoc = await transaction.get(activityLogRef);
      let logs = logDoc.exists() ? logDoc.data().logs || [] : [];

      // Ensure logs is an array and contains only valid data
      if (!Array.isArray(logs)) {
        logs = [];
      }

      // Append the new log entry
      logs.push(logEntry);

      // Trim to the last 1000 entries if necessary
      if (logs.length > 1000) {
        logs = logs.slice(-1000);
      }

      // Update the document with the new logs array
      transaction.set(activityLogRef, { logs }, { merge: true });
    });
    console.log("Activity logged successfully");
  } catch (error) {
    console.error("Error logging activity:", error);
    // toast.error("Failed to log activity");
  }
};
  
  // const fetchLogs = useCallback(() => {
  //   if (!isAdmin) return;
  //   const q = query(LogsCollectionRef, orderBy("timestamp", "desc"));
  //   const unsubscribe = onSnapshot(
  //     q,
  //     (snapshot) => {
  //       const allLogs = [];
  //       snapshot.docs.forEach((doc) => {
  //         const data = doc.data();
  //         (data.logs || []).forEach((log) => {
  //           allLogs.push({ id: doc.id, ...log });
  //         });
  //       });
  //       allLogs.sort(
  //         (a, b) =>
  //           (b.timestamp?.toDate() || new Date(0)) - (a.timestamp?.toDate() || new Date(0))
  //       );
  //       setLogs(allLogs);
  //     },
  //   );
  //   return unsubscribe;
  // }, [isAdmin]);

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
    // Logging is handled in CreateCurriculum on successful save
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen p-4 fixed inset-0 left-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
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