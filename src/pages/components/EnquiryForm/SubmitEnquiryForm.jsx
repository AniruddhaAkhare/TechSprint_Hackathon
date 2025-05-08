

// // import React, { useState, useEffect } from "react";
// // import { db } from "../../../config/firebase";
// // import { doc, getDoc, collection, addDoc, updateDoc } from "firebase/firestore";
// // import { useParams } from "react-router-dom";
// // import { serverTimestamp } from "firebase/firestore";
// // import { allEnquiryFields } from "./enquiryFields.jsx";

// // const SubmitEnquiryForm = () => {
// //   const { formId } = useParams();
// //   const [formData, setFormData] = useState(null);
// //   const [formValues, setFormValues] = useState({});
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [success, setSuccess] = useState(false);

// //   const formUrl = `ttps://form.shikshasaarathi.com.web.app/${formId}`;
// //   const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(formUrl)}`;

// //   useEffect(() => {
// //     console.log("Form ID:", formId);
// //     console.log("QR Code URL:", qrCodeUrl);
// //     const fetchForm = async () => {
// //       try {
// //         setLoading(true);
// //         const formRef = doc(db, "enquiryForms", formId);
// //         const formSnap = await getDoc(formRef);
// //         if (!formSnap.exists()) {
// //           setError("Form not found.");
// //           console.error("Form not found in Firestore for ID:", formId);
// //           return;
// //         }
// //         const data = formSnap.data();
// //         setFormData(data);
// //         const initialValues = {};
// //         data.fields.forEach((field) => {
// //           initialValues[field.id] = field.defaultValue || "";
// //         });
// //         setFormValues(initialValues);
// //       } catch (err) {
// //         setError("Failed to load form: " + err.message);
// //         console.error("Error fetching form:", err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchForm();
// //   }, [formId]);

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormValues((prev) => ({ ...prev, [name]: value }));
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!formData) {
// //       setError("Form data not loaded.");
// //       return;
// //     }

// //     try {
// //       setLoading(true);
// //       setError(null);

// //       const enquiryData = {
// //         formId: formId,
// //         userData: formValues,
// //         timestamp: serverTimestamp(),
// //       };
// //       await addDoc(collection(db, "enquiries"), enquiryData);

// //       const formRef = doc(db, "enquiryForms", formId);
// //       await updateDoc(formRef, {
// //         enquiryCount: (formData.enquiryCount || 0) + 1,
// //         updatedAt: serverTimestamp(),
// //       });

// //       setSuccess(true);
// //       setFormValues({});
// //     } catch (err) {
// //       setError("Failed to submit enquiry: " + err.message);
// //       console.error("Error submitting enquiry:", err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   if (loading) return <div className="p-4">Loading...</div>;
// //   if (error) return <div className="p-4 text-red-600">{error}</div>;
// //   if (!formData) return null;

// //   return (
// //     <div className="p-6 max-w-2xl mx-auto">
// //       <h1 className="text-2xl font-bold mb-4">{formData.name}</h1>
// //       <div className="mb-6">
// //         <h2 className="text-lg font-medium mb-2">Share this Form</h2>
// //         <div className="qr-code-container">
// //           <img src={qrCodeUrl} alt="QR Code" />
// //         </div>
// //         <p className="mt-2 text-sm text-gray-500">Scan to access the form</p>
// //         <p className="mt-2 text-sm text-gray-500">
// //           Form URL: <a href={formUrl} target="_blank" rel="noopener noreferrer">{formUrl}</a>
// //         </p>
// //       </div>
// //       {success && (
// //         <div className="mb-4 p-2 bg-green-100 border border-green-400 text-green-700">
// //           Enquiry submitted successfully!
// //         </div>
// //       )}
// //       <form onSubmit={handleSubmit} className="space-y-4">
// //         {formData.fields.map((field) => {
// //           const fieldConfig = allEnquiryFields.find((f) => f.id === field.id);
// //           if (!fieldConfig) return null;
// //           const isDefaultEmpty = !field.defaultValue || field.defaultValue === "";
// //           return (
// //             <div key={field.id} className="mb-4">
// //               <label className="block text-gray-700 text-sm font-medium mb-2">{fieldConfig.label}</label>
// //               {fieldConfig.type === "textarea" ? (
// //                 <textarea
// //                   name={field.id}
// //                   value={formValues[field.id] || ""}
// //                   onChange={handleChange}
// //                   className="w-full px-3 py-2 border rounded-md"
// //                   placeholder={isDefaultEmpty ? fieldConfig.label : ""}
// //                   disabled={!isDefaultEmpty}
// //                 />
// //               ) : fieldConfig.type === "select" ? (
// //                 <select
// //                   name={field.id}
// //                   value={formValues[field.id] || ""}
// //                   onChange={handleChange}
// //                   className="w-full px-3 py-2 border rounded-md"
// //                   disabled={!isDefaultEmpty}
// //                 >
// //                   <option value="">Select {fieldConfig.label}</option>
// //                   {fieldConfig.options?.map((option) => (
// //                     <option key={option} value={option}>{option}</option>
// //                   ))}
// //                 </select>
// //               ) : (
// //                 <input
// //                   type={fieldConfig.type}
// //                   name={field.id}
// //                   value={formValues[field.id] || ""}
// //                   onChange={handleChange}
// //                   className="w-full px-3 py-2 border rounded-md"
// //                   placeholder={isDefaultEmpty ? fieldConfig.label : ""}
// //                   disabled={!isDefaultEmpty}
// //                 />
// //               )}
// //               {!isDefaultEmpty && <p className="mt-1 text-sm text-gray-500">Default: {field.defaultValue}</p>}
// //             </div>
// //           );
// //         })}
// //         <button
// //           type="submit"
// //           className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
// //           disabled={loading}
// //         >
// //           {loading ? "Submitting..." : "Submit"}
// //         </button>
// //       </form>
// //     </div>
// //   );
// // };

// // export default SubmitEnquiryForm;


// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { db } from "../../../config/firebase";
// import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
// import { allEnquiryFields } from "./enquiryFields.jsx";
// import { Button, Input } from "@material-tailwind/react";
// import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

// const SubmitEnquiryForm = () => {
//   const { formId } = useParams();
//   const [formData, setFormData] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [submitError, setSubmitError] = useState(null);
//   const [submitted, setSubmitted] = useState(false);

//   // Sample options for select fields (adjust as needed)
//   const selectOptions = {
//     country: ["India", "USA", "UK", "Canada", "Australia"],
//     gender: ["Male", "Female", "Prefer not to disclose"],
//     studentType: ["School", "College", "Professional"],
//     graduationStream: ["Science", "Commerce", "Arts", "Engineering"],
//     branch: ["Main Branch", "City Branch", "Online"],
//     course: ["Computer Science", "Business Studies", "Mathematics"],
//     source: ["Website", "Referral", "Advertisement"],
//     assignTo: ["Admissions Team", "Counselor A", "Counselor B"],
//     degree: ["Bachelors", "Masters", "Diploma"],
//     stage: ["prequalified", "qualified", "negotiation", "closed won", "closed lost", "contact in future"],
//   };

//   useEffect(() => {
//     const fetchForm = async () => {
//       try {
//         const formRef = doc(db, "enquiryForms", formId);
//         const formSnap = await getDoc(formRef);
//         if (formSnap.exists()) {
//           setFormData(formSnap.data());
//           // Initialize form values with default values
//           const initialValues = {};
//           formSnap.data().fields.forEach((field) => {
//             initialValues[field.id] = field.defaultValue || "";
//           });
//           setFormValues(initialValues);
//         } else {
//           setSubmitError("Form not found");
//         }
//       } catch (err) {
//         setSubmitError(`Error fetching form: ${err.message}`);
//       }
//     };
//     fetchForm();
//   }, [formId]);

//   const handleChange = (fieldId, value) => {
//     setFormValues((prev) => ({ ...prev, [fieldId]: value }));
//     // Clear error for this field
//     if (errors[fieldId]) {
//       setErrors((prev) => ({ ...prev, [fieldId]: null }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     const flatFields = allEnquiryFields.flatMap((category) => category.fields);
//     formData.fields.forEach((field) => {
//       const fieldDef = flatFields.find((f) => f.id === field.id);
//       if (fieldDef?.required && !formValues[field.id]?.trim()) {
//         newErrors[field.id] = `${fieldDef.label} is required`;
//       }
//       if (fieldDef?.type === "email" && formValues[field.id]) {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(formValues[field.id])) {
//           newErrors[field.id] = "Invalid email format";
//         }
//       }
//       if (fieldDef?.type === "number" && formValues[field.id] && isNaN(formValues[field.id])) {
//         newErrors[field.id] = `${fieldDef.label} must be a number`;
//       }
//     });
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) {
//       return;
//     }
//     try {
//       setLoading(true);
//       setSubmitError(null);
//       const enquiryData = {
//         formId,
//         ...formValues,
//         status: formValues.stage || "prequalified", // Default to prequalified if stage not included
//         createdAt: serverTimestamp(),
//       };
//       await addDoc(collection(db, "enquiries"), enquiryData);
//       setSubmitted(true);
//       setFormValues({});
//     } catch (err) {
//       setSubmitError(`Error submitting enquiry: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (submitError) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//         <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
//           <h2 className="text-xl font-semibold text-red-600">{submitError}</h2>
//         </div>
//       </div>
//     );
//   }

//   if (!formData) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//         <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
//           <h2 className="text-xl font-semibold">Loading...</h2>
//         </div>
//       </div>
//     );
//   }

//   if (submitted) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//         <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
//           <h2 className="text-xl font-semibold text-green-600">Enquiry Submitted Successfully!</h2>
//           <p className="mt-2 text-gray-600">Thank you for your submission.</p>
//           <Button
//             color="blue"
//             className="mt-4"
//             onClick={() => {
//               setSubmitted(false);
//               setFormValues(
//                 formData.fields.reduce((acc, field) => {
//                   acc[field.id] = field.defaultValue || "";
//                   return acc;
//                 }, {})
//               );
//             }}
//           >
//             Submit Another
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   const flatFields = allEnquiryFields.flatMap((category) => category.fields);

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//       <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl w-full">
//         <h2 className="text-2xl font-semibold text-gray-800 mb-6">{formData.name}</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {formData.fields.map((field) => {
//             const fieldDef = flatFields.find((f) => f.id === field.id);
//             if (!fieldDef) return null;

//             const isError = !!errors[field.id];

//             return (
//               <div key={field.id}>
//                 {fieldDef.type === "textarea" ? (
//                   <div>
//                     <label
//                       htmlFor={field.id}
//                       className="block text-base font-medium text-gray-700"
//                     >
//                       {fieldDef.label}
//                       {fieldDef.required && <span className="text-red-500">*</span>}
//                     </label>
//                     <textarea
//                       id={field.id}
//                       value={formValues[field.id] || ""}
//                       onChange={(e) => handleChange(field.id, e.target.value)}
//                       className={`mt-1 block w-full px-3 py-2 border ${
//                         isError ? "border-red-500" : "border-gray-300"
//                       } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base`}
//                       rows={4}
//                       disabled={loading}
//                     />
//                   </div>
//                 ) : fieldDef.type === "select" ? (
//                   <FormControl fullWidth error={isError}>
//                     <InputLabel>{fieldDef.label}</InputLabel>
//                     <Select
//                       id={field.id}
//                       value={formValues[field.id] || ""}
//                       onChange={(e) => handleChange(field.id, e.target.value)}
//                       label={fieldDef.label}
//                       disabled={loading}
//                     >
//                       <MenuItem value="">
//                         <em>Select {fieldDef.label}</em>
//                       </MenuItem>
//                       {(selectOptions[field.id] || []).map((option) => (
//                         <MenuItem key={option} value={option}>
//                           {option}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 ) : (
//                   <Input
//                     type={fieldDef.type}
//                     label={
//                       <>
//                         {fieldDef.label}
//                         {fieldDef.required && <span className="text-red-500">*</span>}
//                       </>
//                     }
//                     value={formValues[field.id] || ""}
//                     onChange={(e) => handleChange(field.id, e.target.value)}
//                     error={isError}
//                     disabled={loading}
//                     className="w-full"
//                   />
//                 )}
//                 {isError && (
//                   <p className="mt-1 text-sm text-red-500">{errors[field.id]}</p>
//                 )}
//               </div>
//             );
//           })}
//           {submitError && (
//             <p className="text-sm text-red-500">{submitError}</p>
//           )}
//           <div className="flex justify-end">
//             <Button
//               type="submit"
//               color="blue"
//               disabled={loading}
//               className={loading ? "opacity-50 cursor-not-allowed" : ""}
//             >
//               {loading ? "Submitting..." : "Submit"}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SubmitEnquiryForm;


import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../config/firebase";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { allEnquiryFields } from "./enquiryFields.jsx";
import { Button, Input } from "@material-tailwind/react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const SubmitEnquiryForm = () => {
  const { formId } = useParams();
  const [formData, setFormData] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Sample options for select fields, matching FormViewer.js fallback
  const selectOptions = {
    country: ["India", "USA", "UK", "Canada", "Australia"],
    gender: ["Male", "Female", "Prefer not to disclose"],
    studentType: ["School", "College", "Professional"],
    graduationStream: ["Science", "Commerce", "Arts", "Engineering"],
    branch: ["Main Branch", "City Branch", "Online"],
    course: ["Computer Science", "Business Studies", "Mathematics"],
    source: ["Website", "Referral", "Advertisement"],
    assignTo: ["Admissions Team", "Counselor A", "Counselor B"],
    degree: ["Bachelors", "Masters", "Diploma"],
    stage: ["prequalified", "qualified", "negotiation", "closed won", "closed lost", "contact in future"],
  };

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const formRef = doc(db, "enquiryForms", formId);
        const formSnap = await getDoc(formRef);
        if (formSnap.exists()) {
          setFormData(formSnap.data());
          // Initialize form values with default values
          const initialValues = {};
          formSnap.data().fields.forEach((field) => {
            initialValues[field.id] = field.defaultValue || "";
          });
          setFormValues(initialValues);
        } else {
          setSubmitError("Form not found");
        }
      } catch (err) {
        setSubmitError(`Error fetching form: ${err.message}`);
      }
    };
    fetchForm();
  }, [formId]);

  const handleChange = (fieldId, value) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const flatFields = allEnquiryFields.flatMap((category) => category.fields);
    formData.fields.forEach((field) => {
      const fieldDef = flatFields.find((f) => f.id === field.id);
      if (fieldDef?.required && !formValues[field.id]?.trim()) {
        newErrors[field.id] = `${fieldDef.label} is required`;
      }
      if (fieldDef?.type === "email" && formValues[field.id]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formValues[field.id])) {
          newErrors[field.id] = "Invalid email format";
        }
      }
      if (fieldDef?.type === "number" && formValues[field.id] && isNaN(formValues[field.id])) {
        newErrors[field.id] = `${fieldDef.label} must be a number`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      setLoading(true);
      setSubmitError(null);
      const enquiryData = {
        formId,
        ...formValues,
        status: formValues.stage || "prequalified",
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, "enquiries"), enquiryData);
      setSubmitted(true);
      setFormValues({});
    } catch (err) {
      setSubmitError(`Error submitting enquiry: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (submitError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
          <h2 className="text-xl font-semibold text-red-600">{submitError}</h2>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
          <h2 className="text-xl font-semibold">Loading...</h2>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
          <h2 className="text-xl font-semibold text-green-600">Enquiry Submitted Successfully!</h2>
          <p className="mt-2 text-gray-600">Thank you for your submission.</p>
          <Button
            color="blue"
            className="mt-4"
            onClick={() => {
              setSubmitted(false);
              setFormValues(
                formData.fields.reduce((acc, field) => {
                  acc[field.id] = field.defaultValue || "";
                  return acc;
                }, {})
              );
            }}
          >
            Submit Another
          </Button>
        </div>
      </div>
    );
  }

  const flatFields = allEnquiryFields.flatMap((category) => category.fields);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl w-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">{formData.name}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {formData.fields.map((field) => {
            const fieldDef = flatFields.find((f) => f.id === field.id);
            if (!fieldDef) return null;

            const isError = !!errors[field.id];

            return (
              <div key={field.id}>
                {fieldDef.type === "textarea" ? (
                  <div>
                    <label
                      htmlFor={field.id}
                      className="block text-gray-700 text-sm font-medium mb-2"
                    >
                      {fieldDef.label}
                      {fieldDef.required && <span className="text-red-500">*</span>}
                    </label>
                    <textarea
                      id={field.id}
                      value={formValues[field.id] || ""}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      className={`w-full px-3 py-2 border ${
                        isError ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      rows={4}
                      disabled={loading}
                    />
                  </div>
                ) : fieldDef.type === "select" ? (
                  <FormControl fullWidth error={isError}>
                    <InputLabel>{fieldDef.label}</InputLabel>
                    <Select
                      id={field.id}
                      value={formValues[field.id] || ""}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      label={fieldDef.label}
                      disabled={loading}
                    >
                      <MenuItem value="">
                        <em>Select {fieldDef.label}</em>
                      </MenuItem>
                      {(selectOptions[field.id] || ["Option 1", "Option 2"]).map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <div>
                    <label
                      htmlFor={field.id}
                      className="block text-gray-700 text-sm font-medium mb-2"
                    >
                      {fieldDef.label}
                      {fieldDef.required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type={fieldDef.type}
                      id={field.id}
                      value={formValues[field.id] || ""}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      className={`w-full px-3 py-2 border ${
                        isError ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      disabled={loading}
                    />
                  </div>
                )}
                {isError && (
                  <p className="mt-1 text-sm text-red-500">{errors[field.id]}</p>
                )}
              </div>
            );
          })}
          {submitError && (
            <p className="text-sm text-red-500">{submitError}</p>
          )}
          <div className="flex justify-end">
            <Button
              type="submit"
              color="blue"
              disabled={loading}
              className={loading ? "opacity-50 cursor-not-allowed" : ""}
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitEnquiryForm;