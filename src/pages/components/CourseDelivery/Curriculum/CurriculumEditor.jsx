// // // // // // // import React, { useEffect, useState } from "react";
// // // // // // // import { db } from "../../../../config/firebase";
// // // // // // // import { doc, getDoc } from "firebase/firestore";
// // // // // // // import { useParams, useNavigate } from "react-router-dom";

// // // // // // // const CurriculumEditor = () => {
// // // // // // //   const { curriculumId } = useParams();
// // // // // // //   const [curriculum, setCurriculum] = useState(null);
// // // // // // //   const navigate = useNavigate();

// // // // // // //   useEffect(() => {
// // // // // // //     const fetchCurriculum = async () => {
// // // // // // //       const docRef = doc(db, "curriculum", curriculumId);
// // // // // // //       const docSnap = await getDoc(docRef);

// // // // // // //       if (docSnap.exists()) {
// // // // // // //         setCurriculum(docSnap.data());
// // // // // // //       } else {
// // // // // // //         alert("Curriculum not found!");
// // // // // // //         navigate(-1);
// // // // // // //       }
// // // // // // //     };

// // // // // // //     fetchCurriculum();
// // // // // // //   }, [curriculumId, navigate]);

// // // // // // //   if (!curriculum) return <p>Loading...</p>;

// // // // // // //   return (
// // // // // // //     <div className="flex-col w-screen ml-80 p-4">

// // // // // // //       <button
// // // // // // //         onClick={() => navigate(-1)}
// // // // // // //         className="mb-4 px-4 py-2 bg-gray-300 rounded text-gray-700 hover:bg-gray-400"
// // // // // // //       >
// // // // // // //         &larr; Back
// // // // // // //       </button>
// // // // // // //       <h2 className="text-2xl font-bold mb-2">Create and Edit Your Curriculum</h2>
// // // // // // //       <p className="text-gray-600 mb-6">{curriculum.name}</p>
// // // // // // //       <div className="flex justify-between items-center mb-4">
// // // // // // //         <span className="text-sm bg-gray-200 text-gray-600 px-2 py-1 rounded">
// // // // // // //           {curriculum.sections?.length || 0} Sections
// // // // // // //         </span>
// // // // // // //         <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
// // // // // // //           + Add Section
// // // // // // //         </button>
// // // // // // //       </div>
// // // // // // //       {curriculum.sections?.map((section, index) => (
// // // // // // //         <div key={index} className="bg-gray-100 p-4 rounded mb-4">
// // // // // // //           <h3 className="text-lg font-semibold">
// // // // // // //             {`${index + 1}. ${section.title || "Untitled Section"}`}
// // // // // // //           </h3>
// // // // // // //           <p className="text-gray-500">
// // // // // // //             {section.materials?.length || 0} material(s) • {section.totalDuration || "0s"}
// // // // // // //           </p>
// // // // // // //           <button className="mt-2 text-blue-500 hover:underline">+ Add Material</button>
// // // // // // //         </div>
// // // // // // //       ))}
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default CurriculumEditor;


// // // // // // import React, { useEffect, useState } from "react";
// // // // // // import { db } from "../../../../config/firebase";
// // // // // // import { doc, getDoc, updateDoc } from "firebase/firestore";
// // // // // // import { useParams, useNavigate } from "react-router-dom";
// // // // // // import AddSectionalModal from "./AddSectionalModel.jsx";

// // // // // // const CurriculumEditor = () => {
// // // // // //   const { curriculumId } = useParams();
// // // // // //   const [curriculum, setCurriculum] = useState(null);
// // // // // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // // // // //   const [expandedSection, setExpandedSection] = useState(null);
// // // // // //   const navigate = useNavigate();

// // // // // //   useEffect(() => {
// // // // // //     const fetchCurriculum = async () => {
// // // // // //       const docRef = doc(db, "curriculum", curriculumId);
// // // // // //       const docSnap = await getDoc(docRef);

// // // // // //       if (docSnap.exists()) {
// // // // // //         setCurriculum({ id: docSnap.id, ...docSnap.data() });
// // // // // //       } else {
// // // // // //         alert("Curriculum not found!");
// // // // // //         navigate(-1);
// // // // // //       }
// // // // // //     };

// // // // // //     fetchCurriculum();
// // // // // //   }, [curriculumId, navigate]);

// // // // // //   const handleAddSection = async (newSection) => {
// // // // // //     const updatedSections = [...(curriculum.sections || []), newSection];
// // // // // //     setCurriculum({ ...curriculum, sections: updatedSections });

// // // // // //     // Update Firestore
// // // // // //     await updateDoc(doc(db, "curriculum", curriculumId), { sections: updatedSections });
// // // // // //   };

// // // // // //   const toggleSection = (index) => {
// // // // // //     setExpandedSection(expandedSection === index ? null : index);
// // // // // //   };

// // // // // //   if (!curriculum) return <p>Loading...</p>;

// // // // // //   return (
// // // // // //     <div className="flex-col w-screen ml-80 p-4">
// // // // // //       <button
// // // // // //         onClick={() => navigate(-1)}
// // // // // //         className="mb-4 px-4 py-2 bg-gray-300 rounded text-gray-700 hover:bg-gray-400"
// // // // // //       >
// // // // // //         &larr; Back
// // // // // //       </button>
// // // // // //       <h2 className="text-2xl font-bold mb-2">Create and Edit Your Curriculum</h2>
// // // // // //       <p className="text-gray-600 mb-6">{curriculum.name}</p>

// // // // // //       <div className="flex justify-between items-center mb-4">
// // // // // //         <span className="text-sm bg-gray-200 text-gray-600 px-2 py-1 rounded">
// // // // // //           {curriculum.sections?.length || 0} Sections
// // // // // //         </span>
// // // // // //         <button
// // // // // //           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
// // // // // //           onClick={() => setIsModalOpen(true)}
// // // // // //         >
// // // // // //           + Add Section
// // // // // //         </button>
// // // // // //       </div>






// // // // // //       {curriculum.sections?.map((section, index) => (
// // // // // //         <div key={index} className="bg-gray-100 p-4 rounded mb-4">
// // // // // //           <h3
// // // // // //             className="text-lg font-semibold cursor-pointer"
// // // // // //             onClick={() => toggleSection(index)}
// // // // // //           >
// // // // // //             {`${index + 1}. ${section.title || "Untitled Section"}`}
// // // // // //           </h3>
// // // // // //           <p className="text-gray-500">
// // // // // //             {section.materials?.length || 0} material(s) • {section.totalDuration || "0s"}
// // // // // //           </p>

// // // // // //           {expandedSection === index && (
// // // // // //             <div className="mt-2 p-2 border-l-4 border-blue-400 bg-gray-200">
// // // // // //               <h4 className="text-md font-semibold">Materials:</h4>
// // // // // //               {section.materials?.length > 0 ? (
// // // // // //                 <ul>
// // // // // //                   {section.materials.map((material, i) => (
// // // // // //                     <li key={i} className="text-sm text-gray-600">
// // // // // //                       {material}
// // // // // //                     </li>
// // // // // //                   ))}
// // // // // //                 </ul>
// // // // // //               ) : (
// // // // // //                 <p className="text-sm text-gray-500">No materials added yet.</p>
// // // // // //               )}
// // // // // //               <button className="mt-2 text-blue-500 hover:underline">+ Add Material</button>
// // // // // //             </div>
// // // // // //           )}
// // // // // //         </div>
// // // // // //       ))}

// // // // // //       <AddSectionalModal
// // // // // //         isOpen={isModalOpen}
// // // // // //         onClose={() => setIsModalOpen(false)}
// // // // // //         onAddSection={handleAddSection}
// // // // // //       />
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // export default CurriculumEditor;


// // // // // // import React, { useEffect, useState } from "react";
// // // // // // import { db } from "../../../../config/firebase";
// // // // // // import { doc, getDoc, getDocs, collection, updateDoc } from "firebase/firestore";
// // // // // // import { useParams, useNavigate } from "react-router-dom";
// // // // // // import AddSectionalModal from "./AddSectionalModel.jsx";

// // // // // // const CurriculumEditor = () => {
// // // // // //   const { curriculumId } = useParams();
// // // // // //   const [curriculum, setCurriculum] = useState(null);
// // // // // //   const [sections, setSections] = useState([]);  // Store sections separately
// // // // // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // // // // //   const [expandedSection, setExpandedSection] = useState(null);
// // // // // //   const navigate = useNavigate();

// // // // // //   useEffect(() => {
// // // // // //     const fetchCurriculum = async () => {
// // // // // //       try {
// // // // // //         const docRef = doc(db, "curriculum", curriculumId);
// // // // // //         const docSnap = await getDoc(docRef);

// // // // // //         if (docSnap.exists()) {
// // // // // //           setCurriculum({ id: docSnap.id, ...docSnap.data() });
// // // // // //         } else {
// // // // // //           alert("Curriculum not found!");
// // // // // //           navigate(-1);
// // // // // //           return;
// // // // // //         }

// // // // // //         // Fetch sections from Firestore subcollection
// // // // // //         const sectionsCollection = collection(db, "curriculum", curriculumId, "sections");
// // // // // //         const sectionsSnapshot = await getDocs(sectionsCollection);

// // // // // //         const sectionsData = sectionsSnapshot.docs.map(doc => ({
// // // // // //           id: doc.id,
// // // // // //           ...doc.data(),
// // // // // //         }));

// // // // // //         setSections(sectionsData);
// // // // // //       } catch (error) {
// // // // // //         console.error("Error fetching curriculum:", error);
// // // // // //       }
// // // // // //     };

// // // // // //     fetchCurriculum();
// // // // // //   }, [curriculumId, navigate]);

// // // // // //   const handleAddSection = async (newSection) => {
// // // // // //     const updatedSections = [...sections, newSection];
// // // // // //     setSections(updatedSections);

// // // // // //     // Update Firestore by adding new section to subcollection
// // // // // //     const sectionDocRef = doc(collection(db, "curriculum", curriculumId, "sections"));
// // // // // //     await updateDoc(sectionDocRef, newSection);
// // // // // //   };

// // // // // //   const toggleSection = (index) => {
// // // // // //     setExpandedSection(expandedSection === index ? null : index);
// // // // // //   };

// // // // // //   if (!curriculum) return <p>Loading...</p>;

// // // // // //   return (
// // // // // //     <div className="flex-col w-screen ml-80 p-4">
// // // // // //       <button
// // // // // //         onClick={() => navigate(-1)}
// // // // // //         className="mb-4 px-4 py-2 bg-gray-300 rounded text-gray-700 hover:bg-gray-400"
// // // // // //       >
// // // // // //         &larr; Back
// // // // // //       </button>
// // // // // //       <h2 className="text-2xl font-bold mb-2">Create and Edit Your Curriculum</h2>
// // // // // //       <p className="text-gray-600 mb-6">{curriculum.name}</p>

// // // // // //       <div className="flex justify-between items-center mb-4">
// // // // // //         <span className="text-sm bg-gray-200 text-gray-600 px-2 py-1 rounded">
// // // // // //           {sections.length} Sections
// // // // // //         </span>
// // // // // //         <button
// // // // // //           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
// // // // // //           onClick={() => setIsModalOpen(true)}
// // // // // //         >
// // // // // //           + Add Section
// // // // // //         </button>
// // // // // //       </div>

// // // // // //       {sections.length > 0 ? (
// // // // // //         sections.map((section, index) => (
// // // // // //           <div key={section.id} className="bg-gray-100 p-4 rounded mb-4">
// // // // // //             <h3
// // // // // //               className="text-lg font-semibold cursor-pointer"
// // // // // //               onClick={() => toggleSection(index)}
// // // // // //             >
// // // // // //               {`${index + 1}. ${section.name || "Untitled Section"}`}
// // // // // //             </h3>
// // // // // //             <p className="text-gray-500">
// // // // // //               {section.materials?.length || 0} material(s) • {section.totalDuration || "0s"}
// // // // // //             </p>

// // // // // //             {expandedSection === index && (
// // // // // //               <div className="mt-2 p-2 border-l-4 border-blue-400 bg-gray-200">
// // // // // //                 <h4 className="text-md font-semibold">Materials:</h4>
// // // // // //                 {section.materials?.length > 0 ? (
// // // // // //                   <ul>
// // // // // //                     {section.materials.map((material, i) => (
// // // // // //                       <li key={i} className="text-sm text-gray-600">
// // // // // //                         {material}
// // // // // //                       </li>
// // // // // //                     ))}
// // // // // //                   </ul>
// // // // // //                 ) : (
// // // // // //                   <p className="text-sm text-gray-500">No materials added yet.</p>
// // // // // //                 )}
// // // // // //                 <button className="mt-2 text-blue-500 hover:underline">+ Add Material</button>
// // // // // //               </div>
// // // // // //             )}
// // // // // //           </div>
// // // // // //         ))
// // // // // //       ) : (
// // // // // //         <p className="text-gray-500">No sections added yet.</p>
// // // // // //       )}

// // // // // //       {/* <AddSectionalModal
// // // // // //         isOpen={isModalOpen}
// // // // // //         onClose={() => setIsModalOpen(false)}
// // // // // //         onAddSection={handleAddSection}
// // // // // //       /> */}
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // export default CurriculumEditor;



// // // // // import React, { useEffect, useState } from "react";
// // // // // import { db } from "../../../../config/firebase";
// // // // // import { doc, getDoc, getDocs, collection, addDoc } from "firebase/firestore";
// // // // // import { useParams, useNavigate } from "react-router-dom";
// // // // // import AddSectionalModal from "./AddSectionalModel.jsx";

// // // // // const CurriculumEditor = () => {
// // // // //   const { curriculumId } = useParams();
// // // // //   const [curriculum, setCurriculum] = useState(null);
// // // // //   const [sections, setSections] = useState([]);  // Store sections separately
// // // // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // // // //   const [expandedSection, setExpandedSection] = useState(null);
// // // // //   const navigate = useNavigate();

// // // // //   useEffect(() => {
// // // // //     const fetchCurriculum = async () => {
// // // // //       try {
// // // // //         const docRef = doc(db, "curriculum", curriculumId);
// // // // //         const docSnap = await getDoc(docRef);

// // // // //         if (docSnap.exists()) {
// // // // //           setCurriculum({ id: docSnap.id, ...docSnap.data() });
// // // // //         } else {
// // // // //           alert("Curriculum not found!");
// // // // //           navigate(-1);
// // // // //           return;
// // // // //         }

// // // // //         // Fetch sections from Firestore subcollection
// // // // //         const sectionsCollection = collection(db, "curriculum", curriculumId, "sections");
// // // // //         const sectionsSnapshot = await getDocs(sectionsCollection);

// // // // //         const sectionsData = sectionsSnapshot.docs.map(doc => ({
// // // // //           id: doc.id,
// // // // //           ...doc.data(),
// // // // //         }));

// // // // //         setSections(sectionsData);
// // // // //       } catch (error) {
// // // // //         console.error("Error fetching curriculum:", error);
// // // // //       }
// // // // //     };

// // // // //     fetchCurriculum();
// // // // //   }, [curriculumId, navigate]);

// // // // //   const handleAddSection = async (newSection) => {
// // // // //     try {
// // // // //       const sectionRef = await addDoc(collection(db, "curriculum", curriculumId, "sections"), newSection);
// // // // //       setSections([...sections, { id: sectionRef.id, ...newSection }]);
// // // // //       setIsModalOpen(false);  // Close modal after adding
// // // // //     } catch (error) {
// // // // //       console.error("Error adding section:", error);
// // // // //     }
// // // // //   };

// // // // //   const toggleSection = (index) => {
// // // // //     setExpandedSection(expandedSection === index ? null : index);
// // // // //   };

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
// // // // //           {sections.length} Sections
// // // // //         </span>
// // // // //         <button
// // // // //           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
// // // // //           onClick={() => setIsModalOpen(true)}
// // // // //         >
// // // // //           + Add Section
// // // // //         </button>
// // // // //       </div>

// // // // //       {sections.length > 0 ? (
// // // // //         sections.map((section, index) => (
// // // // //           <div key={section.id} className="bg-gray-100 p-4 rounded mb-4">
// // // // //             <h3
// // // // //               className="text-lg font-semibold cursor-pointer"
// // // // //               onClick={() => toggleSection(index)}
// // // // //             >
// // // // //               {`${index + 1}. ${section.name || "Untitled Section"}`}
// // // // //             </h3>
// // // // //             <p className="text-gray-500">
// // // // //               {section.materials?.length || 0} material(s) • {section.totalDuration || "0s"}
// // // // //             </p>

// // // // //             {expandedSection === index && (
// // // // //               <div className="mt-2 p-2 border-l-4 border-blue-400 bg-gray-200">
// // // // //                 <h4 className="text-md font-semibold">Materials:</h4>
// // // // //                 {section.materials?.length > 0 ? (
// // // // //                   <ul>
// // // // //                     {section.materials.map((material, i) => (
// // // // //                       <li key={i} className="text-sm text-gray-600">
// // // // //                         {material}
// // // // //                       </li>
// // // // //                     ))}
// // // // //                   </ul>
// // // // //                 ) : (
// // // // //                   <p className="text-sm text-gray-500">No materials added yet.</p>
// // // // //                 )}
// // // // //                 <button className="mt-2 text-blue-500 hover:underline">+ Add Material</button>
// // // // //               </div>
// // // // //             )}
// // // // //           </div>
// // // // //         ))
// // // // //       ) : (
// // // // //         <p className="text-gray-500">No sections added yet.</p>
// // // // //       )}

// // // // //       {/* Modal for adding sections */}
// // // // //       {/* <AddSectionalModal
// // // // //         isOpen={isModalOpen}
// // // // //         onClose={() => setIsModalOpen(false)}
// // // // //         onAddSection={handleAddSection}
// // // // //       /> */}
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default CurriculumEditor;


// // // // import React, { useEffect, useState } from "react";
// // // // import { db } from "../../../../config/firebase";
// // // // import { doc, getDoc, getDocs, collection, addDoc } from "firebase/firestore";
// // // // import { useParams, useNavigate } from "react-router-dom";
// // // // import AddSectionalModal from "./AddSectionalModel.jsx";

// // // // const CurriculumEditor = () => {
// // // //   const { curriculumId } = useParams();
// // // //   const [curriculum, setCurriculum] = useState(null);
// // // //   const [sections, setSections] = useState([]);  // Store sections separately
// // // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // // //   const [expandedSection, setExpandedSection] = useState(null);

// // // //   const [isMCQModalOpen, setIsMCQModalOpen] = useState(false);


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
// // // //     try {
// // // //       const sectionRef = await addDoc(collection(db, "curriculum", curriculumId, "sections"), newSection);
// // // //       setSections([...sections, { id: sectionRef.id, ...newSection }]);
// // // //       setIsModalOpen(false);  // Close modal after adding
// // // //     } catch (error) {
// // // //       console.error("Error adding section:", error);
// // // //     }
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

// // // //       {/* Modal for adding sections */}
// // // //       {isModalOpen && (
// // // //         <AddSectionalModal
// // // //           curriculumId={curriculumId}
// // // //           onClose={() => setIsModalOpen(false)}
// // // //         />
// // // //       )}
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
// // //   const [sections, setSections] = useState([]);
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

// // //         const sectionsCollection = collection(db, "curriculum", curriculumId, "sections");
// // //         const sectionsSnapshot = await getDocs(sectionsCollection);

// // //         const sectionsData = await Promise.all(
// // //           sectionsSnapshot.docs.map(async (sectionDoc) => {
// // //             const sectionData = { id: sectionDoc.id, ...sectionDoc.data() };

// // //             // Fetch mcq_tests
// // //             const mcqTestsCollection = collection(
// // //               db,
// // //               "curriculum",
// // //               curriculumId,
// // //               "sections",
// // //               sectionDoc.id,
// // //               "mcq_tests"
// // //             );
// // //             const mcqTestsSnapshot = await getDocs(mcqTestsCollection);

// // //             sectionData.mcq_tests = mcqTestsSnapshot.docs.map((testDoc) => ({
// // //               id: testDoc.id,
// // //               ...testDoc.data(),
// // //             }));

// // //             return sectionData;
// // //           })
// // //         );

// // //         setSections(sectionsData);
// // //       } catch (error) {
// // //         console.error("Error fetching curriculum:", error);
// // //       }
// // //     };

// // //     // const fetchCurriculum = async () => {
// // //     //   try {
// // //     //     const docRef = doc(db, "curriculum", curriculumId);
// // //     //     const docSnap = await getDoc(docRef);

// // //     //     if (docSnap.exists()) {
// // //     //       setCurriculum({ id: docSnap.id, ...docSnap.data() });
// // //     //     } else {
// // //     //       alert("Curriculum not found!");
// // //     //       navigate(-1);
// // //     //       return;
// // //     //     }

// // //     //     const sectionsCollection = collection(db, "curriculum", curriculumId, "sections");
// // //     //     const sectionsSnapshot = await getDocs(sectionsCollection);

// // //     //     const sectionsData = await Promise.all(
// // //     //       sectionsSnapshot.docs.map(async (sectionDoc) => {
// // //     //         const sectionData = { id: sectionDoc.id, ...sectionDoc.data() };

// // //     //         // Fetch mcq_tests
// // //     //         const mcqTestsCollection = collection(
// // //     //           db,
// // //     //           "curriculum",
// // //     //           curriculumId,
// // //     //           "sections",
// // //     //           sectionDoc.id,
// // //     //           "mcq_tests"
// // //     //         );
// // //     //         const mcqTestsSnapshot = await getDocs(mcqTestsCollection);

// // //     //         sectionData.mcq_tests = await Promise.all(
// // //     //           mcqTestsSnapshot.docs.map(async (mcqTestDoc) => {
// // //     //             const mcqTestData = { id: mcqTestDoc.id, ...mcqTestDoc.data() };

// // //     //             // Fetch mcqs for each mcq_test
// // //     //             const mcqsCollection = collection(
// // //     //               db,
// // //     //               "curriculum",
// // //     //               curriculumId,
// // //     //               "sections",
// // //     //               sectionDoc.id,
// // //     //               "mcq_tests",
// // //     //               mcqTestDoc.id,
// // //     //               "mcqs"
// // //     //             );
// // //     //             const mcqsSnapshot = await getDocs(mcqsCollection);
// // //     //             mcqTestData.mcqs = mcqsSnapshot.docs.map((mcqDoc) => ({
// // //     //               id: mcqDoc.id,
// // //     //               ...mcqDoc.data(),
// // //     //             }));

// // //     //             return mcqTestData;
// // //     //           })
// // //     //         );

// // //     //         return sectionData;
// // //     //       })
// // //     //     );

// // //     //     setSections(sectionsData);
// // //     //   } catch (error) {
// // //     //     console.error("Error fetching curriculum:", error);
// // //     //   }
// // //     // };

// // //     fetchCurriculum();
// // //   }, [curriculumId, navigate]);


// // //   // useEffect(() => {
// // //   //   const fetchCurriculum = async () => {
// // //   //     try {
// // //   //       const docRef = doc(db, "curriculum", curriculumId);
// // //   //       const docSnap = await getDoc(docRef);

// // //   //       if (docSnap.exists()) {
// // //   //         setCurriculum({ id: docSnap.id, ...docSnap.data() });
// // //   //       } else {
// // //   //         alert("Curriculum not found!");
// // //   //         navigate(-1);
// // //   //         return;
// // //   //       }

// // //   //       // Fetch sections and their materials
// // //   //       const sectionsCollection = collection(db, "curriculum", curriculumId, "sections");
// // //   //       const sectionsSnapshot = await getDocs(sectionsCollection);

// // //   //       const sectionsData = await Promise.all(
// // //   //         sectionsSnapshot.docs.map(async (sectionDoc) => {
// // //   //           const sectionData = { id: sectionDoc.id, ...sectionDoc.data() };

// // //   //           // Fetch materials from Firestore subcollection
// // //   //           const materialsCollection = collection(
// // //   //             db,
// // //   //             "curriculum",
// // //   //             curriculumId,
// // //   //             "sections",
// // //   //             sectionDoc.id,
// // //   //             "materials"
// // //   //           );
// // //   //           const materialsSnapshot = await getDocs(materialsCollection);

// // //   //           console.log(curriculum);

// // //   //           sectionData.materials = materialsSnapshot.docs.map((matDoc) => ({
// // //   //             id: matDoc.id,
// // //   //             ...matDoc.data(),
// // //   //           }));

// // //   //           return sectionData;
// // //   //         })
// // //   //       );

// // //   //       setSections(sectionsData);
// // //   //     } catch (error) {
// // //   //       console.error("Error fetching curriculum:", error);
// // //   //     }
// // //   //   };

// // //   //   fetchCurriculum();
// // //   // }, [curriculumId, navigate]);

// // //   const handleAddSection = async (newSection) => {
// // //     try {
// // //       const sectionRef = await addDoc(collection(db, "curriculum", curriculumId, "sections"), newSection);
// // //       setSections([...sections, { id: sectionRef.id, ...newSection, materials: [] }]);
// // //       setIsModalOpen(false);
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
// // //   sections.map((section, index) => (

// // //     // <div key={section.id} className="bg-gray-100 p-4 rounded mb-4">
// // //     //   <h3 className="text-lg font-semibold cursor-pointer" onClick={() => toggleSection(index)}>
// // //     //     {`${index + 1}. ${section.name || "Untitled Section"}`}
// // //     //   </h3>

// // //       {expandedSection === index && (
// // //         <div className="mt-2 p-2 border-l-4 border-blue-400 bg-gray-200">
// // //           <h4 className="text-md font-semibold">MCQ Tests:</h4>
// // //           {section.mcq_tests && section.mcq_tests.length > 0 ? (
// // //             section.mcq_tests.map((mcqTest) => (
// // //               <div key={mcqTest.id} className="mt-2">
// // //                 <h5 className="text-sm font-semibold">📝 {mcqTest.testName || "Unnamed MCQ Test"}</h5>
// // //                 <ul className="list-disc pl-4 text-sm text-gray-600">
// // //                   {mcqTest.mcqs.length > 0 ? (
// // //                     mcqTest.mcqs.map((mcq) => <li key={mcq.id}>{mcq.question}</li>)
// // //                   ) : (
// // //                     <li className="text-gray-500">No MCQs added.</li>
// // //                   )}
// // //                 </ul>
// // //               </div>
// // //             ))
// // //           ) : (
// // //             <p className="text-sm text-gray-500">No MCQ Tests available.</p>
// // //           )}
// // //         </div>
// // //       )}
// // //     </div>
// // //   ))
// // // ) : (
// // //   <p className="text-gray-500">No sections added yet.</p>
// // // )}


// // //       {/* {sections.length > 0 ? (
// // //         sections.map((section, index) => (
// // //           <div key={section.id} className="bg-gray-100 p-4 rounded mb-4">
// // //             <h3 className="text-lg font-semibold cursor-pointer" onClick={() => toggleSection(index)}>
// // //               {`${index + 1}. ${section.name || "Untitled Section"}`}
// // //             </h3>
// // //             <p className="text-gray-500">
// // //               {section.materials.length} material(s) • {section.totalDuration || "0s"}
// // //             </p>

// // //             {expandedSection === index && (
// // //               <div className="mt-2 p-2 border-l-4 border-blue-400 bg-gray-200">
// // //                 <h4 className="text-md font-semibold">Materials:</h4>
// // //                 {section.materials.length > 0 ? (
// // //                   <ul>
// // //                     {section.materials.map((material) => (
// // //                       <li key={material.id} className="text-sm text-gray-600">
// // //                         {material.type === "pdf" && `📄 PDF: ${material.name}`}
// // //                         {material.type === "youtube" && `🎥 YouTube: ${material.videoTitle}`}
// // //                         {material.type === "mcq" && `📝 MCQs: ${material.questionCount} questions`}
// // //                         {material.type === "video" && `📹 Video: ${material.videoTitle}`}
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
// // //       )} */}

// // //       {isModalOpen && <AddSectionalModal curriculumId={curriculumId} onClose={() => setIsModalOpen(false)} />}
// // //     </div>
// // //   );
// // // };

// // // export default CurriculumEditor;


// // // import React, { useEffect, useState } from "react";
// // // import { db } from "../../../../config/firebase";
// // // import { doc, getDoc, getDocs, collection, addDoc } from "firebase/firestore";
// // // import { useParams, useNavigate } from "react-router-dom";
// // // import AddSectionalModal from "./AddSectionalModel.jsx";

// // // const CurriculumEditor = () => {
// // //   const { curriculumId } = useParams();
// // //   const [curriculum, setCurriculum] = useState(null);
// // //   const [sections, setSections] = useState([]);
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

// // //         const sectionsCollection = collection(db, "curriculum", curriculumId, "sections");
// // //         const sectionsSnapshot = await getDocs(sectionsCollection);

// // //         const sectionsData = await Promise.all(
// // //           sectionsSnapshot.docs.map(async (sectionDoc) => {
// // //             const sectionData = { id: sectionDoc.id, ...sectionDoc.data() };

// // //             // Fetch mcq_tests
// // //             const mcqTestsCollection = collection(
// // //               db,
// // //               "curriculum",
// // //               curriculumId,
// // //               "sections",
// // //               sectionDoc.id,
// // //               "mcq_tests"
// // //             );
// // //             const mcqTestsSnapshot = await getDocs(mcqTestsCollection);

// // //             sectionData.mcq_tests = mcqTestsSnapshot.docs.map((testDoc) => ({
// // //               id: testDoc.id,
// // //               ...testDoc.data(),
// // //             }));

// // //             return sectionData;
// // //           })
// // //         );

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
// // //       setSections([...sections, { id: sectionRef.id, ...newSection, mcq_tests: [] }]);
// // //       setIsModalOpen(false);
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
// // //         <table className="w-full border-collapse border border-gray-300 mt-4">
// // //           <thead>
// // //             <tr className="bg-gray-200">
// // //               <th className="border p-2">Test Name</th>
// // //               <th className="border p-2">Total MCQs</th>
// // //             </tr>
// // //           </thead>
// // //           <tbody>
// // //             {sections.map((section) =>
// // //               section.mcq_tests.length > 0 ? (
// // //                 section.mcq_tests.map((test) => (
// // //                   <tr key={test.id} className="border">
// // //                     <td className="border p-2">{test.testName || "Unnamed Test"}</td>
// // //                     <td className="border p-2">{test.mcqs?.length || 0}</td>
// // //                   </tr>
// // //                 ))
// // //               ) : (
// // //                 <tr key={section.id}>
// // //                   <td className="border p-2" colSpan={2}>
// // //                     No MCQ Tests Available
// // //                   </td>
// // //                 </tr>
// // //               )
// // //             )}
// // //           </tbody>
// // //         </table>
// // //       ) : (
// // //         <p className="text-gray-500">No sections added yet.</p>
// // //       )}

// // //       {isModalOpen && <AddSectionalModal curriculumId={curriculumId} onClose={() => setIsModalOpen(false)} />}
// // //     </div>
// // //   );
// // // };

// // // export default CurriculumEditor;



// // // import React, { useEffect, useState } from "react";
// // // import { db } from "../../../../config/firebase";
// // // import { doc, getDoc, getDocs, collection, addDoc } from "firebase/firestore";
// // // import { useParams, useNavigate } from "react-router-dom";
// // // import AddSectionalModal from "./AddSectionalModel.jsx";

// // // const CurriculumEditor = () => {
// // //   const { curriculumId } = useParams();
// // //   const [curriculum, setCurriculum] = useState(null);
// // //   const [sections, setSections] = useState([]);
// // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // //   const [selectedSection, setSelectedSection] = useState(null);
// // //   const [sectionOptionsOpen, setSectionOptionsOpen] = useState(false);
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

// // //         const sectionsCollection = collection(db, "curriculum", curriculumId, "sections");
// // //         const sectionsSnapshot = await getDocs(sectionsCollection);

// // //         const sectionsData = sectionsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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
// // //       setIsModalOpen(false);
// // //     } catch (error) {
// // //       console.error("Error adding section:", error);
// // //     }
// // //   };

// // //   return (
// // //     <div className="flex-col w-screen ml-80 p-4">
// // //       <button onClick={() => navigate(-1)} className="mb-4 px-4 py-2 bg-gray-300 rounded">&larr; Back</button>
// // //       <h2 className="text-2xl font-bold mb-2">Create and Edit Your Curriculum</h2>
// // //       <p className="text-gray-600 mb-6">{curriculum?.name}</p>

// // //       <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setIsModalOpen(true)}>
// // //         + Add Section
// // //       </button>

// // //       <table className="w-full border-collapse border border-gray-300 mt-4">
// // //         <thead>
// // //           <tr className="bg-gray-200">
// // //             <th className="border p-2">Section Name</th>
// // //             <th className="border p-2">Actions</th>
// // //           </tr>
// // //         </thead>
// // //         <tbody>
// // //           {sections.map((section) => (
// // //             <tr key={section.id} className="border">
// // //               <td className="border p-2">{section.name}</td>
// // //               <td className="border p-2">
// // //                 <button
// // //                   className="bg-green-500 text-white px-2 py-1 rounded"
// // //                   onClick={() => {
// // //                     setSelectedSection(section);
// // //                     setSectionOptionsOpen(true);
// // //                   }}
// // //                 >
// // //                   Add Material
// // //                 </button>
// // //               </td>
// // //             </tr>
// // //           ))}
// // //         </tbody>
// // //       </table>

// // //       {isModalOpen && <AddSectionalModal curriculumId={curriculumId} onClose={() => setIsModalOpen(false)} />} 

// // //       {sectionOptionsOpen && selectedSection && (
// // //         <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
// // //           <div className="bg-white p-6 rounded-lg">
// // //             <h2 className="text-lg font-semibold">{selectedSection.name} - Options</h2>
// // //             <button className="bg-purple-500 text-white px-4 py-2 rounded mb-2">Add MCQs</button>
// // //             <button className="bg-blue-500 text-white px-4 py-2 rounded mb-2">Upload PDF</button>
// // //             <button className="bg-blue-500 text-white px-4 py-2 rounded mb-2">Upload Video</button>
// // //             <button className="bg-red-500 text-white px-4 py-2 rounded">Add YouTube Link</button>
// // //             <button
// // //               className="bg-gray-400 text-white px-4 py-2 rounded mt-4"
// // //               onClick={() => {
// // //                 setSectionOptionsOpen(false);
// // //                 setSelectedSection(null);
// // //               }}
// // //             >
// // //               Cancel
// // //             </button>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default CurriculumEditor;


// // import React, { useEffect, useState } from "react";
// // import { db } from "../../../../config/firebase";
// // import { doc, getDoc, getDocs, collection, addDoc } from "firebase/firestore";
// // import { useParams, useNavigate } from "react-router-dom";
// // import AddSectionalModal from "./AddSectionalModel.jsx";
// // import AddMCQModal from "./AddMCQModal.jsx"; // Import the modal
// // import { updateDoc, arrayUnion } from "firebase/firestore";

// // const CurriculumEditor = () => {
// //   const { curriculumId } = useParams();
// //   const [curriculum, setCurriculum] = useState(null);
// //   const [sections, setSections] = useState([]);
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [isMCQModalOpen, setIsMCQModalOpen] = useState(false); // MCQ modal state
// //   const [selectedSection, setSelectedSection] = useState(null);
// //   const [sectionOptionsOpen, setSectionOptionsOpen] = useState(false);
// //   const [youtubeLink, setYoutubeLink] = useState("");
// //   const [materials, setMaterials] = useState([]);
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

// //         const sectionsCollection = collection(db, "curriculum", curriculumId, "sections");
// //         const sectionsSnapshot = await getDocs(sectionsCollection);

// //         const sectionsData = sectionsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// //         setSections(sectionsData);
// //       } catch (error) {
// //         console.error("Error fetching curriculum:", error);
// //       }
// //     };

// //     fetchCurriculum();
// //   }, [curriculumId, navigate]);

// //   const handleAddYouTubeLink = async () => {
// //     if (!selectedSection || !youtubeLink) return alert("No section selected or link provided");

// //     const sectionRef = doc(db, "curriculum", curriculumId, "sections", selectedSection.id);
// //     await updateDoc(sectionRef, {
// //       youtubeLinks: arrayUnion(youtubeLink),
// //     });

// //     setYoutubeLink("");
// //     alert("YouTube link added!");
// //   };


// //   const fetchMaterials = async (sectionId) => {
// //     const sectionRef = doc(db, "curriculum", curriculumId, "sections", sectionId);
// //     const sectionSnap = await getDoc(sectionRef);

// //     if (sectionSnap.exists()) {
// //       setMaterials(sectionSnap.data());
// //     }
// //   };

// //   return (
// //     <div className="flex-col w-screen ml-80 p-4">
// //       <button onClick={() => navigate(-1)} className="mb-4 px-4 py-2 bg-gray-300 rounded">&larr; Back</button>
// //       <h2 className="text-2xl font-bold mb-2">Create and Edit Your Curriculum</h2>
// //       <p className="text-gray-600 mb-6">{curriculum?.name}</p>

// //       <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setIsModalOpen(true)}>
// //         + Add Section
// //       </button>

// //       <table className="w-full border-collapse border border-gray-300 mt-4">
// //         <thead>
// //           <tr className="bg-gray-200">
// //             <th className="border p-2">Section Name</th>
// //             <th className="border p-2">Actions</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {sections.map((section) => (
// //             <tr key={section.id} className="border cursor-pointer" onClick={() => fetchMaterials(section.id)}>
// //               <td className="border p-2">{section.name}</td>
// //               <td className="border p-2">
// //                 <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={() => setSelectedSection(section)}>
// //                   Add Material
// //                 </button>
// //               </td>
// //             </tr>
// //           ))}
// //         </tbody>
// //         {/* <tbody>
// //           {sections.map((section) => (
// //             <tr key={section.id} className="border">
// //               <td className="border p-2">{section.name}</td>
// //               <td className="border p-2">
// //                 <button
// //                   className="bg-green-500 text-white px-2 py-1 rounded"
// //                   onClick={() => {
// //                     setSelectedSection(section);
// //                     setSectionOptionsOpen(true);
// //                   }}
// //                 >
// //                   Add Material
// //                 </button>
// //               </td>
// //             </tr>
// //           ))}
// //         </tbody> */}
// //       </table>

// //       {materials.pdfs && materials.pdfs.map((pdf, index) => (
// //         <a key={index} href={pdf} target="_blank" rel="noopener noreferrer">View PDF {index + 1}</a>
// //       ))}

// //       {materials.videos && materials.videos.map((video, index) => (
// //         <a key={index} href={video} target="_blank" rel="noopener noreferrer">View Video {index + 1}</a>
// //       ))}

// //       {materials.youtubeLinks && materials.youtubeLinks.map((link, index) => (
// //         <a key={index} href={link} target="_blank" rel="noopener noreferrer">Watch on YouTube {index + 1}</a>
// //       ))}


// //       {isModalOpen && <AddSectionalModal curriculumId={curriculumId} onClose={() => setIsModalOpen(false)} />}

// //       {sectionOptionsOpen && selectedSection && (
// //         <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
// //           <div className="bg-white p-6 rounded-lg">
// //             <h2 className="text-lg font-semibold">{selectedSection.name} - Options</h2>

// //             <button
// //               className="bg-purple-500 text-white px-4 py-2 rounded mb-2"
// //               onClick={() => {
// //                 setIsMCQModalOpen(true);
// //                 setSectionOptionsOpen(false); // Close section options modal
// //               }}
// //             >
// //               Add MCQs
// //             </button>
// //             <input type="file" id="pdfUpload" onChange={(e) => handleFileUpload(e.target.files[0], "pdfs")} hidden />
// //             <button className="bg-blue-500 text-white px-4 py-2 rounded mb-2" onClick={() => document.getElementById("pdfUpload").click()}>
// //               Upload PDF
// //             </button>

// //             <input type="file" id="videoUpload" onChange={(e) => handleFileUpload(e.target.files[0], "videos")} hidden />
// //             <button className="bg-blue-500 text-white px-4 py-2 rounded mb-2" onClick={() => document.getElementById("videoUpload").click()}>
// //               Upload Video
// //             </button>

// //             <input type="text" value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} placeholder="Enter YouTube URL" />
// //             <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleAddYouTubeLink}>
// //               Add YouTube Link
// //             </button>
// //             {/* <button className="bg-blue-500 text-white px-4 py-2 rounded mb-2">Upload PDF</button>
// //             <button className="bg-blue-500 text-white px-4 py-2 rounded mb-2">Upload Video</button> */}
// //             {/* <button className="bg-red-500 text-white px-4 py-2 rounded">Add YouTube Link</button> */}

// //             <button
// //               className="bg-gray-400 text-white px-4 py-2 rounded mt-4"
// //               onClick={() => {
// //                 setSectionOptionsOpen(false);
// //                 setSelectedSection(null);
// //               }}
// //             >
// //               Cancel
// //             </button>
// //           </div>
// //         </div>
// //       )}

// //       {isMCQModalOpen && selectedSection && (
// //         <AddMCQModal
// //           curriculumId={curriculumId}
// //           sectionId={selectedSection.id}
// //           onClose={() => {
// //             setIsMCQModalOpen(false);
// //             setSelectedSection(null);
// //           }}
// //         />
// //       )}
// //     </div>
// //   );
// // };

// // export default CurriculumEditor;


// // import React, { useEffect, useState } from "react";
// // import { db, storage } from "../../../../config/firebase";
// // import { doc, getDoc, getDocs, collection, addDoc, updateDoc, arrayUnion } from "firebase/firestore";
// // import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// // import { useParams, useNavigate } from "react-router-dom";
// // import AddSectionalModal from "./AddSectionalModel.jsx";
// // import AddMCQModal from "./AddMCQModal.jsx"; // Import the modal

// // const CurriculumEditor = () => {
// //   const { curriculumId } = useParams();
// //   const [curriculum, setCurriculum] = useState(null);
// //   const [sections, setSections] = useState([]);
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [isMCQModalOpen, setIsMCQModalOpen] = useState(false);
// //   const [selectedSection, setSelectedSection] = useState(null);
// //   const [sectionOptionsOpen, setSectionOptionsOpen] = useState(false);
// //   const [youtubeLink, setYoutubeLink] = useState("");
// //   const [materials, setMaterials] = useState({ pdfs: [], videos: [], youtubeLinks: [] });
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

// //         const sectionsCollection = collection(db, "curriculum", curriculumId, "sections");
// //         const sectionsSnapshot = await getDocs(sectionsCollection);

// //         const sectionsData = sectionsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// //         setSections(sectionsData);
// //       } catch (error) {
// //         console.error("Error fetching curriculum:", error);
// //       }
// //     };

// //     fetchCurriculum();
// //   }, [curriculumId, navigate]);

// //   const handleAddYouTubeLink = async () => {
// //     if (!selectedSection || !youtubeLink) return alert("No section selected or link provided");

// //     const sectionRef = doc(db, "curriculum", curriculumId, "sections", selectedSection.id);
// //     await updateDoc(sectionRef, {
// //       youtubeLinks: arrayUnion(youtubeLink),
// //     });

// //     setYoutubeLink("");
// //     alert("YouTube link added!");
// //   };

// //   const handleFileUpload = async (file, type) => {
// //     if (!selectedSection) return alert("Select a section first");

// //     const fileRef = ref(storage, `sections/${selectedSection.id}/${file.name}`);
// //     await uploadBytes(fileRef, file);
// //     const fileURL = await getDownloadURL(fileRef);

// //     const sectionRef = doc(db, "curriculum", curriculumId, "sections", selectedSection.id);
// //     await updateDoc(sectionRef, {
// //       [type]: arrayUnion(fileURL),
// //     });

// //     alert(`${type === "pdfs" ? "PDF" : "Video"} uploaded successfully!`);
// //   };

// //   const fetchMaterials = async (sectionId) => {
// //     const sectionRef = doc(db, "curriculum", curriculumId, "sections", sectionId);
// //     const sectionSnap = await getDoc(sectionRef);

// //     if (sectionSnap.exists()) {
// //       const data = sectionSnap.data();
// //       setMaterials({
// //         pdfs: data.pdfs || [],
// //         videos: data.videos || [],
// //         youtubeLinks: data.youtubeLinks || [],
// //       });
// //     }
// //   };

// //   return (
// //     <div className="flex-col w-screen ml-80 p-4">
// //       <button onClick={() => navigate(-1)} className="mb-4 px-4 py-2 bg-gray-300 rounded">&larr; Back</button>
// //       <h2 className="text-2xl font-bold mb-2">Create and Edit Your Curriculum</h2>
// //       <p className="text-gray-600 mb-6">{curriculum?.name}</p>

// //       <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setIsModalOpen(true)}>
// //         + Add Section
// //       </button>

// //       <table className="w-full border-collapse border border-gray-300 mt-4">
// //         <thead>
// //           <tr className="bg-gray-200">
// //             <th className="border p-2">Section Name</th>
// //             <th className="border p-2">Actions</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {sections.map((section) => (
// //             <tr key={section.id} className="border cursor-pointer" onClick={() => fetchMaterials(section.id)}>
// //               <td className="border p-2">{section.name}</td>
// //               <td className="border p-2">
// //                 <button
// //                   className="bg-green-500 text-white px-2 py-1 rounded"
// //                   onClick={() => {
// //                     setSelectedSection(section);
// //                     setSectionOptionsOpen(true);
// //                   }}
// //                 >
// //                   Add Material
// //                 </button>
// //               </td>
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>

// //       <div className="mt-4">
// //         <h3 className="text-lg font-bold">Materials</h3>
// //         {materials.pdfs.length > 0 && (
// //           <div>
// //             <h4 className="font-semibold mt-2">PDFs</h4>
// //             {materials.pdfs.map((pdf, index) => (
// //               <p key={index}><a href={pdf} target="_blank" rel="noopener noreferrer" className="text-blue-500">View PDF {index + 1}</a></p>
// //             ))}
// //           </div>
// //         )}
// //         {materials.videos.length > 0 && (
// //           <div>
// //             <h4 className="font-semibold mt-2">Videos</h4>
// //             {materials.videos.map((video, index) => (
// //               <p key={index}><a href={video} target="_blank" rel="noopener noreferrer" className="text-blue-500">Watch Video {index + 1}</a></p>
// //             ))}
// //           </div>
// //         )}
// //         {materials.youtubeLinks.length > 0 && (
// //           <div>
// //             <h4 className="font-semibold mt-2">YouTube Links</h4>
// //             {materials.youtubeLinks.map((link, index) => (
// //               <p key={index}><a href={link} target="_blank" rel="noopener noreferrer" className="text-red-500">Watch on YouTube {index + 1}</a></p>
// //             ))}
// //           </div>
// //         )}
// //       </div>

// //       {isModalOpen && <AddSectionalModal curriculumId={curriculumId} onClose={() => setIsModalOpen(false)} />}

// //       {sectionOptionsOpen && selectedSection && (
// //         <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
// //           <div className="bg-white p-6 rounded-lg">
// //             <h2 className="text-lg font-semibold">{selectedSection.name} - Options</h2>

// //             <button className="bg-purple-500 text-white px-4 py-2 rounded mb-2" onClick={() => setIsMCQModalOpen(true)}>
// //               Add MCQs
// //             </button>

// //             <input type="file" id="pdfUpload" hidden onChange={(e) => handleFileUpload(e.target.files[0], "pdfs")} />
// //             <button className="bg-blue-500 text-white px-4 py-2 rounded mb-2" onClick={() => document.getElementById("pdfUpload").click()}>
// //               Upload PDF
// //             </button>

// //             <input type="file" id="videoUpload" hidden onChange={(e) => handleFileUpload(e.target.files[0], "videos")} />
// //             <button className="bg-blue-500 text-white px-4 py-2 rounded mb-2" onClick={() => document.getElementById("videoUpload").click()}>
// //               Upload Video
// //             </button>

// //             <input type="text" value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} placeholder="Enter YouTube URL" />
// //             <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleAddYouTubeLink}>
// //               Add YouTube Link
// //             </button>

// //             <button className="bg-gray-400 text-white px-4 py-2 rounded mt-4" onClick={() => setSectionOptionsOpen(false)}>Cancel</button>
// //           </div>
// //         </div>
// //       )}

// //       {isMCQModalOpen && selectedSection && <AddMCQModal curriculumId={curriculumId} sectionId={selectedSection.id} onClose={() => setIsMCQModalOpen(false)} />}
// //     </div>
// //   );
// // };

// // export default CurriculumEditor;



// // import React, { useEffect, useState } from "react";
// // import { db, storage } from "../../../../config/firebase";
// // import { doc, getDoc, getDocs, collection, updateDoc, arrayUnion } from "firebase/firestore";
// // import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// // import { useParams, useNavigate } from "react-router-dom";
// // import AddSectionalModal from "./AddSectionalModel.jsx";
// // import AddMCQModal from "./AddMCQModal.jsx"; 

// // const CurriculumEditor = () => {
// //   const { curriculumId } = useParams();
// //   const [curriculum, setCurriculum] = useState(null);
// //   const [sections, setSections] = useState([]);
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [isMCQModalOpen, setIsMCQModalOpen] = useState(false);
// //   const [selectedSection, setSelectedSection] = useState(null);
// //   const [sectionOptionsOpen, setSectionOptionsOpen] = useState(false);
// //   const [youtubeLink, setYoutubeLink] = useState("");
// //   const [materials, setMaterials] = useState({ pdfs: [], videos: [], youtubeLinks: [], mcqs: [] });
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

// //         const sectionsCollection = collection(db, "curriculum", curriculumId, "sections");
// //         const sectionsSnapshot = await getDocs(sectionsCollection);
// //         const sectionsData = sectionsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// //         setSections(sectionsData);
// //       } catch (error) {
// //         console.error("Error fetching curriculum:", error);
// //       }
// //     };

// //     fetchCurriculum();
// //   }, [curriculumId, navigate]);

// //   const fetchMaterials = async (sectionId) => {
// //     const sectionRef = doc(db, "curriculum", curriculumId, "sections", sectionId);
// //     const sectionSnap = await getDoc(sectionRef);

// //     if (sectionSnap.exists()) {
// //       const data = sectionSnap.data();
// //       setMaterials({
// //         pdfs: data.pdfs || [],
// //         videos: data.videos || [],
// //         youtubeLinks: data.youtubeLinks || [],
// //         mcqs: data.mcqs || [],
// //       });
// //     }
// //     setSelectedSection({ id: sectionId, ...sectionSnap.data() });
// //     setSectionOptionsOpen(true);
// //   };

// //   const handleAddYouTubeLink = async () => {
// //     if (!selectedSection || !youtubeLink) return alert("No section selected or link provided");

// //     const sectionRef = doc(db, "curriculum", curriculumId, "sections", selectedSection.id);
// //     await updateDoc(sectionRef, {
// //       youtubeLinks: arrayUnion(youtubeLink),
// //     });

// //     setYoutubeLink("");
// //     fetchMaterials(selectedSection.id);
// //     alert("YouTube link added!");
// //   };

// //   const handleFileUpload = async (file, type) => {
// //     if (!selectedSection) return alert("Select a section first");

// //     const fileRef = ref(storage, `sections/${selectedSection.id}/${file.name}`);
// //     await uploadBytes(fileRef, file);
// //     const fileURL = await getDownloadURL(fileRef);

// //     const sectionRef = doc(db, "curriculum", curriculumId, "sections", selectedSection.id);
// //     await updateDoc(sectionRef, {
// //       [type]: arrayUnion(fileURL),
// //     });

// //     fetchMaterials(selectedSection.id);
// //     alert(`${type === "pdfs" ? "PDF" : "Video"} uploaded successfully!`);
// //   };

// //   return (
// //     <div className="flex-col w-screen ml-80 p-4">
// //       <button onClick={() => navigate(-1)} className="mb-4 px-4 py-2 bg-gray-300 rounded">&larr; Back</button>
// //       <h2 className="text-2xl font-bold mb-2">Create and Edit Your Curriculum</h2>
// //       <p className="text-gray-600 mb-6">{curriculum?.name}</p>

// //       <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setIsModalOpen(true)}>
// //         + Add Section
// //       </button>

// //       <table className="w-full border-collapse border border-gray-300 mt-4">
// //         <thead>
// //           <tr className="bg-gray-200">
// //             <th className="border p-2">Section Name</th>
// //             <th className="border p-2">Actions</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {sections.map((section) => (
// //             <tr key={section.id} className="border cursor-pointer" onClick={() => fetchMaterials(section.id)}>
// //               <td className="border p-2">{section.name}</td>
// //               <td className="border p-2">
// //                 <button className="bg-green-500 text-white px-2 py-1 rounded">View Materials</button>
// //               </td>
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>

// //       {sectionOptionsOpen && selectedSection && (
// //         <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
// //           <div className="bg-white p-6 rounded-lg">
// //             <h2 className="text-lg font-semibold">{selectedSection.name} - Options</h2>

// //             <button className="bg-purple-500 text-white px-4 py-2 rounded mb-2" onClick={() => setIsMCQModalOpen(true)}>
// //               Add MCQs
// //             </button>

// //             <input type="file" id="pdfUpload" hidden onChange={(e) => handleFileUpload(e.target.files[0], "pdfs")} />
// //             <button className="bg-blue-500 text-white px-4 py-2 rounded mb-2" onClick={() => document.getElementById("pdfUpload").click()}>
// //               Upload PDF
// //             </button>

// //             <input type="file" id="videoUpload" hidden onChange={(e) => handleFileUpload(e.target.files[0], "videos")} />
// //             <button className="bg-blue-500 text-white px-4 py-2 rounded mb-2" onClick={() => document.getElementById("videoUpload").click()}>
// //               Upload Video
// //             </button>

// //             <input type="text" value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} placeholder="Enter YouTube URL" />
// //             <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleAddYouTubeLink}>
// //               Add YouTube Link
// //             </button>

// //             <h3 className="text-lg font-bold mt-4">Materials</h3>
// //             <ul>
// //               {materials.mcqs.length > 0 && <li><strong>MCQs:</strong> {materials.mcqs.length} questions</li>}
// //               {materials.pdfs.map((pdf, index) => (
// //                 <li key={index}><a href={pdf} target="_blank" className="text-blue-500">View PDF {index + 1}</a></li>
// //               ))}
// //               {materials.videos.map((video, index) => (
// //                 <li key={index}><a href={video} target="_blank" className="text-blue-500">Watch Video {index + 1}</a></li>
// //               ))}
// //             </ul>

// //             <button className="bg-gray-400 text-white px-4 py-2 rounded mt-4" onClick={() => setSectionOptionsOpen(false)}>Close</button>
// //           </div>
// //         </div>
// //       )}

// //       {isModalOpen && <AddSectionalModal curriculumId={curriculumId} onClose={() => setIsModalOpen(false)} />}
// //       {isMCQModalOpen && <AddMCQModal curriculumId={curriculumId} sectionId={selectedSection.id} onClose={() => setIsMCQModalOpen(false)} />}
// //     </div>
// //   );
// // };

// // export default CurriculumEditor;



// import React, { useEffect, useState } from "react";
// import { db } from "../../../../config/firebase";
// import { doc, getDoc, getDocs, collection } from "firebase/firestore";
// import { useParams, useNavigate } from "react-router-dom";
// import AddSectionalModal from "./AddSectionalModel.jsx";

// const CurriculumEditor = () => {
//   const { curriculumId } = useParams();
//   const [curriculum, setCurriculum] = useState(null);
//   const [sections, setSections] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
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
//         const sectionsData = sectionsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//         setSections(sectionsData);
//       } catch (error) {
//         console.error("Error fetching curriculum:", error);
//       }
//     };

//     fetchCurriculum();
//   }, [curriculumId, navigate]);

//   const handleSectionClick = (sectionId) => {
//     navigate(`/curriculum/${curriculumId}/section/${sectionId}`);
//   };

//   return (
//     <div className="flex-col w-screen ml-80 p-4">
//     {/* <div className="flex-col w-screen ml-80 p-4"> */}
//       <button onClick={() => navigate(-1)} className="mb-4 px-4 py-2 bg-gray-300 rounded">← Back</button>
//       <h2 className="text-2xl font-bold mb-2">Create and Edit Your Curriculum</h2>
//       <p className="text-gray-600 mb-6">{curriculum?.name}</p>

//       <button 
//         className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
//         onClick={() => setIsModalOpen(true)}
//       >
//         + Add Section
//       </button>

//       <table className="w-full border-collapse border border-gray-300 mt-4">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="border p-2">Section Name</th>
//             <th className="border p-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {sections.map((section) => (
//             <tr 
//               key={section.id} 
//               className="border cursor-pointer hover:bg-gray-100"
//               onClick={() => handleSectionClick(section.id)}
//             >
//               <td className="border p-2">{section.name}</td>
//               <td className="border p-2">
//                 <button 
//                   className="bg-blue-500 text-white px-2 py-1 rounded"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     navigate(`/curriculum/${curriculumId}/section/${section.id}/add-material`);
//                   }}
//                 >
//                   Add Material
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {isModalOpen && (
//         <AddSectionalModal 
//           curriculumId={curriculumId} 
//           onClose={() => setIsModalOpen(false)} 
//         />
//       )}
//     </div>
//   );
// };

// export default CurriculumEditor;

import React, { useEffect, useState } from "react";
import { db } from "../../../../config/firebase";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import AddSectionalModal from "./AddSectionalModel.jsx"; // Fixed typo in import

const CurriculumEditor = () => {
  const { curriculumId } = useParams();
  const [curriculum, setCurriculum] = useState(null);
  const [sections, setSections] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        const sectionsData = sectionsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setSections(sectionsData);
      } catch (error) {
        console.error("Error fetching curriculum:", error);
      }
    };

    fetchCurriculum();
  }, [curriculumId, navigate]);

  const handleSectionClick = (sectionId) => {
    navigate(`/curriculum/${curriculumId}/section/${sectionId}`);
  };

  return (
    <div className="flex flex-col w-full p-4 sm:p-6 md:ml-80">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-200 mb-4 sm:mb-0"
          >
            ← Back
          </button>
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Create and Edit Your Curriculum</h2>
          <p className="text-gray-600 text-sm sm:text-base mt-1">{curriculum?.name || "Loading..."}</p>
        </div>
      </div>

      {/* Add Section Button */}
      <div className="mb-6">
        <button
          className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
          onClick={() => setIsModalOpen(true)}
        >
          + Add Section
        </button>
      </div>

      {/* Sections Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[400px] border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-left text-sm font-medium">Section Name</th>
              <th className="border p-2 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sections.length > 0 ? (
              sections.map((section) => (
                <tr
                  key={section.id}
                  className="border-b cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSectionClick(section.id)}
                >
                  <td className="border p-2 text-sm sm:text-base">{section.name}</td>
                  <td className="border p-2">
                    <button
                      className="w-full sm:w-auto bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition duration-200 text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/curriculum/${curriculumId}/section/${section.id}/add-material`);
                      }}
                    >
                      Add Material
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="border p-2 text-center text-gray-500 text-sm sm:text-base">
                  No sections available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AddSectionalModal
          curriculumId={curriculumId}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default CurriculumEditor;