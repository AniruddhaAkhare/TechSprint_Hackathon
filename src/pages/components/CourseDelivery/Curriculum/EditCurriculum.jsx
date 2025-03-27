
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../../../config/firebase';
import { doc, getDoc, collection, onSnapshot, updateDoc, deleteDoc } from 'firebase/firestore';
import { s3Client } from '../../../../config/aws-config';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import AddSectionModal from './AddSectionalModel';
import AddMaterialModal from './AddMaterialModal';
// import { Document, Page, pdfjs } from 'react-pdf';
import {Document, Page, pdfjs} from 'react-pdf'

// Set the worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const EditCurriculum = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [curriculum, setCurriculum] = useState(null);
  const [sections, setSections] = useState([]);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [sectionToEdit, setSectionToEdit] = useState(null); // Track section to edit
  const [expandedSections, setExpandedSections] = useState({});
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewError, setPreviewError] = useState(null);
  const [sectionDropdownOpen, setSectionDropdownOpen] = useState(null); // Track section dropdown
  const [materialDropdownOpen, setMaterialDropdownOpen] = useState(null); // Track material dropdown

  // Fetch curriculum data
  useEffect(() => {
    const fetchCurriculum = async () => {
      const docRef = doc(db, 'curriculums', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCurriculum({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log('No such curriculum!');
        navigate('/');
      }
    };
    fetchCurriculum();
  }, [id, navigate]);

  // Fetch sections and their materials in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, `curriculums/${id}/sections`), (snapshot) => {
      const sectionData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        materials: [],
      }));

      const fetchMaterials = async () => {
        const sectionsWithMaterials = await Promise.all(
          sectionData.map(async (section) => {
            const materialsSnapshot = await new Promise((resolve) => {
              onSnapshot(collection(db, `curriculums/${id}/sections/${section.id}/materials`), (snap) => {
                resolve(snap);
              });
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
        const curriculumRef = doc(db, 'curriculums', id);
        updateDoc(curriculumRef, {
          sections: sectionsWithMaterials.length,
          materials: totalMaterials,
        });
      };

      fetchMaterials();
    });

    return () => unsubscribe();
  }, [id]);

  if (!curriculum) return <div>Loading...</div>;

  // Toggle section expansion
  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Toggle dropdown for sections
  const toggleSectionDropdown = (sectionId) => {
    setSectionDropdownOpen(sectionDropdownOpen === sectionId ? null : sectionId);
    setMaterialDropdownOpen(null); // Close material dropdown if open
  };

  // Toggle dropdown for materials
  const toggleMaterialDropdown = (materialId) => {
    setMaterialDropdownOpen(materialDropdownOpen === materialId ? null : materialId);
    setSectionDropdownOpen(null); // Close section dropdown if open
  };

  // Open the section modal for adding
  const handleAddSection = () => {
    setSectionToEdit(null); // Clear any existing section data for adding new
    setIsSectionModalOpen(true);
  };

  // Open the section modal for editing
  const handleEditSection = (section) => {
    setSectionToEdit(section);
    setIsSectionModalOpen(true);
    setSectionDropdownOpen(null);
  };

  // Delete a section and its materials
  const handleDeleteSection = async (sectionId) => {
    if (!window.confirm('Are you sure you want to delete this section and all its materials?')) return;

    try {
      // Fetch all materials in the section
      const materialsSnapshot = await new Promise((resolve) => {
        onSnapshot(collection(db, `curriculums/${id}/sections/${sectionId}/materials`), (snap) => {
          resolve(snap);
        });
      });
      const materials = materialsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Delete each material and its S3 file
      const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
      for (const material of materials) {
        if (material.url) {
          const fileKey = material.url.split(`https://${bucketName}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/`)[1];
          const params = {
            Bucket: bucketName,
            Key: fileKey,
          };
          await s3Client.send(new DeleteObjectCommand(params));
          console.log('File deleted from S3:', fileKey);
        }
        const materialRef = doc(db, `curriculums/${id}/sections/${sectionId}/materials`, material.id);
        await deleteDoc(materialRef);
        console.log('Material deleted from Firestore:', material.id);
      }

      // Delete the section
      const sectionRef = doc(db, `curriculums/${id}/sections`, sectionId);
      await deleteDoc(sectionRef);
      console.log('Section deleted from Firestore:', sectionId);
    } catch (error) {
      console.error('Error deleting section:', error);
      alert('Failed to delete section. Please try again.');
    }
  };

  // Close the section modal
  const handleCloseSectionModal = () => {
    setIsSectionModalOpen(false);
    setSectionToEdit(null);
  };

  // Open the material modal for adding
  const handleAddMaterial = (sectionId) => {
    setSelectedSectionId(sectionId);
    setIsMaterialModalOpen(true);
  };

  // Close the material modal
  const handleCloseMaterialModal = () => {
    setIsMaterialModalOpen(false);
    setSelectedSectionId(null);
  };

  // Open the preview modal
  const handlePreviewMaterial = (material) => {
    console.log('Previewing material:', material);
    setSelectedMaterial(material);
    setPreviewError(null);
    setIsPreviewModalOpen(true);
  };

  // Close the preview modal
  const handleClosePreviewModal = () => {
    setSelectedMaterial(null);
    setIsPreviewModalOpen(false);
    setPreviewError(null);
  };

  // Delete a material
  const handleDeleteMaterial = async (sectionId, materialId, materialUrl) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;

    try {
      const materialRef = doc(db, `curriculums/${id}/sections/${sectionId}/materials`, materialId);
      await deleteDoc(materialRef);
      console.log('Material deleted from Firestore:', materialId);

      if (materialUrl) {
        const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
        const fileKey = materialUrl.split(`https://${bucketName}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/`)[1];
        const params = {
          Bucket: bucketName,
          Key: fileKey,
        };
        await s3Client.send(new DeleteObjectCommand(params));
        console.log('File deleted from S3:', fileKey);
      }
    } catch (error) {
      console.error('Error deleting material:', error);
      alert('Failed to delete material. Please try again.');
    }
  };

  // Handle cloning a section (placeholder function)
  const handleCloneSection = () => {
    alert('Clone Section functionality to be implemented!');
  };

  // Handle rearranging sections (placeholder function)
  const handleRearrangeSections = () => {
    alert('Rearrange Sections functionality to be implemented!');
  };

  // Handle going back to the curriculum table
  const handleBack = () => {
    navigate('/curriculum');
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={handleBack} style={styles.backButton}>
          ←
        </button>
        <h2 style={styles.title}>Create and Edit Your Curriculum</h2>
      </div>
      <p style={styles.subTitle}>{curriculum.name}</p>

      {/* Section Info and Actions */}
      <div style={styles.sectionInfo}>
        <span style={styles.sectionCount}>
          Sections {sections.length} Sections, {curriculum.materials || 0} materials
        </span>
        <div style={styles.actions}>
          <button onClick={handleCloneSection} style={styles.actionButton}>
            🗂 Clone Section
          </button>
          <button onClick={handleRearrangeSections} style={styles.actionButton}>
            ⇅ Rearrange sections
          </button>
          <button onClick={handleAddSection} style={styles.addButton}>
            + Add Section
          </button>
        </div>
      </div>

      {/* Display Sections or Placeholder */}
      {sections.length > 0 ? (
        <div style={styles.sectionsList}>
          {sections.map((section, index) => (
            <div key={section.id} style={styles.sectionItem}>
              <div style={styles.sectionHeader}>
                <span style={styles.sectionCaret} onClick={() => toggleSection(section.id)}>
                  {expandedSections[section.id] ? '▼' : '▶'}
                </span>
                <span style={styles.sectionNumber}>{index + 1}</span>
                <h4 style={styles.sectionTitle}>{section.name}</h4>
                <span style={styles.materialCount}>
                  {section.materials.length} material(s)
                </span>
                <button
                  onClick={() => handleAddMaterial(section.id)}
                  style={styles.addMaterialButton}
                >
                  + Add Material
                </button>
                <div style={styles.actionContainer}>
                  <button
                    style={styles.actionButton}
                    onClick={() => toggleSectionDropdown(section.id)}
                  >
                    ⋮
                  </button>
                  {sectionDropdownOpen === section.id && (
                    <div style={styles.dropdown}>
                      <button
                        style={styles.dropdownButton}
                        onClick={() => handleEditSection(section)}
                      >
                        Edit
                      </button>
                      <button
                        style={{ ...styles.dropdownButton, color: '#dc3545' }}
                        onClick={() => handleDeleteSection(section.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {expandedSections[section.id] && (
                <div style={styles.sectionContent}>
                  {section.materials.length > 0 ? (
                    section.materials.map((material) => (
                      <div key={material.id} style={styles.materialItem}>
                        <div style={styles.materialContent}>
                          <p
                            style={styles.materialName}
                            onClick={() => handlePreviewMaterial(material)}
                          >
                            {material.name}
                          </p>
                          <div style={styles.actionContainer}>
                            <button
                              style={styles.actionButton}
                              onClick={() => toggleMaterialDropdown(material.id)}
                            >
                              ⋮
                            </button>
                            {materialDropdownOpen === material.id && (
                              <div style={styles.dropdown}>
                                <button
                                  style={{ ...styles.dropdownButton, color: '#dc3545' }}
                                  onClick={() =>
                                    handleDeleteMaterial(section.id, material.id, material.url)
                                  }
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={styles.noMaterials}>No materials added here</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.placeholder}>
          <div style={styles.icon}>
            <div style={styles.iconBox}>
              <div style={styles.iconLine}></div>
              <div style={styles.iconLine}></div>
              <div style={styles.iconLine}></div>
            </div>
          </div>
          <h3 style={styles.placeholderTitle}>Start by adding your first section</h3>
          <p style={styles.placeholderText}>
            Ready to create? Start shaping your curriculum. Add the first section to begin
          </p>
          <button onClick={handleAddSection} style={styles.addButton}>
            + Add Section
          </button>
        </div>
      )}

      {/* Add/Edit Section Modal */}
      <AddSectionModal
        isOpen={isSectionModalOpen}
        onClose={handleCloseSectionModal}
        curriculumId={id}
        sectionToEdit={sectionToEdit}
      />

      {/* Add Material Modal */}
      <AddMaterialModal
        isOpen={isMaterialModalOpen}
        onClose={handleCloseMaterialModal}
        curriculumId={id}
        sectionId={selectedSectionId}
      />

      {/* Preview Material Modal */}
      {isPreviewModalOpen && selectedMaterial && (
        <div style={styles.previewModalOverlay}>
          <div style={styles.previewModal}>
            <div style={styles.previewModalHeader}>
              <h3>Preview Material</h3>
              <button onClick={handleClosePreviewModal} style={styles.closeButton}>
                ✕
              </button>
            </div>
            <div style={styles.previewModalContent}>
              <h4>{selectedMaterial.name}</h4>
              {selectedMaterial.description && (
                <p style={styles.previewDescription}>{selectedMaterial.description}</p>
              )}
              {selectedMaterial.url ? (
                <>
                  {selectedMaterial.type === 'Video' ? (
                    <video
                      controls
                      style={styles.previewVideo}
                      src={selectedMaterial.url}
                      onError={(e) => {
                        console.error('Video load error:', e);
                        setPreviewError('Failed to load video. Check the URL or file access permissions.');
                      }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : selectedMaterial.type === 'PDF' ? (
                    <Document
                      file={selectedMaterial.url}
                      onLoadError={(error) => {
                        console.error('PDF load error:', error);
                        setPreviewError('Failed to load PDF. Check the URL or file access permissions.');
                      }}
                    >
                      <Page pageNumber={1} width={500} />
                    </Document>
                  ) : (
                    <p>
                      <a href={selectedMaterial.url} target="_blank" rel="noopener noreferrer">
                        View File
                      </a>
                    </p>
                  )}
                </>
              ) : (
                <p>No file URL available for preview.</p>
              )}
              {previewError && <p style={styles.errorMessage}>{previewError}</p>}
              <p><strong>Type:</strong> {selectedMaterial.type}</p>
              <p><strong>Max Views:</strong> {selectedMaterial.maxViews || 'Unlimited'}</p>
              <p><strong>Prerequisite:</strong> {selectedMaterial.isPrerequisite ? 'Yes' : 'No'}</p>
              <p><strong>Allow Download:</strong> {selectedMaterial.allowDownload ? 'Yes' : 'No'}</p>
              <p><strong>Access On:</strong> {selectedMaterial.accessOn}</p>
              <p><strong>URL:</strong> <a href={selectedMaterial.url} target="_blank" rel="noopener noreferrer">{selectedMaterial.url}</a></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Inline styles (unchanged)
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  backButton: {
    background: 'none',
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '5px 10px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '20px',
  },
  sectionInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  sectionCount: {
    fontSize: '14px',
    color: '#666',
  },
  actions: {
    display: 'flex',
    gap: '10px',
  },
  actionButton: {
    padding: '5px 15px',
    backgroundColor: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  addButton: {
    padding: '5px 15px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  placeholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50vh',
    textAlign: 'center',
  },
  icon: {
    marginBottom: '20px',
  },
  iconBox: {
    width: '100px',
    height: '100px',
    backgroundColor: '##f0f0f0',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '10px',
    padding: '10px',
  },
  iconLine: {
    width: '80%',
    height: '10px',
    backgroundColor: '#ddd',
    borderRadius: '5px',
  },
  placeholderTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  placeholderText: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '20px',
  },
  sectionsList: {
    marginTop: '20px',
  },
  sectionItem: {
    marginBottom: '10px',
    backgroundColor: '#f5f7fa',
    borderRadius: '5px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 15px',
    backgroundColor: '#f5f7fa',
    borderRadius: '5px',
  },
  sectionCaret: {
    cursor: 'pointer',
    marginRight: '10px',
  },
  sectionNumber: {
    marginRight: '10px',
    fontWeight: 'bold',
  },
  sectionTitle: {
    flex: 1,
    margin: 0,
    fontSize: '16px',
  },
  materialCount: {
    marginRight: '15px',
    fontSize: '14px',
    color: '#666',
  },
  addMaterialButton: {
    padding: '5px 10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  sectionContent: {
    padding: '15px',
    backgroundColor: '#fff',
    borderTop: '1px solid #ddd',
    borderRadius: '0 0 5px 5px',
  },
  noMaterials: {
    color: '#666',
    textAlign: 'center',
    margin: '0',
  },
  materialItem: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    marginBottom: '5px',
  },
  materialContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  materialName: {
    margin: '0',
    cursor: 'pointer',
    color: '#007bff',
    textDecoration: 'underline',
  },
  actionContainer: {
    position: 'relative',
  },
  dropdown: {
    position: 'absolute',
    right: '0',
    top: '20px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    zIndex: 10,
  },
  dropdownButton: {
    display: 'block',
    width: '100px',
    padding: '8px',
    background: 'none',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    color: '#000',
  },
  previewModalOverlay: {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  previewModal: {
    backgroundColor: '#fff',
    width: '600px',
    maxHeight: '80vh',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
    overflowY: 'auto',
  },
  previewModalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
  },
  previewModalContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  previewDescription: {
    color: '#666',
  },
  previewVideo: {
    width: '100%',
    maxHeight: '300px',
    borderRadius: '5px',
  },
  errorMessage: {
    color: 'red',
    fontSize: '14px',
  },
};

export default EditCurriculum;