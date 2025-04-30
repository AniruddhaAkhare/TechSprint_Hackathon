// import React, { useState } from "react";
// import emailService from '../../../../services/emailService'; // Import the email service
// import './Feedback.css';

// const formFieldTemplates = {
//   shortAnswer: {
//     type: "shortAnswer",
//     label: "Enter your question",
//     placeholder: "Your answer",
//   },
//   longAnswer: {
//     type: "longAnswer",
//     label: "Enter your question",
//     placeholder: "Your answer",
//   },
//   starRating: {
//     type: "starRating",
//     label: "How would you rate the punctuality of the trainer",
//   },
// };

// export default function Feedback() {
//   const [formFields, setFormFields] = useState([]);

//   const addField = (type) => {
//     const newField = { ...formFieldTemplates[type], id: Date.now() };
//     setFormFields([...formFields, newField]);
//   };

//   const handleLabelChange = (id, newLabel) => {
//     setFormFields(
//       formFields.map((field) =>
//         field.id === id ? { ...field, label: newLabel } : field
//       )
//     );
//   };

//   const [userEmail, setUserEmail] = useState(""); // Add state for user email

//   const handleSubmit = () => {
//     const formData = {
//       questions: formFields.map(field => ({
//         label: field.label,
//         type: field.type,
//         placeholder: field.placeholder,
//       })),
//       email: userEmail, // Include user email in the form data
//     };



//     emailService.sendEmail(formData) // Call the email service to send the data
//       .then(response => {
//         console.log("Email sent successfully:", response);
//       })
//       .catch(error => {
//         console.error("Error sending email:", error);
//       });
//   };

//   return (

//     <div className="flex-col w-screen ml-80 p-4">
//       <div className="bg-white shadow-md rounded-lg p-6">
//         <div className="mb-6">
//           <h1 className="text-xl font-bold">Create New Form</h1>
//           <p className="text-gray-600 text-sm mt-1">
//             Please enter the feedback about your instructor. The responses will be
//             confidential and your instructors will not be able to view the same.
//           </p>
//         </div>

//         {formFields.map((field) => (
//           <div key={field.id} className="mb-4 border rounded-lg p-4 bg-gray-50">
//             <input
//               type="text"
//               value={field.label}
//               onChange={(e) => handleLabelChange(field.id, e.target.value)}
//               className="w-full mb-2 text-lg font-semibold text-gray-700 border-b focus:outline-none"
//             />

//             {field.type === "shortAnswer" && (
//               <input
//                 type="text"
//                 placeholder={field.placeholder}
//                 // disabled
//                 className="w-full p-2 border rounded bg-white text-gray-600"
//               />
//             )}

//             {field.type === "longAnswer" && (
//               <textarea
//                 placeholder={field.placeholder}
//                 // disabled
//                 className="w-full p-2 border rounded bg-white text-gray-600"
//               ></textarea>
//             )}

//             {field.type === "starRating" && (
//               <div className="flex space-x-2">
//                 {[...Array(5)].map((_, i) => (
//                   <span
//                     key={i}
//                     className="text-gray-400 cursor-pointer text-2xl"
//                   >
//                     ★
//                   </span>
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}

//         <div className="mb-4">
//           <input
//             type="email"
//             placeholder="Your Email"
//             value={userEmail}
//             onChange={(e) => setUserEmail(e.target.value)} // Update user email state
//             className="w-full p-2 border rounded bg-white text-gray-600"
//           />
//         </div>
//         <div className="flex justify-end space-x-4 mt-4">

//           <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
//             Save Form
//           </button>
//           <button onClick={handleSubmit} className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">

//             Save and Publish
//           </button>
//         </div>
//       </div>

//       <div className="mt-6">
//         <h2 className="text-lg font-semibold mb-4">Add Field</h2>
//         <div className="grid grid-cols-3 gap-4">
//           <button
//             onClick={() => addField("shortAnswer")}
//             className="p-4 bg-gray-200 rounded hover:bg-gray-300 shortanswer"

//           >
//             Short Answer
//           </button>
//           <button
//             onClick={() => addField("longAnswer")}
//             className="p-4 bg-gray-200 rounded hover:bg-gray-300 longanswer"
//           >
//             Long Answer
//           </button>
//           <button
//             onClick={() => addField("starRating")}
//             className="p-4 bg-gray-200 rounded hover:bg-gray-300 starrating"
//           >
//             Star Rating
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // export default DynamicFormBuilder;


import React, { useState } from "react";
import { sendWelcomeEmail } from '../../../../services/emailService'; // Use named import
import './Feedback.css';

const formFieldTemplates = {
  shortAnswer: {
    type: "shortAnswer",
    label: "Enter your question",
    placeholder: "Your answer",
  },
  longAnswer: {
    type: "longAnswer",
    label: "Enter your question",
    placeholder: "Your answer",
  },
  starRating: {
    type: "starRating",
    label: "How would you rate the punctuality of the trainer",
  },
};

export default function Feedback() {
  const [formFields, setFormFields] = useState([]);
  const [userEmail, setUserEmail] = useState("");

  const addField = (type) => {
    const newField = { ...formFieldTemplates[type], id: Date.now() };
    setFormFields([...formFields, newField]);
  };

  const handleLabelChange = (id, newLabel) => {
    setFormFields(
      formFields.map((field) =>
        field.id === id ? { ...field, label: newLabel } : field
      )
    );
  };

  const handleSubmit = async () => {
    const formData = {
      questions: formFields.map((field) => ({
        label: field.label,
        type: field.type,
        placeholder: field.placeholder,
      })),
      email: userEmail,
    };

    try {
      // Use sendWelcomeEmail (adjust parameters as needed)
      await sendWelcomeEmail(
        userEmail, // toEmail
        "User", // fullName (replace with actual name or form data)
        "Feedback Form" // courseName (replace with relevant value)
      );
      console.log("Email sent successfully");
      alert("Form submitted and email sent!");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email");
    }
  };

  return (
    <div className="flex-col w-screen ml-80 p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold">Create New Form</h1>
          <p className="text-gray-600 text-sm mt-1">
            Please enter the feedback about your instructor. The responses will be
            confidential and your instructors will not be able to view the same.
          </p>
        </div>

        {formFields.map((field) => (
          <div key={field.id} className="mb-4 border rounded-lg p-4 bg-gray-50">
            <input
              type="text"
              value={field.label}
              onChange={(e) => handleLabelChange(field.id, e.target.value)}
              className="w-full mb-2 text-lg font-semibold text-gray-700 border-b focus:outline-none"
            />

            {field.type === "shortAnswer" && (
              <input
                type="text"
                placeholder={field.placeholder}
                disabled
                className="w-full p-2 border rounded bg-white text-gray-600"
              />
            )}

            {field.type === "longAnswer" && (
              <textarea
                placeholder={field.placeholder}
                disabled
                className="w-full p-2 border rounded bg-white text-gray-600"
              ></textarea>
            )}

            {field.type === "starRating" && (
              <div className="flex space-x-2">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className="text-gray-400 cursor-pointer text-2xl"
                  >
                    ★
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="mb-4">
          <input
            type="email"
            placeholder="Your Email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            className="w-full p-2 border rounded bg-white text-gray-600"
          />
        </div>

        <div className="flex justify-end space-x-4 mt-4">
          <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
            Save Form
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Save and Publish
          </button>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Add Field</h2>
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => addField("shortAnswer")}
            className="p-4 bg-gray-200 rounded hover:bg-gray-300 shortanswer"
          >
            Short Answer
          </button>
          <button
            onClick={() => addField("longAnswer")}
            className="p-4 bg-gray-200 rounded hover:bg-gray-300 longanswer"
          >
            Long Answer
          </button>
          <button
            onClick={() => addField("starRating")}
            className="p-4 bg-gray-200 rounded hover:bg-gray-300 starrating"
          >
            Star Rating
          </button>
        </div>
      </div>
    </div>
  );
}