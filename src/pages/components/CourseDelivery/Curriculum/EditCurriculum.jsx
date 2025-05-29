import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../../../config/firebase";
import {
  doc,
  getDoc,
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { s3Client } from "../../../../config/aws-config";
import { DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import AddSectionModal from "./AddSectionalModel";
import AddMaterialModal from "./AddMaterialModal";
import { useAuth } from "../../../../context/AuthContext";

const EditCurriculum = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, rolePermissions } = useAuth();
  const [curriculum, setCurriculum] = useState(null);
  const [sections, setSections] = useState([]);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [sectionToEdit, setSectionToEdit] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [sectionDropdownOpen, setSectionDropdownOpen] = useState(null);
  const [materialDropdownOpen, setMaterialDropdownOpen] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const allowedMaterialTypes = [
    "Video",
    "PDF",
    "Image",
    "YouTube",
    "Sheet",
    "Slide",
    "Assignment",
    "Form",
    "Zip",
  ];

  const logActivity = async (action, details) => {
    if (!user) {
      // //console.error("No user logged in for logging activity");
      return;
    }
    try {
      const logRef = await addDoc(collection(db, "activityLogs"), {
        timestamp: serverTimestamp(),
        userId: user.uid,
        userEmail: user.email,
        action,
        details: {
          curriculumId: id,
          curriculumName: curriculum?.name || "Unknown",
          ...details,
        },
      });
    } catch (err) {
      // //console.error("Error logging activity:", err.message);
      throw err;
    }
  };

  useEffect(() => {
    const fetchCurriculum = async () => {
      if (!id) {
        console.warn("No curriculum ID provided");
        setError("Invalid curriculum ID");
        navigate("/curriculum");
        return;
      }

      try {
        const docRef = doc(db, "curriculums", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const curriculumData = { id: docSnap.id, ...docSnap.data() };
          setCurriculum(curriculumData);
        } else {
          console.warn("No such curriculum found for ID:", id);
          setError("Curriculum not found");
          navigate("/curriculum");
        }
      } catch (err) {
        // //console.error("Error fetching curriculum:", err.message);
        setError("Failed to load curriculum. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchCurriculum();
  }, [id, navigate]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, `curriculums/${id}/sections`),
      async (snapshot) => {
        try {
          const sectionData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            materials: [],
          }));
   

          const sectionsWithMaterials = await Promise.all(
            sectionData.map(async (section) => {
              const materialsSnapshot = await new Promise((resolve) => {
                onSnapshot(
                  collection(db, `curriculums/${id}/sections/${section.id}/materials`),
                  (snap) => resolve(snap)
                );
              });
              const materialsData = materialsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
           
              return { ...section, materials: materialsData };
            })
          );

          setSections(sectionsWithMaterials);

          const totalMaterials = sectionsWithMaterials.reduce(
            (sum, section) => sum + section.materials.length,
            0
          );
         
          const curriculumRef = doc(db, "curriculums", id);
          await updateDoc(curriculumRef, {
            sections: sectionsWithMaterials.length,
            materials: totalMaterials,
          });
        } catch (err) {
          // //console.error("Error fetching sections/materials:", err);
          setError("Failed to load sections or materials.");
        }
      },
      (err) => {
        // //console.error("Snapshot error:", err);
        setError("Error syncing data. Check your connection.");
      }
    );

    return () => unsubscribe();
  }, [id]);

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const toggleSectionDropdown = (sectionId) => {
    setSectionDropdownOpen(sectionDropdownOpen === sectionId ? null : sectionId);
    setMaterialDropdownOpen(null);
  };

  const toggleMaterialDropdown = (materialId) => {
    setMaterialDropdownOpen(materialDropdownOpen === materialId ? null : materialId);
    setSectionDropdownOpen(null);
  };

  const handleAddSection = () => {
    setSectionToEdit(null);
    setIsSectionModalOpen(true);
  };

  const handleEditSection = (section) => {
    setSectionToEdit(section);
    setIsSectionModalOpen(true);
    setSectionDropdownOpen(null);
  };

  const handleDeleteSection = async (sectionId) => {
    if (!window.confirm("Are you sure you want to delete this section and all its materials?"))
      return;

    try {
      const materialsSnapshot = await new Promise((resolve) => {
        onSnapshot(
          collection(db, `curriculums/${id}/sections/${sectionId}/materials`),
          (snap) => {
            resolve(snap);
          },
          (err) => {
            // //console.error(`Error fetching materials for section ${sectionId}:`, err);
            resolve(null);
          }
        );
      });

      if (!materialsSnapshot) {
        throw new Error(`Failed to fetch materials for section ${sectionId}`);
      }

      const materials = materialsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
      const region = import.meta.env.VITE_AWS_REGION;

      for (const material of materials) {
        if (material.url && !material.url.includes("youtube.com")) {
          try {
            const urlParts = material.url.split(
              `https://${bucketName}.s3.${region}.amazonaws.com/`
            );
            if (urlParts.length <= 1) {
              console.warn(`Invalid S3 URL for material ${material.id}: ${material.url}`);
              continue;
            }
            const fileKey = decodeURIComponent(urlParts[1]);
            const params = { Bucket: bucketName, Key: fileKey };
            await s3Client.send(new DeleteObjectCommand(params));
          } catch (s3Error) {
            // //console.error(`Error deleting S3 file for material ${material.id}:`, s3Error);
            throw new Error(`S3 deletion failed for material ${material.id}: ${s3Error.message}`);
          }
        }
        const materialRef = doc(
          db,
          `curriculums/${id}/sections/${sectionId}/materials`,
          material.id
        );
        await deleteDoc(materialRef);
      }

      const sectionRef = doc(db, `curriculums/${id}/sections`, sectionId);
      await deleteDoc(sectionRef);

      await logActivity("Deleted section", {
        sectionId,
        sectionName: sections.find((s) => s.id === sectionId)?.name || "Unknown",
        materialsDeleted: materials.length,
      });
    } catch (error) {
      // //console.error("Error deleting section:", error);
      alert(`Failed to delete section: ${error.message}`);
    }
  };

  const handleCloseSectionModal = () => {
    setIsSectionModalOpen(false);
    setSectionToEdit(null);
  };

  const handleAddMaterial = (sectionId) => {
    setSelectedSectionId(sectionId);
    setIsMaterialModalOpen(true);
  };

  const handleCloseMaterialModal = () => {
    setIsMaterialModalOpen(false);
    setSelectedSectionId(null);
  };

  const handlePreviewMaterial = async (material) => {
    try {
      let url = material.url;
      if (material.url && !material.url.includes("youtube.com")) {
        const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
        const region = import.meta.env.VITE_AWS_REGION;
        const urlParts = material.url.split(
          `https://${bucketName}.s3.${region}.amazonaws.com/`
        );
        if (urlParts.length <= 1) {
          throw new Error(`Invalid S3 URL: ${material.url}`);
        }
        const fileKey = decodeURIComponent(urlParts[1]);
        const params = { Bucket: bucketName, Key: fileKey };
        url = await getSignedUrl(s3Client, new GetObjectCommand(params), {
          expiresIn: 900,
        });
      }
      window.open(url, "_blank");
      await logActivity("Opened material", {
        materialId: material.id,
        materialName: material.name,
        materialType: material.type,
      });
    } catch (error) {
      // //console.error("Error opening material:", error);
      alert("Failed to open material: " + error.message);
    }
  };

  const handleDeleteMaterial = async (sectionId, materialId, materialUrl) => {
    if (!window.confirm("Are you sure you want to delete this material?")) return;

    try {
      const materialRef = doc(
        db,
        `curriculums/${id}/sections/${sectionId}/materials`,
        materialId
      );
      await deleteDoc(materialRef);

      if (materialUrl && !materialUrl.includes("youtube.com")) {
        try {
          const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
          const region = import.meta.env.VITE_AWS_REGION;
          const urlParts = materialUrl.split(
            `https://${bucketName}.s3.${region}.amazonaws.com/`
          );
          if (urlParts.length <= 1) {
            console.warn(`Invalid S3 URL for material ${materialId}: ${materialUrl}`);
          } else {
            const fileKey = decodeURIComponent(urlParts[1]);
            const params = { Bucket: bucketName, Key: fileKey };
            await s3Client.send(new DeleteObjectCommand(params));
          }
        } catch (s3Error) {
          // //console.error("S3 deletion error:", s3Error);
          throw new Error(`S3 deletion failed: ${s3Error.message}`);
        }
      }

      await logActivity("Deleted material", {
        materialId,
        materialName:
          sections
            .find((s) => s.id === sectionId)
            ?.materials?.find((m) => m.id === materialId)?.name || "Unknown",
        materialType:
          sections
            .find((s) => s.id === sectionId)
            ?.materials?.find((m) => m.id === materialId)?.type || "Unknown",
      });

      setMaterialDropdownOpen(null);
    } catch (error) {
      // //console.error("Error deleting material:", error);
      alert(`Failed to delete material: ${error.message}`);
    }
  };

  const handleCloneSection = () => {
    alert("Clone Section functionality to be implemented!");
  };

  const handleRearrangeSections = () => {
    alert("Rearrange Sections functionality to be implemented!");
  };

  const handleBack = () => {
    navigate("/curriculum");
  };

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  if (!curriculum) {
    return <div className="p-6 text-center text-gray-600">No curriculum data available.</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4 fixed inset-0 left-[300px] overflow-auto">
      <div className="flex items-center mb-4">
        <button
          onClick={handleBack}
          className="text-gray-600 hover:text-gray-800 text-2xl mr-4"
          aria-label="Back to curriculum list"
        >
          ←
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Create and Edit Your Curriculum</h2>
      </div>
      <p className="text-sm text-gray-600 mb-6">{curriculum.name || "Unnamed Curriculum"}</p>

   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
  <span className="text-sm text-gray-600 font-medium">
    Sections: {sections.length}, Materials: {curriculum.materials || 0}
  </span>
  <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full sm:w-auto">
    <button
      onClick={handleCloneSection}
      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 hover:shadow-sm transition-shadow duration-200"
      aria-label="Clone Section"
    >
      <span role="img" aria-hidden="true">🗂</span> Clone Section
    </button>
    <button
      onClick={handleRearrangeSections}
      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 hover:shadow-sm transition-shadow duration-200"
      aria-label="Rearrange Sections"
    >
      <span role="img" aria-hidden="true">⇅</span> Rearrange Sections
    </button>
    <button
      onClick={handleAddSection}
      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shadow-md transition duration-200"
      aria-label="Add Section"
    >
      + Add Section
    </button>
  </div>
</div>


      {sections.length > 0 ? (
        <div className="space-y-4">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="bg-white rounded-lg shadow-md overflow-visible relative"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-4 flex-1">
                  <span
                    onClick={() => toggleSection(section.id)}
                    className="text-gray-600 cursor-pointer"
                    aria-label={`Toggle section ${section.name}`}
                  >
                    {expandedSections[section.id] ? "▼" : "▶"}
                  </span>
                  <span className="text-gray-700 font-medium">{index + 1}</span>
                  <h4 className="text-gray-900 font-semibold">{section.name}</h4>
                  <span className="text-sm text-gray-500">
                    {section.materials.length} material(s)
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleAddMaterial(section.id)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    + Add Material
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => toggleSectionDropdown(section.id)}
                      className="text-gray-600 hover:text-gray-800 text-lg"
                      aria-label="Section options"
                    >
                      ⋮
                    </button>
                    {sectionDropdownOpen === section.id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-[999999]">
                        <button
                          onClick={() => handleEditSection(section)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSection(section.id)}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {expandedSections[section.id] && (
                <div className="p-4">
                  {section.materials.length > 0 ? (
                    section.materials.map((material, materialIndex) => (
                      <div
                        key={material.id}
                        className="flex items-center justify-between p-2 border-b border-gray-200 hover:bg-gray-50"
                      >
                        <p
                          onClick={() => handlePreviewMaterial(material)}
                          className="text-gray-700 cursor-pointer hover:text-indigo-600 flex-1"
                        >
                          {material.name}
                        </p>
                        <div className="relative">
                          <button
                            onClick={() => toggleMaterialDropdown(material.id)}
                            className="text-gray-600 hover:text-gray-800 text-lg"
                            aria-label="Material options"
                          >
                            ⋮
                          </button>
                          {materialDropdownOpen === material.id && (
                            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-[999999]">
                              <button
                                onClick={() =>
                                  handleDeleteMaterial(section.id, material.id, material.url)
                                }
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm italic">No materials added here</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-md flex flex-col justify-center items-center gap-1">
              <div className="w-8 h-1 bg-gray-400"></div>
              <div className="w-8 h-1 bg-gray-400"></div>
              <div className="w-8 h-1 bg-gray-400"></div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Start by adding your first section
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Ready to create? Start shaping your curriculum. Add the first section to begin
          </p>
          <button
            onClick={handleAddSection}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            + Add Section
          </button>
        </div>
      )}

      <AddSectionModal
        isOpen={isSectionModalOpen}
        onClose={handleCloseSectionModal}
        curriculumId={id}
        sectionToEdit={sectionToEdit}
        logActivity={logActivity}
      />
      <AddMaterialModal
        isOpen={isMaterialModalOpen}
        onClose={handleCloseMaterialModal}
        curriculumId={id}
        sectionId={selectedSectionId}
        allowedMaterialTypes={allowedMaterialTypes}
        logActivity={logActivity}
      />
    </div>
  );
};

export default EditCurriculum;