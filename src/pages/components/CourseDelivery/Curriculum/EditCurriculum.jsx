// // // // src/EditCurriculum.js
// // // import React from 'react';
// // // import { useParams, useNavigate } from 'react-router-dom';

// // // const EditCurriculum = () => {
// // //   const { id } = useParams(); // Get the curriculum ID from the URL
// // //   const navigate = useNavigate();

// // //   // Mock data for the curriculum (replace with actual data fetching from Firebase if needed)
// // //   const curriculum = {
// // //     id,
// // //     name: 'Samiksha Raut', // This should come from Firebase or props
// // //     sections: 0,
// // //     materials: 0,
// // //   };

// // //   // Handle adding a new section (placeholder function)
// // //   const handleAddSection = () => {
// // //     alert('Add Section functionality to be implemented!');
// // //   };

// // //   // Handle cloning a section (placeholder function)
// // //   const handleCloneSection = () => {
// // //     alert('Clone Section functionality to be implemented!');
// // //   };

// // //   // Handle rearranging sections (placeholder function)
// // //   const handleRearrangeSections = () => {
// // //     alert('Rearrange Sections functionality to be implemented!');
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
// // //           Sections {curriculum.sections} Sections, {curriculum.materials} materials
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

// // //       {/* Placeholder for No Sections */}
// // //       <div style={styles.placeholder}>
// // //         <div style={styles.icon}>
// // //           {/* Simplified icon representation */}
// // //           <div style={styles.iconBox}>
// // //             <div style={styles.iconLine}></div>
// // //             <div style={styles.iconLine}></div>
// // //             <div style={styles.iconLine}></div>
// // //           </div>
// // //         </div>
// // //         <h3 style={styles.placeholderTitle}>Start by adding your first section</h3>
// // //         <p style={styles.placeholderText}>
// // //           Ready to create? Start shaping your curriculum. Add the first section to begin
// // //         </p>
// // //         <button onClick={handleAddSection} style={styles.addButton}>
// // //           + Add Section
// // //         </button>
// // //       </div>
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
// // // };

// // // export default EditCurriculum;

// // // src/EditCurriculum.js
// // import React, { useState, useEffect } from 'react';
// // import { useParams, useNavigate } from 'react-router-dom';
// // import { db } from '../../../../config/firebase';
// // import { doc, getDoc, collection, onSnapshot, updateDoc } from 'firebase/firestore';
// // import AddSectionModal from './AddSectionalModel';

// // const EditCurriculum = () => {
// //   const { id } = useParams(); // Get the curriculum ID from the URL
// //   const navigate = useNavigate();
// //   const [curriculum, setCurriculum] = useState(null);
// //   const [sections, setSections] = useState([]);
// //   const [isModalOpen, setIsModalOpen] = useState(false);

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

// //   // Fetch sections in real-time
// //   useEffect(() => {
// //     const unsubscribe = onSnapshot(collection(db, `curriculums/${id}/sections`), (snapshot) => {
// //       const sectionData = snapshot.docs.map((doc) => ({
// //         id: doc.id,
// //         ...doc.data(),
// //       }));
// //       setSections(sectionData);

// //       // Update the sections count in the curriculum document
// //       const curriculumRef = doc(db, 'curriculums', id);
// //       updateDoc(curriculumRef, { sections: sectionData.length });
// //     });
// //     return () => unsubscribe();
// //   }, [id]);

// //   if (!curriculum) return <div>Loading...</div>;

// //   // Open the modal
// //   const handleAddSection = () => {
// //     setIsModalOpen(true);
// //   };

// //   // Close the modal
// //   const handleCloseModal = () => {
// //     setIsModalOpen(false);
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
// //           {sections.map((section) => (
// //             <div key={section.id} style={styles.sectionItem}>
// //               <h4>{section.name}</h4>
// //               <p>{section.description || 'No description'}</p>
// //               {section.isPrerequisite && <span style={styles.prerequisiteTag}>Prerequisite</span>}
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
// //         isOpen={isModalOpen}
// //         onClose={handleCloseModal}
// //         curriculumId={id}
// //       />
// //     </div>
// //   );
// // };

// // // Inline styles
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
// //     padding: '15px',
// //     border: '1px solid #ddd',
// //     borderRadius: '5px',
// //     marginBottom: '10px',
// //     backgroundColor: '#fff',
// //   },
// //   prerequisiteTag: {
// //     display: 'inline-block',
// //     backgroundColor: '#f0f0f0',
// //     padding: '2px 8px',
// //     borderRadius: '10px',
// //     fontSize: '12px',
// //     marginTop: '5px',
// //   },
// // };

// // export default EditCurriculum;


// // src/EditCurriculum.js
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { db } from '../../../../config/firebase'; // Adjust the path to your firebase.js file
// import { doc, getDoc, collection, onSnapshot, updateDoc } from 'firebase/firestore';
// import AddSectionModal from './AddSectionalModel'; // Adjust the path to your AddSectionModal

// const EditCurriculum = () => {
//   const { id } = useParams(); // Get the curriculum ID from the URL
//   const navigate = useNavigate();
//   const [curriculum, setCurriculum] = useState(null);
//   const [sections, setSections] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [expandedSections, setExpandedSections] = useState({}); // Track which sections are expanded

//   // Fetch curriculum data
//   useEffect(() => {
//     const fetchCurriculum = async () => {
//       const docRef = doc(db, 'curriculums', id);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         setCurriculum({ id: docSnap.id, ...docSnap.data() });
//       } else {
//         console.log('No such curriculum!');
//         navigate('/'); // Redirect if curriculum not found
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
//         materials: [], // Initialize materials array
//       }));

//       // Fetch materials for each section
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

//         // Update the sections and materials count in the curriculum document
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

//   // Open the modal
//   const handleAddSection = () => {
//     setIsModalOpen(true);
//   };

//   // Close the modal
//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   // Handle cloning a section (placeholder function)
//   const handleCloneSection = () => {
//     alert('Clone Section functionality to be implemented!');
//   };

//   // Handle rearranging sections (placeholder function)
//   const handleRearrangeSections = () => {
//     alert('Rearrange Sections functionality to be implemented!');
//   };

//   // Handle adding a material (placeholder function)
//   const handleAddMaterial = (sectionId) => {
//     alert(`Add Material functionality for section ${sectionId} to be implemented!`);
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
//                         <p>{material.name}</p>
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
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         curriculumId={id}
//       />
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
// };

// export default EditCurriculum;


// src/EditCurriculum.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../../../config/firebase'; // Adjust the path to your firebase.js file
import { doc, getDoc, collection, onSnapshot, updateDoc } from 'firebase/firestore';
import AddSectionModal from './AddSectionalModel'; // Adjust the path to your AddSectionModal
import AddMaterialModal from './AddMaterialModal'; // Import the new modal

const EditCurriculum = () => {
  const { id } = useParams(); // Get the curriculum ID from the URL
  const navigate = useNavigate();
  const [curriculum, setCurriculum] = useState(null);
  const [sections, setSections] = useState([]);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [expandedSections, setExpandedSections] = useState({}); // Track which sections are expanded

  // Fetch curriculum data
  useEffect(() => {
    const fetchCurriculum = async () => {
      const docRef = doc(db, 'curriculums', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCurriculum({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log('No such curriculum!');
        navigate('/'); // Redirect if curriculum not found
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
        materials: [], // Initialize materials array
      }));

      // Fetch materials for each section
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

        // Update the sections and materials count in the curriculum document
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
    navigate('/');
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
                        <p>{material.name}</p>
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
    </div>
  );
};

// Inline styles (same as before)
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
    margin: 0,
  },
  materialItem: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    marginBottom: '5px',
  },
};

export default EditCurriculum;