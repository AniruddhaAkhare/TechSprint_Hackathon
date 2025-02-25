// // // import React, { useState } from "react";
// // // import { db } from "../../../../config/firebase";
// // // import { collection, addDoc } from "firebase/firestore";

// // // const AddMCQModal = ({ sectionId, onClose }) => {
// // //     const [question, setQuestion] = useState("");
// // //     const [options, setOptions] = useState(["", ""]); // Start with 2 options
// // //     const [correctAnswers, setCorrectAnswers] = useState([]);

// // //     const handleAddOption = () => {
// // //         setOptions([...options, ""]);
// // //     };

// // //     const handleOptionChange = (index, value) => {
// // //         const updatedOptions = [...options];
// // //         updatedOptions[index] = value;
// // //         setOptions(updatedOptions);
// // //     };

// // //     const handleCorrectAnswerToggle = (index) => {
// // //         const updatedCorrectAnswers = correctAnswers.includes(index)
// // //             ? correctAnswers.filter((i) => i !== index)
// // //             : [...correctAnswers, index];

// // //         setCorrectAnswers(updatedCorrectAnswers);
// // //     };

// // //     const handleSubmit = async () => {
// // //         if (!question.trim() || options.some((opt) => !opt.trim()) || correctAnswers.length === 0) {
// // //             alert("Please fill all fields and select at least one correct answer.");
// // //             return;
// // //         }

// // //         const mcqData = {
// // //             question,
// // //             options,
// // //             correctAnswers, // Store indexes of correct answers
// // //         };

// // //         try {
// // //             await addDoc(collection(db, "sections", sectionId, "mcqs"), mcqData);
// // //             alert("MCQ added successfully!");
// // //             onClose();
// // //         } catch (error) {
// // //             console.error("Error adding MCQ:", error);
// // //         }
// // //     };

// // //     return (
// // //         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
// // //             <div className="bg-white p-6 rounded-lg shadow-lg w-96">
// // //                 <h2 className="text-lg font-semibold mb-4">Add MCQ</h2>
// // //                 <input
// // //                     type="text"
// // //                     placeholder="Enter question"
// // //                     value={question}
// // //                     onChange={(e) => setQuestion(e.target.value)}
// // //                     className="w-full mb-2 p-2 border rounded"
// // //                 />
// // //                 {options.map((option, index) => (
// // //                     <div key={index} className="flex items-center mb-2">
// // //                         <input
// // //                             type="text"
// // //                             value={option}
// // //                             onChange={(e) => handleOptionChange(index, e.target.value)}
// // //                             className="flex-1 p-2 border rounded"
// // //                             placeholder={`Option ${index + 1}`}
// // //                         />
// // //                         <input
// // //                             type="checkbox"
// // //                             checked={correctAnswers.includes(index)}
// // //                             onChange={() => handleCorrectAnswerToggle(index)}
// // //                             className="ml-2"
// // //                         />
// // //                     </div>
// // //                 ))}
// // //                 <button onClick={handleAddOption} className="bg-blue-500 text-white px-2 py-1 rounded mb-2">
// // //                     + Add Option
// // //                 </button>
// // //                 <div className="flex justify-end space-x-2">
// // //                     <button onClick={onClose} className="bg-gray-500 text-white px-3 py-1 rounded">Cancel</button>
// // //                     <button onClick={handleSubmit} className="bg-green-500 text-white px-3 py-1 rounded">Save</button>
// // //                 </div>
// // //             </div>
// // //         </div>
// // //     );
// // // };

// // // export default AddMCQModal;


// // import React, { useState } from "react";
// // import { db } from "../../../../config/firebase";
// // import { collection, addDoc } from "firebase/firestore";

// // const AddMCQModal = ({ sectionId, curriculumId, onClose }) => {
// //     const [question, setQuestion] = useState("");
// //     const [options, setOptions] = useState(["", "", "", ""]);
// //     const [correctAnswer, setCorrectAnswer] = useState("");


// //     const handleSubmit = async (e) => {
// //         e.preventDefault();
    
// //         // Remove empty options
// //         const filteredOptions = options.filter(option => option.trim() !== "");
    
// //         // Validate required fields
// //         if (!question.trim() || filteredOptions.length < 2) {
// //             alert("Please enter a question and at least two options.");
// //             return;
// //         }
    
// //         // Ensure correctAnswer exists in the options
// //         if (!correctAnswer || !filteredOptions.includes(correctAnswer)) {
// //             alert("Please select a valid correct answer from the provided options.");
// //             return;
// //         }
    
// //         try {
// //             const mcqData = {
// //                 question,
// //                 options: filteredOptions,
// //                 correctAnswer,
// //             };
    
// //             await addDoc(collection(db, "curriculum", curriculumId, "sections", sectionId, "mcqs"), mcqData);
// //             alert("MCQ added successfully!");
    
// //             // Reset fields after successful submission
// //             setQuestion("");
// //             setOptions(["", "", "", ""]);
// //             setCorrectAnswer(""); // Reset correctly
    
// //             if (typeof onClose === "function") onClose(); // Ensure onClose is a function
// //         } catch (error) {
// //             console.error("Error adding MCQ:", error);
// //         }
// //     };
    

// //     // const handleSubmit = async (e) => {
// //     //     e.preventDefault();

// //     //     // Remove empty options
// //     //     const filteredOptions = options.filter(option => option.trim() !== "");

// //     //     // Validate required fields
// //     //     if (!question.trim() || filteredOptions.length < 2) {
// //     //         alert("Please enter a question and at least two options.");
// //     //         return;
// //     //     }

// //     //     // Ensure correctAnswer exists in the options
// //     //     if (!correctAnswer || !filteredOptions.includes(correctAnswer)) {
// //     //         alert("Please select a valid correct answer from the provided options.");
// //     //         return;
// //     //     }

// //     //     try {
// //     //         const mcqData = {
// //     //             question,
// //     //             options: filteredOptions,
// //     //             correctAnswer,
// //     //         };

// //     //         await addDoc(collection(db, "curriculum", curriculumId, "sections", sectionId, "mcqs"), mcqData);
// //     //         alert("MCQ added successfully!");

// //     //         // Reset fields after successful submission
// //     //         setQuestion("");
// //     //         setOptions(["", "", "", ""]);
// //     //         setCorrectAnswer(""); // Reset correctly

// //     //         if (typeof onClose === "function") onClose(); // Ensure onClose is a function

// //     //         console.log("Correct Answer:", correctAnswer);
// //     //         console.log("Options:", options);
// //     //         console.log("Filtered Options:", filteredOptions);

// //     //     } catch (error) {
// //     //         console.error("Error adding MCQ:", error);
// //     //     }
// //     // };



// //     // const handleSubmit = async (e) => {
// //     //     e.preventDefault();

// //     //     // Remove empty options
// //     //     const filteredOptions = options.filter(option => option.trim() !== "");

// //     //     // Validate required fields
// //     //     if (!question.trim() || filteredOptions.length < 2) {
// //     //         alert("Please enter a question and at least two options.");
// //     //         return;
// //     //     }

// //     //     // Ensure correctAnswer is selected and exists in options
// //     //     if (!correctAnswer || !filteredOptions.includes(correctAnswer)) {
// //     //         alert("Please select a valid correct answer from the provided options.");
// //     //         return;
// //     //     }

// //     //     try {
// //     //         const mcqData = {
// //     //             question,
// //     //             options: filteredOptions, // Save only valid options
// //     //             correctAnswer,
// //     //         };

// //     //         await addDoc(collection(db, "curriculum", curriculumId, "sections", sectionId, "mcqs"), mcqData);
// //     //         alert("MCQ added successfully!");

// //     //         // Reset fields after successful submission
// //     //         setQuestion("");
// //     //         setOptions(["", ""]);
// //     //         setCorrectAnswer("");

// //     //         if (onClose) onClose();
// //     //     } catch (error) {
// //     //         console.error("Error adding MCQ:", error);
// //     //     }
// //     // };


// //     // const handleSubmit = async (e) => {
// //     //     e.preventDefault();
// //     //     try {
// //     //         if (!question.trim() || !correctAnswer) {
// //     //             alert("Please enter question and correct answer.");
// //     //             return;
// //     //         }

// //     //         const mcqData = {
// //     //             question,
// //     //             options,
// //     //             correctAnswer,
// //     //         };

// //     //         await addDoc(collection(db, "curriculum", curriculumId, "sections", sectionId, "mcqs"), mcqData);
// //     //         alert("MCQ added successfully!");

// //     //         if (onClose) onClose(); // Ensure onClose is a function before calling it
// //     //     } catch (error) {
// //     //         console.error("Error adding MCQ:", error);
// //     //     }
// //     // };

// //     return (
// //         <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
// //             <div className="bg-white p-6 rounded shadow-lg w-1/3">
// //                 <h2 className="text-lg font-semibold mb-4">Add MCQ</h2>
// //                 <form onSubmit={handleSubmit}>
// //                     <label className="block mb-2">Question:</label>
// //                     <input
// //                         type="text"
// //                         value={question}
// //                         onChange={(e) => setQuestion(e.target.value)}
// //                         className="w-full p-2 border rounded mb-4"
// //                         required
// //                     />
// //                     {options.map((option, index) => (
// //                         <div key={index} className="mb-2">
// //                             <input
// //                                 type="text"
// //                                 value={option}
// //                                 onChange={(e) => {
// //                                     const newOptions = [...options];
// //                                     newOptions[index] = e.target.value;
// //                                     setOptions(newOptions);
// //                                 }}
// //                                 className="w-full p-2 border rounded"
// //                                 required
// //                             />
// //                         </div>
// //                     ))}
// //                     <label className="block mb-2">Correct Answer:</label>
// //                     <select
// //                         value={correctAnswer}
// //                         onChange={(e) => setCorrectAnswer(e.target.value)}
// //                         className="w-full p-2 border rounded mb-4"
// //                         required
// //                     >
// //                         <option value="" disabled>Select Correct Answer</option>
// //                         {options
// //                             .filter(option => option.trim() !== "") // Prevents empty options
// //                             .map((option, index) => (
// //                                 <option key={index} value={option}>
// //                                     {option}
// //                                 </option>
// //                             ))}
// //                     </select>

// //                     {/* <select
// //                         value={correctAnswer}
// //                         onChange={(e) => setCorrectAnswer(e.target.value)}
// //                         className="w-full p-2 border rounded mb-4"
// //                         required
// //                     >
// //                         <option value="">Select Correct Answer</option>
// //                         {options.map((option, index) => (
// //                             <option key={index} value={option}>
// //                                 {option}
// //                             </option>
// //                         ))}
// //                     </select> */}
// //                     <div className="flex justify-end">
// //                         <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
// //                             Add MCQ
// //                         </button>
// //                         <button type="button" onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">
// //                             Cancel
// //                         </button>
// //                     </div>
// //                 </form>
// //             </div>
// //         </div>
// //     );
// // };

// // export default AddMCQModal;


// import React, { useState } from "react";
// import { db } from "../../../../config/firebase";
// import { collection, addDoc } from "firebase/firestore";

// const AddMCQModal = ({ sectionId, curriculumId, onClose }) => {
//     // 🔹 Multiple MCQs will be stored in an array
//     const [mcqs, setMcqs] = useState([
//         { question: "", options: ["", "", "", ""], correctAnswer: "" }
//     ]);

//     // 📌 Function to handle MCQ input change
//     const handleMCQChange = (index, field, value) => {
//         const updatedMcqs = [...mcqs];
//         updatedMcqs[index][field] = value;
//         setMcqs(updatedMcqs);
//     };

//     // 📌 Function to handle option change
//     const handleOptionChange = (mcqIndex, optionIndex, value) => {
//         const updatedMcqs = [...mcqs];
//         updatedMcqs[mcqIndex].options[optionIndex] = value;
//         setMcqs(updatedMcqs);
//     };

//     // 📌 Function to add a new MCQ
//     const addNewMCQ = () => {
//         setMcqs([...mcqs, { question: "", options: ["", "", "", ""], correctAnswer: "" }]);
//     };

//     // 📌 Function to remove an MCQ
//     const removeMCQ = (index) => {
//         if (mcqs.length > 1) {
//             setMcqs(mcqs.filter((_, i) => i !== index));
//         }
//     };

//     // 📌 Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();
    
//         // Validate MCQs
//         for (const mcq of mcqs) {
//             const filteredOptions = mcq.options.filter(opt => opt.trim() !== "");
            
//             if (!mcq.question.trim() || filteredOptions.length < 2) {
//                 alert("Each MCQ must have a question and at least two options.");
//                 return;
//             }
    
//             if (!mcq.correctAnswer || filteredOptions.every(opt => opt.trim() !== mcq.correctAnswer.trim())) {
//                 alert("Please select a valid correct answer for each MCQ.");
//                 return;
//             }
//         }
    
//         try {
//             // Store each MCQ in Firestore
//             for (const mcq of mcqs) {
//                 await addDoc(collection(db, "curriculum", curriculumId, "sections", sectionId, "mcqs"), mcq);
//             }
    
//             alert("MCQs added successfully!");
//             setMcqs([{ question: "", options: ["", "", "", ""], correctAnswer: "" }]); // Reset form
    
//         } catch (error) {
//             console.error("Error adding MCQs:", error);
//         }
//     };
    
//     // const handleSubmit = async (e) => {
//     //     e.preventDefault();

//     //     // Validate MCQs
//     //     for (const mcq of mcqs) {
//     //         const filteredOptions = mcq.options.filter(opt => opt.trim() !== "");
            
//     //         if (!mcq.question.trim() || filteredOptions.length < 2) {
//     //             alert("Each MCQ must have a question and at least two options.");
//     //             return;
//     //         }
//     //         if (!mcq.correctAnswer || !filteredOptions.includes(mcq.correctAnswer)) {
//     //             alert("Please select a valid correct answer for each MCQ.");
//     //             return;
//     //         }
//     //     }

//     //     try {
//     //         // Store each MCQ in Firestore
//     //         for (const mcq of mcqs) {
//     //             await addDoc(collection(db, "curriculum", curriculumId, "sections", sectionId, "mcqs"), mcq);
//     //         }

//     //         alert("MCQs added successfully!");
//     //         setMcqs([{ question: "", options: ["", "", "", ""], correctAnswer: "" }]); // Reset form

//     //     } catch (error) {
//     //         console.error("Error adding MCQs:", error);
//     //     }
//     // };


//     return (
//         <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
//             <div className="bg-white p-6 rounded shadow-lg w-1/3 max-h-[90vh] overflow-y-auto">
//                 <h2 className="text-lg font-semibold mb-4">Add MCQs</h2>
//                 <form onSubmit={handleSubmit}>
    
//                     <div className="max-h-[60vh] overflow-y-auto pr-2">
//                         {mcqs.map((mcq, mcqIndex) => (
//                             <div key={mcqIndex} className="border p-4 mb-4 rounded shadow">
//                                 <label className="block mb-2">Question:</label>
//                                 <input
//                                     type="text"
//                                     value={mcq.question}
//                                     onChange={(e) => handleMCQChange(mcqIndex, "question", e.target.value)}
//                                     className="w-full p-2 border rounded mb-4"
//                                     required
//                                 />
    
//                                 <label className="block mb-2">Options:</label>
//                                 {mcq.options.map((option, optionIndex) => (
//                                     <div key={optionIndex} className="mb-2 flex items-center">
//                                         <input
//                                             type="text"
//                                             value={option}
//                                             onChange={(e) => handleOptionChange(mcqIndex, optionIndex, e.target.value)}
//                                             className="w-full p-2 border rounded"
//                                             required
//                                         />
//                                     </div>
//                                 ))}
    
//                                 <label className="block mb-2">Correct Answer:</label>
//                                 <select
//                                     value={mcq.correctAnswer}
//                                     onChange={(e) => handleMCQChange(mcqIndex, "correctAnswer", e.target.value)}
//                                     className="w-full p-2 border rounded mb-4"
//                                     required
//                                 >
//                                     <option value="">Select Correct Answer</option>
//                                     {mcq.options
//                                         .filter(option => option.trim() !== "")
//                                         .map((option, index) => (
//                                             <option key={index} value={option}>
//                                                 {option}
//                                             </option>
//                                         ))}
//                                 </select>
    
//                                 {mcqs.length > 1 && (
//                                     <button
//                                         type="button"
//                                         onClick={() => removeMCQ(mcqIndex)}
//                                         className="bg-red-500 text-white px-3 py-1 rounded"
//                                     >
//                                         Remove MCQ
//                                     </button>
//                                 )}
//                             </div>
//                         ))}
//                     </div>
    
//                     <button
//                         type="button"
//                         onClick={addNewMCQ}
//                         className="bg-green-500 text-white px-4 py-2 rounded mb-4 w-full"
//                     >
//                         Add Another MCQ
//                     </button>
    
//                     <div className="flex justify-end">
//                         <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
//                             Submit MCQs
//                         </button>
//                         <button type="button" onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">
//                             Cancel
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
    

//     // return (
//     //     <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
//     //         <div className="bg-white p-6 rounded shadow-lg w-1/3">
//     //             <h2 className="text-lg font-semibold mb-4">Add MCQs</h2>
//     //             <form onSubmit={handleSubmit}>

//     //                 {mcqs.map((mcq, mcqIndex) => (
//     //                     <div key={mcqIndex} className="border p-4 mb-4 rounded shadow">
//     //                         <label className="block mb-2">Question:</label>
//     //                         <input
//     //                             type="text"
//     //                             value={mcq.question}
//     //                             onChange={(e) => handleMCQChange(mcqIndex, "question", e.target.value)}
//     //                             className="w-full p-2 border rounded mb-4"
//     //                             required
//     //                         />

//     //                         <label className="block mb-2">Options:</label>
//     //                         {mcq.options.map((option, optionIndex) => (
//     //                             <div key={optionIndex} className="mb-2 flex items-center">
//     //                                 <input
//     //                                     type="text"
//     //                                     value={option}
//     //                                     onChange={(e) => handleOptionChange(mcqIndex, optionIndex, e.target.value)}
//     //                                     className="w-full p-2 border rounded"
//     //                                     required
//     //                                 />
//     //                             </div>
//     //                         ))}

//     //                         <label className="block mb-2">Correct Answer:</label>
//     //                         <select
//     //                             value={mcq.correctAnswer}
//     //                             onChange={(e) => handleMCQChange(mcqIndex, "correctAnswer", e.target.value)}
//     //                             className="w-full p-2 border rounded mb-4"
//     //                             required
//     //                         >
//     //                             <option value="">Select Correct Answer</option>
//     //                             {mcq.options
//     //                                 .filter(option => option.trim() !== "")
//     //                                 .map((option, index) => (
//     //                                     <option key={index} value={option}>
//     //                                         {option}
//     //                                     </option>
//     //                                 ))}
//     //                         </select>

//     //                         {mcqs.length > 1 && (
//     //                             <button
//     //                                 type="button"
//     //                                 onClick={() => removeMCQ(mcqIndex)}
//     //                                 className="bg-red-500 text-white px-3 py-1 rounded"
//     //                             >
//     //                                 Remove MCQ
//     //                             </button>
//     //                         )}
//     //                     </div>
//     //                 ))}

//     //                 <button
//     //                     type="button"
//     //                     onClick={addNewMCQ}
//     //                     className="bg-green-500 text-white px-4 py-2 rounded mb-4"
//     //                 >
//     //                     Add Another MCQ
//     //                 </button>

//     //                 <div className="flex justify-end">
//     //                     <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
//     //                         Submit MCQs
//     //                     </button>
//     //                     <button type="button" onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">
//     //                         Cancel
//     //                     </button>
//     //                 </div>
//     //             </form>
//     //         </div>
//     //     </div>
//     // );
// };

// export default AddMCQModal;




import React, { useState } from "react";
import { db } from "../../../../config/firebase";
import { collection, addDoc } from "firebase/firestore";

const AddMCQModal = ({ sectionId, curriculumId, onClose }) => {
    const [mcqs, setMcqs] = useState([
        { question: "", options: ["", "", "", ""], correctAnswer: "" }
    ]);

    const handleMCQChange = (index, field, value) => {
        const updatedMcqs = [...mcqs];
        updatedMcqs[index][field] = value;
        setMcqs(updatedMcqs);
    };

    const handleOptionChange = (mcqIndex, optionIndex, value) => {
        const updatedMcqs = [...mcqs];
        updatedMcqs[mcqIndex].options[optionIndex] = value;
        setMcqs(updatedMcqs);
    };

    const addNewMCQ = () => {
        setMcqs([...mcqs, { question: "", options: ["", "", "", ""], correctAnswer: "" }]);
    };

    const removeMCQ = (index) => {
        if (mcqs.length > 1) {
            setMcqs(mcqs.filter((_, i) => i !== index));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
    
        console.log("mcqs before loop:", mcqs); // Add this line
    
        for (const mcq of mcqs) {
            console.log("current mcq:", mcq); // Add this line
    
            const filteredOptions = mcq.options.filter(opt => opt.trim() !== "");
            console.log("filteredOptions:", filteredOptions); // Add this line
            console.log("filteredOptions length:", filteredOptions.length); // Add this line
            console.log("mcq.correctAnswer:", mcq.correctAnswer); // Add this line
            console.log("typeof mcq.correctAnswer:", typeof mcq.correctAnswer); //add this line
            if(filteredOptions.length > 0){
                console.log("typeof filteredOptions[0]:", typeof filteredOptions[0]);//add this line
            }
    
            if (!mcq.question.trim() || filteredOptions.length < 2) {
                alert("Each MCQ must have a question and at least two options.");
                return;
            }
    
            if (!mcq.correctAnswer || !filteredOptions.includes(mcq.correctAnswer)) {
                alert("Please select a valid correct answer for each MCQ.");
                return;
            }
        }
    
        // ... rest of your handleSubmit code

        try {
                    // Store each MCQ in Firestore
                    for (const mcq of mcqs) {
                        await addDoc(collection(db, "curriculum", curriculumId, "sections", sectionId, "mcqs"), mcq);
                    }
        
                    alert("MCQs added successfully!");
                    setMcqs([{ question: "", options: ["", "", "", ""], correctAnswer: "" }]); // Reset form
                    if (onClose) onClose();
        
                } catch (error) {
                    console.error("Error adding MCQs:", error);
                }
    };

    
    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     // Validate MCQs
    //     for (const mcq of mcqs) {
    //         const filteredOptions = mcq.options.filter(opt => opt.trim() !== "");

    //         if (!mcq.question.trim() || filteredOptions.length < 2) {
    //             alert("Each MCQ must have a question and at least two options.");
    //             return;
    //         }

    //         // Check if correctAnswer is in filteredOptions
    //         if (!mcq.correctAnswer || !filteredOptions.includes(mcq.correctAnswer)) {
    //             alert("Please select a valid correct answer for each MCQ.");
    //             return;
    //         }
    //     }

    //     try {
    //         // Store each MCQ in Firestore
    //         for (const mcq of mcqs) {
    //             await addDoc(collection(db, "curriculum", curriculumId, "sections", sectionId, "mcqs"), mcq);
    //         }

    //         alert("MCQs added successfully!");
    //         setMcqs([{ question: "", options: ["", "", "", ""], correctAnswer: "" }]); // Reset form
    //         if (onClose) onClose();

    //     } catch (error) {
    //         console.error("Error adding MCQs:", error);
    //     }
    // };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-1/3 max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4">Add MCQs</h2>
                <form onSubmit={handleSubmit}>

                    <div className="max-h-[60vh] overflow-y-auto pr-2">
                        {mcqs.map((mcq, mcqIndex) => (
                            <div key={mcqIndex} className="border p-4 mb-4 rounded shadow">
                                <label className="block mb-2">Question:</label>
                                <input
                                    type="text"
                                    value={mcq.question}
                                    onChange={(e) => handleMCQChange(mcqIndex, "question", e.target.value)}
                                    className="w-full p-2 border rounded mb-4"
                                    required
                                />

                                <label className="block mb-2">Options:</label>
                                {mcq.options.map((option, optionIndex) => (
                                    <div key={optionIndex} className="mb-2 flex items-center">
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => handleOptionChange(mcqIndex, optionIndex, e.target.value)}
                                            className="w-full p-2 border rounded"
                                            required
                                        />
                                    </div>
                                ))}

                                <label className="block mb-2">Correct Answer:</label>
                                <select
                                    value={mcq.correctAnswer}
                                    onChange={(e) => handleMCQChange(mcqIndex, "correctAnswer", e.target.value)}
                                    className="w-full p-2 border rounded mb-4"
                                    required
                                >
                                    <option value="">Select Correct Answer</option>
                                    {mcq.options
                                        .filter(option => option.trim() !== "")
                                        .map((option, index) => (
                                            <option key={index} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                </select>

                                {mcqs.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeMCQ(mcqIndex)}
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                    >
                                        Remove MCQ
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={addNewMCQ}
                        className="bg-green-500 text-white px-4 py-2 rounded mb-4 w-full"
                    >
                        Add Another MCQ
                    </button>

                    <div className="flex justify-end">
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                            Submit MCQs
                        </button>
                        <button type="button" onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMCQModal;