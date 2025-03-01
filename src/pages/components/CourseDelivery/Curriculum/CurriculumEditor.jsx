// // // // // import React, { useEffect, useState } from "react";
// // // // // import { db } from "../../../../config/firebase";
// // // // // import { doc, getDoc } from "firebase/firestore";
// // // // // import { useParams, useNavigate } from "react-router-dom";

// // // // // const CurriculumEditor = () => {
// // // // //   const { curriculumId } = useParams();
// // // // //   const [curriculum, setCurriculum] = useState(null);
// // // // //   const navigate = useNavigate();

// // // // //   useEffect(() => {
// // // // //     const fetchCurriculum = async () => {
// // // // //       const docRef = doc(db, "curriculum", curriculumId);
// // // // //       const docSnap = await getDoc(docRef);

// // // // //       if (docSnap.exists()) {
// // // // //         setCurriculum(docSnap.data());
// // // // //       } else {
// // // // //         alert("Curriculum not found!");
// // // // //         navigate(-1);
// // // // //       }
// // // // //     };

// // // // //     fetchCurriculum();
// // // // //   }, [curriculumId, navigate]);

// // // // //   if (!curriculum) return <p>Loading...</p>;

// // // // //   return (
// // // // //     <div className="flex-col w-screen ml-80 p-4">

// // // // //       <button
// // // // //         onClick={() => navigate(-1)}
// // // // //         className="mb-4 px-4 py-2 bg-gray-300 rounded text-gray-700 hover:bg-gray-400"
// // // // //       >
// // // // //         &larr; Back
// // // // //       </button>
// // // // //       <h2 className="text-2xl font-bold mb-2">Create and Edit Your Curriculum</h2>
// // // // //       <p className="text-gray-600 mb-6">{curriculum.name}</p>
// // // // //       <div className="flex justify-between items-center mb-4">
// // // // //         <span className="text-sm bg-gray-200 text-gray-600 px-2 py-1 rounded">
// // // // //           {curriculum.sections?.length || 0} Sections
// // // // //         </span>
// // // // //         <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
// // // // //           + Add Section
// // // // //         </button>
// // // // //       </div>
// // // // //       {curriculum.sections?.map((section, index) => (
// // // // //         <div key={index} className="bg-gray-100 p-4 rounded mb-4">
// // // // //           <h3 className="text-lg font-semibold">
// // // // //             {`${index + 1}. ${section.title || "Untitled Section"}`}
// // // // //           </h3>
// // // // //           <p className="text-gray-500">
// // // // //             {section.materials?.length || 0} material(s) • {section.totalDuration || "0s"}
// // // // //           </p>
// // // // //           <button className="mt-2 text-blue-500 hover:underline">+ Add Material</button>
// // // // //         </div>
// // // // //       ))}
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default CurriculumEditor;


// // // // import React, { useEffect, useState } from "react";
// // // // import { db } from "../../../../config/firebase";
// // // // import { doc, getDoc, updateDoc } from "firebase/firestore";
// // // // import { useParams, useNavigate } from "react-router-dom";
// // // // import AddSectionalModal from "./AddSectionalModel.jsx";

// // // // const CurriculumEditor = () => {
// // // //   const { curriculumId } = useParams();
// // // //   const [curriculum, setCurriculum] = useState(null);
// // // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // // //   const [expandedSection, setExpandedSection] = useState(null);
// // // //   const navigate = useNavigate();

// // // //   useEffect(() => {
// // // //     const fetchCurriculum = async () => {
// // // //       const docRef = doc(db, "curriculum", curriculumId);
// // // //       const docSnap = await getDoc(docRef);

// // // //       if (docSnap.exists()) {
// // // //         setCurriculum({ id: docSnap.id, ...docSnap.data() });
// // // //       } else {
// // // //         alert("Curriculum not found!");
// // // //         navigate(-1);
// // // //       }
// // // //     };

// // // //     fetchCurriculum();
// // // //   }, [curriculumId, navigate]);

// // // //   const handleAddSection = async (newSection) => {
// // // //     const updatedSections = [...(curriculum.sections || []), newSection];
// // // //     setCurriculum({ ...curriculum, sections: updatedSections });

// // // //     // Update Firestore
// // // //     await updateDoc(doc(db, "curriculum", curriculumId), { sections: updatedSections });
// // // //   };

// // // //   const toggleSection = (index) => {
// // // //     setExpandedSection(expandedSection === index ? null : index);
// // // //   };

// // // //   if (!curriculum) return <p>Loading...</p>;

// // // //   return (
// // // //     <div className="flex-col w-screen ml-80 p-4">
// // // //       <button
// // // //         onClick={() => navigate(-1)}
// // // //         className="mb-4 px-4 py-2 bg-gray-300 rounded text-gray-700 hover:bg-gray-400"
// // // //       >
// // // //         &larr; Back
// // // //       </button>
// // // //       <h2 className="text-2xl font-bold mb-2">Create and Edit Your Curriculum</h2>
// // // //       <p className="text-gray-600 mb-6">{curriculum.name}</p>

// // // //       <div className="flex justify-between items-center mb-4">
// // // //         <span className="text-sm bg-gray-200 text-gray-600 px-2 py-1 rounded">
// // // //           {curriculum.sections?.length || 0} Sections
// // // //         </span>
// // // //         <button
// // // //           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
// // // //           onClick={() => setIsModalOpen(true)}
// // // //         >
// // // //           + Add Section
// // // //         </button>
// // // //       </div>



    


// // // //       {curriculum.sections?.map((section, index) => (
// // // //         <div key={index} className="bg-gray-100 p-4 rounded mb-4">
// // // //           <h3
// // // //             className="text-lg font-semibold cursor-pointer"
// // // //             onClick={() => toggleSection(index)}
// // // //           >
// // // //             {`${index + 1}. ${section.title || "Untitled Section"}`}
// // // //           </h3>
// // // //           <p className="text-gray-500">
// // // //             {section.materials?.length || 0} material(s) • {section.totalDuration || "0s"}
// // // //           </p>

// // // //           {expandedSection === index && (
// // // //             <div className="mt-2 p-2 border-l-4 border-blue-400 bg-gray-200">
// // // //               <h4 className="text-md font-semibold">Materials:</h4>
// // // //               {section.materials?.length > 0 ? (
// // // //                 <ul>
// // // //                   {section.materials.map((material, i) => (
// // // //                     <li key={i} className="text-sm text-gray-600">
// // // //                       {material}
// // // //                     </li>
// // // //                   ))}
// // // //                 </ul>
// // // //               ) : (
// // // //                 <p className="text-sm text-gray-500">No materials added yet.</p>
// // // //               )}
// // // //               <button className="mt-2 text-blue-500 hover:underline">+ Add Material</button>
// // // //             </div>
// // // //           )}
// // // //         </div>
// // // //       ))}

// // // //       <AddSectionalModal
// // // //         isOpen={isModalOpen}
// // // //         onClose={() => setIsModalOpen(false)}
// // // //         onAddSection={handleAddSection}
// // // //       />
// // // //     </div>
// // // //   );
// // // // };

// // // // export default CurriculumEditor;


// // // // import React, { useEffect, useState } from "react";
// // // // import { db } from "../../../../config/firebase";
// // // // import { doc, getDoc, getDocs, collection, updateDoc } from "firebase/firestore";
// // // // import { useParams, useNavigate } from "react-router-dom";
// // // // import AddSectionalModal from "./AddSectionalModel.jsx";

// // // // const CurriculumEditor = () => {
// // // //   const { curriculumId } = useParams();
// // // //   const [curriculum, setCurriculum] = useState(null);
// // // //   const [sections, setSections] = useState([]);  // Store sections separately
// // // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // // //   const [expandedSection, setExpandedSection] = useState(null);
// // // //   const navigate = useNavigate();

// // // //   useEffect(() => {
// // // //     const fetchCurriculum = async () => {
// // // //       try {
// // // //         const docRef = doc(db, "curriculum", curriculumId);
// // // //         const docSnap = await getDoc(docRef);

// // // //         if (docSnap.exists()) {
// // // //           setCurriculum({ id: docSnap.id, ...docSnap.data() });
// // // //         } else {
// // // //           alert("Curriculum not found!");
// // // //           navigate(-1);
// // // //           return;
// // // //         }

// // // //         // Fetch sections from Firestore subcollection
// // // //         const sectionsCollection = collection(db, "curriculum", curriculumId, "sections");
// // // //         const sectionsSnapshot = await getDocs(sectionsCollection);
        
// // // //         const sectionsData = sectionsSnapshot.docs.map(doc => ({
// // // //           id: doc.id,
// // // //           ...doc.data(),
// // // //         }));
        
// // // //         setSections(sectionsData);
// // // //       } catch (error) {
// // // //         console.error("Error fetching curriculum:", error);
// // // //       }
// // // //     };

// // // //     fetchCurriculum();
// // // //   }, [curriculumId, navigate]);

// // // //   const handleAddSection = async (newSection) => {
// // // //     const updatedSections = [...sections, newSection];
// // // //     setSections(updatedSections);

// // // //     // Update Firestore by adding new section to subcollection
// // // //     const sectionDocRef = doc(collection(db, "curriculum", curriculumId, "sections"));
// // // //     await updateDoc(sectionDocRef, newSection);
// // // //   };

// // // //   const toggleSection = (index) => {
// // // //     setExpandedSection(expandedSection === index ? null : index);
// // // //   };

// // // //   if (!curriculum) return <p>Loading...</p>;

// // // //   return (
// // // //     <div className="flex-col w-screen ml-80 p-4">
// // // //       <button
// // // //         onClick={() => navigate(-1)}
// // // //         className="mb-4 px-4 py-2 bg-gray-300 rounded text-gray-700 hover:bg-gray-400"
// // // //       >
// // // //         &larr; Back
// // // //       </button>
// // // //       <h2 className="text-2xl font-bold mb-2">Create and Edit Your Curriculum</h2>
// // // //       <p className="text-gray-600 mb-6">{curriculum.name}</p>

// // // //       <div className="flex justify-between items-center mb-4">
// // // //         <span className="text-sm bg-gray-200 text-gray-600 px-2 py-1 rounded">
// // // //           {sections.length} Sections
// // // //         </span>
// // // //         <button
// // // //           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
// // // //           onClick={() => setIsModalOpen(true)}
// // // //         >
// // // //           + Add Section
// // // //         </button>
// // // //       </div>

// // // //       {sections.length > 0 ? (
// // // //         sections.map((section, index) => (
// // // //           <div key={section.id} className="bg-gray-100 p-4 rounded mb-4">
// // // //             <h3
// // // //               className="text-lg font-semibold cursor-pointer"
// // // //               onClick={() => toggleSection(index)}
// // // //             >
// // // //               {`${index + 1}. ${section.name || "Untitled Section"}`}
// // // //             </h3>
// // // //             <p className="text-gray-500">
// // // //               {section.materials?.length || 0} material(s) • {section.totalDuration || "0s"}
// // // //             </p>

// // // //             {expandedSection === index && (
// // // //               <div className="mt-2 p-2 border-l-4 border-blue-400 bg-gray-200">
// // // //                 <h4 className="text-md font-semibold">Materials:</h4>
// // // //                 {section.materials?.length > 0 ? (
// // // //                   <ul>
// // // //                     {section.materials.map((material, i) => (
// // // //                       <li key={i} className="text-sm text-gray-600">
// // // //                         {material}
// // // //                       </li>
// // // //                     ))}
// // // //                   </ul>
// // // //                 ) : (
// // // //                   <p className="text-sm text-gray-500">No materials added yet.</p>
// // // //                 )}
// // // //                 <button className="mt-2 text-blue-500 hover:underline">+ Add Material</button>
// // // //               </div>
// // // //             )}
// // // //           </div>
// // // //         ))
// // // //       ) : (
// // // //         <p className="text-gray-500">No sections added yet.</p>
// // // //       )}

// // // //       {/* <AddSectionalModal
// // // //         isOpen={isModalOpen}
// // // //         onClose={() => setIsModalOpen(false)}
// // // //         onAddSection={handleAddSection}
// // // //       /> */}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default CurriculumEditor;



// // // import React, { useEffect, useState } from "react";
// // // import { db } from "../../../../config/firebase";
// // // import { doc, getDoc, getDocs, collection, addDoc } from "firebase/firestore";
// // // import { useParams, useNavigate } from "react-router-dom";
// // // import AddSectionalModal from "./AddSectionalModel.jsx";

// // // const CurriculumEditor = () => {
// // //   const { curriculumId } = useParams();
// // //   const [curriculum, setCurriculum] = useState(null);
// // //   const [sections, setSections] = useState([]);  // Store sections separately
// // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // //   const [expandedSection, setExpandedSection] = useState(null);
// // //   const navigate = useNavigate();

// // //   useEffect(() => {
// // //     const fetchCurriculum = async () => {
// // //       try {
// // //         const docRef = doc(db, "curriculum", curriculumId);
// // //         const docSnap = await getDoc(docRef);

// // //         if (docSnap.exists()) {
// // //           setCurriculum({ id: docSnap.id, ...docSnap.data() });
// // //         } else {
// // //           alert("Curriculum not found!");
// // //           navigate(-1);
// // //           return;
// // //         }

// // //         // Fetch sections from Firestore subcollection
// // //         const sectionsCollection = collection(db, "curriculum", curriculumId, "sections");
// // //         const sectionsSnapshot = await getDocs(sectionsCollection);
        
// // //         const sectionsData = sectionsSnapshot.docs.map(doc => ({
// // //           id: doc.id,
// // //           ...doc.data(),
// // //         }));
        
// // //         setSections(sectionsData);
// // //       } catch (error) {
// // //         console.error("Error fetching curriculum:", error);
// // //       }
// // //     };

// // //     fetchCurriculum();
// // //   }, [curriculumId, navigate]);

// // //   const handleAddSection = async (newSection) => {
// // //     try {
// // //       const sectionRef = await addDoc(collection(db, "curriculum", curriculumId, "sections"), newSection);
// // //       setSections([...sections, { id: sectionRef.id, ...newSection }]);
// // //       setIsModalOpen(false);  // Close modal after adding
// // //     } catch (error) {
// // //       console.error("Error adding section:", error);
// // //     }
// // //   };

// // //   const toggleSection = (index) => {
// // //     setExpandedSection(expandedSection === index ? null : index);
// // //   };

// // //   if (!curriculum) return <p>Loading...</p>;

// // //   return (
// // //     <div className="flex-col w-screen ml-80 p-4">
// // //       <button
// // //         onClick={() => navigate(-1)}
// // //         className="mb-4 px-4 py-2 bg-gray-300 rounded text-gray-700 hover:bg-gray-400"
// // //       >
// // //         &larr; Back
// // //       </button>
// // //       <h2 className="text-2xl font-bold mb-2">Create and Edit Your Curriculum</h2>
// // //       <p className="text-gray-600 mb-6">{curriculum.name}</p>

// // //       <div className="flex justify-between items-center mb-4">
// // //         <span className="text-sm bg-gray-200 text-gray-600 px-2 py-1 rounded">
// // //           {sections.length} Sections
// // //         </span>
// // //         <button
// // //           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
// // //           onClick={() => setIsModalOpen(true)}
// // //         >
// // //           + Add Section
// // //         </button>
// // //       </div>

// // //       {sections.length > 0 ? (
// // //         sections.map((section, index) => (
// // //           <div key={section.id} className="bg-gray-100 p-4 rounded mb-4">
// // //             <h3
// // //               className="text-lg font-semibold cursor-pointer"
// // //               onClick={() => toggleSection(index)}
// // //             >
// // //               {`${index + 1}. ${section.name || "Untitled Section"}`}
// // //             </h3>
// // //             <p className="text-gray-500">
// // //               {section.materials?.length || 0} material(s) • {section.totalDuration || "0s"}
// // //             </p>

// // //             {expandedSection === index && (
// // //               <div className="mt-2 p-2 border-l-4 border-blue-400 bg-gray-200">
// // //                 <h4 className="text-md font-semibold">Materials:</h4>
// // //                 {section.materials?.length > 0 ? (
// // //                   <ul>
// // //                     {section.materials.map((material, i) => (
// // //                       <li key={i} className="text-sm text-gray-600">
// // //                         {material}
// // //                       </li>
// // //                     ))}
// // //                   </ul>
// // //                 ) : (
// // //                   <p className="text-sm text-gray-500">No materials added yet.</p>
// // //                 )}
// // //                 <button className="mt-2 text-blue-500 hover:underline">+ Add Material</button>
// // //               </div>
// // //             )}
// // //           </div>
// // //         ))
// // //       ) : (
// // //         <p className="text-gray-500">No sections added yet.</p>
// // //       )}

// // //       {/* Modal for adding sections */}
// // //       {/* <AddSectionalModal
// // //         isOpen={isModalOpen}
// // //         onClose={() => setIsModalOpen(false)}
// // //         onAddSection={handleAddSection}
// // //       /> */}
// // //     </div>
// // //   );
// // // };

// // // export default CurriculumEditor;


// // import React, { useEffect, useState } from "react";
// // import { db } from "../../../../config/firebase";
// // import { doc, getDoc, getDocs, collection, addDoc } from "firebase/firestore";
// // import { useParams, useNavigate } from "react-router-dom";
// // import AddSectionalModal from "./AddSectionalModel.jsx";

// // const CurriculumEditor = () => {
// //   const { curriculumId } = useParams();
// //   const [curriculum, setCurriculum] = useState(null);
// //   const [sections, setSections] = useState([]);  // Store sections separately
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [expandedSection, setExpandedSection] = useState(null);

// //   const [isMCQModalOpen, setIsMCQModalOpen] = useState(false);

  
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     const fetchCurriculum = async () => {
// //       try {
// //         const docRef = doc(db, "curriculum", curriculumId);
// //         const docSnap = await getDoc(docRef);

// //         if (docSnap.exists()) {
// //           setCurriculum({ id: docSnap.id, ...docSnap.data() });
// //         } else {
// //           alert("Curriculum not found!");
// //           navigate(-1);
// //           return;
// //         }

// //         // Fetch sections from Firestore subcollection
// //         const sectionsCollection = collection(db, "curriculum", curriculumId, "sections");
// //         const sectionsSnapshot = await getDocs(sectionsCollection);
        
// //         const sectionsData = sectionsSnapshot.docs.map(doc => ({
// //           id: doc.id,
// //           ...doc.data(),
// //         }));
        
// //         setSections(sectionsData);
// //       } catch (error) {
// //         console.error("Error fetching curriculum:", error);
// //       }
// //     };

// //     fetchCurriculum();
// //   }, [curriculumId, navigate]);

// //   const handleAddSection = async (newSection) => {
// //     try {
// //       const sectionRef = await addDoc(collection(db, "curriculum", curriculumId, "sections"), newSection);
// //       setSections([...sections, { id: sectionRef.id, ...newSection }]);
// //       setIsModalOpen(false);  // Close modal after adding
// //     } catch (error) {
// //       console.error("Error adding section:", error);
// //     }
// //   };

// //   const toggleSection = (index) => {
// //     setExpandedSection(expandedSection === index ? null : index);
// //   };

// //   if (!curriculum) return <p>Loading...</p>;

// //   return (
// //     <div className="flex-col w-screen ml-80 p-4">
// //       <button
// //         onClick={() => navigate(-1)}
// //         className="mb-4 px-4 py-2 bg-gray-300 rounded text-gray-700 hover:bg-gray-400"
// //       >
// //         &larr; Back
// //       </button>
// //       <h2 className="text-2xl font-bold mb-2">Create and Edit Your Curriculum</h2>
// //       <p className="text-gray-600 mb-6">{curriculum.name}</p>

// //       <div className="flex justify-between items-center mb-4">
// //         <span className="text-sm bg-gray-200 text-gray-600 px-2 py-1 rounded">
// //           {sections.length} Sections
// //         </span>
// //         <button
// //           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
// //           onClick={() => setIsModalOpen(true)}
// //         >
// //           + Add Section
// //         </button>
// //       </div>

// //       {sections.length > 0 ? (
// //         sections.map((section, index) => (
// //           <div key={section.id} className="bg-gray-100 p-4 rounded mb-4">
// //             <h3
// //               className="text-lg font-semibold cursor-pointer"
// //               onClick={() => toggleSection(index)}
// //             >
// //               {`${index + 1}. ${section.name || "Untitled Section"}`}
// //             </h3>
// //             <p className="text-gray-500">
// //               {section.materials?.length || 0} material(s) • {section.totalDuration || "0s"}
// //             </p>

// //             {expandedSection === index && (
// //               <div className="mt-2 p-2 border-l-4 border-blue-400 bg-gray-200">
// //                 <h4 className="text-md font-semibold">Materials:</h4>
// //                 {section.materials?.length > 0 ? (
// //                   <ul>
// //                     {section.materials.map((material, i) => (
// //                       <li key={i} className="text-sm text-gray-600">
// //                         {material}
// //                       </li>
// //                     ))}
// //                   </ul>
// //                 ) : (
// //                   <p className="text-sm text-gray-500">No materials added yet.</p>
// //                 )}
// //                 <button className="mt-2 text-blue-500 hover:underline">+ Add Material</button>
// //               </div>
// //             )}
// //           </div>
// //         ))
// //       ) : (
// //         <p className="text-gray-500">No sections added yet.</p>
// //       )}

// //       {/* Modal for adding sections */}
// //       {isModalOpen && (
// //         <AddSectionalModal
// //           curriculumId={curriculumId}
// //           onClose={() => setIsModalOpen(false)}
// //         />
// //       )}
// //     </div>
// //   );
// // };

// // export default CurriculumEditor;


// import React, { useEffect, useState } from "react";
// import { db } from "../../../../config/firebase";
// import { doc, getDoc, getDocs, collection, addDoc } from "firebase/firestore";
// import { useParams, useNavigate } from "react-router-dom";
// import AddSectionalModal from "./AddSectionalModel.jsx";

// const CurriculumEditor = () => {
//   const { curriculumId } = useParams();
//   const [curriculum, setCurriculum] = useState(null);
//   const [sections, setSections] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [expandedSection, setExpandedSection] = useState(null);
//   const navigate = useNavigate();


//   useEffect(() => {

//     const fetchCurriculum = async () => {
//       try {
//         const docRef = doc(db, "curriculum", curriculumId);
//         const docSnap = await getDoc(docRef);
    
//         if (docSnap.exists()) {
//           setCurriculum({ id: docSnap.id, ...docSnap.data() });
//         } else {
//           alert("Curriculum not found!");
//           navigate(-1);
//           return;
//         }
    
//         const sectionsCollection = collection(db, "curriculum", curriculumId, "sections");
//         const sectionsSnapshot = await getDocs(sectionsCollection);
    
//         const sectionsData = await Promise.all(
//           sectionsSnapshot.docs.map(async (sectionDoc) => {
//             const sectionData = { id: sectionDoc.id, ...sectionDoc.data() };
    
//             // Fetch mcq_tests
//             const mcqTestsCollection = collection(
//               db,
//               "curriculum",
//               curriculumId,
//               "sections",
//               sectionDoc.id,
//               "mcq_tests"
//             );
//             const mcqTestsSnapshot = await getDocs(mcqTestsCollection);
    
//             sectionData.mcq_tests = mcqTestsSnapshot.docs.map((testDoc) => ({
//               id: testDoc.id,
//               ...testDoc.data(),
//             }));
    
//             return sectionData;
//           })
//         );
    
//         setSections(sectionsData);
//       } catch (error) {
//         console.error("Error fetching curriculum:", error);
//       }
//     };
    
//     // const fetchCurriculum = async () => {
//     //   try {
//     //     const docRef = doc(db, "curriculum", curriculumId);
//     //     const docSnap = await getDoc(docRef);
  
//     //     if (docSnap.exists()) {
//     //       setCurriculum({ id: docSnap.id, ...docSnap.data() });
//     //     } else {
//     //       alert("Curriculum not found!");
//     //       navigate(-1);
//     //       return;
//     //     }
  
//     //     const sectionsCollection = collection(db, "curriculum", curriculumId, "sections");
//     //     const sectionsSnapshot = await getDocs(sectionsCollection);
  
//     //     const sectionsData = await Promise.all(
//     //       sectionsSnapshot.docs.map(async (sectionDoc) => {
//     //         const sectionData = { id: sectionDoc.id, ...sectionDoc.data() };
  
//     //         // Fetch mcq_tests
//     //         const mcqTestsCollection = collection(
//     //           db,
//     //           "curriculum",
//     //           curriculumId,
//     //           "sections",
//     //           sectionDoc.id,
//     //           "mcq_tests"
//     //         );
//     //         const mcqTestsSnapshot = await getDocs(mcqTestsCollection);
  
//     //         sectionData.mcq_tests = await Promise.all(
//     //           mcqTestsSnapshot.docs.map(async (mcqTestDoc) => {
//     //             const mcqTestData = { id: mcqTestDoc.id, ...mcqTestDoc.data() };
  
//     //             // Fetch mcqs for each mcq_test
//     //             const mcqsCollection = collection(
//     //               db,
//     //               "curriculum",
//     //               curriculumId,
//     //               "sections",
//     //               sectionDoc.id,
//     //               "mcq_tests",
//     //               mcqTestDoc.id,
//     //               "mcqs"
//     //             );
//     //             const mcqsSnapshot = await getDocs(mcqsCollection);
//     //             mcqTestData.mcqs = mcqsSnapshot.docs.map((mcqDoc) => ({
//     //               id: mcqDoc.id,
//     //               ...mcqDoc.data(),
//     //             }));
  
//     //             return mcqTestData;
//     //           })
//     //         );
  
//     //         return sectionData;
//     //       })
//     //     );
  
//     //     setSections(sectionsData);
//     //   } catch (error) {
//     //     console.error("Error fetching curriculum:", error);
//     //   }
//     // };
  
//     fetchCurriculum();
//   }, [curriculumId, navigate]);
  

//   // useEffect(() => {
//   //   const fetchCurriculum = async () => {
//   //     try {
//   //       const docRef = doc(db, "curriculum", curriculumId);
//   //       const docSnap = await getDoc(docRef);

//   //       if (docSnap.exists()) {
//   //         setCurriculum({ id: docSnap.id, ...docSnap.data() });
//   //       } else {
//   //         alert("Curriculum not found!");
//   //         navigate(-1);
//   //         return;
//   //       }

//   //       // Fetch sections and their materials
//   //       const sectionsCollection = collection(db, "curriculum", curriculumId, "sections");
//   //       const sectionsSnapshot = await getDocs(sectionsCollection);

//   //       const sectionsData = await Promise.all(
//   //         sectionsSnapshot.docs.map(async (sectionDoc) => {
//   //           const sectionData = { id: sectionDoc.id, ...sectionDoc.data() };

//   //           // Fetch materials from Firestore subcollection
//   //           const materialsCollection = collection(
//   //             db,
//   //             "curriculum",
//   //             curriculumId,
//   //             "sections",
//   //             sectionDoc.id,
//   //             "materials"
//   //           );
//   //           const materialsSnapshot = await getDocs(materialsCollection);

//   //           console.log(curriculum);

//   //           sectionData.materials = materialsSnapshot.docs.map((matDoc) => ({
//   //             id: matDoc.id,
//   //             ...matDoc.data(),
//   //           }));

//   //           return sectionData;
//   //         })
//   //       );

//   //       setSections(sectionsData);
//   //     } catch (error) {
//   //       console.error("Error fetching curriculum:", error);
//   //     }
//   //   };

//   //   fetchCurriculum();
//   // }, [curriculumId, navigate]);

//   const handleAddSection = async (newSection) => {
//     try {
//       const sectionRef = await addDoc(collection(db, "curriculum", curriculumId, "sections"), newSection);
//       setSections([...sections, { id: sectionRef.id, ...newSection, materials: [] }]);
//       setIsModalOpen(false);
//     } catch (error) {
//       console.error("Error adding section:", error);
//     }
//   };

//   const toggleSection = (index) => {
//     setExpandedSection(expandedSection === index ? null : index);
//   };

//   if (!curriculum) return <p>Loading...</p>;

//   return (
//     <div className="flex-col w-screen ml-80 p-4">
//       <button
//         onClick={() => navigate(-1)}
//         className="mb-4 px-4 py-2 bg-gray-300 rounded text-gray-700 hover:bg-gray-400"
//       >
//         &larr; Back
//       </button>
//       <h2 className="text-2xl font-bold mb-2">Create and Edit Your Curriculum</h2>
//       <p className="text-gray-600 mb-6">{curriculum.name}</p>

//       <div className="flex justify-between items-center mb-4">
//         <span className="text-sm bg-gray-200 text-gray-600 px-2 py-1 rounded">
//           {sections.length} Sections
//         </span>
//         <button
//           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//           onClick={() => setIsModalOpen(true)}
//         >
//           + Add Section
//         </button>
//       </div>

//       {sections.length > 0 ? (
//   sections.map((section, index) => (
    
//     // <div key={section.id} className="bg-gray-100 p-4 rounded mb-4">
//     //   <h3 className="text-lg font-semibold cursor-pointer" onClick={() => toggleSection(index)}>
//     //     {`${index + 1}. ${section.name || "Untitled Section"}`}
//     //   </h3>

//       {expandedSection === index && (
//         <div className="mt-2 p-2 border-l-4 border-blue-400 bg-gray-200">
//           <h4 className="text-md font-semibold">MCQ Tests:</h4>
//           {section.mcq_tests && section.mcq_tests.length > 0 ? (
//             section.mcq_tests.map((mcqTest) => (
//               <div key={mcqTest.id} className="mt-2">
//                 <h5 className="text-sm font-semibold">📝 {mcqTest.testName || "Unnamed MCQ Test"}</h5>
//                 <ul className="list-disc pl-4 text-sm text-gray-600">
//                   {mcqTest.mcqs.length > 0 ? (
//                     mcqTest.mcqs.map((mcq) => <li key={mcq.id}>{mcq.question}</li>)
//                   ) : (
//                     <li className="text-gray-500">No MCQs added.</li>
//                   )}
//                 </ul>
//               </div>
//             ))
//           ) : (
//             <p className="text-sm text-gray-500">No MCQ Tests available.</p>
//           )}
//         </div>
//       )}
//     </div>
//   ))
// ) : (
//   <p className="text-gray-500">No sections added yet.</p>
// )}


//       {/* {sections.length > 0 ? (
//         sections.map((section, index) => (
//           <div key={section.id} className="bg-gray-100 p-4 rounded mb-4">
//             <h3 className="text-lg font-semibold cursor-pointer" onClick={() => toggleSection(index)}>
//               {`${index + 1}. ${section.name || "Untitled Section"}`}
//             </h3>
//             <p className="text-gray-500">
//               {section.materials.length} material(s) • {section.totalDuration || "0s"}
//             </p>

//             {expandedSection === index && (
//               <div className="mt-2 p-2 border-l-4 border-blue-400 bg-gray-200">
//                 <h4 className="text-md font-semibold">Materials:</h4>
//                 {section.materials.length > 0 ? (
//                   <ul>
//                     {section.materials.map((material) => (
//                       <li key={material.id} className="text-sm text-gray-600">
//                         {material.type === "pdf" && `📄 PDF: ${material.name}`}
//                         {material.type === "youtube" && `🎥 YouTube: ${material.videoTitle}`}
//                         {material.type === "mcq" && `📝 MCQs: ${material.questionCount} questions`}
//                         {material.type === "video" && `📹 Video: ${material.videoTitle}`}
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p className="text-sm text-gray-500">No materials added yet.</p>
//                 )}

//                 <button className="mt-2 text-blue-500 hover:underline">+ Add Material</button>
//               </div>
//             )}
//           </div>
//         ))
//       ) : (
//         <p className="text-gray-500">No sections added yet.</p>
//       )} */}

//       {isModalOpen && <AddSectionalModal curriculumId={curriculumId} onClose={() => setIsModalOpen(false)} />}
//     </div>
//   );
// };

// export default CurriculumEditor;


import React, { useEffect, useState } from "react";
import { db } from "../../../../config/firebase";
import { doc, getDoc, getDocs, collection, addDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import AddSectionalModal from "./AddSectionalModel.jsx";

const CurriculumEditor = () => {
  const { curriculumId } = useParams();
  const [curriculum, setCurriculum] = useState(null);
  const [sections, setSections] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        const docRef = doc(db, "curriculum", curriculumId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCurriculum({ id: docSnap.id, ...docSnap.data() });
        } else {
          alert("Curriculum not found!");
          navigate(-1);
          return;
        }

        const sectionsCollection = collection(db, "curriculum", curriculumId, "sections");
        const sectionsSnapshot = await getDocs(sectionsCollection);

        const sectionsData = await Promise.all(
          sectionsSnapshot.docs.map(async (sectionDoc) => {
            const sectionData = { id: sectionDoc.id, ...sectionDoc.data() };

            // Fetch mcq_tests
            const mcqTestsCollection = collection(
              db,
              "curriculum",
              curriculumId,
              "sections",
              sectionDoc.id,
              "mcq_tests"
            );
            const mcqTestsSnapshot = await getDocs(mcqTestsCollection);

            sectionData.mcq_tests = mcqTestsSnapshot.docs.map((testDoc) => ({
              id: testDoc.id,
              ...testDoc.data(),
            }));

            return sectionData;
          })
        );

        setSections(sectionsData);
      } catch (error) {
        console.error("Error fetching curriculum:", error);
      }
    };

    fetchCurriculum();
  }, [curriculumId, navigate]);

  const handleAddSection = async (newSection) => {
    try {
      const sectionRef = await addDoc(collection(db, "curriculum", curriculumId, "sections"), newSection);
      setSections([...sections, { id: sectionRef.id, ...newSection, mcq_tests: [] }]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding section:", error);
    }
  };

  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  if (!curriculum) return <p>Loading...</p>;

  return (
    <div className="flex-col w-screen ml-80 p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-300 rounded text-gray-700 hover:bg-gray-400"
      >
        &larr; Back
      </button>
      <h2 className="text-2xl font-bold mb-2">Create and Edit Your Curriculum</h2>
      <p className="text-gray-600 mb-6">{curriculum.name}</p>

      <div className="flex justify-between items-center mb-4">
        <span className="text-sm bg-gray-200 text-gray-600 px-2 py-1 rounded">
          {sections.length} Sections
        </span>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setIsModalOpen(true)}
        >
          + Add Section
        </button>
      </div>

      {sections.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Test Name</th>
              <th className="border p-2">Total MCQs</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((section) =>
              section.mcq_tests.length > 0 ? (
                section.mcq_tests.map((test) => (
                  <tr key={test.id} className="border">
                    <td className="border p-2">{test.testName || "Unnamed Test"}</td>
                    <td className="border p-2">{test.mcqs?.length || 0}</td>
                  </tr>
                ))
              ) : (
                <tr key={section.id}>
                  <td className="border p-2" colSpan={2}>
                    No MCQ Tests Available
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No sections added yet.</p>
      )}

      {isModalOpen && <AddSectionalModal curriculumId={curriculumId} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default CurriculumEditor;