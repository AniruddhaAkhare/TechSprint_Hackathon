import React, { useState, useEffect } from "react";
import { db, storage, auth } from "../../../../config/firebase";
import { doc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useParams, useNavigate } from "react-router-dom";
import AddMCQModal from "./AddMCQModal.jsx";

const AddMaterial = () => {
  const { curriculumId, sectionId } = useParams();
  const [youtubeLink, setYoutubeLink] = useState("");
  const [isMCQModalOpen, setIsMCQModalOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check user authentication and role on mount
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Assume we have a users collection with role information
        const userDoc = await doc(db, "users", user.uid).get();
        setUserRole(userDoc.data()?.role || "student");
      } else {
        navigate("/login"); // Redirect to login if not authenticated
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  // Log activity to Firestore
  const logActivity = async (action, details) => {
    const user = auth.currentUser;
    if (!user) return;

    const logRef = doc(db, "activityLogs", `${user.uid}_${Date.now()}`);
    await updateDoc(logRef, {
      userId: user.uid,
      action,
      details,
      timestamp: serverTimestamp(),
      curriculumId,
      sectionId,
    }, { merge: true });
  };

  const handleFileUpload = async (file, type) => {
    if (!file) return;
    if (!hasPermission()) {
      alert("You don't have permission to upload files");
      return;
    }

    try {
      const fileRef = ref(storage, `sections/${sectionId}/${file.name}`);
      await uploadBytes(fileRef, file);
      const fileURL = await getDownloadURL(fileRef);

      const sectionRef = doc(db, "curriculum", curriculumId, "sections", sectionId);
      await updateDoc(sectionRef, {
        [type]: arrayUnion(fileURL),
      });

      await logActivity(
        `upload_${type}`,
        `Uploaded ${file.name} to section ${sectionId}`
      );

      alert(`${type === "pdfs" ? "PDF" : "Video"} uploaded successfully!`);
      navigate(`/curriculum/${curriculumId}/section/${sectionId}`);
    } catch (error) {
      console.error("Upload error:", error);
      await logActivity("upload_error", `Failed to upload ${file.name}: ${error.message}`);
      alert("Error uploading file. Please try again.");
    }
  };

  const handleAddYouTubeLink = async () => {
    if (!youtubeLink.trim()) return alert("Please provide a YouTube link");
    if (!hasPermission()) {
      alert("You don't have permission to add YouTube links");
      return;
    }

    try {
      const sectionRef = doc(db, "curriculum", curriculumId, "sections", sectionId);
      await updateDoc(sectionRef, {
        youtubeLinks: arrayUnion(youtubeLink),
      });

      await logActivity(
        "add_youtube_link",
        `Added YouTube link: ${youtubeLink} to section ${sectionId}`
      );

      setYoutubeLink("");
      alert("YouTube link added!");
      navigate(`/curriculum/${curriculumId}/section/${sectionId}`);
    } catch (error) {
      console.error("YouTube link error:", error);
      await logActivity("youtube_link_error", `Failed to add link: ${error.message}`);
      alert("Error adding YouTube link. Please try again.");
    }
  };

  // Permission check function
  const hasPermission = () => {
    return userRole === "admin" || userRole === "instructor";
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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
      {hasPermission() ? (
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
      ) : (
        <div className="text-red-500">
          You don't have permission to add materials. Contact an administrator.
        </div>
      )}

      {/* MCQ Modal */}
      {isMCQModalOpen && hasPermission() && (
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