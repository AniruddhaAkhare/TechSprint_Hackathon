// // // import React, { useState, useEffect } from "react";
// // // import { db } from "../../../../config/firebase";
// // // import { collection, getDocs, addDoc } from "firebase/firestore";
// // // import CreateCurriculum from "./CreateCurriculum";
// // // import AddSectionModal from './AddSectionalModel.jsx'; // Import AddSectionModal
// // // import { useNavigate, useParams } from "react-router-dom";
// // // import SearchBar from "../../SearchBar";


// // // const Curriculum = () => {
// // //     const { courseId } = useParams();
// // // console.log("Course ID:", courseId); // Debugging

// // //     const { curriculumId } = useParams();

// // //     const [curriculums, setCurriculums] = useState([]);
// // //     const [isModalOpen, setIsModalOpen] = useState(false);
// // //     const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false); // State for AddSectionModal
// // //     const [selectedCurriculumId, setSelectedCurriculumId] = useState(null); // State for selected curriculum ID

// // //     const [searchTerm, setSearchTerm] = useState('');
// // //     const [searchResults, setSearchResults] = useState([]);
// // //     // const CurriculumCollectionRef = collection(db, "Curriculum");


// // //     const navigate = useNavigate();

// // //     const handleSearch = async (e) => {
// // //         if (e) e.preventDefault();
// // //         if (!searchTerm.trim()) {
// // //             setSearchResults([]);
// // //             return;
// // //         }
// // //         const results = curriculums.filter(curr =>
// // //             curr.name.toLowerCase().includes(searchTerm.toLowerCase())
// // //         );
// // //         setSearchResults(results);
// // //     };

// // //     useEffect(() => {
// // //         if (searchTerm) {
// // //             handleSearch();
// // //         } else {
// // //             setSearchResults([]);
// // //         }
// // //     }, [searchTerm]);


// // //     // const fetchCurriculums = async () => {
// // //     //     const snapshot = await getDocs(collection(db, "curriculum"));
// // //     //     const curriculumData = snapshot.docs
// // //     //         .map((doc, index) => ({
// // //     //             id: doc.id,
// // //     //             index: index + 1,
// // //     //             ...doc.data(),
// // //     //         }))
// // //     //         .filter(curriculum => curriculum.courseId === courseId);

// // //     //     setCurriculums(curriculumData);
// // //     // };

// // //     // const fetchCurriculums = async () => {
// // //     //     const snapshot = await getDocs(collection(db, "curriculum"));

// // //     //     const curriculumData = await Promise.all(snapshot.docs.map(async (doc, index) => {
// // //     //         const curriculum = { id: doc.id, index: index + 1, ...doc.data() };

// // //     //         // Fetch sections if they are in a subcollection
// // //     //         const sectionsSnapshot = await getDocs(collection(db, "curriculum", doc.id, "sections"));
// // //     //         const sections = sectionsSnapshot.docs.map(sectionDoc => sectionDoc.data().name); // Assuming sections have a 'name' field

// // //     //         return { ...curriculum, sections };
// // //     //     }));

// // //     //     setCurriculums(curriculumData);
// // //     // };

// // //     const fetchCurriculums = async () => {
// // //         const snapshot = await getDocs(collection(db, "curriculum"));

// // //         const curriculumData = await Promise.all(snapshot.docs.map(async (doc, index) => {
// // //             const curriculum = { id: doc.id, index: index + 1, ...doc.data() };

// // //             // Fetch sections if they are in a subcollection
// // //             const sectionsSnapshot = await getDocs(collection(db, "curriculum", doc.id, "sections"));
// // //             const sections = sectionsSnapshot.docs.map(sectionDoc => ({
// // //                 id: sectionDoc.id,
// // //                 name: sectionDoc.data().name
// // //             }));

// // //             return { ...curriculum, sections };
// // //         }));

// // //         setCurriculums(curriculumData);
// // //     };


// // //     useEffect(() => {
// // //         fetchCurriculums();
// // //     }, []);

// // //     const handleAddCurriculum = async (newCurriculum) => {
// // //         try {
// // //             // Ensure courseId is included
// // //             const curriculumWithCourseId = { ...newCurriculum, courseId };

// // //             console.log("Adding curriculum:", curriculumWithCourseId); // Debugging

// // //             const docRef = await addDoc(collection(db, "curriculum"), curriculumWithCourseId);
// // //             setCurriculums((prev) => [
// // //                 ...prev,
// // //                 { ...curriculumWithCourseId, id: docRef.id, index: prev.length + 1 },
// // //             ]);
// // //         } catch (error) {
// // //             console.error("Error adding curriculum:", error);
// // //         }
// // //     };


// // //     // const handleAddCurriculum = async (newCurriculum) => {
// // //     //     try {
// // //     //         const docRef = await addDoc(collection(db, "curriculum"), newCurriculum);
// // //     //         setCurriculums((prev) => [
// // //     //             ...prev,
// // //     //             { ...newCurriculum, id: docRef.id, index: prev.length + 1 },
// // //     //         ]);
// // //     //     } catch (error) {
// // //     //         console.error("Error adding curriculum:", error);
// // //     //     }
// // //     // };

// // //     const handleCurriculumClick = (curriculumId) => {
// // //         setSelectedCurriculumId(curriculumId);
// // //         setIsAddSectionModalOpen(true);
// // //     };

// // //     return (
// // //         <div className="flez-col w-screen ml-80 p-4">
// // //             <div className="justify-between items-center p-4 mb-4">
// // //                 <div className="flex-1">
// // //                     <h1 className="text-2xl font-semibold">Curriculum</h1>
// // //                 </div>
// // //                 <div>

// // //                     <button
// // //                         onClick={() => setIsModalOpen(true)}
// // //                         className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
// // //                     >
// // //                         + Add Curriculum
// // //                     </button>
// // //                 </div>
// // //             </div>
// // //             <div className="justify-between items-center p-4 mt-4">
// // //                 <SearchBar
// // //                     searchTerm={searchTerm}
// // //                     setSearchTerm={setSearchTerm}
// // //                     handleSearch={handleSearch}
// // //                 />

// // //             </div>
// // //             <div className="sec-3">
// // //                 <table className="data-table table">
// // //                     <thead className="table-secondary">
// // //                         <tr>
// // //                             <th >Sr.</th>
// // //                             <th >Curriculum Name</th>
// // //                             <th >Sections</th>
// // //                             <th >Actions</th>
// // //                         </tr>
// // //                     </thead>
// // //                     <tbody>
// // //                         {curriculums.length > 0 ? (
// // //                             (searchResults.length > 0 ? searchResults : curriculums).map((curriculum) => (

// // //                                 <tr key={curriculum.id} onClick={() => handleCurriculumClick(curriculum.id)}>
// // //                                     <td >
// // //                                         {curriculum.index.toString().padStart(2, "0")}
// // //                                     </td>
// // //                                     <td >{curriculum.name}</td>
// // //                                     {/* <td >{curriculum.sections}</td> */}
// // //                                     {/* <td>{curriculum.sections.length > 0 ? curriculum.sections.join(", ") : "No sections"}</td> */}
// // //                                     <td>
// // //                                         {curriculum.sections.length > 0 ? (
// // //                                             curriculum.sections.map((section) => (
// // //                                                 <button
// // //                                                     key={section.id}
// // //                                                     onClick={() => navigate(`/notes/${curriculum.id}/${section.id}`)}
// // //                                                     className="text-blue-500 underline hover:text-blue-700 mr-2"
// // //                                                 >
// // //                                                     {section.name}
// // //                                                 </button>
// // //                                             ))
// // //                                         ) : (
// // //                                             "No sections"
// // //                                         )}
// // //                                     </td>

// // //                                     <td >
// // //                                         <button onClick={() => setIsAddSectionModalOpen(true)} className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Edit</button>
// // //                                     </td>
// // //                                 </tr>
// // //                             ))) : (
// // //                             <tr>
// // //                                 <td colSpan="4" className="text-center py-4">
// // //                                     <div className="flex flex-col items-center space-y-4">
// // //                                         <p className="text-gray-600">No curriculum found </p>
// // //                                         <button
// // //                                             onClick={() => setIsModalOpen(true)}
// // //                                             className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
// // //                                         >
// // //                                             + Add Curriculum
// // //                                         </button>
// // //                                     </div>
// // //                                 </td>
// // //                             </tr>

// // //                         )}
// // //                     </tbody>

// // //                 </table>
// // //             </div>
// // //             <CreateCurriculum
// // //                 isOpen={isModalOpen}
// // //                 onClose={() => setIsModalOpen(false)}
// // //                 onSubmit={handleAddCurriculum}
// // //                 curriculumId={curriculumId}
// // //             />

// // //             {isAddSectionModalOpen && (
// // //                 <AddSectionModal curriculumId={selectedCurriculumId} onClose={() => setIsAddSectionModalOpen(false)} />
// // //             )}
// // //         </div>
// // //     );
// // // };

// // // export default Curriculum;

// // import React, { useState, useEffect } from "react";
// // import { db } from "../../../../config/firebase";
// // import { collection, getDocs, addDoc } from "firebase/firestore";
// // import CreateCurriculum from "./CreateCurriculum";
// // import AddSectionModal from './AddSectionalModel.jsx';
// // import { useNavigate, useParams } from "react-router-dom";
// // import SearchBar from "../../SearchBar";
// // import { storage } from "../../../../config/firebase";
// // import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// // import { doc, updateDoc, arrayUnion } from "firebase/firestore";

// // const Curriculum = () => {
// //     // const { courseId } = useParams();
// //     // console.log("Course ID:", courseId); // Debugging

// //     const [curriculums, setCurriculums] = useState([]);
// //     const [isModalOpen, setIsModalOpen] = useState(false);
// //     const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
// //     const [selectedCurriculumId, setSelectedCurriculumId] = useState(null);
// //     const [searchTerm, setSearchTerm] = useState('');
// //     const [searchResults, setSearchResults] = useState([]);

// //     const [selectedSection, setSelectedSection] = useState(null);
// //     const [sectionOptionsOpen, setSectionOptionsOpen] = useState(false);


// //     const navigate = useNavigate();

// //     const handleSearch = async (e) => {
// //         if (e) e.preventDefault();
// //         if (!searchTerm.trim()) {
// //             setSearchResults([]);
// //             return;
// //         }
// //         const results = curriculums.filter(curr =>
// //             curr.name.toLowerCase().includes(searchTerm.toLowerCase())
// //         );
// //         setSearchResults(results);
// //     };

// //     useEffect(() => {
// //         if (searchTerm) {
// //             handleSearch();
// //         } else {
// //             setSearchResults([]);
// //         }
// //     }, [searchTerm]);

// //     const fetchCurriculums = async () => {
// //         try {
// //             const snapshot = await getDocs(collection(db, "curriculum"));
// //             const curriculumData = await Promise.all(
// //                 snapshot.docs.map(async (doc, index) => {
// //                     const data = doc.data();
// //                     const sectionsSnapshot = await getDocs(collection(db, "curriculum", doc.id, "sections"));
// //                     const sectionRef = doc(db, "curriculum", selectedCurriculumId, "sections", selectedSection.id);

// //                     const sections = sectionsSnapshot.docs.map(sectionDoc => ({
// //                         id: sectionDoc.id,
// //                         name: sectionDoc.data().name || "Untitled Section",  // Ensure section has a name
// //                     }));

// //                     return {
// //                         id: doc.id,
// //                         index: index + 1,
// //                         name: data.name || "Untitled Curriculum",
// //                         sections: sections || [],
// //                     };
// //                 })
// //             );

// //             setCurriculums(curriculumData);
// //         } catch (error) {
// //             console.error("Error fetching curriculums with sections:", error);
// //         }
// //     };


// //     const handleUpload = async (type) => {
// //         const fileInput = document.createElement("input");
// //         fileInput.type = "file";
// //         fileInput.accept = type === "video" ? "video/*" : type === "pdf" ? "application/pdf" : "*/*";

// //         fileInput.onchange = async (e) => {
// //             const file = e.target.files[0];
// //             if (!file) return;

// //             const storageRef = ref(storage, `sections/${selectedSection.id}/${type}/${file.name}`);
// //             await uploadBytes(storageRef, file);

// //             const fileURL = await getDownloadURL(storageRef);
// //             await saveToFirestore(type, fileURL);
// //         };

// //         fileInput.click();
// //     };


// //     const saveToFirestore = async (type, fileURL) => {
// //         const sectionRef = doc(db, "sections", selectedSection.id);
// //         await updateDoc(sectionRef, {
// //             [type]: arrayUnion(fileURL),
// //         });

// //         alert(`${type.toUpperCase()} uploaded successfully!`);
// //     };

// //     const handleLink = async (type) => {
// //         const link = prompt("Enter YouTube Link:");
// //         if (!link) return;

// //         await saveToFirestore(type, link);
// //     };


// //     // const fetchCurriculums = async () => {
// //     //     const snapshot = await getDocs(collection(db, "curriculum"));

// //     //     const curriculumData = await Promise.all(snapshot.docs.map(async (doc, index) => {
// //     //         const data = doc.data();
// //     //         return {
// //     //             id: doc.id,
// //     //             index: index + 1,
// //     //             name: data.name || "Untitled Curriculum",  // Ensure name exists
// //     //             sections: []
// //     //         };
// //     //     }));

// //     //     setCurriculums(curriculumData);
// //     // };



// //     // const fetchCurriculums = async () => {
// //     //     const snapshot = await getDocs(collection(db, "curriculum"));

// //     //     const curriculumData = await Promise.all(snapshot.docs.map(async (doc, index) => {
// //     //         const curriculum = { id: doc.id, index: index + 1, ...doc.data() };

// //     //         // Fetch sections if they exist in a subcollection
// //     //         const sectionsSnapshot = await getDocs(collection(db, "curriculum", doc.id, "sections"));
// //     //         const sections = sectionsSnapshot.docs.map(sectionDoc => ({
// //     //             id: sectionDoc.id,
// //     //             name: sectionDoc.data().name
// //     //         }));

// //     //         return { ...curriculum, sections: sections || [] }; // Ensure sections is always an array
// //     //     }));

// //     //     setCurriculums(curriculumData);
// //     // };


// //     // const fetchCurriculums = async () => {
// //     //     const snapshot = await getDocs(collection(db, "curriculum"));
// //     //     const curriculumData = await Promise.all(snapshot.docs.map(async (doc, index) => {
// //     //         const curriculum = { id: doc.id, index: index + 1, ...doc.data() };
// //     //         const sectionsSnapshot = await getDocs(collection(db, "curriculum", doc.id, "sections"));
// //     //         const sections = sectionsSnapshot.docs.map(sectionDoc => ({
// //     //             id: sectionDoc.id,
// //     //             name: sectionDoc.data().name
// //     //         }));
// //     //         return { ...curriculum, sections };
// //     //     }));
// //     //     setCurriculums(curriculumData);
// //     // };

// //     useEffect(() => {
// //         fetchCurriculums();
// //     }, []);

// //     const handleAddCurriculum = async (newCurriculum) => {
// //         try {
// //             // if (!courseId) {
// //             //     console.error("Error: courseId is required.");
// //             //     return;
// //             // }

// //             const curriculumWithCourseId = { ...newCurriculum }; // Ensure courseId is included
// //             // const curriculumWithCourseId = { ...newCurriculum, courseId }; // Ensure courseId is included

// //             const docRef = await addDoc(collection(db, "curriculum"), curriculumWithCourseId);
// //             setCurriculums((prev) => [
// //                 ...prev,
// //                 // { ...curriculumWithCourseId, id: docRef.id, index: prev.length + 1 },
// //                 { id: docRef.id, index: prev.length + 1 },
// //             ]);
// //         } catch (error) {
// //             console.error("Error adding curriculum:", error);
// //         }
// //     };


// //     // const handleAddCurriculum = async (newCurriculum) => {
// //     //     try {
// //     //         const curriculumWithCourseId = { ...newCurriculum, courseId };
// //     //         console.log("Adding curriculum:", curriculumWithCourseId);
// //     //         const docRef = await addDoc(collection(db, "curriculum"), curriculumWithCourseId);
// //     //         setCurriculums((prev) => [
// //     //             ...prev,
// //     //             { ...curriculumWithCourseId, id: docRef.id, index: prev.length + 1 },
// //     //         ]);
// //     //     } catch (error) {
// //     //         console.error("Error adding curriculum:", error);
// //     //     }
// //     // };

// //     // useEffect(() => {
// //     //     console.log("Course ID:", courseId);
// //     // }, [courseId]);


// //     const handleCurriculumClick = (curriculumId) => {
// //         setSelectedCurriculumId(curriculumId);
// //         setIsAddSectionModalOpen(true);
// //     };


// //     {sectionOptionsOpen && selectedSection && (
// //         <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
// //             <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
// //                 <h2 className="text-lg font-semibold mb-4">{selectedSection.name} - Options</h2>

// //                 <button className="block w-full bg-blue-500 text-white py-2 rounded mb-2" onClick={() => handleUpload("pdf")}>
// //                     Upload PDF
// //                 </button>
// //                 <button className="block w-full bg-green-500 text-white py-2 rounded mb-2" onClick={() => handleUpload("video")}>
// //                     Upload Video
// //                 </button>
// //                 <button className="block w-full bg-red-500 text-white py-2 rounded mb-2" onClick={() => handleLink("youtube")}>
// //                     Add YouTube Link
// //                 </button>
// //                 <button className="block w-full bg-yellow-500 text-white py-2 rounded mb-2" onClick={() => handleUpload("notes")}>
// //                     Upload Notes
// //                 </button>
// //                 <button className="block w-full bg-purple-500 text-white py-2 rounded mb-2" onClick={() => handleUpload("mcqs")}>
// //                     Upload MCQs
// //                 </button>

// //                 <button className="block w-full bg-gray-400 text-white py-2 rounded mt-4" onClick={() => setSectionOptionsOpen(false)}>
// //                     Close
// //                 </button>
// //             </div>
// //         </div>
// //     )}


// //     return (
// //         <div className="flez-col w-screen ml-80 p-4">
// //             <div className="justify-between items-center p-4 mb-4">
// //                 <div className="flex-1">
// //                     <h1 className="text-2xl font-semibold">Curriculum</h1>
// //                 </div>
// //                 <div>
// //                     <button
// //                         onClick={() => setIsModalOpen(true)}
// //                         className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
// //                     >
// //                         + Add Curriculum
// //                     </button>
// //                 </div>
// //             </div>
// //             <div className="justify-between items-center p-4 mt-4">
// //                 <SearchBar
// //                     searchTerm={searchTerm}
// //                     setSearchTerm={setSearchTerm}
// //                     handleSearch={handleSearch}
// //                 />
// //             </div>
// //             <div className="sec-3">
// //                 <table className="data-table table">
// //                     <thead className="table-secondary">
// //                         <tr>
// //                             <th>Sr.</th>
// //                             <th>Curriculum Name</th>
// //                             <th>Sections</th>
// //                             <th>Actions</th>
// //                         </tr>
// //                     </thead>
// //                     <tbody>
// //                         {curriculums.length > 0 ? (
// //                             (searchResults.length > 0 ? searchResults : curriculums).map((curriculum) => (
// //                                 <tr key={curriculum.id} onClick={() => handleCurriculumClick(curriculum.id)}>
// //                                     <td>{curriculum.index.toString().padStart(2, "0")}</td>
// //                                     <td>{curriculum.name}</td>
// //                                     {/* <td>
// //                                         {Array.isArray(curriculum.sections) && curriculum.sections.length > 0 ? (
// //                                             curriculum.sections.map((section) => (
// //                                                 <button
// //                                                     key={section.id}
// //                                                     onClick={() => navigate(`/notes/${curriculum.id}/${section.id}`)}
// //                                                     className="text-blue-500 underline hover:text-blue-700 mr-2"
// //                                                 >
// //                                                     {section.name}
// //                                                 </button>
// //                                             ))
// //                                         ) : (
// //                                             "No sections"
// //                                         )}
// //                                     </td> */}

// //                                     <td>
// //     {curriculum.sections.length > 0 ? (
// //         curriculum.sections.map((section) => (
// //             <button
// //                 key={section.id}
// //                 onClick={() => {
// //                     setSelectedSection(section);
// //                     setSectionOptionsOpen(true);
// //                 }}
// //                 className="text-blue-500 underline hover:text-blue-700 mr-2"
// //             >
// //                 {section.name}
// //             </button>
// //         ))
// //     ) : (
// //         "No sections"
// //     )}
// // </td>


// //                                     {/* <td>
// //                                         {curriculum.sections.length > 0 ? (
// //                                             curriculum.sections.map((section) => (
// //                                                 <button
// //                                                     key={section.id}
// //                                                     onClick={() => navigate(`/notes/${curriculum.id}/${section.id}`)}
// //                                                     className="text-blue-500 underline hover:text-blue-700 mr-2"
// //                                                 >
// //                                                     {section.name}
// //                                                 </button>
// //                                             ))
// //                                         ) : (
// //                                             "No sections"
// //                                         )}
// //                                     </td> */}
// //                                     <td>
// //                                         <button onClick={() => setIsAddSectionModalOpen(true)} className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Edit</button>
// //                                     </td>
// //                                 </tr>
// //                             ))) : (
// //                             <tr>
// //                                 <td colSpan="4" className="text-center py-4">
// //                                     <div className="flex flex-col items-center space-y-4">
// //                                         <p className="text-gray-600">No curriculum found for this course</p>
// //                                         <button
// //                                             onClick={() => setIsModalOpen(true)}
// //                                             className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
// //                                         >
// //                                             + Add Curriculum
// //                                         </button>
// //                                     </div>
// //                                 </td>
// //                             </tr>
// //                         )}
// //                     </tbody>
// //                 </table>
// //             </div>
// //             {/* <CreateCurriculum
// //                 isOpen={isModalOpen}
// //                 onClose={() => setIsModalOpen(false)}
// //                 onSubmit={handleAddCurriculum}
// //                 courseId={courseId}
// //             /> */}

// //             <CreateCurriculum
// //                 isOpen={isModalOpen}
// //                 onClose={() => setIsModalOpen(false)}
// //                 onSubmit={handleAddCurriculum}
// //             // courseId={courseId}  // Ensure this prop is passed
// //             />

// //             {isAddSectionModalOpen && (
// //                 <AddSectionModal curriculumId={selectedCurriculumId} onClose={() => setIsAddSectionModalOpen(false)} />
// //             )}
// //         </div>
// //     );
// // };

// // export default Curriculum;


// import React, { useState, useEffect, useRef } from "react";
// import { db, storage } from "../../../../config/firebase";
// import { collection, getDocs, addDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import CreateCurriculum from "./CreateCurriculum";
// import AddSectionModal from "./AddSectionalModel.jsx";
// import SearchBar from "../../SearchBar";
// import { useNavigate } from "react-router-dom";

// const Curriculum = () => {
//     const [curriculums, setCurriculums] = useState([]);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
//     const [selectedCurriculumId, setSelectedCurriculumId] = useState(null);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [searchResults, setSearchResults] = useState([]);
//     const [selectedSection, setSelectedSection] = useState(null);
//     const [sectionOptionsOpen, setSectionOptionsOpen] = useState(false);

//     const fileInputRef = useRef(null);
//     const navigate = useNavigate();

//     useEffect(() => {
//         fetchCurriculums();
//     }, []);

//     useEffect(() => {
//         if (searchTerm) handleSearch();
//         else setSearchResults([]);
//     }, [searchTerm]);

//     const fetchCurriculums = async () => {
//         try {
//             const snapshot = await getDocs(collection(db, "curriculum"));
//             const curriculumData = await Promise.all(
//                 snapshot.docs.map(async (doc, index) => {
//                     const data = doc.data();
//                     const sectionsSnapshot = await getDocs(collection(db, "curriculum", doc.id, "sections"));

//                     const sections = await Promise.all(sectionsSnapshot.docs.map(async (sectionDoc) => {
//                         const sectionData = sectionDoc.data();
//                         const mcqsSnapshot = await getDocs(collection(db, "sections", sectionDoc.id, "mcqs"));

//                         const mcqs = mcqsSnapshot.docs.map(mcqDoc => ({
//                             id: mcqDoc.id,
//                             ...mcqDoc.data(),
//                         }));

//                         return {
//                             id: sectionDoc.id,
//                             name: sectionData.name || "Untitled Section",
//                             mcqs: mcqs || [], // Ensure MCQs are fetched
//                         };
//                     }));

//                     return {
//                         id: doc.id,
//                         index: index + 1,
//                         name: data.name || "Untitled Curriculum",
//                         sections: sections || [],
//                     };
//                 })
//             );

//             setCurriculums(curriculumData);
//         } catch (error) {
//             console.error("Error fetching curriculums with sections:", error);
//         }
//     };


//     // const fetchCurriculums = async () => {
//     //     try {
//     //         const snapshot = await getDocs(collection(db, "curriculum"));
//     //         const curriculumData = await Promise.all(
//     //             snapshot.docs.map(async (doc, index) => {
//     //                 const data = doc.data();
//     //                 const sectionsSnapshot = await getDocs(collection(db, "curriculum", doc.id, "sections"));
//     //                 const sections = sectionsSnapshot.docs.map(sectionDoc => ({
//     //                     id: sectionDoc.id,
//     //                     name: sectionDoc.data().name || "Untitled Section",
//     //                 }));
//     //                 return {
//     //                     id: doc.id,
//     //                     index: index + 1,
//     //                     name: data.name || "Untitled Curriculum",
//     //                     sections: sections || [],
//     //                 };
//     //             })
//     //         );
//     //         setCurriculums(curriculumData);
//     //     } catch (error) {
//     //         console.error("Error fetching curriculums:", error);
//     //     }
//     // };

//     const handleAddCurriculum = async (newCurriculum) => {
//         try {
//             const docRef = await addDoc(collection(db, "curriculum"), newCurriculum);
//             setCurriculums(prev => [
//                 ...prev,
//                 { id: docRef.id, index: prev.length + 1, name: newCurriculum.name, sections: [] }
//             ]);
//         } catch (error) {
//             console.error("Error adding curriculum:", error);
//         }
//     };

//     const handleSearch = () => {
//         if (!searchTerm.trim()) {
//             setSearchResults([]);
//             return;
//         }
//         const results = curriculums.filter(curr => curr.name.toLowerCase().includes(searchTerm.toLowerCase()));
//         setSearchResults(results);
//     };

//     const handleCurriculumClick = (curriculumId) => {
//         setSelectedCurriculumId(curriculumId);
//         setIsAddSectionModalOpen(true);
//     };

//     const handleUpload = async (type) => {
//         if (!selectedSection || !selectedCurriculumId) return;
//         fileInputRef.current.accept = type === "video" ? "video/*" : type === "pdf" ? "application/pdf" : "*/*";
//         fileInputRef.current.dataset.type = type;
//         fileInputRef.current.click();
//     };

//     const handleFileChange = async (e) => {
//         const file = e.target.files[0];
//         if (!file) return;

//         const type = e.target.dataset.type;
//         const storageRef = ref(storage, `sections/${selectedCurriculumId}/${selectedSection.id}/${type}/${file.name}`);
//         await uploadBytes(storageRef, file);
//         const fileURL = await getDownloadURL(storageRef);
//         await saveToFirestore(type, fileURL);
//     };

//     const handleLink = async (type) => {
//         const link = prompt("Enter YouTube Link:");
//         if (!link) return;
//         await saveToFirestore(type, link);
//     };

//     const saveToFirestore = async (type, fileURL) => {
//         const sectionRef = doc(db, "curriculum", selectedCurriculumId, "sections", selectedSection.id);
//         await updateDoc(sectionRef, {
//             [type]: arrayUnion(fileURL),
//         });
//         alert(`${type.toUpperCase()} uploaded successfully!`);
//     };

//     return (
//         <div className="flex-col w-screen ml-80 p-4">
//             <div className="flex justify-between items-center p-4 mb-4">
//                 <h1 className="text-2xl font-semibold">Curriculum</h1>
//                 <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
//                     + Add Curriculum
//                 </button>
//             </div>
//             <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleSearch={handleSearch} />

//             <table className="data-table table mt-4">
//                 <thead className="table-secondary">
//                     <tr>
//                         <th>Sr.</th>
//                         <th>Curriculum Name</th>
//                         <th>Sections</th>
//                         <th>Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {(searchResults.length > 0 ? searchResults : curriculums).map((curriculum) => (
//                         <tr key={curriculum.id}>
//                             <td>{curriculum.index.toString().padStart(2, "0")}</td>
//                             <td>{curriculum.name}</td>
//                             <td>
//                                 {curriculum.sections.length > 0 ? (
//                                     curriculum.sections.map((section) => (
//                                         <div key={section.id}>
//                                             <button
//                                                 onClick={() => {
//                                                     setSelectedSection(section);
//                                                     setSectionOptionsOpen(true);
//                                                 }}
//                                                 className="text-blue-500 underline hover:text-blue-700 mr-2"
//                                             >
//                                                 {section.name}
//                                             </button>
//                                             {section.mcqs.length > 0 && (
//                                                 <ul className="ml-4 text-gray-700">
//                                                     {section.mcqs.map((mcq, index) => (
//                                                         <li key={mcq.id} className="mt-1">
//                                                             {index + 1}. {mcq.question}
//                                                         </li>
//                                                     ))}
//                                                 </ul>
//                                             )}
//                                         </div>
//                                     ))
//                                 ) : (
//                                     "No sections"
//                                 )}
//                             </td>

//                             {/* <td>
//                                 {curriculum.sections.length > 0 ? (
//                                     curriculum.sections.map((section) => (
//                                         <button key={section.id} onClick={() => {
//                                             setSelectedSection(section);
//                                             setSelectedCurriculumId(curriculum.id);
//                                             setSectionOptionsOpen(true);
//                                         }} className="text-blue-500 underline hover:text-blue-700 mr-2">
//                                             {section.name}
//                                         </button>
//                                     ))
//                                 ) : "No sections"}
//                             </td> */}
//                             <td>
//                                 <button onClick={() => setIsAddSectionModalOpen(true)} className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
//                                     Edit
//                                 </button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>

//             {sectionOptionsOpen && selectedSection && (
//                 <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
//                     <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">

//                         <button
//                             className="block w-full bg-purple-500 text-white py-2 rounded mb-2"
//                             onClick={() => setIsMCQModalOpen(true)}
//                         >
//                             Add MCQs
//                         </button>


//                         <h2 className="text-lg font-semibold mb-4">{selectedSection.name} - Options</h2>
//                         {["pdf", "video", "notes", "mcqs"].map(type => (
//                             <button key={type} onClick={() => handleUpload(type)} className="block w-full bg-blue-500 text-white py-2 rounded mb-2">
//                                 Upload {type.toUpperCase()}
//                             </button>


//                         ))}
//                         <button onClick={() => handleLink("youtube")} className="block w-full bg-red-500 text-white py-2 rounded mb-2">Add YouTube Link</button>
//                         <button onClick={() => setSectionOptionsOpen(false)} className="block w-full bg-gray-400 text-white py-2 rounded mt-4">Close</button>
//                     </div>
//                 </div>
//             )}

//             <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} />
//         </div>
//     );
// };

// export default Curriculum;



import React, { useState, useEffect, useRef } from "react";
import { db, storage } from "../../../../config/firebase";
import { collection, getDocs, addDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import CreateCurriculum from "./CreateCurriculum";
// import AddSectionalModal from "./AddSectionalModal.jsx";
import SearchBar from "../../SearchBar";
import { useNavigate } from "react-router-dom";
import AddMCQModal from "./AddMCQModal.jsx";
import AddSectionalModal from './AddSectionalModel.jsx';

const Curriculum = () => {
    const [curriculums, setCurriculums] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
    const [isMCQModalOpen, setIsMCQModalOpen] = useState(false);
    const [selectedCurriculumId, setSelectedCurriculumId] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [sectionOptionsOpen, setSectionOptionsOpen] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCurriculums();
    }, []);

    const fetchCurriculums = async () => {
        try {
            const snapshot = await getDocs(collection(db, "curriculum"));
            const curriculumData = await Promise.all(
                snapshot.docs.map(async (doc) => {
                    const data = doc.data();
                    const sectionsSnapshot = await getDocs(collection(db, "curriculum", doc.id, "sections"));

                    const sections = await Promise.all(sectionsSnapshot.docs.map(async (sectionDoc) => {
                        const sectionData = sectionDoc.data();
                        const mcqsSnapshot = await getDocs(collection(db, "curriculum", doc.id, "sections", sectionDoc.id, "mcqs"));
                        const mcqs = mcqsSnapshot.docs.map(mcqDoc => ({ id: mcqDoc.id, ...mcqDoc.data() }));
                        return { id: sectionDoc.id, name: sectionData.name, mcqs };
                    }));

                    return { id: doc.id, name: data.name, sections };
                })
            );

            setCurriculums(curriculumData);
        } catch (error) {
            console.error("Error fetching curriculums with sections:", error);
        }
    };

    const handleUpload = async (type) => {
        if (!selectedSection || !selectedCurriculumId) return;
        fileInputRef.current.accept = type === "video" ? "video/*" : "application/pdf";
        fileInputRef.current.dataset.type = type;
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const type = e.target.dataset.type;
        const storageRef = ref(storage, `sections/${selectedCurriculumId}/${selectedSection.id}/${type}/${file.name}`);
        await uploadBytes(storageRef, file);
        const fileURL = await getDownloadURL(storageRef);
        await saveToFirestore(type, fileURL);
    };

    const handleLink = async () => {
        const link = prompt("Enter YouTube Link:");
        if (!link) return;
        await saveToFirestore("youtube", link);
    };

    const saveToFirestore = async (type, fileURL) => {
        const sectionRef = doc(db, "curriculum", selectedCurriculumId, "sections", selectedSection.id);
        await updateDoc(sectionRef, { [type]: arrayUnion(fileURL) });
        alert(`${type.toUpperCase()} uploaded successfully!`);
    };



    return (
        <div className="flex-col w-screen ml-80 p-4">
            <h1 className="text-2xl font-semibold">Curriculum</h1>
            <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-blue-500 text-white rounded">+ Add Curriculum</button>
            <SearchBar />

            <table className="mt-4">
                <thead><tr><th>Curriculum Name</th><th>Sections</th><th>Actions</th></tr></thead>
                <tbody>
                    {curriculums.map(curriculum => (
                        <tr key={curriculum.id}>
                            <td>{curriculum.name}</td>
                            {/* <td>
                                {curriculum.sections.map(section => (
                                    <button key={section.id} onClick={() => { setSelectedSection(section); setSectionOptionsOpen(true); }} className="text-blue-500 underline">
                                        {section.name}
                                    </button>
                                ))}



                            </td> */}


                            <td>
                                {curriculum.sections.map(section => (
                                    <button key={section.id} onClick={() => {
                                        setSelectedSection(section);
                                        setSectionOptionsOpen(true);
                                        setSelectedCurriculumId(curriculum.id);
                                        console.log("sectionOptionsOpen:", sectionOptionsOpen);
                                        console.log("selectedSection:", selectedSection);
                                        console.log("selectedCurriculumId:", selectedCurriculumId);
                                    }} className="text-blue-500 underline">
                                        {section.name}
                                    </button>
                                ))}
                            </td>

                            <td><button onClick={() => setIsAddSectionModalOpen(true)} className="btn btn-primary">Edit</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {sectionOptionsOpen && selectedSection && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg">
                        <h2 className="text-lg font-semibold">{selectedSection.name} - Options</h2>
                        <button onClick={() => setIsMCQModalOpen(true)} className="bg-purple-500 text-white py-2 rounded mb-2">Add MCQs</button>
                        <button onClick={() => handleUpload("pdf")} className="bg-blue-500 text-white py-2 rounded mb-2">Upload PDF</button>
                        <button onClick={() => handleUpload("video")} className="bg-blue-500 text-white py-2 rounded mb-2">Upload Video</button>
                        <button onClick={handleLink} className="bg-red-500 text-white py-2 rounded">Add YouTube Link</button>


                        <button
    type="button"
    onClick={() => {
        if (typeof onClose === "function") {
            onClose();
        } else {
            console.error("onClose is not a function!");
        }
    }}
    className="bg-gray-400 text-white px-4 py-2 rounded"
>
    Cancel
</button>
                        {/* <button onClick={() => setSectionOptionsOpen(false)} className="bg-gray-400 text-white py-2 rounded mt-4">Close</button> */}

                    </div>
                </div>
            )}
            {/* {sectionOptionsOpen && selectedSection && (
                            <AddMCQModal
                                sectionId={selectedSection.id}
                                curriculumId={selectedCurriculumId}
                                onClose={() => setSectionOptionsOpen(false)} // Ensure onClose function is passed
                            />
                        )} */}


            {isMCQModalOpen && (
                <AddMCQModal
                    sectionId={selectedSection.id}
                    curriculumId={selectedCurriculumId}
                    onClose={() => setIsMCQModalOpen(false)}
                />
            )}

            {isMCQModalOpen && <AddMCQModal setIsMCQModalOpen={setIsMCQModalOpen} curriculumId={selectedCurriculumId} sectionId={selectedSection.id} />}
            <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} />
        </div>
    );
};

export default Curriculum;
