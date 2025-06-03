


// import React, { useState } from "react";
// import { db } from "../../../../config/firebase";
// import { collection, addDoc } from "firebase/firestore";

// const AddMCQModal = ({ sectionId, curriculumId, onClose }) => {
//     const [testName, setTestName] = useState("");
//     const [mcqs, setMcqs] = useState([
//         { question: "", options: ["", "", "", ""], correctAnswer: "" }
//     ]);

//     const handleMCQChange = (index, field, value) => {
//         const updatedMcqs = [...mcqs];
//         updatedMcqs[index][field] = value;
//         setMcqs(updatedMcqs);
//     };

//     const handleOptionChange = (mcqIndex, optionIndex, value) => {
//         const updatedMcqs = [...mcqs];
//         updatedMcqs[mcqIndex].options[optionIndex] = value;
//         setMcqs(updatedMcqs);
//     };

//     const addNewMCQ = () => {
//         setMcqs([...mcqs, { question: "", options: ["", "", "", ""], correctAnswer: "" }]);
//     };

//     const removeMCQ = (index) => {
//         if (mcqs.length > 1) {
//             setMcqs(mcqs.filter((_, i) => i !== index));
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!testName.trim()) {
//             alert("Test Name is required.");
//             return;
//         }

//         for (const mcq of mcqs) {
//             const filteredOptions = mcq.options.filter(opt => opt.trim() !== "");
//             if (!mcq.question.trim() || filteredOptions.length < 2) {
//                 alert("Each MCQ must have a question and at least two options.");
//                 return;
//             }
//             if (!mcq.correctAnswer || !filteredOptions.includes(mcq.correctAnswer)) {
//                 alert("Please select a valid correct answer for each MCQ.");
//                 return;
//             }
//         }

//         try {
//             const testRef = await addDoc(collection(db, "curriculum", curriculumId, "sections", sectionId, "mcq_tests"), { testName });

//             for (const mcq of mcqs) {
//                 await addDoc(collection(db, "curriculum", curriculumId, "sections", sectionId, "mcq_tests", testRef.id, "mcqs"), mcq);
//             }

//             alert("MCQs added successfully!");
//             setTestName("");
//             setMcqs([{ question: "", options: ["", "", "", ""], correctAnswer: "" }]);
//             if (onClose) onClose();
//         } catch (error) {
//             //console.error("Error adding MCQs:", error);
//         }
//     };

//     return (
//         <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
//             <div className="bg-white p-6 rounded shadow-lg w-1/3 max-h-[90vh] overflow-y-auto">
//                 <h2 className="text-lg font-semibold mb-4">Add MCQs</h2>
//                 <form onSubmit={handleSubmit}>
//                     <label className="block mb-2">Test Name:</label>
//                     <input
//                         type="text"
//                         value={testName}
//                         onChange={(e) => setTestName(e.target.value)}
//                         className="w-full p-2 border rounded mb-4"
//                         required
//                     />

//                     <div className="max-h-[60vh] overflow-y-auto pr-2">
//                         {mcqs.map((mcq, mcqIndex) => (
//                             <div key={mcqIndex} className="border p-4 mb-4 rounded shadow">
//                                 <h3 className="font-bold mb-2">MCQ {mcqIndex + 1}</h3>
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

//                         <button
//                             type="button"
//                             onClick={onClose}
//                             className="bg-gray-400 text-white px-4 py-2 rounded"
//                         >
//                             Cancel
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddMCQModal;




import React, { useState } from "react";
import { db } from "../../../../config/firebase";
import { collection, addDoc } from "firebase/firestore";

const AddMCQModal = ({ sectionId, curriculumId, onClose }) => {
    const [testName, setTestName] = useState("");
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
        if (!testName.trim()) {
            alert("Test Name is required.");
            return;
        }

        for (const mcq of mcqs) {
            const filteredOptions = mcq.options.filter(opt => opt.trim() !== "");
            if (!mcq.question.trim() || filteredOptions.length < 2) {
                alert("Each MCQ must have a question and at least two options.");
                return;
            }
            if (!mcq.correctAnswer || !filteredOptions.includes(mcq.correctAnswer)) {
                alert("Please select a valid correct answer for each MCQ.");
                return;
            }
        }

        try {
            const testRef = await addDoc(collection(db, "curriculum", curriculumId, "sections", sectionId, "mcq_tests"), { testName });

            for (const mcq of mcqs) {
                await addDoc(collection(db, "curriculum", curriculumId, "sections", sectionId, "mcq_tests", testRef.id, "mcqs"), mcq);
            }

            alert("MCQs added successfully!");
            setTestName("");
            setMcqs([{ question: "", options: ["", "", "", ""], correctAnswer: "" }]);
            if (onClose) onClose();
        } catch (error) {
            // //console.error("Error adding MCQs:", error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4 z-50">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg sm:text-xl font-semibold mb-4">Add MCQs</h2>
                <form onSubmit={handleSubmit}>
                    {/* Test Name */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Test Name:</label>
                        <input
                            type="text"
                            value={testName}
                            onChange={(e) => setTestName(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* MCQ List */}
                    <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
                        {mcqs.map((mcq, mcqIndex) => (
                            <div key={mcqIndex} className="border p-4 mb-4 rounded shadow">
                                <h3 className="font-bold mb-2 text-sm sm:text-base">MCQ {mcqIndex + 1}</h3>

                                {/* Question */}
                                <label className="block mb-2 text-sm font-medium text-gray-700">Question:</label>
                                <input
                                    type="text"
                                    value={mcq.question}
                                    onChange={(e) => handleMCQChange(mcqIndex, "question", e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />

                                {/* Options */}
                                <label className="block mt-4 mb-2 text-sm font-medium text-gray-700">Options:</label>
                                {mcq.options.map((option, optionIndex) => (
                                    <div key={optionIndex} className="mb-2">
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => handleOptionChange(mcqIndex, optionIndex, e.target.value)}
                                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder={`Option ${optionIndex + 1}`}
                                            required={optionIndex < 2} // Require at least 2 options
                                        />
                                    </div>
                                ))}

                                {/* Correct Answer */}
                                <label className="block mt-4 mb-2 text-sm font-medium text-gray-700">Correct Answer:</label>
                                <select
                                    value={mcq.correctAnswer}
                                    onChange={(e) => handleMCQChange(mcqIndex, "correctAnswer", e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                                {/* Remove MCQ Button */}
                                {mcqs.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeMCQ(mcqIndex)}
                                        className="mt-4 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-200 w-full sm:w-auto"
                                    >
                                        Remove MCQ
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Add Another MCQ Button */}
                    <button
                        type="button"
                        onClick={addNewMCQ}
                        className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200 w-full"
                    >
                        Add Another MCQ
                    </button>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full sm:w-auto bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
                        >
                            Submit MCQs
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMCQModal;