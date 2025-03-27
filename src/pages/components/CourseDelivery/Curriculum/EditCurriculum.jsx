// // // // // // src/EditCurriculum.js
// // // // // import React from 'react';
// // // // // import { useParams, useNavigate } from 'react-router-dom';

// // // // // const EditCurriculum = () => {
// // // // //   const { id } = useParams(); // Get the curriculum ID from the URL
// // // // //   const navigate = useNavigate();

// // // // //   // Mock data for the curriculum (replace with actual data fetching from Firebase if needed)
// // // // //   const curriculum = {
// // // // //     id,
// // // // //     name: 'Samiksha Raut', // This should come from Firebase or props
// // // // //     sections: 0,
// // // // //     materials: 0,
// // // // //   };

// // // // //   // Handle adding a new section (placeholder function)
// // // // //   const handleAddSection = () => {
// // // // //     alert('Add Section functionality to be implemented!');
// // // // //   };

// // // // //   // Handle cloning a section (placeholder function)
// // // // //   const handleCloneSection = () => {
// // // // //     alert('Clone Section functionality to be implemented!');
// // // // //   };

// // // // //   // Handle rearranging sections (placeholder function)
// // // // //   const handleRearrangeSections = () => {
// // // // //     alert('Rearrange Sections functionality to be implemented!');
// // // // //   };

// // // // //   // Handle going back to the curriculum table
// // // // //   const handleBack = () => {
// // // // //     navigate('/');
// // // // //   };

// // // // //   return (
// // // // //     <div style={styles.container}>
// // // // //       {/* Header */}
// // // // //       <div style={styles.header}>
// // // // //         <button onClick={handleBack} style={styles.backButton}>
// // // // //           ←
// // // // //         </button>
// // // // //         <h2 style={styles.title}>Create and Edit Your Curriculum</h2>
// // // // //       </div>
// // // // //       <p style={styles.subTitle}>{curriculum.name}</p>

// // // // //       {/* Section Info and Actions */}
// // // // //       <div style={styles.sectionInfo}>
// // // // //         <span style={styles.sectionCount}>
// // // // //           Sections {curriculum.sections} Sections, {curriculum.materials} materials
// // // // //         </span>
// // // // //         <div style={styles.actions}>
// // // // //           <button onClick={handleCloneSection} style={styles.actionButton}>
// // // // //             🗂 Clone Section
// // // // //           </button>
// // // // //           <button onClick={handleRearrangeSections} style={styles.actionButton}>
// // // // //             ⇅ Rearrange sections
// // // // //           </button>
// // // // //           <button onClick={handleAddSection} style={styles.addButton}>
// // // // //             + Add Section
// // // // //           </button>
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* Placeholder for No Sections */}
// // // // //       <div style={styles.placeholder}>
// // // // //         <div style={styles.icon}>
// // // // //           {/* Simplified icon representation */}
// // // // //           <div style={styles.iconBox}>
// // // // //             <div style={styles.iconLine}></div>
// // // // //             <div style={styles.iconLine}></div>
// // // // //             <div style={styles.iconLine}></div>
// // // // //           </div>
// // // // //         </div>
// // // // //         <h3 style={styles.placeholderTitle}>Start by adding your first section</h3>
// // // // //         <p style={styles.placeholderText}>
// // // // //           Ready to create? Start shaping your curriculum. Add the first section to begin
// // // // //         </p>
// // // // //         <button onClick={handleAddSection} style={styles.addButton}>
// // // // //           + Add Section
// // // // //         </button>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // // Inline styles
// // // // // const styles = {
// // // // //   container: {
// // // // //     padding: '20px',
// // // // //     fontFamily: 'Arial, sans-serif',
// // // // //   },
// // // // //   header: {
// // // // //     display: 'flex',
// // // // //     alignItems: 'center',
// // // // //     marginBottom: '10px',
// // // // //   },
// // // // //   backButton: {
// // // // //     background: 'none',
// // // // //     border: '1px solid #ddd',
// // // // //     borderRadius: '5px',
// // // // //     padding: '5px 10px',
// // // // //     cursor: 'pointer',
// // // // //     marginRight: '10px',
// // // // //   },
// // // // //   title: {
// // // // //     fontSize: '24px',
// // // // //     fontWeight: 'bold',
// // // // //   },
// // // // //   subTitle: {
// // // // //     fontSize: '14px',
// // // // //     color: '#666',
// // // // //     marginBottom: '20px',
// // // // //   },
// // // // //   sectionInfo: {
// // // // //     display: 'flex',
// // // // //     justifyContent: 'space-between',
// // // // //     alignItems: 'center',
// // // // //     marginBottom: '20px',
// // // // //   },
// // // // //   sectionCount: {
// // // // //     fontSize: '14px',
// // // // //     color: '#666',
// // // // //   },
// // // // //   actions: {
// // // // //     display: 'flex',
// // // // //     gap: '10px',
// // // // //   },
// // // // //   actionButton: {
// // // // //     padding: '5px 15px',
// // // // //     backgroundColor: '#fff',
// // // // //     border: '1px solid #ddd',
// // // // //     borderRadius: '5px',
// // // // //     cursor: 'pointer',
// // // // //   },
// // // // //   addButton: {
// // // // //     padding: '5px 15px',
// // // // //     backgroundColor: '#007bff',
// // // // //     color: '#fff',
// // // // //     border: 'none',
// // // // //     borderRadius: '5px',
// // // // //     cursor: 'pointer',
// // // // //   },
// // // // //   placeholder: {
// // // // //     display: 'flex',
// // // // //     flexDirection: 'column',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     height: '50vh',
// // // // //     textAlign: 'center',
// // // // //   },
// // // // //   icon: {
// // // // //     marginBottom: '20px',
// // // // //   },
// // // // //   iconBox: {
// // // // //     width: '100px',
// // // // //     height: '100px',
// // // // //     backgroundColor: '#f0f0f0',
// // // // //     borderRadius: '10px',
// // // // //     display: 'flex',
// // // // //     flexDirection: 'column',
// // // // //     justifyContent: 'center',
// // // // //     gap: '10px',
// // // // //     padding: '10px',
// // // // //   },
// // // // //   iconLine: {
// // // // //     width: '80%',
// // // // //     height: '10px',
// // // // //     backgroundColor: '#ddd',
// // // // //     borderRadius: '5px',
// // // // //   },
// // // // //   placeholderTitle: {
// // // // //     fontSize: '18px',
// // // // //     fontWeight: 'bold',
// // // // //     marginBottom: '10px',
// // // // //   },
// // // // //   placeholderText: {
// // // // //     fontSize: '14px',
// // // // //     color: '#666',
// // // // //     marginBottom: '20px',
// // // // //   },
// // // // // };

// // // // // export default EditCurriculum;

// // // // // src/EditCurriculum.js
// // // // import React, { useState, useEffect } from 'react';
// // // // import { useParams, useNavigate } from 'react-router-dom';
// // // // import { db } from '../../../../config/firebase';
// // // // import { doc, getDoc, collection, onSnapshot, updateDoc } from 'firebase/firestore';
// // // // import AddSectionModal from './AddSectionalModel';

// // // // const EditCurriculum = () => {
// // // //   const { id } = useParams(); // Get the curriculum ID from the URL
// // // //   const navigate = useNavigate();
// // // //   const [curriculum, setCurriculum] = useState(null);
// // // //   const [sections, setSections] = useState([]);
// // // //   const [isModalOpen, setIsModalOpen] = useState(false);

// // // //   // Fetch curriculum data
// // // //   useEffect(() => {
// // // //     const fetchCurriculum = async () => {
// // // //       const docRef = doc(db, 'curriculums', id);
// // // //       const docSnap = await getDoc(docRef);
// // // //       if (docSnap.exists()) {
// // // //         setCurriculum({ id: docSnap.id, ...docSnap.data() });
// // // //       } else {
// // // //         console.log('No such curriculum!');
// // // //         navigate('/'); // Redirect if curriculum not found
// // // //       }
// // // //     };
// // // //     fetchCurriculum();
// // // //   }, [id, navigate]);

// // // //   // Fetch sections in real-time
// // // //   useEffect(() => {
// // // //     const unsubscribe = onSnapshot(collection(db, `curriculums/${id}/sections`), (snapshot) => {
// // // //       const sectionData = snapshot.docs.map((doc) => ({
// // // //         id: doc.id,
// // // //         ...doc.data(),
// // // //       }));
// // // //       setSections(sectionData);

// // // //       // Update the sections count in the curriculum document
// // // //       const curriculumRef = doc(db, 'curriculums', id);
// // // //       updateDoc(curriculumRef, { sections: sectionData.length });
// // // //     });
// // // //     return () => unsubscribe();
// // // //   }, [id]);

// // // //   if (!curriculum) return <div>Loading...</div>;

// // // //   // Open the modal
// // // //   const handleAddSection = () => {
// // // //     setIsModalOpen(true);
// // // //   };

// // // //   // Close the modal
// // // //   const handleCloseModal = () => {
// // // //     setIsModalOpen(false);
// // // //   };

// // // //   // Handle cloning a section (placeholder function)
// // // //   const handleCloneSection = () => {
// // // //     alert('Clone Section functionality to be implemented!');
// // // //   };

// // // //   // Handle rearranging sections (placeholder function)
// // // //   const handleRearrangeSections = () => {
// // // //     alert('Rearrange Sections functionality to be implemented!');
// // // //   };

// // // //   // Handle going back to the curriculum table
// // // //   const handleBack = () => {
// // // //     navigate('/');
// // // //   };

// // // //   return (
// // // //     <div style={styles.container}>
// // // //       {/* Header */}
// // // //       <div style={styles.header}>
// // // //         <button onClick={handleBack} style={styles.backButton}>
// // // //           ←
// // // //         </button>
// // // //         <h2 style={styles.title}>Create and Edit Your Curriculum</h2>
// // // //       </div>
// // // //       <p style={styles.subTitle}>{curriculum.name}</p>

// // // //       {/* Section Info and Actions */}
// // // //       <div style={styles.sectionInfo}>
// // // //         <span style={styles.sectionCount}>
// // // //           Sections {sections.length} Sections, {curriculum.materials || 0} materials
// // // //         </span>
// // // //         <div style={styles.actions}>
// // // //           <button onClick={handleCloneSection} style={styles.actionButton}>
// // // //             🗂 Clone Section
// // // //           </button>
// // // //           <button onClick={handleRearrangeSections} style={styles.actionButton}>
// // // //             ⇅ Rearrange sections
// // // //           </button>
// // // //           <button onClick={handleAddSection} style={styles.addButton}>
// // // //             + Add Section
// // // //           </button>
// // // //         </div>
// // // //       </div>

// // // //       {/* Display Sections or Placeholder */}
// // // //       {sections.length > 0 ? (
// // // //         <div style={styles.sectionsList}>
// // // //           {sections.map((section) => (
// // // //             <div key={section.id} style={styles.sectionItem}>
// // // //               <h4>{section.name}</h4>
// // // //               <p>{section.description || 'No description'}</p>
// // // //               {section.isPrerequisite && <span style={styles.prerequisiteTag}>Prerequisite</span>}
// // // //             </div>
// // // //           ))}
// // // //         </div>
// // // //       ) : (
// // // //         <div style={styles.placeholder}>
// // // //           <div style={styles.icon}>
// // // //             <div style={styles.iconBox}>
// // // //               <div style={styles.iconLine}></div>
// // // //               <div style={styles.iconLine}></div>
// // // //               <div style={styles.iconLine}></div>
// // // //             </div>
// // // //           </div>
// // // //           <h3 style={styles.placeholderTitle}>Start by adding your first section</h3>
// // // //           <p style={styles.placeholderText}>
// // // //             Ready to create? Start shaping your curriculum. Add the first section to begin
// // // //           </p>
// // // //           <button onClick={handleAddSection} style={styles.addButton}>
// // // //             + Add Section
// // // //           </button>
// // // //         </div>
// // // //       )}

// // // //       {/* Add Section Modal */}
// // // //       <AddSectionModal
// // // //         isOpen={isModalOpen}
// // // //         onClose={handleCloseModal}
// // // //         curriculumId={id}
// // // //       />
// // // //     </div>
// // // //   );
// // // // };

// // // // // Inline styles
// // // // const styles = {
// // // //   container: {
// // // //     padding: '20px',
// // // //     fontFamily: 'Arial, sans-serif',
// // // //   },
// // // //   header: {
// // // //     display: 'flex',
// // // //     alignItems: 'center',
// // // //     marginBottom: '10px',
// // // //   },
// // // //   backButton: {
// // // //     background: 'none',
// // // //     border: '1px solid #ddd',
// // // //     borderRadius: '5px',
// // // //     padding: '5px 10px',
// // // //     cursor: 'pointer',
// // // //     marginRight: '10px',
// // // //   },
// // // //   title: {
// // // //     fontSize: '24px',
// // // //     fontWeight: 'bold',
// // // //   },
// // // //   subTitle: {
// // // //     fontSize: '14px',
// // // //     color: '#666',
// // // //     marginBottom: '20px',
// // // //   },
// // // //   sectionInfo: {
// // // //     display: 'flex',
// // // //     justifyContent: 'space-between',
// // // //     alignItems: 'center',
// // // //     marginBottom: '20px',
// // // //   },
// // // //   sectionCount: {
// // // //     fontSize: '14px',
// // // //     color: '#666',
// // // //   },
// // // //   actions: {
// // // //     display: 'flex',
// // // //     gap: '10px',
// // // //   },
// // // //   actionButton: {
// // // //     padding: '5px 15px',
// // // //     backgroundColor: '#fff',
// // // //     border: '1px solid #ddd',
// // // //     borderRadius: '5px',
// // // //     cursor: 'pointer',
// // // //   },
// // // //   addButton: {
// // // //     padding: '5px 15px',
// // // //     backgroundColor: '#007bff',
// // // //     color: '#fff',
// // // //     border: 'none',
// // // //     borderRadius: '5px',
// // // //     cursor: 'pointer',
// // // //   },
// // // //   placeholder: {
// // // //     display: 'flex',
// // // //     flexDirection: 'column',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     height: '50vh',
// // // //     textAlign: 'center',
// // // //   },
// // // //   icon: {
// // // //     marginBottom: '20px',
// // // //   },
// // // //   iconBox: {
// // // //     width: '100px',
// // // //     height: '100px',
// // // //     backgroundColor: '#f0f0f0',
// // // //     borderRadius: '10px',
// // // //     display: 'flex',
// // // //     flexDirection: 'column',
// // // //     justifyContent: 'center',
// // // //     gap: '10px',
// // // //     padding: '10px',
// // // //   },
// // // //   iconLine: {
// // // //     width: '80%',
// // // //     height: '10px',
// // // //     backgroundColor: '#ddd',
// // // //     borderRadius: '5px',
// // // //   },
// // // //   placeholderTitle: {
// // // //     fontSize: '18px',
// // // //     fontWeight: 'bold',
// // // //     marginBottom: '10px',
// // // //   },
// // // //   placeholderText: {
// // // //     fontSize: '14px',
// // // //     color: '#666',
// // // //     marginBottom: '20px',
// // // //   },
// // // //   sectionsList: {
// // // //     marginTop: '20px',
// // // //   },
// // // //   sectionItem: {
// // // //     padding: '15px',
// // // //     border: '1px solid #ddd',
// // // //     borderRadius: '5px',
// // // //     marginBottom: '10px',
// // // //     backgroundColor: '#fff',
// // // //   },
// // // //   prerequisiteTag: {
// // // //     display: 'inline-block',
// // // //     backgroundColor: '#f0f0f0',
// // // //     padding: '2px 8px',
// // // //     borderRadius: '10px',
// // // //     fontSize: '12px',
// // // //     marginTop: '5px',
// // // //   },
// // // // };

// // // // export default EditCurriculum;


// // // // src/EditCurriculum.js
// // // import React, { useState, useEffect } from 'react';
// // // import { useParams, useNavigate } from 'react-router-dom';
// // // import { db } from '../../../../config/firebase'; // Adjust the path to your firebase.js file
// // // import { doc, getDoc, collection, onSnapshot, updateDoc } from 'firebase/firestore';
// // // import AddSectionModal from './AddSectionalModel'; // Adjust the path to your AddSectionModal

// // // const EditCurriculum = () => {
// // //   const { id } = useParams(); // Get the curriculum ID from the URL
// // //   const navigate = useNavigate();
// // //   const [curriculum, setCurriculum] = useState(null);
// // //   const [sections, setSections] = useState([]);
// // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // //   const [expandedSections, setExpandedSections] = useState({}); // Track which sections are expanded

// // //   // Fetch curriculum data
// // //   useEffect(() => {
// // //     const fetchCurriculum = async () => {
// // //       const docRef = doc(db, 'curriculums', id);
// // //       const docSnap = await getDoc(docRef);
// // //       if (docSnap.exists()) {
// // //         setCurriculum({ id: docSnap.id, ...docSnap.data() });
// // //       } else {
// // //         console.log('No such curriculum!');
// // //         navigate('/'); // Redirect if curriculum not found
// // //       }
// // //     };
// // //     fetchCurriculum();
// // //   }, [id, navigate]);

// // //   // Fetch sections and their materials in real-time
// // //   useEffect(() => {
// // //     const unsubscribe = onSnapshot(collection(db, `curriculums/${id}/sections`), (snapshot) => {
// // //       const sectionData = snapshot.docs.map((doc) => ({
// // //         id: doc.id,
// // //         ...doc.data(),
// // //         materials: [], // Initialize materials array
// // //       }));

// // //       // Fetch materials for each section
// // //       const fetchMaterials = async () => {
// // //         const sectionsWithMaterials = await Promise.all(
// // //           sectionData.map(async (section) => {
// // //             const materialsSnapshot = await new Promise((resolve) => {
// // //               onSnapshot(collection(db, `curriculums/${id}/sections/${section.id}/materials`), (snap) => {
// // //                 resolve(snap);
// // //               });
// // //             });
// // //             const materialsData = materialsSnapshot.docs.map((doc) => ({
// // //               id: doc.id,
// // //               ...doc.data(),
// // //             }));
// // //             return { ...section, materials: materialsData };
// // //           })
// // //         );

// // //         setSections(sectionsWithMaterials);

// // //         // Update the sections and materials count in the curriculum document
// // //         const totalMaterials = sectionsWithMaterials.reduce(
// // //           (sum, section) => sum + section.materials.length,
// // //           0
// // //         );
// // //         const curriculumRef = doc(db, 'curriculums', id);
// // //         updateDoc(curriculumRef, {
// // //           sections: sectionsWithMaterials.length,
// // //           materials: totalMaterials,
// // //         });
// // //       };

// // //       fetchMaterials();
// // //     });

// // //     return () => unsubscribe();
// // //   }, [id]);

// // //   if (!curriculum) return <div>Loading...</div>;

// // //   // Toggle section expansion
// // //   const toggleSection = (sectionId) => {
// // //     setExpandedSections((prev) => ({
// // //       ...prev,
// // //       [sectionId]: !prev[sectionId],
// // //     }));
// // //   };

// // //   // Open the modal
// // //   const handleAddSection = () => {
// // //     setIsModalOpen(true);
// // //   };

// // //   // Close the modal
// // //   const handleCloseModal = () => {
// // //     setIsModalOpen(false);
// // //   };

// // //   // Handle cloning a section (placeholder function)
// // //   const handleCloneSection = () => {
// // //     alert('Clone Section functionality to be implemented!');
// // //   };

// // //   // Handle rearranging sections (placeholder function)
// // //   const handleRearrangeSections = () => {
// // //     alert('Rearrange Sections functionality to be implemented!');
// // //   };

// // //   // Handle adding a material (placeholder function)
// // //   const handleAddMaterial = (sectionId) => {
// // //     alert(`Add Material functionality for section ${sectionId} to be implemented!`);
// // //   };

// // //   // Handle going back to the curriculum table
// // //   const handleBack = () => {
// // //     navigate('/');
// // //   };

// // //   return (
// // //     <div style={styles.container}>
// // //       {/* Header */}
// // //       <div style={styles.header}>
// // //         <button onClick={handleBack} style={styles.backButton}>
// // //           ←
// // //         </button>
// // //         <h2 style={styles.title}>Create and Edit Your Curriculum</h2>
// // //       </div>
// // //       <p style={styles.subTitle}>{curriculum.name}</p>

// // //       {/* Section Info and Actions */}
// // //       <div style={styles.sectionInfo}>
// // //         <span style={styles.sectionCount}>
// // //           Sections {sections.length} Sections, {curriculum.materials || 0} materials
// // //         </span>
// // //         <div style={styles.actions}>
// // //           <button onClick={handleCloneSection} style={styles.actionButton}>
// // //             🗂 Clone Section
// // //           </button>
// // //           <button onClick={handleRearrangeSections} style={styles.actionButton}>
// // //             ⇅ Rearrange sections
// // //           </button>
// // //           <button onClick={handleAddSection} style={styles.addButton}>
// // //             + Add Section
// // //           </button>
// // //         </div>
// // //       </div>

// // //       {/* Display Sections or Placeholder */}
// // //       {sections.length > 0 ? (
// // //         <div style={styles.sectionsList}>
// // //           {sections.map((section, index) => (
// // //             <div key={section.id} style={styles.sectionItem}>
// // //               <div style={styles.sectionHeader}>
// // //                 <span style={styles.sectionCaret} onClick={() => toggleSection(section.id)}>
// // //                   {expandedSections[section.id] ? '▼' : '▶'}
// // //                 </span>
// // //                 <span style={styles.sectionNumber}>{index + 1}</span>
// // //                 <h4 style={styles.sectionTitle}>{section.name}</h4>
// // //                 <span style={styles.materialCount}>
// // //                   {section.materials.length} material(s)
// // //                 </span>
// // //                 <button
// // //                   onClick={() => handleAddMaterial(section.id)}
// // //                   style={styles.addMaterialButton}
// // //                 >
// // //                   + Add Material
// // //                 </button>
// // //                 <button style={styles.actionButton}>⋮</button>
// // //               </div>
// // //               {expandedSections[section.id] && (
// // //                 <div style={styles.sectionContent}>
// // //                   {section.materials.length > 0 ? (
// // //                     section.materials.map((material) => (
// // //                       <div key={material.id} style={styles.materialItem}>
// // //                         <p>{material.name}</p>
// // //                       </div>
// // //                     ))
// // //                   ) : (
// // //                     <p style={styles.noMaterials}>No materials added here</p>
// // //                   )}
// // //                 </div>
// // //               )}
// // //             </div>
// // //           ))}
// // //         </div>
// // //       ) : (
// // //         <div style={styles.placeholder}>
// // //           <div style={styles.icon}>
// // //             <div style={styles.iconBox}>
// // //               <div style={styles.iconLine}></div>
// // //               <div style={styles.iconLine}></div>
// // //               <div style={styles.iconLine}></div>
// // //             </div>
// // //           </div>
// // //           <h3 style={styles.placeholderTitle}>Start by adding your first section</h3>
// // //           <p style={styles.placeholderText}>
// // //             Ready to create? Start shaping your curriculum. Add the first section to begin
// // //           </p>
// // //           <button onClick={handleAddSection} style={styles.addButton}>
// // //             + Add Section
// // //           </button>
// // //         </div>
// // //       )}

// // //       {/* Add Section Modal */}
// // //       <AddSectionModal
// // //         isOpen={isModalOpen}
// // //         onClose={handleCloseModal}
// // //         curriculumId={id}
// // //       />
// // //     </div>
// // //   );
// // // };

// // // // Inline styles
// // // const styles = {
// // //   container: {
// // //     padding: '20px',
// // //     fontFamily: 'Arial, sans-serif',
// // //   },
// // //   header: {
// // //     display: 'flex',
// // //     alignItems: 'center',
// // //     marginBottom: '10px',
// // //   },
// // //   backButton: {
// // //     background: 'none',
// // //     border: '1px solid #ddd',
// // //     borderRadius: '5px',
// // //     padding: '5px 10px',
// // //     cursor: 'pointer',
// // //     marginRight: '10px',
// // //   },
// // //   title: {
// // //     fontSize: '24px',
// // //     fontWeight: 'bold',
// // //   },
// // //   subTitle: {
// // //     fontSize: '14px',
// // //     color: '#666',
// // //     marginBottom: '20px',
// // //   },
// // //   sectionInfo: {
// // //     display: 'flex',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     marginBottom: '20px',
// // //   },
// // //   sectionCount: {
// // //     fontSize: '14px',
// // //     color: '#666',
// // //   },
// // //   actions: {
// // //     display: 'flex',
// // //     gap: '10px',
// // //   },
// // //   actionButton: {
// // //     padding: '5px 15px',
// // //     backgroundColor: '#fff',
// // //     border: '1px solid #ddd',
// // //     borderRadius: '5px',
// // //     cursor: 'pointer',
// // //   },
// // //   addButton: {
// // //     padding: '5px 15px',
// // //     backgroundColor: '#007bff',
// // //     color: '#fff',
// // //     border: 'none',
// // //     borderRadius: '5px',
// // //     cursor: 'pointer',
// // //   },
// // //   placeholder: {
// // //     display: 'flex',
// // //     flexDirection: 'column',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     height: '50vh',
// // //     textAlign: 'center',
// // //   },
// // //   icon: {
// // //     marginBottom: '20px',
// // //   },
// // //   iconBox: {
// // //     width: '100px',
// // //     height: '100px',
// // //     backgroundColor: '#f0f0f0',
// // //     borderRadius: '10px',
// // //     display: 'flex',
// // //     flexDirection: 'column',
// // //     justifyContent: 'center',
// // //     gap: '10px',
// // //     padding: '10px',
// // //   },
// // //   iconLine: {
// // //     width: '80%',
// // //     height: '10px',
// // //     backgroundColor: '#ddd',
// // //     borderRadius: '5px',
// // //   },
// // //   placeholderTitle: {
// // //     fontSize: '18px',
// // //     fontWeight: 'bold',
// // //     marginBottom: '10px',
// // //   },
// // //   placeholderText: {
// // //     fontSize: '14px',
// // //     color: '#666',
// // //     marginBottom: '20px',
// // //   },
// // //   sectionsList: {
// // //     marginTop: '20px',
// // //   },
// // //   sectionItem: {
// // //     marginBottom: '10px',
// // //     backgroundColor: '#f5f7fa',
// // //     borderRadius: '5px',
// // //   },
// // //   sectionHeader: {
// // //     display: 'flex',
// // //     alignItems: 'center',
// // //     padding: '10px 15px',
// // //     backgroundColor: '#f5f7fa',
// // //     borderRadius: '5px',
// // //   },
// // //   sectionCaret: {
// // //     cursor: 'pointer',
// // //     marginRight: '10px',
// // //   },
// // //   sectionNumber: {
// // //     marginRight: '10px',
// // //     fontWeight: 'bold',
// // //   },
// // //   sectionTitle: {
// // //     flex: 1,
// // //     margin: 0,
// // //     fontSize: '16px',
// // //   },
// // //   materialCount: {
// // //     marginRight: '15px',
// // //     fontSize: '14px',
// // //     color: '#666',
// // //   },
// // //   addMaterialButton: {
// // //     padding: '5px 10px',
// // //     backgroundColor: '#007bff',
// // //     color: '#fff',
// // //     border: 'none',
// // //     borderRadius: '5px',
// // //     cursor: 'pointer',
// // //     marginRight: '10px',
// // //   },
// // //   sectionContent: {
// // //     padding: '15px',
// // //     backgroundColor: '#fff',
// // //     borderTop: '1px solid #ddd',
// // //     borderRadius: '0 0 5px 5px',
// // //   },
// // //   noMaterials: {
// // //     color: '#666',
// // //     textAlign: 'center',
// // //     margin: 0,
// // //   },
// // //   materialItem: {
// // //     padding: '10px',
// // //     border: '1px solid #ddd',
// // //     borderRadius: '5px',
// // //     marginBottom: '5px',
// // //   },
// // // };

// // // export default EditCurriculum;


// // // src/EditCurriculum.js
// // import React, { useState, useEffect } from 'react';
// // import { useParams, useNavigate } from 'react-router-dom';
// // import { db } from '../../../../config/firebase'; // Adjust the path to your firebase.js file
// // import { doc, getDoc, collection, onSnapshot, updateDoc } from 'firebase/firestore';
// // import AddSectionModal from './AddSectionalModel'; // Adjust the path to your AddSectionModal
// // import AddMaterialModal from './AddMaterialModal'; // Import the new modal

// // const EditCurriculum = () => {
// //   const { id } = useParams(); // Get the curriculum ID from the URL
// //   const navigate = useNavigate();
// //   const [curriculum, setCurriculum] = useState(null);
// //   const [sections, setSections] = useState([]);
// //   const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
// //   const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
// //   const [selectedSectionId, setSelectedSectionId] = useState(null);
// //   const [expandedSections, setExpandedSections] = useState({}); // Track which sections are expanded

// //   // Fetch curriculum data
// //   useEffect(() => {
// //     const fetchCurriculum = async () => {
// //       const docRef = doc(db, 'curriculums', id);
// //       const docSnap = await getDoc(docRef);
// //       if (docSnap.exists()) {
// //         setCurriculum({ id: docSnap.id, ...docSnap.data() });
// //       } else {
// //         console.log('No such curriculum!');
// //         navigate('/'); // Redirect if curriculum not found
// //       }
// //     };
// //     fetchCurriculum();
// //   }, [id, navigate]);

// //   // Fetch sections and their materials in real-time
// //   useEffect(() => {
// //     const unsubscribe = onSnapshot(collection(db, `curriculums/${id}/sections`), (snapshot) => {
// //       const sectionData = snapshot.docs.map((doc) => ({
// //         id: doc.id,
// //         ...doc.data(),
// //         materials: [], // Initialize materials array
// //       }));

// //       // Fetch materials for each section
// //       const fetchMaterials = async () => {
// //         const sectionsWithMaterials = await Promise.all(
// //           sectionData.map(async (section) => {
// //             const materialsSnapshot = await new Promise((resolve) => {
// //               onSnapshot(collection(db, `curriculums/${id}/sections/${section.id}/materials`), (snap) => {
// //                 resolve(snap);
// //               });
// //             });
// //             const materialsData = materialsSnapshot.docs.map((doc) => ({
// //               id: doc.id,
// //               ...doc.data(),
// //             }));
// //             return { ...section, materials: materialsData };
// //           })
// //         );

// //         setSections(sectionsWithMaterials);

// //         // Update the sections and materials count in the curriculum document
// //         const totalMaterials = sectionsWithMaterials.reduce(
// //           (sum, section) => sum + section.materials.length,
// //           0
// //         );
// //         const curriculumRef = doc(db, 'curriculums', id);
// //         updateDoc(curriculumRef, {
// //           sections: sectionsWithMaterials.length,
// //           materials: totalMaterials,
// //         });
// //       };

// //       fetchMaterials();
// //     });

// //     return () => unsubscribe();
// //   }, [id]);

// //   if (!curriculum) return <div>Loading...</div>;

// //   // Toggle section expansion
// //   const toggleSection = (sectionId) => {
// //     setExpandedSections((prev) => ({
// //       ...prev,
// //       [sectionId]: !prev[sectionId],
// //     }));
// //   };

// //   // Open the section modal
// //   const handleAddSection = () => {
// //     setIsSectionModalOpen(true);
// //   };

// //   // Close the section modal
// //   const handleCloseSectionModal = () => {
// //     setIsSectionModalOpen(false);
// //   };

// //   // Open the material modal
// //   const handleAddMaterial = (sectionId) => {
// //     setSelectedSectionId(sectionId);
// //     setIsMaterialModalOpen(true);
// //   };

// //   // Close the material modal
// //   const handleCloseMaterialModal = () => {
// //     setIsMaterialModalOpen(false);
// //     setSelectedSectionId(null);
// //   };

// //   // Handle cloning a section (placeholder function)
// //   const handleCloneSection = () => {
// //     alert('Clone Section functionality to be implemented!');
// //   };

// //   // Handle rearranging sections (placeholder function)
// //   const handleRearrangeSections = () => {
// //     alert('Rearrange Sections functionality to be implemented!');
// //   };

// //   // Handle going back to the curriculum table
// //   const handleBack = () => {
// //     navigate('/');
// //   };

// //   return (
// //     <div style={styles.container}>
// //       {/* Header */}
// //       <div style={styles.header}>
// //         <button onClick={handleBack} style={styles.backButton}>
// //           ←
// //         </button>
// //         <h2 style={styles.title}>Create and Edit Your Curriculum</h2>
// //       </div>
// //       <p style={styles.subTitle}>{curriculum.name}</p>

// //       {/* Section Info and Actions */}
// //       <div style={styles.sectionInfo}>
// //         <span style={styles.sectionCount}>
// //           Sections {sections.length} Sections, {curriculum.materials || 0} materials
// //         </span>
// //         <div style={styles.actions}>
// //           <button onClick={handleCloneSection} style={styles.actionButton}>
// //             🗂 Clone Section
// //           </button>
// //           <button onClick={handleRearrangeSections} style={styles.actionButton}>
// //             ⇅ Rearrange sections
// //           </button>
// //           <button onClick={handleAddSection} style={styles.addButton}>
// //             + Add Section
// //           </button>
// //         </div>
// //       </div>

// //       {/* Display Sections or Placeholder */}
// //       {sections.length > 0 ? (
// //         <div style={styles.sectionsList}>
// //           {sections.map((section, index) => (
// //             <div key={section.id} style={styles.sectionItem}>
// //               <div style={styles.sectionHeader}>
// //                 <span style={styles.sectionCaret} onClick={() => toggleSection(section.id)}>
// //                   {expandedSections[section.id] ? '▼' : '▶'}
// //                 </span>
// //                 <span style={styles.sectionNumber}>{index + 1}</span>
// //                 <h4 style={styles.sectionTitle}>{section.name}</h4>
// //                 <span style={styles.materialCount}>
// //                   {section.materials.length} material(s)
// //                 </span>
// //                 <button
// //                   onClick={() => handleAddMaterial(section.id)}
// //                   style={styles.addMaterialButton}
// //                 >
// //                   + Add Material
// //                 </button>
// //                 <button style={styles.actionButton}>⋮</button>
// //               </div>
// //               {expandedSections[section.id] && (
// //                 <div style={styles.sectionContent}>
// //                   {section.materials.length > 0 ? (
// //                     section.materials.map((material) => (
// //                       <div key={material.id} style={styles.materialItem}>
// //                         <p>{material.name}</p>
// //                       </div>
// //                     ))
// //                   ) : (
// //                     <p style={styles.noMaterials}>No materials added here</p>
// //                   )}
// //                 </div>
// //               )}
// //             </div>
// //           ))}
// //         </div>
// //       ) : (
// //         <div style={styles.placeholder}>
// //           <div style={styles.icon}>
// //             <div style={styles.iconBox}>
// //               <div style={styles.iconLine}></div>
// //               <div style={styles.iconLine}></div>
// //               <div style={styles.iconLine}></div>
// //             </div>
// //           </div>
// //           <h3 style={styles.placeholderTitle}>Start by adding your first section</h3>
// //           <p style={styles.placeholderText}>
// //             Ready to create? Start shaping your curriculum. Add the first section to begin
// //           </p>
// //           <button onClick={handleAddSection} style={styles.addButton}>
// //             + Add Section
// //           </button>
// //         </div>
// //       )}

// //       {/* Add Section Modal */}
// //       <AddSectionModal
// //         isOpen={isSectionModalOpen}
// //         onClose={handleCloseSectionModal}
// //         curriculumId={id}
// //       />

// //       {/* Add Material Modal */}
// //       <AddMaterialModal
// //         isOpen={isMaterialModalOpen}
// //         onClose={handleCloseMaterialModal}
// //         curriculumId={id}
// //         sectionId={selectedSectionId}
// //       />
// //     </div>
// //   );
// // };

// // // Inline styles (same as before)
// // const styles = {
// //   container: {
// //     padding: '20px',
// //     fontFamily: 'Arial, sans-serif',
// //   },
// //   header: {
// //     display: 'flex',
// //     alignItems: 'center',
// //     marginBottom: '10px',
// //   },
// //   backButton: {
// //     background: 'none',
// //     border: '1px solid #ddd',
// //     borderRadius: '5px',
// //     padding: '5px 10px',
// //     cursor: 'pointer',
// //     marginRight: '10px',
// //   },
// //   title: {
// //     fontSize: '24px',
// //     fontWeight: 'bold',
// //   },
// //   subTitle: {
// //     fontSize: '14px',
// //     color: '#666',
// //     marginBottom: '20px',
// //   },
// //   sectionInfo: {
// //     display: 'flex',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: '20px',
// //   },
// //   sectionCount: {
// //     fontSize: '14px',
// //     color: '#666',
// //   },
// //   actions: {
// //     display: 'flex',
// //     gap: '10px',
// //   },
// //   actionButton: {
// //     padding: '5px 15px',
// //     backgroundColor: '#fff',
// //     border: '1px solid #ddd',
// //     borderRadius: '5px',
// //     cursor: 'pointer',
// //   },
// //   addButton: {
// //     padding: '5px 15px',
// //     backgroundColor: '#007bff',
// //     color: '#fff',
// //     border: 'none',
// //     borderRadius: '5px',
// //     cursor: 'pointer',
// //   },
// //   placeholder: {
// //     display: 'flex',
// //     flexDirection: 'column',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     height: '50vh',
// //     textAlign: 'center',
// //   },
// //   icon: {
// //     marginBottom: '20px',
// //   },
// //   iconBox: {
// //     width: '100px',
// //     height: '100px',
// //     backgroundColor: '#f0f0f0',
// //     borderRadius: '10px',
// //     display: 'flex',
// //     flexDirection: 'column',
// //     justifyContent: 'center',
// //     gap: '10px',
// //     padding: '10px',
// //   },
// //   iconLine: {
// //     width: '80%',
// //     height: '10px',
// //     backgroundColor: '#ddd',
// //     borderRadius: '5px',
// //   },
// //   placeholderTitle: {
// //     fontSize: '18px',
// //     fontWeight: 'bold',
// //     marginBottom: '10px',
// //   },
// //   placeholderText: {
// //     fontSize: '14px',
// //     color: '#666',
// //     marginBottom: '20px',
// //   },
// //   sectionsList: {
// //     marginTop: '20px',
// //   },
// //   sectionItem: {
// //     marginBottom: '10px',
// //     backgroundColor: '#f5f7fa',
// //     borderRadius: '5px',
// //   },
// //   sectionHeader: {
// //     display: 'flex',
// //     alignItems: 'center',
// //     padding: '10px 15px',
// //     backgroundColor: '#f5f7fa',
// //     borderRadius: '5px',
// //   },
// //   sectionCaret: {
// //     cursor: 'pointer',
// //     marginRight: '10px',
// //   },
// //   sectionNumber: {
// //     marginRight: '10px',
// //     fontWeight: 'bold',
// //   },
// //   sectionTitle: {
// //     flex: 1,
// //     margin: 0,
// //     fontSize: '16px',
// //   },
// //   materialCount: {
// //     marginRight: '15px',
// //     fontSize: '14px',
// //     color: '#666',
// //   },
// //   addMaterialButton: {
// //     padding: '5px 10px',
// //     backgroundColor: '#007bff',
// //     color: '#fff',
// //     border: 'none',
// //     borderRadius: '5px',
// //     cursor: 'pointer',
// //     marginRight: '10px',
// //   },
// //   sectionContent: {
// //     padding: '15px',
// //     backgroundColor: '#fff',
// //     borderTop: '1px solid #ddd',
// //     borderRadius: '0 0 5px 5px',
// //   },
// //   noMaterials: {
// //     color: '#666',
// //     textAlign: 'center',
// //     margin: 0,
// //   },
// //   materialItem: {
// //     padding: '10px',
// //     border: '1px solid #ddd',
// //     borderRadius: '5px',
// //     marginBottom: '5px',
// //   },
// // };

// // export default EditCurriculum;


// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { db } from '../../../../config/firebase';
// import { doc, getDoc, collection, onSnapshot, updateDoc, deleteDoc } from 'firebase/firestore';
// import { s3Client } from '../../../../config/aws-config'; // Import S3 client
// import { DeleteObjectCommand } from '@aws-sdk/client-s3'; // Import DeleteObjectCommand
// import AddSectionModal from './AddSectionalModel';
// import AddMaterialModal from './AddMaterialModal';

// const EditCurriculum = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [curriculum, setCurriculum] = useState(null);
//   const [sections, setSections] = useState([]);
//   const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
//   const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
//   const [selectedSectionId, setSelectedSectionId] = useState(null);
//   const [expandedSections, setExpandedSections] = useState({});
//   const [selectedMaterial, setSelectedMaterial] = useState(null); // Track the material to preview
//   const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false); // Control preview modal

//   // Fetch curriculum data
//   useEffect(() => {
//     const fetchCurriculum = async () => {
//       const docRef = doc(db, 'curriculums', id);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         setCurriculum({ id: docSnap.id, ...docSnap.data() });
//       } else {
//         console.log('No such curriculum!');
//         navigate('/');
//       }
//     };
//     fetchCurriculum();
//   }, [id, navigate]);

//   // Fetch sections and their materials in real-time
//   useEffect(() => {
//     const unsubscribe = onSnapshot(collection(db, `curriculums/${id}/sections`), (snapshot) => {
//       const sectionData = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//         materials: [],
//       }));

//       const fetchMaterials = async () => {
//         const sectionsWithMaterials = await Promise.all(
//           sectionData.map(async (section) => {
//             const materialsSnapshot = await new Promise((resolve) => {
//               onSnapshot(collection(db, `curriculums/${id}/sections/${section.id}/materials`), (snap) => {
//                 resolve(snap);
//               });
//             });
//             const materialsData = materialsSnapshot.docs.map((doc) => ({
//               id: doc.id,
//               ...doc.data(),
//             }));
//             return { ...section, materials: materialsData };
//           })
//         );

//         setSections(sectionsWithMaterials);

//         const totalMaterials = sectionsWithMaterials.reduce(
//           (sum, section) => sum + section.materials.length,
//           0
//         );
//         const curriculumRef = doc(db, 'curriculums', id);
//         updateDoc(curriculumRef, {
//           sections: sectionsWithMaterials.length,
//           materials: totalMaterials,
//         });
//       };

//       fetchMaterials();
//     });

//     return () => unsubscribe();
//   }, [id]);

//   if (!curriculum) return <div>Loading...</div>;

//   // Toggle section expansion
//   const toggleSection = (sectionId) => {
//     setExpandedSections((prev) => ({
//       ...prev,
//       [sectionId]: !prev[sectionId],
//     }));
//   };

//   // Open the section modal
//   const handleAddSection = () => {
//     setIsSectionModalOpen(true);
//   };

//   // Close the section modal
//   const handleCloseSectionModal = () => {
//     setIsSectionModalOpen(false);
//   };

//   // Open the material modal
//   const handleAddMaterial = (sectionId) => {
//     setSelectedSectionId(sectionId);
//     setIsMaterialModalOpen(true);
//   };

//   // Close the material modal
//   const handleCloseMaterialModal = () => {
//     setIsMaterialModalOpen(false);
//     setSelectedSectionId(null);
//   };

//   // Open the preview modal
//   const handlePreviewMaterial = (material) => {
//     setSelectedMaterial(material);
//     setIsPreviewModalOpen(true);
//   };

//   // Close the preview modal
//   const handleClosePreviewModal = () => {
//     setSelectedMaterial(null);
//     setIsPreviewModalOpen(false);
//   };

//   // Delete a material
//   const handleDeleteMaterial = async (sectionId, materialId, materialUrl) => {
//     if (!window.confirm('Are you sure you want to delete this material?')) return;

//     try {
//       // Delete the material from Firestore
//       const materialRef = doc(db, `curriculums/${id}/sections/${sectionId}/materials`, materialId);
//       await deleteDoc(materialRef);
//       console.log('Material deleted from Firestore:', materialId);

//       // Delete the file from S3 if it exists
//       if (materialUrl) {
//         const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
//         const fileKey = materialUrl.split(`https://${bucketName}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/`)[1];
//         const params = {
//           Bucket: bucketName,
//           Key: fileKey,
//         };

//         await s3Client.send(new DeleteObjectCommand(params));
//         console.log('File deleted from S3:', fileKey);
//       }
//     } catch (error) {
//       console.error('Error deleting material:', error);
//       alert('Failed to delete material. Please try again.');
//     }
//   };

//   // Handle cloning a section (placeholder function)
//   const handleCloneSection = () => {
//     alert('Clone Section functionality to be implemented!');
//   };

//   // Handle rearranging sections (placeholder function)
//   const handleRearrangeSections = () => {
//     alert('Rearrange Sections functionality to be implemented!');
//   };

//   // Handle going back to the curriculum table
//   const handleBack = () => {
//     navigate('/');
//   };

//   return (
//     <div style={styles.container}>
//       {/* Header */}
//       <div style={styles.header}>
//         <button onClick={handleBack} style={styles.backButton}>
//           ←
//         </button>
//         <h2 style={styles.title}>Create and Edit Your Curriculum</h2>
//       </div>
//       <p style={styles.subTitle}>{curriculum.name}</p>

//       {/* Section Info and Actions */}
//       <div style={styles.sectionInfo}>
//         <span style={styles.sectionCount}>
//           Sections {sections.length} Sections, {curriculum.materials || 0} materials
//         </span>
//         <div style={styles.actions}>
//           <button onClick={handleCloneSection} style={styles.actionButton}>
//             🗂 Clone Section
//           </button>
//           <button onClick={handleRearrangeSections} style={styles.actionButton}>
//             ⇅ Rearrange sections
//           </button>
//           <button onClick={handleAddSection} style={styles.addButton}>
//             + Add Section
//           </button>
//         </div>
//       </div>

//       {/* Display Sections or Placeholder */}
//       {sections.length > 0 ? (
//         <div style={styles.sectionsList}>
//           {sections.map((section, index) => (
//             <div key={section.id} style={styles.sectionItem}>
//               <div style={styles.sectionHeader}>
//                 <span style={styles.sectionCaret} onClick={() => toggleSection(section.id)}>
//                   {expandedSections[section.id] ? '▼' : '▶'}
//                 </span>
//                 <span style={styles.sectionNumber}>{index + 1}</span>
//                 <h4 style={styles.sectionTitle}>{section.name}</h4>
//                 <span style={styles.materialCount}>
//                   {section.materials.length} material(s)
//                 </span>
//                 <button
//                   onClick={() => handleAddMaterial(section.id)}
//                   style={styles.addMaterialButton}
//                 >
//                   + Add Material
//                 </button>
//                 <button style={styles.actionButton}>⋮</button>
//               </div>
//               {expandedSections[section.id] && (
//                 <div style={styles.sectionContent}>
//                   {section.materials.length > 0 ? (
//                     section.materials.map((material) => (
//                       <div key={material.id} style={styles.materialItem}>
//                         <div style={styles.materialContent}>
//                           <p
//                             style={styles.materialName}
//                             onClick={() => handlePreviewMaterial(material)}
//                           >
//                             {material.name}
//                           </p>
//                           <button
//                             onClick={() => handleDeleteMaterial(section.id, material.id, material.url)}
//                             style={styles.deleteButton}
//                           >
//                             🗑️ Delete
//                           </button>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <p style={styles.noMaterials}>No materials added here</p>
//                   )}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div style={styles.placeholder}>
//           <div style={styles.icon}>
//             <div style={styles.iconBox}>
//               <div style={styles.iconLine}></div>
//               <div style={styles.iconLine}></div>
//               <div style={styles.iconLine}></div>
//             </div>
//           </div>
//           <h3 style={styles.placeholderTitle}>Start by adding your first section</h3>
//           <p style={styles.placeholderText}>
//             Ready to create? Start shaping your curriculum. Add the first section to begin
//           </p>
//           <button onClick={handleAddSection} style={styles.addButton}>
//             + Add Section
//           </button>
//         </div>
//       )}

//       {/* Add Section Modal */}
//       <AddSectionModal
//         isOpen={isSectionModalOpen}
//         onClose={handleCloseSectionModal}
//         curriculumId={id}
//       />

//       {/* Add Material Modal */}
//       <AddMaterialModal
//         isOpen={isMaterialModalOpen}
//         onClose={handleCloseMaterialModal}
//         curriculumId={id}
//         sectionId={selectedSectionId}
//       />

//       {/* Preview Material Modal */}
//       {isPreviewModalOpen && selectedMaterial && (
//         <div style={styles.previewModalOverlay}>
//           <div style={styles.previewModal}>
//             <div style={styles.previewModalHeader}>
//               <h3>Preview Material</h3>
//               <button onClick={handleClosePreviewModal} style={styles.closeButton}>
//                 ✕
//               </button>
//             </div>
//             <div style={styles.previewModalContent}>
//               <h4>{selectedMaterial.name}</h4>
//               {selectedMaterial.description && (
//                 <p style={styles.previewDescription}>{selectedMaterial.description}</p>
//               )}
//               {selectedMaterial.url && (
//                 <>
//                   {selectedMaterial.type === 'Video' ? (
//                     <video
//                       controls
//                       style={styles.previewVideo}
//                       src={selectedMaterial.url}
//                     >
//                       Your browser does not support the video tag.
//                     </video>
//                   ) : selectedMaterial.type === 'PDF' ? (
//                     <embed
//                       src={selectedMaterial.url}
//                       type="application/pdf"
//                       style={styles.previewPDF}
//                     />
//                   ) : (
//                     <p>
//                       <a href={selectedMaterial.url} target="_blank" rel="noopener noreferrer">
//                         View File
//                       </a>
//                     </p>
//                   )}
//                 </>
//               )}
//               <p><strong>Type:</strong> {selectedMaterial.type}</p>
//               <p><strong>Max Views:</strong> {selectedMaterial.maxViews || 'Unlimited'}</p>
//               <p><strong>Prerequisite:</strong> {selectedMaterial.isPrerequisite ? 'Yes' : 'No'}</p>
//               <p><strong>Allow Download:</strong> {selectedMaterial.allowDownload ? 'Yes' : 'No'}</p>
//               <p><strong>Access On:</strong> {selectedMaterial.accessOn}</p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Inline styles
// const styles = {
//   container: {
//     padding: '20px',
//     fontFamily: 'Arial, sans-serif',
//   },
//   header: {
//     display: 'flex',
//     alignItems: 'center',
//     marginBottom: '10px',
//   },
//   backButton: {
//     background: 'none',
//     border: '1px solid #ddd',
//     borderRadius: '5px',
//     padding: '5px 10px',
//     cursor: 'pointer',
//     marginRight: '10px',
//   },
//   title: {
//     fontSize: '24px',
//     fontWeight: 'bold',
//   },
//   subTitle: {
//     fontSize: '14px',
//     color: '#666',
//     marginBottom: '20px',
//   },
//   sectionInfo: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: '20px',
//   },
//   sectionCount: {
//     fontSize: '14px',
//     color: '#666',
//   },
//   actions: {
//     display: 'flex',
//     gap: '10px',
//   },
//   actionButton: {
//     padding: '5px 15px',
//     backgroundColor: '#fff',
//     border: '1px solid #ddd',
//     borderRadius: '5px',
//     cursor: 'pointer',
//   },
//   addButton: {
//     padding: '5px 15px',
//     backgroundColor: '#007bff',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '5px',
//     cursor: 'pointer',
//   },
//   placeholder: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: '50vh',
//     textAlign: 'center',
//   },
//   icon: {
//     marginBottom: '20px',
//   },
//   iconBox: {
//     width: '100px',
//     height: '100px',
//     backgroundColor: '#f0f0f0',
//     borderRadius: '10px',
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     gap: '10px',
//     padding: '10px',
//   },
//   iconLine: {
//     width: '80%',
//     height: '10px',
//     backgroundColor: '#ddd',
//     borderRadius: '5px',
//   },
//   placeholderTitle: {
//     fontSize: '18px',
//     fontWeight: 'bold',
//     marginBottom: '10px',
//   },
//   placeholderText: {
//     fontSize: '14px',
//     color: '#666',
//     marginBottom: '20px',
//   },
//   sectionsList: {
//     marginTop: '20px',
//   },
//   sectionItem: {
//     marginBottom: '10px',
//     backgroundColor: '#f5f7fa',
//     borderRadius: '5px',
//   },
//   sectionHeader: {
//     display: 'flex',
//     alignItems: 'center',
//     padding: '10px 15px',
//     backgroundColor: '#f5f7fa',
//     borderRadius: '5px',
//   },
//   sectionCaret: {
//     cursor: 'pointer',
//     marginRight: '10px',
//   },
//   sectionNumber: {
//     marginRight: '10px',
//     fontWeight: 'bold',
//   },
//   sectionTitle: {
//     flex: 1,
//     margin: 0,
//     fontSize: '16px',
//   },
//   materialCount: {
//     marginRight: '15px',
//     fontSize: '14px',
//     color: '#666',
//   },
//   addMaterialButton: {
//     padding: '5px 10px',
//     backgroundColor: '#007bff',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '5px',
//     cursor: 'pointer',
//     marginRight: '10px',
//   },
//   sectionContent: {
//     padding: '15px',
//     backgroundColor: '#fff',
//     borderTop: '1px solid #ddd',
//     borderRadius: '0 0 5px 5px',
//   },
//   noMaterials: {
//     color: '#666',
//     textAlign: 'center',
//     margin: 0,
//   },
//   materialItem: {
//     padding: '10px',
//     border: '1px solid #ddd',
//     borderRadius: '5px',
//     marginBottom: '5px',
//   },
//   materialContent: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   materialName: {
//     margin: 0,
//     cursor: 'pointer',
//     color: '#007bff',
//     textDecoration: 'underline',
//   },
//   deleteButton: {
//     padding: '5px 10px',
//     backgroundColor: '#dc3545',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '5px',
//     cursor: 'pointer',
//   },
//   previewModalOverlay: {
//     position: 'fixed',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 1000,
//   },
//   previewModal: {
//     backgroundColor: '#fff',
//     width: '600px',
//     maxHeight: '80vh',
//     padding: '20px',
//     borderRadius: '5px',
//     boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
//     overflowY: 'auto',
//   },
//   previewModalHeader: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: '20px',
//   },
//   closeButton: {
//     background: 'none',
//     border: 'none',
//     fontSize: '16px',
//     cursor: 'pointer',
//   },
//   previewModalContent: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '10px',
//   },
//   previewDescription: {
//     color: '#666',
//   },
//   previewVideo: {
//     width: '100%',
//     maxHeight: '300px',
//     borderRadius: '5px',
//   },
//   previewPDF: {
//     width: '100%',
//     height: '400px',
//     border: 'none',
//   },
// };

// export default EditCurriculum;

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
  const [expandedSections, setExpandedSections] = useState({});
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewError, setPreviewError] = useState(null); // Track preview errors

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

  // Open the section modal
  const handleAddSection = () => {
    setIsSectionModalOpen(true);
  };

  // Close the section modal
  const handleCloseSectionModal = () => {
    setIsSectionModalOpen(false);
  };

  // Open the material modal
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
    setPreviewError(null); // Reset any previous errors
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
                <button style={styles.actionButton}>⋮</button>
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
                          <button
                            onClick={() => handleDeleteMaterial(section.id, material.id, material.url)}
                            style={styles.deleteButton}
                          >
                            🗑️ Delete
                          </button>
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

      {/* Add Section Modal */}
      <AddSectionModal
        isOpen={isSectionModalOpen}
        onClose={handleCloseSectionModal}
        curriculumId={id}
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

// Inline styles
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
    border: '1px solid #ddd',
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
    backgroundColor: '#f0f0f0',
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
  deleteButton: {
    padding: '5px 10px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
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