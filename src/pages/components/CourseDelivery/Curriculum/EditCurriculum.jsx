

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
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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
  const [materialToEdit, setMaterialToEdit] = useState(null);
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
    "Quiz",
    "Feedback",
  ];

  const logActivity = async (action, details) => {
    if (!user) return;
    try {
      await addDoc(collection(db, "activityLogs"), {
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
      setError("Failed to log activity.");
    }
  };

  useEffect(() => {
    const fetchCurriculum = async () => {
      if (!id) {
        setError("Invalid curriculum ID");
        navigate("/curriculum");
        return;
      }

      try {
        const docRef = doc(db, "curriculums", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCurriculum({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Curriculum not found");
          navigate("/curriculum");
        }
      } catch (err) {
        setError("Failed to load curriculum.");
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
              const materialsData = materialsSnapshot.docs
                .map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                }))
                .sort((a, b) => a.order - b.order); // Sort by order field
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
          setError("Failed to load sections or materials.");
        }
      },
      (err) => {
        setError("Error syncing data.");
      }
    );

    return () => unsubscribe();
  }, [id]);

  const onDragEnd = async (result) => {
    const { source, destination } = result;

    if (!destination) return;

    try {
      const sourceSectionId = source.droppableId;
      const destSectionId = destination.droppableId;
      const sourceIndex = source.index;
      const destIndex = destination.index;

      setSections((prevSections) => {
        const newSections = [...prevSections];
        const sourceSection = newSections.find((s) => s.id === sourceSectionId);
        const destSection = newSections.find((s) => s.id === destSectionId);

        // Remove material from source section
        const [movedMaterial] = sourceSection.materials.splice(sourceIndex, 1);

        if (sourceSectionId === destSectionId) {
          // Reorder within the same section
          sourceSection.materials.splice(destIndex, 0, movedMaterial);
        } else {
          // Move to a different section
          destSection.materials.splice(destIndex, 0, movedMaterial);
        }

        // Update order fields
        sourceSection.materials.forEach((material, index) => {
          material.order = index;
        });
        if (sourceSectionId !== destSectionId) {
          destSection.materials.forEach((material, index) => {
            material.order = index;
          });
        }

        return newSections;
      });

      // Update Firestore
      if (sourceSectionId === destSectionId) {
        // Update order in the same section
        const section = sections.find((s) => s.id === sourceSectionId);
        for (let i = 0; i < section.materials.length; i++) {
          const materialRef = doc(
            db,
            `curriculums/${id}/sections/${sourceSectionId}/materials`,
            section.materials[i].id
          );
          await updateDoc(materialRef, { order: i });
        }
      } else {
        // Move material to a new section
        const material = sections
          .find((s) => s.id === sourceSectionId)
          .materials[sourceIndex];
        const materialData = { ...material, order: destIndex };

        // Delete from source section
        const sourceMaterialRef = doc(
          db,
          `curriculums/${id}/sections/${sourceSectionId}/materials`,
          material.id
        );
        await deleteDoc(sourceMaterialRef);

        // Add to destination section
        await addDoc(
          collection(db, `curriculums/${id}/sections/${destSectionId}/materials`),
          materialData
        );

        // Update order for destination section
        const destSection = sections.find((s) => s.id === destSectionId);
        for (let i = 0; i < destSection.materials.length; i++) {
          const materialRef = doc(
            db,
            `curriculums/${id}/sections/${destSectionId}/materials`,
            destSection.materials[i].id
          );
          await updateDoc(materialRef, { order: i });
        }
      }

      await logActivity("Reordered material", {
        materialId: result.draggableId,
        sourceSectionId,
        destSectionId,
        sourceIndex,
        destIndex,
      });
    } catch (err) {
      setError("Failed to reorder materials.");
    }
  };

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
          (snap) => resolve(snap)
        );
      });

      const materials = materialsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
      const region = import.meta.env.VITE_AWS_REGION;

      for (const material of materials) {
        if (material.url && !material.url.includes("youtube.com")) {
          const urlParts = material.url.split(
            `https://${bucketName}.s3.${region}.amazonaws.com/`
          );
          if (urlParts.length > 1) {
            const fileKey = decodeURIComponent(urlParts[1]);
            await s3Client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: fileKey }));
          }
        }
        await deleteDoc(
          doc(db, `curriculums/${id}/sections/${sectionId}/materials`, material.id)
        );
      }

      await deleteDoc(doc(db, `curriculums/${id}/sections`, sectionId));
      await logActivity("Deleted section", {
        sectionId,
        sectionName: sections.find((s) => s.id === sectionId)?.name || "Unknown",
        materialsDeleted: materials.length,
      });
    } catch (error) {
      setError(`Failed to delete section: ${error.message}`);
    }
  };

  const handleCloseSectionModal = () => {
    setIsSectionModalOpen(false);
    setSectionToEdit(null);
  };

  const handleAddMaterial = (sectionId) => {
    setSelectedSectionId(sectionId);
    setMaterialToEdit(null);
    setIsMaterialModalOpen(true);
  };

  const handleEditMaterial = (sectionId, material) => {
    setSelectedSectionId(sectionId);
    setMaterialToEdit(material);
    setIsMaterialModalOpen(true);
    setMaterialDropdownOpen(null);
  };

  const handleCloseMaterialModal = () => {
    setIsMaterialModalOpen(false);
    setSelectedSectionId(null);
    setMaterialToEdit(null);
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
        url = await getSignedUrl(
          s3Client,
          new GetObjectCommand({ Bucket: bucketName, Key: fileKey }),
          { expiresIn: 900 }
        );
      }
      window.open(url, "_blank");
      await logActivity("Opened material", {
        materialId: material.id,
        materialName: material.name,
        materialType: material.type,
      });
    } catch (error) {
      setError("Failed to open material.");
    }
  };

  const handleDeleteMaterial = async (sectionId, materialId, materialUrl) => {
    if (!window.confirm("Are you sure you want to delete this material?")) return;

    try {
      await deleteDoc(
        doc(db, `curriculums/${id}/sections/${sectionId}/materials`, materialId)
      );

      if (materialUrl && !materialUrl.includes("youtube.com")) {
        const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
        const region = import.meta.env.VITE_AWS_REGION;
        const urlParts = materialUrl.split(
          `https://${bucketName}.s3.${region}.amazonaws.com/`
        );
        if (urlParts.length > 1) {
          const fileKey = decodeURIComponent(urlParts[1]);
          await s3Client.send(
            new DeleteObjectCommand({ Bucket: bucketName, Key: fileKey })
          );
        }
      }

      await logActivity("Deleted material", {
        materialId,
        materialName:
          sections
            .find((s) => s.id === sectionId)
            ?.materials.find((m) => m.id === materialId)?.name || "Unknown",
        materialType:
          sections
            .find((s) => s.id === sectionId)
            ?.materials.find((m) => m.id === materialId)?.type || "Unknown",
      });

      setMaterialDropdownOpen(null);
    } catch (error) {
      setError(`Failed to delete material: ${error.message}`);
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

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  if (!curriculum) {
    return <div className="p-6 text-center text-gray-600">No curriculum data available.</div>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
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

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <span className="text-sm text-gray-700 mb-4 sm:mb-0">
            Sections: {sections.length}, Materials: {curriculum.materials || 0}
          </span>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* <button
              onClick={handleCloneSection}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              🗂 Clone Section
            </button> */}
            {/* <button
              onClick={handleRearrangeSections}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              ⇅ Rearrange Sections
            </button> */}
            <button
              onClick={handleAddSection}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
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
                  <Droppable droppableId={section.id}>
                    {(provided) => (
                      <div
                        className="p-4"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {section.materials.length > 0 ? (
                          section.materials.map((material, materialIndex) => (
                            <Draggable
                              key={material.id}
                              draggableId={material.id}
                              index={materialIndex}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
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
                                          onClick={() => handleEditMaterial(section.id, material)}
                                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                          Edit
                                        </button>
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
                              )}
                            </Draggable>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm italic">No materials added here</p>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
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
          materialToEdit={materialToEdit}
          logActivity={logActivity}
        />
      </div>
    </DragDropContext>
  );
};

export default EditCurriculum;